// Codaluna – Kursmodell: Reihenfolge, Nummerierung, Übersetzung, Freischalten, XP.
// Kursdaten (deutsche Basis) + Übersetzungs-Overlays je Sprache.
//
// Stränge: Der Hauptkurs (Kapitel ohne `strand`) läuft der Reihe nach. Nebenstränge
// (z. B. strand: "drone") haben eine eigene Reihenfolge; eine Mission mit `requires`
// öffnet sich erst, wenn diese Lektion des Hauptkurses erledigt ist. So gibt es Wahl,
// ohne dass Begriffe vor ihrer Erklärung auftauchen.

import { getLocale, t } from "/src/js/i18n.js";

export const XP_PER_LEVEL = 100;
export const SANDBOX_ID = "sandbox";

export function createCourse(course, overlays) {
  const flat = [];
  const strands = {}; // Strang -> Einträge in Reihenfolge
  const numbers = {};
  course.chapters.forEach((chapter, chapterIndex) => {
    const strand = chapter.strand || "main";
    if (!strands[strand]) strands[strand] = [];
    chapter.lessons.forEach((lesson) => {
      const type = lesson.type || "lesson";
      const number = type === "lesson" ? (numbers[strand] = (numbers[strand] || 0) + 1) : null;
      const entry = { lesson, chapter, chapterIndex, strand, type, number, index: flat.length, pos: strands[strand].length };
      flat.push(entry);
      strands[strand].push(entry);
    });
  });
  const main = strands.main;
  const byId = new Map(flat.map((e) => [e.lesson.id, e]));
  const mainChapters = course.chapters.filter((ch) => !ch.strand);

  // Übersetzung mit Fallback: aktuelle Sprache -> Englisch -> Deutsch (Basis)
  function overlayChain(id) {
    const loc = getLocale();
    if (loc === "de") return [];
    return [loc, "en"].map((l) => overlays[l] && overlays[l][id]).filter(Boolean);
  }

  function field(lesson, name) {
    for (const o of overlayChain(lesson.id)) if (o[name] !== undefined) return o[name];
    return lesson[name];
  }

  function expertField(lesson, name) {
    if (!lesson.expert) return undefined;
    for (const o of overlayChain(lesson.id)) {
      if (o.expert && o.expert[name] !== undefined) return o.expert[name];
    }
    return lesson.expert[name];
  }

  // Rückmeldung einer Prüfung als Text: "fb.*" = allgemein, sonst lektionsspezifisch
  function feedbackText(lesson, res, expert = false) {
    if (!res || !res.feedback) return t("fb.generic");
    const params = res.params || undefined;
    if (res.feedback.startsWith("fb.")) return t(res.feedback, params);
    const map = (expert ? expertField(lesson, "feedback") : field(lesson, "feedback")) || {};
    let text = map[res.feedback];
    if (text === undefined) {
      const base = (expert ? lesson.expert && lesson.expert.feedback : lesson.feedback) || {};
      text = base[res.feedback];
    }
    if (text === undefined) return t("fb.generic");
    if (params) for (const k in params) text = text.split("{" + k + "}").join(params[k]);
    return text;
  }

  function chapterTitle(chapter) {
    for (const l of getLocale() === "de" ? [] : [getLocale(), "en"]) {
      const c = overlays[l] && overlays[l].chapters && overlays[l].chapters[chapter.id];
      if (c) return c;
    }
    return chapter.title;
  }

  // Bereich der Station (Stationskarte, Geschichte): {icon, name, pos, intro, outro}
  function region(chapter) {
    const base = chapter.region || { icon: "target", name: chapter.title, pos: [0, 0], intro: "", outro: "" };
    for (const l of getLocale() === "de" ? [] : [getLocale(), "en"]) {
      const r = overlays[l] && overlays[l].regions && overlays[l].regions[chapter.id];
      if (r) return { ...base, ...r };
    }
    return base;
  }

  // Kapitel des Hauptkurses werden gezählt (1, 2, …), Nebenstränge tragen ihren Namen.
  function chapterLabel(chapterIndex) {
    const chapter = course.chapters[chapterIndex];
    if (chapter.strand) return t(`strand.${chapter.strand}`);
    return t("chapter.label", { n: mainChapters.indexOf(chapter) + 1 });
  }

  function kicker(entry) {
    if (entry.strand !== "main") {
      if (entry.type !== "lesson") return t(`kicker.${entry.strand}Boss`);
      return t(`kicker.${entry.strand}`, { n: entry.number });
    }
    if (entry.type === "boss") return t("kicker.boss", { n: mainChapters.indexOf(entry.chapter) + 1 });
    if (entry.type === "final") return t("kicker.final");
    return t("kicker.lesson", { n: entry.number });
  }

  // Einträge eines Kapitels und wie weit es erledigt ist
  function chapterEntries(chapterIndex) {
    return flat.filter((e) => e.chapterIndex === chapterIndex);
  }
  function chapterProgress(chapterIndex, progress) {
    const list = chapterEntries(chapterIndex);
    const done = list.filter((e) => progress.isDone(e.lesson.id)).length;
    return { done, total: list.length, complete: done === list.length };
  }
  // Wohin ein Klick auf einen Bereich führt: erste offene Mission, sonst die letzte
  function chapterTarget(chapterIndex, progress) {
    const list = chapterEntries(chapterIndex);
    const open = list.find((e) => !progress.isDone(e.lesson.id) && isUnlocked(e.lesson.id, progress));
    if (open) return open.lesson.id;
    const unlocked = list.filter((e) => isUnlocked(e.lesson.id, progress));
    return unlocked.length ? unlocked[unlocked.length - 1].lesson.id : null;
  }

  const get = (id) => byId.get(id) || null;

  // Welche Lektion des Hauptkurses fehlt noch, damit diese Mission aufgeht? (null = keine)
  function missingRequirement(id, progress) {
    const e = byId.get(id);
    const req = e && e.lesson.requires;
    return req && !progress.isDone(req) ? byId.get(req) : null;
  }

  function isUnlocked(id, progress) {
    if (id === SANDBOX_ID) return true;
    const e = byId.get(id);
    if (!e) return false;
    if (missingRequirement(id, progress)) return false;
    return e.pos === 0 || progress.isDone(strands[e.strand][e.pos - 1].lesson.id);
  }

  const next = (id) => {
    const e = byId.get(id);
    return e ? strands[e.strand][e.pos + 1] || null : null;
  };
  const prev = (id) => {
    const e = byId.get(id);
    return e && e.pos > 0 ? strands[e.strand][e.pos - 1] : null;
  };

  // Wo geht es weiter? Zuletzt geöffnet (falls frei), sonst erste offene Lektion.
  function resumeId(progress) {
    const last = progress.data.last;
    if (last && (last === SANDBOX_ID || (byId.has(last) && isUnlocked(last, progress)))) return last;
    const open = main.find((e) => !progress.isDone(e.lesson.id));
    return (open || main[main.length - 1]).lesson.id;
  }

  function xp(progress) {
    let sum = 0;
    for (const e of flat) {
      if (progress.isDone(e.lesson.id)) sum += e.lesson.xp || 0;
      if (e.lesson.expert && progress.hasBonus(e.lesson.id)) sum += e.lesson.expert.xp || 0;
    }
    return sum;
  }

  function stats(progress) {
    const total = xp(progress);
    const lessonsDone = main.filter((e) => progress.isDone(e.lesson.id)).length;
    const side = flat.filter((e) => e.strand !== "main");
    const bonusTotal = flat.filter((e) => e.lesson.expert).length;
    const bonusDone = flat.filter((e) => e.lesson.expert && progress.hasBonus(e.lesson.id)).length;
    return {
      xp: total,
      level: Math.floor(total / XP_PER_LEVEL) + 1,
      xpInLevel: total % XP_PER_LEVEL,
      lessonsDone,
      lessonsTotal: main.length,
      sideDone: side.filter((e) => progress.isDone(e.lesson.id)).length,
      sideTotal: side.length,
      bonusDone,
      bonusTotal,
      finished: progress.isDone(main[main.length - 1].lesson.id),
    };
  }

  // Ist dieser Strang komplett geschafft? (für Abzeichen)
  function strandDone(strand, progress) {
    const list = strands[strand] || [];
    return list.length > 0 && list.every((e) => progress.isDone(e.lesson.id));
  }

  return {
    id: course.id,
    flat,
    get,
    field,
    expertField,
    feedbackText,
    chapterTitle,
    chapterLabel,
    region,
    chapterEntries,
    chapterProgress,
    chapterTarget,
    kicker,
    isUnlocked,
    missingRequirement,
    next,
    prev,
    resumeId,
    xp,
    stats,
    strandDone,
    strands: Object.keys(strands),
    chapters: course.chapters,
    mainChapters,
    finalId: main[main.length - 1].lesson.id,
  };
}
