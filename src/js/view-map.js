// PyQuest – Stationskarte: die Bereiche der Station Polaris leuchten auf, je weiter man ist.
// Dazu der Moment „Bereich wieder online“, wenn ein Kapitel geschafft ist.
// Die Karte ist eine Übersicht, keine Pflicht: Der Lernpfad in der Sidebar bleibt.

import { t } from "/src/js/i18n.js";
import { openModal } from "/src/js/ui.js";
import { lumo } from "/src/js/companion.js";
import { escapeHtml } from "/src/js/errors.js";
import { icon } from "/src/js/icons.js";

const HEX = (x, y, r) =>
  [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
    })
    .join(" ");

// Zustand eines Bereichs: offline (nichts erledigt), partly, online (alles erledigt)
function regionState(course, progress, ci) {
  const p = course.chapterProgress(ci, progress);
  const target = course.chapterTarget(ci, progress);
  return { ...p, state: p.complete ? "online" : p.done ? "partly" : "offline", open: !!target, target };
}

// Verbindungen: Hauptkurs als Ring, Nebenstränge an ihren Andockpunkt (region.link)
function links(course) {
  const out = [];
  const main = course.mainChapters;
  main.forEach((ch, i) => {
    const next = main[(i + 1) % main.length];
    if (main.length > 1 && (i + 1 < main.length || main.length > 2)) out.push([ch, next]);
  });
  for (const ch of course.chapters) {
    if (ch.strand && ch.region && ch.region.link) {
      const to = course.chapters.find((c) => c.id === ch.region.link);
      if (to) out.push([ch, to]);
    }
  }
  return out;
}

// Icon eines Bereichs als verschachteltes SVG (24 × 24) für die Karte
function mapIcon(name) {
  return icon(name, { size: 24 }).replace("<svg ", '<svg x="0" y="0" ').replace('stroke-width="1.6"', 'stroke-width="1.5"');
}

// SVG der Station. highlight: Kapitelindex, der gerade online gegangen ist
export function mapSvg({ course, progress, currentChapter = -1, highlight = -1 }) {
  const stars = Array.from({ length: 34 }, (_, i) => {
    const x = (i * 97) % 400;
    const y = (i * 53) % 120;
    return `<circle cx="${x}" cy="${y}" r="${i % 5 === 0 ? 1.3 : 0.7}"/>`;
  }).join("");
  const corridors = links(course)
    .map(([a, b]) => {
      const [x1, y1] = course.region(a).pos;
      const [x2, y2] = course.region(b).pos;
      const lit = course.chapterProgress(course.chapters.indexOf(a), progress).done > 0 && course.chapterProgress(course.chapters.indexOf(b), progress).done > 0;
      return `<line class="map-corridor${lit ? " lit" : ""}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    })
    .join("");
  const nodes = course.chapters
    .map((ch, ci) => {
      const r = course.region(ch);
      const [x, y] = r.pos;
      const st = regionState(course, progress, ci);
      const label = `${r.name}: ${t("map.count", { done: st.done, n: st.total })}`;
      const ring = st.total ? (st.done / st.total) * 2 * Math.PI * 34 : 0;
      return `<g class="map-node ${st.state}${st.open ? "" : " locked"}${ci === highlight ? " flash" : ""}" data-chapter="${ci}"
          tabindex="0" role="button" aria-label="${escapeHtml(label)}">
        <circle class="map-glow" cx="${x}" cy="${y}" r="40"/>
        <polygon class="map-hex" points="${HEX(x, y, 28)}"/>
        <circle class="map-ring" cx="${x}" cy="${y}" r="34" stroke-dasharray="${ring.toFixed(1)} 400" transform="rotate(-90 ${x} ${y})"/>
        <g class="map-icon" transform="translate(${x - 12} ${y - 12})">${mapIcon(r.icon)}</g>
        <text class="map-label" x="${x}" y="${y + 52}" text-anchor="middle">${escapeHtml(r.name)}</text>
      </g>`;
    })
    .join("");
  let marker = "";
  if (currentChapter >= 0 && course.chapters[currentChapter]) {
    const [x, y] = course.region(course.chapters[currentChapter]).pos;
    marker = `<g class="map-lumo" transform="translate(${x + 18} ${y - 52})">${lumo("idle", { size: 30 }).replace("<svg ", '<svg x="0" y="0" ')}</g>`;
  }
  return `<svg class="map-svg" viewBox="0 0 400 324" role="group" aria-label="${escapeHtml(t("map.title"))}">
    <rect width="400" height="324" fill="#0f1114"/>
    <g class="map-stars">${stars}</g>
    <g class="map-planet"><circle cx="338" cy="44" r="22"/><ellipse cx="338" cy="44" rx="36" ry="7"/></g>
    <ellipse class="map-ground" cx="200" cy="334" rx="300" ry="160"/>
    ${corridors}${nodes}${marker}
  </svg>`;
}

// Karte als Dialog. onPick(lessonId) öffnet eine Mission, onLocked() meldet einen gesperrten Bereich.
export function showMap({ course, progress, currentId, onPick, onLocked }) {
  const cur = course.get(currentId);
  const currentChapter = cur ? cur.chapterIndex : -1;
  const list = course.chapters
    .map((ch, ci) => {
      const r = course.region(ch);
      const st = regionState(course, progress, ci);
      const pct = st.total ? Math.round((st.done / st.total) * 100) : 0;
      const status = st.state === "online" ? t("map.online") : st.open ? t("map.count", { done: st.done, n: st.total }) : t("map.locked");
      return `<button type="button" class="map-item ${st.state}${st.open ? "" : " locked"}" data-chapter="${ci}"${st.open ? "" : ' aria-disabled="true"'}>
        <span class="map-item-icon" aria-hidden="true">${icon(r.icon, { size: 20 })}</span>
        <span class="map-item-txt">
          <span class="map-item-name">${escapeHtml(r.name)} <span class="map-item-label">${course.chapterLabel(ci)}</span></span>
          <span class="map-item-bar"><i style="width:${pct}%"></i></span>
          <span class="map-item-status">${status}</span>
        </span>
      </button>`;
    })
    .join("");
  const m = openModal({
    label: t("map.title"),
    className: "map-modal",
    closeButton: true,
    html: `
      <h2>${t("map.title")}</h2>
      <p>${t("map.intro")}</p>
      <div class="map-frame">${mapSvg({ course, progress, currentChapter })}</div>
      <div class="map-list">${list}</div>
      <div class="modal-actions"><button type="button" class="btn" data-close>${t("dlg.close")}</button></div>`,
  });
  const pick = (ci) => {
    const target = course.chapterTarget(ci, progress);
    if (!target) return onLocked(ci);
    m.close();
    onPick(target);
  };
  m.el.querySelectorAll("[data-chapter]").forEach((node) => {
    node.addEventListener("click", () => pick(Number(node.dataset.chapter)));
    node.addEventListener("keydown", (e) => {
      if (node.tagName !== "BUTTON" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        pick(Number(node.dataset.chapter));
      }
    });
  });
  m.el.querySelector("[data-close]").onclick = () => m.close();
}

// „Bereich wieder online“: nach dem letzten erledigten Einsatz eines Kapitels.
// actions: [{label, primary, onClick}]
export function showRegionOnline({ course, progress, chapterIndex, actions = [] }) {
  const ch = course.chapters[chapterIndex];
  const r = course.region(ch);
  const m = openModal({
    label: t("map.onlineTitle", { name: r.name }),
    className: "region-modal",
    html: `
      <div class="region-lumo" aria-hidden="true">${lumo("proud", { size: 76 })}</div>
      <h2>${icon(r.icon, { size: 22 })} ${t("map.onlineTitle", { name: escapeHtml(r.name) })}</h2>
      ${r.outro ? `<p>${r.outro}</p>` : ""}
      <div class="map-frame small">${mapSvg({ course, progress, currentChapter: chapterIndex, highlight: chapterIndex })}</div>
      <div class="modal-actions"></div>`,
  });
  const row = m.el.querySelector(".modal-actions");
  for (const a of [...actions, { label: t("dlg.close"), primary: !actions.some((x) => x.primary) }]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn " + (a.primary ? "btn-primary" : "btn-ghost");
    b.textContent = a.label;
    b.onclick = () => {
      m.close();
      if (a.onClick) a.onClick();
    };
    row.appendChild(b);
  }
  return m;
}
