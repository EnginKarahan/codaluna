// Codaluna – Diplom am Kursende. Rein clientseitig, offline-tauglich.
// SVG-Urkunde mit editierbarem Namen; Download als PNG (3-fache Auflösung, Fallback SVG).

import { t, getLocale, fmtNumber } from "/src/js/i18n.js";
import { escapeHtml } from "/src/js/errors.js";
import { openModal } from "/src/js/ui.js";

const W = 820;
const H = 580;
const SCALE = 3; // druckfähige Auflösung

function buildSVG({ name, xp, date }) {
  const displayName = escapeHtml(name.trim() || t("diploma.namePlaceholder"));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" rx="18" fill="#fbf6ea"/>
  <rect x="16" y="16" width="788" height="548" rx="12" fill="none" stroke="#c97f12" stroke-width="3"/>
  <rect x="26" y="26" width="768" height="528" rx="8" fill="none" stroke="#0b6b58" stroke-width="1.5"/>
  <g transform="translate(378 64) scale(2)" fill="none" stroke-linejoin="round"><path d="M16 2 27.86 8.5v13L16 30 4.14 21.5v-13z" stroke="#0b6b58" stroke-width="2"/><path d="M12 12l4 4-4 4M18 20h4" stroke="#c97f12" stroke-width="2.2" stroke-linecap="round"/></g>
  <text x="410" y="176" text-anchor="middle" font-family="'Atkinson Hyperlegible Next', Verdana, sans-serif" font-size="30" font-weight="700" letter-spacing="2" fill="#241d12">${escapeHtml(t("diploma.certTitle"))}</text>
  <line x1="300" y1="196" x2="520" y2="196" stroke="#c97f12" stroke-width="2"/>
  <text x="410" y="256" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#5c5341">${escapeHtml(t("diploma.awardedTo"))}</text>
  <text x="410" y="312" text-anchor="middle" font-family="'Atkinson Hyperlegible Next', Verdana, sans-serif" font-size="40" font-weight="700" fill="#0f5e50">${displayName}</text>
  <text x="410" y="366" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#241d12">${escapeHtml(t("diploma.completed"))}</text>
  <text x="410" y="428" text-anchor="middle" font-family="'Atkinson Hyperlegible Next', Verdana, sans-serif" font-size="17" fill="#5c5341">${escapeHtml(t("diploma.xpLine", { xp: fmtNumber(xp), date }))}</text>
  <text x="410" y="516" text-anchor="middle" font-family="'Atkinson Hyperlegible Next', Verdana, sans-serif" font-size="20" font-weight="700" fill="#241d12">Codaluna</text>
</svg>`;
}

function triggerDownload(href, filename) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 2000);
}

function downloadFromSVG(svg) {
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = W * SCALE;
      canvas.height = H * SCALE;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, W * SCALE, H * SCALE);
      canvas.toBlob((blob) => {
        if (!blob) return triggerDownload(svgUrl, "codaluna-diplom.svg");
        triggerDownload(URL.createObjectURL(blob), "codaluna-diplom.png");
        URL.revokeObjectURL(svgUrl);
      }, "image/png");
    } catch (_) {
      triggerDownload(svgUrl, "codaluna-diplom.svg");
    }
  };
  img.onerror = () => triggerDownload(svgUrl, "codaluna-diplom.svg");
  img.src = svgUrl;
}

export function showDiploma({ defaultName = "", xp = 0 } = {}) {
  let date;
  try {
    date = new Date().toLocaleDateString(getLocale(), { day: "numeric", month: "long", year: "numeric" });
  } catch (_) {
    date = new Date().toLocaleDateString();
  }
  let name = defaultName;

  const m = openModal({
    label: t("diploma.title"),
    className: "diploma-modal",
    html: `
      <h2>${t("diploma.congrats")}</h2>
      <div class="diploma-cert"></div>
      <input class="diploma-name-input" maxlength="40" placeholder="${t("diploma.namePlaceholder")}"
             aria-label="${t("diploma.namePlaceholder")}" value="${escapeHtml(name)}" data-autofocus />
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-dl>${t("diploma.download")}</button>
        <button type="button" class="btn btn-ghost" data-close>${t("dlg.close")}</button>
      </div>`,
  });
  const cert = m.el.querySelector(".diploma-cert");
  const render = () => {
    cert.innerHTML = buildSVG({ name, xp, date });
  };
  m.el.querySelector(".diploma-name-input").oninput = (e) => {
    name = e.target.value;
    render();
  };
  m.el.querySelector("[data-close]").onclick = () => m.close();
  m.el.querySelector("[data-dl]").onclick = () => downloadFromSVG(buildSVG({ name, xp, date }));
  render();
}
