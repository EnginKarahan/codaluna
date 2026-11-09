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

import { need, rules as R, numbers, hasNumber, width, py } from "../lib/check-kit.js";
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
        outro: "Die Station spricht, rechnet und fragt wieder zurück. Lumo dreht vor Freude eine Runde und will hinaus aufs Eis: Unter „Außeneinsätze“ im Lernpfad kannst du Lumo schon steuern. Als Nächstes lernt die Station, selbst zu entscheiden." },
      lessons: [
        {
          id: "s1-l1",
          title: "Hallo, Welt!",
          story: "Das Funkgerät der Station schweigt seit Jahren. Schick die allererste Nachricht hinaus – Hauptsache, sie klingt nach dir!",
          intro: `
<p>Ein Programm ist eine Liste von <b>Befehlen</b>, die der Computer der Reihe nach ausführt.
Dein erster Befehl ist <code>print()</code>. Er schreibt etwas in die <b>Konsole</b>, das dunkle
Feld unter dem Editor.</p>

<pre><code>print("Hallo Welt!")</code></pre>

<p>Alles zwischen den Anführungszeichen <code>"…"</code> gibt Python wörtlich aus. So einen Text
nennt man <b>String</b>. Die Anführungszeichen selbst erscheinen nicht.</p>

<p>Hier kann nichts kaputtgehen. Ändere den Text und drück <b>Ausführen</b>.</p>`,
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
            tool: true,
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
würde dagegen einfach das Wort ausgeben.</p>

<p>Zeilen, die mit <code>#</code> beginnen, sind <b>Kommentare</b>: Notizen für dich, die Python
überspringt. Im Start-Code stehen dort oft kleine Hinweise.</p>`,
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
<p>Eine Variable kann sich <b>ändern</b>. Dafür rechnest du mit ihrem alten Wert und legst das
Ergebnis zurück in denselben Behälter:</p>

<pre><code>leben = 3
leben = leben - 1
print(leben)</code></pre>

<p>Die erste Zeile gibt <code>leben</code> den Startwert 3. Die zweite nimmt diesen Wert, zieht 1 ab
und speichert das Ergebnis wieder in <code>leben</code>, ausgegeben wird also 2. Ohne die erste Zeile
klappt das nicht, weil Python nur mit einem Wert rechnen kann, den es schon kennt.</p>

<p><b>Bonus:</b> Schreib unter deinen Code drei neue Zeilen. Gib <code>punkte</code> zuerst den
Startwert 100, erhöhe ihn dann um 50 und gib ihn zum Schluss aus. Herauskommen soll 150.</p>

<p>Übrigens: Namen wie <code>punkte</code> dürfen Buchstaben, Ziffern und <code>_</code> enthalten,
aber nicht mit einer Ziffer beginnen.</p>`,
            solution: py`
              punkte = 100
              punkte = punkte + 50
              print(punkte)
            `,
            check: (r) => need([r.ast.selfUpdates > 0, "selfUpdate"], [r.num(150), "result150"]),
            feedback: {
              selfUpdate: "Erhöhe den Wert mit <code>punkte = punkte + 50</code> (oder kurz <code>punkte += 50</code>).",
              result150: "Am Ende sollte 150 ausgegeben werden. Bekommt <code>punkte</code> vorher den Startwert 100?",
            },
          },
        },
        {
          id: "s1-l3",
          title: "Der Spar-Rechner",
          story: "Im Bordcomputer klemmt noch eine alte Rechenaufgabe der Crew: Wie viele Energiezellen liegen im Notfalllager? Zeig ihm, dass die Station wieder rechnen kann.",
          intro: `
<p>Python ist ein prima Taschenrechner. Rechnen geht mit <code>+</code> (plus),
<code>-</code> (minus), <code>*</code> (mal) und <code>/</code> (geteilt) – man nimmt also
<code>*</code> statt „×“ und <code>/</code> statt „÷“.</p>

<p><b>Wichtig:</b> Zahlen schreibst du ohne Anführungszeichen. Sonst behandelt Python sie als
Text und rechnet nicht (<code>"5" + "3"</code> ergäbe <code>"53"</code> statt <code>8</code>!).</p>

<pre><code>stunden = 3
pro_stunde = 12
print(stunden * pro_stunde)</code></pre>

<p>Was gibt das Beispiel aus? Überleg zuerst und drück dann auf <b>Ausprobieren</b>. Das Schöne
an Variablen: Ändert sich ein Wert, rechnet das Programm automatisch neu.</p>`,
          taskHtml:
            "Die Crew hat <b>8 Wochen</b> lang jede Woche <b>5 Energiezellen</b> ins Notfalllager gelegt. Wie viele sind es zusammen? Rechne mit den beiden Variablen und gib das Ergebnis aus. (Zur Kontrolle: Es sind 40.)",
          hints: ["Malnehmen geht mit <code>*</code>. Statt der Zahlen schreibst du die Namen der Variablen.", "<code>print(pro_woche * wochen)</code>"],
          starterCode: py`
            pro_woche = 5
            wochen = 8
            # Berechne, wie viele Zellen im Lager liegen, und gib es aus
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
            tool: true,
            xp: 10,
            html: `
<p>Der Operator <code>//</code> teilt und lässt den Rest weg: <code>17 // 5</code> ergibt 3.
Den Rest bekommst du mit <code>%</code>: <code>17 % 5</code> ergibt 2, denn 3 mal 5 ist 15, und bis
17 fehlen noch 2.</p>
<p><b>Bonus:</b> Im Lager liegen <code>vorrat = 102</code> Energiezellen. Sie kommen in Kisten zu je
<code>pro_kiste = 5</code> Stück. Gib aus, wie viele <b>volle</b> Kisten es werden und wie viele
Zellen übrig bleiben.</p>`,
            solution: py`
              vorrat = 102
              pro_kiste = 5
              print(vorrat // pro_kiste, "volle Kisten")
              print(vorrat % pro_kiste, "Zellen bleiben übrig")
            `,
            check: (r) => need([r.node("FloorDiv") > 0, "floorDiv"], [r.node("Mod") > 0, "mod"], [r.num(20) && r.num(2), "result"]),
            feedback: {
              floorDiv: "Nutze <code>//</code> für die vollen Kisten: <code>vorrat // pro_kiste</code>.",
              mod: "Den Rest bekommst du mit <code>%</code>: <code>vorrat % pro_kiste</code>.",
              result: "Es sollten 20 volle Kisten und 2 übrige Zellen herauskommen.",
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
            tool: true,
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
            "Führ den Start-Code einmal aus und beantworte die zwei Fragen. Dann fehlen noch eine dritte Frage und die Ausgabe des Steckbriefs.",
            'Noch ein <code>input(…)</code> darunter, zum Beispiel <code>tier = input("Lieblingstier: ")</code>.',
            'Für jede Antwort eine Zeile: <code>print(f"Name: {name}")</code>, genauso mit <code>hobby</code> und deiner dritten Variablen.',
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
            tool: true,
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
        outro: "Das Hangartor öffnet sich, und draußen glitzert das Eis. Mit Schleifen und Sensoren findet Lumo bei den Außeneinsätzen jetzt auch Wege, die niemand vorher kennt. Als Nächstes lernt die Station, Dinge zu sammeln und eigene Befehle zu verstehen." },
      lessons: [
        {
          id: "s2-l2",
          title: "Wahr oder falsch?",
          story: "Die Sensoren im Hangar melden nur noch True oder False. Teste, ob du ihre Sprache verstehst.",
          intro: `
<p>Programme müssen oft etwas <b>prüfen</b>: Reicht die Energie? Stimmt der Code? Dafür gibt es
<b>Vergleiche</b>. Jeder Vergleich hat ein Ergebnis: <code>True</code> (wahr) oder <code>False</code>
(falsch). Das nennt man einen <b>Wahrheitswert</b> (englisch: <i>boolean</i>).</p>

<pre><code>print(10 &gt; 3)    # True
print(5 == 6)   # False</code></pre>

<p>Vergleichen kannst du mit <code>==</code> (gleich), <code>!=</code> (ungleich),
<code>&lt;</code> (kleiner), <code>&gt;</code> (größer), <code>&lt;=</code> und <code>&gt;=</code>.
Achtung: <code>==</code> fragt „ist gleich?“, ein einzelnes <code>=</code> weist einen Wert zu.</p>

<p>In der nächsten Lektion trifft dein Programm mit solchen Vergleichen echte Entscheidungen.</p>`,
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
            tool: true,
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
          id: "s2-l1",
          title: "Wenn … dann …",
          story: "Die Hangartür öffnet sich nur bei genug Energiepunkten. Bring ihr bei, auch freundlich Nein zu sagen.",
          intro: `
<p>Programme müssen <b>entscheiden</b>. Mit <code>if</code> („wenn“) prüfst du eine Bedingung,
zum Beispiel einen Vergleich aus der letzten Lektion. Ist sie <code>True</code>, läuft der eingerückte
Block darunter. <code>else</code> („sonst“) ist der andere Fall.</p>

<pre><code>punkte = 120
if punkte &gt;= 100:
    print("Level geschafft!")
else:
    print("Fast! Weiter geht's.")</code></pre>

<p><b>Zwei Regeln nimmt Python streng:</b> Nach der Bedingung steht ein <b>Doppelpunkt</b>
<code>:</code>, und die Zeilen, die dazugehören, werden <b>eingerückt</b> (4 Leerzeichen). Nach dem
Doppelpunkt rückt der Editor die nächste Zeile von selbst ein.</p>

<p><b>Mehr als zwei Fälle?</b> Dann kommt <code>elif</code> („sonst wenn“) dazwischen. Python prüft
von oben nach unten und nimmt den ersten Fall, der stimmt:</p>
<pre><code>punkte = 70
if punkte &gt;= 100:
    print("Level geschafft!")
elif punkte &gt;= 50:
    print("Fast!")
else:
    print("Weiter üben!")</code></pre>

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
<p><b>Bonus:</b> Bau mit <code>elif</code> drei Stufen: ab 100 Punkten „Level geschafft“, ab 50 Punkten
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
          id: "s2-l3",
          title: "Der Zufall entscheidet",
          story: "Für das Rover-Spiel der Crew fehlt der Würfel. Ich hätte gern einen, der wirklich zufällig ist.",
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
            tool: true,
            xp: 10,
            html: `
<p>Eine <b>Liste</b> sammelt mehrere Werte zwischen eckigen Klammern, getrennt durch Kommas:
<code>preise = ["Eis", "Joker", "Extrarunde", "Pause"]</code>. Mehr über Listen lernst du in
Kapitel 3. <code>random.choice(preise)</code> zieht zufällig einen Eintrag daraus.</p>
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

<p>Welche Klänge es gibt, steht im Start-Code. Bei <code>note</code> ist die Zahl nach dem Komma
die Länge in Schlägen.</p>`,
          taskHtml:
            "Bau einen <b>Beat</b> mit einer <b><code>for</code>-Schleife</b>, die sich <b>mindestens dreimal</b> wiederholt – hörbar mit <code>drum()</code> oder <code>note()</code>, oder als Text mit <code>print()</code>. Der Befehl steht dabei nur einmal im Code, die Schleife wiederholt ihn.",
          hints: [
            '<code>for i in range(4):</code> und darunter eingerückt <code>drum("kick")</code> oder <code>print(…)</code>.',
            'Für den Sound steht ganz oben <code>from station import drum, note</code> – das ist schon da.',
          ],
          starterCode: py`
            from station import drum, note

            # Schlagzeug: "kick", "snare", "hihat", "clap", "tom"
            # Töne: "C4", "D4", "E4" … oder "do4", "re4", "mi4" …
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
            tool: true,
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
            tool: true,
            xp: 15,
            html: `
<p>Die echten Signallampen hängen am <b>Bildschirm der Station</b>: 16 mal 16 Lampen.
<code>pixel(x, y, farbe)</code> schaltet eine davon ein. <code>x</code> zählt von links (0 bis 15),
<code>y</code> von oben (0 bis 15).</p>

<pre><code>from station import pixel

for i in range(4):
    pixel(i, 0, "gelb")</code></pre>

<p>Der Zähler <code>i</code> wandert hier von Lampe zu Lampe.</p>
<p><b>Bonus:</b> Lass mit einer Schleife eine Reihe aus mindestens <b>8 Signallampen</b> leuchten.
Wer mag, baut eine Treppe: <code>pixel(i, i, "gelb")</code>.</p>`,
            solution: py`
              from station import pixel

              for i in range(16):
                  pixel(i, 8, "gelb")
            `,
            check: (r) =>
              need(
                R.station(r),
                [(r.ast.callsInLoop.pixel || 0) > 0, "pixelInLoop"],
                [r.screen.lit >= 8, "eight"]
              ),
            feedback: {
              pixelInLoop: "Ruf <code>pixel(…)</code> eingerückt in der Schleife auf und nimm den Zähler <code>i</code> als Koordinate.",
              eight: "Es sollen mindestens 8 Lampen leuchten. Lass die Schleife öfter laufen, zum Beispiel <code>range(8)</code>.",
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
drückst <b>Stop</b>).</p>

<p>Übrigens: <code>zahl = zahl - 1</code> kann man auch kurz <code>zahl -= 1</code> schreiben,
genauso <code>zahl += 1</code>. Beides ist richtig.</p>`,
          taskHtml:
            'Lass einen <b>Countdown von 10 bis 1</b> mit einer <code>while</code>-Schleife laufen und gib danach <code>Start! 🚀</code> aus.',
          hints: [
            "Eine <code>while</code>-Schleife läuft, solange ihre Bedingung wahr ist. Welche Bedingung passt zu „die Zahl ist noch größer als 0“?",
            "In der Schleife passieren zwei Dinge: die Zahl ausgeben, dann die Zahl um 1 kleiner machen. Nach der Schleife, nicht eingerückt, kommt „Start!“.",
            '<code>while zahl &gt; 0:</code>, darunter eingerückt <code>print(zahl)</code> und <code>zahl = zahl - 1</code>, ganz unten ohne Einrückung <code>print("Start! 🚀")</code>.',
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
Darin fehlt noch der wichtigste Teil: die Hinweise.</p>

<p>Zur Erinnerung: <code>elif</code> heißt „sonst wenn“. Python prüft es nur, wenn die Bedingung
davor falsch war. Hier brauchst du zwei Vergleiche: Ist der Tipp größer als die geheime Zahl, kommt
„zu hoch“, ist er kleiner, kommt „zu tief“. Ist er gleich, kommt kein Hinweis. Beide Vergleiche
stehen <b>in</b> der Schleife, ihre <code>print</code>-Zeilen rückst du noch einmal ein.</p>`,
          taskHtml:
            "Vervollständige das Spiel: In der Schleife soll <b>„zu hoch“</b> oder <b>„zu tief“</b> ausgegeben werden, je nach Tipp. Bei einem richtigen Tipp kommt kein Hinweis. Probier es danach selbst aus!",
          hints: [
            "Ein Tipp kann zu hoch, zu tief oder genau richtig sein. Nur für die ersten beiden Fälle brauchst du einen Hinweis. Warum wäre <code>else</code> beim zweiten Hinweis falsch?",
            "Unter der <code>input</code>-Zeile, eingerückt in der Schleife: zuerst <code>if</code> für „zu hoch“, dann <code>elif</code> für „zu tief“.",
            '<code>if tipp &gt; geheim:</code> mit <code>print("zu hoch")</code> darunter, dann <code>elif tipp &lt; geheim:</code> mit <code>print("zu tief")</code>. Die beiden <code>print</code>-Zeilen sind noch einmal eingerückt.',
          ],
          starterCode: py`
            import random
            geheim = random.randint(1, 20)
            tipp = 0   # 0 ist nie die geheime Zahl, so startet die Schleife

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
        outro: "Alles hat seinen Platz, und die Bord-KI erkennt dich als Crew-Mitglied. Als Nächstes setzt du alles zusammen: ein Spiel, einen Geheimcode und das erste Bild für die Zentrale." },
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
            tool: true,
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
            tool: true,
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
          story: "Ich soll jeden Eintrag der Liste prüfen, einen nach dem anderen. Mit einer Schleife geht das in Sekunden.",
          intro: `
<p>Mit <code>for … in liste</code> gehst du <b>jeden Eintrag</b> der Reihe nach durch – ganz
ohne Positionen zu zählen:</p>

<pre><code>songs = ["A", "B", "C"]
for song in songs:
    print("Jetzt läuft:", song)</code></pre>

<p><code>song</code> ist bei jedem Durchlauf der nächste Eintrag. Den Namen davor darfst du frei
wählen – <code>for x in songs</code> ginge genauso, aber ein sprechender Name liest sich besser.</p>`,
          taskHtml:
            "Geh mit einer <code>for</code>-Schleife durch die Liste und gib <b>jeden Eintrag in einer eigenen Zeile</b> aus – gern mit einem Text davor, zum Beispiel „Jetzt läuft: …“. Wenn es klappt: Ergänze einen vierten Song in der Liste. Muss die Schleife dafür geändert werden? Probier es aus.",
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
          story: "Jeden Tag kommen Besucher in die Station, und ich begrüße jeden einzeln. Bau mir einen Befehl, der das übernimmt.",
          intro: `
<p>Eine <b>Funktion</b> ist ein eigener Befehl, den du einmal baust und beliebig oft aufrufst.
Mit <code>def</code> definierst du sie; in den Klammern stehen die <b>Parameter</b> – Werte,
die die Funktion beim Aufruf bekommt.</p>

<pre><code>def jubel(wort):
    print(f"{wort}! {wort}! {wort}!")

jubel("Hurra")
jubel("Python")</code></pre>

<p>Der eingerückte Block ist der „Bauplan“. Erst beim <b>Aufruf</b> wird er ausgeführt – mit
dem Wert, den du mitgibst. So sparst du dir Wiederholungen.</p>

<p>Im Start-Code steht der Bauplan schon, aber noch ohne Inhalt. <code>pass</code> ist ein
Platzhalter und heißt „hier passiert noch nichts“. Ersetze ihn durch deinen eigenen Code.</p>

<p>Mit eigenen Befehlen kann ich draußen sogar nach rechts abbiegen. Probier es im Außeneinsatz
„Rechts herum“ aus.</p>`,
          taskHtml:
            "Vervollständige die Funktion <code>begruesse(name)</code>: Sie soll eine Begrüßung ausgeben, in der der Name vorkommt. Ruf sie danach mit <b>zwei verschiedenen Namen</b> auf.",
          hints: [
            "Ersetze <code>pass</code> durch ein eingerücktes <code>print(…)</code>, in dem <code>name</code> vorkommt, zum Beispiel mit einem f-String.",
            'In der Funktion: <code>    print(f"Hallo {name}! 👋")</code>. Darunter, nicht eingerückt, zwei Aufrufe: <code>begruesse("Mia")</code> und einer mit einem anderen Namen.',
          ],
          starterCode: py`
            def begruesse(name):
                # Gib hier eine Begrüßung mit dem Namen aus
                pass

            # Ruf die Funktion mit zwei verschiedenen Namen auf
          `,
          solution: py`
            def begruesse(name):
                print(f"Hallo {name}! 👋")

            begruesse("Mia")
            begruesse("Jonas")
          `,
          xp: 40,
          tests: [{ probe: 'call(fn(1), "Zora")' }],
          check: (r) =>
            need(
              R.def(r),
              [r.ast.userCalls >= 2 || r.ast.defs.some((d) => (r.ast.callsInLoop[d.name] || 0) > 0), "twoCalls"],
              R.tests(r),
              [T(r).out.includes("Zora"), "useName"],
              R.minLines(r, 2),
              [new Set(r.lines).size >= 2, "differentNames"]
            ),
          feedback: {
            twoCalls: 'Ruf die Funktion zweimal auf, jeweils in einer eigenen Zeile: <code>begruesse("Mia")</code>.',
            useName:
              'Deine Funktion soll den Namen ausgeben, den sie bekommt. Ersetze <code>pass</code> durch ein <code>print</code> mit <code>name</code>, zum Beispiel <code>print(f"Hallo {name}!")</code>.',
            differentNames: "Nimm zwei <b>verschiedene</b> Namen.",
          },
          expert: {
            tool: true,
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
Aufrufs zurück. Diesen Wert kannst du speichern, ausgeben oder weiterverwenden.</p>

<p>Eine Funktion kann auch <b>mehrere Werte</b> bekommen. Die Parameter stehen dann mit Kommas
getrennt in den Klammern: <code>def durchschnitt(a, b, c):</code>. Beim Aufruf
<code>durchschnitt(2, 4, 6)</code> bekommt <code>a</code> den ersten Wert, <code>b</code> den
zweiten und <code>c</code> den dritten.</p>`,
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
            "Erweitere das Dictionary auf mindestens <b>drei</b> Paare (zum Beispiel mit einem Werkzeug, einem Haustier oder einer Farbe) und gib <b>zwei Werte</b> über ihren Schlüssel aus.",
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
            tool: true,
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
<p>Bau ein <b>Quiz</b> zu einem Thema deiner Wahl (Tiere, Musik, Sport, Weltraum …). Diesmal
brauchst du alles aus diesem Kapitel: Die Fragen stehen als <b>Karten</b> in einer Liste, jede
Karte ist ein Dictionary mit Frage und Antwort. Eine Schleife stellt jede Frage, und deine eigene
Funktion prüft die Antwort.</p>

<pre><code>def ist_gross(zahl):
    if zahl &gt; 100:
        return 1
    else:
        return 0

print(ist_gross(250))   # 1
print(ist_gross(7))     # 0</code></pre>

<p>Die Schleife im Start-Code ist schon fertig. Sie stellt jede Frage und zählt zusammen, was
<code>pruefe</code> zurückgibt: 1 für richtig, 0 für falsch. <code>len(karten)</code> zählt die
Karten in der Liste.</p>`,
          taskHtml:
            "Vervollständige die Funktion <code>pruefe(antwort, richtig)</code>: Sie soll <b>1</b> zurückgeben, wenn die Antwort stimmt, sonst <b>0</b>. Ergänze außerdem <b>mindestens zwei eigene Karten</b> in der Liste, damit dein Quiz drei Fragen hat.",
          hints: [
            "Fang mit der Funktion an. Sie bekommt die Antwort und die richtige Lösung. Wann ist die Antwort richtig?",
            'In <code>pruefe</code>: <code>if antwort == richtig:</code> mit <code>return 1</code>, sonst <code>return 0</code>. Eine neue Karte sieht so aus: <code>{"frage": "Größter Planet? ", "antwort": "jupiter"},</code>',
            "<code>def pruefe(antwort, richtig):</code>, darunter eingerückt <code>if antwort == richtig:</code> mit <code>return 1</code> und <code>else:</code> mit <code>return 0</code>. Die Karten kommen zwischen die eckigen Klammern, jede mit einem Komma dahinter.",
          ],
          starterCode: py`
            def pruefe(antwort, richtig):
                # Gib 1 zurück, wenn die Antwort stimmt, sonst 0
                return 0

            karten = [
                {"frage": "Wie viele Beine hat eine Spinne? ", "antwort": "8"},
                # Ergänze hier mindestens zwei eigene Karten
            ]

            punkte = 0
            for karte in karten:
                antwort = input(karte["frage"])
                punkte = punkte + pruefe(antwort, karte["antwort"])

            print("Punkte:", punkte, "von", len(karten))
          `,
          solution: py`
            def pruefe(antwort, richtig):
                if antwort == richtig:
                    print("Richtig!")
                    return 1
                else:
                    print("Leider falsch, richtig ist:", richtig)
                    return 0

            karten = [
                {"frage": "Wie viele Beine hat eine Spinne? ", "antwort": "8"},
                {"frage": "Hauptstadt von Italien? ", "antwort": "rom"},
                {"frage": "Welcher Planet ist der größte? ", "antwort": "jupiter"},
            ]

            punkte = 0
            for karte in karten:
                antwort = input(karte["frage"])
                punkte = punkte + pruefe(antwort, karte["antwort"])

            print("Punkte:", punkte, "von", len(karten))
          `,
          xp: 60,
          tests: [{ fill: "???" }, { fill: "???", probe: 'call(fn(2), "8", "8")' }, { fill: "???", probe: 'call(fn(2), "7", "8")' }],
          check: (r) =>
            need(
              R.def(r),
              R.ret(r),
              [r.ast.listDicts >= 3, "threeCards"],
              R.forLoop(r),
              // Gibt pruefe bei falschen Antworten nichts zurück, stürzt „punkte + None“ ab
              [!(T(r).error && T(r).error.type === "TypeError"), "returnZero"],
              [Number(T(r, 1).value) === 1, "returnOne"],
              [Number(T(r, 2).value) === 0 && T(r, 2).value !== null, "returnZero"],
              R.tests(r),
              [hasNumber(T(r).lines[T(r).lines.length - 1] || "", 0), "scoreAtEnd"]
            ),
          feedback: {
            threeCards: 'Ergänze in der Liste <code>karten</code> mindestens zwei eigene Karten, jede mit <code>"frage"</code> und <code>"antwort"</code>.',
            returnOne: "Bei einer richtigen Antwort soll <code>pruefe</code> 1 zurückgeben. Vergleiche <code>antwort</code> mit <code>richtig</code> und schreib <code>return 1</code>.",
            returnZero: "Bei einer falschen Antwort soll <code>pruefe</code> 0 zurückgeben: <code>else:</code> mit <code>return 0</code>.",
            scoreAtEnd: 'Gib ganz am Ende den Punktestand aus, zum Beispiel <code>print("Punkte:", punkte)</code>.',
          },
          expert: {
            xp: 15,
            tool: true,
            html: `
<p><code>antwort.lower()</code> macht aus allen Buchstaben kleine. Dann zählt „Rom“ genauso wie
„rom“ oder „ROM“.</p>
<p><b>Bonus:</b> Sorg dafür, dass <code>pruefe</code> Groß- und Kleinschreibung nicht beachtet:
<code>pruefe("ROM", "rom")</code> soll 1 ergeben.</p>`,
            solution: py`
              def pruefe(antwort, richtig):
                  if antwort.lower() == richtig.lower():
                      print("Richtig!")
                      return 1
                  else:
                      print("Leider falsch, richtig ist:", richtig)
                      return 0

              karten = [
                  {"frage": "Wie viele Beine hat eine Spinne? ", "antwort": "8"},
                  {"frage": "Hauptstadt von Italien? ", "antwort": "Rom"},
                  {"frage": "Welcher Planet ist der größte? ", "antwort": "Jupiter"},
              ]

              punkte = 0
              for karte in karten:
                  antwort = input(karte["frage"])
                  punkte = punkte + pruefe(antwort, karte["antwort"])

              print("Punkte:", punkte, "von", len(karten))
            `,
            tests: [{ fill: "???" }, { fill: "???", probe: 'call(fn(2), "ROM", "rom")' }],
            check: (r) => need([r.method("lower") > 0, "useLower"], R.tests(r), [Number(T(r, 1).value) === 1, "ignoreCase"]),
            feedback: {
              useLower: "Mach die Antwort vor dem Vergleich klein: <code>antwort.lower()</code>.",
              ignoreCase: '<code>pruefe("ROM", "rom")</code> ergibt noch nicht 1. Vergleichst du <code>antwort.lower()</code> mit <code>richtig</code>?',
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
        outro: "Station Polaris leuchtet wieder! Ab jetzt baust du deine eigenen Module. Im Spielplatz kannst du jederzeit weiterbauen, und mit „Teilen“ zeigst du anderen, was du gebaut hast." },
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
print(geheim)   # IBMMP</code></pre>

<p>Eine <code>for</code>-Schleife kann auch über einen Text laufen: <code>zeichen</code> ist dann
bei jedem Durchgang der nächste Buchstabe. <code>geheim</code> beginnt als leerer Text
<code>""</code> und wächst Buchstabe für Buchstabe.</p>`,
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
            tool: true,
            html: `
<p>Echte Caesar-Codes verschieben meist um 3. Aber was passiert bei <code>"Z"</code> + 3? Damit es
nach dem Z wieder bei A weitergeht, hilft der <b>Rest</b> einer Division mit <code>%</code>:
<code>27 % 26</code> ergibt 1, <code>28 % 26</code> ergibt 2.</p>
<p>Der Trick in drei Schritten: den Buchstaben in eine Zahl von 0 bis 25 verwandeln
(<code>ord(z) - 65</code>), verschieben und mit <code>% 26</code> im Alphabet halten, wieder in einen
Buchstaben verwandeln (<code>+ 65</code>, dann <code>chr</code>). Probier es zuerst mit einem
einzigen Buchstaben:</p>
<pre><code>z = "Z"
nummer = ord(z) - 65         # 25
neu = (nummer + 3) % 26      # 2
print(chr(neu + 65))         # C</code></pre>
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

<pre><code>from station import pixel, fill

for x in range(16):
    pixel(x, 12, "teal")   # eine Linie quer über den Bildschirm
pixel(7, 4, "gold")</code></pre>

<p>Farben kannst du als Namen angeben, auf Englisch oder Deutsch (<code>"red"</code>,
<code>"rot"</code>, <code>"blau"</code>, <code>"pink"</code> …) oder als Farbcode wie
<code>"#ff8800"</code>. <code>"schwarz"</code> schaltet einen Pixel wieder aus, und
<code>fill(farbe)</code> färbt den ganzen Bildschirm.</p>

<p>Mit einer Schleife malst du eine ganze Linie. Wie man Flächen füllt, zeigt die Bonus-Aufgabe.</p>`,
          taskHtml:
            "Male ein <b>Bild auf den Stationsbildschirm</b>: mindestens <b>12 Pixel</b> in mindestens <b>zwei Farben</b>, und nutze dafür mindestens <b>eine Schleife</b>. Ein Baum, eine Rakete, ein Gesicht, dein Lieblingslogo …",
          hints: [
            'Eine Linie geht mit einer Schleife: <code>for x in range(3, 13):</code> und darunter <code>pixel(x, 14, "grün")</code>.',
            "Für die zweite Farbe setzt du einfach noch ein paar Pixel mit einer anderen Farbe darüber.",
          ],
          starterCode: py`
            from station import pixel, fill

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
            tool: true,
            html: `
<p>Eine Schleife <b>in</b> einer Schleife füllt eine Fläche: Für jede Zeile <code>y</code> läuft die
innere Schleife über alle Spalten <code>x</code>.</p>
<pre><code>for y in range(2, 5):
    for x in range(3, 9):
        pixel(x, y, "blau")   # ein Rechteck aus 3 mal 6 Pixeln</code></pre>
<p>Pixel-Künstler zeichnen ihre Bilder auch gern als <b>Liste von Texten</b>: Jedes Zeichen ist ein
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
Schleifen, zum Beispiel ein Rechteck, ein Muster oder ein Bild aus einer Textliste.</p>`,
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
          story: "Die Sensoren im Gewächshaus der Station haben sechs Tage lang die Temperatur gemessen. Werte die Daten aus.",
          intro: `
<p>Programmieren hilft, echte Daten zu verstehen. Für Listen aus Zahlen gibt es fertige
Werkzeuge: <code>max()</code> (größter Wert), <code>min()</code> (kleinster),
<code>sum()</code> (Summe) und <code>len()</code> (Anzahl).</p>

<pre><code>temps = [21, 25, 19, 28, 23, 24]
print("Niedrigste Temperatur:", min(temps))</code></pre>

<p>Den <b>Durchschnitt</b> bekommst du mit „Summe geteilt durch Anzahl“ – also mit
<code>sum</code> und <code>len</code> zusammen.</p>`,
          taskHtml:
            "Finde mit <code>max()</code> die <b>höchste Temperatur</b> und berechne den <b>Durchschnitt</b> der Temperaturen mit <code>sum()</code> und <code>len()</code>. Gib beides aus.",
          hints: ["<code>max(temps)</code> liefert den größten Wert.", "Durchschnitt: <code>sum(temps) / len(temps)</code>"],
          starterCode: py`
            temps = [21, 25, 19, 28, 23, 24]
            # Gib die höchste Temperatur und den Durchschnitt aus
          `,
          solution: py`
            temps = [21, 25, 19, 28, 23, 24]
            print("Höchste Temperatur:", max(temps))
            print("Durchschnitt:", sum(temps) / len(temps))
          `,
          xp: 50,
          check: (r) =>
            need(
              [r.call("max") > 0, "useMax"],
              [r.call("sum") > 0 && r.call("len") > 0, "useSumLen"],
              [r.num(28), "max28"],
              [r.num(140 / 6), "average"]
            ),
          feedback: {
            useMax: "Nutze <code>max(temps)</code> für die höchste Temperatur.",
            useSumLen: "Berechne den Durchschnitt mit <code>sum(temps) / len(temps)</code>.",
            max28: "Die höchste Temperatur war 28 Grad – gib sie aus.",
            average: "Der Durchschnitt sollte etwa 23.33 sein. Teilst du die Summe durch die Anzahl?",
          },
          expert: {
            tool: true,
            xp: 15,
            html: `
<p><b>Bonus:</b> Runde den Durchschnitt mit <code>round(wert, 1)</code> auf eine
Nachkommastelle und finde mit einer Schleife heraus, an wie vielen Tagen es <b>über 22 Grad</b>
warm war.</p>`,
            solution: py`
              temps = [21, 25, 19, 28, 23, 24]
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
                [r.num(4), "count4"]
              ),
            feedback: {
              useRound: "Runde mit <code>round(…, 1)</code>.",
              countLoop: "Zähle mit einer <code>for</code>-Schleife und einem <code>if</code>, wie viele Werte über 22 liegen.",
              count4: "Es waren 4 Tage über 22 Grad (25, 28, 23 und 24).",
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
            alter = 13
            print("Hallo " + name)
            print("Nächstes Jahr bist du " + (alter + 1) + " Jahre alt")
            for i in range(3)
            print("Hurra!")
          `,
          solution: py`
            name = "Emma"
            alter = 13
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
              [r.num(14), "age"],
              [Math.max(0, ...Object.values(counts)) >= 3, "threeHurra"]
            );
          },
          feedback: {
            keepLoop: "Lass die Schleife stehen und repariere sie.",
            allLines: "Alle Zeilen sollen ausgegeben werden – lösch keine Befehle, sondern repariere sie.",
            age: "In der Ausgabe soll stehen, wie alt Emma nächstes Jahr ist (14). Nutze <code>str(alter + 1)</code>.",
            threeHurra: "„Hurra!“ soll dreimal erscheinen: Die <code>print</code>-Zeile gehört eingerückt in die Schleife.",
          },
          expert: {
            tool: true,
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
dann Stück für Stück weiter. Keine Idee? In den Tipps stehen zwei Baupläne.</p>

<p>Mit <b>Teilen</b> über dem Editor bekommst du einen Link zu deinem Programm, den du verschicken
kannst. Zeig es jemandem! Und wenn du fertig bist, wartet dein Diplom. 🚀</p>`,
          taskHtml:
            "Bau ein eigenes Programm, das mindestens <b>drei Bausteine</b> aus dem Kurs nutzt (<code>input()</code>, <code>if</code>, eine Schleife, eine Liste oder ein Dictionary, eine eigene Funktion, <code>random</code>, Bildschirm oder Lautsprecher der Station) und ohne Fehler läuft. Überleg zuerst: Was soll die erste kleine Version können? Bau sie und erweitere sie danach.",
          hints: [
            "Such dir <b>eine</b> Idee aus den Kommentaren im Start-Code aus. Schreib zuerst nur eine Zeile, die etwas ausgibt, und führ sie aus. Dann kommt Baustein für Baustein dazu.",
            "Bauplan Würfelspiel: 1. <code>import random</code> und eine Liste mit Namen · 2. eine <code>for</code>-Schleife über die Namen · 3. in der Schleife für jeden würfeln und ausgeben · 4. mit <code>if</code> eine Sechs feiern.",
            "Bauplan Quiz: 1. eine Liste mit Fragekarten wie im Mini-Quiz · 2. eine Schleife über die Karten · 3. <code>input()</code> in der Schleife · 4. mit <code>if</code> Punkte zählen und am Ende ausgeben.",
          ],
          starterCode: py`
            # 🌟 Dein Projekt. Ein paar Ideen:
            #  - ein Text-Abenteuer mit Entscheidungen (if/else)
            #  - ein Quiz zu deinem Lieblingsthema
            #  - ein Würfelspiel oder Rechen-Trainer
            #  - ein nützliches Werkzeug (Umrechner, Ideen-Generator)
            #  - ein Bild oder eine Melodie mit der Station
            # Zwei Baupläne findest du in den Tipps.

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
              r.ast.imports.includes("station"),
            ].filter(Boolean).length;
            return need(R.changed(r), [blocks >= 3, "blocks", { n: blocks }], R.output(r));
          },
          feedback: {
            blocks:
              "Dein Programm nutzt erst {n} der Bausteine. Nimm noch weitere dazu – zum Beispiel eine Schleife, eine Liste oder eine eigene Funktion.",
          },
        },
      ],
    },
    // Nebenmissionen (Außeneinsätze, Glitch-Jagd): content/courses/season-1-missions.js
    ...missions,
  ],
};

export default course;
