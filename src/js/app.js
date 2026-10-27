// Codaluna – App-Verkabelung: Lektionen, Editor, Ausführung, Prüfung, Fortschritt.

import courseData from "/content/courses/season-1.js";
import overlays from "/content/i18n/season-1-i18n.js";
import { makeContext } from "/content/lib/check-kit.js";
import { createCourse, SANDBOX_ID, XP_PER_LEVEL } from "/src/js/course.js";
import { PyRunner } from "/src/js/runner.js";
import { createEditor, loadCode, markErrorLine, gotoLine, setEditorLabel, applyFix } from "/src/js/editor.js";
import { createConsole } from "/src/js/console.js";
import { explainError, escapeHtml } from "/src/js/errors.js";
import { progress } from "/src/js/progress.js";
import { awardBadges, badgeKey, badgeIcon, SECRETS } from "/src/js/badges.js";
import { awardDiscoveries } from "/src/js/discoveries.js";
import { sfx, haptic, soundOn, setSound, onSoundChange, audio } from "/src/js/sfx.js";
import { burst, flyXp, levelMoment } from "/src/js/juice.js";
import { lumo, createBuddy } from "/src/js/companion.js";
import { icon, hydrateIcons } from "/src/js/icons.js";
import { createStage } from "/src/js/stage.js";
import { encodeCode, decodeCode, shareToken, shareUrl, MAX_TOKEN, MAX_CODE } from "/src/js/share.js";
import { showWorkshop, applyLook, unlocksAt } from "/src/js/workshop.js";
import { showMap, showRegionOnline } from "/src/js/view-map.js";
import { localDay } from "/src/js/progress.js";
import { t, applyStatic, initLocale, setLocale, getLocale, LANGS } from "/src/js/i18n.js";
import { confirmDialog, toast, isModalOpen, openModal } from "/src/js/ui.js";
import { renderLessonPane } from "/src/js/view-lesson.js";
import { renderSidebar } from "/src/js/view-sidebar.js";
import { showProgress } from "/src/js/view-progress.js";
import { initOnboarding, startTour } from "/src/js/onboarding.js";
import { initOffline } from "/src/js/offline.js";
import {
  initAuth,
  authEnabled,
  requireLogin,
  openLogin,
  signOut,
  getClient,
  closeGate,
  deleteOwnAccount,
} from "/src/js/auth.js";
import { pullMergePush, push } from "/src/js/sync.js";
import { showDiploma } from "/src/js/diploma.js";
import { initTelemetry, track, report, logError } from "/src/js/telemetry.js";

const course = createCourse(courseData, overlays);
const $ = (sel) => document.querySelector(sel);
hydrateIcons(document); // Icon-Platzhalter in index.html
const isMobile = () => window.matchMedia("(max-width: 960px)").matches;

const el = {
  sidebar: $("#sidebar"),
  lessonPane: $("#lesson-pane"),
  editorHost: $("#editor-host"),
  out: $("#console-out"),
  inputRow: $("#console-input"),
  inputField: $("#console-input-field"),
  inputSend: $("#console-input-send"),
  consoleStatus: $("#console-status"),
  consoleDot: $("#console-dot"),
  consoleClear: $("#console-clear"),
  runBtn: $("#run-btn"),
  runLabel: $("#run-label"),
  stopBtn: $("#stop-btn"),
  resetBtn: $("#reset-btn"),
  solutionBtn: $("#solution-btn"),
  shareBtn: $("#share-btn"),
  boot: $("#boot"),
  statsBtn: $("#stats-btn"),
  xpFill: $("#xp-fill"),
  levelBadge: $("#level-badge"),
  weekVal: $("#week-val"),
  weekDots: $("#week-dots"),
  weekStat: $('.stat[data-kind="week"]'),
  soundBtn: $("#sound-btn"),
  buddy: $("#buddy"),
  menuBtn: $("#menu-btn"),
  workspace: $("#workspace"),
  mtabs: $("#mtabs"),
  scrim: $("#scrim"),
  helpBtn: $("#help-btn"),
  offlineBtn: $("#offline-btn"),
  installBtn: $("#install-btn"),
  themeBtn: $("#theme-btn"),
  langBtn: $("#lang-btn"),
  langMenu: $("#lang-menu"),
  importFile: $("#import-file"),
};

const runner = new PyRunner();
const term = createConsole({ out: el.out, inputRow: el.inputRow, inputField: el.inputField });
const buddy = createBuddy(el.buddy);
const stage = createStage({ append: (node) => term.append(node) });

// ---- Zustand ----
let currentId = null; // Lektions-ID oder SANDBOX_ID
let editor = null;
let expertOpen = false;
const hintsShown = {}; // lessonId -> Anzahl gezeigter Tipps (nur diese Sitzung)
const hadError = {}; // lessonId -> letzter Lauf endete mit Fehler (für "Käferjäger")
let currentUser = null;
let onboardingStarted = false;
// Lernzeit am Stück (für den freundlichen Pausen-Hinweis). Eine Pause > 20 min beginnt neu.
const session = { start: 0, last: 0, hinted: false };
const PAUSE_AFTER = 45 * 60 * 1000;
const SESSION_GAP = 20 * 60 * 1000;
let runSeq = 0; // jeder Lauf bekommt eine Nummer: alte Läufe zeigen nach einem neuen nichts mehr an
let stopAtInput = false; // Stop kam, während input() wartete (zählt nicht als gebändigte Endlosschleife)

const isSandbox = () => currentId === SANDBOX_ID;
const currentLesson = () => (isSandbox() ? null : course.get(currentId).lesson);
const starterFor = (id) => (id === SANDBOX_ID ? t("sandbox.starter") : course.field(course.get(id).lesson, "starterCode") || "");

// ======================================================================
// Kopfzeile & Fortschritt
// ======================================================================
function updateHeader() {
  const s = course.stats(progress);
  el.xpFill.style.width = Math.round((s.xpInLevel / XP_PER_LEVEL) * 100) + "%";
  el.levelBadge.textContent = s.level;
  const days = progress.weekDays();
  const goal = progress.weekGoal;
  el.weekVal.textContent = `${days}/${goal}`;
  el.weekDots.innerHTML = Array.from({ length: goal }, (_, i) => `<i${i < days ? ' class="on"' : ""}></i>`).join("");
  el.weekStat.classList.toggle("met", days >= goal);
  applyLook(progress.data.look, s.level);
  el.statsBtn.title = t("stat.summary", { level: s.level, have: s.xpInLevel, days, goal });
}

function refreshViews() {
  updateHeader();
  drawSidebar();
  drawLesson();
  updateToolbar();
}

function drawSidebar() {
  renderSidebar(el.sidebar, {
    course,
    progress,
    currentId,
    account: { enabled: authEnabled, user: currentUser },
    onSelect: (id) => {
      selectLesson(id);
      closeDrawer();
    },
    onLocked: showLocked,
    sound: soundOn(),
    actions: {
      map: openMap,
      badges: () => showProgress({ course, progress, onGoal: setWeekGoal }),
      workshop: openWorkshop,
      sound: toggleSound,
      diploma: openDiploma,
      export: exportProgress,
      import: () => el.importFile.click(),
      reset: resetProgress,
      signIn: () => openLogin({ showBanner }),
      signOut: doSignOut,
      deleteAccount,
    },
  });
}

function drawLesson() {
  renderLessonPane(el.lessonPane, {
    course,
    progress,
    id: currentId,
    hintsShown: hintsShown[currentId] || 0,
    expertOpen,
    onSelect: (id) => {
      if (!course.isUnlocked(id, progress)) return showLocked(id);
      selectLesson(id);
    },
    onHint: () => {
      hintsShown[currentId] = (hintsShown[currentId] || 0) + 1;
      drawLesson();
      const hints = el.lessonPane.querySelectorAll(".hint");
      if (hints.length) hints[hints.length - 1].scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    onExpertToggle: (open) => {
      expertOpen = open;
      drawLesson();
    },
    onExpertSolution: showExpertSolution,
    onTry: runSnippet,
  });
}

// ======================================================================
// Lektion wählen
// ======================================================================
// flush:false, wenn der Fortschritt gerade ersetzt wurde (Zurücksetzen, Import, Abmelden):
// dann darf der alte Editorinhalt nicht in den neuen Stand geschrieben werden.
function selectLesson(id, { tab = "task", flush = true } = {}) {
  if (id !== SANDBOX_ID && !course.get(id)) id = course.resumeId(progress);
  if (id !== SANDBOX_ID && !course.isUnlocked(id, progress)) return showLocked(id);
  if (runner.running) runner.stop("switch");
  stage.reset();
  buddy.setMood("idle");
  if (flush) flushCode();
  currentId = id;
  expertOpen = false;
  progress.setLast(id);
  drawLesson();
  drawSidebar();
  loadEditor();
  term.placeholder(t("console.placeholder"));
  term.hideInput();
  setConsoleStatus(null);
  updateToolbar();
  setTab(tab);
  el.lessonPane.scrollTop = 0;
}

function loadEditor() {
  const saved = progress.getCode(currentId);
  const code = saved != null ? saved : starterFor(currentId);
  if (!editor) {
    editor = createEditor(el.editorHost, {
      value: code,
      label: t("editor.aria"),
      onChange: autosave,
      onRun: runCode,
      onSave: () => {
        flushCode();
        toast(t("editor.saved"), "ok", 1500);
      },
    });
  } else {
    loadCode(editor, code);
  }
  setTimeout(() => editor.refresh(), 0);
}

// Code automatisch sichern. Entspricht er dem Start-Code, wird nichts gespeichert,
// damit spätere Verbesserungen am Start-Code ankommen.
function autosave(code) {
  if (!currentId) return;
  if (code.trim() === starterFor(currentId).trim()) {
    if (progress.getCode(currentId) != null) progress.clearCode(currentId);
  } else {
    progress.saveCode(currentId, code);
  }
}
function flushCode() {
  if (editor && currentId) autosave(editor.getValue());
}

// ======================================================================
// Werkzeugleiste & Status
// ======================================================================
function updateToolbar() {
  const status = runner.status;
  const loading = status === "idle" || status === "loading" || status === "restarting";
  el.runBtn.disabled = status !== "ready";
  el.runBtn.classList.toggle("loading", loading);
  el.stopBtn.disabled = status !== "running";
  el.runLabel.textContent = loading
    ? t(status === "restarting" ? "run.restarting" : "run.loading")
    : status === "failed"
      ? t("run.failedShort")
      : t("btn.run");
  const lesson = currentLesson();
  el.solutionBtn.hidden = !lesson || !course.field(lesson, "solution");
}

let statusTimer = null;
function setConsoleStatus(kind) {
  clearInterval(statusTimer);
  el.consoleDot.className = "dot" + (kind ? " " + kind : "");
  if (kind === "running" || kind === "verify") buddy.setMood("think");
  else if (kind === "input") buddy.setMood("listen");
  if (!kind) {
    el.consoleStatus.textContent = "";
    return;
  }
  if (kind === "running") {
    const start = Date.now();
    el.consoleStatus.textContent = t("console.running");
    statusTimer = setInterval(() => {
      const sec = Math.floor((Date.now() - start) / 1000);
      if (sec >= 4) el.consoleStatus.textContent = t("console.runningLong", { s: sec });
    }, 1000);
  } else {
    el.consoleStatus.textContent = t("console." + kind);
  }
}

let slowTimer = null;
function onRunnerStatus(status, detail) {
  updateToolbar();
  clearTimeout(slowTimer);
  if (status === "loading" || status === "restarting") {
    slowTimer = setTimeout(() => {
      if (runner.status === "loading" || runner.status === "restarting") el.consoleStatus.textContent = t("run.loadingSlow");
    }, 12000);
  } else if (status === "ready" && el.consoleStatus.textContent === t("run.loadingSlow")) {
    el.consoleStatus.textContent = "";
  }
  if (status === "restarting" && detail) report("app", "WorkerCrash", detail, { context: { where: "runner" } });
  if (status === "failed") {
    report("app", "RunnerFailed", detail || "Python startet nicht", { context: { where: "runner" } });
    term.append(
      resultCard("warn", "alert", t("run.failedTitle"), escapeHtml(t("run.failed", { msg: detail || "" })), [
        { label: t("run.retry"), primary: true, onClick: () => runner.retry() },
      ])
    );
  }
}

// ======================================================================
// Ausführen & Prüfen
// ======================================================================
async function runCode() {
  if (!editor || !runner.ready || isModalOpen()) return;
  audio(); // synchron in der Nutzeraktion, sonst bleibt der Ton auf iOS stumm
  const id = currentId;
  const lesson = currentLesson();
  const code = editor.getValue();
  flushCode();

  progress.practice();
  progress.data.stats.runs++;
  if (isSandbox()) progress.data.stats.sandboxRuns++;
  else progress.markTried(id);
  progress.save();
  updateHeader();
  trackSession();

  term.clear();
  term.hideInput();

  const expertWasOpen = expertOpen;
  const opts = lesson
    ? {
        starter: starterFor(id),
        tests: lesson.tests || [],
        expertTests: expertOpen && lesson.expert ? lesson.expert.tests || [] : [],
        world: lesson.world || null,
      }
    : {};
  const result = await execute(code, opts);
  if (!result) return;
  handleResult(result, { id, lesson, code, expertWasOpen: !!(lesson && lesson.expert && expertWasOpen) });
}

// Ein Beispiel aus der Erklärung ausprobieren: läuft in der Konsole, ohne Prüfung und
// ohne den Code im Editor anzufassen.
async function runSnippet(code) {
  if (isModalOpen()) return;
  audio();
  if (!runner.ready) {
    toast(t(runner.running ? "try.busy" : "try.notReady"), "info");
    return;
  }
  const id = currentId;
  term.clear();
  term.hideInput();
  term.write(t("try.head") + "\n", "info");
  const lesson = currentLesson();
  const result = await execute(code, { world: (lesson && lesson.world) || null });
  if (!result) return;
  handleResult(result, { id, lesson: null, code, expertWasOpen: false, snippet: true });
}

// Programm ausführen; liefert das Ergebnis oder null (abgebrochen/Lektion gewechselt).
async function execute(code, opts) {
  const id = currentId;
  const seq = ++runSeq;
  const started = performance.now();
  stopAtInput = false;
  setConsoleStatus("running");
  if (isMobile()) setTab("code");
  stage.reset();
  let result;
  try {
    // Nach einem Lektionswechsel gehört die Restausgabe nicht mehr in die Konsole
    const mine = () => currentId === id;
    result = await runner.run(code, opts, {
      // Kanal "g": Bildschirm und Lautsprecher der Station (stage.js)
      onOutput: (text, kind) => mine() && (kind === "g" ? stage.feed(text) : term.write(text, kind)),
      onInputRequest: () => {
        if (!mine()) return;
        setConsoleStatus("input");
        term.showInput();
      },
      onPhase: (phase) => mine() && setConsoleStatus(phase === "verify" ? "verify" : "running"),
    });
  } catch (_) {
    setConsoleStatus(null);
    buddy.setMood("idle");
    return null;
  }
  setConsoleStatus(null);
  term.hideInput();
  result.elapsed = performance.now() - started;
  result.atInput = stopAtInput;
  if (currentId !== id) return null; // inzwischen andere Lektion gewählt
  await stage.whenIdle(); // Lumos Flug zu Ende zeigen, dann das Ergebnis
  if (currentId !== id || seq !== runSeq) return null;
  return result;
}

function trackSession() {
  const now = Date.now();
  if (!session.start || now - session.last > SESSION_GAP) {
    session.start = now;
    session.hinted = false;
  }
  session.last = now;
}

function handleResult(r, opts) {
  const before = el.out.childElementCount;
  showResult(r, opts);
  term.reveal(el.out.children[before]); // erste neue Karte im Blick behalten
}

function showResult(r, { id, lesson, code, expertWasOpen, snippet = false }) {
  const levelBefore = course.stats(progress).level;
  const secrets = awardDiscoveries({ result: r, code, sandbox: isSandbox() && !snippet, progress }, SECRETS);

  if (r.stopped || r.limit) {
    if (r.reason === "timeout") report("run", "timeout", "Zeitlimit erreicht", { code });
    else if (r.reason === "output" || r.limit) report("run", "output", "Ausgabegrenze erreicht", { code });
    if (r.reason === "timeout") {
      term.append(resultCard("warn", "clock", t("run.timeoutTitle"), t("run.timeout"), [], "curious"));
    } else if (r.reason === "output" || r.limit) {
      term.append(resultCard("warn", "waves", t("run.outputTitle"), t("run.output"), [], "curious"));
    } else if (r.reason !== "switch") {
      term.write("\n" + t("console.stopped") + "\n", "info");
    }
    if (r.restarted) term.write(t("run.restarted") + "\n", "info");
    buddy.setMood("idle");
    celebrate(levelBefore, { secrets });
    return;
  }
  if (r.crashed) {
    report("run", "crash", (r.error && r.error.message) || "Absturz", { code });
    term.append(resultCard("warn", "wrench", t("run.crashTitle"), t("run.crash"), [], "glitch"));
    buddy.setMood("glitch", { back: 5000 });
    celebrate(levelBefore, { secrets });
    return;
  }
  if (r.noInput) {
    report("run", "noInput", "input() ohne Cross-Origin-Isolation", { code });
    term.append(resultCard("warn", "keyboard", t("run.noInputTitle"), t("run.noInput")));
    buddy.setMood("idle");
    celebrate(levelBefore, { secrets });
    return;
  }
  if (r.error) {
    const info = explainError(r.error, code);
    report("python", r.error.type, r.error.message, {
      hint: info.key,
      code,
      context: { line: r.error.line || 0, fix: !!info.fix, snippet },
    });
    if (!snippet) {
      progress.data.stats.errors++;
      hadError[id] = true;
      markErrorLine(editor, r.error.line, info.line === r.error.line ? info.spot : null);
    }
    renderErrorCard(r.error, info, { jump: !snippet, code });
    progress.save();
    sfx.glitch();
    buddy.setMood("glitch", { back: 5000 });
    celebrate(levelBefore, { secrets });
    return;
  }

  // Lauf ohne Fehler, aber die Prüfung wurde unterbrochen: nichts bewerten
  if (r.verifyError && lesson) {
    report("run", "verifyError", String(r.verifyError), { code });
    term.append(resultCard("warn", "repeat", t("check.verifyFailed"), ""));
    buddy.setMood("idle");
    celebrate(levelBefore, { secrets });
    return;
  }

  if (hadError[id] && !snippet) {
    progress.data.stats.fixes++;
    hadError[id] = false;
  }
  if (!lesson) {
    term.write("\n" + t("console.finished") + "\n", "info");
    progress.save();
    buddy.setMood("happy", { back: 2500 });
    celebrate(levelBefore, { secrets });
    return;
  }

  // Erst prüfen, dann Fortschritt eintragen, dann Karten zeigen
  const starter = starterFor(id);
  const main = runCheck(lesson.check, makeContext({ code, starter, result: r, tests: r.tests }));
  const bonus =
    expertWasOpen && lesson.expert && lesson.expert.check
      ? runCheck(lesson.expert.check, makeContext({ code, starter, result: r, tests: r.expertTests }))
      : null;
  const firstTime = main.passed ? progress.complete(id) : false;
  const firstBonus = bonus && bonus.passed ? progress.completeBonus(id) : false;

  let origin = null; // Karte, von der Funken und XP ausgehen
  if (main.passed) {
    const card = successCard(lesson, firstTime, !expertWasOpen);
    term.append(card);
    if (firstTime) origin = card;
  } else {
    const text = course.feedbackText(lesson, main);
    reportCheck(id, main, text, code, false);
    term.append(resultCard("hint", "bulb", t("check.almost"), text, [], "curious"));
  }
  if (bonus && bonus.passed) {
    const title = firstBonus ? t("check.bonusDone", { xp: lesson.expert.xp || 0 }) : t("check.bonusAgain");
    const card = resultCard("bonus", "spark", title, t("check.bonusText"), [], "proud");
    term.append(card);
    if (firstBonus) origin = origin || card;
  } else if (bonus && main.passed) {
    const text = course.feedbackText(lesson, bonus, true);
    reportCheck(id, bonus, text, code, true);
    term.append(resultCard("hint", "spark", t("check.bonusAlmost"), text, [], "curious"));
  }
  if (firstTime) track("Lesson Done", { lesson: id, lang: getLocale() });
  if (firstBonus) track("Bonus Done", { lesson: id, lang: getLocale() });
  if (main.passed && firstTime && !session.hinted && Date.now() - session.start >= PAUSE_AFTER) {
    session.hinted = true;
    term.append(resultCard("pause", "cup", t("pause.title"), t("pause.text"), [], "sleep"));
  }

  // Klang und Lumo passend zum Ergebnis
  if (firstBonus) sfx.bonus();
  else if (main.passed) sfx.success();
  else sfx.hint();
  buddy.setMood(firstBonus ? "proud" : main.passed ? "happy" : "curious", { back: 6000 });
  if (origin) {
    burst(origin.querySelector(".ico"));
    haptic(firstBonus ? [18, 60, 18] : 18);
  }

  progress.save();
  updateHeader();
  drawSidebar();
  drawLesson();
  const gained = (firstTime ? lesson.xp || 0 : 0) + (firstBonus ? lesson.expert.xp || 0 : 0);
  const levelUp = course.stats(progress).level > levelBefore;
  celebrate(levelBefore, { secrets, origin, gained });
  // Kapitel komplett: der Bereich der Station geht wieder online
  const entry = course.get(id);
  if (firstTime && course.chapterProgress(entry.chapterIndex, progress).complete) {
    setTimeout(() => regionOnline(entry), levelUp ? 3300 : 1100);
  }
}

function regionOnline(entry) {
  if (isModalOpen()) return setTimeout(() => regionOnline(entry), 800);
  const actions = [];
  if (entry.lesson.id === course.finalId) {
    actions.push({ label: t("diploma.view"), primary: true, onClick: openDiploma });
  } else {
    const main = course.mainChapters;
    const at = main.indexOf(entry.chapter);
    const nextChapter = at >= 0 ? main[at + 1] : null;
    const ci = nextChapter ? course.chapters.indexOf(nextChapter) : -1;
    const target = ci >= 0 ? course.chapterTarget(ci, progress) : null;
    if (target) {
      actions.push({
        label: t("map.next", { name: course.region(nextChapter).name }),
        primary: true,
        onClick: () => selectLesson(target),
      });
    }
  }
  sfx.level();
  showRegionOnline({ course, progress, chapterIndex: entry.chapterIndex, actions });
}

function openMap() {
  closeDrawer();
  showMap({
    course,
    progress,
    currentId,
    onPick: (id) => selectLesson(id),
    onLocked: () => toast(t("map.lockedToast"), "lock", 3500),
  });
}

// Gesperrte Mission: sagen, was vorher fehlt
function showLocked(id) {
  const req = course.missingRequirement(id, progress);
  if (req) toast(t("banner.requires", { title: course.field(req.lesson, "title") }), "lock", 4000);
  else toast(t("banner.locked"), "lock");
}

function runCheck(fn, ctx) {
  if (!fn) return { passed: true };
  try {
    const res = fn(ctx);
    if (typeof res === "boolean") return { passed: res };
    return res && typeof res === "object" ? res : { passed: false };
  } catch (e) {
    logError("check", e, { lesson: currentId });
    return { passed: false, feedback: "fb.generic" };
  }
}

// Nicht bestandene Prüfung melden: zeigt später, wo Lernende hängen bleiben
// und welche Rückmeldung vielleicht nicht weiterhilft.
function reportCheck(id, res, text, code, expert) {
  const key = (res && res.feedback) || "fb.generic";
  report("check", expert ? "BonusCheck" : "Check", `${id}: ${key}`, {
    hint: key,
    code,
    context: { where: id, text: String(text).replace(/<[^>]*>/g, "").slice(0, 200) },
  });
}

// Level-up, neue Abzeichen und Entdeckungen: XP fliegen in die Kopfzeile, ein neues
// Level bekommt einen kurzen großen Moment, Abzeichen eine kleine Karte unter dem Ergebnis.
// secrets: neu entdeckte geheime Abzeichen (IDs) · origin: Karte, von der XP fliegen
function celebrate(levelBefore, { secrets = [], origin = null, gained = 0 } = {}) {
  const s = course.stats(progress);
  const items = [];
  const levelUp = s.level > levelBefore;
  if (levelUp) items.push(`${icon("spark", { size: 16 })} ${t("banner.levelUp", { n: s.level })}`);
  const fresh = awardBadges(course, progress);
  for (const b of fresh) {
    items.push(`${badgeIcon(b, 16)} ${t("banner.badge", { name: t(badgeKey(b) + ".name", { n: b.chapter || "" }) })}`);
  }
  for (const id of secrets) {
    const b = SECRETS.find((x) => x.id === id);
    items.push(`${badgeIcon(b, 16)} ${t("banner.secret", { name: t(`badge.${id}.name`) })}`);
  }
  if (secrets.length) progress.save();
  updateHeader();
  if (gained && origin) flyXp(origin.querySelector(".ico") || origin, el.levelBadge, `+${gained} XP`);
  if (levelUp) {
    setTimeout(() => {
      sfx.level();
      const fresh = unlocksAt(s.level);
      const text = fresh.length ? t("level.unlock", { name: fresh.join(", ") }) : t("level.text");
      levelMoment({ level: s.level, title: t("banner.levelUp", { n: s.level }), text });
    }, origin ? 700 : 0);
  } else if (fresh.length || secrets.length) {
    setTimeout(() => sfx.badge(), origin ? 450 : 0);
  }
  if (!items.length) return;
  const card = document.createElement("div");
  card.className = "result-card reward";
  card.innerHTML =
    items.map((x) => `<div class="rw">${x}</div>`).join("") +
    `<button type="button" class="linkbtn rw-more">${t("sidebar.progress")} →</button>`;
  card.querySelector(".rw-more").onclick = () => showProgress({ course, progress, onGoal: setWeekGoal });
  term.append(card);
}

function setWeekGoal(n) {
  progress.setWeekGoal(n);
  updateHeader();
}

// Geheimes Abzeichen außerhalb eines Laufs vergeben (z. B. „Remix“)
function grantSecret(id) {
  if (progress.data.badges[id]) return;
  progress.data.badges[id] = localDay();
  progress.save();
  sfx.badge();
  toast(t("banner.secret", { name: t(`badge.${id}.name`) }), "badge", 4000);
}

function openWorkshop() {
  closeDrawer();
  showWorkshop({
    look: progress.data.look,
    level: course.stats(progress).level,
    onPick: (look) => {
      progress.data.look = look;
      progress.save();
      updateHeader();
    },
  });
}

// ======================================================================
// Teilen per Link (kein Server: der Code steckt im Link-Anker)
// ======================================================================
async function shareCode() {
  if (!editor) return;
  const code = editor.getValue();
  if (!code.trim()) return toast(t("share.empty"), "info");
  if (code.length > MAX_CODE) return toast(t("share.tooLong"), "fail", 4500);
  let url;
  try {
    const token = await encodeCode(code);
    if (token.length > MAX_TOKEN) return toast(t("share.tooLong"), "fail", 4500);
    url = shareUrl(token);
  } catch (_) {
    return toast(t("share.tooLong"), "fail", 4500);
  }
  if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
    try {
      await navigator.share({ title: "Codaluna", text: t("share.text"), url });
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast(t("share.copied"), "ok", 5000);
  } catch (_) {
    showShareLink(url);
  }
}

// Falls die Zwischenablage nicht erlaubt ist: Link zum Kopieren anzeigen
function showShareLink(url) {
  const m = openModal({
    label: t("share.title"),
    className: "confirm-modal share-modal",
    html: `
      <h2>${t("share.title")}</h2>
      <p>${t("share.manual")}</p>
      <input class="share-link" type="text" readonly value="${escapeHtml(url)}" data-autofocus />
      <p class="share-note">${t("share.note")}</p>
      <div class="modal-actions"><button type="button" class="btn" data-close>${t("dlg.close")}</button></div>`,
  });
  const input = m.el.querySelector(".share-link");
  input.addEventListener("focus", () => input.select());
  m.el.querySelector("[data-close]").onclick = () => m.close();
}

// Geteilten Link öffnen: Code in den Spielplatz, nie automatisch ausführen
async function openShared() {
  const token = shareToken(window.location.hash);
  if (!token) return;
  history.replaceState(null, "", window.location.pathname + window.location.search);
  let code;
  try {
    code = await decodeCode(token);
  } catch (_) {
    toast(t("share.broken"), "fail", 4500);
    return;
  }
  selectLesson(SANDBOX_ID, { tab: "code" });
  const cur = editor.getValue().trim();
  if (cur && cur !== starterFor(SANDBOX_ID).trim() && cur !== code.trim()) {
    const ok = await confirmDialog({ title: t("share.loadTitle"), text: t("share.loadText"), ok: t("share.loadOk") });
    if (!ok) return;
  }
  editor.setValue(code);
  flushCode();
  term.clear();
  term.append(resultCard("pause", "mail", t("share.loadedTitle"), t("share.loaded"), [], "curious"));
  grantSecret("secret-remix");
}

// ---- Karten in der Konsole ----
// mood: Lumo spricht die Karte (statt des Symbols) in dieser Stimmung
function resultCard(kind, glyph, title, html, buttons = [], mood = null) {
  const card = document.createElement("div");
  card.className = `result-card ${kind}${mood ? " talk" : ""}`;
  const ico = mood ? `<span class="ico buddy-ico" aria-hidden="true">${lumo(mood, { size: 34 })}</span>` : `<span class="ico" aria-hidden="true">${icon(glyph)}</span>`;
  card.innerHTML =
    `<div class="rc-title">${ico}<span>${title}</span></div>` +
    (html ? `<div class="rc-text">${html}</div>` : "");
  if (buttons.length) {
    const row = document.createElement("div");
    row.className = "rc-actions";
    for (const b of buttons) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn " + (b.primary ? "btn-primary" : "btn-ghost");
      btn.textContent = b.label;
      btn.onclick = b.onClick;
      row.appendChild(btn);
    }
    card.appendChild(row);
  }
  return card;
}

function successCard(lesson, firstTime, suggestBonus) {
  const next = course.next(lesson.id);
  const buttons = [];
  let text = suggestBonus && lesson.expert && !progress.hasBonus(lesson.id) ? t("check.tryBonus") : "";
  if (next && course.isUnlocked(next.lesson.id, progress)) {
    buttons.push({
      label: t("check.next", { title: course.field(next.lesson, "title") }),
      primary: true,
      onClick: () => selectLesson(next.lesson.id),
    });
  } else if (next) {
    // Nebenmission, die erst mit dem Hauptkurs aufgeht: sagen, was fehlt
    const req = course.missingRequirement(next.lesson.id, progress);
    if (req) text = t("banner.requires", { title: course.field(req.lesson, "title") });
    buttons.push({ label: t("map.title"), primary: true, onClick: openMap });
  } else if (lesson.id === course.finalId) {
    buttons.push({ label: t("diploma.view"), primary: true, onClick: openDiploma });
  } else {
    buttons.push({ label: t("map.title"), primary: true, onClick: openMap });
  }
  const title = firstTime ? t("check.done", { xp: lesson.xp || 0 }) : t("check.again");
  return resultCard("ok", "check", title, text, buttons, "happy");
}

// Codezeile mit markierter Stelle (spot) bzw. mit hervorgehobener Änderung (Vorschlag).
// Gemeinsame Einrückung beider Zeilen fällt weg, damit lange Zeilen lesbar bleiben.
function codeRow(text, from, to, tag, dedent) {
  const a = Math.max(from - dedent, 0);
  const b = Math.max(to - dedent, a);
  const s = text.slice(dedent);
  const mark = b > a ? `<${tag}>${escapeHtml(s.slice(a, b))}</${tag}>` : `<${tag} class="gap"></${tag}>`;
  return `<code>${escapeHtml(s.slice(0, a))}${mark}${escapeHtml(s.slice(b))}</code>`;
}

function errCodeBlock(info, jump, code) {
  if (info.text == null || !info.text.trim()) return "";
  const fix = info.fix;
  const fixed = fix ? (fix.code !== undefined ? fix.code.split("\n")[info.line - 1] : fix.text) : null;
  const fixLine = fix ? (fix.code !== undefined ? info.line : fix.line) : null;
  const sameLine = fix && fixLine === info.line && !fix.insert;
  const rows = [];
  const lead = (s) => s.match(/^[ \t]*/)[0].length;
  const dedent = sameLine ? Math.min(lead(info.text), lead(fixed)) : lead(info.text);
  const spot = info.spot || { from: 0, to: 0 };
  const showSpot = info.spot && info.spot.to >= info.spot.from;
  rows.push(
    `<div class="err-line"><span class="ln">${info.line}</span>` +
      (showSpot ? codeRow(info.text, spot.from, spot.to, "mark", dedent) : `<code>${escapeHtml(info.text.slice(dedent))}</code>`) +
      `</div>`
  );
  if (fix && fixed != null) {
    // Geänderten Teil finden: gemeinsamer Anfang und gemeinsames Ende
    const old = fix.insert ? "" : sameLine ? info.text : String(code).split("\n")[fixLine - 1] || "";
    let p = 0;
    while (p < old.length && p < fixed.length && old[p] === fixed[p]) p++;
    let q = 0;
    while (q < old.length - p && q < fixed.length - p && old[old.length - 1 - q] === fixed[fixed.length - 1 - q]) q++;
    // An Wortgrenzen einrasten (elif statt el|if, int(…) statt in|t(…)); \n zählt nicht als Wort
    const word = (s, i) => i >= 0 && i < s.length && /[\p{L}\p{N}_]/u.test(s[i]) && s[i - 1] !== "\\";
    while (p > 0 && word(fixed, p - 1) && (word(fixed, p) || word(old, p))) p--;
    while (q > 0 && word(fixed, fixed.length - q) && (word(fixed, fixed.length - q - 1) || word(old, old.length - q - 1))) q--;
    const d = sameLine ? dedent : lead(fixed);
    rows.push(
      `<div class="err-line fix"><span class="ln" title="${t("err.fix")}">${icon("arrowRight", { size: 14, label: t("err.fix") })}${sameLine || fix.insert ? "" : fixLine}</span>` +
        codeRow(fixed, p, fixed.length - q, "ins", d) +
        `</div>`
    );
  }
  const apply = fix && jump ? `<div class="err-fix-bar"><button type="button" class="btn btn-fix" data-apply>${icon("check", { size: 16 })}${t("err.apply")}</button></div>` : "";
  return `<div class="err-code">${rows.join("")}</div>${apply}`;
}

// jump: false für ausprobierte Beispiele (deren Zeilen stehen nicht im Editor)
function renderErrorCard(error, info, { jump = true, code = "" } = {}) {
  const f = info || explainError(error, code);
  const card = document.createElement("div");
  card.className = "err-card";
  card.setAttribute("role", "alert");
  const where =
    error.line && jump
      ? `<button type="button" class="where" title="${t("err.gotoLine")}">${t("err.line", { n: error.line })}</button>`
      : "";
  const original = error.message ? `${error.type}: ${error.message}` : error.type;
  card.innerHTML =
    `<div class="err-title"><span class="ico buddy-ico" aria-hidden="true">${lumo("glitch", { size: 34 })}</span><span class="txt">${f.title}</span>${where}</div>` +
    `<div class="err-msg">${f.hint}</div>` +
    errCodeBlock(f, jump, code) +
    `<div class="err-orig"><code>${escapeHtml(original)}</code></div>` +
    `<details class="err-details"><summary>${t("err.details")}</summary><pre>${escapeHtml(error.traceback || original)}</pre></details>`;
  const whereBtn = card.querySelector(".where");
  if (whereBtn) whereBtn.onclick = () => {
    setTab("code");
    gotoLine(editor, error.line);
  };
  const applyBtn = card.querySelector("[data-apply]");
  if (applyBtn) applyBtn.onclick = () => {
    // Nur auf genau den Code anwenden, der gelaufen ist – sonst passt die Zeile nicht mehr
    if (editor.getValue() !== code) {
      toast(t("err.fixStale"), "fail");
      return;
    }
    setTab("code");
    applyFix(editor, f.fix);
    flushCode();
    applyBtn.disabled = true;
    applyBtn.innerHTML = `${icon("check", { size: 16 })}${t("err.applied")}`;
  };
  term.append(card);
  // Lange Zeilen (Handy): die markierte Stelle in den sichtbaren Bereich schieben
  const box = card.querySelector(".err-code");
  const mark = box && box.querySelector("mark");
  if (mark) requestAnimationFrame(() => {
    if (mark.offsetLeft + mark.offsetWidth > box.clientWidth) box.scrollLeft = mark.offsetLeft - box.clientWidth / 3;
  });
}

// ---- Eingabe für input() ----
function submitInput() {
  if (!runner.awaitingInput) return;
  const val = el.inputField.value;
  term.write(val + "\n", "in");
  term.hideInput();
  setConsoleStatus("running");
  runner.sendInput(val);
}

// ======================================================================
// Zurücksetzen, Lösungen
// ======================================================================
async function resetCode() {
  if (!editor) return;
  const starter = starterFor(currentId);
  if (editor.getValue().trim() !== starter.trim()) {
    const ok = await confirmDialog({
      title: t("reset.title"),
      text: t("reset.text"),
      ok: t("reset.ok"),
      danger: true,
    });
    if (!ok) return;
  }
  editor.setValue(starter); // bleibt mit Strg+Z rückgängig zu machen
  flushCode();
  term.placeholder(t("console.placeholder"));
}

async function loadSolution(code) {
  const cur = editor.getValue().trim();
  const untouched = cur === "" || cur === starterFor(currentId).trim() || cur === code.trim();
  if (!untouched) {
    const ok = await confirmDialog({ title: t("solution.title"), text: t("solution.confirm"), ok: t("solution.ok") });
    if (!ok) return;
  }
  editor.setValue(code);
  flushCode();
  setTab("code");
  toast(t("solution.loaded"), "info");
}

function showSolution() {
  const lesson = currentLesson();
  if (!lesson) return;
  if (!progress.isDone(lesson.id) && !progress.hasTried(lesson.id)) {
    toast(t("solution.tryFirst"), "info", 4500);
    return;
  }
  loadSolution(course.field(lesson, "solution") || "");
}

function showExpertSolution() {
  const lesson = currentLesson();
  if (!lesson || !lesson.expert) return;
  if (!progress.isDone(lesson.id)) {
    toast(t("expert.solutionLocked"), "info", 4500);
    return;
  }
  loadSolution(course.expertField(lesson, "solution") || "");
}

// ======================================================================
// Fortschritt sichern / laden / löschen
// ======================================================================
function exportProgress() {
  const blob = new Blob([progress.exportJSON()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `codaluna-${t("backup.fileName")}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function resetProgress() {
  const ok = await confirmDialog({
    title: t("backup.reset"),
    text: t("backup.resetConfirm"),
    ok: t("backup.resetOk"),
    danger: true,
  });
  if (!ok) return;
  progress.reset();
  Object.keys(hintsShown).forEach((k) => delete hintsShown[k]);
  selectLesson(course.flat[0].lesson.id, { flush: false });
  updateHeader();
  toast(t("backup.resetDone"), "ok");
}

el.importFile.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      progress.importJSON(String(reader.result));
      awardBadges(course, progress);
      selectLesson(course.resumeId(progress), { flush: false });
      updateHeader();
      toast(t("backup.imported"), "ok");
    } catch (_) {
      toast(t("backup.importError"), "fail", 4500);
    }
    el.importFile.value = "";
  };
  reader.readAsText(file);
});

function openDiploma() {
  showDiploma({ defaultName: "", xp: course.xp(progress) });
}

// ======================================================================
// Konto & Cloud-Sync (nur mit konfiguriertem Supabase)
// ======================================================================
let syncTimer = null;
function scheduleSync() {
  if (!currentUser) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => push(getClient(), currentUser, progress), 2500);
}

function onAuthChange(user) {
  const same = (user && user.id) === (currentUser && currentUser.id);
  currentUser = user;
  if (same && user) return; // z. B. erneutes SIGNED_IN beim Tab-Wechsel
  if (user && progress.data.owner && progress.data.owner !== user.id) {
    progress.wipe(); // Stand gehörte einem anderen Konto
  }
  drawSidebar();
  if (user) {
    closeGate();
    flushCode(); // lokaler Code gewinnt beim Zusammenführen
    pullMergePush(getClient(), user, progress).then(() => {
      awardBadges(course, progress);
      refreshViews();
      const stored = progress.getCode(currentId);
      const wanted = stored != null ? stored : starterFor(currentId);
      if (editor && !runner.running && editor.getValue() !== wanted) loadEditor();
      toast(t("auth.signedIn"), "ok");
    });
    startOnboarding();
  } else if (requireLogin) {
    openLogin({ showBanner, gate: true });
  } else {
    startOnboarding();
  }
}

async function doSignOut() {
  flushCode();
  if (currentUser) await push(getClient(), currentUser, progress);
  await signOut();
  // Lokalen Stand verwerfen, damit die nächste Person nicht auf diesem Gerät weitermacht
  progress.wipe();
  selectLesson(course.flat[0].lesson.id, { flush: false });
  updateHeader();
  toast(t("auth.signedOut"), "info");
}

async function deleteAccount() {
  if (!currentUser) return;
  const ok = await confirmDialog({
    title: t("auth.deleteAccount"),
    text: t("auth.deleteConfirm"),
    ok: t("auth.deleteOk"),
    danger: true,
  });
  if (!ok) return;
  const res = await deleteOwnAccount(currentUser);
  if (!res.ok) {
    toast(t("auth.deleteFailed"), "fail", 6000);
    return;
  }
  progress.wipe();
  await signOut();
  selectLesson(course.flat[0].lesson.id, { flush: false });
  updateHeader();
  toast(t("auth.deleted"), "ok");
}

function toggleSound() {
  setSound(!soundOn());
  if (soundOn()) sfx.badge();
  toast(t(soundOn() ? "sound.on" : "sound.off"), "info", 1800);
}

function showSoundState(on) {
  if (!on) stage.stopAudio();
  el.soundBtn.innerHTML = icon(on ? "sound" : "mute");
  el.soundBtn.setAttribute("aria-pressed", String(on));
  drawSidebar();
}

// Kompatible Banner-Funktion für auth.js
function showBanner(text, ok) {
  toast(escapeHtml(text), ok ? "ok" : "fail");
}

// ======================================================================
// Layout: Tabs, Drawer, Sprache, Theme
// ======================================================================
function setTab(tab) {
  const code = tab === "code";
  el.workspace.classList.toggle("show-code", code);
  el.mtabs.querySelectorAll(".mtab").forEach((b) => {
    const on = b.dataset.tab === tab;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", String(on));
  });
  if (code && editor) setTimeout(() => editor.refresh(), 0);
}

function openDrawer() {
  el.sidebar.classList.add("open");
  el.menuBtn.setAttribute("aria-expanded", "true");
  const active = el.sidebar.querySelector(".lesson-item.active") || el.sidebar.querySelector(".lesson-item");
  if (active) active.focus({ preventScroll: false });
}
function closeDrawer() {
  if (!el.sidebar.classList.contains("open")) return;
  el.sidebar.classList.remove("open");
  el.menuBtn.setAttribute("aria-expanded", "false");
}

function buildLangMenu() {
  el.langMenu.innerHTML = LANGS.map(
    (l) =>
      `<button type="button" role="menuitemradio" aria-checked="${l.code === getLocale()}" class="lang-opt${
        l.code === getLocale() ? " active" : ""
      }" data-lang="${l.code}" lang="${l.code}">${l.name}</button>`
  ).join("");
  el.langMenu.querySelectorAll(".lang-opt").forEach((b) => {
    b.onclick = () => {
      closeLangMenu();
      if (b.dataset.lang === getLocale()) return;
      flushCode();
      setLocale(b.dataset.lang);
      applyLocale();
      el.langBtn.focus();
    };
  });
}
function openLangMenu() {
  buildLangMenu();
  el.langMenu.hidden = false;
  el.langBtn.setAttribute("aria-expanded", "true");
  const active = el.langMenu.querySelector(".lang-opt.active") || el.langMenu.querySelector(".lang-opt");
  if (active) active.focus();
}
function closeLangMenu() {
  el.langMenu.hidden = true;
  el.langBtn.setAttribute("aria-expanded", "false");
}

function applyLocale() {
  applyStatic();
  document.title = t("app.title");
  if (editor) setEditorLabel(editor, t("editor.aria"));
  refreshViews();
  // ungeänderten Start-Code in der neuen Sprache zeigen
  if (editor && progress.getCode(currentId) == null && !runner.running) loadEditor();
  if (!el.out.querySelector(".err-card, .result-card") && !runner.running) term.placeholder(t("console.placeholder"));
}

// Der Kopfbereich bleibt in beiden Themes dunkel, daher bleibt auch die Farbe der
// Browserleiste (meta theme-color) unverändert.
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

// ======================================================================
// Ereignisse
// ======================================================================
function wireEvents() {
  el.runBtn.onclick = runCode;
  el.stopBtn.onclick = () => {
    stopAtInput = runner.awaitingInput;
    runner.stop("user");
  };
  el.resetBtn.onclick = resetCode;
  el.solutionBtn.onclick = showSolution;
  el.shareBtn.onclick = shareCode;
  window.addEventListener("hashchange", openShared);
  el.consoleClear.onclick = () => {
    if (!runner.running) term.placeholder(t("console.placeholder"));
  };
  el.statsBtn.onclick = () => showProgress({ course, progress, onGoal: setWeekGoal });
  el.soundBtn.onclick = toggleSound;
  el.inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitInput();
    }
  });
  el.inputSend.onclick = submitInput;
  el.menuBtn.onclick = () => (el.sidebar.classList.contains("open") ? closeDrawer() : openDrawer());
  el.scrim.onclick = closeDrawer;
  el.themeBtn.onclick = () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem("pyquest.theme", next);
    } catch (_) {}
  };
  el.langBtn.onclick = () => (el.langMenu.hidden ? openLangMenu() : closeLangMenu());
  el.langMenu.addEventListener("keydown", (e) => {
    const items = [...el.langMenu.querySelectorAll(".lang-opt")];
    const i = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length].focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeLangMenu();
      el.langBtn.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!el.langMenu.hidden && !el.langMenu.contains(e.target) && !el.langBtn.contains(e.target)) closeLangMenu();
  });
  el.mtabs.querySelectorAll(".mtab").forEach((b) => {
    b.onclick = () => setTab(b.dataset.tab);
  });
  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    } else if (e.key === "Escape" && el.sidebar.classList.contains("open") && !isModalOpen()) {
      closeDrawer();
      el.menuBtn.focus();
    }
  });
  // Code beim Verlassen sichern
  window.addEventListener("pagehide", flushCode);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushCode();
  });
  // Fortschritt aus einem anderen Tab übernehmen
  window.addEventListener("storage", (e) => {
    if (e.key !== "pyquest.progress.v2" || runner.running) return;
    progress.load();
    updateHeader();
    drawSidebar();
    drawLesson();
  });
}

// ======================================================================
// Start
// ======================================================================
function startOnboarding() {
  if (onboardingStarted) return;
  onboardingStarted = true;
  initOnboarding({ el, setTab, isMobile, t, openDrawer, closeDrawer });
}

function boot() {
  initTelemetry({ context: () => ({ lesson: currentId || "", lang: getLocale() }) });
  progress.load();
  progress.onSave = scheduleSync;
  initLocale();
  applyStatic();
  document.title = t("app.title");
  wireEvents();
  el.helpBtn.onclick = () => startTour({ el, setTab, isMobile, t, openDrawer, closeDrawer });

  showSoundState(soundOn());
  onSoundChange(showSoundState);
  awardBadges(course, progress); // nachträglich verdiente Abzeichen still eintragen
  selectLesson(course.resumeId(progress));
  updateHeader();
  el.boot.classList.add("hide");

  runner.onStatus(onRunnerStatus);
  runner.init().catch(() => {});
  if (!runner.shared) term.append(resultCard("warn", "ℹ️", t("run.limitedTitle"), t("run.limited")));

  initOffline(el);
  initAuth({ onAuthChange, showBanner });
  openShared();
  track("pageview");
}

boot();
