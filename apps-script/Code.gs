/**
 * IronRidge University — progress backend.
 *
 * Bound to the owner's Google Sheet (Extensions > Apps Script).
 * The GitHub Pages site posts here with Content-Type: text/plain so the
 * browser does not send a CORS preflight. Setup steps: SETUP.md.
 *
 * Sheets created on first use: Events, Progress, Feedback, Alerts.
 */

/* ========== owner settings (see SETUP.md) ========== */

// Who gets skip alerts and feedback. Example: ["shane@ironridgesteel.com"]
var ALERT_EMAILS = [];

// Must match accessCode in courses.js. The page sends that code as the secret.
var SHARED_SECRET = "";

/* ========== alert thresholds ========== */

// Alert when a course is finished faster than BOTH of these floors
// (under 30% of the course's expected minutes, or under 10 minutes —
// whichever floor is higher).
var MIN_COURSE_FRACTION = 0.30;
var MIN_COURSE_MINUTES = 10;

// Lesson or video marked complete with less visible time than this.
var LESSON_RACE_SECONDS = 15;

// Failed submits on one quiz before it counts as guessing.
var QUIZ_GUESS_ATTEMPTS = 4;

// At least this share of a course's lessons need recorded time before a
// "finished too fast" email can send. Avoids flagging progress that was
// completed before the timer existed.
var MIN_TRACKED_LESSON_SHARE = 0.5;

// One skip email per rep per course per day. Later flags still land on Events.
var ALERTS_PER_REP_COURSE_PER_DAY = 1;

/* ========== sheet columns ========== */

var EVENT_HEADERS = [
  "timestamp", "eventId", "nameKey", "displayName", "eventType",
  "courseId", "lessonId", "secondsSpent", "score", "attempts", "passed",
  "userAgent", "flags", "payload"
];
var PROGRESS_HEADERS = [
  "nameKey", "displayName", "firstSeen", "lastSeen", "coursesCompleted",
  "courseStatus", "quizSummary", "totalTimeSeconds", "progressJson",
  "userAgent", "updatedAt"
];
var FEEDBACK_HEADERS = [
  "timestamp", "nameKey", "displayName", "courseId", "lessonId",
  "courseTitle", "lessonTitle", "message"
];
var ALERT_HEADERS = [
  "day", "nameKey", "displayName", "courseId", "sentAt", "reasons", "emailed"
];

/* ========== web app entry ========== */

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (!p.action && !p.secret && !p.name) {
    return jsonOut_({ ok: true, service: "ironridge-university" });
  }
  return jsonOut_(runRequest_(p));
}

function doPost(e) {
  var body = {};
  try {
    if (e && e.postData && e.postData.contents) body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut_({ ok: false, error: "Bad JSON" });
  }
  return jsonOut_(runRequest_(body));
}

function runRequest_(body) {
  try {
    return withLock_(function () { return handleRequest(body, liveDb_()); });
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
}

function handleRequest(body, db) {
  body = body || {};
  if (!SHARED_SECRET) {
    return { ok: false, error: "SHARED_SECRET is empty. Set it in Code.gs." };
  }
  if (String(body.secret || "") !== String(SHARED_SECRET)) {
    return { ok: false, error: "Unauthorized" };
  }

  var action = body.action || (body.type ? "event" : "");
  if (action === "load") return loadProgress_(body, db);
  if (action === "feedback") return saveFeedback_(body, db);
  if (action === "event") return saveSync_(singleEventBody_(body), db);
  if (action === "sync") return saveSync_(body, db);
  return { ok: false, error: "Unknown action" };
}

/* ========== actions ========== */

function loadProgress_(body, db) {
  var who = nameParts_(body);
  if (!who.key) return { ok: false, error: "Name required" };
  var row = db.find("Progress", PROGRESS_HEADERS, 0, who.key);
  if (!row || !row[8]) return { ok: true, progress: null };
  try {
    return { ok: true, progress: JSON.parse(row[8]) };
  } catch (err) {
    return { ok: true, progress: null };
  }
}

function saveFeedback_(body, db) {
  var who = nameParts_(body);
  if (!who.key) return { ok: false, error: "Name required" };
  var message = String(body.message || "").trim();
  if (!message) return { ok: true, skipped: true };
  if (message.length > 5000) message = message.substring(0, 5000);
  var now = new Date().toISOString();
  db.append("Feedback", FEEDBACK_HEADERS, [
    now,
    who.key,
    who.display,
    String(body.courseId || ""),
    String(body.lessonId || ""),
    String(body.courseTitle || body.course || ""),
    String(body.lessonTitle || body.lesson || ""),
    message
  ]);
  var mailed = email_(db, ALERT_EMAILS,
    "IronRidge University feedback — " + who.display,
    "Rep: " + who.display +
      "\nCourse: " + (body.courseTitle || body.course || body.courseId || "") +
      "\nLesson: " + (body.lessonTitle || body.lesson || body.lessonId || "") +
      "\nWhen: " + now +
      "\n\n" + message
  );
  return { ok: true, emailed: mailed };
}

function saveSync_(body, db) {
  var who = nameParts_(body);
  if (!who.key) return { ok: false, error: "Name required" };
  var events = Array.isArray(body.events) ? body.events : [];
  var stored = readProgress_(who.key, db);
  var incoming = body.progress && typeof body.progress === "object" ? body.progress : null;
  var merged = incoming ? mergeProgress_(stored, incoming) : (stored || emptyProgress_(who.display));
  if (who.display) merged.displayName = who.display;
  if (!merged.firstSeen) merged.firstSeen = new Date().toISOString();
  merged.lastActive = laterIso_(merged.lastActive, new Date().toISOString());

  var outline = Array.isArray(body.outline) ? body.outline : [];
  var summary = summarize_(merged, outline);
  var flagsByEvent = [];
  var reasonsByCourse = {};

  for (var i = 0; i < events.length; i++) {
    var evt = events[i] || {};
    var reasons = detectRaces_(merged, evt);
    flagsByEvent.push(reasons);
    var courseId = String(evt.courseId || "");
    if (!reasons.length) continue;
    if (!reasonsByCourse[courseId]) reasonsByCourse[courseId] = [];
    for (var r = 0; r < reasons.length; r++) {
      if (reasonsByCourse[courseId].indexOf(reasons[r]) === -1) {
        reasonsByCourse[courseId].push(reasons[r]);
      }
    }
  }

  var emailedCourses = [];
  var courseIds = Object.keys(reasonsByCourse);
  for (var c = 0; c < courseIds.length; c++) {
    var cid = courseIds[c];
    if (sendCourseAlert_(db, who, cid, reasonsByCourse[cid])) emailedCourses.push(cid);
  }

  var now = new Date().toISOString();
  var agent = String(body.userAgent || "");
  for (var e = 0; e < events.length; e++) {
    appendEvent_(db, who, events[e], flagsByEvent[e], agent, now);
  }

  writeProgress_(db, who, merged, summary, agent, now);
  return { ok: true, progress: merged, alerted: emailedCourses };
}

/* ========== race detection ========== */

function detectRaces_(progress, event) {
  var reasons = [];
  var type = String(event.type || "");
  var seconds = Number(event.secondsSpent || 0);
  if (isNaN(seconds) || seconds < 0) seconds = 0;

  if (type === "lesson_complete" || type === "video_watched") {
    if (seconds < LESSON_RACE_SECONDS) {
      reasons.push(
        (type === "video_watched" ? "Video " : "Lesson ") +
        (event.lessonId || "") +
        " marked complete after " + seconds +
        " seconds of viewing (threshold " + LESSON_RACE_SECONDS + " seconds)."
      );
    }
  }

  if (type === "course_complete") {
    var speed = courseSpeed_(progress, event);
    if (speed.judge && speed.seconds < speed.minimum) {
      reasons.push(
        "Course " + (event.courseId || "") +
        " completed in " + formatMinutes_(speed.seconds) +
        ". Expected about " + (speed.expectedMinutes || 0) +
        " min. Alert floor is " + formatMinutes_(speed.minimum) +
        " (the higher of " + MIN_COURSE_MINUTES + " min and " +
        Math.round(MIN_COURSE_FRACTION * 100) + "% of expected)."
      );
    }
  }

  if (type === "quiz_submit") {
    var missing = skippedPrereqs_(progress, event.prereqs);
    if (missing.length) {
      reasons.push(
        "Quiz " + (event.lessonId || "") +
        " submitted before this lesson content was really watched: " +
        missing.join(", ") + "."
      );
    }
    var attempts = Number(event.attempts || 0);
    var passed = event.passed === true || event.passed === "true" || event.passed === "yes";
    if (attempts >= QUIZ_GUESS_ATTEMPTS && !passed) {
      reasons.push(
        "Quiz " + (event.lessonId || "") +
        " has " + attempts + " attempts without a pass (guessing threshold " +
        QUIZ_GUESS_ATTEMPTS + ")."
      );
    }
  }

  return reasons;
}

function courseSpeed_(progress, event) {
  var ids = Array.isArray(event.lessonIds) ? event.lessonIds : [];
  var times = (progress && progress.lessonTime) || {};
  var seconds = 0;
  var tracked = 0;
  if (ids.length) {
    for (var i = 0; i < ids.length; i++) {
      var t = Number(times[ids[i]] || 0);
      if (t > 0) tracked++;
      seconds += t > 0 ? t : 0;
    }
  }
  if (!ids.length) seconds = Number(event.secondsSpent || 0);
  var expectedMinutes = Number(event.expectedMinutes || 0);
  var fractionFloor = expectedMinutes > 0 ? expectedMinutes * 60 * MIN_COURSE_FRACTION : 0;
  var minimum = Math.max(MIN_COURSE_MINUTES * 60, fractionFloor);
  var judge = !ids.length || tracked >= ids.length * MIN_TRACKED_LESSON_SHARE;
  return {
    judge: judge,
    seconds: seconds,
    minimum: minimum,
    expectedMinutes: expectedMinutes
  };
}

function skippedPrereqs_(progress, prereqs) {
  if (!Array.isArray(prereqs)) return [];
  var opened = (progress && progress.opened) || {};
  var completed = (progress && progress.completed) || {};
  var times = (progress && progress.lessonTime) || {};
  var missing = [];
  for (var i = 0; i < prereqs.length; i++) {
    var item = prereqs[i] || {};
    var id = item.id;
    if (!id) continue;
    var wasOpened = !!opened[id] || !!completed[id];
    var time = Number(times[id] || 0);
    if (!wasOpened) {
      missing.push(item.title || id);
    } else if (time > 0 && time < LESSON_RACE_SECONDS) {
      missing.push((item.title || id) + " (" + time + "s)");
    }
  }
  return missing;
}

function sendCourseAlert_(db, who, courseId, reasons) {
  var day = db.today();
  var already = countAlertsToday_(db, who.key, courseId, day);
  var emailed = false;
  if (already < ALERTS_PER_REP_COURSE_PER_DAY) {
    emailed = email_(db, ALERT_EMAILS,
      "IronRidge University — fast progress — " + who.display,
      "A rep moved through training faster than the thresholds.\n\n" +
        "Rep: " + who.display + "\n" +
        "Course: " + (courseId || "(none)") + "\n" +
        "When: " + new Date().toISOString() + "\n\n" +
        reasons.map(function (line) { return "- " + line; }).join("\n") +
        "\n\nFull progress is on the Progress tab. This is the only email for this rep and course today."
    );
  }
  db.append("Alerts", ALERT_HEADERS, [
    day,
    who.key,
    who.display,
    courseId,
    new Date().toISOString(),
    reasons.join(" | "),
    emailed ? "yes" : "no"
  ]);
  return emailed;
}

function countAlertsToday_(db, nameKey, courseId, day) {
  var rows = db.all("Alerts", ALERT_HEADERS);
  var n = 0;
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === day &&
        String(rows[i][1]) === nameKey &&
        String(rows[i][3]) === String(courseId) &&
        String(rows[i][6]) === "yes") n++;
  }
  return n;
}

/* ========== progress blob ========== */

function emptyProgress_(display) {
  return {
    displayName: display || "",
    completed: {},
    quiz: {},
    examPassed: false,
    lastActive: null,
    firstSeen: new Date().toISOString(),
    lessonTime: {},
    opened: {},
    coursesCompleted: {}
  };
}

function mergeProgress_(a, b) {
  a = a || emptyProgress_("");
  b = b || emptyProgress_("");
  var out = emptyProgress_(b.displayName || a.displayName || "");
  out.examPassed = !!(a.examPassed || b.examPassed);
  out.firstSeen = earlierIso_(a.firstSeen, b.firstSeen) || out.firstSeen;
  out.lastActive = laterIso_(a.lastActive, b.lastActive);
  out.displayName = b.displayName || a.displayName || "";
  mergeCompleted_(out.completed, a.completed, b.completed);
  mergeNumbersMax_(out.lessonTime, a.lessonTime, b.lessonTime);
  mergeOpened_(out.opened, a.opened, b.opened);
  mergeOpened_(out.coursesCompleted, a.coursesCompleted, b.coursesCompleted);
  mergeQuiz_(out.quiz, a.quiz, b.quiz);
  return out;
}

function mergeCompleted_(into, a, b) {
  var keys = {};
  collectKeys_(keys, a);
  collectKeys_(keys, b);
  Object.keys(keys).forEach(function (id) {
    var av = a && a[id];
    var bv = b && b[id];
    if (av == null) into[id] = bv;
    else if (bv == null) into[id] = av;
    else into[id] = Math.min(Number(av), Number(bv));
  });
}

function mergeNumbersMax_(into, a, b) {
  var keys = {};
  collectKeys_(keys, a);
  collectKeys_(keys, b);
  Object.keys(keys).forEach(function (id) {
    into[id] = Math.max(Number((a && a[id]) || 0), Number((b && b[id]) || 0));
  });
}

function mergeOpened_(into, a, b) {
  var keys = {};
  collectKeys_(keys, a);
  collectKeys_(keys, b);
  Object.keys(keys).forEach(function (id) {
    var av = a && a[id];
    var bv = b && b[id];
    if (!av) into[id] = bv;
    else if (!bv) into[id] = av;
    else into[id] = earlierIso_(String(av), String(bv));
  });
}

function mergeQuiz_(into, a, b) {
  var keys = {};
  collectKeys_(keys, a);
  collectKeys_(keys, b);
  Object.keys(keys).forEach(function (id) {
    var av = (a && a[id]) || {};
    var bv = (b && b[id]) || {};
    into[id] = {
      best: Math.max(Number(av.best || 0), Number(bv.best || 0)),
      total: Math.max(Number(av.total || 0), Number(bv.total || 0)),
      passed: !!(av.passed || bv.passed),
      attempts: Math.max(Number(av.attempts || 0), Number(bv.attempts || 0))
    };
  });
}

function summarize_(progress, outline) {
  var status = [];
  var doneCourses = [];
  var cc = progress.coursesCompleted || {};
  if (outline && outline.length) {
    for (var i = 0; i < outline.length; i++) {
      var course = outline[i];
      var lessons = course.lessons || [];
      var done = 0;
      for (var j = 0; j < lessons.length; j++) {
        var lesson = lessons[j];
        if (lesson.type === "quiz") {
          if (progress.quiz && progress.quiz[lesson.id] && progress.quiz[lesson.id].passed) done++;
        } else if (progress.completed && progress.completed[lesson.id]) done++;
      }
      var complete = lessons.length > 0 && done === lessons.length;
      if (complete || cc[course.id]) doneCourses.push(course.id);
      status.push(course.id + " " + done + "/" + lessons.length + (complete ? " complete" : ""));
    }
  } else {
    Object.keys(cc).forEach(function (id) { if (cc[id]) doneCourses.push(id); });
  }
  var quizzes = [];
  var quiz = progress.quiz || {};
  Object.keys(quiz).forEach(function (id) {
    var item = quiz[id] || {};
    quizzes.push(
      id + " " + (item.best || 0) + "/" + (item.total || 0) +
      (item.passed ? " passed" : " not passed") +
      " attempts=" + (item.attempts || 0)
    );
  });
  var totalTime = 0;
  var times = progress.lessonTime || {};
  Object.keys(times).forEach(function (id) { totalTime += Number(times[id] || 0); });
  return {
    coursesCompleted: doneCourses.join(", "),
    courseStatus: status.join("; "),
    quizSummary: quizzes.join("; "),
    totalTimeSeconds: Math.round(totalTime)
  };
}

/* ========== sheet rows ========== */

function readProgress_(nameKey, db) {
  var row = db.find("Progress", PROGRESS_HEADERS, 0, nameKey);
  if (!row || !row[8]) return null;
  try { return JSON.parse(row[8]); } catch (err) { return null; }
}

function writeProgress_(db, who, progress, summary, agent, now) {
  db.upsert("Progress", PROGRESS_HEADERS, 0, who.key, [
    who.key,
    who.display,
    progress.firstSeen || now,
    progress.lastActive || now,
    summary.coursesCompleted,
    summary.courseStatus,
    summary.quizSummary,
    summary.totalTimeSeconds,
    JSON.stringify(progress),
    String(agent || "").substring(0, 500),
    now
  ]);
}

function appendEvent_(db, who, event, reasons, agent, now) {
  var type = String(event.type || "");
  var passed = event.passed === true || event.passed === "true" || event.passed === "yes"
    ? "yes"
    : (event.passed === false || event.passed === "false" || event.passed === "no" ? "no" : "");
  db.append("Events", EVENT_HEADERS, [
    event.timestamp || now,
    String(event.eventId || ""),
    who.key,
    who.display,
    type,
    String(event.courseId || ""),
    String(event.lessonId || ""),
    event.secondsSpent == null || event.secondsSpent === "" ? "" : Number(event.secondsSpent),
    event.score == null || event.score === "" ? "" : event.score,
    event.attempts == null || event.attempts === "" ? "" : event.attempts,
    passed,
    String(event.userAgent || agent || "").substring(0, 500),
    (reasons || []).join(" | "),
    JSON.stringify(eventPayload_(event))
  ]);
}

function eventPayload_(event) {
  return {
    type: event.type || "",
    courseId: event.courseId || "",
    lessonId: event.lessonId || "",
    secondsSpent: event.secondsSpent == null ? "" : event.secondsSpent,
    score: event.score == null ? "" : event.score,
    attempts: event.attempts == null ? "" : event.attempts,
    passed: event.passed == null ? "" : event.passed,
    expectedMinutes: event.expectedMinutes == null ? "" : event.expectedMinutes,
    lessonIds: event.lessonIds || null,
    prereqs: event.prereqs || null,
    timestamp: event.timestamp || ""
  };
}

function singleEventBody_(body) {
  var copy = {};
  Object.keys(body).forEach(function (k) { copy[k] = body[k]; });
  copy.action = "sync";
  copy.events = [body];
  return copy;
}

/* ========== small helpers ========== */

function nameParts_(body) {
  var display = String(body.name || body.displayName || "").trim();
  if (!display && body.progress && body.progress.displayName) {
    display = String(body.progress.displayName).trim();
  }
  return { key: display.toLowerCase(), display: display };
}

function earlierIso_(a, b) {
  if (!a) return b || null;
  if (!b) return a || null;
  return String(a) <= String(b) ? a : b;
}

function laterIso_(a, b) {
  if (!a) return b || null;
  if (!b) return a || null;
  return String(a) >= String(b) ? a : b;
}

function collectKeys_(into, obj) {
  if (!obj) return;
  Object.keys(obj).forEach(function (k) { into[k] = true; });
}

function formatMinutes_(seconds) {
  var s = Math.max(0, Math.round(Number(seconds) || 0));
  var m = Math.floor(s / 60);
  var r = s % 60;
  if (m <= 0) return r + " sec";
  return m + " min " + r + " sec";
}

function email_(db, list, subject, message) {
  var to = [];
  (list || []).forEach(function (addr) {
    var clean = String(addr || "").trim();
    if (clean) to.push(clean);
  });
  if (!to.length) return false;
  try {
    db.email(to, subject, message);
    return true;
  } catch (err) {
    return false;
  }
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); }
  finally { lock.releaseLock(); }
}

/* ========== live spreadsheet ========== */

function liveDb_() {
  return {
    append: function (name, headers, row) {
      sheet_(name, headers).appendRow(row);
    },
    upsert: function (name, headers, keyIndex, keyValue, row) {
      var sh = sheet_(name, headers);
      var last = sh.getLastRow();
      if (last >= 2) {
        var keys = sh.getRange(2, keyIndex + 1, last - 1, 1).getValues();
        for (var i = 0; i < keys.length; i++) {
          if (String(keys[i][0]) === String(keyValue)) {
            sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
            return;
          }
        }
      }
      sh.appendRow(row);
    },
    find: function (name, headers, keyIndex, keyValue) {
      var sh = sheet_(name, headers);
      var last = sh.getLastRow();
      if (last < 2) return null;
      var values = sh.getRange(2, 1, last - 1, headers.length).getValues();
      for (var i = 0; i < values.length; i++) {
        if (String(values[i][keyIndex]) === String(keyValue)) return values[i];
      }
      return null;
    },
    all: function (name, headers) {
      var sh = sheet_(name, headers);
      var last = sh.getLastRow();
      if (last < 2) return [];
      return sh.getRange(2, 1, last - 1, headers.length).getValues();
    },
    email: function (to, subject, message) {
      MailApp.sendEmail(to.join(","), subject, message);
    },
    today: function () {
      var tz = Session.getScriptTimeZone() || "America/New_York";
      return Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
    }
  };
}

function sheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sh;
}
