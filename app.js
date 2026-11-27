/* ============================================================
   IRONRIDGE UNIVERSITY — app engine
   Login, progress tracking, sequential unlocks, quizzes, exam,
   certificate, trainer tools. No dependencies; runs from file://.

   Optional Google Sheet sync: paste the Apps Script /exec URL below
   after deploying apps-script/Code.gs. Empty keeps this device only.
   Steps are in apps-script/SETUP.md.
   ============================================================ */

/* Paste the Apps Script web app URL (the one ending in /exec). */
const SYNC_URL = "";

(function () {
  "use strict";

  var LS_KEY = "iru_progress_v1";
  var QUEUE_KEY = "iru_sync_queue_v1";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- progress store ---------- */
  function loadStore() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveStore(store) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(store)); }
    catch (e) { toast("Could not save progress — private browsing may block it.", false); }
  }
  function repKey(name) { return name.trim().toLowerCase(); }
  function getRep(store, name) {
    var k = repKey(name);
    if (!store[k]) store[k] = { completed: {}, quiz: {}, examPassed: false, lastActive: null };
    ensureRepShape(store[k], name);
    return store[k];
  }
  function ensureRepShape(rep, name) {
    if (!rep.completed) rep.completed = {};
    if (!rep.quiz) rep.quiz = {};
    if (!rep.lessonTime) rep.lessonTime = {};
    if (!rep.opened) rep.opened = {};
    if (!rep.coursesCompleted) rep.coursesCompleted = {};
    if (rep.examPassed !== true) rep.examPassed = false;
    if (!rep.firstSeen) rep.firstSeen = rep.lastActive || new Date().toISOString();
    if (name && !rep.displayName) rep.displayName = name;
    Object.keys(rep.completed).forEach(function (id) {
      if (!rep.opened[id]) {
        var ts = rep.completed[id];
        rep.opened[id] = typeof ts === "number" ? new Date(ts).toISOString() : new Date().toISOString();
      }
    });
    Object.keys(rep.quiz).forEach(function (id) {
      var q = rep.quiz[id];
      if (q && q.attempts == null) q.attempts = q.passed ? 1 : 0;
    });
    return rep;
  }
  function persist(quiet) {
    if (!session.rep) return;
    session.rep.lastActive = new Date().toISOString();
    if (quiet) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(session.store)); }
      catch (e) {}
      return;
    }
    saveStore(session.store);
  }

  /* ---------- sheet sync (no-op while SYNC_URL is empty) ---------- */
  function syncUrl() {
    return typeof SYNC_URL === "string" ? SYNC_URL.trim() : "";
  }
  var syncState = { sending: false, again: false, timer: null, dirty: false, heldName: null, heldRep: null };
  var feedbackWaiters = {};
  var tick = { lessonId: null, started: 0 };
  var lastVideoSent = 0;

  function newId() {
    return "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
  function loadQueue() {
    try {
      var q = JSON.parse(localStorage.getItem(QUEUE_KEY));
      if (!q || !Array.isArray(q.items)) return { items: [] };
      return q;
    } catch (e) { return { items: [] }; }
  }
  function saveQueue(q) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); }
    catch (e) {}
  }
  function dropQueueIds(ids) {
    if (!ids || !ids.length) return;
    var q = loadQueue();
    q.items = q.items.filter(function (item) { return ids.indexOf(item.id) === -1; });
    saveQueue(q);
  }
  function postJson(payload) {
    return fetch(syncUrl(), {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (!r.ok) throw new Error("sync http");
      return r.text();
    }).then(function (text) {
      var data = JSON.parse(text);
      if (!data || data.ok === false) throw new Error("sync rejected");
      return data;
    });
  }
  function activeName() {
    return session.repName || syncState.heldName || "";
  }
  function activeRep() {
    return session.rep || syncState.heldRep || null;
  }
  function courseOutline() {
    return IRU_COURSES.map(function (c) {
      var expected = 0;
      var lessons = c.lessons.map(function (l) {
        expected += l.minutes || 0;
        return { id: l.id, type: l.type, title: l.title };
      });
      return { id: c.id, title: c.title, expectedMinutes: expected, lessons: lessons };
    });
  }
  function queueEvent(fields, immediate) {
    if (!syncUrl() || !session.repName) return;
    var item = {
      id: newId(),
      kind: "event",
      name: session.repName,
      event: {
        eventId: newId(),
        type: fields.type,
        name: session.repName,
        displayName: session.repName,
        courseId: fields.courseId || "",
        lessonId: fields.lessonId || "",
        secondsSpent: fields.secondsSpent == null ? 0 : Math.round(fields.secondsSpent),
        score: fields.score == null ? "" : fields.score,
        attempts: fields.attempts == null ? "" : fields.attempts,
        passed: fields.passed == null ? "" : !!fields.passed,
        expectedMinutes: fields.expectedMinutes == null ? "" : fields.expectedMinutes,
        lessonIds: fields.lessonIds || null,
        prereqs: fields.prereqs || null,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent || ""
      }
    };
    var q = loadQueue();
    q.items.push(item);
    if (q.items.length > 300) q.items = q.items.slice(q.items.length - 300);
    saveQueue(q);
    scheduleFlush(!!immediate);
  }
  function sendFeedback(message) {
    var name = session.repName;
    var c = session.courseIdx != null ? course(session.courseIdx) : null;
    var l = (c && session.lessonIdx != null) ? lesson(session.courseIdx, session.lessonIdx) : null;
    var item = {
      id: newId(),
      kind: "feedback",
      name: name,
      feedback: {
        action: "feedback",
        secret: IRU_CONFIG.accessCode,
        name: name,
        courseId: c ? c.id : "",
        lessonId: l ? l.id : "",
        courseTitle: c ? c.title : "",
        lessonTitle: l ? l.title : "",
        message: message
      }
    };
    var q = loadQueue();
    q.items.push(item);
    saveQueue(q);
    scheduleFlush(true);
    return new Promise(function (resolve) { feedbackWaiters[item.id] = resolve; });
  }
  function settleFeedback(id, ok) {
    var fn = feedbackWaiters[id];
    if (!fn) return;
    delete feedbackWaiters[id];
    fn(ok);
  }
  function scheduleFlush(immediate) {
    if (!syncUrl()) return;
    if (immediate) {
      if (syncState.timer) { clearTimeout(syncState.timer); syncState.timer = null; }
      flushQueue();
      return;
    }
    if (syncState.timer || syncState.sending) return;
    syncState.timer = setTimeout(function () {
      syncState.timer = null;
      flushQueue();
    }, 20000);
  }
  function flushQueue() {
    if (!syncUrl()) return;
    var name = activeName();
    if (!name && !syncState.heldName) {
      var q0 = loadQueue();
      var pending = null;
      q0.items.forEach(function (item) { if (!pending && item.name) pending = item.name; });
      if (!pending) return;
      syncState.heldName = pending;
      name = pending;
    }
    if (!name) return;
    if (syncState.sending) { syncState.again = true; return; }

    var q = loadQueue();
    var events = [];
    var feedback = [];
    q.items.forEach(function (item) {
      if (item.name && item.name !== name) return;
      if (item.kind === "feedback") feedback.push(item);
      else events.push(item);
    });
    var rep = activeRep();
    var sendProgress = !!rep && (events.length > 0 || syncState.dirty || syncState.heldRep);
    if (!events.length && !feedback.length && !sendProgress) return;

    syncState.sending = true;
    var eventIds = events.map(function (item) { return item.id; });
    var chain;
    if (events.length || sendProgress) {
      var progress = null;
      if (sendProgress && rep) {
        progress = JSON.parse(JSON.stringify(rep));
        progress.displayName = name;
      }
      chain = postJson({
        action: "sync",
        secret: IRU_CONFIG.accessCode,
        name: name,
        userAgent: navigator.userAgent || "",
        progress: progress,
        outline: courseOutline(),
        events: events.map(function (item) { return item.event; })
      }).then(function (data) {
        dropQueueIds(eventIds);
        if (name === session.repName) syncState.dirty = false;
        if (data && data.progress && name === session.repName) applyRemote(data.progress);
      });
    } else {
      chain = Promise.resolve();
    }

    chain.then(function () {
      return sendFeedbackItems(feedback);
    }).catch(function () {
      feedback.forEach(function (item) { settleFeedback(item.id, false); });
    }).then(function () {
      syncState.sending = false;
      if (syncState.again) {
        syncState.again = false;
        flushQueue();
      }
      if (!syncState.sending && !session.repName) {
        syncState.heldName = null;
        syncState.heldRep = null;
      }
    });
  }
  function sendFeedbackItems(items) {
    var index = 0;
    function next() {
      if (index >= items.length) return Promise.resolve();
      var item = items[index++];
      return postJson(item.feedback).then(function () {
        dropQueueIds([item.id]);
        settleFeedback(item.id, true);
        return next();
      }).catch(function () {
        settleFeedback(item.id, false);
        for (var i = index; i < items.length; i++) settleFeedback(items[i].id, false);
      });
    }
    return next();
  }
  function earlierIso(a, b) {
    if (!a) return b || null;
    if (!b) return a || null;
    return String(a) <= String(b) ? a : b;
  }
  function laterIso(a, b) {
    if (!a) return b || null;
    if (!b) return a || null;
    return String(a) >= String(b) ? a : b;
  }
  function mergeRep(a, b) {
    ensureRepShape(a || {});
    ensureRepShape(b || {});
    var out = {
      completed: {},
      quiz: {},
      examPassed: !!(a.examPassed || b.examPassed),
      lastActive: laterIso(a.lastActive, b.lastActive),
      firstSeen: earlierIso(a.firstSeen, b.firstSeen),
      lessonTime: {},
      opened: {},
      coursesCompleted: {},
      displayName: b.displayName || a.displayName || ""
    };
    function keysOf(obj) {
      var map = {};
      if (obj) Object.keys(obj).forEach(function (k) { map[k] = true; });
      return map;
    }
    var ck = keysOf(a.completed); Object.keys(b.completed || {}).forEach(function (k) { ck[k] = true; });
    Object.keys(ck).forEach(function (id) {
      var av = a.completed[id], bv = b.completed[id];
      if (av == null) out.completed[id] = bv;
      else if (bv == null) out.completed[id] = av;
      else out.completed[id] = Math.min(Number(av), Number(bv));
    });
    var tk = keysOf(a.lessonTime); Object.keys(b.lessonTime || {}).forEach(function (k) { tk[k] = true; });
    Object.keys(tk).forEach(function (id) {
      out.lessonTime[id] = Math.max(Number(a.lessonTime[id] || 0), Number(b.lessonTime[id] || 0));
    });
    function mergeIso(into, left, right) {
      var mk = keysOf(left); Object.keys(right || {}).forEach(function (k) { mk[k] = true; });
      Object.keys(mk).forEach(function (id) {
        into[id] = earlierIso(left && left[id], right && right[id]);
      });
    }
    mergeIso(out.opened, a.opened, b.opened);
    mergeIso(out.coursesCompleted, a.coursesCompleted, b.coursesCompleted);
    var qk = keysOf(a.quiz); Object.keys(b.quiz || {}).forEach(function (k) { qk[k] = true; });
    Object.keys(qk).forEach(function (id) {
      var av = a.quiz[id] || {}, bv = b.quiz[id] || {};
      out.quiz[id] = {
        best: Math.max(Number(av.best || 0), Number(bv.best || 0)),
        total: Math.max(Number(av.total || 0), Number(bv.total || 0)),
        passed: !!(av.passed || bv.passed),
        attempts: Math.max(Number(av.attempts || 0), Number(bv.attempts || 0))
      };
    });
    ensureRepShape(out, out.displayName);
    return out;
  }
  function applyRemote(progress) {
    if (!session.rep || !session.repName || !progress) return;
    session.rep = mergeRep(session.rep, progress);
    session.rep.displayName = session.repName;
    session.store[repKey(session.repName)] = session.rep;
    persist(true);
    if (!$("catalogView").hidden) showCatalog();
    else if (!$("courseView").hidden && session.courseIdx != null) renderCourseChrome();
  }
  function pullRemote() {
    if (!syncUrl() || !session.repName) return;
    var name = session.repName;
    postJson({ action: "load", secret: IRU_CONFIG.accessCode, name: name }).then(function (data) {
      if (session.repName !== name) return;
      if (data && data.progress) applyRemote(data.progress);
      queueEvent({ type: "login", secondsSpent: 0 }, true);
    }).catch(function () {
      if (session.repName !== name) return;
      queueEvent({ type: "login", secondsSpent: 0 }, true);
    });
  }
  function commitTick() {
    if (!session.rep || !tick.lessonId || !tick.started) return;
    var add = (Date.now() - tick.started) / 1000;
    tick.started = document.hidden ? 0 : Date.now();
    if (!(add > 0) || add >= 300) return;
    if (!session.rep.lessonTime) session.rep.lessonTime = {};
    tick.lessonId && (session.rep.lessonTime[tick.lessonId] = (session.rep.lessonTime[tick.lessonId] || 0) + add);
  }
  function pauseLessonTimer(opts) {
    opts = opts || {};
    var had = !!tick.started;
    commitTick();
    tick.lessonId = null;
    tick.started = 0;
    if (!had) return;
    persist(true);
    if (syncUrl() && !opts.silent) {
      syncState.dirty = true;
      scheduleFlush(false);
    } else if (syncUrl()) {
      syncState.dirty = true;
    }
  }
  function visibleSeconds(lessonId) {
    commitTick();
    return Math.round((session.rep.lessonTime && session.rep.lessonTime[lessonId]) || 0);
  }
  function prereqsBefore(ci, li) {
    var list = [];
    for (var i = 0; i < li; i++) {
      var item = lesson(ci, i);
      if (item.type === "quiz") continue;
      list.push({ id: item.id, type: item.type, title: item.title });
    }
    return list;
  }
  function maybeCourseComplete() {
    var ci = session.courseIdx;
    if (ci == null || !session.rep || !isCourseDone(ci)) return;
    var c = course(ci);
    if (!session.rep.coursesCompleted) session.rep.coursesCompleted = {};
    if (session.rep.coursesCompleted[c.id]) return;
    var ids = [];
    var expected = 0;
    c.lessons.forEach(function (item) {
      ids.push(item.id);
      expected += item.minutes || 0;
    });
    var seconds = 0;
    ids.forEach(function (id) { seconds += Math.round((session.rep.lessonTime && session.rep.lessonTime[id]) || 0); });
    session.rep.coursesCompleted[c.id] = new Date().toISOString();
    persist();
    queueEvent({
      type: "course_complete",
      courseId: c.id,
      secondsSpent: seconds,
      expectedMinutes: expected,
      lessonIds: ids
    }, true);
  }
  function maybeVideoProgress() {
    if (!syncUrl() || session.courseIdx == null || session.lessonIdx == null) return;
    var l = lesson(session.courseIdx, session.lessonIdx);
    if (!l || l.type !== "video") return;
    var now = Date.now();
    if (now - lastVideoSent < 60000) return;
    lastVideoSent = now;
    queueEvent({
      type: "video_progress",
      courseId: course(session.courseIdx).id,
      lessonId: l.id,
      secondsSpent: Math.round((session.rep.lessonTime && session.rep.lessonTime[l.id]) || 0)
    }, false);
  }

  var session = { repName: null, rep: null, store: null, isTrainer: false,
                  courseIdx: null, lessonIdx: null, showAnswers: false };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function toast(msg, good) {
    var t = document.createElement("div");
    t.className = "toast" + (good === false ? " toast-bad" : "");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("show"); }, 10);
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.remove(); }, 400);
    }, 4200);
  }
  function course(cIdx) { return IRU_COURSES[cIdx]; }
  function lesson(cIdx, lIdx) { return IRU_COURSES[cIdx].lessons[lIdx]; }
  function isLessonDone(cIdx, lIdx) {
    var l = lesson(cIdx, lIdx);
    if (l.type === "quiz") {
      var q = session.rep.quiz[l.id];
      return !!q && q.passed;
    }
    return !!session.rep.completed[l.id];
  }
  function courseLessonsDone(cIdx) {
    var done = 0;
    course(cIdx).lessons.forEach(function (l, i) { if (isLessonDone(cIdx, i)) done++; });
    return done;
  }
  function isCourseDone(cIdx) { return courseLessonsDone(cIdx) === course(cIdx).lessons.length; }
  function isCourseUnlocked(cIdx) {
    if (cIdx === 0) return true;
    return isCourseDone(cIdx - 1);
  }
  function isLessonUnlocked(cIdx, lIdx) {
    if (lIdx === 0) return isCourseUnlocked(cIdx);
    return isLessonDone(cIdx, lIdx - 1);
  }
  function totalLessons() {
    var n = 0; IRU_COURSES.forEach(function (c) { n += c.lessons.length; }); return n;
  }
  function totalDone() {
    var n = 0;
    IRU_COURSES.forEach(function (c, ci) { c.lessons.forEach(function (l, li) { if (isLessonDone(ci, li)) n++; }); });
    return n;
  }

  /* ---------- login ---------- */
  function tryLogin() {
    var name = $("loginName").value.trim();
    var code = $("loginCode").value;
    if (!name) { $("loginError").textContent = "Enter your name."; $("loginError").hidden = false; return; }
    if (code !== IRU_CONFIG.accessCode) {
      $("loginError").textContent = "Wrong access code. Check with your trainer.";
      $("loginError").hidden = false; return;
    }
    session.store = loadStore();
    session.repName = name;
    session.rep = getRep(session.store, name);
    session.rep.displayName = name;
    syncState.heldName = null;
    syncState.heldRep = null;
    session.isTrainer = IRU_CONFIG.trainers.some(function (t) { return repKey(t) === repKey(name); });
    persist();
    $("loginScreen").style.display = "none";
    $("app").hidden = false;
    $("userGreeting").textContent = name + (session.isTrainer ? " · Trainer" : "");
    showCatalog();
    pullRemote();
  }
  function logout() {
    pauseLessonTimer({ silent: true });
    persist();
    if (syncUrl() && session.rep) {
      syncState.heldName = session.repName;
      syncState.heldRep = JSON.parse(JSON.stringify(session.rep));
      syncState.dirty = true;
      flushQueue();
    }
    $("app").hidden = true;
    $("loginScreen").style.display = "";
    $("loginName").value = ""; $("loginCode").value = "";
    $("loginError").hidden = true;
    session.repName = null; session.rep = null;
  }

  /* ---------- catalog ---------- */
  function showCatalog() {
    pauseLessonTimer();
    $("catalogView").hidden = false;
    $("courseView").hidden = true;
    $("certView").hidden = true;
    var done = totalDone(), total = totalLessons();
    $("welcomeTitle").textContent = (done === 0 ? "Welcome to IronRidge University, " : "Welcome back, ") + session.repName.split(" ")[0];
    $("welcomeSub").textContent = done === 0
      ? "Work the courses in order. Each quiz gates the next course."
      : done + " of " + total + " lessons complete" + (session.rep.examPassed ? " — CERTIFIED." : ".");
    $("overallProgress").textContent = "Overall: " + done + " / " + total;

    var grid = $("courseGrid");
    grid.innerHTML = "";
    IRU_COURSES.forEach(function (c, ci) {
      var unlocked = isCourseUnlocked(ci);
      var complete = isCourseDone(ci);
      var ldone = courseLessonsDone(ci), ltot = c.lessons.length;
      var pct = Math.round(100 * ldone / ltot);
      var card = document.createElement("div");
      card.className = "course-card" + (unlocked ? "" : " locked") + (complete ? " done" : "");
      card.innerHTML =
        '<div class="cc-badge">' + (complete ? "✅" : unlocked ? "" : "🔒") + "</div>" +
        '<div class="cc-num">' + c.num + "</div>" +
        "<h3>" + esc(c.title) + "</h3>" +
        "<p>" + esc(c.desc) + "</p>" +
        '<div class="cc-meta"><span>' + ltot + " lessons</span><span>" + (complete ? "Complete" : unlocked ? pct + "%" : "Locked") + "</span></div>" +
        '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
      if (unlocked) card.addEventListener("click", function () { openCourse(ci); });
      grid.appendChild(card);
    });

    var foot = $("catalogFoot");
    foot.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "foot-actions";
    var exportBtn = document.createElement("button");
    exportBtn.className = "btn btn-ghost btn-sm";
    exportBtn.textContent = "Copy progress report (send to Shane)";
    exportBtn.addEventListener("click", exportProgress);
    wrap.appendChild(exportBtn);
    if (session.isTrainer) {
      var keyBtn = document.createElement("span");
      keyBtn.className = "muted";
      keyBtn.style.fontSize = ".8rem";
      keyBtn.textContent = "Trainer: correct answers are shown inline while grading quizzes.";
      wrap.appendChild(keyBtn);
      if (syncUrl()) {
        var sheetNote = document.createElement("span");
        sheetNote.className = "muted";
        sheetNote.style.fontSize = ".8rem";
        sheetNote.textContent = "Full progress for every rep lives in the Google Sheet.";
        wrap.appendChild(sheetNote);
      }
    }
    foot.appendChild(wrap);
  }

  function exportProgress() {
    var lines = ["IronRidge University — progress for " + session.repName];
    IRU_COURSES.forEach(function (c, ci) {
      var ldone = courseLessonsDone(ci), ltot = c.lessons.length;
      lines.push("Course " + c.num + " — " + c.title + ": " + ldone + "/" + ltot + (isCourseDone(ci) ? " (complete)" : ""));
      c.lessons.forEach(function (l, li) {
        if (l.type === "quiz" && session.rep.quiz[l.id]) {
          var q = session.rep.quiz[l.id];
          lines.push("   ↳ " + l.title + ": best " + q.best + "/" + q.total + (q.passed ? " PASSED" : " not passed"));
        }
      });
    });
    if (session.rep.examPassed) lines.push("CERTIFICATION EXAM: PASSED");
    var text = lines.join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast("Progress report copied — paste it into a text to Shane.");
      }, function () { showExportBox(text); });
    } else showExportBox(text);
  }
  function showExportBox(text) {
    var box = document.createElement("textarea");
    box.className = "export-box"; box.value = text; box.readOnly = true;
    $("catalogFoot").appendChild(box);
    box.focus(); box.select();
  }

  /* ---------- course player ---------- */
  function openCourse(ci) {
    session.courseIdx = ci;
    // open at the first lesson not yet done (or lesson 0 if all done)
    var li = -1;
    course(ci).lessons.forEach(function (l, i) { if (li === -1 && !isLessonDone(ci, i)) li = i; });
    if (li === -1) li = 0;
    session.lessonIdx = null;
    $("catalogView").hidden = true;
    $("certView").hidden = true;
    $("courseView").hidden = false;
    renderCourseChrome();
    openLesson(Math.max(0, li === 0 ? 0 : li));
  }
  function renderCourseChrome() {
    var c = course(session.courseIdx);
    $("courseKicker").textContent = "Course " + c.num + (c.exam ? " · Final" : "");
    $("courseTitle").textContent = c.title;
    $("courseDesc").textContent = c.desc;
    var ldone = courseLessonsDone(session.courseIdx), ltot = c.lessons.length;
    $("courseProgressLabel").textContent = ldone + " of " + ltot + " lessons";
    $("courseProgressFill").style.width = Math.round(100 * ldone / ltot) + "%";
    renderLessonNav();
  }
  function renderLessonNav() {
    var nav = $("lessonNav");
    nav.innerHTML = "";
    course(session.courseIdx).lessons.forEach(function (l, li) {
      var unlocked = isLessonUnlocked(session.courseIdx, li);
      var done = isLessonDone(session.courseIdx, li);
      var item = document.createElement("div");
      item.className = "lnav-item" + (li === session.lessonIdx ? " active" : "") + (done ? " done" : "") + (unlocked ? "" : " locked");
      var ico = done ? "✓" : unlocked ? (l.type === "quiz" ? "✎" : l.type === "video" ? "▶" : "•") : "🔒";
      item.innerHTML = '<span class="lnav-ico">' + ico + "</span><span>" + esc(l.title) + (l.minutes ? ' <span style="color:#999">· ' + l.minutes + "m</span>" : "") + "</span>";
      if (unlocked) item.addEventListener("click", function () { openLesson(li); });
      nav.appendChild(item);
    });
  }

  function openLesson(li) {
    pauseLessonTimer();
    session.lessonIdx = li;
    var c = course(session.courseIdx), l = lesson(session.courseIdx, li);
    if (!session.rep.opened[l.id]) session.rep.opened[l.id] = new Date().toISOString();
    tick.lessonId = l.id;
    tick.started = document.hidden ? 0 : Date.now();
    lastVideoSent = 0;
    queueEvent({
      type: "lesson_open",
      courseId: c.id,
      lessonId: l.id,
      secondsSpent: Math.round((session.rep.lessonTime && session.rep.lessonTime[l.id]) || 0)
    }, true);
    $("lessonKicker").textContent = "Course " + c.num + " · Lesson " + (li + 1) + " of " + c.lessons.length;
    $("lessonTitle").textContent = l.title;
    session.showAnswers = false;
    renderLessonBody(l);
    renderLessonNav();
    renderCourseChrome();
    window.scrollTo(0, 0);
  }

  function renderLessonBody(l) {
    var body = $("lessonBody");
    var status = $("lessonStatus");
    var prev = $("prevBtn"), next = $("nextBtn");
    prev.disabled = session.lessonIdx === 0;
    prev.onclick = function () { openLesson(session.lessonIdx - 1); };
    prev.textContent = "← Previous";

    if (l.type === "lesson") {
      body.innerHTML = l.body;
      var done = !!session.rep.completed[l.id];
      status.textContent = done ? "✓ Completed" : "";
      status.className = "lesson-status" + (done ? " passed" : "");
      next.textContent = done ? "Next →" : "Mark complete →";
      next.className = "btn " + (done ? "btn-primary" : "btn-green");
      next.disabled = false;
      next.onclick = function () {
        if (!done) {
          var seconds = visibleSeconds(l.id);
          session.rep.completed[l.id] = Date.now();
          persist();
          queueEvent({
            type: "lesson_complete",
            courseId: course(session.courseIdx).id,
            lessonId: l.id,
            secondsSpent: seconds
          }, true);
          maybeCourseComplete();
        }
        advance();
      };
    }

    else if (l.type === "video") {
      var v = IRU_VIDEOS[l.video];
      var watched = !!session.rep.completed[l.id];
      var html = "";
      if (v && (v.yt || v.loom)) {
        var srcUrl = v.loom
          ? "https://www.loom.com/embed/" + v.loom
          : "https://www.youtube-nocookie.com/embed/" + v.yt + "?rel=0";
        html += '<div class="video-wrap"><iframe src="' + srcUrl + '" title="' + esc(v.label) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>';
      } else {
        html += '<div class="video-placeholder"><div class="vp-ico">🎥</div><h4>' + esc(v ? v.label : l.title) + "</h4>" +
                "<p>This screen recording from Shane is coming soon. " + esc(v && v.record ? "" : "") + "</p>" +
                (v && v.record ? '<p style="margin-top:8px;color:#9E2A2B"><b>Shane — recording note:</b> ' + esc(v.record) + "</p>" : "") +
                "</div>";
      }
      html += '<div class="watch-note"><b>What to watch for:</b> ' + l.why + "</div>";
      body.innerHTML = html;
      status.textContent = watched ? "✓ Watched" : "";
      status.className = "lesson-status" + (watched ? " passed" : "");
      next.textContent = watched ? "Next →" : "Mark watched →";
      next.className = "btn " + (watched ? "btn-primary" : "btn-green");
      next.disabled = false;
      next.onclick = function () {
        if (!watched) {
          var seconds = visibleSeconds(l.id);
          session.rep.completed[l.id] = Date.now();
          persist();
          queueEvent({
            type: "video_watched",
            courseId: course(session.courseIdx).id,
            lessonId: l.id,
            secondsSpent: seconds
          }, true);
          maybeCourseComplete();
        }
        advance();
      };
    }

    else if (l.type === "quiz") {
      renderQuiz(l, body, status, next);
    }
  }

  function advance() {
    var c = course(session.courseIdx);
    if (session.lessonIdx + 1 < c.lessons.length) openLesson(session.lessonIdx + 1);
    else {
      renderCourseChrome();
      if (isCourseDone(session.courseIdx)) {
        if (c.exam) { showCertificate(); return; }
        toast("Course " + c.num + " complete! Course " + (c.num + 1) + " is now unlocked.");
      }
      showCatalog();
    }
  }

  /* ---------- quiz ---------- */
  function renderQuiz(l, body, status, next) {
    var isExam = !!l.exam;
    var passPct = l.passPct || IRU_CONFIG.passPctDefault;
    var passCount = isExam ? IRU_CONFIG.examPassCount : Math.ceil(passPct / 100 * l.questions.length);
    var qState = session.rep.quiz[l.id];
    var passed = qState && qState.passed;

    next.textContent = passed ? "Next →" : "Answer all questions, then grade";
    next.className = "btn " + (passed ? "btn-primary" : "btn-ghost");
    next.disabled = !passed;
    next.onclick = function () { advance(); };
    status.textContent = passed ? "✓ Passed — best " + qState.best + "/" + qState.total : "";
    status.className = "lesson-status" + (passed ? " passed" : "");

    // shuffle questions and choices
    var qs = l.questions.map(function (q) {
      var order = q.choices.map(function (_, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = order[i]; order[i] = order[j]; order[j] = t;
      }
      return { text: q.q, why: q.why,
              choices: order.map(function (oi) { return q.choices[oi]; }),
              a: order.indexOf(q.a) };
    });
    for (var s = qs.length - 1; s > 0; s--) {
      var r = Math.floor(Math.random() * (s + 1));
      var tmp = qs[s]; qs[s] = qs[r]; qs[r] = tmp;
    }

    var html = "";
    if (isExam) html += '<div class="callout"><b>Certification Exam:</b> ' + qs.length + " questions. Pass with " + passCount + " of " + qs.length + ". It reshuffles every attempt.</div>";
    else html += '<div class="callout"><b>Quiz:</b> pass with ' + passCount + " of " + qs.length + " (retakes allowed, answers reshuffle).</div>";

    html += '<div id="quizList">';
    qs.forEach(function (q, qi) {
      html += '<div class="quiz-q" data-qi="' + qi + '"><div class="q-text">' + (qi + 1) + ". " + esc(q.text) + "</div>";
      q.choices.forEach(function (ch, ci) {
        html += '<button class="quiz-choice" data-qi="' + qi + '" data-ci="' + ci + '">' + esc(ch) + "</button>";
      });
      html += '<div class="q-why" hidden></div></div>';
    });
    html += "</div>";
    html += '<div class="lesson-actions" style="border:none;padding-top:4px"><button id="gradeBtn" class="btn btn-primary" disabled>Grade my answers</button>' +
            (session.isTrainer ? ' <button id="keyBtn" class="btn btn-ghost btn-sm">Trainer: show answer key</button>' : "") + "</div>";
    html += '<div id="quizResult"></div>';
    body.innerHTML = html;

    var answers = {};
    body.querySelectorAll(".quiz-choice").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var qi = btn.getAttribute("data-qi");
        body.querySelectorAll('.quiz-choice[data-qi="' + qi + '"]').forEach(function (b) { b.classList.remove("selected"); });
        btn.classList.add("selected");
        answers[qi] = parseInt(btn.getAttribute("data-ci"), 10);
        $("gradeBtn").disabled = Object.keys(answers).length !== qs.length;
      });
    });
    if (session.isTrainer) {
      var keyBtn = body.querySelector("#keyBtn");
      if (keyBtn) keyBtn.addEventListener("click", function () {
        session.showAnswers = !session.showAnswers;
        body.querySelectorAll(".quiz-q").forEach(function (div, qi) {
          var correct = qs[qi].a;
          var btn = div.querySelector('.quiz-choice[data-ci="' + correct + '"]');
          if (btn) btn.style.outline = session.showAnswers ? "2px solid #2E7D4F" : "";
        });
      });
    }
    $("gradeBtn").addEventListener("click", function () {
      var score = 0;
      body.querySelectorAll(".quiz-q").forEach(function (div, qi) {
        var q = qs[qi];
        var picked = answers[qi];
        div.querySelectorAll(".quiz-choice").forEach(function (btn) {
          var ci = parseInt(btn.getAttribute("data-ci"), 10);
          btn.disabled = true;
          if (ci === q.a) btn.classList.add("correct");
          else if (ci === picked) btn.classList.add("wrong");
          else btn.classList.add("dim");
        });
        if (picked === q.a) score++;
        var why = div.querySelector(".q-why");
        why.hidden = false;
        why.innerHTML = (picked === q.a ? "✓ " : "✗ ") + esc(q.why);
      });
      var ok = score >= passCount;
      var prevQuiz = session.rep.quiz[l.id] || qState || null;
      var attempts = ((prevQuiz && prevQuiz.attempts) || 0) + 1;
      var best = prevQuiz ? Math.max(prevQuiz.best || 0, score) : score;
      session.rep.quiz[l.id] = { best: best, total: qs.length, passed: ok || (prevQuiz && prevQuiz.passed), attempts: attempts };
      if (ok && isExam) session.rep.examPassed = true;
      var quizSeconds = visibleSeconds(l.id);
      persist();
      queueEvent({
        type: "quiz_submit",
        courseId: course(session.courseIdx).id,
        lessonId: l.id,
        secondsSpent: quizSeconds,
        score: score,
        attempts: attempts,
        passed: ok,
        prereqs: prereqsBefore(session.courseIdx, session.lessonIdx)
      }, true);
      if (ok) maybeCourseComplete();

      var res = $("quizResult");
      res.innerHTML = '<div class="quiz-result ' + (ok ? "pass" : "fail") + '">' +
        "<h3>" + (ok ? "PASSED — " + score + " / " + qs.length : "Not yet — " + score + " / " + qs.length) + "</h3>" +
        "<p>" + (ok
          ? (isExam ? "You passed the Certification Exam. Your certificate is ready." : "On to the next lesson.")
          : "You needed " + passCount + ". Review the explanations above and retake — the questions reshuffle.") + "</p>" +
        "</div>" +
        (ok ? "" : '<button id="retryBtn" class="btn btn-primary">Retake quiz</button>');
      var retry = $("retryBtn");
      if (retry) retry.addEventListener("click", function () { renderLessonBody(l); });

      status.textContent = ok ? "✓ Passed — " + best + "/" + qs.length : "";
      status.className = "lesson-status" + (ok ? " passed" : "");
      next.textContent = ok ? (isExam ? "View certificate →" : "Next →") : "Next →";
      next.className = "btn " + (ok ? "btn-primary" : "btn-ghost");
      next.disabled = !ok && !(session.rep.quiz[l.id] && session.rep.quiz[l.id].passed);
      if (ok && isExam) next.onclick = function () { showCertificate(); };
      else if (ok) next.onclick = function () { advance(); };
      renderLessonNav();
    });
  }

  /* ---------- certificate ---------- */
  function showCertificate() {
    pauseLessonTimer();
    $("courseView").hidden = true;
    $("catalogView").hidden = true;
    $("certView").hidden = false;
    var exam = session.rep.quiz["c9exam"] || { best: 0, total: 15 };
    $("certName").textContent = session.repName;
    $("certDate").textContent = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    $("certScore").textContent = exam.best + " / " + exam.total;
    window.scrollTo(0, 0);
  }

  /* ---------- wiring ---------- */
  $("loginBtn").addEventListener("click", tryLogin);
  $("loginCode").addEventListener("keydown", function (e) { if (e.key === "Enter") tryLogin(); });
  $("loginName").addEventListener("keydown", function (e) { if (e.key === "Enter") $("loginCode").focus(); });
  $("logoutBtn").addEventListener("click", logout);
  $("homeBtn").addEventListener("click", showCatalog);
  $("backBtn").addEventListener("click", showCatalog);
  $("printCertBtn").addEventListener("click", function () { window.print(); });
  $("certBackBtn").addEventListener("click", showCatalog);

  if (syncUrl() && $("feedbackBtn")) $("feedbackBtn").hidden = false;
  if ($("feedbackBtn")) {
    $("feedbackBtn").addEventListener("click", function () {
      if (!syncUrl()) return;
      var c = session.courseIdx != null ? course(session.courseIdx) : null;
      var l = (c && session.lessonIdx != null) ? lesson(session.courseIdx, session.lessonIdx) : null;
      $("feedbackContext").textContent = (c ? c.title : "") + (l ? " — " + l.title : "");
      $("feedbackText").value = "";
      $("feedbackModal").hidden = false;
      $("feedbackText").focus();
    });
  }
  if ($("feedbackCancel")) {
    $("feedbackCancel").addEventListener("click", function () { $("feedbackModal").hidden = true; });
  }
  if ($("feedbackSend")) {
    $("feedbackSend").addEventListener("click", function () {
      var message = $("feedbackText").value.trim();
      if (!message || !syncUrl()) return;
      $("feedbackModal").hidden = true;
      $("feedbackText").value = "";
      sendFeedback(message).then(function (ok) {
        toast(ok ? "Thanks — feedback sent." : "Saved on this device. It will send when you're back online.");
      });
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (!tick.lessonId || !session.rep) return;
    if (document.hidden) {
      commitTick();
      tick.started = 0;
      persist(true);
      if (syncUrl()) { syncState.dirty = true; scheduleFlush(false); }
    } else {
      tick.started = Date.now();
    }
  });
  setInterval(function () {
    if (!tick.lessonId || document.hidden || !session.rep) return;
    commitTick();
    persist(true);
    if (!syncUrl()) return;
    syncState.dirty = true;
    scheduleFlush(false);
    maybeVideoProgress();
  }, 15000);
  setInterval(function () {
    if (!syncUrl()) return;
    var q = loadQueue();
    if (session.repName) {
      if ((q.items && q.items.length) || syncState.dirty) scheduleFlush(true);
      return;
    }
    if (q.items && q.items.length) scheduleFlush(true);
  }, 30000);
  window.addEventListener("online", function () { if (syncUrl()) scheduleFlush(true); });
  window.addEventListener("pagehide", function () {
    pauseLessonTimer({ silent: true });
    if (!syncUrl()) return;
    var name = activeName();
    var rep = activeRep();
    if (!name) return;
    var q = loadQueue();
    var events = [];
    var ids = [];
    q.items.forEach(function (item) {
      if (item.kind === "feedback") return;
      if (item.name && item.name !== name) return;
      events.push(item.event);
      ids.push(item.id);
    });
    if (!events.length && !syncState.dirty) return;
    var progress = rep ? JSON.parse(JSON.stringify(rep)) : null;
    if (progress) progress.displayName = name;
    var body = JSON.stringify({
      action: "sync",
      secret: IRU_CONFIG.accessCode,
      name: name,
      userAgent: navigator.userAgent || "",
      progress: progress,
      outline: courseOutline(),
      events: events
    });
    try {
      var blob = new Blob([body], { type: "text/plain;charset=utf-8" });
      if (navigator.sendBeacon && navigator.sendBeacon(syncUrl(), blob)) {
        dropQueueIds(ids);
        syncState.dirty = false;
      }
    } catch (e) {}
  });
})();
