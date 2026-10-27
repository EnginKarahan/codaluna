// PyQuest – Cloud-Synchronisation des Fortschritts (nur bei angemeldetem Konto).
// Tabelle: user_progress(user_id uuid PK, data jsonb, updated_at timestamptz)
// mit Row-Level-Security (nur eigener Datensatz). Siehe SETUP.md.

import { sanitize, fillWeeks } from "/src/js/progress.js";
import { logError } from "/src/js/telemetry.js";

const TABLE = "user_progress";

const later = (a, b) => (!a ? b : !b ? a : a > b ? a : b);

// Zwei Stände zusammenführen, ohne etwas zu verlieren. XP werden ohnehin aus den
// erledigten Lektionen berechnet und sind danach automatisch stimmig.
export function mergeProgress(local, remote) {
  const r = sanitize(remote);
  const out = sanitize(local);
  out.completed = { ...r.completed, ...out.completed };
  out.bonus = { ...r.bonus, ...out.bonus };
  out.badges = { ...r.badges, ...out.badges };
  out.tried = { ...r.tried, ...out.tried };
  out.code = { ...r.code, ...out.code }; // lokaler Code gewinnt
  for (const k of Object.keys(out.stats)) out.stats[k] = Math.max(out.stats[k], r.stats[k]);
  // Streak des zuletzt aktiven Geräts übernehmen
  if (r.lastActive && later(r.lastActive, out.lastActive) === r.lastActive && r.lastActive !== out.lastActive) {
    out.streak = r.streak;
    out.lastActive = r.lastActive;
  } else if (r.lastActive === out.lastActive) {
    out.streak = Math.max(out.streak, r.streak);
  }
  out.days = { ...r.days, ...out.days };
  out.weeks = { ...r.weeks, ...out.weeks };
  out.glitches = { ...r.glitches, ...out.glitches };
  // Aussehen: das selbst gewählte gewinnt, ein neues Gerät übernimmt es aus dem Konto
  const plain = (look) => look.skin === "amber" && look.light === "teal";
  if (plain(out.look) && !plain(r.look)) out.look = r.look;
  // Wochenziel: ein neues Gerät (Standard 3) übernimmt das im Konto gewählte Ziel
  if (out.weekGoal === 3 && r.weekGoal !== 3) out.weekGoal = r.weekGoal;
  fillWeeks(out);
  out.last = out.last || r.last;
  return out;
}

export async function pullMergePush(client, user, progress) {
  if (!client || !user) return;
  try {
    const { data, error } = await client.from(TABLE).select("data").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (data && data.data) progress.data = mergeProgress(progress.data, data.data);
    progress.data.owner = user.id;
    progress.save({ silent: true });
    await push(client, user, progress);
  } catch (e) {
    logError("sync.pull", e);
  }
}

export async function push(client, user, progress) {
  if (!client || !user) return;
  try {
    const { owner, ...data } = progress.data;
    const { error } = await client
      .from(TABLE)
      .upsert({ user_id: user.id, data, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) throw error;
  } catch (e) {
    logError("sync.push", e);
  }
}
