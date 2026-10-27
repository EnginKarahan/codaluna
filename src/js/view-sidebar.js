// PyQuest – Lernpfad (Sidebar): Spielplatz, Kapitel mit Lektionen, Fußbereich.

import { t } from "/src/js/i18n.js";
import { SANDBOX_ID } from "/src/js/course.js";
import { escapeHtml } from "/src/js/errors.js";
import { icon } from "/src/js/icons.js";

// ctx: { course, progress, currentId, account: {enabled, user}, sound,
//        onSelect(id), onLocked(id), actions: {map, badges, workshop, sound, diploma, export, import, reset, signIn, signOut, deleteAccount} }
export function renderSidebar(nav, ctx) {
  const { course, progress } = ctx;
  const parts = [];

  parts.push(
    `<button type="button" class="lesson-item sandbox-item${ctx.currentId === SANDBOX_ID ? " active" : ""}" data-id="${SANDBOX_ID}"${
      ctx.currentId === SANDBOX_ID ? ' aria-current="page"' : ""
    }>
      <span class="mark" aria-hidden="true">${icon("flask")}</span><span class="title">${t("sandbox.kicker")}</span>
    </button>`,
    `<button type="button" class="lesson-item sandbox-item map-entry" data-act="map">
      <span class="mark" aria-hidden="true">${icon("map")}</span><span class="title">${t("map.title")}</span>
    </button>`
  );

  let sideHead = false;
  course.chapters.forEach((ch, ci) => {
    const entries = course.flat.filter((e) => e.chapterIndex === ci);
    const doneCount = entries.filter((e) => progress.isDone(e.lesson.id)).length;
    const region = course.region(ch);
    if (ch.strand && !sideHead) {
      sideHead = true;
      parts.push(`<div class="strand-head">${t("sidebar.sideMissions")}</div>`);
    }
    parts.push(
      `<div class="chapter-title${ch.strand ? " side" : ""}"><span class="ch-label"><span class="ch-icon" aria-hidden="true">${icon(region.icon, { size: 14 })}</span>${course.chapterLabel(ci)} · ${region.name}</span>` +
        `<span class="ch-name">${course.chapterTitle(ch)}</span>` +
        `<span class="ch-count" title="${t("sidebar.chapterCount", { done: doneCount, n: entries.length })}">${doneCount}/${entries.length}</span></div>`
    );
    entries.forEach((e, li) => {
      const id = e.lesson.id;
      const done = progress.isDone(id);
      const unlocked = course.isUnlocked(id, progress);
      const active = ctx.currentId === id;
      const mark = done ? icon("check") : !unlocked ? icon("lock") : e.type === "boss" ? icon("star") : e.type === "final" ? icon("flag") : e.number;
      const cls = [
        "lesson-item",
        li === 0 ? "first" : "",
        li === entries.length - 1 ? "last" : "",
        done ? "done" : "",
        unlocked ? "" : "locked",
        active ? "active" : "",
        e.type !== "lesson" ? e.type : "",
      ]
        .filter(Boolean)
        .join(" ");
      const req = !unlocked && course.missingRequirement(id, progress);
      const tip = req
        ? t("sidebar.requires", { title: course.field(req.lesson, "title") })
        : !unlocked
          ? t("sidebar.locked")
          : done
            ? t("sidebar.done")
            : "";
      const bonus = e.lesson.expert && progress.hasBonus(id) ? `<span class="bonus-star" title="${t("expert.solved")}">${icon("spark", { size: 15 })}</span>` : "";
      parts.push(
        `<button type="button" class="${cls}" data-id="${id}"${tip ? ` title="${tip}"` : ""}${unlocked ? "" : ' aria-disabled="true"'}${
          active ? ' aria-current="page"' : ""
        }>` +
          `<span class="mark" aria-hidden="true">${mark}</span>` +
          `<span class="title">${course.field(e.lesson, "title")}</span>${bonus}` +
          `</button>`
      );
    });
  });

  // Fußbereich: Fortschritt, Konto, Sichern, Rechtliches
  const s = course.stats(progress);
  const acc = ctx.account;
  const foot = [];
  foot.push(`<button type="button" class="side-action" data-act="badges">${icon("award")} ${t("sidebar.progress")}</button>`);
  foot.push(`<button type="button" class="side-action" data-act="workshop">${icon("wrench")} ${t("workshop.title")}</button>`);
  foot.push(
    `<button type="button" class="side-action" data-act="sound" aria-pressed="${!!ctx.sound}">${icon(ctx.sound ? "sound" : "mute")} ${t(ctx.sound ? "sound.isOn" : "sound.isOff")}</button>`
  );
  if (s.finished) foot.push(`<button type="button" class="side-action" data-act="diploma">${icon("cap")} ${t("diploma.view")}</button>`);
  if (acc.enabled) {
    if (acc.user) {
      foot.push(
        `<div class="side-account"><span class="acct-email" title="${escapeHtml(acc.user.email || "")}">${escapeHtml(acc.user.email || t("auth.account"))}</span></div>`,
        `<button type="button" class="side-action" data-act="signOut">${icon("logout")} ${t("auth.signOut")}</button>`
      );
    } else {
      foot.push(`<button type="button" class="side-action" data-act="signIn">${icon("user")} ${t("auth.signIn")}</button>`);
    }
  }
  foot.push(
    `<button type="button" class="side-action" data-act="export">${icon("download")} ${t("backup.export")}</button>`,
    `<button type="button" class="side-action" data-act="import">${icon("upload")} ${t("backup.import")}</button>`,
    `<button type="button" class="side-action danger" data-act="reset">${icon("trash")} ${t("backup.reset")}</button>`
  );
  if (acc.enabled && acc.user) {
    foot.push(`<button type="button" class="side-action danger" data-act="deleteAccount">${icon("xCircle")} ${t("auth.deleteAccount")}</button>`);
  }
  foot.push(
    `<div class="side-legal"><a href="/eltern.html">${t("legal.parents")}</a> · <a href="/impressum.html">${t("legal.impressum")}</a> · <a href="/datenschutz.html">${t("legal.datenschutz")}</a></div>`
  );
  parts.push(`<div class="sidebar-footer">${foot.join("")}</div>`);

  nav.innerHTML = parts.join("");

  nav.querySelectorAll(".lesson-item[data-id]").forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.id;
      if (id !== SANDBOX_ID && !course.isUnlocked(id, progress)) ctx.onLocked(id);
      else ctx.onSelect(id);
    };
  });
  nav.querySelectorAll("[data-act]").forEach((b) => {
    b.onclick = () => ctx.actions[b.dataset.act]();
  });

  const active = nav.querySelector(".lesson-item.active");
  if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
}
