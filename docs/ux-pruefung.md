# UX/UI-Prüfung (17.10.2026)

Anlass: Die Oberfläche wirkte „zu sehr nach KI“. Geprüft wurden alle Ansichten als Screenshot
(Desktop 1440 px, Mobil 390 px, dunkles und helles Theme, Willkommen, Lektion, Fehler, Erfolg,
Karte, Fortschritt, Werkstatt, Tour, Level-up, Elternseite), gemessen an Nielsens Heuristiken,
WCAG 2.2 AA (Kontrast, Zielgrößen, Fokus) und gängigen Plattform-Konventionen.

## Befund: Was den generierten Eindruck erzeugt hat

| Merkmal | Wo | Warum es stört |
|---|---|---|
| Emojis als Icons | Kopfzeile, Seitenleiste, Tabs, Dialogtitel, Abzeichen, Fehlerkarten, Toasts (über 270 Stellen in sechs Sprachen) | Das stärkste Erkennungszeichen generierter Oberflächen; sieht auf jedem Gerät anders aus, wirkt bunt und unruhig |
| Verläufe und Leuchten | Ausführen-Knopf, XP-Balken (Amber→Teal), Erfolgskarte, Karte, Hintergrund mit Farbwolken, Elternseite | Typisches Vorlagen-Muster, lenkt vom Code ab |
| Karten in Karten, farbiger Randstreifen links | Aufgabe, Tipps, Ergebniskarten, Lumo-Box, Abzeichen, Statistik-Kacheln | „Bento“-Look, alles gleich gewichtet |
| Pillen und gesperrte Großbuchstaben | „LEKTION 9“, „KAPITEL 1 · FUNKRAUM“, „KONSOLE“, „WOCHE“, „Zeile 1“ | Modisch, schwer lesbar, keine Hierarchie |
| Space Grotesk + Inter | Überschriften, Knöpfe; Fließtext fiel auf die System-Schrift zurück | Die Standard-Kombination generierter Startseiten; auf Geräten ohne Inter sah die App anders aus |
| Zentrierte Dialoge mit Emoji-Titel und leuchtendem „Schließen“ | Willkommen, Karte, Werkstatt, Fortschritt | Zentrierter Fließtext ist schlecht lesbar; „Schließen“ als Hauptknopf zieht den Blick vom eigentlichen Ziel weg |

## Befund: Weitere UX-Punkte

- Der deaktivierte Stopp-Knopf sah aus wie ein roter Fleck (wirkte kaputt).
- „Ausprobieren“ lag als Pille über dem Code und brauchte reservierten Leerraum.
- Inline-Code mit Rahmen machte Textzeilen unruhig.
- Auf dem Handy stand in der Kopfzeile nur „4“ ohne Hinweis, dass es das Level ist.
- Große Dialoge ließen sich nur über einen Knopf ganz unten oder Escape schließen.
- Die Seitenleiste hatte pro Kapitel fünf Elemente (Punkt, Emoji, Großbuchstaben-Label, Zähler, Titel).

## Umsetzung

- Eigener Icon-Satz `src/js/icons.js` (69 Strich-Icons im Stil des Logos), Emojis aus allen
  Oberflächentexten entfernt; Kapitel-Abzeichen als Sechseck mit Nummer.
- Schrift: Atkinson Hyperlegible Next (Braille Institute, für Lesbarkeit gebaut, I/l/1 und 0/O
  klar unterscheidbar), lokal eingebunden, für alle Geräte gleich. Code bleibt JetBrains Mono.
- Farben: warmes Graphit statt Braun, Amber nur für Handlung und Position, Teal nur für Lumo und
  „geschafft“. Alle Textfarben erreichen mindestens 4,5:1 in beiden Themes.
- Keine Verläufe, kein Leuchten, kein Weichzeichner; kleine Radien; Linien statt Kästen.
- Dialoge linksbündig, Knöpfe rechts, „Schließen“ als Nebenknopf, Schließen-Kreuz bei großen Dialogen.
- „Ausprobieren“ als Leiste unter dem Codebeispiel; Aufgabe mit Zielscheibe als klarer Block.
- Seitenleiste: „Kapitel 2 · Hangar“ in normaler Schreibweise, erledigte Lektionen als ruhiger
  Haken, aktuelle Lektion als einziger gefüllter Punkt.
- Toasts mit Icon je Art (geschafft, Fehler, Abzeichen, gesperrt) statt Emoji im Text.
- Regeln für künftige Änderungen: `design-brief.md`, Abschnitt 7.

## Offen

- Test mit Jugendlichen: Wirkt die ruhigere Gestaltung noch „spielerisch genug“? Das zeigt nur
  ein Test (Vorschlag in `docs/spielend-lernen.md`, Abschnitt 6).
- Die Tour-Karte kann bei großen Zielen (Lektionsspalte) über dem Ziel liegen.
