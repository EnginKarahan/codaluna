// PyQuest – Übersetzung des Kurses "season-1": Italiano.
// Überschreibt nur Texte und Code der deutschen Basis (content/courses/season-1.js).

import { py } from "../lib/check-kit.js";

export default {
  chapters: {
    c1: "Primi comandi",
    c2: "Decisioni e cicli",
    c3: "Collezioni e comandi su misura",
    c4: "Tutto insieme",
    d1: "Guidare Lumo sul ghiaccio",
    g1: "Riparare programmi rotti",
  },
  regions: {
    c1: {
      name: "Sala radio",
      intro: "La sala radio è al buio. Se vuoi che la stazione torni a parlare, le servono dei comandi – e a scriverli sei tu.",
      outro: "La stazione parla, fa i conti e sa di nuovo fare domande. Lumo fa una giravolta per la gioia.",
    },
    c2: {
      name: "Hangar",
      intro: "Nell'hangar ti aspettano porte, rover e luci di segnalazione. Per decidere da soli e ripetere le cose, hanno bisogno di condizioni e cicli.",
      outro: "Il portone dell'hangar si apre, e fuori il ghiaccio scintilla. Da adesso Lumo può uscire in volo anche per le missioni all'esterno.",
    },
    c3: {
      name: "Sala esperimenti",
      intro: "Nella sala esperimenti scorte, campioni e appunti sono tutti mescolati. Liste, dizionari e comandi su misura ci mettono ordine.",
      outro: "Ogni cosa è al suo posto, e l'IA di bordo ti riconosce come membro dell'equipaggio.",
    },
    c4: {
      name: "Sala di controllo",
      intro: "Nella sala di controllo confluiscono tutti i sistemi. Qui si vede che cosa sai fare: giochi, codici, immagini e veri dati di misura.",
      outro: "La stazione Polaris torna a brillare! Da adesso costruisci i tuoi moduli.",
    },
    d1: {
      name: "Campo di ghiaccio",
      intro: "Davanti alla stazione si stende il campo di ghiaccio. Qui guidi Lumo direttamente con Python: ogni comando è una manovra di volo.",
      outro: "Ormai Lumo conosce ogni angolo del campo di ghiaccio – e tu hai programmato un drone che trova la strada da solo.",
    },
    g1: {
      name: "Pozzo di manutenzione",
      intro: "Nel pozzo di manutenzione ci sono vecchi programmi dell'equipaggio – pieni di glitch. Ogni programma che ripari fa fare un passo avanti alla stazione.",
      outro: "Il pozzo di manutenzione è pulito. Ormai trovi i glitch più in fretta dell'IA di bordo.",
    },
  },

  // ================================================================== CAPITOLO 1
  "s1-l1": {
    title: "Ciao, mondo!",
    story: "La radio della stazione è muta da anni. Lancia il primissimo messaggio – l'importante è che abbia il tuo stile!",
    intro: `
<p>Un programma è una lista di <b>comandi</b> che il computer esegue uno dopo l'altro.
Il tuo primissimo comando è <code>print()</code> – scrive qualcosa nella <b>console</b>
(il riquadro scuro sotto l'editor).</p>

<p><b>Importante: il testo vuole le virgolette.</b> Tutto quello che Python deve stampare
<i>così com'è</i> lo scrivi tra virgolette: <code>"…"</code>. Un testo così si chiama
<b>stringa</b> (una «catena» di caratteri). Le virgolette dicono a Python:
«Questo è testo, non un comando.»</p>

<pre><code>print("Ciao mondo!")</code></pre>

<p>Se togliessi le virgolette (<code>print(Ciao)</code>), Python crederebbe che
<code>Ciao</code> sia un nome che dovrebbe conoscere – e ti segnalerebbe un errore. Le
virgolette, tra l'altro, <b>non</b> vengono stampate.</p>

<p>Niente paura, qui non si rompe niente. Cambia il testo e premi
<b>Esegui</b> (oppure Ctrl + Invio).</p>`,
    taskHtml:
      "Cambia il testo: stampa un <b>messaggio tuo</b> – il tuo motto, un saluto o la tua frase preferita. Ricordati le virgolette!",
    hints: [
      'Scrivi il tuo testo tra le virgolette: <code>print("…")</code>.',
      'Per esempio: <code>print("Oggi imparo Python!")</code>',
    ],
    starterCode: py`
      print("Ciao mondo!")
    `,
    solution: py`
      print("Oggi imparo Python!")
    `,
    expert: {
      html: `
<p>Puoi stampare <b>più cose insieme</b> separandole con delle virgole – Python ci mette in mezzo
uno spazio da solo: <code>print("Ciao", "mondo")</code>. E <code>\\n</code>, <i>dentro</i> un
testo, fa andare a capo.</p>
<p><b>Bonus:</b> scrivi un <code>print()</code> che stampi più parti separate da virgole e che,
grazie a <code>\\n</code>, occupi almeno due righe.</p>`,
      solution: py`
        print("Ciao", "mondo!", "\nChe bello averti qui.")
      `,
      feedback: {
        printComma:
          'Stampa più parti in <b>un solo</b> <code>print()</code>, separate da virgole: <code>print("A", "B")</code>.',
        newline: "Usa <code>\\n</code> dentro un testo per andare a capo.",
      },
    },
  },

  "s1-l2": {
    title: "Ricordare con le variabili",
    story: "La stazione ha perso la memoria. Insegnale a ricordarsi qualcosa – comincia dal tuo numero preferito.",
    intro: `
<p>Una <b>variabile</b> è un contenitore con un nome. Con il segno uguale <code>=</code> ci metti
dentro qualcosa (si dice «assegnare»). Poi puoi usare il nome per riprenderti il valore.</p>

<pre><code>numero_preferito = 7
print(numero_preferito)</code></pre>

<p>Il <b>nome</b> sta a sinistra del <code>=</code>, il <b>valore</b> a destra. Qui il
<code>=</code> significa «riceve il valore» – non «è uguale a» come in matematica.</p>

<p><b>Numero o testo?</b> I numeri li scrivi <i>senza</i> virgolette (<code>7</code>).
E per stampare la <i>variabile</i>, tra le parentesi metti il suo nome <b>senza</b> virgolette:
<code>print(numero_preferito)</code> stampa <code>7</code>. <code>print("numero_preferito")</code>
invece stamperebbe semplicemente la parola.</p>`,
    taskHtml:
      "Salva il tuo <b>numero preferito</b> nella variabile e stampalo con <code>print()</code> – il nome della variabile va senza virgolette!",
    hints: [
      "Prima assegni: <code>numero_preferito = 42</code>",
      "Poi stampi: <code>print(numero_preferito)</code>",
    ],
    starterCode: py`
      numero_preferito = 0
      # Metti il tuo numero preferito e stampalo
    `,
    solution: py`
      numero_preferito = 42
      print(numero_preferito)
    `,
    feedback: {
      printName:
        "Stampa la <b>variabile</b>: il suo nome va tra le parentesi <b>senza</b> virgolette, cioè <code>print(numero_preferito)</code>.",
      needNumber: "Salva un <b>numero</b> – senza virgolette, per esempio <code>numero_preferito = 7</code>.",
    },
    expert: {
      html: `
<p>Una variabile può <b>cambiare</b>. <code>punti = punti + 50</code> prende il valore vecchio,
ci aggiunge 50 e rimette il risultato nello stesso contenitore. I nomi possono contenere lettere,
cifre e <code>_</code>, ma non possono iniziare con una cifra.</p>
<p><b>Bonus:</b> crea <code>punti = 100</code>, poi aumenta il valore di 50 e stampalo.</p>`,
      solution: py`
        punti = 100
        punti = punti + 50
        print(punti)
      `,
      feedback: {
        selfUpdate: "Aumenta il valore con <code>punti = punti + 50</code> (o, più in breve, <code>punti += 50</code>).",
        result150: "Alla fine dovrebbe uscire 150.",
      },
    },
  },

  "s1-l3": {
    title: "Il calcola-risparmi",
    story: "Nel computer di bordo è rimasto incastrato un vecchio calcolo dell'equipaggio. Fagli vedere che la stazione sa di nuovo fare i conti.",
    intro: `
<p>Python è un'ottima calcolatrice. Puoi fare i conti con <code>+</code> (più),
<code>-</code> (meno), <code>*</code> (per) e <code>/</code> (diviso) – quindi si usa
<code>*</code> al posto di «×» e <code>/</code> al posto di «÷».</p>

<p><b>Importante:</b> i numeri li scrivi senza virgolette. Altrimenti Python li tratta come testo
e non fa il calcolo (<code>"5" + "3"</code> darebbe <code>"53"</code> invece di <code>8</code>!).</p>

<pre><code>a_settimana = 5
settimane = 8
print(a_settimana * settimane)</code></pre>

<p>Il bello delle variabili: se un valore cambia, il programma rifà il calcolo da solo.
Mia ogni settimana mette da parte un po' di paghetta. Fai il calcolo con le sue variabili.</p>`,
    taskHtml:
      "Quanto ha risparmiato Mia dopo <b>8 settimane</b>, se mette da parte <b>5&nbsp;€</b> a settimana? Calcolalo con le due variabili e stampa il risultato. (Per controllo: fa 40.)",
    hints: ["Per moltiplicare si usa <code>*</code>.", "<code>print(a_settimana * settimane)</code>"],
    starterCode: py`
      a_settimana = 5
      settimane = 8
      # Calcola il risparmio e stampalo
    `,
    solution: py`
      a_settimana = 5
      settimane = 8
      print(a_settimana * settimane)
    `,
    feedback: {
      needMult: "Lascia fare il calcolo a Python: per moltiplicare si usa <code>*</code>.",
      useVars:
        "Calcola con le <b>variabili</b> invece che con numeri fissi: <code>a_settimana * settimane</code>. Così il risultato è giusto anche se un valore cambia.",
      result40: "Il risultato dovrebbe essere 40. Controlla il tuo calcolo.",
    },
    expert: {
      html: `
<p>Dopo quante settimane <b>intere</b> Mia arriva a 100&nbsp;€? L'operatore <code>//</code>
divide e taglia via i decimali (<code>100 // 5</code> fa 20).</p>
<p><b>Bonus:</b> crea <code>obiettivo = 100</code> e calcola con <code>//</code> quante settimane
servono a Mia.</p>`,
      solution: py`
        a_settimana = 5
        obiettivo = 100
        print(obiettivo // a_settimana, "settimane")
      `,
      feedback: {
        floorDiv: "Usa <code>//</code> per dividere senza resto: <code>obiettivo // a_settimana</code>.",
        result20: "Dovrebbero uscire 20 settimane.",
      },
    },
  },

  "s1-l4": {
    title: "Storie assurde",
    story: "La radio capta solo frammenti di parole: un animale, un luogo. Trasformali nel messaggio radio più assurdo della luna di ghiaccio.",
    intro: `
<p>Come fai a mettere il contenuto di una variabile <i>dentro</i> un testo? Una stringa normale
viene stampata alla lettera: <code>print("Il mio animale: animale")</code> scrive davvero
«Il mio animale: animale». La soluzione è una <b>f-string</b>: metti una <code>f</code> subito
prima delle virgolette e scrivi la variabile tra parentesi graffe <code>{ }</code>.</p>

<pre><code>animale = "gatto"
print(f"Un {animale} impara Python!")</code></pre>

<p>La <code>f</code> sta per «format». Solo i nomi tra <code>{ }</code> vengono sostituiti dal
loro valore, il resto resta testo normale. Così costruisci in un attimo frasi, storie o schede.</p>`,
    taskHtml:
      "Scrivi con una <b>f-string</b> una frase assurda in cui compaiano <code>animale</code> e <code>luogo</code>.",
    hints: [
      'Comincia con <code>print(f"...")</code> – non dimenticare la <code>f</code>!',
      "Metti le variabili tra parentesi graffe: <code>{animale}</code> e <code>{luogo}</code>.",
    ],
    starterCode: py`
      animale = "gatto"
      luogo = "luna"
      # Costruisci una frase buffa con una f-string
    `,
    solution: py`
      animale = "gatto"
      luogo = "luna"
      print(f"Un {animale} balla sulla {luogo}!")
    `,
    feedback: {
      twoFields:
        "Metti <b>tutte e due</b> le variabili tra parentesi graffe nella tua f-string: <code>{animale}</code> e <code>{luogo}</code>.",
      valuesInOutput:
        "Nell'output devono comparire i valori di <code>animale</code> e <code>luogo</code> – con una f-string e le parentesi graffe.",
    },
    expert: {
      html: `
<p>Dentro le <code>{ }</code> puoi perfino <b>fare calcoli</b>: <code>print(f"{3 * 4} gol")</code>
stampa «12 gol».</p>
<p><b>Bonus:</b> crea <code>vittorie = 5</code> e stampa con una f-string quanti punti sono
(3 punti a vittoria) – con il calcolo <i>dentro</i> le parentesi graffe.</p>`,
      solution: py`
        vittorie = 5
        print(f"{vittorie} vittorie fanno {vittorie * 3} punti!")
      `,
      feedback: {
        calcInBraces: "Fai il calcolo direttamente tra le parentesi graffe: <code>{vittorie * 3}</code>.",
        result15: "Con 5 vittorie dovrebbero uscire 15 punti.",
      },
    },
  },

  "s1-l5": {
    title: "Botta e risposta",
    story: "La stazione vuole sapere con chi ha a che fare. Fai in modo che ti chieda il nome – e che ti saluti.",
    intro: `
<p><code>input()</code> mette in pausa il programma, mostra una domanda e aspetta che tu scriva
qualcosa e prema Invio. La risposta conviene salvarla in una variabile.</p>

<pre><code>nome = input("Come ti chiami? ")
print("Ciao " + nome)</code></pre>

<p>Il testo tra parentesi è la domanda (il «prompt»). Con <code>+</code> puoi <b>attaccare</b>
due testi uno all'altro – fai attenzione allo spazio in <code>"Ciao "</code>.</p>

<p><b>Ricorda:</b> <code>input()</code> restituisce <i>sempre</i> testo – anche se scrivi un
numero. Come trasformarlo in un numero vero e proprio lo impari nel capitolo 2.</p>`,
    taskHtml:
      "Chiedi il nome e poi stampa un <b>saluto personale</b> in cui compaia il nome. Quando esegui il programma, giù nella console compare un campo in cui scrivere.",
    hints: [
      "La risposta si trova nella variabile <code>nome</code>.",
      'Per attaccare i testi: <code>print("Ciao " + nome)</code>',
    ],
    starterCode: py`
      nome = input("Come ti chiami? ")
      # Saluta la persona in modo personale
    `,
    solution: py`
      nome = input("Come ti chiami? ")
      print("Ciao " + nome + ", piacere di conoscerti!")
    `,
    feedback: {
      nameInGreeting:
        'Nel saluto deve comparire il nome inserito: <code>print("Ciao " + nome)</code> – <code>nome</code> senza virgolette.',
    },
    expert: {
      html: `
<p><b>Bonus:</b> chiedi <b>due</b> cose (per esempio il nome e la città in cui abiti) e unisci le
risposte in una frase con una <b>f-string</b> – si legge meglio che con il <code>+</code>.</p>`,
      solution: py`
        nome = input("Nome: ")
        citta = input("Dove abiti? ")
        print(f"{nome} da {citta} – che forte!")
      `,
      feedback: { bothInSentence: "Tutte e due le risposte devono comparire nella tua frase." },
    },
  },

  "s1-boss1": {
    title: "Il tuo generatore di profili",
    story: "Il portello di sicurezza fa passare solo i membri dell'equipaggio con un tesserino. Costruisci un generatore di profili, così la stazione impara a conoscerti.",
    intro: `
<p>È il momento di mettere tutto insieme! Fai qualche domanda e con le risposte costruisci una
bella scheda profilo. Ti servono <code>input()</code> (chiedere), le variabili (ricordare) e le
f-string (stampare).</p>

<pre><code>nome = input("Nome: ")
print(f"Nome: {nome}")</code></pre>

<p>Consiglio: inizia con una domanda, prova, e poi aggiungine altre un passo alla volta.</p>`,
    taskHtml:
      "Chiedi almeno <b>tre</b> cose con <code>input()</code> e stampa un <b>profilo</b> in cui compaiano tutte le risposte – con le f-string.",
    hints: [
      'Aggiungi sotto un altro <code>input(…)</code>, per esempio <code>animale = input("Animale preferito: ")</code>.',
      'Una riga per ogni risposta: <code>print(f"Nome: {nome}")</code>',
    ],
    starterCode: py`
      nome = input("Nome: ")
      hobby = input("Hobby preferito: ")
      # Chiedi un'altra cosa e stampa un profilo con le f-string
    `,
    solution: py`
      nome = input("Nome: ")
      hobby = input("Hobby preferito: ")
      animale = input("Animale preferito: ")
      print("--- PROFILO ---")
      print(f"Nome:    {nome}")
      print(f"Hobby:   {hobby}")
      print(f"Animale: {animale}")
    `,
    feedback: {
      allAnswers: "Nel profilo devono comparire <b>tutte</b> le risposte. Stampa ogni variabile con una f-string.",
    },
    expert: {
      html: `
<p>Rendi la scheda più bella: una cornice di caratteri fa la sua figura. <code>"=" * 20</code>
crea una linea di 20 segni di uguale.</p>
<p><b>Bonus:</b> metti una linea così sopra e sotto il tuo profilo (lunga almeno 10 caratteri).</p>`,
      solution: py`
        nome = input("Nome: ")
        hobby = input("Hobby preferito: ")
        animale = input("Animale preferito: ")
        print("=" * 24)
        print(f"  PROFILO: {nome}")
        print(f"  Hobby: {hobby} · Animale: {animale}")
        print("=" * 24)
      `,
      feedback: { frame: 'Stampa una linea sopra e sotto il profilo, per esempio <code>print("=" * 20)</code>.' },
    },
  },

  // ================================================================== CAPITOLO 2
  "s2-l1": {
    title: "Se … allora …",
    story: "La porta dell'hangar si apre solo con abbastanza punti energia. Insegnale anche a dire di no con gentilezza.",
    intro: `
<p>I programmi devono <b>decidere</b>. Con <code>if</code> («se») controlli una condizione:
se è vera, viene eseguito il blocco indentato qui sotto. <code>else</code> («altrimenti») è
l'altro caso.</p>

<pre><code>punti = 120
if punti &gt;= 100:
    print("Livello superato!")
else:
    print("Quasi! Riprova.")</code></pre>

<p><b>Su due regole Python non perdona:</b> dopo la condizione ci vogliono i <b>due punti</b>
<code>:</code>, e le righe che ne fanno parte vanno <b>indentate</b>, cioè spostate verso destra
(4 spazi – il tasto Tab lo fa per te).</p>

<p>Puoi confrontare con <code>==</code> (uguale), <code>!=</code> (diverso),
<code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> e <code>&gt;=</code>.
Attenzione: <code>==</code> chiede «è uguale?», <code>=</code> invece assegna.</p>

<p><b>Novità: inserire numeri.</b> <code>input()</code> restituisce sempre testo. Con
<code>int(…)</code> lo trasformi in un numero intero, che Python può confrontare e usare nei calcoli:</p>
<pre><code>punti = int(input("Quanti punti? "))</code></pre>`,
    taskHtml:
      "Aggiungi un blocco <code>else</code> che stampi un messaggio di incoraggiamento quando i punti sono <b>meno di 100</b>. Prova il programma con 120 e con 50.",
    hints: [
      "<code>else:</code> sta allineato con l'<code>if</code>, alla stessa distanza dal bordo sinistro – e ha i due punti.",
      'La riga sotto va indentata: <code>    print("Quasi! Continua ad allenarti!")</code>',
    ],
    starterCode: py`
      punti = int(input("Quanti punti hai? "))
      if punti >= 100:
          print("Livello superato! 🎉")
      # Aggiungi qui il caso else
    `,
    solution: py`
      punti = int(input("Quanti punti hai? "))
      if punti >= 100:
          print("Livello superato! 🎉")
      else:
          print("Quasi! Continua ad allenarti!")
    `,
    feedback: {
      noElseOutput: "Con 50 punti non compare ancora niente. Stampa un messaggio nel blocco <code>else</code>.",
      sameOutput:
        "Con 120 e con 50 punti esce la stessa cosa. Nel blocco <code>else</code> ci vuole un messaggio diverso.",
      boundary:
        "Con 100 punti esatti il livello è superato – lascia la condizione <code>punti &gt;= 100</code> così com'è.",
    },
    expert: {
      html: `
<p>Per più di due casi c'è <code>elif</code> («altrimenti se»). Python controlla le condizioni
dall'alto verso il basso e prende la prima che è vera.</p>
<p><b>Bonus:</b> costruisci tre livelli: da 100 punti in su «Livello superato», da 50 punti
«Ci sei quasi», altrimenti «Continua ad allenarti».</p>`,
      solution: py`
        punti = int(input("Quanti punti hai? "))
        if punti >= 100:
            print("Livello superato! 🎉")
        elif punti >= 50:
            print("Ci sei quasi!")
        else:
            print("Continua ad allenarti!")
      `,
      feedback: { threeCases: "Con 120, 70 e 10 punti deve comparire ogni volta un messaggio diverso." },
    },
  },

  "s2-l2": {
    title: "Vero o falso?",
    story: "I sensori dell'hangar ormai rispondono solo True o False. Scopri se capisci la loro lingua.",
    intro: `
<p>Ogni confronto ha un risultato: <code>True</code> (vero) o <code>False</code> (falso).
Si chiama <b>valore booleano</b> (in inglese <i>boolean</i>). È proprio con questo che
<code>if</code> prende le sue decisioni.</p>

<pre><code>print(10 &gt; 3)    # True
print(5 == 6)   # False</code></pre>

<p>Tutto quello che sta dopo <code>#</code> è un <b>commento</b> – una nota per le persone,
che Python salta.</p>`,
    taskHtml:
      "Stampa i risultati di <b>almeno tre confronti diversi</b>. Almeno uno deve dare <code>False</code>.",
    hints: [
      "Stampa direttamente i confronti: <code>print(7 &gt; 2)</code>",
      "Per avere <code>False</code>, per esempio: <code>print(5 == 6)</code>",
    ],
    starterCode: py`
      # Fai controllare a Python almeno tre confronti
      print(10 > 3)
    `,
    solution: py`
      print(10 > 3)
      print(5 == 5)
      print("mela" == "pera")
    `,
    feedback: {
      threeCompares:
        "Ti servono almeno tre confronti, per esempio con <code>&gt;</code>, <code>&lt;</code> e <code>==</code>.",
      printResults: "Stampa ogni risultato con <code>print(…)</code>.",
      needFalse: "Almeno un confronto deve dare <code>False</code>, per esempio <code>print(5 == 6)</code>.",
    },
    expert: {
      html: `
<p>Le condizioni si possono <b>combinare</b>: <code>and</code> (devono essere vere tutte e due),
<code>or</code> (ne basta una) e <code>not</code> (rovescia il risultato).</p>
<p><b>Bonus:</b> crea <code>eta = 12</code> e controlla con <code>and</code> se l'età è tra 10
e 15. Stampa il risultato.</p>`,
      solution: py`
        eta = 12
        print(eta >= 10 and eta <= 15)
      `,
      feedback: {
        useAnd: "Unisci i due confronti con <code>and</code>: <code>eta &gt;= 10 and eta &lt;= 15</code>.",
        printBool: "Stampa il risultato (<code>True</code> o <code>False</code>) con <code>print(…)</code>.",
      },
    },
  },

  "s2-l3": {
    title: "Decide il caso",
    story: "Al gioco del rover dell'equipaggio manca il dado. Lumo ne vorrebbe uno davvero casuale.",
    intro: `
<p>Il caso rende i giochi emozionanti. Python ha degli strumenti già pronti nei <b>moduli</b> – li
prendi con <code>import</code>. Il modulo <code>random</code> sa tirare i dadi.</p>

<pre><code>import random
numero = random.randint(1, 6)
print("Hai tirato:", numero)</code></pre>

<p><code>random.randint(1, 6)</code> ti dà un numero intero a caso da 1 a 6 (estremi compresi).
<code>import random</code> lo scrivi una volta sola, all'inizio del programma. Con la virgola,
dentro <code>print</code> puoi mescolare testo e numeri.</p>`,
    taskHtml: "Costruisci un <b>dado</b>: stampa un numero a caso da 1 a 6. Esegui il programma più volte!",
    hints: [
      "<code>import random</code> c'è già, in cima.",
      "<code>numero = random.randint(1, 6)</code> e poi <code>print(numero)</code>.",
    ],
    starterCode: py`
      import random
      # Tira un numero da 1 a 6 e stampalo
    `,
    solution: py`
      import random
      numero = random.randint(1, 6)
      print("Hai tirato:", numero)
    `,
    feedback: {
      useRandint: "Usa <code>random.randint(1, 6)</code> per avere un numero a caso.",
      range16: "Il numero del dado deve essere tra 1 e 6 e stare alla fine dell'output.",
      notRandom: "Il numero è sempre lo stesso. Stampa il risultato di <code>random.randint(1, 6)</code>.",
    },
    expert: {
      html: `
<p>Con <code>random.choice([...])</code> scegli a caso un elemento <b>da una lista</b> – perfetto
per una ruota della fortuna.</p>
<p><b>Bonus:</b> costruisci una ruota della fortuna con almeno <b>quattro</b> premi inventati da te.</p>`,
      solution: py`
        import random
        premi = ["Niente 😅", "Un gelato", "5 punti", "Jolly", "Primo premio!"]
        print("Hai vinto:", random.choice(premi))
      `,
      feedback: {
        useChoice: "Usa <code>random.choice(premi)</code> per estrarre un premio a caso.",
        fourPrizes: 'La tua lista ha bisogno di almeno quattro premi: <code>["A", "B", "C", "D"]</code>.',
        notRandom: "Il risultato è sempre lo stesso. Stampa quello che estrae <code>random.choice(…)</code>.",
      },
    },
  },

  "s2-l4": {
    title: "Il beat in loop",
    story: "Gli altoparlanti dell'hangar gracchiano di nuovo. È ora del primo beat dopo anni – fallo ripetere!",
    intro: `
<p>Invece di copiare una riga quattro volte, la fai <b>ripetere</b>. Ed è proprio quello che fa il
ciclo <code>for</code>:</p>

<pre><code>for i in range(4):
    print("Bum - Ciak")</code></pre>

<p><code>range(4)</code> conta <code>0, 1, 2, 3</code> – quindi quattro giri. La variabile
<code>i</code> è il contatore del giro in corso. Anche qui valgono le solite regole: i
<b>due punti</b> alla fine, e la parte da ripetere è <b>indentata</b>.</p>

<p><b>Con l'altoparlante della stazione il tuo beat si sente davvero.</b> Per farlo prendi
<code>drum</code> (la batteria) e <code>note</code> (le note) dal modulo <code>station</code>:</p>

<pre><code>from station import drum, note

for i in range(4):
    drum("kick")
    drum("snare")
note("do5", 2)</code></pre>

<p>Per la batteria ci sono <code>"kick"</code>, <code>"snare"</code>, <code>"hihat"</code>,
<code>"clap"</code> e <code>"tom"</code>. Le note le scrivi così: <code>"do4"</code>,
<code>"re4"</code>, <code>"mi4"</code> … oppure <code>"C4"</code>, <code>"D4"</code>,
<code>"E4"</code> … Il numero dopo la virgola è la durata in battiti (senza numero: un battito).</p>`,
    taskHtml:
      "Costruisci un <b>beat</b> con un <b>ciclo <code>for</code></b> che si ripete <b>almeno tre volte</b> – da ascoltare con <code>drum()</code> o <code>note()</code>, oppure come testo con <code>print()</code>. Il comando compare una volta sola nel codice: a ripeterlo ci pensa il ciclo.",
    hints: [
      '<code>for i in range(4):</code> e sotto, indentato, <code>drum("kick")</code> oppure <code>print(…)</code>.',
      "Per il suono, in cima ci vuole <code>from station import drum, note</code> – c'è già.",
    ],
    starterCode: py`
      from station import drum, note

      # Costruisci il tuo beat con un ciclo for
      drum("kick")
    `,
    solution: py`
      from station import drum, note

      for i in range(4):
          drum("kick")
          drum("hihat")
          drum("snare")
          drum("hihat")
      note("do5", 2)
    `,
    feedback: {
      useRange: "Usa <code>range(…)</code>, per esempio <code>for i in range(4):</code>.",
      printInLoop:
        "Il comando (<code>drum</code>, <code>note</code> o <code>print</code>) deve stare <b>indentato</b> sotto la riga del <code>for</code>, così viene ripetuto.",
      threeTimes:
        "Il tuo beat deve suonare almeno tre volte (oppure dare tre righe). Fai contare <code>range(…)</code> fino a un numero più alto.",
    },
    expert: {
      html: `
<p>Il contatore <code>i</code> torna utile: con lui puoi numerare quello che stampi.
<code>range(1, 6)</code> conta da 1 a 5.</p>
<p><b>Bonus:</b> stampa con un ciclo da «Round 1» a «Round 5».</p>`,
      solution: py`
        for i in range(1, 6):
            print(f"Round {i}")
      `,
      feedback: {
        numbered:
          'Le righe devono essere numerate da 1 a 5: <code>print(f"Round {i}")</code> con <code>range(1, 6)</code>.',
      },
    },
  },

  "s2-l5": {
    title: "Motivi che crescono",
    story: "Le luci di segnalazione sul portone dell'hangar devono mostrare un motivo che cresce. Per ora ogni fila si accende uguale – si può fare di meglio.",
    intro: `
<p>Con <code>*</code> non fai solo calcoli: puoi anche <b>moltiplicare</b> un testo.
<code>"ab" * 3</code> dà <code>"ababab"</code>. Insieme a un ciclo e al contatore
<code>i</code> nascono motivi che crescono.</p>

<pre><code>for i in range(1, 4):
    print("#" * i)</code></pre>

<p><code>range(1, 4)</code> conta da 1 a 3. Al primo giro <code>i</code> vale quindi 1, poi 2,
poi 3 – e altrettanti caratteri finiscono nella riga.</p>`,
    taskHtml:
      "Il motivo qui sotto è ancora noioso: tutte le righe sono lunghe uguali. Cambia il programma in modo che ogni riga sia <b>più lunga di quella prima</b>. Il simbolo lo scegli tu.",
    hints: [
      '<code>"#" * 3</code> dà <code>###</code>. E allora che cosa dà <code>"#" * i</code>?',
      'Sostituisci il 3 fisso con il contatore: <code>print("⭐" * i)</code>',
    ],
    starterCode: py`
      # Il motivo è ancora noioso: tutte le righe sono lunghe uguali.
      for i in range(1, 6):
          print("⭐" * 3)
    `,
    solution: py`
      for i in range(1, 6):
          print("⭐" * i)
    `,
    feedback: {
      grow: 'Le righe sono ancora lunghe uguali. Fai crescere la lunghezza con il contatore: <code>"⭐" * i</code>.',
    },
    expert: {
      html: `
<p>Con degli spazi all'inizio puoi spostare un motivo verso destra – così nasce una
<b>piramide</b>. Suggerimento: <code>" " * (5 - i)</code> per lo spazio vuoto e
<code>"*" * (2 * i - 1)</code> per le stelle.</p>
<p><b>Bonus:</b> disegna una piramide di almeno quattro righe che si allarga verso il basso.</p>`,
      solution: py`
        for i in range(1, 6):
            print(" " * (5 - i) + "*" * (2 * i - 1))
      `,
      feedback: {
        indent: `Ogni riga deve avere meno spazi all'inizio di quella prima: <code>" " * (5 - i)</code>.`,
        wider: "Le stelle devono aumentare da una riga all'altra.",
      },
    },
  },

  "s2-l6": {
    title: "Finché …",
    story: "Il rover è sulla rampa, pronto a partire. Manca solo il conto alla rovescia.",
    intro: `
<p>Il ciclo <code>while</code> ripete qualcosa <b>finché</b> una condizione è vera – perfetto
quando non sai in anticipo quante volte.</p>

<pre><code>numero = 3
while numero &gt; 0:
    print(numero)
    numero = numero - 1
print("Via!")</code></pre>

<p><b>Importantissimo:</b> nel ciclo deve cambiare qualcosa che prima o poi renda la condizione
<code>False</code> – qui <code>numero</code> diventa sempre più piccolo. Se non succede, il ciclo
gira <i>all'infinito</i>. Niente panico: PyQuest se ne accorge e ferma il programma (oppure premi
<b>Ferma</b>).</p>`,
    taskHtml:
      "Fai partire un <b>conto alla rovescia da 10 a 1</b> con un ciclo <code>while</code> e alla fine stampa <code>Decollo! 🚀</code>.",
    hints: [
      "<code>while numero &gt; 0:</code> – e sotto, indentato, <code>print(numero)</code>.",
      "Fai diminuire il numero nel ciclo: <code>numero = numero - 1</code>. Altrimenti gira all'infinito!",
    ],
    starterCode: py`
      numero = 10
      # Conta alla rovescia da 10 a 1 con un ciclo while
      # e poi stampa "Decollo! 🚀"
    `,
    solution: py`
      numero = 10
      while numero > 0:
          print(numero)
          numero = numero - 1
      print("Decollo! 🚀")
    `,
    feedback: {
      countdown: "L'output deve contare alla rovescia da 10 a 1 – un numero per riga.",
      finalLine:
        "Dopo il ciclo stampa ancora «Decollo! 🚀» – <b>non</b> indentato, così compare una volta sola.",
    },
    expert: {
      html: `
<p>In un ciclo puoi anche <b>accumulare</b> qualcosa: una seconda variabile cresce a ogni giro.</p>
<p><b>Bonus:</b> calcola con un ciclo <code>while</code> la somma di tutti i numeri da 1 a 10 e
stampala.</p>`,
      solution: py`
        numero = 1
        somma = 0
        while numero <= 10:
            somma = somma + numero
            numero = numero + 1
        print("Somma:", somma)
      `,
      feedback: {
        accumulate:
          "Ti servono due variabili che cambiano: il contatore e la somma (<code>somma = somma + numero</code>).",
        result55: "La somma da 1 a 10 fa 55. Il tuo ciclo arriva fino a 10 compreso?",
      },
    },
  },

  "s2-boss2": {
    title: "Indovina il numero",
    story: "Il portone dell'hangar è protetto da un codice numerico, e la serratura dice solo «troppo alto» o «troppo basso». Costruisci il gioco e scopri il codice!",
    intro: `
<p>Il grande classico! Il computer pensa a un numero e tu provi a indovinarlo – con gli indizi
«troppo alto» o «troppo basso», finché non lo trovi. Ti serve tutto quello che hai visto in
questo capitolo: <code>random</code>, <code>while</code>, <code>int(input())</code> e
<code>if</code>/<code>elif</code>.</p>

<p>Il ciclo <code>while tentativo != segreto:</code> gira finché il tentativo <b>non</b> è giusto.
Dentro manca ancora la parte più importante: gli indizi.</p>`,
    taskHtml:
      "Completa il gioco: nel ciclo deve comparire <b>«troppo alto»</b> o <b>«troppo basso»</b>, a seconda del tentativo. Se il tentativo è giusto, niente indizio. Poi fatti una partita!",
    hints: [
      "<code>if tentativo &gt; segreto:</code> → troppo alto.",
      "<code>elif tentativo &lt; segreto:</code> → troppo basso. Tutti e due vanno indentati nel ciclo, sotto la riga con <code>input</code>.",
    ],
    starterCode: py`
      import random
      segreto = random.randint(1, 20)
      tentativo = 0

      while tentativo != segreto:
          tentativo = int(input("Il tuo numero (1-20): "))
          # Dai qui un indizio: troppo alto o troppo basso?

      print("Beccato! 🎉")
    `,
    solution: py`
      import random
      segreto = random.randint(1, 20)
      tentativo = 0

      while tentativo != segreto:
          tentativo = int(input("Il tuo numero (1-20): "))
          if tentativo > segreto:
              print("troppo alto")
          elif tentativo < segreto:
              print("troppo basso")

      print("Beccato! 🎉")
    `,
    feedback: {
      tooHigh:
        "Con un tentativo troppo grande non compare ancora nessun indizio. Controlla con <code>if tentativo &gt; segreto:</code>.",
      tooLow:
        "Con un tentativo troppo piccolo non compare ancora nessun indizio. Controlla con <code>elif tentativo &lt; segreto:</code>.",
      highLow: "Per i tentativi troppo alti e per quelli troppo bassi compare lo stesso indizio. Stampa indizi diversi.",
      winNoHint:
        "Con il tentativo giusto non deve comparire né «troppo alto» né «troppo basso». Usa <code>elif tentativo &lt; segreto:</code> invece di <code>else:</code>.",
    },
    expert: {
      html: `
<p><b>Bonus:</b> conta i tentativi e alla fine stampa quanti sono stati – per esempio
«Beccato in 3 tentativi!». Suggerimento: prima del ciclo crea <code>tentativi = 0</code> e
aumenta il valore a ogni tentativo.</p>`,
      solution: py`
        import random
        segreto = random.randint(1, 20)
        tentativo = 0
        tentativi = 0

        while tentativo != segreto:
            tentativo = int(input("Il tuo numero (1-20): "))
            tentativi = tentativi + 1
            if tentativo > segreto:
                print("troppo alto")
            elif tentativo < segreto:
                print("troppo basso")

        print(f"Beccato in {tentativi} tentativi! 🎉")
      `,
      feedback: {
        counter: "Nel ciclo aumenta un contatore: <code>tentativi = tentativi + 1</code>.",
        count3:
          "Con i tentativi 12, 3 e 7, alla fine devono risultare 3 tentativi. Conti ogni tentativo esattamente una volta?",
        count1: "Chi indovina subito ha bisogno di 1 tentativo. Il tuo contatore parte da 0?",
      },
    },
  },

  // ================================================================== CAPITOLO 3
  "s3-l1": {
    title: "Liste – la tua collezione",
    story: "Nella sala esperimenti è tutto sottosopra. Comincia con una lista – campioni, musica per il turno di notte, quello che vuoi.",
    intro: `
<p>Una <b>lista</b> tiene insieme tanti valori in una sola variabile – una playlist, una squadra,
le cose da mettere in valigia. La scrivi tra parentesi quadre <code>[ ]</code>, con gli elementi
separati da virgole.</p>

<pre><code>playlist = ["Canzone A", "Canzone B", "Canzone C"]
print(playlist)
print(playlist[0])   # il primo elemento</code></pre>

<p>Ai singoli elementi arrivi attraverso la loro <b>posizione</b> – e si conta da <code>0</code>!
<code>playlist[0]</code> è il primo elemento, <code>playlist[1]</code> il secondo.</p>`,
    taskHtml:
      "Crea una <b>lista</b> (una playlist, una squadra, i tuoi piatti preferiti …) con almeno 3 elementi. Stampa la lista intera e poi il <b>primo</b> elemento, su una riga a parte.",
    hints: [
      'Parentesi quadre, elementi separati da virgole: <code>cibi = ["Pizza", "Lasagne", "Sushi"]</code>',
      "Il primo elemento lo prendi con <code>cibi[0]</code>.",
    ],
    starterCode: py`
      # Crea una lista con almeno 3 cose
      # Stampa la lista e poi il primo elemento
    `,
    solution: py`
      playlist = ["Canzone A", "Canzone B", "Canzone C"]
      print(playlist)
      print(playlist[0])
    `,
    feedback: {
      printList: "Stampa tutta la lista con <code>print(…)</code>.",
      printFirst:
        "Poi stampa il primo elemento su una riga a parte. Le posizioni si contano da 0: <code>lista[0]</code>.",
    },
    expert: {
      html: `
<p><code>len(lista)</code> ti dice quanti elementi ci sono in una lista. E con
<code>lista[-1]</code> peschi dalla fine – è l'ultimo elemento.</p>
<p><b>Bonus:</b> stampa quanti elementi ha la tua lista e il suo ultimo elemento con <code>[-1]</code>.</p>`,
      solution: py`
        playlist = ["Canzone A", "Canzone B", "Canzone C"]
        print("Numero di canzoni:", len(playlist))
        print("Ultima:", playlist[-1])
      `,
      feedback: {
        useLen: "Usa <code>len(lista)</code> per sapere quanti elementi ci sono.",
        useNeg: "L'ultimo elemento lo prendi con <code>lista[-1]</code>.",
        printBoth: "Stampa quanti elementi ci sono e l'ultimo elemento.",
      },
    },
  },

  "s3-l2": {
    title: "Modificare le liste",
    story: "Sono arrivate nuove scorte. Aggiungile alla lista e metti ordine nel caos.",
    intro: `
<p>Le liste si possono cambiare anche dopo. Con un punto ci attacchi dei <b>metodi</b> – piccoli
comandi che appartengono alla lista:</p>

<pre><code>squadra = ["Yara", "Noah"]
squadra.append("Lena")   # aggiunge in fondo
squadra.sort()           # mette in ordine alfabetico
print(squadra)</code></pre>

<p><code>.append(x)</code> aggiunge <code>x</code> in fondo, <code>.sort()</code> mette in ordine
la lista. Questi metodi modificano direttamente la lista – per questo prima del punto c'è il nome
della lista.</p>`,
    taskHtml:
      "Aggiungi alla lista almeno un nome con <code>.append(…)</code>, poi <b>ordinala</b> con <code>.sort()</code> e stampala.",
    hints: [
      'Aggiungere: <code>squadra.append("Nome")</code>',
      "Ordinare: <code>squadra.sort()</code>, poi <code>print(squadra)</code>",
    ],
    starterCode: py`
      squadra = ["Yara", "Noah"]
      # Aggiungi qualcuno, ordina la lista e stampala
    `,
    solution: py`
      squadra = ["Yara", "Noah"]
      squadra.append("Lena")
      squadra.sort()
      print(squadra)
    `,
    feedback: {
      useAppend: 'Aggiungi qualcuno con <code>squadra.append("Nome")</code>.',
      useSort: "Ordina la lista con <code>squadra.sort()</code>.",
      sortNone:
        "Nell'output compare <code>None</code>: <code>squadra.sort()</code> ordina la lista direttamente e non restituisce niente. Scrivi solo <code>squadra.sort()</code>, non <code>squadra = squadra.sort()</code>.",
      threeNames: "Alla fine nella lista devono esserci almeno 3 nomi.",
      sorted:
        "Stampa la lista <b>ordinata</b>. Chiami <code>.sort()</code> <b>dopo</b> aver aggiunto i nomi e prima del <code>print</code>?",
    },
    expert: {
      html: `
<p>Altri metodi: <code>.remove("x")</code> toglie un elemento, <code>.reverse()</code> inverte
l'ordine.</p>
<p><b>Bonus:</b> togli un nome dalla squadra, inverti l'ordine e stampa il risultato.</p>`,
      solution: py`
        squadra = ["Yara", "Noah", "Lena"]
        squadra.remove("Noah")
        squadra.reverse()
        print(squadra)
      `,
      feedback: {
        useRemove: 'Togli qualcuno con <code>squadra.remove("Nome")</code>.',
        useReverse: "Inverti la lista con <code>squadra.reverse()</code>.",
      },
    },
  },

  "s3-l3": {
    title: "Per ogni cosa …",
    story: "Lumo deve controllare ogni elemento della lista, uno dopo l'altro. Un ciclo lo fa in pochi secondi.",
    intro: `
<p>Con <code>for … in lista</code> passi in rassegna <b>ogni elemento</b>, uno dopo l'altro –
senza dover contare le posizioni:</p>

<pre><code>canzoni = ["A", "B", "C"]
for canzone in canzoni:
    print("In riproduzione:", canzone)</code></pre>

<p>A ogni giro <code>canzone</code> è l'elemento successivo. Il nome prima di <code>in</code> lo
scegli tu – <code>for x in canzoni</code> funzionerebbe lo stesso, ma un nome che dice qualcosa si
legge meglio.</p>`,
    taskHtml:
      "Scorri la lista con un ciclo <code>for</code> e stampa <b>ogni elemento su una riga a parte</b> – magari con un testo davanti, per esempio «In riproduzione: …».",
    hints: ["<code>for canzone in canzoni:</code>", "Sotto, indentato: <code>print(canzone)</code>"],
    starterCode: py`
      canzoni = ["Intro", "Beat 1", "Finale"]
      # Stampa le canzoni una per una
    `,
    solution: py`
      canzoni = ["Intro", "Beat 1", "Finale"]
      for canzone in canzoni:
          print("In riproduzione:", canzone)
    `,
    feedback: {
      loopOverList: "Fai girare il ciclo direttamente sulla lista: <code>for canzone in canzoni:</code>",
      printInLoop: "Il <code>print(…)</code> va indentato dentro il ciclo.",
      eachItem: "Ogni elemento della lista deve comparire nell'output – uno per riga.",
    },
    expert: {
      html: `
<p>Se la tua lista contiene numeri, nel ciclo puoi calcolare una <b>somma</b>.</p>
<p><b>Bonus:</b> somma con un ciclo tutti i gol della lista <code>gol = [2, 1, 3, 0, 2]</code>
(senza <code>sum()</code>) e stampa il totale.</p>`,
      solution: py`
        gol = [2, 1, 3, 0, 2]
        somma = 0
        for g in gol:
            somma = somma + g
        print("Gol in tutto:", somma)
      `,
      feedback: {
        accumulate: "Prima del ciclo crea <code>somma = 0</code> e nel ciclo aggiungi ogni gol.",
        result8: "In tutto sono 8 gol.",
      },
    },
  },

  "s3-l4": {
    title: "Costruisci i tuoi comandi",
    story: "Lumo è stufo di spiegare tutto dieci volte. Costruisci un comando tutto tuo che saluti chi arriva in visita.",
    intro: `
<p>Una <b>funzione</b> è un comando tutto tuo: lo costruisci una volta e lo chiami tutte le volte
che vuoi. Con <code>def</code> la definisci; tra le parentesi ci sono i <b>parametri</b> – i valori
che la funzione riceve quando la chiami.</p>

<pre><code>def saluta(nome):
    print(f"Ciao {nome}! 👋")

saluta("Deniz")
saluta("Fatima")</code></pre>

<p>Il blocco indentato è il «progetto». Viene eseguito solo quando la <b>chiami</b> – con il valore
che le passi. Così ti risparmi le ripetizioni.</p>`,
    taskHtml: "Chiama la funzione <code>saluta</code> con <b>due nomi diversi</b>.",
    hints: [
      'Chiamata: <code>saluta("Mia")</code>',
      "Due chiamate una sotto l'altra, non indentate, con nomi diversi.",
    ],
    starterCode: py`
      def saluta(nome):
          print(f"Ciao {nome}! 👋")

      # Chiama la funzione con due nomi diversi
    `,
    solution: py`
      def saluta(nome):
          print(f"Ciao {nome}! 👋")

      saluta("Mia")
      saluta("Jonas")
    `,
    feedback: {
      twoCalls: 'Chiama la funzione due volte, ognuna su una riga a parte: <code>saluta("Mia")</code>.',
      differentNames: "Usa due nomi <b>diversi</b>.",
    },
    expert: {
      html: `
<p>Una funzione può avere <b>più parametri</b>, separati da virgole.</p>
<p><b>Bonus:</b> costruisci <code>saluta(nome, saluto)</code> in modo che esca per esempio
«Buongiorno, Mia!», e chiamala due volte.</p>`,
      solution: py`
        def saluta(nome, saluto):
            print(f"{saluto}, {nome}!")

        saluta("Mia", "Buongiorno")
        saluta("Leo", "Buonasera")
      `,
      feedback: {
        twoParams: "Dai alla funzione due parametri: <code>def saluta(nome, saluto):</code>",
        twoCalls: "Chiama la funzione due volte.",
        useBoth: "Tutti e due i parametri devono comparire nel saluto.",
      },
    },
  },

  "s3-l5": {
    title: "Restituire un valore",
    story: "Gli strumenti di misura danno tre valori, ma manca la media. Costruisci una funzione che la restituisca – con qualsiasi numero.",
    intro: `
<p>Le funzioni possono <b>restituire</b> un risultato – con <code>return</code>. La differenza
rispetto a <code>print</code>: <code>print</code> si limita a <i>mostrare</i> qualcosa,
<code>return</code> <i>consegna</i> un valore con cui puoi continuare a fare calcoli.</p>

<pre><code>def doppio(x):
    return x * 2

risultato = doppio(5)
print(risultato)   # 10</code></pre>

<p>Dopo <code>return</code> la funzione finisce e rimanda il valore nel punto in cui è stata
chiamata. Quel valore puoi salvarlo, stamparlo o usarlo per altro.</p>`,
    taskHtml:
      "Completa <code>media</code> in modo che la funzione restituisca la <b>media</b> dei tre numeri. Per 2, 4 e 6 esce <b>4.0</b> – e il risultato deve essere giusto anche con tutti gli altri numeri.",
    hints: [
      "Somma diviso quanti sono: <code>(a + b + c) / 3</code> – le parentesi sono importanti!",
      "Restituisci il risultato con <code>return</code>, non con <code>print</code>.",
    ],
    starterCode: py`
      def media(a, b, c):
          # Restituisci la media dei tre numeri
          return 0

      print(media(2, 4, 6))
    `,
    solution: py`
      def media(a, b, c):
          return (a + b + c) / 3

      print(media(2, 4, 6))
    `,
    feedback: {
      returnsNothing:
        "La tua funzione non restituisce ancora niente. Nella funzione usa <code>return</code> invece di <code>print</code>.",
      wrongValues:
        "Con altri numeri il risultato non è ancora giusto. Fai il calcolo con <code>a</code>, <code>b</code> e <code>c</code>? Attenzione alle parentesi: <code>(a + b + c) / 3</code>.",
      printResult: "Stampa il risultato per 2, 4 e 6: <code>print(media(2, 4, 6))</code>.",
    },
    expert: {
      html: `
<p><b>Bonus:</b> scrivi <code>punti(vittorie, pareggi)</code>, che <b>restituisce</b> i punti di una
squadra di calcio (vittoria = 3 punti, pareggio = 1 punto), e usala per confrontare due squadre.</p>`,
      solution: py`
        def punti(vittorie, pareggi):
            return vittorie * 3 + pareggi

        print("Squadra A:", punti(5, 3))
        print("Squadra B:", punti(7, 1))
      `,
      feedback: {
        wrongValues:
          "I punti non tornano ancora. Una vittoria vale 3, un pareggio 1: <code>vittorie * 3 + pareggi</code>.",
      },
    },
  },

  "s3-l6": {
    title: "Dizionari – chiave e valore",
    story: "Ogni membro dell'equipaggio ha una scheda dell'attrezzatura con nomi e valori. Completa la tua.",
    intro: `
<p>Un <b>dizionario</b> (in inglese <i>dictionary</i>) memorizza coppie di <b>chiave</b> e
<b>valore</b> – come un vocabolario (parola → significato) o una scheda personale. Parentesi graffe
<code>{ }</code>, i due punti tra chiave e valore, le coppie separate da virgole:</p>

<pre><code>eroe = {"nome": "Ada", "livello": 3}
print(eroe["nome"])      # Ada
print(eroe["livello"])   # 3</code></pre>

<p>A differenza delle liste (dove usi la <b>posizione</b>), qui usi la <b>chiave</b>:
<code>eroe["nome"]</code>. Perfetto per raggruppare informazioni che stanno insieme.</p>`,
    taskHtml:
      "Allarga il dizionario ad almeno <b>tre</b> coppie (per esempio con un'arma, un animale domestico o un colore) e stampa <b>due valori</b> usando la loro chiave.",
    hints: [
      `Un'altra coppia: <code>eroe = {"nome": "Ada", "livello": 3, "colore": "Viola"}</code>`,
      'Accesso con la chiave: <code>print(eroe["colore"])</code>',
    ],
    starterCode: py`
      eroe = {"nome": "Ada", "livello": 3}
      # Aggiungi una terza coppia e stampa due valori
    `,
    solution: py`
      eroe = {"nome": "Ada", "livello": 3, "colore": "Viola"}
      print(eroe["nome"])
      print(eroe["colore"])
    `,
    feedback: {
      accessByKey: 'Prendi due valori usando la loro chiave: <code>eroe["nome"]</code>.',
      printValues: "Stampa almeno due valori del dizionario.",
    },
    expert: {
      html: `
<p>Le coppie nuove si aggiungono così: <code>eroe["punti"] = 100</code>. E con
<code>for chiave in eroe:</code> passi in rassegna tutte le chiavi.</p>
<p><b>Bonus:</b> aggiungi una coppia nuova e poi stampa tutte le coppie con un ciclo.</p>`,
      solution: py`
        eroe = {"nome": "Ada", "livello": 3}
        eroe["punti"] = 100
        for chiave in eroe:
            print(chiave, "=", eroe[chiave])
      `,
      feedback: {
        addKey: 'Aggiungi una coppia: <code>eroe["punti"] = 100</code>.',
        loopDict: "Passa in rassegna tutte le chiavi con <code>for chiave in eroe:</code>.",
      },
    },
  },

  "s3-boss3": {
    title: "Il tuo mini-quiz",
    story: "L'IA di bordo fa entrare nella sala esperimenti solo chi supera il suo quiz. Ribalta i ruoli e costruisci tu un quiz!",
    intro: `
<p>Costruisci un piccolo <b>quiz</b> su un argomento a tua scelta (animali, musica, sport,
spazio …). Fa delle domande con <code>input()</code>, controlla le risposte con <code>if</code> e
tiene il conto dei punti con una variabile.</p>

<pre><code>punti = 0
risposta = input("Domanda? ")
if risposta == "giusta":
    punti = punti + 1</code></pre>

<p>Suggerimento: con <code>risposta.lower()</code> confronti senza badare a maiuscole e minuscole –
così «Parigi» vale quanto «parigi».</p>`,
    taskHtml:
      "Allarga il quiz con <b>almeno altre due domande</b> (quindi tre in tutto). Conta le risposte giuste come punti e alla fine stampa il punteggio.",
    hints: [
      "Per ogni domanda: un <code>input(…)</code> e un <code>if</code>/<code>else</code>.",
      "Con una risposta giusta: <code>punti = punti + 1</code>. Il punteggio va proprio alla fine.",
    ],
    starterCode: py`
      punti = 0

      risposta = input("Quante zampe ha un ragno? ")
      if risposta == "8":
          punti = punti + 1
          print("Giusto! 🕷️")
      else:
          print("Quasi! Sono 8.")

      # Aggiungi qui almeno altre due domande

      print("Punti:", punti)
    `,
    solution: py`
      punti = 0

      risposta = input("Quante zampe ha un ragno? ")
      if risposta == "8":
          punti = punti + 1
          print("Giusto! 🕷️")
      else:
          print("Quasi! Sono 8.")

      risposta = input("Qual è la capitale della Francia? ")
      if risposta.lower() == "parigi":
          punti = punti + 1
          print("Giusto! 🇫🇷")
      else:
          print("Era Parigi.")

      risposta = input("Qual è il pianeta più grande? ")
      if risposta.lower() == "giove":
          punti = punti + 1
          print("Giusto! 🪐")
      else:
          print("È Giove.")

      print("Punti:", punti)
    `,
    feedback: {
      ifPerQuestion: "Controlla ogni risposta con un <code>if</code> tutto suo.",
      countPoints: "A ogni risposta giusta aumenta i punti: <code>punti = punti + 1</code>.",
      scoreAtEnd: 'Proprio alla fine stampa il punteggio, per esempio <code>print("Punti:", punti)</code>.',
    },
    expert: {
      html: `
<p>Versione da pro: salva le domande come <b>lista di dizionari</b>
(<code>{"domanda": …, "risposta": …}</code>) e scorrile con <b>un solo</b> ciclo. Così il codice per
una domanda lo scrivi una volta sola – non importa quante domande ci siano.</p>
<p><b>Bonus:</b> trasforma così il tuo quiz (almeno due domande nella lista).</p>`,
      solution: py`
        domande = [
            {"domanda": "Quante zampe ha un ragno? ", "risposta": "8"},
            {"domanda": "Qual è la capitale della Francia? ", "risposta": "parigi"},
            {"domanda": "Qual è il pianeta più grande? ", "risposta": "giove"},
        ]
        punti = 0
        for d in domande:
            risposta = input(d["domanda"])
            if risposta.lower() == d["risposta"]:
                punti = punti + 1
                print("Giusto!")
            else:
                print("Peccato, la risposta giusta è:", d["risposta"])
        print("Punti:", punti, "su", len(domande))
      `,
      feedback: {
        listOfDicts:
          'Crea una lista con almeno due dizionari: <code>[{"domanda": …, "risposta": …}, …]</code>.',
        inputInLoop: 'Fai le domande <b>dentro</b> il ciclo: <code>risposta = input(d["domanda"])</code>.',
      },
    },
  },

  // ================================================================== CAPITOLO 4
  "s4-l1": {
    title: "Il motore di gioco",
    story: "Nella sala di controllo c'è un vecchio cabinato arcade dell'equipaggio. Gli manca il cuore, il ciclo di gioco. Ricostruiscilo tu.",
    intro: `
<p>Molti giochi hanno un <b>ciclo di gioco</b> (in inglese <i>game loop</i>): finché il personaggio
ha ancora vite o energia, si va avanti. È un ciclo <code>while</code> attorno a un valore che cambia.</p>

<pre><code>vite = 3
while vite &gt; 0:
    print("Vite rimaste:", vite)
    vite = vite - 1
print("Game Over")</code></pre>

<p>Il valore <code>vite</code> è lo <b>stato</b> del gioco. Il bello arriva con il caso: se a ogni
turno il danno è diverso, nessuno sa in anticipo quanto durerà la partita.</p>`,
    taskHtml:
      "Costruisci il <b>ciclo di gioco</b>: finché <code>energia</code> è maggiore di 0, il gioco tira un danno da 1 a 6, lo sottrae e stampa turno ed energia. Alla fine arriva «Game Over».",
    hints: [
      "<code>while energia &gt; 0:</code> – tutto quello che succede a ogni turno va indentato.",
      "Nel ciclo: <code>danno = random.randint(1, 6)</code>, poi <code>energia = energia - danno</code>.",
    ],
    starterCode: py`
      import random
      energia = 20
      turno = 1
      # Ciclo di gioco: finché energia è maggiore di 0 …
      #   1. tira un danno da 1 a 6
      #   2. sottrailo da energia
      #   3. stampa turno ed energia
      #   4. aumenta turno di 1
      print("Game Over")
    `,
    solution: py`
      import random
      energia = 20
      turno = 1
      while energia > 0:
          danno = random.randint(1, 6)
          energia = energia - danno
          print(f"Turno {turno}: -{danno} → Energia {energia}")
          turno = turno + 1
      print("Game Over")
    `,
    feedback: {
      randomInLoop:
        "Tira il danno <b>dentro</b> il ciclo con <code>random.randint(1, 6)</code>, così ogni turno è diverso.",
      rounds: "A ogni turno stampa qualcosa, per esempio il turno e l'energia.",
      gameOver: "Dopo il ciclo deve arrivare sempre «Game Over» – <b>non</b> indentato.",
    },
    expert: {
      html: `
<p><b>Bonus:</b> dopo la partita stampa quanti turni è durata, per esempio
«Hai resistito per 6 turni». Attenzione: <code>turno</code> parte da 1 e aumenta dopo ogni turno.
Quindi, dopo 4 turni, che cosa c'è in <code>turno</code>?</p>`,
      solution: py`
        import random
        energia = 20
        turno = 1
        while energia > 0:
            danno = random.randint(1, 6)
            energia = energia - danno
            print(f"Turno {turno}: -{danno} → Energia {energia}")
            turno = turno + 1
        print("Game Over")
        print(f"Hai resistito per {turno - 1} turni")
      `,
      feedback: {
        rounds: "Alla fine stampa quanti turni sono stati.",
        count4:
          "Con 20 di energia e sempre 5 di danno sono esattamente 4 turni. Ricorda: dopo l'ultimo turno <code>turno</code> è già andato avanti di uno.",
        count20: "Con sempre 1 di danno sono 20 turni. Conti ogni turno esattamente una volta?",
      },
    },
  },

  "s4-l2": {
    title: "Codici segreti",
    story: "È arrivato un segnale sconosciuto, ma è cifrato. Sposta ogni lettera e scopri che cosa dice.",
    intro: `
<p>Cifrare i messaggi è divertente! Con il <b>cifrario di Cesare</b> ogni lettera viene spostata
di un numero fisso di posti. Ti servono due strumenti: <code>ord()</code> trasforma una lettera
nel suo numero, <code>chr()</code> fa il contrario e ritrasforma un numero in una lettera.</p>

<pre><code>print(ord("A"))   # 65
print(chr(66))    # B</code></pre>

<p>Se passi in rassegna ogni lettera e aumenti il suo numero, nasce un testo segreto.
Per decifrarlo basta spostare nella direzione opposta:</p>

<pre><code>segreto = ""
for lettera in "CIAO":
    segreto = segreto + chr(ord(lettera) + 1)
print(segreto)   # DJBP</code></pre>`,
    taskHtml:
      "Decifra il messaggio segreto: sposta ogni lettera <b>indietro di 1</b> con <code>ord()</code> e <code>chr()</code>. Che cosa viene fuori?",
    hints: [
      "<code>ord(lettera)</code> ti dà il numero, <code>- 1</code> sposta indietro, <code>chr(…)</code> lo ritrasforma in una lettera.",
      "<code>in_chiaro = in_chiaro + chr(ord(lettera) - 1)</code>",
    ],
    starterCode: py`
      segreto = "QZUIPO"   # ogni lettera è spostata di 1
      in_chiaro = ""
      for lettera in segreto:
          # Sposta ogni lettera indietro di 1
          in_chiaro = in_chiaro + lettera
      print(in_chiaro)
    `,
    solution: py`
      segreto = "QZUIPO"
      in_chiaro = ""
      for lettera in segreto:
          in_chiaro = in_chiaro + chr(ord(lettera) - 1)
      print(in_chiaro)
    `,
    feedback: {
      useOrdChr: "Usa <code>ord()</code> e <code>chr()</code> per spostare ogni lettera.",
      decrypt: "Non è ancora decifrato. Sposta <b>indietro</b> di 1: <code>chr(ord(lettera) - 1)</code>.",
    },
    expert: {
      html: `
<p>I veri cifrari di Cesare di solito spostano di 3. Ma che cosa succede con <code>"Z"</code> + 3?
Per ripartire dalla A dopo la Z si usa il resto della divisione: <code>% 26</code>. La formula per
le lettere maiuscole è <code>chr((ord(c) - 65 + s) % 26 + 65)</code>.</p>
<p><b>Bonus:</b> scrivi una funzione <code>cesare(testo, spostamento)</code> che sposti le lettere
maiuscole (anche oltre la Z) e lasci tutto il resto, per esempio gli spazi, così com'è. Con uno
spostamento negativo la stessa funzione decifra.</p>`,
      solution: py`
        def cesare(testo, spostamento):
            risultato = ""
            for c in testo:
                if "A" <= c <= "Z":
                    risultato = risultato + chr((ord(c) - 65 + spostamento) % 26 + 65)
                else:
                    risultato = risultato + c
            return risultato

        segreto = cesare("CIAO MONDO", 3)
        print(segreto)
        print(cesare(segreto, -3))
      `,
      feedback: {
        useMod: "Usa <code>% 26</code>, così dopo la Z si riparte dalla A.",
        shift: '<code>cesare("CIAO", 3)</code> dovrebbe restituire <code>"FLDR"</code>.',
        wrap: '<code>cesare("XYZ", 3)</code> dovrebbe dare <code>"ABC"</code> – dopo la Z si riparte dalla A.',
        spaces: "Gli spazi e gli altri caratteri devono restare come sono.",
        decryptBack: "Con uno spostamento negativo la funzione deve tornare a decifrare.",
      },
    },
  },

  "s4-l3": {
    title: "Disegnare con il codice",
    story: "Il grande schermo della sala di controllo si è riacceso – ed è ancora tutto vuoto. Disegna la prima immagine!",
    intro: `
<p>La stazione ha uno <b>schermo di 16 × 16 punti luminosi</b> (i pixel). Con
<code>pixel(x, y, colore)</code> ne accendi uno. <code>x</code> conta da sinistra (0) a
destra (15), <code>y</code> dall'alto (0) verso il basso (15).</p>

<pre><code>from station import pixel

for x in range(16):
    pixel(x, 12, "turchese")   # una linea che attraversa lo schermo
pixel(7, 4, "oro")</code></pre>

<p>I colori puoi scriverli con il loro nome, in italiano o in inglese (<code>"rosso"</code>,
<code>"blu"</code>, <code>"red"</code>, <code>"rosa"</code> …), oppure con un codice colore come
<code>"#ff8800"</code>. <code>"nero"</code> spegne di nuovo un pixel, e
<code>fill(colore)</code> colora tutto lo schermo.</p>

<p>Con i cicli disegni linee e superfici in una riga sola – e un ciclo dentro un altro ciclo
riempie addirittura un rettangolo intero.</p>`,
    taskHtml:
      "Disegna un'<b>immagine sullo schermo della stazione</b>: almeno <b>12 pixel</b> in almeno <b>due colori</b>, e usa almeno <b>un ciclo</b>. Un albero, un razzo, una faccia, il tuo logo preferito …",
    hints: [
      'Una linea la fai con un ciclo: <code>for x in range(3, 13):</code> e sotto <code>pixel(x, 14, "verde")</code>.',
      "Per il secondo colore ti basta aggiungere qualche pixel di un altro colore sopra il primo.",
    ],
    starterCode: py`
      from station import pixel

      # Disegna la tua immagine: pixel(x, y, "colore")  (x e y da 0 a 15)
      pixel(7, 7, "oro")
    `,
    solution: py`
      from station import pixel

      # Tronco
      for y in range(10, 15):
          pixel(7, y, "marrone")
          pixel(8, y, "marrone")
      # Chioma
      for y in range(3, 10):
          for x in range(4, 12):
              pixel(x, y, "verde")
      # Mele
      pixel(6, 5, "rosso")
      pixel(9, 7, "rosso")
    `,
    feedback: {
      usePixel:
        'Accendi i pixel con <code>pixel(x, y, "colore")</code> – per farlo, in cima ci vuole <code>from station import pixel</code>.',
      useLoop: "Usa almeno un ciclo – per esempio per una linea: <code>for x in range(16):</code>",
    },
    expert: {
      html: `
<p>Chi fa pixel art spesso disegna le sue immagini come una <b>lista di testi</b>: ogni carattere è
un pixel, e un dizionario dice quale colore va con quale carattere.</p>
<pre><code>immagine = [
    ".RR.RR.",
    "RRRRRRR",
    ".RRRRR.",
    "..RRR..",
    "...R...",
]
colori = {"R": "rosso"}</code></pre>
<p><b>Bonus:</b> disegna un'immagine di almeno <b>20 pixel</b> con due cicli <b>annidati</b>:
quello esterno scorre le righe (<code>y</code>), quello interno i caratteri di una
riga (<code>x</code>).</p>`,
      solution: py`
        from station import pixel

        immagine = [
            ".RR.RR.",
            "RRRRRRR",
            "RRRBRRR",
            ".RRRRR.",
            "..RRR..",
            "...R...",
        ]
        colori = {"R": "rosso", "B": "bianco"}

        for y in range(len(immagine)):
            for x in range(len(immagine[y])):
                carattere = immagine[y][x]
                if carattere in colori:
                    pixel(x + 4, y + 5, colori[carattere])
      `,
      feedback: {
        nested: "Metti un ciclo <b>dentro</b> un altro: quello esterno scorre le righe, quello interno i caratteri di una riga.",
      },
    },
  },

  "s4-l4": {
    title: "Analizzare dati veri",
    story: "La stazione meteo là fuori ha misurato le temperature per una settimana. Analizza i dati.",
    intro: `
<p>Programmare aiuta a capire dati veri. Per le liste di numeri ci sono strumenti già pronti:
<code>max()</code> (il valore più grande), <code>min()</code> (il più piccolo),
<code>sum()</code> (la somma) e <code>len()</code> (quanti sono).</p>

<pre><code>temperature = [21, 25, 19, 28, 23]
print("Giorno più freddo:", min(temperature))</code></pre>

<p>La <b>media</b> la ottieni con «somma diviso quanti sono» – cioè usando insieme
<code>sum</code> e <code>len</code>.</p>`,
    taskHtml:
      "Trova con <code>max()</code> il <b>giorno più caldo</b> e calcola la <b>media</b> delle temperature con <code>sum()</code> e <code>len()</code>. Stampa tutti e due i risultati.",
    hints: [
      "<code>max(temperature)</code> ti dà il valore più grande.",
      "Media: <code>sum(temperature) / len(temperature)</code>",
    ],
    starterCode: py`
      temperature = [21, 25, 19, 28, 23]
      # Stampa il giorno più caldo e la media
    `,
    solution: py`
      temperature = [21, 25, 19, 28, 23]
      print("Giorno più caldo:", max(temperature))
      print("Media:", sum(temperature) / len(temperature))
    `,
    feedback: {
      useMax: "Usa <code>max(temperature)</code> per il giorno più caldo.",
      useSumLen: "Calcola la media con <code>sum(temperature) / len(temperature)</code>.",
      max28: "Il giorno più caldo ha avuto 28 gradi – stampalo.",
      average: "La media dovrebbe essere 23.2. Dividi la somma per il numero di valori?",
    },
    expert: {
      html: `
<p><b>Bonus:</b> arrotonda la media a un decimale con <code>round(valore, 1)</code> e scopri con un
ciclo in quanti giorni ha fatto <b>più di 22 gradi</b>.</p>`,
      solution: py`
        temperature = [21, 25, 19, 28, 23]
        print("Media:", round(sum(temperature) / len(temperature), 1))
        giorni_caldi = 0
        for t in temperature:
            if t > 22:
                giorni_caldi = giorni_caldi + 1
        print("Giorni caldi:", giorni_caldi)
      `,
      feedback: {
        useRound: "Arrotonda con <code>round(…, 1)</code>.",
        countLoop: "Conta con un ciclo <code>for</code> e un <code>if</code> quanti valori sono sopra 22.",
        count3: "I giorni sopra i 22 gradi sono stati 3 (25, 28 e 23).",
      },
    },
  },

  "s4-l5": {
    title: "Caccia ai bug (debug)",
    story: "Un ultimo glitch blocca la sala di controllo: nel codice si nascondono tre errori. Riparali, e la stazione è libera.",
    intro: `
<p>Anche i professionisti sbagliano – e poi trovano gli errori. Si chiama <b>debug</b>. Nel codice
qui sotto ci sono esattamente <b>tre bug</b>. Eseguilo, leggi la spiegazione nella console (ti dice
la riga!) e correggi un errore alla volta. Dopo ogni correzione può saltar fuori l'errore
successivo – è del tutto normale.</p>

<p>Gli inciampi tipici: i due punti <code>:</code> mancanti, un'indentazione mancante, oppure
testo e numero mescolati con <code>+</code> (si risolve con <code>str(…)</code>).</p>`,
    taskHtml:
      "Correggi tutti e tre gli errori, finché il programma gira senza messaggi di errore. Alla fine «Evviva!» deve comparire tre volte.",
    hints: [
      "Due errori stanno nella riga del <code>for</code> e in quella sotto: i due punti e l'indentazione.",
      "Il terzo: trasforma il numero in testo prima di attaccarlo con <code>+</code>: <code>str(eta + 1)</code>.",
    ],
    starterCode: py`
      nome = "Emma"
      eta = 11
      print("Ciao " + nome)
      print("L'anno prossimo avrai " + (eta + 1) + " anni")
      for i in range(3)
      print("Evviva!")
    `,
    solution: py`
      nome = "Emma"
      eta = 11
      print("Ciao " + nome)
      print("L'anno prossimo avrai " + str(eta + 1) + " anni")
      for i in range(3):
          print("Evviva!")
    `,
    feedback: {
      keepLoop: "Lascia il ciclo al suo posto e correggilo.",
      allLines: "Tutte le righe devono essere stampate – non cancellare i comandi, correggili.",
      age: "Nell'output deve comparire quanti anni avrà Emma l'anno prossimo (12). Usa <code>str(eta + 1)</code>.",
      threeHurra:
        "«Evviva!» deve comparire tre volte: la riga del <code>print</code> va indentata dentro il ciclo.",
    },
    expert: {
      html: `
<p>Certi errori si possono prevedere – per esempio quando qualcuno scrive delle lettere dove ci si
aspetta un numero. Con <code>try:</code> e <code>except ValueError:</code> intercetti l'errore,
invece di far andare in crash il programma.</p>
<p><b>Bonus:</b> chiedi l'età con <code>int(input(…))</code>. Se arriva un numero, stampa l'età
dell'anno prossimo; se arrivano delle lettere, un messaggio gentile.</p>`,
      solution: py`
        try:
            eta = int(input("Quanti anni hai? "))
            print("La tua età l'anno prossimo:", eta + 1)
        except ValueError:
            print("Per favore scrivi un numero intero.")
      `,
      feedback: {
        useTry:
          "Metti la conversione in un blocco <code>try:</code> e intercetta l'errore con <code>except ValueError:</code>.",
        useInput: "Chiedi l'età con <code>int(input(…))</code>.",
        friendly: "Se arrivano delle lettere deve comparire un messaggio gentile.",
        normalCase: "Con l'input 11 il programma deve stampare 12.",
      },
    },
  },

  "s4-boss4": {
    title: "Il tuo progetto",
    story: "La stazione Polaris è di nuovo in funzione! Ora manca solo il tuo modulo – qualcosa che non è mai esistito prima.",
    intro: `
<p>Il gran finale: <b>costruisci qualcosa di tuo!</b> Un gioco, una storia, un quiz o uno
strumento utile. Usa quello che hai imparato: <code>input()</code>, <code>if</code>, cicli, liste,
dizionari, funzioni tue, <code>random</code> …</p>

<p>Non deve essere perfetto – l'importante è che sia tuo. Parti in piccolo, prova spesso e poi
costruisci un pezzo alla volta. Quando hai finito, ti aspetta il tuo diploma. 🚀</p>`,
    taskHtml:
      "Scrivi un programma tutto tuo che usi almeno <b>tre mattoncini</b> del corso (<code>input()</code>, <code>if</code>, un ciclo, una lista o un dizionario, una funzione tua, <code>random</code>) e che giri senza errori. Dai spazio alla fantasia – è il tuo capolavoro!",
    hints: [
      "Parti in piccolo: prima stampa qualcosa, poi allarga il programma passo dopo passo.",
      "Idee: un gioco di dadi con i punti, un quiz di vocaboli da una lista, un pianificatore della paghetta con una funzione.",
    ],
    starterCode: py`
      # 🌟 Il tuo progetto. Qualche idea:
      #  - un'avventura testuale con delle scelte (if/else)
      #  - un quiz sul tuo argomento preferito
      #  - un gioco di dadi o un allenamento di calcolo
      #  - uno strumento utile (convertitore, generatore di idee)

      print("Il mio progetto parte …")
    `,
    solution: py`
      import random

      risposte = ["Sì, sicuramente!", "Mmh, direi di no …", "Richiedimelo più tardi", "Assolutamente sì!"]

      def oracolo():
          return random.choice(risposte)

      print("🎲 Oracolo della fortuna 🎲")
      for turno in range(3):
          domanda = input("Fammi una domanda da sì o no: ")
          if domanda == "":
              print("Ma non mi hai chiesto niente!")
          else:
              print(oracolo())
    `,
    feedback: {
      blocks:
        "Il tuo programma usa solo {n} dei mattoncini. Aggiungine altri – per esempio un ciclo, una lista o una funzione tua.",
      tooShort: "Il tuo progetto può crescere ancora un po' – almeno 6 righe di codice.",
    },
  },

  // ================================================================== MISSIONI ALL'ESTERNO
  "d-1": {
    title: "Prima uscita",
    story: "Fuori dalla stazione il ghiaccio scintilla. Lumo può uscire in volo – ma solo con i tuoi comandi. Porta Lumo alla stazione di ricarica!",
    intro: `
<p>Qui guidi Lumo direttamente con Python. I comandi di volo li prendi con
<code>from drone import *</code> – l'asterisco vuol dire «tutti i comandi».</p>

<pre><code>from drone import *

move()
move()</code></pre>

<p><code>move()</code> fa volare Lumo di una casella in avanti, nella direzione in cui punta la freccia.
L'obiettivo è la <b>stazione di ricarica</b> ⚡. Se Lumo va a sbattere contro un muro, non è un dramma:
c'è un glitch, e tu riprovi.</p>`,
    taskHtml: "Porta Lumo alla <b>stazione di ricarica</b> ⚡. Conta le caselle!",
    hints: [
      "Ogni casella ha bisogno del suo <code>move()</code>.",
      "Le caselle sono cinque: cinque volte <code>move()</code>, una sotto l'altra.",
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
  },

  "d-2": {
    title: "Dietro l'angolo",
    story: "La stazione di ricarica è dietro una parete di ghiaccio. Lumo deve svoltare – per fortuna un drone sa girarsi sul posto.",
    intro: `
<p><code>turn_left()</code> fa girare Lumo sul posto verso sinistra, di un quarto di giro. Un comando
per la destra non c'è. Si riesce lo stesso ad andare a destra? Lo scoprirai più avanti.</p>

<pre><code>from drone import *

move()
turn_left()
move()</code></pre>`,
    taskHtml: "Fai volare Lumo dietro l'angolo fino alla stazione di ricarica ⚡.",
    hints: [
      "Prima dritto fino al muro, poi <code>turn_left()</code>, poi avanti con <code>move()</code>.",
      "Quattro volte <code>move()</code>, una volta <code>turn_left()</code>, due volte <code>move()</code>.",
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
    expert: {
      html: "<p><b>Bonus:</b> alla stazione di ricarica, alla fine Lumo deve guardare a <b>sinistra</b> (verso ovest), così la telecamera tiene d'occhio la stazione.</p>",
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
      feedback: { faceWest: "Lumo è nel posto giusto, ma non guarda ancora a sinistra. Manca una rotazione." },
    },
  },

  "d-3": {
    title: "Raccogliere cristalli",
    story: "Sul ghiaccio ci sono cristalli di energia. Ognuno aiuta la stazione – Lumo deve raccoglierli lungo la strada.",
    intro: `
<p>I cristalli di ghiaccio immagazzinano energia. <code>collect()</code> raccoglie il cristallo sulla
casella dove si trova Lumo in quel momento. Se lì non ce n'è nessuno, Lumo segnala un glitch.</p>

<pre><code>from drone import *

move()
move()
collect()</code></pre>`,
    taskHtml: "Raccogli <b>tutti e due i cristalli</b> e poi vola alla stazione di ricarica ⚡.",
    hints: [
      "Vola sulla casella con il cristallo e lì chiama <code>collect()</code>.",
      "Il primo cristallo è due caselle davanti a Lumo, il secondo due caselle più in là, e la stazione di ricarica altre due caselle dopo.",
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
  },

  "d-4": {
    title: "Corridoi lunghi",
    story: "Uno stretto canale di ghiaccio porta alla stazione di ricarica più lontana. È lungo – e a Lumo le liste di comandi lunghe non piacciono.",
    intro: `
<p>13 caselle, 13 righe di <code>move()</code>? Con un ciclo <code>for</code> bastano
due righe:</p>

<pre><code>from drone import *

for i in range(4):
    move()</code></pre>

<p>Tutto quello che sta indentato sotto la riga del <code>for</code>, Lumo lo ripete.</p>`,
    taskHtml:
      "Il corridoio è lungo <b>13 caselle</b>. Porta Lumo alla stazione di ricarica ⚡ con un <b>ciclo <code>for</code></b>.",
    hints: ["<code>for i in range(…):</code> e sotto, indentato, <code>move()</code>.", "<code>range(13)</code> ripete 13 volte."],
    starterCode: py`
      from drone import *

      # Il corridoio è lungo 13 caselle
      move()
    `,
    solution: py`
      from drone import *

      for i in range(13):
          move()
    `,
    expert: {
      html: "<p><b>Bonus per esperti:</b> riuscici con al massimo <b>3 righe</b> di codice – la riga dell'import conta, i commenti e le righe vuote no.</p>",
      solution: py`
        from drone import *
        for i in range(13):
            move()
      `,
      feedback: { short: "Sono ancora troppe righe. Lascia che sia il ciclo a fare tutto il lavoro." },
    },
  },

  "d-5": {
    title: "Percorso sconosciuto",
    story: "La tempesta di neve sposta di continuo le lastre di ghiaccio. Quanto sia lontana oggi la stazione di ricarica non lo sa nessuno – Lumo deve capirlo da solo.",
    intro: `
<p>Lumo ha dei <b>sensori</b>. Rispondono alle domande con <code>True</code> o <code>False</code>.
<code>at_goal()</code> è <code>True</code> quando Lumo si trova sulla stazione di ricarica:</p>

<pre><code>from drone import *

print(at_goal())   # False – Lumo è ancora alla partenza</code></pre>

<p>Con <code>while</code> Lumo ripete qualcosa <b>finché</b> una condizione è vera. E
<code>not</code> scambia <code>True</code> e <code>False</code>: <code>not at_goal()</code>
vuol dire «non ancora arrivato».</p>`,
    taskHtml:
      "A ogni missione il percorso ha una <b>lunghezza diversa</b>. Porta Lumo alla stazione di ricarica ⚡ con un <b>ciclo <code>while</code></b> e <code>at_goal()</code> – non importa quanto sia lontana.",
    hints: [
      "<code>while not at_goal():</code> vuol dire «finché Lumo non è ancora arrivato».",
      "Sotto, indentato, c'è solo <code>move()</code>.",
    ],
    starterCode: py`
      from drone import *

      # Quanto è lontana la stazione di ricarica? Lumo non lo sa …
      move()
    `,
    solution: py`
      from drone import *

      while not at_goal():
          move()
    `,
    expert: {
      html: "<p><b>Bonus:</b> fai <b>contare</b> a Lumo le caselle lungo la strada e alla fine stampa quante caselle ha percorso in volo.</p>",
      solution: py`
        from drone import *

        caselle = 0
        while not at_goal():
            move()
            caselle += 1
        print("Ho volato per", caselle, "caselle")
      `,
      feedback: { count: "Alla fine stampa quante caselle ha percorso Lumo. Contale nel ciclo con <code>caselle += 1</code>." },
    },
  },

  "d-6": {
    title: "Una scia di cristalli",
    story: "Dopo la tempesta ci sono cristalli sparsi sul percorso – a ogni missione in posti diversi. A Lumo non deve sfuggirne nemmeno uno.",
    intro: `
<p>Con <code>if</code> Lumo prende decisioni lungo la strada. <code>on_crystal()</code> è
<code>True</code> quando sotto Lumo c'è un cristallo:</p>

<pre><code>from drone import *

if on_crystal():
    collect()
print("Un cristallo sotto di me?", on_crystal())</code></pre>

<p>Se metti la decisione <b>dentro</b> un ciclo, Lumo controlla ogni casella su cui passa.</p>`,
    taskHtml:
      "Sul percorso ci sono dei cristalli – a ogni missione in posti diversi. Raccoglili <b>tutti</b> e vola alla stazione di ricarica ⚡.",
    hints: [
      "Nel ciclo <code>while</code>: prima controlla se c'è un cristallo, poi vai avanti di una casella.",
      "<code>while not at_goal():</code>, sotto <code>if on_crystal():</code> con <code>collect()</code>, e dopo <code>move()</code>.",
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
    expert: {
      html: "<p><b>Bonus:</b> conta i cristalli e alla fine stampa quanti ne ha raccolti Lumo.</p>",
      solution: py`
        from drone import *

        cristalli = 0
        while not at_goal():
            if on_crystal():
                collect()
                cristalli += 1
            move()
        print("Cristalli:", cristalli)
      `,
      feedback: { count: "Alla fine stampa il numero dei cristalli raccolti. Conta subito dopo <code>collect()</code>." },
    },
  },

  "d-7": {
    title: "Giro a destra",
    story: "Una scala di blocchi di ghiaccio sale verso destra. Ma Lumo sa girarsi solo a sinistra … o no?",
    intro: `
<p>Tre volte a sinistra è come una volta a destra! Invece di scrivere ogni volta tre righe, ti
costruisci un <b>comando tutto tuo</b>:</p>

<pre><code>from drone import *

def turn_right():
    turn_left()
    turn_left()
    turn_left()

turn_right()</code></pre>

<p>Da adesso Python conosce <code>turn_right()</code> bene quanto i comandi già pronti.</p>`,
    taskHtml:
      "Costruisci il comando <code>turn_right()</code> con <code>def</code> e fai salire Lumo lungo la scala di ghiaccio fino alla stazione di ricarica ⚡ – meglio un gradino alla volta, con un ciclo.",
    hints: [
      "Un gradino è: <code>move()</code>, <code>turn_left()</code>, <code>move()</code>, <code>turn_right()</code>.",
      "I gradini sono quattro, e dopo serve ancora un <code>move()</code>: <code>for i in range(4):</code>",
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          # tre volte a sinistra = una volta a destra
          pass

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
    feedback: {
      useDef: "Hai costruito il comando, ma non l'hai ancora usato. Chiama <code>turn_right()</code> dove Lumo deve girare a destra.",
    },
    expert: {
      html: "<p><b>Bonus:</b> costruisci un secondo comando <code>gradino()</code> che faccia salire Lumo di un gradino intero, e chiamalo in un ciclo.</p>",
      solution: py`
        from drone import *

        def turn_right():
            turn_left()
            turn_left()
            turn_left()

        def gradino():
            move()
            turn_left()
            move()
            turn_right()

        for i in range(4):
            gradino()
        move()
      `,
      feedback: { twoDefs: "Oltre a <code>turn_right()</code> costruisci un secondo comando, per esempio <code>def gradino():</code>." },
    },
  },

  "d-8": {
    title: "Spirale",
    story: "Un corridoio si avvolge a spirale verso il cuore di una vecchia grotta di ghiaccio. Ogni grotta è diversa – Lumo deve decidere da solo quando svoltare.",
    intro: `
<p><code>front_clear()</code> è <code>True</code> quando davanti a Lumo la strada è libera. Con
<code>if</code> ed <code>else</code> Lumo decide di nuovo a ogni passo:</p>

<pre><code>from drone import *

if front_clear():
    move()
else:
    turn_left()</code></pre>`,
    taskHtml:
      "Il corridoio si avvolge a spirale verso l'interno – e ogni spirale è diversa. Con <code>while</code>, <code>if</code> ed <code>else</code> fai trovare a Lumo da solo la strada per la stazione di ricarica ⚡.",
    hints: [
      "Finché Lumo non è arrivato: se davanti è libero, Lumo vola avanti, altrimenti gira a sinistra.",
      "<code>while not at_goal():</code>, dentro <code>if front_clear():</code> con <code>move()</code> ed <code>else:</code> con <code>turn_left()</code>.",
    ],
    starterCode: py`
      from drone import *

      # Lumo deve decidere da solo: volare avanti o svoltare?
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
  },

  "d-9": {
    title: "Salvataggio nel labirinto",
    story: "Una tempesta di neve ha spinto Lumo in un labirinto di ghiaccio – e non ce n'è uno uguale all'altro. Solo un programma furbo può riportare Lumo a casa.",
    intro: `
<p>Un vecchio trucco per i labirinti: <b>tieni sempre la mano destra sul muro.</b> Chi lo fa,
in labirinti come questi trova di sicuro l'uscita. Per Lumo, a ogni passo, vuol dire:</p>
<ul>
<li>prima girarsi a destra,</li>
<li>poi girarsi a sinistra, finché davanti c'è un muro,</li>
<li>poi volare avanti di una casella.</li>
</ul>
<p>Un ciclo <b>dentro</b> un ciclo – ed ecco che Lumo ha un piano.</p>`,
    taskHtml:
      "Scrivi un programma con cui Lumo trova la strada per la stazione di ricarica ⚡ da <b>qualsiasi</b> labirinto. La prova si fa con labirinti che tu non vedi.",
    hints: [
      "Ti serve <code>turn_right()</code> da «Giro a destra» – il codice iniziale ce l'ha già.",
      "Fuori <code>while not at_goal():</code>, dentro <code>turn_right()</code>, poi <code>while not front_clear():</code> con <code>turn_left()</code>, poi <code>move()</code>.",
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          turn_left()
          turn_left()
          turn_left()

      # Mano destra sul muro …
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
  },

  // ================================================================== CACCIA AI GLITCH
  "g-1": {
    title: "Silenzio radio",
    story: "Un vecchio programma di benvenuto dell'equipaggio dovrebbe salutare per nome chi arriva in visita. Invece segnala solo glitch.",
    intro: `
<p>Ti diamo il benvenuto alla <b>caccia ai glitch</b>! Qui non scrivi un programma nuovo, ma ne
ripari uno rotto. I professionisti fanno così:</p>
<ul>
<li>Esegui il programma e leggi con calma il riquadro dell'errore.</li>
<li>Clicca su «Riga …» – è lì che qualcosa si inceppa.</li>
<li>Correggi un errore ed esegui di nuovo. Spesso dopo salta fuori quello successivo.</li>
</ul>`,
    taskHtml:
      "Ripara il programma: deve chiedere il nome e poi stampare <b>due righe</b> – un saluto con il nome e «Ti diamo il benvenuto a bordo!».",
    hints: [
      "Python distingue tra maiuscole e minuscole: <code>nome</code> e <code>Nome</code> sono due nomi diversi.",
      "Nell'ultima riga manca una virgoletta prima della parentesi.",
    ],
    starterCode: py`
      nome = input("Come ti chiami? ")
      print("Ciao, " + Nome + "!")
      print("Ti diamo il benvenuto a bordo!)
    `,
    solution: py`
      nome = input("Come ti chiami? ")
      print("Ciao, " + nome + "!")
      print("Ti diamo il benvenuto a bordo!")
    `,
    feedback: {
      greet: "Il saluto deve contenere il nome inserito, e dopo deve arrivare «Ti diamo il benvenuto a bordo!».",
    },
  },

  "g-2": {
    title: "Errore di calcolo",
    story: "Il calcolatore di età della stazione dovrebbe solo dire quanti anni avrai tra dieci anni. Invece va in crash a ogni input.",
    intro: `
<p>Questo glitch è un classico: <code>input()</code> restituisce sempre del <b>testo</b>, anche quando
qualcuno scrive un numero. Ma testo e numeri non si possono sommare così, semplicemente.</p>
<pre><code>print(int("12") + 10)
print("Età: " + str(22))</code></pre>
<p><code>int(…)</code> trasforma un testo in un numero, <code>str(…)</code> un numero in testo.</p>`,
    taskHtml: "Ripara il calcolatore: per <b>qualsiasi</b> età deve calcolare giusto quanti anni si avranno tra dieci anni.",
    hints: [
      "Il primo riquadro dell'errore indica il calcolo: testo + numero non va. Trasforma l'input con <code>int(…)</code>.",
      "Dopo si inceppa quando stampa: di nuovo testo + numero, che non va bene. <code>str(…)</code> o una f-string ti aiutano.",
    ],
    starterCode: py`
      eta = input("Quanti anni hai? ")
      tra_dieci_anni = eta + 10
      print("Tra dieci anni avrai " + tra_dieci_anni + " anni.")
    `,
    solution: py`
      eta = int(input("Quanti anni hai? "))
      tra_dieci_anni = eta + 10
      print(f"Tra dieci anni avrai {tra_dieci_anni} anni.")
    `,
    feedback: {
      math: "Il programma gira, ma non calcola ancora giusto per ogni età. Con 12 deve venire 22, con 30 invece 40.",
    },
  },

  "g-3": {
    title: "Conto alla rovescia infinito",
    story: "La rampa di lancio fa il conto alla rovescia … e non smette mai. Il rover aspetta da anni il suo «Via!».",
    intro: `
<p>Certi glitch non producono nessun messaggio di errore – il programma gira e basta,
<b>all'infinito</b>. Niente paura: dopo un po' PyQuest lo ferma. A quel punto conviene chiedersi
che cosa dovrebbe cambiare nel ciclo perché prima o poi la condizione diventi <code>False</code>.</p>`,
    taskHtml: "Ripara il conto alla rovescia: deve stampare <b>5, 4, 3, 2, 1</b> e poi «Via!» – e poi fermarsi davvero.",
    hints: [
      "Esegui pure il programma una volta. Perché il ciclo non finisce mai?",
      "Nel ciclo <code>numero</code> deve diventare più piccolo: <code>numero = numero - 1</code> – indentato, dopo il <code>print</code>.",
    ],
    starterCode: py`
      numero = 5
      while numero > 0:
          print(numero)
      print("Via!")
    `,
    solution: py`
      numero = 5
      while numero > 0:
          print(numero)
          numero = numero - 1
      print("Via!")
    `,
    feedback: {
      countdown: "Il conto alla rovescia deve contare esattamente 5, 4, 3, 2, 1 e poi stampare una volta «Via!».",
    },
  },

  "g-4": {
    title: "La lista sballata",
    story: "La lista del magazzino nella sala esperimenti si interrompe ogni volta prima della fine. Da qualche parte il programma sbaglia a contare.",
    intro: `
<p>In questo programma si nascondono due glitch. Il primo gli impedisce proprio di partire. Il secondo
si fa vedere solo mentre gira – ha a che fare con le <b>posizioni</b> in una lista: la prima
posizione è 0, l'ultima è <code>len(lista) - 1</code>.</p>`,
    taskHtml: "Ripara la lista del magazzino: ogni scorta deve comparire su una riga tutta sua, e alla fine il totale.",
    hints: [
      "Conta le parentesi nell'ultima riga.",
      "<code>range(len(scorte))</code> conta esattamente le posizioni della lista – senza <code>+ 1</code>.",
    ],
    starterCode: py`
      scorte = ["ghiaccio", "cristalli", "batterie", "biscotti"]
      for i in range(len(scorte) + 1):
          print("In magazzino:", scorte[i])
      print("Totale:", len(scorte)
    `,
    solution: py`
      scorte = ["ghiaccio", "cristalli", "batterie", "biscotti"]
      for i in range(len(scorte)):
          print("In magazzino:", scorte[i])
      print("Totale:", len(scorte))
    `,
    feedback: {
      list: "Devono comparire esattamente quattro scorte, ognuna su una riga, e poi il totale 4.",
    },
  },

  "g-5": {
    title: "Il return dimenticato",
    story: "Il calcolatore di energia della sala di controllo mostra un numero, ma poi continua a fare i conti con… niente. Un glitch da manuale!",
    intro: `
<p>Una funzione può <b>mostrare</b> qualcosa (<code>print</code>) oppure <b>restituire</b> qualcosa
(<code>return</code>). Non è la stessa cosa: il programma può riutilizzare solo quello che viene
restituito. Senza <code>return</code> una funzione restituisce <code>None</code> – «niente».</p>`,
    taskHtml:
      "Ripara la funzione <code>doppio</code>: deve <b>restituire</b> il suo risultato, così il programma può continuare a farci i conti. Alla fine deve comparire «Energia totale: 50».",
    hints: [
      "Il riquadro dell'errore dice: <code>None</code> più un numero non va. Quindi la funzione non restituisce niente.",
      "Nella funzione sostituisci <code>print(risultato)</code> con <code>return risultato</code>.",
    ],
    starterCode: py`
      def doppio(numero):
          risultato = numero * 2
          print(risultato)

      energia = doppio(21)
      print("Energia totale:", energia + 8)
    `,
    solution: py`
      def doppio(numero):
          risultato = numero * 2
          return risultato

      energia = doppio(21)
      print("Energia totale:", energia + 8)
    `,
    feedback: {
      double: "La funzione deve restituire il doppio – per 7 quindi 14.",
      fifty: "Alla fine deve comparire «Energia totale: 50».",
    },
  },
};
