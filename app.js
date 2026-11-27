/* ============================================================
   IRONRIDGE UNIVERSITY — app engine
   Login, progress tracking, sequential unlocks, quizzes, exam,
   certificate, trainer tools. No dependencies; runs from file://.
   ============================================================ */
(function () {
  "use strict";

  var LS_KEY = "iru_progress_v1";
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
    return store[k];
  }
  function persist() {
    session.rep.lastActive = new Date().toISOString();
    saveStore(session.store);
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
    session.isTrainer = IRU_CONFIG.trainers.some(function (t) { return repKey(t) === repKey(name); });
    persist();
    $("loginScreen").style.display = "none";
    $("app").hidden = false;
    $("userGreeting").textContent = name + (session.isTrainer ? " · Trainer" : "");
    showCatalog();
  }
  function logout() {
    persist();
    $("app").hidden = true;
    $("loginScreen").style.display = "";
    $("loginName").value = ""; $("loginCode").value = "";
    $("loginError").hidden = true;
    session.repName = null; session.rep = null;
  }

  /* ---------- catalog ---------- */
  function showCatalog() {
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
    session.lessonIdx = li;
    var c = course(session.courseIdx), l = lesson(session.courseIdx, li);
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
          session.rep.completed[l.id] = Date.now();
          persist();
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
          session.rep.completed[l.id] = Date.now();
          persist();
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
      var best = qState ? Math.max(qState.best, score) : score;
      session.rep.quiz[l.id] = { best: best, total: qs.length, passed: ok || (qState && qState.passed) };
      if (ok && isExam) session.rep.examPassed = true;
      persist();

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
})();
