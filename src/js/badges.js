// PyQuest – Abzeichen. Selbstbezogen (du gegen gestern), keine Ranglisten.
// Auch Fehler werden gewürdigt: Fehler gehören zum Programmieren dazu.
// Namen/Beschreibungen: i18n-Schlüssel badge.<id>.name / badge.<id>.desc
//
// Geheime Abzeichen (secret: true) belohnen Neugier statt Fleiß. Sie werden nicht hier,
// sondern von discoveries.js beim Ausführen vergeben und zeigen bis dahin nur ein Rätsel.

import { localDay } from "/src/js/progress.js";
import { icon, hexNumber } from "/src/js/icons.js";

// Icon-Namen aus icons.js; Kapitel-Abzeichen zeigen ihre Nummer im Sechseck
const STRAND_ICONS = { drone: "drone", glitch: "glitch" };

export function badgeList(course) {
  const list = [
    { id: "first-run", icon: "playCircle", earned: ({ p }) => p.data.stats.runs >= 1 },
    { id: "first-error", icon: "bug", earned: ({ p }) => p.data.stats.errors >= 1 },
    { id: "bug-fixer", icon: "wrench", earned: ({ p }) => p.data.stats.fixes >= 1 },
    { id: "first-lesson", icon: "sprout", earned: ({ s }) => s.lessonsDone >= 1 },
  ];
  course.mainChapters.forEach((ch, i) => {
    const lastId = ch.lessons[ch.lessons.length - 1].id;
    list.push({
      id: `chapter-${ch.id}`,
      chapter: i + 1,
      earned: ({ p }) => p.isDone(lastId),
    });
  });
  list.push(
    { id: "bonus-1", icon: "spark", earned: ({ s }) => s.bonusDone >= 1 },
    { id: "bonus-5", icon: "sparks", earned: ({ s }) => s.bonusDone >= 5 },
    { id: "bonus-all", icon: "trophy", earned: ({ s }) => s.bonusTotal > 0 && s.bonusDone >= s.bonusTotal },
    { id: "week-1", icon: "target", earned: ({ p }) => p.weeksMet >= 1 },
    { id: "week-4", icon: "calendar", earned: ({ p }) => p.weeksMet >= 4 },
    { id: "sandbox", icon: "flask", earned: ({ p }) => p.data.stats.sandboxRuns >= 1 },
    ...course.strands
      .filter((s) => s !== "main")
      .map((strand) => ({ id: `strand-${strand}`, icon: STRAND_ICONS[strand] || "star", earned: ({ p }) => course.strandDone(strand, p) })),
    { id: "diploma", icon: "cap", earned: ({ s }) => s.finished }
  );
  for (const d of SECRETS) list.push({ ...d, secret: true, earned: () => false });
  return list;
}

// Geheime Entdeckungen (Reihenfolge = Anzeige). Erkennung: discoveries.js
export const SECRETS = [
  { id: "secret-hello", icon: "chat" },
  { id: "secret-zen", icon: "leaf" },
  { id: "secret-emoji", icon: "smile" },
  { id: "secret-bignum", icon: "hash" },
  { id: "secret-infinite", icon: "infinity" },
  { id: "secret-glitches", icon: "stack" },
  { id: "secret-inventor", icon: "bulb" },
  { id: "secret-pixel", icon: "grid" },
  { id: "secret-music", icon: "music" },
  { id: "secret-remix", icon: "send" },
  { id: "secret-crash", icon: "burst" },
];

// Icon eines Abzeichens als SVG-Markup
export function badgeIcon(badge, size = 18) {
  return badge.chapter ? hexNumber(badge.chapter, { size }) : icon(badge.icon, { size });
}

// i18n-Schlüssel eines Abzeichens (Kapitel-Abzeichen teilen sich einen Text mit {n})
export function badgeKey(badge) {
  return badge.chapter ? "badge.chapter" : `badge.${badge.id}`;
}

// Neu verdiente Abzeichen eintragen und zurückgeben.
export function awardBadges(course, progress) {
  const s = course.stats(progress);
  const fresh = [];
  for (const b of badgeList(course)) {
    if (progress.data.badges[b.id]) continue;
    if (b.earned({ p: progress, s })) {
      progress.data.badges[b.id] = localDay();
      fresh.push(b);
    }
  }
  if (fresh.length) progress.save();
  return fresh;
}
