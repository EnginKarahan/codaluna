// Codaluna – Lektionsspalte: Erklärung, Aufgabe, gestaffelte Tipps, Bonus-Aufgabe, Navigation.

import { t } from "/src/js/i18n.js";
import { SANDBOX_ID } from "/src/js/course.js";
import { lumo } from "/src/js/companion.js";
import { icon } from "/src/js/icons.js";

// ctx: { course, progress, id, hintsShown, expertOpen,
//        onSelect(id), onHint(), onExpertToggle(open), onExpertSolution(), onTry(code) }
export function renderLessonPane(pane, ctx) {
  if (ctx.id === SANDBOX_ID) {
    renderSandbox(pane);
    return;
  }
  const { course, progress } = ctx;
  const entry = course.get(ctx.id);
  const lesson = entry.lesson;
  const done = progress.isDone(lesson.id);
  const hints = course.field(lesson, "hints") || [];
  const shown = Math.min(ctx.hintsShown || 0, hints.length);
  const expertHtml = lesson.expert ? course.expertField(lesson, "html") : null;
  const bonusDone = progress.hasBonus(lesson.id);
  const next = course.next(lesson.id);
  const prev = course.prev(lesson.id);
  const nextOpen = next && course.isUnlocked(next.lesson.id, progress);

  const hintItems = hints
    .slice(0, shown)
    .map((h, i) => `<div class="hint"><span class="hint-n">${t("lesson.hintN", { n: i + 1 })}</span> ${h}</div>`)
    .join("");
  const hintBtn =
    shown < hints.length
      ? `<button type="button" class="btn btn-ghost hint-btn" id="hint-btn">${icon("bulb")} ${t("lesson.hintShow", { i: shown + 1, n: hints.length })}</button>`
      : "";

  const expert = expertHtml
    ? `<section class="expert${ctx.expertOpen ? " open" : ""}${bonusDone ? " solved" : ""}">
        <button type="button" class="expert-toggle" id="expert-toggle" aria-expanded="${ctx.expertOpen}" aria-controls="expert-body">
          <span class="expert-head">
            <span class="label">${icon("spark")} ${t("expert.label")}</span>
            <span class="xp-chip">${bonusDone ? icon("check", { size: 15 }) + " " + t("expert.solved") : "+" + (lesson.expert.xp || 0) + " XP"}</span>
          </span>
          <span class="sub">${t("expert.sub")}</span>
          <span class="chev" aria-hidden="true">${icon("chevron")}</span>
        </button>
        <div class="expert-body" id="expert-body"${ctx.expertOpen ? "" : " hidden"}>
          ${expertHtml}
          <p class="expert-note">${t("expert.note")}</p>
          ${
            course.expertField(lesson, "solution")
              ? `<button type="button" class="btn btn-ghost" id="expert-solution"${done ? "" : ` aria-disabled="true" title="${t("expert.solutionLocked")}"`}>${icon("eye")} ${t("expert.solution")}</button>`
              : ""
          }
        </div>
      </section>`
    : "";

  // Missions-Aufhänger: Lumo erzählt, worum es auf der Station geht
  const boss = entry.type !== "lesson";
  const story = course.field(lesson, "story");
  const region = course.region(entry.chapter);
  const first = course.chapterEntries(entry.chapterIndex)[0] === entry;
  const regionHtml =
    first && region.intro
      ? `<div class="region-banner"><span class="rb-icon" aria-hidden="true">${icon(region.icon, { size: 20 })}</span><p><b>${region.name}.</b> ${region.intro}</p></div>`
      : "";
  const storyHtml = story
    ? `<div class="story${boss ? " boss" : ""}">
        <span class="story-lumo" aria-hidden="true">${lumo(done ? "happy" : boss ? "curious" : "idle", { size: 48 })}</span>
        <div class="story-text">
          <p><span class="story-who">${t("story.who")}</span> ${story}</p>
          <button type="button" class="linkbtn story-jump">${t("story.jump")}</button>
        </div>
      </div>`
    : "";

  pane.innerHTML = `
    <div class="lesson-head">
      <span class="lesson-kicker${boss ? " boss" : ""}">${boss ? icon(entry.type === "final" ? "flag" : "star", { size: 14 }) : ""}${course.kicker(entry)}</span>
      ${done ? `<span class="lesson-done">${icon("check", { size: 16 })} ${t("lesson.done")}</span>` : ""}
    </div>
    <h1>${course.field(lesson, "title")}</h1>
    ${regionHtml}${storyHtml}
    <div class="lesson-body">
      ${course.field(lesson, "intro") || ""}
      <section class="task" aria-labelledby="task-heading">
        <h2 id="task-heading">${icon("target", { size: 16 })} ${t("lesson.taskHeading")}</h2>
        <div>${course.field(lesson, "taskHtml") || ""}</div>
      </section>
      ${hints.length ? `<div class="hint-box">${hintItems}${hintBtn}</div>` : ""}
      ${expert}
    </div>
    <nav class="lesson-nav" aria-label="${t("a11y.lessonNav")}">
      ${prev ? `<button type="button" class="btn btn-ghost" id="prev-lesson">${icon("arrowLeft", { size: 16 })} ${t("nav.prev")}</button>` : "<span></span>"}
      ${
        next
          ? `<button type="button" class="btn ${done ? "btn-primary" : ""}" id="next-lesson"${nextOpen ? "" : ` aria-disabled="true" title="${t("sidebar.locked")}"`}>${t("nav.next")} ${icon("arrowRight", { size: 16 })}</button>`
          : ""
      }
    </nav>`;

  const hintBtnEl = pane.querySelector("#hint-btn");
  if (hintBtnEl) hintBtnEl.onclick = () => ctx.onHint();
  const toggle = pane.querySelector("#expert-toggle");
  if (toggle) toggle.onclick = () => ctx.onExpertToggle(!ctx.expertOpen);
  const exSol = pane.querySelector("#expert-solution");
  if (exSol) exSol.onclick = () => ctx.onExpertSolution();
  const prevEl = pane.querySelector("#prev-lesson");
  if (prevEl) prevEl.onclick = () => ctx.onSelect(prev.lesson.id);
  const nextEl = pane.querySelector("#next-lesson");
  if (nextEl) nextEl.onclick = () => ctx.onSelect(next.lesson.id);
  const jump = pane.querySelector(".story-jump");
  if (jump) jump.onclick = () => pane.querySelector(".task").scrollIntoView({ behavior: "smooth", block: "start" });
  addTryButtons(pane, ctx.onTry);
}

// Jedes Codebeispiel der Erklärung bekommt „▶ Ausprobieren“ (außer <pre class="norun">).
function addTryButtons(pane, onTry) {
  if (!onTry) return;
  pane.querySelectorAll(".lesson-body pre:not(.norun)").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code || !code.textContent.trim()) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "try-btn";
    btn.innerHTML = `${icon("play", { size: 14 })} ${t("try.btn")}`;
    btn.title = t("try.title");
    btn.onclick = () => onTry(code.textContent);
    pre.classList.add("can-try");
    pre.appendChild(btn);
  });
}

function renderSandbox(pane) {
  pane.innerHTML = `
    <div class="lesson-head"><span class="lesson-kicker sandbox">${t("sandbox.kicker")}</span></div>
    <h1>${t("sandbox.title")}</h1>
    <div class="lesson-body">${t("sandbox.intro")}</div>`;
}
