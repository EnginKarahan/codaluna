// Codaluna – Fortschritt & Abzeichen (Dialog). Nur selbstbezogen, keine Ranglisten.
// Wochenziel statt Streak: selbst gewählt, verpasste Tage setzen nichts zurück.

import { t, fmtNumber } from "/src/js/i18n.js";
import { XP_PER_LEVEL } from "/src/js/course.js";
import { badgeList, badgeKey, badgeIcon } from "/src/js/badges.js";
import { icon } from "/src/js/icons.js";
import { WEEK_GOALS } from "/src/js/progress.js";
import { openModal } from "/src/js/ui.js";

function badgeItem(b, progress) {
  const has = !!progress.data.badges[b.id];
  const key = badgeKey(b);
  const params = { n: b.chapter || "" };
  // Geheime Abzeichen verraten vor dem Finden nur ein Rätsel
  const name = b.secret && !has ? t("badge.secret.name") : t(key + ".name", params);
  const desc = b.secret && !has ? t(key + ".riddle") : t(key + ".desc", params);
  // Nicht verdiente Abzeichen zeigen ihr Icon gedimmt, geheime nur ein Fragezeichen
  const ico = b.secret && !has ? icon("help", { size: 20 }) : badgeIcon(b, 20);
  return `<li class="badge${has ? " earned" : ""}${b.secret ? " secret" : ""}">
    <span class="ico" aria-hidden="true">${ico}</span>
    <span class="txt">
      <span class="name">${name}</span>
      <span class="desc">${desc}</span>
    </span>
  </li>`;
}

// onGoal(n): Wochenziel ändern (die App aktualisiert danach die Kopfzeile)
export function showProgress({ course, progress, onGoal }) {
  const s = course.stats(progress);
  const badges = badgeList(course);
  const shown = badges.filter((b) => !b.secret);
  const earned = shown.filter((b) => progress.data.badges[b.id]).length;
  const pct = Math.round((s.xpInLevel / XP_PER_LEVEL) * 100);
  const visible = shown.map((b) => badgeItem(b, progress)).join("");
  const secret = badges.filter((b) => b.secret);
  const found = secret.filter((b) => progress.data.badges[b.id]).length;
  const secretItems = secret.map((b) => badgeItem(b, progress)).join("");
  const days = progress.weekDays();
  const goals = WEEK_GOALS.map(
    (n) => `<button type="button" class="goal-opt${n === progress.weekGoal ? " active" : ""}" data-goal="${n}" aria-pressed="${n === progress.weekGoal}">${n}</button>`
  ).join("");

  const m = openModal({
    label: t("progress.title"),
    className: "progress-modal",
    closeButton: true,
    html: `
      <h2>${t("progress.title")}</h2>
      <div class="pg-level">
        <div class="pg-badge">${s.level}</div>
        <div class="pg-xp">
          <div class="pg-row"><b>${t("progress.level", { n: s.level })}</b><span>${t("progress.toNext", {
            have: s.xpInLevel,
            need: XP_PER_LEVEL,
            n: s.level + 1,
          })}</span></div>
          <div class="xp-bar big"><span class="xp-fill" style="width:${pct}%"></span></div>
          <div class="pg-total">${t("progress.total", { xp: fmtNumber(s.xp) })}</div>
        </div>
      </div>
      <div class="pg-stats">
        <div><span class="n">${days}/${progress.weekGoal}</span><span class="l">${t("progress.week")}</span></div>
        <div><span class="n">${s.lessonsDone}/${s.lessonsTotal}</span><span class="l">${t("progress.lessons")}</span></div>
        <div><span class="n">${s.bonusDone}/${s.bonusTotal}</span><span class="l">${t("progress.bonus")}</span></div>
      </div>
      <div class="pg-goal">
        <span class="pg-goal-label" id="goal-label">${t("progress.goalLabel")}</span>
        <span class="goal-opts" role="group" aria-labelledby="goal-label">${goals}</span>
        <span class="pg-goal-note">${t("progress.goalNote", { n: progress.weeksMet })}</span>
      </div>
      <h3>${t("progress.badges", { n: earned, total: shown.length })}</h3>
      <ul class="badge-grid">${visible}</ul>
      <h3>${t("progress.secrets", { n: found, total: secret.length })}</h3>
      <ul class="badge-grid">${secretItems}</ul>
      <p class="pg-note">${t("progress.note")}</p>
      <div class="modal-actions"><button type="button" class="btn" data-close>${t("dlg.close")}</button></div>`,
  });
  m.el.querySelector("[data-close]").onclick = () => m.close();
  m.el.querySelectorAll("[data-goal]").forEach((b) => {
    b.onclick = () => {
      const n = Number(b.dataset.goal);
      if (onGoal) onGoal(n);
      m.el.querySelectorAll("[data-goal]").forEach((x) => {
        const on = Number(x.dataset.goal) === n;
        x.classList.toggle("active", on);
        x.setAttribute("aria-pressed", String(on));
      });
      const stat = m.el.querySelector(".pg-stats .n");
      if (stat) stat.textContent = `${progress.weekDays()}/${n}`;
    };
  });
}
