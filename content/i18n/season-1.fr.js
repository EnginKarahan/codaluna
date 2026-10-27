// Codaluna – Übersetzung des Kurses "season-1": Français.
// Überschreibt nur Texte und Code der deutschen Basis (content/courses/season-1.js).

import { py } from "../lib/check-kit.js";

export default {
  chapters: {
    c1: "Premières commandes",
    c2: "Décisions & boucles",
    c3: "Collections & tes propres commandes",
    c4: "Tout assembler",
    d1: "Piloter Lumo sur la glace",
    g1: "Réparer des programmes cassés",
  },
  regions: {
    c1: {
      name: "Salle radio",
      intro: "La salle radio est plongée dans le noir. Pour que la station puisse de nouveau parler, il lui faut des commandes – et c'est toi qui les écris.",
      outro: "La station parle, calcule et te pose de nouveau des questions. Lumo fait un petit tour de joie.",
    },
    c2: {
      name: "Hangar",
      intro: "Dans le hangar, des portes, des rovers et des lampes de signalisation attendent. Pour qu'ils prennent des décisions et répètent des actions tout seuls, il leur faut des conditions et des boucles.",
      outro: "Le portail du hangar s'ouvre, et dehors, la glace scintille. Désormais, Lumo peut aussi s'envoler pour des missions à l'extérieur.",
    },
    c3: {
      name: "Labo",
      intro: "Au labo, provisions, échantillons et notes traînent pêle-mêle. Les listes, les dictionnaires et tes propres commandes vont y mettre de l'ordre.",
      outro: "Chaque chose est à sa place, et l'IA de bord te reconnaît comme membre de l'équipage.",
    },
    c4: {
      name: "Salle de contrôle",
      intro: "Dans la salle de contrôle, tous les systèmes se rejoignent. C'est ici que tu montres ce que tu sais faire : jeux, codes, images et vraies données de mesure.",
      outro: "Station Polaris brille de nouveau ! À partir de maintenant, tu construis tes propres modules.",
    },
    d1: {
      name: "Champ de glace",
      intro: "Devant la station s'étend le champ de glace. Ici, tu pilotes Lumo directement avec Python : chaque commande est une manœuvre de vol.",
      outro: "Lumo connaît maintenant chaque recoin du champ de glace – et toi, tu as programmé un drone qui trouve son chemin tout seul.",
    },
    g1: {
      name: "Puits de maintenance",
      intro: "Dans le puits de maintenance traînent de vieux programmes de l'équipage – pleins de bugs. Chaque programme que tu répares fait avancer la station un peu plus.",
      outro: "Le puits de maintenance est tout propre. Désormais, tu trouves les bugs plus vite que l'IA de bord.",
    },
  },

  // ================================================================== CHAPITRE 1
  "s1-l1": {
    title: "Bonjour, le monde !",
    story: "La radio de la station est muette depuis des années. Envoie le tout premier message – l'essentiel, c'est qu'il te ressemble !",
    intro: `
<p>Un programme est une liste de <b>commandes</b> que l'ordinateur exécute l'une après l'autre.
Ta toute première commande est <code>print()</code> – elle écrit quelque chose dans la <b>console</b>
(la zone sombre sous l'éditeur).</p>

<p><b>Important : le texte a besoin de guillemets.</b> Tout ce que Python doit afficher <i>tel quel</i>,
tu l'écris entre guillemets : <code>"…"</code>. Un texte comme ça s'appelle une <b>chaîne de
caractères</b> (en anglais : <i>string</i>). Les guillemets disent à Python : « Ceci est du texte,
pas une commande. »</p>

<pre><code>print("Bonjour le monde !")</code></pre>

<p>Si tu oubliais les guillemets (<code>print(Bonjour)</code>), Python croirait que <code>Bonjour</code>
est un nom qu'il devrait connaître – et il afficherait une erreur. D'ailleurs, les guillemets
eux-mêmes ne s'affichent <b>pas</b>.</p>

<p>Pas d'inquiétude, ici tu ne peux rien casser. Change le texte et appuie sur
<b>Exécuter</b> (ou Ctrl + Entrée).</p>`,
    taskHtml:
      "Change le texte : affiche <b>ton propre message</b> – ta devise, un salut ou ta phrase préférée. N'oublie pas les guillemets !",
    hints: [
      `Écris ton texte entre les guillemets : <code>print("…")</code>.`,
      `Par exemple : <code>print("Aujourd'hui, j'apprends Python !")</code>`,
    ],
    starterCode: py`
      print("Bonjour le monde !")
    `,
    solution: py`
      print("Aujourd'hui, j'apprends Python !")
    `,
    expert: {
      html: `
<p>Tu peux afficher <b>plusieurs choses</b> en les séparant par des virgules – Python met
automatiquement un espace entre elles : <code>print("Bonjour", "le monde")</code>. Et <code>\\n</code>
commence une nouvelle ligne <i>à l'intérieur</i> d'un texte.</p>
<p><b>Bonus :</b> écris un <code>print()</code> qui affiche plusieurs morceaux séparés par des
virgules et qui s'étend sur au moins deux lignes grâce à <code>\\n</code>.</p>`,
      solution: py`
        print("Bonjour", "le monde !", "\nSuper que tu sois là !")
      `,
      feedback: {
        printComma: `Affiche plusieurs morceaux dans <b>un seul</b> <code>print()</code>, séparés par des virgules : <code>print("A", "B")</code>.`,
        newline: "Utilise <code>\\n</code> dans un texte pour commencer une nouvelle ligne.",
      },
    },
  },

  "s1-l2": {
    title: "Retenir avec des variables",
    story: "La station a perdu la mémoire. Apprends-lui à retenir quelque chose – commence par ton nombre préféré.",
    intro: `
<p>Une <b>variable</b>, c'est une boîte qui porte un nom. Avec le signe égal <code>=</code>, tu mets
quelque chose dedans (on dit « affecter »). Ensuite, tu peux utiliser le nom pour retrouver
la valeur.</p>

<pre><code>nombre_prefere = 7
print(nombre_prefere)</code></pre>

<p>Le <b>nom</b> est à gauche du <code>=</code>, la <b>valeur</b> à droite. Ici, <code>=</code>
veut dire « reçoit la valeur » – et pas « est égal à » comme en maths. Un nom ne peut pas contenir
d'espace (on met un tiret bas <code>_</code> à la place), et on évite les accents : d'où
<code>nombre_prefere</code>.</p>

<p><b>Nombre ou texte ?</b> Les nombres s'écrivent <i>sans</i> guillemets (<code>7</code>).
Et pour afficher la <i>variable</i>, son nom va <b>sans</b> guillemets entre les parenthèses :
<code>print(nombre_prefere)</code> affiche <code>7</code>. Alors que <code>print("nombre_prefere")</code>
afficherait simplement le mot.</p>`,
    taskHtml:
      "Mets ton <b>nombre préféré</b> dans la variable et affiche-le avec <code>print()</code> – le nom de la variable sans guillemets !",
    hints: [
      "D'abord l'affectation : <code>nombre_prefere = 42</code>",
      "Ensuite l'affichage : <code>print(nombre_prefere)</code>",
    ],
    starterCode: py`
      nombre_prefere = 0
      # Mets ton nombre préféré et affiche-le
    `,
    solution: py`
      nombre_prefere = 42
      print(nombre_prefere)
    `,
    feedback: {
      printName:
        "Affiche la <b>variable</b> : son nom va <b>sans</b> guillemets entre les parenthèses, donc <code>print(nombre_prefere)</code>.",
      needNumber: "Mets un <b>nombre</b> dans la variable – sans guillemets, par exemple <code>nombre_prefere = 7</code>.",
    },
    expert: {
      html: `
<p>Une variable peut <b>changer</b>. <code>points = points + 50</code> prend l'ancienne valeur,
lui ajoute 50 et remet le résultat dans la même boîte. Les noms peuvent contenir des lettres,
des chiffres et <code>_</code>, mais ils ne doivent pas commencer par un chiffre.</p>
<p><b>Bonus :</b> crée <code>points = 100</code>, augmente ensuite la valeur de 50 et affiche-la.</p>`,
      solution: py`
        points = 100
        points = points + 50
        print(points)
      `,
      feedback: {
        selfUpdate: "Augmente la valeur avec <code>points = points + 50</code> (ou en plus court : <code>points += 50</code>).",
        result150: "À la fin, ton programme devrait afficher 150.",
      },
    },
  },

  "s1-l3": {
    title: "La calculette d'épargne",
    story: "Un vieux calcul de l'équipage est resté coincé dans l'ordinateur de bord. Prouve-lui que la station sait de nouveau calculer.",
    intro: `
<p>Python est une super calculatrice. On calcule avec <code>+</code> (plus),
<code>-</code> (moins), <code>*</code> (fois) et <code>/</code> (divisé par) – on utilise donc
<code>*</code> au lieu de « × » et <code>/</code> au lieu de « ÷ ».</p>

<p><b>Important :</b> les nombres s'écrivent sans guillemets. Sinon, Python les traite comme du
texte et ne calcule pas (<code>"5" + "3"</code> donnerait <code>"53"</code> au lieu de <code>8</code> !).</p>

<pre><code>par_semaine = 5
semaines = 8
print(par_semaine * semaines)</code></pre>

<p>Ce qui est génial avec les variables : si une valeur change, le programme refait le calcul tout
seul. Mia met un peu de son argent de poche de côté chaque semaine. Calcule avec ses variables.</p>`,
    taskHtml:
      "Combien Mia a-t-elle économisé au bout de <b>8 semaines</b> si elle met <b>5&nbsp;€</b> de côté chaque semaine ? Calcule avec les deux variables et affiche le résultat. (Pour vérifier : ça fait 40.)",
    hints: ["Pour multiplier, on utilise <code>*</code>.", "<code>print(par_semaine * semaines)</code>"],
    starterCode: py`
      par_semaine = 5
      semaines = 8
      # Calcule les économies et affiche le résultat
    `,
    solution: py`
      par_semaine = 5
      semaines = 8
      print(par_semaine * semaines)
    `,
    feedback: {
      needMult: "Laisse Python faire le calcul : pour multiplier, on utilise <code>*</code>.",
      useVars:
        "Calcule avec les <b>variables</b> plutôt qu'avec des nombres fixes : <code>par_semaine * semaines</code>. Comme ça, le résultat reste juste même si une valeur change.",
      result40: "Le résultat devrait être 40. Vérifie ton calcul.",
    },
    expert: {
      html: `
<p>Au bout de combien de semaines <b>entières</b> Mia aura-t-elle 100&nbsp;€ ? L'opérateur <code>//</code>
divise et laisse tomber les chiffres après la virgule (<code>100 // 5</code> donne 20).</p>
<p><b>Bonus :</b> crée <code>objectif = 100</code> et calcule avec <code>//</code> combien de semaines
il faut à Mia.</p>`,
      solution: py`
        par_semaine = 5
        objectif = 100
        print(objectif // par_semaine, "semaines")
      `,
      feedback: {
        floorDiv: "Utilise <code>//</code> pour diviser sans reste : <code>objectif // par_semaine</code>.",
        result20: "Tu devrais obtenir 20 semaines.",
      },
    },
  },

  "s1-l4": {
    title: "Histoires farfelues",
    story: "La radio ne capte que des bribes de mots : un animal, un lieu. Fais-en le message radio le plus farfelu de la lune de glace.",
    intro: `
<p>Comment faire entrer le contenu d'une variable <i>dans</i> un texte ? Une chaîne normale affiche
tout tel quel : <code>print("J'adore animal")</code> écrit vraiment « J'adore animal ».
La solution, c'est une <b>f-string</b> : mets un <code>f</code> juste avant le guillemet et écris la
variable entre accolades <code>{ }</code>.</p>

<pre><code>animal = "chat"
print(f"Un {animal} apprend Python !")</code></pre>

<p>Le <code>f</code> veut dire « format ». Seuls les noms entre <code>{ }</code> sont remplacés par
leur valeur, tout le reste est du texte normal. Avec ça, tu fabriques en un clin d'œil des phrases,
des histoires ou des fiches de présentation.</p>`,
    taskHtml:
      "Écris avec une <b>f-string</b> une phrase farfelue dans laquelle apparaissent <code>animal</code> et <code>lieu</code>.",
    hints: [
      `Commence par <code>print(f"...")</code> – n'oublie pas le <code>f</code> !`,
      "Mets les variables entre accolades : <code>{animal}</code> et <code>{lieu}</code>.",
    ],
    starterCode: py`
      animal = "chat"
      lieu = "lune"
      # Construis une phrase rigolote avec une f-string
    `,
    solution: py`
      animal = "chat"
      lieu = "lune"
      print(f"Un {animal} danse sur la {lieu} !")
    `,
    feedback: {
      twoFields: "Mets les <b>deux</b> variables entre accolades dans ta f-string : <code>{animal}</code> et <code>{lieu}</code>.",
      valuesInOutput:
        "Les valeurs de <code>animal</code> et de <code>lieu</code> doivent apparaître dans l'affichage – avec une f-string et des accolades.",
    },
    expert: {
      html: `
<p>Entre les <code>{ }</code>, tu peux même <b>calculer</b> : <code>print(f"{3 * 4} buts")</code>
affiche « 12 buts ».</p>
<p><b>Bonus :</b> crée <code>victoires = 5</code> et affiche avec une f-string combien de points ça
fait (3 points par victoire) – en calculant <i>à l'intérieur</i> des accolades.</p>`,
      solution: py`
        victoires = 5
        print(f"{victoires} victoires, ça fait {victoires * 3} points !")
      `,
      feedback: {
        calcInBraces: "Calcule directement entre les accolades : <code>{victoires * 3}</code>.",
        result15: "Avec 5 victoires, tu devrais obtenir 15 points.",
      },
    },
  },

  "s1-l5": {
    title: "Discute avec l'ordinateur",
    story: "La station veut savoir à qui elle a affaire. Apprends-lui à demander ton prénom – et à te saluer.",
    intro: `
<p><code>input()</code> met ton programme en pause, affiche une question et attend que tu tapes
quelque chose et que tu appuies sur Entrée. Le mieux, c'est de ranger ta réponse dans une variable.</p>

<pre><code>prenom = input("Comment tu t'appelles ? ")
print("Salut " + prenom)</code></pre>

<p>Le texte entre les parenthèses, c'est la question (on dit aussi le « prompt »). Avec <code>+</code>,
tu peux <b>coller</b> deux textes l'un à l'autre – fais attention à l'espace dans <code>"Salut "</code>.</p>

<p><b>À retenir :</b> <code>input()</code> renvoie <i>toujours</i> du texte – même si tu tapes un
nombre. Comment en faire un vrai nombre, tu le verras au chapitre 2.</p>`,
    taskHtml:
      "Demande le prénom, puis affiche un <b>message d'accueil personnalisé</b> dans lequel le prénom apparaît. Quand tu exécutes le programme, un champ de saisie apparaît en bas, dans la console.",
    hints: [
      "La réponse se trouve dans la variable <code>prenom</code>.",
      `Pour coller : <code>print("Salut " + prenom)</code>`,
    ],
    starterCode: py`
      prenom = input("Comment tu t'appelles ? ")
      # Salue la personne avec un message personnalisé
    `,
    solution: py`
      prenom = input("Comment tu t'appelles ? ")
      print("Bienvenue, " + prenom + " !")
    `,
    feedback: {
      nameInGreeting:
        `Le prénom saisi doit apparaître dans ton message : <code>print("Salut " + prenom)</code> – <code>prenom</code> sans guillemets.`,
    },
    expert: {
      html: `
<p><b>Bonus :</b> pose <b>deux</b> questions (par exemple le prénom et la ville) et assemble les
réponses en une phrase avec une <b>f-string</b> – c'est plus agréable à lire qu'avec
<code>+</code>.</p>`,
      solution: py`
        prenom = input("Prénom : ")
        ville = input("Tu habites où ? ")
        print(f"{prenom} habite à {ville} – trop cool !")
      `,
      feedback: { bothInSentence: "Tes deux réponses doivent apparaître dans ta phrase." },
    },
  },

  "s1-boss1": {
    title: "Ton générateur de profil",
    story: "Le sas de sécurité ne laisse passer que les membres de l'équipage qui ont une carte d'identité. Construis un générateur de profil pour que la station fasse ta connaissance.",
    intro: `
<p>C'est le moment de tout combiner ! Tu poses quelques questions et, avec les réponses, tu fabriques
une jolie carte de profil. Pour ça, il te faut <code>input()</code> (demander), des variables
(retenir) et des f-strings (afficher).</p>

<pre><code>prenom = input("Prénom : ")
print(f"Prénom : {prenom}")</code></pre>

<p>Astuce : commence par une seule question, teste, puis ajoutes-en d'autres petit à petit.</p>`,
    taskHtml:
      "Pose au moins <b>trois</b> questions avec <code>input()</code> et affiche une <b>carte de profil</b> où toutes les réponses apparaissent – avec des f-strings.",
    hints: [
      `Ajoute un autre <code>input(…)</code> en dessous, par exemple <code>animal = input("Animal préféré : ")</code>.`,
      `Une ligne par réponse : <code>print(f"Prénom : {prenom}")</code>`,
    ],
    starterCode: py`
      prenom = input("Prénom : ")
      loisir = input("Loisir préféré : ")
      # Pose encore une question et affiche une carte de profil avec des f-strings
    `,
    solution: py`
      prenom = input("Prénom : ")
      loisir = input("Loisir préféré : ")
      animal = input("Animal préféré : ")
      print("--- PROFIL ---")
      print(f"Prénom : {prenom}")
      print(f"Loisir : {loisir}")
      print(f"Animal : {animal}")
    `,
    feedback: {
      allAnswers: "<b>Toutes</b> les réponses doivent apparaître sur ta carte de profil. Affiche chaque variable avec une f-string.",
    },
    expert: {
      html: `
<p>Rends ta carte plus stylée : un cadre en caractères, ça fait tout de suite de l'effet.
<code>"=" * 20</code> crée une ligne de 20 signes égal.</p>
<p><b>Bonus :</b> place une ligne de ce genre au-dessus et en dessous de ta carte de profil (au moins 10 caractères).</p>`,
      solution: py`
        prenom = input("Prénom : ")
        loisir = input("Loisir préféré : ")
        animal = input("Animal préféré : ")
        print("=" * 24)
        print(f"  PROFIL : {prenom}")
        print(f"  Loisir : {loisir} · Animal : {animal}")
        print("=" * 24)
      `,
      feedback: {
        frame: `Affiche une ligne au-dessus et en dessous de ta carte de profil, par exemple <code>print("=" * 20)</code>.`,
      },
    },
  },

  // ================================================================== CHAPITRE 2
  "s2-l1": {
    title: "Si… alors…",
    story: "La porte du hangar ne s'ouvre que s'il y a assez de points d'énergie. Apprends-lui aussi à dire non, gentiment.",
    intro: `
<p>Les programmes doivent <b>prendre des décisions</b>. Avec <code>if</code> (« si »), tu vérifies une
condition : si elle est vraie, le bloc indenté en dessous s'exécute. <code>else</code> (« sinon »),
c'est l'autre cas.</p>

<pre><code>points = 120
if points &gt;= 100:
    print("Niveau réussi !")
else:
    print("Presque ! On continue.")</code></pre>

<p><b>Python est très strict sur deux règles :</b> après la condition vient un <b>deux-points</b>
<code>:</code>, et les lignes qui en font partie sont <b>indentées</b>, c'est-à-dire décalées vers la
droite (4 espaces – la touche Tab le fait pour toi).</p>

<p>Pour comparer, tu as <code>==</code> (égal), <code>!=</code> (différent),
<code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> et <code>&gt;=</code>.
Attention : <code>==</code> demande « est-ce égal ? », alors que <code>=</code> affecte une valeur.</p>

<p><b>Nouveau : saisir des nombres.</b> <code>input()</code> renvoie toujours du texte. Avec
<code>int(…)</code>, tu le transformes en nombre entier, que Python peut comparer et utiliser dans
des calculs :</p>
<pre><code>points = int(input("Combien de points ? "))</code></pre>`,
    taskHtml:
      "Ajoute un bloc <code>else</code> qui affiche un message d'encouragement quand il y a <b>moins de 100</b> points. Teste ton programme avec 120, puis avec 50.",
    hints: [
      "<code>else:</code> est aligné exactement sous le <code>if</code> – et il a lui aussi un deux-points.",
      `La ligne en dessous est indentée : <code>    print("Presque ! Continue à t'entraîner !")</code>`,
    ],
    starterCode: py`
      points = int(input("Combien de points as-tu ? "))
      if points >= 100:
          print("Niveau réussi ! 🎉")
      # Ajoute ici le cas else
    `,
    solution: py`
      points = int(input("Combien de points as-tu ? "))
      if points >= 100:
          print("Niveau réussi ! 🎉")
      else:
          print("Presque ! Continue à t'entraîner !")
    `,
    feedback: {
      noElseOutput: "Avec 50 points, rien ne s'affiche encore. Affiche un message dans le bloc <code>else</code>.",
      sameOutput: "Avec 120 points et avec 50 points, on obtient la même chose. Le bloc <code>else</code> doit afficher un autre message.",
      boundary: "Avec exactement 100 points, le niveau est réussi – laisse la condition <code>points &gt;= 100</code> telle quelle.",
    },
    expert: {
      html: `
<p>Pour plus de deux cas, il y a <code>elif</code> (« sinon, si »). Python vérifie les conditions de
haut en bas et prend la première qui est vraie.</p>
<p><b>Bonus :</b> construis trois paliers : à partir de 100 points « Niveau réussi », à partir de
50 points « Presque réussi », sinon « Continue à t'entraîner ».</p>`,
      solution: py`
        points = int(input("Combien de points as-tu ? "))
        if points >= 100:
            print("Niveau réussi ! 🎉")
        elif points >= 50:
            print("Presque réussi !")
        else:
            print("Continue à t'entraîner !")
      `,
      feedback: { threeCases: "Avec 120, 70 et 10 points, un message différent doit s'afficher à chaque fois." },
    },
  },

  "s2-l2": {
    title: "Vrai ou faux ?",
    story: "Les capteurs du hangar ne répondent plus que True ou False. Vérifie que tu comprends leur langage.",
    intro: `
<p>Chaque comparaison a un résultat : <code>True</code> (vrai) ou <code>False</code> (faux).
On appelle ça une <b>valeur de vérité</b>, ou booléen (en anglais : <i>boolean</i>). C'est exactement
avec ça que <code>if</code> prend sa décision.</p>

<pre><code>print(10 &gt; 3)    # True
print(5 == 6)   # False</code></pre>

<p>Tout ce qui suit un <code>#</code> est un <b>commentaire</b> – une note pour les humains, que
Python ignore.</p>`,
    taskHtml:
      "Affiche les résultats d'<b>au moins trois comparaisons différentes</b>. Au moins une doit donner <code>False</code>.",
    hints: [
      "Affiche directement les comparaisons : <code>print(7 &gt; 2)</code>",
      "Pour obtenir <code>False</code>, par exemple : <code>print(5 == 6)</code>",
    ],
    starterCode: py`
      # Fais vérifier au moins trois comparaisons à Python
      print(10 > 3)
    `,
    solution: py`
      print(10 > 3)
      print(5 == 5)
      print("pomme" == "poire")
    `,
    feedback: {
      threeCompares:
        "Il te faut au moins trois comparaisons, par exemple avec <code>&gt;</code>, <code>&lt;</code> et <code>==</code>.",
      printResults: "Affiche le résultat de chaque comparaison avec <code>print(…)</code>.",
      needFalse: "Au moins une comparaison doit donner <code>False</code>, par exemple <code>print(5 == 6)</code>.",
    },
    expert: {
      html: `
<p>On peut <b>combiner</b> des conditions : <code>and</code> (les deux doivent être vraies),
<code>or</code> (au moins une) et <code>not</code> (inverse le résultat).</p>
<p><b>Bonus :</b> crée <code>age = 12</code> et vérifie avec <code>and</code> si l'âge est compris
entre 10 et 15. Affiche le résultat.</p>`,
      solution: py`
        age = 12
        print(age >= 10 and age <= 15)
      `,
      feedback: {
        useAnd: "Relie les deux comparaisons avec <code>and</code> : <code>age &gt;= 10 and age &lt;= 15</code>.",
        printBool: "Affiche le résultat (<code>True</code> ou <code>False</code>) avec <code>print(…)</code>.",
      },
    },
  },

  "s2-l3": {
    title: "Le hasard décide",
    story: "Pour le jeu de rovers de l'équipage, il manque un dé. Lumo en voudrait bien un qui soit vraiment aléatoire.",
    intro: `
<p>Le hasard rend les jeux palpitants. Python fournit des outils tout prêts dans des <b>modules</b> –
tu les récupères avec <code>import</code>. Le module <code>random</code> sait lancer des dés.</p>

<pre><code>import random
nombre = random.randint(1, 6)
print("Le dé tombe sur", nombre)</code></pre>

<p><code>random.randint(1, 6)</code> donne un nombre entier au hasard entre 1 et 6 (les deux
extrémités comprises). <code>import random</code> s'écrit une seule fois, tout en haut du programme.
Avec une virgule, tu peux mélanger texte et nombre dans <code>print</code>.</p>`,
    taskHtml: "Fabrique un <b>dé</b> : affiche un nombre au hasard entre 1 et 6. Exécute le programme plusieurs fois !",
    hints: [
      "<code>import random</code> est déjà tout en haut.",
      "<code>nombre = random.randint(1, 6)</code>, puis <code>print(nombre)</code>.",
    ],
    starterCode: py`
      import random
      # Lance le dé (un nombre de 1 à 6) et affiche le résultat
    `,
    solution: py`
      import random
      nombre = random.randint(1, 6)
      print("Le dé tombe sur", nombre)
    `,
    feedback: {
      useRandint: "Utilise <code>random.randint(1, 6)</code> pour obtenir un nombre au hasard.",
      range16: "Le nombre du dé doit être compris entre 1 et 6 et se trouver à la fin de l'affichage.",
      notRandom: "Le nombre est toujours le même. Affiche le résultat de <code>random.randint(1, 6)</code>.",
    },
    expert: {
      html: `
<p>Avec <code>random.choice([...])</code>, tu tires au hasard un élément <b>d'une liste</b> –
parfait pour une roue de la fortune.</p>
<p><b>Bonus :</b> construis une roue de la fortune avec au moins <b>quatre</b> lots de ton choix.</p>`,
      solution: py`
        import random
        lots = ["Rien du tout 😅", "Une glace", "5 points", "Un joker", "Le gros lot !"]
        print("Tu gagnes :", random.choice(lots))
      `,
      feedback: {
        useChoice: "Utilise <code>random.choice(lots)</code> pour tirer un lot au hasard.",
        fourPrizes: `Ta liste doit contenir au moins quatre lots : <code>["A", "B", "C", "D"]</code>.`,
        notRandom: "Le résultat est toujours le même. Affiche ce que <code>random.choice(…)</code> a tiré.",
      },
    },
  },

  "s2-l4": {
    title: "Le beat en boucle",
    story: "Les haut-parleurs du hangar grésillent de nouveau. C'est l'heure du premier beat depuis des années – fais-le tourner en boucle !",
    intro: `
<p>Au lieu de copier une ligne quatre fois, tu la fais <b>répéter</b>. C'est le travail de la boucle
<code>for</code> :</p>

<pre><code>for i in range(4):
    print("Boum - Tchak")</code></pre>

<p><code>range(4)</code> compte <code>0, 1, 2, 3</code> – donc quatre tours. La variable
<code>i</code> est le compteur du tour en cours. Ici aussi : un <b>deux-points</b> à la fin, et la
partie répétée est <b>indentée</b>.</p>

<p><b>Pour entendre ton beat, il y a le haut-parleur de la station.</b> Importe pour ça <code>drum</code>
(la batterie) et <code>note</code> (les notes) depuis le module <code>station</code> :</p>

<pre><code>from station import drum, note

for i in range(4):
    drum("kick")
    drum("snare")
note("do5", 2)</code></pre>

<p>Batterie : <code>"kick"</code>, <code>"snare"</code>, <code>"hihat"</code>, <code>"clap"</code>,
<code>"tom"</code>. Notes : <code>"do4"</code>, <code>"ré4"</code>, <code>"mi4"</code>… ou
<code>"C4"</code>, <code>"D4"</code>, <code>"E4"</code>… Le nombre après la virgule est la durée
en temps (sans nombre : un temps).</p>`,
    taskHtml:
      "Construis un <b>beat</b> avec une <b>boucle <code>for</code></b> qui se répète <b>au moins trois fois</b> – à écouter avec <code>drum()</code> ou <code>note()</code>, ou en texte avec <code>print()</code>. La commande n'apparaît qu'une seule fois dans le code, c'est la boucle qui la répète.",
    hints: [
      `<code>for i in range(4):</code> et en dessous, indenté, <code>drum("kick")</code> ou <code>print(…)</code>.`,
      "Pour le son, il faut <code>from station import drum, note</code> tout en haut – c'est déjà là.",
    ],
    starterCode: py`
      from station import drum, note

      # Construis ton beat avec une boucle for
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
      useRange: "Utilise <code>range(…)</code>, par exemple <code>for i in range(4):</code>.",
      printInLoop:
        "La commande (<code>drum</code>, <code>note</code> ou <code>print</code>) doit être <b>indentée</b> sous la ligne <code>for</code> pour être répétée.",
      threeTimes: "Ton beat doit retentir au moins trois fois (ou donner au moins trois lignes). Augmente le nombre dans <code>range(…)</code>.",
    },
    expert: {
      html: `
<p>Le compteur <code>i</code> est bien pratique : avec lui, tu peux numéroter ce que tu affiches.
<code>range(1, 6)</code> compte de 1 à 5.</p>
<p><b>Bonus :</b> affiche avec une boucle « Manche 1 » jusqu'à « Manche 5 ».</p>`,
      solution: py`
        for i in range(1, 6):
            print(f"Manche {i}")
      `,
      feedback: {
        numbered: `Les lignes doivent être numérotées de 1 à 5 : <code>print(f"Manche {i}")</code> avec <code>range(1, 6)</code>.`,
      },
    },
  },

  "s2-l5": {
    title: "Dessine des motifs",
    story: "Les lampes de signalisation du portail du hangar doivent afficher un motif qui grandit. Pour l'instant, chaque rangée brille pareil – on peut faire mieux.",
    intro: `
<p>Avec <code>*</code>, tu peux non seulement calculer, mais aussi <b>multiplier</b> du texte :
<code>"ab" * 3</code> donne <code>"ababab"</code>. Avec une boucle et le compteur <code>i</code>,
tu obtiens des motifs qui grandissent.</p>

<pre><code>for i in range(1, 4):
    print("#" * i)</code></pre>

<p><code>range(1, 4)</code> compte de 1 à 3. Au premier tour, <code>i</code> vaut donc 1, puis 2,
puis 3 – et la ligne contient exactement autant de caractères.</p>`,
    taskHtml:
      "Le motif ci-dessous est encore ennuyeux : toutes les lignes ont la même longueur. Modifie le programme pour que chaque ligne soit <b>plus longue que la précédente</b>. Tu peux choisir ton symbole librement.",
    hints: [
      `<code>"#" * 3</code> donne <code>###</code>. Et que donne alors <code>"#" * i</code> ?`,
      `Remplace le 3 fixe par le compteur : <code>print("⭐" * i)</code>`,
    ],
    starterCode: py`
      # Le motif est encore ennuyeux : toutes les lignes ont la même longueur.
      for i in range(1, 6):
          print("⭐" * 3)
    `,
    solution: py`
      for i in range(1, 6):
          print("⭐" * i)
    `,
    feedback: {
      grow: `Les lignes ont encore toutes la même longueur. Fais grandir la longueur avec le compteur : <code>"⭐" * i</code>.`,
    },
    expert: {
      html: `
<p>Avec des espaces au début, tu peux décaler un motif vers la droite – et voilà une
<b>pyramide</b>. Astuce : <code>" " * (5 - i)</code> pour l'espace vide et <code>"*" * (2 * i - 1)</code>
pour les étoiles.</p>
<p><b>Bonus :</b> dessine une pyramide d'au moins quatre lignes qui s'élargit vers le bas.</p>`,
      solution: py`
        for i in range(1, 6):
            print(" " * (5 - i) + "*" * (2 * i - 1))
      `,
      feedback: {
        indent: `Chaque ligne doit commencer par moins d'espaces que la précédente : <code>" " * (5 - i)</code>.`,
        wider: "Il doit y avoir de plus en plus d'étoiles d'une ligne à l'autre.",
      },
    },
  },

  "s2-l6": {
    title: "Tant que…",
    story: "Le rover attend sur la rampe, prêt à partir. Il ne manque plus que le compte à rebours.",
    intro: `
<p>La boucle <code>while</code> répète quelque chose <b>tant qu'</b>une condition est vraie –
idéal quand tu ne sais pas à l'avance combien de fois.</p>

<pre><code>nombre = 3
while nombre &gt; 0:
    print(nombre)
    nombre = nombre - 1
print("C'est parti !")</code></pre>

<p><b>Très important :</b> dans la boucle, quelque chose doit changer pour que la condition finisse
par devenir <code>False</code> – ici, <code>nombre</code> diminue. Sinon, la boucle tourne
<i>à l'infini</i>. Pas de panique : Codaluna s'en rend compte et arrête ton programme (ou tu appuies
sur <b>Stop</b>).</p>`,
    taskHtml:
      "Lance un <b>compte à rebours de 10 à 1</b> avec une boucle <code>while</code>, puis affiche <code>Décollage ! 🚀</code>.",
    hints: [
      "<code>while nombre &gt; 0:</code> – et en dessous, indenté, <code>print(nombre)</code>.",
      "Diminue le nombre dans la boucle : <code>nombre = nombre - 1</code>. Sinon, elle tourne à l'infini !",
    ],
    starterCode: py`
      nombre = 10
      # Compte à rebours de 10 à 1 avec une boucle while,
      # puis affiche "Décollage ! 🚀"
    `,
    solution: py`
      nombre = 10
      while nombre > 0:
          print(nombre)
          nombre = nombre - 1
      print("Décollage ! 🚀")
    `,
    feedback: {
      countdown: "L'affichage doit compter à rebours de 10 à 1 – un nombre par ligne.",
      finalLine: "Après la boucle, affiche encore « Décollage ! 🚀 » – <b>sans</b> indentation, pour que ça n'apparaisse qu'une fois.",
    },
    expert: {
      html: `
<p>Dans une boucle, on peut aussi <b>accumuler</b> quelque chose : une deuxième variable grandit à
chaque tour.</p>
<p><b>Bonus :</b> calcule avec une boucle <code>while</code> la somme de tous les nombres de 1 à 10
et affiche-la.</p>`,
      solution: py`
        nombre = 1
        somme = 0
        while nombre <= 10:
            somme = somme + nombre
            nombre = nombre + 1
        print("Somme :", somme)
      `,
      feedback: {
        accumulate: "Il te faut deux variables qui changent : le compteur et la somme (<code>somme = somme + nombre</code>).",
        result55: "La somme de 1 à 10 fait 55. Ta boucle va-t-elle bien jusqu'à 10 inclus ?",
      },
    },
  },

  "s2-boss2": {
    title: "Devine le nombre",
    story: "Le portail du hangar est protégé par un code secret, et la serrure ne dit que « trop grand » ou « trop petit ». Construis le jeu et craque le code !",
    intro: `
<p>Le grand classique ! L'ordinateur choisit un nombre en secret, et toi, tu le devines – avec les
indices « trop grand » ou « trop petit », jusqu'à ce que tu le trouves. Il te faut tout ce que tu as
vu dans ce chapitre : <code>random</code>, <code>while</code>, <code>int(input())</code> et
<code>if</code>/<code>elif</code>.</p>

<p>La boucle <code>while nombre != secret:</code> tourne tant que ta proposition <b>n'est pas</b> la
bonne. Mais il y manque encore le plus important : les indices.</p>`,
    taskHtml:
      "Termine le jeu : dans la boucle, le programme doit afficher <b>« trop grand »</b> ou <b>« trop petit »</b> selon la proposition. Quand c'est le bon nombre, pas d'indice. Ensuite, essaie toi-même !",
    hints: [
      "<code>if nombre &gt; secret:</code> → trop grand.",
      "<code>elif nombre &lt; secret:</code> → trop petit. Les deux sont indentés dans la boucle, sous la ligne avec <code>input</code>.",
    ],
    starterCode: py`
      import random
      secret = random.randint(1, 20)
      nombre = 0

      while nombre != secret:
          nombre = int(input("Ton nombre (1-20) : "))
          # Donne un indice ici : trop grand ou trop petit ?

      print("Trouvé ! 🎉")
    `,
    solution: py`
      import random
      secret = random.randint(1, 20)
      nombre = 0

      while nombre != secret:
          nombre = int(input("Ton nombre (1-20) : "))
          if nombre > secret:
              print("trop grand")
          elif nombre < secret:
              print("trop petit")

      print("Trouvé ! 🎉")
    `,
    feedback: {
      tooHigh: "Quand la proposition est trop grande, aucun indice ne s'affiche encore. Vérifie avec <code>if nombre &gt; secret:</code>.",
      tooLow: "Quand la proposition est trop petite, aucun indice ne s'affiche encore. Vérifie avec <code>elif nombre &lt; secret:</code>.",
      highLow: "Pour une proposition trop grande et pour une trop petite, le même indice s'affiche. Donne des indices différents.",
      winNoHint:
        "Quand c'est le bon nombre, ni « trop grand » ni « trop petit » ne doit s'afficher. Utilise <code>elif nombre &lt; secret:</code> au lieu de <code>else:</code>.",
    },
    expert: {
      html: `
<p><b>Bonus :</b> compte les essais et affiche à la fin combien il en a fallu – par exemple
« Trouvé en 3 essais ! ». Astuce : crée <code>essais = 0</code> avant la boucle et augmente la valeur
à chaque proposition.</p>`,
      solution: py`
        import random
        secret = random.randint(1, 20)
        nombre = 0
        essais = 0

        while nombre != secret:
            nombre = int(input("Ton nombre (1-20) : "))
            essais = essais + 1
            if nombre > secret:
                print("trop grand")
            elif nombre < secret:
                print("trop petit")

        print(f"Trouvé en {essais} essais ! 🎉")
      `,
      feedback: {
        counter: "Augmente un compteur dans la boucle : <code>essais = essais + 1</code>.",
        count3: "Après les propositions 12, 3 et 7, la fin devrait indiquer « 3 » essais. Comptes-tu chaque proposition exactement une fois ?",
        count1: "Si on trouve du premier coup, il faut 1 essai. Ton compteur commence-t-il bien à 0 ?",
      },
    },
  },

  // ================================================================== CHAPITRE 3
  "s3-l1": {
    title: "Les listes – ta collection",
    story: "Au labo, tout est sens dessus dessous. Commence par une liste – des échantillons, de la musique pour l'équipe de nuit, peu importe.",
    intro: `
<p>Une <b>liste</b> regroupe plein de valeurs dans une seule variable – une playlist, une équipe,
une liste d'affaires à emporter. Tu l'écris entre crochets <code>[ ]</code>, avec des virgules entre
les éléments.</p>

<pre><code>playlist = ["Chanson A", "Chanson B", "Chanson C"]
print(playlist)
print(playlist[0])   # le premier élément</code></pre>

<p>Tu accèdes à chaque élément grâce à sa <b>position</b> – et les positions commencent à <code>0</code> !
<code>playlist[0]</code> est le premier élément, <code>playlist[1]</code> le deuxième.</p>`,
    taskHtml:
      "Crée une <b>liste</b> (playlist, équipe, plats préférés…) d'au moins 3 éléments. Affiche la liste entière, puis le <b>premier</b> élément tout seul.",
    hints: [
      `Des crochets, et des virgules entre les éléments : <code>plats = ["Pizza", "Crêpes", "Sushis"]</code>`,
      "Le premier élément, tu l'obtiens avec <code>plats[0]</code>.",
    ],
    starterCode: py`
      # Crée une liste d'au moins 3 choses
      # Affiche la liste, puis son premier élément
    `,
    solution: py`
      playlist = ["Chanson A", "Chanson B", "Chanson C"]
      print(playlist)
      print(playlist[0])
    `,
    feedback: {
      printList: "Affiche la liste entière avec <code>print(…)</code>.",
      printFirst: "Affiche ensuite le premier élément sur une ligne à part. Les positions commencent à 0 : <code>liste[0]</code>.",
    },
    expert: {
      html: `
<p><code>len(liste)</code> te dit combien d'éléments contient une liste. Et avec
<code>liste[-1]</code>, tu pars de la fin – c'est le dernier élément.</p>
<p><b>Bonus :</b> affiche combien d'éléments contient ta liste, puis son dernier élément avec <code>[-1]</code>.</p>`,
      solution: py`
        playlist = ["Chanson A", "Chanson B", "Chanson C"]
        print("Nombre de chansons :", len(playlist))
        print("Dernière :", playlist[-1])
      `,
      feedback: {
        useLen: "Utilise <code>len(liste)</code> pour le nombre d'éléments.",
        useNeg: "Le dernier élément, tu l'obtiens avec <code>liste[-1]</code>.",
        printBoth: "Affiche le nombre d'éléments et le dernier élément.",
      },
    },
  },

  "s3-l2": {
    title: "Modifier des listes",
    story: "De nouvelles provisions sont arrivées. Ajoute-les à la liste et mets de l'ordre dans ce chaos.",
    intro: `
<p>Une liste peut être modifiée après coup. Avec un point, tu utilises des <b>méthodes</b> – ce sont
de petites commandes qui appartiennent à la liste :</p>

<pre><code>equipe = ["Yara", "Noah"]
equipe.append("Lena")   # ajouter à la fin
equipe.sort()           # trier par ordre alphabétique
print(equipe)</code></pre>

<p><code>.append(x)</code> ajoute <code>x</code> à la fin, <code>.sort()</code> trie la liste. Ces
méthodes modifient directement la liste – c'est pour ça que le nom de la liste se trouve devant le point.</p>`,
    taskHtml:
      "Ajoute au moins un prénom à la liste avec <code>.append(…)</code>, <b>trie-la</b> ensuite avec <code>.sort()</code> et affiche-la.",
    hints: [
      `Pour ajouter : <code>equipe.append("Prénom")</code>`,
      "Pour trier : <code>equipe.sort()</code>, puis <code>print(equipe)</code>",
    ],
    starterCode: py`
      equipe = ["Yara", "Noah"]
      # Ajoute quelqu'un, trie la liste et affiche-la
    `,
    solution: py`
      equipe = ["Yara", "Noah"]
      equipe.append("Lena")
      equipe.sort()
      print(equipe)
    `,
    feedback: {
      useAppend: `Ajoute quelqu'un avec <code>equipe.append("Prénom")</code>.`,
      useSort: "Trie la liste avec <code>equipe.sort()</code>.",
      sortNone:
        "Ton programme affiche <code>None</code> : <code>equipe.sort()</code> trie la liste directement et ne renvoie rien. Écris seulement <code>equipe.sort()</code>, pas <code>equipe = equipe.sort()</code>.",
      threeNames: "À la fin, la liste doit contenir au moins 3 prénoms.",
      sorted:
        "Affiche la liste <b>triée</b>. Appelles-tu bien <code>.sort()</code> <b>après</b> l'ajout et avant le <code>print</code> ?",
    },
    expert: {
      html: `
<p>D'autres méthodes : <code>.remove("x")</code> retire un élément, <code>.reverse()</code>
inverse l'ordre.</p>
<p><b>Bonus :</b> retire un prénom de l'équipe, inverse l'ordre et affiche le résultat.</p>`,
      solution: py`
        equipe = ["Yara", "Noah", "Lena"]
        equipe.remove("Noah")
        equipe.reverse()
        print(equipe)
      `,
      feedback: {
        useRemove: `Retire quelqu'un avec <code>equipe.remove("Prénom")</code>.`,
        useReverse: "Inverse l'ordre de la liste avec <code>equipe.reverse()</code>.",
      },
    },
  },

  "s3-l3": {
    title: "Pour chaque élément…",
    story: "Lumo doit vérifier chaque élément de la liste, l'un après l'autre. Une boucle s'en charge en quelques secondes.",
    intro: `
<p>Avec <code>for … in liste</code>, tu passes en revue <b>chaque élément</b> l'un après l'autre –
sans avoir à compter les positions :</p>

<pre><code>chansons = ["A", "B", "C"]
for chanson in chansons:
    print("Lecture en cours :", chanson)</code></pre>

<p>À chaque tour, <code>chanson</code> contient l'élément suivant. Ce nom, tu peux le choisir
librement – <code>for x in chansons</code> marcherait aussi, mais un nom parlant se lit mieux.</p>`,
    taskHtml:
      "Parcours la liste avec une boucle <code>for</code> et affiche <b>chaque élément sur sa propre ligne</b> – avec un petit texte devant si tu veux, par exemple « Lecture en cours : … ».",
    hints: ["<code>for chanson in chansons:</code>", "En dessous, indenté : <code>print(chanson)</code>"],
    starterCode: py`
      chansons = ["Intro", "Beat 1", "Finale"]
      # Affiche chaque chanson séparément
    `,
    solution: py`
      chansons = ["Intro", "Beat 1", "Finale"]
      for chanson in chansons:
          print("Lecture en cours :", chanson)
    `,
    feedback: {
      loopOverList: "Fais tourner la boucle directement sur la liste : <code>for chanson in chansons:</code>",
      printInLoop: "Le <code>print(…)</code> doit être indenté dans la boucle.",
      eachItem: "Chaque élément de la liste doit apparaître dans l'affichage – un par ligne.",
    },
    expert: {
      html: `
<p>Si ta liste contient des nombres, tu peux calculer une <b>somme</b> dans la boucle.</p>
<p><b>Bonus :</b> additionne avec une boucle tous les buts de la liste <code>buts = [2, 1, 3, 0, 2]</code>
(sans <code>sum()</code>) et affiche le total.</p>`,
      solution: py`
        buts = [2, 1, 3, 0, 2]
        somme = 0
        for b in buts:
            somme = somme + b
        print("Buts au total :", somme)
      `,
      feedback: {
        accumulate: "Crée <code>somme = 0</code> avant la boucle et, dans la boucle, ajoute chaque but au total.",
        result8: "Au total, ça fait 8 buts.",
      },
    },
  },

  "s3-l4": {
    title: "Crée tes propres commandes",
    story: "Lumo en a assez de tout expliquer dix fois. Crée ta propre commande pour saluer les visiteurs.",
    intro: `
<p>Une <b>fonction</b> est une commande à toi, que tu construis une fois et que tu peux appeler
autant de fois que tu veux. Tu la définis avec <code>def</code> ; entre les parenthèses, il y a les
<b>paramètres</b> – des valeurs que la fonction reçoit quand on l'appelle.</p>

<pre><code>def saluer(prenom):
    print(f"Salut {prenom} ! 👋")

saluer("Deniz")
saluer("Fatima")</code></pre>

<p>Le bloc indenté, c'est le « plan de construction ». Il ne s'exécute qu'au moment de
l'<b>appel</b> – avec la valeur que tu donnes. Comme ça, tu évites de te répéter.</p>`,
    taskHtml: "Appelle la fonction <code>saluer</code> avec <b>deux prénoms différents</b>.",
    hints: [
      `Un appel : <code>saluer("Mia")</code>`,
      "Deux appels l'un sous l'autre, sans indentation, avec des prénoms différents.",
    ],
    starterCode: py`
      def saluer(prenom):
          print(f"Salut {prenom} ! 👋")

      # Appelle la fonction avec deux prénoms différents
    `,
    solution: py`
      def saluer(prenom):
          print(f"Salut {prenom} ! 👋")

      saluer("Mia")
      saluer("Jonas")
    `,
    feedback: {
      twoCalls: `Appelle la fonction deux fois, chaque fois sur sa propre ligne : <code>saluer("Mia")</code>.`,
      differentNames: "Prends deux prénoms <b>différents</b>.",
    },
    expert: {
      html: `
<p>Une fonction peut avoir <b>plusieurs paramètres</b>, séparés par des virgules.</p>
<p><b>Bonus :</b> construis <code>saluer(prenom, moment)</code> pour obtenir par exemple
« Bonne journée, Mia ! », et appelle-la deux fois.</p>`,
      solution: py`
        def saluer(prenom, moment):
            print(f"Bonne {moment}, {prenom} !")

        saluer("Mia", "journée")
        saluer("Léo", "soirée")
      `,
      feedback: {
        twoParams: "Donne deux paramètres à la fonction : <code>def saluer(prenom, moment):</code>",
        twoCalls: "Appelle la fonction deux fois.",
        useBoth: "Les deux paramètres doivent apparaître dans le message.",
      },
    },
  },

  "s3-l5": {
    title: "Renvoyer un résultat",
    story: "Les appareils de mesure fournissent trois valeurs, mais il manque la moyenne. Construis une fonction qui la renvoie – pour tous les nombres.",
    intro: `
<p>Une fonction peut <b>renvoyer</b> un résultat – avec <code>return</code>. La différence avec
<code>print</code> : <code>print</code> ne fait qu'<i>afficher</i> quelque chose, <code>return</code>
<i>fournit</i> une valeur avec laquelle tu peux continuer à calculer.</p>

<pre><code>def double(x):
    return x * 2

resultat = double(5)
print(resultat)   # 10</code></pre>

<p>Après <code>return</code>, la fonction s'arrête et renvoie la valeur à l'endroit où elle a été
appelée. Cette valeur, tu peux la ranger dans une variable, l'afficher ou t'en resservir.</p>`,
    taskHtml:
      "Complète <code>moyenne</code> pour que la fonction <b>renvoie</b> la moyenne des trois nombres. Pour 2, 4 et 6, on obtient <b>4.0</b> (Python écrit les nombres à virgule avec un point) – et le résultat doit aussi être juste pour tous les autres nombres.",
    hints: [
      "La somme divisée par le nombre de valeurs : <code>(a + b + c) / 3</code> – les parenthèses sont importantes !",
      "Renvoie le résultat avec <code>return</code>, pas avec <code>print</code>.",
    ],
    starterCode: py`
      def moyenne(a, b, c):
          # Renvoie la moyenne des trois nombres
          return 0

      print(moyenne(2, 4, 6))
    `,
    solution: py`
      def moyenne(a, b, c):
          return (a + b + c) / 3

      print(moyenne(2, 4, 6))
    `,
    feedback: {
      returnsNothing: "Ta fonction ne renvoie encore rien. Utilise <code>return</code> au lieu de <code>print</code> dans la fonction.",
      wrongValues:
        "Pour d'autres nombres, le résultat n'est pas encore juste. Calcules-tu bien avec <code>a</code>, <code>b</code> et <code>c</code> ? Attention aux parenthèses : <code>(a + b + c) / 3</code>.",
      printResult: "Affiche le résultat pour 2, 4 et 6 : <code>print(moyenne(2, 4, 6))</code>.",
    },
    expert: {
      html: `
<p><b>Bonus :</b> écris <code>points(victoires, nuls)</code>, une fonction qui <b>renvoie</b> les points
d'une équipe de foot (victoire = 3 points, match nul = 1 point), et compare deux équipes avec.</p>`,
      solution: py`
        def points(victoires, nuls):
            return victoires * 3 + nuls

        print("Équipe A :", points(5, 3))
        print("Équipe B :", points(7, 1))
      `,
      feedback: {
        wrongValues:
          "Les points ne sont pas encore justes. Une victoire vaut 3 points, un match nul 1 point : <code>victoires * 3 + nuls</code>.",
      },
    },
  },

  "s3-l6": {
    title: "Dictionnaires – clé & valeur",
    story: "Chaque membre de l'équipage a une fiche d'équipement avec des clés et des valeurs. Complète la tienne.",
    intro: `
<p>Un <b>dictionnaire</b> range des paires <b>clé</b> et <b>valeur</b> – comme un vrai dictionnaire
(mot → définition) ou une fiche de présentation. Accolades <code>{ }</code>, deux-points entre la clé
et la valeur, virgules entre les paires :</p>

<pre><code>heros = {"nom": "Ada", "niveau": 3}
print(heros["nom"])      # Ada
print(heros["niveau"])   # 3</code></pre>

<p>Contrairement aux listes (accès par la <b>position</b>), ici tu utilises la <b>clé</b> :
<code>heros["nom"]</code>. Super pratique pour regrouper des infos qui vont ensemble.</p>`,
    taskHtml:
      "Complète le dictionnaire pour qu'il ait au moins <b>trois</b> paires (par exemple avec une arme, un animal de compagnie ou une couleur) et affiche <b>deux valeurs</b> grâce à leur clé.",
    hints: [
      `Une paire de plus : <code>heros = {"nom": "Ada", "niveau": 3, "couleur": "violet"}</code>`,
      `Accès par la clé : <code>print(heros["couleur"])</code>`,
    ],
    starterCode: py`
      heros = {"nom": "Ada", "niveau": 3}
      # Ajoute une troisième paire et affiche deux valeurs
    `,
    solution: py`
      heros = {"nom": "Ada", "niveau": 3, "couleur": "violet"}
      print(heros["nom"])
      print(heros["couleur"])
    `,
    feedback: {
      accessByKey: `Récupère deux valeurs grâce à leur clé : <code>heros["nom"]</code>.`,
      printValues: "Affiche au moins deux valeurs du dictionnaire.",
    },
    expert: {
      html: `
<p>Pour ajouter une nouvelle paire : <code>heros["points"] = 100</code>. Et avec
<code>for cle in heros:</code>, tu parcours toutes les clés.</p>
<p><b>Bonus :</b> ajoute une nouvelle paire, puis affiche toutes les paires avec une boucle.</p>`,
      solution: py`
        heros = {"nom": "Ada", "niveau": 3}
        heros["points"] = 100
        for cle in heros:
            print(cle, "=", heros[cle])
      `,
      feedback: {
        addKey: `Ajoute une paire : <code>heros["points"] = 100</code>.`,
        loopDict: "Parcours toutes les clés avec <code>for cle in heros:</code>.",
      },
    },
  },

  "s3-boss3": {
    title: "Ton mini-quiz",
    story: "L'IA de bord ne laisse entrer au labo que les membres de l'équipage qui réussissent son quiz. Inverse les rôles et construis ton propre quiz !",
    intro: `
<p>Construis un petit <b>quiz</b> sur le thème de ton choix (animaux, musique, sport, espace…).
Il pose des questions avec <code>input()</code>, vérifie les réponses avec <code>if</code> et compte
les points avec une variable.</p>

<pre><code>points = 0
reponse = input("Question ? ")
if reponse == "juste":
    points = points + 1</code></pre>

<p>Astuce : avec <code>reponse.lower()</code>, tu compares sans tenir compte des majuscules et des
minuscules – « Rome » compte alors autant que « rome ».</p>`,
    taskHtml:
      "Ajoute au quiz <b>au moins deux autres questions</b> (donc trois en tout). Compte chaque bonne réponse comme un point et affiche le score à la fin.",
    hints: [
      "Pour chaque question : un <code>input(…)</code> et un <code>if</code>/<code>else</code>.",
      "Pour une bonne réponse : <code>points = points + 1</code>. Le score s'affiche tout à la fin.",
    ],
    starterCode: py`
      points = 0

      reponse = input("Combien de pattes a une araignée ? ")
      if reponse == "8":
          points = points + 1
          print("Bonne réponse ! 🕷️")
      else:
          print("Raté de peu – il y en a 8.")

      # Ajoute ici au moins deux autres questions

      print("Points :", points)
    `,
    solution: py`
      points = 0

      reponse = input("Combien de pattes a une araignée ? ")
      if reponse == "8":
          points = points + 1
          print("Bonne réponse ! 🕷️")
      else:
          print("Raté de peu – il y en a 8.")

      reponse = input("Quelle est la capitale de l'Italie ? ")
      if reponse.lower() == "rome":
          points = points + 1
          print("Bonne réponse ! 🇮🇹")
      else:
          print("C'était Rome.")

      reponse = input("Quelle est la plus grande planète ? ")
      if reponse.lower() == "jupiter":
          points = points + 1
          print("Bonne réponse ! 🪐")
      else:
          print("C'est Jupiter.")

      print("Points :", points)
    `,
    feedback: {
      ifPerQuestion: "Vérifie chaque réponse avec son propre <code>if</code>.",
      countPoints: "À chaque bonne réponse, augmente les points : <code>points = points + 1</code>.",
      scoreAtEnd: `Affiche le score tout à la fin, par exemple <code>print("Points :", points)</code>.`,
    },
    expert: {
      html: `
<p>Version pro : range les questions dans une <b>liste de dictionnaires</b>
(<code>{"question": …, "reponse": …}</code>) et parcours-les avec <b>une seule</b> boucle. Comme ça,
tu n'écris le code d'une question qu'une seule fois – peu importe le nombre de questions.</p>
<p><b>Bonus :</b> transforme ton quiz de cette façon (au moins deux questions dans la liste).</p>`,
      solution: py`
        questions = [
            {"question": "Combien de pattes a une araignée ? ", "reponse": "8"},
            {"question": "Quelle est la capitale de l'Italie ? ", "reponse": "rome"},
            {"question": "Quelle est la plus grande planète ? ", "reponse": "jupiter"},
        ]
        points = 0
        for q in questions:
            reponse = input(q["question"])
            if reponse.lower() == q["reponse"]:
                points = points + 1
                print("Bonne réponse !")
            else:
                print("Raté ! La bonne réponse était :", q["reponse"])
        print("Points :", points, "sur", len(questions))
      `,
      feedback: {
        listOfDicts: `Crée une liste avec au moins deux dictionnaires : <code>[{"question": …, "reponse": …}, …]</code>.`,
        inputInLoop: `Pose les questions <b>dans</b> la boucle : <code>reponse = input(q["question"])</code>.`,
      },
    },
  },

  // ================================================================== CHAPITRE 4
  "s4-l1": {
    title: "Le moteur de jeu",
    story: "Dans la salle de contrôle se trouve une vieille borne d'arcade de l'équipage. Son cœur, la boucle de jeu, a disparu. Reconstruis-la.",
    intro: `
<p>Beaucoup de jeux ont une <b>boucle de jeu</b> : tant que le personnage a encore des vies ou de
l'énergie, la partie continue. C'est une boucle <code>while</code> autour d'une valeur qui change.</p>

<pre><code>vies = 3
while vies &gt; 0:
    print("Vies restantes :", vies)
    vies = vies - 1
print("Game Over")</code></pre>

<p>La valeur <code>vies</code> représente l'<b>état</b> du jeu. Ça devient palpitant avec le hasard :
si chaque tour fait perdre une quantité différente, personne ne sait à l'avance combien de temps
la partie va durer.</p>`,
    taskHtml:
      "Construis la <b>boucle de jeu</b> : tant que <code>energie</code> est plus grande que 0, le jeu tire au hasard des dégâts de 1 à 6, les retire et affiche le tour et l'énergie. Ensuite vient « Game Over ».",
    hints: [
      "<code>while energie &gt; 0:</code> – tout ce qui se passe à chaque tour est indenté.",
      "Dans la boucle : <code>degats = random.randint(1, 6)</code>, puis <code>energie = energie - degats</code>.",
    ],
    starterCode: py`
      import random
      energie = 20
      tour = 1
      # Boucle de jeu : tant que energie est plus grande que 0…
      #   1. tire au hasard des dégâts de 1 à 6
      #   2. retire-les de energie
      #   3. affiche le tour et l'énergie
      #   4. augmente tour de 1
      print("Game Over")
    `,
    solution: py`
      import random
      energie = 20
      tour = 1
      while energie > 0:
          degats = random.randint(1, 6)
          energie = energie - degats
          print(f"Tour {tour} : -{degats} → Énergie {energie}")
          tour = tour + 1
      print("Game Over")
    `,
    feedback: {
      randomInLoop:
        "Tire les dégâts au hasard <b>dans</b> la boucle avec <code>random.randint(1, 6)</code>, pour que chaque tour soit différent.",
      rounds: "Affiche quelque chose à chaque tour, par exemple le tour et l'énergie.",
      gameOver: "Après la boucle, « Game Over » doit toujours s'afficher – <b>sans</b> indentation.",
    },
    expert: {
      html: `
<p><b>Bonus :</b> après la partie, affiche combien de tours elle a duré, par exemple
« Tours survécus : 6 ». Attention : <code>tour</code> commence à 1 et augmente après chaque tour.
Que contient donc <code>tour</code> après 4 tours ?</p>`,
      solution: py`
        import random
        energie = 20
        tour = 1
        while energie > 0:
            degats = random.randint(1, 6)
            energie = energie - degats
            print(f"Tour {tour} : -{degats} → Énergie {energie}")
            tour = tour + 1
        print("Game Over")
        print(f"Tours survécus : {tour - 1}")
      `,
      feedback: {
        rounds: "Affiche à la fin combien de tours il y a eu.",
        count4:
          "Avec 20 points d'énergie et toujours 5 points de dégâts, ça fait exactement 4 tours. N'oublie pas : après le dernier tour, <code>tour</code> a déjà un cran d'avance.",
        count20: "Avec toujours 1 point de dégâts, ça fait 20 tours. Comptes-tu chaque tour exactement une fois ?",
      },
    },
  },

  "s4-l2": {
    title: "Codes secrets",
    story: "Un signal inconnu est arrivé, mais il est chiffré. Décale chaque lettre et découvre ce qu'il contient.",
    intro: `
<p>Chiffrer des messages, c'est amusant ! Avec le <b>code de César</b>, on décale chaque lettre d'un
nombre fixe. Pour ça, il te faut deux outils : <code>ord()</code> transforme une lettre en son numéro,
<code>chr()</code> retransforme un numéro en lettre.</p>

<pre><code>print(ord("A"))   # 65
print(chr(66))    # B</code></pre>

<p>Si tu passes sur chaque lettre et que tu augmentes son numéro, tu obtiens un message secret.
Pour déchiffrer, il suffit de décaler dans l'autre sens :</p>

<pre><code>secret = ""
for lettre in "SALUT":
    secret = secret + chr(ord(lettre) + 1)
print(secret)   # TBMVU</code></pre>`,
    taskHtml:
      "Déchiffre le message secret : décale chaque lettre de <b>1 vers l'arrière</b> avec <code>ord()</code> et <code>chr()</code>. Qu'est-ce qui apparaît ?",
    hints: [
      "<code>ord(lettre)</code> donne le numéro, <code>- 1</code> recule d'un cran, <code>chr(…)</code> en refait une lettre.",
      "<code>en_clair = en_clair + chr(ord(lettre) - 1)</code>",
    ],
    starterCode: py`
      secret = "QZUIPO"   # chaque lettre est décalée de 1
      en_clair = ""
      for lettre in secret:
          # Décale chaque lettre de 1 vers l'arrière
          en_clair = en_clair + lettre
      print(en_clair)
    `,
    solution: py`
      secret = "QZUIPO"
      en_clair = ""
      for lettre in secret:
          en_clair = en_clair + chr(ord(lettre) - 1)
      print(en_clair)
    `,
    feedback: {
      useOrdChr: "Utilise <code>ord()</code> et <code>chr()</code> pour décaler chaque lettre.",
      decrypt: "Ce n'est pas encore déchiffré. Décale de 1 <b>vers l'arrière</b> : <code>chr(ord(lettre) - 1)</code>.",
    },
    expert: {
      html: `
<p>Les vrais codes de César décalent le plus souvent de 3. Mais que se passe-t-il avec <code>"Z"</code> + 3 ? Pour
qu'après le Z on revienne au A, on calcule avec le reste de la division : <code>% 26</code>. Pour les
majuscules, la formule est <code>chr((ord(c) - 65 + d) % 26 + 65)</code>.</p>
<p><b>Bonus :</b> écris une fonction <code>cesar(texte, decalage)</code> qui décale les majuscules
(même au-delà du Z) et laisse tout le reste, comme les espaces, inchangé. Avec un décalage négatif,
elle déchiffre à nouveau.</p>`,
      solution: py`
        def cesar(texte, decalage):
            resultat = ""
            for c in texte:
                if "A" <= c <= "Z":
                    resultat = resultat + chr((ord(c) - 65 + decalage) % 26 + 65)
                else:
                    resultat = resultat + c
            return resultat

        secret = cesar("SALUT LE MONDE", 3)
        print(secret)
        print(cesar(secret, -3))
      `,
      feedback: {
        useMod: "Utilise <code>% 26</code> pour qu'après le Z on revienne au A.",
        shift: `<code>cesar("HALLO", 3)</code> devrait renvoyer <code>"KDOOR"</code>.`,
        wrap: `<code>cesar("XYZ", 3)</code> devrait donner <code>"ABC"</code> – après le Z, on recommence au A.`,
        spaces: "Les espaces et les autres caractères doivent rester inchangés.",
        decryptBack: "Avec un décalage négatif, la fonction doit déchiffrer à nouveau.",
      },
    },
  },

  "s4-l3": {
    title: "Dessiner avec du code",
    story: "Le grand écran de la salle de contrôle est rallumé – et encore tout vide. Dessine la première image !",
    intro: `
<p>La station a un <b>écran de 16 × 16 points lumineux</b> (des pixels). Avec
<code>pixel(x, y, couleur)</code>, tu en allumes un. <code>x</code> compte de la gauche
(0) vers la droite (15), <code>y</code> du haut (0) vers le bas (15).</p>

<pre><code>from station import pixel

for x in range(16):
    pixel(x, 12, "turquoise")   # une ligne d'un bord à l'autre de l'écran
pixel(7, 4, "doré")</code></pre>

<p>Tu peux donner les couleurs par leur nom, en français ou en anglais (<code>"rouge"</code>,
<code>"bleu"</code>, <code>"red"</code>, <code>"rose"</code>…), ou par un code couleur comme
<code>"#ff8800"</code>. <code>"noir"</code> éteint un pixel, et <code>fill(couleur)</code>
colore tout l'écran.</p>

<p>Avec une boucle, une seule ligne <code>pixel</code> suffit pour tracer des lignes et des surfaces –
et une boucle dans une boucle remplit même un rectangle entier.</p>`,
    taskHtml:
      "Dessine une <b>image sur l'écran de la station</b> : au moins <b>12 pixels</b> d'au moins <b>deux couleurs</b>, en utilisant au moins <b>une boucle</b>. Un arbre, une fusée, un visage, ton logo préféré…",
    hints: [
      `Une ligne, ça se fait avec une boucle : <code>for x in range(3, 13):</code> et en dessous <code>pixel(x, 14, "vert")</code>.`,
      "Pour la deuxième couleur, ajoute simplement quelques pixels d'une autre couleur par-dessus.",
    ],
    starterCode: py`
      from station import pixel

      # Dessine ton image : pixel(x, y, "couleur")  (x et y de 0 à 15)
      pixel(7, 7, "doré")
    `,
    solution: py`
      from station import pixel

      # Tronc
      for y in range(10, 15):
          pixel(7, y, "marron")
          pixel(8, y, "marron")
      # Feuillage
      for y in range(3, 10):
          for x in range(4, 12):
              pixel(x, y, "vert")
      # Pommes
      pixel(6, 5, "rouge")
      pixel(9, 7, "rouge")
    `,
    feedback: {
      usePixel: `Allume des pixels avec <code>pixel(x, y, "couleur")</code> – pour ça, il faut <code>from station import pixel</code> tout en haut.`,
      useLoop: "Utilise au moins une boucle – par exemple pour une ligne : <code>for x in range(16):</code>",
    },
    expert: {
      html: `
<p>Les pros du pixel art dessinent souvent leurs images sous forme de <b>liste de textes</b> : chaque
caractère est un pixel, et un dictionnaire indique quelle couleur va avec quel caractère.</p>
<pre><code>image = [
    ".RR.RR.",
    "RRRRRRR",
    ".RRRRR.",
    "..RRR..",
    "...R...",
]
couleurs = {"R": "rouge"}</code></pre>
<p><b>Bonus :</b> dessine une image d'au moins <b>20 pixels</b> avec deux boucles
<b>imbriquées</b> : la boucle extérieure parcourt les lignes (<code>y</code>), la boucle intérieure
les caractères d'une ligne (<code>x</code>).</p>`,
      solution: py`
        from station import pixel

        image = [
            ".RR.RR.",
            "RRRRRRR",
            "RRRBRRR",
            ".RRRRR.",
            "..RRR..",
            "...R...",
        ]
        couleurs = {"R": "rouge", "B": "blanc"}

        for y in range(len(image)):
            for x in range(len(image[y])):
                caractere = image[y][x]
                if caractere in couleurs:
                    pixel(x + 4, y + 5, couleurs[caractere])
      `,
      feedback: { nested: "Place une boucle <b>dans</b> une autre : à l'extérieur pour les lignes, à l'intérieur pour les caractères d'une ligne." },
    },
  },

  "s4-l4": {
    title: "Analyser de vraies données",
    story: "Dehors, la station météo a mesuré les températures pendant une semaine. Analyse ces données.",
    intro: `
<p>La programmation aide à comprendre de vraies données. Pour les listes de nombres, il existe des
outils tout prêts : <code>max()</code> (la plus grande valeur), <code>min()</code> (la plus petite),
<code>sum()</code> (la somme) et <code>len()</code> (le nombre d'éléments).</p>

<pre><code>temperatures = [21, 25, 19, 28, 23]
print("Jour le plus froid :", min(temperatures))</code></pre>

<p>La <b>moyenne</b>, tu l'obtiens avec « somme divisée par nombre d'éléments » – donc avec
<code>sum</code> et <code>len</code> ensemble.</p>`,
    taskHtml:
      "Trouve le <b>jour le plus chaud</b> avec <code>max()</code> et calcule la <b>moyenne</b> des températures avec <code>sum()</code> et <code>len()</code>. Affiche les deux.",
    hints: [
      "<code>max(temperatures)</code> donne la plus grande valeur.",
      "La moyenne : <code>sum(temperatures) / len(temperatures)</code>",
    ],
    starterCode: py`
      temperatures = [21, 25, 19, 28, 23]
      # Affiche le jour le plus chaud et la moyenne
    `,
    solution: py`
      temperatures = [21, 25, 19, 28, 23]
      print("Jour le plus chaud :", max(temperatures))
      print("Moyenne :", sum(temperatures) / len(temperatures))
    `,
    feedback: {
      useMax: "Utilise <code>max(temperatures)</code> pour le jour le plus chaud.",
      useSumLen: "Calcule la moyenne avec <code>sum(temperatures) / len(temperatures)</code>.",
      max28: "Le jour le plus chaud, il a fait 28 degrés – affiche cette valeur.",
      average:
        "La moyenne devrait être 23.2 (Python écrit les nombres à virgule avec un point). Divises-tu bien la somme par le nombre d'éléments ?",
    },
    expert: {
      html: `
<p><b>Bonus :</b> arrondis la moyenne à un chiffre après la virgule avec <code>round(valeur, 1)</code>
et trouve avec une boucle combien de jours il a fait <b>plus de 22 degrés</b>.</p>`,
      solution: py`
        temperatures = [21, 25, 19, 28, 23]
        print("Moyenne :", round(sum(temperatures) / len(temperatures), 1))
        jours_chauds = 0
        for t in temperatures:
            if t > 22:
                jours_chauds = jours_chauds + 1
        print("Jours chauds :", jours_chauds)
      `,
      feedback: {
        useRound: "Arrondis avec <code>round(…, 1)</code>.",
        countLoop: "Compte avec une boucle <code>for</code> et un <code>if</code> combien de valeurs dépassent 22.",
        count3: "Il a fait plus de 22 degrés pendant 3 jours (25, 28 et 23).",
      },
    },
  },

  "s4-l5": {
    title: "Trouve les bugs (débogage)",
    story: "Un dernier bug bloque la salle de contrôle : trois erreurs se cachent dans le code. Corrige-les, et la station sera libérée.",
    intro: `
<p>Les pros font des erreurs – et ils les trouvent. Ça s'appelle le <b>débogage</b>. Le code ci-dessous
contient exactement <b>trois bugs</b>. Exécute-le, lis l'explication dans la console (elle indique la
ligne !) et corrige les erreurs une par une. Après chaque correction, l'erreur suivante peut
apparaître – c'est tout à fait normal.</p>

<p>Pièges classiques : un deux-points <code>:</code> oublié, une indentation manquante, ou du texte et
un nombre mélangés avec <code>+</code> (<code>str(…)</code> règle ça).</p>`,
    taskHtml:
      "Corrige les trois erreurs jusqu'à ce que le programme tourne sans message d'erreur. À la fin, « Hourra ! » doit s'afficher trois fois.",
    hints: [
      "Deux erreurs se cachent dans la ligne <code>for</code> et dans la ligne en dessous : le deux-points et l'indentation.",
      "La troisième : transforme le nombre en texte avant de l'accrocher avec <code>+</code> : <code>str(age + 1)</code>.",
    ],
    starterCode: py`
      prenom = "Emma"
      age = 11
      print("Salut " + prenom)
      print("L'année prochaine, tu auras " + (age + 1) + " ans")
      for i in range(3)
      print("Hourra !")
    `,
    solution: py`
      prenom = "Emma"
      age = 11
      print("Salut " + prenom)
      print("L'année prochaine, tu auras " + str(age + 1) + " ans")
      for i in range(3):
          print("Hourra !")
    `,
    feedback: {
      keepLoop: "Garde la boucle et répare-la.",
      allLines: "Toutes les lignes doivent s'afficher – ne supprime pas de commandes, répare-les.",
      age: "L'affichage doit indiquer l'âge qu'aura Emma l'année prochaine (12). Utilise <code>str(age + 1)</code>.",
      threeHurra: "« Hourra ! » doit s'afficher trois fois : la ligne avec <code>print</code> doit être indentée dans la boucle.",
    },
    expert: {
      html: `
<p>Certaines erreurs sont prévisibles – par exemple quand quelqu'un tape des lettres alors qu'on
attend un nombre. Avec <code>try:</code> et <code>except ValueError:</code>, tu attrapes l'erreur au
lieu de laisser le programme planter.</p>
<p><b>Bonus :</b> demande l'âge avec <code>int(input(…))</code>. Si c'est un nombre, affiche l'âge
de l'année prochaine ; si ce sont des lettres, affiche un message sympa.</p>`,
      solution: py`
        try:
            age = int(input("Quel âge as-tu ? "))
            print("Ton âge l'année prochaine :", age + 1)
        except ValueError:
            print("Entre un nombre entier, s'il te plaît.")
      `,
      feedback: {
        useTry: "Place la conversion dans un bloc <code>try:</code> et attrape l'erreur avec <code>except ValueError:</code>.",
        useInput: "Demande l'âge avec <code>int(input(…))</code>.",
        friendly: "Si on tape des lettres, un message sympa doit s'afficher.",
        normalCase: "Si on tape 11, le programme doit afficher 12.",
      },
    },
  },

  "s4-boss4": {
    title: "Ton propre projet",
    story: "Station Polaris fonctionne de nouveau ! Il ne manque plus que ton propre module – quelque chose qui n'a encore jamais existé.",
    intro: `
<p>La grande finale : <b>crée quelque chose à toi !</b> Un jeu, une histoire, un quiz ou un outil
pratique. Utilise ce que tu as appris : <code>input()</code>, <code>if</code>, les boucles, les
listes, les dictionnaires, tes propres fonctions, <code>random</code>…</p>

<p>Pas besoin que ce soit parfait – l'important, c'est que ce soit ton projet. Commence petit, teste
souvent, puis développe-le morceau par morceau. Quand tu auras fini, ton diplôme t'attend. 🚀</p>`,
    taskHtml:
      "Écris ton propre programme qui utilise au moins <b>trois briques</b> du cours (<code>input()</code>, <code>if</code>, une boucle, une liste ou un dictionnaire, une fonction à toi, <code>random</code>) et qui tourne sans erreur. Laisse parler ta créativité – c'est ton chef-d'œuvre !",
    hints: [
      "Commence petit : affiche d'abord quelque chose, puis enrichis ton programme étape par étape.",
      "Des idées : un jeu de dés avec des points, un quiz de vocabulaire à partir d'une liste, un planificateur d'argent de poche avec une fonction.",
    ],
    starterCode: py`
      # 🌟 Ton projet. Quelques idées :
      #  - une aventure textuelle avec des choix (if/else)
      #  - un quiz sur ton thème préféré
      #  - un jeu de dés ou un entraîneur de calcul mental
      #  - un outil pratique (convertisseur, générateur d'idées)

      print("Mon projet démarre…")
    `,
    solution: py`
      import random

      reponses = ["Oui, c'est certain !", "Plutôt pas…", "Redemande-moi plus tard", "Carrément !"]

      def oracle():
          return random.choice(reponses)

      print("🎲 L'oracle de la chance 🎲")
      for tour in range(3):
          question = input("Pose-moi une question (oui/non) : ")
          if question == "":
              print("Tu n'as rien demandé du tout !")
          else:
              print(oracle())
    `,
    feedback: {
      blocks:
        "Ton programme n'utilise encore que {n} des briques. Ajoutes-en d'autres – par exemple une boucle, une liste ou une fonction à toi.",
      tooShort: "Ton projet peut tout à fait être un peu plus grand – au moins 6 lignes de code.",
    },
  },

  // ================================================================== MISSIONS EXTÉRIEURES
  "d-1": {
    title: "Première sortie",
    story: "Dehors, devant la station, la glace scintille. Lumo peut s'envoler – mais seulement avec tes commandes. Amène Lumo jusqu'à la station de recharge !",
    intro: `
<p>Ici, tu pilotes Lumo directement avec Python. Les commandes de vol, tu les récupères avec
<code>from drone import *</code> – l'étoile veut dire « toutes les commandes ».</p>

<pre><code>from drone import *

move()
move()</code></pre>

<p><code>move()</code> fait avancer Lumo d'une case, dans la direction où pointe la flèche.
Le but, c'est la <b>station de recharge</b> ⚡. Si Lumo fonce dans un mur, pas de drame : il y a
un bug, et tu réessaies.</p>`,
    taskHtml: "Amène Lumo jusqu'à la <b>station de recharge</b> ⚡. Compte les cases !",
    hints: ["Chaque case a besoin de son propre <code>move()</code>.", "Il y a cinq cases : cinq fois <code>move()</code>, l'un sous l'autre."],
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
    title: "Tourner au coin",
    story: "La station de recharge se trouve derrière un mur de glace. Lumo doit tourner – heureusement, un drone peut pivoter sur place.",
    intro: `
<p><code>turn_left()</code> fait pivoter Lumo sur place vers la gauche, d'un quart de tour. Il n'y a
pas de commande pour la droite. Est-ce qu'on peut quand même aller à droite ? Tu le découvriras plus tard.</p>

<pre><code>from drone import *

move()
turn_left()
move()</code></pre>`,
    taskHtml: "Fais passer Lumo au coin jusqu'à la station de recharge ⚡.",
    hints: [
      "D'abord tout droit jusque devant le mur, puis <code>turn_left()</code>, puis continue avec <code>move()</code>.",
      "Quatre fois <code>move()</code>, une fois <code>turn_left()</code>, deux fois <code>move()</code>.",
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
      html: "<p><b>Bonus :</b> à la station de recharge, Lumo doit finir en regardant vers la <b>gauche</b> (vers l'ouest), pour que sa caméra garde la station en vue.</p>",
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
      feedback: { faceWest: "Lumo est au bon endroit, mais il ne regarde pas encore vers la gauche. Il manque une rotation." },
    },
  },

  "d-3": {
    title: "Ramasser les cristaux",
    story: "Sur la glace, il y a des cristaux d'énergie. Chacun d'eux aide la station – Lumo doit les ramasser en chemin.",
    intro: `
<p>Les cristaux de glace stockent de l'énergie. <code>collect()</code> ramasse le cristal de la case
sur laquelle Lumo se trouve. S'il n'y en a pas, Lumo signale un bug.</p>

<pre><code>from drone import *

move()
move()
collect()</code></pre>`,
    taskHtml: "Ramasse <b>les deux cristaux</b>, puis vole jusqu'à la station de recharge ⚡.",
    hints: [
      "Vole jusqu'à la case du cristal et appelle <code>collect()</code> à cet endroit.",
      "Le premier cristal est deux cases devant Lumo, le deuxième deux cases plus loin, et la station de recharge encore deux cases après.",
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
    title: "Longs couloirs",
    story: "Un étroit canal de glace mène à la station de recharge extérieure. Il est long – et Lumo n'aime pas les longues listes de commandes.",
    intro: `
<p>13 cases, 13 lignes de <code>move()</code> ? Avec une boucle <code>for</code>, ça tient en
deux lignes :</p>

<pre><code>from drone import *

for i in range(4):
    move()</code></pre>

<p>Tout ce qui est indenté sous la ligne <code>for</code>, Lumo le répète.</p>`,
    taskHtml: "Le couloir fait <b>13 cases</b> de long. Amène Lumo jusqu'à la station de recharge ⚡ avec une <b>boucle <code>for</code></b>.",
    hints: ["<code>for i in range(…):</code> et en dessous, indenté, <code>move()</code>.", "<code>range(13)</code> répète 13 fois."],
    starterCode: py`
      from drone import *

      # Le couloir fait 13 cases de long
      move()
    `,
    solution: py`
      from drone import *

      for i in range(13):
          move()
    `,
    expert: {
      html: "<p><b>Bonus pour les pros :</b> réussis avec <b>3 lignes</b> de code au maximum – la ligne d'import compte, les commentaires et les lignes vides ne comptent pas.</p>",
      solution: py`
        from drone import *
        for i in range(13):
            move()
      `,
      feedback: { short: "C'est encore trop de lignes. Laisse la boucle faire tout le travail." },
    },
  },

  "d-5": {
    title: "Trajet inconnu",
    story: "La tempête de neige déplace sans arrêt les plaques de glace. Personne ne sait à quelle distance se trouve la station de recharge aujourd'hui – Lumo doit s'en rendre compte tout seul.",
    intro: `
<p>Lumo a des <b>capteurs</b>. Ils répondent aux questions par <code>True</code> ou <code>False</code>.
<code>at_goal()</code> vaut <code>True</code> quand Lumo est sur la station de recharge :</p>

<pre><code>from drone import *

print(at_goal())   # False – Lumo est encore au départ</code></pre>

<p>Avec <code>while</code>, Lumo répète quelque chose <b>tant qu'</b>une condition est vraie. Et
<code>not</code> inverse <code>True</code> et <code>False</code> : <code>not at_goal()</code>
veut dire « pas encore arrivé ».</p>`,
    taskHtml:
      "Le trajet a une longueur <b>différente</b> à chaque sortie. Amène Lumo jusqu'à la station de recharge ⚡ avec une <b>boucle <code>while</code></b> et <code>at_goal()</code> – peu importe la distance.",
    hints: [
      "<code>while not at_goal():</code> veut dire « tant que Lumo n'est pas encore arrivé ».",
      "En dessous, indenté, il n'y a que <code>move()</code>.",
    ],
    starterCode: py`
      from drone import *

      # À quelle distance est la station de recharge ? Lumo ne le sait pas…
      move()
    `,
    solution: py`
      from drone import *

      while not at_goal():
          move()
    `,
    expert: {
      html: "<p><b>Bonus :</b> fais <b>compter</b> les cases à Lumo pendant le vol, et affiche à la fin combien de cases il a parcourues.</p>",
      solution: py`
        from drone import *

        cases = 0
        while not at_goal():
            move()
            cases += 1
        print("Parcouru :", cases, "cases")
      `,
      feedback: { count: "Affiche à la fin combien de cases Lumo a parcourues. Compte-les dans la boucle avec <code>cases += 1</code>." },
    },
  },

  "d-6": {
    title: "La piste des cristaux",
    story: "Après la tempête, des cristaux sont éparpillés sur le trajet – à un endroit différent à chaque sortie. Lumo ne doit en oublier aucun.",
    intro: `
<p>Avec <code>if</code>, Lumo prend des décisions en chemin. <code>on_crystal()</code> vaut
<code>True</code> quand il y a un cristal sous Lumo :</p>

<pre><code>from drone import *

if on_crystal():
    collect()
print("Un cristal sous moi ?", on_crystal())</code></pre>

<p>Si tu places la décision <b>dans</b> une boucle, Lumo vérifie chaque case par laquelle il passe.</p>`,
    taskHtml: "Il y a des cristaux sur le trajet – à un endroit différent à chaque sortie. Ramasse-les <b>tous</b> et vole jusqu'à la station de recharge ⚡.",
    hints: [
      "Dans la boucle <code>while</code> : d'abord vérifier s'il y a un cristal, puis avancer d'une case.",
      "<code>while not at_goal():</code>, en dessous <code>if on_crystal():</code> avec <code>collect()</code>, puis <code>move()</code>.",
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
      html: "<p><b>Bonus :</b> compte les cristaux et affiche à la fin combien Lumo en a ramassé.</p>",
      solution: py`
        from drone import *

        cristaux = 0
        while not at_goal():
            if on_crystal():
                collect()
                cristaux += 1
            move()
        print("Cristaux :", cristaux)
      `,
      feedback: { count: "Affiche à la fin le nombre de cristaux ramassés. Compte juste après <code>collect()</code>." },
    },
  },

  "d-7": {
    title: "Virage à droite",
    story: "Un escalier de blocs de glace monte vers la droite. Mais Lumo ne sait tourner qu'à gauche… vraiment ?",
    intro: `
<p>Trois fois à gauche, c'est pareil qu'une fois à droite ! Au lieu d'écrire trois lignes à chaque fois,
tu te construis ta <b>propre commande</b> :</p>

<pre><code>from drone import *

def turn_right():
    turn_left()
    turn_left()
    turn_left()

turn_right()</code></pre>

<p>À partir de maintenant, Python connaît <code>turn_right()</code> aussi bien que les commandes intégrées.</p>`,
    taskHtml:
      "Construis la commande <code>turn_right()</code> avec <code>def</code> et fais monter Lumo l'escalier de glace jusqu'à la station de recharge ⚡ – le mieux, c'est marche par marche avec une boucle.",
    hints: [
      "Une marche, c'est : <code>move()</code>, <code>turn_left()</code>, <code>move()</code>, <code>turn_right()</code>.",
      "Il y a quatre marches, puis encore un <code>move()</code> : <code>for i in range(4):</code>",
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          # trois fois à gauche, c'est une fois à droite
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
      useDef: "Tu as construit la commande, mais tu ne l'utilises pas encore. Appelle <code>turn_right()</code> là où Lumo doit aller à droite.",
    },
    expert: {
      html: "<p><b>Bonus :</b> construis une deuxième commande <code>marche()</code> qui fait monter toute une marche, et appelle-la dans une boucle.</p>",
      solution: py`
        from drone import *

        def turn_right():
            turn_left()
            turn_left()
            turn_left()

        def marche():
            move()
            turn_left()
            move()
            turn_right()

        for i in range(4):
            marche()
        move()
      `,
      feedback: { twoDefs: "En plus de <code>turn_right()</code>, construis une deuxième commande, par exemple <code>def marche():</code>." },
    },
  },

  "d-8": {
    title: "Spirale",
    story: "Un couloir s'enroule comme une spirale jusqu'au cœur d'une vieille grotte de glace. Chaque grotte est différente – Lumo doit décider tout seul quand tourner.",
    intro: `
<p><code>front_clear()</code> vaut <code>True</code> quand la voie est libre devant Lumo. Avec <code>if</code> et
<code>else</code>, Lumo décide à nouveau à chaque pas :</p>

<pre><code>from drone import *

if front_clear():
    move()
else:
    turn_left()</code></pre>`,
    taskHtml:
      "Le couloir s'enroule en spirale vers l'intérieur – et chaque spirale est différente. Laisse Lumo trouver tout seul le chemin jusqu'à la station de recharge ⚡ avec <code>while</code>, <code>if</code> et <code>else</code>.",
    hints: [
      "Tant que Lumo n'est pas arrivé : si la voie est libre devant lui, il avance, sinon il tourne à gauche.",
      "<code>while not at_goal():</code>, dedans <code>if front_clear():</code> avec <code>move()</code> et <code>else:</code> avec <code>turn_left()</code>.",
    ],
    starterCode: py`
      from drone import *

      # Lumo doit décider tout seul : continuer tout droit ou tourner ?
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
    title: "Sauvetage dans le labyrinthe",
    story: "Une tempête de neige a poussé Lumo dans un labyrinthe de glace – et aucun ne ressemble à un autre. Seul un programme malin peut ramener Lumo à la maison.",
    intro: `
<p>Une vieille astuce pour les labyrinthes : <b>garde toujours la main droite contre le mur.</b> En faisant
ça, on trouve à coup sûr la sortie de labyrinthes comme ceux-ci. Pour Lumo, ça veut dire, à chaque pas :</p>
<ul>
<li>d'abord tourner à droite,</li>
<li>puis tourner à gauche tant qu'il y a un mur devant,</li>
<li>puis avancer d'une case.</li>
</ul>
<p>Une boucle <b>dans</b> une boucle – et voilà, Lumo a un plan.</p>`,
    taskHtml:
      "Écris un programme qui permet à Lumo de trouver la station de recharge ⚡ depuis <b>n'importe quel</b> labyrinthe. Il sera testé avec des labyrinthes que tu ne vois pas.",
    hints: [
      "Il te faut <code>turn_right()</code> de « Virage à droite » – le code de départ l'a déjà.",
      "À l'extérieur <code>while not at_goal():</code>, dedans <code>turn_right()</code>, puis <code>while not front_clear():</code> avec <code>turn_left()</code>, puis <code>move()</code>.",
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          turn_left()
          turn_left()
          turn_left()

      # La main droite contre le mur…
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

  // ================================================================== CHASSE AUX BUGS
  "g-1": {
    title: "Silence radio",
    story: "Un vieux programme d'accueil de l'équipage doit saluer les visiteurs par leur prénom. Au lieu de ça, il ne signale que des bugs.",
    intro: `
<p>Bienvenue dans la <b>chasse aux bugs</b> ! Ici, tu n'écris pas de nouveau programme : tu en
répares un qui est cassé. Voilà comment font les pros :</p>
<ul>
<li>Exécuter le programme et lire tranquillement le message d'erreur.</li>
<li>Cliquer sur « Ligne … » – c'est là que ça coince.</li>
<li>Corriger une erreur et relancer. Souvent, la suivante apparaît juste après.</li>
</ul>`,
    taskHtml:
      "Répare le programme : il doit demander le prénom, puis afficher <b>deux lignes</b> – un salut avec le prénom et « Bienvenue à bord ! ».",
    hints: [
      "Python fait la différence entre majuscules et minuscules : <code>prenom</code> et <code>Prenom</code> sont deux noms différents.",
      "Dans la dernière ligne, il manque un guillemet avant la parenthèse.",
    ],
    starterCode: py`
      prenom = input("Comment tu t'appelles ? ")
      print("Salut, " + Prenom + " !")
      print("Bienvenue à bord !)
    `,
    solution: py`
      prenom = input("Comment tu t'appelles ? ")
      print("Salut, " + prenom + " !")
      print("Bienvenue à bord !")
    `,
    feedback: { greet: "Le salut doit contenir le prénom saisi, et ensuite « Bienvenue à bord ! » doit s'afficher." },
  },

  "g-2": {
    title: "Erreur de calcul",
    story: "Le calculateur d'âge de la station doit juste calculer l'âge qu'on aura dans dix ans. Au lieu de ça, il plante à chaque saisie.",
    intro: `
<p>Ce bug est un classique : <code>input()</code> fournit toujours du <b>texte</b>, même quand quelqu'un
tape un nombre. Or, on ne peut pas simplement additionner du texte et un nombre.</p>
<pre><code>print(int("12") + 10)
print("Âge : " + str(22))</code></pre>
<p><code>int(…)</code> transforme du texte en nombre, <code>str(…)</code> transforme un nombre en texte.</p>`,
    taskHtml: "Répare le calculateur : pour <b>n'importe quel</b> âge, il doit calculer correctement l'âge qu'on aura dans dix ans.",
    hints: [
      "Le premier message d'erreur pointe sur le calcul : texte + nombre, ça ne marche pas. Convertis la saisie avec <code>int(…)</code>.",
      "Ensuite, ça coince à l'affichage : texte + nombre, ça ne va toujours pas. <code>str(…)</code> ou une f-string t'aide.",
    ],
    starterCode: py`
      age = input("Quel âge as-tu ? ")
      dans_dix_ans = age + 10
      print("Dans dix ans, tu auras " + dans_dix_ans + " ans.")
    `,
    solution: py`
      age = int(input("Quel âge as-tu ? "))
      dans_dix_ans = age + 10
      print(f"Dans dix ans, tu auras {dans_dix_ans} ans.")
    `,
    feedback: {
      math: "Le programme tourne, mais il ne calcule pas encore juste pour tous les âges. Pour 12, il faut obtenir 22, et pour 30, il faut obtenir 40.",
    },
  },

  "g-3": {
    title: "Compte à rebours sans fin",
    story: "La rampe de lancement compte à rebours… et ne s'arrête jamais. Le rover attend son « Décollage ! » depuis des années.",
    intro: `
<p>Certains bugs ne produisent aucun message d'erreur – le programme tourne simplement <b>à l'infini</b>.
Pas de panique : Codaluna l'arrête au bout d'un moment. Ensuite, pose-toi la question : qu'est-ce qui
devrait changer dans la boucle pour que la condition finisse par devenir <code>False</code> ?</p>`,
    taskHtml: "Répare le compte à rebours : il doit afficher <b>5, 4, 3, 2, 1</b>, puis « Décollage ! » – et ensuite vraiment s'arrêter.",
    hints: [
      "Exécute le programme une fois, sans crainte. Pourquoi la boucle ne s'arrête-t-elle jamais ?",
      "Dans la boucle, <code>nombre</code> doit diminuer : <code>nombre = nombre - 1</code> – indenté, après le <code>print</code>.",
    ],
    starterCode: py`
      nombre = 5
      while nombre > 0:
          print(nombre)
      print("Décollage !")
    `,
    solution: py`
      nombre = 5
      while nombre > 0:
          print(nombre)
          nombre = nombre - 1
      print("Décollage !")
    `,
    feedback: { countdown: "Le compte à rebours doit compter exactement 5, 4, 3, 2, 1, puis afficher une seule fois « Décollage ! »." },
  },

  "g-4": {
    title: "La liste décalée",
    story: "La liste du stock du labo s'interrompt à chaque fois avant d'être finie. Quelque part, le programme se trompe en comptant.",
    intro: `
<p>Deux bugs se cachent dans ce programme. Le premier l'empêche même de démarrer. Le second n'apparaît
que pendant l'exécution – il a à voir avec les <b>positions</b> dans une liste : la première position
est 0, la dernière est <code>len(liste) - 1</code>.</p>`,
    taskHtml: "Répare la liste du stock : chaque provision doit apparaître sur sa propre ligne, puis le nombre total à la fin.",
    hints: [
      "Compte les parenthèses dans la dernière ligne.",
      "<code>range(len(provisions))</code> compte exactement les positions de la liste – sans <code>+ 1</code>.",
    ],
    starterCode: py`
      provisions = ["Glace", "Cristaux", "Piles", "Biscuits"]
      for i in range(len(provisions) + 1):
          print("En stock :", provisions[i])
      print("Total :", len(provisions)
    `,
    solution: py`
      provisions = ["Glace", "Cristaux", "Piles", "Biscuits"]
      for i in range(len(provisions)):
          print("En stock :", provisions[i])
      print("Total :", len(provisions))
    `,
    feedback: { list: "Il doit y avoir exactement quatre provisions, chacune sur sa propre ligne, puis le nombre 4." },
  },

  "g-5": {
    title: "Le renvoi oublié",
    story: "Le calculateur d'énergie de la salle de contrôle affiche bien un nombre, mais ensuite il calcule avec… rien du tout. Un bug digne d'un manuel !",
    intro: `
<p>Une fonction peut <b>afficher</b> quelque chose (<code>print</code>) ou <b>renvoyer</b> quelque chose
(<code>return</code>). Ce n'est pas pareil : seul ce qui est renvoyé peut être réutilisé par le
programme. Sans <code>return</code>, une fonction renvoie <code>None</code> – « rien ».</p>`,
    taskHtml:
      "Répare la fonction <code>double</code> : elle doit <b>renvoyer</b> son résultat pour que le programme puisse continuer à calculer avec. À la fin, « Énergie totale : 50 » doit s'afficher.",
    hints: [
      "Le message d'erreur dit : <code>None</code> plus un nombre, ça ne marche pas. La fonction ne renvoie donc rien.",
      "Dans la fonction, remplace <code>print(resultat)</code> par <code>return resultat</code>.",
    ],
    starterCode: py`
      def double(nombre):
          resultat = nombre * 2
          print(resultat)

      energie = double(21)
      print("Énergie totale :", energie + 8)
    `,
    solution: py`
      def double(nombre):
          resultat = nombre * 2
          return resultat

      energie = double(21)
      print("Énergie totale :", energie + 8)
    `,
    feedback: {
      double: "La fonction doit renvoyer le double – pour 7, donc 14.",
      fifty: "À la fin, « Énergie totale : 50 » doit s'afficher.",
    },
  },
};
