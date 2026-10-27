// Codaluna – Testfälle für "Season 1": richtige UND falsche Lösungen je Lektion.
//
// Je Lektion:
//   inputs       Eingaben für den sichtbaren Lauf (was eine Lernende eintippen würde)
//   right[]      weitere richtige Lösungen (Musterlösung und Übersetzungen prüft der Runner selbst)
//   wrong[]      {code, expect}  expect = erwartete Rückmeldung (Feedback-Schlüssel),
//                "error:<Typ>" für Python-Fehler, "limit"/"timeout" für Endlosschleifen
//   expertInputs, expertRight[], expertWrong[]   dasselbe für die Bonus-Aufgabe
//
// Die falschen Lösungen bilden typische Anfängerfehler ab. Code als py`…` (Einrückung wird entfernt).

import { py } from "../../content/lib/check-kit.js";

const quizHead = py`
  punkte = 0

  antwort = input("Wie viele Beine hat eine Spinne? ")
  if antwort == "8":
      punkte = punkte + 1
      print("Richtig! 🕷️")
  else:
      print("Knapp daneben – es sind 8.")
`;

export default {
  "s1-l1": {
    right: ['print("Ich mag Pizza")\n', 'print("Hallo Codaluna!")\nprint("Zweite Zeile")\n', "print('Einfache Anführungszeichen gehen auch')\n"],
    wrong: [
      { code: 'print("Hallo Welt!")\n', expect: "fb.unchanged" },
      { code: 'print("Hallo Welt!")  # nur ein Kommentar dazu\n', expect: "fb.unchanged" },
      { code: "# Hier steht nur ein Kommentar\n", expect: "fb.needPrint" },
      { code: "print()\n", expect: "fb.noOutput" },
      { code: "print(Hallo)\n", expect: "error:NameError" },
      { code: 'print("Hallo)\n', expect: "error:SyntaxError" },
      { code: 'Print("Hallo")\n', expect: "error:NameError" },
      { code: "print “Hallo“\n", expect: "error:SyntaxError" },
    ],
    expertRight: ['print("Eins", "Zwei", "\\nDrei")\n'],
    expertWrong: [
      { code: 'print("Hallo")\nprint("Welt")\n', expect: "printComma" },
      { code: 'print("Hallo", "Welt")\n', expect: "newline" },
    ],
  },

  "s1-l2": {
    right: ["lieblingszahl = 7\nprint(lieblingszahl)\n", "zahl = 13\nprint(zahl)\n", "lieblingszahl = 3.14\nprint(lieblingszahl)\n"],
    wrong: [
      { code: "lieblingszahl = 0\n# Setz deine Lieblingszahl ein und gib sie aus\n", expect: "fb.needPrint" },
      { code: 'lieblingszahl = 42\nprint("lieblingszahl")\n', expect: "printName" },
      { code: "lieblingszahl = 42\nprint(42)\n", expect: "printName" },
      { code: 'lieblingszahl = "sieben"\nprint(lieblingszahl)\n', expect: "needNumber" },
      { code: "print(lieblingszahl)\nlieblingszahl = 42\n", expect: "error:NameError" },
    ],
    expertRight: ["punkte = 100\npunkte += 50\nprint(punkte)\n"],
    expertWrong: [
      { code: "punkte = 150\nprint(punkte)\n", expect: "selfUpdate" },
      { code: "punkte = 100\npunkte = punkte + 5\nprint(punkte)\n", expect: "result150" },
    ],
  },

  "s1-l3": {
    right: [
      'pro_woche = 5\nwochen = 8\ngespart = pro_woche * wochen\nprint("Gespart:", gespart, "Euro")\n',
      'pro_woche = 5\nwochen = 8\nprint(f"{pro_woche * wochen} €")\n',
    ],
    wrong: [
      { code: "pro_woche = 5\nwochen = 8\n# Berechne die Ersparnis und gib sie aus\n", expect: "fb.needPrint" },
      { code: "pro_woche = 5\nwochen = 8\nprint(40)\n", expect: "needMult" },
      { code: "pro_woche = 5\nwochen = 8\nprint(5 * 8)\n", expect: "useVars" },
      { code: "pro_woche = 5\nwochen = 8\nprint(pro_woche + wochen)\n", expect: "needMult" },
      { code: 'pro_woche = 5\nwochen = 8\nprint("pro_woche * wochen")\n', expect: "needMult" },
      { code: "pro_woche = 5\nwochen = 9\nprint(pro_woche * wochen)\n", expect: "result40" },
    ],
    expertRight: ["ziel = 100\npro_woche = 5\nwochen = ziel // pro_woche\nprint(wochen)\n"],
    expertWrong: [
      { code: "print(100 / 5)\n", expect: "floorDiv" },
      { code: "ziel = 120\npro_woche = 5\nprint(ziel // pro_woche)\n", expect: "result20" },
    ],
  },

  "s1-l4": {
    right: [
      'tier = "Hund"\nort = "Paris"\nprint(f"Der {tier} fliegt nach {ort}.")\n',
      'tier = "Katze"\nort = "Mond"\nsatz = f"{tier} auf dem {ort}"\nprint(satz)\n',
    ],
    wrong: [
      { code: 'tier = "Katze"\nort = "Mond"\n# Baue mit einem f-String einen lustigen Satz\n', expect: "fb.needPrint" },
      { code: 'tier = "Katze"\nort = "Mond"\nprint("Eine {tier} tanzt auf dem {ort}")\n', expect: "fb.needFString" },
      { code: 'tier = "Katze"\nort = "Mond"\nprint(f"Eine Katze tanzt auf dem Mond")\n', expect: "twoFields" },
      { code: 'tier = "Katze"\nort = "Mond"\nprint(f"Eine {tier} tanzt")\n', expect: "twoFields" },
      { code: 'tier = "Katze"\nort = "Mond"\nprint("Eine " + tier + " auf dem " + ort)\n', expect: "fb.needFString" },
      { code: 'tier = "Katze"\nort = "Mond"\nprint(f"Eine {Tier} auf dem {ort}")\n', expect: "error:NameError" },
    ],
    expertRight: ['siege = 5\nprint(f"{siege} Siege = {siege * 3} Punkte")\n'],
    expertWrong: [{ code: 'siege = 5\npunkte = siege * 3\nprint(f"{punkte} Punkte")\n', expect: "calcInBraces" }],
  },

  "s1-l5": {
    inputs: ["Mia", "Berlin"],
    right: ['name = input("Name? ")\nprint(f"Hi {name}!")\n', 'name = input("Wie heißt du? ")\nprint("Hallo", name)\n'],
    wrong: [
      { code: 'name = input("Wie heißt du? ")\n# Begrüße die Person persönlich\n', expect: "fb.needPrint" },
      { code: 'name = input("Wie heißt du? ")\nprint("Hallo name")\n', expect: "nameInGreeting" },
      { code: 'name = input("Wie heißt du? ")\nprint("Hallo")\n', expect: "nameInGreeting" },
      { code: 'print("Hallo Mia")\n', expect: "fb.needInput" },
      { code: 'name = input("Wie heißt du? ")\nprint("Hallo" + Name)\n', expect: "error:NameError" },
    ],
    expertRight: ['ort = input("Ort? ")\nwer = input("Wer? ")\nprint(f"{wer} wohnt in {ort}.")\n'],
    expertWrong: [
      { code: 'name = input("Name: ")\nprint(f"{name}!")\n', expect: "fb.needInputs" },
      { code: 'a = input("Name: ")\nb = input("Ort: ")\nprint("Hallo " + a + " aus " + b)\n', expect: "fb.needFString" },
    ],
  },

  "s1-boss1": {
    inputs: ["Ada", "Schach", "Igel", "Blau"],
    right: [
      'a = input("Name: ")\nb = input("Hobby: ")\nc = input("Tier: ")\nprint(f"{a} mag {b} und {c}.")\n',
      py`
        name = input("Name: ")
        hobby = input("Hobby: ")
        farbe = input("Lieblingsfarbe: ")
        tier = input("Lieblingstier: ")
        print(f"🪪 {name} | {hobby} | {farbe} | {tier}")
      `,
    ],
    wrong: [
      {
        code: 'name = input("Name: ")\nhobby = input("Lieblingshobby: ")\n# Frag noch etwas ab und gib einen Steckbrief mit f-Strings aus\n',
        expect: "fb.needInputs",
      },
      { code: 'a = input("Name: ")\nb = input("Hobby: ")\nc = input("Tier: ")\nprint("Name:", a, b, c)\n', expect: "fb.needFString" },
      { code: 'a = input("Name: ")\nb = input("Hobby: ")\nc = input("Tier: ")\nprint(f"Name: {a}, Hobby: {b}")\n', expect: "allAnswers" },
    ],
    expertWrong: [
      {
        code: 'a = input("Name: ")\nb = input("Hobby: ")\nc = input("Tier: ")\nprint(f"{a} {b} {c}")\n',
        expect: "frame",
      },
    ],
  },

  "s2-l1": {
    inputs: ["120"],
    right: [
      py`
        punkte = int(input("Wie viele Punkte hast du? "))
        if punkte >= 100:
            print("Level geschafft! 🎉")
        else:
            print("Dir fehlen noch", 100 - punkte, "Punkte.")
      `,
    ],
    wrong: [
      {
        code: 'punkte = int(input("Wie viele Punkte hast du? "))\nif punkte >= 100:\n    print("Level geschafft! 🎉")\n# Ergänze hier den else-Fall\n',
        expect: "fb.needElse",
      },
      {
        code: py`
          punkte = int(input("Punkte? "))
          if punkte >= 100:
              print("Geschafft")
          if punkte < 100:
              print("Weiter üben")
        `,
        expect: "fb.needElse",
      },
      {
        code: py`
          punkte = int(input("Punkte? "))
          if punkte >= 100:
              print("Geschafft")
          else:
              print("Geschafft")
        `,
        expect: "sameOutput",
      },
      {
        code: py`
          punkte = int(input("Punkte? "))
          if punkte > 100:
              print("Geschafft")
          else:
              print("Weiter üben")
        `,
        expect: "boundary",
      },
      {
        code: 'punkte = int(input("Punkte? "))\nif punkte >= 100:\n    print("Geschafft")\nelse\n    print("Weiter")\n',
        expect: "error:SyntaxError",
      },
      {
        code: 'punkte = int(input("Punkte? "))\nif punkte >= 100:\n    print("Geschafft")\nelse:\nprint("Weiter")\n',
        expect: "error:IndentationError",
      },
      {
        code: 'punkte = input("Punkte? ")\nif punkte >= 100:\n    print("Geschafft")\nelse:\n    print("Weiter")\n',
        expect: "error:TypeError",
      },
    ],
    expertRight: [
      py`
        p = int(input("Punkte: "))
        if p < 50:
            print("Weiter üben")
        elif p < 100:
            print("Fast geschafft")
        else:
            print("Level geschafft")
      `,
    ],
    expertWrong: [
      {
        code: 'p = int(input("Punkte: "))\nif p >= 100:\n    print("Level geschafft")\nelse:\n    print("Weiter üben")\n',
        expect: "fb.needElif",
      },
      {
        code: py`
          p = int(input("Punkte: "))
          if p >= 100:
              print("Level geschafft")
          elif p >= 50:
              print("Weiter üben")
          else:
              print("Weiter üben")
        `,
        expect: "threeCases",
      },
    ],
  },

  "s2-l2": {
    right: ["print(3 < 1)\nprint(2 != 3)\nprint(4 >= 4)\n", 'a = 5\nprint(a > 2, a < 2)\nprint(a == 5)\n'],
    wrong: [
      { code: "# Lass Python mindestens drei Vergleiche prüfen\nprint(10 > 3)\n", expect: "threeCompares" },
      { code: "print(True)\nprint(False)\nprint(True)\n", expect: "threeCompares" },
      { code: "print(1 < 2)\nprint(2 < 3)\nprint(3 < 4)\n", expect: "needFalse" },
      { code: "a = 1 < 2\nb = 2 > 3\nc = 5 == 5\nprint(a)\n", expect: "printResults" },
      { code: "print(5 = 5)\n", expect: "error:SyntaxError" },
    ],
    expertRight: ["alter = 20\nprint(alter > 10 and alter < 15)\n"],
    expertWrong: [{ code: "alter = 12\nprint(alter >= 10)\nprint(alter <= 15)\n", expect: "useAnd" }],
  },

  "s2-l3": {
    right: ["import random\nprint(random.randint(1, 6))\n", 'import random\nwurf = random.randint(1, 6)\nprint(f"Gewürfelt: {wurf}")\n'],
    wrong: [
      { code: "import random\n# Würfle eine Zahl von 1 bis 6 und gib sie aus\n", expect: "useRandint" },
      { code: "import random\nprint(4)\n", expect: "useRandint" },
      { code: "import random\nprint(random.randint(1, 20))\n", expect: "range16" },
      { code: 'import random\nzahl = random.randint(1, 6)\nprint("zahl")\n', expect: "range16" },
      { code: "import random\nzahl = random.randint(1, 6)\nprint(3)\n", expect: "notRandom" },
      { code: "zahl = random.randint(1, 6)\nprint(zahl)\n", expect: "error:NameError" },
    ],
    expertRight: ['import random\nrad = ["🍦", "⭐", "🎧", "📚"]\nprint(random.choice(rad))\n'],
    expertWrong: [
      { code: 'import random\nprint(random.choice(["A", "B"]))\n', expect: "fourPrizes" },
      { code: 'import random\npreise = ["A", "B", "C", "D"]\nprint(preise[0])\n', expect: "useChoice" },
    ],
  },

  "s2-l4": {
    right: [
      'for i in range(3):\n    print("🎵")\n',
      'for runde in range(5):\n    print("x-o-x")\nprint("Ende")\n',
      'from station import drum\nfor i in range(4):\n    drum("kick")\n',
      'import station\nfor ton in range(3):\n    station.note("do4")\n    station.note("mi4", 0.5)\n',
    ],
    wrong: [
      { code: 'from station import drum, note\n\n# Bau deinen Beat mit einer for-Schleife\ndrum("kick")\n', expect: "fb.needFor" },
      { code: 'print("Bum")\nprint("Bum")\nprint("Bum")\n', expect: "fb.needFor" },
      { code: 'from station import drum\ndrum("kick")\ndrum("kick")\ndrum("kick")\n', expect: "fb.needFor" },
      { code: 'for i in range(4):\n    pass\nprint("Bum")\n', expect: "printInLoop" },
      { code: 'from station import drum\nfor i in range(4):\n    pass\ndrum("kick")\n', expect: "printInLoop" },
      { code: 'for i in range(2):\n    print("Bum")\n', expect: "threeTimes" },
      { code: 'from station import drum\nfor i in range(2):\n    drum("kick")\n', expect: "threeTimes" },
      { code: 'from station import drum\nfor i in range(4):\n    drum("klavier")\n', expect: "error:StationError" },
      { code: 'for i in range(4)\n    print("Bum")\n', expect: "error:SyntaxError" },
      { code: 'for i in range(4):\nprint("Bum")\n', expect: "error:IndentationError" },
    ],
    expertRight: ['for i in range(5):\n    print("Runde", i + 1)\n'],
    expertWrong: [{ code: 'for i in range(5):\n    print("Runde", i)\n', expect: "numbered" }],
  },

  "s2-l5": {
    right: ['for i in range(1, 8):\n    print("#" * i)\n', 'for i in range(5, 0, -1):\n    print("🔷" * i)\n'],
    wrong: [
      { code: '# Das Muster ist noch langweilig: Jede Zeile ist gleich lang.\nfor i in range(1, 6):\n    print("⭐" * 3)\n', expect: "grow" },
      { code: 'print("*")\nprint("**")\nprint("***")\n', expect: "fb.needFor" },
      { code: 'for i in range(1, 6):\n    print("⭐")\n', expect: "grow" },
      { code: 'for i in range(1, 3):\n    print("*" * i)\n', expect: "fb.needLines" },
      { code: 'for i in range(1, 6):\n    print("⭐" * "i")\n', expect: "error:TypeError" },
    ],
    expertRight: ['for i in range(4):\n    print(" " * (4 - i) + "#" * (2 * i + 1))\n'],
    expertWrong: [{ code: 'for i in range(1, 6):\n    print("*" * i)\n', expect: "indent" }],
  },

  "s2-l6": {
    right: [
      'zahl = 10\nwhile zahl >= 1:\n    print(zahl)\n    zahl -= 1\nprint("Start!")\n',
      'zahl = 10\nwhile zahl > 0:\n    print(f"Noch {zahl} …")\n    zahl = zahl - 1\nprint("Abheben! 🚀")\n',
    ],
    wrong: [
      { code: 'zahl = 10\n# Zähle mit einer while-Schleife von 10 bis 1 herunter\n# und gib danach "Start! 🚀" aus\n', expect: "fb.needWhile" },
      { code: 'for zahl in range(10, 0, -1):\n    print(zahl)\nprint("Start!")\n', expect: "fb.needWhile" },
      { code: 'zahl = 5\nwhile zahl > 0:\n    print(zahl)\n    zahl = zahl - 1\nprint("Start!")\n', expect: "countdown" },
      { code: 'zahl = 10\nwhile zahl > 0:\n    print(zahl)\n    zahl = zahl - 1\n    print("Start!")\n', expect: "countdown" },
      { code: 'zahl = 10\nwhile zahl > 0:\n    zahl = zahl - 1\n    print(zahl)\nprint("Start!")\n', expect: "countdown" },
      { code: "zahl = 10\nwhile zahl > 0:\n    print(zahl)\n    zahl = zahl - 1\n", expect: "finalLine" },
      { code: 'zahl = 10\nwhile zahl > 0:\n    print(zahl)\nprint("Start!")\n', expect: "limit" },
    ],
    expertRight: ["summe = 0\nzahl = 10\nwhile zahl > 0:\n    summe += zahl\n    zahl -= 1\nprint(summe)\n"],
    expertWrong: [{ code: "summe = 0\nzahl = 1\nwhile zahl < 10:\n    summe += zahl\n    zahl += 1\nprint(summe)\n", expect: "result55" }],
  },

  "s2-boss2": {
    inputs: Array.from({ length: 20 }, (_, i) => String(i + 1)),
    right: [
      py`
        import random
        geheim = random.randint(1, 20)
        tipp = 0
        while tipp != geheim:
            tipp = int(input("Zahl: "))
            if tipp > geheim:
                print("Zu groß!")
            elif tipp < geheim:
                print("Zu klein!")
            else:
                print("Treffer!")
      `,
      py`
        import random
        geheim = random.randint(1, 20)
        while True:
            tipp = int(input("Zahl: "))
            if tipp == geheim:
                break
            if tipp > geheim:
                print("zu hoch")
            else:
                print("zu tief")
        print("Erwischt!")
      `,
    ],
    wrong: [
      {
        code: py`
          import random
          geheim = random.randint(1, 20)
          tipp = 0

          while tipp != geheim:
              tipp = int(input("Deine Zahl (1-20): "))
              # Gib hier einen Hinweis: zu hoch oder zu tief?

          print("Erwischt! 🎉")
        `,
        expect: "fb.needIf",
      },
      {
        code: py`
          import random
          geheim = random.randint(1, 20)
          tipp = 0
          while tipp != geheim:
              tipp = int(input("Zahl: "))
              if tipp > geheim:
                  print("zu hoch")
          print("Erwischt!")
        `,
        expect: "tooLow",
      },
      {
        code: py`
          import random
          geheim = random.randint(1, 20)
          tipp = 0
          while tipp != geheim:
              tipp = int(input("Zahl: "))
              if tipp > geheim:
                  print("zu hoch")
              else:
                  print("zu tief")
          print("Erwischt!")
        `,
        expect: "winNoHint",
      },
      {
        code: py`
          import random
          geheim = random.randint(1, 20)
          tipp = 0
          while tipp != geheim:
              tipp = int(input("Zahl: "))
              if tipp != geheim:
                  print("falsch")
          print("Erwischt!")
        `,
        expect: "highLow",
      },
      {
        code: py`
          import random
          geheim = random.randint(1, 20)
          tipp = 0
          while tipp != geheim:
              tipp = input("Zahl: ")
              if tipp > geheim:
                  print("zu hoch")
              elif tipp < geheim:
                  print("zu tief")
          print("Erwischt!")
        `,
        expect: "error:TypeError",
      },
    ],
    expertRight: [
      py`
        import random
        geheim = random.randint(1, 20)
        tipp = 0
        n = 0
        while tipp != geheim:
            tipp = int(input("Zahl: "))
            n += 1
            if tipp > geheim:
                print("zu hoch")
            elif tipp < geheim:
                print("zu tief")
        print("Versuche:", n)
      `,
    ],
    expertWrong: [
      {
        code: py`
          import random
          geheim = random.randint(1, 20)
          tipp = 0
          versuche = 1
          while tipp != geheim:
              tipp = int(input("Zahl: "))
              versuche = versuche + 1
              if tipp > geheim:
                  print("zu hoch")
              elif tipp < geheim:
                  print("zu tief")
          print("Versuche:", versuche)
        `,
        expect: "count3",
      },
      {
        code: py`
          import random
          geheim = random.randint(1, 20)
          tipp = 0
          while tipp != geheim:
              tipp = int(input("Zahl: "))
              if tipp > geheim:
                  print("zu hoch")
              elif tipp < geheim:
                  print("zu tief")
          print("Erwischt!")
        `,
        expect: "counter",
      },
    ],
  },

  "s3-l1": {
    right: ['essen = ["Pizza", "Döner", "Sushi", "Pasta"]\nprint(essen)\nprint(essen[0])\n', "zahlen = [3, 1, 4]\nprint(zahlen)\nprint(zahlen[0])\n"],
    wrong: [
      { code: "# Erstelle eine Liste mit mindestens 3 Dingen\n# Gib die Liste aus und danach den ersten Eintrag\n", expect: "fb.needList" },
      { code: 'essen = ["Pizza", "Döner"]\nprint(essen)\nprint(essen[0])\n', expect: "fb.needList" },
      { code: 'essen = ["Pizza", "Döner", "Sushi"]\nprint(essen[0])\n', expect: "printList" },
      { code: 'essen = ["Pizza", "Döner", "Sushi"]\nprint(essen)\nprint(essen[1])\n', expect: "printFirst" },
      { code: 'essen = ["Pizza", "Döner", "Sushi"]\nprint(essen)\nprint(essen[3])\n', expect: "error:IndexError" },
      { code: 'essen = "Pizza", "Döner", "Sushi"\nprint(essen)\n', expect: "fb.needList" },
    ],
    expertRight: ['l = ["a", "b", "c", "d"]\nprint(len(l), l[-1])\n'],
    expertWrong: [{ code: 'l = ["a", "b", "c"]\nprint(len(l))\nprint(l[2])\n', expect: "useNeg" }],
  },

  "s3-l2": {
    right: [
      'team = ["Yara", "Noah"]\nteam.append("Lena")\nteam.append("Ben")\nteam.sort()\nprint(team)\n',
      'team = ["Yara", "Noah"]\nteam.append("Aylin")\nprint(sorted(team))\n',
    ],
    wrong: [
      { code: 'team = ["Yara", "Noah"]\n# Füge jemanden hinzu, sortiere die Liste und gib sie aus\n', expect: "useAppend" },
      { code: 'team = ["Yara", "Noah"]\nteam.append("Lena")\nprint(team)\n', expect: "useSort" },
      { code: 'team = ["Yara", "Noah"]\nteam.sort()\nteam.append("Lena")\nprint(team)\n', expect: "sorted" },
      { code: 'team = ["Yara", "Noah"]\nteam.append("Lena")\nteam.sort()\n', expect: "fb.needPrint" },
      { code: 'team = ["Yara", "Noah"]\nteam.append("Lena")\nteam = team.sort()\nprint(team)\n', expect: "sortNone" },
      { code: 'team = ["Yara", "Noah"]\nteam.add("Lena")\n', expect: "error:AttributeError" },
    ],
    expertRight: ['team = ["Yara", "Noah", "Lena"]\nteam.reverse()\nteam.remove("Lena")\nprint(team)\n'],
    expertWrong: [{ code: 'team = ["Yara", "Noah", "Lena"]\nteam.reverse()\nprint(team)\n', expect: "useRemove" }],
  },

  "s3-l3": {
    right: ['songs = ["Intro", "Beat 1", "Finale"]\nfor s in songs:\n    print(s)\n', 'songs = ["A", "B", "C", "D"]\nfor song in songs:\n    print(f"♪ {song}")\n'],
    wrong: [
      { code: 'songs = ["Intro", "Beat 1", "Finale"]\n# Gib jeden Song einzeln aus\n', expect: "fb.needFor" },
      { code: 'songs = ["Intro", "Beat 1", "Finale"]\nprint(songs)\n', expect: "fb.needFor" },
      { code: 'songs = ["Intro", "Beat 1", "Finale"]\nfor song in songs:\n    pass\nprint(song)\n', expect: "printInLoop" },
      { code: 'songs = ["Intro", "Beat 1", "Finale"]\nfor i in range(3):\n    print(songs[i])\n', expect: "loopOverList" },
      { code: 'songs = ["Intro", "Beat 1", "Finale"]\nfor song in songs:\n    print("song")\n', expect: "eachItem" },
    ],
    expertRight: ["tore = [2, 1, 3, 0, 2]\ngesamt = 0\nfor t in tore:\n    gesamt += t\nprint(gesamt)\n"],
    expertWrong: [{ code: "tore = [2, 1, 3, 0, 2]\nprint(sum(tore))\n", expect: "fb.needFor" }],
  },

  "s3-l4": {
    right: ['def begruesse(name):\n    print(f"Hallo {name}! 👋")\n\nfor n in ["Ali", "Bea"]:\n    begruesse(n)\n'],
    wrong: [
      { code: 'def begruesse(name):\n    print(f"Hallo {name}! 👋")\n\n# Ruf die Funktion mit zwei verschiedenen Namen auf\n', expect: "twoCalls" },
      { code: 'def begruesse(name):\n    print(f"Hallo {name}! 👋")\n\nbegruesse("Mia")\n', expect: "twoCalls" },
      { code: 'def begruesse(name):\n    print(f"Hallo {name}! 👋")\n\nbegruesse("Mia")\nbegruesse("Mia")\n', expect: "differentNames" },
      { code: 'def begruesse(name):\n    print(f"Hallo {name}! 👋")\n\nbegruesse()\n', expect: "error:TypeError" },
      { code: 'def begruesse(name):\nprint(f"Hallo {name}!")\n', expect: "error:IndentationError" },
      { code: 'def begruesse(name):\n    print(f"Hallo {name}! 👋")\n\nprint("Hallo Mia")\nprint("Hallo Jonas")\n', expect: "twoCalls" },
    ],
    expertRight: ['def gruss(wer, wann):\n    print(f"{wann}: Hallo {wer}!")\n\ngruss("Ada", "Heute")\ngruss("Bo", "Morgen")\n'],
    expertWrong: [
      {
        code: 'def begruesse(name, tageszeit):\n    print(f"Hallo {name}!")\n\nbegruesse("Mia", "Morgen")\nbegruesse("Leo", "Abend")\n',
        expect: "useBoth",
      },
      { code: 'def begruesse(name):\n    print(f"Guten Morgen, {name}!")\n\nbegruesse("Mia")\nbegruesse("Leo")\n', expect: "twoParams" },
    ],
  },

  "s3-l5": {
    right: ["def durchschnitt(a, b, c):\n    summe = a + b + c\n    return summe / 3\n\nprint(durchschnitt(2, 4, 6))\n"],
    wrong: [
      {
        code: "def durchschnitt(a, b, c):\n    # Gib den Durchschnitt der drei Zahlen zurück\n    return 0\n\nprint(durchschnitt(2, 4, 6))\n",
        expect: "wrongValues",
      },
      { code: "def durchschnitt(a, b, c):\n    return 4\n\nprint(durchschnitt(2, 4, 6))\n", expect: "wrongValues" },
      { code: "def durchschnitt(a, b, c):\n    print((a + b + c) / 3)\n\ndurchschnitt(2, 4, 6)\n", expect: "returnsNothing" },
      { code: "def durchschnitt(a, b, c):\n    return a + b + c / 3\n\nprint(durchschnitt(2, 4, 6))\n", expect: "wrongValues" },
      { code: "def durchschnitt(a, b, c):\n    return (a + b + c) / 3\n", expect: "printResult" },
      { code: "def durchschnitt(a, b, c):\n    return (a + b + c) / 3\n\nprint(durchschnitt(2, 4))\n", expect: "error:TypeError" },
    ],
    expertRight: ["def punkte(s, r):\n    return 3 * s + r\n\nprint(punkte(1, 1))\n"],
    expertWrong: [{ code: "def punkte(siege, remis):\n    return siege + remis\n\nprint(punkte(5, 3))\n", expect: "wrongValues" }],
  },

  "s3-l6": {
    right: ['tier = {"art": "Hund", "name": "Bello", "alter": 4}\nprint(tier["name"], "ist", tier["alter"])\n'],
    wrong: [
      { code: 'held = {"name": "Ada", "level": 3}\n# Ergänze ein drittes Paar und gib zwei Werte aus\n', expect: "fb.needDict" },
      { code: 'held = {"name": "Ada", "level": 3, "farbe": "Lila"}\nprint(held)\n', expect: "accessByKey" },
      { code: 'held = {"name": "Ada", "level": 3, "farbe": "Lila"}\nprint(held["name"])\n', expect: "accessByKey" },
      { code: 'held = {"name": "Ada", "level": 3, "farbe": "Lila"}\nprint(held["Name"])\n', expect: "error:KeyError" },
      {
        code: 'held = {"name": "Ada", "level": 3, "farbe": "Lila"}\nx = held["name"]\ny = held["farbe"]\nprint("fertig")\n',
        expect: "printValues",
      },
    ],
    expertRight: ['held = {"name": "Ada"}\nheld["level"] = 2\nfor k, v in held.items():\n    print(k, v)\nprint("Ende")\n'],
    expertWrong: [{ code: 'held = {"name": "Ada"}\nheld["level"] = 2\nprint(held)\n', expect: "loopDict" }],
  },

  "s3-boss3": {
    inputs: ["8", "Rom", "Jupiter", "x", "y"],
    right: [
      quizHead +
        py`
          if input("2 + 2 = ") == "4":
              punkte += 1
          if input("Farbe des Himmels? ").lower() == "blau":
              punkte += 1
          print(f"Du hast {punkte} Punkte!")
        `,
    ],
    wrong: [
      { code: quizHead + '\n# Füge hier mindestens zwei weitere Fragen hinzu\n\nprint("Punkte:", punkte)\n', expect: "fb.needInputs" },
      {
        code: quizHead + 'antwort = input("Hauptstadt von Italien? ")\nif antwort == "Rom":\n    punkte = punkte + 1\nprint("Punkte:", punkte)\n',
        expect: "fb.needInputs",
      },
      {
        code:
          quizHead +
          'a = input("Frage 2? ")\nif a == "x":\n    print("Richtig")\nb = input("Frage 3? ")\nif b == "y":\n    print("Richtig")\nprint("Punkte:", punkte)\n',
        expect: "countPoints",
      },
      {
        code:
          'punkte = 0\nprint("Punkte:", punkte)\n' +
          'a = input("1? ")\nif a == "1":\n    punkte += 1\nb = input("2? ")\nif b == "2":\n    punkte += 1\nc = input("3? ")\nif c == "3":\n    punkte += 1\nprint("Danke fürs Mitspielen!")\n',
        expect: "scoreAtEnd",
      },
    ],
    expertWrong: [
      {
        code: quizHead + 'a = input("2? ")\nif a == "2":\n    punkte += 1\nb = input("3? ")\nif b == "3":\n    punkte += 1\nprint(punkte)\n',
        expect: "listOfDicts",
      },
    ],
  },

  "s4-l1": {
    right: [
      py`
        import random
        energie = 20
        runde = 1
        while energie > 0:
            energie -= random.randint(1, 6)
            print("Runde", runde, "Energie", energie)
            runde += 1
        print("Game Over")
      `,
    ],
    wrong: [
      {
        code: py`
          import random
          energie = 20
          runde = 1
          # Spielschleife: Solange energie größer als 0 ist …
          print("Game Over")
        `,
        expect: "fb.needWhile",
      },
      {
        code: 'energie = 20\nwhile energie > 0:\n    energie = energie - 2\n    print("Energie", energie)\nprint("Game Over")\n',
        expect: "randomInLoop",
      },
      {
        code: 'import random\nschaden = random.randint(1, 6)\nenergie = 20\nwhile energie > 0:\n    energie = energie - schaden\n    print("Energie", energie)\nprint("Game Over")\n',
        expect: "randomInLoop",
      },
      {
        code: 'import random\nenergie = 20\nwhile energie > 0:\n    energie = energie - random.randint(1, 6)\nprint("Game Over")\n',
        expect: "rounds",
      },
      {
        code: 'import random\nenergie = 20\nwhile energie > 0:\n    energie = energie - random.randint(1, 6)\n    print("Energie", energie)\n    print("Game Over")\n',
        expect: "gameOver",
      },
      {
        code: 'import random\nenergie = 20\nwhile energie > 0:\n    schaden = random.randint(1, 6)\n    print("Energie", energie)\nprint("Game Over")\n',
        expect: "limit",
      },
    ],
    expertWrong: [
      {
        code: py`
          import random
          energie = 20
          runde = 1
          while energie > 0:
              energie = energie - random.randint(1, 6)
              print("Runde", runde, "Energie", energie)
              runde = runde + 1
          print("Game Over")
          print("Überlebt:", runde, "Runden")
        `,
        expect: "count4",
      },
    ],
  },

  "s4-l2": {
    right: ['geheim = "QZUIPO"\nfor z in geheim:\n    print(chr(ord(z) - 1), end="")\nprint()\n'],
    wrong: [
      {
        code: 'geheim = "QZUIPO"   # jeder Buchstabe ist um 1 verschoben\nklartext = ""\nfor zeichen in geheim:\n    # Verschiebe jedes Zeichen um 1 zurück\n    klartext = klartext + zeichen\nprint(klartext)\n',
        expect: "useOrdChr",
      },
      {
        code: 'geheim = "QZUIPO"\nklartext = ""\nfor zeichen in geheim:\n    klartext = klartext + chr(ord(zeichen) + 1)\nprint(klartext)\n',
        expect: "decrypt",
      },
      { code: 'print("PYTHON")\n', expect: "useOrdChr" },
      {
        code: 'geheim = "QZUIPO"\nklartext = ""\nfor zeichen in geheim:\n    klartext = klartext + ord(zeichen) - 1\nprint(klartext)\n',
        expect: "error:TypeError",
      },
    ],
    expertRight: [
      py`
        def caesar(text, v):
            out = ""
            for z in text:
                if z.isupper():
                    out += chr((ord(z) - ord("A") + v) % 26 + ord("A"))
                else:
                    out += z
            return out

        print(caesar("ABC", 1))
      `,
    ],
    expertWrong: [
      {
        code: py`
          def caesar(text, versatz):
              ergebnis = ""
              for z in text:
                  ergebnis = ergebnis + chr(ord(z) + versatz)
              return ergebnis

          print(caesar("HALLO", 3))
        `,
        expect: "useMod",
      },
      {
        code: py`
          def caesar(text, versatz):
              ergebnis = ""
              for z in text:
                  ergebnis = ergebnis + chr((ord(z) - 65 + versatz) % 26 + 65)
              return ergebnis

          print(caesar("HALLO", 3))
        `,
        expect: "spaces",
      },
    ],
  },

  "s4-l3": {
    right: [
      'from station import pixel\nfor x in range(16):\n    pixel(x, 15, "green")\nfor y in range(5):\n    pixel(8, y, "yellow")\n',
      'import station\nfor x in range(4, 12):\n    for y in range(4, 12):\n        station.pixel(x, y, "rot")\nstation.pixel(7, 7, "#ffffff")\n',
      'from station import fill, pixel\nfill("navy")\nx = 0\nwhile x < 16:\n    pixel(x, x, "gelb")\n    x += 1\n',
    ],
    wrong: [
      { code: 'from station import pixel\n\n# Male dein Bild: pixel(x, y, "farbe")  (x und y von 0 bis 15)\npixel(7, 7, "gold")\n', expect: "fb.needPixels" },
      { code: 'print("Haus")\n', expect: "usePixel" },
      { code: 'from station import pixel\nfor x in range(16):\n    pixel(x, 3, "red")\n', expect: "fb.needColors" },
      {
        code:
          "from station import pixel\n" +
          Array.from({ length: 12 }, (_, i) => `pixel(${i}, 0, "${i % 2 ? "red" : "blue"}")`).join("\n") +
          "\n",
        expect: "useLoop",
      },
      { code: 'from station import pixel\nfor x in range(16):\n    pixel(x, 16, "red")\n', expect: "error:StationError" },
      { code: 'from station import pixel\nfor x in range(16):\n    pixel(x, 2, "regenbogen")\n', expect: "error:StationError" },
      { code: 'pixel(1, 1, "red")\n', expect: "error:NameError" },
    ],
    expertRight: [
      'from station import pixel\nfor y in range(4):\n    for x in range(6):\n        pixel(x, y, "pink")\n',
    ],
    expertWrong: [
      { code: 'from station import pixel\nfor x in range(16):\n    pixel(x, 0, "red")\n    pixel(x, 1, "blue")\n', expect: "nested" },
      { code: 'from station import pixel\nfor y in range(2):\n    for x in range(3):\n        pixel(x, y, "pink")\n', expect: "fb.needPixels" },
    ],
  },

  "s4-l4": {
    right: ['temps = [21, 25, 19, 28, 23]\nschnitt = sum(temps) / len(temps)\nprint(f"Max: {max(temps)}, Schnitt: {schnitt}")\n'],
    wrong: [
      { code: "temps = [21, 25, 19, 28, 23]\n# Gib den wärmsten Tag und den Durchschnitt aus\n", expect: "useMax" },
      { code: "temps = [21, 25, 19, 28, 23]\nprint(28)\nprint(23.2)\n", expect: "useMax" },
      { code: "temps = [21, 25, 19, 28, 23]\nprint(max(temps))\n", expect: "useSumLen" },
      { code: "temps = [21, 25, 19, 28, 23]\nprint(max(temps))\nprint(sum(temps) / 4)\n", expect: "useSumLen" },
      { code: "temps = [21, 25, 19, 28, 23]\nprint(min(temps))\nprint(sum(temps) / len(temps))\n", expect: "useMax" },
      { code: "temps = [21, 25, 19, 28, 23]\nprint(max(temps))\nprint(sum(temps) / len(temps) + 1)\n", expect: "average" },
    ],
    expertRight: ["temps = [21, 25, 19, 28, 23]\nprint(round(sum(temps) / len(temps), 1))\nn = 0\nfor t in temps:\n    if t > 22:\n        n += 1\nprint(n)\n"],
    expertWrong: [
      {
        code: "temps = [21, 25, 19, 28, 23]\nprint(round(sum(temps) / len(temps), 1))\nn = 0\nfor t in temps:\n    if t > 23:\n        n += 1\nprint(n)\n",
        expect: "count3",
      },
    ],
  },

  "s4-l5": {
    inputs: ["11"],
    right: [
      'name = "Emma"\nalter = 11\nprint("Hallo " + name)\nprint(f"Nächstes Jahr bist du {alter + 1} Jahre alt")\nfor i in range(3):\n    print("Hurra!")\n',
    ],
    wrong: [
      {
        code: 'name = "Emma"\nalter = 11\nprint("Hallo " + name)\nprint("Nächstes Jahr bist du " + (alter + 1) + " Jahre alt")\nfor i in range(3)\nprint("Hurra!")\n',
        expect: "error:SyntaxError",
      },
      {
        code: 'name = "Emma"\nalter = 11\nprint("Hallo " + name)\nprint("Nächstes Jahr bist du " + (alter + 1) + " Jahre alt")\nfor i in range(3):\nprint("Hurra!")\n',
        expect: "error:IndentationError",
      },
      {
        code: 'name = "Emma"\nalter = 11\nprint("Hallo " + name)\nprint("Nächstes Jahr bist du " + (alter + 1) + " Jahre alt")\nfor i in range(3):\n    print("Hurra!")\n',
        expect: "error:TypeError",
      },
      { code: 'name = "Emma"\nalter = 11\nprint("Hallo " + name)\nfor i in range(3):\n    print("Hurra!")\n', expect: "allLines" },
      {
        code: 'name = "Emma"\nalter = 11\nprint("Hallo " + name)\nprint("Nächstes Jahr bist du " + str(alter + 1) + " Jahre alt")\nfor i in range(3):\n    pass\nprint("Hurra!")\n',
        expect: "allLines",
      },
    ],
    expertRight: ['try:\n    a = int(input("Alter? "))\n    print(a + 1)\nexcept:\n    print("Das war keine Zahl.")\n'],
    expertWrong: [
      { code: 'alter = int(input("Wie alt bist du? "))\nprint(alter + 1)\n', expect: "useTry" },
      {
        code: 'try:\n    alter = int(input("Wie alt bist du? "))\nexcept ValueError:\n    print("Bitte eine Zahl.")\n',
        expect: "normalCase",
      },
    ],
  },

  "s4-boss4": {
    inputs: ["Werde ich Profi?", "Regnet es morgen?", "Klappt es?"],
    right: [
      py`
        import random

        def wuerfeln():
            return random.randint(1, 6)

        summe = 0
        for wurf in range(3):
            augen = wuerfeln()
            print("Gewürfelt:", augen)
            summe = summe + augen
        print("Summe:", summe)
      `,
    ],
    wrong: [
      {
        code: py`
          # 🌟 Dein Projekt. Ein paar Ideen:
          #  - ein Text-Abenteuer mit Entscheidungen (if/else)
          #  - ein Quiz zu deinem Lieblingsthema
          #  - ein Würfelspiel oder Rechen-Trainer
          #  - ein nützliches Werkzeug (Umrechner, Ideen-Generator)

          print("Mein Projekt startet …")
        `,
        expect: "fb.unchanged",
      },
      { code: 'print("Hallo")\nprint("Welt")\n', expect: "blocks" },
      { code: "for i in range(3):\n    if i > 1:\n        print(i)\n", expect: "blocks" },
      { code: "import random\nfor i in [1, 2]:\n    print(random.randint(1, i))\n", expect: "tooShort" },
    ],
  },

  // ================================================================ Außeneinsätze (Drohne)
  "d-1": {
    right: ["from drone import *\nfor i in range(5):\n    move()\n", "import drone\ndrone.move()\ndrone.move()\ndrone.move()\ndrone.move()\ndrone.move()\n"],
    wrong: [
      { code: "from drone import *\n\nmove()\n", expect: "fb.droneGoal" },
      { code: "from drone import *\n" + "move()\n".repeat(6), expect: "fb.droneGoal" },
      { code: "from drone import *\n" + "move()\n".repeat(7), expect: "error:DroneCrash" },
      { code: "from drone import *\nmove\nmove\n", expect: "fb.droneGoal" },
      { code: "move()\n", expect: "error:NameError" },
    ],
  },
  "d-2": {
    right: ["from drone import *\nfor i in range(4):\n    move()\nturn_left()\nmove()\nmove()\n"],
    wrong: [
      { code: "from drone import *\n\nmove()\n", expect: "fb.droneGoal" },
      { code: "from drone import *\n" + "move()\n".repeat(5), expect: "error:DroneCrash" },
      { code: "from drone import *\n" + "move()\n".repeat(4) + "turn_right()\n", expect: "error:NameError" },
      { code: "from drone import *\n" + "move()\n".repeat(4) + "turn_left()\nmove()\n", expect: "fb.droneGoal" },
    ],
    expertRight: ["from drone import *\n" + "move()\n".repeat(4) + "turn_left()\nmove()\nmove()\nturn_left()\n"],
    expertWrong: [{ code: "from drone import *\n" + "move()\n".repeat(4) + "turn_left()\nmove()\nmove()\n", expect: "faceWest" }],
  },
  "d-3": {
    right: ["from drone import *\nfor i in range(2):\n    move()\n    move()\n    collect()\nmove()\nmove()\n"],
    wrong: [
      { code: "from drone import *\n\nmove()\nmove()\n", expect: "fb.droneCrystals" },
      { code: "from drone import *\n" + "move()\n".repeat(6), expect: "fb.droneCrystals" },
      { code: "from drone import *\nmove()\ncollect()\n", expect: "error:DroneError" },
      { code: "from drone import *\nmove()\nmove()\ncollect()\nmove()\nmove()\ncollect()\n", expect: "fb.droneGoal" },
    ],
  },
  "d-4": {
    right: ["from drone import *\nfor schritt in range(13):\n    move()\n", "from drone import *\nfor i in range(12):\n    move()\nmove()\n"],
    wrong: [
      { code: "from drone import *\n\n# Der Gang ist 13 Felder lang\nmove()\n", expect: "fb.needFor" },
      { code: "from drone import *\n" + "move()\n".repeat(13), expect: "fb.needFor" },
      { code: "from drone import *\nfor i in range(12):\n    move()\n", expect: "fb.droneGoal" },
      { code: "from drone import *\nfor i in range(14):\n    move()\n", expect: "error:DroneCrash" },
    ],
    expertRight: ["from drone import *\nfor i in range(13): move()\n"],
    expertWrong: [{ code: "from drone import *\n\nfor i in range(12):\n    move()\nmove()\n", expect: "short" }],
  },
  "d-5": {
    right: ["from drone import *\nwhile at_goal() == False:\n    move()\n"],
    wrong: [
      { code: "from drone import *\n\nmove()\n", expect: "fb.needWhile" },
      { code: "from drone import *\nfor i in range(7):\n    move()\n", expect: "fb.needWhile" },
      { code: "from drone import *\nzahl = 0\nwhile zahl < 7:\n    move()\n    zahl += 1\n", expect: "fb.droneWorlds" },
      { code: "from drone import *\nwhile True:\n    move()\n", expect: "error:DroneCrash" },
      { code: "from drone import *\nwhile not at_goal():\n    pass\n", expect: "error:DroneError" },
    ],
    expertRight: ["from drone import *\nn = 0\nwhile not at_goal():\n    move()\n    n = n + 1\nprint(n)\n"],
    expertWrong: [{ code: "from drone import *\nwhile not at_goal():\n    move()\nprint(7)\n", expect: "count" }],
  },
  "d-6": {
    right: ["from drone import *\nwhile not at_goal():\n    move()\n    if on_crystal():\n        collect()\n"],
    wrong: [
      { code: "from drone import *\n\nwhile not at_goal():\n    move()\n", expect: "fb.needIf" },
      { code: "from drone import *\nwhile not at_goal():\n    collect()\n    move()\n", expect: "error:DroneError" },
      {
        code: "from drone import *\nmove()\nmove()\ncollect()\nmove()\nmove()\nmove()\ncollect()\nmove()\ncollect()\nmove()\nmove()\ncollect()\nmove()\n",
        expect: "fb.needWhile",
      },
      {
        code: "from drone import *\nzahl = 0\nwhile zahl < 9:\n    if on_crystal():\n        collect()\n    move()\n    zahl += 1\n",
        expect: "fb.droneWorlds",
      },
    ],
    expertRight: ["from drone import *\nk = 0\nwhile not at_goal():\n    move()\n    if on_crystal():\n        collect()\n        k += 1\nprint(f\"{k} Kristalle\")\n"],
    expertWrong: [{ code: "from drone import *\nwhile not at_goal():\n    if on_crystal():\n        collect()\n    move()\nprint(4)\n", expect: "count" }],
  },
  "d-7": {
    right: [
      "from drone import *\ndef turn_right():\n    for i in range(3):\n        turn_left()\nfor i in range(4):\n    move()\n    turn_left()\n    move()\n    turn_right()\nmove()\n",
      "from drone import *\ndef rechts():\n    turn_left()\n    turn_left()\n    turn_left()\nmove()\nturn_left()\nmove()\nrechts()\nmove()\nturn_left()\nmove()\nrechts()\nmove()\nturn_left()\nmove()\nrechts()\nmove()\nturn_left()\nmove()\nrechts()\nmove()\n",
    ],
    wrong: [
      { code: "from drone import *\n\ndef turn_right():\n    # dreimal links ist einmal rechts\n    pass\n\nmove()\n", expect: "useDef" },
      {
        code: "from drone import *\nfor i in range(4):\n    move()\n    turn_left()\n    move()\n    turn_left()\n    turn_left()\n    turn_left()\nmove()\n",
        expect: "fb.needDef",
      },
      { code: "from drone import *\ndef turn_right():\n    turn_left()\nfor i in range(4):\n    move()\n    turn_left()\n    move()\n    turn_right()\nmove()\n", expect: "error:DroneCrash" },
    ],
    expertRight: [
      "from drone import *\ndef turn_right():\n    turn_left()\n    turn_left()\n    turn_left()\ndef stufe():\n    move()\n    turn_left()\n    move()\n    turn_right()\nfor i in range(4):\n    stufe()\nmove()\n",
    ],
    expertWrong: [
      { code: "from drone import *\ndef turn_right():\n    turn_left()\n    turn_left()\n    turn_left()\nfor i in range(4):\n    move()\n    turn_left()\n    move()\n    turn_right()\nmove()\n", expect: "twoDefs" },
    ],
  },
  "d-8": {
    right: ["from drone import *\nwhile not at_goal():\n    if not front_clear():\n        turn_left()\n    else:\n        move()\n"],
    wrong: [
      { code: "from drone import *\n\n# Lumo soll selbst entscheiden: weiterfliegen oder abbiegen?\nmove()\n", expect: "fb.needWhile" },
      { code: "from drone import *\nwhile not at_goal():\n    if front_clear():\n        move()\n", expect: "error:DroneError" },
      {
        code:
          "from drone import *\nfor i in range(4):\n    move()\nturn_left()\nfor i in range(4):\n    move()\nturn_left()\nfor i in range(4):\n    move()\nturn_left()\nmove()\nmove()\nturn_left()\nmove()\nmove()\n",
        expect: "fb.needWhile",
      },
      { code: "from drone import *\nwhile not at_goal():\n    if front_clear():\n        move()\n    else:\n        move()\n", expect: "error:DroneCrash" },
    ],
  },
  "d-9": {
    right: [
      "from drone import *\ndef turn_right():\n    turn_left()\n    turn_left()\n    turn_left()\nwhile not at_goal():\n    turn_left()\n    while not front_clear():\n        turn_right()\n    move()\n",
    ],
    wrong: [
      { code: "from drone import *\n\ndef turn_right():\n    turn_left()\n    turn_left()\n    turn_left()\n\n# Rechte Hand an der Wand …\nmove()\n", expect: "fb.needWhile" },
      { code: "from drone import *\ndef turn_right():\n    turn_left()\nwhile not at_goal():\n    if front_clear():\n        move()\n    else:\n        turn_left()\n", expect: "error:DroneError" },
      {
        code: "from drone import *\ndef turn_right():\n    turn_left()\n    turn_left()\n    turn_left()\nwhile not at_goal():\n    while not front_clear():\n        turn_left()\n    move()\n",
        expect: "error:DroneError",
      },
      { code: "from drone import *\nwhile not at_goal():\n    move()\n", expect: "error:DroneCrash" },
      { code: "from drone import *\nwhile not at_goal():\n    if front_clear():\n        move()\n    else:\n        turn_left()\n", expect: "error:DroneError" },
    ],
  },

  // ================================================================ Glitch-Jagd
  "g-1": {
    inputs: ["Mira"],
    right: ['n = input("Name? ")\nprint(f"Hallo {n}")\nprint("Willkommen an Bord!")\n'],
    wrong: [
      { code: 'name = input("Wie heißt du? ")\nprint("Hallo, " + Name + "!")\nprint("Willkommen an Bord!)\n', expect: "error:SyntaxError" },
      { code: 'name = input("Wie heißt du? ")\nprint("Hallo, " + Name + "!")\nprint("Willkommen an Bord!")\n', expect: "error:NameError" },
      { code: 'name = input("Wie heißt du? ")\nprint("Hallo!")\nprint("Willkommen an Bord!")\n', expect: "greet" },
      { code: 'name = input("Wie heißt du? ")\nprint("Hallo, " + name + "!")\n', expect: "greet" },
    ],
  },
  "g-2": {
    inputs: ["12"],
    right: ['a = int(input("Alter? "))\nprint("In zehn Jahren:", a + 10)\n'],
    wrong: [
      { code: 'alter = input("Wie alt bist du? ")\nin_zehn_jahren = alter + 10\nprint("In zehn Jahren bist du " + in_zehn_jahren + " Jahre alt.")\n', expect: "error:TypeError" },
      { code: 'alter = int(input("Wie alt bist du? "))\nin_zehn_jahren = alter + 10\nprint("In zehn Jahren bist du " + in_zehn_jahren + " Jahre alt.")\n', expect: "error:TypeError" },
      { code: 'alter = input("Wie alt bist du? ")\nprint("In zehn Jahren bist du 22 Jahre alt.")\n', expect: "math" },
      { code: 'alter = int(input("Wie alt bist du? "))\nprint(alter + 1)\n', expect: "math" },
    ],
  },
  "g-3": {
    right: ['zahl = 5\nwhile zahl >= 1:\n    print(zahl)\n    zahl -= 1\nprint("Los!")\n'],
    wrong: [
      { code: 'zahl = 5\nwhile zahl > 0:\n    print(zahl)\nprint("Start!")\n', expect: "limit" },
      { code: 'zahl = 5\nwhile zahl > 0:\n    zahl = zahl - 1\n    print(zahl)\nprint("Start!")\n', expect: "countdown" },
      { code: 'zahl = 5\nwhile zahl > 0:\n    print(zahl)\n    zahl = zahl - 1\n    print("Start!")\n', expect: "countdown" },
      { code: 'for zahl in range(5, 0, -1):\n    print(zahl)\nprint("Start!")\n', expect: "fb.needWhile" },
    ],
  },
  "g-4": {
    right: ['v = ["A", "B", "C", "D"]\nfor x in v:\n    print("Lager:", x)\nprint("Anzahl:", len(v))\n'],
    wrong: [
      { code: 'vorraete = ["Eis", "Kristalle", "Batterien", "Kekse"]\nfor i in range(len(vorraete) + 1):\n    print("Im Lager:", vorraete[i])\nprint("Anzahl:", len(vorraete)\n', expect: "error:SyntaxError" },
      { code: 'vorraete = ["Eis", "Kristalle", "Batterien", "Kekse"]\nfor i in range(len(vorraete) + 1):\n    print("Im Lager:", vorraete[i])\nprint("Anzahl:", len(vorraete))\n', expect: "error:IndexError" },
      { code: 'vorraete = ["Eis", "Kristalle", "Batterien", "Kekse"]\nfor i in range(len(vorraete) - 1):\n    print("Im Lager:", vorraete[i])\nprint("Anzahl:", len(vorraete))\n', expect: "list" },
      { code: 'print("Eis")\nprint("Kristalle")\nprint("Batterien")\nprint("Kekse")\nprint("Anzahl: 4")\n', expect: "fb.needFor" },
    ],
  },
  "g-5": {
    right: ["def doppelt(z):\n    return z + z\n\nenergie = doppelt(21)\nprint(f\"Energie gesamt: {energie + 8}\")\n"],
    wrong: [
      { code: 'def doppelt(zahl):\n    ergebnis = zahl * 2\n    print(ergebnis)\n\nenergie = doppelt(21)\nprint("Energie gesamt:", energie + 8)\n', expect: "error:TypeError" },
      { code: 'energie = 42\nprint("Energie gesamt:", energie + 8)\n', expect: "fb.needReturn" },
      { code: 'def doppelt(zahl):\n    return zahl + 2\n\nenergie = doppelt(21)\nprint("Energie gesamt:", energie + 8)\n', expect: "double" },
      { code: 'def doppelt(zahl):\n    return zahl * 2\n\nenergie = doppelt(21)\nprint("Energie gesamt:", energie)\n', expect: "fifty" },
      { code: 'def doppelt(zahl):\n    ergebnis = zahl * 2\n\nenergie = doppelt(21)\nprint(energie + 8)\n', expect: "error:TypeError" },
    ],
  },
};
