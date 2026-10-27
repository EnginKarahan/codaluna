// PyQuest – Unit-Tests der App-Logik (Node, ohne Zusatzpakete).
//   node --import ./tests/lib/register.mjs --test tests/unit.test.mjs
//
// Abgedeckt: Fehlererklärungen (mit echten Python-Fehlern aus Pyodide), Fortschritt
// (Migration, Streak, Import), Sync-Zusammenführung, Kursmodell, Abzeichen, Prüfwerkzeuge.

import { test } from "node:test";
import assert from "node:assert/strict";
import { loadRuntime } from "./lib/runtime.mjs";
import { explainError } from "/src/js/errors.js";
import { applyFix } from "/src/js/fixes.js";
import { progress, sanitize, localDay, weekStart } from "/src/js/progress.js";
import { mergeProgress } from "/src/js/sync.js";
import { createCourse, SANDBOX_ID } from "/src/js/course.js";
import { awardBadges, badgeList, SECRETS } from "/src/js/badges.js";
import { findDiscoveries, awardDiscoveries } from "/src/js/discoveries.js";
import { encodeCode, decodeCode, shareToken, MAX_CODE } from "/src/js/share.js";
import { unlocksAt, SKINS, LIGHTS } from "/src/js/workshop.js";
import { lines, numbers, hasNumber, width, py, need, makeContext } from "/content/lib/check-kit.js";
import courseData from "/content/courses/season-1.js";

const course = createCourse(courseData, {});
const rt = await loadRuntime();
const runPy = (code, spec = {}) => JSON.parse(rt.run_scripted_json(code, JSON.stringify(spec)));

// ---------------------------------------------------------------------------
// Fehlererklärungen: echter Python-Fehler -> erwarteter Erklärungstext
// ---------------------------------------------------------------------------
const ERROR_CASES = [
  ["if True\n    pass\n", "errx.colon"],
  ['print("a"\n', "errx.neverClosed"],
  ['print("a"))\n', "errx.unmatched"],
  ['print("a"]\n', "errx.mismatch"],
  ['print("abc)\n', "errx.unterminated"],
  ["print(“Hallo”)\n", "errx.smartQuote"],
  ["x = 5 € 3\n", "errx.badChar"],
  ["x = 1\u200b\n", "errx.nonPrintable"],
  ['print "Hallo"\n', "errx.printParens"],
  ["x = [1 2]\n", "errx.comma"],
  ["x = 1\nif x = 5:\n    pass\n", "errx.compareEq"],
  ["print(x) = 5\n", "errx.assignTarget"],
  ["2spieler = 5\n", "errx.digitName"],
  ["x = 2\nprint(3x)\n", "errx.implicitMul"],
  ["return 5\n", "errx.returnOutside"],
  ["try:\n    x = 1\nprint(x)\n", "errx.tryBlock"],
  ["for i in range(3):\nprint(i)\n", "errx.indentAfter"],
  ["def f():\nreturn 1\n", "errx.indentAfterDef"],
  ["x = 1\n    y = 2\n", "errx.unexpectedIndent"],
  ["if True:\n    x = 1\n  y = 2\n", "errx.unindent"],
  ['print("Alter: " + 12)\n', "errx.concat"],
  ['print(1 + "a")\n', "errx.operand"],
  ['print("5" > 3)\n', "errx.compareTypes"],
  ["def f(a):\n    pass\nf(1, 2)\n", "errx.tooManyArgs"],
  ["def f(a):\n    pass\nf()\n", "errx.missingArgs"],
  ["x = 5\nx()\n", "errx.notCallable"],
  ["x = 5\nprint(x[0])\n", "errx.notSubscriptable"],
  ["for i in 5:\n    pass\n", "errx.notIterable"],
  ['print("ab" * "3")\n', "errx.multiplySeq"],
  ['int("abc")\n', "errx.intParse"],
  ['float("3,5")\n', "errx.floatParse"],
  ["print([1, 2][5])\n", "errx.index"],
  ['print({"a": 1}["b"])\n', "errx.key"],
  ["z = 0\ndef g():\n    z = z + 1\ng()\n", "errx.unboundLocal"],
  ["import turtle\n", "errx.moduleGraphics"],
  ["import gibtsnicht\n", "errx.moduleMissing"],
  ["from station import pixel\npixel(16, 0)\n", "errx.stationRange"],
  ["from station import pixel\npixel(0, 0, 'magenta')\n", "errx.stationColor"],
  ["from station import pixel\npixel(1.5, 0)\n", "errx.stationWhole"],
  ["from station import tempo\ntempo('schnell')\n", "errx.stationNumber"],
  ["from station import note\nnote('X9')\n", "errx.stationNote"],
  ["from station import drum\ndrum('klavier')\n", "errx.stationDrum"],
  ["from station import pixel\nwhile True:\n    pixel(0, 0, 'red')\n", "errx.stationEvents"],
  ["from drone import *\nmove(3)\n", "errx.tooManyArgs"],
  ["def f(n):\n    return f(n + 1)\nf(1)\n", "errx.recursion"],
  ["prnt(1)\n", "errx.didYouMean"],
  ["[1].apend(2)\n", "errx.didYouMean"],
  ["random.randint(1, 6)\n", "errx.forgotImport"],
  ["print(Hallo)\n", "errx.needQuotes"],
  ["while punkte < 10:\n    pass\n", "errx.nameUnknown"],
  ["print(1 / 0)\n", "err.ZeroDivisionError.hint"],
];

test("Fehlererklärungen passen zu echten Python-Fehlern (Pyodide)", () => {
  for (const [code, key] of ERROR_CASES) {
    const r = runPy(code);
    assert.ok(r.error, `kein Fehler bei: ${JSON.stringify(code)}`);
    const ex = explainError(r.error, code);
    assert.equal(ex.key, key, `${JSON.stringify(code)} -> ${r.error.type}: ${r.error.message}`);
    assert.ok(!ex.hint.includes("{0}") && !ex.hint.includes("{1}"), `Platzhalter nicht ersetzt: ${key}`);
  }
});

// Typische Anfängerfehler: [Code, erwarteter Schlüssel, korrigierte Zeile oder null (nur Erklärung)].
// Jede Korrektur muss den Fehler wirklich beheben (der gleiche Fehler tritt danach nicht mehr auf).
const FIX_CASES = [
  ['print("hallo", "wie geht es Dir?" \\n "sagt der fremde Mann.")\n', "errx.escapeOutside", 'print("hallo", "wie geht es Dir?\\nsagt der fremde Mann.")'],
  ['print("Hallo") \\n\n', "errx.escapeOutside", 'print("Hallo\\n")'],
  ['print("a" \\ "b")\n', "errx.lineCont", 'print("a" "b")'],
  ["x = 3\nif x > 1:\n    pass\nelse if x > 2:\n    pass\n", "errx.elseIf", "elif x > 2:"],
  ["x = 3\nIf x > 3:\n    pass\n", "errx.keywordCase", "if x > 3:"],
  ["x = 3\nwenn x > 3:\n    pass\n", "errx.foreignWord", "if x > 3:"],
  ['drucke("Hallo")\n', "errx.foreignWord", 'print("Hallo")'],
  ["x = 5\nif x => 5:\n    pass\n", "errx.compareOp", "if x >= 5:"],
  ["x = 1\nx++\n", "errx.incDec", "x += 1"],
  ['mein name = "Ada"\n', "errx.spaceInName", 'mein_name = "Ada"'],
  ["mein-name = 5\n", "errx.hyphenName", "mein_name = 5"],
  ["class = 5\n", "errx.keywordName", null],
  ["for i range(10):\n    pass\n", "errx.forIn", "for i in range(10):"],
  ["for i in 1 to 10:\n    pass\n", "errx.forTo", "for i in range(1, 11):"],
  ["for i in range 10:\n    pass\n", "errx.rangeParens", "for i in range(10):"],
  ["x = 5\nif x == 5 and < 10:\n    pass\n", "errx.andCompare", "if x == 5 and x < 10:"],
  ["x = 3\nif x > 1:\n    pass\n    else:\n        pass\n", "errx.elseIndent", "else:"],
  ["elif x:\n    pass\n", "errx.elseNoIf", null],
  ["print('C'est la vie')\n", "errx.apostrophe", 'print("C\'est la vie")'],
  ["print('Hallo\")\n", "errx.quoteMismatch", 'print("Hallo")'],
  ['print(Hallo")\n', "errx.needQuotes", 'print("Hallo")'],
  ["x = 5\nif (x > 3:\n    pass\n", "errx.closeBeforeColon", "if (x > 3):"],
  ['print("Hallo" ; "Welt")\n', "errx.semicolon", 'print("Hallo", "Welt")'],
  ['print(,"b")\n', "errx.extraComma", 'print("b")'],
  ['name = "Ada"\nprint("Hallo " + name + )\n', "errx.missingValue", 'print("Hallo " + name)'],
  ['print("x"):\n', "errx.extraColon", 'print("x")'],
  ["def gruss:\n    pass\n", "errx.defParens", "def gruss():"],
  ['print"Hallo")\n', "errx.missingOpenParen", 'print("Hallo")'],
  ["x = 5\nif x = 5:\n    pass\n", "errx.compareEq", "if x == 5:"],
  ["5 = x\n", "errx.assignSwap", "x = 5"],
  ["x = 3\ny = 2x + 1\n", "errx.implicitMul", "y = 2 * x + 1"],
  ["1spieler = 5\n", "errx.digitName", "spieler1 = 5"],
  ["zahl = 007\n", "errx.leadingZero", "zahl = 7"],
  ["print(1 000)\n", "errx.numberSpace", "print(1000)"],
  ["x = [1, 2 3]\n", "errx.comma", "x = [1, 2, 3]"],
  ['print(Hallo Welt)\n', "errx.needQuotes", 'print("Hallo Welt")'],
  ['mein_name = "Ada"\nprint(mein name)\n', "errx.spaceInName", "print(mein_name)"],
  ['print("a", end="", "b")\n', "errx.keywordArgOrder", 'print("a", "b", end="")'],
  ['x = 5\nprint(f"{x")\n', "errx.fstringClose", 'print(f"{x}")'],
  ['x = 5\nprint(f"x}")\n', "errx.fstringSingle", 'print(f"{x}")'],
  ['print(„Hallo“)\n', "errx.smartQuote", 'print("Hallo")'],
  ["print(3 × 4)\n", "errx.badChar", "print(3 * 4)"],
  ['print("Hallo"\nprint("Welt")\n', "errx.neverClosed", 'print("Hallo")'],
  ["liste = [1, 2,\n         3, 4\nprint(liste)\n", "errx.neverClosed", null],
  ['print("Hallo)\n', "errx.unterminated", 'print("Hallo")'],
  ["x = 5\nif x > 3:\nprint(x)\n", "errx.indentAfter", "    print(x)"],
  ["x = 3\nif x > 1:\n    pass\n  else:\n    pass\n", "errx.unindent", "else:"],
  ["break\n", "errx.loopOnly", null],
  ["print(punkte)\npunkte = 5\n", "errx.usedBefore", null],
  ['print("Hallo", Welt)\n', "errx.needQuotes", 'print("Hallo", "Welt")'],
  ['Print("x")\n', "errx.didYouMean", 'print("x")'],
  ["from random import randInt\n", "errx.didYouMean", "from random import randint"],
  ["import Random\n", "errx.moduleCase", "import random"],
  ["random.randint(1, 6)\n", "errx.forgotImport", "import random"],
  ['alter = 5\nprint("Du bist " + alter + " Jahre")\n', "errx.concat", 'print(f"Du bist {alter} Jahre")'],
  ['print("Summe: " + 3 + 4)\n', "errx.concat", null],
  ['zahl = input("Zahl: ")\nif zahl > 5:\n    pass\n', "errx.inputNumber", 'zahl = int(input("Zahl: "))'],
  ['n = input("Wie oft? ")\nfor i in range(n):\n    pass\n', "errx.inputNumber", 'n = int(input("Wie oft? "))'],
  ['zahl = input("Zahl: ")\nprint(zahl * 2.5)\n', "errx.inputNumber", 'zahl = float(input("Zahl: "))'],
  ["print(2(3 + 4))\n", "errx.implicitMulParen", "print(2 * (3 + 4))"],
  ["liste = [1]\nliste = liste + 5\n", "errx.listConcat", "liste.append(5)"],
  ['x = 3\nname = input("Wie alt bist du,", x, "?")\n', "errx.inputArgs", 'name = input(f"Wie alt bist du, {x} ?")'],
  ["liste = [3, 1]\nliste = liste.sort()\nprint(liste[0])\n", "errx.noneFromMethod", "liste.sort()"],
  ['print(int("3.5"))\n', "errx.intParseDecimal", 'print(float("3.5"))'],
  ['print(int(""))\n', "errx.intParseEmpty", null],
  ['name = "Ada"\nname[0] = "E"\n', "errx.itemAssign", null],
  ["print(len(5))\n", "errx.noLen", null],
  ['name = "Ada"\nname.append("x")\n', "errx.strAppend", null],
  ["for i in range(2.5):\n    pass\n", "errx.floatAsInt", null],
  ["def f():\n\tif True:\n        pass\n", "err.TabError.hint", "def f():\n    if True:\n        pass\n"],
];

test("Typische Anfängerfehler: passende Erklärung und Korrektur, die wirklich hilft", () => {
  const run = (code) => runPy(code, { inputs: ["7", "7", "7"] });
  for (const [code, key, fixed] of FIX_CASES) {
    const r = run(code);
    assert.ok(r.error, `kein Fehler bei: ${JSON.stringify(code)}`);
    const ex = explainError(r.error, code);
    const what = `${JSON.stringify(code)} -> ${r.error.type}: ${r.error.message}`;
    assert.equal(ex.key, key, what);
    assert.ok(!/\{\d\}/.test(ex.hint), `Platzhalter nicht ersetzt: ${key}`);
    if (fixed === null) {
      assert.equal(ex.fix, undefined, `keine Korrektur erwartet: ${what}`);
      continue;
    }
    assert.ok(ex.fix, `Korrektur fehlt: ${what}`);
    assert.equal(ex.fix.code !== undefined ? ex.fix.code : ex.fix.text, fixed, what);
    const r2 = run(applyFix(code, ex.fix));
    const same = r2.error && r2.error.type === r.error.type && r2.error.message === r.error.message && r2.error.line === r.error.line;
    assert.ok(!same, `Korrektur behebt den Fehler nicht: ${what}`);
  }
});

test("Fehlerstelle: markiert genau das Zeichen, an dem es hakt", () => {
  const code = 'print("hallo", "wie geht es Dir?" \\n "sagt der fremde Mann.")\n';
  const ex = explainError(runPy(code).error, code);
  assert.equal(ex.text.slice(ex.spot.from, ex.spot.to), "\\n");
  const code2 = "x = 3\nif x > 1:\n    pass\nelse if x > 2:\n    pass\n";
  const ex2 = explainError(runPy(code2).error, code2);
  assert.equal(ex2.text.slice(ex2.spot.from, ex2.spot.to), "else if");
  const code3 = 'lieblingszahl = 7\nprnt(lieblingszahl)\n';
  const ex3 = explainError(runPy(code3).error, code3);
  assert.equal(ex3.text.slice(ex3.spot.from, ex3.spot.to), "prnt");
});

test("Fehler zeigen die richtige Zeile", () => {
  assert.equal(runPy('a = 1\nb = 2\nprnt(a)\n').error.line, 3);
  assert.equal(runPy("def f():\n    return 1 / 0\n\nf()\n").error.line, 2);
  assert.equal(runPy('print("a"\nprint(2)\n').error.line, 1);
});

test("Laufzeit: frischer Namensraum, exit() ist kein Fehler, Prompts getrennt von der Ausgabe", () => {
  runPy("x = 5\n");
  assert.equal(runPy("print(x)\n").error.type, "NameError");
  const ex = runPy('print("tschüss")\nexit()\n');
  assert.equal(ex.ok, true);
  const io = runPy('n = input("Name? ")\nprint("Hi", n)\n', { inputs: ["Ada"] });
  assert.equal(io.out, "Hi Ada\n");
  assert.deepEqual(io.prompts, ["Name? "]);
  assert.deepEqual(io.chunks, ["", "Hi Ada\n"]);
});

// ---------------------------------------------------------------------------
// Fortschritt
// ---------------------------------------------------------------------------
test("Fortschritt: alte Version 1 wird übernommen, kaputte Daten werden repariert", () => {
  const v1 = { xp: 70, completed: { "s1-l1": true, "s1-l2": true }, code: { "s1-l1": "print(1)" }, streak: 3, lastActive: "2026-07-20" };
  const d = sanitize(v1);
  assert.equal(d.v, 2);
  assert.ok(d.completed["s1-l1"] && d.completed["s1-l2"]);
  assert.equal(d.code["s1-l1"], "print(1)");
  assert.equal(d.streak, 3);
  assert.equal(d.xp, undefined, "XP werden nicht gespeichert, sondern berechnet");
  const broken = sanitize({ completed: "x", code: { a: 5 }, streak: -4, stats: { runs: "viele" }, badges: [1, 2] });
  assert.deepEqual(broken.completed, {});
  assert.deepEqual(broken.code, {});
  assert.equal(broken.streak, 0);
  assert.equal(broken.stats.runs, 0);
  assert.deepEqual(broken.badges, {});
});

test("Fortschritt: Streak zählt Übungstage nach lokalem Datum", () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  progress.data = sanitize({ streak: 4, lastActive: localDay(d) });
  progress.practice();
  assert.equal(progress.data.streak, 5);
  assert.equal(progress.data.lastActive, localDay());
  progress.practice(); // am selben Tag zählt es nicht doppelt
  assert.equal(progress.data.streak, 5);
  progress.data = sanitize({ streak: 9, lastActive: "2020-01-01" });
  assert.equal(progress.streak, 0, "abgebrochene Streak zeigt 0");
  progress.practice();
  assert.equal(progress.data.streak, 1);
});

test("Fortschritt: Wochenziel statt Streak, nichts reißt", () => {
  assert.equal(weekStart("2026-10-14"), "2026-10-12", "Mittwoch -> Montag");
  assert.equal(weekStart("2026-10-12"), "2026-10-12");
  assert.equal(weekStart("2026-10-18"), "2026-10-12", "Sonntag gehört zur Woche davor");
  progress.data = sanitize({});
  assert.equal(progress.weekGoal, 3);
  progress.data.days = { [localDay()]: 1 };
  assert.equal(progress.weekDays(), 1);
  // drei Tage derselben Woche erfüllen das Ziel
  progress.data = sanitize({ days: { "2026-10-12": 1, "2026-10-14": 1, "2026-10-18": 1, "2026-10-19": 1 } });
  assert.equal(progress.weekDays("2026-10-15"), 3);
  progress.markWeek("2026-10-18");
  assert.equal(progress.weeksMet, 1);
  progress.setWeekGoal(4);
  assert.equal(progress.weekGoal, 4);
  progress.setWeekGoal(6); // nicht erlaubt
  assert.equal(progress.weekGoal, 4);
  // practice() trägt den Tag ein, kaputte Werte werden aussortiert
  progress.data = sanitize({ days: { "kein-datum": 1 }, weekGoal: 99 });
  assert.deepEqual(progress.data.days, {});
  assert.equal(progress.data.weekGoal, 3);
  progress.practice();
  assert.equal(progress.data.days[localDay()], 1);
});

test("Fortschritt: alte Streak-Abzeichen werden zu Wochenziel-Abzeichen", () => {
  const d = sanitize({ badges: { "streak-3": "2026-07-01", "streak-7": "2026-07-05" }, lastActive: "2026-07-05" });
  assert.equal(d.badges["week-1"], "2026-07-01");
  assert.equal(d.badges["week-4"], "2026-07-05");
  assert.equal(d.badges["streak-3"], undefined);
  assert.equal(d.days["2026-07-05"], 1, "letzter Übungstag zählt als Übungstag");
});

test("Entdeckungen: Neugier wird belohnt (echte Python-Läufe)", () => {
  const run = (code) => {
    const result = runPy(code);
    if (result.ok) result.analysis = JSON.parse(rt.analyze(code, null));
    return result;
  };
  progress.data = sanitize({});
  const ids = (code, extra = {}) => findDiscoveries({ result: run(code), code, progress, ...extra });
  assert.ok(ids("import this\n").includes("secret-zen"));
  assert.ok(ids('print("Hallo Lumo!")\n').includes("secret-hello"));
  assert.ok(ids('print("🚀")\n').includes("secret-emoji"));
  assert.ok(ids("print(2 ** 100)\n").includes("secret-bignum"));
  assert.deepEqual(ids('print("Hallo")\n'), []);
  const inventor = "def doppelt(x):\n    return 2 * x\nprint(doppelt(4))\n";
  assert.ok(ids(inventor, { sandbox: true }).includes("secret-inventor"));
  assert.ok(!ids(inventor, { sandbox: false }).includes("secret-inventor"), "nur auf dem Spielplatz");
  assert.ok(findDiscoveries({ result: { stopped: true, reason: "user", elapsed: 3000 }, progress }).includes("secret-infinite"));
  assert.ok(!findDiscoveries({ result: { stopped: true, reason: "user", elapsed: 3000, atInput: true }, progress }).includes("secret-infinite"), "Stop während input() zählt nicht");
  assert.ok(!findDiscoveries({ result: { stopped: true, reason: "user", elapsed: 300 }, progress }).includes("secret-infinite"), "sofortiger Stop zählt nicht");
  assert.ok(!findDiscoveries({ result: { stopped: true, reason: "switch" }, progress }).includes("secret-infinite"));
  // fünf verschiedene Fehlerarten
  for (const code of ["x(\n", "print(y)\n", "1/0\n", "int('a')\n"]) ids(code);
  assert.ok(!ids("print(1)\n").includes("secret-glitches"));
  assert.ok(ids("[1][3]\n").includes("secret-glitches"));
  // vergeben wird jede Entdeckung nur einmal
  progress.data = sanitize({});
  const r = { result: run("print(2 ** 100)\n"), code: "", progress };
  assert.deepEqual(awardDiscoveries(r, SECRETS), ["secret-bignum"]);
  assert.deepEqual(awardDiscoveries(r, SECRETS), []);
  assert.ok(badgeList(course).filter((b) => b.secret).length === SECRETS.length);
});

test("Station: Bildschirm und Lautsprecher liefern Ereignisse für die Prüfung", () => {
  const r = runPy(
    'from station import pixel, fill, note, drum, rest, tempo\nfill("navy")\npixel(0, 0, "schwarz")\npixel(1, 1, "Grün")\npixel(2, 2, "kırmızı")\npixel(3, 3, "#0f0")\ntempo(60)\nnote("la4")\nrest()\nnote("C5", 0.5)\ndrum("bum")\n'
  );
  assert.ok(r.ok, JSON.stringify(r.error));
  assert.equal(r.screen.size, 16);
  assert.equal(Object.keys(r.screen.pixels).length, 255, "schwarz schaltet einen Pixel aus");
  assert.equal(r.screen.pixels["1,1"], "#5ed16a");
  assert.equal(r.screen.pixels["2,2"], "#ff5a4e");
  assert.equal(r.screen.pixels["3,3"], "#00ff00");
  assert.deepEqual(r.music.map((m) => [m.k, m.n, m.at, m.d]), [["note", "la4", 0, 1], ["note", "C5", 2, 0.5], ["drum", "kick", 2.5, 1]]);
  assert.equal(r.music[0].f, 440);
  assert.equal(r.out, "", "Ereignisse sind keine Textausgabe");
  const ctx = makeContext({ result: r });
  assert.equal(ctx.screen.lit, 255);
  assert.equal(ctx.screen.colors, 4);
  assert.equal(ctx.tones("drum"), 1);
  assert.equal(runPy('print("x")\n').screen, undefined, "ohne Station keine Bildschirmdaten");
});

test("Teilen: Code steckt verlustfrei im Link, kaputte Links fallen auf", async () => {
  const code = 'from station import pixel\nfor x in range(16):\n    pixel(x, x, "pink")  # 🌸 Ünïcödé\n';
  const token = await encodeCode(code);
  assert.match(token, /^[01][A-Za-z0-9_-]+$/);
  assert.equal(await decodeCode(token), code);
  assert.equal(shareToken("#p=" + token), token);
  assert.equal(shareToken("#irgendwas"), null);
  await assert.rejects(decodeCode("1%%%"));
  await assert.rejects(decodeCode("9abc"));
  await assert.rejects(decodeCode(await encodeCode("x".repeat(MAX_CODE + 1))), "zu lange Programme werden abgelehnt");
});

test("Werkstatt und Entdeckungen von Paket 2", () => {
  assert.deepEqual(unlocksAt(1).length, 2, "Level 1: Standard-Farben und -Licht");
  assert.ok(unlocksAt(3).length >= 1);
  assert.deepEqual(unlocksAt(11), []);
  assert.equal(new Set(SKINS.map((s) => s.level)).size, SKINS.length);
  assert.ok(LIGHTS.every((l) => /^#[0-9a-f]{6}$/.test(l.color)));
  const d = sanitize({ look: { skin: "night", light: "<script>" } });
  assert.deepEqual(d.look, { skin: "night", light: "teal" });
  progress.data = sanitize({});
  const pic = runPy('from station import fill\nfill("gold")\n');
  const song = runPy('from station import note\nfor i in range(16):\n    note("C4", 0.25)\n');
  assert.ok(findDiscoveries({ result: pic, progress }).includes("secret-pixel"));
  assert.ok(findDiscoveries({ result: song, progress }).includes("secret-music"));
});

test("Fortschritt: Import prüft das Format", () => {
  progress.data = sanitize({});
  assert.throws(() => progress.importJSON("[1,2,3]"));
  assert.throws(() => progress.importJSON('{"hallo": 1}'));
  progress.importJSON(JSON.stringify({ completed: { "s1-l1": "2026-10-01" } }));
  assert.ok(progress.isDone("s1-l1"));
});

test("Wochenziel: Tage von anderen Geräten zählen, gewähltes Ziel bleibt erhalten", () => {
  // Gerät B übt samstags, das Konto bringt Montag und Dienstag mit
  const local = sanitize({ days: { "2026-10-17": 1 }, lastActive: "2026-10-17" });
  const remote = sanitize({ days: { "2026-10-12": 1, "2026-10-13": 1 }, weekGoal: 3 });
  const m = mergeProgress(local, remote);
  assert.ok(m.weeks["2026-10-12"], "die Woche gilt als erreicht");
  const custom = mergeProgress(sanitize({}), sanitize({ weekGoal: 5 }));
  assert.equal(custom.weekGoal, 5, "neues Gerät übernimmt das Ziel aus dem Konto");
  assert.equal(mergeProgress(sanitize({ weekGoal: 2 }), sanitize({ weekGoal: 5 })).weekGoal, 2, "eigene Wahl gewinnt");
});

test("Sync: Übungstage und Wochenziele werden zusammengeführt", () => {
  const a = sanitize({ days: { "2026-10-12": 1 }, weeks: { "2026-10-05": "2026-10-09" }, glitches: { NameError: 1 } });
  const b = sanitize({ days: { "2026-10-13": 1 }, glitches: { TypeError: 1 } });
  const m = mergeProgress(a, b);
  assert.deepEqual(Object.keys(m.days).sort(), ["2026-10-12", "2026-10-13"]);
  assert.equal(m.weeks["2026-10-05"], "2026-10-09");
  assert.deepEqual(Object.keys(m.glitches).sort(), ["NameError", "TypeError"]);
});

test("Sync: nichts geht verloren, XP bleiben stimmig", () => {
  const local = { completed: { "s1-l1": "2026-10-01" }, code: { "s1-l1": "lokal" }, stats: { runs: 3 } };
  const remote = { completed: { "s1-l2": "2026-10-02" }, bonus: { "s1-l1": "2026-10-02" }, code: { "s1-l1": "fern", "s1-l2": "fern2" }, stats: { runs: 9 } };
  const m = mergeProgress(local, remote);
  assert.ok(m.completed["s1-l1"] && m.completed["s1-l2"]);
  assert.ok(m.bonus["s1-l1"]);
  assert.equal(m.code["s1-l1"], "lokal");
  assert.equal(m.code["s1-l2"], "fern2");
  assert.equal(m.stats.runs, 9);
  progress.data = m;
  const l1 = course.get("s1-l1").lesson;
  const l2 = course.get("s1-l2").lesson;
  assert.equal(course.xp(progress), l1.xp + l2.xp + l1.expert.xp);
});

// ---------------------------------------------------------------------------
// Kursmodell und Abzeichen
// ---------------------------------------------------------------------------
test("Kurs: Nummerierung, Boss/Finale, Freischalten, Fortsetzen", () => {
  const main = course.flat.filter((e) => e.strand === "main");
  const lessonsOnly = main.filter((e) => e.type === "lesson");
  assert.deepEqual(
    lessonsOnly.map((e) => e.number),
    lessonsOnly.map((_, i) => i + 1),
    "Lektionen sind lückenlos durchnummeriert"
  );
  assert.equal(main.filter((e) => e.type === "boss").length, 3);
  assert.equal(main[main.length - 1].type, "final");
  assert.equal(course.finalId, main[main.length - 1].lesson.id, "Finale ist das Ende des Hauptkurses, nicht einer Nebenmission");
  progress.data = sanitize({});
  assert.ok(course.isUnlocked("s1-l1", progress));
  assert.ok(!course.isUnlocked("s1-l2", progress));
  assert.ok(course.isUnlocked(SANDBOX_ID, progress));
  progress.data = sanitize({ completed: { "s1-l1": "x" } });
  assert.ok(course.isUnlocked("s1-l2", progress));
  assert.equal(course.resumeId(progress), "s1-l2");
  progress.data = sanitize({ completed: { "s1-l1": "x" }, last: "s3-l1" }); // gesperrt -> nicht fortsetzen
  assert.equal(course.resumeId(progress), "s1-l2");
  const ids = course.flat.map((e) => e.lesson.id);
  assert.equal(new Set(ids).size, ids.length, "IDs sind eindeutig");
});

test("Kurs: Nebenmissionen haben eigene Reihenfolge und öffnen sich mit dem Hauptkurs", () => {
  const drone = course.flat.filter((e) => e.strand === "drone");
  assert.ok(drone.length >= 5);
  assert.deepEqual(drone.filter((e) => e.type === "lesson").map((e) => e.number), drone.filter((e) => e.type === "lesson").map((_, i) => i + 1));
  progress.data = sanitize({});
  assert.ok(course.isUnlocked("d-1", progress), "erster Einsatz ist sofort offen");
  assert.ok(!course.isUnlocked("d-2", progress));
  assert.ok(!course.isUnlocked("g-1", progress), "Glitch-Jagd braucht erst input()");
  assert.equal(course.missingRequirement("g-1", progress).lesson.id, "s1-l5");
  progress.data = sanitize({ completed: { "d-1": "x", "d-2": "x", "d-3": "x" } });
  assert.ok(!course.isUnlocked("d-4", progress), "Schleifen-Einsatz erst nach der for-Lektion");
  progress.data.completed["s2-l4"] = "x";
  assert.ok(course.isUnlocked("d-4", progress));
  assert.equal(course.next("d-3").lesson.id, "d-4", "weiter innerhalb des Strangs");
  assert.equal(course.next("s4-boss4"), null, "nach dem Finale geht es nicht in eine Nebenmission");
  assert.equal(course.resumeId(progress), "s1-l1", "Fortsetzen bleibt im Hauptkurs");
  const all = course.flat.filter((e) => e.strand === "glitch").map((e) => e.lesson.id);
  progress.data = sanitize({ completed: Object.fromEntries(all.map((id) => [id, "x"])) });
  assert.ok(course.strandDone("glitch", progress));
  assert.ok(awardBadges(course, progress).some((b) => b.id === "strand-glitch"));
});

test("Drohne: Welt, Sensoren, Crash und versteckte Testwelten", () => {
  const world = { map: ["#######", "#D.*.G#", "#######"], dir: "E" };
  const run = (code, w = world) => runPy(code, { world: w });
  let r = run("from drone import *\nwhile not at_goal():\n    if on_crystal():\n        collect()\n    move()\n");
  assert.ok(r.ok, JSON.stringify(r.error));
  assert.deepEqual(
    { goal: r.drone.goal, crystals: r.drone.crystals, left: r.drone.left, x: r.drone.x, steps: r.drone.steps },
    { goal: true, crystals: 1, left: 0, x: 5, steps: 5 }
  );
  r = run("from drone import *\nfor i in range(5):\n    move()\n");
  assert.equal(r.error.type, "DroneCrash");
  assert.equal(r.error.line, 3, "die Zeile mit dem Aufprall wird gezeigt");
  assert.ok(findDiscoveries({ result: r, progress }).includes("secret-crash"));
  assert.equal(run("from drone import *\ncollect()\n").error.type, "DroneError");
  assert.equal(run("from drone import *\nwhile not at_goal():\n    pass\n").error.type, "DroneError", "Endlosschleife ohne Flug wird gestoppt");
  r = runPy("from drone import *\nturn_left()\nprint(front_clear())\n");
  assert.ok(r.ok && r.drone, "ohne Mission fliegt Lumo auf dem Spielplatz-Eisfeld");
  assert.equal(r.out.trim(), "False");
  assert.equal(runPy('print("ohne Drohne")\n').drone, undefined, "nur wer Lumo benutzt, sieht das Eisfeld");
  // versteckte Testwelten: auswendig gezählte Schritte bestehen nicht
  const lesson = course.get("d-5").lesson;
  const counted = "from drone import *\nfor i in range(7):\n    move()\n";
  const tests = JSON.parse(rt.verify(counted, JSON.stringify(lesson.tests)));
  assert.ok(tests.some((t) => !t.ok || !t.drone.goal));
});

test("Kurs: jede Lektion ist vollständig", () => {
  for (const { lesson } of course.flat) {
    for (const f of ["title", "intro", "taskHtml", "starterCode", "solution"]) assert.ok(lesson[f], `${lesson.id}.${f}`);
    assert.ok(Array.isArray(lesson.hints) && lesson.hints.length >= 2, `${lesson.id}: Tipps`);
    assert.equal(typeof lesson.check, "function", `${lesson.id}: Prüfung`);
    assert.ok(lesson.xp > 0, `${lesson.id}: XP`);
    if (lesson.expert) {
      assert.ok(lesson.expert.html && lesson.expert.solution && lesson.expert.check && lesson.expert.xp > 0, `${lesson.id}: Bonus`);
    }
  }
});

test("Abzeichen: werden einmal vergeben und gespeichert", () => {
  progress.data = sanitize({ completed: { "s1-l1": "x" }, stats: { runs: 1, errors: 1 } });
  const first = awardBadges(course, progress).map((b) => b.id);
  assert.ok(first.includes("first-run") && first.includes("first-error") && first.includes("first-lesson"));
  assert.deepEqual(awardBadges(course, progress), [], "kein zweites Mal");
  const ids = badgeList(course).map((b) => b.id);
  assert.equal(new Set(ids).size, ids.length);
});

// ---------------------------------------------------------------------------
// Prüfwerkzeuge
// ---------------------------------------------------------------------------
test("check-kit: Hilfsfunktionen", () => {
  assert.deepEqual(lines("a\n\n  b  \n"), ["a", "  b"]);
  assert.deepEqual(numbers("x 3, -2 und 4,5"), [3, -2, 4.5]);
  assert.ok(hasNumber("Schnitt: 23.2", 23.2));
  assert.equal(width("⭐⭐"), 2);
  assert.equal(py`
    if a:
        b()
  `, "if a:\n    b()\n");
  assert.deepEqual(need([true, "x"], [false, "y", { n: 1 }]), { passed: false, feedback: "y", params: { n: 1 } });
  assert.deepEqual(need([() => true, "x"]), { passed: true });
  const r = makeContext({ code: "print(1)", result: { out: "1\n", analysis: { syntax: true, calls: { print: 1 } } } });
  assert.equal(r.call("print"), 1);
  assert.ok(r.num(1));
});

// ---------------------------------------------------------------------------
// Robustheit (aus dem Code-Review): keine Prüfung darf bei ungewöhnlichen
// Ergebnissen abstürzen, und Prüfläufe enden auch bei `except:` in Schleifen.
// ---------------------------------------------------------------------------
test("Keine Lektionsprüfung wirft bei leeren oder kaputten Ergebnissen", () => {
  const brokenTests = [
    [],
    [{ ok: false }],
    [{ ok: true, out: "", chunks: [] }],
    [{ ok: true, out: "x\n", chunks: [""], value: null }],
    [{ ok: true, out: "1\n2\n", chunks: ["", "a"], value: { error: "nofunc" } }],
    [{ ok: false, exhausted: true }, { ok: false, timeout: true }],
    Array.from({ length: 8 }, () => ({ ok: true, out: "", chunks: [], value: [] })),
  ];
  const results = [
    {},
    { out: "", analysis: { syntax: true } },
    { out: "True\nFalse\n42\n", analysis: { syntax: true, calls: { print: 3 } } },
  ];
  for (const { lesson } of course.flat) {
    for (const target of [lesson, lesson.expert].filter(Boolean)) {
      for (const result of results) {
        for (const tests of brokenTests) {
          const r = makeContext({ code: "", starter: lesson.starterCode, result, tests });
          let res;
          assert.doesNotThrow(() => {
            res = target.check(r);
          }, `${lesson.id}${target === lesson ? "" : " (Bonus)"} wirft bei ${JSON.stringify(tests).slice(0, 60)}`);
          assert.equal(typeof res.passed, "boolean", `${lesson.id}: Ergebnis ohne passed`);
          if (!result.out) assert.equal(res.passed, false, `${lesson.id}: leeres Ergebnis darf nicht bestehen`);
        }
      }
    }
  }
});

test("Prüfläufe enden auch bei except: in einer Endlosschleife", () => {
  const code = 'while True:\n    try:\n        x = int(input("Zahl? "))\n        break\n    except:\n        print("nochmal")\n';
  const t0 = Date.now();
  const r = runPy(code, { inputs: ["a", "b"] });
  assert.ok(Date.now() - t0 < 5000, "Prüflauf hängt");
  assert.ok(r.exhausted || r.timeout, JSON.stringify(r).slice(0, 120));
  const t1 = Date.now();
  const r2 = runPy("while True:\n    try:\n        pass\n    except:\n        pass\n", { time: 0.5 });
  assert.ok(Date.now() - t1 < 5000 && r2.timeout, "Zeitlimit wird verschluckt");
  const r3 = runPy('try:\n    exit()\nexcept:\n    print("verschluckt")\nprint("weiter")\n');
  assert.equal(r3.ok, true);
  assert.equal(r3.out, "", "exit() in try/except: beendet das Programm");
});

test("sys.stdin liest in Prüfläufen die vorgegebenen Eingaben", () => {
  const r = runPy("import sys\nzeile = sys.stdin.readline()\nprint(zeile.strip().upper())\n", { inputs: ["abc"] });
  assert.equal(r.out, "ABC\n");
  const r2 = runPy("import sys\nprint(len(sys.stdin.readline()))\n", { inputs: [] });
  assert.equal(r2.exhausted, true);
});

test("Fehler bei Compiler-Prüfungen zeigen die Codezeile", () => {
  const r = runPy("x = 1\nreturn x\n");
  assert.equal(r.error.type, "SyntaxError");
  assert.equal(r.error.line, 2);
  assert.ok(r.error.traceback.includes("return x"), r.error.traceback);
});
