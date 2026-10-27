// Codaluna – Einstieg: Willkommens-Dialog beim ersten Start + geführte Tour.
// ctx = { el, setTab, isMobile, t, openDrawer, closeDrawer }

import { openModal } from "/src/js/ui.js";
import { lumo } from "/src/js/companion.js";

const SEEN_KEY = "pyquest.onboarded.v1";

export function initOnboarding(ctx) {
  let seen = false;
  try {
    seen = !!localStorage.getItem(SEEN_KEY);
  } catch (_) {}
  if (!seen) showWelcome(ctx);
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch (_) {}
}

function showWelcome(ctx) {
  const t = ctx.t;
  const m = openModal({
    label: t("ob.welcomeTitle"),
    className: "welcome-modal",
    onClose: markSeen,
    html: `
      <div class="modal-logo welcome-lumo" aria-hidden="true">${lumo("happy", { size: 84 })}</div>
      <h2>${t("ob.welcomeTitle")}</h2>
      <p>${t("ob.welcomeBody")}</p>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-tour>${t("ob.tour")}</button>
        <button type="button" class="btn btn-ghost" data-skip>${t("ob.skip")}</button>
      </div>
      <p class="welcome-parents"><a href="/eltern.html">${t("ob.parents")}</a></p>`,
  });
  m.el.querySelector("[data-skip]").onclick = () => m.close();
  m.el.querySelector("[data-tour]").onclick = () => {
    m.close();
    startTour(ctx);
  };
}

function tourSteps(ctx) {
  const t = ctx.t;
  const mobile = ctx.isMobile();
  return [
    { sel: "#lesson-pane", tab: "task", title: t("ob.step1.title"), text: t("ob.step1.text") },
    { sel: ".editor-host", tab: "code", title: t("ob.step2.title"), text: t("ob.step2.text") },
    { sel: "#run-btn", tab: "code", title: t("ob.step3.title"), text: t("ob.step3.text") },
    { sel: "#console-out", tab: "code", title: t("ob.step4.title"), text: t("ob.step4.text") },
    {
      sel: mobile ? "#menu-btn" : "#sidebar",
      title: t("ob.step5.title"),
      text: mobile ? t("ob.step5.textMobile") : t("ob.step5.text"),
    },
    { sel: "#stats-btn", title: t("ob.step6.title"), text: t("ob.step6.text") },
  ];
}

export function startTour(ctx) {
  if (document.querySelector(".tour")) return;
  markSeen();
  if (ctx.closeDrawer) ctx.closeDrawer();
  const steps = tourSteps(ctx);
  let i = 0;

  const overlay = document.createElement("div");
  overlay.className = "tour";
  overlay.innerHTML = `<div class="tour-spot"></div><div class="tour-card" role="dialog" aria-modal="true"></div>`;
  document.body.appendChild(overlay);
  const spot = overlay.querySelector(".tour-spot");
  const card = overlay.querySelector(".tour-card");
  const before = document.activeElement;

  const onKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cleanup();
    } else if (e.key === "ArrowRight") {
      next();
    } else if (e.key === "ArrowLeft" && i > 0) {
      i--;
      show();
    }
  };
  function cleanup() {
    overlay.remove();
    window.removeEventListener("resize", onResize);
    document.removeEventListener("keydown", onKey, true);
    ctx.setTab("task");
    if (before && before.focus) before.focus({ preventScroll: true });
  }
  function next() {
    i++;
    if (i >= steps.length) return cleanup();
    show();
  }
  function show() {
    const s = steps[i];
    if (s.tab) ctx.setTab(s.tab);
    requestAnimationFrame(() => render(true));
  }
  function render(focus) {
    const s = steps[i];
    const target = document.querySelector(s.sel);
    if (!target || !target.getClientRects().length) return next();
    const r = target.getBoundingClientRect();
    const pad = 6;
    Object.assign(spot.style, {
      left: r.left - pad + "px",
      top: r.top - pad + "px",
      width: r.width + pad * 2 + "px",
      height: r.height + pad * 2 + "px",
    });
    card.setAttribute("aria-label", s.title);
    card.innerHTML = `
      <div class="tour-step">${ctx.t("ob.stepCounter", { i: i + 1, n: steps.length })}</div>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
      <div class="tour-actions">
        <button type="button" class="btn btn-ghost" data-skip>${ctx.t("ob.skipTour")}</button>
        <button type="button" class="btn btn-primary" data-next>${i === steps.length - 1 ? ctx.t("ob.finish") : ctx.t("ob.next")}</button>
      </div>`;
    card.querySelector("[data-skip]").onclick = cleanup;
    card.querySelector("[data-next]").onclick = next;
    if (focus) card.querySelector("[data-next]").focus({ preventScroll: true });

    // Karte unter oder über das Ziel setzen, sonst mittig
    const cw = Math.min(340, window.innerWidth - 24);
    card.style.width = cw + "px";
    const ch = card.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 14;
    const left = Math.min(Math.max(12, r.left), vw - cw - 12);
    let top;
    if (vh - r.bottom > ch + margin) top = r.bottom + margin;
    else if (r.top - ch - margin > 12) top = r.top - ch - margin;
    else top = Math.max(12, (vh - ch) / 2);
    card.style.left = left + "px";
    card.style.top = top + "px";
  }

  const onResize = () => render(false);
  window.addEventListener("resize", onResize);
  document.addEventListener("keydown", onKey, true);
  show();
}
