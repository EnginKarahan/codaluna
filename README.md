# PyQuest 🐍

Eine mehrsprachige Lern-Webapp, mit der **Jugendliche ab 12 Jahren spielerisch Python lernen**
(und Erwachsene mitlernen). Echter Python-Code läuft direkt im Browser
([Pyodide](https://pyodide.org)), offline-fähig, ohne Anmeldung und ohne Tracking.

## Schnellstart (lokal)

Es wird **kein** Build-Step benötigt – nur Python 3 (und für die Tests Node.js).

```bash
python3 serve.py            # startet http://localhost:8000 (oder den nächsten freien Port)
```

`serve.py` setzt die nötigen **COOP/COEP-Header** (Cross-Origin-Isolation), damit `input()` und
der Stop-Knopf funktionieren (`SharedArrayBuffer`/`Atomics`). Ein Öffnen der `index.html` per
Doppelklick (`file://`) funktioniert **nicht**.

## Was die App kann

- **Spielend lernen auf Station Polaris**: Eine Forschungsstation auf einem Eismond schläft;
  Lumo, die Wartungsdrohne, weckt sie mit dir und echtem Python wieder auf. Jede Lektion ist eine
  Mission mit kurzem Aufhänger, Kapitel sind Bereiche der Station, die auf der **Stationskarte**
  wieder online gehen. Hintergrund und Begründung: [`docs/spielend-lernen.md`](docs/spielend-lernen.md).
- **Kurs „Season 1: Python-Starter“**: 4 Kapitel, 26 Lektionen (mit Kapitel-Bossen und Finale),
  jede mit Erklärung, Aufgabe, gestaffelten Tipps, Musterlösung und **Bonus-Aufgabe**.
- **Nebenmissionen**: 9 **Außeneinsätze**, in denen der Code Lumo über ein Eisfeld steuert
  (`from drone import *`, Schleifen, Sensoren, Labyrinth-Boss mit versteckten Testwelten), und
  5 Rätsel der **Glitch-Jagd** (kaputte Programme reparieren). Sie öffnen sich mit dem Hauptkurs.
- **Code bewirkt etwas Sichtbares**: Modul `station` mit 16×16-Pixelbildschirm (`pixel`, `fill`)
  und Lautsprecher (`note`, `drum`); „▶ Ausprobieren“ an jedem Codebeispiel.
- **Automatische Prüfung mit konkreter Rückmeldung** („Es fehlt noch der andere Fall mit
  `else:`“ statt nur „falsch“) – sprachneutral über die Code-Struktur und versteckte Testläufe.
- **Verständliche Fehlermeldungen mit Korrekturvorschlag**: rund 60 typische Anfängerfehler
  (fehlender Doppelpunkt, offene Klammer, `\n` außerhalb von Text, `else if`, `x++`, `=>`,
  Leerzeichen im Namen, `wenn` statt `if`, Zahl aus `input()`, Text + Zahl, Tippfehler …) werden
  kindgerecht erklärt. Die genaue Stelle wird in Editor und Fehlerkarte markiert, darunter steht
  die korrigierte Zeile, die sich mit „Übernehmen“ einsetzen lässt (Strg+Z macht es rückgängig).
  Regeln: `src/js/fixes.js`, Meldungs-Muster: `src/js/errors.js`.
- **Robuste Ausführung**: Endlosschleifen werden gestoppt, ohne dass die Seite hängt; Stop wirkt
  sofort (auch während `input()`); große Ausgaben bremsen nichts aus.
- **Editor für Anfänger**: Tab/Shift+Tab rücken (auch Markierungen) ein und aus, Rücktaste löscht
  ganze Einrückungsstufen, Strg+/ kommentiert, Code wird automatisch gespeichert.
- **Fortschritt ohne Druck**: XP, Level, selbst gewähltes **Wochenziel** statt Streak (nichts reißt),
  Abzeichen plus **geheime Entdeckungen** mit Rätseln, **Werkstatt** (Editor-Farben, Lumos Licht;
  freigeschaltet über Level, nie gekauft). Keine Ranglisten, keine Käufe, keine Zufallsbelohnungen,
  keine Push-Nachrichten. Diplom am Kursende. Export/Import als Datei.
- **Spürbares Feedback**: Lumo reagiert auf Laufen, Erfolg und Fehler (Fehler heißen Glitches),
  Klänge per WebAudio (abschaltbar), Funken, Level-up-Moment, Pausen-Hinweis nach 45 Minuten;
  `prefers-reduced-motion` wird beachtet.
- **Teilen per Link**: Der Code steckt komprimiert im Link (`#p=…`), kein Server; geöffnete Links
  laufen nie automatisch. **Elternseite** `eltern.html` erklärt das Konzept.
- **Spielplatz** zum freien Ausprobieren, **6 Sprachen** (DE, EN, FR, IT, TR, ES), Hell/Dunkel,
  installierbar als PWA, komplett offline nutzbar.

## Architektur

- **Kein Framework, Vanilla ES-Module** – offline-robust und hackbar.
- **`src/py/pqrt.py`** – die Python-Laufzeit von PyQuest: führt Programme in frischem Namensraum
  aus, begrenzt Ausgabe und Zeit, beschreibt Fehler strukturiert, analysiert den Code (AST) und
  macht versteckte Prüfläufe mit vorgegebenen Eingaben. Sie stellt außerdem die Module `station`
  (Bildschirm, Lautsprecher) und `drone` (Gitterwelt mit Lumo) bereit; deren Ereignisse laufen
  über den Kanal „g“ zur Bühne. Dieselbe Datei nutzen Browser und Tests.
- **`src/js/py-worker.js`** – Pyodide im Web-Worker (die Oberfläche friert nie ein), bündelt
  die Ausgabe, `input()` über `Atomics`.
- **`src/js/runner.js`** – Steuerung vom Main-Thread: Lauf, Eingabe, Stop, Zeitlimit,
  Neustart nach Absturz, Notbetrieb ohne Cross-Origin-Isolation.
- **`src/js/app.js`** + `view-*.js`, `console.js`, `editor.js`, `errors.js`, `course.js`,
  `progress.js`, `badges.js` – Oberfläche, Ablauf und Fortschritt.
- Spielelemente: `companion.js` (Lumo), `stage.js` (Bildschirm, Töne, Eisfeld-Animation),
  `sfx.js` (Klänge), `juice.js` (Effekte), `discoveries.js` (geheime Abzeichen), `share.js`,
  `workshop.js`, `view-map.js` (Stationskarte).
- **`content/courses/*.js`** – Kurse als **Daten** (`season-1.js` Hauptkurs, `season-1-missions.js`
  Nebenmissionen); Prüfwerkzeuge in `content/lib/check-kit.js`.
- **`content/i18n/<kurs>.<sprache>.js`** – Übersetzungen der Lektionen,
  **`src/i18n/<sprache>.js`** – Texte der Oberfläche.
- **`src/js/telemetry.js`** – anonyme Statistik und Fehlerberichte an die eigene Webstatistik
  (siehe unten).
- **`sw.js`** – Service Worker (offline-first, Pyodide-Cache bleibt bei Updates erhalten,
  ergänzt COOP/COEP, falls der Server sie nicht setzt).
- **`vendor/`** – Pyodide 0.26.4 (Python 3.12), CodeMirror 5, Schriften – lokal, kein CDN.

## Eine Lektion hinzufügen

In `content/courses/season-1.js` einen Eintrag im `lessons`-Array ergänzen:

```js
{
  id: "s2-l7", title: "…",
  story: "Ein bis zwei Sätze von Lumo: Worum geht es auf der Station?",
  intro: `<p>…</p>`, taskHtml: "…",
  hints: ["…", "…"],
  starterCode: py`
    # Start-Code (muss die Prüfung noch NICHT bestehen)
  `,
  solution: py`
    print("…")
  `,
  xp: 30,
  tests: [{ inputs: ["15"] }, { inputs: ["8"] }],        // optional: versteckte Testläufe
  check: (r) => need(R.ifStmt(r), R.tests(r), [r.tests[0].out !== r.tests[1].out, "sameOutput"]),
  feedback: { sameOutput: "Bei 15 und bei 8 soll etwas anderes erscheinen." },
  expert: { xp: 10, html: "<p>…</p>", solution: py`…`, check: (r) => need(/* … */), feedback: {} },
}
```

- `r` enthält Ausgabe (`r.out`, `r.lines`, ohne `input()`-Prompts), Code-Struktur (`r.ast`,
  `r.call("print")`, `r.node("For")` …), die Ergebnisse der Testläufe (`r.tests`), den
  Stationsbildschirm (`r.screen`), gespielte Töne (`r.music`) und Lumo auf dem Eisfeld
  (`r.drone`). Details und fertige Regeln (`R.print`, `R.pixels`, `R.goal`, `R.worlds` …) stehen
  in `content/lib/check-kit.js`.
- Drohnen-Missionen bekommen ein Eisfeld (`world: {map: ["#####", "#D.G#", "#####"], dir: "E"}`)
  und für allgemeine Lösungen versteckte Testwelten (`tests: [{world: …}]`).
- Nebenmissionen stehen in `content/courses/season-1-missions.js` (Kapitel mit `strand`);
  `requires: "s2-l4"` öffnet eine Mission erst nach dieser Lektion des Hauptkurses.
- Testläufe können Eingaben vorgeben (`inputs`, `fill`), den Zufall festlegen (`seed`,
  `randint`) und Funktionen der Lernenden aufrufen (`probe: "call(fn(3), 2, 4, 6)"`).
- Für jede neue Lektion richtige **und** falsche Lösungen in `tests/cases/season-1.cases.mjs`
  ergänzen und die Übersetzungen in `content/i18n/season-1.<sprache>.js` nachziehen.

## Tests

```bash
npm test                                   # alles (oder einzeln:)
npm run test:unit                          # App-Logik und Fehlererklärungen (echte Python-Fehler)
node tests/content.test.mjs                # Lektionen mit echter Python-Laufzeit, alle Sprachen
node tests/content.test.mjs --lang=de --lesson=s2-l1 --verbose
node tools/check-i18n.mjs                  # Übersetzungen vollständig?
node tools/sw-version.mjs --check          # Service-Worker-Version und Offline-Dateiliste aktuell?
```

Die Inhaltstests prüfen je Lektion und Sprache: Musterlösung und Bonus-Lösung bestehen, der
Start-Code besteht **nicht**, weitere richtige Varianten bestehen, und typische falsche Lösungen
scheitern mit genau der erwarteten Rückmeldung.

Ein Browser-Test (Oberfläche, Editor, Ausführung, Stop, `input()`) liegt in `tests/e2e_browser.py`
(braucht `pip install playwright`, Aufruf siehe Dateikopf).

## Veröffentlichen (statischer Webspace)

1. `node tools/sw-version.mjs` (setzt die Cache-Version) und `npm test`.
2. Dateien hochladen, z. B. per `rsync` – ohne `.git`, `tests/`, `tools/`, `docs/`, `backend/`,
   `serve.py`, `node_modules`.
3. Der Server muss die Header aus `.htaccess` setzen (COOP/COEP) und `src/py/pqrt.py` als
   **Text** ausliefern (nicht ausführen). Kurzer Test:
   `curl -sI https://…/src/py/pqrt.py` → `200`, `Content-Type: text/plain`.
   Bei All-Inkl reicht `RemoveHandler` in der Haupt-`.htaccess` nicht (Fehler 500, die Datei
   wird als CGI behandelt); dafür sorgt `src/py/.htaccess` mit `SetHandler default-handler`.
4. Browser-Test gegen die Live-Seite: `python3 tests/e2e_browser.py --url https://…`.
5. Die Domain muss in der Webstatistik unter **Sites** angelegt sein, sonst verwirft sie
   Statistik und Fehlerberichte still.

Fehlen auf einem Host die Header (z. B. GitHub Pages), setzt sie der Service Worker; die Seite
lädt dann beim ersten Besuch einmal neu.

## Offline nutzen & installieren

- **📥 Für offline vorbereiten** (oben rechts): lädt einmal online alles inkl. Python in den
  Cache. Danach läuft die App komplett offline. Python bleibt auch bei App-Updates gespeichert.
- **Installieren** (⤓): erscheint, wenn der Browser die Installation anbietet.
- Voraussetzung: **HTTPS** (oder `localhost`).

## Mehrsprachigkeit

Sprache oben rechts über 🌐 umschaltbar (DE, EN, FR, IT, TR, ES), Auswahl wird gespeichert.
Fehlt ein Text, greift Englisch, dann Deutsch. Code-Beispiele nutzen Variablennamen in der
jeweiligen Sprache; die Prüfungen sind sprachneutral und gelten für alle Sprachen gleich.

## Statistik und Fehlerberichte

`STATS_URL` und `STATS_DOMAIN` in `app-config.js` verbinden PyQuest mit der eigenen
Webstatistik (Projekt `webstatistik`, live unter stats.ethos-polis.info). Gesendet wird nur, wenn
die App unter `STATS_DOMAIN` läuft, also nie lokal, nicht bei Do-Not-Track/Global Privacy Control
und nicht aus automatisierten Browsern (der Browser-Test prüft das).

- **Statistik** (`/collect.php`): Seitenaufruf, `Lesson Done` und `Bonus Done` mit Lektion und
  Sprache. Zu sehen im Dashboard unter „Events & Ziele“.
- **Fehlerberichte** (`/report.php`): jede Fehlermeldung, die PyQuest zeigt, mit Lektion, Sprache,
  App-Version und Code. Arten: `python` (Fehler im Programm, mit angezeigter Hilfe als Schlüssel,
  z. B. `errx.needQuotes`, und ob es einen Korrekturvorschlag gab), `run` (Zeitlimit,
  Ausgabegrenze, Absturz), `check` (nicht bestandene Prüfung mit Rückmeldungs-Schlüssel) und
  `app` (JavaScript-Fehler, Fehler-Hinweise, Python startet nicht). Zu sehen im Dashboard unter
  **Fehler**, gleiche Fehler zusammengefasst, mit Status Offen/Erledigt/Ignoriert.

Gruppen mit der Hilfe `err.<Typ>.hint` sind Fehler, für die es noch keine eigene Regel in
`src/js/fixes.js` gibt: dort lohnt sich eine neue Regel am meisten.

## Konten (optional)

Ohne Konfiguration läuft PyQuest im **Gast-Modus** (alles lokal im Browser). Login und
Cloud-Sync über Supabase: siehe [`SETUP.md`](SETUP.md).

## Lizenz

- **Code**: MIT, siehe `LICENSE`.
- **Kursinhalte und Konzepttexte** (`content/courses/`, `content/i18n/`, `docs/`): CC BY-NC-SA 4.0,
  siehe `LICENSE-CONTENT.md`.
- **Fremdkomponenten** in `vendor/` (Pyodide, CodeMirror, supabase-js, Schriften): eigene Lizenzen,
  siehe `THIRD-PARTY-NOTICES.md`.

Schlüssel und andere Secrets gehören **niemals** ins Repository, sondern ausschließlich in `.env`
bzw. Server-Umgebungsvariablen.
