// Codaluna – Kurs „Season 1: Python-Starter“ (deutsche Basis).
//
// Inhalt = Daten. Übersetzungen liegen als Overlays in content/i18n/season-1.<lang>.js
// und überschreiben nur Texte und Code (title, intro, taskHtml, hints, starterCode,
// solution, feedback, expert.html/solution/feedback). Prüfungen, Tests und XP gelten
// für alle Sprachen gleich – deshalb prüfen sie sprachneutral: Code-Struktur (AST),
// Zahlen in der Ausgabe und versteckte Testläufe mit vorgegebenen Eingaben.
//
// Kapitel-Schema: id, title, region {icon (Name aus src/js/icons.js), name, pos [x, y] auf der Stationskarte, intro, outro},
//   strand? ("drone", "glitch": Nebenmissionen neben dem Hauptkurs, siehe course.js)
//
// Lektions-Schema:
//   id, type ("lesson" | "boss" | "final"), title, story (Missions-Aufhänger, 1–2 Sätze),
//   requires? (Lektion des Hauptkurses, die vorher erledigt sein muss), intro (HTML), taskHtml, hints[],
//   starterCode, solution, xp,
//   tests?: [{inputs, fill, seed, randint, probe}]   versteckte Testläufe
//   check(r) -> need(...)                              siehe content/lib/check-kit.js
//   feedback?: {schlüssel: "HTML"}                     Rückmeldungen dieser Lektion
//   expert?: {xp, html, solution, tests, check, feedback}   Bonus-Aufgabe
//
// Breite Themen (Spiele, Musik, Kunst, Geschichten, Alltag, Daten) und gemischte
// Namen, damit sich alle angesprochen fühlen. Ton: ermutigend, Fehler sind normal.

import { need, rules as R, numbers, hasNumber, width, leadingSpaces, py } from "../lib/check-kit.js";
import missions from "./season-1-missions.js";

// ---- kleine Helfer für die Prüfungen ----
const T = (r, i = 0) => r.tests[i] || { ok: false, lines: [], out: "", chunks: [], value: null };
// Ausgabe nach der k-ten Eingabe eines Testlaufs ("" wenn es sie nicht gibt)
const chunk = (r, i, k) => (T(r, i).chunks[k] || "").trim();
// k-ter Wert eines Prüf-Ausdrucks (undefined, wenn der Ausdruck keine Liste lieferte)
const val = (r, k) => (Array.isArray(T(r).value) ? T(r).value[k] : undefined);
const lastNum = (s) => {
  const n = numbers(s);
  return n.length ? n[n.length - 1] : null;
};
const lists = (t, min = 1) => (Array.isArray(t.value) ? t.value.filter((x) => Array.isArray(x) && x.length >= min) : []);
const dicts = (t, min = 1) =>
  Array.isArray(t.value)
    ? t.value.filter((x) => x && typeof x === "object" && !Array.isArray(x) && Object.keys(x).length >= min)
    : [];
const increasing = (a) => a.length >= 2 && a.every((x, i) => i === 0 || x > a[i - 1]);
const decreasing = (a) => a.length >= 2 && a.every((x, i) => i === 0 || x < a[i - 1]);
const lineHas = (r, value) => r.lines.some((l) => l.includes(String(value)));
const containsRun = (seq, run) => {
  for (let i = 0; i + run.length <= seq.length; i++) if (run.every((x, j) => seq[i + j] === x)) return true;
  return false;
};
const firstNumbers = (ls) =>
  ls.map((l) => {
    const n = numbers(l);
    return n.length ? n[0] : null;
  });
// Stehen die Einträge der Liste in der Ausgabe in sortierter Reihenfolge?
const printedSorted = (list, out) => {
  const pos = list.map(String).sort().map((x) => out.indexOf(x));
  return pos.every((p, i) => p >= 0 && (i === 0 || p > pos[i - 1]));
};
const frameLines = (ls) => ls.filter((l) => /^(\S)\1{9,}$/.test(l.trim())).length;
const sameNumbers = (a, b) => Array.isArray(a) && a.length === b.length && a.every((x, i) => typeof x === "number" && Math.abs(x - b[i]) < 1e-9);

const course = {
  id: "season-1",
  title: "Season 1: Python-Starter",
  chapters: [
    // ================================================================== KAPITEL 1
    {
      id: "c1",
      title: "Erste Befehle",
      region: { icon: "antenna", name: "Funkraum", pos: [88, 150],
        intro: "Der Funkraum ist dunkel. Wenn die Station wieder sprechen soll, braucht sie Befehle – und die schreibst du.",
        outro: "Die Station spricht, rechnet und fragt wieder zurück. Lumo dreht vor Freude eine Runde." },
      lessons: [
        {
          id: "s1-l1",
          title: "Hallo, Welt!",
          story: "Das Funkgerät der Station schweigt seit Jahren. Schick die allererste Nachricht hinaus – Hauptsache, sie klingt nach dir!",
          intro: `
<p>Ein Programm ist eine Liste von <b>Befehlen</b>, die der Computer der Reihe nach abarbeitet.
Dein allererster Befehl ist <code>print()</code> – er schreibt etwas in die <b>Konsole</b>
(das dunkle Feld unter dem Editor).</p>

<p><b>Wichtig: Text braucht Anführungszeichen.</b> Alles, was Python <i>wörtlich</i> ausgeben soll,
schreibst du zwischen Anführungszeichen: <code>"…"</code>. So einen Text nennt man einen
<b>String</b> (englisch für „Zeichenkette“). Die Anführungszeichen sagen Python:
„Das hier ist Text, kein Befehl.“</p>

<pre><code>print("Hallo Welt!")</code></pre>

<p>Ließe man die Anführungszeichen weg (<code>print(Hallo)</code>), würde Python glauben,
<code>Hallo</code> sei ein Name, den es kennen müsste – und einen Fehler melden. Die
Anführungszeichen selbst werden übrigens <b>nicht</b> mit ausgegeben.</p>

<p>Keine Sorge, hier kann nichts kaputtgehen. Ändere den Text und drück
<b>Ausführen</b> (oder Strg + Enter).</p>`,
          taskHtml:
            "Ändere den Text: Gib eine <b>eigene Nachricht</b> aus – dein Motto, einen Gruß oder deinen Lieblingsspruch. Denk an die Anführungszeichen!",
          hints: [
            'Schreib deinen Text zwischen die Anführungszeichen: <code>print("…")</code>.',
            'Zum Beispiel: <code>print("Heute lerne ich Python!")</code>',
          ],
          starterCode: py`
            print("Hallo Welt!")
          `,
          solution: py`
            print("Heute lerne ich Python!")
          `,
          xp: 20,
          check: (r) => need(R.print(r), R.changed(r), R.output(r)),
          expert: {
            xp: 10,
            html: `
<p>Du kannst <b>mehrere Dinge</b> mit Komma ausgeben – Python setzt automatisch ein Leerzeichen
dazwischen: <code>print("Hallo", "Welt")</code>. Und <code>\\n</code> beginnt <i>innerhalb</i>
eines Texts eine neue Zeile.</p>
<p><b>Bonus:</b> Schreib ein <code>print()</code>, das mit Kommas mehrere Teile ausgibt und mit
<code>\\n</code> über mindestens zwei Zeilen geht.</p>`,
            solution: py`
              print("Hallo", "Welt!", "\nSchön, dass du da bist.")
            `,
            check: (r) =>
              need(
                [Math.max(0, ...r.ast.printCalls) >= 2, "printComma"],
                [r.ast.newlineStrings > 0, "newline"],
                R.minLines(r, 2)
              ),
            feedback: {
              printComma: 'Gib in <b>einem</b> <code>print()</code> mehrere Teile mit Komma aus: <code>print("A", "B")</code>.',
              newline: "Nutze <code>\\n</code> in einem Text, um eine neue Zeile zu beginnen.",
            },
          },
        },
        {
          id: "s1-l2",
          title: "Merken mit Variablen",
          story: "Die Station hat ihr Gedächtnis verloren. Bring ihr bei, sich etwas zu merken – fang mit deiner Lieblingszahl an.",
          intro: `
<p>Eine <b>Variable</b> ist ein Behälter mit einem Namen. Mit dem Gleichheitszeichen
<code>=</code> legst du etwas hinein (das nennt man „zuweisen“). Danach kannst du den Namen
benutzen, um wieder an den Wert zu kommen.</p>

<pre><code>lieblingszahl = 7
print(lieblingszahl)</code></pre>

<p>Der <b>Name</b> steht links, der <b>Wert</b> rechts vom <code>=</code>. Das <code>=</code>
bedeutet hier „bekommt den Wert“ – nicht „ist gleich“ wie in Mathe.</p>

<p><b>Zahl oder Text?</b> Zahlen schreibst du <i>ohne</i> Anführungszeichen (<code>7</code>).
Und um die <i>Variable</i> auszugeben, kommt ihr Name <b>ohne</b> Anführungszeichen in die
Klammern: <code>print(lieblingszahl)</code> gibt <code>7</code> aus. <code>print("lieblingszahl")</code>
würde dagegen einfach das Wort ausgeben.</p>`,
          taskHtml:
            "Speichere deine <b>Lieblingszahl</b> in der Variablen und gib sie mit <code>print()</code> aus – den Namen der Variablen ohne Anführungszeichen!",
          hints: [
            "Erst zuweisen: <code>lieblingszahl = 42</code>",
            "Dann ausgeben: <code>print(lieblingszahl)</code>",
          ],
          starterCode: py`
            lieblingszahl = 0
            # Setz deine Lieblingszahl ein und gib sie aus
          `,
          solution: py`
            lieblingszahl = 42
            print(lieblingszahl)
          `,
          xp: 20,
          check: (r) =>
            need(R.print(r), [r.ast.printArgs.includes("Name"), "printName"], [numbers(r.out).length > 0, "needNumber"]),
          feedback: {
            printName:
              "Gib die <b>Variable</b> aus: Ihr Name kommt <b>ohne</b> Anführungszeichen in die Klammern, also <code>print(lieblingszahl)</code>.",
            needNumber: "Speichere eine <b>Zahl</b> – ohne Anführungszeichen, zum Beispiel <code>lieblingszahl = 7</code>.",
          },
          expert: {
            xp: 10,
            html: `
<p>Eine Variable kann sich <b>ändern</b>. <code>punkte = punkte + 50</code> nimmt den alten Wert,
rechnet 50 dazu und legt das Ergebnis zurück in denselben Behälter. Namen dürfen Buchstaben,
Ziffern und <code>_</code> enthalten, aber nicht mit einer Ziffer beginnen.</p>
<p><b>Bonus:</b> Leg <code>punkte = 100</code> an, erhöhe den Wert danach um 50 und gib ihn aus.</p>`,
            solution: py`
              punkte = 100
              punkte = punkte + 50
              print(punkte)
            `,
            check: (r) => need([r.ast.selfUpdates > 0, "selfUpdate"], [r.num(150), "result150"]),
            feedback: {
              selfUpdate: "Erhöhe den Wert mit <code>punkte = punkte + 50</code> (oder kurz <code>punkte += 50</code>).",
              result150: "Am Ende sollte 150 ausgegeben werden.",
            },
          },
        },
        {
          id: "s1-l3",
          title: "Der Spar-Rechner",
          story: "Im Bordcomputer klemmt noch eine alte Rechenaufgabe der Crew. Zeig ihm, dass die Station wieder rechnen kann.",
          intro: `
<p>Python ist ein prima Taschenrechner. Rechnen geht mit <code>+</code> (plus),
<code>-</code> (minus), <code>*</code> (mal) und <code>/</code> (geteilt) – man nimmt also
<code>*</code> statt „×“ und <code>/</code> statt „÷“.</p>

<p><b>Wichtig:</b> Zahlen schreibst du ohne Anführungszeichen. Sonst behandelt Python sie als
Text und rechnet nicht (<code>"5" + "3"</code> ergäbe <code>"53"</code> statt <code>8</code>!).</p>

<pre><code>pro_woche = 5
wochen = 8
print(pro_woche * wochen)</code></pre>

<p>Das Schöne an Variablen: Ändert sich ein Wert, rechnet das Programm automatisch neu.
Mia legt jede Woche etwas Taschengeld zurück. Rechne mit ihren Variablen.</p>`,
          taskHtml:
            "Wie viel hat Mia nach <b>8 Wochen</b> gespart, wenn sie <b>5&nbsp;€</b> pro Woche zurücklegt? Rechne mit den beiden Variablen und gib das Ergebnis aus. (Zur Kontrolle: Es sind 40.)",
          hints: ["Malnehmen geht mit <code>*</code>.", "<code>print(pro_woche * wochen)</code>"],
          starterCode: py`
            pro_woche = 5
            wochen = 8
            # Berechne die Ersparnis und gib sie aus
          `,
          solution: py`
            pro_woche = 5
            wochen = 8
            print(pro_woche * wochen)
          `,
          xp: 25,
          check: (r) =>
            need(
              R.print(r),
              [r.node("Mult") > 0, "needMult"],
              [(r.ast.opsWithNames.Mult || 0) > 0, "useVars"],
              [r.num(40), "result40"]
            ),
          feedback: {
            needMult: "Lass Python rechnen: Malnehmen geht mit <code>*</code>.",
            useVars:
              "Rechne mit den <b>Variablen</b> statt mit festen Zahlen: <code>pro_woche * wochen</code>. Dann stimmt das Ergebnis auch, wenn sich ein Wert ändert.",
            result40: "Das Ergebnis sollte 40 sein. Prüf deine Rechnung.",
          },
          expert: {
            xp: 10,
            html: `
<p>Nach wie vielen <b>ganzen</b> Wochen sind 100&nbsp;€ zusammen? Der Operator <code>//</code>
teilt und schneidet die Nachkommastellen ab (<code>100 // 5</code> ergibt 20).</p>
<p><b>Bonus:</b> Leg <code>ziel = 100</code> an und berechne mit <code>//</code>, wie viele Wochen
Mia braucht.</p>`,
            solution: py`
              pro_woche = 5
              ziel = 100
              print(ziel // pro_woche, "Wochen")
            `,
            check: (r) => need([r.node("FloorDiv") > 0, "floorDiv"], [r.num(20), "result20"]),
            feedback: {
              floorDiv: "Nutze <code>//</code> zum Teilen ohne Rest: <code>ziel // pro_woche</code>.",
              result20: "Es sollten 20 Wochen herauskommen.",
            },
          },
        },
        {
          id: "s1-l4",
          title: "Verrückte Geschichten",
          story: "Der Funk empfängt nur Wortfetzen: ein Tier, ein Ort. Mach daraus die verrückteste Funknachricht des Eismonds.",
          intro: `
<p>Wie bekommst du den Inhalt einer Variablen <i>in</i> einen Text hinein? Ein normaler String
gibt alles wörtlich aus: <code>print("Ich mag tier")</code> schreibt wirklich „Ich mag tier“.
Die Lösung ist ein <b>f-String</b>: Setz ein <code>f</code> direkt vor das Anführungszeichen und
schreib die Variable in geschweifte Klammern <code>{ }</code>.</p>

<pre><code>tier = "Katze"
print(f"Eine {tier} lernt Python!")</code></pre>

<p>Das <code>f</code> steht für „format“. Nur die Namen in <code>{ }</code> werden durch ihren
Wert ersetzt, der Rest bleibt normaler Text. Damit baust du im Handumdrehen Sätze,
Geschichten oder Steckbriefe.</p>`,
          taskHtml:
            "Schreib mit einem <b>f-String</b> einen verrückten Satz, in dem <code>tier</code> und <code>ort</code> vorkommen.",
          hints: [
            'Beginne mit <code>print(f"...")</code> – das <code>f</code> nicht vergessen!',
            "Setz die Variablen in geschweifte Klammern: <code>{tier}</code> und <code>{ort}</code>.",
          ],
          starterCode: py`
            tier = "Katze"
            ort = "Mond"
            # Baue mit einem f-String einen lustigen Satz
          `,
          solution: py`
            tier = "Katze"
            ort = "Mond"
            print(f"Eine {tier} tanzt auf dem {ort}!")
          `,
          xp: 30,
          check: (r) =>
            need(
              R.print(r),
              R.fstring(r),
              [r.ast.fstringFields >= 2, "twoFields"],
              [Object.values(r.ast.strAssigns).filter((v) => v && r.out.includes(v)).length >= 2, "valuesInOutput"]
            ),
          feedback: {
            twoFields: "Setz <b>beide</b> Variablen in geschweifte Klammern in deinen f-String: <code>{tier}</code> und <code>{ort}</code>.",
            valuesInOutput: "In der Ausgabe sollen die Werte von <code>tier</code> und <code>ort</code> stehen – mit f-String und geschweiften Klammern.",
          },
          expert: {
            xp: 10,
            html: `
<p>In den <code>{ }</code> darf sogar <b>gerechnet</b> werden: <code>print(f"{3 * 4} Tore")</code>
gibt „12 Tore“ aus.</p>
<p><b>Bonus:</b> Leg <code>siege = 5</code> an und gib mit einem f-String aus, wie viele Punkte
das sind (3 Punkte pro Sieg) – gerechnet <i>in</i> den geschweiften Klammern.</p>`,
            solution: py`
              siege = 5
              print(f"{siege} Siege sind {siege * 3} Punkte!")
            `,
            check: (r) => need(R.fstring(r), [r.ast.fstringExprs.includes("BinOp"), "calcInBraces"], [r.num(15), "result15"]),
            feedback: {
              calcInBraces: "Rechne direkt in den geschweiften Klammern: <code>{siege * 3}</code>.",
              result15: "Bei 5 Siegen sollten 15 Punkte herauskommen.",
            },
          },
        },
        {
          id: "s1-l5",
          title: "Frag den Computer",
          story: "Die Station will wissen, mit wem sie es zu tun hat. Lass sie nach deinem Namen fragen – und dich begrüßen.",
          intro: `
<p><code>input()</code> hält dein Programm an, zeigt eine Frage und wartet, bis du etwas
eintippst und Enter drückst. Deine Antwort speicherst du am besten in einer Variablen.</p>

<pre><code>name = input("Wie heißt du? ")
print("Hallo " + name)</code></pre>

<p>Der Text in den Klammern ist die Frage (der „Prompt“). Mit <code>+</code> kannst du zwei
Texte <b>aneinanderkleben</b> – achte auf das Leerzeichen in <code>"Hallo "</code>.</p>

<p><b>Merke:</b> <code>input()</code> liefert <i>immer</i> Text – auch wenn du eine Zahl
eintippst. Wie man daraus eine echte Zahl macht, lernst du in Kapitel 2.</p>`,
          taskHtml:
            "Frag nach dem Namen und gib danach eine <b>persönliche Begrüßung</b> aus, in der der Name vorkommt. Beim Ausführen erscheint unten in der Konsole ein Eingabefeld.",
          hints: [
            "Die Antwort steckt in der Variablen <code>name</code>.",
            'Zusammenkleben: <code>print("Hallo " + name)</code>',
          ],
          starterCode: py`
            name = input("Wie heißt du? ")
            # Begrüße die Person persönlich
          `,
          solution: py`
            name = input("Wie heißt du? ")
            print("Willkommen, " + name + "!")
          `,
          xp: 30,
          tests: [{ inputs: ["Ada"] }],
          check: (r) => need(R.input(r), R.print(r), R.tests(r), [T(r).out.includes("Ada"), "nameInGreeting"]),
          feedback: {
            nameInGreeting:
              'In der Begrüßung soll der eingegebene Name stehen: <code>print("Hallo " + name)</code> – <code>name</code> ohne Anführungszeichen.',
          },
          expert: {
            xp: 10,
            html: `
<p><b>Bonus:</b> Frag <b>zwei</b> Dinge ab (zum Beispiel Name und Wohnort) und bau die
Antworten mit einem <b>f-String</b> zu einem Satz zusammen – das liest sich schöner als
<code>+</code>.</p>`,
            solution: py`
              name = input("Name: ")
              stadt = input("Wo wohnst du? ")
              print(f"{name} aus {stadt} – cool!")
            `,
            tests: [{ inputs: ["Ada", "Köln"] }],
            check: (r) =>
              need(R.input(r, 2), R.fstring(r), R.tests(r), [T(r).out.includes("Ada") && T(r).out.includes("Köln"), "bothInSentence"]),
            feedback: { bothInSentence: "Beide Antworten sollen in deinem Satz vorkommen." },
          },
        },
        {
          id: "s1-boss1",
          type: "boss",
          title: "Dein Steckbrief-Generator",
          story: "Die Sicherheitsschleuse lässt nur Crew-Mitglieder mit Ausweis durch. Bau einen Steckbrief-Generator, damit die Station dich kennenlernt.",
          intro: `
<p>Zeit, alles zu verbinden! Du fragst ein paar Dinge ab und baust daraus eine schicke
Steckbrief-Karte. Du brauchst dafür <code>input()</code> (fragen), Variablen (merken) und
f-Strings (ausgeben).</p>

<pre><code>name = input("Name: ")
print(f"Name: {name}")</code></pre>

<p>Tipp: Fang mit einer Frage an, teste, und füge dann Schritt für Schritt weitere hinzu.</p>`,
          taskHtml:
            "Frag mindestens <b>drei</b> Dinge mit <code>input()</code> ab und gib einen <b>Steckbrief</b> aus, in dem alle Antworten vorkommen – mit f-Strings.",
          hints: [
            'Noch ein <code>input(…)</code> darunter, zum Beispiel <code>tier = input("Lieblingstier: ")</code>.',
            'Für jede Antwort eine Zeile: <code>print(f"Name: {name}")</code>',
          ],
          starterCode: py`
            name = input("Name: ")
            hobby = input("Lieblingshobby: ")
            # Frag noch etwas ab und gib einen Steckbrief mit f-Strings aus
          `,
          solution: py`
            name = input("Name: ")
            hobby = input("Lieblingshobby: ")
            tier = input("Lieblingstier: ")
            print("--- STECKBRIEF ---")
            print(f"Name:  {name}")
            print(f"Hobby: {hobby}")
            print(f"Tier:  {tier}")
          `,
          xp: 50,
          tests: [{ inputs: ["Ada", "Schach", "Igel"], fill: "Musik" }],
          check: (r) =>
            need(
              R.input(r, 3),
              R.fstring(r),
              R.tests(r),
              [["Ada", "Schach", "Igel"].every((x) => T(r).out.includes(x)), "allAnswers"]
            ),
          feedback: {
            allAnswers: "Im Steckbrief sollen <b>alle</b> Antworten erscheinen. Gib jede Variable mit einem f-String aus.",
          },
          expert: {
            xp: 15,
            html: `
<p>Mach die Karte hübscher: Ein Rahmen aus Zeichen macht was her. <code>"=" * 20</code>
erzeugt eine Linie aus 20 Gleichheitszeichen.</p>
<p><b>Bonus:</b> Setz über und unter deinen Steckbrief eine solche Linie (mindestens 10 Zeichen lang).</p>`,
            solution: py`
              name = input("Name: ")
              hobby = input("Lieblingshobby: ")
              tier = input("Lieblingstier: ")
              print("=" * 24)
              print(f"  STECKBRIEF: {name}")
              print(f"  Hobby: {hobby} · Tier: {tier}")
              print("=" * 24)
            `,
            tests: [{ inputs: ["Ada", "Schach", "Igel"], fill: "Musik" }],
            check: (r) => need(R.tests(r), [frameLines(T(r).lines) >= 2, "frame"]),
            feedback: { frame: 'Gib über und unter dem Steckbrief eine Linie aus, zum Beispiel <code>print("=" * 20)</code>.' },
          },
        },
      ],
    },

    // ================================================================== KAPITEL 2
    {
      id: "c2",
      title: "Entscheidungen & Schleifen",
      region: { icon: "hangar", name: "Hangar", pos: [196, 200],
        intro: "Im Hangar warten Türen, Rover und Signallampen. Damit sie selbst entscheiden und Dinge wiederholen, brauchen sie Bedingungen und Schleifen.",
        outro: "Das Hangartor öffnet sich, und draußen glitzert das Eis. Ab jetzt kann Lumo auch Außeneinsätze fliegen." },
      lessons: [
        {
          id: "s2-l1",
          title: "Wenn … dann …",
          story: "Die Hangartür öffnet sich nur bei genug Energiepunkten. Bring ihr bei, auch freundlich Nein zu sagen.",
          intro: `
<p>Programme müssen <b>entscheiden</b>. Mit <code>if</code> („wenn“) prüfst du eine Bedingung:
Ist sie wahr, läuft der eingerückte Block darunter. <code>else</code> („sonst“) ist der andere Fall.</p>

<pre><code>punkte = 120
if punkte &gt;= 100:
    print("Level geschafft!")
else:
    print("Fast! Weiter geht's.")</code></pre>

<p><b>Zwei Regeln nimmt Python streng:</b> Nach der Bedingung steht ein <b>Doppelpunkt</b>
<code>:</code>, und die Zeilen, die dazugehören, werden <b>eingerückt</b> (4 Leerzeichen – die
Tab-Taste macht das für dich).</p>

<p>Vergleichen kannst du mit <code>==</code> (gleich), <code>!=</code> (ungleich),
<code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> und <code>&gt;=</code>.
Achtung: <code>==</code> fragt „ist gleich?“, <code>=</code> weist zu.</p>

<p><b>Neu: Zahlen eingeben.</b> <code>input()</code> liefert immer Text. Mit <code>int(…)</code>
machst du daraus eine ganze Zahl, mit der Python vergleichen und rechnen kann:</p>
<pre><code>punkte = int(input("Wie viele Punkte? "))</code></pre>`,
          taskHtml:
            "Ergänze einen <code>else</code>-Block, der eine aufmunternde Nachricht ausgibt, wenn es <b>weniger als 100</b> Punkte sind. Teste dein Programm mit 120 und mit 50.",
          hints: [
            "<code>else:</code> steht genauso weit links wie das <code>if</code> – und hat einen Doppelpunkt.",
            'Die Zeile darunter rückst du ein: <code>    print("Fast! Weiter üben!")</code>',
          ],
          starterCode: py`
            punkte = int(input("Wie viele Punkte hast du? "))
            if punkte >= 100:
                print("Level geschafft! 🎉")
            # Ergänze hier den else-Fall
          `,
          solution: py`
            punkte = int(input("Wie viele Punkte hast du? "))
            if punkte >= 100:
                print("Level geschafft! 🎉")
            else:
                print("Fast! Weiter üben!")
          `,
          xp: 30,
          tests: [{ inputs: ["120"] }, { inputs: ["50"] }, { inputs: ["100"] }],
          check: (r) =>
            need(
              R.ifStmt(r),
              R.elseBlock(r),
              R.tests(r),
              [T(r, 1).lines.length > 0, "noElseOutput"],
              [T(r, 0).out !== T(r, 1).out, "sameOutput"],
              [T(r, 2).out === T(r, 0).out, "boundary"]
            ),
          feedback: {
            noElseOutput: "Bei 50 Punkten erscheint noch nichts. Gib im <code>else</code>-Block eine Nachricht aus.",
            sameOutput: "Bei 120 und bei 50 Punkten kommt dasselbe heraus. Im <code>else</code>-Block soll eine andere Nachricht stehen.",
            boundary: "Bei genau 100 Punkten ist das Level geschafft – lass die Bedingung <code>punkte &gt;= 100</code> so stehen.",
          },
          expert: {
            xp: 10,
            html: `
<p>Für mehr als zwei Fälle gibt es <code>elif</code> („sonst wenn“). Python prüft die
Bedingungen von oben nach unten und nimmt die erste, die stimmt.</p>
<p><b>Bonus:</b> Bau drei Stufen: ab 100 Punkten „Level geschafft“, ab 50 Punkten
„Fast geschafft“, sonst „Weiter üben“.</p>`,
            solution: py`
              punkte = int(input("Wie viele Punkte hast du? "))
              if punkte >= 100:
                  print("Level geschafft! 🎉")
              elif punkte >= 50:
                  print("Fast geschafft!")
              else:
                  print("Weiter üben!")
            `,
            tests: [{ inputs: ["120"] }, { inputs: ["70"] }, { inputs: ["10"] }],
            check: (r) => need(R.elif(r), R.tests(r), [new Set(r.tests.map((t) => t.out)).size === 3, "threeCases"]),
            feedback: { threeCases: "Bei 120, 70 und 10 Punkten soll jeweils etwas anderes erscheinen." },
          },
        },
        {
          id: "s2-l2",
          title: "Wahr oder falsch?",
          story: "Die Sensoren im Hangar melden nur noch True oder False. Teste, ob du ihre Sprache verstehst.",
          intro: `
<p>Jeder Vergleich hat ein Ergebnis: <code>True</code> (wahr) oder <code>False</code> (falsch).
Das nennt man einen <b>Wahrheitswert</b> (englisch: <i>boolean</i>). Genau damit trifft
<code>if</code> seine Entscheidung.</p>

<pre><code>print(10 &gt; 3)    # True
print(5 == 6)   # False</code></pre>

<p>Alles hinter <code>#</code> ist ein <b>Kommentar</b> – eine Notiz für Menschen, die Python
überspringt.</p>`,
          taskHtml:
            "Gib die Ergebnisse von <b>mindestens drei verschiedenen Vergleichen</b> aus. Mindestens einer soll <code>False</code> ergeben.",
          hints: [
            "Vergleiche direkt ausgeben: <code>print(7 &gt; 2)</code>",
            "Für <code>False</code> zum Beispiel: <code>print(5 == 6)</code>",
          ],
          starterCode: py`
            # Lass Python mindestens drei Vergleiche prüfen
            print(10 > 3)
          `,
          solution: py`
            print(10 > 3)
            print(5 == 5)
            print("Apfel" == "Birne")
          `,
          xp: 30,
          check: (r) =>
            need(
              [r.ast.compares >= 3, "threeCompares"],
              [(r.out.match(/\b(True|False)\b/g) || []).length >= 3, "printResults"],
              [/\bFalse\b/.test(r.out), "needFalse"]
            ),
          feedback: {
            threeCompares: "Du brauchst mindestens drei Vergleiche, zum Beispiel mit <code>&gt;</code>, <code>&lt;</code> und <code>==</code>.",
            printResults: "Gib jedes Vergleichsergebnis mit <code>print(…)</code> aus.",
            needFalse: "Mindestens ein Vergleich soll <code>False</code> ergeben, zum Beispiel <code>print(5 == 6)</code>.",
          },
          expert: {
            xp: 10,
            html: `
<p>Bedingungen lassen sich <b>verbinden</b>: <code>and</code> (beide müssen wahr sein),
<code>or</code> (mindestens eine) und <code>not</code> (kehrt um).</p>
<p><b>Bonus:</b> Leg <code>alter = 12</code> an und prüf mit <code>and</code>, ob das Alter
zwischen 10 und 15 liegt. Gib das Ergebnis aus.</p>`,
            solution: py`
              alter = 12
              print(alter >= 10 and alter <= 15)
            `,
            check: (r) => need([r.node("And") > 0, "useAnd"], [/\b(True|False)\b/.test(r.out), "printBool"]),
            feedback: {
              useAnd: "Verbinde die zwei Vergleiche mit <code>and</code>: <code>alter &gt;= 10 and alter &lt;= 15</code>.",
              printBool: "Gib das Ergebnis (<code>True</code> oder <code>False</code>) mit <code>print(…)</code> aus.",
            },
          },
        },
        {
          id: "s2-l3",
          title: "Der Zufall entscheidet",
          story: "Für das Rover-Spiel der Crew fehlt der Würfel. Lumo hätte gern einen, der wirklich zufällig ist.",
          intro: `
<p>Zufall macht Spiele spannend. Python bringt fertige Werkzeuge in <b>Modulen</b> mit – die
holst du dir mit <code>import</code>. Das Modul <code>random</code> kann würfeln.</p>

<pre><code>import random
zahl = random.randint(1, 6)
print("Du würfelst:", zahl)</code></pre>

<p><code>random.randint(1, 6)</code> gibt eine ganze Zufallszahl von 1 bis 6 (beide Enden
gehören dazu). <code>import random</code> schreibst du einmal ganz oben ins Programm.
Mit Komma kannst du in <code>print</code> Text und Zahl mischen.</p>`,
          taskHtml: "Baue einen <b>Würfel</b>: Gib eine Zufallszahl von 1 bis 6 aus. Führ das Programm mehrmals aus!",
          hints: [
            "<code>import random</code> steht schon ganz oben.",
            "<code>zahl = random.randint(1, 6)</code> und dann <code>print(zahl)</code>.",
          ],
          starterCode: py`
            import random
            # Würfle eine Zahl von 1 bis 6 und gib sie aus
          `,
          solution: py`
            import random
            zahl = random.randint(1, 6)
            print("Du würfelst:", zahl)
          `,
          xp: 35,
          tests: [1, 2, 3, 4, 5, 6, 7, 8].map((seed) => ({ seed })),
          check: (r) =>
            need(
              R.importRandom(r),
              [r.method("randint") > 0, "useRandint"],
              R.output(r),
              R.tests(r),
              [r.tests.every((t) => [1, 2, 3, 4, 5, 6].includes(lastNum(t.out))), "range16"],
              [new Set(r.tests.map((t) => t.out)).size > 1, "notRandom"]
            ),
          feedback: {
            useRandint: "Nutze <code>random.randint(1, 6)</code> für eine Zufallszahl.",
            range16: "Die Würfelzahl soll zwischen 1 und 6 liegen und am Ende der Ausgabe stehen.",
            notRandom: "Die Zahl ist jedes Mal gleich. Gib das Ergebnis von <code>random.randint(1, 6)</code> aus.",
          },
          expert: {
            xp: 10,
            html: `
<p>Mit <code>random.choice([...])</code> wählst du zufällig etwas <b>aus einer Liste</b> –
perfekt für ein Glücksrad.</p>
<p><b>Bonus:</b> Bau ein Glücksrad mit mindestens <b>vier</b> eigenen Preisen.</p>`,
            solution: py`
              import random
              preise = ["Nichts 😅", "Ein Eis", "5 Punkte", "Joker", "Hauptgewinn!"]
              print("Du gewinnst:", random.choice(preise))
            `,
            tests: [1, 2, 3, 4, 5, 6, 7, 8].map((seed) => ({ seed })),
            check: (r) =>
              need(
                [r.method("choice") > 0, "useChoice"],
                [r.ast.listLens.some((n) => n >= 4), "fourPrizes"],
                R.tests(r),
                [new Set(r.tests.map((t) => t.out)).size > 1, "notRandom"]
              ),
            feedback: {
              useChoice: "Nutze <code>random.choice(preise)</code>, um zufällig einen Preis zu ziehen.",
              fourPrizes: 'Deine Liste braucht mindestens vier Preise: <code>["A", "B", "C", "D"]</code>.',
              notRandom: "Das Ergebnis ist jedes Mal gleich. Gib aus, was <code>random.choice(…)</code> zieht.",
            },
          },
        },
        {
          id: "s2-l4",
          title: "Beat wiederholen",
          story: "Die Lautsprecher im Hangar knacken wieder. Zeit für den ersten Beat seit Jahren – lass ihn sich wiederholen!",
          intro: `
<p>Statt eine Zeile viermal zu kopieren, lässt du sie <b>wiederholen</b>. Das macht die
<code>for</code>-Schleife:</p>

<pre><code>for i in range(4):
    print("Bum - Tschak")</code></pre>

<p><code>range(4)</code> zählt <code>0, 1, 2, 3</code> – also vier Durchgänge. Die Variable
<code>i</code> ist der aktuelle Zähler. Auch hier gilt: <b>Doppelpunkt</b> am Ende, und der
wiederholte Teil ist <b>eingerückt</b>.</p>

<p><b>Hörbar wird dein Beat mit dem Lautsprecher der Station.</b> Hol dir dafür <code>drum</code>
(Schlagzeug) und <code>note</code> (Töne) aus dem Modul <code>station</code>:</p>

<pre><code>from station import drum, note

for i in range(4):
    drum("kick")
    drum("snare")
note("C5", 2)</code></pre>

<p>Schlagzeug: <code>"kick"</code>, <code>"snare"</code>, <code>"hihat"</code>, <code>"clap"</code>,
<code>"tom"</code>. Töne: <code>"C4"</code>, <code>"D4"</code>, <code>"E4"</code> … oder
<code>"do4"</code>, <code>"re4"</code>, <code>"mi4"</code> … Die Zahl nach dem Komma ist die Länge
in Schlägen (ohne Zahl: ein Schlag).</p>`,
          taskHtml:
            "Bau einen <b>Beat</b> mit einer <b><code>for</code>-Schleife</b>, die sich <b>mindestens dreimal</b> wiederholt – hörbar mit <code>drum()</code> oder <code>note()</code>, oder als Text mit <code>print()</code>. Der Befehl steht dabei nur einmal im Code, die Schleife wiederholt ihn.",
          hints: [
            '<code>for i in range(4):</code> und darunter eingerückt <code>drum("kick")</code> oder <code>print(…)</code>.',
            'Für den Sound steht ganz oben <code>from station import drum, note</code> – das ist schon da.',
          ],
          starterCode: py`
            from station import drum, note

            # Bau deinen Beat mit einer for-Schleife
            drum("kick")
          `,
          solution: py`
            from station import drum, note

            for i in range(4):
                drum("kick")
                drum("hihat")
                drum("snare")
                drum("hihat")
            note("C5", 2)
          `,
          xp: 35,
          check: (r) =>
            need(
              R.forLoop(r),
              [r.call("range") > 0, "useRange"],
              [["print", "drum", "note"].some((n) => (r.ast.callsInLoop[n] || 0) > 0), "printInLoop"],
              [r.lines.length >= 3 || r.music.length >= 3, "threeTimes"]
            ),
          feedback: {
            useRange: "Nutze <code>range(…)</code>, zum Beispiel <code>for i in range(4):</code>.",
            printInLoop:
              "Der Befehl (<code>drum</code>, <code>note</code> oder <code>print</code>) muss <b>eingerückt</b> unter der <code>for</code>-Zeile stehen, damit er wiederholt wird.",
            threeTimes: "Dein Beat soll mindestens dreimal erklingen (oder drei Zeilen ergeben). Zähl mit <code>range(…)</code> höher.",
          },
          expert: {
            xp: 10,
            html: `
<p>Der Zähler <code>i</code> ist nützlich: Damit kannst du deine Ausgabe nummerieren.
<code>range(1, 6)</code> zählt von 1 bis 5.</p>
<p><b>Bonus:</b> Gib mit einer Schleife „Runde 1“ bis „Runde 5“ aus.</p>`,
            solution: py`
              for i in range(1, 6):
                  print(f"Runde {i}")
            `,
            check: (r) =>
              need(R.forLoop(r), [containsRun(firstNumbers(r.lines), [1, 2, 3, 4, 5]), "numbered"]),
            feedback: { numbered: 'Die Zeilen sollen von 1 bis 5 nummeriert sein: <code>print(f"Runde {i}")</code> mit <code>range(1, 6)</code>.' },
          },
        },
        {
          id: "s2-l5",
          title: "Muster malen",
          story: "Die Signallampen am Hangartor sollen ein Muster zeigen, das wächst. Gerade leuchtet jede Reihe gleich – das geht besser.",
          intro: `
<p>Mit <code>*</code> kannst du nicht nur rechnen, sondern auch Text <b>vervielfachen</b>:
<code>"ab" * 3</code> ergibt <code>"ababab"</code>. Zusammen mit einer Schleife und dem
Zähler <code>i</code> entstehen Muster, die wachsen.</p>

<pre><code>for i in range(1, 4):
    print("#" * i)</code></pre>

<p><code>range(1, 4)</code> zählt von 1 bis 3. In der ersten Runde ist <code>i</code> also 1,
dann 2, dann 3 – und genauso viele Zeichen landen in der Zeile.</p>`,
          taskHtml:
            "Das Muster unten ist noch langweilig: Jede Zeile ist gleich lang. Ändere das Programm so, dass jede Zeile <b>länger wird als die davor</b>. Dein Symbol darfst du frei wählen.",
          hints: [
            '<code>"#" * 3</code> ergibt <code>###</code>. Was ergibt dann <code>"#" * i</code>?',
            'Ersetze die feste 3 durch den Zähler: <code>print("⭐" * i)</code>',
          ],
          starterCode: py`
            # Das Muster ist noch langweilig: Jede Zeile ist gleich lang.
            for i in range(1, 6):
                print("⭐" * 3)
          `,
          solution: py`
            for i in range(1, 6):
                print("⭐" * i)
          `,
          xp: 40,
          check: (r) =>
            need(
              R.forLoop(r),
              R.minLines(r, 3),
              [increasing(r.lines.map(width)) || decreasing(r.lines.map(width)), "grow"]
            ),
          feedback: { grow: 'Die Zeilen sind noch gleich lang. Lass die Länge mit dem Zähler wachsen: <code>"⭐" * i</code>.' },
          expert: {
            xp: 15,
            html: `
<p>Mit Leerzeichen am Anfang kannst du ein Muster nach rechts schieben – so entsteht eine
<b>Pyramide</b>. Tipp: <code>" " * (5 - i)</code> für die Lücke und <code>"*" * (2 * i - 1)</code>
für die Sterne.</p>
<p><b>Bonus:</b> Mal eine Pyramide aus mindestens vier Zeilen, die nach unten breiter wird.</p>`,
            solution: py`
              for i in range(1, 6):
                  print(" " * (5 - i) + "*" * (2 * i - 1))
            `,
            check: (r) =>
              need(
                R.minLines(r, 4),
                [decreasing(r.lines.map(leadingSpaces)), "indent"],
                [increasing(r.lines.map((l) => width(l.trim()))), "wider"]
              ),
            feedback: {
              indent: 'Jede Zeile soll weniger Leerzeichen am Anfang haben als die davor: <code>" " * (5 - i)</code>.',
              wider: "Die Sterne sollen von Zeile zu Zeile mehr werden.",
            },
          },
        },
        {
          id: "s2-l6",
          title: "Solange, bis …",
          story: "Der Rover steht startbereit auf der Rampe. Fehlt nur noch der Countdown.",
          intro: `
<p>Die <code>while</code>-Schleife wiederholt etwas, <b>solange</b> eine Bedingung wahr ist –
ideal, wenn du vorher nicht weißt, wie oft.</p>

<pre><code>zahl = 3
while zahl &gt; 0:
    print(zahl)
    zahl = zahl - 1
print("Los!")</code></pre>

<p><b>Ganz wichtig:</b> In der Schleife muss sich etwas ändern, das die Bedingung irgendwann
<code>False</code> macht – hier wird <code>zahl</code> kleiner. Passiert das nicht, läuft die
Schleife <i>ewig</i>. Keine Panik: Codaluna merkt das und hält dein Programm an (oder du
drückst <b>Stop</b>).</p>`,
          taskHtml:
            'Lass einen <b>Countdown von 10 bis 1</b> mit einer <code>while</code>-Schleife laufen und gib danach <code>Start! 🚀</code> aus.',
          hints: [
            "<code>while zahl &gt; 0:</code> – und darunter eingerückt <code>print(zahl)</code>.",
            "Verkleinere die Zahl in der Schleife: <code>zahl = zahl - 1</code>. Sonst läuft sie ewig!",
          ],
          starterCode: py`
            zahl = 10
            # Zähle mit einer while-Schleife von 10 bis 1 herunter
            # und gib danach "Start! 🚀" aus
          `,
          solution: py`
            zahl = 10
            while zahl > 0:
                print(zahl)
                zahl = zahl - 1
            print("Start! 🚀")
          `,
          xp: 40,
          check: (r) =>
            need(
              R.whileLoop(r),
              [containsRun(firstNumbers(r.lines), [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]), "countdown"],
              [r.lines.length > 0 && numbers(r.lines[r.lines.length - 1]).length === 0, "finalLine"]
            ),
          feedback: {
            countdown: "Die Ausgabe soll von 10 bis 1 herunterzählen – eine Zahl pro Zeile.",
            finalLine: "Gib nach der Schleife noch „Start! 🚀“ aus – <b>nicht</b> eingerückt, damit es nur einmal kommt.",
          },
          expert: {
            xp: 10,
            html: `
<p>In einer Schleife kann man auch etwas <b>aufsammeln</b>: Eine zweite Variable wächst bei
jedem Durchgang.</p>
<p><b>Bonus:</b> Berechne mit einer <code>while</code>-Schleife die Summe aller Zahlen von 1 bis 10
und gib sie aus.</p>`,
            solution: py`
              zahl = 1
              summe = 0
              while zahl <= 10:
                  summe = summe + zahl
                  zahl = zahl + 1
              print("Summe:", summe)
            `,
            check: (r) => need(R.whileLoop(r), [r.ast.selfUpdates >= 2, "accumulate"], [r.num(55), "result55"]),
            feedback: {
              accumulate: "Du brauchst zwei Variablen, die sich ändern: den Zähler und die Summe (<code>summe = summe + zahl</code>).",
              result55: "Die Summe von 1 bis 10 ist 55. Läuft deine Schleife bis einschließlich 10?",
            },
          },
        },
        {
          id: "s2-boss2",
          type: "boss",
          title: "Zahlen-Raten",
          story: "Das Hangartor ist mit einem Zahlencode gesichert, und das Schloss verrät nur „zu hoch“ oder „zu tief“. Bau das Spiel und knack den Code!",
          intro: `
<p>Der große Klassiker! Der Computer denkt sich eine Zahl aus, und du rätst – mit den Hinweisen
„zu hoch“ oder „zu tief“, bis du sie hast. Du brauchst alles aus diesem Kapitel:
<code>random</code>, <code>while</code>, <code>int(input())</code> und <code>if</code>/<code>elif</code>.</p>

<p>Die Schleife <code>while tipp != geheim:</code> läuft, solange der Tipp <b>nicht</b> stimmt.
Darin fehlt noch der wichtigste Teil: die Hinweise.</p>`,
          taskHtml:
            "Vervollständige das Spiel: In der Schleife soll <b>„zu hoch“</b> oder <b>„zu tief“</b> ausgegeben werden, je nach Tipp. Bei einem richtigen Tipp kommt kein Hinweis. Probier es danach selbst aus!",
          hints: [
            "<code>if tipp &gt; geheim:</code> → zu hoch.",
            "<code>elif tipp &lt; geheim:</code> → zu tief. Beide stehen eingerückt in der Schleife, unter der <code>input</code>-Zeile.",
          ],
          starterCode: py`
            import random
            geheim = random.randint(1, 20)
            tipp = 0

            while tipp != geheim:
                tipp = int(input("Deine Zahl (1-20): "))
                # Gib hier einen Hinweis: zu hoch oder zu tief?

            print("Erwischt! 🎉")
          `,
          solution: py`
            import random
            geheim = random.randint(1, 20)
            tipp = 0

            while tipp != geheim:
                tipp = int(input("Deine Zahl (1-20): "))
                if tipp > geheim:
                    print("zu hoch")
                elif tipp < geheim:
                    print("zu tief")

            print("Erwischt! 🎉")
          `,
          xp: 60,
          // geheim ist im Test immer 7: erst zu hoch (12), dann zu tief (3), dann richtig
          tests: [
            { randint: 7, inputs: ["12", "3", "7"] },
            { randint: 7, inputs: ["7"] },
          ],
          check: (r) =>
            need(
              R.whileLoop(r),
              R.ifStmt(r),
              R.tests(r),
              [() => chunk(r, 0, 1) !== "", "tooHigh"],
              [() => chunk(r, 0, 2) !== "", "tooLow"],
              [() => chunk(r, 0, 1) !== chunk(r, 0, 2), "highLow"],
              [
                () => {
                  const win = chunk(r, 1, 1);
                  return !win.includes(chunk(r, 0, 1)) && !win.includes(chunk(r, 0, 2));
                },
                "winNoHint",
              ]
            ),
          feedback: {
            tooHigh: "Bei einem zu großen Tipp erscheint noch kein Hinweis. Prüf mit <code>if tipp &gt; geheim:</code>.",
            tooLow: "Bei einem zu kleinen Tipp erscheint noch kein Hinweis. Prüf mit <code>elif tipp &lt; geheim:</code>.",
            highLow: "Bei zu hohen und zu tiefen Tipps erscheint derselbe Hinweis. Gib unterschiedliche Hinweise aus.",
            winNoHint: "Beim richtigen Tipp soll kein „zu hoch“ oder „zu tief“ kommen. Nutze <code>elif tipp &lt; geheim:</code> statt <code>else:</code>.",
          },
          expert: {
            xp: 15,
            html: `
<p><b>Bonus:</b> Zähle die Versuche mit und gib am Ende aus, wie viele es waren – zum Beispiel
„Erwischt in 3 Versuchen!“. Tipp: Leg vor der Schleife <code>versuche = 0</code> an und erhöhe
den Wert bei jedem Tipp.</p>`,
            solution: py`
              import random
              geheim = random.randint(1, 20)
              tipp = 0
              versuche = 0

              while tipp != geheim:
                  tipp = int(input("Deine Zahl (1-20): "))
                  versuche = versuche + 1
                  if tipp > geheim:
                      print("zu hoch")
                  elif tipp < geheim:
                      print("zu tief")

              print(f"Erwischt in {versuche} Versuchen! 🎉")
            `,
            tests: [
              { randint: 7, inputs: ["12", "3", "7"] },
              { randint: 7, inputs: ["7"] },
            ],
            check: (r) =>
              need(
                [r.ast.selfUpdates > 0, "counter"],
                R.tests(r),
                [hasNumber(T(r).lines[T(r).lines.length - 1] || "", 3), "count3"],
                [hasNumber(T(r, 1).lines[T(r, 1).lines.length - 1] || "", 1), "count1"]
              ),
            feedback: {
              counter: "Erhöhe in der Schleife einen Zähler: <code>versuche = versuche + 1</code>.",
              count3: "Nach den Tipps 12, 3 und 7 sollte am Ende „3“ Versuche stehen. Zählst du jeden Tipp genau einmal?",
              count1: "Wer sofort richtig rät, braucht 1 Versuch. Startet dein Zähler bei 0?",
            },
          },
        },
      ],
    },

    // ================================================================== KAPITEL 3
    {
      id: "c3",
      title: "Sammlungen & eigene Befehle",
      region: { icon: "flask", name: "Labor", pos: [304, 150],
        intro: "Im Labor liegen Vorräte, Proben und Notizen durcheinander. Listen, Dictionaries und eigene Befehle bringen Ordnung hinein.",
        outro: "Alles hat seinen Platz, und die Bord-KI erkennt dich als Crew-Mitglied." },
      lessons: [
        {
          id: "s3-l1",
          title: "Listen – deine Sammlung",
          story: "Im Labor liegt alles durcheinander. Fang mit einer Liste an – Proben, Musik für die Nachtschicht, egal was.",
          intro: `
<p>Eine <b>Liste</b> hält viele Werte in einer einzigen Variablen zusammen – eine Playlist,
ein Team, eine Packliste. Du schreibst sie in eckige Klammern <code>[ ]</code>, die Einträge
durch Kommas getrennt.</p>

<pre><code>playlist = ["Song A", "Song B", "Song C"]
print(playlist)
print(playlist[0])   # der erste Eintrag</code></pre>

<p>An einzelne Einträge kommst du über ihre <b>Position</b> – und die zählt ab <code>0</code>!
<code>playlist[0]</code> ist der erste Eintrag, <code>playlist[1]</code> der zweite.</p>`,
          taskHtml:
            "Erstelle eine <b>Liste</b> (Playlist, Team, Lieblingsessen …) mit mindestens 3 Einträgen. Gib die ganze Liste aus und danach den <b>ersten</b> Eintrag einzeln.",
          hints: [
            'Eckige Klammern, Einträge mit Komma: <code>essen = ["Pizza", "Döner", "Sushi"]</code>',
            "Den ersten Eintrag bekommst du mit <code>essen[0]</code>.",
          ],
          starterCode: py`
            # Erstelle eine Liste mit mindestens 3 Dingen
            # Gib die Liste aus und danach den ersten Eintrag
          `,
          solution: py`
            playlist = ["Song A", "Song B", "Song C"]
            print(playlist)
            print(playlist[0])
          `,
          xp: 35,
          tests: [{ probe: "values(list)" }],
          check: (r) =>
            need(
              R.list(r, 3),
              R.print(r),
              R.tests(r),
              [r.lines.some((l) => l.trim().startsWith("[")), "printList"],
              [lists(T(r), 3).some((l) => r.lines.some((x) => x.trim() === String(l[0]))), "printFirst"]
            ),
          feedback: {
            printList: "Gib die ganze Liste mit <code>print(…)</code> aus.",
            printFirst: "Gib danach den ersten Eintrag in einer eigenen Zeile aus. Positionen zählen ab 0: <code>liste[0]</code>.",
          },
          expert: {
            xp: 10,
            html: `
<p><code>len(liste)</code> verrät, wie viele Einträge in einer Liste stecken. Und mit
<code>liste[-1]</code> greifst du von hinten zu – das ist der letzte Eintrag.</p>
<p><b>Bonus:</b> Gib aus, wie viele Einträge deine Liste hat, und ihren letzten Eintrag mit <code>[-1]</code>.</p>`,
            solution: py`
              playlist = ["Song A", "Song B", "Song C"]
              print("Anzahl:", len(playlist))
              print("Letzter:", playlist[-1])
            `,
            tests: [{ probe: "values(list)" }],
            check: (r) =>
              need(
                [r.call("len") > 0, "useLen"],
                [r.ast.negIndex > 0, "useNeg"],
                R.tests(r),
                [lists(T(r), 1).some((l) => r.num(l.length) && lineHas(r, l[l.length - 1])), "printBoth"]
              ),
            feedback: {
              useLen: "Nutze <code>len(liste)</code> für die Anzahl.",
              useNeg: "Den letzten Eintrag holst du mit <code>liste[-1]</code>.",
              printBoth: "Gib die Anzahl und den letzten Eintrag aus.",
            },
          },
        },
        {
          id: "s3-l2",
          title: "Listen verändern",
          story: "Neue Vorräte sind angekommen. Füg sie der Liste hinzu und sortier das Chaos.",
          intro: `
<p>Listen kann man nachträglich ändern. Mit einem Punkt hängst du <b>Methoden</b> an – das
sind kleine Befehle, die zur Liste gehören:</p>

<pre><code>team = ["Yara", "Noah"]
team.append("Lena")   # hinten anfügen
team.sort()           # alphabetisch sortieren
print(team)</code></pre>

<p><code>.append(x)</code> fügt <code>x</code> hinten an, <code>.sort()</code> sortiert die
Liste. Solche Methoden verändern die Liste direkt – deshalb steht vor dem Punkt der Name der Liste.</p>`,
          taskHtml:
            "Füge der Liste mit <code>.append(…)</code> mindestens einen Namen hinzu, <b>sortiere</b> sie danach mit <code>.sort()</code> und gib sie aus.",
          hints: [
            'Hinzufügen: <code>team.append("Name")</code>',
            "Sortieren: <code>team.sort()</code>, dann <code>print(team)</code>",
          ],
          starterCode: py`
            team = ["Yara", "Noah"]
            # Füge jemanden hinzu, sortiere die Liste und gib sie aus
          `,
          solution: py`
            team = ["Yara", "Noah"]
            team.append("Lena")
            team.sort()
            print(team)
          `,
          xp: 35,
          tests: [{ probe: "values(list)" }],
          check: (r) =>
            need(
              [r.method("append") > 0, "useAppend"],
              [r.method("sort") > 0 || r.call("sorted") > 0, "useSort"],
              R.print(r),
              [!/\bNone\b/.test(r.out), "sortNone"],
              R.tests(r),
              [lists(T(r), 3).length > 0, "threeNames"],
              [lists(T(r), 3).some((l) => printedSorted(l, r.out)), "sorted"]
            ),
          feedback: {
            useAppend: 'Füge mit <code>team.append("Name")</code> jemanden hinzu.',
            useSort: "Sortiere die Liste mit <code>team.sort()</code>.",
            sortNone:
              "Da steht <code>None</code>: <code>team.sort()</code> sortiert die Liste direkt und gibt nichts zurück. Schreib nur <code>team.sort()</code>, nicht <code>team = team.sort()</code>.",
            threeNames: "Am Ende sollen mindestens 3 Namen in der Liste stehen.",
            sorted: "Gib die Liste <b>sortiert</b> aus. Rufst du <code>.sort()</code> <b>nach</b> dem Hinzufügen und vor dem <code>print</code> auf?",
          },
          expert: {
            xp: 10,
            html: `
<p>Weitere Methoden: <code>.remove("x")</code> entfernt einen Eintrag, <code>.reverse()</code>
dreht die Reihenfolge um.</p>
<p><b>Bonus:</b> Entferne einen Namen aus dem Team, dreh die Reihenfolge um und gib das Ergebnis aus.</p>`,
            solution: py`
              team = ["Yara", "Noah", "Lena"]
              team.remove("Noah")
              team.reverse()
              print(team)
            `,
            check: (r) => need([r.method("remove") > 0, "useRemove"], [r.method("reverse") > 0, "useReverse"], R.output(r)),
            feedback: {
              useRemove: 'Entferne jemanden mit <code>team.remove("Name")</code>.',
              useReverse: "Dreh die Liste mit <code>team.reverse()</code> um.",
            },
          },
        },
        {
          id: "s3-l3",
          title: "Für jedes Ding …",
          story: "Lumo soll jeden Eintrag der Liste prüfen, einen nach dem anderen. Eine Schleife erledigt das in Sekunden.",
          intro: `
<p>Mit <code>for … in liste</code> gehst du <b>jeden Eintrag</b> der Reihe nach durch – ganz
ohne Positionen zu zählen:</p>

<pre><code>songs = ["A", "B", "C"]
for song in songs:
    print("Jetzt läuft:", song)</code></pre>

<p><code>song</code> ist bei jedem Durchlauf der nächste Eintrag. Den Namen davor darfst du frei
wählen – <code>for x in songs</code> ginge genauso, aber ein sprechender Name liest sich besser.</p>`,
          taskHtml:
            "Geh mit einer <code>for</code>-Schleife durch die Liste und gib <b>jeden Eintrag in einer eigenen Zeile</b> aus – gern mit einem Text davor, zum Beispiel „Jetzt läuft: …“.",
          hints: ["<code>for song in songs:</code>", "Darunter eingerückt: <code>print(song)</code>"],
          starterCode: py`
            songs = ["Intro", "Beat 1", "Finale"]
            # Gib jeden Song einzeln aus
          `,
          solution: py`
            songs = ["Intro", "Beat 1", "Finale"]
            for song in songs:
                print("Jetzt läuft:", song)
          `,
          xp: 40,
          tests: [{ probe: "values(list)" }],
          check: (r) =>
            need(
              R.forLoop(r),
              [r.ast.forIters.includes("Name") || r.ast.forIters.includes("List"), "loopOverList"],
              [(r.ast.callsInLoop.print || 0) > 0, "printInLoop"],
              R.tests(r),
              [
                lists(T(r), 3).some((l) => l.every((x) => r.lines.some((line) => line.includes(String(x)))) && r.lines.length >= l.length),
                "eachItem",
              ]
            ),
          feedback: {
            loopOverList: "Lass die Schleife direkt über die Liste laufen: <code>for song in songs:</code>",
            printInLoop: "Das <code>print(…)</code> gehört eingerückt in die Schleife.",
            eachItem: "Jeder Eintrag der Liste soll in der Ausgabe stehen – einer pro Zeile.",
          },
          expert: {
            xp: 10,
            html: `
<p>Wenn deine Liste Zahlen enthält, kannst du in der Schleife eine <b>Summe</b> bilden.</p>
<p><b>Bonus:</b> Zähle mit einer Schleife alle Tore der Liste <code>tore = [2, 1, 3, 0, 2]</code>
zusammen (ohne <code>sum()</code>) und gib die Summe aus.</p>`,
            solution: py`
              tore = [2, 1, 3, 0, 2]
              summe = 0
              for t in tore:
                  summe = summe + t
              print("Tore gesamt:", summe)
            `,
            check: (r) => need(R.forLoop(r), [r.ast.selfUpdates > 0, "accumulate"], [r.num(8), "result8"]),
            feedback: {
              accumulate: "Leg vor der Schleife <code>summe = 0</code> an und rechne in der Schleife jedes Tor dazu.",
              result8: "Zusammen sind es 8 Tore.",
            },
          },
        },
        {
          id: "s3-l4",
          title: "Eigene Befehle bauen",
          story: "Lumo hat genug davon, alles zehnmal zu erklären. Bau einen eigenen Befehl, der Besucher begrüßt.",
          intro: `
<p>Eine <b>Funktion</b> ist ein eigener Befehl, den du einmal baust und beliebig oft aufrufst.
Mit <code>def</code> definierst du sie; in den Klammern stehen die <b>Parameter</b> – Werte,
die die Funktion beim Aufruf bekommt.</p>

<pre><code>def begruesse(name):
    print(f"Hallo {name}! 👋")

begruesse("Deniz")
begruesse("Fatima")</code></pre>

<p>Der eingerückte Block ist der „Bauplan“. Erst beim <b>Aufruf</b> wird er ausgeführt – mit
dem Wert, den du mitgibst. So sparst du dir Wiederholungen.</p>`,
          taskHtml: "Ruf die Funktion <code>begruesse</code> mit <b>zwei verschiedenen Namen</b> auf.",
          hints: ['Aufruf: <code>begruesse("Mia")</code>', "Zwei Aufrufe untereinander, nicht eingerückt, mit verschiedenen Namen."],
          starterCode: py`
            def begruesse(name):
                print(f"Hallo {name}! 👋")

            # Ruf die Funktion mit zwei verschiedenen Namen auf
          `,
          solution: py`
            def begruesse(name):
                print(f"Hallo {name}! 👋")

            begruesse("Mia")
            begruesse("Jonas")
          `,
          xp: 40,
          check: (r) =>
            need(
              R.def(r),
              [r.ast.userCalls >= 2 || r.ast.defs.some((d) => (r.ast.callsInLoop[d.name] || 0) > 0), "twoCalls"],
              R.minLines(r, 2),
              [new Set(r.lines).size >= 2, "differentNames"]
            ),
          feedback: {
            twoCalls: 'Ruf die Funktion zweimal auf, jeweils in einer eigenen Zeile: <code>begruesse("Mia")</code>.',
            differentNames: "Nimm zwei <b>verschiedene</b> Namen.",
          },
          expert: {
            xp: 10,
            html: `
<p>Eine Funktion kann <b>mehrere Parameter</b> haben, getrennt durch Kommas.</p>
<p><b>Bonus:</b> Bau <code>begruesse(name, tageszeit)</code>, sodass zum Beispiel
„Guten Morgen, Mia!“ herauskommt, und ruf sie zweimal auf.</p>`,
            solution: py`
              def begruesse(name, tageszeit):
                  print(f"Guten {tageszeit}, {name}!")

              begruesse("Mia", "Morgen")
              begruesse("Leo", "Abend")
            `,
            tests: [{ probe: 'call(fn(2), "Ada", "Mittag")' }],
            check: (r) =>
              need(
                [r.ast.defs.some((d) => d.args >= 2), "twoParams"],
                [r.ast.userCalls >= 2, "twoCalls"],
                R.tests(r),
                [T(r).out.includes("Ada") && T(r).out.includes("Mittag"), "useBoth"]
              ),
            feedback: {
              twoParams: "Gib der Funktion zwei Parameter: <code>def begruesse(name, tageszeit):</code>",
              twoCalls: "Ruf die Funktion zweimal auf.",
              useBoth: "Beide Parameter sollen in der Begrüßung vorkommen.",
            },
          },
        },
        {
          id: "s3-l5",
          title: "Etwas zurückgeben",
          story: "Die Messgeräte liefern drei Werte, aber der Mittelwert fehlt. Bau eine Funktion, die ihn zurückgibt – für alle Zahlen.",
          intro: `
<p>Funktionen können ein Ergebnis <b>zurückgeben</b> – mit <code>return</code>. Der Unterschied
zu <code>print</code>: <code>print</code> <i>zeigt</i> nur etwas an, <code>return</code>
<i>liefert</i> einen Wert, mit dem du weiterrechnen kannst.</p>

<pre><code>def doppelt(x):
    return x * 2

ergebnis = doppelt(5)
print(ergebnis)   # 10</code></pre>

<p>Nach <code>return</code> ist die Funktion beendet und gibt den Wert an die Stelle des
Aufrufs zurück. Diesen Wert kannst du speichern, ausgeben oder weiterverwenden.</p>`,
          taskHtml:
            "Vervollständige <code>durchschnitt</code> so, dass die Funktion den <b>Mittelwert</b> der drei Zahlen zurückgibt. Für 2, 4 und 6 kommt <b>4.0</b> heraus – und für alle anderen Zahlen soll es auch stimmen.",
          hints: [
            "Summe durch Anzahl: <code>(a + b + c) / 3</code> – die Klammern sind wichtig!",
            "Mit <code>return</code> zurückgeben, nicht mit <code>print</code>.",
          ],
          starterCode: py`
            def durchschnitt(a, b, c):
                # Gib den Durchschnitt der drei Zahlen zurück
                return 0

            print(durchschnitt(2, 4, 6))
          `,
          solution: py`
            def durchschnitt(a, b, c):
                return (a + b + c) / 3

            print(durchschnitt(2, 4, 6))
          `,
          xp: 45,
          tests: [{ probe: "[call(fn(3), 2, 4, 6), call(fn(3), 1, 2, 3), call(fn(3), 10, 0, 5)]" }],
          check: (r) =>
            need(
              R.def(r),
              R.tests(r),
              [Array.isArray(T(r).value) && T(r).value.some((v) => v !== null && typeof v !== "object"), "returnsNothing"],
              [sameNumbers(T(r).value, [4, 2, 5]), "wrongValues"],
              [r.num(4), "printResult"]
            ),
          feedback: {
            returnsNothing: "Deine Funktion gibt noch nichts zurück. Nutze <code>return</code> statt <code>print</code> in der Funktion.",
            wrongValues:
              "Für andere Zahlen stimmt das Ergebnis noch nicht. Rechnest du mit <code>a</code>, <code>b</code> und <code>c</code>? Achte auf die Klammern: <code>(a + b + c) / 3</code>.",
            printResult: "Gib das Ergebnis für 2, 4 und 6 aus: <code>print(durchschnitt(2, 4, 6))</code>.",
          },
          expert: {
            xp: 15,
            html: `
<p><b>Bonus:</b> Schreib <code>punkte(siege, remis)</code>, die die Fußball-Punkte
<b>zurückgibt</b> (Sieg = 3 Punkte, Unentschieden = 1 Punkt), und vergleiche damit zwei Teams.</p>`,
            solution: py`
              def punkte(siege, remis):
                  return siege * 3 + remis

              print("Team A:", punkte(5, 3))
              print("Team B:", punkte(7, 1))
            `,
            tests: [{ probe: "[call(fn(2), 5, 3), call(fn(2), 0, 1), call(fn(2), 2, 0)]" }],
            check: (r) => need(R.ret(r), R.tests(r), [sameNumbers(T(r).value, [18, 1, 6]), "wrongValues"]),
            feedback: { wrongValues: "Die Punkte stimmen noch nicht. Ein Sieg zählt 3, ein Unentschieden 1: <code>siege * 3 + remis</code>." },
          },
        },
        {
          id: "s3-l6",
          title: "Dictionaries – Name & Wert",
          story: "Jedes Crew-Mitglied hat eine Ausrüstungskarte mit Namen und Werten. Ergänze deine.",
          intro: `
<p>Ein <b>Dictionary</b> speichert Paare aus <b>Schlüssel</b> und <b>Wert</b> – wie ein
Wörterbuch (Wort → Bedeutung) oder ein Steckbrief. Geschweifte Klammern <code>{ }</code>,
Doppelpunkt zwischen Schlüssel und Wert, Paare durch Kommas getrennt:</p>

<pre><code>held = {"name": "Ada", "level": 3}
print(held["name"])    # Ada
print(held["level"])   # 3</code></pre>

<p>Anders als bei Listen (Zugriff über die <b>Position</b>) nimmst du hier den <b>Schlüssel</b>:
<code>held["name"]</code>. Super, um zusammengehörige Infos zu bündeln.</p>`,
          taskHtml:
            "Erweitere das Dictionary auf mindestens <b>drei</b> Paare (zum Beispiel mit einer Waffe, einem Haustier oder einer Farbe) und gib <b>zwei Werte</b> über ihren Schlüssel aus.",
          hints: [
            'Ein weiteres Paar: <code>held = {"name": "Ada", "level": 3, "farbe": "Lila"}</code>',
            'Zugriff über den Schlüssel: <code>print(held["farbe"])</code>',
          ],
          starterCode: py`
            held = {"name": "Ada", "level": 3}
            # Ergänze ein drittes Paar und gib zwei Werte aus
          `,
          solution: py`
            held = {"name": "Ada", "level": 3, "farbe": "Lila"}
            print(held["name"])
            print(held["farbe"])
          `,
          xp: 45,
          tests: [{ probe: "values(dict)" }],
          check: (r) =>
            need(
              R.dict(r, 3),
              [r.ast.strKeys >= 2, "accessByKey"],
              R.print(r),
              R.tests(r),
              [dicts(T(r), 3).some((d) => Object.values(d).filter((v) => lineHas(r, v)).length >= 2), "printValues"]
            ),
          feedback: {
            accessByKey: 'Hol dir zwei Werte über ihren Schlüssel: <code>held["name"]</code>.',
            printValues: "Gib mindestens zwei Werte aus dem Dictionary aus.",
          },
          expert: {
            xp: 10,
            html: `
<p>Neue Paare fügst du so hinzu: <code>held["punkte"] = 100</code>. Und mit
<code>for schluessel in held:</code> gehst du alle Schlüssel durch.</p>
<p><b>Bonus:</b> Füge ein neues Paar hinzu und gib danach mit einer Schleife alle Paare aus.</p>`,
            solution: py`
              held = {"name": "Ada", "level": 3}
              held["punkte"] = 100
              for schluessel in held:
                  print(schluessel, "=", held[schluessel])
            `,
            check: (r) =>
              need(
                [r.ast.subStore > 0, "addKey"],
                [r.ast.forIters.includes("Name") || r.method("items") > 0, "loopDict"],
                R.minLines(r, 3)
              ),
            feedback: {
              addKey: 'Füge ein Paar hinzu: <code>held["punkte"] = 100</code>.',
              loopDict: "Geh mit <code>for schluessel in held:</code> durch alle Schlüssel.",
            },
          },
        },
        {
          id: "s3-boss3",
          type: "boss",
          title: "Dein Mini-Quiz",
          story: "Die Bord-KI lässt nur Crew-Mitglieder ins Labor, die ihr Quiz bestehen. Dreh den Spieß um und bau selbst ein Quiz!",
          intro: `
<p>Bau ein kleines <b>Quiz</b> zu einem Thema deiner Wahl (Tiere, Musik, Sport, Weltraum …).
Es stellt Fragen mit <code>input()</code>, prüft die Antworten mit <code>if</code> und zählt
mit einer Variablen die Punkte.</p>

<pre><code>punkte = 0
antwort = input("Frage? ")
if antwort == "richtig":
    punkte = punkte + 1</code></pre>

<p>Tipp: Mit <code>antwort.lower()</code> vergleichst du ohne Rücksicht auf Groß- und
Kleinschreibung – dann zählt „Rom“ genauso wie „rom“.</p>`,
          taskHtml:
            "Erweitere das Quiz um <b>mindestens zwei weitere Fragen</b> (insgesamt also drei). Zähle richtige Antworten als Punkte und gib am Ende den Punktestand aus.",
          hints: [
            "Für jede Frage: ein <code>input(…)</code> und ein <code>if</code>/<code>else</code>.",
            "Bei einer richtigen Antwort: <code>punkte = punkte + 1</code>. Der Punktestand kommt ganz am Ende.",
          ],
          starterCode: py`
            punkte = 0

            antwort = input("Wie viele Beine hat eine Spinne? ")
            if antwort == "8":
                punkte = punkte + 1
                print("Richtig! 🕷️")
            else:
                print("Knapp daneben – es sind 8.")

            # Füge hier mindestens zwei weitere Fragen hinzu

            print("Punkte:", punkte)
          `,
          solution: py`
            punkte = 0

            antwort = input("Wie viele Beine hat eine Spinne? ")
            if antwort == "8":
                punkte = punkte + 1
                print("Richtig! 🕷️")
            else:
                print("Knapp daneben – es sind 8.")

            antwort = input("Hauptstadt von Italien? ")
            if antwort.lower() == "rom":
                punkte = punkte + 1
                print("Richtig! 🇮🇹")
            else:
                print("Es war Rom.")

            antwort = input("Welcher Planet ist der größte? ")
            if antwort.lower() == "jupiter":
                punkte = punkte + 1
                print("Richtig! 🪐")
            else:
                print("Es ist Jupiter.")

            print("Punkte:", punkte)
          `,
          xp: 60,
          tests: [{ fill: "???" }],
          check: (r) =>
            need(
              R.input(r, 3),
              [r.node("If") >= 3, "ifPerQuestion"],
              [r.ast.selfUpdates >= 3, "countPoints"],
              R.tests(r),
              [hasNumber(T(r).lines[T(r).lines.length - 1] || "", 0), "scoreAtEnd"]
            ),
          feedback: {
            ifPerQuestion: "Prüf jede Antwort mit einem eigenen <code>if</code>.",
            countPoints: "Erhöhe bei jeder richtigen Antwort die Punkte: <code>punkte = punkte + 1</code>.",
            scoreAtEnd: 'Gib ganz am Ende den Punktestand aus, zum Beispiel <code>print("Punkte:", punkte)</code>.',
          },
          expert: {
            xp: 15,
            html: `
<p>Profi-Variante: Speichere die Fragen als <b>Liste von Dictionaries</b>
(<code>{"frage": …, "antwort": …}</code>) und geh sie mit <b>einer</b> Schleife durch. So
schreibst du den Code für eine Frage nur einmal – egal, wie viele Fragen es sind.</p>
<p><b>Bonus:</b> Bau dein Quiz so um (mindestens zwei Fragen in der Liste).</p>`,
            solution: py`
              fragen = [
                  {"frage": "Wie viele Beine hat eine Spinne? ", "antwort": "8"},
                  {"frage": "Hauptstadt von Italien? ", "antwort": "rom"},
                  {"frage": "Welcher Planet ist der größte? ", "antwort": "jupiter"},
              ]
              punkte = 0
              for f in fragen:
                  antwort = input(f["frage"])
                  if antwort.lower() == f["antwort"]:
                      punkte = punkte + 1
                      print("Richtig!")
                  else:
                      print("Leider falsch – richtig ist:", f["antwort"])
              print("Punkte:", punkte, "von", len(fragen))
            `,
            tests: [{ fill: "???" }],
            check: (r) =>
              need(
                [r.ast.listDicts >= 2, "listOfDicts"],
                R.forLoop(r),
                [(r.ast.callsInLoop.input || 0) > 0, "inputInLoop"],
                R.tests(r)
              ),
            feedback: {
              listOfDicts: 'Leg eine Liste mit mindestens zwei Dictionaries an: <code>[{"frage": …, "antwort": …}, …]</code>.',
              inputInLoop: 'Stell die Fragen <b>in</b> der Schleife: <code>antwort = input(f["frage"])</code>.',
            },
          },
        },
      ],
    },

    // ================================================================== KAPITEL 4
    {
      id: "c4",
      title: "Alles zusammen",
      region: { icon: "monitor", name: "Zentrale", pos: [196, 84],
        intro: "In der Zentrale laufen alle Systeme zusammen. Hier zeigt sich, was du kannst: Spiele, Codes, Bilder und echte Messdaten.",
        outro: "Station Polaris leuchtet wieder! Ab jetzt baust du deine eigenen Module." },
      lessons: [
        {
          id: "s4-l1",
          title: "Der Spiel-Motor",
          story: "In der Zentrale steht ein alter Spielautomat der Crew. Sein Herz, die Spielschleife, fehlt. Bau sie neu.",
          intro: `
<p>Viele Spiele haben eine <b>Spielschleife</b>: Solange die Spielfigur noch Leben oder Energie
hat, geht es weiter. Das ist eine <code>while</code>-Schleife rund um einen Wert, der sich ändert.</p>

<pre><code>leben = 3
while leben &gt; 0:
    print("Leben übrig:", leben)
    leben = leben - 1
print("Game Over")</code></pre>

<p>Der Wert <code>leben</code> ist der <b>Zustand</b> des Spiels. Spannend wird es mit Zufall:
Wenn jede Runde unterschiedlich viel Schaden passiert, weiß niemand vorher, wie lange das Spiel
dauert.</p>`,
          taskHtml:
            "Baue die <b>Spielschleife</b>: Solange <code>energie</code> größer als 0 ist, würfelt das Spiel einen Schaden von 1 bis 6, zieht ihn ab und gibt Runde und Energie aus. Danach kommt „Game Over“.",
          hints: [
            "<code>while energie &gt; 0:</code> – alles, was jede Runde passiert, wird eingerückt.",
            "In der Schleife: <code>schaden = random.randint(1, 6)</code>, dann <code>energie = energie - schaden</code>.",
          ],
          starterCode: py`
            import random
            energie = 20
            runde = 1
            # Spielschleife: Solange energie größer als 0 ist …
            #   1. würfle einen Schaden von 1 bis 6
            #   2. zieh ihn von energie ab
            #   3. gib Runde und Energie aus
            #   4. erhöhe runde um 1
            print("Game Over")
          `,
          solution: py`
            import random
            energie = 20
            runde = 1
            while energie > 0:
                schaden = random.randint(1, 6)
                energie = energie - schaden
                print(f"Runde {runde}: -{schaden} → Energie {energie}")
                runde = runde + 1
            print("Game Over")
          `,
          xp: 45,
          tests: [{ seed: 1 }, { seed: 2 }, { seed: 3 }],
          check: (r) =>
            need(
              R.whileLoop(r),
              [(r.ast.callsInLoop.randint || 0) > 0, "randomInLoop"],
              R.tests(r),
              [r.tests.every((t) => t.lines.length >= 5), "rounds"],
              [
                new Set(r.tests.map((t) => t.lines[t.lines.length - 1])).size === 1 &&
                  r.tests.every((t) => t.lines.filter((l) => l === t.lines[t.lines.length - 1]).length === 1),
                "gameOver",
              ]
            ),
          feedback: {
            randomInLoop: "Würfle den Schaden <b>in</b> der Schleife mit <code>random.randint(1, 6)</code>, damit jede Runde anders ist.",
            rounds: "Gib in jeder Runde etwas aus, zum Beispiel Runde und Energie.",
            gameOver: "Nach der Schleife soll immer „Game Over“ kommen – <b>nicht</b> eingerückt.",
          },
          expert: {
            xp: 15,
            html: `
<p><b>Bonus:</b> Gib nach dem Spiel aus, wie viele Runden es gedauert hat, zum Beispiel
„Überlebt: 6 Runden“. Aufgepasst: <code>runde</code> startet bei 1 und wird nach jeder Runde
erhöht. Was steht also nach 4 Runden in <code>runde</code>?</p>`,
            solution: py`
              import random
              energie = 20
              runde = 1
              while energie > 0:
                  schaden = random.randint(1, 6)
                  energie = energie - schaden
                  print(f"Runde {runde}: -{schaden} → Energie {energie}")
                  runde = runde + 1
              print("Game Over")
              print(f"Überlebt: {runde - 1} Runden")
            `,
            // Würfel zeigt immer 5 -> genau 4 Runden; immer 1 -> 20 Runden
            tests: [{ randint: 5 }, { randint: 1 }],
            check: (r) =>
              need(
                R.tests(r),
                [r.tests.every((t) => t.lines.length > 0), "rounds"],
                [hasNumber(T(r).lines.slice(-2).join(" "), 4), "count4"],
                [hasNumber(T(r, 1).lines.slice(-2).join(" "), 20), "count20"]
              ),
            feedback: {
              rounds: "Gib am Ende aus, wie viele Runden es waren.",
              count4: "Bei 20 Energie und immer 5 Schaden sind es genau 4 Runden. Denk dran: <code>runde</code> ist nach der letzten Runde schon eins weiter.",
              count20: "Bei immer 1 Schaden sind es 20 Runden. Zählst du jede Runde genau einmal?",
            },
          },
        },
        {
          id: "s4-l2",
          title: "Geheime Codes",
          story: "Ein fremdes Signal ist angekommen, aber verschlüsselt. Verschieb jeden Buchstaben und finde heraus, was drinsteht.",
          intro: `
<p>Verschlüsseln macht Spaß! Beim <b>Caesar-Code</b> verschiebt man jeden Buchstaben um eine
feste Zahl. Dafür brauchst du zwei Werkzeuge: <code>ord()</code> macht aus einem Buchstaben
seine Nummer, <code>chr()</code> aus einer Nummer wieder den Buchstaben.</p>

<pre><code>print(ord("A"))   # 65
print(chr(66))    # B</code></pre>

<p>Gehst du durch jeden Buchstaben und erhöhst seine Nummer, entsteht ein Geheimtext.
Zum Entschlüsseln verschiebst du einfach in die andere Richtung:</p>

<pre><code>geheim = ""
for zeichen in "HALLO":
    geheim = geheim + chr(ord(zeichen) + 1)
print(geheim)   # IBMMP</code></pre>`,
          taskHtml:
            "Entschlüssele die geheime Nachricht: Verschiebe jeden Buchstaben mit <code>ord()</code> und <code>chr()</code> um <b>1 zurück</b>. Was kommt heraus?",
          hints: [
            "<code>ord(zeichen)</code> gibt die Nummer, <code>- 1</code> verschiebt zurück, <code>chr(…)</code> macht wieder einen Buchstaben daraus.",
            "<code>klartext = klartext + chr(ord(zeichen) - 1)</code>",
          ],
          starterCode: py`
            geheim = "QZUIPO"   # jeder Buchstabe ist um 1 verschoben
            klartext = ""
            for zeichen in geheim:
                # Verschiebe jedes Zeichen um 1 zurück
                klartext = klartext + zeichen
            print(klartext)
          `,
          solution: py`
            geheim = "QZUIPO"
            klartext = ""
            for zeichen in geheim:
                klartext = klartext + chr(ord(zeichen) - 1)
            print(klartext)
          `,
          xp: 50,
          check: (r) => need([r.call("ord") > 0 && r.call("chr") > 0, "useOrdChr"], [/PYTHON/.test(r.out), "decrypt"]),
          feedback: {
            useOrdChr: "Nutze <code>ord()</code> und <code>chr()</code>, um jeden Buchstaben zu verschieben.",
            decrypt: "Noch nicht entschlüsselt. Verschiebe um 1 <b>zurück</b>: <code>chr(ord(zeichen) - 1)</code>.",
          },
          expert: {
            xp: 15,
            html: `
<p>Echte Caesar-Codes verschieben meist um 3. Aber was passiert bei <code>"Z"</code> + 3? Damit es nach dem Z wieder bei A weitergeht, rechnet man
mit dem Rest der Division: <code>% 26</code>. Die Formel für Großbuchstaben lautet
<code>chr((ord(z) - 65 + v) % 26 + 65)</code>.</p>
<p><b>Bonus:</b> Schreib eine Funktion <code>caesar(text, versatz)</code>, die Großbuchstaben
verschiebt (auch über Z hinaus) und alles andere, etwa Leerzeichen, unverändert lässt. Mit
negativem Versatz entschlüsselt sie wieder.</p>`,
            solution: py`
              def caesar(text, versatz):
                  ergebnis = ""
                  for z in text:
                      if "A" <= z <= "Z":
                          ergebnis = ergebnis + chr((ord(z) - 65 + versatz) % 26 + 65)
                      else:
                          ergebnis = ergebnis + z
                  return ergebnis

              geheim = caesar("HALLO WELT", 3)
              print(geheim)
              print(caesar(geheim, -3))
            `,
            tests: [
              {
                probe:
                  '[call(fn(2), "HALLO", 3), call(fn(2), "XYZ", 3), call(fn(2), "HALLO WELT", 3), call(fn(2), call(fn(2), "GEHEIM", 5), -5)]',
              },
            ],
            check: (r) =>
              need(
                R.def(r),
                R.ret(r),
                [r.node("Mod") > 0, "useMod"],
                R.tests(r),
                [val(r, 0) === "KDOOR", "shift"],
                [val(r, 1) === "ABC", "wrap"],
                [val(r, 2) === "KDOOR ZHOW", "spaces"],
                [val(r, 3) === "GEHEIM", "decryptBack"]
              ),
            feedback: {
              useMod: "Nutze <code>% 26</code>, damit es nach Z wieder bei A weitergeht.",
              shift: '<code>caesar("HALLO", 3)</code> sollte <code>"KDOOR"</code> zurückgeben.',
              wrap: '<code>caesar("XYZ", 3)</code> sollte <code>"ABC"</code> ergeben – nach Z geht es bei A weiter.',
              spaces: "Leerzeichen und andere Zeichen sollen unverändert bleiben.",
              decryptBack: "Mit negativem Versatz soll die Funktion wieder entschlüsseln.",
            },
          },
        },
        {
          id: "s4-l3",
          title: "Zeichnen mit Code",
          story: "Der große Bildschirm in der Zentrale ist wieder an – und noch ganz leer. Mal das erste Bild!",
          intro: `
<p>Die Station hat einen <b>Bildschirm aus 16 × 16 Leuchtpunkten</b> (Pixeln). Mit
<code>pixel(x, y, farbe)</code> schaltest du einen davon an. <code>x</code> zählt von links
(0) nach rechts (15), <code>y</code> von oben (0) nach unten (15).</p>

<pre><code>from station import pixel

for x in range(16):
    pixel(x, 12, "teal")   # eine Linie quer über den Bildschirm
pixel(7, 4, "gold")</code></pre>

<p>Farben kannst du als Namen angeben, auf Englisch oder Deutsch (<code>"red"</code>,
<code>"rot"</code>, <code>"blau"</code>, <code>"pink"</code> …) oder als Farbcode wie
<code>"#ff8800"</code>. <code>"schwarz"</code> schaltet einen Pixel wieder aus, und
<code>fill(farbe)</code> färbt den ganzen Bildschirm.</p>

<p>Mit Schleifen malst du Linien und Flächen in einer einzigen Zeile – eine Schleife in einer
Schleife füllt sogar ein ganzes Rechteck.</p>`,
          taskHtml:
            "Male ein <b>Bild auf den Stationsbildschirm</b>: mindestens <b>12 Pixel</b> in mindestens <b>zwei Farben</b>, und nutze dafür mindestens <b>eine Schleife</b>. Ein Baum, eine Rakete, ein Gesicht, dein Lieblingslogo …",
          hints: [
            'Eine Linie geht mit einer Schleife: <code>for x in range(3, 13):</code> und darunter <code>pixel(x, 14, "grün")</code>.',
            "Für die zweite Farbe setzt du einfach noch ein paar Pixel mit einer anderen Farbe darüber.",
          ],
          starterCode: py`
            from station import pixel

            # Male dein Bild: pixel(x, y, "farbe")  (x und y von 0 bis 15)
            pixel(7, 7, "gold")
          `,
          solution: py`
            from station import pixel

            # Stamm
            for y in range(10, 15):
                pixel(7, y, "braun")
                pixel(8, y, "braun")
            # Krone
            for y in range(3, 10):
                for x in range(4, 12):
                    pixel(x, y, "grün")
            # Äpfel
            pixel(6, 5, "rot")
            pixel(9, 7, "rot")
          `,
          xp: 45,
          check: (r) =>
            need(
              [r.call("pixel") + r.method("pixel") + r.call("fill") + r.method("fill") > 0, "usePixel"],
              R.pixels(r, 12),
              R.colors(r, 2),
              [r.node("For") + r.node("While") > 0, "useLoop"]
            ),
          feedback: {
            usePixel: 'Schalte Pixel mit <code>pixel(x, y, "farbe")</code> an – ganz oben steht dafür <code>from station import pixel</code>.',
            useLoop: "Nutze mindestens eine Schleife – zum Beispiel für eine Linie: <code>for x in range(16):</code>",
          },
          expert: {
            xp: 15,
            html: `
<p>Pixel-Künstler zeichnen ihre Bilder oft als <b>Liste von Texten</b>: Jedes Zeichen ist ein
Pixel, und ein Dictionary verrät, welche Farbe zu welchem Zeichen gehört.</p>
<pre><code>bild = [
    ".RR.RR.",
    "RRRRRRR",
    ".RRRRR.",
    "..RRR..",
    "...R...",
]
farben = {"R": "rot"}</code></pre>
<p><b>Bonus:</b> Male ein Bild aus mindestens <b>20 Pixeln</b> mit zwei <b>verschachtelten</b>
Schleifen: Die äußere läuft über die Zeilen (<code>y</code>), die innere über die Zeichen einer
Zeile (<code>x</code>).</p>`,
            solution: py`
              from station import pixel

              bild = [
                  ".RR.RR.",
                  "RRRRRRR",
                  "RRRWRRR",
                  ".RRRRR.",
                  "..RRR..",
                  "...R...",
              ]
              farben = {"R": "rot", "W": "weiß"}

              for y in range(len(bild)):
                  for x in range(len(bild[y])):
                      zeichen = bild[y][x]
                      if zeichen in farben:
                          pixel(x + 4, y + 5, farben[zeichen])
            `,
            check: (r) => need([r.ast.loopDepth >= 2, "nested"], R.pixels(r, 20)),
            feedback: { nested: "Setz eine Schleife <b>in</b> eine andere: außen über die Zeilen, innen über die Zeichen einer Zeile." },
          },
        },
        {
          id: "s4-l4",
          title: "Echte Daten auswerten",
          story: "Die Wetterstation draußen hat eine Woche lang Temperaturen gemessen. Werte die Daten aus.",
          intro: `
<p>Programmieren hilft, echte Daten zu verstehen. Für Listen aus Zahlen gibt es fertige
Werkzeuge: <code>max()</code> (größter Wert), <code>min()</code> (kleinster),
<code>sum()</code> (Summe) und <code>len()</code> (Anzahl).</p>

<pre><code>temps = [21, 25, 19, 28, 23]
print("Kältester Tag:", min(temps))</code></pre>

<p>Den <b>Durchschnitt</b> bekommst du mit „Summe geteilt durch Anzahl“ – also mit
<code>sum</code> und <code>len</code> zusammen.</p>`,
          taskHtml:
            "Finde mit <code>max()</code> den <b>wärmsten Tag</b> und berechne den <b>Durchschnitt</b> der Temperaturen mit <code>sum()</code> und <code>len()</code>. Gib beides aus.",
          hints: ["<code>max(temps)</code> liefert den größten Wert.", "Durchschnitt: <code>sum(temps) / len(temps)</code>"],
          starterCode: py`
            temps = [21, 25, 19, 28, 23]
            # Gib den wärmsten Tag und den Durchschnitt aus
          `,
          solution: py`
            temps = [21, 25, 19, 28, 23]
            print("Wärmster Tag:", max(temps))
            print("Durchschnitt:", sum(temps) / len(temps))
          `,
          xp: 50,
          check: (r) =>
            need(
              [r.call("max") > 0, "useMax"],
              [r.call("sum") > 0 && r.call("len") > 0, "useSumLen"],
              [r.num(28), "max28"],
              [r.num(23.2), "average"]
            ),
          feedback: {
            useMax: "Nutze <code>max(temps)</code> für den wärmsten Tag.",
            useSumLen: "Berechne den Durchschnitt mit <code>sum(temps) / len(temps)</code>.",
            max28: "Der wärmste Tag hatte 28 Grad – gib ihn aus.",
            average: "Der Durchschnitt sollte 23.2 sein. Teilst du die Summe durch die Anzahl?",
          },
          expert: {
            xp: 15,
            html: `
<p><b>Bonus:</b> Runde den Durchschnitt mit <code>round(wert, 1)</code> auf eine
Nachkommastelle und finde mit einer Schleife heraus, an wie vielen Tagen es <b>über 22 Grad</b>
warm war.</p>`,
            solution: py`
              temps = [21, 25, 19, 28, 23]
              print("Durchschnitt:", round(sum(temps) / len(temps), 1))
              warm = 0
              for t in temps:
                  if t > 22:
                      warm = warm + 1
              print("Warme Tage:", warm)
            `,
            check: (r) =>
              need(
                [r.call("round") > 0, "useRound"],
                [r.node("For") > 0 && r.node("If") > 0, "countLoop"],
                [r.num(3), "count3"]
              ),
            feedback: {
              useRound: "Runde mit <code>round(…, 1)</code>.",
              countLoop: "Zähle mit einer <code>for</code>-Schleife und einem <code>if</code>, wie viele Werte über 22 liegen.",
              count3: "Es waren 3 Tage über 22 Grad (25, 28 und 23).",
            },
          },
        },
        {
          id: "s4-l5",
          title: "Fehler finden (Debuggen)",
          story: "Ein letzter Glitch blockiert die Zentrale: Drei Fehler stecken im Code. Repariere sie, und die Station ist frei.",
          intro: `
<p>Profis machen Fehler – und finden sie. Das nennt man <b>Debuggen</b>. Im Code unten stecken
genau <b>drei Bugs</b>. Führ ihn aus, lies die Erklärung in der Konsole (sie nennt die Zeile!) und
repariere einen Fehler nach dem anderen. Nach jeder Reparatur kann sich der nächste Fehler zeigen –
das ist völlig normal.</p>

<p>Typische Stolpersteine: ein fehlender Doppelpunkt <code>:</code>, eine fehlende Einrückung,
oder Text und Zahl mit <code>+</code> gemischt (das löst <code>str(…)</code>).</p>`,
          taskHtml:
            "Repariere alle drei Fehler, bis das Programm ohne Fehlermeldung läuft. Am Ende soll „Hurra!“ dreimal erscheinen.",
          hints: [
            "Zwei Fehler stecken in der <code>for</code>-Zeile und der Zeile darunter: Doppelpunkt und Einrückung.",
            "Der dritte: Wandle die Zahl in Text um, bevor du sie mit <code>+</code> anhängst: <code>str(alter + 1)</code>.",
          ],
          starterCode: py`
            name = "Emma"
            alter = 11
            print("Hallo " + name)
            print("Nächstes Jahr bist du " + (alter + 1) + " Jahre alt")
            for i in range(3)
            print("Hurra!")
          `,
          solution: py`
            name = "Emma"
            alter = 11
            print("Hallo " + name)
            print("Nächstes Jahr bist du " + str(alter + 1) + " Jahre alt")
            for i in range(3):
                print("Hurra!")
          `,
          xp: 55,
          check: (r) => {
            const counts = {};
            r.lines.forEach((l) => (counts[l] = (counts[l] || 0) + 1));
            return need(
              [r.node("For") > 0, "keepLoop"],
              [r.lines.length >= 5, "allLines"],
              [r.num(12), "age"],
              [Math.max(0, ...Object.values(counts)) >= 3, "threeHurra"]
            );
          },
          feedback: {
            keepLoop: "Lass die Schleife stehen und repariere sie.",
            allLines: "Alle Zeilen sollen ausgegeben werden – lösch keine Befehle, sondern repariere sie.",
            age: "In der Ausgabe soll stehen, wie alt Emma nächstes Jahr ist (12). Nutze <code>str(alter + 1)</code>.",
            threeHurra: "„Hurra!“ soll dreimal erscheinen: Die <code>print</code>-Zeile gehört eingerückt in die Schleife.",
          },
          expert: {
            xp: 15,
            html: `
<p>Manche Fehler kann man vorhersehen – zum Beispiel, wenn jemand Buchstaben eintippt, wo eine
Zahl erwartet wird. Mit <code>try:</code> und <code>except ValueError:</code> fängst du den
Fehler ab, statt dass das Programm abstürzt.</p>
<p><b>Bonus:</b> Frag das Alter mit <code>int(input(…))</code> ab. Bei einer Zahl gibst du das
Alter im nächsten Jahr aus, bei Buchstaben eine freundliche Meldung.</p>`,
            solution: py`
              try:
                  alter = int(input("Wie alt bist du? "))
                  print("Nächstes Jahr bist du", alter + 1)
              except ValueError:
                  print("Bitte gib eine ganze Zahl ein.")
            `,
            tests: [{ inputs: ["abc"] }, { inputs: ["11"] }],
            check: (r) =>
              need(
                [r.node("Try") > 0, "useTry"],
                [r.call("input") > 0, "useInput"],
                R.tests(r),
                [T(r).lines.length > 0, "friendly"],
                [T(r, 1).out.includes("12"), "normalCase"]
              ),
            feedback: {
              useTry: "Pack die Umwandlung in einen <code>try:</code>-Block und fang den Fehler mit <code>except ValueError:</code> ab.",
              useInput: "Frag das Alter mit <code>int(input(…))</code> ab.",
              friendly: "Bei Buchstaben soll eine freundliche Meldung erscheinen.",
              normalCase: "Bei der Eingabe 11 soll das Programm 12 ausgeben.",
            },
          },
        },
        {
          id: "s4-boss4",
          type: "final",
          title: "Dein eigenes Projekt",
          story: "Station Polaris läuft wieder! Jetzt fehlt nur noch dein eigenes Modul – etwas, das es so noch nie gab.",
          intro: `
<p>Das große Finale: <b>Bau etwas Eigenes!</b> Ein Spiel, eine Geschichte, ein Quiz oder ein
nützliches Werkzeug. Nutze, was du gelernt hast: <code>input()</code>, <code>if</code>,
Schleifen, Listen, Dictionaries, eigene Funktionen, <code>random</code> …</p>

<p>Es muss nicht perfekt sein – Hauptsache, es ist deins. Fang klein an, teste oft und bau
dann Stück für Stück weiter. Wenn du fertig bist, wartet dein Diplom. 🚀</p>`,
          taskHtml:
            "Schreib ein eigenes Programm, das mindestens <b>drei Bausteine</b> aus dem Kurs nutzt (<code>input()</code>, <code>if</code>, eine Schleife, eine Liste oder ein Dictionary, eine eigene Funktion, <code>random</code>) und ohne Fehler läuft. Sei kreativ – das ist dein Meisterstück!",
          hints: [
            "Fang klein an: erst etwas ausgeben, dann Schritt für Schritt erweitern.",
            "Ideen: ein Würfelspiel mit Punkten, ein Vokabel-Quiz aus einer Liste, ein Taschengeld-Planer mit Funktion.",
          ],
          starterCode: py`
            # 🌟 Dein Projekt. Ein paar Ideen:
            #  - ein Text-Abenteuer mit Entscheidungen (if/else)
            #  - ein Quiz zu deinem Lieblingsthema
            #  - ein Würfelspiel oder Rechen-Trainer
            #  - ein nützliches Werkzeug (Umrechner, Ideen-Generator)

            print("Mein Projekt startet …")
          `,
          solution: py`
            import random

            antworten = ["Ja, ganz sicher!", "Eher nicht …", "Frag später nochmal", "Auf jeden Fall!"]

            def orakel():
                return random.choice(antworten)

            print("🎲 Glücks-Orakel 🎲")
            for runde in range(3):
                frage = input("Stell mir eine Ja/Nein-Frage: ")
                if frage == "":
                    print("Du hast ja gar nichts gefragt!")
                else:
                    print(orakel())
          `,
          xp: 100,
          check: (r) => {
            const blocks = [
              r.call("input") > 0,
              r.node("If") > 0,
              r.node("For") + r.node("While") > 0,
              r.ast.listLens.length + r.ast.dictLens.length > 0,
              r.node("FunctionDef") > 0,
              r.ast.imports.includes("random"),
            ].filter(Boolean).length;
            return need(R.changed(r), [blocks >= 3, "blocks", { n: blocks }], [r.ast.codeLines >= 6, "tooShort"], R.output(r));
          },
          feedback: {
            blocks:
              "Dein Programm nutzt erst {n} der Bausteine. Nimm noch weitere dazu – zum Beispiel eine Schleife, eine Liste oder eine eigene Funktion.",
            tooShort: "Dein Projekt darf ruhig etwas größer werden – mindestens 6 Zeilen Code.",
          },
        },
      ],
    },
    // Nebenmissionen (Außeneinsätze, Glitch-Jagd): content/courses/season-1-missions.js
    ...missions,
  ],
};

export default course;
