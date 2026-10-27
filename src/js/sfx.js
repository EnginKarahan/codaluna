// Codaluna – Klänge. Alles wird mit WebAudio erzeugt: keine Dateien, offline, winzig.
// Leise, kurz und freundlich. Fehler bekommen ein neugieriges „Glitch“-Geräusch,
// keinen Fail-Ton. Ein Schalter (Kopfzeile, Lernpfad) schaltet alles stumm,
// auch die Töne, die Programme mit station.note() spielen.

const KEY = "pyquest.sound";
const VOLUME = 0.12;

let ctx = null;
let master = null;
let enabled = true;
try {
  enabled = localStorage.getItem(KEY) !== "off";
} catch (_) {}

const listeners = new Set();

export function soundOn() {
  return enabled;
}

export function setSound(on) {
  enabled = !!on;
  try {
    localStorage.setItem(KEY, enabled ? "on" : "off");
  } catch (_) {}
  if (!enabled && ctx) ctx.suspend().catch(() => {});
  for (const fn of listeners) fn(enabled);
}

export function onSoundChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// AudioContext erst bei Bedarf anlegen (Browser erlauben Ton erst nach einer Nutzeraktion).
export function audio() {
  if (!enabled) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = VOLUME;
      master.connect(ctx.destination);
    } catch (_) {
      ctx = null;
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return { ctx, out: master };
}

// Ein Ton mit weicher Hüllkurve. start/dur in Sekunden relativ zu jetzt.
export function tone(freq, start = 0, dur = 0.15, { type = "sine", gain = 1, slide = 0 } = {}) {
  const a = audio();
  if (!a) return;
  const t0 = a.ctx.currentTime + start;
  const osc = a.ctx.createOscillator();
  const env = a.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(env).connect(a.out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

// Note wie "C4", "F#5", "Bb3" -> Frequenz (A4 = 440 Hz). null bei unbekannter Note.
const STEPS = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2, H: 2 };
export function noteFreq(name) {
  const m = /^([A-Ha-h])([#b]?)(-?\d)$/.exec(String(name).trim());
  if (!m) return null;
  let semis = STEPS[m[1].toUpperCase()] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  semis += (Number(m[3]) - 4) * 12;
  return 440 * Math.pow(2, semis / 12);
}

const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;

export const sfx = {
  // Lektion gelöst: kurzer Dur-Dreiklang aufwärts
  success() {
    tone(C5, 0, 0.16, { type: "triangle" });
    tone(E5, 0.08, 0.16, { type: "triangle" });
    tone(G5, 0.16, 0.28, { type: "triangle" });
  },
  // Bonus: wie success, mit hellem Funkeln
  bonus() {
    sfx.success();
    tone(C6, 0.3, 0.22, { type: "sine", gain: 0.7 });
    tone(C6 * 1.5, 0.38, 0.3, { type: "sine", gain: 0.5 });
  },
  // Level-up: kleine Fanfare
  level() {
    [C5, E5, G5, C6].forEach((f, i) => tone(f, i * 0.11, 0.22, { type: "square", gain: 0.45 }));
    tone(C6, 0.46, 0.5, { type: "triangle" });
  },
  // Abzeichen / Entdeckung: zwei glockige Töne
  badge() {
    tone(G5, 0, 0.25, { type: "sine" });
    tone(C6, 0.1, 0.4, { type: "sine", gain: 0.8 });
  },
  // Fehler: neugieriges Zwitschern statt Fail-Ton
  glitch() {
    tone(620, 0, 0.07, { type: "square", gain: 0.35, slide: 260 });
    tone(880, 0.09, 0.09, { type: "square", gain: 0.3, slide: -340 });
  },
  // „Fast“: freundlicher Hinweis
  hint() {
    tone(E5, 0, 0.12, { type: "triangle", gain: 0.7 });
    tone(C5, 0.1, 0.18, { type: "triangle", gain: 0.6 });
  },
};

// Kurze Vibration auf Handys (Android); andere Geräte ignorieren das still.
export function haptic(pattern = 18) {
  if (!enabled) return;
  try {
    if (navigator.vibrate && window.matchMedia("(pointer: coarse)").matches) navigator.vibrate(pattern);
  } catch (_) {}
}
