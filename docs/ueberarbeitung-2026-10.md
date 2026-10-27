# Überarbeitung Oktober 2026 – was sich geändert hat

Ausgangslage: Die App lief, hatte aber viele Inkonsistenzen und Fehler, besonders im Editor und
bei der Ausführung von Python. Diese Übersicht fasst die Überarbeitung zusammen. Die Änderungen
sind (noch) nicht committet; `git diff` zeigt alles im Detail.

## Belegte Fehler vorher (im Browser nachgestellt)

| Bereich | Fehler |
|---|---|
| Ausführung | `print("abc", end="")` erschien erst beim **nächsten** Lauf |
| Ausführung | Variablen blieben zwischen Läufen erhalten (gelöschter Code „funktionierte“ weiter) |
| Ausführung | 20.000 Ausgabezeilen dauerten **331 s**; eine Endlosschleife mit `print` fror die Seite ein, Stop war nicht klickbar |
| Ausführung | `exit()` wurde als Fehler angezeigt; Fehlertyp „Fehler“ fest auf Deutsch |
| Ausführung | Stop während `input()` lud Python komplett neu; ohne Cross-Origin-Isolation hing die App beim Start |
| Editor | **Tab mit markiertem Code löschte den Code**; Rücktaste entfernte nur ein Leerzeichen der Einrückung |
| Editor | Code wurde nur beim Ausführen gespeichert (Lektionswechsel = Arbeit weg); Zurücksetzen ohne Rückfrage |
| Prüfung | 8 Lektionen bestanden mit **unverändertem Start-Code**; `input()`-Fragen zählten als Ausgabe; Programme mit Fehler konnten als gelöst gelten; Kommentare mit „if“ erfüllten „benutze if“ |
| Inhalt | Debug-Lektion sprach von 3 Fehlern, der Code hatte 2; Caesar-Aufgabe hätte mit der Musterlösung nie geklappt (B − 3 = „?“) |
| Fortschritt | Streak zählte das Öffnen der App, nach UTC statt Ortszeit; XP passten nach Sync nicht zu den erledigten Lektionen; Start immer bei Lektion 1 |
| Funktionen | README versprach Abzeichen – es gab keine; Expertenlösungen existierten, wurden aber nie gezeigt oder geprüft |
| Oberfläche | Installieren-Knopf immer sichtbar (ohne Funktion); helles Design mit unlesbaren Akzenttexten |
| Konto | „Konto gelöscht“ wurde gemeldet, obwohl die nötige Datenbankfunktion fehlte; nach dem Abmelden blieb der Fortschritt für die nächste Person auf dem Gerät |
| Offline | Jedes App-Update löschte den Python-Cache (14 MB) – offline danach unbenutzbar |

## Was jetzt anders ist

**Python-Ausführung (neu gebaut):** `src/py/pqrt.py` führt jedes Programm in frischem Namensraum
aus, reicht Ausgabe gebündelt weiter (≤ 30 Nachrichten/s), stoppt Endlosschleifen per Ausgabe-
und Zeitgrenze, behandelt `exit()` normal und beschreibt Fehler strukturiert inklusive Pythons
„Did you mean …?“. Stop wirkt sofort, auch während `input()` und `time.sleep()`; reagiert ein
Programm gar nicht, startet Python nach 2,5 s automatisch neu. Abstürze werden erkannt.
Messung: 20.000 Zeilen in < 0,2 s statt 331 s.

**Fehlermeldungen:** Gut 40 typische Anfängerfehler werden konkret erklärt (fehlender Doppelpunkt,
offene Klammer, typografische Anführungszeichen, Text + Zahl, `int("abc")`, vergessenes
`import` …), die Zeile wird im Editor markiert und ist anklickbar.

**Editor:** Tab/Shift+Tab rücken ein und aus (auch Markierungen), Rücktaste löscht ganze
Einrückungsstufen, Strg+/ kommentiert, Strg+S speichert (statt Browser-Dialog), Esc verlässt
den Editor, Handy-Anführungszeichen werden außerhalb von Texten zu geraden, Autosave, kein
iOS-Zoom beim Antippen.

**Prüfungen und Kurs:** Alle 26 Lektionen überarbeitet. Prüfungen sind sprachneutral (Code-
Struktur per AST, Ausgabe ohne Eingabe-Prompts, versteckte Testläufe mit festen Eingaben, festem
Zufall oder Funktionsaufrufen) und geben **konkrete Rückmeldung**. Jede Lektion hat eine prüfbare
Bonus-Aufgabe mit Lösung und Bonus-XP. Die Lösung lässt sich erst nach einem eigenen Versuch laden.

**Ablauf und Motivation:** Lektion ist sofort lesbar (Python lädt im Hintergrund), nach Erfolg
„Weiter: …“-Knopf, Fortsetzen bei der letzten Lektion, gestaffelte Tipps, Spielplatz,
15 Abzeichen (inkl. „Fehler-Freund“ für die erste Fehlermeldung), Level-up, Fortschrittsdialog.

**Tests:** `npm test` – Unit-Tests (u. a. jede Fehlererklärung gegen echte Python-Fehler),
Inhaltstests mit **richtigen und falschen Lösungen** je Lektion in allen 6 Sprachen,
Übersetzungs- und Offline-Prüfung. `npm run test:browser` – Browser-Test (Editor, Ausführung,
Stop, `input()`, Fortschritt, Sprachen, Mobil).

**Offline/Hosting:** Python-Cache überlebt Updates, Cache-Version per Hash
(`node tools/sw-version.mjs`), Service Worker ergänzt COOP/COEP bei Bedarf, `.htaccess` mit
Kompression und sicherer Auslieferung von `pqrt.py` als Text.

## Unabhängige Code-Prüfung (nach dem Neubau)

Ein zweiter, nur lesender Prüfer hat den neuen Code durchgesehen und 9 Fehler gefunden, alle
behoben und mit Tests abgesichert: `except:` ohne Typ konnte die versteckte Prüfung aushebeln
(Prüfläufe schreiben ihn jetzt intern zu `except Exception` um), Stop während „prüft …“ zählte nicht
als Stop, Zurücksetzen/Import/Abmelden schrieben alten Editorinhalt in den neuen Stand, Restausgabe
eines gestoppten Programms erschien in der nächsten Lektion, zwei Prüfungen konnten bei
ungewöhnlichen Programmen abstürzen, `time.sleep()` zählte gegen das Zeitlimit, `sys.stdin`
umging die Prüfeingaben, die erste Ausgabe vor langer Rechnung blieb gepuffert (jetzt stößt die
Seite den Worker alle 150 ms per Signal an), und der Sync lud den Editor unnötig neu.

## Teststand am Ende der Überarbeitung

| Prüfung | Ergebnis |
|---|---|
| Unit-Tests (`npm run test:unit`) | 15/15, darunter 41 echte Python-Fehler → richtige Erklärung und ein Fuzz aller Prüfungen |
| Inhaltstests (`npm run test:content`) | 704/704 in DE, EN, FR, IT, TR, ES (Musterlösungen, Bonus-Lösungen, Start-Code, richtige und falsche Varianten) |
| Übersetzungen (`npm run i18n:check`) | vollständig in allen 6 Sprachen |
| Browser (`npm run test:browser`) | 43/43 (Desktop, Mobil, alle Sprachen) |
| Offline | Seite lädt ohne Netz neu, Python startet, Code läuft; Host ohne COOP/COEP funktioniert nach einem Reload |

## Vor dem Veröffentlichen prüfen

1. `node tools/sw-version.mjs` und `npm test`.
2. Nach dem Hochladen: `curl -sI https://…/src/py/pqrt.py` muss `200` und
   `text/plain` liefern (nicht ausgeführt werden). Ebenso `…/src/i18n/de.js` und
   `…/content/lib/check-kit.js` (neue Ordner).
3. Bestehende Fortschritte (Version 1) werden automatisch übernommen.
4. Für Supabase (falls aktiviert): `backend/supabase/migration.sql` erneut ausführen
   (neue Lösch-Richtlinie und `delete_own_account`).
