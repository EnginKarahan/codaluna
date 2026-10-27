// Codaluna – Bühne der Station: LED-Bildschirm und Lautsprecher (Modul `station`) und das
// Eisfeld, über das Lumo fliegt (Modul `drone`).
// Die Laufzeit (pqrt.py) schickt jedes Ereignis als JSON-Zeile über den Kanal "g".
// Die Bühne erscheint als Karte in der Konsole, sobald ein Programm zeichnet, spielt oder
// fliegt. Bild und Töne kommen live, Lumos Flug wird Schritt für Schritt animiert; die App
// wartet mit dem Ergebnis, bis Lumo angekommen ist (whenIdle). Ein Klick spult vor.

import { t } from "/src/js/i18n.js";
import { audio, soundOn } from "/src/js/sfx.js";

const CELL = 10; // Bildpunkte je Pixel im Canvas (für die LED-Optik)
const OFF = "#211f1c";
const GAP = "#0e0d0b";

export function createStage({ append }) {
  let card = null;
  let canvas = null;
  let ctx = null;
  let size = 16;
  let info = null;
  let tones = 0;
  let nodes = [];
  let songStart = 0;
  let songEnd = 0;
  let endTimer = 0;

  function ensure() {
    if (card) return;
    card = document.createElement("div");
    card.className = "stage-card";
    card.innerHTML =
      `<canvas class="stage-world" role="img" hidden></canvas><div class="stage-world-info" hidden></div>` +
      `<canvas class="stage-screen" role="img"></canvas>` +
      `<div class="stage-info"><span class="eq" aria-hidden="true" hidden><i></i><i></i><i></i></span>` +
      `<span class="si-text"></span><button type="button" class="linkbtn stage-stop" hidden></button></div>`;
    canvas = card.querySelector(".stage-screen");
    info = card.querySelector(".stage-info");
    const stop = info.querySelector(".stage-stop");
    stop.textContent = "■ " + t("stage.stop");
    stop.onclick = () => {
      stopAudio();
      updateInfo(false);
    };
    ctx = canvas.getContext("2d");
    canvas.hidden = true;
    info.hidden = true;
    append(card);
  }

  function showScreen() {
    ensure();
    if (!canvas.hidden) return;
    canvas.hidden = false;
    canvas.setAttribute("aria-label", t("stage.screenAria"));
    resize(size);
  }

  function resize(n) {
    size = n;
    canvas.width = canvas.height = n * CELL;
    ctx.fillStyle = GAP;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) cell(x, y, null);
  }

  function cell(x, y, color) {
    ctx.fillStyle = color || OFF;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2, 2);
    else ctx.rect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
    ctx.fill();
  }

  // Ereignisse kommen aus dem Programm der Lernenden (auch aus geteilten Links):
  // nur gültige Werte zeichnen, damit nichts die Seite lahmlegen kann.
  const int = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
  const color = (c) => c === null || (typeof c === "string" && /^#[0-9a-f]{6}$/.test(c));
  const num = (v, hi) => typeof v === "number" && isFinite(v) && v >= 0 && v <= hi;

  function apply(ev) {
    switch (ev.t) {
      case "size":
        if (!int(ev.n, 8, 32)) return;
        showScreen();
        resize(ev.n);
        break;
      case "px":
        if (!int(ev.x, 0, size - 1) || !int(ev.y, 0, size - 1) || !color(ev.c)) return;
        showScreen();
        cell(ev.x, ev.y, ev.c);
        break;
      case "fill":
        if (!color(ev.c)) return;
        showScreen();
        for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) cell(x, y, ev.c);
        break;
      case "tone":
        if (!num(ev.at, 600) || !num(ev.d, 60) || (ev.k === "note" && !num(ev.f, 20000))) return;
        play(ev);
        break;
      case "world": {
        const rows = ev.map;
        const ok = Array.isArray(rows) && rows.length >= 1 && rows.length <= 40 && rows.every((r) => typeof r === "string" && r.length <= 40);
        if (world || !ok || !int(ev.x, 0, 39) || !int(ev.y, 0, 39)) return; // eine Welt pro Lauf
        ensure();
        world = createWorld(card, ev);
        break;
      }
      case "move":
      case "turn":
      case "take":
      case "bump":
      case "miss":
        if (world) world.push(ev);
        break;
    }
  }

  // Ereignisse aus der Konsole (mehrere JSON-Zeilen am Stück)
  function feed(text) {
    for (const line of String(text).split("\n")) {
      if (!line) continue;
      try {
        apply(JSON.parse(line));
      } catch (_) {}
    }
  }

  // Infozeile wird nur aktualisiert, nicht neu gebaut: Der Stopp-Knopf bleibt klick- und fokussierbar
  function updateInfo(playing) {
    ensure();
    info.hidden = false;
    const n = tones;
    const muted = !soundOn();
    const text = muted ? t("stage.muted", { n }) : playing ? t("stage.playing", { n }) : t("stage.played", { n });
    const label = info.querySelector(".si-text");
    if (label.textContent !== text) label.textContent = text;
    info.querySelector(".eq").hidden = muted || !playing;
    info.querySelector(".stage-stop").hidden = muted || !playing;
  }

  function play(ev) {
    tones++;
    const a = audio();
    if (!a) {
      updateInfo(false);
      return;
    }
    const now = a.ctx.currentTime;
    if (!songStart) songStart = now + 0.08;
    let t0 = songStart + ev.at;
    // Kam der Ton später an als geplant (z. B. nach time.sleep), rückt das Lied nach
    if (t0 < now + 0.02) {
      songStart += now + 0.02 - t0;
      t0 = now + 0.02;
    }
    if (ev.k === "note") nodes.push(...synthNote(a, ev.f, t0, ev.d));
    else nodes.push(...synthDrum(a, ev.n, t0));
    songEnd = Math.max(songEnd, t0 + ev.d);
    updateInfo(true);
    clearTimeout(endTimer);
    endTimer = setTimeout(() => updateInfo(false), Math.max(0, (songEnd - a.ctx.currentTime) * 1000) + 200);
  }

  function stopAudio() {
    for (const n of nodes) {
      try {
        n.stop();
      } catch (_) {}
    }
    nodes = [];
    songStart = 0;
    songEnd = 0;
    clearTimeout(endTimer);
  }

  // Vor jedem Lauf: alte Bühne vergessen (die Konsole wird ohnehin geleert)
  function reset() {
    stopAudio();
    if (world) world.stop();
    world = null;
    card = canvas = ctx = info = null;
    size = 16;
    tones = 0;
  }

  // Erfüllt sich, sobald Lumos Flug fertig animiert ist (sofort, wenn es keinen gibt)
  function whenIdle() {
    return world ? world.idle() : Promise.resolve();
  }

  let world = null;
  return { feed, reset, stopAudio, whenIdle };
}

// ---- Eisfeld: Lumos Flug Schritt für Schritt ----
const TILE = 30;
const ANGLE = { E: 0, S: 90, W: 180, N: 270 };
// Umriss des Blitzes (20er-Raster wie icons.js „bolt“)
const BOLT = [[11.2, 2.5], [4.6, 11], [9.5, 11], [8.5, 17.5], [15.4, 9], [10.4, 9]];

function createWorld(card, ev) {
  const canvas = card.querySelector(".stage-world");
  const info = card.querySelector(".stage-world-info");
  const rows = ev.map;
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  canvas.width = w * TILE;
  canvas.height = h * TILE;
  canvas.style.width = Math.min(w * TILE, 480) + "px";
  canvas.hidden = false;
  canvas.setAttribute("aria-label", t("stage.worldAria"));
  canvas.tabIndex = 0; // auch per Tastatur vorspulbar (Enter / Leertaste)
  canvas.onkeydown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      skipNow();
    }
  };
  info.hidden = false;
  const g = canvas.getContext("2d");
  const crystals = new Set();
  rows.forEach((row, y) => [...row].forEach((ch, x) => ch === "*" && crystals.add(x + "," + y)));
  const total = crystals.size;
  const light = getComputedStyle(document.documentElement).getPropertyValue("--lumo-light").trim() || "#34d3b5";

  let pos = { x: ev.x, y: ev.y, a: ANGLE[ev.d] ?? 0 };
  let queue = [];
  let current = null; // {ev, from, to, start, dur}
  let frame = 0;
  let fast = false;
  let steps = 0;
  let collected = 0;
  let waiters = [];
  let stopped = false;
  let sparkle = null; // {x, y, start}
  let clock = null; // Endzeit des letzten Schritts: mehrere kurze Schritte passen in einen Frame
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) fast = true;

  const skipNow = () => {
    fast = true;
    kick();
  };
  canvas.title = t("stage.skip");
  canvas.onclick = skipNow;
  info.innerHTML = `<span class="wi-text"></span><button type="button" class="linkbtn stage-skip"></button>`;
  const infoText = info.querySelector(".wi-text");
  const skipBtn = info.querySelector(".stage-skip");
  skipBtn.textContent = t("stage.skip");
  skipBtn.onclick = skipNow;

  function drawTile(x, y, ch) {
    const px = x * TILE;
    const py = y * TILE;
    g.fillStyle = (x + y) % 2 ? "#1d2a36" : "#21303d";
    g.fillRect(px, py, TILE, TILE);
    if (ch === "#") {
      g.fillStyle = "#3d4c5c";
      g.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
      g.fillStyle = "#5a6e82";
      g.fillRect(px + 1, py + 1, TILE - 2, 5);
    } else if (ch === "G") {
      g.fillStyle = "#3ccfb02e";
      g.fillRect(px + 3, py + 3, TILE - 6, TILE - 6);
      g.strokeStyle = "#3ccfb0";
      g.lineWidth = 2;
      g.strokeRect(px + 4, py + 4, TILE - 8, TILE - 8);
      // Blitz der Ladestation (gleiche Form wie das Icon „bolt“)
      const k = (TILE * 0.55) / 20;
      const ox = px + TILE / 2 - 10 * k;
      const oy = py + TILE / 2 - 10 * k;
      g.fillStyle = "#4fd6b8";
      g.beginPath();
      for (const [bx, by] of BOLT) g.lineTo(ox + bx * k, oy + by * k);
      g.closePath();
      g.fill();
    }
  }

  function drawCrystal(x, y, scale = 1) {
    const cx = x * TILE + TILE / 2;
    const cy = y * TILE + TILE / 2;
    const r = TILE * 0.28 * scale;
    g.fillStyle = "#7fe7ff";
    g.beginPath();
    g.moveTo(cx, cy - r);
    g.lineTo(cx + r * 0.7, cy);
    g.lineTo(cx, cy + r);
    g.lineTo(cx - r * 0.7, cy);
    g.closePath();
    g.fill();
    g.fillStyle = "#ffffffcc";
    g.fillRect(cx - r * 0.2, cy - r * 0.5, r * 0.25, r * 0.4);
  }

  function drawLumo(x, y, angle, shake = 0) {
    const cx = x * TILE + TILE / 2 + shake;
    const cy = y * TILE + TILE / 2;
    const r = TILE * 0.36;
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      g.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    g.closePath();
    g.fillStyle = "#2f2d29";
    g.fill();
    g.strokeStyle = light;
    g.lineWidth = 2;
    g.stroke();
    const rad = (angle * Math.PI) / 180;
    // Auge schaut in Flugrichtung, davor ein kleiner Pfeil
    g.fillStyle = light;
    g.beginPath();
    g.arc(cx + Math.cos(rad) * r * 0.32, cy + Math.sin(rad) * r * 0.32, r * 0.26, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    const tip = r * 1.25;
    g.moveTo(cx + Math.cos(rad) * tip, cy + Math.sin(rad) * tip);
    g.lineTo(cx + Math.cos(rad + 2.6) * r * 0.85, cy + Math.sin(rad + 2.6) * r * 0.85);
    g.lineTo(cx + Math.cos(rad - 2.6) * r * 0.85, cy + Math.sin(rad - 2.6) * r * 0.85);
    g.closePath();
    g.globalAlpha = 0.55;
    g.fill();
    g.globalAlpha = 1;
  }

  function draw(lumoX, lumoY, angle, shake, now) {
    rows.forEach((row, y) => {
      for (let x = 0; x < w; x++) drawTile(x, y, row[x] || "#");
    });
    for (const key of crystals) {
      const [x, y] = key.split(",").map(Number);
      drawCrystal(x, y);
    }
    if (sparkle) {
      const p = Math.min(1, (now - sparkle.start) / 350);
      if (p < 1) drawCrystal(sparkle.x, sparkle.y, 1 + p);
      else sparkle = null;
    }
    drawLumo(lumoX, lumoY, angle, shake);
  }

  function updateInfo() {
    const busy = !!(current || queue.length);
    const text = `${total ? t("stage.worldCrystals", { c: collected, t: total }) + " · " : ""}${t("stage.worldSteps", { s: steps })}`;
    if (infoText.textContent !== text) infoText.textContent = text;
    const hide = !busy || fast;
    if (skipBtn.hidden !== hide) {
      // Fokus nicht verlieren: liegt er auf dem Knopf, wandert er auf das Eisfeld
      if (hide && document.activeElement === skipBtn) canvas.focus({ preventScroll: true });
      skipBtn.hidden = hide;
    }
  }

  // Höchstens ~8 Sekunden für den ganzen Flug, auch bei 2000 Schritten
  function stepDuration() {
    if (fast) return 0;
    return Math.min(210, 8000 / (steps + queue.length + 1));
  }

  function begin(ev, now) {
    steps += ev.t === "move" || ev.t === "turn" || ev.t === "take" || ev.t === "bump" ? 1 : 0;
    const from = { ...pos };
    const to = { ...pos };
    if (ev.t === "move") {
      to.x = ev.x;
      to.y = ev.y;
    } else if (ev.t === "turn") {
      to.a = pos.a - 90; // links herum
    }
    // Nach einem kurzen Schritt beginnt der nächste dort, wo der vorige endete (virtuelle Uhr)
    const start = clock === null ? now : Math.max(clock, now - 100);
    current = { ev, from, to, start, dur: stepDuration() };
  }

  function finish(now) {
    const ev = current.ev;
    pos = { ...current.to, a: ((current.to.a % 360) + 360) % 360 };
    if (ev.t === "take") {
      crystals.delete(ev.x + "," + ev.y);
      collected++;
      sparkle = { x: ev.x, y: ev.y, start: now };
    }
    current = null;
  }

  function loop(now) {
    frame = 0;
    if (stopped) return;
    for (;;) {
      if (!current) {
        if (!queue.length) break;
        begin(queue.shift(), now);
      }
      if (now - current.start >= current.dur) {
        clock = current.start + current.dur;
        finish(now);
        continue;
      }
      break;
    }
    if (!current && !queue.length) clock = null;
    let x = pos.x;
    let y = pos.y;
    let a = pos.a;
    let shake = 0;
    if (current) {
      const p = Math.min(1, (now - current.start) / Math.max(1, current.dur));
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      x = current.from.x + (current.to.x - current.from.x) * ease;
      y = current.from.y + (current.to.y - current.from.y) * ease;
      a = current.from.a + (current.to.a - current.from.a) * ease;
      if (current.ev.t === "bump" || current.ev.t === "miss") shake = Math.sin(p * Math.PI * 6) * 3;
    }
    draw(x, y, a, shake, now);
    updateInfo();
    if (current || queue.length || sparkle) frame = requestAnimationFrame(loop);
    else settle();
  }

  function settle() {
    const list = waiters;
    waiters = [];
    for (const fn of list) fn();
  }

  function kick() {
    if (!frame && !stopped) frame = requestAnimationFrame(loop);
  }

  draw(pos.x, pos.y, pos.a, 0, 0);
  updateInfo();

  return {
    push(ev) {
      queue.push(ev);
      kick();
    },
    idle() {
      if (!current && !queue.length) return Promise.resolve();
      return new Promise((resolve) => waiters.push(resolve));
    },
    stop() {
      stopped = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      settle();
    },
  };
}

// ---- Klangerzeugung: kleiner Chiptune-Lautsprecher ----
function envelope(a, t0, dur, peak) {
  const g = a.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.01);
  g.gain.setValueAtTime(peak, t0 + Math.max(0.02, dur * 0.7));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  g.connect(a.out);
  return g;
}

function synthNote(a, freq, t0, dur) {
  const d = Math.max(0.06, dur * 0.92);
  const osc = a.ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, t0);
  const filter = a.ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2400;
  osc.connect(filter).connect(envelope(a, t0, d, 0.35));
  osc.start(t0);
  osc.stop(t0 + d + 0.02);
  return [osc];
}

let noiseBuffer = null;
function noise(a) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== a.ctx.sampleRate) {
    noiseBuffer = a.ctx.createBuffer(1, a.ctx.sampleRate * 0.5, a.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = a.ctx.createBufferSource();
  src.buffer = noiseBuffer;
  return src;
}

function synthDrum(a, kind, t0) {
  const out = [];
  if (kind === "kick" || kind === "tom") {
    const osc = a.ctx.createOscillator();
    const high = kind === "kick" ? 150 : 260;
    osc.frequency.setValueAtTime(high, t0);
    osc.frequency.exponentialRampToValueAtTime(kind === "kick" ? 42 : 110, t0 + 0.18);
    osc.connect(envelope(a, t0, kind === "kick" ? 0.32 : 0.25, 1));
    osc.start(t0);
    osc.stop(t0 + 0.35);
    out.push(osc);
  } else {
    const src = noise(a);
    const filter = a.ctx.createBiquadFilter();
    filter.type = kind === "snare" ? "bandpass" : "highpass";
    filter.frequency.value = kind === "snare" ? 1800 : kind === "clap" ? 1200 : 7000;
    const dur = kind === "hihat" ? 0.06 : kind === "clap" ? 0.16 : 0.2;
    src.connect(filter).connect(envelope(a, t0, dur, kind === "hihat" ? 0.45 : 0.8));
    src.start(t0);
    src.stop(t0 + dur + 0.02);
    out.push(src);
    if (kind === "snare") {
      const osc = a.ctx.createOscillator();
      osc.frequency.setValueAtTime(190, t0);
      osc.connect(envelope(a, t0, 0.12, 0.5));
      osc.start(t0);
      osc.stop(t0 + 0.14);
      out.push(osc);
    }
  }
  return out;
}
