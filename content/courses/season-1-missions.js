// Codaluna – Nebenmissionen zu „Season 1“ (deutsche Basis): Außeneinsätze mit Lumo und Glitch-Jagd.
//
// Nebenstränge laufen neben dem Hauptkurs (siehe course.js): Jede Mission öffnet sich, wenn
// die vorige Mission erledigt ist und – falls `requires` gesetzt ist – die genannte Lektion
// des Hauptkurses. So kommt kein Begriff vor seiner Erklärung.
//
// Außeneinsätze: Das Programm steuert Lumo über eine Gitterwelt (Modul `drone`, pqrt.py).
// `world` ist das sichtbare Eisfeld; `tests` enthalten versteckte Testwelten, damit nur
// allgemeine Lösungen (Schleifen, Sensoren) bestehen, keine auswendig gezählten Schritte.
// Karte: "#" Wand, "." Eis, "*" Kristall, "G" Ladestation, "D" Start; dir = Blickrichtung.
//
// Glitch-Jagd: Der Start-Code ist absichtlich kaputt; repariert ist er, wenn er ohne Fehler
// läuft und das Richtige ausgibt (sprachneutral geprüft).

import { need, rules as R, numbers, hasNumber, py } from "../lib/check-kit.js";

const W = (map, dir = "E") => ({ map, dir });
const T = (r, i = 0) => r.tests[i] || { ok: false, lines: [], out: "", value: null, drone: null };
const firstNumbers = (ls) => ls.map((l) => (numbers(l).length ? numbers(l)[0] : null));

// Eisfelder der Missionen
const LABYRINTH_A = W([
  "#########",
  "#D..#...#",
  "###.#.#.#",
  "#...#.#.#",
  "#.###.#.#",
  "#.....#.#",
  "#.#####.#",
  "#......G#",
  "#########",
]);
const LABYRINTH_B = W([
  "#########",
  "#D#.....#",
  "#.#.###.#",
  "#.#...#.#",
  "#.###.#.#",
  "#...#.#.#",
  "###.#.#.#",
  "#.....#G#",
  "#########",
]);
const LABYRINTH_C = W([
  "###########",
  "#D....#...#",
  "#.###.#.#.#",
  "#.#...#.#.#",
  "#.#.###.#.#",
  "#.#.....#.#",
  "#.#######.#",
  "#.#G......#",
  "###########",
]);

export default [
  // ================================================================== AUSSENEINSÄTZE
  {
    id: "d1",
    strand: "drone",
    title: "Lumo über das Eis steuern",
    region: {
      icon: "crystal",
      name: "Eisfeld",
      pos: [342, 264],
      link: "c1",
      intro: "Vor der Station liegt das Eisfeld. Hier steuerst du Lumo direkt mit Python: Jeder Befehl ist ein Flugmanöver.",
      outro: "Lumo kennt jetzt jeden Winkel des Eisfelds – und du hast eine Drohne programmiert, die ihren Weg selbst findet.",
    },
    lessons: [
      {
        id: "d-1",
        title: "Erster Ausflug",
        story: "Draußen vor der Station glitzert das Eis. Ich darf hinausfliegen – aber nur mit deinen Befehlen. Bring mich zur Ladestation!",
        intro: `
<p>Hier steuerst du Lumo direkt mit Python. Die Flugbefehle holst du dir mit
<code>from drone import *</code> – das Sternchen heißt „alle Befehle“.</p>

<pre><code>from drone import *

move()
move()</code></pre>

<p><code>move()</code> fliegt Lumo ein Feld nach vorn, in die Richtung, in die der Pfeil zeigt.
Das Ziel ist die <b>Ladestation</b> ⚡. Fliegt Lumo gegen eine Wand, ist das kein Drama: Es gibt
einen Glitch, und du versuchst es noch einmal.</p>`,
        taskHtml: "Bring Lumo zur <b>Ladestation</b> ⚡. Zähl die Felder!",
        hints: [
          "Zähl die Eisfelder zwischen Lumo und der Ladestation.",
          "Jedes Feld braucht ein eigenes <code>move()</code>.",
          "Es sind fünf Felder: fünfmal <code>move()</code> untereinander.",
        ],
        starterCode: py`
          from drone import *

          move()
        `,
        solution: py`
          from drone import *

          move()
          move()
          move()
          move()
          move()
        `,
        xp: 20,
        world: W(["#########", "#D....G.#", "#########"]),
        check: (r) => need(R.goal(r)),
      },
      {
        id: "d-2",
        title: "Um die Ecke",
        story: "Die Ladestation liegt hinter einer Eiswand. Ich muss abbiegen – zum Glück kann ich mich auf der Stelle drehen.",
        intro: `
<p><code>turn_left()</code> dreht Lumo auf der Stelle nach links, eine Vierteldrehung. Einen Befehl
für rechts gibt es nicht. Ob man trotzdem nach rechts kommt? Das findest du später heraus.</p>

<pre><code>from drone import *

move()
turn_left()</code></pre>

<p>Probier es aus: Lumo fliegt ein Feld und schaut danach nach oben. Für den Weg zur Ladestation
musst du Fliegen und Drehen passend verbinden.</p>`,
        taskHtml: "Flieg Lumo um die Ecke zur Ladestation ⚡.",
        hints: [
          "Wo muss Lumo abbiegen? Zähl die Felder bis zur Ecke und von der Ecke bis zur Ladestation.",
          "Erst geradeaus bis vor die Wand, dann <code>turn_left()</code>, dann weiter mit <code>move()</code>.",
          "Viermal <code>move()</code>, einmal <code>turn_left()</code>, zweimal <code>move()</code>.",
        ],
        starterCode: py`
          from drone import *

          move()
        `,
        solution: py`
          from drone import *

          move()
          move()
          move()
          move()
          turn_left()
          move()
          move()
        `,
        xp: 20,
        world: W(["#######", "#####G#", "#####.#", "#D....#", "#######"]),
        check: (r) => need(R.goal(r)),
        expert: {
          xp: 5,
          html: "<p><b>Bonus:</b> An der Ladestation soll Lumo zum Schluss nach <b>links</b> schauen (Richtung Westen), damit die Kamera die Station im Blick hat.</p>",
          solution: py`
            from drone import *

            move()
            move()
            move()
            move()
            turn_left()
            move()
            move()
            turn_left()
          `,
          check: (r) => need(R.goal(r), [!!r.drone && r.drone.d === "W", "faceWest"]),
          feedback: { faceWest: "Lumo steht richtig, schaut aber noch nicht nach links. Eine Drehung fehlt." },
        },
      },
      {
        id: "d-3",
        title: "Kristalle sammeln",
        story: "Auf dem Eis liegen Energiekristalle. Jeder einzelne hilft der Station – hilf mir, sie unterwegs einzusammeln.",
        intro: `
<p>Eiskristalle speichern Energie. <code>collect()</code> sammelt den Kristall auf dem Feld ein,
auf dem Lumo gerade steht. Liegt dort keiner, meldet Lumo einen Glitch.</p>

<pre><code>from drone import *

move()
move()
collect()</code></pre>`,
        taskHtml: "Sammle <b>beide Kristalle</b> ein und flieg danach zur Ladestation ⚡.",
        hints: [
          "Lumo kann nur den Kristall einsammeln, auf dem es gerade steht.",
          "Flieg auf das Feld mit dem Kristall und ruf dort <code>collect()</code> auf.",
          "Der erste Kristall liegt zwei Felder vor Lumo, der zweite zwei Felder weiter, die Ladestation noch zwei Felder dahinter.",
        ],
        starterCode: py`
          from drone import *

          move()
          move()
        `,
        solution: py`
          from drone import *

          move()
          move()
          collect()
          move()
          move()
          collect()
          move()
          move()
        `,
        xp: 25,
        world: W(["#########", "#D.*.*.G#", "#########"]),
        check: (r) => need(R.crystals(r), R.goal(r)),
      },
      {
        id: "d-4",
        title: "Lange Gänge",
        requires: "s2-l4",
        story: "Ein schmaler Eiskanal führt zur äußeren Ladestation. Er ist lang – und ich mag keine langen Befehlslisten.",
        intro: `
<p>13 Felder, 13 Zeilen <code>move()</code>? Mit einer <code>for</code>-Schleife geht das in
zwei Zeilen:</p>

<pre><code>from drone import *

for i in range(4):
    move()</code></pre>

<p>Alles, was eingerückt unter der <code>for</code>-Zeile steht, wiederholt Lumo.</p>`,
        taskHtml: "Der Gang ist <b>13 Felder</b> lang. Bring Lumo mit einer <b><code>for</code>-Schleife</b> zur Ladestation ⚡.",
        hints: [
          "Welcher Befehl wiederholt sich? Den schreibst du nur einmal, eingerückt in die Schleife.",
          "<code>for i in range(…):</code> und darunter eingerückt <code>move()</code>.",
          "<code>range(13)</code> wiederholt 13-mal.",
        ],
        starterCode: py`
          from drone import *

          # Der Gang ist 13 Felder lang
          move()
        `,
        solution: py`
          from drone import *

          for i in range(13):
              move()
        `,
        xp: 30,
        world: W(["################", "#D............G#", "################"]),
        check: (r) => need(R.forLoop(r), R.goal(r)),
        expert: {
          xp: 5,
          html: "<p><b>Bonus:</b> Lass Lumo bei jedem Schritt die Nummer des Feldes funken: 1, 2, 3 … bis 13, jede Zahl in einer eigenen Zeile. Tipp: <code>i</code> zählt ab 0.</p>",
          solution: py`
            from drone import *

            for i in range(13):
                move()
                print("Feld", i + 1)
          `,
          check: (r) =>
            need(R.goal(r), [JSON.stringify(firstNumbers(r.lines).filter((n) => n !== null)) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]), "count13"]),
          feedback: { count13: "Gib in der Schleife bei jedem Schritt die Nummer des Feldes aus, von 1 bis 13. Weil <code>i</code> bei 0 anfängt: <code>print(i + 1)</code>." },
        },
      },
      {
        id: "d-5",
        title: "Unbekannte Strecke",
        requires: "s2-l6",
        story: "Der Schneesturm verschiebt ständig die Eisplatten. Wie weit die Ladestation heute weg ist, weiß niemand – ich muss es unterwegs selbst merken.",
        intro: `
<p>Lumo hat <b>Sensoren</b>. Sie beantworten Fragen mit <code>True</code> oder <code>False</code>.
<code>at_goal()</code> ist <code>True</code>, wenn Lumo auf der Ladestation steht:</p>

<pre><code>from drone import *

print(at_goal())   # False – Lumo steht noch am Start</code></pre>

<p>Mit <code>while</code> wiederholt Lumo etwas, <b>solange</b> eine Bedingung wahr ist. Und
<code>not</code> dreht <code>True</code> und <code>False</code> um: <code>not at_goal()</code>
heißt „noch nicht am Ziel“.</p>`,
        taskHtml:
          "Hier siehst du eine mögliche Strecke. Dein Programm wird zusätzlich auf <b>kürzeren und längeren</b> Strecken geprüft, die du nicht siehst. Bring Lumo mit einer <b><code>while</code>-Schleife</b> und <code>at_goal()</code> zur Ladestation ⚡, ohne die Felder zu zählen.",
        hints: [
          "Lumo soll so lange fliegen, bis es am Ziel ist. Welcher Sensor sagt dir, ob Lumo schon da ist?",
          "<code>while not at_goal():</code> heißt „solange Lumo noch nicht am Ziel ist“.",
          "Darunter eingerückt steht nur <code>move()</code>.",
        ],
        starterCode: py`
          from drone import *

          # Wie weit ist die Ladestation? Lumo weiß es nicht …
          move()
        `,
        solution: py`
          from drone import *

          while not at_goal():
              move()
        `,
        xp: 35,
        world: W(["##########", "#D......G#", "##########"]),
        tests: [{ world: W(["#####", "#D.G#", "#####"]) }, { world: W(["##############", "#D..........G#", "##############"]) }],
        check: (r) => need(R.whileLoop(r), R.goal(r), R.worlds(r)),
        expert: {
          xp: 10,
          html: "<p><b>Bonus:</b> Lass Lumo unterwegs <b>mitzählen</b> und am Ende ausgeben, wie viele Felder es geflogen ist.</p>",
          solution: py`
            from drone import *

            felder = 0
            while not at_goal():
                move()
                felder = felder + 1
            print("Geflogen:", felder, "Felder")
          `,
          tests: [{ world: W(["#####", "#D.G#", "#####"]) }, { world: W(["##############", "#D..........G#", "##############"]) }],
          check: (r) =>
            need(R.goal(r), [r.num(7) && r.tests.every((t) => t.ok && t.drone && hasNumber(t.out, t.drone.steps)), "count"]),
          feedback: { count: "Gib am Ende aus, wie viele Felder Lumo geflogen ist. Zähl in der Schleife mit <code>felder = felder + 1</code>." },
        },
      },
      {
        id: "d-6",
        title: "Kristallspur",
        requires: "s2-l6",
        story: "Nach dem Sturm liegen Kristalle verstreut auf der Strecke, und zwar jedes Mal woanders. Ich will keinen übersehen.",
        intro: `
<p>Mit <code>if</code> trifft Lumo unterwegs Entscheidungen. <code>on_crystal()</code> ist
<code>True</code>, wenn unter Lumo ein Kristall liegt:</p>

<pre><code>from drone import *

if on_crystal():
    collect()
print("Kristall unter mir?", on_crystal())</code></pre>

<p>Setzt du die Entscheidung <b>in</b> eine Schleife, prüft Lumo jedes Feld, an dem es vorbeikommt.</p>`,
        taskHtml:
          "Sammle <b>alle</b> Kristalle ein und flieg zur Ladestation ⚡. In der Prüfung liegen die Kristalle auch an anderen Stellen, dein Programm soll deshalb jedes Feld prüfen.",
        hints: [
          "Auf jedem Feld fragt sich Lumo: Liegt hier ein Kristall? Wenn ja, einsammeln. Dann weiter.",
          "In der <code>while</code>-Schleife: erst prüfen, ob ein Kristall da ist, dann ein Feld weiter.",
          "<code>while not at_goal():</code>, darunter <code>if on_crystal():</code> mit <code>collect()</code>, danach <code>move()</code>.",
        ],
        starterCode: py`
          from drone import *

          while not at_goal():
              move()
        `,
        solution: py`
          from drone import *

          while not at_goal():
              if on_crystal():
                  collect()
              move()
        `,
        xp: 40,
        world: W(["############", "#D.*..**.*G#", "############"]),
        tests: [{ world: W(["#########", "#D**...G#", "#########"]) }, { world: W(["##########", "#D.....*G#", "##########"]) }],
        check: (r) => need(R.whileLoop(r), R.ifStmt(r), R.crystals(r), R.goal(r), R.worlds(r, true)),
        expert: {
          xp: 10,
          html: "<p><b>Bonus:</b> Zähl die Kristalle mit und gib am Ende aus, wie viele Lumo gesammelt hat.</p>",
          solution: py`
            from drone import *

            kristalle = 0
            while not at_goal():
                if on_crystal():
                    collect()
                    kristalle = kristalle + 1
                move()
            print("Kristalle:", kristalle)
          `,
          tests: [{ world: W(["#########", "#D**...G#", "#########"]) }, { world: W(["##########", "#D.....*G#", "##########"]) }],
          check: (r) =>
            need(R.crystals(r), [r.num(4) && r.tests.every((t) => t.ok && t.drone && hasNumber(t.out, t.drone.crystals)), "count"]),
          feedback: { count: "Gib am Ende die Zahl der gesammelten Kristalle aus. Zähl direkt nach <code>collect()</code> mit." },
        },
      },
      {
        id: "d-8",
        title: "Spirale",
        requires: "s2-l6",
        story: "Ein Gang windet sich wie eine Spirale ins Innere einer alten Eishöhle. Jede Höhle ist anders – ich muss selbst entscheiden, wann ich abbiege.",
        intro: `
<p><code>front_clear()</code> ist <code>True</code>, wenn vor Lumo frei ist. Mit <code>if</code> und
<code>else</code> entscheidet Lumo bei jedem Schritt neu:</p>

<pre><code>from drone import *

if front_clear():
    move()
else:
    turn_left()</code></pre>`,
        taskHtml:
          "Der Gang windet sich wie eine Spirale nach innen. Lass Lumo mit <code>while</code>, <code>if</code> und <code>else</code> selbst den Weg zur Ladestation ⚡ finden. Dein Programm wird auch in einer anderen Spirale geprüft, die du nicht siehst.",
        hints: [
          "Lumo muss bei jedem Schritt nur eine Frage beantworten: Ist vorn frei?",
          "Solange Lumo nicht am Ziel ist: Ist vorn frei, fliegt Lumo weiter, sonst dreht Lumo nach links.",
          "<code>while not at_goal():</code>, darin <code>if front_clear():</code> mit <code>move()</code> und <code>else:</code> mit <code>turn_left()</code>.",
        ],
        starterCode: py`
          from drone import *

          # Lumo soll selbst entscheiden: weiterfliegen oder abbiegen?
          move()
        `,
        solution: py`
          from drone import *

          while not at_goal():
              if front_clear():
                  move()
              else:
                  turn_left()
        `,
        xp: 45,
        world: W(["#######", "#.....#", "#.###.#", "#..G#.#", "#####.#", "#D....#", "#######"]),
        tests: [{ world: W(["#########", "#.......#", "#.#####.#", "#...G##.#", "#######.#", "#D......#", "#########"]) }],
        check: (r) => need(R.whileLoop(r), R.elseBlock(r), R.goal(r), R.worlds(r)),
      },
      {
        id: "d-7",
        title: "Rechts herum",
        requires: "s3-l4",
        story: "Eine Treppe aus Eisblöcken führt nach rechts oben. Ich kann mich aber nur nach links drehen … oder?",
        intro: `
<p>Dreimal links ist dasselbe wie einmal rechts! Statt jedes Mal drei Zeilen zu schreiben, baust du
dir einen <b>eigenen Befehl</b>:</p>

<pre><code>from drone import *

def turn_right():
    turn_left()
    turn_left()
    turn_left()

turn_right()</code></pre>

<p>Ab jetzt kennt Python <code>turn_right()</code> genauso gut wie die eingebauten Befehle. Im
Start-Code steht im Befehl noch der Platzhalter <code>pass</code>. Ersetze ihn durch deine drei
Drehbefehle.</p>`,
        taskHtml:
          "Bau dir den Befehl <code>turn_right()</code> mit <code>def</code> und flieg Lumo die Eistreppe hinauf zur Ladestation ⚡ – am besten Stufe für Stufe mit einer Schleife.",
        hints: [
          "Schau dir die Treppe an: Wie sieht eine einzelne Stufe aus, und wie oft kommt sie vor?",
          "Eine Stufe ist: <code>move()</code>, <code>turn_left()</code>, <code>move()</code>, <code>turn_right()</code>. Es sind vier Stufen, danach fehlt noch ein Feld.",
          "<code>for i in range(4):</code> und darunter eingerückt die vier Befehle einer Stufe. Nach der Schleife, nicht eingerückt, noch ein <code>move()</code>.",
        ],
        starterCode: py`
          from drone import *

          def turn_right():
              # dreimal links ist einmal rechts
              pass   # Platzhalter: Ersetze diese Zeile durch deine Befehle

          move()
        `,
        solution: py`
          from drone import *

          def turn_right():
              turn_left()
              turn_left()
              turn_left()

          for i in range(4):
              move()
              turn_left()
              move()
              turn_right()
          move()
        `,
        xp: 40,
        world: W(["########", "#####.G#", "####..##", "###..###", "##..####", "#D.#####", "########"]),
        check: (r) => need(R.def(r), [r.ast.userCalls > 0, "useDef"], R.goal(r)),
        feedback: { useDef: "Du hast den Befehl gebaut, aber noch nicht benutzt. Ruf <code>turn_right()</code> auf, wo Lumo nach rechts muss." },
        expert: {
          xp: 10,
          html: "<p><b>Bonus:</b> Bau einen zweiten Befehl <code>stufe()</code>, der eine ganze Stufe fliegt, und ruf ihn in einer Schleife auf.</p>",
          solution: py`
            from drone import *

            def turn_right():
                turn_left()
                turn_left()
                turn_left()

            def stufe():
                move()
                turn_left()
                move()
                turn_right()

            for i in range(4):
                stufe()
            move()
          `,
          check: (r) => need([r.ast.defs.length >= 2, "twoDefs"], R.forLoop(r), R.goal(r)),
          feedback: { twoDefs: "Bau neben <code>turn_right()</code> noch einen zweiten Befehl, zum Beispiel <code>def stufe():</code>." },
        },
      },
      {
        id: "d-10",
        title: "Flugplan",
        requires: "s3-l4",
        story: "Die Zentrale funkt mir einen Flugplan als Liste. Ich soll ihn genau so abfliegen, Schritt für Schritt.",
        intro: `
<p>Ein Flugplan ist eine <b>Liste</b> aus Befehlen als Text. Eine <code>for</code>-Schleife geht ihn
Eintrag für Eintrag durch, und mit <code>if</code> und <code>elif</code> entscheidet Lumo bei jedem
Eintrag, was zu tun ist:</p>

<pre><code>from drone import *

plan = ["vor", "links", "vor"]
for schritt in plan:
    if schritt == "vor":
        move()
    elif schritt == "links":
        turn_left()</code></pre>

<p>So kann die Zentrale Lumo jeden Weg schicken, ohne dass jemand das Programm ändert. Neu ist
immer nur der Plan.</p>`,
        taskHtml:
          "Lass Lumo den Flugplan aus dem Start-Code abfliegen. Darin kommt auch <code>\"rechts\"</code> vor, dafür steht <code>turn_right()</code> schon bereit. Geh den Plan mit einer <code>for</code>-Schleife durch und bring Lumo zur Ladestation ⚡.",
        hints: [
          "Für jeden Eintrag im Plan fragt Lumo: Ist es „vor“, „links“ oder „rechts“? Zu jedem Wort gehört ein Befehl.",
          "<code>for schritt in plan:</code>, darin <code>if schritt == \"vor\":</code> mit <code>move()</code>, dann zwei <code>elif</code> für „links“ und „rechts“.",
          "Nach <code>elif schritt == \"links\":</code> kommt <code>turn_left()</code>, nach <code>elif schritt == \"rechts\":</code> kommt <code>turn_right()</code>, jeweils noch einmal eingerückt.",
        ],
        starterCode: py`
          from drone import *

          def turn_right():
              turn_left()
              turn_left()
              turn_left()

          plan = ["vor", "vor", "rechts", "vor", "vor", "links", "vor", "vor"]

          # Geh den Plan mit einer for-Schleife durch
        `,
        solution: py`
          from drone import *

          def turn_right():
              turn_left()
              turn_left()
              turn_left()

          plan = ["vor", "vor", "rechts", "vor", "vor", "links", "vor", "vor"]

          for schritt in plan:
              if schritt == "vor":
                  move()
              elif schritt == "links":
                  turn_left()
              elif schritt == "rechts":
                  turn_right()
        `,
        xp: 45,
        world: W(["#######", "#D..###", "###.###", "###..G#", "#######"]),
        check: (r) =>
          need(
            R.forLoop(r),
            [r.ast.forIters.includes("Name") || r.ast.forIters.includes("List"), "loopOverPlan"],
            R.elif(r),
            [["move", "turn_left", "turn_right"].every((n) => (r.ast.callsInLoop[n] || 0) > 0), "allCommands"],
            R.goal(r)
          ),
        feedback: {
          loopOverPlan: "Lass die Schleife direkt über den Plan laufen: <code>for schritt in plan:</code>",
          allCommands: "Lumo soll in der Schleife alle drei Befehle verstehen: <code>move()</code>, <code>turn_left()</code> und <code>turn_right()</code>.",
        },
      },
      {
        id: "d-9",
        type: "boss",
        title: "Labyrinth-Rettung",
        requires: "s3-l4",
        story: "Ein Schneesturm hat mich in ein Eislabyrinth geweht – und keins sieht aus wie das andere. Nur ein kluges Programm bringt mich nach Hause.",
        intro: `
<p>Ein alter Trick für Labyrinthe: <b>Halte immer die rechte Hand an der Wand.</b> Wer das tut,
findet in Labyrinthen wie diesen sicher zum Ausgang. Für Lumo heißt das bei jedem Schritt:</p>
<ul>
<li>erst nach rechts drehen,</li>
<li>dann nach links drehen, solange vorn eine Wand ist,</li>
<li>dann ein Feld fliegen.</li>
</ul>
<p>Dafür brauchst du eine Schleife <b>in</b> einer Schleife. Die <b>äußere Schleife</b> kümmert sich
um den ganzen Weg: Sie läuft, bis Lumo am Ziel ist. Die <b>innere Schleife</b> kümmert sich nur um
die nächste Richtung: Sie dreht Lumo nach links, solange vorn eine Wand ist. Dann endet die innere
Schleife, Lumo fliegt ein Feld, und der nächste Schritt beginnt.</p>`,
        taskHtml:
          "Bring Lumo mit der Rechte-Hand-Regel durch das Labyrinth zur Ladestation ⚡. Dein Programm wird auch in anderen Labyrinthen dieser Art geprüft, die du nicht siehst.",
        hints: [
          "Spiel einen Schritt im Kopf durch: Lumo dreht nach rechts. Ist dort eine Wand, dreht es nach links, bis vorn frei ist. Dann fliegt es ein Feld. <code>turn_right()</code> aus „Rechts herum“ steht schon im Start-Code.",
          "Zwei Schleifen: Die äußere läuft mit <code>while not at_goal():</code>. Darin kommt erst <code>turn_right()</code>, dann die innere Schleife, die mit <code>turn_left()</code> dreht, solange vorn nicht frei ist, und danach genau ein <code>move()</code>.",
          "Außen <code>while not at_goal():</code>, darin <code>turn_right()</code>, dann <code>while not front_clear():</code> mit <code>turn_left()</code>, dann <code>move()</code>.",
        ],
        starterCode: py`
          from drone import *

          def turn_right():
              turn_left()
              turn_left()
              turn_left()

          # Rechte Hand an der Wand …
          move()
        `,
        solution: py`
          from drone import *

          def turn_right():
              turn_left()
              turn_left()
              turn_left()

          while not at_goal():
              turn_right()
              while not front_clear():
                  turn_left()
              move()
        `,
        xp: 60,
        world: LABYRINTH_A,
        tests: [{ world: LABYRINTH_B }, { world: LABYRINTH_C }],
        check: (r) => need(R.def(r), R.whileLoop(r), R.goal(r), R.worlds(r)),
      },
    ],
  },

  // ================================================================== GLITCH-JAGD
  {
    id: "g1",
    strand: "glitch",
    title: "Kaputte Programme reparieren",
    region: {
      icon: "wrench",
      name: "Wartungsschacht",
      pos: [56, 264],
      link: "c1",
      intro: "Im Wartungsschacht liegen alte Programme der Crew – voller Glitches. Jedes, das du reparierst, bringt die Station ein Stück weiter.",
      outro: "Der Wartungsschacht ist sauber. Du findest Glitches inzwischen schneller als die Bord-KI.",
    },
    lessons: [
      {
        id: "g-1",
        title: "Funkstille",
        requires: "s1-l5",
        story: "Ein altes Begrüßungsprogramm der Crew soll Besucher mit Namen begrüßen. Stattdessen meldet es nur Glitches.",
        intro: `
<p>Willkommen bei der <b>Glitch-Jagd</b>! Hier schreibst du kein neues Programm, sondern
reparierst ein kaputtes. So gehen Profis vor:</p>
<ul>
<li>Programm ausführen und die Fehlerkarte in Ruhe lesen.</li>
<li>Auf „Zeile …“ klicken – dort klemmt es.</li>
<li>Einen Fehler beheben und wieder ausführen. Oft kommt danach der nächste zum Vorschein.</li>
</ul>`,
        taskHtml:
          "Repariere das Programm: Es soll nach dem Namen fragen und dann <b>zwei Zeilen</b> ausgeben – eine Begrüßung mit dem Namen und „Willkommen an Bord!“.",
        hints: [
          "Zuerst meldet Python die letzte Zeile: Dort fehlt ein Anführungszeichen vor der Klammer.",
          "Danach: Python unterscheidet Groß- und Kleinschreibung. <code>name</code> und <code>Name</code> sind zwei verschiedene Namen.",
        ],
        starterCode: py`
          name = input("Wie heißt du? ")
          print("Hallo, " + Name + "!")
          print("Willkommen an Bord!)
        `,
        solution: py`
          name = input("Wie heißt du? ")
          print("Hallo, " + name + "!")
          print("Willkommen an Bord!")
        `,
        xp: 25,
        tests: [{ inputs: ["Mira"] }],
        check: (r) => need(R.changed(r), R.tests(r), [T(r).out.includes("Mira") && T(r).lines.length >= 2, "greet"]),
        feedback: { greet: "Die Begrüßung soll den eingegebenen Namen enthalten, und danach soll „Willkommen an Bord!“ kommen." },
      },
      {
        id: "g-2",
        title: "Rechenfehler",
        requires: "s1-l5",
        story: "Der Altersrechner der Station soll nur ausrechnen, wie alt man in zehn Jahren ist. Stattdessen stürzt er bei jeder Eingabe ab.",
        intro: `
<p>Dieser Glitch ist ein Klassiker: <code>input()</code> liefert immer <b>Text</b>, auch wenn jemand
eine Zahl eintippt. Text und Zahl lassen sich aber nicht einfach zusammenrechnen.</p>
<pre><code>print(int("12") + 10)
print("Alter: " + str(22))</code></pre>
<p><code>int(…)</code> macht aus Text eine Zahl, <code>str(…)</code> aus einer Zahl Text.</p>`,
        taskHtml: "Repariere den Rechner: Er soll für <b>jedes</b> Alter richtig ausrechnen, wie alt man in zehn Jahren ist.",
        hints: [
          "Die erste Fehlerkarte zeigt auf die Rechnung: Text + Zahl geht nicht. Wandle die Eingabe mit <code>int(…)</code> um.",
          "Danach klemmt es beim Ausgeben: Text + Zahl passt wieder nicht. <code>str(…)</code> oder ein f-String hilft.",
        ],
        starterCode: py`
          alter = input("Wie alt bist du? ")
          in_zehn_jahren = alter + 10
          print("In zehn Jahren bist du " + in_zehn_jahren + " Jahre alt.")
        `,
        solution: py`
          alter = int(input("Wie alt bist du? "))
          in_zehn_jahren = alter + 10
          print(f"In zehn Jahren bist du {in_zehn_jahren} Jahre alt.")
        `,
        xp: 25,
        tests: [{ inputs: ["12"] }, { inputs: ["30"] }],
        check: (r) => need(R.tests(r), [hasNumber(T(r, 0).out, 22) && hasNumber(T(r, 1).out, 40), "math"]),
        feedback: { math: "Das Programm läuft, rechnet aber noch nicht für jedes Alter richtig. Für 12 soll 22 herauskommen, für 30 dann 40." },
      },
      {
        id: "g-3",
        title: "Endloser Countdown",
        requires: "s2-l6",
        story: "Die Startrampe zählt herunter … und hört nie auf. Der Rover wartet seit Jahren auf sein „Start!“.",
        intro: `
<p>Manche Glitches erzeugen gar keine Fehlermeldung – das Programm läuft einfach <b>endlos</b>.
Keine Sorge: Codaluna hält es nach einer Weile an. Dann lohnt sich die Frage: Was müsste sich in der
Schleife ändern, damit die Bedingung irgendwann <code>False</code> wird?</p>`,
        taskHtml: "Repariere den Countdown: Er soll <b>5, 4, 3, 2, 1</b> ausgeben und danach „Start!“ – und dann wirklich aufhören.",
        hints: [
          "Führ das Programm ruhig einmal aus. Woran liegt es, dass die Schleife nie endet?",
          "In der Schleife muss <code>zahl</code> kleiner werden: <code>zahl = zahl - 1</code> – eingerückt, nach dem <code>print</code>.",
        ],
        starterCode: py`
          zahl = 5
          while zahl > 0:
              print(zahl)
          print("Start!")
        `,
        solution: py`
          zahl = 5
          while zahl > 0:
              print(zahl)
              zahl = zahl - 1
          print("Start!")
        `,
        xp: 30,
        check: (r) =>
          need(
            R.whileLoop(r),
            [
              r.lines.length === 6 &&
                JSON.stringify(firstNumbers(r.lines.slice(0, 5))) === "[5,4,3,2,1]" &&
                numbers(r.lines[5]).length === 0,
              "countdown",
            ]
          ),
        feedback: { countdown: "Der Countdown soll genau 5, 4, 3, 2, 1 zählen und danach einmal „Start!“ ausgeben." },
      },
      {
        id: "g-4",
        title: "Verrutschte Liste",
        requires: "s3-l3",
        story: "Die Lagerliste im Labor bricht jedes Mal ab, bevor sie fertig ist. Irgendwo verzählt sich das Programm.",
        intro: `
<p>Man kann eine Liste auch über ihre <b>Positionen</b> durchlaufen. <code>len(vorraete)</code>
zählt die Einträge, hier sind es vier. Die Positionen heißen deshalb 0, 1, 2 und 3, und
<code>range(4)</code> liefert genau diese vier Zahlen. <code>vorraete[i]</code> holt dann den Eintrag
an Position <code>i</code>.</p>
<p>Zwei Glitches stecken in diesem Programm. Der erste verhindert, dass es überhaupt startet. Der zweite
zeigt sich erst beim Laufen und hat mit genau diesen Positionen zu tun.</p>`,
        taskHtml: "Repariere die Lagerliste: Jeder Vorrat soll in einer eigenen Zeile erscheinen und am Ende die Anzahl.",
        hints: ["Zähl die Klammern in der letzten Zeile.", "<code>range(len(vorraete))</code> zählt genau die Positionen der Liste – ohne <code>+ 1</code>."],
        starterCode: py`
          vorraete = ["Eis", "Kristalle", "Batterien", "Kekse"]
          for i in range(len(vorraete) + 1):
              print("Im Lager:", vorraete[i])
          print("Anzahl:", len(vorraete)
        `,
        solution: py`
          vorraete = ["Eis", "Kristalle", "Batterien", "Kekse"]
          for i in range(len(vorraete)):
              print("Im Lager:", vorraete[i])
          print("Anzahl:", len(vorraete))
        `,
        xp: 30,
        check: (r) => need(R.forLoop(r), [r.lines.length === 5 && hasNumber(r.lines[4], 4), "list"]),
        feedback: { list: "Es sollen genau vier Vorräte erscheinen, jeder in einer eigenen Zeile, und danach die Anzahl 4." },
      },
      {
        id: "g-5",
        title: "Vergessene Rückgabe",
        requires: "s3-l5",
        story: "Der Energierechner der Zentrale zeigt zwar eine Zahl an, rechnet danach aber mit nichts weiter. Ein Glitch wie aus dem Lehrbuch!",
        intro: `
<p>Eine Funktion kann etwas <b>anzeigen</b> (<code>print</code>) oder etwas <b>zurückgeben</b>
(<code>return</code>). Das ist nicht dasselbe: Nur was zurückgegeben wird, kann das Programm
weiterverwenden. Ohne <code>return</code> gibt eine Funktion <code>None</code> zurück – „nichts“.</p>`,
        taskHtml:
          "Repariere die Funktion <code>doppelt</code>: Sie soll ihr Ergebnis <b>zurückgeben</b>, damit das Programm damit weiterrechnen kann. Am Ende soll „Energie gesamt: 50“ erscheinen.",
        hints: [
          "Die Fehlerkarte sagt: <code>None</code> plus Zahl geht nicht. Die Funktion gibt also nichts zurück.",
          "Ersetz <code>print(ergebnis)</code> in der Funktion durch <code>return ergebnis</code>.",
        ],
        starterCode: py`
          def doppelt(zahl):
              ergebnis = zahl * 2
              print(ergebnis)

          energie = doppelt(21)
          print("Energie gesamt:", energie + 8)
        `,
        solution: py`
          def doppelt(zahl):
              ergebnis = zahl * 2
              return ergebnis

          energie = doppelt(21)
          print("Energie gesamt:", energie + 8)
        `,
        xp: 35,
        tests: [{ probe: "call(fn(1), 7)" }],
        check: (r) => need(R.ret(r), R.tests(r), [T(r).value === 14, "double"], [r.num(50), "fifty"]),
        feedback: {
          double: "Die Funktion soll das Doppelte zurückgeben – für 7 also 14.",
          fifty: "Am Ende soll „Energie gesamt: 50“ erscheinen.",
        },
      },
      {
        id: "g-6",
        title: "Falscher Schlüssel",
        requires: "s3-l6",
        story: "Die Ausweiskarte eines Crew-Mitglieds lässt sich nicht mehr lesen. Irgendwo hakt es beim Nachschlagen.",
        intro: `
<p>Ein <code>KeyError</code> bedeutet: Diesen Schlüssel gibt es im Dictionary nicht. Oft ist es nur
ein Tippfehler oder ein Großbuchstabe, wo ein kleiner hingehört. Vergleiche den Schlüssel in den
eckigen Klammern Buchstabe für Buchstabe mit denen im Dictionary.</p>`,
        taskHtml: "Repariere die Ausweiskarte: Sie soll Name, Rolle und Alter ausgeben, jedes in einer eigenen Zeile.",
        hints: [
          "Zuerst meldet Python die letzte Zeile: Dort fehlt eine Klammer.",
          "Danach: Im Dictionary heißt der Schlüssel <code>\"rolle\"</code>, kleingeschrieben.",
        ],
        starterCode: py`
          ausweis = {"name": "Yara", "rolle": "Pilotin", "alter": 14}
          print("Name:", ausweis["name"])
          print("Rolle:", ausweis["Rolle"])
          print("Alter:", ausweis["alter"]
        `,
        solution: py`
          ausweis = {"name": "Yara", "rolle": "Pilotin", "alter": 14}
          print("Name:", ausweis["name"])
          print("Rolle:", ausweis["rolle"])
          print("Alter:", ausweis["alter"])
        `,
        xp: 35,
        tests: [{ probe: "values(dict)" }],
        check: (r) =>
          need(
            R.changed(r),
            R.tests(r),
            [
              r.lines.length === 3 &&
                Array.isArray(T(r).value) &&
                T(r).value.some((d) => d && typeof d === "object" && !Array.isArray(d) && Object.keys(d).length >= 3 && Object.values(d).every((v) => r.out.includes(String(v)))),
              "card",
            ]
          ),
        feedback: { card: "Die Karte soll genau drei Zeilen zeigen: Name, Rolle und Alter aus dem Dictionary." },
      },
      {
        id: "g-7",
        title: "Pixel im Nichts",
        requires: "s4-l3",
        story: "Der Bildschirm in der Zentrale soll eine Leuchtlinie und einen Statuspunkt zeigen. Stattdessen stürzt das Programm ab.",
        intro: `
<p>Der Bildschirm hat 16 mal 16 Pixel. Weil ab 0 gezählt wird, gehen die Koordinaten von 0 bis 15.
Wer eine Lampe bei 16 einschalten will, greift ins Leere, und Python meldet einen Glitch. Die
Fehlerkarte sagt dir, welcher Wert zu groß war.</p>`,
        taskHtml:
          "Repariere das Programm: Eine blaue Linie soll quer über den <b>ganzen</b> Bildschirm gehen (Zeile 8), und <b>ganz rechts oben</b> soll ein roter Punkt leuchten.",
        hints: [
          "<code>range(17)</code> zählt von 0 bis 16. Welche Zahl ist eine zu viel?",
          "Ganz rechts ist <code>x = 15</code>, nicht 16.",
        ],
        starterCode: py`
          from station import pixel

          for x in range(17):
              pixel(x, 8, "blau")
          pixel(16, 0, "rot")
        `,
        solution: py`
          from station import pixel

          for x in range(16):
              pixel(x, 8, "blau")
          pixel(15, 0, "rot")
        `,
        xp: 35,
        check: (r) => {
          const line = Array.from({ length: 16 }, (_, x) => r.screen.pixels[`${x},8`]);
          const corner = r.screen.pixels["15,0"];
          return need(
            R.changed(r),
            [line.every(Boolean) && new Set(line).size === 1, "line"],
            [!!corner && corner !== line[0], "corner"]
          );
        },
        feedback: {
          line: "Die Linie in Zeile 8 soll über alle 16 Pixel gehen, von x = 0 bis x = 15, in einer Farbe.",
          corner: "Ganz rechts oben, also bei <code>pixel(15, 0, …)</code>, soll ein Punkt in einer anderen Farbe leuchten.",
        },
      },
    ],
  },
];
