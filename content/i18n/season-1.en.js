// Codaluna – Übersetzung des Kurses "season-1": English.
// Überschreibt nur Texte und Code der deutschen Basis (content/courses/season-1.js).

import { py } from "../lib/check-kit.js";

export default {
  chapters: {
    c1: "First commands",
    c2: "Decisions & loops",
    c3: "Collections & your own commands",
    c4: "Putting it all together",
    d1: "Steering Lumo across the ice",
    g1: "Repairing broken programs",
  },
  regions: {
    c1: {
      name: "Radio room",
      intro: "The radio room is dark. If the station is going to speak again, it needs commands, and you're the one who writes them.",
      outro: "The station is talking, calculating and asking questions again. Lumo does a happy lap of the room.",
    },
    c2: {
      name: "Hangar",
      intro: "Doors, rovers and signal lamps are waiting in the hangar. To make their own decisions and repeat things, they need conditions and loops.",
      outro: "The hangar gate opens, and outside the ice is glittering. From now on Lumo can fly missions outside, too.",
    },
    c3: {
      name: "Lab",
      intro: "Supplies, samples and notes are lying all over the lab. Lists, dictionaries and your own commands will bring some order to it.",
      outro: "Everything is in its place, and the on-board AI recognises you as a crew member.",
    },
    c4: {
      name: "Control room",
      intro: "All the station's systems come together in the control room. This is where you show what you can do: games, codes, pictures and real measurement data.",
      outro: "Station Polaris is shining again! From now on you'll build your own modules.",
    },
    d1: {
      name: "Ice field",
      intro: "The ice field lies just outside the station. Here you steer Lumo directly with Python, and every command is a flight manoeuvre.",
      outro: "Lumo now knows every corner of the ice field, and you've programmed a drone that finds its own way.",
    },
    g1: {
      name: "Maintenance shaft",
      intro: "Old crew programs are lying around in the maintenance shaft, full of glitches. Every one you repair gets the station a little further.",
      outro: "The maintenance shaft is clean. By now you find glitches faster than the on-board AI.",
    },
  },

  // ================================================================== CHAPTER 1
  "s1-l1": {
    title: "Hello, world!",
    story: "The station's radio has been silent for years. Send out the very first message, and make sure it sounds like you!",
    intro: `
<p>A program is a list of <b>commands</b> that the computer works through one after another.
Your very first command is <code>print()</code> – it writes something to the <b>console</b>
(the dark area below the editor).</p>

<p><b>Important: text needs quotation marks.</b> Anything Python should print <i>exactly as it is</i>
goes between quotation marks: <code>"…"</code>. A piece of text like this is called a
<b>string</b> (as in a string of characters). The quotation marks tell Python:
“This is text, not a command.”</p>

<pre><code>print("Hello, world!")</code></pre>

<p>If you left out the quotation marks (<code>print(Hello)</code>), Python would think
<code>Hello</code> is a name it ought to know – and report an error. By the way, the
quotation marks themselves are <b>not</b> printed.</p>

<p>Don't worry, you can't break anything here. Change the text and press
<b>Run</b> (or Ctrl + Enter).</p>`,
    taskHtml:
      "Change the text: print <b>your own message</b> – your motto, a greeting or your favourite saying. Remember the quotation marks!",
    hints: [
      'Write your text between the quotation marks: <code>print("…")</code>.',
      `For example: <code>print("Today I'm learning Python!")</code>`,
    ],
    starterCode: py`
      print("Hello, world!")
    `,
    solution: py`
      print("Today I'm learning Python!")
    `,
    expert: {
      html: `
<p>You can print <b>several things</b> by separating them with commas – Python automatically puts
a space between them: <code>print("Hello", "world")</code>. And <code>\\n</code> starts a new line
<i>inside</i> a piece of text.</p>
<p><b>Bonus:</b> Write one <code>print()</code> that prints several parts separated by commas and uses
<code>\\n</code> to spread over at least two lines.</p>`,
      solution: py`
        print("Hello", "world!", "\nGreat to have you here.")
      `,
      feedback: {
        printComma: 'Print several parts in <b>one</b> <code>print()</code>, separated by commas: <code>print("A", "B")</code>.',
        newline: "Use <code>\\n</code> inside a piece of text to start a new line.",
      },
    },
  },

  "s1-l2": {
    title: "Remembering with variables",
    story: "The station has lost its memory. Teach it to remember things, starting with your favourite number.",
    intro: `
<p>A <b>variable</b> is a container with a name. With the equals sign
<code>=</code> you put something into it (this is called “assigning”). After that you can use
the name to get the value back.</p>

<pre><code>favourite_number = 7
print(favourite_number)</code></pre>

<p>The <b>name</b> goes on the left of the <code>=</code>, the <b>value</b> on the right. Here
<code>=</code> means “gets the value” – not “is equal to” like in maths.</p>

<p><b>Number or text?</b> You write numbers <i>without</i> quotation marks (<code>7</code>).
And to print the <i>variable</i>, its name goes into the brackets <b>without</b> quotation marks:
<code>print(favourite_number)</code> prints <code>7</code>. <code>print("favourite_number")</code>,
on the other hand, would simply print the word.</p>`,
    taskHtml:
      "Store your <b>favourite number</b> in the variable and print it with <code>print()</code> – using the variable's name without quotation marks!",
    hints: ["First assign it: <code>favourite_number = 42</code>", "Then print it: <code>print(favourite_number)</code>"],
    starterCode: py`
      favourite_number = 0
      # Put in your favourite number and print it
    `,
    solution: py`
      favourite_number = 42
      print(favourite_number)
    `,
    feedback: {
      printName:
        "Print the <b>variable</b>: its name goes into the brackets <b>without</b> quotation marks, so <code>print(favourite_number)</code>.",
      needNumber: "Store a <b>number</b> – without quotation marks, for example <code>favourite_number = 7</code>.",
    },
    expert: {
      html: `
<p>A variable can <b>change</b>. <code>points = points + 50</code> takes the old value,
adds 50 and puts the result back into the same container. Names may contain letters,
digits and <code>_</code>, but they can't start with a digit.</p>
<p><b>Bonus:</b> Create <code>points = 100</code>, then increase the value by 50 and print it.</p>`,
      solution: py`
        points = 100
        points = points + 50
        print(points)
      `,
      feedback: {
        selfUpdate: "Increase the value with <code>points = points + 50</code> (or, for short, <code>points += 50</code>).",
        result150: "At the end, 150 should be printed.",
      },
    },
  },

  "s1-l3": {
    title: "The savings calculator",
    story: "An old sum from the crew is still stuck in the on-board computer. Show it that the station can calculate again.",
    intro: `
<p>Python makes a great calculator. You can do sums with <code>+</code> (plus),
<code>-</code> (minus), <code>*</code> (times) and <code>/</code> (divided by) – so you use
<code>*</code> instead of “×” and <code>/</code> instead of “÷”.</p>

<p><b>Important:</b> write numbers without quotation marks. Otherwise Python treats them as
text and doesn't calculate (<code>"5" + "3"</code> would give <code>"53"</code> instead of <code>8</code>!).</p>

<pre><code>per_week = 5
weeks = 8
print(per_week * weeks)</code></pre>

<p>The great thing about variables: if a value changes, the program automatically works it out again.
Mia puts aside some pocket money every week. Calculate with her variables.</p>`,
    taskHtml:
      "How much has Mia saved after <b>8 weeks</b> if she puts aside <b>€5</b> a week? Calculate with the two variables and print the result. (To check: it's 40.)",
    hints: ["You multiply with <code>*</code>.", "<code>print(per_week * weeks)</code>"],
    starterCode: py`
      per_week = 5
      weeks = 8
      # Work out the savings and print them
    `,
    solution: py`
      per_week = 5
      weeks = 8
      print(per_week * weeks)
    `,
    feedback: {
      needMult: "Let Python do the maths: you multiply with <code>*</code>.",
      useVars:
        "Calculate with the <b>variables</b> instead of fixed numbers: <code>per_week * weeks</code>. That way the result is still right if a value changes.",
      result40: "The result should be 40. Check your calculation.",
    },
    expert: {
      html: `
<p>After how many <b>whole</b> weeks will Mia have €100? The operator <code>//</code>
divides and chops off everything after the decimal point (<code>100 // 5</code> gives 20).</p>
<p><b>Bonus:</b> Create <code>goal = 100</code> and use <code>//</code> to work out how many weeks
Mia needs.</p>`,
      solution: py`
        per_week = 5
        goal = 100
        print(goal // per_week, "weeks")
      `,
      feedback: {
        floorDiv: "Use <code>//</code> to divide without a remainder: <code>goal // per_week</code>.",
        result20: "The answer should be 20 weeks.",
      },
    },
  },

  "s1-l4": {
    title: "Crazy stories",
    story: "The radio is only picking up scraps of words: an animal, a place. Turn them into the craziest radio message on the ice moon.",
    intro: `
<p>How do you get the contents of a variable <i>into</i> a piece of text? A normal string
prints everything exactly as written: <code>print("I like animal")</code> really prints “I like animal”.
The solution is an <b>f-string</b>: put an <code>f</code> right in front of the quotation mark and
write the variable in curly brackets <code>{ }</code>.</p>

<pre><code>animal = "cat"
print(f"A {animal} is learning Python!")</code></pre>

<p>The <code>f</code> stands for “format”. Only the names inside <code>{ }</code> are replaced by
their value; the rest stays normal text. With this you can build sentences, stories or
profiles in no time.</p>`,
    taskHtml:
      "Use an <b>f-string</b> to write a crazy sentence that includes <code>animal</code> and <code>place</code>.",
    hints: [
      `Start with <code>print(f"...")</code> – don't forget the <code>f</code>!`,
      "Put the variables in curly brackets: <code>{animal}</code> and <code>{place}</code>.",
    ],
    starterCode: py`
      animal = "cat"
      place = "moon"
      # Build a funny sentence with an f-string
    `,
    solution: py`
      animal = "cat"
      place = "moon"
      print(f"A {animal} is dancing on the {place}!")
    `,
    feedback: {
      twoFields: "Put <b>both</b> variables in curly brackets in your f-string: <code>{animal}</code> and <code>{place}</code>.",
      valuesInOutput:
        "The output should contain the values of <code>animal</code> and <code>place</code> – use an f-string with curly brackets.",
    },
    expert: {
      html: `
<p>You can even <b>do maths</b> inside the <code>{ }</code>: <code>print(f"{3 * 4} goals")</code>
prints “12 goals”.</p>
<p><b>Bonus:</b> Create <code>wins = 5</code> and use an f-string to print how many points
that is (3 points per win) – calculated <i>inside</i> the curly brackets.</p>`,
      solution: py`
        wins = 5
        print(f"{wins} wins are worth {wins * 3} points!")
      `,
      feedback: {
        calcInBraces: "Do the calculation right inside the curly brackets: <code>{wins * 3}</code>.",
        result15: "5 wins should give you 15 points.",
      },
    },
  },

  "s1-l5": {
    title: "Talk to the computer",
    story: "The station wants to know who it's dealing with. Let it ask for your name and then greet you.",
    intro: `
<p><code>input()</code> pauses your program, shows a question and waits until you type
something and press Enter. It's best to store the answer in a variable.</p>

<pre><code>name = input("What's your name? ")
print("Hello " + name)</code></pre>

<p>The text in the brackets is the question (the “prompt”). With <code>+</code> you can
<b>glue</b> two pieces of text together – watch out for the space in <code>"Hello "</code>.</p>

<p><b>Remember:</b> <code>input()</code> <i>always</i> gives you text – even if you type in a
number. You'll learn how to turn it into a real number in Chapter 2.</p>`,
    taskHtml:
      "Ask for the name and then print a <b>personal greeting</b> that includes the name. When you run the program, an input box appears down in the console.",
    hints: ["The answer is stored in the variable <code>name</code>.", 'Glue it together: <code>print("Hello " + name)</code>'],
    starterCode: py`
      name = input("What's your name? ")
      # Greet the person personally
    `,
    solution: py`
      name = input("What's your name? ")
      print("Welcome, " + name + "!")
    `,
    feedback: {
      nameInGreeting:
        'The greeting should include the name that was typed in: <code>print("Hello " + name)</code> – with <code>name</code> outside the quotation marks.',
    },
    expert: {
      html: `
<p><b>Bonus:</b> Ask for <b>two</b> things (for example a name and a home town) and put the
answers together into one sentence with an <b>f-string</b> – that reads more nicely than
<code>+</code>.</p>`,
      solution: py`
        name = input("Name: ")
        town = input("Where do you live? ")
        print(f"{name} from {town} – cool!")
      `,
      feedback: { bothInSentence: "Both answers should appear in your sentence." },
    },
  },

  "s1-boss1": {
    title: "Your profile generator",
    story: "The security airlock only lets crew members with an ID through. Build a profile generator so the station can get to know you.",
    intro: `
<p>Time to bring it all together! You ask a few questions and turn the answers into a smart
profile card. For this you need <code>input()</code> (asking), variables (remembering) and
f-strings (printing).</p>

<pre><code>name = input("Name: ")
print(f"Name: {name}")</code></pre>

<p>Tip: start with one question, test it, and then add more step by step.</p>`,
    taskHtml:
      "Ask for at least <b>three</b> things with <code>input()</code> and print a <b>profile</b> that includes all the answers – using f-strings.",
    hints: [
      'Add another <code>input(…)</code> below, for example <code>animal = input("Favourite animal: ")</code>.',
      'One line for each answer: <code>print(f"Name: {name}")</code>',
    ],
    starterCode: py`
      name = input("Name: ")
      hobby = input("Favourite hobby: ")
      # Ask one more thing and print a profile with f-strings
    `,
    solution: py`
      name = input("Name: ")
      hobby = input("Favourite hobby: ")
      animal = input("Favourite animal: ")
      print("--- PROFILE ---")
      print(f"Name:   {name}")
      print(f"Hobby:  {hobby}")
      print(f"Animal: {animal}")
    `,
    feedback: {
      allAnswers: "<b>All</b> the answers should appear in the profile. Print each variable with an f-string.",
    },
    expert: {
      html: `
<p>Make the card look even better: a border made of characters really stands out. <code>"=" * 20</code>
creates a line of 20 equals signs.</p>
<p><b>Bonus:</b> Put a line like this above and below your profile (at least 10 characters long).</p>`,
      solution: py`
        name = input("Name: ")
        hobby = input("Favourite hobby: ")
        animal = input("Favourite animal: ")
        print("=" * 24)
        print(f"  PROFILE: {name}")
        print(f"  Hobby: {hobby} · Animal: {animal}")
        print("=" * 24)
      `,
      feedback: { frame: 'Print a line above and below the profile, for example <code>print("=" * 20)</code>.' },
    },
  },

  // ================================================================== CHAPTER 2
  "s2-l1": {
    title: "If … then …",
    story: "The hangar door only opens if there are enough energy points. Teach it to say no in a friendly way, too.",
    intro: `
<p>Programs have to make <b>decisions</b>. With <code>if</code> you check a condition:
if it's true, the indented block below it runs. <code>else</code> takes care of the other case.</p>

<pre><code>points = 120
if points &gt;= 100:
    print("Level complete!")
else:
    print("Almost! Keep going.")</code></pre>

<p><b>Python is strict about two rules:</b> after the condition comes a <b>colon</b>
<code>:</code>, and the lines that belong to it are <b>indented</b> (4 spaces – the
Tab key does that for you).</p>

<p>You can compare with <code>==</code> (equal to), <code>!=</code> (not equal to),
<code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> and <code>&gt;=</code>.
Careful: <code>==</code> asks “is it equal?”, while <code>=</code> assigns a value.</p>

<p><b>New: entering numbers.</b> <code>input()</code> always gives you text. With <code>int(…)</code>
you turn it into a whole number that Python can compare and calculate with:</p>
<pre><code>points = int(input("How many points? "))</code></pre>`,
    taskHtml:
      "Add an <code>else</code> block that prints an encouraging message when there are <b>fewer than 100</b> points. Test your program with 120 and with 50.",
    hints: [
      "<code>else:</code> starts just as far to the left as the <code>if</code> – and it has a colon.",
      'Indent the line below it: <code>    print("Almost! Keep practising!")</code>',
    ],
    starterCode: py`
      points = int(input("How many points do you have? "))
      if points >= 100:
          print("Level complete! 🎉")
      # Add the else case here
    `,
    solution: py`
      points = int(input("How many points do you have? "))
      if points >= 100:
          print("Level complete! 🎉")
      else:
          print("Almost! Keep practising!")
    `,
    feedback: {
      noElseOutput: "With 50 points nothing appears yet. Print a message in the <code>else</code> block.",
      sameOutput: "With 120 and with 50 points you get the same output. The <code>else</code> block should print a different message.",
      boundary: "With exactly 100 points the level is complete – leave the condition <code>points &gt;= 100</code> as it is.",
    },
    expert: {
      html: `
<p>For more than two cases there's <code>elif</code> (short for “else if”). Python checks the
conditions from top to bottom and takes the first one that's true.</p>
<p><b>Bonus:</b> Build three levels: from 100 points “Level complete”, from 50 points
“Almost there”, otherwise “Keep practising”.</p>`,
      solution: py`
        points = int(input("How many points do you have? "))
        if points >= 100:
            print("Level complete! 🎉")
        elif points >= 50:
            print("Almost there!")
        else:
            print("Keep practising!")
      `,
      feedback: { threeCases: "With 120, 70 and 10 points, something different should appear each time." },
    },
  },

  "s2-l2": {
    title: "True or false?",
    story: "The sensors in the hangar only report True or False now. Test whether you understand their language.",
    intro: `
<p>Every comparison has a result: <code>True</code> or <code>False</code>.
This is called a <b>Boolean</b> value (a <i>truth value</i>). It's exactly what
<code>if</code> uses to make its decision.</p>

<pre><code>print(10 &gt; 3)    # True
print(5 == 6)   # False</code></pre>

<p>Everything after a <code>#</code> is a <b>comment</b> – a note for humans that Python
skips.</p>`,
    taskHtml:
      "Print the results of <b>at least three different comparisons</b>. At least one of them should come out as <code>False</code>.",
    hints: [
      "Print comparisons directly: <code>print(7 &gt; 2)</code>",
      "For <code>False</code>, for example: <code>print(5 == 6)</code>",
    ],
    starterCode: py`
      # Let Python check at least three comparisons
      print(10 > 3)
    `,
    solution: py`
      print(10 > 3)
      print(5 == 5)
      print("apple" == "pear")
    `,
    feedback: {
      threeCompares: "You need at least three comparisons, for example with <code>&gt;</code>, <code>&lt;</code> and <code>==</code>.",
      printResults: "Print the result of each comparison with <code>print(…)</code>.",
      needFalse: "At least one comparison should come out as <code>False</code>, for example <code>print(5 == 6)</code>.",
    },
    expert: {
      html: `
<p>You can <b>combine</b> conditions: <code>and</code> (both must be true),
<code>or</code> (at least one must be true) and <code>not</code> (flips the result).</p>
<p><b>Bonus:</b> Create <code>age = 12</code> and use <code>and</code> to check whether the age
is between 10 and 15. Print the result.</p>`,
      solution: py`
        age = 12
        print(age >= 10 and age <= 15)
      `,
      feedback: {
        useAnd: "Combine the two comparisons with <code>and</code>: <code>age &gt;= 10 and age &lt;= 15</code>.",
        printBool: "Print the result (<code>True</code> or <code>False</code>) with <code>print(…)</code>.",
      },
    },
  },

  "s2-l3": {
    title: "Leave it to chance",
    story: "The crew's rover game is missing its dice. Lumo would love one that's truly random.",
    intro: `
<p>Chance makes games exciting. Python comes with ready-made tools in <b>modules</b> – you
bring them in with <code>import</code>. The <code>random</code> module can roll dice.</p>

<pre><code>import random
number = random.randint(1, 6)
print("You rolled:", number)</code></pre>

<p><code>random.randint(1, 6)</code> gives you a random whole number from 1 to 6 (both ends
included). You write <code>import random</code> once, right at the top of your program.
With a comma you can mix text and numbers in <code>print</code>.</p>`,
    taskHtml: "Build a <b>dice roller</b>: print a random number from 1 to 6. Run the program several times!",
    hints: [
      "<code>import random</code> is already right at the top.",
      "<code>number = random.randint(1, 6)</code> and then <code>print(number)</code>.",
    ],
    starterCode: py`
      import random
      # Roll a number from 1 to 6 and print it
    `,
    solution: py`
      import random
      number = random.randint(1, 6)
      print("You rolled:", number)
    `,
    feedback: {
      useRandint: "Use <code>random.randint(1, 6)</code> to get a random number.",
      range16: "The number you roll should be between 1 and 6 and come at the end of the output.",
      notRandom: "The number is the same every time. Print the result of <code>random.randint(1, 6)</code>.",
    },
    expert: {
      html: `
<p>With <code>random.choice([...])</code> you pick something at random <b>from a list</b> –
perfect for a prize wheel.</p>
<p><b>Bonus:</b> Build a prize wheel with at least <b>four</b> prizes of your own.</p>`,
      solution: py`
        import random
        prizes = ["Nothing 😅", "An ice cream", "5 points", "Wild card", "Jackpot!"]
        print("You win:", random.choice(prizes))
      `,
      feedback: {
        useChoice: "Use <code>random.choice(prizes)</code> to draw a random prize.",
        fourPrizes: 'Your list needs at least four prizes: <code>["A", "B", "C", "D"]</code>.',
        notRandom: "The result is the same every time. Print what <code>random.choice(…)</code> draws.",
      },
    },
  },

  "s2-l4": {
    title: "Repeat the beat",
    story: "The speakers in the hangar are crackling again. Time for the first beat in years. Make it repeat!",
    intro: `
<p>Instead of copying a line four times, you let it <b>repeat</b>. That's what the
<code>for</code> loop does:</p>

<pre><code>for i in range(4):
    print("Boom - clap")</code></pre>

<p><code>range(4)</code> counts <code>0, 1, 2, 3</code> – so that's four rounds. The variable
<code>i</code> is the current counter. The same rules apply here: a <b>colon</b> at the end, and the
repeated part is <b>indented</b>.</p>

<p><b>The station's speaker lets you actually hear your beat.</b> For that, bring in <code>drum</code>
(the drum kit) and <code>note</code> (musical notes) from the <code>station</code> module:</p>

<pre><code>from station import drum, note

for i in range(4):
    drum("kick")
    drum("snare")
note("C5", 2)</code></pre>

<p>Drums: <code>"kick"</code>, <code>"snare"</code>, <code>"hihat"</code>, <code>"clap"</code>,
<code>"tom"</code>. Notes: <code>"C4"</code>, <code>"D4"</code>, <code>"E4"</code> … or
<code>"do4"</code>, <code>"re4"</code>, <code>"mi4"</code> … The number after the comma is how long
the sound lasts, in beats (no number means one beat).</p>`,
    taskHtml:
      "Build a <b>beat</b> with a <b><code>for</code> loop</b> that repeats <b>at least three times</b> – so you can hear it with <code>drum()</code> or <code>note()</code>, or as text with <code>print()</code>. The command appears only once in your code – the loop repeats it.",
    hints: [
      '<code>for i in range(4):</code> and below it, indented, <code>drum("kick")</code> or <code>print(…)</code>.',
      "For the sound, <code>from station import drum, note</code> goes right at the top – it's already there.",
    ],
    starterCode: py`
      from station import drum, note

      # Build your beat with a for loop
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
    feedback: {
      useRange: "Use <code>range(…)</code>, for example <code>for i in range(4):</code>.",
      printInLoop:
        "The command (<code>drum</code>, <code>note</code> or <code>print</code>) has to be <b>indented</b> below the <code>for</code> line so that it gets repeated.",
      threeTimes: "Your beat should play at least three times (or make at least three lines). Count higher with <code>range(…)</code>.",
    },
    expert: {
      html: `
<p>The counter <code>i</code> is handy: you can use it to number your output.
<code>range(1, 6)</code> counts from 1 to 5.</p>
<p><b>Bonus:</b> Use a loop to print “Round 1” to “Round 5”.</p>`,
      solution: py`
        for i in range(1, 6):
            print(f"Round {i}")
      `,
      feedback: {
        numbered: 'The lines should be numbered from 1 to 5: <code>print(f"Round {i}")</code> with <code>range(1, 6)</code>.',
      },
    },
  },

  "s2-l5": {
    title: "Painting patterns",
    story: "The signal lamps on the hangar gate should show a pattern that grows. Right now every row lights up the same, and you can do better than that.",
    intro: `
<p>You can use <code>*</code> not just for maths but also to <b>repeat</b> text:
<code>"ab" * 3</code> gives <code>"ababab"</code>. Together with a loop and the
counter <code>i</code>, you can make patterns that grow.</p>

<pre><code>for i in range(1, 4):
    print("#" * i)</code></pre>

<p><code>range(1, 4)</code> counts from 1 to 3. So in the first round <code>i</code> is 1,
then 2, then 3 – and that's exactly how many characters end up in the line.</p>`,
    taskHtml:
      "The pattern below is still boring: every line is the same length. Change the program so that each line is <b>longer than the one before</b>. You can pick any symbol you like.",
    hints: [
      '<code>"#" * 3</code> gives <code>###</code>. So what does <code>"#" * i</code> give?',
      'Replace the fixed 3 with the counter: <code>print("⭐" * i)</code>',
    ],
    starterCode: py`
      # The pattern is still boring: every line is the same length.
      for i in range(1, 6):
          print("⭐" * 3)
    `,
    solution: py`
      for i in range(1, 6):
          print("⭐" * i)
    `,
    feedback: {
      grow: 'The lines are still all the same length. Let the length grow with the counter: <code>"⭐" * i</code>.',
    },
    expert: {
      html: `
<p>With spaces at the start of a line you can push a pattern to the right – that's how you make a
<b>pyramid</b>. Tip: <code>" " * (5 - i)</code> for the gap and <code>"*" * (2 * i - 1)</code>
for the stars.</p>
<p><b>Bonus:</b> Draw a pyramid with at least four lines that gets wider towards the bottom.</p>`,
      solution: py`
        for i in range(1, 6):
            print(" " * (5 - i) + "*" * (2 * i - 1))
      `,
      feedback: {
        indent: 'Each line should start with fewer spaces than the one before: <code>" " * (5 - i)</code>.',
        wider: "There should be more stars on each line than on the one before.",
      },
    },
  },

  "s2-l6": {
    title: "As long as …",
    story: "The rover is on the ramp, ready to launch. All it needs now is the countdown.",
    intro: `
<p>The <code>while</code> loop repeats something <b>as long as</b> a condition is true –
ideal when you don't know in advance how many times.</p>

<pre><code>number = 3
while number &gt; 0:
    print(number)
    number = number - 1
print("Go!")</code></pre>

<p><b>Really important:</b> something inside the loop has to change so that the condition
eventually becomes <code>False</code> – here <code>number</code> gets smaller. If that doesn't happen,
the loop runs <i>forever</i>. Don't panic: Codaluna notices and stops your program (or you
can press <b>Stop</b>).</p>`,
    taskHtml:
      "Run a <b>countdown from 10 to 1</b> with a <code>while</code> loop and then print <code>Lift-off! 🚀</code>.",
    hints: [
      "<code>while number &gt; 0:</code> – and below it, indented, <code>print(number)</code>.",
      "Make the number smaller inside the loop: <code>number = number - 1</code>. Otherwise it runs forever!",
    ],
    starterCode: py`
      number = 10
      # Count down from 10 to 1 with a while loop
      # and then print "Lift-off! 🚀"
    `,
    solution: py`
      number = 10
      while number > 0:
          print(number)
          number = number - 1
      print("Lift-off! 🚀")
    `,
    feedback: {
      countdown: "The output should count down from 10 to 1 – one number per line.",
      finalLine: "After the loop, print “Lift-off! 🚀” as well – <b>not</b> indented, so that it only appears once.",
    },
    expert: {
      html: `
<p>You can also <b>collect</b> something in a loop: a second variable grows with
every round.</p>
<p><b>Bonus:</b> Use a <code>while</code> loop to work out the sum of all the numbers from 1 to 10
and print it.</p>`,
      solution: py`
        number = 1
        total = 0
        while number <= 10:
            total = total + number
            number = number + 1
        print("Sum:", total)
      `,
      feedback: {
        accumulate: "You need two variables that change: the counter and the total (<code>total = total + number</code>).",
        result55: "The sum from 1 to 10 is 55. Does your loop go up to and including 10?",
      },
    },
  },

  "s2-boss2": {
    title: "Guess the number",
    story: "The hangar gate is locked with a number code, and the lock only says “too high” or “too low”. Build the game and crack the code!",
    intro: `
<p>The great classic! The computer thinks of a number and you guess – with the hints
“too high” or “too low” – until you get it. You need everything from this chapter:
<code>random</code>, <code>while</code>, <code>int(input())</code> and <code>if</code>/<code>elif</code>.</p>

<p>The loop <code>while guess != secret:</code> keeps running as long as the guess is <b>not</b> right.
The most important part is still missing inside it: the hints.</p>`,
    taskHtml:
      "Complete the game: inside the loop, it should print <b>“too high”</b> or <b>“too low”</b>, depending on the guess. When the guess is right, no hint appears. Then try it out yourself!",
    hints: [
      "<code>if guess &gt; secret:</code> → too high.",
      "<code>elif guess &lt; secret:</code> → too low. Both go inside the loop, indented, below the <code>input</code> line.",
    ],
    starterCode: py`
      import random
      secret = random.randint(1, 20)
      guess = 0

      while guess != secret:
          guess = int(input("Your number (1-20): "))
          # Give a hint here: too high or too low?

      print("Got it! 🎉")
    `,
    solution: py`
      import random
      secret = random.randint(1, 20)
      guess = 0

      while guess != secret:
          guess = int(input("Your number (1-20): "))
          if guess > secret:
              print("too high")
          elif guess < secret:
              print("too low")

      print("Got it! 🎉")
    `,
    feedback: {
      tooHigh: "If the guess is too big, no hint appears yet. Check with <code>if guess &gt; secret:</code>.",
      tooLow: "If the guess is too small, no hint appears yet. Check with <code>elif guess &lt; secret:</code>.",
      highLow: "Guesses that are too high and too low get the same hint. Print different hints.",
      winNoHint:
        "When the guess is right, there shouldn't be a “too high” or “too low”. Use <code>elif guess &lt; secret:</code> instead of <code>else:</code>.",
    },
    expert: {
      html: `
<p><b>Bonus:</b> Count the attempts and print at the end how many there were – for example
“Got it! Attempts: 3”. Tip: create <code>attempts = 0</code> before the loop and increase
it with every guess.</p>`,
      solution: py`
        import random
        secret = random.randint(1, 20)
        guess = 0
        attempts = 0

        while guess != secret:
            guess = int(input("Your number (1-20): "))
            attempts = attempts + 1
            if guess > secret:
                print("too high")
            elif guess < secret:
                print("too low")

        print(f"Got it! Attempts: {attempts} 🎉")
      `,
      feedback: {
        counter: "Increase a counter inside the loop: <code>attempts = attempts + 1</code>.",
        count3: "After the guesses 12, 3 and 7, the last line should show 3 attempts. Are you counting each guess exactly once?",
        count1: "If you guess right straight away, that's 1 attempt. Does your counter start at 0?",
      },
    },
  },

  // ================================================================== CHAPTER 3
  "s3-l1": {
    title: "Lists – your collection",
    story: "Everything in the lab is in a muddle. Start with a list: samples, music for the night shift, whatever you like.",
    intro: `
<p>A <b>list</b> keeps lots of values together in a single variable – a playlist,
a team, a packing list. You write it in square brackets <code>[ ]</code>, with the items
separated by commas.</p>

<pre><code>playlist = ["Song A", "Song B", "Song C"]
print(playlist)
print(playlist[0])   # the first item</code></pre>

<p>You get to single items through their <b>position</b> – and positions start at <code>0</code>!
<code>playlist[0]</code> is the first item, <code>playlist[1]</code> the second.</p>`,
    taskHtml:
      "Create a <b>list</b> (a playlist, a team, your favourite foods …) with at least 3 items. Print the whole list and then the <b>first</b> item on its own.",
    hints: [
      'Square brackets, items separated by commas: <code>food = ["Pizza", "Kebab", "Sushi"]</code>',
      "You get the first item with <code>food[0]</code>.",
    ],
    starterCode: py`
      # Create a list with at least 3 things
      # Print the list and then the first item
    `,
    solution: py`
      playlist = ["Song A", "Song B", "Song C"]
      print(playlist)
      print(playlist[0])
    `,
    feedback: {
      printList: "Print the whole list with <code>print(…)</code>.",
      printFirst: "Then print the first item on a line of its own. Positions start at 0: <code>my_list[0]</code>.",
    },
    expert: {
      html: `
<p><code>len(my_list)</code> tells you how many items a list contains. And with
<code>my_list[-1]</code> you reach in from the back – that's the last item.</p>
<p><b>Bonus:</b> Print how many items your list has, and its last item using <code>[-1]</code>.</p>`,
      solution: py`
        playlist = ["Song A", "Song B", "Song C"]
        print("Number of songs:", len(playlist))
        print("Last song:", playlist[-1])
      `,
      feedback: {
        useLen: "Use <code>len(my_list)</code> for the number of items.",
        useNeg: "You get the last item with <code>my_list[-1]</code>.",
        printBoth: "Print the number of items and the last item.",
      },
    },
  },

  "s3-l2": {
    title: "Changing lists",
    story: "New supplies have arrived. Add them to the list and sort out the chaos.",
    intro: `
<p>You can change a list after you've created it. With a dot you attach <b>methods</b> – these
are little commands that belong to the list:</p>

<pre><code>team = ["Yara", "Noah"]
team.append("Lena")   # add to the end
team.sort()           # sort alphabetically
print(team)</code></pre>

<p><code>.append(x)</code> adds <code>x</code> to the end, <code>.sort()</code> sorts the
list. Methods like these change the list directly – that's why the list's name comes before the dot.</p>`,
    taskHtml:
      "Add at least one name to the list with <code>.append(…)</code>, then <b>sort</b> it with <code>.sort()</code> and print it.",
    hints: ['Adding: <code>team.append("Name")</code>', "Sorting: <code>team.sort()</code>, then <code>print(team)</code>"],
    starterCode: py`
      team = ["Yara", "Noah"]
      # Add someone, sort the list and print it
    `,
    solution: py`
      team = ["Yara", "Noah"]
      team.append("Lena")
      team.sort()
      print(team)
    `,
    feedback: {
      useAppend: 'Add someone with <code>team.append("Name")</code>.',
      useSort: "Sort the list with <code>team.sort()</code>.",
      sortNone:
        "It says <code>None</code>: <code>team.sort()</code> sorts the list directly and doesn't give anything back. Just write <code>team.sort()</code>, not <code>team = team.sort()</code>.",
      threeNames: "By the end, there should be at least 3 names in the list.",
      sorted: "Print the list <b>sorted</b>. Are you calling <code>.sort()</code> <b>after</b> adding and before the <code>print</code>?",
    },
    expert: {
      html: `
<p>More methods: <code>.remove("x")</code> removes an item, <code>.reverse()</code>
turns the order around.</p>
<p><b>Bonus:</b> Remove a name from the team, reverse the order and print the result.</p>`,
      solution: py`
        team = ["Yara", "Noah", "Lena"]
        team.remove("Noah")
        team.reverse()
        print(team)
      `,
      feedback: {
        useRemove: 'Remove someone with <code>team.remove("Name")</code>.',
        useReverse: "Turn the list around with <code>team.reverse()</code>.",
      },
    },
  },

  "s3-l3": {
    title: "For every item …",
    story: "Lumo has to check every item on the list, one after the other. A loop gets that done in seconds.",
    intro: `
<p>With <code>for … in my_list</code> you go through <b>every item</b> one after another – without
having to count any positions:</p>

<pre><code>songs = ["A", "B", "C"]
for song in songs:
    print("Now playing:", song)</code></pre>

<p>On each pass, <code>song</code> is the next item. You can choose that name freely –
<code>for x in songs</code> would work just as well, but a name that says what it means is easier to read.</p>`,
    taskHtml:
      "Use a <code>for</code> loop to go through the list and print <b>each item on a line of its own</b> – with some text in front if you like, for example “Now playing: …”.",
    hints: ["<code>for song in songs:</code>", "Indented below it: <code>print(song)</code>"],
    starterCode: py`
      songs = ["Intro", "Beat 1", "Finale"]
      # Print each song on its own line
    `,
    solution: py`
      songs = ["Intro", "Beat 1", "Finale"]
      for song in songs:
          print("Now playing:", song)
    `,
    feedback: {
      loopOverList: "Let the loop run directly over the list: <code>for song in songs:</code>",
      printInLoop: "The <code>print(…)</code> belongs inside the loop, indented.",
      eachItem: "Every item in the list should appear in the output – one per line.",
    },
    expert: {
      html: `
<p>If your list contains numbers, you can add them up to a <b>total</b> inside the loop.</p>
<p><b>Bonus:</b> Use a loop to add up all the goals in the list <code>goals = [2, 1, 3, 0, 2]</code>
(without <code>sum()</code>) and print the total.</p>`,
      solution: py`
        goals = [2, 1, 3, 0, 2]
        total = 0
        for g in goals:
            total = total + g
        print("Total goals:", total)
      `,
      feedback: {
        accumulate: "Create <code>total = 0</code> before the loop and add each goal to it inside the loop.",
        result8: "Altogether that's 8 goals.",
      },
    },
  },

  "s3-l4": {
    title: "Building your own commands",
    story: "Lumo is tired of explaining everything ten times. Build your own command that greets visitors.",
    intro: `
<p>A <b>function</b> is your own command that you build once and can call as often as you like.
You define it with <code>def</code>; the brackets contain the <b>parameters</b> – values
the function receives when it's called.</p>

<pre><code>def greet(name):
    print(f"Hello {name}! 👋")

greet("Deniz")
greet("Fatima")</code></pre>

<p>The indented block is the “blueprint”. It only runs when you <b>call</b> the function – with
the value you pass in. That saves you from repeating yourself.</p>`,
    taskHtml: "Call the function <code>greet</code> with <b>two different names</b>.",
    hints: ['Calling it: <code>greet("Mia")</code>', "Two calls, one below the other, not indented, with different names."],
    starterCode: py`
      def greet(name):
          print(f"Hello {name}! 👋")

      # Call the function with two different names
    `,
    solution: py`
      def greet(name):
          print(f"Hello {name}! 👋")

      greet("Mia")
      greet("Jonas")
    `,
    feedback: {
      twoCalls: 'Call the function twice, each time on a line of its own: <code>greet("Mia")</code>.',
      differentNames: "Use two <b>different</b> names.",
    },
    expert: {
      html: `
<p>A function can have <b>several parameters</b>, separated by commas.</p>
<p><b>Bonus:</b> Build <code>greet(name, time_of_day)</code> so that it prints, for example,
“Good morning, Mia!”, and call it twice.</p>`,
      solution: py`
        def greet(name, time_of_day):
            print(f"Good {time_of_day}, {name}!")

        greet("Mia", "morning")
        greet("Leo", "evening")
      `,
      feedback: {
        twoParams: "Give the function two parameters: <code>def greet(name, time_of_day):</code>",
        twoCalls: "Call the function twice.",
        useBoth: "Both parameters should appear in the greeting.",
      },
    },
  },

  "s3-l5": {
    title: "Giving something back",
    story: "The measuring instruments deliver three values, but the average is missing. Build a function that gives it back, for any numbers.",
    intro: `
<p>Functions can <b>give back</b> a result – with <code>return</code>. The difference from
<code>print</code>: <code>print</code> only <i>shows</i> something, while <code>return</code>
<i>hands over</i> a value that you can keep calculating with.</p>

<pre><code>def double(x):
    return x * 2

result = double(5)
print(result)   # 10</code></pre>

<p>After <code>return</code>, the function is finished and hands the value back to the place
where it was called. You can store that value, print it or keep using it.</p>`,
    taskHtml:
      "Complete <code>average</code> so that the function returns the <b>mean</b> of the three numbers. For 2, 4 and 6 the answer is <b>4.0</b> – and it should be right for any other numbers too.",
    hints: [
      "Add them up and divide by how many there are: <code>(a + b + c) / 3</code> – the brackets matter!",
      "Give the result back with <code>return</code>, not with <code>print</code>.",
    ],
    starterCode: py`
      def average(a, b, c):
          # Return the average of the three numbers
          return 0

      print(average(2, 4, 6))
    `,
    solution: py`
      def average(a, b, c):
          return (a + b + c) / 3

      print(average(2, 4, 6))
    `,
    feedback: {
      returnsNothing: "Your function doesn't give anything back yet. Use <code>return</code> instead of <code>print</code> inside the function.",
      wrongValues:
        "For other numbers the result isn't right yet. Are you calculating with <code>a</code>, <code>b</code> and <code>c</code>? Watch the brackets: <code>(a + b + c) / 3</code>.",
      printResult: "Print the result for 2, 4 and 6: <code>print(average(2, 4, 6))</code>.",
    },
    expert: {
      html: `
<p><b>Bonus:</b> Write <code>points(wins, draws)</code> that <b>returns</b> the football points
(win = 3 points, draw = 1 point), and use it to compare two teams.</p>`,
      solution: py`
        def points(wins, draws):
            return wins * 3 + draws

        print("Team A:", points(5, 3))
        print("Team B:", points(7, 1))
      `,
      feedback: { wrongValues: "The points aren't right yet. A win counts 3, a draw 1: <code>wins * 3 + draws</code>." },
    },
  },

  "s3-l6": {
    title: "Dictionaries – key & value",
    story: "Every crew member has an equipment card with names and values. Fill in yours.",
    intro: `
<p>A <b>dictionary</b> stores pairs made up of a <b>key</b> and a <b>value</b> – like a real
dictionary (word → meaning) or a profile. Curly brackets <code>{ }</code>, a colon between
key and value, pairs separated by commas:</p>

<pre><code>hero = {"name": "Ada", "level": 3}
print(hero["name"])    # Ada
print(hero["level"])   # 3</code></pre>

<p>Unlike with lists (where you use the <b>position</b>), here you use the <b>key</b>:
<code>hero["name"]</code>. Great for bundling information that belongs together.</p>`,
    taskHtml:
      "Extend the dictionary to at least <b>three</b> pairs (for example with a weapon, a pet or a colour) and print <b>two values</b> using their keys.",
    hints: [
      'One more pair: <code>hero = {"name": "Ada", "level": 3, "colour": "Purple"}</code>',
      'Access via the key: <code>print(hero["colour"])</code>',
    ],
    starterCode: py`
      hero = {"name": "Ada", "level": 3}
      # Add a third pair and print two values
    `,
    solution: py`
      hero = {"name": "Ada", "level": 3, "colour": "Purple"}
      print(hero["name"])
      print(hero["colour"])
    `,
    feedback: {
      accessByKey: 'Get two values using their keys: <code>hero["name"]</code>.',
      printValues: "Print at least two values from the dictionary.",
    },
    expert: {
      html: `
<p>This is how you add new pairs: <code>hero["points"] = 100</code>. And with
<code>for key in hero:</code> you go through all the keys.</p>
<p><b>Bonus:</b> Add a new pair and then use a loop to print all the pairs.</p>`,
      solution: py`
        hero = {"name": "Ada", "level": 3}
        hero["points"] = 100
        for key in hero:
            print(key, "=", hero[key])
      `,
      feedback: {
        addKey: 'Add a pair: <code>hero["points"] = 100</code>.',
        loopDict: "Go through all the keys with <code>for key in hero:</code>.",
      },
    },
  },

  "s3-boss3": {
    title: "Your mini quiz",
    story: "The on-board AI only lets crew members into the lab if they pass its quiz. Turn the tables and build a quiz of your own!",
    intro: `
<p>Build a little <b>quiz</b> on a topic of your choice (animals, music, sport, space …).
It asks questions with <code>input()</code>, checks the answers with <code>if</code> and keeps
count of the points in a variable.</p>

<pre><code>points = 0
answer = input("Question? ")
if answer == "right":
    points = points + 1</code></pre>

<p>Tip: with <code>answer.lower()</code> you compare without worrying about capital and
small letters – so “Rome” counts just the same as “rome”.</p>`,
    taskHtml:
      "Add <b>at least two more questions</b> to the quiz (so three in total). Count correct answers as points and print the score at the end.",
    hints: [
      "For each question: one <code>input(…)</code> and one <code>if</code>/<code>else</code>.",
      "For a correct answer: <code>points = points + 1</code>. The score goes right at the end.",
    ],
    starterCode: py`
      points = 0

      answer = input("How many legs does a spider have? ")
      if answer == "8":
          points = points + 1
          print("Correct! 🕷️")
      else:
          print("So close – it's 8.")

      # Add at least two more questions here

      print("Points:", points)
    `,
    solution: py`
      points = 0

      answer = input("How many legs does a spider have? ")
      if answer == "8":
          points = points + 1
          print("Correct! 🕷️")
      else:
          print("So close – it's 8.")

      answer = input("What is the capital of Italy? ")
      if answer.lower() == "rome":
          points = points + 1
          print("Correct! 🇮🇹")
      else:
          print("It was Rome.")

      answer = input("Which planet is the biggest? ")
      if answer.lower() == "jupiter":
          points = points + 1
          print("Correct! 🪐")
      else:
          print("It's Jupiter.")

      print("Points:", points)
    `,
    feedback: {
      ifPerQuestion: "Check each answer with its own <code>if</code>.",
      countPoints: "Increase the points for every correct answer: <code>points = points + 1</code>.",
      scoreAtEnd: 'Print the score right at the end, for example <code>print("Points:", points)</code>.',
    },
    expert: {
      html: `
<p>Pro version: store the questions as a <b>list of dictionaries</b>
(<code>{"question": …, "answer": …}</code>) and go through them with <b>one</b> loop. That way
you only write the code for a question once – no matter how many questions there are.</p>
<p><b>Bonus:</b> Rebuild your quiz like this (with at least two questions in the list).</p>`,
      solution: py`
        questions = [
            {"question": "How many legs does a spider have? ", "answer": "8"},
            {"question": "What is the capital of Italy? ", "answer": "rome"},
            {"question": "Which planet is the biggest? ", "answer": "jupiter"},
        ]
        points = 0
        for q in questions:
            answer = input(q["question"])
            if answer.lower() == q["answer"]:
                points = points + 1
                print("Correct!")
            else:
                print("Sorry, wrong – the right answer is:", q["answer"])
        print("Points:", points, "out of", len(questions))
      `,
      feedback: {
        listOfDicts: 'Create a list with at least two dictionaries: <code>[{"question": …, "answer": …}, …]</code>.',
        inputInLoop: 'Ask the questions <b>inside</b> the loop: <code>answer = input(q["question"])</code>.',
      },
    },
  },

  // ================================================================== CHAPTER 4
  "s4-l1": {
    title: "The game engine",
    story: "There's an old arcade machine from the crew in the control room. Its heart, the game loop, is missing. Build it again.",
    intro: `
<p>Lots of games have a <b>game loop</b>: as long as the player still has lives or energy
left, the game goes on. That's a <code>while</code> loop around a value that changes.</p>

<pre><code>lives = 3
while lives &gt; 0:
    print("Lives left:", lives)
    lives = lives - 1
print("Game Over")</code></pre>

<p>The value <code>lives</code> is the <b>state</b> of the game. Things get exciting with chance:
if every round does a different amount of damage, nobody knows in advance how long the game
will last.</p>`,
    taskHtml:
      "Build the <b>game loop</b>: as long as <code>energy</code> is greater than 0, the game rolls a damage value from 1 to 6, subtracts it and prints the round and the energy. After that comes “Game Over”.",
    hints: [
      "<code>while energy &gt; 0:</code> – everything that happens each round is indented.",
      "Inside the loop: <code>damage = random.randint(1, 6)</code>, then <code>energy = energy - damage</code>.",
    ],
    starterCode: py`
      import random
      energy = 20
      round_number = 1
      # Game loop: as long as energy is greater than 0 …
      #   1. roll a damage value from 1 to 6
      #   2. subtract it from energy
      #   3. print the round and the energy
      #   4. increase round_number by 1
      print("Game Over")
    `,
    solution: py`
      import random
      energy = 20
      round_number = 1
      while energy > 0:
          damage = random.randint(1, 6)
          energy = energy - damage
          print(f"Round {round_number}: -{damage} → energy {energy}")
          round_number = round_number + 1
      print("Game Over")
    `,
    feedback: {
      randomInLoop: "Roll the damage <b>inside</b> the loop with <code>random.randint(1, 6)</code>, so that every round is different.",
      rounds: "Print something in every round, for example the round and the energy.",
      gameOver: "After the loop, “Game Over” should always appear – <b>not</b> indented.",
    },
    expert: {
      html: `
<p><b>Bonus:</b> After the game, print how many rounds it lasted, for example
“Survived: 6 rounds”. Watch out: <code>round_number</code> starts at 1 and goes up after every
round. So what's in <code>round_number</code> after 4 rounds?</p>`,
      solution: py`
        import random
        energy = 20
        round_number = 1
        while energy > 0:
            damage = random.randint(1, 6)
            energy = energy - damage
            print(f"Round {round_number}: -{damage} → energy {energy}")
            round_number = round_number + 1
        print("Game Over")
        print(f"Survived: {round_number - 1} rounds")
      `,
      feedback: {
        rounds: "At the end, print how many rounds there were.",
        count4:
          "With 20 energy and 5 damage every time, it's exactly 4 rounds. Remember: after the last round, <code>round_number</code> is already one ahead.",
        count20: "With 1 damage every time, it's 20 rounds. Are you counting each round exactly once?",
      },
    },
  },

  "s4-l2": {
    title: "Secret codes",
    story: "A strange signal has arrived, but it's encrypted. Shift every letter and find out what it says.",
    intro: `
<p>Encrypting things is fun! With the <b>Caesar cipher</b> you shift every letter by a fixed
number. For that you need two tools: <code>ord()</code> turns a letter into its number,
and <code>chr()</code> turns a number back into a letter.</p>

<pre><code>print(ord("A"))   # 65
print(chr(66))    # B</code></pre>

<p>If you go through every letter and increase its number, you get a secret message.
To decrypt it, you simply shift in the other direction:</p>

<pre><code>secret = ""
for letter in "HELLO":
    secret = secret + chr(ord(letter) + 1)
print(secret)   # IFMMP</code></pre>`,
    taskHtml:
      "Decrypt the secret message: use <code>ord()</code> and <code>chr()</code> to shift every letter <b>back by 1</b>. What comes out?",
    hints: [
      "<code>ord(letter)</code> gives you the number, <code>- 1</code> shifts it back, and <code>chr(…)</code> turns it into a letter again.",
      "<code>plain_text = plain_text + chr(ord(letter) - 1)</code>",
    ],
    starterCode: py`
      secret = "QZUIPO"   # every letter has been shifted by 1
      plain_text = ""
      for letter in secret:
          # Shift each letter back by 1
          plain_text = plain_text + letter
      print(plain_text)
    `,
    solution: py`
      secret = "QZUIPO"
      plain_text = ""
      for letter in secret:
          plain_text = plain_text + chr(ord(letter) - 1)
      print(plain_text)
    `,
    feedback: {
      useOrdChr: "Use <code>ord()</code> and <code>chr()</code> to shift each letter.",
      decrypt: "Not decrypted yet. Shift <b>back</b> by 1: <code>chr(ord(letter) - 1)</code>.",
    },
    expert: {
      html: `
<p>Real Caesar ciphers usually shift by 3. But what happens with <code>"Z"</code> + 3? To carry on
from A again after Z, you use the remainder of a division: <code>% 26</code>. The formula for
capital letters is <code>chr((ord(c) - 65 + shift) % 26 + 65)</code>.</p>
<p><b>Bonus:</b> Write a function <code>caesar(text, shift)</code> that shifts capital letters
(even past Z) and leaves everything else, such as spaces, unchanged. With a negative shift, it
decrypts the text again.</p>`,
      solution: py`
        def caesar(text, shift):
            result = ""
            for c in text:
                if "A" <= c <= "Z":
                    result = result + chr((ord(c) - 65 + shift) % 26 + 65)
                else:
                    result = result + c
            return result

        secret = caesar("HELLO WORLD", 3)
        print(secret)
        print(caesar(secret, -3))
      `,
      feedback: {
        useMod: "Use <code>% 26</code> so that it carries on from A again after Z.",
        shift: '<code>caesar("HELLO", 3)</code> should return <code>"KHOOR"</code>.',
        wrap: '<code>caesar("XYZ", 3)</code> should give <code>"ABC"</code> – after Z it carries on from A.',
        spaces: "Spaces and other characters should stay unchanged.",
        decryptBack: "With a negative shift, the function should decrypt the text again.",
      },
    },
  },

  "s4-l3": {
    title: "Drawing with code",
    story: "The big screen in the control room is back on, and it's still completely empty. Paint the first picture!",
    intro: `
<p>The station has a <b>screen made of 16 × 16 little lights</b> (pixels). With
<code>pixel(x, y, colour)</code> you switch one of them on. <code>x</code> counts from left
(0) to right (15), <code>y</code> from top (0) to bottom (15).</p>

<pre><code>from station import pixel

for x in range(16):
    pixel(x, 12, "teal")   # a line right across the screen
pixel(7, 4, "gold")</code></pre>

<p>You can give colours as names (<code>"red"</code>, <code>"blue"</code>, <code>"pink"</code>,
<code>"gold"</code> …) or as a colour code like <code>"#ff8800"</code>. <code>"black"</code>
switches a pixel off again, and <code>fill(colour)</code> colours in the whole screen.</p>

<p>With loops you can paint lines and areas in a single line of code – and a loop inside a
loop can even fill a whole rectangle.</p>`,
    taskHtml:
      "Paint a <b>picture on the station screen</b>: at least <b>12 pixels</b> in at least <b>two colours</b>, and use at least <b>one loop</b> to do it. A tree, a rocket, a face, your favourite logo …",
    hints: [
      'You can draw a line with a loop: <code>for x in range(3, 13):</code> and below it <code>pixel(x, 14, "green")</code>.',
      "For the second colour, just put a few more pixels on top in a different colour.",
    ],
    starterCode: py`
      from station import pixel

      # Paint your picture: pixel(x, y, "colour")  (x and y from 0 to 15)
      pixel(7, 7, "gold")
    `,
    solution: py`
      from station import pixel

      # Trunk
      for y in range(10, 15):
          pixel(7, y, "brown")
          pixel(8, y, "brown")
      # Leaves
      for y in range(3, 10):
          for x in range(4, 12):
              pixel(x, y, "green")
      # Apples
      pixel(6, 5, "red")
      pixel(9, 7, "red")
    `,
    feedback: {
      usePixel: 'Switch pixels on with <code>pixel(x, y, "colour")</code> – for that, <code>from station import pixel</code> goes right at the top.',
      useLoop: "Use at least one loop – for example for a line: <code>for x in range(16):</code>",
    },
    expert: {
      html: `
<p>Pixel artists often draw their pictures as a <b>list of text lines</b>: each character is one
pixel, and a dictionary tells you which colour belongs to which character.</p>
<pre><code>picture = [
    ".RR.RR.",
    "RRRRRRR",
    ".RRRRR.",
    "..RRR..",
    "...R...",
]
colours = {"R": "red"}</code></pre>
<p><b>Bonus:</b> Paint a picture made of at least <b>20 pixels</b> using two <b>nested</b>
loops: the outer one goes through the rows (<code>y</code>), the inner one through the characters
in a row (<code>x</code>).</p>`,
      solution: py`
        from station import pixel

        picture = [
            ".RR.RR.",
            "RRRRRRR",
            "RRRWRRR",
            ".RRRRR.",
            "..RRR..",
            "...R...",
        ]
        colours = {"R": "red", "W": "white"}

        for y in range(len(picture)):
            for x in range(len(picture[y])):
                symbol = picture[y][x]
                if symbol in colours:
                    pixel(x + 4, y + 5, colours[symbol])
      `,
      feedback: { nested: "Put one loop <b>inside</b> another: the outer one goes through the rows, the inner one through the characters in a row." },
    },
  },

  "s4-l4": {
    title: "Analysing real data",
    story: "The weather station outside has been measuring temperatures for a week. Analyse the data.",
    intro: `
<p>Programming helps you make sense of real data. For lists of numbers there are ready-made
tools: <code>max()</code> (largest value), <code>min()</code> (smallest),
<code>sum()</code> (total) and <code>len()</code> (how many).</p>

<pre><code>temps = [21, 25, 19, 28, 23]
print("Coldest day:", min(temps))</code></pre>

<p>You get the <b>average</b> with “total divided by how many” – so by using
<code>sum</code> and <code>len</code> together.</p>`,
    taskHtml:
      "Use <code>max()</code> to find the <b>warmest day</b> and work out the <b>average</b> temperature with <code>sum()</code> and <code>len()</code>. Print both.",
    hints: ["<code>max(temps)</code> gives you the largest value.", "Average: <code>sum(temps) / len(temps)</code>"],
    starterCode: py`
      temps = [21, 25, 19, 28, 23]
      # Print the warmest day and the average
    `,
    solution: py`
      temps = [21, 25, 19, 28, 23]
      print("Warmest day:", max(temps))
      print("Average:", sum(temps) / len(temps))
    `,
    feedback: {
      useMax: "Use <code>max(temps)</code> for the warmest day.",
      useSumLen: "Work out the average with <code>sum(temps) / len(temps)</code>.",
      max28: "The warmest day was 28 degrees – print it.",
      average: "The average should be 23.2. Are you dividing the total by the number of values?",
    },
    expert: {
      html: `
<p><b>Bonus:</b> Round the average to one decimal place with <code>round(value, 1)</code>
and use a loop to find out on how many days it was <b>warmer than 22 degrees</b>.</p>`,
      solution: py`
        temps = [21, 25, 19, 28, 23]
        print("Average:", round(sum(temps) / len(temps), 1))
        warm = 0
        for temp in temps:
            if temp > 22:
                warm = warm + 1
        print("Warm days:", warm)
      `,
      feedback: {
        useRound: "Round with <code>round(…, 1)</code>.",
        countLoop: "Use a <code>for</code> loop and an <code>if</code> to count how many values are above 22.",
        count3: "There were 3 days above 22 degrees (25, 28 and 23).",
      },
    },
  },

  "s4-l5": {
    title: "Finding bugs (debugging)",
    story: "One last glitch is blocking the control room: three bugs are hiding in the code. Fix them and the station is free.",
    intro: `
<p>Pros make mistakes – and find them. That's called <b>debugging</b>. The code below contains
exactly <b>three bugs</b>. Run it, read the explanation in the console (it tells you the line!) and
fix one bug after another. After each fix, the next error may show up –
that's completely normal.</p>

<p>Common stumbling blocks: a missing colon <code>:</code>, missing indentation,
or text and a number mixed with <code>+</code> (<code>str(…)</code> fixes that).</p>`,
    taskHtml:
      "Fix all three bugs until the program runs without an error message. At the end, “Hooray!” should appear three times.",
    hints: [
      "Two bugs are in the <code>for</code> line and the line below it: the colon and the indentation.",
      "The third one: turn the number into text before you attach it with <code>+</code>: <code>str(age + 1)</code>.",
    ],
    starterCode: py`
      name = "Emma"
      age = 11
      print("Hello " + name)
      print("Next year you'll be " + (age + 1) + " years old")
      for i in range(3)
      print("Hooray!")
    `,
    solution: py`
      name = "Emma"
      age = 11
      print("Hello " + name)
      print("Next year you'll be " + str(age + 1) + " years old")
      for i in range(3):
          print("Hooray!")
    `,
    feedback: {
      keepLoop: "Keep the loop and fix it.",
      allLines: "All the lines should be printed – don't delete any commands, fix them instead.",
      age: "The output should say how old Emma will be next year (12). Use <code>str(age + 1)</code>.",
      threeHurra: "“Hooray!” should appear three times: the <code>print</code> line belongs inside the loop, indented.",
    },
    expert: {
      html: `
<p>Some errors you can see coming – for example when someone types letters where a
number is expected. With <code>try:</code> and <code>except ValueError:</code> you catch the
error instead of letting the program crash.</p>
<p><b>Bonus:</b> Ask for the age with <code>int(input(…))</code>. If it's a number, print the
age next year; if it's letters, print a friendly message.</p>`,
      solution: py`
        try:
            age = int(input("How old are you? "))
            print("Next year you'll be", age + 1)
        except ValueError:
            print("Please enter a whole number.")
      `,
      feedback: {
        useTry: "Put the conversion into a <code>try:</code> block and catch the error with <code>except ValueError:</code>.",
        useInput: "Ask for the age with <code>int(input(…))</code>.",
        friendly: "If letters are typed in, a friendly message should appear.",
        normalCase: "If you enter 11, the program should print 12.",
      },
    },
  },

  "s4-boss4": {
    title: "Your own project",
    story: "Station Polaris is up and running again! All that's missing now is your own module, something nobody has ever built before.",
    intro: `
<p>The grand finale: <b>build something of your own!</b> A game, a story, a quiz or a
useful tool. Use what you've learned: <code>input()</code>, <code>if</code>,
loops, lists, dictionaries, your own functions, <code>random</code> …</p>

<p>It doesn't have to be perfect – what matters is that it's yours. Start small, test often and then
build it up bit by bit. When you're done, your diploma is waiting for you. 🚀</p>`,
    taskHtml:
      "Write your own program that uses at least <b>three building blocks</b> from the course (<code>input()</code>, <code>if</code>, a loop, a list or a dictionary, your own function, <code>random</code>) and runs without errors. Be creative – this is your masterpiece!",
    hints: [
      "Start small: print something first, then add to it step by step.",
      "Ideas: a dice game with points, a vocabulary quiz from a list, a pocket-money planner with a function.",
    ],
    starterCode: py`
      # 🌟 Your project. A few ideas:
      #  - a text adventure with choices (if/else)
      #  - a quiz about your favourite topic
      #  - a dice game or a maths trainer
      #  - a useful tool (converter, idea generator)

      print("My project is starting …")
    `,
    solution: py`
      import random

      answers = ["Yes, definitely!", "Probably not …", "Ask again later", "Absolutely!"]

      def oracle():
          return random.choice(answers)

      print("🎲 Lucky Oracle 🎲")
      for turn in range(3):
          question = input("Ask me a yes/no question: ")
          if question == "":
              print("You didn't ask anything!")
          else:
              print(oracle())
    `,
    feedback: {
      blocks:
        "So far your program only uses {n} of the building blocks. Add a few more – for example a loop, a list or your own function.",
      tooShort: "Your project can be a bit bigger – at least 6 lines of code.",
    },
  },

  // ================================================================== OUTDOOR MISSIONS
  "d-1": {
    title: "First trip outside",
    story: "Outside the station, the ice is glittering. Lumo can fly out, but only with your commands. Get Lumo to the charging station!",
    intro: `
<p>Here you steer Lumo directly with Python. You get the flight commands with
<code>from drone import *</code>. The asterisk means “all commands”.</p>

<pre><code>from drone import *

move()
move()</code></pre>

<p><code>move()</code> flies Lumo one square forward, in the direction the arrow is pointing.
The goal is the <b>charging station</b> ⚡. If Lumo flies into a wall, it's no big deal. You get
a glitch and simply try again.</p>`,
    taskHtml: "Get Lumo to the <b>charging station</b> ⚡. Count the squares!",
    hints: ["Every square needs its own <code>move()</code>.", "It's five squares, so five <code>move()</code> commands, one below the other."],
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
    title: "Round the corner",
    story: "The charging station is hidden behind a wall of ice. Lumo has to turn, and luckily a drone can turn on the spot.",
    intro: `
<p><code>turn_left()</code> turns Lumo to the left on the spot, a quarter turn. There's no command
for right. Can you still get to the right somehow? You'll find out later.</p>

<pre><code>from drone import *

move()
turn_left()
move()</code></pre>`,
    taskHtml: "Fly Lumo round the corner to the charging station ⚡.",
    hints: [
      "First fly straight ahead until you're right in front of the wall, then <code>turn_left()</code>, then carry on with <code>move()</code>.",
      "Four times <code>move()</code>, once <code>turn_left()</code>, twice <code>move()</code>.",
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
      html: "<p><b>Bonus:</b> When it reaches the charging station, Lumo should end up facing <b>left</b> (towards the west), so its camera can keep an eye on the station.</p>",
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
      feedback: { faceWest: "Lumo is in the right place, but it isn't looking left yet. One turn is missing." },
    },
  },

  "d-3": {
    title: "Collecting crystals",
    story: "There are energy crystals lying on the ice. Every single one helps the station, so Lumo should pick them up on the way.",
    intro: `
<p>Ice crystals store energy. <code>collect()</code> picks up the crystal on the square
Lumo is standing on right now. If there isn't one there, Lumo reports a glitch.</p>

<pre><code>from drone import *

move()
move()
collect()</code></pre>`,
    taskHtml: "Collect <b>both crystals</b> and then fly to the charging station ⚡.",
    hints: [
      "Fly onto the square with the crystal and call <code>collect()</code> there.",
      "The first crystal is two squares in front of Lumo, the second one is two squares further on, and the charging station is another two squares after that.",
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
    title: "Long corridors",
    story: "A narrow ice channel leads to the outer charging station. It's long, and Lumo doesn't like long lists of commands.",
    intro: `
<p>13 squares, 13 lines of <code>move()</code>? With a <code>for</code> loop you can do it in
two lines:</p>

<pre><code>from drone import *

for i in range(4):
    move()</code></pre>

<p>Lumo repeats everything that's indented under the <code>for</code> line.</p>`,
    taskHtml: "The corridor is <b>13 squares</b> long. Get Lumo to the charging station ⚡ with a <b><code>for</code> loop</b>.",
    hints: ["<code>for i in range(…):</code> with <code>move()</code> indented underneath.", "<code>range(13)</code> repeats 13 times."],
    starterCode: py`
      from drone import *

      # The corridor is 13 squares long
      move()
    `,
    solution: py`
      from drone import *

      for i in range(13):
          move()
    `,
    expert: {
      html: "<p><b>Bonus for pros:</b> Do it in <b>3 lines</b> of code at most. The import line counts, but comments and blank lines don't.</p>",
      solution: py`
        from drone import *
        for i in range(13):
            move()
      `,
      feedback: { short: "That's still too many lines. Let the loop do all the work." },
    },
  },

  "d-5": {
    title: "Unknown distance",
    story: "The snowstorm keeps shifting the ice plates around. Nobody knows how far away the charging station is today, so Lumo has to work it out for itself.",
    intro: `
<p>Lumo has <b>sensors</b>. They answer questions with <code>True</code> or <code>False</code>.
<code>at_goal()</code> is <code>True</code> when Lumo is standing on the charging station:</p>

<pre><code>from drone import *

print(at_goal())   # False, Lumo is still at the start</code></pre>

<p>With <code>while</code>, Lumo repeats something <b>as long as</b> a condition is true. And
<code>not</code> swaps <code>True</code> and <code>False</code> round: <code>not at_goal()</code>
means “not at the goal yet”.</p>`,
    taskHtml:
      "The distance is <b>different</b> on every mission. Get Lumo to the charging station ⚡ with a <b><code>while</code> loop</b> and <code>at_goal()</code>, however far away it is.",
    hints: ["<code>while not at_goal():</code> means “as long as Lumo isn't at the goal yet”.", "Indented underneath, all you need is <code>move()</code>."],
    starterCode: py`
      from drone import *

      # How far away is the charging station? Lumo doesn't know …
      move()
    `,
    solution: py`
      from drone import *

      while not at_goal():
          move()
    `,
    expert: {
      html: "<p><b>Bonus:</b> Have Lumo <b>count</b> along the way and print at the end how many squares it has flown.</p>",
      solution: py`
        from drone import *

        squares = 0
        while not at_goal():
            move()
            squares += 1
        print("Squares flown:", squares)
      `,
      feedback: { count: "At the end, print how many squares Lumo has flown. Count along in the loop with <code>squares += 1</code>." },
    },
  },

  "d-6": {
    title: "Crystal trail",
    story: "After the storm, crystals are scattered along the route, and they're somewhere different on every mission. Lumo mustn't miss a single one.",
    intro: `
<p>With <code>if</code>, Lumo makes decisions on the way. <code>on_crystal()</code> is
<code>True</code> when there's a crystal underneath Lumo:</p>

<pre><code>from drone import *

if on_crystal():
    collect()
print("Crystal under me?", on_crystal())</code></pre>

<p>If you put the decision <b>inside</b> a loop, Lumo checks every square it passes.</p>`,
    taskHtml: "There are crystals along the route, in different places on every mission. Collect <b>all</b> of them and fly to the charging station ⚡.",
    hints: [
      "In the <code>while</code> loop, first check whether there's a crystal, then move on one square.",
      "<code>while not at_goal():</code>, underneath it <code>if on_crystal():</code> with <code>collect()</code>, and after that <code>move()</code>.",
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
      html: "<p><b>Bonus:</b> Count the crystals as you go and print at the end how many Lumo has collected.</p>",
      solution: py`
        from drone import *

        crystals = 0
        while not at_goal():
            if on_crystal():
                collect()
                crystals += 1
            move()
        print("Crystals:", crystals)
      `,
      feedback: { count: "At the end, print the number of crystals collected. Count along right after <code>collect()</code>." },
    },
  },

  "d-7": {
    title: "Right turn",
    story: "A staircase of ice blocks leads up to the right. But Lumo can only turn left … or can it?",
    intro: `
<p>Three lefts make a right! Instead of writing three lines every time, you build
your <b>own command</b>:</p>

<pre><code>from drone import *

def turn_right():
    turn_left()
    turn_left()
    turn_left()

turn_right()</code></pre>

<p>From now on, Python knows <code>turn_right()</code> just as well as the built-in commands.</p>`,
    taskHtml:
      "Build the command <code>turn_right()</code> with <code>def</code> and fly Lumo up the ice staircase to the charging station ⚡. It's easiest one step at a time with a loop.",
    hints: [
      "One step is <code>move()</code>, <code>turn_left()</code>, <code>move()</code>, <code>turn_right()</code>.",
      "There are four steps, and after them one more <code>move()</code>. Use <code>for i in range(4):</code>",
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          # three lefts make a right
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
    feedback: { useDef: "You've built the command, but you haven't used it yet. Call <code>turn_right()</code> wherever Lumo needs to turn right." },
    expert: {
      html: "<p><b>Bonus:</b> Build a second command <code>step_up()</code> that flies a whole step, and call it in a loop.</p>",
      solution: py`
        from drone import *

        def turn_right():
            turn_left()
            turn_left()
            turn_left()

        def step_up():
            move()
            turn_left()
            move()
            turn_right()

        for i in range(4):
            step_up()
        move()
      `,
      feedback: { twoDefs: "As well as <code>turn_right()</code>, build a second command, for example <code>def step_up():</code>." },
    },
  },

  "d-8": {
    title: "Spiral",
    story: "A passage winds like a spiral into the heart of an old ice cave. Every cave is different, so Lumo has to decide for itself when to turn.",
    intro: `
<p><code>front_clear()</code> is <code>True</code> when the way ahead of Lumo is clear. With <code>if</code> and
<code>else</code>, Lumo makes a fresh decision at every step:</p>

<pre><code>from drone import *

if front_clear():
    move()
else:
    turn_left()</code></pre>`,
    taskHtml:
      "The passage winds inwards like a spiral, and every spiral is different. Let Lumo find its own way to the charging station ⚡ with <code>while</code>, <code>if</code> and <code>else</code>.",
    hints: [
      "As long as Lumo isn't at the goal, it flies on if the way ahead is clear, and otherwise it turns left.",
      "<code>while not at_goal():</code>, inside it <code>if front_clear():</code> with <code>move()</code> and <code>else:</code> with <code>turn_left()</code>.",
    ],
    starterCode: py`
      from drone import *

      # Lumo should decide for itself: fly on or turn?
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
    title: "Maze rescue",
    story: "A snowstorm has blown Lumo into an ice maze, and no two mazes look the same. Only a clever program can bring Lumo home.",
    intro: `
<p>An old trick for mazes: <b>always keep your right hand on the wall.</b> If you do that,
you're sure to find the exit in mazes like these. For Lumo, that means at every step:</p>
<ul>
<li>first turn right,</li>
<li>then turn left as long as there's a wall in front,</li>
<li>then fly one square.</li>
</ul>
<p>A loop <b>inside</b> a loop, and Lumo has a plan.</p>`,
    taskHtml: "Write a program that gets Lumo from <b>any</b> maze to the charging station ⚡. It will be tested with mazes you can't see.",
    hints: [
      "You need <code>turn_right()</code> from “Right turn”. The starter code already has it.",
      "On the outside <code>while not at_goal():</code>, inside it <code>turn_right()</code>, then <code>while not front_clear():</code> with <code>turn_left()</code>, then <code>move()</code>.",
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          turn_left()
          turn_left()
          turn_left()

      # Right hand on the wall …
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

  // ================================================================== GLITCH HUNT
  "g-1": {
    title: "Radio silence",
    story: "An old crew program is supposed to greet visitors by name. Instead, all it does is report glitches.",
    intro: `
<p>Welcome to the <b>glitch hunt</b>! Here you don't write a new program, you repair a
broken one. This is how the pros do it:</p>
<ul>
<li>Run the program and read the error card calmly.</li>
<li>Click on “Line …”. That's where it's stuck.</li>
<li>Fix one error and run it again. Often the next one shows up after that.</li>
</ul>`,
    taskHtml:
      "Repair the program. It should ask for a name and then print <b>two lines</b>, a greeting with the name and “Welcome aboard!”.",
    hints: [
      "Python cares about upper and lower case: <code>name</code> and <code>Name</code> are two different names.",
      "In the last line, a quotation mark is missing before the bracket.",
    ],
    starterCode: py`
      name = input("What's your name? ")
      print("Hello, " + Name + "!")
      print("Welcome aboard!)
    `,
    solution: py`
      name = input("What's your name? ")
      print("Hello, " + name + "!")
      print("Welcome aboard!")
    `,
    feedback: { greet: "The greeting should contain the name that was typed in, followed by “Welcome aboard!”." },
  },

  "g-2": {
    title: "Miscalculation",
    story: "The station's age calculator only has one job, working out how old you'll be in ten years. Instead, it crashes with every input.",
    intro: `
<p>This glitch is a classic. <code>input()</code> always gives you <b>text</b>, even when someone
types in a number. But you can't simply add text and a number together.</p>
<pre><code>print(int("12") + 10)
print("Age: " + str(22))</code></pre>
<p><code>int(…)</code> turns text into a number, and <code>str(…)</code> turns a number into text.</p>`,
    taskHtml: "Repair the calculator. For <b>any</b> age, it should correctly work out how old you'll be in ten years.",
    hints: [
      "The first error card points to the calculation: text + number doesn't work. Convert the input with <code>int(…)</code>.",
      "After that it gets stuck when printing, because text + number doesn't fit together there either. <code>str(…)</code> or an f-string will help.",
    ],
    starterCode: py`
      age = input("How old are you? ")
      in_ten_years = age + 10
      print("In ten years you'll be " + in_ten_years + " years old.")
    `,
    solution: py`
      age = int(input("How old are you? "))
      in_ten_years = age + 10
      print(f"In ten years you'll be {in_ten_years} years old.")
    `,
    feedback: { math: "The program runs, but it doesn't calculate correctly for every age yet. For 12 the answer should be 22, and for 30 it should be 40." },
  },

  "g-3": {
    title: "Endless countdown",
    story: "The launch ramp counts down … and never stops. The rover has been waiting years for its “Lift-off!”.",
    intro: `
<p>Some glitches don't produce an error message at all. The program simply runs <b>forever</b>.
Don't worry, Codaluna stops it after a while. Then it's worth asking yourself what would have to change in
the loop so that the condition becomes <code>False</code> at some point.</p>`,
    taskHtml: "Repair the countdown. It should print <b>5, 4, 3, 2, 1</b>, then “Lift-off!”, and then really stop.",
    hints: [
      "Go ahead and run the program once. Why does the loop never end?",
      "Inside the loop, <code>number</code> has to get smaller: <code>number = number - 1</code>, indented, after the <code>print</code>.",
    ],
    starterCode: py`
      number = 5
      while number > 0:
          print(number)
      print("Lift-off!")
    `,
    solution: py`
      number = 5
      while number > 0:
          print(number)
          number = number - 1
      print("Lift-off!")
    `,
    feedback: { countdown: "The countdown should count exactly 5, 4, 3, 2, 1 and then print “Lift-off!” once." },
  },

  "g-4": {
    title: "Wonky list",
    story: "The storeroom list in the lab breaks off every time before it's finished. Somewhere the program is miscounting.",
    intro: `
<p>There are two glitches hiding in this program. The first one stops it from even starting. The second
only shows up while it's running, and it has to do with the <b>positions</b> in a list. The first
position is 0, and the last one is <code>len(list) - 1</code>.</p>`,
    taskHtml: "Repair the storeroom list. Every supply should appear on its own line, with the total number at the end.",
    hints: ["Count the brackets in the last line.", "<code>range(len(supplies))</code> counts exactly the positions in the list, without <code>+ 1</code>."],
    starterCode: py`
      supplies = ["Ice", "Crystals", "Batteries", "Biscuits"]
      for i in range(len(supplies) + 1):
          print("In stock:", supplies[i])
      print("Total:", len(supplies)
    `,
    solution: py`
      supplies = ["Ice", "Crystals", "Batteries", "Biscuits"]
      for i in range(len(supplies)):
          print("In stock:", supplies[i])
      print("Total:", len(supplies))
    `,
    feedback: { list: "Exactly four supplies should appear, each on its own line, followed by the total of 4." },
  },

  "g-5": {
    title: "Forgotten return",
    story: "The control room's energy calculator does show a number, but then it carries on calculating with nothing. A textbook glitch!",
    intro: `
<p>A function can <b>show</b> something (<code>print</code>) or <b>give back</b> something
(<code>return</code>). That's not the same thing, because only what is given back can be used
again by the program. Without <code>return</code>, a function gives back <code>None</code>, which means “nothing”.</p>`,
    taskHtml:
      "Repair the function <code>double</code>. It should <b>give back</b> its result so that the program can keep calculating with it. At the end, “Total energy: 50” should appear.",
    hints: [
      "The error card says that <code>None</code> plus a number doesn't work. So the function isn't giving anything back.",
      "In the function, replace <code>print(result)</code> with <code>return result</code>.",
    ],
    starterCode: py`
      def double(number):
          result = number * 2
          print(result)

      energy = double(21)
      print("Total energy:", energy + 8)
    `,
    solution: py`
      def double(number):
          result = number * 2
          return result

      energy = double(21)
      print("Total energy:", energy + 8)
    `,
    feedback: {
      double: "The function should give back double the number, so for 7 that's 14.",
      fifty: "At the end, “Total energy: 50” should appear.",
    },
  },
};
