# Spielend lernen – Konzept für PyQuest (Oktober 2026)

> **Stand 17.10.2026: umgesetzt** (Branch `spielend-lernen`, Pakete 1–4). Rahmen „Außenposten“
> als Station Polaris mit Lumo; Klang standardmäßig an (leise, Schalter in Kopfzeile und
> Lernpfad); Hauptkurs bleibt linear, Wahl gibt es über zwei Nebenstränge (Außeneinsätze,
> Glitch-Jagd), die sich mit dem Hauptkurs öffnen. Abweichungen und Details: Abschnitt 8.

Ziel: PyQuest soll nicht nur eine gut gemachte Lern-App sein, sondern eine App, die Jugendliche
ab 12 **gern und freiwillig** öffnen, weil das Programmieren selbst zum Spiel wird. Dieses Papier
prüft den Ist-Zustand, fasst zusammen, was Medienpädagogik, Motivationsforschung und Jugendschutz
dazu sagen, schaut auf erfolgreiche Spiele und Apps und leitet daraus einen konkreten, in Pakete
geteilten Umbau ab. Quellen stehen am Ende.

---

## 1. Befund: Warum PyQuest heute noch nicht „mitzieht“

Technisch und didaktisch ist PyQuest stark (echte Ausführung, konkrete Rückmeldungen, gute
Fehlerkultur). Spielerisch ist es aber ein **Schulbuch mit IDE und einer Punkte-Schicht darüber**:

| Beobachtung (Screenshots Desktop + Mobil) | Wirkung auf Jugendliche |
|---|---|
| Jede Lektion beginnt mit einer Textwand; auf dem Handy füllt die Erklärung den ganzen ersten Bildschirm, die Aufgabe liegt darunter. | Fühlt sich nach Hausaufgabe an, bevor überhaupt etwas passiert. |
| Alle Ergebnisse sind Text in einer Konsole. Keine Grafik, kein Ton, keine Bewegung („Beat wiederholen“ macht keinen Beat hörbar, „Muster malen“ malt Zeichen). | Der Code bewirkt nichts *Sichtbares*. Der Reiz „ich habe das gebaut“ bleibt aus. |
| Spielelemente sind XP, Level, Streak, Abzeichen, Diplom, also das klassische „Punkte-Abzeichen-Ranglisten“-Paket (ohne Ranglisten). | Belohnung **nach** dem Lernen statt Spiel **im** Lernen. Laut Forschung der schwächste Hebel (Abschnitt 2). |
| Keine Welt, keine Geschichte, keine Figur. Die Lektionsthemen (Spar-Rechner, Zahlen-Raten, Quiz) stehen nebeneinander. | Kein „Wofür mache ich das?“, kein Wunsch zu erfahren, wie es weitergeht. |
| Streng linear, jede Lektion sperrt die nächste. | Wenig Autonomie, keine eigenen Wege. |
| Header zeigt beim Start „🔥 0 STREAK“. | Erste Botschaft ist eine Null. |
| Erfolg = eine grüne Karte in der Konsole, Abzeichen = eine zweite Karte. Keine Animation, kein Klang. | Der Erfolgsmoment ist leise und schnell vorbei. |
| Eigene Programme lassen sich niemandem zeigen. | Für 12- bis 16-Jährige ist „guck mal, was ich gemacht habe“ ein Hauptantrieb. |

Was bleiben soll, weil es medienpädagogisch richtig ist: keine Ranglisten, keine Käufe, kein
Tracking, ermutigende Fehlerkultur („Fehler-Freund“), Tipps und Lösung ohne Strafe, offline.

---

## 2. Was Medienpädagogik und Forschung dazu sagen

**Spiel im Lernen, nicht Spiel als Belohnung (intrinsische Integration).** Habgood & Ainsworth
(2011) haben dasselbe Mathe-Spiel in zwei Fassungen getestet: einmal ist das Lernen die
Spielmechanik selbst, einmal ist es ein Quiz zwischen Spielabschnitten. Die integrierte Fassung
brachte mehr Lernzuwachs in gleicher Zeit, und Kinder spielten sie in ihrer freien Zeit rund
**siebenmal länger**. Eine Folgestudie (Cutting & Iacovides 2022, n = 210) bestätigt den
Lernvorteil und erklärt ihn mit Aufmerksamkeit auf das Wesentliche. Für PyQuest heißt das:
**Code muss etwas steuern** (eine Figur, ein Bild, einen Klang, eine Welt), nicht nur Punkte
auslösen.

**Punkte allein tragen nicht weit.** Die Metaanalyse von Sailer & Homner (2020) findet für
Gamification im Lernen kleine bis mittlere Effekte (kognitiv g = .49, motivational g = .36,
Verhalten g = .25), wobei die motivationalen Effekte in strengen Studien weniger stabil sind.
Gamification ist also kein Selbstläufer; es kommt darauf an, *welche* Elemente wie eingesetzt
werden.

**Selbstbestimmungstheorie (Deci & Ryan).** Motivation, die bleibt, entsteht, wenn drei
Grundbedürfnisse erfüllt sind: **Autonomie** (ich wähle), **Kompetenz** (ich werde besser und
merke es), **Eingebundenheit** (ich gehöre dazu, andere sehen, was ich mache). Ryan, Rigby &
Przybylski (2006) zeigen, dass genau diese drei erklären, warum Videospiele fesseln. Belohnungen,
die als Kontrolle erlebt werden, können die Freude an der Sache sogar senken; Rückmeldung, die
informiert („du hast jetzt Schleifen drauf“), stärkt sie (Deci, Koestner & Ryan 1999).

**Meaningful Gamification (Nicholson, RECIPE).** Statt Belohnungen: Spiel (freies Ausprobieren),
Exposition (Geschichte, Figuren), Wahl, Information (verstehen, was passiert), Engagement mit
anderen, Reflexion. Das passt fast eins zu eins zu den Lücken aus Abschnitt 1.

**Kreatives Lernen (Resnick, Scratch).** Projekte, Leidenschaft, Gleichaltrige, Spiel, dazu
„niedrige Schwelle, hohe Decke, **breite Wände**“: viele Wege zum Ziel, weil kein einzelnes
Projekt alle anspricht. PyQuest hat Schwelle und Decke (Bonus-Aufgaben), aber nur einen Weg.

**Entwicklungsstand ab 12.** Autonomie und Identität werden wichtig, das Urteil Gleichaltriger
zählt viel, Vergleich mit anderen trifft empfindlich. Daraus folgt: nicht verkindlichen,
Selbstausdruck ermöglichen (gestalten, anpassen), Zeigen erlauben, Vergleichen vermeiden.
Ranglisten können gerade den Schwächeren schaden; die Befunde sind gemischt, aber Leistungsabfall
ist der am häufigsten dokumentierte Negativeffekt von Gamification und Ranglisten das dabei am
häufigsten genannte Element. Die Entscheidung gegen Ranglisten ist richtig.

**Streaks.** Silverman & Barasch (2023, sieben Studien) zeigen: Ein gerissener Streak senkt die
weitere Nutzung, weil der Streak selbst zum Ziel geworden ist; der Effekt wird schwächer, wenn
man ihn „reparieren“ kann. Elternratgeber beschreiben die Kehrseite als Streak-Angst: Man öffnet
die App nicht mehr zum Lernen, sondern um nichts zu verlieren. Die EU-Leitlinien zum Schutz Minderjähriger (Art. 28 DSA,
14.07.2025) nennen Streaks und Push-Nachrichten ausdrücklich als Funktionen, die übermäßige
Nutzung fördern und für Minderjährige standardmäßig aus sein sollen (dort mit Blick auf
Kommunikations-Streaks). PyQuest ist vermutlich keine „Plattform“ im Sinne des DSA, aber die
Leitlinien sind der aktuelle Maßstab.

**Jugendschutz (§ 10b Abs. 3 JuSchG).** Bei der Alterseinstufung zählen auch Risiken durch
Kontaktfunktionen, Kauffunktionen, **glücksspielähnliche Mechanismen** und **Mechanismen zur
Förderung exzessiver Mediennutzung**. jugendschutz.net fordert für kinder- und jugendaffine Spiele
den vollständigen Verzicht auf manipulative Gestaltung.

**Spielen ist Alltag.** Laut JIM-Studie 2025 spielen rund 71 % der 12- bis 19-Jährigen täglich
oder mehrmals pro Woche digitale Spiele, Smartphone und Tablet sind das wichtigste Spielgerät.
Die Messlatte für „macht Spaß“ ist also die Qualität echter Spiele, und Mobil zählt.

### Leitplanken, die daraus folgen

PyQuest übernimmt die Mittel von Spielen, die **Kompetenz, Autonomie, Neugier und Selbstausdruck**
bedienen, und verzichtet konsequent auf die, die mit **Verlustangst, Zufall, Vergleich oder Druck**
arbeiten:

| Ja | Nein |
|---|---|
| Code steuert sichtbar etwas (Figur, Bild, Klang, Welt) | Punkte als Hauptmotor |
| Geschichte, Welt, Begleitfigur | Ranglisten, öffentliche Vergleiche |
| Spürbares, schönes Feedback (Animation, Klang) | Zufallsbelohnungen (Lootboxen, Glücksrad, „Überraschungskisten“) |
| Wahl zwischen Wegen und Themen | Währung, Shop, Käufe, Energie- und Wartesysteme |
| Gestalten und Freischalten (transparent, verdient) | Verlustangst: Streak-Warnungen, ablaufende Belohnungen, zeitlich begrenzte Events |
| Eigene Projekte per Link zeigen | Chat, Kontakte, Profile, Kommentare |
| Neugier belohnen (geheime Entdeckungen) | Push-Nachrichten, „Du hast heute noch nicht …“ |
| Natürliche Pausen und Speicherpunkte | Zeitdruck, Bestzeiten, Strafe für Tipps oder Lösung |

---

## 3. Was erfolgreiche Spiele und Apps vormachen

| Vorbild | Was es gut macht | Für PyQuest |
|---|---|---|
| **The Farmer Was Replaced** (Steam, Vollversion seit 10/2025) | Python-ähnlicher Code steuert eine Drohne auf einem Feld; Automatisieren schaltet Technik frei. Kein Level-Menü, sondern fortlaufender Fortschritt. | Code als Steuerung einer Figur in einer Welt. |
| **Reeborg's World / Karel the Robot** | Klassiker im Unterricht: Roboter auf Gitter, `move()`, `turn_left()`, Schleifen und Bedingungen werden *sichtbar*. Reeborg läuft mit Python im Browser. | Bewährtes, kleines Modell für eine Gitter-Welt. |
| **Swift Playgrounds** (Apple) | Figur in einer 3D-Rätselwelt, jede Lektion eine Mission, später freie Projekte. | Mission statt Lektion, freie Projekte als Ziel. |
| **CodeCombat** | Echter Python-Code steuert einen Helden durch Level. | Python bleibt Python, auch im Spiel. |
| **Codédex** | Pixel-Art-Welt mit RPG-Rahmengeschichte für Python-Einsteiger. | Rahmengeschichte trägt durch einen Kurs. |
| **Human Resource Machine** | Programmieren als Puzzle mit Humor, optionale Zusatzziele („kürzer“, „schneller“). | Optionale Meisterschaftsziele statt Pflicht. |
| **Scratch** | Projekte teilen, ansehen, remixen. | Teilen per Link, ohne Plattform. |
| **Duolingo** | Lernpfad als Weg, Figuren mit Mimik, sehr gutes Mikro-Feedback, kurze Einheiten. Aber: Streak-Druck und Erinnerungs-Mails sind die bekannte Schattenseite. | Das Feedback übernehmen, den Druck weglassen. |

**Aktuelle App-Design-Muster**, die hierher passen: Figuren, die auf den Zustand reagieren
(nachdenken, freuen, staunen), kurze Mikro-Animationen mit Sinn statt Dauergewackel,
dezenter Klang und auf dem Handy kurze Vibration bei Erfolg, „erst ausprobieren, dann
erklären“ statt Text vorweg, Lernpfad als Karte, freischaltbare Gestaltung (Themes, Farben).
Wichtig ist dabei die Dosierung; zu viele Effekte nerven schnell, und `prefers-reduced-motion`
muss weiterhin respektiert werden.

---

## 4. Das Konzept: Code ist der Controller

Kernidee in einem Satz: **Jede Mission lässt den Code etwas Sichtbares oder Hörbares bewirken,
eingebettet in eine Welt mit Begleitfigur, und der Erfolgsmoment fühlt sich wie in einem Spiel an.**

### 4.1 Rahmen: Welt und Begleitfigur (Entscheidung offen, Empfehlung A)

**A – „Außenposten“ (Empfehlung).** Eine verlassene Forschungsstation auf einem fremden Planeten
ist im Ruhemodus. Zusammen mit einer kleinen Wartungsdrohne (neutrale Figur, kein Geschlecht,
kein Kindchenschema) erweckt man sie mit Python Stück für Stück wieder. **Fehler heißen
„Glitches“** und werden repariert, das passt zur bestehenden Fehlerkultur. Die vorhandenen
Lektionen lassen sich fast ohne inhaltliche Änderung einbetten, sie bekommen nur einen
ein- bis zweisätzigen Missions-Aufhänger:

| Kapitel | Bereich der Station | Beispiele aus dem bestehenden Kurs |
|---|---|---|
| 1 Erste Befehle | **Funkraum**: die Station spricht wieder | `print` = erste Funknachricht, `input` = die Station fragt zurück, Boss = Ausweis für die Station (Steckbrief) |
| 2 Entscheidungen & Schleifen | **Hangar**: Systeme und Rover steuern | `if` = Türsteuerung, `random` = Meteoritenschauer, Schleifen = Signalmuster und Beats, Boss = **Türcode knacken** (Zahlen-Raten) |
| 3 Sammlungen & Befehle | **Lager & Labor** | Listen = Inventar, `def` = eigene Drohnenbefehle, `dict` = Bauanleitungen, Boss = Sicherheitsabfrage der Bord-KI (Quiz) |
| 4 Alles zusammen | **Zentrale** | Spiel-Motor, Caesar = **fremde Signale entschlüsseln**, Daten = Sensorprotokolle, Debuggen = Systemreparatur, Finale = eigenes Modul für die Station |

**B – „Indie-Game-Studio“.** Man fängt in einem kleinen Studio an und baut über den Kurs ein
eigenes Spiel. Realistisch und für viele Jugendliche ein Traum, braucht aber mehrere menschliche
Figuren (mehr Text, mehr Übersetzung) und darf nicht in „Deadline“-Druck kippen.

**C – „Inselwelt“.** Gemütliche Erkundung, jede Insel ein Kapitel, Bewohner geben Aufgaben.
Sehr zugänglich, wirkt für 14+ aber schneller kindlich.

Die Begleitfigur reagiert auf den Zustand der App: wartet, denkt nach (Programm läuft), freut
sich (gelöst), staunt neugierig (Glitch, „Oh, interessant, schauen wir mal“), nie enttäuscht
oder tadelnd. Sie spricht die vorhandenen Rückmeldungen als Sprechblase. Umsetzung als inline
SVG mit CSS-Zuständen, ohne externe Bibliothek, offline.

### 4.2 Bausteine

**B1 · Spürbares Feedback („Juice“).** Erfolg mit kurzer Partikel-Animation vom Ausführen-Knopf,
XP zählen hoch und fliegen in die Leiste im Header, Level-up als eigener, kurzer großer Moment,
Abzeichen werden „aufgedeckt“. Klang per WebAudio synthetisiert (keine Dateien, winzig, offline):
heller Akkord bei Erfolg, freundliches „Glitch“-Geräusch bei Fehlern (kein Fail-Ton), mit
Schalter im Header. Auf Android kurze Vibration. `prefers-reduced-motion` schaltet Bewegung ab.

**B2 · Mission zuerst, Erklärung auf Abruf.** Lektionskopf zeigt Missions-Aufhänger, Aufgabe und
Start-Code oben; die Erklärung ist darunter (auf dem Handy aufklappbar „Wie geht das?“). Jedes
Codebeispiel in der Erklärung bekommt einen Knopf **„▶ Ausprobieren“**, der es direkt ausführt.
So passiert in den ersten Sekunden schon etwas.

**B3 · Sichtbare und hörbare Ergebnisse (Modul `pq`).** Ein kleines, kindgerechtes Python-Modul:
`pixel(x, y, farbe)` und `fuelle(farbe)` für ein 16×16-Pixelbild unter der Konsole, `ton("C4", 0.25)`
und `pause(0.25)` für Klänge, eventuell `zeichne_linie` als Turtle-light. Damit werden
„Beat wiederholen“ hörbar, „Muster malen“ und „Zeichnen mit Code“ echte Bilder, und der
Spielplatz bekommt ein Spielzeug. Die Prüfungen können die erzeugten Pixel und Töne auswerten
(`r.events`), sprachneutral wie bisher.

**B4 · Drohnen-Welt (intrinsische Integration, der große Hebel).** Eine Gitter-Welt im Stil von
Reeborg/Karel: `vor()`, `links()`, `rechts()`, `aufheben()`, `vor_frei()`, `ziel_erreicht()`.
Das Programm läuft, die Drohne fährt die Schritte animiert ab. Schleifen werden sichtbar
(„nicht 12× `vor()`, sondern eine Schleife“), Bedingungen werden nötig (Hindernisse),
Funktionen lohnen sich (`rechts()` selbst bauen aus drei `links()`), Listen werden Inventar.
Prüfung ist schlicht „Ziel erreicht?“, plus optionale Meisterschaftsziele („mit höchstens
6 Zeilen“, „alle Kristalle eingesammelt“). Sinnvoll als eigener Missionsstrang neben dem
Hauptkurs oder als Einstiegskapitel, nicht als Ersatz.

**B5 · Missionskarte.** Der Lernpfad in der Sidebar bleibt, zusätzlich gibt es eine Karte der
Station (SVG), auf der Bereiche „aufleuchten“, wenn ein Kapitel geschafft ist. Bosse werden als
Ereignis inszeniert (kurzer Story-Text vorher und nachher).

**B6 · Wahl statt Schiene.** Innerhalb eines Kapitels nach den ersten zwei Missionen freie
Reihenfolge; einzelne Missionen in zwei Themenvarianten mit demselben Lernziel (z. B. Fußball
oder Musik oder Kunst). Dazu **Nebenmissionen**: kurze Code-Rätsel, „Glitch-Jagd“
(fehlerhaften Code reparieren), „Code-Golf“ (kürzeste Lösung, nur gegen sich selbst).

**B7 · Neugier belohnen.** Geheime Entdecker-Abzeichen, im Abzeichen-Raster als „???“ sichtbar:
`import this` ausführen, ein Emoji ausgeben, die eigene erste Funktion im Spielplatz, einen
Fehler bewusst auslösen und reparieren, die Drohne gegen eine Wand fahren lassen, Easter Eggs
in der Welt. Das belohnt Ausprobieren, nicht Fleiß.

**B8 · Gestalten und Freischalten.** Durch Fortschritt (nicht Kauf, nicht Zufall) werden
Editor-Themes, Farben und Ausstattung der Drohne, Konsolen-Prompts und ein Stations-Emblem
freigeschaltet. Was es wofür gibt, ist vorher sichtbar („ab Level 3: Nachtschicht-Theme“).
Das bedient Selbstausdruck und Identität.

**B9 · Zeigen ohne Plattform.** Spielplatz-Projekte lassen sich als **Link** teilen: Der Code
steckt komprimiert im Link-Anker (`#p=…`), es gibt keinen Server, kein Konto, keinen Chat.
Wer den Link öffnet, sieht den Code im Spielplatz und kann ihn **remixen**. Er wird nie
automatisch ausgeführt, sondern erst nach Klick. Damit entsteht Eingebundenheit
(Freunde, Klasse, Eltern), ohne Kontakt- oder Kommentarfunktionen.

**B10 · Streak entschärfen.** Statt „🔥 0 STREAK“ ein **Wochenziel**, das man selbst wählt
(z. B. „an 3 Tagen pro Woche“): „📅 2/3 diese Woche“. Kein Reißen, kein Zurücksetzen auf null,
keine Erinnerungen. Die Abzeichen „Am Ball“ und „Wochen-Serie“ werden zu „Wochenziel geschafft“
(1× und 4×).

**B11 · Gesunde Pausen.** Nach etwa 45 Minuten am Stück, am Ende einer Mission, ein freundlicher
Hinweis der Drohne: „Starke Session! Dein Stand ist gespeichert. Pause?“ Kapitelenden als
Speicherpunkte inszenieren. Das kostet nichts und ist ein klares Signal an Eltern und Schulen.

**B12 · Seite „Für Eltern und Lehrkräfte“.** Kurz und klar: keine Werbung, keine Käufe, kein
Tracking, kein Chat, kein Streak-Druck, warum Fehler gewollt sind, was die Kinder lernen.

### 4.3 Was sich am Code ändert (Überblick)

| Baustein | Dateien | Inhalt in 6 Sprachen? |
|---|---|---|
| B1 Feedback, Klang | neu `src/js/sfx.js`, `src/js/juice.js`; `celebrate()` in `app.js`; `app.css` | wenige UI-Texte |
| Begleitfigur | neu `src/js/companion.js` (SVG + Zustände), Anbindung an `setConsoleStatus`/`showResult` | wenige UI-Texte |
| B2 Mission zuerst | `view-lesson.js`, `app.css` | nein (Story-Text kommt mit B5) |
| B3 `pq`-Modul | `src/py/pqrt.py` (Ereignisse im Ausgabestrom), neu `src/js/stage.js` (Canvas, WebAudio), `check-kit.js` (`r.events`), Lektionen s2-l4, s2-l5, s4-l3 | ja, 3 Lektionen |
| B4 Drohnen-Welt | neu `src/py/welt.py`, `src/js/world.js`, Lektionsschema `world: {karte, ziel}` | ja, neuer Missionsstrang |
| B5 Karte, Story | Kursschema `story`, `chapters[].region`, neu `src/js/view-map.js` | ja, 26 Kurztexte + Kapitel |
| B6 Wahl | `course.js` (`isUnlocked`), Kursdaten | teilweise |
| B7, B8, B10 | `badges.js`, `progress.js` (Übungstage statt Streak-Zähler, Migration v2 → v3), `view-progress.js`, `design.css` | UI-Texte |
| B9 Teilen | neu `src/js/share.js` (`CompressionStream`), Spielplatz in `app.js` | wenige UI-Texte |
| B11, B12 | `app.js`, neue Seite `eltern.html` | ja |

Jede neue Oberfläche braucht wegen `npm run i18n:check` alle 6 Sprachen. Das ist der größte
Aufwandstreiber und spricht dafür, Texte knapp zu halten.

---

## 5. Reihenfolge in kleinen Paketen

| Paket | Inhalt | Aufwand | Wirkung |
|---|---|---|---|
| **1 · Spürbar** | B1 Feedback und Klang, Begleitfigur (Grundzustände), B10 Wochenziel statt Streak, B7 Entdecker-Abzeichen, B2 „▶ Ausprobieren“ an Beispielen, B11 Pausen-Hinweis | klein bis mittel | sofort spürbar, unabhängig von der Rahmengeschichte (außer dem Aussehen der Figur) |
| **2 · Sichtbar** | B3 `pq`-Modul (Pixel, Töne) und Umbau der drei passenden Lektionen, B9 Teilen per Link, B8 erste Freischaltungen (Editor-Themes) | mittel | Code bewirkt etwas, Projekte lassen sich zeigen |
| **3 · Welt** | B5 Rahmengeschichte, Missions-Aufhänger für alle 26 Lektionen, Karte, Boss-Inszenierung, B2 Lektionsansicht „Mission zuerst“, B12 Elternseite | mittel bis groß (Texte × 6) | aus Lektionen werden Missionen |
| **4 · Spielwelt** | B4 Drohnen-Welt als eigener Missionsstrang, B6 Wahl und Nebenmissionen | groß | der eigentliche Schritt zur Spielend-lernen-App |

Jedes Paket ist für sich lauffähig, wird mit Tests abgesichert (`npm test`, Browser-Test
erweitern) und einzeln committet.

---

## 6. Wie wir merken, ob es wirkt (ohne Tracking)

- **Beobachten statt messen:** drei bis vier Jugendliche der Zielgruppe (Mädchen und Jungen) je Paket
  20 Minuten spielen lassen, laut denken lassen, nicht helfen. Danach drei Fragen: Was war
  am besten? Wo war es langweilig? Würdest du morgen weitermachen?
- **Freiwillige Rückkehr:** Wird PyQuest ohne Aufforderung wieder geöffnet? (Nur im Gespräch
  erfragen, nichts erheben.)
- **Kurzfragebogen** zu Autonomie, Kompetenz, Eingebundenheit (angelehnt an den PENS von Ryan,
  Rigby & Przybylski) vor und nach Paket 3.
- **Gegenprobe:** Wird der Pausen-Hinweis akzeptiert? Entsteht Druck irgendwo, wo keiner sein soll?

---

## 7. Offene Entscheidungen

1. **Rahmen:** Außenposten (Empfehlung), Game-Studio oder Inselwelt?
2. **Klang:** standardmäßig an (leise, mit Schalter) oder aus?
3. **Freiheit:** Bleibt der Hauptkurs linear und Wahl gibt es nur in Nebenmissionen, oder freie
   Reihenfolge innerhalb eines Kapitels?
4. **Drohnen-Welt:** als Einstiegskapitel vor Kapitel 1 oder als paralleler Missionsstrang?

---

## 8. Umsetzung (Oktober 2026)

| Baustein | Umgesetzt als |
|---|---|
| B1 Feedback | `sfx.js` (WebAudio, Schalter), `juice.js` (Funken, fliegende XP, Level-Moment), Vibration auf Android |
| Begleitfigur | `companion.js`: Lumo mit acht Stimmungen, im Konsolenkopf, auf allen Karten, in den Aufhängern |
| B2 | „▶ Ausprobieren“ an allen Codebeispielen; Aufhänger mit „Zur Aufgabe ↓“ statt Umbau der Reihenfolge |
| B3 | Modul `station` (Pixel, Töne, Solfège, Farbnamen in 6 Sprachen); „Beat wiederholen“ hörbar, „Zeichnen mit Code“ als Pixelbild. „Muster malen“ bleibt Text, weil es Text-Multiplikation lehrt |
| B4 | Modul `drone` mit 9 Außeneinsätzen (Labyrinth-Boss, versteckte Testwelten), Animation mit Vorspulen |
| B5 | Rahmengeschichte, 26 Aufhänger, Stationskarte, „Bereich wieder online“ |
| B6 | Nebenstränge mit `requires`; dazu 5 Rätsel „Glitch-Jagd“; Meisterschaftsziele über Bonus-Aufgaben (z. B. „höchstens 3 Zeilen“) |
| B7 | 11 geheime Entdeckungen mit Rätseln (`discoveries.js`) |
| B8 | Werkstatt: 5 Editor-Farben, 6 Lichtfarben für Lumo, Freischaltung über Level |
| B9 | Teilen per Link (`share.js`, deflate im Link-Anker), Öffnen nur im Spielplatz, nie automatisch ausführen |
| B10 | Wochenziel (2/3/4/5/7 Tage), alte Streak-Abzeichen werden übernommen |
| B11, B12 | Pausen-Hinweis nach 45 Minuten; `eltern.html` in 6 Sprachen |

Offen für später: echte Nutzertests (Abschnitt 6), Muttersprachler-Durchsicht der fünf
Übersetzungen, weitere Welten für die Außeneinsätze.

## Quellen

- Habgood, M. P. J. & Ainsworth, S. E. (2011). Motivating children to learn effectively: exploring the value of intrinsic integration in educational games. *Journal of the Learning Sciences*, 20(2), 169–206. [SHURA](https://shura.shu.ac.uk/3556/) · Folgestudie Cutting & Iacovides (2022): [White Rose](https://eprints.whiterose.ac.uk/189921)
- Sailer, M. & Homner, L. (2020). The gamification of learning: a meta-analysis. *Educational Psychology Review*, 32, 77–112. [Springer](https://link.springer.com/article/10.1007/s10648-019-09498-w) · [Volltext Uni Augsburg](https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/109056)
- Silverman, J. & Barasch, A. (2023). On or Off Track: How (Broken) Streaks Affect Consumer Decisions. *Journal of Consumer Research*, 49(6), 1095–1117. [CU Boulder](https://www.colorado.edu/business/faculty-research/2023/04/19/or-track-how-broken-streaks-affect-consumer-decisions)
- Europäische Kommission (14.07.2025). Leitlinien zum Schutz Minderjähriger nach Art. 28 DSA. [digital-strategy.ec.europa.eu](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors) · [Amtsblatt](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:C_202505519)
- § 10b JuSchG, Entwicklungsbeeinträchtigende Medien. [gesetze-im-internet.de](https://www.gesetze-im-internet.de/juschg/__10b.html)
- jugendschutz.net, Dark-Patterns-Report (Bericht in der [Berliner Zeitung](https://www.berliner-zeitung.de/article/259975)) · klicksafe: [Manipulieren Mobile Games unsere Kinder?](https://www.klicksafe.de/en/materialien/folge-5-manipulieren-mobile-games-unsere-kinder)
- Nicholson, S. (2015). A RECIPE for Meaningful Gamification. Zusammenfassung: [SUNY Online Teaching](https://online.suny.edu/onlineteaching/?p=3049)
- Resnick, M. (2017). *Lifelong Kindergarten*. [MIT Media Lab](https://www.media.mit.edu/articles/lifelong-kindergarten-how-to-learn-like-a-kid-by-the-co-creator-of-scratch/)
- Ryan, R. M., Rigby, C. S. & Przybylski, A. (2006). The Motivational Pull of Video Games: A Self-Determination Theory Approach. *Motivation and Emotion*, 30, 344–360.
- Deci, E. L., Koestner, R. & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin*, 125(6), 627–668.
- Ranglisten und Negativeffekte: Systematic Mapping „The dark side of gamification“ ([Springer Professional](https://www.springerprofessional.de/en/the-dark-side-of-gamification-an-overview-of-negative-effects-of/16000882)) · Age-aware Gamification ([arXiv 2512.15630](https://arxiv.org/pdf/2512.15630))
- JIM-Studie 2025 (mpfs): [Pressemitteilung](https://mpfs.de/app/uploads/2025/11/PM_JIM-2025.pdf) · Spielhäufigkeit über [Statista](https://de.statista.com/statistik/daten/studie/1251776/umfrage/beliebteste-games-bei-jugendlichen)
- The Farmer Was Replaced: [80.lv](https://80.lv/articles/this-game-teaches-you-to-code-by-automating-a-farm) · Codédex: [CSforALL](https://csforall.org/members/codedex/curriculum/the_legend_of_python) · Streak-Design: [Smashing Magazine](https://shop.smashingmagazine.com/2026/02/designing-streak-system-ux-psychology/)
