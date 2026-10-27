// PyQuest – eigene Strich-Icons (20er-Raster, eine Linienstärke, runde Enden wie im Logo).
// Ersetzt Emojis in der Oberfläche: Emojis sehen auf jedem Gerät anders aus und
// machen die Oberfläche unruhig. Unbekannte Namen werden als Text ausgegeben
// (z. B. ein Emoji aus eigenen Kursinhalten), damit nichts verschwindet.

const FILL = 'fill="currentColor"';

const PATHS = {
  // Bedienung
  menu: '<path d="M3 5.5h14M3 10h14M3 14.5h14"/>',
  globe:
    '<circle cx="10" cy="10" r="7.25"/><path d="M2.75 10h14.5M10 2.75c-2.1 2-3.1 4.4-3.1 7.25s1 5.25 3.1 7.25c2.1-2 3.1-4.4 3.1-7.25S12.1 4.75 10 2.75z"/>',
  sound: '<path d="M3 7.5h2.8L10 4v12l-4.2-3.5H3z"/><path d="M13 7.3a3.8 3.8 0 0 1 0 5.4M15.2 5.1a7 7 0 0 1 0 9.8"/>',
  mute: '<path d="M3 7.5h2.8L10 4v12l-4.2-3.5H3z"/><path d="M13 8l4 4M17 8l-4 4"/>',
  contrast: `<circle cx="10" cy="10" r="7"/><path d="M10 3a7 7 0 0 1 0 14z" ${FILL}/>`,
  download: '<path d="M10 3v9.5M6.2 8.8 10 12.5l3.8-3.7M3.5 13.5v3h13v-3"/>',
  upload: '<path d="M10 12.5V3M6.2 6.7 10 3l3.8 3.7M3.5 13.5v3h13v-3"/>',
  help: `<circle cx="10" cy="10" r="7.25"/><path d="M7.8 8a2.3 2.3 0 1 1 3.4 2c-.7.4-1.2.9-1.2 1.7v.3"/><circle cx="10" cy="14.4" r=".95" ${FILL} stroke="none"/>`,
  play: `<path d="M6.5 4.6v10.8L15.2 10z" ${FILL}/>`,
  stop: `<rect x="5.5" y="5.5" width="9" height="9" rx="1.2" ${FILL}/>`,
  link: '<path d="M8.6 11.4l2.8-2.8M7.3 9.2 5.4 11.1a2.8 2.8 0 0 0 4 4l1.9-1.9M12.7 10.8l1.9-1.9a2.8 2.8 0 0 0-4-4L8.7 6.8"/>',
  reset: '<path d="M3.5 10a6.5 6.5 0 1 0 2-4.7L3.5 7.3M3.5 3.5v3.8h3.8"/>',
  eye: '<path d="M2 10s2.9-5.5 8-5.5S18 10 18 10s-2.9 5.5-8 5.5S2 10 2 10z"/><circle cx="10" cy="10" r="2.4"/>',
  eraser: '<path d="M11 3.5 16.5 9 9 16.5 3.5 11zM6.8 7.7l5.5 5.5M9 16.5h8"/>',
  check: '<path d="M4.5 10.5l3.6 3.5 7.4-8"/>',
  lock: '<rect x="4.5" y="8.8" width="11" height="8.2" rx="1.6"/><path d="M7 8.8V6.5a3 3 0 0 1 6 0v2.3"/>',
  star: '<path d="M10 2.8l2.1 4.5 4.9.6-3.6 3.4.9 4.9L10 13.8l-4.3 2.4.9-4.9L3 7.9l4.9-.6z"/>',
  flag: '<path d="M5 17.5V3M5 3.8h9.5l-2.2 3.4 2.2 3.4H5"/>',
  flask: '<path d="M7.5 2.8h5M8.6 2.8v5.1L4.2 15.2a1.3 1.3 0 0 0 1.1 2h9.4a1.3 1.3 0 0 0 1.1-2l-4.4-7.3V2.8M6.2 12.3h7.6"/>',
  map: '<path d="M2.8 5.2 7.4 3l5.2 2.2L17.2 3v11.8L12.6 17l-5.2-2.2-4.6 2.2zM7.4 3v11.8M12.6 5.2V17"/>',
  chevron: '<path d="M5.5 8l4.5 4.5L14.5 8"/>',
  arrowRight: '<path d="M3.8 10h12M11.8 6l4 4-4 4"/>',
  arrowLeft: '<path d="M16.2 10h-12M8.2 6l-4 4 4 4"/>',
  arrowDown: '<path d="M10 3.8v12M6 11.8l4 4 4-4"/>',
  close: '<path d="M5 5l10 10M15 5 5 15"/>',
  enter: '<path d="M16 4.5v5a2 2 0 0 1-2 2H4.5M8 8l-3.5 3.5L8 15"/>',
  search: '<circle cx="8.6" cy="8.6" r="5"/><path d="M12.3 12.3l4.5 4.5"/>',
  // Lernpfad, Konto, Sichern
  award: '<circle cx="10" cy="8" r="5"/><path d="M7.1 12.1 6 18l4-2.1 4 2.1-1.1-5.9"/>',
  wrench: '<path d="M12.5 3.2a4.3 4.3 0 0 0-4.6 5.9L3.4 13.6a1.9 1.9 0 0 0 2.7 2.7l4.5-4.5a4.3 4.3 0 0 0 5.9-4.6l-2.6 2.6-2.4-.4-.4-2.4z"/>',
  trash: '<path d="M3.8 5.8h12.4M8 5.8v-2h4v2M5.4 5.8l.8 10.9h7.6l.8-10.9"/>',
  logout: '<path d="M8.5 3.5H4.2v13h4.3M12.2 6.3 15.9 10l-3.7 3.7M15.9 10H8"/>',
  user: '<circle cx="10" cy="7" r="3.3"/><path d="M3.8 17.2a6.2 6.2 0 0 1 12.4 0"/>',
  xCircle: '<circle cx="10" cy="10" r="7.2"/><path d="M7.4 7.4l5.2 5.2M12.6 7.4l-5.2 5.2"/>',
  key: '<circle cx="6.6" cy="13.4" r="3.4"/><path d="M9 11l7.5-7.5M13.6 6.4l2 2M11.6 8.4l1.4 1.4"/>',
  // Rückmeldungen
  bulb: '<path d="M7.6 14.6h4.8M8.2 17.2h3.6M7.5 12.6a5.2 5.2 0 1 1 5 0c-.4.4-.6.9-.6 1.4v.6H8.1V14c0-.5-.2-1-.6-1.4z"/>',
  spark: '<path d="M10 2.5l1.7 5.8 5.8 1.7-5.8 1.7-1.7 5.8-1.7-5.8L2.5 10l5.8-1.7z"/>',
  sparks: '<path d="M8 4l1.3 4.7L14 10l-4.7 1.3L8 16l-1.3-4.7L2 10l4.7-1.3zM15 2.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z"/>',
  alert: `<path d="M10 3.2l7.6 13.2H2.4z"/><path d="M10 8.2V12"/><circle cx="10" cy="14" r=".9" ${FILL} stroke="none"/>`,
  info: `<circle cx="10" cy="10" r="7.2"/><path d="M10 9v4.6"/><circle cx="10" cy="6.4" r=".95" ${FILL} stroke="none"/>`,
  clock: '<circle cx="10" cy="10" r="7.2"/><path d="M10 5.8v4.4l2.9 1.8"/>',
  waves: '<path d="M2.5 7.5c2.5-2 5-2 7.5 0s5 2 7.5 0M2.5 12.5c2.5-2 5-2 7.5 0s5 2 7.5 0"/>',
  keyboard: '<rect x="2.5" y="5" width="15" height="10" rx="1.5"/><path d="M5.6 8.4h.8M9.6 8.4h.8M13.6 8.4h.8M6.5 11.8h7"/>',
  repeat: '<path d="M4 9V8a3 3 0 0 1 3-3h9M13 2l3 3-3 3M16 11v1a3 3 0 0 1-3 3H4M7 18l-3-3 3-3"/>',
  cup: '<path d="M4 7.5h9.6V12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM13.6 8.8h1.3a2 2 0 0 1 0 4h-1.3M7 2.8V5M10.4 2.8V5"/>',
  mail: '<rect x="2.6" y="4.6" width="14.8" height="10.8" rx="1.4"/><path d="M2.8 5.6 10 11l7.2-5.4"/>',
  // Abzeichen
  playCircle: `<circle cx="10" cy="10" r="7.2"/><path d="M8.4 7v6l4.9-3z" ${FILL}/>`,
  bug: '<rect x="6.3" y="6.5" width="7.4" height="10" rx="3.7"/><path d="M8 6.6V6a2 2 0 0 1 4 0v.6M10 10v6.4M6.3 10.5H3.5M16.5 10.5h-2.8M6.6 14l-2.3 1.6M13.4 14l2.3 1.6M6.8 8 4.6 6.4M13.2 8l2.2-1.6"/>',
  sprout: '<path d="M10 17.2v-6.6M10 10.6C10 7 7.6 5 3.8 5c0 3.6 2.4 5.6 6.2 5.6zM10 12.4c0-2.9 2-4.6 5.6-4.6 0 2.9-2 4.6-5.6 4.6z"/>',
  trophy: '<path d="M6.2 3.5h7.6v4.3a3.8 3.8 0 0 1-7.6 0zM6.2 5.2H3.6v.9a2.9 2.9 0 0 0 2.9 2.9M13.8 5.2h2.6v.9a2.9 2.9 0 0 1-2.9 2.9M10 11.6v2.6M8 14.2h4v2.6H8zM6.8 16.8h6.4"/>',
  target: `<circle cx="10" cy="10" r="7.2"/><circle cx="10" cy="10" r="3.8"/><circle cx="10" cy="10" r="1" ${FILL} stroke="none"/>`,
  calendar: '<rect x="3" y="4.5" width="14" height="12.5" rx="1.6"/><path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4"/>',
  cap: '<path d="M10 4 1.8 8.2 10 12.4l8.2-4.2zM5.2 10v3.6c0 1.4 2.1 2.6 4.8 2.6s4.8-1.2 4.8-2.6V10M18.2 8.2v4.6"/>',
  drone: `<path d="M4.2 3.8h11.6M10 3.8v2.6M10 6.4l4.6 2.7v5.2L10 17l-4.6-2.7V9.1z"/><circle cx="10" cy="11.7" r="1.5" ${FILL} stroke="none"/>`,
  glitch: '<path d="M3.5 5h7.5M13.5 5h3M3.5 10h3M9 10h7.5M3.5 15h9.5M15.5 15h1"/>',
  stack: '<path d="M10 3l7 3.5-7 3.5-7-3.5zM3 10l7 3.5 7-3.5M3 13.5 10 17l7-3.5"/>',
  chat: '<path d="M3.4 4.4h13.2v9H9.2l-3.4 2.8v-2.8H3.4z"/>',
  leaf: '<path d="M4 16c0-7 4.4-11.6 12-12 0 7.4-4.6 12-12 12zM4 16l6.5-6.5"/>',
  smile: `<circle cx="10" cy="10" r="7.2"/><path d="M7 11.6a3.5 3.5 0 0 0 6 0"/><circle cx="7.6" cy="8.2" r=".9" ${FILL} stroke="none"/><circle cx="12.4" cy="8.2" r=".9" ${FILL} stroke="none"/>`,
  hash: '<path d="M8.2 3.5 6.6 16.5M13.4 3.5l-1.6 13M4 7.6h12.6M3.4 12.4H16"/>',
  infinity: '<path d="M10 10C8.2 7.7 6.8 6.5 5.2 6.5a3.5 3.5 0 0 0 0 7c1.6 0 3-1.2 4.8-3.5s3.2-3.5 4.8-3.5a3.5 3.5 0 0 1 0 7c-1.6 0-3-1.2-4.8-3.5z"/>',
  grid: `<rect x="3.5" y="3.5" width="13" height="13" rx="1"/><path d="M3.5 7.8h13M3.5 12.2h13M7.8 3.5v13M12.2 3.5v13"/><rect x="7.8" y="7.8" width="4.4" height="4.4" ${FILL} stroke="none"/>`,
  music: '<path d="M8 14.8V4.6l8-1.6v9.8"/><circle cx="6" cy="14.8" r="2"/><circle cx="14" cy="12.8" r="2"/>',
  send: '<path d="M17 3 3 9.2l5.6 2.2L17 3l-6.2 14-2.2-5.6"/>',
  burst: '<path d="M10 2.6l1.5 4.2 4-1.9-1.9 4 4.2 1.5-4.2 1.5 1.9 4-4-1.9-1.5 4.2-1.5-4.2-4 1.9 1.9-4-4.2-1.5 4.2-1.5-1.9-4 4 1.9z"/>',
  // Bereiche der Station
  antenna: '<circle cx="10" cy="7.6" r="1.6"/><path d="M10 9.2v8.3M7 17.5h6M6.7 4.3a4.7 4.7 0 0 0 0 6.6M13.3 4.3a4.7 4.7 0 0 1 0 6.6M4.4 2.4a7.6 7.6 0 0 0 0 10.4M15.6 2.4a7.6 7.6 0 0 1 0 10.4"/>',
  hangar: '<path d="M2.5 16.5h15M4 16.5V9.8a6 6 0 0 1 12 0v6.7M7.2 16.5v-4h5.6v4M7.2 14.5h5.6"/>',
  monitor: '<rect x="2.6" y="3.5" width="14.8" height="10" rx="1.4"/><path d="M7 17h6M10 13.5V17"/>',
  crystal: '<path d="M10 2.6l4.8 5.1L10 17.4 5.2 7.7zM5.2 7.7h9.6M10 2.6 8 7.7l2 9.7 2-9.7z"/>',
  bolt: `<path d="M11.2 2.5 4.6 11h4.9l-1 6.5L15.4 9h-5z" ${FILL}/>`,
};

export const ICON_NAMES = Object.keys(PATHS);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// SVG-Markup eines Icons. label: zugänglicher Name (sonst aria-hidden).
export function icon(name, { size = 18, cls = "", label = "" } = {}) {
  const body = PATHS[name];
  if (!body) return name ? `<span class="ico-text${cls ? " " + cls : ""}"${label ? "" : ' aria-hidden="true"'}>${esc(name)}</span>` : "";
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
  return `<svg class="icon icon-${name}${cls ? " " + cls : ""}" viewBox="0 0 20 20" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false" ${a11y}>${body}</svg>`;
}

// Sechseck mit Zahl (Kapitel-Abzeichen), passend zum Logo
export function hexNumber(n, { size = 18, cls = "" } = {}) {
  return `<svg class="icon icon-hex${cls ? " " + cls : ""}" viewBox="0 0 20 20" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M10 2.2l6.8 3.9v7.8L10 17.8l-6.8-3.9V6.1z"/><text x="10" y="13.6" text-anchor="middle" font-size="9.5" font-weight="700" fill="currentColor" stroke="none" font-family="inherit">${esc(n)}</text></svg>`;
}

// Platzhalter <i data-icon="name"> in statischem HTML (index.html) durch SVG ersetzen.
export function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.outerHTML = icon(el.dataset.icon, { size: Number(el.dataset.size) || 18 });
  });
}
