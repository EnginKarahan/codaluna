// Codaluna – Entdeckungen: geheime Abzeichen für Neugier und Ausprobieren.
// Reine Funktion (ohne DOM), damit sie sich testen lässt. Wird nach jedem Lauf
// aufgerufen, auch bei Fehlern und im Spielplatz.

import { localDay } from "/src/js/progress.js";

const EMOJI = /\p{Extended_Pictographic}/u;
const BIG_NUMBER = /\d{30,}/;
export const GLITCH_GOAL = 5; // so viele verschiedene Fehlertypen für „Glitch-Sammlung“
export const PIXEL_GOAL = 100; // leuchtende Pixel in einem Bild für „Pixel-Kunst“
export const MUSIC_GOAL = 16; // Töne in einem Lied für „Ohrwurm“

// Welche Entdeckungen zeigt dieser Lauf? run = { result, code, sandbox, progress }
export function findDiscoveries({ result = {}, code = "", sandbox = false, progress }) {
  const found = [];
  const out = String(result.out || "");
  const analysis = result.analysis || {};
  if (/\blumo\b/i.test(out)) found.push("secret-hello");
  if ((analysis.imports || []).includes("this") && /beautiful/i.test(out)) found.push("secret-zen");
  if (EMOJI.test(out)) found.push("secret-emoji");
  if (BIG_NUMBER.test(out)) found.push("secret-bignum");
  // Endlosschleife gebändigt: Zeitlimit, Ausgabe-Flut oder ein Stop nach längerem Rechnen
  // (nicht, wenn das Programm nur auf eine Eingabe gewartet hat)
  if (result.stopped && result.reason === "timeout") found.push("secret-infinite");
  if (result.stopped && result.reason === "user" && !result.atInput && (result.elapsed || 0) >= 2000) found.push("secret-infinite");
  if (result.limit === "output" || result.reason === "output") found.push("secret-infinite");
  if (result.error && progress) progress.noteGlitch(result.error.type);
  if (result.error && result.error.type === "DroneCrash") found.push("secret-crash");
  if (progress && Object.keys(progress.data.glitches).length >= GLITCH_GOAL) found.push("secret-glitches");
  if (sandbox && result.ok && (analysis.defs || []).length > 0 && (analysis.userCalls || 0) > 0) found.push("secret-inventor");
  const screen = result.screen && result.screen.pixels;
  if (screen && Object.keys(screen).length >= PIXEL_GOAL) found.push("secret-pixel");
  if (Array.isArray(result.music) && result.music.length >= MUSIC_GOAL) found.push("secret-music");
  return [...new Set(found)];
}

// Neue Entdeckungen eintragen und zurückgeben (Liste der Abzeichen-IDs).
export function awardDiscoveries(run, secrets) {
  const known = new Set(secrets.map((b) => b.id));
  const fresh = findDiscoveries(run).filter((id) => known.has(id) && !run.progress.data.badges[id]);
  for (const id of fresh) run.progress.data.badges[id] = localDay();
  return fresh;
}
