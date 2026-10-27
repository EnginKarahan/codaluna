// PyQuest – Übersetzung des Kurses "season-1": Español.
// Überschreibt nur Texte und Code der deutschen Basis (content/courses/season-1.js).

import { py } from "../lib/check-kit.js";

export default {
  chapters: {
    c1: "Primeros comandos",
    c2: "Decisiones y bucles",
    c3: "Colecciones y comandos propios",
    c4: "Todo junto",
    d1: "Pilotar a Lumo sobre el hielo",
    g1: "Reparar programas rotos",
  },

  regions: {
    c1: {
      name: "Sala de radio",
      intro: "La sala de radio está a oscuras. Si la estación ha de volver a hablar, necesita comandos, y esos los escribes tú.",
      outro: "La estación vuelve a hablar, a calcular y a hacer preguntas. Lumo da una vuelta de alegría.",
    },
    c2: {
      name: "Hangar",
      intro: "En el hangar esperan puertas, rovers y luces de señal. Para que decidan por su cuenta y repitan cosas, necesitan condiciones y bucles.",
      outro: "El portón del hangar se abre y fuera brilla el hielo. A partir de ahora, Lumo también puede volar en misiones al exterior.",
    },
    c3: {
      name: "Laboratorio",
      intro: "En el laboratorio, las provisiones, las muestras y las notas están revueltas. Las listas, los diccionarios y los comandos propios pondrán orden.",
      outro: "Todo está en su sitio, y la IA de a bordo te reconoce como miembro de la tripulación.",
    },
    c4: {
      name: "Sala de control",
      intro: "En la sala de control se unen todos los sistemas. Aquí demuestras lo que sabes: juegos, códigos, imágenes y datos de medición reales.",
      outro: "¡La estación Polaris vuelve a brillar! A partir de ahora construyes tus propios módulos.",
    },
    d1: {
      name: "Campo de hielo",
      intro: "Delante de la estación se extiende el campo de hielo. Aquí pilotas a Lumo directamente con Python: cada comando es una maniobra de vuelo.",
      outro: "Lumo ya conoce cada rincón del campo de hielo, y tú has programado un dron que encuentra el camino por sí solo.",
    },
    g1: {
      name: "Pozo de mantenimiento",
      intro: "En el pozo de mantenimiento hay programas viejos de la tripulación, llenos de glitches. Cada uno que reparas hace avanzar un poco más a la estación.",
      outro: "El pozo de mantenimiento está limpio. Ya encuentras los glitches más rápido que la IA de a bordo.",
    },
  },

  // ================================================================== CAPÍTULO 1
  "s1-l1": {
    title: "¡Hola, mundo!",
    story: "La radio de la estación lleva años en silencio. Envía el primer mensaje de todos: ¡lo importante es que suene a ti!",
    intro: `
<p>Un programa es una lista de <b>comandos</b> que Python ejecuta uno tras otro.
Tu primer comando es <code>print()</code>: escribe algo en la <b>consola</b>
(el recuadro oscuro que hay debajo del editor).</p>

<p><b>Importante: el texto va entre comillas.</b> Todo lo que Python deba mostrar <i>tal cual</i>
lo escribes entre comillas: <code>"…"</code>. A un texto así se le llama <b>string</b>
(en español, «cadena de texto»). Las comillas le dicen a Python:
«Esto es texto, no un comando».</p>

<pre><code>print("¡Hola, mundo!")</code></pre>

<p>Si quitaras las comillas (<code>print(Hola)</code>), Python pensaría que
<code>Hola</code> es un nombre que debería conocer y mostraría un error. Por cierto,
las comillas en sí <b>no</b> aparecen en la salida.</p>

<p>No te preocupes: aquí no se puede romper nada. Cambia el texto y pulsa
<b>Ejecutar</b> (o Ctrl + Enter).</p>`,
    taskHtml:
      "Cambia el texto: muestra un <b>mensaje propio</b>, por ejemplo tu lema, un saludo o tu frase favorita. ¡No olvides las comillas!",
    hints: [
      'Escribe tu texto entre las comillas: <code>print("…")</code>.',
      'Por ejemplo: <code>print("¡Hoy aprendo Python!")</code>',
    ],
    starterCode: py`
      print("¡Hola, mundo!")
    `,
    solution: py`
      print("¡Hoy aprendo Python!")
    `,
    expert: {
      html: `
<p>Puedes mostrar <b>varias cosas</b> separadas por comas, y Python pone automáticamente un espacio
entre ellas: <code>print("Hola", "mundo")</code>. Y <code>\\n</code> empieza una línea nueva
<i>dentro</i> de un texto.</p>
<p><b>Reto extra:</b> Escribe un <code>print()</code> que muestre varias partes separadas por comas y que,
gracias a <code>\\n</code>, ocupe al menos dos líneas.</p>`,
      solution: py`
        print("¡Hola,", "mundo!", "\n¡Hoy empieza mi aventura con Python!")
      `,
      feedback: {
        printComma: 'Muestra varias partes en <b>un solo</b> <code>print()</code>, separadas por comas: <code>print("A", "B")</code>.',
        newline: "Usa <code>\\n</code> dentro de un texto para empezar una línea nueva.",
      },
    },
  },

  "s1-l2": {
    title: "Recordar con variables",
    story: "La estación ha perdido la memoria. Enséñale a recordar algo: empieza por tu número favorito.",
    intro: `
<p>Una <b>variable</b> es como una caja con nombre. Con el signo igual
<code>=</code> guardas algo dentro (a eso se le llama «asignar»). Después puedes usar el nombre
para recuperar el valor.</p>

<pre><code>numero_favorito = 7
print(numero_favorito)</code></pre>

<p>El <b>nombre</b> va a la izquierda del <code>=</code> y el <b>valor</b>, a la derecha. Aquí el
<code>=</code> significa «recibe el valor», no «es igual a» como en matemáticas. Por cierto, en los
nombres de variables es mejor no usar tildes ni la ñ: por eso escribimos <code>numero</code> y no
<code>número</code>.</p>

<p><b>¿Número o texto?</b> Los números se escriben <i>sin</i> comillas (<code>7</code>).
Y para mostrar la <i>variable</i>, su nombre va entre los paréntesis <b>sin</b> comillas:
<code>print(numero_favorito)</code> muestra <code>7</code>. En cambio, <code>print("numero_favorito")</code>
mostraría simplemente esa palabra.</p>`,
    taskHtml:
      "Guarda tu <b>número favorito</b> en la variable y muéstralo con <code>print()</code>. ¡El nombre de la variable va sin comillas!",
    hints: ["Primero asigna: <code>numero_favorito = 42</code>", "Después muéstralo: <code>print(numero_favorito)</code>"],
    starterCode: py`
      numero_favorito = 0
      # Pon tu número favorito y muéstralo
    `,
    solution: py`
      numero_favorito = 42
      print(numero_favorito)
    `,
    feedback: {
      printName:
        "Muestra la <b>variable</b>: su nombre va entre los paréntesis <b>sin</b> comillas, así: <code>print(numero_favorito)</code>.",
      needNumber: "Guarda un <b>número</b>, sin comillas, por ejemplo <code>numero_favorito = 7</code>.",
    },
    expert: {
      html: `
<p>Una variable puede <b>cambiar</b>. <code>puntos = puntos + 50</code> toma el valor anterior,
le suma 50 y vuelve a guardar el resultado en la misma caja. Los nombres pueden tener letras,
cifras y <code>_</code>, pero no pueden empezar por una cifra.</p>
<p><b>Reto extra:</b> Crea <code>puntos = 100</code>, aumenta después el valor en 50 y muéstralo.</p>`,
      solution: py`
        puntos = 100
        puntos = puntos + 50
        print(puntos)
      `,
      feedback: {
        selfUpdate: "Aumenta el valor con <code>puntos = puntos + 50</code> (o, más corto, <code>puntos += 50</code>).",
        result150: "Al final debería mostrarse 150.",
      },
    },
  },

  "s1-l3": {
    title: "La calculadora de ahorro",
    story: "En el sistema de a bordo sigue atascado un viejo cálculo de la tripulación. Demuéstrale que la estación vuelve a saber calcular.",
    intro: `
<p>Python es una calculadora genial. Puedes calcular con <code>+</code> (más),
<code>-</code> (menos), <code>*</code> (por) y <code>/</code> (entre). Es decir, se usa
<code>*</code> en lugar de «×» y <code>/</code> en lugar de «÷».</p>

<p><b>Importante:</b> los números se escriben sin comillas. Si no, Python los trata como
texto y no calcula (¡<code>"5" + "3"</code> daría <code>"53"</code> en vez de <code>8</code>!).</p>

<pre><code>por_semana = 5
semanas = 8
print(por_semana * semanas)</code></pre>

<p>Lo bueno de las variables: si cambia un valor, el programa vuelve a calcularlo todo automáticamente.
Mia aparta un poco de dinero cada semana. Calcula con sus variables.</p>`,
    taskHtml:
      "¿Cuánto ha ahorrado Mia después de <b>8 semanas</b> si aparta <b>5&nbsp;€</b> cada semana? Calcula con las dos variables y muestra el resultado. (Para comprobarlo: son 40.)",
    hints: ["Para multiplicar se usa <code>*</code>.", "<code>print(por_semana * semanas)</code>"],
    starterCode: py`
      por_semana = 5
      semanas = 8
      # Calcula lo que ha ahorrado y muéstralo
    `,
    solution: py`
      por_semana = 5
      semanas = 8
      print(por_semana * semanas)
    `,
    feedback: {
      needMult: "Deja que Python calcule: para multiplicar se usa <code>*</code>.",
      useVars:
        "Calcula con las <b>variables</b> en lugar de con números fijos: <code>por_semana * semanas</code>. Así el resultado sigue siendo correcto aunque cambie un valor.",
      result40: "El resultado debería ser 40. Revisa tu cálculo.",
    },
    expert: {
      html: `
<p>¿Después de cuántas semanas <b>completas</b> tendrá Mia 100&nbsp;€? El operador <code>//</code>
divide y quita los decimales (<code>100 // 5</code> da 20).</p>
<p><b>Reto extra:</b> Crea <code>meta = 100</code> y calcula con <code>//</code> cuántas semanas
necesita Mia.</p>`,
      solution: py`
        por_semana = 5
        meta = 100
        print(meta // por_semana, "semanas")
      `,
      feedback: {
        floorDiv: "Usa <code>//</code> para dividir sin decimales: <code>meta // por_semana</code>.",
        result20: "Deberían salir 20 semanas.",
      },
    },
  },

  "s1-l4": {
    title: "Historias locas",
    story: "La radio solo capta trozos de palabras: un animal, un lugar. Conviértelos en el mensaje de radio más loco de la luna helada.",
    intro: `
<p>¿Cómo metes el contenido de una variable <i>dentro</i> de un texto? Un string normal
lo muestra todo tal cual: <code>print("Me gusta animal")</code> escribe de verdad «Me gusta animal».
La solución es un <b>f-string</b>: pon una <code>f</code> justo delante de las comillas y
escribe la variable entre llaves <code>{ }</code>.</p>

<pre><code>animal = "gato"
print(f"¡Un {animal} aprende Python!")</code></pre>

<p>La <code>f</code> viene de «format» (formato). Solo los nombres entre <code>{ }</code> se sustituyen
por su valor; el resto sigue siendo texto normal. Así construyes en un momento frases,
historias o perfiles.</p>`,
    taskHtml:
      "Escribe con un <b>f-string</b> una frase loca en la que aparezcan <code>animal</code> y <code>lugar</code>.",
    hints: [
      'Empieza con <code>print(f"...")</code>. ¡No olvides la <code>f</code>!',
      "Pon las variables entre llaves: <code>{animal}</code> y <code>{lugar}</code>.",
    ],
    starterCode: py`
      animal = "gato"
      lugar = "Luna"
      # Construye una frase divertida con un f-string
    `,
    solution: py`
      animal = "gato"
      lugar = "Luna"
      print(f"¡Un {animal} baila en la {lugar}!")
    `,
    feedback: {
      twoFields: "Pon <b>las dos</b> variables entre llaves en tu f-string: <code>{animal}</code> y <code>{lugar}</code>.",
      valuesInOutput: "En la salida deben aparecer los valores de <code>animal</code> y <code>lugar</code>: usa un f-string con llaves.",
    },
    expert: {
      html: `
<p>Dentro de las <code>{ }</code> incluso puedes <b>calcular</b>: <code>print(f"{3 * 4} goles")</code>
muestra «12 goles».</p>
<p><b>Reto extra:</b> Crea <code>victorias = 5</code> y muestra con un f-string cuántos puntos
son (3 puntos por victoria), calculándolo <i>dentro</i> de las llaves.</p>`,
      solution: py`
        victorias = 5
        print(f"¡{victorias} victorias son {victorias * 3} puntos!")
      `,
      feedback: {
        calcInBraces: "Calcula directamente dentro de las llaves: <code>{victorias * 3}</code>.",
        result15: "Con 5 victorias deberían salir 15 puntos.",
      },
    },
  },

  "s1-l5": {
    title: "El programa pregunta",
    story: "La estación quiere saber con quién está hablando. Haz que te pregunte tu nombre… y que te salude.",
    intro: `
<p><code>input()</code> detiene tu programa, muestra una pregunta y espera a que escribas algo
y pulses Enter. Lo mejor es guardar tu respuesta en una variable.</p>

<pre><code>nombre = input("¿Cómo te llamas? ")
print("Hola, " + nombre)</code></pre>

<p>El texto entre paréntesis es la pregunta (el «prompt»). Con <code>+</code> puedes
<b>pegar</b> dos textos. Fíjate en el espacio que hay después de la coma en <code>"Hola, "</code>.</p>

<p><b>Recuerda:</b> <code>input()</code> devuelve <i>siempre</i> texto, aunque escribas
un número. Cómo convertirlo en un número de verdad lo aprenderás en el capítulo 2.</p>`,
    taskHtml:
      "Pregunta el nombre y después muestra un <b>saludo personal</b> en el que aparezca ese nombre. Al ejecutar el programa, abajo en la consola aparece un campo para escribir.",
    hints: [
      "La respuesta está guardada en la variable <code>nombre</code>.",
      'Para pegar textos: <code>print("Hola, " + nombre)</code>',
    ],
    starterCode: py`
      nombre = input("¿Cómo te llamas? ")
      # Saluda a la persona de forma personal
    `,
    solution: py`
      nombre = input("¿Cómo te llamas? ")
      print("¡Qué bien que estés aquí, " + nombre + "!")
    `,
    feedback: {
      nameInGreeting:
        'En el saludo debe aparecer el nombre que se escribió: <code>print("Hola, " + nombre)</code>, con <code>nombre</code> sin comillas.',
    },
    expert: {
      html: `
<p><b>Reto extra:</b> Pregunta <b>dos</b> cosas (por ejemplo, el nombre y dónde vive la persona)
y une las respuestas en una frase con un <b>f-string</b>: queda más claro que con
<code>+</code>.</p>`,
      solution: py`
        nombre = input("Nombre: ")
        ciudad = input("¿Dónde vives? ")
        print(f"{nombre} vive en {ciudad}. ¡Genial!")
      `,
      feedback: { bothInSentence: "Las dos respuestas deben aparecer en tu frase." },
    },
  },

  "s1-boss1": {
    title: "Tu generador de perfiles",
    story: "La esclusa de seguridad solo deja pasar a los miembros de la tripulación con identificación. Crea un generador de perfiles para que la estación te conozca.",
    intro: `
<p>¡Hora de juntarlo todo! Vas a preguntar unas cuantas cosas y con las respuestas construirás una
tarjeta de perfil con estilo. Para eso necesitas <code>input()</code> (preguntar), variables (recordar) y
f-strings (mostrar).</p>

<pre><code>nombre = input("Nombre: ")
print(f"Nombre: {nombre}")</code></pre>

<p>Consejo: empieza con una pregunta, pruébala y después añade más, paso a paso.</p>`,
    taskHtml:
      "Pregunta al menos <b>tres</b> cosas con <code>input()</code> y muestra un <b>perfil</b> en el que aparezcan todas las respuestas, usando f-strings.",
    hints: [
      'Añade otro <code>input(…)</code> debajo, por ejemplo <code>animal = input("Animal favorito: ")</code>.',
      'Una línea por respuesta: <code>print(f"Nombre: {nombre}")</code>',
    ],
    starterCode: py`
      nombre = input("Nombre: ")
      hobby = input("Hobby favorito: ")
      # Pregunta una cosa más y muestra un perfil con f-strings
    `,
    solution: py`
      nombre = input("Nombre: ")
      hobby = input("Hobby favorito: ")
      animal = input("Animal favorito: ")
      print("--- MI PERFIL ---")
      print(f"Nombre: {nombre}")
      print(f"Hobby:  {hobby}")
      print(f"Animal: {animal}")
    `,
    feedback: {
      allAnswers: "En el perfil deben aparecer <b>todas</b> las respuestas. Muestra cada variable con un f-string.",
    },
    expert: {
      html: `
<p>Dale más estilo a la tarjeta: un marco hecho con caracteres queda genial. <code>"=" * 20</code>
crea una línea de 20 signos de igual.</p>
<p><b>Reto extra:</b> Pon una línea así encima y otra debajo de tu perfil (de al menos 10 caracteres).</p>`,
      solution: py`
        nombre = input("Nombre: ")
        hobby = input("Hobby favorito: ")
        animal = input("Animal favorito: ")
        print("=" * 24)
        print(f"  PERFIL: {nombre}")
        print(f"  Hobby: {hobby} · Animal: {animal}")
        print("=" * 24)
      `,
      feedback: { frame: 'Muestra una línea encima y otra debajo del perfil, por ejemplo <code>print("=" * 20)</code>.' },
    },
  },

  // ================================================================== CAPÍTULO 2
  "s2-l1": {
    title: "Si… entonces…",
    story: "La puerta del hangar solo se abre si hay suficientes puntos de energía. Enséñale también a decir que no, con amabilidad.",
    intro: `
<p>Los programas tienen que <b>decidir</b>. Con <code>if</code> («si») compruebas una condición:
si se cumple, se ejecuta el bloque con sangría que hay debajo. <code>else</code> («si no») es el otro caso.</p>

<pre><code>puntos = 120
if puntos &gt;= 100:
    print("¡Nivel superado!")
else:
    print("¡Casi! Sigue intentándolo.")</code></pre>

<p><b>Python es estricto con dos reglas:</b> después de la condición van los <b>dos puntos</b>
<code>:</code>, y las líneas que dependen de ella llevan <b>sangría</b> (también se dice «indentación»):
van 4 espacios más a la derecha. La tecla Tab lo hace por ti.</p>

<p>Puedes comparar con <code>==</code> (igual), <code>!=</code> (distinto),
<code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> y <code>&gt;=</code>.
Ojo: <code>==</code> pregunta «¿es igual?», mientras que <code>=</code> asigna un valor.</p>

<p><b>Nuevo: escribir números.</b> <code>input()</code> siempre devuelve texto. Con <code>int(…)</code>
lo conviertes en un número entero con el que Python puede comparar y calcular:</p>
<pre><code>puntos = int(input("¿Cuántos puntos? "))</code></pre>`,
    taskHtml:
      "Añade un bloque <code>else</code> que muestre un mensaje de ánimo cuando haya <b>menos de 100</b> puntos. Prueba tu programa con 120 y con 50.",
    hints: [
      "<code>else:</code> va alineado con el <code>if</code>, sin sangría, y también lleva dos puntos.",
      'La línea de debajo lleva sangría: <code>    print("¡Casi! ¡Sigue practicando!")</code>',
    ],
    starterCode: py`
      puntos = int(input("¿Cuántos puntos tienes? "))
      if puntos >= 100:
          print("¡Nivel superado! 🎉")
      # Añade aquí el caso else
    `,
    solution: py`
      puntos = int(input("¿Cuántos puntos tienes? "))
      if puntos >= 100:
          print("¡Nivel superado! 🎉")
      else:
          print("¡Casi! ¡Sigue practicando!")
    `,
    feedback: {
      noElseOutput: "Con 50 puntos todavía no aparece nada. Muestra un mensaje en el bloque <code>else</code>.",
      sameOutput: "Con 120 y con 50 puntos sale lo mismo. En el bloque <code>else</code> debe ir un mensaje diferente.",
      boundary: "Con 100 puntos justos el nivel está superado: deja la condición <code>puntos &gt;= 100</code> como está.",
    },
    expert: {
      html: `
<p>Para más de dos casos existe <code>elif</code> («si no, si»). Python comprueba las
condiciones de arriba abajo y se queda con la primera que se cumple.</p>
<p><b>Reto extra:</b> Crea tres niveles: a partir de 100 puntos, «Nivel superado»; a partir de 50 puntos,
«Casi lo tienes»; y si no, «Sigue practicando».</p>`,
      solution: py`
        puntos = int(input("¿Cuántos puntos tienes? "))
        if puntos >= 100:
            print("¡Nivel superado! 🎉")
        elif puntos >= 50:
            print("¡Casi lo tienes!")
        else:
            print("¡Sigue practicando!")
      `,
      feedback: { threeCases: "Con 120, 70 y 10 puntos debe aparecer cada vez algo diferente." },
    },
  },

  "s2-l2": {
    title: "¿Verdadero o falso?",
    story: "Los sensores del hangar ya solo responden True o False. Comprueba si entiendes su idioma.",
    intro: `
<p>Toda comparación tiene un resultado: <code>True</code> (verdadero) o <code>False</code> (falso).
A esto se le llama <b>valor booleano</b> (en inglés, <i>boolean</i>). Justo con eso toma
<code>if</code> sus decisiones.</p>

<pre><code>print(10 &gt; 3)    # True
print(5 == 6)   # False</code></pre>

<p>Todo lo que va detrás de <code>#</code> es un <b>comentario</b>: una nota para las personas que
Python se salta.</p>`,
    taskHtml:
      "Muestra los resultados de <b>al menos tres comparaciones distintas</b>. Al menos una tiene que dar <code>False</code>.",
    hints: [
      "Muestra las comparaciones directamente: <code>print(7 &gt; 2)</code>",
      "Para <code>False</code>, por ejemplo: <code>print(5 == 6)</code>",
    ],
    starterCode: py`
      # Haz que Python compruebe al menos tres comparaciones
      print(10 > 3)
    `,
    solution: py`
      print(10 > 3)
      print(5 == 5)
      print("manzana" == "pera")
    `,
    feedback: {
      threeCompares: "Necesitas al menos tres comparaciones, por ejemplo con <code>&gt;</code>, <code>&lt;</code> y <code>==</code>.",
      printResults: "Muestra el resultado de cada comparación con <code>print(…)</code>.",
      needFalse: "Al menos una comparación debe dar <code>False</code>, por ejemplo <code>print(5 == 6)</code>.",
    },
    expert: {
      html: `
<p>Las condiciones se pueden <b>combinar</b>: <code>and</code> (las dos tienen que cumplirse),
<code>or</code> (basta con una) y <code>not</code> (le da la vuelta al resultado).</p>
<p><b>Reto extra:</b> Crea <code>edad = 12</code> y comprueba con <code>and</code> si la edad
está entre 10 y 15. Muestra el resultado.</p>`,
      solution: py`
        edad = 12
        print(edad >= 10 and edad <= 15)
      `,
      feedback: {
        useAnd: "Une las dos comparaciones con <code>and</code>: <code>edad &gt;= 10 and edad &lt;= 15</code>.",
        printBool: "Muestra el resultado (<code>True</code> o <code>False</code>) con <code>print(…)</code>.",
      },
    },
  },

  "s2-l3": {
    title: "El azar decide",
    story: "Al juego de rover de la tripulación le falta el dado. A Lumo le encantaría tener uno que sea aleatorio de verdad.",
    intro: `
<p>El azar hace que los juegos sean emocionantes. Python trae herramientas listas para usar en
<b>módulos</b>, que cargas con <code>import</code>. El módulo <code>random</code> sabe tirar dados.</p>

<pre><code>import random
numero = random.randint(1, 6)
print("Sacas un", numero)</code></pre>

<p><code>random.randint(1, 6)</code> da un número entero al azar del 1 al 6 (los dos extremos
incluidos). <code>import random</code> se escribe una sola vez, arriba del todo del programa.
Con comas puedes mezclar texto y números dentro de <code>print</code>.</p>`,
    taskHtml: "Construye un <b>dado</b>: muestra un número al azar del 1 al 6. ¡Ejecuta el programa varias veces!",
    hints: [
      "<code>import random</code> ya está arriba del todo.",
      "<code>numero = random.randint(1, 6)</code> y después <code>print(numero)</code>.",
    ],
    starterCode: py`
      import random
      # Tira el dado (un número al azar del 1 al 6) y muestra el resultado
    `,
    solution: py`
      import random
      numero = random.randint(1, 6)
      print("Sacas un", numero)
    `,
    feedback: {
      useRandint: "Usa <code>random.randint(1, 6)</code> para obtener un número al azar.",
      range16: "El número del dado debe estar entre 1 y 6 y aparecer al final de la salida.",
      notRandom: "El número sale siempre igual. Muestra el resultado de <code>random.randint(1, 6)</code>.",
    },
    expert: {
      html: `
<p>Con <code>random.choice([...])</code> eliges al azar algo <b>de una lista</b>:
perfecto para una ruleta de premios.</p>
<p><b>Reto extra:</b> Construye una ruleta de premios con al menos <b>cuatro</b> premios inventados por ti.</p>`,
      solution: py`
        import random
        premios = ["Nada 😅", "Un helado", "5 puntos", "Comodín", "¡El gran premio!"]
        print("Ganas:", random.choice(premios))
      `,
      feedback: {
        useChoice: "Usa <code>random.choice(premios)</code> para sacar un premio al azar.",
        fourPrizes: 'Tu lista necesita al menos cuatro premios: <code>["A", "B", "C", "D"]</code>.',
        notRandom: "El resultado sale siempre igual. Muestra lo que saca <code>random.choice(…)</code>.",
      },
    },
  },

  "s2-l4": {
    title: "Repite el ritmo",
    story: "Los altavoces del hangar vuelven a crepitar. Es hora del primer ritmo en años: ¡haz que se repita!",
    intro: `
<p>En lugar de copiar una línea cuatro veces, haces que se <b>repita</b>. Para eso está el
bucle <code>for</code>:</p>

<pre><code>for i in range(4):
    print("Bum - chas")</code></pre>

<p><code>range(4)</code> cuenta <code>0, 1, 2, 3</code>, o sea, cuatro vueltas. La variable
<code>i</code> es el contador de la vuelta actual. Aquí también hay <b>dos puntos</b> al final, y la parte
que se repite lleva <b>sangría</b>.</p>

<p><b>Tu ritmo se oye con el altavoz de la estación.</b> Para eso, trae <code>drum</code>
(batería) y <code>note</code> (notas) del módulo <code>station</code>:</p>

<pre><code>from station import drum, note

for i in range(4):
    drum("kick")
    drum("snare")
note("do5", 2)</code></pre>

<p>Batería: <code>"kick"</code>, <code>"snare"</code>, <code>"hihat"</code>, <code>"clap"</code>,
<code>"tom"</code>. Notas: <code>"do4"</code>, <code>"re4"</code>, <code>"mi4"</code>… o también
<code>"C4"</code>, <code>"D4"</code>, <code>"E4"</code>… El número después de la coma es la duración
en tiempos (sin número: un tiempo).</p>`,
    taskHtml:
      "Crea un <b>ritmo</b> con un <b>bucle <code>for</code></b> que se repita <b>al menos tres veces</b>: que se oiga con <code>drum()</code> o <code>note()</code>, o como texto con <code>print()</code>. La instrucción aparece una sola vez en el código: el bucle se encarga de repetirla.",
    hints: [
      '<code>for i in range(4):</code> y debajo, con sangría, <code>drum("kick")</code> o <code>print(…)</code>.',
      "Para el sonido, arriba del todo va <code>from station import drum, note</code>; eso ya está escrito.",
    ],
    starterCode: py`
      from station import drum, note

      # Crea tu ritmo con un bucle for
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
      useRange: "Usa <code>range(…)</code>, por ejemplo <code>for i in range(4):</code>.",
      printInLoop:
        "La instrucción (<code>drum</code>, <code>note</code> o <code>print</code>) tiene que ir <b>con sangría</b> debajo de la línea del <code>for</code> para que se repita.",
      threeTimes: "Tu ritmo debe sonar al menos tres veces (o dar al menos tres líneas). Pon un número más alto en <code>range(…)</code>.",
    },
    expert: {
      html: `
<p>El contador <code>i</code> es muy útil: con él puedes numerar lo que muestras.
<code>range(1, 6)</code> cuenta del 1 al 5.</p>
<p><b>Reto extra:</b> Muestra con un bucle desde «Ronda 1» hasta «Ronda 5».</p>`,
      solution: py`
        for i in range(1, 6):
            print(f"Ronda {i}")
      `,
      feedback: {
        numbered: 'Las líneas deben ir numeradas del 1 al 5: <code>print(f"Ronda {i}")</code> con <code>range(1, 6)</code>.',
      },
    },
  },

  "s2-l5": {
    title: "Dibuja patrones",
    story: "Las luces de señal del portón del hangar deberían mostrar un patrón que crece. Ahora mismo todas las filas brillan igual, y eso se puede mejorar.",
    intro: `
<p>Con <code>*</code> no solo puedes calcular: también puedes <b>multiplicar</b> texto.
<code>"ab" * 3</code> da <code>"ababab"</code>. Si lo juntas con un bucle y el contador
<code>i</code>, salen patrones que crecen.</p>

<pre><code>for i in range(1, 4):
    print("#" * i)</code></pre>

<p><code>range(1, 4)</code> cuenta del 1 al 3. En la primera vuelta <code>i</code> vale 1,
después 2 y después 3, y esa misma cantidad de caracteres aparece en la línea.</p>`,
    taskHtml:
      "El patrón de abajo todavía es aburrido: todas las líneas miden lo mismo. Cambia el programa para que cada línea sea <b>más larga que la anterior</b>. Puedes elegir el símbolo que quieras.",
    hints: [
      '<code>"#" * 3</code> da <code>###</code>. Entonces, ¿qué dará <code>"#" * i</code>?',
      'Cambia el 3 fijo por el contador: <code>print("⭐" * i)</code>',
    ],
    starterCode: py`
      # El patrón aún es aburrido: todas las líneas miden lo mismo.
      for i in range(1, 6):
          print("⭐" * 3)
    `,
    solution: py`
      for i in range(1, 6):
          print("⭐" * i)
    `,
    feedback: { grow: 'Las líneas todavía miden lo mismo. Haz que la longitud crezca con el contador: <code>"⭐" * i</code>.' },
    expert: {
      html: `
<p>Con espacios al principio puedes desplazar un patrón hacia la derecha, y así sale una
<b>pirámide</b>. Truco: <code>" " * (5 - i)</code> para el hueco y <code>"*" * (2 * i - 1)</code>
para las estrellas.</p>
<p><b>Reto extra:</b> Dibuja una pirámide de al menos cuatro líneas que se vaya ensanchando hacia abajo.</p>`,
      solution: py`
        for i in range(1, 6):
            print(" " * (5 - i) + "*" * (2 * i - 1))
      `,
      feedback: {
        indent: 'Cada línea debe tener menos espacios al principio que la anterior: <code>" " * (5 - i)</code>.',
        wider: "Las estrellas tienen que aumentar de una línea a la siguiente.",
      },
    },
  },

  "s2-l6": {
    title: "Mientras…",
    story: "El rover está listo en la rampa de salida. Solo falta la cuenta atrás.",
    intro: `
<p>El bucle <code>while</code> repite algo <b>mientras</b> se cumpla una condición. Es ideal
cuando no sabes de antemano cuántas veces hará falta.</p>

<pre><code>numero = 3
while numero &gt; 0:
    print(numero)
    numero = numero - 1
print("¡Ya!")</code></pre>

<p><b>Muy importante:</b> dentro del bucle tiene que cambiar algo que, en algún momento, haga que la
condición sea <code>False</code>. Aquí, <code>numero</code> se va haciendo más pequeño. Si eso no pasa,
el bucle sigue <i>para siempre</i>. No te preocupes: PyQuest se da cuenta y detiene tu programa
(o puedes pulsar <b>Detener</b>).</p>`,
    taskHtml:
      "Cuenta <b>hacia atrás del 10 al 1</b> con un bucle <code>while</code> y después muestra <code>¡Despegue! 🚀</code>.",
    hints: [
      "<code>while numero &gt; 0:</code> y debajo, con sangría, <code>print(numero)</code>.",
      "Haz el número más pequeño dentro del bucle: <code>numero = numero - 1</code>. ¡Si no, no se acaba nunca!",
    ],
    starterCode: py`
      numero = 10
      # Cuenta hacia atrás del 10 al 1 con un bucle while
      # y después muestra "¡Despegue! 🚀"
    `,
    solution: py`
      numero = 10
      while numero > 0:
          print(numero)
          numero = numero - 1
      print("¡Despegue! 🚀")
    `,
    feedback: {
      countdown: "La salida debe contar hacia atrás del 10 al 1, con un número por línea.",
      finalLine: "Después del bucle, muestra también «¡Despegue! 🚀», <b>sin</b> sangría, para que salga una sola vez.",
    },
    expert: {
      html: `
<p>En un bucle también puedes <b>ir acumulando</b> algo: una segunda variable crece en
cada vuelta.</p>
<p><b>Reto extra:</b> Calcula con un bucle <code>while</code> la suma de todos los números del 1 al 10
y muéstrala.</p>`,
      solution: py`
        numero = 1
        suma = 0
        while numero <= 10:
            suma = suma + numero
            numero = numero + 1
        print("Suma:", suma)
      `,
      feedback: {
        accumulate: "Necesitas dos variables que cambien: el contador y la suma (<code>suma = suma + numero</code>).",
        result55: "La suma del 1 al 10 es 55. ¿Llega tu bucle hasta el 10 incluido?",
      },
    },
  },

  "s2-boss2": {
    title: "Adivina el número",
    story: "El portón del hangar está protegido con un código numérico, y la cerradura solo dice «demasiado alto» o «demasiado bajo». ¡Crea el juego y descubre el código!",
    intro: `
<p>¡El gran clásico! Python piensa un número y tú intentas adivinarlo con las pistas
«demasiado alto» o «demasiado bajo» hasta que aciertes. Necesitas todo lo de este capítulo:
<code>random</code>, <code>int(input())</code>, <code>if</code>/<code>elif</code> y <code>while</code>.</p>

<p>El bucle <code>while numero != secreto:</code> se repite mientras tu número <b>no</b> sea el correcto.
Dentro todavía falta lo más importante: las pistas.</p>`,
    taskHtml:
      "Completa el juego: dentro del bucle debe mostrarse <b>«demasiado alto»</b> o <b>«demasiado bajo»</b>, según el número que escribas. Si aciertas, no sale ninguna pista. ¡Después pruébalo tú!",
    hints: [
      "<code>if numero &gt; secreto:</code> → demasiado alto.",
      "<code>elif numero &lt; secreto:</code> → demasiado bajo. Los dos van con sangría dentro del bucle, debajo de la línea del <code>input</code>.",
    ],
    starterCode: py`
      import random
      secreto = random.randint(1, 20)
      numero = 0

      while numero != secreto:
          numero = int(input("Tu número (1-20): "))
          # Da aquí una pista: ¿demasiado alto o demasiado bajo?

      print("¡Acertaste! 🎉")
    `,
    solution: py`
      import random
      secreto = random.randint(1, 20)
      numero = 0

      while numero != secreto:
          numero = int(input("Tu número (1-20): "))
          if numero > secreto:
              print("demasiado alto")
          elif numero < secreto:
              print("demasiado bajo")

      print("¡Acertaste! 🎉")
    `,
    feedback: {
      tooHigh: "Si el número es demasiado grande, todavía no aparece ninguna pista. Compruébalo con <code>if numero &gt; secreto:</code>.",
      tooLow: "Si el número es demasiado pequeño, todavía no aparece ninguna pista. Compruébalo con <code>elif numero &lt; secreto:</code>.",
      highLow: "Con números demasiado altos y demasiado bajos aparece la misma pista. Muestra pistas diferentes.",
      winNoHint:
        "Si aciertas, no debe salir «demasiado alto» ni «demasiado bajo». Usa <code>elif numero &lt; secreto:</code> en lugar de <code>else:</code>.",
    },
    expert: {
      html: `
<p><b>Reto extra:</b> Cuenta los intentos y muestra al final cuántos fueron, por ejemplo
«¡Acertaste! Intentos: 3». Truco: antes del bucle crea <code>intentos = 0</code> y aumenta
el valor en cada intento.</p>`,
      solution: py`
        import random
        secreto = random.randint(1, 20)
        numero = 0
        intentos = 0

        while numero != secreto:
            numero = int(input("Tu número (1-20): "))
            intentos = intentos + 1
            if numero > secreto:
                print("demasiado alto")
            elif numero < secreto:
                print("demasiado bajo")

        print(f"¡Acertaste! Intentos: {intentos} 🎉")
      `,
      feedback: {
        counter: "Aumenta un contador dentro del bucle: <code>intentos = intentos + 1</code>.",
        count3: "Después de probar 12, 3 y 7, al final deberían salir 3 intentos. ¿Cuentas cada intento exactamente una vez?",
        count1: "Si aciertas a la primera, necesitas 1 intento. ¿Empieza tu contador en 0?",
      },
    },
  },

  // ================================================================== CAPÍTULO 3
  "s3-l1": {
    title: "Listas: tu colección",
    story: "En el laboratorio todo está revuelto. Empieza con una lista: muestras, música para el turno de noche, lo que quieras.",
    intro: `
<p>Una <b>lista</b> guarda muchos valores juntos en una sola variable: una playlist,
un equipo, las cosas que llevas de viaje. La escribes entre corchetes <code>[ ]</code>, con los elementos
separados por comas.</p>

<pre><code>playlist = ["Canción A", "Canción B", "Canción C"]
print(playlist)
print(playlist[0])   # el primer elemento</code></pre>

<p>A cada elemento llegas por su <b>posición</b>, ¡y se empieza a contar desde <code>0</code>!
<code>playlist[0]</code> es el primer elemento y <code>playlist[1]</code>, el segundo.</p>`,
    taskHtml:
      "Crea una <b>lista</b> (una playlist, un equipo, tus comidas favoritas…) con al menos 3 elementos. Muestra la lista entera y después el <b>primer</b> elemento por separado.",
    hints: [
      'Corchetes y elementos separados por comas: <code>comidas = ["pizza", "tacos", "sushi"]</code>',
      "El primer elemento lo obtienes con <code>comidas[0]</code>.",
    ],
    starterCode: py`
      # Crea una lista con al menos 3 cosas
      # Muestra la lista y después el primer elemento
    `,
    solution: py`
      playlist = ["Canción A", "Canción B", "Canción C"]
      print(playlist)
      print(playlist[0])
    `,
    feedback: {
      printList: "Muestra la lista completa con <code>print(…)</code>.",
      printFirst: "Después, muestra el primer elemento en una línea aparte. Las posiciones empiezan en 0: <code>lista[0]</code>.",
    },
    expert: {
      html: `
<p><code>len(lista)</code> te dice cuántos elementos tiene una lista. Y con
<code>lista[-1]</code> cuentas desde el final: ese es el último elemento.</p>
<p><b>Reto extra:</b> Muestra cuántos elementos tiene tu lista y su último elemento usando <code>[-1]</code>.</p>`,
      solution: py`
        playlist = ["Canción A", "Canción B", "Canción C"]
        print("Cantidad:", len(playlist))
        print("Última:", playlist[-1])
      `,
      feedback: {
        useLen: "Usa <code>len(lista)</code> para saber la cantidad.",
        useNeg: "El último elemento lo obtienes con <code>lista[-1]</code>.",
        printBoth: "Muestra la cantidad y el último elemento.",
      },
    },
  },

  "s3-l2": {
    title: "Cambiar listas",
    story: "Han llegado provisiones nuevas. Añádelas a la lista y ordena el caos.",
    intro: `
<p>Las listas se pueden cambiar después de crearlas. Con un punto usas <b>métodos</b>: pequeños
comandos que pertenecen a la lista.</p>

<pre><code>equipo = ["Yara", "Noah"]
equipo.append("Lena")   # añadir al final
equipo.sort()           # ordenar alfabéticamente
print(equipo)</code></pre>

<p><code>.append(x)</code> añade <code>x</code> al final y <code>.sort()</code> ordena la
lista. Estos métodos cambian la lista directamente; por eso, delante del punto va el nombre de la lista.</p>`,
    taskHtml:
      "Añade a la lista al menos un nombre con <code>.append(…)</code>, después <b>ordénala</b> con <code>.sort()</code> y muéstrala.",
    hints: ['Añadir: <code>equipo.append("Nombre")</code>', "Ordenar: <code>equipo.sort()</code>, y después <code>print(equipo)</code>"],
    starterCode: py`
      equipo = ["Yara", "Noah"]
      # Añade a alguien, ordena la lista y muéstrala
    `,
    solution: py`
      equipo = ["Yara", "Noah"]
      equipo.append("Lena")
      equipo.sort()
      print(equipo)
    `,
    feedback: {
      useAppend: 'Añade a alguien con <code>equipo.append("Nombre")</code>.',
      useSort: "Ordena la lista con <code>equipo.sort()</code>.",
      sortNone:
        "Ahí pone <code>None</code>: <code>equipo.sort()</code> ordena la lista directamente y no devuelve nada. Escribe solo <code>equipo.sort()</code>, no <code>equipo = equipo.sort()</code>.",
      threeNames: "Al final, la lista debe tener al menos 3 nombres.",
      sorted: "Muestra la lista <b>ordenada</b>. ¿Llamas a <code>.sort()</code> <b>después</b> de añadir y antes del <code>print</code>?",
    },
    expert: {
      html: `
<p>Más métodos: <code>.remove("x")</code> quita un elemento y <code>.reverse()</code>
invierte el orden.</p>
<p><b>Reto extra:</b> Quita un nombre del equipo, invierte el orden y muestra el resultado.</p>`,
      solution: py`
        equipo = ["Yara", "Noah", "Lena"]
        equipo.remove("Noah")
        equipo.reverse()
        print(equipo)
      `,
      feedback: {
        useRemove: 'Quita a alguien con <code>equipo.remove("Nombre")</code>.',
        useReverse: "Invierte la lista con <code>equipo.reverse()</code>.",
      },
    },
  },

  "s3-l3": {
    title: "Para cada cosa…",
    story: "Lumo tiene que revisar cada elemento de la lista, uno tras otro. Un bucle lo hace en segundos.",
    intro: `
<p>Con <code>for … in lista</code> recorres <b>cada elemento</b> uno tras otro, sin
tener que contar posiciones:</p>

<pre><code>canciones = ["A", "B", "C"]
for cancion in canciones:
    print("Ahora suena:", cancion)</code></pre>

<p>En cada vuelta, <code>cancion</code> es el siguiente elemento. Ese nombre lo eliges tú:
<code>for x in canciones</code> funcionaría igual, pero un nombre que diga algo se lee mejor.</p>`,
    taskHtml:
      "Recorre la lista con un bucle <code>for</code> y muestra <b>cada elemento en su propia línea</b>. Si quieres, pon un texto delante, por ejemplo «Ahora suena: …».",
    hints: ["<code>for cancion in canciones:</code>", "Debajo, con sangría: <code>print(cancion)</code>"],
    starterCode: py`
      canciones = ["Intro", "Beat 1", "Final"]
      # Muestra cada canción por separado
    `,
    solution: py`
      canciones = ["Intro", "Beat 1", "Final"]
      for cancion in canciones:
          print("Ahora suena:", cancion)
    `,
    feedback: {
      loopOverList: "Haz que el bucle recorra directamente la lista: <code>for cancion in canciones:</code>",
      printInLoop: "El <code>print(…)</code> va dentro del bucle, con sangría.",
      eachItem: "Cada elemento de la lista debe aparecer en la salida, uno por línea.",
    },
    expert: {
      html: `
<p>Si tu lista contiene números, puedes calcular una <b>suma</b> dentro del bucle.</p>
<p><b>Reto extra:</b> Suma con un bucle todos los goles de la lista <code>goles = [2, 1, 3, 0, 2]</code>
(sin usar <code>sum()</code>) y muestra el total.</p>`,
      solution: py`
        goles = [2, 1, 3, 0, 2]
        suma = 0
        for g in goles:
            suma = suma + g
        print("Goles en total:", suma)
      `,
      feedback: {
        accumulate: "Antes del bucle, crea <code>suma = 0</code>, y dentro del bucle súmale cada gol.",
        result8: "En total son 8 goles.",
      },
    },
  },

  "s3-l4": {
    title: "Crea tus propios comandos",
    story: "Lumo está harto de explicarlo todo diez veces. Crea un comando propio que salude a los visitantes.",
    intro: `
<p>Una <b>función</b> es un comando propio que construyes una vez y puedes usar tantas veces como quieras.
La defines con <code>def</code>; entre los paréntesis van los <b>parámetros</b>, es decir, los valores
que recibe la función cuando la llamas.</p>

<pre><code>def saludar(nombre):
    print(f"¡Hola, {nombre}! 👋")

saludar("Deniz")
saludar("Fátima")</code></pre>

<p>El bloque con sangría es el «plano de construcción». Solo se ejecuta cuando <b>llamas</b> a la
función, con el valor que le pasas. Así te ahorras repetir código.</p>`,
    taskHtml: "Llama a la función <code>saludar</code> con <b>dos nombres distintos</b>.",
    hints: ['Llamada: <code>saludar("Mia")</code>', "Dos llamadas, una debajo de otra, sin sangría y con nombres distintos."],
    starterCode: py`
      def saludar(nombre):
          print(f"¡Hola, {nombre}! 👋")

      # Llama a la función con dos nombres distintos
    `,
    solution: py`
      def saludar(nombre):
          print(f"¡Hola, {nombre}! 👋")

      saludar("Mia")
      saludar("Mateo")
    `,
    feedback: {
      twoCalls: 'Llama a la función dos veces, cada vez en su propia línea: <code>saludar("Mia")</code>.',
      differentNames: "Usa dos nombres <b>distintos</b>.",
    },
    expert: {
      html: `
<p>Una función puede tener <b>varios parámetros</b>, separados por comas.</p>
<p><b>Reto extra:</b> Construye <code>saludar(nombre, momento)</code> para que salga, por ejemplo,
«¡Buenas tardes, Mia!», y llámala dos veces.</p>`,
      solution: py`
        def saludar(nombre, momento):
            print(f"¡Buenas {momento}, {nombre}!")

        saludar("Mia", "tardes")
        saludar("Leo", "noches")
      `,
      feedback: {
        twoParams: "Dale dos parámetros a la función: <code>def saludar(nombre, momento):</code>",
        twoCalls: "Llama a la función dos veces.",
        useBoth: "Los dos parámetros deben aparecer en el saludo.",
      },
    },
  },

  "s3-l5": {
    title: "Devolver un resultado",
    story: "Los medidores dan tres valores, pero falta el promedio. Crea una función que lo devuelva, sean cuales sean los números.",
    intro: `
<p>Las funciones pueden <b>devolver</b> un resultado con <code>return</code>. La diferencia
con <code>print</code> es esta: <code>print</code> solo <i>muestra</i> algo, mientras que <code>return</code>
<i>entrega</i> un valor con el que puedes seguir calculando.</p>

<pre><code>def doble(x):
    return x * 2

resultado = doble(5)
print(resultado)   # 10</code></pre>

<p>Después de <code>return</code>, la función termina y devuelve el valor al lugar desde donde
la llamaste. Ese valor lo puedes guardar, mostrar o seguir usando.</p>`,
    taskHtml:
      "Completa <code>promedio</code> para que la función devuelva el <b>promedio</b> de los tres números. Para 2, 4 y 6 sale <b>4.0</b>, y con cualquier otro número también tiene que ser correcto.",
    hints: [
      "Suma entre cantidad: <code>(a + b + c) / 3</code>. ¡Los paréntesis son importantes!",
      "Devuélvelo con <code>return</code>, no con <code>print</code>.",
    ],
    starterCode: py`
      def promedio(a, b, c):
          # Devuelve el promedio de los tres números
          return 0

      print(promedio(2, 4, 6))
    `,
    solution: py`
      def promedio(a, b, c):
          return (a + b + c) / 3

      print(promedio(2, 4, 6))
    `,
    feedback: {
      returnsNothing: "Tu función todavía no devuelve nada. Usa <code>return</code> en lugar de <code>print</code> dentro de la función.",
      wrongValues:
        "Con otros números el resultado todavía no es correcto. ¿Calculas con <code>a</code>, <code>b</code> y <code>c</code>? Ojo con los paréntesis: <code>(a + b + c) / 3</code>.",
      printResult: "Muestra el resultado para 2, 4 y 6: <code>print(promedio(2, 4, 6))</code>.",
    },
    expert: {
      html: `
<p><b>Reto extra:</b> Escribe <code>puntos(victorias, empates)</code>, que <b>devuelva</b> los puntos
de un equipo de fútbol (victoria = 3 puntos, empate = 1 punto), y úsala para comparar dos equipos.</p>`,
      solution: py`
        def puntos(victorias, empates):
            return victorias * 3 + empates

        print("Equipo A:", puntos(5, 3))
        print("Equipo B:", puntos(7, 1))
      `,
      feedback: {
        wrongValues: "Los puntos todavía no cuadran. Una victoria vale 3 y un empate, 1: <code>victorias * 3 + empates</code>.",
      },
    },
  },

  "s3-l6": {
    title: "Diccionarios: clave y valor",
    story: "Cada miembro de la tripulación tiene una ficha de equipo con nombres y valores. Completa la tuya.",
    intro: `
<p>Un <b>diccionario</b> guarda pares de <b>clave</b> y <b>valor</b>, como un diccionario
de verdad (palabra → significado) o la ficha de un personaje. Se escribe con llaves <code>{ }</code>,
con dos puntos entre la clave y el valor, y con comas entre los pares:</p>

<pre><code>personaje = {"nombre": "Ada", "nivel": 3}
print(personaje["nombre"])   # Ada
print(personaje["nivel"])    # 3</code></pre>

<p>A diferencia de las listas (donde accedes por la <b>posición</b>), aquí usas la <b>clave</b>:
<code>personaje["nombre"]</code>. Es genial para agrupar información que va junta.</p>`,
    taskHtml:
      "Amplía el diccionario a al menos <b>tres</b> pares (por ejemplo, con un arma, una mascota o un color) y muestra <b>dos valores</b> usando su clave.",
    hints: [
      'Un par más: <code>personaje = {"nombre": "Ada", "nivel": 3, "color": "lila"}</code>',
      'Acceso por la clave: <code>print(personaje["color"])</code>',
    ],
    starterCode: py`
      personaje = {"nombre": "Ada", "nivel": 3}
      # Añade un tercer par y muestra dos valores
    `,
    solution: py`
      personaje = {"nombre": "Ada", "nivel": 3, "color": "lila"}
      print(personaje["nombre"])
      print(personaje["color"])
    `,
    feedback: {
      accessByKey: 'Obtén dos valores usando su clave: <code>personaje["nombre"]</code>.',
      printValues: "Muestra al menos dos valores del diccionario.",
    },
    expert: {
      html: `
<p>Los pares nuevos se añaden así: <code>personaje["puntos"] = 100</code>. Y con
<code>for clave in personaje:</code> recorres todas las claves.</p>
<p><b>Reto extra:</b> Añade un par nuevo y después muestra todos los pares con un bucle.</p>`,
      solution: py`
        personaje = {"nombre": "Ada", "nivel": 3}
        personaje["puntos"] = 100
        for clave in personaje:
            print(clave, "=", personaje[clave])
      `,
      feedback: {
        addKey: 'Añade un par: <code>personaje["puntos"] = 100</code>.',
        loopDict: "Recorre todas las claves con <code>for clave in personaje:</code>.",
      },
    },
  },

  "s3-boss3": {
    title: "Tu miniquiz",
    story: "La IA de a bordo solo deja entrar al laboratorio a quien supera su quiz. ¡Cambia los papeles: ahora el quiz lo creas tú!",
    intro: `
<p>Construye un pequeño <b>quiz</b> sobre el tema que tú elijas (animales, música, deporte, el espacio…).
El programa hace preguntas con <code>input()</code>, comprueba las respuestas con <code>if</code> y
cuenta los puntos con una variable.</p>

<pre><code>puntos = 0
respuesta = input("¿Pregunta? ")
if respuesta == "correcta":
    puntos = puntos + 1</code></pre>

<p>Consejo: con <code>respuesta.lower()</code> comparas sin que importen las mayúsculas y
minúsculas, así que «Roma» cuenta igual que «roma».</p>`,
    taskHtml:
      "Amplía el quiz con <b>al menos dos preguntas más</b> (tres en total). Cuenta las respuestas correctas como puntos y muestra la puntuación al final.",
    hints: [
      "Para cada pregunta: un <code>input(…)</code> y un <code>if</code>/<code>else</code>.",
      "Si la respuesta es correcta: <code>puntos = puntos + 1</code>. La puntuación va al final del todo.",
    ],
    starterCode: py`
      puntos = 0

      respuesta = input("¿Cuántas patas tiene una araña? ")
      if respuesta == "8":
          puntos = puntos + 1
          print("¡Correcto! 🕷️")
      else:
          print("¡Casi! Son 8.")

      # Añade aquí al menos dos preguntas más

      print("Puntos:", puntos)
    `,
    solution: py`
      puntos = 0

      respuesta = input("¿Cuántas patas tiene una araña? ")
      if respuesta == "8":
          puntos = puntos + 1
          print("¡Correcto! 🕷️")
      else:
          print("¡Casi! Son 8.")

      respuesta = input("¿Cuál es la capital de Italia? ")
      if respuesta.lower() == "roma":
          puntos = puntos + 1
          print("¡Correcto! 🇮🇹")
      else:
          print("Era Roma.")

      respuesta = input("¿Qué planeta se conoce como el planeta rojo? ")
      if respuesta.lower() == "marte":
          puntos = puntos + 1
          print("¡Correcto! 🔴")
      else:
          print("Es Marte.")

      print("Puntos:", puntos)
    `,
    feedback: {
      ifPerQuestion: "Comprueba cada respuesta con su propio <code>if</code>.",
      countPoints: "Suma un punto con cada respuesta correcta: <code>puntos = puntos + 1</code>.",
      scoreAtEnd: 'Muestra la puntuación al final del todo, por ejemplo <code>print("Puntos:", puntos)</code>.',
    },
    expert: {
      html: `
<p>Versión pro: guarda las preguntas en una <b>lista de diccionarios</b>
(<code>{"pregunta": …, "respuesta": …}</code>) y recórrelas con <b>un solo</b> bucle. Así
escribes el código de una pregunta una sola vez, da igual cuántas preguntas haya.</p>
<p><b>Reto extra:</b> Rehaz tu quiz de esta forma (con al menos dos preguntas en la lista).</p>`,
      solution: py`
        preguntas = [
            {"pregunta": "¿Cuántas patas tiene una araña? ", "respuesta": "8"},
            {"pregunta": "¿Cuál es la capital de Italia? ", "respuesta": "roma"},
            {"pregunta": "¿Qué planeta se conoce como el planeta rojo? ", "respuesta": "marte"},
        ]
        puntos = 0
        for p in preguntas:
            respuesta = input(p["pregunta"])
            if respuesta.lower() == p["respuesta"]:
                puntos = puntos + 1
                print("¡Correcto!")
            else:
                print("Lo siento. La respuesta correcta es:", p["respuesta"])
        print("Puntos:", puntos, "de", len(preguntas))
      `,
      feedback: {
        listOfDicts: 'Crea una lista con al menos dos diccionarios: <code>[{"pregunta": …, "respuesta": …}, …]</code>.',
        inputInLoop: 'Haz las preguntas <b>dentro</b> del bucle: <code>respuesta = input(p["pregunta"])</code>.',
      },
    },
  },

  // ================================================================== CAPÍTULO 4
  "s4-l1": {
    title: "El motor del juego",
    story: "En la sala de control hay una vieja máquina recreativa de la tripulación. Le falta el corazón, el bucle de juego. Constrúyelo de nuevo.",
    intro: `
<p>Muchos juegos tienen un <b>bucle de juego</b>: mientras al personaje le queden vidas o energía,
la partida continúa. Es un bucle <code>while</code> alrededor de un valor que va cambiando.</p>

<pre><code>vidas = 3
while vidas &gt; 0:
    print("Vidas restantes:", vidas)
    vidas = vidas - 1
print("Game Over")</code></pre>

<p>El valor <code>vidas</code> es el <b>estado</b> del juego. Y con el azar se pone interesante:
si en cada ronda el daño es distinto, nadie sabe de antemano cuánto va a durar la partida.</p>`,
    taskHtml:
      "Construye el <b>bucle de juego</b>: mientras <code>energia</code> sea mayor que 0, el juego saca al azar un golpe de 1 a 6, se lo resta y muestra la ronda y la energía. Después aparece «Game Over».",
    hints: [
      "<code>while energia &gt; 0:</code> y todo lo que pasa en cada ronda va debajo, con sangría.",
      "Dentro del bucle: <code>golpe = random.randint(1, 6)</code> y después <code>energia = energia - golpe</code>.",
    ],
    starterCode: py`
      import random
      energia = 20
      ronda = 1
      # Bucle de juego: mientras energia sea mayor que 0…
      #   1. saca al azar un golpe de 1 a 6
      #   2. réstaselo a energia
      #   3. muestra la ronda y la energía
      #   4. aumenta ronda en 1
      print("Game Over")
    `,
    solution: py`
      import random
      energia = 20
      ronda = 1
      while energia > 0:
          golpe = random.randint(1, 6)
          energia = energia - golpe
          print(f"Ronda {ronda}: -{golpe} → Energía {energia}")
          ronda = ronda + 1
      print("Game Over")
    `,
    feedback: {
      randomInLoop: "Saca el golpe <b>dentro</b> del bucle con <code>random.randint(1, 6)</code>, para que cada ronda sea distinta.",
      rounds: "Muestra algo en cada ronda, por ejemplo la ronda y la energía.",
      gameOver: "Después del bucle siempre debe salir «Game Over», <b>sin</b> sangría.",
    },
    expert: {
      html: `
<p><b>Reto extra:</b> Después de la partida, muestra cuántas rondas duró, por ejemplo
«Sobreviviste 6 rondas». Cuidado: <code>ronda</code> empieza en 1 y aumenta después de cada ronda.
Entonces, ¿qué valor tiene <code>ronda</code> después de 4 rondas?</p>`,
      solution: py`
        import random
        energia = 20
        ronda = 1
        while energia > 0:
            golpe = random.randint(1, 6)
            energia = energia - golpe
            print(f"Ronda {ronda}: -{golpe} → Energía {energia}")
            ronda = ronda + 1
        print("Game Over")
        print(f"Sobreviviste {ronda - 1} rondas")
      `,
      feedback: {
        rounds: "Al final, muestra cuántas rondas fueron.",
        count4:
          "Con 20 de energía y siempre 5 de daño son exactamente 4 rondas. Recuerda: después de la última ronda, <code>ronda</code> ya va una por delante.",
        count20: "Con siempre 1 de daño son 20 rondas. ¿Cuentas cada ronda exactamente una vez?",
      },
    },
  },

  "s4-l2": {
    title: "Códigos secretos",
    story: "Ha llegado una señal desconocida, pero está cifrada. Desplaza cada letra y descubre qué dice.",
    intro: `
<p>¡Cifrar mensajes es divertido! En el <b>cifrado César</b> se desplaza cada letra un número
fijo de posiciones. Para eso necesitas dos herramientas: <code>ord()</code> convierte una letra en
su número, y <code>chr()</code> convierte un número otra vez en letra.</p>

<pre><code>print(ord("A"))   # 65
print(chr(66))    # B</code></pre>

<p>Si recorres cada letra y aumentas su número, sale un texto secreto.
Para descifrarlo, simplemente desplazas en la dirección contraria:</p>

<pre><code>secreto = ""
for letra in "HOLA":
    secreto = secreto + chr(ord(letra) + 1)
print(secreto)   # IPMB</code></pre>`,
    taskHtml:
      "Descifra el mensaje secreto: desplaza cada letra <b>1 posición hacia atrás</b> con <code>ord()</code> y <code>chr()</code>. ¿Qué sale?",
    hints: [
      "<code>ord(letra)</code> da el número, <code>- 1</code> lo desplaza hacia atrás y <code>chr(…)</code> lo convierte otra vez en letra.",
      "<code>descifrado = descifrado + chr(ord(letra) - 1)</code>",
    ],
    starterCode: py`
      secreto = "QZUIPO"   # cada letra está desplazada 1 posición
      descifrado = ""
      for letra in secreto:
          # Desplaza cada letra 1 posición hacia atrás
          descifrado = descifrado + letra
      print(descifrado)
    `,
    solution: py`
      secreto = "QZUIPO"
      descifrado = ""
      for letra in secreto:
          descifrado = descifrado + chr(ord(letra) - 1)
      print(descifrado)
    `,
    feedback: {
      useOrdChr: "Usa <code>ord()</code> y <code>chr()</code> para desplazar cada letra.",
      decrypt: "Todavía no está descifrado. Desplaza 1 posición <b>hacia atrás</b>: <code>chr(ord(letra) - 1)</code>.",
    },
    expert: {
      html: `
<p>Los cifrados César de verdad suelen desplazar 3 posiciones. Pero ¿qué pasa con <code>"Z"</code> + 3? Para que después
de la Z se vuelva a empezar por la A, se calcula con el resto de la división: <code>% 26</code>. La fórmula para
mayúsculas es <code>chr((ord(c) - 65 + desplazamiento) % 26 + 65)</code>.</p>
<p><b>Reto extra:</b> Escribe una función <code>cesar(texto, desplazamiento)</code> que desplace las letras
mayúsculas (también más allá de la Z) y deje todo lo demás, como los espacios, sin cambios. Con un
desplazamiento negativo, la función vuelve a descifrar.</p>`,
      solution: py`
        def cesar(texto, desplazamiento):
            resultado = ""
            for c in texto:
                if "A" <= c <= "Z":
                    resultado = resultado + chr((ord(c) - 65 + desplazamiento) % 26 + 65)
                else:
                    resultado = resultado + c
            return resultado

        secreto = cesar("HOLA MUNDO", 3)
        print(secreto)
        print(cesar(secreto, -3))
      `,
      feedback: {
        useMod: "Usa <code>% 26</code> para que después de la Z se vuelva a empezar por la A.",
        shift: 'La comprobación prueba, por ejemplo, <code>cesar("HALLO", 3)</code>: debería devolver <code>"KDOOR"</code>.',
        wrap: '<code>cesar("XYZ", 3)</code> debería dar <code>"ABC"</code>: después de la Z se vuelve a la A.',
        spaces: "Los espacios y los demás signos deben quedarse sin cambios.",
        decryptBack: "Con un desplazamiento negativo, la función debe volver a descifrar.",
      },
    },
  },

  "s4-l3": {
    title: "Dibujar con código",
    story: "La gran pantalla de la sala de control vuelve a funcionar… y está totalmente vacía. ¡Dibuja la primera imagen!",
    intro: `
<p>La estación tiene una <b>pantalla de 16 × 16 puntos de luz</b> (píxeles). Con
<code>pixel(x, y, color)</code> enciendes uno de ellos. <code>x</code> cuenta de izquierda
(0) a derecha (15), y <code>y</code>, de arriba (0) abajo (15).</p>

<pre><code>from station import pixel

for x in range(16):
    pixel(x, 12, "turquesa")   # una línea a lo ancho de la pantalla
pixel(7, 4, "dorado")</code></pre>

<p>Puedes indicar los colores con su nombre, en español o en inglés (<code>"rojo"</code>,
<code>"red"</code>, <code>"azul"</code>, <code>"rosa"</code>…), o con un código de color como
<code>"#ff8800"</code>. <code>"negro"</code> vuelve a apagar un píxel, y
<code>fill(color)</code> pinta toda la pantalla de un color.</p>

<p>Con un bucle dibujas una línea o una superficie entera con muy pocas instrucciones, y un bucle
dentro de otro bucle llena incluso un rectángulo completo.</p>`,
    taskHtml:
      "Dibuja una <b>imagen en la pantalla de la estación</b>: al menos <b>12 píxeles</b> en al menos <b>dos colores</b>, y usa para ello al menos <b>un bucle</b>. Un árbol, un cohete, una cara, tu logo favorito…",
    hints: [
      'Una línea se hace con un bucle: <code>for x in range(3, 13):</code> y debajo <code>pixel(x, 14, "verde")</code>.',
      "Para el segundo color, simplemente pon encima unos cuantos píxeles más de otro color.",
    ],
    starterCode: py`
      from station import pixel

      # Dibuja tu imagen: pixel(x, y, "color")  (x e y van de 0 a 15)
      pixel(7, 7, "dorado")
    `,
    solution: py`
      from station import pixel

      # Tronco
      for y in range(10, 15):
          pixel(7, y, "marrón")
          pixel(8, y, "marrón")
      # Copa
      for y in range(3, 10):
          for x in range(4, 12):
              pixel(x, y, "verde")
      # Manzanas
      pixel(6, 5, "rojo")
      pixel(9, 7, "rojo")
    `,
    feedback: {
      usePixel: 'Enciende píxeles con <code>pixel(x, y, "color")</code>; para eso, arriba del todo va <code>from station import pixel</code>.',
      useLoop: "Usa al menos un bucle, por ejemplo para una línea: <code>for x in range(16):</code>",
    },
    expert: {
      html: `
<p>Quienes hacen pixel art suelen dibujar sus imágenes como una <b>lista de textos</b>: cada carácter es un
píxel, y un diccionario indica qué color corresponde a cada carácter.</p>
<pre><code>imagen = [
    ".RR.RR.",
    "RRRRRRR",
    ".RRRRR.",
    "..RRR..",
    "...R...",
]
colores = {"R": "rojo"}</code></pre>
<p><b>Reto extra:</b> Dibuja una imagen de al menos <b>20 píxeles</b> con dos bucles
<b>anidados</b>: el de fuera recorre las filas (<code>y</code>) y el de dentro, los caracteres de
cada fila (<code>x</code>).</p>`,
      solution: py`
        from station import pixel

        imagen = [
            ".RR.RR.",
            "RRRRRRR",
            "RRRBRRR",
            ".RRRRR.",
            "..RRR..",
            "...R...",
        ]
        colores = {"R": "rojo", "B": "blanco"}

        for y in range(len(imagen)):
            for x in range(len(imagen[y])):
                caracter = imagen[y][x]
                if caracter in colores:
                    pixel(x + 4, y + 5, colores[caracter])
      `,
      feedback: { nested: "Pon un bucle <b>dentro</b> de otro: el de fuera recorre las filas y el de dentro, los caracteres de cada fila." },
    },
  },

  "s4-l4": {
    title: "Analizar datos reales",
    story: "La estación meteorológica de fuera ha medido temperaturas durante una semana. Analiza los datos.",
    intro: `
<p>Programar ayuda a entender datos reales. Para listas de números hay herramientas
listas para usar: <code>max()</code> (el valor más grande), <code>min()</code> (el más pequeño),
<code>sum()</code> (la suma) y <code>len()</code> (la cantidad).</p>

<pre><code>temperaturas = [21, 25, 19, 28, 23]
print("Día más frío:", min(temperaturas))</code></pre>

<p>El <b>promedio</b> se obtiene con «suma entre cantidad», es decir, usando
<code>sum</code> y <code>len</code> juntos.</p>`,
    taskHtml:
      "Encuentra con <code>max()</code> el <b>día más caluroso</b> y calcula el <b>promedio</b> de las temperaturas con <code>sum()</code> y <code>len()</code>. Muestra las dos cosas.",
    hints: ["<code>max(temperaturas)</code> te da el valor más grande.", "Promedio: <code>sum(temperaturas) / len(temperaturas)</code>"],
    starterCode: py`
      temperaturas = [21, 25, 19, 28, 23]
      # Muestra el día más caluroso y el promedio
    `,
    solution: py`
      temperaturas = [21, 25, 19, 28, 23]
      print("Día más caluroso:", max(temperaturas))
      print("Promedio:", sum(temperaturas) / len(temperaturas))
    `,
    feedback: {
      useMax: "Usa <code>max(temperaturas)</code> para el día más caluroso.",
      useSumLen: "Calcula el promedio con <code>sum(temperaturas) / len(temperaturas)</code>.",
      max28: "El día más caluroso tuvo 28 grados: muéstralo.",
      average: "El promedio debería ser 23.2. ¿Divides la suma entre la cantidad?",
    },
    expert: {
      html: `
<p><b>Reto extra:</b> Redondea el promedio a un decimal con <code>round(valor, 1)</code>
y averigua con un bucle cuántos días hizo <b>más de 22 grados</b>.</p>`,
      solution: py`
        temperaturas = [21, 25, 19, 28, 23]
        print("Promedio:", round(sum(temperaturas) / len(temperaturas), 1))
        calurosos = 0
        for t in temperaturas:
            if t > 22:
                calurosos = calurosos + 1
        print("Días calurosos:", calurosos)
      `,
      feedback: {
        useRound: "Redondea con <code>round(…, 1)</code>.",
        countLoop: "Cuenta con un bucle <code>for</code> y un <code>if</code> cuántos valores son mayores que 22.",
        count3: "Hubo 3 días de más de 22 grados (25, 28 y 23).",
      },
    },
  },

  "s4-l5": {
    title: "Encontrar errores (depurar)",
    story: "Un último glitch bloquea la sala de control: hay tres errores escondidos en el código. Arréglalos y la estación quedará libre.",
    intro: `
<p>Los profesionales cometen errores y los encuentran. A eso se le llama <b>depurar</b> (en inglés,
<i>debugging</i>). En el código de abajo hay exactamente <b>tres bugs</b>. Ejecútalo, lee la explicación
en la consola (¡te dice la línea!) y corrige los errores uno por uno. Después de cada arreglo puede
aparecer el siguiente error: es completamente normal.</p>

<p>Tropiezos típicos: faltan los dos puntos <code>:</code>, falta la sangría,
o se mezclan texto y número con <code>+</code> (eso se arregla con <code>str(…)</code>).</p>`,
    taskHtml:
      "Corrige los tres errores hasta que el programa funcione sin ningún mensaje de error. Al final, «¡Hurra!» debe aparecer tres veces.",
    hints: [
      "Dos errores están en la línea del <code>for</code> y en la de debajo: los dos puntos y la sangría.",
      "El tercero: convierte el número en texto antes de unirlo con <code>+</code>: <code>str(edad + 1)</code>.",
    ],
    starterCode: py`
      nombre = "Emma"
      edad = 11
      print("Hola, " + nombre)
      print("El año que viene tendrás " + (edad + 1) + " años")
      for i in range(3)
      print("¡Hurra!")
    `,
    solution: py`
      nombre = "Emma"
      edad = 11
      print("Hola, " + nombre)
      print("El año que viene tendrás " + str(edad + 1) + " años")
      for i in range(3):
          print("¡Hurra!")
    `,
    feedback: {
      keepLoop: "Deja el bucle donde está y arréglalo.",
      allLines: "Deben mostrarse todas las líneas: no borres comandos, corrígelos.",
      age: "En la salida debe aparecer cuántos años tendrá Emma el año que viene (12). Usa <code>str(edad + 1)</code>.",
      threeHurra: "«¡Hurra!» debe aparecer tres veces: la línea del <code>print</code> va dentro del bucle, con sangría.",
    },
    expert: {
      html: `
<p>Algunos errores se pueden prever, por ejemplo, cuando alguien escribe letras donde se espera
un número. Con <code>try:</code> y <code>except ValueError:</code> atrapas el error en lugar de
que el programa se detenga de golpe.</p>
<p><b>Reto extra:</b> Pregunta la edad con <code>int(input(…))</code>. Si es un número, muestra
la edad que tendrá la persona el año que viene; si son letras, muestra un mensaje amable.</p>`,
      solution: py`
        try:
            edad = int(input("¿Cuántos años tienes? "))
            print("El año que viene tendrás", edad + 1)
        except ValueError:
            print("Por favor, escribe un número entero.")
      `,
      feedback: {
        useTry: "Mete la conversión en un bloque <code>try:</code> y atrapa el error con <code>except ValueError:</code>.",
        useInput: "Pregunta la edad con <code>int(input(…))</code>.",
        friendly: "Si se escriben letras, debe aparecer un mensaje amable.",
        normalCase: "Si se escribe 11, el programa debe mostrar 12.",
      },
    },
  },

  "s4-boss4": {
    title: "Tu propio proyecto",
    story: "¡La estación Polaris vuelve a funcionar! Ahora solo falta tu propio módulo: algo que nunca ha existido.",
    intro: `
<p>La gran final: <b>¡crea algo tuyo!</b> Un juego, una historia, un quiz o una herramienta
útil. Usa lo que has aprendido: <code>input()</code>, <code>if</code>, bucles, listas,
diccionarios, funciones propias, <code>random</code>…</p>

<p>No tiene que ser perfecto: lo importante es que sea tuyo. Empieza con algo pequeño, pruébalo a menudo
y luego ve ampliándolo poco a poco. Cuando termines, te espera tu diploma. 🚀</p>`,
    taskHtml:
      "Escribe tu propio programa que use al menos <b>tres piezas</b> del curso (<code>input()</code>, <code>if</code>, un bucle, una lista o un diccionario, una función propia, <code>random</code>) y que funcione sin errores. ¡Deja volar tu imaginación! Es tu obra maestra.",
    hints: [
      "Empieza con algo pequeño: primero muestra algo y después amplíalo paso a paso.",
      "Ideas: un juego de dados con puntos, un quiz de vocabulario hecho con una lista, un planificador de ahorro con una función.",
    ],
    starterCode: py`
      # 🌟 Tu proyecto. Algunas ideas:
      #  - una aventura de texto con decisiones (if/else)
      #  - un quiz sobre tu tema favorito
      #  - un juego de dados o un entrenador de cálculo mental
      #  - una herramienta útil (conversor, generador de ideas)

      print("Mi proyecto arranca…")
    `,
    solution: py`
      import random

      respuestas = ["¡Sí, seguro!", "Mejor no…", "Pregúntame más tarde", "¡Por supuesto!"]

      def oraculo():
          return random.choice(respuestas)

      print("🎲 Oráculo de la suerte 🎲")
      for ronda in range(3):
          pregunta = input("Hazme una pregunta de sí o no: ")
          if pregunta == "":
              print("¡Si no preguntas nada, no puedo responder!")
          else:
              print(oraculo())
    `,
    feedback: {
      blocks:
        "Tu programa solo usa {n} de las piezas. Añade alguna más, por ejemplo un bucle, una lista o una función propia.",
      tooShort: "Tu proyecto puede ser un poco más grande: al menos 6 líneas de código.",
    },
  },

  // ================================================================== MISIONES EXTERIORES
  "d-1": {
    title: "Primera salida",
    story: "Fuera de la estación, el hielo brilla. Lumo puede salir volando, pero solo con tus comandos. ¡Lleva a Lumo a la base de carga!",
    intro: `
<p>Aquí pilotas a Lumo directamente con Python. Los comandos de vuelo los traes con
<code>from drone import *</code>: el asterisco significa «todos los comandos».</p>

<pre><code>from drone import *

move()
move()</code></pre>

<p><code>move()</code> hace volar a Lumo una casilla hacia delante, en la dirección a la que apunta la flecha.
La meta es la <b>base de carga</b> ⚡. Si Lumo choca contra una pared, no pasa nada grave: aparece
un glitch y lo vuelves a intentar.</p>`,
    taskHtml: "Lleva a Lumo a la <b>base de carga</b> ⚡. ¡Cuenta las casillas!",
    hints: ["Cada casilla necesita su propio <code>move()</code>.", "Son cinco casillas: cinco veces <code>move()</code>, una debajo de otra."],
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
    title: "A la vuelta de la esquina",
    story: "La base de carga está detrás de una pared de hielo. Lumo tiene que girar; por suerte, un dron puede girar sobre sí mismo.",
    intro: `
<p><code>turn_left()</code> hace girar a Lumo sobre sí mismo hacia la izquierda, un cuarto de vuelta. Un comando
para girar a la derecha no existe. ¿Se podrá llegar a la derecha de todos modos? Lo descubrirás más adelante.</p>

<pre><code>from drone import *

move()
turn_left()
move()</code></pre>`,
    taskHtml: "Haz volar a Lumo por la esquina hasta la base de carga ⚡.",
    hints: [
      "Primero todo recto hasta la pared, después <code>turn_left()</code> y luego sigue con <code>move()</code>.",
      "Cuatro veces <code>move()</code>, una vez <code>turn_left()</code> y dos veces <code>move()</code>.",
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
      html: "<p><b>Reto extra:</b> Al final, en la base de carga, Lumo debe mirar hacia la <b>izquierda</b> (hacia el oeste), para que la cámara tenga la base a la vista.</p>",
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
      feedback: { faceWest: "Lumo está en el sitio correcto, pero todavía no mira hacia la izquierda. Falta un giro." },
    },
  },

  "d-3": {
    title: "Recoger cristales",
    story: "Sobre el hielo hay cristales de energía. Cada uno ayuda a la estación, así que Lumo debe recogerlos por el camino.",
    intro: `
<p>Los cristales de hielo almacenan energía. <code>collect()</code> recoge el cristal de la casilla
en la que Lumo está en ese momento. Si ahí no hay ninguno, Lumo avisa de un glitch.</p>

<pre><code>from drone import *

move()
move()
collect()</code></pre>`,
    taskHtml: "Recoge <b>los dos cristales</b> y después vuela hasta la base de carga ⚡.",
    hints: [
      "Vuela hasta la casilla del cristal y llama ahí a <code>collect()</code>.",
      "El primer cristal está dos casillas delante de Lumo, el segundo dos casillas más allá, y la base de carga, otras dos casillas detrás.",
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
    title: "Pasillos largos",
    story: "Un estrecho canal de hielo lleva a la base de carga exterior. Es largo, y a Lumo no le gustan nada las listas de comandos largas.",
    intro: `
<p>¿13 casillas, 13 líneas de <code>move()</code>? Con un bucle <code>for</code> lo haces en
dos líneas:</p>

<pre><code>from drone import *

for i in range(4):
    move()</code></pre>

<p>Lumo repite todo lo que va con sangría debajo de la línea del <code>for</code>.</p>`,
    taskHtml: "El pasillo mide <b>13 casillas</b>. Lleva a Lumo a la base de carga ⚡ con un <b>bucle <code>for</code></b>.",
    hints: ["<code>for i in range(…):</code> y debajo, con sangría, <code>move()</code>.", "<code>range(13)</code> repite 13 veces."],
    starterCode: py`
      from drone import *

      # El pasillo mide 13 casillas
      move()
    `,
    solution: py`
      from drone import *

      for i in range(13):
          move()
    `,
    expert: {
      html: "<p><b>Reto extra para pros:</b> Consíguelo con <b>3 líneas</b> de código como máximo. La línea del import cuenta; los comentarios y las líneas vacías, no.</p>",
      solution: py`
        from drone import *
        for i in range(13):
            move()
      `,
      feedback: { short: "Todavía son demasiadas líneas. Deja que el bucle haga todo el trabajo." },
    },
  },

  "d-5": {
    title: "Distancia desconocida",
    story: "La tormenta de nieve mueve sin parar las placas de hielo. Nadie sabe a qué distancia está hoy la base de carga: Lumo tiene que darse cuenta solo.",
    intro: `
<p>Lumo tiene <b>sensores</b>. Responden preguntas con <code>True</code> o <code>False</code>.
<code>at_goal()</code> es <code>True</code> cuando Lumo está en la base de carga:</p>

<pre><code>from drone import *

print(at_goal())   # False: Lumo todavía está en el punto de partida</code></pre>

<p>Con <code>while</code>, Lumo repite algo <b>mientras</b> una condición sea verdadera. Y
<code>not</code> le da la vuelta a <code>True</code> y <code>False</code>: <code>not at_goal()</code>
significa «todavía no está en la meta».</p>`,
    taskHtml:
      "El recorrido tiene una <b>longitud distinta</b> en cada misión. Lleva a Lumo a la base de carga ⚡ con un <b>bucle <code>while</code></b> y <code>at_goal()</code>, esté a la distancia que esté.",
    hints: [
      "<code>while not at_goal():</code> significa «mientras Lumo todavía no esté en la meta».",
      "Debajo, con sangría, solo va <code>move()</code>.",
    ],
    starterCode: py`
      from drone import *

      # ¿A qué distancia está la base de carga? Lumo no lo sabe…
      move()
    `,
    solution: py`
      from drone import *

      while not at_goal():
          move()
    `,
    expert: {
      html: "<p><b>Reto extra:</b> Haz que Lumo <b>vaya contando</b> por el camino y que al final muestre cuántas casillas ha volado.</p>",
      solution: py`
        from drone import *

        casillas = 0
        while not at_goal():
            move()
            casillas += 1
        print("Casillas voladas:", casillas)
      `,
      feedback: { count: "Al final, muestra cuántas casillas ha volado Lumo. Cuenta dentro del bucle con <code>casillas += 1</code>." },
    },
  },

  "d-6": {
    title: "Rastro de cristales",
    story: "Después de la tormenta hay cristales repartidos por el recorrido, cada vez en otro sitio. Lumo no debe pasar ninguno por alto.",
    intro: `
<p>Con <code>if</code>, Lumo toma decisiones por el camino. <code>on_crystal()</code> es
<code>True</code> cuando debajo de Lumo hay un cristal:</p>

<pre><code>from drone import *

if on_crystal():
    collect()
print("¿Hay un cristal debajo de mí?", on_crystal())</code></pre>

<p>Si pones la decisión <b>dentro</b> de un bucle, Lumo revisa cada casilla por la que pasa.</p>`,
    taskHtml: "En el recorrido hay cristales, cada vez en otro sitio. Recoge <b>todos</b> y vuela hasta la base de carga ⚡.",
    hints: [
      "Dentro del bucle <code>while</code>: primero comprueba si hay un cristal y después avanza una casilla.",
      "<code>while not at_goal():</code>, debajo <code>if on_crystal():</code> con <code>collect()</code> y después <code>move()</code>.",
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
      html: "<p><b>Reto extra:</b> Cuenta los cristales y muestra al final cuántos ha recogido Lumo.</p>",
      solution: py`
        from drone import *

        cristales = 0
        while not at_goal():
            if on_crystal():
                collect()
                cristales += 1
            move()
        print("Cristales:", cristales)
      `,
      feedback: { count: "Al final, muestra el número de cristales recogidos. Cuenta justo después de <code>collect()</code>." },
    },
  },

  "d-7": {
    title: "Hacia la derecha",
    story: "Una escalera de bloques de hielo sube hacia la derecha. Pero Lumo solo sabe girar a la izquierda… ¿o no?",
    intro: `
<p>¡Girar tres veces a la izquierda es lo mismo que girar una vez a la derecha! En lugar de escribir tres líneas
cada vez, te construyes un <b>comando propio</b>:</p>

<pre><code>from drone import *

def turn_right():
    turn_left()
    turn_left()
    turn_left()

turn_right()</code></pre>

<p>A partir de ahora, Python conoce <code>turn_right()</code> igual de bien que los comandos incorporados.</p>`,
    taskHtml:
      "Construye el comando <code>turn_right()</code> con <code>def</code> y haz subir a Lumo por la escalera de hielo hasta la base de carga ⚡. Lo mejor es ir escalón a escalón con un bucle.",
    hints: [
      "Un escalón es: <code>move()</code>, <code>turn_left()</code>, <code>move()</code>, <code>turn_right()</code>.",
      "Son cuatro escalones y después un <code>move()</code> más: <code>for i in range(4):</code>",
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          # tres veces a la izquierda es una vez a la derecha
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
    feedback: { useDef: "Has construido el comando, pero todavía no lo has usado. Llama a <code>turn_right()</code> donde Lumo tenga que girar a la derecha." },
    expert: {
      html: "<p><b>Reto extra:</b> Construye un segundo comando, <code>escalon()</code>, que vuele un escalón entero, y llámalo dentro de un bucle.</p>",
      solution: py`
        from drone import *

        def turn_right():
            turn_left()
            turn_left()
            turn_left()

        def escalon():
            move()
            turn_left()
            move()
            turn_right()

        for i in range(4):
            escalon()
        move()
      `,
      feedback: { twoDefs: "Además de <code>turn_right()</code>, construye un segundo comando, por ejemplo <code>def escalon():</code>." },
    },
  },

  "d-8": {
    title: "Espiral",
    story: "Un pasillo se enrosca como una espiral hacia el interior de una vieja cueva de hielo. Cada cueva es distinta, así que Lumo tiene que decidir solo cuándo girar.",
    intro: `
<p><code>front_clear()</code> es <code>True</code> cuando delante de Lumo está libre. Con <code>if</code> y
<code>else</code>, Lumo vuelve a decidir en cada paso:</p>

<pre><code>from drone import *

if front_clear():
    move()
else:
    turn_left()</code></pre>`,
    taskHtml:
      "El pasillo se enrosca hacia dentro como una espiral, y cada espiral es distinta. Deja que Lumo encuentre solo el camino hasta la base de carga ⚡ con <code>while</code>, <code>if</code> y <code>else</code>.",
    hints: [
      "Mientras Lumo no esté en la meta: si delante está libre, Lumo sigue volando; si no, gira a la izquierda.",
      "<code>while not at_goal():</code>, dentro <code>if front_clear():</code> con <code>move()</code> y <code>else:</code> con <code>turn_left()</code>.",
    ],
    starterCode: py`
      from drone import *

      # Lumo debe decidir solo: ¿seguir volando o girar?
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
    title: "Rescate en el laberinto",
    story: "Una tormenta de nieve ha arrastrado a Lumo hasta un laberinto de hielo, y no hay dos iguales. Solo un programa inteligente puede traer a Lumo de vuelta a casa.",
    intro: `
<p>Un viejo truco para laberintos: <b>mantén siempre la mano derecha en la pared.</b> Quien lo hace
encuentra con seguridad la salida en laberintos como estos. Para Lumo, eso significa en cada paso:</p>
<ul>
<li>primero girar a la derecha,</li>
<li>después girar a la izquierda mientras delante haya una pared,</li>
<li>y luego volar una casilla.</li>
</ul>
<p>Un bucle <b>dentro</b> de otro bucle, y Lumo ya tiene un plan.</p>`,
    taskHtml:
      "Escribe un programa con el que Lumo encuentre el camino hasta la base de carga ⚡ desde <b>cualquier</b> laberinto. Se prueba con laberintos que tú no ves.",
    hints: [
      "Necesitas <code>turn_right()</code> de «Hacia la derecha»: el código inicial ya lo trae.",
      "Por fuera, <code>while not at_goal():</code>; dentro, <code>turn_right()</code>, después <code>while not front_clear():</code> con <code>turn_left()</code> y luego <code>move()</code>.",
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          turn_left()
          turn_left()
          turn_left()

      # Mano derecha en la pared…
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

  // ================================================================== CAZA DE GLITCHES
  "g-1": {
    title: "Silencio de radio",
    story: "Un viejo programa de bienvenida de la tripulación debería saludar a las visitas por su nombre. En lugar de eso, solo da glitches.",
    intro: `
<p>¡Te damos la bienvenida a la <b>caza de glitches</b>! Aquí no escribes un programa nuevo, sino que
reparas uno roto. Así lo hacen los profesionales:</p>
<ul>
<li>Ejecuta el programa y lee con calma la tarjeta de error.</li>
<li>Haz clic en «Línea …»: ahí está el atasco.</li>
<li>Arregla un error y vuelve a ejecutar. Muchas veces, después aparece el siguiente.</li>
</ul>`,
    taskHtml:
      "Repara el programa: debe preguntar el nombre y después mostrar <b>dos líneas</b>, un saludo con el nombre y «¡Te damos la bienvenida a bordo!».",
    hints: [
      "Python distingue entre mayúsculas y minúsculas: <code>nombre</code> y <code>Nombre</code> son dos nombres distintos.",
      "En la última línea falta una comilla antes del paréntesis.",
    ],
    starterCode: py`
      nombre = input("¿Cómo te llamas? ")
      print("¡Hola, " + Nombre + "!")
      print("¡Te damos la bienvenida a bordo!)
    `,
    solution: py`
      nombre = input("¿Cómo te llamas? ")
      print("¡Hola, " + nombre + "!")
      print("¡Te damos la bienvenida a bordo!")
    `,
    feedback: { greet: "El saludo debe contener el nombre que se escribió, y después debe aparecer «¡Te damos la bienvenida a bordo!»." },
  },

  "g-2": {
    title: "Error de cálculo",
    story: "La calculadora de edad de la estación solo tiene que calcular cuántos años tendrás dentro de diez años. Pero falla con cada número que le escribes.",
    intro: `
<p>Este glitch es un clásico: <code>input()</code> siempre devuelve <b>texto</b>, aunque alguien
escriba un número. Y un texto y un número no se pueden sumar así sin más.</p>
<pre><code>print(int("12") + 10)
print("Edad: " + str(22))</code></pre>
<p><code>int(…)</code> convierte un texto en número, y <code>str(…)</code> convierte un número en texto.</p>`,
    taskHtml: "Repara la calculadora: para <b>cualquier</b> edad, debe calcular bien cuántos años se tendrán dentro de diez años.",
    hints: [
      "La primera tarjeta de error señala el cálculo: texto + número no funciona. Convierte la respuesta con <code>int(…)</code>.",
      "Después se atasca al mostrar el resultado: texto + número otra vez no encaja. <code>str(…)</code> o un f-string te ayudan.",
    ],
    starterCode: py`
      edad = input("¿Cuántos años tienes? ")
      edad_futura = edad + 10
      print("Dentro de diez años tendrás " + edad_futura + " años.")
    `,
    solution: py`
      edad = int(input("¿Cuántos años tienes? "))
      edad_futura = edad + 10
      print(f"Dentro de diez años tendrás {edad_futura} años.")
    `,
    feedback: { math: "El programa funciona, pero todavía no calcula bien para cualquier edad. Con 12 debe salir 22, y con 30, 40." },
  },

  "g-3": {
    title: "Cuenta atrás sin fin",
    story: "La rampa de salida cuenta hacia atrás… y nunca termina. El rover lleva años esperando su «¡Despegue!».",
    intro: `
<p>Algunos glitches no producen ningún mensaje de error: el programa simplemente sigue <b>sin fin</b>.
Tranquilidad: PyQuest lo detiene al cabo de un rato. Entonces vale la pena preguntarse qué tendría que
cambiar dentro del bucle para que, en algún momento, la condición sea <code>False</code>.</p>`,
    taskHtml: "Repara la cuenta atrás: debe mostrar <b>5, 4, 3, 2, 1</b> y después «¡Despegue!», y luego parar de verdad.",
    hints: [
      "Ejecuta el programa una vez, sin miedo. ¿Por qué no termina nunca el bucle?",
      "Dentro del bucle, <code>numero</code> tiene que hacerse más pequeño: <code>numero = numero - 1</code>, con sangría, después del <code>print</code>.",
    ],
    starterCode: py`
      numero = 5
      while numero > 0:
          print(numero)
      print("¡Despegue!")
    `,
    solution: py`
      numero = 5
      while numero > 0:
          print(numero)
          numero = numero - 1
      print("¡Despegue!")
    `,
    feedback: { countdown: "La cuenta atrás debe contar exactamente 5, 4, 3, 2, 1 y después mostrar una vez «¡Despegue!»." },
  },

  "g-4": {
    title: "Lista descolocada",
    story: "La lista del almacén del laboratorio se corta siempre antes de terminar. En algún sitio, el programa cuenta mal.",
    intro: `
<p>En este programa se esconden dos glitches. El primero impide que llegue siquiera a arrancar. El segundo
solo aparece al ejecutarlo y tiene que ver con las <b>posiciones</b> de una lista: la primera
posición es 0 y la última es <code>len(lista) - 1</code>.</p>`,
    taskHtml: "Repara la lista del almacén: cada provisión debe aparecer en su propia línea y, al final, la cantidad.",
    hints: [
      "Cuenta los paréntesis de la última línea.",
      "<code>range(len(provisiones))</code> cuenta justo las posiciones de la lista, sin <code>+ 1</code>.",
    ],
    starterCode: py`
      provisiones = ["Hielo", "Cristales", "Baterías", "Galletas"]
      for i in range(len(provisiones) + 1):
          print("En el almacén:", provisiones[i])
      print("Cantidad:", len(provisiones)
    `,
    solution: py`
      provisiones = ["Hielo", "Cristales", "Baterías", "Galletas"]
      for i in range(len(provisiones)):
          print("En el almacén:", provisiones[i])
      print("Cantidad:", len(provisiones))
    `,
    feedback: { list: "Deben aparecer exactamente cuatro provisiones, cada una en su propia línea, y después la cantidad 4." },
  },

  "g-5": {
    title: "El return olvidado",
    story: "La calculadora de energía de la sala de control muestra un número, pero después sigue calculando con… nada. ¡Un glitch de manual!",
    intro: `
<p>Una función puede <b>mostrar</b> algo (<code>print</code>) o <b>devolver</b> algo
(<code>return</code>). No es lo mismo: el programa solo puede seguir usando lo que se devuelve.
Sin <code>return</code>, una función devuelve <code>None</code>, es decir, «nada».</p>`,
    taskHtml:
      "Repara la función <code>doble</code>: debe <b>devolver</b> su resultado para que el programa pueda seguir calculando con él. Al final debe aparecer «Energía total: 50».",
    hints: [
      "La tarjeta de error dice que <code>None</code> más un número no funciona. O sea, la función no devuelve nada.",
      "Dentro de la función, cambia <code>print(resultado)</code> por <code>return resultado</code>.",
    ],
    starterCode: py`
      def doble(numero):
          resultado = numero * 2
          print(resultado)

      energia = doble(21)
      print("Energía total:", energia + 8)
    `,
    solution: py`
      def doble(numero):
          resultado = numero * 2
          return resultado

      energia = doble(21)
      print("Energía total:", energia + 8)
    `,
    feedback: {
      double: "La función debe devolver el doble, es decir, 14 si recibe 7.",
      fifty: "Al final debe aparecer «Energía total: 50».",
    },
  },
};
