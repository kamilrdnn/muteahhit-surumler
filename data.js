/* Müteahhit Simülasyonu - Veri katmanı
   b = ortalama konut satış fiyatı (TL/m2), ilçe çarpanı ile düzeltilir
   d = [ilçe adı, fiyat çarpanı, talep çarpanı (opsiyonel, varsayılan 1)] */
const ILLER = [
{n:"İstanbul",p:34,b:95000,lv:0,d:[["Beşiktaş",2.40,.5],["Kadıköy",2.20,.7],["Sarıyer",1.95,.5],["Şişli",1.90,.7],["Bakırköy",1.80,.6],["Beyoğlu",1.70,.6],["Üsküdar",1.60,.8],["Ataşehir",1.50,1],["Beykoz",1.30,.5],["Karşıyaka",1.25,.6],["Kağıthane",1.22,1],["Fatih",1.20,.9],["Ümraniye",1.18,1.2],["Maltepe",1.30,1],["Zeytinburnu",1.10,.9],["Bahçelievler",1.10,1.2],["Gaziemir",1.05,.8],["Kartal",1.10,1.1],["Başakşehir",1.00,1.3],["Beylikdüzü",0.95,1.3],["Eyüpsultan",0.95,1],["Küçükçekmece",0.90,1.3],["Tuzla",0.90,1],["Pendik",0.85,1.4],["Avcılar",0.85,1.1],["Çekmeköy",0.85,1],["Gaziosmanpaşa",0.85,1.1],["Bağcılar",0.80,1.3],["Sancaktepe",0.80,1.2],["Büyükçekmece",0.78,.9],["Esenler",0.75,1.1],["Sultanbeyli",0.70,1.2],["Sultangazi",0.68,1.2],["Silivri",0.60,.7],["Şile",0.58,.4],["Arnavutköy",0.55,1],["Çatalca",0.40,.4]]},
{n:"Ankara",p:6,b:48000,lv:1,d:[["Çankaya",1.80,.9],["Yenimahalle",1.20,1.1],["Etimesgut",1.05,1.2],["Gölbaşı",0.95,.7],["Keçiören",0.82,1.2],["Mamak",0.72,1],["Pursaklar",0.68,.9],["Sincan",0.65,1.1],["Altındağ",0.60,.9],["Kahramankazan",0.58,.6],["Çubuk",0.50,.5],["Polatlı",0.48,.5],["Akyurt",0.48,.5],["Beypazarı",0.42,.3],["Elmadağ",0.40,.3]]},
{n:"İzmir",p:35,b:62000,lv:1,d:[["Çeşme",2.20,.4],["Urla",1.80,.5],["Güzelbahçe",1.65,.5],["Foça",1.55,.4],["Narlıdere",1.42,.7],["Seferihisar",1.38,.4],["Karşıyaka",1.32,1],["Balçova",1.30,.8],["Dikili",1.18,.4],["Bornova",1.12,1.1],["Konak",1.10,1],["Gaziemir",1.08,.9],["Bayraklı",1.00,1],["Buca",0.92,1.2],["Karabağlar",0.88,1.1],["Çiğli",0.85,1],["Aliağa",0.72,.6],["Menderes",0.70,.7],["Menemen",0.68,.8],["Torbalı",0.64,.8],["Bergama",0.50,.4],["Tire",0.45,.3],["Ödemiş",0.44,.3]]},
{n:"Antalya",p:7,b:58000,lv:1,d:[["Kaş",2.00,.3],["Kalkan",1.95,.3],["Konyaaltı",1.70,.9],["Muratpaşa",1.45,1],["Kemer",1.55,.4],["Side",1.50,.4],["Belek",1.60,.3],["Alanya",1.25,.9],["Kepez",0.90,1.2],["Döşemealtı",0.88,.7],["Manavgat",0.80,.6],["Serik",0.68,.5],["Kumluca",0.58,.4],["Gazipaşa",0.52,.3],["Korkuteli",0.48,.3]]},
{n:"Muğla",p:48,b:55000,lv:1,d:[["Bodrum",2.30,.5],["Göcek",2.20,.2],["Marmaris",1.70,.5],["Fethiye",1.55,.7],["Datça",1.60,.3],["Ölüdeniz",1.80,.3],["Dalyan",1.40,.3],["Akyaka",1.45,.3],["Menteşe",1.00,.6],["Milas",0.80,.5],["Ortaca",0.78,.4],["Seydikemer",0.55,.3],["Yatağan",0.45,.3],["Köyceğiz",0.70,.3]]},
{n:"Bursa",p:16,b:38000,lv:1,d:[["Nilüfer",1.45,1.1],["Osmangazi",1.00,1],["Yıldırım",0.80,1],["Mudanya",1.25,.5],["Gemlik",0.78,.6],["İnegöl",0.60,.5],["Gürsu",0.68,.6],["Kestel",0.62,.5],["Mustafakemalpaşa",0.48,.3],["İznik",0.55,.3],["Orhangazi",0.55,.4],["Karacabey",0.50,.3]]},
{n:"Kocaeli",p:41,b:36000,lv:1,d:[["İzmit",1.20,1],["Başiskele",1.00,.8],["Gölcük",0.95,.6],["Kartepe",0.92,.7],["Darıca",0.90,.9],["Gebze",0.98,1.1],["Çayırova",0.88,.9],["Derince",0.80,.7],["Körfez",0.78,.6],["Kandıra",0.45,.3]]},
{n:"Mersin",p:33,b:32000,lv:1,d:[["Mezitli",1.35,1],["Yenişehir",1.30,1],["Erdemli",1.00,.6],["Toroslar",0.80,.9],["Akdeniz",0.75,.9],["Tarsus",0.70,.7],["Silifke",0.72,.5],["Anamur",0.60,.4],["Mut",0.42,.3]]},
{n:"Adana",p:1,b:30000,lv:1,d:[["Çukurova",1.40,1],["Seyhan",0.95,1],["Yüreğir",0.70,.8],["Sarıçam",0.80,.8],["Ceyhan",0.55,.5],["Kozan",0.48,.4],["İmamoğlu",0.42,.3]]},
{n:"Aydın",p:9,b:34000,lv:1,d:[["Didim",1.40,.6],["Kuşadası",1.50,.6],["Efeler",1.00,.8],["Söke",0.72,.5],["Nazilli",0.65,.5],["Çine",0.50,.3],["Germencik",0.52,.3],["Kuyucak",0.45,.3]]},
{n:"Balıkesir",p:10,b:30000,lv:1,d:[["Ayvalık",1.55,.5],["Edremit",1.25,.6],["Burhaniye",1.15,.4],["Altıeylül",1.00,.7],["Karesi",0.95,.7],["Bandırma",0.90,.6],["Gönen",0.55,.3],["Sındırgı",0.42,.3]]},
{n:"Tekirdağ",p:59,b:29000,lv:1,d:[["Süleymanpaşa",1.20,.9],["Çorlu",1.05,1],["Kapaklı",0.90,.9],["Ergene",0.78,.6],["Marmaraereğlisi",0.88,.4],["Malkara",0.52,.3],["Hayrabolu",0.45,.3]]},
{n:"Eskişehir",p:26,b:28000,lv:1,d:[["Tepebaşı",1.25,.9],["Odunpazarı",1.10,.9],["Çifteler",0.45,.3],["Sivrihisar",0.42,.3],["Alpu",0.40,.2]]},
{n:"Trabzon",p:61,b:32000,lv:1,d:[["Ortahisar",1.25,.9],["Yomra",1.10,.6],["Akçaabat",1.05,.7],["Arsin",0.85,.5],["Of",0.72,.4],["Vakfıkebir",0.62,.3],["Sürmene",0.65,.3],["Uzungöl",1.30,.3]]},
{n:"Samsun",p:55,b:27000,lv:1,d:[["Atakum",1.35,1],["İlkadım",1.00,.9],["Canik",0.78,.7],["Tekkeköy",0.70,.5],["Bafra",0.55,.4],["Çarşamba",0.52,.4],["Vezirköprü",0.42,.3]]},
{n:"Sakarya",p:54,b:28000,lv:1,d:[["Serdivan",1.30,.9],["Adapazarı",1.05,.9],["Erenler",0.90,.7],["Arifiye",0.88,.6],["Hendek",0.60,.4],["Karasu",0.78,.4],["Akyazı",0.55,.3]]},
{n:"Denizli",p:20,b:26000,lv:1,d:[["Merkezefendi",1.15,.9],["Pamukkale",1.20,.9],["Çivril",0.45,.3],["Acıpayam",0.42,.3],["Tavas",0.42,.3]]},
{n:"Konya",p:42,b:25000,lv:1,d:[["Selçuklu",1.30,1],["Meram",1.05,.9],["Karatay",0.90,.9],["Akşehir",0.52,.4],["Ereğli",0.50,.4],["Beyşehir",0.45,.3],["Çumra",0.42,.3]]},
{n:"Gaziantep",p:27,b:25000,lv:1,d:[["Şehitkamil",1.25,1.1],["Şahinbey",1.00,1],["Oğuzeli",0.55,.4],["Nizip",0.52,.4],["İslahiye",0.45,.3]]},
{n:"Kayseri",p:38,b:25000,lv:1,d:[["Melikgazi",1.25,1],["Kocasinan",1.05,1],["Talas",1.10,.8],["Hacılar",0.65,.4],["Develi",0.45,.3],["Yahyalı",0.42,.3]]},
{n:"Çanakkale",p:17,b:31000,lv:1,d:[["Merkez",1.20,.7],["Ayvacık",1.10,.4],["Bozcaada",1.70,.2],["Gelibolu",0.80,.4],["Biga",0.58,.3],["Çan",0.52,.3]]},
{n:"Manisa",p:45,b:24000,lv:1,d:[["Şehzadeler",1.10,.8],["Yunusemre",1.15,.9],["Turgutlu",0.70,.5],["Salihli",0.62,.4],["Akhisar",0.65,.4],["Alaşehir",0.50,.3]]},
{n:"Hatay",p:31,b:24000,lv:1,d:[["Antakya",1.05,.9],["Defne",0.95,.8],["İskenderun",1.00,.9],["Arsuz",1.10,.5],["Dörtyol",0.70,.5],["Samandağ",0.68,.4],["Kırıkhan",0.55,.4]]},
{n:"Yalova",p:77,b:32000,lv:1,d:[["Merkez",1.25,.8],["Çınarcık",1.30,.5],["Armutlu",1.15,.4],["Çiftlikköy",1.00,.6],["Altınova",0.85,.4]]},
{n:"Bolu",p:14,b:26000,lv:1,d:[["Merkez",1.15,.7],["Gerede",0.60,.3],["Mudurnu",0.65,.3],["Göynük",0.55,.2],["Mengen",0.48,.2]]},
{n:"Edirne",p:22,b:24000,lv:1,d:[["Merkez",1.15,.7],["Keşan",0.70,.4],["Uzunköprü",0.58,.3],["İpsala",0.48,.2],["Enez",0.72,.2]]},
{n:"Kırklareli",p:39,b:24000,lv:1,d:[["Merkez",1.10,.6],["Lüleburgaz",1.00,.7],["Babaeski",0.60,.3],["Vize",0.58,.3],["Pınarhisar",0.52,.2]]},
{n:"Rize",p:53,b:27000,lv:1,d:[["Merkez",1.20,.7],["Çayeli",0.85,.4],["Ardeşen",0.80,.4],["Pazar",0.72,.3],["Fındıklı",0.70,.3]]},
{n:"Ordu",p:52,b:24000,lv:1,d:[["Altınordu",1.15,.8],["Ünye",1.00,.6],["Fatsa",0.88,.5],["Perşembe",0.82,.3],["Kumru",0.45,.2]]},
{n:"Giresun",p:28,b:23000,lv:1,d:[["Merkez",1.12,.6],["Bulancak",0.95,.4],["Espiye",0.75,.3],["Tirebolu",0.78,.3],["Görele",0.70,.3]]},
{n:"Zonguldak",p:67,b:22000,lv:1,d:[["Merkez",1.10,.6],["Çaycuma",0.70,.4],["Devrek",0.65,.3],["Alaplı",0.72,.3],["Ereğli",0.95,.5]]},
{n:"Düzce",p:81,b:24000,lv:1,d:[["Merkez",1.15,.7],["Akçakoca",1.05,.4],["Kaynaşlı",0.65,.3],["Gölyaka",0.62,.3],["Yığılca",0.48,.2]]},
{n:"Isparta",p:32,b:22000,lv:1,d:[["Merkez",1.15,.7],["Eğirdir",1.00,.3],["Yalvaç",0.52,.3],["Şarkikaraağaç",0.48,.2],["Gelendost",0.45,.2]]},
{n:"Afyonkarahisar",p:3,b:21000,lv:1,d:[["Merkez",1.15,.7],["Sandıklı",0.55,.3],["Dinar",0.50,.3],["Bolvadin",0.52,.3],["Emirdağ",0.48,.2]]},
{n:"Kütahya",p:43,b:21000,lv:1,d:[["Merkez",1.15,.7],["Tavşanlı",0.65,.3],["Simav",0.55,.3],["Gediz",0.50,.2],["Emet",0.48,.2]]},
{n:"Uşak",p:64,b:21000,lv:1,d:[["Merkez",1.15,.7],["Banaz",0.55,.3],["Eşme",0.48,.2],["Sivaslı",0.45,.2],["Ulubey",0.45,.2]]},
{n:"Burdur",p:15,b:20000,lv:1,d:[["Merkez",1.15,.6],["Bucak",0.65,.3],["Gölhisar",0.55,.2],["Yeşilova",0.45,.2],["Tefenni",0.42,.2]]},
{n:"Nevşehir",p:50,b:23000,lv:1,d:[["Merkez",1.10,.6],["Ürgüp",1.30,.4],["Avanos",1.00,.3],["Gülşehir",0.60,.2],["Acıgöl",0.50,.2]]},
{n:"Aksaray",p:68,b:20000,lv:1,d:[["Merkez",1.15,.7],["Ortaköy",0.55,.3],["Eskil",0.50,.2],["Gülağaç",0.45,.2],["Güzelyurt",0.55,.2]]},
{n:"Niğde",p:51,b:20000,lv:1,d:[["Merkez",1.15,.7],["Bor",0.65,.3],["Çamardı",0.48,.2],["Ulukışla",0.45,.2],["Altunhisar",0.42,.2]]},
{n:"Karaman",p:70,b:20000,lv:1,d:[["Merkez",1.15,.7],["Ermenek",0.50,.2],["Ayrancı",0.45,.2],["Kazımkarabekir",0.45,.2],["Sarıveliler",0.42,.2]]},
{n:"Kırıkkale",p:71,b:19000,lv:1,d:[["Merkez",1.15,.6],["Keskin",0.52,.2],["Delice",0.45,.2],["Balışeyh",0.42,.2],["Sulakyurt",0.40,.2]]},
{n:"Kırşehir",p:40,b:19000,lv:1,d:[["Merkez",1.15,.6],["Kaman",0.55,.2],["Mucur",0.52,.2],["Çiçekdağı",0.45,.2],["Akpınar",0.42,.2]]},
{n:"Yozgat",p:66,b:18000,lv:1,d:[["Merkez",1.15,.6],["Sorgun",0.70,.3],["Akdağmadeni",0.52,.2],["Boğazlıyan",0.48,.2],["Sarıkaya",0.45,.2]]},
{n:"Çorum",p:19,b:20000,lv:1,d:[["Merkez",1.15,.7],["Sungurlu",0.58,.3],["Osmancık",0.55,.2],["İskilip",0.52,.2],["Alaca",0.48,.2]]},
{n:"Amasya",p:5,b:20000,lv:1,d:[["Merkez",1.15,.6],["Merzifon",0.80,.4],["Suluova",0.58,.3],["Taşova",0.50,.2],["Gümüşhacıköy",0.48,.2]]},
{n:"Tokat",p:60,b:19000,lv:1,d:[["Merkez",1.15,.6],["Erbaa",0.70,.3],["Turhal",0.68,.3],["Zile",0.60,.3],["Niksar",0.58,.2]]},
{n:"Sivas",p:58,b:19000,lv:1,d:[["Merkez",1.15,.7],["Şarkışla",0.50,.2],["Suşehri",0.50,.2],["Yıldızeli",0.45,.2],["Zara",0.45,.2]]},
{n:"Kastamonu",p:37,b:20000,lv:1,d:[["Merkez",1.15,.6],["Tosya",0.55,.2],["Taşköprü",0.52,.2],["İnebolu",0.72,.2],["Cide",0.70,.2]]},
{n:"Sinop",p:57,b:22000,lv:1,d:[["Merkez",1.20,.5],["Boyabat",0.58,.2],["Gerze",0.85,.2],["Ayancık",0.70,.2],["Türkeli",0.65,.2]]},
{n:"Bartın",p:74,b:22000,lv:1,d:[["Merkez",1.15,.5],["Amasra",1.45,.3],["Kurucaşile",0.70,.2],["Ulus",0.52,.2]]},
{n:"Karabük",p:78,b:20000,lv:1,d:[["Merkez",1.15,.6],["Safranbolu",1.35,.4],["Yenice",0.55,.2],["Eskipazar",0.48,.2]]},
{n:"Çankırı",p:18,b:18000,lv:1,d:[["Merkez",1.15,.5],["Çerkeş",0.50,.2],["Ilgaz",0.60,.2],["Kurşunlu",0.45,.2]]},
{n:"Bilecik",p:11,b:21000,lv:1,d:[["Merkez",1.15,.6],["Bozüyük",0.80,.4],["Osmaneli",0.70,.3],["Söğüt",0.50,.2]]},
{n:"Kahramanmaraş",p:46,b:21000,lv:1,d:[["Onikişubat",1.20,.9],["Dulkadiroğlu",1.00,.8],["Elbistan",0.60,.4],["Afşin",0.48,.3],["Pazarcık",0.45,.2]]},
{n:"Malatya",p:44,b:21000,lv:1,d:[["Yeşilyurt",1.25,.9],["Battalgazi",1.00,.8],["Doğanşehir",0.50,.3],["Akçadağ",0.45,.2],["Darende",0.45,.2]]},
{n:"Elazığ",p:23,b:20000,lv:1,d:[["Merkez",1.20,.8],["Kovancılar",0.52,.3],["Karakoçan",0.48,.2],["Palu",0.45,.2],["Maden",0.42,.2]]},
{n:"Diyarbakır",p:21,b:21000,lv:2,d:[["Kayapınar",1.30,1],["Bağlar",0.90,.9],["Yenişehir",1.20,.9],["Sur",0.75,.6],["Ergani",0.55,.4],["Bismil",0.50,.3],["Silvan",0.45,.3]]},
{n:"Şanlıurfa",p:63,b:19000,lv:2,d:[["Karaköprü",1.30,1],["Haliliye",1.10,1],["Eyyübiye",0.85,.9],["Siverek",0.55,.4],["Viranşehir",0.52,.3],["Birecik",0.55,.3],["Suruç",0.45,.3]]},
{n:"Van",p:65,b:19000,lv:2,d:[["İpekyolu",1.15,.9],["Tuşba",1.20,.8],["Edremit",1.25,.7],["Erciş",0.55,.4],["Muradiye",0.45,.3],["Gevaş",0.50,.2]]},
{n:"Erzurum",p:25,b:19000,lv:2,d:[["Yakutiye",1.20,.8],["Palandöken",1.25,.7],["Aziziye",0.90,.6],["Horasan",0.45,.2],["Pasinler",0.48,.2],["Oltu",0.45,.2]]},
{n:"Erzincan",p:24,b:19000,lv:2,d:[["Merkez",1.15,.6],["Tercan",0.45,.2],["Çayırlı",0.42,.2],["Üzümlü",0.50,.2],["Refahiye",0.45,.2]]},
{n:"Adıyaman",p:2,b:17000,lv:2,d:[["Merkez",1.15,.8],["Kahta",0.58,.3],["Besni",0.50,.3],["Gölbaşı",0.48,.2],["Gerger",0.40,.2]]},
{n:"Mardin",p:47,b:18000,lv:2,d:[["Artuklu",1.25,.8],["Kızıltepe",0.80,.6],["Midyat",0.85,.4],["Nusaybin",0.65,.4],["Derik",0.45,.2]]},
{n:"Batman",p:72,b:17000,lv:2,d:[["Merkez",1.15,.9],["Beşiri",0.50,.3],["Kozluk",0.48,.3],["Sason",0.42,.2],["Gercüş",0.42,.2]]},
{n:"Siirt",p:56,b:16000,lv:2,d:[["Merkez",1.15,.7],["Kurtalan",0.55,.3],["Baykan",0.45,.2],["Pervari",0.42,.2],["Eruh",0.40,.2]]},
{n:"Şırnak",p:73,b:16000,lv:2,d:[["Merkez",1.10,.6],["Cizre",0.85,.5],["Silopi",0.80,.4],["İdil",0.52,.2],["Uludere",0.45,.2]]},
{n:"Hakkari",p:30,b:16000,lv:2,d:[["Merkez",1.10,.5],["Yüksekova",0.90,.4],["Şemdinli",0.52,.2],["Çukurca",0.45,.2]]},
{n:"Bitlis",p:13,b:16000,lv:2,d:[["Merkez",1.10,.5],["Tatvan",0.95,.4],["Ahlat",0.60,.2],["Güroymak",0.50,.2],["Hizan",0.42,.2]]},
{n:"Muş",p:49,b:15000,lv:2,d:[["Merkez",1.10,.6],["Bulanık",0.55,.3],["Malazgirt",0.50,.2],["Varto",0.42,.2],["Hasköy",0.40,.2]]},
{n:"Ağrı",p:4,b:15000,lv:2,d:[["Merkez",1.10,.6],["Patnos",0.60,.3],["Doğubayazıt",0.65,.3],["Diyadin",0.45,.2],["Eleşkirt",0.42,.2]]},
{n:"Iğdır",p:76,b:16000,lv:2,d:[["Merkez",1.10,.6],["Tuzluca",0.48,.2],["Aralık",0.52,.2],["Karakoyunlu",0.45,.2]]},
{n:"Kars",p:36,b:16000,lv:2,d:[["Merkez",1.15,.6],["Sarıkamış",0.75,.3],["Kağızman",0.50,.2],["Selim",0.45,.2],["Arpaçay",0.42,.2]]},
{n:"Ardahan",p:75,b:14000,lv:2,d:[["Merkez",1.10,.4],["Göle",0.52,.2],["Çıldır",0.45,.2],["Posof",0.45,.2]]},
{n:"Artvin",p:8,b:22000,lv:2,d:[["Merkez",1.15,.4],["Hopa",1.00,.3],["Arhavi",1.05,.3],["Borçka",0.70,.2],["Yusufeli",0.60,.2]]},
{n:"Bayburt",p:69,b:16000,lv:2,d:[["Merkez",1.10,.4],["Demirözü",0.45,.2],["Aydıntepe",0.45,.2]]},
{n:"Gümüşhane",p:29,b:17000,lv:2,d:[["Merkez",1.15,.5],["Kelkit",0.50,.2],["Şiran",0.48,.2],["Torul",0.55,.2],["Köse",0.42,.2]]},
{n:"Tunceli",p:62,b:17000,lv:2,d:[["Merkez",1.15,.4],["Pertek",0.55,.2],["Çemişgezek",0.50,.2],["Ovacık",0.45,.2]]},
{n:"Bingöl",p:12,b:17000,lv:2,d:[["Merkez",1.15,.6],["Genç",0.50,.2],["Solhan",0.48,.2],["Karlıova",0.42,.2],["Adaklı",0.40,.2]]},
{n:"Osmaniye",p:80,b:19000,lv:1,d:[["Merkez",1.15,.8],["Kadirli",0.60,.4],["Düziçi",0.58,.3],["Bahçe",0.48,.2],["Toprakkale",0.45,.2]]},
{n:"Kilis",p:79,b:17000,lv:2,d:[["Merkez",1.15,.7],["Musabeyli",0.45,.2],["Elbeyli",0.42,.2],["Polateli",0.42,.2]]}
];

/* İmar / proje sabitleri */
const IMAR_TIPLERI = [
 {k:"konut",ad:"Konut",emsalAralik:[1.0,2.6],satisCarpan:1.00},
 {k:"ticari",ad:"Ticari + Konut",emsalAralik:[1.6,3.4],satisCarpan:1.12},
 {k:"villa",ad:"Villa / Az Katlı",emsalAralik:[0.4,0.9],satisCarpan:1.22}
];

const KALITELER = [
 {k:"ekonomik",ad:"Ekonomik",maliyetM2:19000,satisCarpan:0.86,sureCarpan:0.85,malzemeCarpan:0.80,beklenti:0.7},
 {k:"standart",ad:"Standart",maliyetM2:26000,satisCarpan:1.00,sureCarpan:1.00,malzemeCarpan:1.00,beklenti:1.0},
 {k:"luks",ad:"Lüks",maliyetM2:42000,satisCarpan:1.30,sureCarpan:1.35,malzemeCarpan:1.50,beklenti:1.6}
];

const DAIRE_TIPLERI = [
 {k:"1+1",m2:58,carpan:1.08},
 {k:"2+1",m2:88,carpan:1.00},
 {k:"3+1",m2:125,carpan:0.96},
 {k:"4+1",m2:165,carpan:0.93},
 {k:"dubleks",m2:215,carpan:1.05}
];

const KARMALAR = [
 {k:"kucuk",ad:"Küçük ağırlıklı",dagilim:{"1+1":.45,"2+1":.40,"3+1":.15,"4+1":0,"dubleks":0},talep:1.20},
 {k:"dengeli",ad:"Dengeli",dagilim:{"1+1":.18,"2+1":.37,"3+1":.33,"4+1":.12,"dubleks":0},talep:1.00},
 {k:"genis",ad:"Geniş ağırlıklı",dagilim:{"1+1":0,"2+1":.18,"3+1":.42,"4+1":.30,"dubleks":.10},talep:0.80}
];

const DONATILAR = [
 {k:"otopark",ad:"Kapalı Otopark",m2Maliyet:1400,satis:0.045,talep:0.10},
 {k:"havuz",ad:"Yüzme Havuzu",sabit:3200000,satis:0.040,talep:0.09},
 {k:"spor",ad:"Spor Salonu",sabit:1900000,satis:0.028,talep:0.07},
 {k:"park",ad:"Çocuk Parkı & Peyzaj",sabit:900000,satis:0.018,talep:0.06},
 {k:"guvenlik",ad:"7/24 Güvenlik",sabit:1200000,satis:0.022,talep:0.08},
 {k:"akilli",ad:"Akıllı Ev Sistemi",m2Maliyet:900,satis:0.035,talep:0.05},
 {k:"jenerator",ad:"Jeneratör & Yalıtım",m2Maliyet:650,satis:0.020,talep:0.04},
 {k:"sosyal",ad:"Sosyal Tesis & Kafeterya",sabit:2400000,satis:0.030,talep:0.07}
];

const MALZEMELER = [
 {k:"cimento",ad:"Çimento",birim:"ton",m2:0.34,fiyat:3400},
 {k:"demir",ad:"İnşaat Demiri",birim:"ton",m2:0.042,fiyat:33000},
 {k:"tugla",ad:"Tuğla",birim:"adet",m2:26,fiyat:22},
 {k:"agrega",ad:"Kum & Agrega",birim:"m³",m2:0.30,fiyat:900},
 {k:"kaplama",ad:"Seramik & Kaplama",birim:"m²",m2:1.05,fiyat:1200},
 {k:"tesisat",ad:"Tesisat & Doğrama",birim:"br",m2:1.00,fiyat:6500}
];

const ASAMALAR = [
 {k:"hafriyat",ad:"Hafriyat & Zemin",pay:0.08},
 {k:"temel",ad:"Temel & Perde",pay:0.16},
 {k:"kaba",ad:"Kaba İnşaat",pay:0.34},
 {k:"cati",ad:"Çatı & Cephe",pay:0.14},
 {k:"ince",ad:"İnce İşler",pay:0.20},
 {k:"iskan",ad:"İskan & Teslim",pay:0.08}
];

const PERSONEL = [
 {k:"isci",ad:"İnşaat İşçisi",maas:32000,kapasite:176,kalite:0},
 {k:"usta",ad:"Usta / Kalfa",maas:58000,kapasite:304,kalite:0.6},
 {k:"muhendis",ad:"İnşaat Mühendisi",maas:110000,kapasite:192,kalite:1.8},
 {k:"mimar",ad:"Mimar",maas:95000,kapasite:128,kalite:1.5},
 {k:"sefi",ad:"Şantiye Şefi",maas:140000,kapasite:384,kalite:2.2}
];

/* Muhasebe kademeleri: ödemeleri otomatikleştirir */
const MUHASEBE = [
 {k:0,ad:"Muhasebeci yok",maas:0,aciklama:"Maaş, kredi ve vergiyi elle ödersin. Geciktirirsen gecikme zammı işler.",
  oto:false,vergiIndirim:0,faizIndirim:0},
 {k:1,ad:"Serbest Muhasebeci",maas:38000,aciklama:"Maaş ve kredi taksitlerini vadesinde kendisi öder.",
  oto:true,vergiIndirim:0,faizIndirim:0},
 {k:2,ad:"Mali Müşavir",maas:95000,aciklama:"Tüm ödemeleri yapar, vergide %14 tasarruf sağlar, gecikme yaşanmaz.",
  oto:true,vergiIndirim:0.14,faizIndirim:0},
 {k:3,ad:"Mali Müşavirlik Ofisi",maas:210000,aciklama:"Vergide %22 tasarruf, kredi faizinde %10 indirim, nakit akışı uyarısı.",
  oto:true,vergiIndirim:0.22,faizIndirim:0.10}
];

/* Gecikme zammı: aylık %4,5 (günlük işletilir) */
const GECIKME_AYLIK = 0.045;

const UNVANLAR = [
 {ad:"Mahalle Müteahhidi",itibar:0,proje:0},
 {ad:"İlçe Müteahhidi",itibar:18,proje:2},
 {ad:"İl Müteahhidi",itibar:34,proje:5},
 {ad:"Bölge Müteahhidi",itibar:50,proje:10},
 {ad:"Ulusal Müteahhit",itibar:66,proje:18},
 {ad:"İnşaat Holdingi",itibar:80,proje:30}
];

const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

/* İl merkezlerinin yaklaşık konumu [boylam, enlem] — harita için */
const IL_KONUM = {
"Adana":[35.32,37.00],"Adıyaman":[38.28,37.76],"Afyonkarahisar":[30.54,38.76],"Ağrı":[43.05,39.72],
"Amasya":[35.83,40.65],"Ankara":[32.85,39.93],"Antalya":[30.70,36.89],"Artvin":[41.82,41.18],
"Aydın":[27.84,37.84],"Balıkesir":[27.89,39.65],"Bilecik":[29.98,40.15],"Bingöl":[40.50,38.88],
"Bitlis":[42.11,38.40],"Bolu":[31.61,40.74],"Burdur":[30.29,37.72],"Bursa":[29.06,40.19],
"Çanakkale":[26.41,40.15],"Çankırı":[33.62,40.60],"Çorum":[34.95,40.55],"Denizli":[29.09,37.78],
"Diyarbakır":[40.23,37.91],"Edirne":[26.56,41.68],"Elazığ":[39.22,38.68],"Erzincan":[39.49,39.75],
"Erzurum":[41.27,39.90],"Eskişehir":[30.52,39.78],"Gaziantep":[37.38,37.07],"Giresun":[38.39,40.91],
"Gümüşhane":[39.48,40.46],"Hakkari":[43.74,37.57],"Hatay":[36.16,36.20],"Isparta":[30.55,37.76],
"Mersin":[34.64,36.81],"İstanbul":[28.98,41.01],"İzmir":[27.14,38.42],"Kars":[43.10,40.60],
"Kastamonu":[33.78,41.38],"Kayseri":[35.48,38.73],"Kırklareli":[27.22,41.74],"Kırşehir":[34.17,39.14],
"Kocaeli":[29.92,40.77],"Konya":[32.48,37.87],"Kütahya":[29.98,39.42],"Malatya":[38.31,38.35],
"Manisa":[27.43,38.61],"Kahramanmaraş":[36.92,37.58],"Mardin":[40.74,37.31],"Muğla":[28.36,37.21],
"Muş":[41.49,38.73],"Nevşehir":[34.71,38.62],"Niğde":[34.68,37.97],"Ordu":[37.88,40.98],
"Rize":[40.52,41.02],"Sakarya":[30.40,40.78],"Samsun":[36.33,41.29],"Siirt":[41.94,37.93],
"Sinop":[35.15,42.03],"Sivas":[37.02,39.75],"Tekirdağ":[27.51,40.98],"Tokat":[36.55,40.31],
"Trabzon":[39.72,41.00],"Tunceli":[39.54,39.11],"Şanlıurfa":[38.79,37.16],"Uşak":[29.41,38.68],
"Van":[43.38,38.49],"Yozgat":[34.81,39.82],"Zonguldak":[31.80,41.45],"Aksaray":[34.03,38.37],
"Bayburt":[40.23,40.26],"Karaman":[33.22,37.18],"Kırıkkale":[33.51,39.85],"Batman":[41.13,37.88],
"Şırnak":[42.46,37.52],"Bartın":[32.34,41.64],"Ardahan":[42.70,41.11],"Iğdır":[44.04,39.92],
"Yalova":[29.28,40.65],"Karabük":[32.63,41.20],"Kilis":[37.12,36.72],"Osmaniye":[36.25,37.07],
"Düzce":[31.16,40.84]
};

/* Basitleştirilmiş Türkiye sınırı [boylam, enlem] */
const TR_SINIR = [
[26.05,41.72],[26.60,41.95],[27.50,42.05],[28.05,41.98],[28.60,41.55],[29.10,41.22],[30.00,41.15],
[30.80,41.10],[31.40,41.32],[32.30,41.75],[33.30,42.02],[34.00,42.05],[34.60,42.06],[35.20,42.08],
[35.60,41.80],[36.10,41.60],[36.40,41.32],[37.00,41.10],[37.90,41.05],[39.00,41.05],[39.90,41.10],
[40.60,41.28],[41.00,41.52],[41.55,41.52],[42.10,41.50],[42.85,41.58],[43.45,41.12],[43.60,40.35],
[44.10,40.05],[44.82,39.72],[44.05,39.40],[44.40,38.40],[44.30,37.90],[44.05,37.32],[43.00,37.25],
[42.30,37.22],[41.30,37.10],[40.20,36.92],[39.00,36.70],[38.00,36.75],[37.40,36.70],[36.60,36.52],
[36.30,36.20],[36.20,35.88],[35.95,36.30],[35.80,36.60],[35.20,36.78],[34.90,36.72],[34.00,36.30],
[33.50,36.10],[32.80,36.10],[32.00,36.55],[31.40,36.80],[30.90,36.85],[30.60,36.85],[30.45,36.30],
[29.70,36.20],[29.30,36.40],[28.90,36.70],[28.20,36.63],[27.70,36.68],[28.10,36.90],[27.40,37.03],
[27.60,37.20],[27.25,37.65],[26.90,37.70],[27.05,38.10],[26.35,38.17],[26.75,38.40],[26.85,38.73],
[26.65,39.00],[26.10,39.25],[26.65,39.55],[26.20,39.62],[26.20,40.05],[26.18,40.40],[26.68,40.60],
[26.10,40.75],[26.35,41.30],[26.05,41.72]
];

/* Marmara Denizi (deniz rengiyle üstüne çizilir) */
const TR_MARMARA = [
[27.05,40.45],[27.95,40.35],[28.80,40.38],[29.30,40.45],[29.95,40.60],[29.75,40.85],
[29.00,40.80],[28.20,40.85],[27.45,40.75]
];
