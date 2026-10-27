// Codaluna – Übersetzung des Kurses "season-1": Türkçe.
// Überschreibt nur Texte und Code der deutschen Basis (content/courses/season-1.js).

import { py } from "../lib/check-kit.js";

export default {
  chapters: {
    c1: "İlk komutlar",
    c2: "Kararlar ve döngüler",
    c3: "Koleksiyonlar ve kendi komutların",
    c4: "Hepsi bir arada",
    d1: "Lumo'yu buzda yönet",
    g1: "Bozuk programları onar",
  },
  regions: {
    c1: {
      name: "Telsiz odası",
      intro: "Telsiz odası karanlık. İstasyonun yeniden konuşabilmesi için komutlara ihtiyacı var ve o komutları sen yazacaksın.",
      outro: "İstasyon yeniden konuşuyor, hesap yapıyor ve soru soruyor. Lumo sevinçten havada bir tur atıyor.",
    },
    c2: {
      name: "Hangar",
      intro: "Hangarda kapılar, keşif araçları ve sinyal lambaları bekliyor. Kendi başlarına karar verip işleri tekrarlayabilmeleri için koşullara ve döngülere ihtiyaçları var.",
      outro: "Hangar kapısı açılıyor ve dışarıda buz pırıl pırıl parlıyor. Artık Lumo dışarıdaki görevlere de uçabilir.",
    },
    c3: {
      name: "Laboratuvar",
      intro: "Laboratuvarda malzemeler, numuneler ve notlar birbirine karışmış. Listeler, sözlükler ve kendi komutların buraya düzen getirecek.",
      outro: "Her şey yerli yerinde ve istasyonun yapay zekâsı seni artık bir mürettebat üyesi olarak tanıyor.",
    },
    c4: {
      name: "Kontrol merkezi",
      intro: "Kontrol merkezinde bütün sistemler bir araya geliyor. Burada neler yapabildiğini göstereceksin: oyunlar, şifreler, resimler ve gerçek ölçüm verileri.",
      outro: "Polaris İstasyonu yeniden ışıl ışıl! Artık kendi modüllerini sen kuruyorsun.",
    },
    d1: {
      name: "Buz tarlası",
      intro: "İstasyonun önünde buz tarlası uzanıyor. Burada Lumo'yu doğrudan Python ile yönetiyorsun ve her komut bir uçuş manevrası oluyor.",
      outro: "Lumo artık buz tarlasının her köşesini tanıyor. Sen de yolunu kendi bulan bir drone programladın.",
    },
    g1: {
      name: "Bakım tüneli",
      intro: "Bakım tünelinde mürettebatın eski programları duruyor ve hepsi arızalarla dolu. Onardığın her program istasyonu biraz daha ileri taşıyor.",
      outro: "Bakım tüneli tertemiz. Arızaları artık istasyonun yapay zekâsından bile hızlı buluyorsun.",
    },
  },

  // ================================================================== BÖLÜM 1
  "s1-l1": {
    title: `Merhaba, dünya!`,
    story: `İstasyonun telsizi yıllardır susuyor. İlk mesajı dışarıya sen gönder, yeter ki tam senin tarzında olsun!`,
    intro: `
<p>Bir program, bilgisayarın sırayla yerine getirdiği <b>komutlardan</b> oluşan bir listedir.
İlk komutun <code>print()</code> olacak. Bu komut, <b>konsola</b> (editörün altındaki koyu alana)
bir şey yazar.</p>

<p><b>Önemli: Metinler tırnak içinde yazılır.</b> Python'un <i>olduğu gibi</i> ekrana yazmasını
istediğin her şeyi tırnak işaretlerinin arasına koyarsın: <code>"…"</code>. Böyle bir metne
<b>string</b> denir (Türkçesi “karakter dizisi”). Tırnak işaretleri Python'a “Bu bir metin,
komut değil.” der.</p>

<pre><code>print("Merhaba dünya!")</code></pre>

<p>Tırnakları unutursan (<code>print(Merhaba)</code>), Python <code>Merhaba</code> kelimesini
tanıması gereken bir ad sanır ve hata verir. Bu arada tırnak işaretlerinin kendisi ekrana
<b>yazılmaz</b>.</p>

<p>Merak etme, burada hiçbir şey bozulmaz. Metni değiştir ve <b>Çalıştır</b> düğmesine bas
(ya da Ctrl + Enter).</p>`,
    taskHtml: `Metni değiştir ve <b>kendi mesajını</b> yazdır: sloganın, bir selam ya da en sevdiğin söz olabilir. Tırnak işaretlerini unutma!`,
    hints: [
      `Metnini tırnak işaretlerinin arasına yaz: <code>print("…")</code>.`,
      `Örneğin: <code>print("Bugün Python öğreniyorum!")</code>`,
    ],
    starterCode: py`
      print("Merhaba dünya!")
    `,
    solution: py`
      print("Bugün Python öğreniyorum!")
    `,
    expert: {
      html: `
<p>Virgülle ayırarak <b>birden fazla şeyi</b> aynı anda yazdırabilirsin. Python aralarına
kendiliğinden bir boşluk koyar: <code>print("Merhaba", "dünya")</code>. <code>\\n</code> ise bir
metnin <i>içinde</i> yeni bir satır başlatır.</p>
<p><b>Bonus:</b> Virgüllerle birkaç parçayı birlikte yazdıran ve <code>\\n</code> sayesinde en az
iki satıra yayılan bir <code>print()</code> yaz.</p>`,
      solution: py`
        print("Merhaba", "dünya!", "\nİyi ki buradasın.")
      `,
      feedback: {
        printComma: `<b>Tek bir</b> <code>print()</code> içinde birkaç parçayı virgülle ayırarak yazdır: <code>print("A", "B")</code>.`,
        newline: `Yeni bir satıra geçmek için metnin içinde <code>\\n</code> kullan.`,
      },
    },
  },

  "s1-l2": {
    title: `Değişkenlerle bilgi sakla`,
    story: `İstasyon hafızasını kaybetmiş. Ona bir şeyleri aklında tutmayı öğret, en sevdiğin sayıyla başla.`,
    intro: `
<p><b>Değişken</b>, adı olan bir kutu gibidir. Eşittir işaretiyle (<code>=</code>) kutunun içine
bir şey koyarsın; buna “atama” denir. Sonra bu adı kullanarak değere yeniden ulaşabilirsin.</p>

<pre><code>en_sevdigin_sayi = 7
print(en_sevdigin_sayi)</code></pre>

<p><b>Ad</b>, <code>=</code> işaretinin soluna, <b>değer</b> ise sağına yazılır. Buradaki
<code>=</code> matematikteki gibi “eşittir” anlamına gelmez, “şu değeri alır” demektir. Python
aslında Türkçe harfleri de kabul eder, ama değişken adlarında ç, ğ, ı, ö, ş, ü yerine c, g, i, o,
s, u kullanmak yaygın bir alışkanlıktır. Bu yüzden <code>en_sevdiğin_sayı</code> yerine
<code>en_sevdigin_sayi</code> yazıyoruz.</p>

<p><b>Sayı mı, metin mi?</b> Sayıları tırnak <i>olmadan</i> yazarsın (<code>7</code>). Bir
<i>değişkeni</i> yazdırmak için de adını parantezin içine <b>tırnaksız</b> yazarsın:
<code>print(en_sevdigin_sayi)</code> ekrana <code>7</code> yazar.
<code>print("en_sevdigin_sayi")</code> ise sadece bu kelimeyi olduğu gibi yazar.</p>`,
    taskHtml: `<b>En sevdiğin sayıyı</b> değişkene kaydet ve <code>print()</code> ile yazdır. Değişkenin adını tırnaksız yazmayı unutma!`,
    hints: [
      `Önce ata: <code>en_sevdigin_sayi = 42</code>`,
      `Sonra yazdır: <code>print(en_sevdigin_sayi)</code>`,
    ],
    starterCode: py`
      en_sevdigin_sayi = 0
      # 0 yerine en sevdiğin sayıyı koy ve onu yazdır
    `,
    solution: py`
      en_sevdigin_sayi = 42
      print(en_sevdigin_sayi)
    `,
    feedback: {
      printName: `<b>Değişkeni</b> yazdır: Adı parantezin içine <b>tırnaksız</b> yazılır, yani <code>print(en_sevdigin_sayi)</code>.`,
      needNumber: `Değişkene tırnaksız bir <b>sayı</b> kaydet, örneğin <code>en_sevdigin_sayi = 7</code>.`,
    },
    expert: {
      html: `
<p>Bir değişkenin değeri <b>değişebilir</b>. <code>puan = puan + 50</code> eski değeri alır, üstüne
50 ekler ve sonucu yine aynı kutuya koyar. Adlarda harf, rakam ve <code>_</code> kullanabilirsin,
ama bir ad rakamla başlayamaz.</p>
<p><b>Bonus:</b> <code>puan = 100</code> diye bir değişken oluştur, sonra değerini 50 artır ve yazdır.</p>`,
      solution: py`
        puan = 100
        puan = puan + 50
        print(puan)
      `,
      feedback: {
        selfUpdate: `Değeri <code>puan = puan + 50</code> ile artır (kısaca <code>puan += 50</code> da olur).`,
        result150: `Sonunda ekranda 150 yazmalı.`,
      },
    },
  },

  "s1-l3": {
    title: `Kumbara hesabı`,
    story: `Ana bilgisayarda mürettebattan kalma eski bir hesap problemi takılı kalmış. Ona istasyonun yeniden hesap yapabildiğini göster.`,
    intro: `
<p>Python aynı zamanda çok iyi bir hesap makinesidir. <code>+</code> (artı), <code>-</code> (eksi),
<code>*</code> (çarpı) ve <code>/</code> (bölü) ile hesap yaparsın. Yani “×” yerine <code>*</code>,
“÷” yerine de <code>/</code> kullanılır.</p>

<p><b>Önemli:</b> Sayıları tırnaksız yaz. Yoksa Python onları metin sanır ve hesap yapmaz
(<code>"5" + "3"</code> işleminin sonucu <code>8</code> değil, <code>"53"</code> olur!).</p>

<pre><code>haftalik = 5
hafta = 8
print(haftalik * hafta)</code></pre>

<p>Değişkenlerin güzel yanı şu: Bir değer değişirse program hesabı kendiliğinden yeniden yapar.
Mia her hafta harçlığından biraz kenara koyuyor. Onun değişkenleriyle hesap yap.</p>`,
    taskHtml: `Mia haftada <b>5&nbsp;€</b> biriktirirse <b>8 hafta</b> sonra ne kadar parası olur? İki değişkenle hesapla ve sonucu yazdır. (Kontrol için: Sonuç 40.)`,
    hints: [`Çarpma işlemi <code>*</code> ile yapılır.`, `<code>print(haftalik * hafta)</code>`],
    starterCode: py`
      haftalik = 5
      hafta = 8
      # Birikimi hesapla ve yazdır
    `,
    solution: py`
      haftalik = 5
      hafta = 8
      print(haftalik * hafta)
    `,
    feedback: {
      needMult: `Hesabı Python yapsın: Çarpma işlemi <code>*</code> ile yapılır.`,
      useVars: `Sabit sayılar yerine <b>değişkenlerle</b> hesapla: <code>haftalik * hafta</code>. Böylece değerlerden biri değişse bile sonuç doğru çıkar.`,
      result40: `Sonuç 40 olmalı. Hesabını bir kontrol et.`,
    },
    expert: {
      html: `
<p>100&nbsp;€ kaç <b>tam</b> haftada birikir? <code>//</code> operatörü bölme yapar ve virgülden
sonrasını atar (<code>100 // 5</code> işleminin sonucu 20).</p>
<p><b>Bonus:</b> <code>hedef = 100</code> diye bir değişken oluştur ve Mia'nın kaç haftaya ihtiyacı
olduğunu <code>//</code> ile hesapla.</p>`,
      solution: py`
        haftalik = 5
        hedef = 100
        print(hedef // haftalik, "hafta")
      `,
      feedback: {
        floorDiv: `Tam sayı bölmesi için <code>//</code> kullan: <code>hedef // haftalik</code>.`,
        result20: `Sonuç 20 hafta olmalı.`,
      },
    },
  },

  "s1-l4": {
    title: `Çılgın hikâyeler`,
    story: `Telsiz yalnızca kelime kırıntıları yakalıyor: bir hayvan, bir yer. Bunlardan buz uydusunun en çılgın telsiz mesajını çıkar.`,
    intro: `
<p>Bir değişkenin içeriğini bir metnin <i>içine</i> nasıl yerleştirirsin? Normal bir string her
şeyi olduğu gibi yazar: <code>print("En sevdiğim hayvan: hayvan")</code> gerçekten de “En sevdiğim
hayvan: hayvan” yazar. Bunun çözümü <b>f-string</b>: Tırnak işaretinin hemen önüne bir <code>f</code>
koy ve değişkeni süslü parantezlerin <code>{ }</code> içine yaz.</p>

<pre><code>hayvan = "kedi"
print(f"Bir {hayvan} Python öğreniyor!")</code></pre>

<p>Buradaki <code>f</code>, “format” kelimesinden gelir. Yalnızca <code>{ }</code> içindeki adların
yerine değerleri gelir, gerisi normal metin olarak kalır. Böylece göz açıp kapayıncaya kadar
cümleler, hikâyeler ya da profil kartları oluşturursun.</p>

<p>Türkçeye özel küçük bir tüyo: Ekler kelimeye göre değişir (Ay'da ama Mars'ta). Eki doğrudan
<code>{ }</code> ifadesinin arkasına yazarsan her değere uymayabilir. “Ay üzerinde” gibi ek
gerektirmeyen kalıplar ise her değerle düzgün okunur.</p>`,
    taskHtml: `Bir <b>f-string</b> ile içinde <code>hayvan</code> ve <code>yer</code> geçen çılgın bir cümle yaz.`,
    hints: [
      `<code>print(f"...")</code> ile başla. Baştaki <code>f</code> harfini unutma!`,
      `Değişkenleri süslü parantez içine yaz: <code>{hayvan}</code> ve <code>{yer}</code>.`,
    ],
    starterCode: py`
      hayvan = "kedi"
      yer = "Ay"
      # Bir f-string ile komik bir cümle kur
    `,
    solution: py`
      hayvan = "kedi"
      yer = "Ay"
      print(f"Bir {hayvan} {yer} üzerinde dans ediyor!")
    `,
    feedback: {
      twoFields: `f-string'inde <b>iki</b> değişkeni de süslü parantez içine yaz: <code>{hayvan}</code> ve <code>{yer}</code>.`,
      valuesInOutput: `Çıktıda <code>hayvan</code> ve <code>yer</code> değişkenlerinin değerleri görünmeli. Bunun için f-string ve süslü parantez kullan.`,
    },
    expert: {
      html: `
<p><code>{ }</code> içinde <b>hesap</b> bile yapabilirsin: <code>print(f"{3 * 4} gol")</code> ekrana
“12 gol” yazar.</p>
<p><b>Bonus:</b> <code>galibiyet = 5</code> diye bir değişken oluştur ve bunun kaç puan ettiğini bir
f-string ile yazdır (galibiyet başına 3 puan). Hesabı süslü parantezlerin <i>içinde</i> yap.</p>`,
      solution: py`
        galibiyet = 5
        print(f"{galibiyet} galibiyet {galibiyet * 3} puan eder!")
      `,
      feedback: {
        calcInBraces: `Hesabı doğrudan süslü parantezlerin içinde yap: <code>{galibiyet * 3}</code>.`,
        result15: `5 galibiyet 15 puan etmeli.`,
      },
    },
  },

  "s1-l5": {
    title: `Bilgisayarla sohbet`,
    story: `İstasyon kiminle konuştuğunu merak ediyor. Ona adını sordur, sonra da seni selamlasın.`,
    intro: `
<p><code>input()</code> programını duraklatır, bir soru gösterir ve sen bir şey yazıp Enter tuşuna
basana kadar bekler. Verdiğin cevabı bir değişkende saklamak en iyisidir.</p>

<pre><code>isim = input("Adın ne? ")
print("Merhaba " + isim)</code></pre>

<p>Parantezin içindeki metin sorudur (İngilizcesi “prompt”). <code>+</code> ile iki metni
<b>uç uca ekleyebilirsin</b>. <code>"Merhaba "</code> içindeki boşluğa dikkat et.</p>

<p><b>Unutma:</b> <code>input()</code> sana <i>her zaman</i> metin verir, sayı yazsan bile. Bunu
gerçek bir sayıya nasıl çevireceğini 2. bölümde öğreneceksin.</p>`,
    taskHtml: `Kullanıcıya adını sor, ardından içinde bu adın geçtiği <b>kişisel bir selam</b> yazdır. Programı çalıştırınca aşağıdaki konsolda bir yazma alanı çıkar.`,
    hints: [`Cevap <code>isim</code> değişkeninde duruyor.`, `Birleştir: <code>print("Merhaba " + isim)</code>`],
    starterCode: py`
      isim = input("Adın ne? ")
      # Kişiyi adıyla selamla
    `,
    solution: py`
      isim = input("Adın ne? ")
      print("Hoş geldin, " + isim + "!")
    `,
    feedback: {
      nameInGreeting: `Selamda girilen ad görünmeli: <code>print("Merhaba " + isim)</code>. Burada <code>isim</code> tırnaksız yazılır.`,
    },
    expert: {
      html: `
<p><b>Bonus:</b> <b>İki</b> şey sor (örneğin kişinin adını ve yaşadığı şehri) ve cevapları bir
<b>f-string</b> ile tek bir cümlede birleştir. Bu yöntem, <code>+</code> kullanmaktan daha okunaklıdır.</p>`,
      solution: py`
        isim = input("Adın: ")
        sehir = input("Hangi şehirde yaşıyorsun? ")
        print(f"Selam {isim}! Demek {sehir} şehrinde yaşıyorsun, harika!")
      `,
      feedback: { bothInSentence: `İki cevap da cümlende geçmeli.` },
    },
  },

  "s1-boss1": {
    title: `Profil kartı oluşturucu`,
    story: `Güvenlik kapısı yalnızca kimlik kartı olan mürettebatı içeri alıyor. İstasyon seni tanısın diye bir profil kartı oluşturucu yap.`,
    intro: `
<p>Şimdi öğrendiklerini birleştirme zamanı! Birkaç soru sorup cevaplardan şık bir profil kartı
hazırlayacaksın. Bunun için <code>input()</code> (sormak), değişkenler (akılda tutmak) ve
f-string'ler (yazdırmak) gerekiyor.</p>

<pre><code>isim = input("Adın: ")
print(f"Ad: {isim}")</code></pre>

<p>İpucu: Tek bir soruyla başla, dene, sonra adım adım yenilerini ekle.</p>`,
    taskHtml: `<code>input()</code> ile en az <b>üç</b> şey sor ve f-string'ler kullanarak bütün cevapların yer aldığı bir <b>profil kartı</b> yazdır.`,
    hints: [
      `Altına bir <code>input(…)</code> daha ekle, örneğin <code>hayvan = input("En sevdiğin hayvan: ")</code>.`,
      `Her cevap için bir satır: <code>print(f"Ad: {isim}")</code>`,
    ],
    starterCode: py`
      isim = input("Adın: ")
      hobi = input("En sevdiğin hobi: ")
      # Bir şey daha sor ve f-string'lerle bir profil kartı yazdır
    `,
    solution: py`
      isim = input("Adın: ")
      hobi = input("En sevdiğin hobi: ")
      hayvan = input("En sevdiğin hayvan: ")
      print("--- PROFİL KARTI ---")
      print(f"Ad:     {isim}")
      print(f"Hobi:   {hobi}")
      print(f"Hayvan: {hayvan}")
    `,
    feedback: {
      allAnswers: `Profil kartında <b>bütün</b> cevaplar görünmeli. Her değişkeni bir f-string ile yazdır.`,
    },
    expert: {
      html: `
<p>Kartını biraz süsle: Karakterlerden yapılmış bir çerçeve çok iyi durur. <code>"=" * 20</code>,
20 tane eşittir işaretinden oluşan bir çizgi yapar.</p>
<p><b>Bonus:</b> Profil kartının üstüne ve altına böyle bir çizgi ekle (en az 10 karakter uzunluğunda).</p>`,
      solution: py`
        isim = input("Adın: ")
        hobi = input("En sevdiğin hobi: ")
        hayvan = input("En sevdiğin hayvan: ")
        print("=" * 24)
        print(f"  PROFİL KARTI: {isim}")
        print(f"  Hobi: {hobi} · Hayvan: {hayvan}")
        print("=" * 24)
      `,
      feedback: { frame: `Profil kartının üstüne ve altına bir çizgi yazdır, örneğin <code>print("=" * 20)</code>.` },
    },
  },

  // ================================================================== BÖLÜM 2
  "s2-l1": {
    title: `Eğer … ise …`,
    story: `Hangar kapısı ancak yeterince enerji puanı varsa açılıyor. Ona kibarca “hayır” demeyi de öğret.`,
    intro: `
<p>Programlar <b>karar vermek</b> zorundadır. <code>if</code> (“eğer”) ile bir koşulu kontrol
edersin: Koşul doğruysa altındaki girintili blok çalışır. <code>else</code> (“değilse”) ise diğer
durumdur.</p>

<pre><code>puan = 120
if puan &gt;= 100:
    print("Seviyeyi geçtin!")
else:
    print("Az kaldı! Devam et.")</code></pre>

<p><b>Python iki kurala çok dikkat eder:</b> Koşuldan sonra bir <b>iki nokta üst üste</b>
<code>:</code> gelir ve koşula ait satırlar <b>girintili</b> yazılır (4 boşluk; Tab tuşu bunu
senin yerine yapar).</p>

<p>Karşılaştırma için <code>==</code> (eşit), <code>!=</code> (eşit değil), <code>&lt;</code>,
<code>&gt;</code>, <code>&lt;=</code> ve <code>&gt;=</code> kullanılır. Dikkat: <code>==</code>
“eşit mi?” diye sorar, <code>=</code> ise atama yapar.</p>

<p><b>Yeni: Sayı girmek.</b> <code>input()</code> her zaman metin verir. <code>int(…)</code> ile
onu, Python'un karşılaştırma ve hesap yapabileceği bir tam sayıya çevirirsin:</p>
<pre><code>puan = int(input("Kaç puanın var? "))</code></pre>`,
    taskHtml: `Puan <b>100'den az</b> olduğunda moral veren bir mesaj yazdıran bir <code>else</code> bloğu ekle. Programını önce 120, sonra 50 ile dene.`,
    hints: [
      `<code>else:</code>, <code>if</code> ile aynı hizada başlar ve sonunda iki nokta üst üste vardır.`,
      `Altındaki satırı girintili yaz: <code>    print("Az kaldı! Çalışmaya devam!")</code>`,
    ],
    starterCode: py`
      puan = int(input("Kaç puanın var? "))
      if puan >= 100:
          print("Seviyeyi geçtin! 🎉")
      # else durumunu buraya ekle
    `,
    solution: py`
      puan = int(input("Kaç puanın var? "))
      if puan >= 100:
          print("Seviyeyi geçtin! 🎉")
      else:
          print("Az kaldı! Çalışmaya devam!")
    `,
    feedback: {
      noElseOutput: `50 puanda henüz hiçbir şey görünmüyor. <code>else</code> bloğunda bir mesaj yazdır.`,
      sameOutput: `120 puanda da 50 puanda da aynı şey çıkıyor. <code>else</code> bloğunda farklı bir mesaj olmalı.`,
      boundary: `Tam 100 puanda da seviye geçilmiş sayılır. <code>puan &gt;= 100</code> koşulunu olduğu gibi bırak.`,
    },
    expert: {
      html: `
<p>İkiden fazla durum için <code>elif</code> (“değilse eğer”) vardır. Python koşulları yukarıdan
aşağıya doğru kontrol eder ve doğru olan ilk koşulu seçer.</p>
<p><b>Bonus:</b> Üç kademe kur: 100 ve üstü puanda “Seviyeyi geçtin”, 50 ve üstünde “Az kaldı”,
diğer durumlarda “Çalışmaya devam”.</p>`,
      solution: py`
        puan = int(input("Kaç puanın var? "))
        if puan >= 100:
            print("Seviyeyi geçtin! 🎉")
        elif puan >= 50:
            print("Az kaldı!")
        else:
            print("Çalışmaya devam!")
      `,
      feedback: { threeCases: `120, 70 ve 10 puanda her seferinde farklı bir mesaj görünmeli.` },
    },
  },

  "s2-l2": {
    title: `Doğru mu, yanlış mı?`,
    story: `Hangardaki sensörler artık yalnızca True ya da False bildiriyor. Onların dilini anlayıp anlamadığını sına.`,
    intro: `
<p>Her karşılaştırmanın bir sonucu vardır: <code>True</code> (doğru) ya da <code>False</code>
(yanlış). Buna <b>mantıksal değer</b> denir (İngilizcesi <i>boolean</i>). <code>if</code>
kararını tam olarak bununla verir.</p>

<pre><code>print(10 &gt; 3)    # True
print(5 == 6)   # False</code></pre>

<p><code>#</code> işaretinden sonra gelen her şey bir <b>yorumdur</b>. Yorumlar insanlar için
yazılmış notlardır, Python onları atlar.</p>`,
    taskHtml: `<b>En az üç farklı karşılaştırmanın</b> sonucunu yazdır. En az biri <code>False</code> çıkmalı.`,
    hints: [
      `Karşılaştırmayı doğrudan yazdır: <code>print(7 &gt; 2)</code>`,
      `<code>False</code> için örneğin: <code>print(5 == 6)</code>`,
    ],
    starterCode: py`
      # Python'a en az üç karşılaştırma yaptır
      print(10 > 3)
    `,
    solution: py`
      print(10 > 3)
      print(5 == 5)
      print("elma" == "armut")
    `,
    feedback: {
      threeCompares: `En az üç karşılaştırma gerekiyor, örneğin <code>&gt;</code>, <code>&lt;</code> ve <code>==</code> ile.`,
      printResults: `Her karşılaştırmanın sonucunu <code>print(…)</code> ile yazdır.`,
      needFalse: `Karşılaştırmalardan en az biri <code>False</code> çıkmalı, örneğin <code>print(5 == 6)</code>.`,
    },
    expert: {
      html: `
<p>Koşulları <b>birleştirebilirsin</b>: <code>and</code> (“ve”, ikisi de doğru olmalı),
<code>or</code> (“veya”, en az biri doğru olmalı) ve <code>not</code> (“değil”, sonucu tersine
çevirir).</p>
<p><b>Bonus:</b> <code>yas = 12</code> diye bir değişken oluştur ve yaşın 10 ile 15 arasında olup
olmadığını <code>and</code> ile kontrol et. Sonucu yazdır.</p>`,
      solution: py`
        yas = 12
        print(yas >= 10 and yas <= 15)
      `,
      feedback: {
        useAnd: `İki karşılaştırmayı <code>and</code> ile birleştir: <code>yas &gt;= 10 and yas &lt;= 15</code>.`,
        printBool: `Sonucu (<code>True</code> ya da <code>False</code>) <code>print(…)</code> ile yazdır.`,
      },
    },
  },

  "s2-l3": {
    title: `Şansa bırak`,
    story: `Mürettebatın keşif aracı oyununun zarı kaybolmuş. Lumo gerçekten rastgele atan bir zar istiyor.`,
    intro: `
<p>Şans, oyunları heyecanlı yapar. Python'un hazır araçları <b>modüllerde</b> bulunur; onları
<code>import</code> ile programına eklersin. <code>random</code> modülü zar atabilir.</p>

<pre><code>import random
zar = random.randint(1, 6)
print("Attığın sayı:", zar)</code></pre>

<p><code>random.randint(1, 6)</code>, 1 ile 6 arasında rastgele bir tam sayı verir (1 ve 6 da
dahil). <code>import random</code> satırını programın en üstüne bir kez yazman yeterli.
<code>print</code> içinde virgül kullanarak metinle sayıyı yan yana yazdırabilirsin.</p>`,
    taskHtml: `Bir <b>zar</b> yap: 1 ile 6 arasında rastgele bir sayı yazdır. Programı birkaç kez çalıştırıp sonuca bak!`,
    hints: [
      `<code>import random</code> zaten en üstte duruyor.`,
      `<code>zar = random.randint(1, 6)</code>, ardından <code>print(zar)</code>.`,
    ],
    starterCode: py`
      import random
      # 1 ile 6 arasında bir zar at ve sonucu yazdır
    `,
    solution: py`
      import random
      zar = random.randint(1, 6)
      print("Attığın sayı:", zar)
    `,
    feedback: {
      useRandint: `Rastgele bir sayı için <code>random.randint(1, 6)</code> kullan.`,
      range16: `Zarda gelen sayı 1 ile 6 arasında olmalı ve çıktının en sonunda yer almalı.`,
      notRandom: `Sayı her seferinde aynı çıkıyor. <code>random.randint(1, 6)</code> ile gelen sonucu yazdır.`,
    },
    expert: {
      html: `
<p><code>random.choice([...])</code> ile <b>bir listeden</b> rastgele bir şey seçersin. Bir
çarkıfelek için biçilmiş kaftan!</p>
<p><b>Bonus:</b> En az <b>dört</b> ödülün olduğu kendi çarkıfeleğini yap.</p>`,
      solution: py`
        import random
        oduller = ["Hiçbir şey 😅", "Bir dondurma", "5 puan", "Joker", "Büyük ödül!"]
        print("Kazandığın:", random.choice(oduller))
      `,
      feedback: {
        useChoice: `Rastgele bir ödül çekmek için <code>random.choice(oduller)</code> kullan.`,
        fourPrizes: `Listende en az dört ödül olmalı: <code>["A", "B", "C", "D"]</code>.`,
        notRandom: `Sonuç her seferinde aynı. <code>random.choice(…)</code> ile çekilen ödülü yazdır.`,
      },
    },
  },

  "s2-l4": {
    title: `Ritmi tekrarla`,
    story: `Hangardaki hoparlörler yeniden cızırdıyor. Yıllardır ilk ritmin zamanı geldi, onu tekrar tekrar çaldır!`,
    intro: `
<p>Bir satırı dört kez kopyalamak yerine onu <b>tekrar ettirebilirsin</b>. Bu işi
<code>for</code> döngüsü yapar:</p>

<pre><code>for i in range(4):
    print("Düm - Tek")</code></pre>

<p><code>range(4)</code>, <code>0, 1, 2, 3</code> diye sayar; yani döngü dört tur döner.
<code>i</code> değişkeni o anki sayaçtır. Burada da kural aynı: Satırın sonunda <b>iki nokta üst
üste</b> olur ve tekrarlanan kısım <b>girintili</b> yazılır.</p>

<p><b>Ritmini istasyonun hoparlörüyle duyulur hâle getirebilirsin.</b> Bunun için
<code>station</code> modülünden <code>drum</code> (davul) ve <code>note</code> (notalar) komutlarını
al:</p>

<pre><code>from station import drum, note

for i in range(4):
    drum("kick")
    drum("snare")
note("do5", 2)</code></pre>

<p>Davul sesleri: <code>"kick"</code>, <code>"snare"</code>, <code>"hihat"</code>, <code>"clap"</code>,
<code>"tom"</code>. Notalar: <code>"do4"</code>, <code>"re4"</code>, <code>"mi4"</code> … ya da
<code>"C4"</code>, <code>"D4"</code>, <code>"E4"</code> … Virgülden sonraki sayı, sesin kaç vuruş
süreceğini belirler (sayı yazmazsan bir vuruş sürer).</p>`,
    taskHtml: `<b>En az üç kez</b> tekrar eden bir <b><code>for</code> döngüsüyle</b> bir <b>ritim</b> oluştur. Ritmin <code>drum()</code> ya da <code>note()</code> ile duyulabilir ya da <code>print()</code> ile metin olarak yazılabilir. Komut kodda yalnızca bir kez yer alsın, tekrarı döngü yapsın.`,
    hints: [
      `<code>for i in range(4):</code> ve altına girintili olarak <code>drum("kick")</code> ya da <code>print(…)</code>.`,
      `Ses için en üstte <code>from station import drum, note</code> satırı gerekir, o satır zaten orada.`,
    ],
    starterCode: py`
      from station import drum, note

      # Ritmini bir for döngüsüyle oluştur
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
      useRange: `<code>range(…)</code> kullan, örneğin <code>for i in range(4):</code>.`,
      printInLoop: `Komutun (<code>drum</code>, <code>note</code> ya da <code>print</code>) tekrarlanması için <code>for</code> satırının altında <b>girintili</b> durması gerekir.`,
      threeTimes: `Ritmin en az üç kez duyulmalı (ya da en az üç satır yazdırmalı). <code>range(…)</code> ile daha yükseğe kadar say.`,
    },
    expert: {
      html: `
<p>Sayaç <code>i</code> çok işe yarar: Onunla çıktını numaralandırabilirsin.
<code>range(1, 6)</code> 1'den 5'e kadar sayar.</p>
<p><b>Bonus:</b> Bir döngüyle alt alta “Tur 1”, “Tur 2” … “Tur 5” yazdır.</p>`,
      solution: py`
        for i in range(1, 6):
            print(f"Tur {i}")
      `,
      feedback: {
        numbered: `Satırlar 1'den 5'e kadar numaralı olmalı: <code>range(1, 6)</code> ile <code>print(f"Tur {i}")</code>.`,
      },
    },
  },

  "s2-l5": {
    title: `Desen çiz`,
    story: `Hangar kapısındaki sinyal lambaları büyüyen bir desen göstermeli. Şu anda her sıra aynı yanıyor, bunu daha iyi yapabilirsin.`,
    intro: `
<p><code>*</code> ile sadece hesap yapmazsın, metni de <b>çoğaltabilirsin</b>:
<code>"ab" * 3</code> işleminin sonucu <code>"ababab"</code> olur. Bunu bir döngü ve sayaç
<code>i</code> ile birleştirince büyüyen desenler ortaya çıkar.</p>

<pre><code>for i in range(1, 4):
    print("#" * i)</code></pre>

<p><code>range(1, 4)</code> 1'den 3'e kadar sayar. Yani ilk turda <code>i</code> 1'dir, sonra 2,
sonra 3 olur ve satıra her seferinde o kadar karakter yazılır.</p>`,
    taskHtml: `Editördeki desen biraz sıkıcı, çünkü her satır aynı uzunlukta. Programı, her satır <b>bir öncekinden daha uzun</b> olacak şekilde değiştir. Sembolü istediğin gibi seçebilirsin.`,
    hints: [
      `<code>"#" * 3</code> işleminin sonucu <code>###</code> olur. Peki <code>"#" * i</code> neyi verir?`,
      `Sabit 3 yerine sayacı kullan: <code>print("⭐" * i)</code>`,
    ],
    starterCode: py`
      # Desen henüz sıkıcı: Her satır aynı uzunlukta.
      for i in range(1, 6):
          print("⭐" * 3)
    `,
    solution: py`
      for i in range(1, 6):
          print("⭐" * i)
    `,
    feedback: { grow: `Satırlar hâlâ aynı uzunlukta. Uzunluğu sayaçla büyüt: <code>"⭐" * i</code>.` },
    expert: {
      html: `
<p>Satır başına boşluk koyarak deseni sağa kaydırabilirsin; böylece bir <b>piramit</b> ortaya
çıkar. İpucu: Boşluk için <code>" " * (5 - i)</code>, yıldızlar için
<code>"*" * (2 * i - 1)</code>.</p>
<p><b>Bonus:</b> Aşağıya doğru genişleyen, en az dört satırlık bir piramit çiz.</p>`,
      solution: py`
        for i in range(1, 6):
            print(" " * (5 - i) + "*" * (2 * i - 1))
      `,
      feedback: {
        indent: `Her satırın başında bir öncekinden daha az boşluk olmalı: <code>" " * (5 - i)</code>.`,
        wider: `Yıldızların sayısı satırdan satıra artmalı.`,
      },
    },
  },

  "s2-l6": {
    title: `… olduğu sürece`,
    story: `Keşif aracı rampada, yola çıkmaya hazır. Bir tek geri sayım eksik.`,
    intro: `
<p><code>while</code> döngüsü, bir koşul doğru <b>olduğu sürece</b> bir şeyi tekrar eder. Kaç kez
tekrar edileceğini önceden bilmediğin durumlar için idealdir.</p>

<pre><code>sayi = 3
while sayi &gt; 0:
    print(sayi)
    sayi = sayi - 1
print("Başla!")</code></pre>

<p><b>Çok önemli:</b> Döngünün içinde, koşulu bir noktada <code>False</code> yapacak bir şey
değişmeli. Burada <code>sayi</code> her turda küçülüyor. Böyle bir değişiklik olmazsa döngü
<i>sonsuza kadar</i> döner. Panik yapma: Codaluna bunu fark eder ve programını durdurur (ya da sen
<b>Durdur</b> düğmesine basarsın).</p>`,
    taskHtml: `Bir <code>while</code> döngüsüyle <b>10'dan 1'e geri sayım</b> yap ve ardından <code>Kalkış! 🚀</code> yazdır.`,
    hints: [
      `<code>while sayi &gt; 0:</code> ve altına girintili olarak <code>print(sayi)</code>.`,
      `Döngünün içinde sayıyı küçült: <code>sayi = sayi - 1</code>. Yoksa döngü hiç bitmez!`,
    ],
    starterCode: py`
      sayi = 10
      # Bir while döngüsüyle 10'dan 1'e kadar geri say
      # ve ardından "Kalkış! 🚀" yazdır
    `,
    solution: py`
      sayi = 10
      while sayi > 0:
          print(sayi)
          sayi = sayi - 1
      print("Kalkış! 🚀")
    `,
    feedback: {
      countdown: `Çıktı 10'dan 1'e kadar geriye saymalı, her satırda bir sayı olacak şekilde.`,
      finalLine: `Döngüden sonra bir de “Kalkış! 🚀” yazdır. Yalnızca bir kez görünmesi için bu satır girintili <b>olmamalı</b>.`,
    },
    expert: {
      html: `
<p>Bir döngüde bir şeyleri <b>biriktirebilirsin</b> de: İkinci bir değişken her turda biraz daha
büyür.</p>
<p><b>Bonus:</b> Bir <code>while</code> döngüsüyle 1'den 10'a kadar bütün sayıların toplamını
hesapla ve yazdır.</p>`,
      solution: py`
        sayi = 1
        toplam = 0
        while sayi <= 10:
            toplam = toplam + sayi
            sayi = sayi + 1
        print("Toplam:", toplam)
      `,
      feedback: {
        accumulate: `Değeri değişen iki değişkene ihtiyacın var: sayaç ve toplam (<code>toplam = toplam + sayi</code>).`,
        result55: `1'den 10'a kadar sayıların toplamı 55'tir. Döngün 10'u da dahil ediyor mu?`,
      },
    },
  },

  "s2-boss2": {
    title: `Sayı tahmin oyunu`,
    story: `Hangar kapısı bir sayı şifresiyle kilitli ve kilit yalnızca “çok büyük” ya da “çok küçük” diyor. Oyunu yap ve şifreyi kır!`,
    intro: `
<p>İşte büyük klasik! Bilgisayar aklından bir sayı tutar, sen de “çok büyük” ya da “çok küçük”
ipuçlarıyla o sayıyı bulana kadar tahmin edersin. Bu bölümde öğrendiğin her şey lazım olacak:
<code>random</code>, <code>while</code>, <code>int(input())</code> ve
<code>if</code>/<code>elif</code>.</p>

<p><code>while tahmin != gizli:</code> döngüsü, tahmin doğru <b>olmadığı</b> sürece döner.
Döngüde en önemli parça hâlâ eksik: ipuçları.</p>`,
    taskHtml: `Oyunu tamamla: Döngüde, tahmine göre <b>“çok büyük”</b> ya da <b>“çok küçük”</b> yazdırılsın. Doğru tahminde ipucu çıkmasın. Sonra oyunu kendin oyna!`,
    hints: [
      `<code>if tahmin &gt; gizli:</code> → çok büyük.`,
      `<code>elif tahmin &lt; gizli:</code> → çok küçük. İkisi de döngünün içinde, <code>input</code> satırının altında girintili durur.`,
    ],
    starterCode: py`
      import random
      gizli = random.randint(1, 20)
      tahmin = 0

      while tahmin != gizli:
          tahmin = int(input("Tahminin (1-20): "))
          # Buraya bir ipucu yazdır: çok mu büyük, çok mu küçük?

      print("Buldun! 🎉")
    `,
    solution: py`
      import random
      gizli = random.randint(1, 20)
      tahmin = 0

      while tahmin != gizli:
          tahmin = int(input("Tahminin (1-20): "))
          if tahmin > gizli:
              print("çok büyük")
          elif tahmin < gizli:
              print("çok küçük")

      print("Buldun! 🎉")
    `,
    feedback: {
      tooHigh: `Tahmin çok büyük olduğunda henüz ipucu çıkmıyor. <code>if tahmin &gt; gizli:</code> ile kontrol et.`,
      tooLow: `Tahmin çok küçük olduğunda henüz ipucu çıkmıyor. <code>elif tahmin &lt; gizli:</code> ile kontrol et.`,
      highLow: `Çok büyük ve çok küçük tahminlerde aynı ipucu çıkıyor. İki durum için farklı ipuçları yazdır.`,
      winNoHint: `Doğru tahminde “çok büyük” ya da “çok küçük” çıkmamalı. <code>else:</code> yerine <code>elif tahmin &lt; gizli:</code> kullan.`,
    },
    expert: {
      html: `
<p><b>Bonus:</b> Deneme sayısını tut ve sonunda kaç denemede bulduğunu yazdır, örneğin
“3 denemede buldun!”. İpucu: Döngüden önce <code>deneme = 0</code> diye bir değişken oluştur ve
her tahminde değerini 1 artır.</p>`,
      solution: py`
        import random
        gizli = random.randint(1, 20)
        tahmin = 0
        deneme = 0

        while tahmin != gizli:
            tahmin = int(input("Tahminin (1-20): "))
            deneme = deneme + 1
            if tahmin > gizli:
                print("çok büyük")
            elif tahmin < gizli:
                print("çok küçük")

        print(f"{deneme} denemede buldun! 🎉")
      `,
      feedback: {
        counter: `Döngünün içinde bir sayacı artır: <code>deneme = deneme + 1</code>.`,
        count3: `12, 3 ve 7 tahminlerinden sonra son satırda deneme sayısı olarak 3 yazmalı. Her tahmini tam bir kez sayıyor musun?`,
        count1: `İlk seferde bilen biri için deneme sayısı 1 olmalı. Sayacın 0'dan mı başlıyor?`,
      },
    },
  },

  // ================================================================== BÖLÜM 3
  "s3-l1": {
    title: `Listeler: senin koleksiyonun`,
    story: `Laboratuvarda her şey birbirine karışmış. İşe bir listeyle başla: numuneler, gece vardiyası için şarkılar, ne istersen.`,
    intro: `
<p><b>Liste</b>, birçok değeri tek bir değişkende bir arada tutar: bir çalma listesi, bir takım ya
da bir alışveriş listesi gibi. Listeyi köşeli parantezlerin <code>[ ]</code> içine yazarsın,
elemanları da virgülle ayırırsın.</p>

<pre><code>calma_listesi = ["Şarkı A", "Şarkı B", "Şarkı C"]
print(calma_listesi)
print(calma_listesi[0])   # ilk eleman</code></pre>

<p>Tek tek elemanlara <b>konumları</b> üzerinden ulaşırsın ve konumlar 0'dan başlar!
<code>calma_listesi[0]</code> ilk eleman, <code>calma_listesi[1]</code> ise ikinci
elemandır.</p>`,
    taskHtml: `En az 3 elemanlı bir <b>liste</b> oluştur (çalma listesi, takım, en sevdiğin yemekler …). Önce listenin tamamını, sonra <b>ilk</b> elemanını tek başına yazdır.`,
    hints: [
      `Köşeli parantez, elemanlar arasında virgül: <code>yemekler = ["Lahmacun", "Mantı", "Pizza"]</code>`,
      `İlk elemanı <code>yemekler[0]</code> ile alırsın.`,
    ],
    starterCode: py`
      # En az 3 şeyden oluşan bir liste oluştur
      # Önce listeyi, sonra ilk elemanı yazdır
    `,
    solution: py`
      calma_listesi = ["Şarkı A", "Şarkı B", "Şarkı C"]
      print(calma_listesi)
      print(calma_listesi[0])
    `,
    feedback: {
      printList: `Listenin tamamını <code>print(…)</code> ile yazdır.`,
      printFirst: `Ardından ilk elemanı ayrı bir satırda yazdır. Konumlar 0'dan başlar: <code>liste[0]</code>.`,
    },
    expert: {
      html: `
<p><code>len(liste)</code> bir listede kaç eleman olduğunu söyler. <code>liste[-1]</code> ise
listeye sondan ulaşır ve sana son elemanı verir.</p>
<p><b>Bonus:</b> Listende kaç eleman olduğunu ve <code>[-1]</code> ile son elemanını yazdır.</p>`,
      solution: py`
        calma_listesi = ["Şarkı A", "Şarkı B", "Şarkı C"]
        print("Eleman sayısı:", len(calma_listesi))
        print("Son eleman:", calma_listesi[-1])
      `,
      feedback: {
        useLen: `Eleman sayısı için <code>len(liste)</code> kullan.`,
        useNeg: `Son elemanı <code>liste[-1]</code> ile alırsın.`,
        printBoth: `Eleman sayısını ve son elemanı yazdır.`,
      },
    },
  },

  "s3-l2": {
    title: `Listeleri değiştir`,
    story: `Yeni malzemeler geldi. Onları listeye ekle ve bu karmaşaya bir düzen getir.`,
    intro: `
<p>Listeler sonradan değiştirilebilir. Listenin adından sonra bir nokta koyup <b>metotları</b>
kullanırsın. Metotlar, listeye ait küçük komutlardır:</p>

<pre><code>takim = ["Yara", "Noah"]
takim.append("Lena")   # sona ekle
takim.sort()           # alfabetik sırala
print(takim)</code></pre>

<p><code>.append(x)</code>, <code>x</code> değerini listenin sonuna ekler; <code>.sort()</code>
ise listeyi sıralar. Bu metotlar listeyi doğrudan değiştirir. Bu yüzden noktadan önce listenin adı
yazılır.</p>`,
    taskHtml: `<code>.append(…)</code> ile listeye en az bir isim ekle, ardından listeyi <code>.sort()</code> ile <b>sırala</b> ve yazdır.`,
    hints: [
      `Eklemek için: <code>takim.append("Ece")</code>`,
      `Sıralamak için: <code>takim.sort()</code>, sonra <code>print(takim)</code>`,
    ],
    starterCode: py`
      takim = ["Yara", "Noah"]
      # Birini ekle, listeyi sırala ve yazdır
    `,
    solution: py`
      takim = ["Yara", "Noah"]
      takim.append("Lena")
      takim.sort()
      print(takim)
    `,
    feedback: {
      useAppend: `<code>takim.append("Ece")</code> ile birini ekle.`,
      useSort: `Listeyi <code>takim.sort()</code> ile sırala.`,
      sortNone: `Çıktıda <code>None</code> var: <code>takim.sort()</code> listeyi doğrudan sıralar ve geriye bir şey döndürmez. <code>takim = takim.sort()</code> değil, sadece <code>takim.sort()</code> yaz.`,
      threeNames: `Sonunda listede en az 3 isim olmalı.`,
      sorted: `Listeyi <b>sıralanmış</b> olarak yazdır. <code>.sort()</code> metodunu ekleme işleminden <b>sonra</b> ve <code>print</code> satırından önce mi çağırıyorsun?`,
    },
    expert: {
      html: `
<p>Başka metotlar da var: <code>.remove("x")</code> bir elemanı listeden çıkarır,
<code>.reverse()</code> sırayı tersine çevirir.</p>
<p><b>Bonus:</b> Takımdan bir ismi çıkar, sırayı tersine çevir ve sonucu yazdır.</p>`,
      solution: py`
        takim = ["Yara", "Noah", "Lena"]
        takim.remove("Noah")
        takim.reverse()
        print(takim)
      `,
      feedback: {
        useRemove: `Birini <code>takim.remove("Noah")</code> ile çıkar.`,
        useReverse: `Listeyi <code>takim.reverse()</code> ile tersine çevir.`,
      },
    },
  },

  "s3-l3": {
    title: `Her biri için …`,
    story: `Lumo listedeki her kaydı tek tek kontrol etmeli. Bir döngü bunu saniyeler içinde halleder.`,
    intro: `
<p><code>for … in liste</code> ile konum saymana gerek kalmadan listedeki <b>her elemanı</b>
sırayla dolaşırsın:</p>

<pre><code>sarkilar = ["A", "B", "C"]
for sarki in sarkilar:
    print("Şimdi çalıyor:", sarki)</code></pre>

<p><code>sarki</code> her turda listedeki bir sonraki elemandır. Bu adı istediğin gibi
seçebilirsin; <code>for x in sarkilar</code> da çalışır ama anlamlı bir ad kodu daha okunaklı
yapar.</p>`,
    taskHtml: `Bir <code>for</code> döngüsüyle listeyi dolaş ve <b>her elemanı ayrı bir satırda</b> yazdır. İstersen önüne bir metin de ekle, örneğin “Şimdi çalıyor: …”.`,
    hints: [`<code>for sarki in sarkilar:</code>`, `Altına girintili olarak: <code>print(sarki)</code>`],
    starterCode: py`
      sarkilar = ["Giriş", "Ritim 1", "Final"]
      # Her şarkıyı ayrı ayrı yazdır
    `,
    solution: py`
      sarkilar = ["Giriş", "Ritim 1", "Final"]
      for sarki in sarkilar:
          print("Şimdi çalıyor:", sarki)
    `,
    feedback: {
      loopOverList: `Döngüyü doğrudan listenin üzerinde çalıştır: <code>for sarki in sarkilar:</code>`,
      printInLoop: `<code>print(…)</code> komutu döngünün içinde, girintili durmalı.`,
      eachItem: `Listedeki her eleman çıktıda görünmeli, her satırda bir tane.`,
    },
    expert: {
      html: `
<p>Listende sayılar varsa döngünün içinde bir <b>toplam</b> hesaplayabilirsin.</p>
<p><b>Bonus:</b> <code>goller = [2, 1, 3, 0, 2]</code> listesindeki bütün golleri bir döngüyle topla
(<code>sum()</code> kullanmadan) ve toplamı yazdır.</p>`,
      solution: py`
        goller = [2, 1, 3, 0, 2]
        toplam = 0
        for g in goller:
            toplam = toplam + g
        print("Toplam gol:", toplam)
      `,
      feedback: {
        accumulate: `Döngüden önce <code>toplam = 0</code> diye bir değişken oluştur ve döngüde her golü buna ekle.`,
        result8: `Toplamda 8 gol var.`,
      },
    },
  },

  "s3-l4": {
    title: `Kendi komutlarını yaz`,
    story: `Lumo her şeyi on kez anlatmaktan bıktı. Ziyaretçileri selamlayan kendi komutunu yaz.`,
    intro: `
<p><b>Fonksiyon</b>, bir kez yazıp istediğin kadar çağırabildiğin kendi komutundur. Onu
<code>def</code> ile tanımlarsın. Parantezlerin içinde <b>parametreler</b> yer alır; bunlar,
fonksiyonun çağrıldığında aldığı değerlerdir.</p>

<pre><code>def selamla(isim):
    print(f"Merhaba {isim}! 👋")

selamla("Deniz")
selamla("Fatima")</code></pre>

<p>Girintili blok, fonksiyonun “planıdır”. Bu plan ancak fonksiyonu <b>çağırdığında</b>, verdiğin
değerle çalışır. Böylece aynı kodu tekrar tekrar yazmaktan kurtulursun.</p>`,
    taskHtml: `<code>selamla</code> fonksiyonunu <b>iki farklı isimle</b> çağır.`,
    hints: [`Çağırmak için: <code>selamla("Mia")</code>`, `Alt alta, girintisiz ve farklı isimlerle iki çağrı yaz.`],
    starterCode: py`
      def selamla(isim):
          print(f"Merhaba {isim}! 👋")

      # Fonksiyonu iki farklı isimle çağır
    `,
    solution: py`
      def selamla(isim):
          print(f"Merhaba {isim}! 👋")

      selamla("Mia")
      selamla("Kerem")
    `,
    feedback: {
      twoCalls: `Fonksiyonu her biri ayrı satırda olmak üzere iki kez çağır: <code>selamla("Mia")</code>.`,
      differentNames: `İki <b>farklı</b> isim kullan.`,
    },
    expert: {
      html: `
<p>Bir fonksiyonun virgülle ayrılmış <b>birden fazla parametresi</b> olabilir.</p>
<p><b>Bonus:</b> Örneğin “İyi sabahlar, Mia!” yazan bir <code>selamla(isim, vakit)</code>
fonksiyonu yaz ve onu iki kez çağır.</p>`,
      solution: py`
        def selamla(isim, vakit):
            print(f"İyi {vakit}, {isim}!")

        selamla("Mia", "sabahlar")
        selamla("Leo", "akşamlar")
      `,
      feedback: {
        twoParams: `Fonksiyona iki parametre ver: <code>def selamla(isim, vakit):</code>`,
        twoCalls: `Fonksiyonu iki kez çağır.`,
        useBoth: `Selamlamada iki parametre de geçmeli.`,
      },
    },
  },

  "s3-l5": {
    title: `Değer döndürmek`,
    story: `Ölçüm cihazları üç değer veriyor ama ortalama eksik. Hangi sayılar gelirse gelsin ortalamayı döndüren bir fonksiyon yaz.`,
    intro: `
<p>Fonksiyonlar <code>return</code> ile bir sonucu <b>geri döndürebilir</b>. <code>print</code>
ile farkı şu: <code>print</code> bir şeyi sadece ekranda <i>gösterir</i>; <code>return</code> ise
hesaplamaya devam edebileceğin bir değeri <i>geri verir</i>.</p>

<pre><code>def iki_kati(x):
    return x * 2

sonuc = iki_kati(5)
print(sonuc)   # 10</code></pre>

<p><code>return</code> satırından sonra fonksiyon biter ve değeri, çağrıldığı yere geri gönderir.
Bu değeri bir değişkende saklayabilir, yazdırabilir ya da başka bir hesapta kullanabilirsin.</p>`,
    taskHtml: `<code>ortalama</code> fonksiyonunu, üç sayının <b>ortalamasını</b> geri döndürecek şekilde tamamla. 2, 4 ve 6 için sonuç <b>4.0</b> olmalı; başka sayılarla da doğru çalışmalı.`,
    hints: [
      `Toplamı adede böl: <code>(a + b + c) / 3</code>. Parantezler önemli!`,
      `Sonucu <code>print</code> ile değil, <code>return</code> ile geri döndür.`,
    ],
    starterCode: py`
      def ortalama(a, b, c):
          # Üç sayının ortalamasını geri döndür
          return 0

      print(ortalama(2, 4, 6))
    `,
    solution: py`
      def ortalama(a, b, c):
          return (a + b + c) / 3

      print(ortalama(2, 4, 6))
    `,
    feedback: {
      returnsNothing: `Fonksiyonun henüz bir şey geri döndürmüyor. Fonksiyonun içinde <code>print</code> yerine <code>return</code> kullan.`,
      wrongValues: `Başka sayılar için sonuç henüz doğru değil. Hesabı <code>a</code>, <code>b</code> ve <code>c</code> ile mi yapıyorsun? Parantezlere dikkat: <code>(a + b + c) / 3</code>.`,
      printResult: `2, 4 ve 6 için sonucu yazdır: <code>print(ortalama(2, 4, 6))</code>.`,
    },
    expert: {
      html: `
<p><b>Bonus:</b> Futbol puanlarını <b>geri döndüren</b> bir <code>puan(galibiyet, beraberlik)</code>
fonksiyonu yaz (galibiyet = 3 puan, beraberlik = 1 puan) ve onunla iki takımı karşılaştır.</p>`,
      solution: py`
        def puan(galibiyet, beraberlik):
            return galibiyet * 3 + beraberlik

        print("A takımı:", puan(5, 3))
        print("B takımı:", puan(7, 1))
      `,
      feedback: {
        wrongValues: `Puanlar henüz doğru değil. Galibiyet 3, beraberlik 1 puan değerinde: <code>galibiyet * 3 + beraberlik</code>.`,
      },
    },
  },

  "s3-l6": {
    title: `Sözlükler: anahtar ve değer`,
    story: `Her mürettebat üyesinin anahtarlar ve değerlerden oluşan bir ekipman kartı var. Seninkini tamamla.`,
    intro: `
<p><b>Sözlük</b> (İngilizcesi <i>dictionary</i>), <b>anahtar</b> ve <b>değer</b> çiftlerini
saklar; tıpkı gerçek bir sözlük (kelime → anlam) ya da bir profil kartı gibi. Süslü parantez
<code>{ }</code> kullanılır, anahtarla değerin arasına iki nokta üst üste konur, çiftler de
virgülle ayrılır:</p>

<pre><code>kahraman = {"isim": "Ada", "seviye": 3}
print(kahraman["isim"])     # Ada
print(kahraman["seviye"])   # 3</code></pre>

<p>Listelerde elemanlara <b>konumla</b> ulaşırken burada <b>anahtarı</b> kullanırsın:
<code>kahraman["isim"]</code>. Birbirine ait bilgileri bir arada tutmak için harikadır.</p>`,
    taskHtml: `Sözlüğü en az <b>üç</b> çifte çıkar (örneğin bir silah, bir evcil hayvan ya da bir renk ekleyerek) ve <b>iki değeri</b> anahtarları üzerinden yazdır.`,
    hints: [
      `Bir çift daha: <code>kahraman = {"isim": "Ada", "seviye": 3, "renk": "Mor"}</code>`,
      `Anahtarla erişim: <code>print(kahraman["renk"])</code>`,
    ],
    starterCode: py`
      kahraman = {"isim": "Ada", "seviye": 3}
      # Üçüncü bir çift ekle ve iki değeri yazdır
    `,
    solution: py`
      kahraman = {"isim": "Ada", "seviye": 3, "renk": "Mor"}
      print(kahraman["isim"])
      print(kahraman["renk"])
    `,
    feedback: {
      accessByKey: `İki değeri anahtarları üzerinden al: <code>kahraman["isim"]</code>.`,
      printValues: `Sözlükten en az iki değer yazdır.`,
    },
    expert: {
      html: `
<p>Yeni bir çifti şöyle eklersin: <code>kahraman["puan"] = 100</code>.
<code>for anahtar in kahraman:</code> ile de bütün anahtarları dolaşırsın.</p>
<p><b>Bonus:</b> Yeni bir çift ekle, sonra bir döngüyle bütün çiftleri yazdır.</p>`,
      solution: py`
        kahraman = {"isim": "Ada", "seviye": 3}
        kahraman["puan"] = 100
        for anahtar in kahraman:
            print(anahtar, "=", kahraman[anahtar])
      `,
      feedback: {
        addKey: `Bir çift ekle: <code>kahraman["puan"] = 100</code>.`,
        loopDict: `<code>for anahtar in kahraman:</code> ile bütün anahtarları dolaş.`,
      },
    },
  },

  "s3-boss3": {
    title: `Kendi bilgi yarışman`,
    story: `İstasyonun yapay zekâsı laboratuvara yalnızca bilgi yarışmasını geçen mürettebatı alıyor. Bu kez rolleri değiştir ve yarışmayı sen hazırla!`,
    intro: `
<p>İstediğin bir konuda (hayvanlar, müzik, spor, uzay …) küçük bir <b>bilgi yarışması</b>
hazırla. Yarışman <code>input()</code> ile sorular sorsun, cevapları <code>if</code> ile kontrol
etsin ve puanları bir değişkenle saysın.</p>

<pre><code>puan = 0
cevap = input("Soru? ")
if cevap == "doğru":
    puan = puan + 1</code></pre>

<p>İpucu: <code>cevap.lower()</code> ile büyük/küçük harf farkına takılmadan karşılaştırma
yaparsın; böylece “Roma” da “roma” da doğru sayılır. Küçük bir uyarı: <code>lower()</code>
Türkçedeki I/ı ve İ/i farkını bilmez, o yüzden bu harfleri içeren cevaplarda (örneğin İstanbul)
dikkatli ol.</p>`,
    taskHtml: `Yarışmaya <b>en az iki soru daha</b> ekle (toplamda üç soru olsun). Her doğru cevap için puan ver ve en sonda toplam puanı yazdır.`,
    hints: [
      `Her soru için bir <code>input(…)</code> ve bir <code>if</code>/<code>else</code>.`,
      `Cevap doğruysa: <code>puan = puan + 1</code>. Toplam puan en sonda yazdırılır.`,
    ],
    starterCode: py`
      puan = 0

      cevap = input("Bir örümceğin kaç bacağı var? ")
      if cevap == "8":
          puan = puan + 1
          print("Doğru! 🕷️")
      else:
          print("Olmadı, doğru cevap 8.")

      # Buraya en az iki soru daha ekle

      print("Puan:", puan)
    `,
    solution: py`
      puan = 0

      cevap = input("Bir örümceğin kaç bacağı var? ")
      if cevap == "8":
          puan = puan + 1
          print("Doğru! 🕷️")
      else:
          print("Olmadı, doğru cevap 8.")

      cevap = input("İtalya'nın başkenti neresi? ")
      if cevap.lower() == "roma":
          puan = puan + 1
          print("Doğru! 🇮🇹")
      else:
          print("Cevap Roma'ydı.")

      cevap = input("En büyük gezegen hangisi? ")
      if cevap.lower() == "jüpiter":
          puan = puan + 1
          print("Doğru! 🪐")
      else:
          print("Cevap Jüpiter'di.")

      print("Puan:", puan)
    `,
    feedback: {
      ifPerQuestion: `Her cevabı ayrı bir <code>if</code> ile kontrol et.`,
      countPoints: `Her doğru cevapta puanı artır: <code>puan = puan + 1</code>.`,
      scoreAtEnd: `En sonda toplam puanı yazdır, örneğin <code>print("Puan:", puan)</code>.`,
    },
    expert: {
      html: `
<p>Profesyonel yöntem: Soruları bir <b>sözlük listesi</b> olarak sakla
(<code>{"soru": …, "cevap": …}</code>) ve hepsini <b>tek bir</b> döngüyle dolaş. Böylece kaç soru
olursa olsun, bir sorunun kodunu yalnızca bir kez yazarsın.</p>
<p><b>Bonus:</b> Yarışmanı bu şekilde yeniden kur (listede en az iki soru olsun).</p>`,
      solution: py`
        sorular = [
            {"soru": "Bir örümceğin kaç bacağı var? ", "cevap": "8"},
            {"soru": "İtalya'nın başkenti neresi? ", "cevap": "roma"},
            {"soru": "En büyük gezegen hangisi? ", "cevap": "jüpiter"},
        ]
        puan = 0
        for s in sorular:
            cevap = input(s["soru"])
            if cevap.lower() == s["cevap"]:
                puan = puan + 1
                print("Doğru!")
            else:
                print("Maalesef yanlış, doğru cevap:", s["cevap"])
        print("Puan:", puan, "/", len(sorular))
      `,
      feedback: {
        listOfDicts: `En az iki sözlükten oluşan bir liste oluştur: <code>[{"soru": …, "cevap": …}, …]</code>.`,
        inputInLoop: `Soruları döngünün <b>içinde</b> sor: <code>cevap = input(s["soru"])</code>.`,
      },
    },
  },

  // ================================================================== BÖLÜM 4
  "s4-l1": {
    title: `Oyun motoru`,
    story: `Kontrol merkezinde mürettebattan kalma eski bir oyun makinesi duruyor. Kalbi olan oyun döngüsü eksik, onu yeniden yap.`,
    intro: `
<p>Birçok oyunun bir <b>oyun döngüsü</b> vardır: Karakterin canı ya da enerjisi bitene kadar oyun
devam eder. Bu, değişen bir değerin etrafında dönen bir <code>while</code> döngüsüdür.</p>

<pre><code>can = 3
while can &gt; 0:
    print("Kalan can:", can)
    can = can - 1
print("Game Over")</code></pre>

<p><code>can</code> değeri oyunun <b>durumunu</b> gösterir. İşin içine şans girince oyun
heyecanlanır: Her turda farklı miktarda hasar alınırsa oyunun ne kadar süreceğini kimse önceden
bilemez.</p>`,
    taskHtml: `<b>Oyun döngüsünü</b> kur: <code>enerji</code> 0'dan büyük olduğu sürece oyun 1 ile 6 arasında bir hasar zarı atsın, hasarı enerjiden düşsün, turu ve enerjiyi yazdırsın. Döngü bitince “Game Over” yazsın.`,
    hints: [
      `<code>while enerji &gt; 0:</code> satırının altında, her turda olacak her şeyi girintili yaz.`,
      `Döngünün içinde: <code>hasar = random.randint(1, 6)</code>, sonra <code>enerji = enerji - hasar</code>.`,
    ],
    starterCode: py`
      import random
      enerji = 20
      tur = 1
      # Oyun döngüsü: enerji 0'dan büyük olduğu sürece …
      #   1. 1 ile 6 arasında bir hasar zarı at
      #   2. hasarı enerjiden düş
      #   3. turu ve enerjiyi yazdır
      #   4. tur değerini 1 artır
      print("Game Over")
    `,
    solution: py`
      import random
      enerji = 20
      tur = 1
      while enerji > 0:
          hasar = random.randint(1, 6)
          enerji = enerji - hasar
          print(f"Tur {tur}: -{hasar} → Enerji {enerji}")
          tur = tur + 1
      print("Game Over")
    `,
    feedback: {
      randomInLoop: `Her tur farklı olsun diye hasarı döngünün <b>içinde</b> <code>random.randint(1, 6)</code> ile belirle.`,
      rounds: `Her turda bir şey yazdır, örneğin turu ve enerjiyi.`,
      gameOver: `Döngüden sonra her zaman “Game Over” yazmalı. Bu satır girintili <b>olmamalı</b>.`,
    },
    expert: {
      html: `
<p><b>Bonus:</b> Oyun bitince kaç tur sürdüğünü yazdır, örneğin “6 tur dayandın!”. Dikkat:
<code>tur</code> 1'den başlıyor ve her turun sonunda artıyor. O hâlde 4 tur sonra <code>tur</code>
değişkeninde hangi sayı yazar?</p>`,
      solution: py`
        import random
        enerji = 20
        tur = 1
        while enerji > 0:
            hasar = random.randint(1, 6)
            enerji = enerji - hasar
            print(f"Tur {tur}: -{hasar} → Enerji {enerji}")
            tur = tur + 1
        print("Game Over")
        print(f"{tur - 1} tur dayandın!")
      `,
      feedback: {
        rounds: `En sonda kaç tur sürdüğünü yazdır.`,
        count4: `20 enerjiyle ve her seferinde 5 hasarla oyun tam 4 tur sürer. Unutma: Son turdan sonra <code>tur</code> zaten bir fazladır.`,
        count20: `Her seferinde 1 hasarla oyun 20 tur sürer. Her turu tam bir kez sayıyor musun?`,
      },
    },
  },

  "s4-l2": {
    title: `Gizli şifreler`,
    story: `Yabancı bir sinyal geldi ama şifreli. Her harfi kaydır ve içinde ne yazdığını bul.`,
    intro: `
<p>Şifrelemek çok eğlenceli! <b>Sezar şifresinde</b> her harf, sabit bir sayı kadar kaydırılır.
Bunun için iki araca ihtiyacın var: <code>ord()</code> bir harfi numarasına çevirir,
<code>chr()</code> ise bir numarayı yeniden harfe dönüştürür.</p>

<pre><code>print(ord("A"))   # 65
print(chr(66))    # B</code></pre>

<p>Her harfi tek tek dolaşıp numarasını artırırsan gizli bir metin ortaya çıkar. Şifreyi çözmek
için de harfleri ters yöne kaydırman yeterli:</p>

<pre><code>gizli = ""
for harf in "MERHABA":
    gizli = gizli + chr(ord(harf) + 1)
print(gizli)   # NFSIBCB</code></pre>`,
    taskHtml: `Gizli mesajı çöz: Her harfi <code>ord()</code> ve <code>chr()</code> ile <b>1 geri</b> kaydır. Ortaya ne çıkıyor?`,
    hints: [
      `<code>ord(harf)</code> numarayı verir, <code>- 1</code> geri kaydırır, <code>chr(…)</code> de sonucu yeniden harfe çevirir.`,
      `<code>acik_metin = acik_metin + chr(ord(harf) - 1)</code>`,
    ],
    starterCode: py`
      gizli = "QZUIPO"   # her harf 1 kaydırılmış
      acik_metin = ""
      for harf in gizli:
          # Her harfi 1 geri kaydır
          acik_metin = acik_metin + harf
      print(acik_metin)
    `,
    solution: py`
      gizli = "QZUIPO"
      acik_metin = ""
      for harf in gizli:
          acik_metin = acik_metin + chr(ord(harf) - 1)
      print(acik_metin)
    `,
    feedback: {
      useOrdChr: `Her harfi kaydırmak için <code>ord()</code> ve <code>chr()</code> kullan.`,
      decrypt: `Mesaj henüz çözülmedi. Harfleri 1 <b>geri</b> kaydır: <code>chr(ord(harf) - 1)</code>.`,
    },
    expert: {
      html: `
<p>Gerçek Sezar şifreleri genellikle 3 harf kaydırır. Peki <code>"Z"</code> + 3 olunca ne olur?
Z'den sonra yeniden A'dan devam etmek için bölmeden kalanı kullanırız: <code>% 26</code>. Büyük
harfler için formül şöyle: <code>chr((ord(h) - 65 + kaydirma) % 26 + 65)</code>. Burada İngiliz
alfabesinin 26 harfiyle çalışıyoruz; Ç, Ğ, İ, Ö, Ş, Ü gibi harfler olduğu gibi kalır.</p>
<p><b>Bonus:</b> Büyük harfleri kaydıran (Z'yi geçince de doğru çalışan), boşluk gibi diğer bütün
karakterleri ise olduğu gibi bırakan bir <code>sezar(metin, kaydirma)</code> fonksiyonu yaz.
Kaydırma negatif olursa fonksiyon şifreyi geri çözsün.</p>`,
      solution: py`
        def sezar(metin, kaydirma):
            sonuc = ""
            for h in metin:
                if "A" <= h <= "Z":
                    sonuc = sonuc + chr((ord(h) - 65 + kaydirma) % 26 + 65)
                else:
                    sonuc = sonuc + h
            return sonuc

        gizli = sezar("MERHABA DOST", 3)
        print(gizli)
        print(sezar(gizli, -3))
      `,
      feedback: {
        useMod: `Z'den sonra yeniden A'ya dönmek için <code>% 26</code> kullan.`,
        shift: `<code>sezar("HALLO", 3)</code> çağrısı <code>"KDOOR"</code> döndürmeli.`,
        wrap: `<code>sezar("XYZ", 3)</code> çağrısı <code>"ABC"</code> döndürmeli; Z'den sonra yeniden A gelir.`,
        spaces: `Boşluklar ve diğer karakterler değişmeden kalmalı.`,
        decryptBack: `Kaydırma negatif olduğunda fonksiyon şifreyi geri çözmeli.`,
      },
    },
  },

  "s4-l3": {
    title: `Kodla çizim`,
    story: `Kontrol merkezindeki büyük ekran yeniden açıldı ama henüz bomboş. İlk resmi sen çiz!`,
    intro: `
<p>İstasyonun <b>16 × 16 ışık noktasından</b> (piksellerden) oluşan bir ekranı var.
<code>pixel(x, y, renk)</code> ile bunlardan birini yakarsın. <code>x</code> soldan (0) sağa (15),
<code>y</code> de yukarıdan (0) aşağıya (15) doğru sayar.</p>

<pre><code>from station import pixel

for x in range(16):
    pixel(x, 12, "turkuaz")   # ekranın bir ucundan öbür ucuna bir çizgi
pixel(7, 4, "altın")</code></pre>

<p>Renkleri Türkçe ya da İngilizce adlarıyla yazabilirsin (<code>"kırmızı"</code>,
<code>"red"</code>, <code>"mavi"</code>, <code>"pembe"</code> …) ya da <code>"#ff8800"</code> gibi
bir renk koduyla verebilirsin. <code>"siyah"</code> bir pikseli yeniden söndürür,
<code>fill(renk)</code> ise bütün ekranı boyar.</p>

<p>Döngülerle çizgileri ve alanları tek bir satırla çizersin. Bir döngünün içine konan ikinci bir
döngü ise koca bir dikdörtgeni bile doldurur.</p>`,
    taskHtml: `<b>İstasyon ekranına bir resim</b> çiz. Resmin en az <b>iki renkten</b> ve en az <b>12 pikselden</b> oluşsun, bunun için de en az <b>bir döngü</b> kullan. Bir ağaç, bir roket, bir yüz, en sevdiğin logo …`,
    hints: [
      `Bir çizgiyi döngüyle çizersin: <code>for x in range(3, 13):</code> ve altına <code>pixel(x, 14, "yeşil")</code>.`,
      `İkinci renk için üstüne başka bir renkte birkaç piksel daha koyman yeterli.`,
    ],
    starterCode: py`
      from station import pixel

      # Resmini çiz: pixel(x, y, "renk")  (x ve y 0'dan 15'e kadar)
      pixel(7, 7, "altın")
    `,
    solution: py`
      from station import pixel

      # Gövde
      for y in range(10, 15):
          pixel(7, y, "kahverengi")
          pixel(8, y, "kahverengi")
      # Yapraklar
      for y in range(3, 10):
          for x in range(4, 12):
              pixel(x, y, "yeşil")
      # Elmalar
      pixel(6, 5, "kırmızı")
      pixel(9, 7, "kırmızı")
    `,
    feedback: {
      usePixel: `Pikselleri <code>pixel(x, y, "renk")</code> ile yak. Bunun için en üstte <code>from station import pixel</code> satırı olmalı.`,
      useLoop: `En az bir döngü kullan, örneğin bir çizgi için: <code>for x in range(16):</code>`,
    },
    expert: {
      html: `
<p>Piksel sanatçıları resimlerini çoğu zaman bir <b>metin listesi</b> olarak çizer. Her karakter bir
piksel olur, bir sözlük de hangi karakterin hangi renge ait olduğunu söyler.</p>
<pre><code>resim = [
    ".KK.KK.",
    "KKKKKKK",
    ".KKKKK.",
    "..KKK..",
    "...K...",
]
renkler = {"K": "kırmızı"}</code></pre>
<p><b>Bonus:</b> <b>İç içe</b> iki döngüyle en az <b>20 pikselden</b> oluşan bir resim çiz. Dıştaki
döngü satırlar (<code>y</code>) üzerinde, içteki döngü de bir satırın karakterleri (<code>x</code>)
üzerinde dolaşsın.</p>`,
      solution: py`
        from station import pixel

        resim = [
            ".KK.KK.",
            "KKKKKKK",
            "KKKBKKK",
            ".KKKKK.",
            "..KKK..",
            "...K...",
        ]
        renkler = {"K": "kırmızı", "B": "beyaz"}

        for y in range(len(resim)):
            for x in range(len(resim[y])):
                karakter = resim[y][x]
                if karakter in renkler:
                    pixel(x + 4, y + 5, renkler[karakter])
      `,
      feedback: { nested: `Bir döngüyü başka bir döngünün <b>içine</b> koy. Dıştaki döngü satırlar üzerinde, içteki de bir satırın karakterleri üzerinde dolaşsın.` },
    },
  },

  "s4-l4": {
    title: `Gerçek verileri incele`,
    story: `Dışarıdaki hava istasyonu bir hafta boyunca sıcaklık ölçtü. Bu verileri incele.`,
    intro: `
<p>Programlama, gerçek verileri anlamana yardım eder. Sayı listeleri için hazır araçlar var:
<code>max()</code> (en büyük değer), <code>min()</code> (en küçük değer), <code>sum()</code>
(toplam) ve <code>len()</code> (adet).</p>

<pre><code>sicakliklar = [21, 25, 19, 28, 23]
print("En soğuk gün:", min(sicakliklar))</code></pre>

<p><b>Ortalamayı</b> “toplam bölü adet” ile bulursun, yani <code>sum</code> ve <code>len</code>
birlikte.</p>`,
    taskHtml: `<code>max()</code> ile <b>en sıcak günü</b> bul, <code>sum()</code> ve <code>len()</code> ile de sıcaklıkların <b>ortalamasını</b> hesapla. İkisini de yazdır.`,
    hints: [
      `<code>max(sicakliklar)</code> en büyük değeri verir.`,
      `Ortalama: <code>sum(sicakliklar) / len(sicakliklar)</code>`,
    ],
    starterCode: py`
      sicakliklar = [21, 25, 19, 28, 23]
      # En sıcak günü ve ortalamayı yazdır
    `,
    solution: py`
      sicakliklar = [21, 25, 19, 28, 23]
      print("En sıcak gün:", max(sicakliklar))
      print("Ortalama:", sum(sicakliklar) / len(sicakliklar))
    `,
    feedback: {
      useMax: `En sıcak gün için <code>max(sicakliklar)</code> kullan.`,
      useSumLen: `Ortalamayı <code>sum(sicakliklar) / len(sicakliklar)</code> ile hesapla.`,
      max28: `En sıcak gün 28 dereceydi, onu yazdır.`,
      average: `Ortalama 23.2 olmalı. Toplamı adede bölüyor musun?`,
    },
    expert: {
      html: `
<p><b>Bonus:</b> Ortalamayı <code>round(deger, 1)</code> ile virgülden sonra tek basamağa yuvarla
ve bir döngüyle kaç gün sıcaklığın <b>22 derecenin üstünde</b> olduğunu bul.</p>`,
      solution: py`
        sicakliklar = [21, 25, 19, 28, 23]
        print("Ortalama:", round(sum(sicakliklar) / len(sicakliklar), 1))
        sicak = 0
        for s in sicakliklar:
            if s > 22:
                sicak = sicak + 1
        print("Sıcak gün sayısı:", sicak)
      `,
      feedback: {
        useRound: `<code>round(…, 1)</code> ile yuvarla.`,
        countLoop: `Kaç değerin 22'nin üstünde olduğunu bir <code>for</code> döngüsü ve bir <code>if</code> ile say.`,
        count3: `22 derecenin üstünde 3 gün vardı (25, 28 ve 23).`,
      },
    },
  },

  "s4-l5": {
    title: `Hata ayıklama (debug)`,
    story: `Son bir arıza kontrol merkezini kilitliyor: Kodda üç hata saklı. Onları onar ve istasyonu kurtar.`,
    intro: `
<p>Profesyoneller de hata yapar, ama hatalarını bulmayı bilirler. Buna <b>hata ayıklama</b>
(İngilizcesi <i>debugging</i>) denir. Editördeki kodda tam <b>üç hata</b> var. Kodu çalıştır,
konsoldaki açıklamayı oku (hatanın hangi satırda olduğunu da söyler!) ve hataları birer birer
düzelt. Her düzeltmeden sonra bir sonraki hata ortaya çıkabilir; bu tamamen normal.</p>

<p>En sık karşılaşılan tuzaklar: eksik bir iki nokta üst üste <code>:</code>, unutulmuş bir girinti
ya da <code>+</code> ile birleştirilmeye çalışılan metin ve sayı (bunu <code>str(…)</code>
çözer).</p>`,
    taskHtml: `Program hata vermeden çalışana kadar üç hatayı da düzelt. Sonunda ekranda üç kez “Yaşasın!” yazmalı.`,
    hints: [
      `İki hata <code>for</code> satırında ve onun altındaki satırda: iki nokta üst üste ve girinti.`,
      `Üçüncüsü: Sayıyı <code>+</code> ile eklemeden önce metne çevir: <code>str(yas + 1)</code>.`,
    ],
    starterCode: py`
      isim = "Emma"
      yas = 11
      print("Merhaba " + isim)
      print("Seneye " + (yas + 1) + " yaşında olacaksın")
      for i in range(3)
      print("Yaşasın!")
    `,
    solution: py`
      isim = "Emma"
      yas = 11
      print("Merhaba " + isim)
      print("Seneye " + str(yas + 1) + " yaşında olacaksın")
      for i in range(3):
          print("Yaşasın!")
    `,
    feedback: {
      keepLoop: `Döngüyü silme, onu düzelt.`,
      allLines: `Bütün satırlar yazdırılmalı. Komutları silme, onları düzelt.`,
      age: `Çıktıda Emma'nın seneye kaç yaşında olacağı (12) yazmalı. <code>str(yas + 1)</code> kullan.`,
      threeHurra: `“Yaşasın!” üç kez görünmeli. Bunun için <code>print</code> satırı döngünün içinde, girintili durmalı.`,
    },
    expert: {
      html: `
<p>Bazı hataları önceden tahmin edebilirsin; örneğin biri sayı beklenen yere harf yazdığında.
<code>try:</code> ve <code>except ValueError:</code> ile programın çökmesine izin vermeden bu
hatayı yakalarsın.</p>
<p><b>Bonus:</b> Yaşı <code>int(input(…))</code> ile sor. Bir sayı girilirse seneye kaç yaşında
olacağını, harf girilirse nazik bir mesaj yazdır.</p>`,
      solution: py`
        try:
            yas = int(input("Kaç yaşındasın? "))
            print("Seneye", yas + 1, "yaşında olacaksın.")
        except ValueError:
            print("Lütfen bir tam sayı gir.")
      `,
      feedback: {
        useTry: `Dönüştürme işlemini bir <code>try:</code> bloğuna koy ve hatayı <code>except ValueError:</code> ile yakala.`,
        useInput: `Yaşı <code>int(input(…))</code> ile sor.`,
        friendly: `Harf girildiğinde nazik bir mesaj görünmeli.`,
        normalCase: `11 girildiğinde program 12 yazmalı.`,
      },
    },
  },

  "s4-boss4": {
    title: `Kendi projen`,
    story: `Polaris İstasyonu yeniden çalışıyor! Şimdi bir tek senin modülün eksik, daha önce hiç görülmemiş bir şey.`,
    intro: `
<p>Büyük final: <b>Kendine ait bir şey yap!</b> Bir oyun, bir hikâye, bir bilgi yarışması ya da işe
yarar bir araç olabilir. Öğrendiklerini kullan: <code>input()</code>, <code>if</code>, döngüler,
listeler, sözlükler, kendi fonksiyonların, <code>random</code> …</p>

<p>Mükemmel olması gerekmiyor, önemli olan senin eserin olması. Küçük başla, sık sık dene ve parça
parça geliştir. Bitirdiğinde diploman seni bekliyor. 🚀</p>`,
    taskHtml: `Kurstan en az <b>üç yapı taşı</b> kullanan (<code>input()</code>, <code>if</code>, bir döngü, bir liste ya da sözlük, kendi fonksiyonun, <code>random</code>) ve hatasız çalışan kendi programını yaz. Yaratıcı ol, bu senin ustalık eserin!`,
    hints: [
      `Küçük başla: Önce bir şey yazdır, sonra adım adım geliştir.`,
      `Fikirler: puan tutan bir zar oyunu, bir listedeki kelimeleri soran bir İngilizce kelime yarışması ya da hesabı bir fonksiyonla yapan bir harçlık planlayıcısı.`,
    ],
    starterCode: py`
      # 🌟 Senin projen. Birkaç fikir:
      #  - seçimlere göre ilerleyen bir metin macerası (if/else)
      #  - en sevdiğin konuda bir bilgi yarışması
      #  - bir zar oyunu ya da matematik antrenörü
      #  - işe yarar bir araç (birim çevirici, fikir üretici)

      print("Projem başlıyor …")
    `,
    solution: py`
      import random

      cevaplar = ["Evet, hiç şüphen olmasın!", "Pek sanmıyorum …", "Sonra tekrar sor", "Kesinlikle!"]

      def kahin():
          return random.choice(cevaplar)

      print("🎲 Şans Kâhini 🎲")
      for tur in range(3):
          soru = input("Bana evet/hayır sorusu sor: ")
          if soru == "":
              print("Hiçbir şey sormadın ki!")
          else:
              print(kahin())
    `,
    feedback: {
      blocks: `Programın şu an yapı taşlarından yalnızca {n} tanesini kullanıyor. Birkaç tane daha ekle, örneğin bir döngü, bir liste ya da kendi fonksiyonun.`,
      tooShort: `Projen biraz daha büyüyebilir; en az 6 satır kod olsun.`,
    },
  },

  // ================================================================== DIŞ GÖREVLER (yan görevler)
  "d-1": {
    title: `İlk uçuş`,
    story: `İstasyonun dışında buz pırıl pırıl parlıyor. Lumo dışarı uçabilir, ama yalnızca senin komutlarınla. Lumo'yu şarj istasyonuna götür!`,
    intro: `
<p>Burada Lumo'yu doğrudan Python ile yönetiyorsun. Uçuş komutlarını
<code>from drone import *</code> ile alırsın. Yıldız işareti “bütün komutlar” demek.</p>

<pre><code>from drone import *

move()
move()</code></pre>

<p><code>move()</code> Lumo'yu okun gösterdiği yönde bir kare ileri uçurur. Hedef
<b>şarj istasyonu</b> ⚡. Lumo bir duvara çarparsa dert etme: Küçük bir arıza çıkar, sen de
yeniden denersin.</p>`,
    taskHtml: `Lumo'yu <b>şarj istasyonuna</b> ⚡ götür. Kareleri say!`,
    hints: [`Her kare için ayrı bir <code>move()</code> gerekir.`, `Beş kare var: alt alta beş kez <code>move()</code>.`],
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
    title: `Köşeyi dön`,
    story: `Şarj istasyonu bir buz duvarının arkasında. Lumo'nun dönmesi gerekiyor; neyse ki bir drone olduğu yerde dönebilir.`,
    intro: `
<p><code>turn_left()</code> Lumo'yu olduğu yerde sola, çeyrek tur döndürür. Sağa dönmek için bir
komut yok. Yine de sağa gidilebilir mi? Bunu ileride keşfedeceksin.</p>

<pre><code>from drone import *

move()
turn_left()
move()</code></pre>`,
    taskHtml: `Lumo'yu köşeden döndürüp şarj istasyonuna ⚡ uçur.`,
    hints: [
      `Önce duvarın önüne kadar dümdüz git, sonra <code>turn_left()</code>, ardından <code>move()</code> ile devam et.`,
      `Dört kez <code>move()</code>, bir kez <code>turn_left()</code>, iki kez <code>move()</code>.`,
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
      html: `<p><b>Bonus:</b> Lumo şarj istasyonuna vardığında en sonunda <b>sola</b> (batıya) baksın ki kamerası istasyonu görsün.</p>`,
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
      feedback: { faceWest: `Lumo doğru yerde duruyor ama henüz sola bakmıyor. Bir dönüş eksik.` },
    },
  },

  "d-3": {
    title: `Kristal topla`,
    story: `Buzun üzerinde enerji kristalleri var. Her biri istasyona yardımcı oluyor; Lumo onları yol üstünde toplasın.`,
    intro: `
<p>Buz kristalleri enerji depolar. <code>collect()</code>, Lumo'nun o anda üzerinde durduğu
karedeki kristali toplar. Orada kristal yoksa Lumo bir arıza bildirir.</p>

<pre><code>from drone import *

move()
move()
collect()</code></pre>`,
    taskHtml: `<b>İki kristali de</b> topla ve ardından şarj istasyonuna ⚡ uç.`,
    hints: [
      `Kristalin olduğu kareye uç ve orada <code>collect()</code> komutunu çağır.`,
      `İlk kristal Lumo'nun iki kare önünde, ikincisi iki kare daha ileride, şarj istasyonu da onun iki kare arkasında.`,
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
    title: `Uzun koridorlar`,
    story: `Dar bir buz kanalı dıştaki şarj istasyonuna uzanıyor. Kanal çok uzun ve Lumo uzun komut listelerini hiç sevmez.`,
    intro: `
<p>13 kare için 13 satır <code>move()</code> mı? Bir <code>for</code> döngüsüyle iki satır yeter:</p>

<pre><code>from drone import *

for i in range(4):
    move()</code></pre>

<p><code>for</code> satırının altında girintili duran her şeyi Lumo tekrar eder.</p>`,
    taskHtml: `Koridor <b>13 kare</b> uzunluğunda. Lumo'yu bir <b><code>for</code> döngüsüyle</b> şarj istasyonuna ⚡ götür.`,
    hints: [`<code>for i in range(…):</code> ve altına girintili olarak <code>move()</code>.`, `<code>range(13)</code> 13 kez tekrar eder.`],
    starterCode: py`
      from drone import *

      # Koridor 13 kare uzunluğunda
      move()
    `,
    solution: py`
      from drone import *

      for i in range(13):
          move()
    `,
    expert: {
      html: `<p><b>Profiler için bonus:</b> En fazla <b>3 satır</b> kodla başar. İçe aktarma satırı da sayılır, yorumlar ve boş satırlar sayılmaz.</p>`,
      solution: py`
        from drone import *
        for i in range(13):
            move()
      `,
      feedback: { short: `Bu hâlâ çok fazla satır. Bütün işi döngü yapsın.` },
    },
  },

  "d-5": {
    title: `Bilinmeyen yol`,
    story: `Kar fırtınası buz levhalarını durmadan kaydırıyor. Şarj istasyonunun bugün ne kadar uzakta olduğunu kimse bilmiyor; Lumo bunu kendisi fark etmeli.`,
    intro: `
<p>Lumo'nun <b>sensörleri</b> var. Sensörler soruları <code>True</code> ya da <code>False</code>
ile cevaplar. Lumo şarj istasyonunun üzerindeyse <code>at_goal()</code> <code>True</code> olur:</p>

<pre><code>from drone import *

print(at_goal())   # False, çünkü Lumo henüz başlangıçta</code></pre>

<p><code>while</code> ile Lumo bir koşul doğru <b>olduğu sürece</b> bir şeyi tekrar eder.
<code>not</code> ise <code>True</code> ve <code>False</code> değerlerini tersine çevirir:
<code>not at_goal()</code> “henüz hedefte değil” demek.</p>`,
    taskHtml: `Yol her görevde <b>farklı uzunlukta</b>. Lumo'yu bir <b><code>while</code> döngüsü</b> ve <code>at_goal()</code> ile şarj istasyonuna ⚡ götür; istasyon ne kadar uzakta olursa olsun.`,
    hints: [
      `<code>while not at_goal():</code> “Lumo henüz hedefte olmadığı sürece” demek.`,
      `Altına girintili olarak yalnızca <code>move()</code> yazılır.`,
    ],
    starterCode: py`
      from drone import *

      # Şarj istasyonu ne kadar uzakta? Lumo bilmiyor …
      move()
    `,
    solution: py`
      from drone import *

      while not at_goal():
          move()
    `,
    expert: {
      html: `<p><b>Bonus:</b> Lumo yol boyunca <b>saysın</b> ve sonunda kaç kare uçtuğunu yazdırsın.</p>`,
      solution: py`
        from drone import *

        kareler = 0
        while not at_goal():
            move()
            kareler += 1
        print("Uçulan kare:", kareler)
      `,
      feedback: { count: `Sonunda Lumo'nun kaç kare uçtuğunu yazdır. Döngüde <code>kareler += 1</code> ile say.` },
    },
  },

  "d-6": {
    title: `Kristal izi`,
    story: `Fırtınadan sonra kristaller yola dağılmış, hem de her görevde başka yerlere. Lumo hiçbirini gözden kaçırmamalı.`,
    intro: `
<p><code>if</code> ile Lumo yolda kararlar verir. Lumo'nun altında bir kristal varsa
<code>on_crystal()</code> <code>True</code> olur:</p>

<pre><code>from drone import *

if on_crystal():
    collect()
print("Altımda kristal var mı?", on_crystal())</code></pre>

<p>Kararı bir döngünün <b>içine</b> koyarsan Lumo, üzerinden geçtiği her kareyi kontrol eder.</p>`,
    taskHtml: `Yolda kristaller var, hem de her görevde başka yerlerde. <b>Hepsini</b> topla ve şarj istasyonuna ⚡ uç.`,
    hints: [
      `<code>while</code> döngüsünde önce kristal olup olmadığını kontrol et, sonra bir kare ilerle.`,
      `<code>while not at_goal():</code>, altına <code>collect()</code> içeren bir <code>if on_crystal():</code>, ardından <code>move()</code>.`,
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
      html: `<p><b>Bonus:</b> Kristalleri say ve sonunda Lumo'nun kaç tane topladığını yazdır.</p>`,
      solution: py`
        from drone import *

        kristaller = 0
        while not at_goal():
            if on_crystal():
                collect()
                kristaller += 1
            move()
        print("Toplanan kristal:", kristaller)
      `,
      feedback: { count: `Sonunda toplanan kristallerin sayısını yazdır. <code>collect()</code> komutunun hemen ardından say.` },
    },
  },

  "d-7": {
    title: `Sağa dönüş`,
    story: `Buz bloklarından bir merdiven sağa ve yukarı doğru uzanıyor. Ama Lumo yalnızca sola dönebiliyor … öyle mi?`,
    intro: `
<p>Üç kez sola dönmek, bir kez sağa dönmekle aynı şey! Her seferinde üç satır yazmak yerine
<b>kendi komutunu</b> yaparsın:</p>

<pre><code>from drone import *

def turn_right():
    turn_left()
    turn_left()
    turn_left()

turn_right()</code></pre>

<p>Artık Python <code>turn_right()</code> komutunu da yerleşik komutlar kadar iyi tanıyor.</p>`,
    taskHtml: `<code>def</code> ile <code>turn_right()</code> komutunu yap ve Lumo'yu buz merdiveninden yukarı, şarj istasyonuna ⚡ uçur. En iyisi bir döngüyle basamak basamak.`,
    hints: [
      `Bir basamak şöyle: <code>move()</code>, <code>turn_left()</code>, <code>move()</code>, <code>turn_right()</code>.`,
      `Dört basamak var, ardından bir <code>move()</code> daha: <code>for i in range(4):</code>`,
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          # üç kez sola, bir kez sağa demek
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
    feedback: { useDef: `Komutu yaptın ama henüz kullanmadın. Lumo'nun sağa dönmesi gereken yerde <code>turn_right()</code> komutunu çağır.` },
    expert: {
      html: `<p><b>Bonus:</b> Bütün bir basamağı uçan ikinci bir <code>basamak()</code> komutu yap ve onu bir döngüde çağır.</p>`,
      solution: py`
        from drone import *

        def turn_right():
            turn_left()
            turn_left()
            turn_left()

        def basamak():
            move()
            turn_left()
            move()
            turn_right()

        for i in range(4):
            basamak()
        move()
      `,
      feedback: { twoDefs: `<code>turn_right()</code> dışında ikinci bir komut daha yap, örneğin <code>def basamak():</code>.` },
    },
  },

  "d-8": {
    title: `Sarmal`,
    story: `Bir koridor, eski bir buz mağarasının içine doğru sarmal gibi kıvrılıyor. Her mağara farklı; ne zaman döneceğine Lumo kendisi karar vermeli.`,
    intro: `
<p>Lumo'nun önü boşsa <code>front_clear()</code> <code>True</code> olur. <code>if</code> ve
<code>else</code> ile Lumo her adımda yeniden karar verir:</p>

<pre><code>from drone import *

if front_clear():
    move()
else:
    turn_left()</code></pre>`,
    taskHtml: `Koridor bir sarmal gibi içeri doğru kıvrılıyor ve her sarmal farklı. Lumo, <code>while</code>, <code>if</code> ve <code>else</code> ile şarj istasyonuna ⚡ giden yolu kendisi bulsun.`,
    hints: [
      `Lumo hedefte olmadığı sürece: Önü boşsa ilerler, değilse sola döner.`,
      `<code>while not at_goal():</code>, içinde <code>move()</code> ile <code>if front_clear():</code> ve <code>turn_left()</code> ile <code>else:</code>.`,
    ],
    starterCode: py`
      from drone import *

      # Lumo kendisi karar versin: ilerlemek mi, dönmek mi?
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
    title: `Labirent kurtarması`,
    story: `Bir kar fırtınası Lumo'yu buzdan bir labirente sürükledi ve hiçbir labirent diğerine benzemiyor. Lumo'yu eve ancak akıllı bir program getirebilir.`,
    intro: `
<p>Labirentler için eski bir hile: <b>Sağ elini hep duvarda tut.</b> Bunu yapan, bunun gibi
labirentlerde çıkışı mutlaka bulur. Lumo için bu, her adımda şu demek:</p>
<ul>
<li>önce sağa dön,</li>
<li>sonra önünde duvar olduğu sürece sola dön,</li>
<li>sonra bir kare uç.</li>
</ul>
<p>Bir döngünün <b>içinde</b> bir döngü daha, işte Lumo'nun planı hazır.</p>`,
    taskHtml: `Lumo'nun <b>her</b> labirentten şarj istasyonuna ⚡ giden yolu bulmasını sağlayan bir program yaz. Kontrol, senin göremediğin labirentlerle yapılır.`,
    hints: [
      `“Sağa dönüş” görevindeki <code>turn_right()</code> komutuna ihtiyacın var; başlangıç kodunda zaten hazır.`,
      `Dışta <code>while not at_goal():</code>, içinde <code>turn_right()</code>, sonra <code>turn_left()</code> ile <code>while not front_clear():</code>, sonra <code>move()</code>.`,
    ],
    starterCode: py`
      from drone import *

      def turn_right():
          turn_left()
          turn_left()
          turn_left()

      # Sağ el duvarda …
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

  // ================================================================== ARIZA AVI (yan görevler)
  "g-1": {
    title: `Telsiz sessizliği`,
    story: `Mürettebatın eski bir karşılama programı ziyaretçileri adlarıyla selamlamalı. Onun yerine sadece arıza bildiriyor.`,
    intro: `
<p><b>Arıza avına</b> hoş geldin! Burada yeni bir program yazmıyorsun, bozuk bir programı
onarıyorsun. Profesyoneller şöyle çalışır:</p>
<ul>
<li>Programı çalıştır ve hata kartını sakince oku.</li>
<li>“Satır …” yazısına tıkla; sorun orada.</li>
<li>Bir hatayı düzelt ve yeniden çalıştır. Çoğu zaman ardından bir sonraki hata ortaya çıkar.</li>
</ul>`,
    taskHtml: `Programı onar: Adını sormalı, sonra <b>iki satır</b> yazdırmalı. Biri adın geçtiği bir selam, diğeri “İstasyona hoş geldin!”.`,
    hints: [
      `Python büyük ve küçük harfi ayırt eder: <code>isim</code> ile <code>Isim</code> iki farklı addır.`,
      `Son satırda parantezden önce bir tırnak işareti eksik.`,
    ],
    starterCode: py`
      isim = input("Adın ne? ")
      print("Merhaba, " + Isim + "!")
      print("İstasyona hoş geldin!)
    `,
    solution: py`
      isim = input("Adın ne? ")
      print("Merhaba, " + isim + "!")
      print("İstasyona hoş geldin!")
    `,
    feedback: { greet: `Selamda girilen ad geçmeli, ardından da “İstasyona hoş geldin!” gelmeli.` },
  },

  "g-2": {
    title: `Hesap hatası`,
    story: `İstasyonun yaş hesaplayıcısı sadece on yıl sonra kaç yaşında olacağını hesaplamalı. Onun yerine her girdide çöküyor.`,
    intro: `
<p>Bu arıza bir klasik: <code>input()</code> her zaman <b>metin</b> verir, biri sayı yazsa bile.
Ama metinle sayı öylece toplanamaz.</p>
<pre><code>print(int("12") + 10)
print("Yaş: " + str(22))</code></pre>
<p><code>int(…)</code> metinden sayı yapar, <code>str(…)</code> ise sayıdan metin.</p>`,
    taskHtml: `Hesaplayıcıyı onar: <b>Her</b> yaş için on yıl sonra kaç yaşında olunacağını doğru hesaplamalı.`,
    hints: [
      `İlk hata kartı hesabı gösteriyor: Metin + sayı olmaz. Girdiyi <code>int(…)</code> ile dönüştür.`,
      `Sonra yazdırırken takılıyor: Metin + sayı yine uymuyor. <code>str(…)</code> ya da bir f-string yardımcı olur.`,
    ],
    starterCode: py`
      yas = input("Kaç yaşındasın? ")
      on_yil_sonra = yas + 10
      print("On yıl sonra " + on_yil_sonra + " yaşında olacaksın.")
    `,
    solution: py`
      yas = int(input("Kaç yaşındasın? "))
      on_yil_sonra = yas + 10
      print(f"On yıl sonra {on_yil_sonra} yaşında olacaksın.")
    `,
    feedback: { math: `Program çalışıyor ama henüz her yaş için doğru hesaplamıyor. 12 için 22, 30 için de 40 çıkmalı.` },
  },

  "g-3": {
    title: `Bitmeyen geri sayım`,
    story: `Fırlatma rampası geri sayıyor … ve hiç durmuyor. Keşif aracı yıllardır kendi “Kalkış!” anını bekliyor.`,
    intro: `
<p>Bazı arızalar hiç hata mesajı vermez; program sadece <b>sonsuza kadar</b> çalışır. Merak etme,
Codaluna onu bir süre sonra durdurur. O zaman şu soruyu sormaya değer: Koşulun bir noktada
<code>False</code> olması için döngüde neyin değişmesi gerekir?</p>`,
    taskHtml: `Geri sayımı onar: <b>5, 4, 3, 2, 1</b> yazdırmalı, ardından “Kalkış!” demeli ve sonra gerçekten durmalı.`,
    hints: [
      `Programı bir kez çalıştırıp bakabilirsin. Döngünün hiç bitmemesinin sebebi ne?`,
      `Döngünün içinde <code>sayi</code> küçülmeli: <code>sayi = sayi - 1</code>, girintili ve <code>print</code> satırının altında.`,
    ],
    starterCode: py`
      sayi = 5
      while sayi > 0:
          print(sayi)
      print("Kalkış!")
    `,
    solution: py`
      sayi = 5
      while sayi > 0:
          print(sayi)
          sayi = sayi - 1
      print("Kalkış!")
    `,
    feedback: { countdown: `Geri sayım tam olarak 5, 4, 3, 2, 1 diye saymalı ve ardından bir kez “Kalkış!” yazdırmalı.` },
  },

  "g-4": {
    title: `Kaymış liste`,
    story: `Laboratuvardaki depo listesi her seferinde bitmeden yarıda kesiliyor. Program bir yerde yanlış sayıyor.`,
    intro: `
<p>Bu programda iki arıza saklı. Birincisi programın hiç başlamasını engelliyor. İkincisi ancak
program çalışırken ortaya çıkıyor ve bir listedeki <b>konumlarla</b> ilgili: İlk konum 0, son
konum <code>len(liste) - 1</code>.</p>`,
    taskHtml: `Depo listesini onar: Her malzeme ayrı bir satırda görünmeli, en sonda da toplam sayı.`,
    hints: [
      `Son satırdaki parantezleri say.`,
      `<code>range(len(malzemeler))</code> listenin konumlarını tam olarak sayar; <code>+ 1</code> olmadan.`,
    ],
    starterCode: py`
      malzemeler = ["Buz", "Kristaller", "Piller", "Kurabiyeler"]
      for i in range(len(malzemeler) + 1):
          print("Depoda:", malzemeler[i])
      print("Toplam:", len(malzemeler)
    `,
    solution: py`
      malzemeler = ["Buz", "Kristaller", "Piller", "Kurabiyeler"]
      for i in range(len(malzemeler)):
          print("Depoda:", malzemeler[i])
      print("Toplam:", len(malzemeler))
    `,
    feedback: { list: `Tam olarak dört malzeme görünmeli, her biri ayrı bir satırda, ardından da toplam sayı olarak 4.` },
  },

  "g-5": {
    title: `Unutulan return`,
    story: `Kontrol merkezinin enerji hesaplayıcısı ekranda bir sayı gösteriyor, ama sonra “hiçbir şey” ile hesaba devam etmeye çalışıyor. Ders kitabından çıkmış gibi bir arıza!`,
    intro: `
<p>Bir fonksiyon bir şeyi <b>gösterebilir</b> (<code>print</code>) ya da bir şeyi <b>geri
döndürebilir</b> (<code>return</code>). Bu ikisi aynı şey değil: Program yalnızca geri döndürülen
değeri kullanmaya devam edebilir. <code>return</code> olmadan bir fonksiyon <code>None</code>
döndürür, yani “hiçbir şey”.</p>`,
    taskHtml: `<code>iki_kati</code> fonksiyonunu onar: Programın onunla hesaba devam edebilmesi için sonucunu <b>geri döndürmeli</b>. En sonda “Toplam enerji: 50” görünmeli.`,
    hints: [
      `Hata kartı diyor ki: <code>None</code> artı sayı olmaz. Demek ki fonksiyon hiçbir şey geri döndürmüyor.`,
      `Fonksiyondaki <code>print(sonuc)</code> yerine <code>return sonuc</code> yaz.`,
    ],
    starterCode: py`
      def iki_kati(sayi):
          sonuc = sayi * 2
          print(sonuc)

      enerji = iki_kati(21)
      print("Toplam enerji:", enerji + 8)
    `,
    solution: py`
      def iki_kati(sayi):
          sonuc = sayi * 2
          return sonuc

      enerji = iki_kati(21)
      print("Toplam enerji:", enerji + 8)
    `,
    feedback: {
      double: `Fonksiyon sayının iki katını geri döndürmeli; 7 için yani 14.`,
      fifty: `En sonda “Toplam enerji: 50” görünmeli.`,
    },
  },
};
