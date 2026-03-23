import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, 
  StatusBar, ScrollView, TextInput, Animated, Platform, Image, 
  KeyboardAvoidingView, Share, Modal, useWindowDimensions, Linking, AppState
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const wordDatabase = require('./assets/words.json');
const DEFAULT_AVATARS = ['🐟', '🐠', '🐡', '🐂', '🐃', '🐄', '🐒', '🐵', '🦍', '🐟', '🐂', '🐒'];

const GAME_NAME = "KECAP SUMPUT";
const GAME_VERSION = "v1.0";

const DICTIONARY = {
  Sunda: {
    GAME_SUB: "Édisi Pangandaran",
    ROLE_CIVILIAN: "Marlin",
    ROLE_UNDERCOVER: "Banteng",
    ROLE_MRWHITE: "Lutung",
    MR_WHITE_DESC: "Kosong. Dengekeun tebakan batur.",
    LANG_BTN: "UBAH BASA: SUNDA",
    START: "KAWIT MAIN",
    SETUP_ROLE: "ATUR PERAN",
    BACK: "KEMBALI",
    TOTAL: "TOTAL MARLIN",
    NEXT: "TERAS",
    SETUP_PLAYER: "PROFIL MARLIN",
    START_ROUND: "KAWIT RONDE",
    TURN: "GILIRAN",
    OPEN_CARD: "BUKA KARTU",
    CLOSE_PASS: "TUTUP & OPER",
    YOUR_ROLE: "PERAN ANJEUN",
    SECRET_WORD: "KECAP RAHASIA",
    INFO: "INFO:",
    DISCUSSION: "WAKTOSNA DISKUSI",
    HINT: "Pasihan petunjuk kecap anjeun!",
    VOTE_BTN: "PILIH TERSANGKA",
    ELIMINATE: "ELIMINASI",
    ELIMINATED_TXT: "TERELIMINASI",
    REAL_ROLE: "PERAN ASLI",
    CONTINUE: "TERAS",
    GUESS_TITLE: "TEBAKAN LUTUNG",
    GUESS_DESC: "Ketik tebakan anjeun kanggo kecap Marlin!",
    GUESS_INPUT: "Lebetkeun tebakan...",
    GUESS_BTN: "KUNCI TEBAKAN",
    SCOREBOARD: "PAPAN SKOR",
    PLAY_AGAIN: "MAIN DEUI RONDE",
    MENU: "WANGSUL KA MENU",
    CANCEL: "BATAL",
    TAKE_PIC: "JEPRET FOTO",
    TAKE_PROFILE: "JEPRET PROFIL",
    ALERT_INVALID_TITLE: "TEU VALID!",
    ALERT_INVALID_MSG: "Tebakan teu kenging ngandung angka atanapi karakter husus!",
    ALERT_WRONG_TITLE: "SALAH TEBAK!",
    ALERT_WRONG_MSG: "Tebakan kecap rahasia Lutung salah!",
    ALERT_BTN_OK: "TERAS",
    CLAIM_WORD: "KLAIM 50 KATA EKSTRA",
    CLAIMED: "KATA EKSTRA AKTIF",
    CLAIM_DESC: "Kéngingkeun tambahan 50 KATA kategori umum ku cara Follow Instagram Developer!\n\n*Klaim ngan bisa dilakukeun 1x per alat. Sistem bakal mariksa status follow anjeun.",
    INFO_TITLE: "INFO & ATURAN",
    INFO_HOWTO_TITLE: "CARA MAIN",
    INFO_HOWTO_DESC: "Saban giliran, anjeun MUNG kénging nyebatkeun 1 KECAP / FRASA pondok minangka pituduh kecap rahasia tanpa ngajelaskeun teuing.",
    INFO_ROLE_TITLE: "PERAN PEMAIN",
    INFO_ROLE_DESC1: "Marlin: Apal kecap aslina.",
    INFO_ROLE_DESC2: "Banteng: Kénging kecap nu mirip, kudu nyaru.",
    INFO_ROLE_DESC3: "Lutung: Teu apal kecap pisan, kudu nebak di akhir.",
    INFO_ROUND_TITLE: "PUTARAN & RONDE",
    INFO_ROUND_DESC: "1 Putaran réngsé sanggeus kabéh pamaén méré pituduh terus VOTE. Kaulinan maju nepi ka aya tim nu meunang (1 Ronde).",
    INFO_SCORE_TITLE: "POIN SKOR",
    INFO_SCORE_DESC: "Meunang = +10 Poin\nSalamet ti Vote = +5 Poin\nKaéleminasi = -20 (Vote mimiti) / -10 (Vote saterusna).",
    UNDERSTAND: "KURING NGAHARTI"
  },
  Indonesia: {
    GAME_SUB: "Edisi Pangandaran",
    ROLE_CIVILIAN: "Marlin",
    ROLE_UNDERCOVER: "Banteng",
    ROLE_MRWHITE: "Lutung",
    MR_WHITE_DESC: "Kosong. Dengarkan tebakan lainnya.",
    LANG_BTN: "UBAH BAHASA: INDONESIA",
    START: "MULAI MAIN",
    SETUP_ROLE: "ATUR PERAN",
    BACK: "KEMBALI",
    TOTAL: "TOTAL MARLIN",
    NEXT: "LANJUT",
    SETUP_PLAYER: "PROFIL MARLIN",
    START_ROUND: "MULAI RONDE",
    TURN: "GILIRAN",
    OPEN_CARD: "BUKA KARTU",
    CLOSE_PASS: "TUTUP & OPER",
    YOUR_ROLE: "PERAN KAMU",
    SECRET_WORD: "KATA RAHASIA",
    INFO: "INFO:",
    DISCUSSION: "WAKTUNYA DISKUSI",
    HINT: "Berikan petunjuk untuk katamu!",
    VOTE_BTN: "PILIH TERSANGKA",
    ELIMINATE: "ELIMINASI",
    ELIMINATED_TXT: "TERELIMINASI",
    REAL_ROLE: "PERAN ASLI",
    CONTINUE: "LANJUTKAN",
    GUESS_TITLE: "TEBAKAN LUTUNG",
    GUESS_DESC: "Ketik tebakanmu untuk kata Marlin!",
    GUESS_INPUT: "Masukkan tebakan...",
    GUESS_BTN: "KUNCI TEBAKAN",
    SCOREBOARD: "PAPAN SKOR",
    PLAY_AGAIN: "MAINKAN RONDE",
    MENU: "KEMBALI KE MENU",
    CANCEL: "BATAL",
    TAKE_PIC: "JEPRET FOTO",
    TAKE_PROFILE: "JEPRET PROFIL",
    ALERT_INVALID_TITLE: "TIDAK VALID!",
    ALERT_INVALID_MSG: "Tebakan tidak boleh mengandung angka atau karakter spesial!",
    ALERT_WRONG_TITLE: "SALAH TEBAK!",
    ALERT_WRONG_MSG: "Tebakan kata rahasia Lutung salah!",
    ALERT_BTN_OK: "LANJUTKAN",
    CLAIM_WORD: "KLAIM 50 KATA EKSTRA",
    CLAIMED: "KATA EKSTRA AKTIF",
    CLAIM_DESC: "Dapatkan tambahan 50 KATA kategori umum dengan Follow Instagram Developer!\n\n*Klaim hanya bisa dilakukan 1x per perangkat. Sistem akan mengecek status follow kamu.",
    INFO_TITLE: "INFO & ATURAN",
    INFO_HOWTO_TITLE: "CARA BERMAIN",
    INFO_HOWTO_DESC: "Setiap giliran, kamu HANYA boleh menyebutkan 1 KATA / FRASA pendek untuk memberi petunjuk kata rahasiamu tanpa membuatnya terlalu jelas.",
    INFO_ROLE_TITLE: "PERAN PEMAIN",
    INFO_ROLE_DESC1: "Marlin: Tahu kata aslinya.",
    INFO_ROLE_DESC2: "Banteng: Mendapat kata yang mirip, harus berbaur.",
    INFO_ROLE_DESC3: "Lutung: Tidak tahu kata sama sekali, harus menebak di akhir.",
    INFO_ROUND_TITLE: "PUTARAN & RONDE",
    INFO_ROUND_DESC: "1 Putaran selesai setelah semua pemain menyebutkan petunjuk lalu melakukan VOTE. Permainan berlanjut hingga salah satu tim menang (1 Ronde).",
    INFO_SCORE_TITLE: "POIN SKOR",
    INFO_SCORE_DESC: "Menang = +10 Poin\nBertahan dari Vote = +5 Poin\nTereliminasi = -20 (Vote pertama) / -10 (Vote lanjut).",
    UNDERSTAND: "SAYA MENGERTI"
  },
  Inggris: {
    GAME_SUB: "Pangandaran Edition",
    ROLE_CIVILIAN: "Marlin",
    ROLE_UNDERCOVER: "Banteng",
    ROLE_MRWHITE: "Lutung",
    MR_WHITE_DESC: "Empty. Listen to the others' guesses.",
    LANG_BTN: "CHANGE LANG: ENGLISH",
    START: "START GAME",
    SETUP_ROLE: "SETUP ROLES",
    BACK: "BACK",
    TOTAL: "TOTAL MARLINS",
    NEXT: "NEXT",
    SETUP_PLAYER: "MARLIN PROFILES",
    START_ROUND: "START ROUND",
    TURN: "TURN",
    OPEN_CARD: "OPEN CARD",
    CLOSE_PASS: "CLOSE & PASS",
    YOUR_ROLE: "YOUR ROLE",
    SECRET_WORD: "SECRET WORD",
    INFO: "INFO:",
    DISCUSSION: "DISCUSSION TIME",
    HINT: "Give a hint for your word!",
    VOTE_BTN: "VOTE SUSPECT",
    ELIMINATE: "ELIMINATE",
    ELIMINATED_TXT: "ELIMINATED",
    REAL_ROLE: "REAL ROLE",
    CONTINUE: "CONTINUE",
    GUESS_TITLE: "LUTUNG GUESS",
    GUESS_DESC: "Type your guess for the Marlin word!",
    GUESS_INPUT: "Enter guess...",
    GUESS_BTN: "LOCK GUESS",
    SCOREBOARD: "SCOREBOARD",
    PLAY_AGAIN: "PLAY ROUND",
    MENU: "BACK TO MENU",
    CANCEL: "CANCEL",
    TAKE_PIC: "TAKE PHOTO",
    TAKE_PROFILE: "TAKE PROFILE",
    ALERT_INVALID_TITLE: "INVALID!",
    ALERT_INVALID_MSG: "Guesses cannot contain numbers or special characters!",
    ALERT_WRONG_TITLE: "WRONG GUESS!",
    ALERT_WRONG_MSG: "The Lutung secret word guess is wrong!",
    ALERT_BTN_OK: "CONTINUE",
    CLAIM_WORD: "CLAIM 50 EXTRA WORDS",
    CLAIMED: "EXTRA WORDS ACTIVE",
    CLAIM_DESC: "Get an extra 50 WORDS in general categories by Following the Developer's Instagram!\n\n*Claims can only be made 1x per device. The system will verify your follow status.",
    INFO_TITLE: "INFO & RULES",
    INFO_HOWTO_TITLE: "HOW TO PLAY",
    INFO_HOWTO_DESC: "Each turn, you are ONLY allowed to say 1 short WORD / PHRASE to give a hint of your secret word without making it too obvious.",
    INFO_ROLE_TITLE: "PLAYER ROLES",
    INFO_ROLE_DESC1: "Marlin: Knows the original word.",
    INFO_ROLE_DESC2: "Banteng: Gets a similar word, must blend in.",
    INFO_ROLE_DESC3: "Lutung: Doesn't know the word at all, must guess at the end.",
    INFO_ROUND_TITLE: "TURNS & ROUNDS",
    INFO_ROUND_DESC: "1 Turn is completed after all players give a hint and then VOTE. The game continues until one team wins (1 Round).",
    INFO_SCORE_TITLE: "SCORE POINTS",
    INFO_SCORE_DESC: "Win = +10 Points\nSurvive Vote = +5 Points\nEliminated = -20 (First vote) / -10 (Subsequent votes).",
    UNDERSTAND: "I UNDERSTAND"
  }
};

const EXACT_TRANSLATIONS = {
  Sunda: {
    "Pantai Barat": "Pasisir Kulon", "Pantai Timur": "Pasisir Wétan", "Gunung": "Gunung", "Banteng": "Banteng Liar", "Rusa": "Uncal",
    "Gua Jepang": "Guha Jepang", "Es Kelapa Muda": "És Dawegan", "Kopi Hitam": "Kopi Hideung", "Teh Manis": "Cai Téh Amis",
    "Sepeda Motor": "Motor", "Rumah": "Bumi", "Garam": "Uyah", "Kucing": "Ucing", "Anjing": "Gogog", "Matahari": "Panonpoé",
    "Spot utama melihat sunset, ombaknya bersahabat untuk berenang dan surfing.": "Tempat utama ningali sunset, ombakna leuleuy pikeun ngojay sareng surfing.",
    "Surganya kuliner seafood dan tempat terbaik berburu sunrise di pagi buta.": "Surgana kuliner seafood sareng tempat pangsaéna moro sunrise wanci subuh.",
    "Sungai bening dengan aktivitas Body Rafting menembus gua dan pepohonan rimbun.": "Walungan hérang kalawan aktivitas Body Rafting nembus guha sareng tatangkalan gomplok.",
    "Dikenal sebagai Cukang Taneuh, wisata perahu menyusuri tebing eksotis bak kanyon Amerika.": "Dipikawanoh salaku Cukang Taneuh, wisata parahu nyusud gawir éksotis siga kanyon Amérika.",
    "Pantai eksotis dengan pulau-pulau karang kecil, sangat cocok untuk kemping.": "Pasisir éksotis kalawan pulo-pulo karang leutik, cocog pisan keur kémping.",
    "Pantai dengan ombak panjang yang menjadi favorit para peselancar lokal maupun dunia.": "Pasisir kalawan ombak panjang nu jadi kadeudeuh peselancar lokal jeung dunya.",
    "Bukit karang dengan pemandangan laut lepas, konon ada batu berbentuk sirip hiu.": "Pasir karang kalawan titingalian laut lepas, cenah aya batu wangun sirip hiu.",
    "Kawasan perhutani dengan legenda cinta sejati nenek (nini) yang menunggu kakeknya.": "Wewengkon leuweung kalawan lalakon cinta sajati nini nu nungguan akinna.",
    "Sup ikan khas Pangandaran berkuah kuning segar dengan paduan kecombrang (honje).": "Sop lauk has Pangandaran kuah konéng seger kalawan campuran honjé.",
    "Ikan asin primadona oleh-oleh Pangandaran, dagingnya tebal dan empuk seperti roti saat digoreng.": "Lauk asin andalan oleh-oleh Pangandaran, dagingna kandel sarta hipu siga roti lamun digoréng.",
    "Hutan konservasi di semenanjung Pangandaran yang dipenuhi monyet, rusa, dan gua bersejarah.": "Leuweung cagar di samenanjung Pangandaran nu pinuh ku monyét, uncal, sareng guha sajarah.",
    "Area pantai bersih tanpa karang, tempat bersandar bangkai kapal menteri Susi.": "Wewengkon pasisir beresih tanpa karang, tempat nyarandé bangké kapal menteri Susi.",
    "Warung sate legendaris di Pangandaran yang sudah berdiri puluhan tahun.": "Warung saté legendaris di Pangandaran nu geus ngadeg mangpuluh-puluh taun.",
    "Sate ayam dengan bumbu kacang kental yang umum ditemui di berbagai daerah.": "Saté hayam kalawan bumbu suuk kandel nu ilahar kapanggih di rupa-rupa wewengkon.",
    "Gua pertahanan yang digali paksa pada masa penjajahan Dai Nippon.": "Guha pertahanan nu digali paksa dina jaman penjajahan Dai Nippon.",
    "Gua dengan stalaktit indah dan konon dulunya adalah keraton keraton Prabu Anggalarang.": "Guha kalawan stalaktit éndah tur cenah baheulana keraton Prabu Anggalarang.",
    "Minuman segar dari bunga kecombrang yang berkhasiat menurunkan kolesterol.": "Inuman seger tina kembang honjé nu mangpaat nurunkeun kolésterol.",
    "Minuman wajib pesisir pantai yang langsung diseruput dari batoknya.": "Inuman wajib pasisir nu langsung disuruput tina batokna.",
    "Singkong fermentasi khas Sunda dengan rasa manis legit dan sedikit asam.": "Sampeu peuyeum has Sunda nu rasana amis legit tur rada haseum.",
    "Sajian fermentasi serupa peuyeum, namun biasanya lebih lembek dan berair.": "Katuangan peuyeum nu sarupa, tapi biasana leuwih hipu tur caian.",
    "Aquarium raksasa indoor di Pangandaran yang menampilkan biota laut Indonesia.": "Akuarium badag di jero rohangan di Pangandaran nu mintonkeun biota laut Indonésia.",
    "Wisata edukasi di Pangandaran untuk mengenal berbagai jenis nyamuk dan risetnya.": "Wisata atikan di Pangandaran pikeun mikawanoh rupa-rupa reungit sareng risétna.",
    "Maskapai penerbangan perintis milik Susi Pudjiastuti, tokoh asli Pangandaran.": "Maskapai penerbangan panaratas milik Susi Pudjiastuti, inohong pituin Pangandaran.",
    "Bandar udara yang berlokasi di Cijulang, melayani rute perintis ke Pangandaran.": "Bandara nu lokasina di Cijulang, ngalayanan rute panaratas ka Pangandaran.",
    "Mitos penguasa laut selatan yang erat kaitannya dengan pantangan memakai baju hijau.": "Mitos pangawasa laut kidul nu raket patalina jeung pantangan maké baju héjo.",
    "Warna pakaian yang menjadi mitos larangan saat berkunjung ke pantai selatan.": "Warna papakéan nu jadi mitos larangan nalika ulin ka pasisir kidul.",
    "Hewan liar dilindungi yang sesekali bisa terlihat di kawasan Cagar Alam Pananjung.": "Sato liar ditangtayungan nu sakapeung sok katingali di wewengkon Cagar Alam Pananjung.",
    "Mamalia jinak yang berkeliaran bebas menyapa wisatawan di sekitar Cagar Alam.": "Sato leuleuy nu ngulampreng bébas nyapa wisatawan di sabudeureun Cagar Alam.",
    "Bunga langka padma yang sesekali mekar di dalam Cagar Alam Pangandaran.": "Kembang langka padma nu sakapeung mekar di jero Cagar Alam Pangandaran.",
    "Bunga berbau busuk (Amorphophallus) yang bentuknya menjulang tinggi ke atas.": "Kembang bau bangké (Amorphophallus) nu wangunna manjangan luhur ka luhur.",
    "Kendaraan hias dengan musik keras, favorit wisatawan untuk keliling Pangandaran malam hari.": "Kandaraan hias kalawan musik tarik, kadeudeuh wisatawan pikeun kuriling Pangandaran tipeuting.",
    "Sepeda panjang berboncengan yang banyak disewakan di pinggir Pantai Barat.": "Sapéda panjang boncéngan nu loba diséwakeun di gigireun Pasisir Kulon.",
    "Olahraga berselancar menunggangi ombak, sangat populer di Pantai Batu Karas.": "Olahraga selancar nunggang ombak, kawentar pisan di Pasisir Batu Karas.",
    "Menyusuri arus sungai menggunakan pelampung badan, populer di Citumang & Green Canyon.": "Nyusud arus walungan maké pelampung awak, kawentar di Citumang & Green Canyon.",
    "Ruang publik megah di Pamugaran dengan menara pandang untuk rekreasi warga.": "Tempat ulin lega tur megah di Pamugaran kalawan menara pandang pikeun rekreasi warga.",
    "Deretan resto dan cafe estetik pinggir pantai bergaya bambu layaknya Jimbaran Bali.": "Runtuyan résto jeung kafé éstétik gigir pasisir gaya awi lir ibarat Jimbaran Bali.",
    "Ikon patung ikan Blue Marlin yang sedang melompat, lambang Kabupaten Pangandaran.": "Ikon patung lauk Blue Marlin nu keur luncat, lambang Kabupatén Pangandaran.",
    "Kepala daerah yang memimpin jalannya pemerintahan di Kabupaten Pangandaran.": "Kapala daérah nu mingpin jalanna pamaréntahan di Kabupatén Pangandaran.",
    "Pasar tradisional utama tempat warga lokal dan turis mencari kebutuhan pokok harian.": "Pasar tradisional utama tempat warga lokal jeung turis milarian kaperluan pokok sapopoé.",
    "Tempat nelayan membongkar dan melelang tangkapan hasil laut segar di Pantai Timur.": "Tempat pamayang ngabongkar sarta ngalélang hasil laut seger di Pasisir Wétan.",
    
    // TERJEMAHAN KATA EKSTRA (SUNDA)
    "Minuman berkafein pekat yang diseduh tanpa gula atau susu.": "Inuman berkaféin kentel nu dihaneutkeun tanpa gula atawa susu.",
    "Minuman seduhan daun teh yang ditambahkan gula agar terasa manis.": "Inuman cai téh nu ditambahan gula sangkan karasa amis.",
    "Alat musik berdawai yang dipetik atau digenjreng.": "Alat musik kawat nu dipetik atawa digenjréng.",
    "Alat musik berdawai yang dimainkan dengan cara digesek.": "Alat musik kawat nu dimaénkeun ku cara digésék.",
    "Hewan peliharaan berbulu yang suka mengeong dan menangkap tikus.": "Sato ingu buluan nu sok ngéong jeung néwak beurit.",
    "Hewan peliharaan yang setia, menggonggong, dan suka menjaga rumah.": "Sato ingu nu satia, ngagogog, tur sok ngajaga bumi.",
    "Kendaraan beroda dua yang digerakkan oleh mesin.": "Kandaraan roda dua nu digerakkeun ku mesin.",
    "Kendaraan beroda dua klasik yang digerakkan dengan cara dikayuh.": "Kandaraan roda dua klasik nu digerakkeun ku cara dikayuh.",
    "Nasi yang digoreng dengan bumbu kecap, bawang, dan aneka isian.": "Sangu nu digoréng maké bumbu kécap, bawang, jeung rupa-rupa eusi.",
    "Mie yang dimasak kering dengan bumbu gurih manis.": "Mi nu dimasak garing maké bumbu gurih amis.",
    "Kumpulan kertas kosong yang dijilid untuk mencatat sesuatu.": "Kumpulan kertas kosong nu dijilid pikeun nyatet hiji hal.",
    "Buku referensi yang berisi daftar kata beserta arti dan pelafalannya.": "Buku rujukan nu ngabéréndélkeun daptar kecap jeung harti sarta cara macana.",
    "Kendaraan udara yang memiliki sayap dan mesin pendorong untuk terbang.": "Kandaraan hawa nu boga jangjang jeung mesin pendorong pikeun hiber.",
    "Kendaraan udara dengan baling-baling besar di bagian atasnya.": "Kandaraan hawa kalawan baling-baling badag di luhurna.",
    "Alas kaki kasual bersol karet yang nyaman dipakai sehari-hari.": "Sapatu kasual dampal karét nu merenah dipaké sapopoé.",
    "Alas kaki santai dengan tali penahan berbentuk huruf Y.": "Sandal santéy kalawan tali panahan wangun aksara Y.",
    "Alat elektronik berbaling-baling untuk menghasilkan angin.": "Alat éléktronik baling-baling pikeun ngahasilkeun angin.",
    "Mesin pendingin ruangan yang mengatur suhu dan kelembapan.": "Mesin pangtiis rohangan nu ngatur suhu jeung kalembaban.",
    "Alat penunjuk waktu yang dipakai melingkar di pergelangan tangan.": "Alat pituduh waktu nu dipaké ngalingker di pigeulang leungeun.",
    "Alat penunjuk waktu berukuran besar yang dipasang di tembok.": "Alat pituduh waktu badag nu dipasang dina témbok.",
    "Alat bantu penglihatan yang terdiri dari lensa dan bingkai.": "Alat bantu titingalian nu kawangun ti lénsa jeung bingkai.",
    "Lensa tipis yang dipasang langsung menempel pada kornea mata.": "Lénsa ipis nu dipasang langsung napel dina kornéa panon.",
    "Alat tajam bergagang yang digunakan untuk memotong bahan makanan.": "Alat seukeut gagangan nu dipaké motong bahan kadaharan.",
    "Alat pemotong dengan dua bilah pisau yang berporos di tengah.": "Alat motong ku dua wilah péso nu porosna di tengah.",
    "Pelindung kepala dari panas matahari yang memiliki lidah di bagian depan.": "Panglindung sirah tina panas panonpoé nu boga létah di hareupna.",
    "Pelindung kepala keras yang wajib dipakai saat mengendarai motor.": "Panglindung sirah teuas nu wajib dipaké basa tumpak motor.",
    "Pembersih tubuh berbentuk padat atau cair yang menghasilkan busa.": "Pangberesih awak wangun padet atawa éncér nu ngahasilkeun budah.",
    "Cairan khusus untuk mencuci dan membersihkan rambut serta kulit kepala.": "Cai husus pikeun ngumbah jeung meresihan buuk sarta kulit sirah.",
    "Alat berbulu kecil untuk membersihkan sela-sela gigi.": "Alat buluan leutik pikeun meresihan sela-sela huntu.",
    "Krim atau gel pembersih yang dioleskan pada sikat gigi.": "Krim atawa gél pangberesih nu dioléskeun kana sikat huntu.",
    "Alat lipat bertangkai untuk melindungi diri dari hujan atau panas.": "Alat lipet gagangan pikeun ngalindung diri tina hujan atawa panas.",
    "Pakaian tahan air yang menutupi tubuh agar tidak basah saat hujan.": "Papakéan tahan cai nu nutupan awak sangkan teu baseuh pas hujan.",
    "Perabot rumah tangga bertingkat untuk menyimpan baju.": "Parabot rumah tangga tingkat pikeun nyimpen baju.",
    "Perabot rumah tangga tanpa pintu untuk memajang buku-buku.": "Parabot rumah tangga tanpa panto pikeun majang buku-buku.",
    "Alat elektronik berbentuk layar untuk menonton siaran gambar dan suara.": "Alat éléktronik wangun layar pikeun nongton siaran gambar jeung sora.",
    "Alat elektronik yang hanya mengeluarkan siaran berupa suara.": "Alat éléktronik nu ngan ukur ngaluarkeun siaran wangun sora.",
    "Alat tulis berinti grafit yang hasilnya bisa dihapus dengan karet penghapus.": "Alat nulis inti grafit nu hasilna bisa dihapus ku karét panghapus.",
    "Alat tulis yang menggunakan tinta cair untuk menulis.": "Alat nulis nu ngagunakeun mangsi éncér pikeun nulis.",
    "Wadah berbentuk tabung silinder yang biasa digunakan untuk minum.": "Wadah wangun tabung silinder nu biasa dipaké pikeun nginum.",
    "Wadah minum kecil yang memiliki pegangan di salah satu sisinya.": "Wadah nginum leutik nu boga panyepengan di salah sahiji sisina.",
    "Wadah ceper berbentuk bundar untuk meletakkan makanan.": "Wadah cépér wangun buleud pikeun nyimpen kadaharan.",
    "Wadah cekung dan dalam, biasanya digunakan untuk makanan berkuah.": "Wadah legok jeung jero, biasana dipaké pikeun kadaharan caina.",
    "Mesin pendingin penyimpan makanan agar awet dan tidak cepat busuk.": "Mesin pangtiis panyimpen kadaharan sangkan awét sarta teu gancang buruk.",
    "Alat pemanas tertutup untuk memanggang atau membakar makanan.": "Alat pamanas katutup pikeun manggang atawa ngaduruk kadaharan.",
    "Kain lebar berbahan tebal untuk menghangatkan tubuh saat tidur.": "Kain lega bahan kandel pikeun ngahaneutkeun awak basa saré.",
    "Kain tipis pelapis kasur atau alas tempat tidur.": "Kain ipis panglapis kasur atawa alas tempat saré.",
    "Perabot berkaki dengan permukaan datar untuk alas bekerja atau makan.": "Parabot sukukan kalawan beungeut rata pikeun alas gawé atawa dahar.",
    "Perabot rumah tangga yang difungsikan sebagai tempat duduk.": "Parabot rumah tangga nu fungsina keur tempat diuk.",
    "Alat logam berlekuk untuk membuka atau menutup gembok.": "Alat logam lékukan pikeun muka atawa nutup gembok.",
    "Alat pengaman berbahan besi yang harus dibuka dengan kuncinya.": "Alat pangaman bahan beusi nu kudu dibuka ku kuncina.",
    "Jalur keluar masuk pada sebuah ruangan yang bisa dibuka tutup.": "Jalur kaluar asup dina hiji rohangan nu bisa dibuka tutup.",
    "Lubang ventilasi udara dan cahaya pada dinding rumah.": "Liang véntilasi hawa jeung cahaya dina témbok bumi.",
    "Bintang pusat tata surya yang memancarkan cahaya dan panas di siang hari.": "Béntang puser tatasurya nu mancarkeun cahaya jeung panas tipeurang.",
    "Satelit alami bumi yang bersinar terang memantulkan cahaya di malam hari.": "Satelit alami bumi nu caang mantulkeun cahaya tipeuting.",
    "Bumbu dapur berbentuk kristal putih yang memberikan rasa asin.": "Bumbu pawon wangun kristal bodas nu méré rasa asin.",
    "Bumbu pemanis berbahan dasar tebu yang sering dicampur dalam minuman.": "Bumbu pangamis tina tiwu nu sok dicampur dina inuman.",
    "Permukaan bumi yang menjulang tinggi, ukurannya lebih besar dari bukit.": "Beungeut bumi nu nanjak luhur, ukuranna leuwih badag batan pasir.",
    "Dataran rendah yang letaknya berada di antara perbukitan atau pegunungan.": "Dataran handap nu perenahna aya di antara pasir atawa pagunungan.",
    "Aliran air tawar memanjang secara alami dari hulu hingga bermuara di laut.": "Aliran cai tawar manjangan sacara alami ti girang nepi ka muara di laut.",
    "Cekungan besar di daratan yang digenangi oleh air tawar secara alami.": "Légok badag di daratan nu kakeueum ku cai tawar sacara alami.",
    "Lembaran tipis berbahan serat kayu yang digunakan untuk media menulis.": "Lambaran ipis tina serat kai nu dipaké média pikeun nulis.",
    "Bahan berserat kayu yang ukurannya lebih tebal dan kaku dari kertas biasa.": "Bahan serat kai nu ukuranna leuwih kandel sarta kaku batan kertas biasa.",
    "Wadah pembawa barang yang dipakai dengan cara digendong di punggung.": "Wadah pamawa barang nu dipaké ku cara digéndong di tonggong.",
    "Wadah besar berbentuk kotak bersleting, biasanya memiliki roda untuk bepergian.": "Wadah badag wangun kotak selétingan, biasana boga roda keur indit-inditan.",
    "Kendaraan darat roda empat yang memiliki mesin dan kabin penumpang.": "Kandaraan darat roda opat nu boga mesin jeung kabin panumpang.",
    "Kendaraan darat besar beroda banyak untuk mengangkut banyak penumpang sekaligus.": "Kandaraan darat badag roda loba pikeun ngangkut panumpang sakaligus.",
    "Rangkaian gerbong yang berjalan di atas rel besi.": "Runtuyan gerbong nu leumpang di luhur rél beusi.",
    "Kendaraan bermotor besar yang didesain khusus untuk mengangkut barang berat.": "Kandaraan bermotor badag nu didésain husus pikeun ngangkut barang beurat.",
    "Biji-bijian putih hasil gilingan padi yang merupakan makanan pokok orang Indonesia.": "Siki-sikian bodas hasil gilingan paré nu mangrupa kadaharan poko urang Indonésia.",
    "Biji-bijian yang diolah menjadi tepung terigu sebagai bahan utama pembuat roti.": "Siki-sikian nu diolah jadi tipung tarigu salaku bahan utama nyieun roti.",
    "Kucing besar yang dikenal sebagai raja hutan dengan surai lebat di lehernya.": "Ucing badag nu dipikawanoh salaku raja leuweung nu bulu kandel di beuheungna.",
    "Kucing buas berukuran besar yang memiliki corak belang-belang.": "Ucing galak ukuran badag nu mibanda corak belang-belang.",
    "Mamalia berkaki empat yang pandai berlari dan sering dijadikan hewan tunggangan.": "Sato mamalia suku opat nu pinter lumpat sarta mindeng jadi sato tunggangan.",
    "Mamalia berkaki empat ternak penghasil daging dan susu murni.": "Sato mamalia suku opat ingon-ingon ngahasilkeun daging jeung susu murni.",
    "Primata berukuran kecil hingga sedang yang pandai memanjat dan memiliki ekor.": "Primata ukuran leutik nepi ka sedeng nu pinter naék tatangkalan sarta boga buntut.",
    "Kera besar berbulu kemerahan asal Kalimantan dan Sumatera yang tidak berekor.": "Monyét badag buluan semu beureum asal Kalimantan jeung Sumatera nu teu boga buntut.",
    "Komputer jinjing portabel yang bisa dilipat dan dibawa kemana-mana.": "Komputer jinjing portabel nu bisa dilipet sarta dibawa ka mana-mana.",
    "Perangkat pintar berlayar sentuh lebar tanpa keyboard fisik bawaan.": "Alat pinter layar toél lega tanpa keyboard fisik bawaan.",
    "Telepon genggam pintar yang memiliki fungsi menyerupai komputer mini.": "Telepon sélulér pinter nu boga fungsi nyarupaan komputer mini.",
    "Alat komunikasi suara yang tersambung kabel dan tidak bisa dibawa-bawa.": "Alat komunikasi sora nu nyambung kabel sarta teu bisa dibawa-bawa.",
    "Pakaian santai tanpa kerah dan kancing, sering disebut T-shirt.": "Papakéan santéy tanpa kerah jeung kancing, sering disebut T-shirt.",
    "Pakaian formal atau semi formal berkerah yang memiliki deretan kancing di depan.": "Papakéan formal atawa semi formal kerahan nu boga jajaran kancing di hareup.",
    "Pakaian penutup bagian bawah tubuh yang menutupi kaki hingga mata kaki.": "Papakéan panutup awak handap nu nutupan suku nepi ka mumuncangan.",
    "Pakaian bawahan santai yang ukurannya hanya selutut atau di atas lutut.": "Papakéan bawahan santéy nu ukuranna ngan saukur tuur atawa luhureun tuur.",
    "Benda elektronik bercahaya untuk menerangi ruangan yang gelap.": "Barang éléktronik caang pikeun nyaangan rohangan nu poék.",
    "Sumber penerangan tradisional berupa batang parafin bersumbu yang dibakar.": "Sumber panerangan tradisional mangrupa watang parafin sumbuan nu diduruk.",
    "Alas tebal dan empuk berukuran besar untuk berbaring atau tidur.": "Alas kandel sarta hipu ukuran badag pikeun ngagolér atawa saré.",
    "Alas kepala berukuran kecil yang empuk, sangat nyaman dipakai tidur.": "Alas sirah ukuran leutik nu hipu, pohara merenah dipaké saré.",
    "Bumbu umbi lapis yang wajib ada untuk menumis berbagai masakan Nusantara.": "Bumbu beuti lapis nu wajib aya pikeun ngagoréng bumbu asakan Nusantara.",
    "Bumbu dapur beraroma tajam bersiung-siung yang umum untuk bumbu dasar.": "Bumbu pawon seungit seukeut mangsiung-siung nu ilahar jadi bumbu dasar.",
    "Bumbu cair kental berwarna hitam legam yang terbuat dari kedelai dan gula aren.": "Bumbu éncér kandel warna hideung lestreng tina kadelé jeung gula kawung.",
    "Bumbu cair berwarna merah kental dengan cita rasa pedas dan sedikit asam.": "Bumbu éncér warna beureum kandel mibanda rasa lada sarta rada haseum.",
    "Struktur putih dan keras di dalam mulut untuk mengunyah makanan.": "Wangunan bodas sarta teuas di jero sungut pikeun nyapek kadaharan.",
    "Otot fleksibel di dalam mulut yang berfungsi sebagai indra pengecap rasa.": "Otot fléksibel di jero sungut nu fungsina minangka indra pangrasa.",
    "Alat pernapasan dan indra penciuman yang menonjol di tengah wajah.": "Alat rénghap jeung indra pangambeu nu nonjol di tengah beungeut.",
    "Organ pendengaran yang letaknya berada di sisi kiri dan kanan kepala.": "Organ pangrungu nu perenahna di gigir kénca jeung katuhu sirah.",
    "Organ pemompa darah yang terus berdetak di dalam rongga dada.": "Organ ngompa getih nu tuluy ratug di jero rongga dada.",
    "Organ pernapasan spons di dada tempat pertukaran oksigen dan karbon dioksida.": "Organ rénghap spons di dada tempat bursa oksigén jeung karbon dioksida.",
    "Bangunan tempat tinggal dan menetap untuk berteduh dari hujan dan panas.": "Wangunan tempat cicing sarta netep pikeun ngiuhan tina hujan jeung panas.",
    "Tempat berteduh portabel dari kain yang biasa dipakai kemping di alam bebas.": "Tempat ngiuhan portabel tina lawon nu biasa dipaké kémping di alam bébas."
  },
  Inggris: {
    "Pantai Barat": "West Beach", "Pantai Timur": "East Beach", "Gunung": "Mountain", "Banteng": "Wild Bull", "Rusa": "Deer",
    "Gua Jepang": "Japanese Cave", "Es Kelapa Muda": "Young Coconut Ice", "Kopi Hitam": "Black Coffee", "Teh Manis": "Sweet Tea",
    "Sepeda Motor": "Motorcycle", "Rumah": "House", "Garam": "Salt", "Kucing": "Cat", "Anjing": "Dog", "Matahari": "Sun",
    "Spot utama melihat sunset, ombaknya bersahabat untuk berenang dan surfing.": "Main spot to watch the sunset, friendly waves for swimming and surfing.",
    "Surganya kuliner seafood dan tempat terbaik berburu sunrise di pagi buta.": "Seafood culinary paradise and the best place to hunt for sunrise at dawn.",
    "Sungai bening dengan aktivitas Body Rafting menembus gua dan pepohonan rimbun.": "Clear river with Body Rafting activities through caves and lush trees.",
    "Dikenal sebagai Cukang Taneuh, wisata perahu menyusuri tebing eksotis bak kanyon Amerika.": "Known as Cukang Taneuh, a boat tour along exotic cliffs like an American canyon.",
    "Pantai eksotis dengan pulau-pulau karang kecil, sangat cocok untuk kemping.": "Exotic beach with small coral islands, very suitable for camping.",
    "Pantai dengan ombak panjang yang menjadi favorit para peselancar lokal maupun dunia.": "Beach with long waves that is a favorite of local and world surfers.",
    "Bukit karang dengan pemandangan laut lepas, konon ada batu berbentuk sirip hiu.": "Coral hill with open sea views, word has it there is a shark fin shaped rock.",
    "Kawasan perhutani dengan legenda cinta sejati nenek (nini) yang menunggu kakeknya.": "Forestry area with the true love legend of a grandmother (nini) waiting for her grandfather.",
    "Sup ikan khas Pangandaran berkuah kuning segar dengan paduan kecombrang (honje).": "Pangandaran typical fish soup with fresh yellow broth mixed with torch ginger.",
    "Ikan asin primadona oleh-oleh Pangandaran, dagingnya tebal dan empuk seperti roti saat digoreng.": "The prime salted fish souvenir of Pangandaran, thick and soft meat like bread when fried.",
    "Hutan konservasi di semenanjung Pangandaran yang dipenuhi monyet, rusa, dan gua bersejarah.": "Conservation forest in the Pangandaran peninsula filled with monkeys, deer, and historical caves.",
    "Area pantai bersih tanpa karang, tempat bersandar bangkai kapal menteri Susi.": "Clean beach area without corals, the resting place of Minister Susi's shipwreck.",
    "Warung sate legendaris di Pangandaran yang sudah berdiri puluhan tahun.": "Legendary satay stall in Pangandaran that has been standing for decades.",
    "Sate ayam dengan bumbu kacang kental yang umum ditemui di berbagai daerah.": "Chicken satay with thick peanut sauce commonly found in various regions.",
    "Gua pertahanan yang digali paksa pada masa penjajahan Dai Nippon.": "Defense cave forcibly dug during the Dai Nippon occupation.",
    "Gua dengan stalaktit indah dan konon dulunya adalah keraton keraton Prabu Anggalarang.": "Cave with beautiful stalactites and supposedly used to be the palace of King Anggalarang.",
    "Minuman segar dari bunga kecombrang yang berkhasiat menurunkan kolesterol.": "Fresh drink from torch ginger flower that helps lower cholesterol.",
    "Minuman wajib pesisir pantai yang langsung diseruput dari batoknya.": "Must-have coastal drink directly sipped from its shell.",
    "Singkong fermentasi khas Sunda dengan rasa manis legit dan sedikit asam.": "Sundanese typical fermented cassava with a sweet and slightly sour taste.",
    "Sajian fermentasi serupa peuyeum, namun biasanya lebih lembek dan berair.": "Fermented dish similar to peuyeum, but usually softer and watery.",
    "Aquarium raksasa indoor di Pangandaran yang menampilkan biota laut Indonesia.": "Giant indoor aquarium in Pangandaran displaying Indonesian marine biota.",
    "Wisata edukasi di Pangandaran untuk mengenal berbagai jenis nyamuk dan risetnya.": "Educational tour in Pangandaran to get to know various types of mosquitoes and their research.",
    "Maskapai penerbangan perintis milik Susi Pudjiastuti, tokoh asli Pangandaran.": "Pioneer airline owned by Susi Pudjiastuti, a native figure of Pangandaran.",
    "Bandar udara yang berlokasi di Cijulang, melayani rute perintis ke Pangandaran.": "Airport located in Cijulang, serving pioneer routes to Pangandaran.",
    "Mitos penguasa laut selatan yang erat kaitannya dengan pantangan memakai baju hijau.": "Myth of the southern sea ruler closely related to the taboo of wearing green clothes.",
    "Warna pakaian yang menjadi mitos larangan saat berkunjung ke pantai selatan.": "Clothing color that becomes a prohibited myth when visiting the southern beach.",
    "Hewan liar dilindungi yang sesekali bisa terlihat di kawasan Cagar Alam Pananjung.": "Protected wild animals that can occasionally be seen in the Pananjung Nature Reserve area.",
    "Mamalia jinak yang berkeliaran bebas menyapa wisatawan di sekitar Cagar Alam.": "Tame mammals roaming freely greeting tourists around the Nature Reserve.",
    "Bunga langka padma yang sesekali mekar di dalam Cagar Alam Pangandaran.": "Rare padma flower that occasionally blooms inside the Pangandaran Nature Reserve.",
    "Bunga berbau busuk (Amorphophallus) yang bentuknya menjulang tinggi ke atas.": "Foul-smelling flower (Amorphophallus) that towers high upwards.",
    "Kendaraan hias dengan musik keras, favorit wisatawan untuk keliling Pangandaran malam hari.": "Decorated vehicle with loud music, tourists' favorite for touring Pangandaran at night.",
    "Sepeda panjang berboncengan yang banyak disewakan di pinggir Pantai Barat.": "Long tandem bicycles widely rented on the edge of West Beach.",
    "Olahraga berselancar menunggangi ombak, sangat populer di Pantai Batu Karas.": "Surfing sport riding the waves, very popular at Batu Karas Beach.",
    "Menyusuri arus sungai menggunakan pelampung badan, populer di Citumang & Green Canyon.": "Tracing river currents using body floats, popular in Citumang & Green Canyon.",
    "Ruang publik megah di Pamugaran dengan menara pandang untuk rekreasi warga.": "Magnificent public space in Pamugaran with a viewing tower for citizen recreation.",
    "Deretan resto dan cafe estetik pinggir pantai bergaya bambu layaknya Jimbaran Bali.": "A row of aesthetic beachfront restaurants and cafes in bamboo style like Jimbaran Bali.",
    "Ikon patung ikan Blue Marlin yang sedang melompat, lambang Kabupaten Pangandaran.": "The icon of the jumping Blue Marlin fish statue, symbol of Pangandaran Regency.",
    "Kepala daerah yang memimpin jalannya pemerintahan di Kabupaten Pangandaran.": "Regional head leading the government in Pangandaran Regency.",
    "Pasar tradisional utama tempat warga lokal dan turis mencari kebutuhan pokok harian.": "Main traditional market where locals and tourists look for daily basic needs.",
    "Tempat nelayan membongkar dan melelang tangkapan hasil laut segar di Pantai Timur.": "Place where fishermen unload and auction fresh seafood catches at East Beach.",
    
    // TERJEMAHAN KATA EKSTRA (INGGRIS)
    "Minuman berkafein pekat yang diseduh tanpa gula atau susu.": "Strong caffeinated drink brewed without sugar or milk.",
    "Minuman seduhan daun teh yang ditambahkan gula agar terasa manis.": "Steeped tea leaf drink added with sugar to make it sweet.",
    "Alat musik berdawai yang dipetik atau digenjreng.": "Stringed musical instrument that is plucked or strummed.",
    "Alat musik berdawai yang dimainkan dengan cara digesek.": "Stringed musical instrument played by bowing.",
    "Hewan peliharaan berbulu yang suka mengeong dan menangkap tikus.": "Furry pet that likes to meow and catch mice.",
    "Hewan peliharaan yang setia, menggonggong, dan suka menjaga rumah.": "Loyal pet that barks and likes to guard the house.",
    "Kendaraan beroda dua yang digerakkan oleh mesin.": "Two-wheeled vehicle powered by an engine.",
    "Kendaraan beroda dua klasik yang digerakkan dengan cara dikayuh.": "Classic two-wheeled vehicle propelled by pedaling.",
    "Nasi yang digoreng dengan bumbu kecap, bawang, dan aneka isian.": "Fried rice with soy sauce, onions, and various fillings.",
    "Mie yang dimasak kering dengan bumbu gurih manis.": "Noodles cooked dry with sweet savory seasoning.",
    "Kumpulan kertas kosong yang dijilid untuk mencatat sesuatu.": "A collection of bound blank papers for noting things down.",
    "Buku referensi yang berisi daftar kata beserta arti dan pelafalannya.": "Reference book containing a list of words along with their meanings and pronunciations.",
    "Kendaraan udara yang memiliki sayap dan mesin pendorong untuk terbang.": "Air vehicle that has wings and thrust engines to fly.",
    "Kendaraan udara dengan baling-baling besar di bagian atasnya.": "Air vehicle with large rotors on top of it.",
    "Alas kaki kasual bersol karet yang nyaman dipakai sehari-hari.": "Casual rubber-soled footwear that is comfortable for daily wear.",
    "Alas kaki santai dengan tali penahan berbentuk huruf Y.": "Relaxing footwear with Y-shaped holding straps.",
    "Alat elektronik berbaling-baling untuk menghasilkan angin.": "Electronic device with blades to produce wind.",
    "Mesin pendingin ruangan yang mengatur suhu dan kelembapan.": "Room cooling machine that regulates temperature and humidity.",
    "Alat penunjuk waktu yang dipakai melingkar di pergelangan tangan.": "Timepiece worn circling the wrist.",
    "Alat penunjuk waktu berukuran besar yang dipasang di tembok.": "Large timepiece mounted on the wall.",
    "Alat bantu penglihatan yang terdiri dari lensa dan bingkai.": "Vision aid consisting of lenses and a frame.",
    "Lensa tipis yang dipasang langsung menempel pada kornea mata.": "Thin lens attached directly to the cornea of the eye.",
    "Alat tajam bergagang yang digunakan untuk memotong bahan makanan.": "Handled sharp tool used to cut food ingredients.",
    "Alat pemotong dengan dua bilah pisau yang berporos di tengah.": "Cutting tool with two blades pivoted in the middle.",
    "Pelindung kepala dari panas matahari yang memiliki lidah di bagian depan.": "Head protector from sun heat that has a visor at the front.",
    "Pelindung kepala keras yang wajib dipakai saat mengendarai motor.": "Hard head protector that must be worn when riding a motorcycle.",
    "Pembersih tubuh berbentuk padat atau cair yang menghasilkan busa.": "Solid or liquid body cleanser that produces foam.",
    "Cairan khusus untuk mencuci dan membersihkan rambut serta kulit kepala.": "Special liquid for washing and cleaning hair and scalp.",
    "Alat berbulu kecil untuk membersihkan sela-sela gigi.": "Small bristled tool for cleaning between teeth.",
    "Krim atau gel pembersih yang dioleskan pada sikat gigi.": "Cleansing cream or gel applied to a toothbrush.",
    "Alat lipat bertangkai untuk melindungi diri dari hujan atau panas.": "Foldable handled tool to protect from rain or heat.",
    "Pakaian tahan air yang menutupi tubuh agar tidak basah saat hujan.": "Waterproof clothing covering the body so it won't get wet in the rain.",
    "Perabot rumah tangga bertingkat untuk menyimpan baju.": "Tiered household furniture for storing clothes.",
    "Perabot rumah tangga tanpa pintu untuk memajang buku-buku.": "Doorless household furniture for displaying books.",
    "Alat elektronik berbentuk layar untuk menonton siaran gambar dan suara.": "Screen-shaped electronic device for watching picture and sound broadcasts.",
    "Alat elektronik yang hanya mengeluarkan siaran berupa suara.": "Electronic device that only emits audio broadcasts.",
    "Alat tulis berinti grafit yang hasilnya bisa dihapus dengan karet penghapus.": "Graphite-cored writing tool whose results can be erased with a rubber eraser.",
    "Alat tulis yang menggunakan tinta cair untuk menulis.": "Writing tool that uses liquid ink to write.",
    "Wadah berbentuk tabung silinder yang biasa digunakan untuk minum.": "Cylindrical tube-shaped container commonly used for drinking.",
    "Wadah minum kecil yang memiliki pegangan di salah satu sisinya.": "Small drinking container that has a handle on one of its sides.",
    "Wadah ceper berbentuk bundar untuk meletakkan makanan.": "Round flat container for placing food.",
    "Wadah cekung dan dalam, biasanya digunakan untuk makanan berkuah.": "Deep concave container, usually used for soupy food.",
    "Mesin pendingin penyimpan makanan agar awet dan tidak cepat busuk.": "Cooling machine for storing food so it lasts and doesn't rot quickly.",
    "Alat pemanas tertutup untuk memanggang atau membakar makanan.": "Closed heating appliance for baking or roasting food.",
    "Kain lebar berbahan tebal untuk menghangatkan tubuh saat tidur.": "Wide thick fabric cloth to warm the body while sleeping.",
    "Kain tipis pelapis kasur atau alas tempat tidur.": "Thin fabric covering the mattress or bed base.",
    "Perabot berkaki dengan permukaan datar untuk alas bekerja atau makan.": "Legged furniture with a flat surface for working or eating.",
    "Perabot rumah tangga yang difungsikan sebagai tempat duduk.": "Household furniture that functions as a seat.",
    "Alat logam berlekuk untuk membuka atau menutup gembok.": "Notched metal tool to open or close a padlock.",
    "Alat pengaman berbahan besi yang harus dibuka dengan kuncinya.": "Iron safety device that must be opened with its key.",
    "Jalur keluar masuk pada sebuah ruangan yang bisa dibuka tutup.": "Entrance and exit path in a room that can be opened and closed.",
    "Lubang ventilasi udara dan cahaya pada dinding rumah.": "Air and light ventilation hole in the house wall.",
    "Bintang pusat tata surya yang memancarkan cahaya dan panas di siang hari.": "Central star of the solar system emitting light and heat during the day.",
    "Satelit alami bumi yang bersinar terang memantulkan cahaya di malam hari.": "Earth's natural satellite shining brightly reflecting light at night.",
    "Bumbu dapur berbentuk kristal putih yang memberikan rasa asin.": "White crystal shaped kitchen spice that gives a salty taste.",
    "Bumbu pemanis berbahan dasar tebu yang sering dicampur dalam minuman.": "Sugarcane-based sweetening spice often mixed into drinks.",
    "Permukaan bumi yang menjulang tinggi, ukurannya lebih besar dari bukit.": "Towering earth surface, larger in size than a hill.",
    "Dataran rendah yang letaknya berada di antara perbukitan atau pegunungan.": "Lowland located between hills or mountains.",
    "Aliran air tawar memanjang secara alami dari hulu hingga bermuara di laut.": "Natural elongated fresh water flow from upstream to emptying into the sea.",
    "Cekungan besar di daratan yang digenangi oleh air tawar secara alami.": "Large basin on land naturally inundated by fresh water.",
    "Lembaran tipis berbahan serat kayu yang digunakan untuk media menulis.": "Thin sheet made of wood fiber used for writing media.",
    "Bahan berserat kayu yang ukurannya lebih tebal dan kaku dari kertas biasa.": "Wood fiber material that is thicker and stiffer than regular paper.",
    "Wadah pembawa barang yang dipakai dengan cara digendong di punggung.": "Goods carrying container worn by carrying on the back.",
    "Wadah besar berbentuk kotak bersleting, biasanya memiliki roda untuk bepergian.": "Large zippered box-shaped container, usually has wheels for traveling.",
    "Kendaraan darat roda empat yang memiliki mesin dan kabin penumpang.": "Four-wheeled land vehicle having an engine and passenger cabin.",
    "Kendaraan darat besar beroda banyak untuk mengangkut banyak penumpang sekaligus.": "Large multi-wheeled land vehicle to transport many passengers at once.",
    "Rangkaian gerbong yang berjalan di atas rel besi.": "A series of wagons running on iron rails.",
    "Kendaraan bermotor besar yang didesain khusus untuk mengangkut barang berat.": "Large motorized vehicle specially designed to transport heavy goods.",
    "Biji-bijian putih hasil gilingan padi yang merupakan makanan pokok orang Indonesia.": "White grains from milled rice which is the staple food of Indonesians.",
    "Biji-bijian yang diolah menjadi tepung terigu sebagai bahan utama pembuat roti.": "Grains processed into wheat flour as the main ingredient for making bread.",
    "Kucing besar yang dikenal sebagai raja hutan dengan surai lebat di lehernya.": "Big cat known as the king of the jungle with a thick mane on its neck.",
    "Kucing buas berukuran besar yang memiliki corak belang-belang.": "Large wild cat with striped patterns.",
    "Mamalia berkaki empat yang pandai berlari dan sering dijadikan hewan tunggangan.": "Four-legged mammal good at running and often used as a riding animal.",
    "Mamalia berkaki empat ternak penghasil daging dan susu murni.": "Four-legged farm mammal producing meat and pure milk.",
    "Primata berukuran kecil hingga sedang yang pandai memanjat dan memiliki ekor.": "Small to medium sized primate good at climbing and has a tail.",
    "Kera besar berbulu kemerahan asal Kalimantan dan Sumatera yang tidak berekor.": "Reddish hairy great ape from Kalimantan and Sumatra with no tail.",
    "Komputer jinjing portabel yang bisa dilipat dan dibawa kemana-mana.": "Portable laptop computer that can be folded and carried anywhere.",
    "Perangkat pintar berlayar sentuh lebar tanpa keyboard fisik bawaan.": "Smart device with a wide touchscreen without a built-in physical keyboard.",
    "Telepon genggam pintar yang memiliki fungsi menyerupai komputer mini.": "Smart mobile phone having functions resembling a mini computer.",
    "Alat komunikasi suara yang tersambung kabel dan tidak bisa dibawa-bawa.": "Wired voice communication device that cannot be carried around.",
    "Pakaian santai tanpa kerah dan kancing, sering disebut T-shirt.": "Casual clothing without a collar and buttons, often called a T-shirt.",
    "Pakaian formal atau semi formal berkerah yang memiliki deretan kancing di depan.": "Formal or semi-formal collared clothing having a row of buttons on the front.",
    "Pakaian penutup bagian bawah tubuh yang menutupi kaki hingga mata kaki.": "Clothing covering the lower body that covers the legs down to the ankles.",
    "Pakaian bawahan santai yang ukurannya hanya selutut atau di atas lutut.": "Casual bottom clothing whose size is only knee-length or above the knee.",
    "Benda elektronik bercahaya untuk menerangi ruangan yang gelap.": "Glowing electronic object to illuminate a dark room.",
    "Sumber penerangan tradisional berupa batang parafin bersumbu yang dibakar.": "Traditional light source in the form of a wicked paraffin stick that is burned.",
    "Alas tebal dan empuk berukuran besar untuk berbaring atau tidur.": "Thick and soft large sized base for lying down or sleeping.",
    "Alas kepala berukuran kecil yang empuk, sangat nyaman dipakai tidur.": "Small soft headrest, very comfortable for sleeping.",
    "Bumbu umbi lapis yang wajib ada untuk menumis berbagai masakan Nusantara.": "Layered bulb spice that must be present for stir-frying various Indonesian dishes.",
    "Bumbu dapur beraroma tajam bersiung-siung yang umum untuk bumbu dasar.": "Sharp smelling clove-shaped kitchen spice common for base seasoning.",
    "Bumbu cair kental berwarna hitam legam yang terbuat dari kedelai dan gula aren.": "Pitch black thick liquid seasoning made from soybeans and palm sugar.",
    "Bumbu cair berwarna merah kental dengan cita rasa pedas dan sedikit asam.": "Thick red liquid seasoning with a spicy and slightly sour taste.",
    "Struktur putih dan keras di dalam mulut untuk mengunyah makanan.": "White and hard structure inside the mouth for chewing food.",
    "Otot fleksibel di dalam mulut yang berfungsi sebagai indra pengecap rasa.": "Flexible muscle inside the mouth that functions as the sense of taste.",
    "Alat pernapasan dan indra penciuman yang menonjol di tengah wajah.": "Breathing apparatus and sense of smell protruding in the middle of the face.",
    "Organ pendengaran yang letaknya berada di sisi kiri dan kanan kepala.": "Hearing organ located on the left and right sides of the head.",
    "Organ pemompa darah yang terus berdetak di dalam rongga dada.": "Blood pumping organ that continues to beat inside the chest cavity.",
    "Organ pernapasan spons di dada tempat pertukaran oksigen dan karbon dioksida.": "Spongy respiratory organ in the chest where oxygen and carbon dioxide exchange.",
    "Bangunan tempat tinggal dan menetap untuk berteduh dari hujan dan panas.": "Building to live and settle to take shelter from rain and heat.",
    "Tempat berteduh portabel dari kain yang biasa dipakai kemping di alam bebas.": "Portable fabric shelter commonly used for camping in the wild."
  }
};

const translateWord = (text, lang) => {
  if (lang === 'Indonesia' || !text) return text;
  if (EXACT_TRANSLATIONS[lang] && EXACT_TRANSLATIONS[lang][text]) {
    return EXACT_TRANSLATIONS[lang][text];
  }
  return text; 
};

// BACKGROUND ANIMATED ICONS
const AnimatedBackgroundDecor = () => {
  const { width: screenWidth } = useWindowDimensions();
  const move1 = useRef(new Animated.Value(0)).current;
  const move2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startA = () => {
      move1.setValue(0);
      Animated.timing(move1, { toValue: 1, duration: 20000, useNativeDriver: true }).start(() => startA());
    };
    const startB = () => {
      move2.setValue(0);
      Animated.timing(move2, { toValue: 1, duration: 25000, useNativeDriver: true }).start(() => startB());
    };
    startA();
    startB();
  }, []);

  const lToR1 = move1.interpolate({ inputRange: [0, 1], outputRange: [-150, screenWidth + 150] });
  const rToL1 = move1.interpolate({ inputRange: [0, 1], outputRange: [screenWidth + 150, -150] });
  const lToR2 = move2.interpolate({ inputRange: [0, 1], outputRange: [-150, screenWidth + 150] });
  const rToL2 = move2.interpolate({ inputRange: [0, 1], outputRange: [screenWidth + 150, -150] });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Animated.View style={{position: 'absolute', top: 40, transform: [{translateX: lToR1}]}}><Ionicons name="sunny-outline" size={80} color="rgba(44, 62, 80, 0.08)" /></Animated.View>
      <Animated.View style={{position: 'absolute', top: 100, transform: [{translateX: rToL2}]}}><Ionicons name="cloud-outline" size={100} color="rgba(44, 62, 80, 0.08)" /></Animated.View>
      <Animated.View style={{position: 'absolute', top: 250, transform: [{translateX: lToR2}]}}><Ionicons name="fish-outline" size={70} color="rgba(44, 62, 80, 0.08)" /></Animated.View>
      <Animated.View style={{position: 'absolute', top: 350, transform: [{translateX: rToL1}]}}><Ionicons name="paw-outline" size={60} color="rgba(44, 62, 80, 0.08)" /></Animated.View>
      <Animated.View style={{position: 'absolute', bottom: 150, transform: [{translateX: lToR1}]}}><Ionicons name="water-outline" size={120} color="rgba(44, 62, 80, 0.08)" /></Animated.View>
      <Animated.View style={{position: 'absolute', bottom: 80, transform: [{translateX: rToL2}]}}><Ionicons name="star-outline" size={50} color="rgba(44, 62, 80, 0.08)" /></Animated.View>
      <Animated.View style={{position: 'absolute', bottom: 300, transform: [{translateX: lToR2}]}}><Ionicons name="fish-outline" size={90} color="rgba(44, 62, 80, 0.08)" /></Animated.View>
      <Animated.View style={{position: 'absolute', top: 180, transform: [{translateX: rToL1}]}}><Ionicons name="paw-outline" size={50} color="rgba(44, 62, 80, 0.08)" /></Animated.View>
    </View>
  );
};

export default function App() {
  const { width: screenWidth } = useWindowDimensions();

  const [screen, setScreen] = useState('SPLASH'); 
  const [language, setLanguage] = useState('Indonesia');
  const txt = DICTIONARY[language];
  const [showTutorial, setShowTutorial] = useState(false);
  const [customAlert, setCustomAlert] = useState(null);
  
  // --- STATE KLAIM & APPSTATE ---
  const [isExtraWordsClaimed, setIsExtraWordsClaimed] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const appState = useRef(AppState.currentState);
  const followStartTime = useRef(null);

  // --- AUDIO SETUP ---
  const [bgmSound, setBgmSound] = useState(null);
  
  useEffect(() => {
    async function loadBGM() {
      try {
        const { sound } = await Audio.Sound.createAsync(require('./assets/bgm.mp3'), { isLooping: true, volume: 0.3 });
        setBgmSound(sound);
        await sound.playAsync();
      } catch (e) { console.log('BGM tidak ditemukan'); }
    }
    loadBGM();
    return () => { if (bgmSound) bgmSound.unloadAsync(); }
  }, []);

  const playSFX = async (type) => {
    try {
      let file;
      if (type === 'click') file = require('./assets/click.mp3');
      if (type === 'flip') file = require('./assets/flip.mp3');
      if (type === 'eliminate') file = require('./assets/eliminate.mp3');
      if (type === 'win') file = require('./assets/win.mp3');
      if (type === 'wrong') file = require('./assets/wrong.mp3');
      if (type === 'camera') file = require('./assets/camera.mp3');
      
      if (file) {
        const { sound } = await Audio.Sound.createAsync(file);
        
        // JIKA MENANG, PAUSE BGM SEMENTARA MENUNGGU EFEK WIN SELESAI
        if (type === 'win' && bgmSound) {
          await bgmSound.pauseAsync();
          await sound.playAsync();
          setTimeout(() => {
             bgmSound.playAsync();
          }, 3000); 
        } else {
          await sound.playAsync();
        }
      }
    } catch (e) {}
  };
  
  // --- CAMERA & SHARE ---
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeCameraPlayerId, setActiveCameraPlayerId] = useState(null);
  const cameraRef = useRef(null);
  const viewShotRef = useRef(null);
  const [cameraFacing, setCameraFacing] = useState('front');
  const [cameraFlash, setCameraFlash] = useState('off');
  
  const [boothMode, setBoothMode] = useState(false);
  const [boothPhotos, setBoothPhotos] = useState({}); 
  const [currentBoothIndex, setCurrentBoothIndex] = useState(0);

  // --- GAME SETTINGS ---
  const [totalPlayers, setTotalPlayers] = useState(4);
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [mrWhiteCount, setMrWhiteCount] = useState(0);

  // ANIMASI SPLASH & TITTLE
  const [splashPhase, setSplashPhase] = useState(1);
  const dropScale = useRef(new Animated.Value(0)).current;
  const mainSplashAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;

  // EFEK SUBTITLE ROCKING
  useEffect(() => {
    const rock = () => {
      Animated.sequence([
        Animated.timing(subtitleAnim, {toValue: 1, duration: 600, useNativeDriver: true}),
        Animated.timing(subtitleAnim, {toValue: -1, duration: 1200, useNativeDriver: true}),
        Animated.timing(subtitleAnim, {toValue: 0, duration: 600, useNativeDriver: true})
      ]).start(() => rock());
    };
    rock();
  }, []);
  const rotateSubtitle = subtitleAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] });

  // CEK KLAIM KATA DI LOKAL & DETEKSI FOLLOW
  useEffect(() => {
    const checkClaimStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('@extra_words_claimed');
        if (value === 'true') setIsExtraWordsClaimed(true);
      } catch (e) {}
    };
    checkClaimStatus();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (followStartTime.current) {
          const timeSpent = Date.now() - followStartTime.current;
          if (timeSpent > 6000) { 
            AsyncStorage.setItem('@extra_words_claimed', 'true');
            setIsExtraWordsClaimed(true);
            setShowPurchaseModal(false);
            setTimeout(() => {
               setCustomAlert({ title: 'BERHASIL!', message: 'Terima kasih telah follow! 50 kata ekstra telah terbuka permanen di perangkat ini.', btnText: 'OKE', onConfirm: () => setCustomAlert(null) });
            }, 500);
          } else { 
            setTimeout(() => {
               setCustomAlert({ title: 'GAGAL VERIFIKASI', message: 'Sistem mendeteksi kamu belum mem-follow atau langsung unfollow. Silakan coba lagi dengan benar!', btnText: 'TUTUP', onConfirm: () => setCustomAlert(null) });
            }, 500);
          }
          followStartTime.current = null;
        }
      }
      appState.current = nextAppState;
    });

    return () => { subscription.remove(); };
  }, []);

  const claimExtraWords = async () => {
    playSFX('click');
    followStartTime.current = Date.now();
    await Linking.openURL('https://instagram.com/appratamaa_');
  };

  // TAP 1X UNTUK LINKEDIN 
  const handleCopyrightPress = () => {
    playSFX('click');
    Linking.openURL('https://linkedin.com/in/andreputrap');
  };

  // EFEK SPLASH SCREEN WATER DROP LAMBAT
  useEffect(() => {
    if (screen === 'SPLASH') {
      Animated.timing(dropScale, { toValue: 100, duration: 1200, useNativeDriver: true }).start(() => {
        setSplashPhase(2);
        Animated.spring(mainSplashAnim, { toValue: 1, friction: 4, tension: 30, useNativeDriver: true }).start();
        const timer = setTimeout(() => { setScreen('HOME'); }, 2500);
        return () => clearTimeout(timer);
      });
    }
  }, [screen]);

  // EFEK PENYESUAIAN OTOMATIS SAAT TOTAL MARLIN DIKURANGI
  useEffect(() => {
    const maxL = totalPlayers >= 4 ? 2 : 0;
    const maxB = Math.floor(totalPlayers / 2);

    let newL = mrWhiteCount;
    let newB = undercoverCount;

    if (newL > maxL) newL = maxL;
    if (newB > maxB) newB = maxB;

    while (newB + newL >= totalPlayers && totalPlayers > 0) {
      if (newL > 0) newL--;
      else if (newB > 1) newB--;
      else break;
    }

    if (newL !== mrWhiteCount) setMrWhiteCount(newL);
    if (newB !== undercoverCount) setUndercoverCount(newB);
  }, [totalPlayers]);

  const [players, setPlayers] = useState([]); 
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedVoteId, setSelectedVoteId] = useState(null);
  const [eliminatedPlayer, setEliminatedPlayer] = useState(null);
  const [civilianWordObj, setCivilianWordObj] = useState({});
  const [round, setRound] = useState(1);
  const [winnerLog, setWinnerLog] = useState("");
  const [mrWhiteGuess, setMrWhiteGuess] = useState("");
  const [turnCounter, setTurnCounter] = useState(1); 
  const [isFlipped, setIsFlipped] = useState(false); // <--- TAMBAHAN BARU

  const flipAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backInterpolate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [1, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [0, 1] });

  const flipCardToBack = () => { 
    playSFX('flip');
    Animated.spring(flipAnim, { toValue: 180, friction: 8, tension: 10, useNativeDriver: true }).start(); 
  };
  const flipCardToFrontAndProceed = (callback) => { 
    const flipCardToBack = () => { 
    playSFX('flip');
    setIsFlipped(true); // <--- TAMBAHAN BARU
    Animated.spring(flipAnim, { toValue: 180, friction: 8, tension: 10, useNativeDriver: true }).start(); 
  };
  const flipCardToFrontAndProceed = (callback) => { 
    playSFX('click');
    Animated.timing(flipAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => { 
      setIsFlipped(false); // <--- TAMBAHAN BARU
      callback(); 
    }); 
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const changeScreen = (newScreen, silent = false) => {
    setScreen(newScreen);
    if (!silent) {
       if (newScreen === 'ELIMINATED') { triggerShake(); playSFX('eliminate'); }
       if (newScreen === 'SCOREBOARD') { playSFX('win'); }
    }
  };

  const toggleLanguage = () => {
    playSFX('click');
    if (language === 'Indonesia') setLanguage('Sunda');
    else if (language === 'Sunda') setLanguage('Inggris');
    else setLanguage('Indonesia');
  };

  const shareAppGlobal = async () => {
    playSFX('click');
    try {
      await Share.share({ message: `Ayo main ${GAME_NAME} ${txt.GAME_SUB} ${GAME_VERSION}! Game tebak kata seru bareng teman-teman di mana saja dan kapan saja.` });
    } catch (error) {}
  };

  const initPlayers = () => {
    playSFX('click');
    let initialPlayers = [];
    for(let i=0; i<totalPlayers; i++){
      initialPlayers.push({
        id: i, name: `Marlin ${i+1}`, 
        photoUri: null, avatar: DEFAULT_AVATARS[i % DEFAULT_AVATARS.length], 
        role: '', word: '', desc: '', isAlive: true, score: 0 
      });
    }
    setPlayers(initialPlayers);
    changeScreen('SETUP_PLAYERS');
  };

  const updatePlayerInfo = (id, field, value) => {
    const newPlayers = [...players];
    newPlayers[id][field] = value;
    setPlayers(newPlayers);
  };

  const openCameraForProfile = async (id) => {
    playSFX('click');
    if (!permission?.granted) await requestPermission();
    setActiveCameraPlayerId(id);
    setBoothMode(false);
    setIsCameraOpen(true);
  };

  const takeProfilePicture = async () => {
    playSFX('camera');
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      updatePlayerInfo(activeCameraPlayerId, 'photoUri', photo.uri);
      setIsCameraOpen(false);
    }
  };

  const startRound = () => {
    playSFX('click');
    let db = wordDatabase.pangandaran || [{warga: "Pantai", descWarga: "Wisata Air", penyusup: "Gunung", descPenyusup: "Tempat Tinggi"}];
    if (isExtraWordsClaimed && wordDatabase.ekstra) {
      db = [...db, ...wordDatabase.ekstra];
    }
    
    const item = db[Math.floor(Math.random() * db.length)];
    
    // Menyimpan base word dalam 3 bahasa untuk kebutuhan validasi
    setCivilianWordObj({ 
      wordID: item.warga,
      wordSU: translateWord(item.warga, 'Sunda'),
      wordEN: translateWord(item.warga, 'Inggris'),
      word: translateWord(item.warga, language), 
      desc: translateWord(item.descWarga, language) 
    });

    let rolePool = [];
    const civCount = totalPlayers - undercoverCount - mrWhiteCount;
    
    for(let i=0; i<civCount; i++) rolePool.push({ role: txt.ROLE_CIVILIAN, word: translateWord(item.warga, language), desc: translateWord(item.descWarga, language) });
    for(let i=0; i<undercoverCount; i++) rolePool.push({ role: txt.ROLE_UNDERCOVER, word: translateWord(item.penyusup, language), desc: translateWord(item.descPenyusup, language) });
    for(let i=0; i<mrWhiteCount; i++) rolePool.push({ role: txt.ROLE_MRWHITE, word: '???', desc: txt.MR_WHITE_DESC });

    // PENGACAKAN ROLE MENGGUNAKAN FISHER-YATES SHUFFLE AGAR BENAR BENAR RANDOM
    for (let i = rolePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rolePool[i], rolePool[j]] = [rolePool[j], rolePool[i]];
    }

    const alivePlayers = players.map((p, index) => ({
      ...p, role: rolePool[index].role, word: rolePool[index].word, desc: rolePool[index].desc, isAlive: true
    }));

    setPlayers(alivePlayers);
    setCurrentPlayerIndex(0);
    setTurnCounter(1);
    setMrWhiteGuess("");
    flipAnim.setValue(0);
    changeScreen('PASS_PHONE');
  };

  const checkEndgameOrProceed = () => {
    const aliveM = players.filter(p => p.isAlive && p.role === txt.ROLE_CIVILIAN).length;
    const aliveB = players.filter(p => p.isAlive && p.role === txt.ROLE_UNDERCOVER).length;
    const aliveL = players.filter(p => p.isAlive && p.role === txt.ROLE_MRWHITE).length;

    // JIKA TERSISA <= 2 ORANG DAN ADA LUTUNG, LANGSUNG TEBAK LUTUNG
    if (aliveL > 0 && (aliveB === 0 || aliveM === 0 || (aliveM + aliveB + aliveL <= 2))) {
      changeScreen('MR_WHITE_GUESS');
      return true;
    } else if (aliveM === 0) {
      processWin(txt.ROLE_UNDERCOVER);
      return true;
    } else if (aliveB === 0 && aliveL === 0) {
      processWin(txt.ROLE_CIVILIAN);
      return true;
    } else if (aliveL === 0 && aliveM <= aliveB) {
      processWin(txt.ROLE_UNDERCOVER);
      return true;
    }
    return false;
  };

  const processNextPlayer = () => {
    flipCardToFrontAndProceed(() => {
      let nextIdx = currentPlayerIndex + 1;
      while(nextIdx < totalPlayers && !players[nextIdx].isAlive) nextIdx++;
      
      if (nextIdx < totalPlayers) { 
        setCurrentPlayerIndex(nextIdx); 
        setTurnCounter(prev => prev + 1);
      } else { 
        const isEndgame = checkEndgameOrProceed();
        if (!isEndgame) changeScreen('DISCUSSION'); 
      }
    });
  };

  const processWin = (winningTeam) => {
    const updatedPlayers = players.map(p => {
      // JIKA LUTUNG MENANG: Lutung +30, Banteng +15, Marlin +5 (Lutung pasti ranking 1)
      if (winningTeam === txt.ROLE_MRWHITE) {
         if (p.role === txt.ROLE_MRWHITE) return { ...p, score: p.score + 30 };
         if (p.role === txt.ROLE_UNDERCOVER) return { ...p, score: p.score + 15 };
         if (p.role === txt.ROLE_CIVILIAN) return { ...p, score: p.score + 5 };
      } else {
         if (p.role === winningTeam) return { ...p, score: p.score + 10 }; 
      }
      return p;
    });
    setPlayers(updatedPlayers);
    setWinnerLog(`TIM ${winningTeam.toUpperCase()} MENANG!`);
    changeScreen('SCOREBOARD');
  };

  const handleEliminate = () => {
    playSFX('click');
    const target = players.find(p => p.id === selectedVoteId);
    const aliveCountBefore = players.filter(p => p.isAlive).length;
    const isFirstVote = (aliveCountBefore === totalPlayers);

    const updatedPlayers = players.map(p => {
      if (p.id === selectedVoteId) {
        const penalty = isFirstVote ? -20 : -10;
        return { ...p, isAlive: false, score: p.score + penalty };
      } else if (p.isAlive) {
        return { ...p, score: p.score + 5 }; 
      }
      return p;
    });

    setPlayers(updatedPlayers);
    setEliminatedPlayer(target);
    setSelectedVoteId(null);
    changeScreen('ELIMINATED');
  };

  const handlePostElimination = () => {
    playSFX('click');
    if (eliminatedPlayer.role === txt.ROLE_MRWHITE) {
      changeScreen('MR_WHITE_GUESS');
    } else {
      const isEndgame = checkEndgameOrProceed();
      if (!isEndgame) changeScreen('DISCUSSION');
    }
  };

  const handleMrWhiteGuess = () => {
    playSFX('click');
    const rawGuess = mrWhiteGuess.trim();
    const regexValid = /^[a-zA-Z\s]*$/;
    
    // JIKA TIDAK VALID (TETAP DI SCREEN MENEBAK)
    if (!regexValid.test(rawGuess) || rawGuess === '') {
      playSFX('wrong');
      setCustomAlert({
        title: txt.ALERT_INVALID_TITLE,
        message: txt.ALERT_INVALID_MSG,
        btnText: txt.ALERT_BTN_OK,
        onConfirm: () => {} 
      });
      return;
    }

    const cleanedGuess = rawGuess.replace(/\s+/g, '').toLowerCase();
    
    const validAnswers = [
      civilianWordObj.wordID?.replace(/\s+/g, '').toLowerCase(),
      civilianWordObj.wordSU?.replace(/\s+/g, '').toLowerCase(),
      civilianWordObj.wordEN?.replace(/\s+/g, '').toLowerCase()
    ];
    
    if (validAnswers.includes(cleanedGuess)) {
      processWin(txt.ROLE_MRWHITE);
    } else {
      playSFX('wrong');
      setCustomAlert({
        title: txt.ALERT_WRONG_TITLE,
        message: txt.ALERT_WRONG_MSG,
        btnText: txt.ALERT_BTN_OK,
        onConfirm: () => {
          const aliveM = players.filter(p => p.isAlive && p.role === txt.ROLE_CIVILIAN).length;
          const aliveB = players.filter(p => p.isAlive && p.role === txt.ROLE_UNDERCOVER).length;
          if (aliveM === 0) processWin(txt.ROLE_UNDERCOVER);
          else if (aliveB === 0) processWin(txt.ROLE_CIVILIAN);
          else if (aliveM <= aliveB) processWin(txt.ROLE_UNDERCOVER);
          else changeScreen('DISCUSSION');
        }
      });
    }
  };

  const startPhotoboothSession = async () => {
    playSFX('click');
    if (!permission?.granted) await requestPermission();
    setBoothPhotos({});
    setCurrentBoothIndex(0);
    setBoothMode(true);
    setIsCameraOpen(true);
  };

  const takeBoothPicture = async () => {
    playSFX('camera');
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
      const currentPlayerId = players[currentBoothIndex].id;
      
      setBoothPhotos(prev => ({ ...prev, [currentPlayerId]: photo.uri }));
      
      if (currentBoothIndex + 1 < players.length) {
        setCurrentBoothIndex(prev => prev + 1); 
      } else {
        setIsCameraOpen(false); 
        changeScreen('PHOTOBOOTH_RESULT', true); // Silent change
      }
    }
  };

  const shareViewShot = async () => {
    playSFX('click');
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (err) {}
  };

  // --- RENDER SPLASH SCREEN ---
  if (screen === 'SPLASH') {
    if (splashPhase === 1) {
      return (
        <View style={{flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'}}>
           <StatusBar barStyle="light-content" backgroundColor="#000" />
           <Animated.View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', transform: [{scale: dropScale}]}} />
        </View>
      );
    }

    return (
      <SafeAreaView style={[styles.container, {backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center'}]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        
        <Animated.View style={{alignItems: 'center', transform: [{scale: mainSplashAnim}]}}>
           <Ionicons name="boat-outline" size={140} color="#2C3E50" />
           <Text style={[styles.hugeMainTitle, {color: '#2C3E50', marginTop: 25, fontSize: 38, paddingHorizontal: 15, textAlign: 'center', lineHeight: 50}]}>{GAME_NAME}</Text>
           <Animated.View style={[styles.subTitleBox, {transform: [{rotate: rotateSubtitle}]}]}>
              <Text style={[styles.subTitleBadgeText, {color: '#FFF', fontSize: 26, fontWeight: '900', textAlign: 'center'}]}>{txt.GAME_SUB}</Text>
           </Animated.View>
        </Animated.View>
        
        <View style={{position: 'absolute', bottom: 40}}>
          <Text style={{color: '#95a5a6', fontSize: 16, fontWeight: 'bold'}}>Powered by Réand Technology</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- RENDER CAMERA OVERLAY ---
  if (isCameraOpen) {
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <View style={{position: 'absolute', top: Platform.OS === 'ios' ? 50 : 30, right: 20, flexDirection: 'row', zIndex: 100}}>
          <TouchableOpacity style={styles.camIconBtn} onPress={() => { playSFX('click'); setCameraFacing(f => f === 'front' ? 'back' : 'front'); }}>
            <Ionicons name="camera-reverse" size={28} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.camIconBtn, {marginLeft: 15}]} onPress={() => { playSFX('click'); setCameraFlash(f => f === 'off' ? 'on' : 'off'); }}>
            <Ionicons name={cameraFlash === 'on' ? 'flash' : 'flash-off'} size={28} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        <CameraView style={{flex: 1}} facing={cameraFacing} flash={cameraFlash} ref={cameraRef}>
          <View style={{flex: 1, justifyContent: 'flex-end', padding: 30, zIndex: 10}}>
            {boothMode && (
               <View style={[styles.cardBase, {backgroundColor: '#F1C40F', marginBottom: 20}]}>
                 <Text style={styles.headerText}>{txt.TURN} {players[currentBoothIndex].name.toUpperCase()}</Text>
               </View>
            )}
            <TouchableOpacity style={styles.btnAction} onPress={boothMode ? takeBoothPicture : takeProfilePicture}>
              <Text style={styles.btnActionText}>{boothMode ? txt.TAKE_PIC : txt.TAKE_PROFILE}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnAction, {backgroundColor: '#E74C3C', marginTop: 15}]} onPress={() => { playSFX('click'); setIsCameraOpen(false); setBoothMode(false); }}>
              <Text style={styles.btnActionText}>{txt.CANCEL}</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }
}

  // --- RENDER SCREENS UTAMA ---
  return (
    <>
      {/* CUSTOM POPUP ALERT GLOBALS */}
      {customAlert && (
        <Modal transparent visible animationType="fade">
          <View style={styles.modalOverlayList}>
            <View style={[styles.cardBase, {width: '85%', alignItems: 'center', borderColor: '#E74C3C'}]}>
              <Text style={[styles.headerText, {color: '#E74C3C', fontSize: 26}]}>{customAlert.title}</Text>
              <View style={styles.line} />
              <Text style={[styles.infoSectionText, {textAlign: 'center', marginBottom: 25, fontSize: 16}]}>{customAlert.message}</Text>
              <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#2ECC71'}]} onPress={() => { playSFX('click'); customAlert.onConfirm(); setCustomAlert(null); }}>
                <Text style={styles.btnPrimaryText}>{customAlert.btnText || 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* MODAL PURCHASE EXTRA WORDS */}
      {showPurchaseModal && (
        <Modal transparent visible animationType="slide" onRequestClose={() => setShowPurchaseModal(false)}>
          <View style={styles.modalOverlayList}>
            <View style={[styles.cardBase, {width: '90%', alignItems: 'center'}]}>
              <View style={[styles.imgBox, {width: 70, height: 70, backgroundColor: '#E84393'}]}>
                <Ionicons name="logo-instagram" size={40} color="#FFF" />
              </View>
              <Text style={[styles.headerText, {fontSize: 24, marginTop: 10}]}>{txt.CLAIM_WORD}</Text>
              <Text style={[styles.infoSectionText, {textAlign: 'center', marginVertical: 15}]}>
                {txt.CLAIM_DESC}
              </Text>
              
              <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#3498DB', marginBottom: 10}]} onPress={claimExtraWords}>
                <Text style={styles.btnPrimaryText}>FOLLOW @appratamaa_</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#E74C3C'}]} onPress={() => { playSFX('click'); setShowPurchaseModal(false); }}>
                <Text style={styles.btnPrimaryText}>{txt.CANCEL}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* MODAL TUTORIAL INFORMASI */}
      <Modal visible={showTutorial} transparent animationType="slide" onRequestClose={() => setShowTutorial(false)}>
        <View style={styles.modalOverlayList}>
          <View style={styles.modalContentList}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 2, borderColor: '#ECF0F1'}}>
              <Text style={styles.headerTextList}>{txt.INFO_TITLE}</Text>
              <TouchableOpacity onPress={() => { playSFX('click'); setShowTutorial(false); }}>
                <Ionicons name="close-circle" size={36} color="#E74C3C" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{padding: 20}}>
              <View style={styles.infoSection}>
                <Ionicons name="game-controller" size={30} color="#3498DB" />
                <View style={{marginLeft: 15, flex: 1}}>
                  <Text style={styles.infoSectionTitle}>{txt.INFO_HOWTO_TITLE}</Text>
                  <Text style={styles.infoSectionText}>{txt.INFO_HOWTO_DESC}</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Ionicons name="people" size={30} color="#F39C12" />
                <View style={{marginLeft: 15, flex: 1}}>
                  <Text style={styles.infoSectionTitle}>{txt.INFO_ROLE_TITLE}</Text>
                  <Text style={styles.infoSectionText}><Text style={{fontWeight: '900', color: '#3498DB'}}>🐟 {txt.INFO_ROLE_DESC1}</Text></Text>
                  <Text style={styles.infoSectionText}><Text style={{fontWeight: '900', color: '#E74C3C'}}>🐂 {txt.INFO_ROLE_DESC2}</Text></Text>
                  <Text style={styles.infoSectionText}><Text style={{fontWeight: '900', color: '#9B59B6'}}>🐒 {txt.INFO_ROLE_DESC3}</Text></Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Ionicons name="sync" size={30} color="#2ECC71" />
                <View style={{marginLeft: 15, flex: 1}}>
                  <Text style={styles.infoSectionTitle}>{txt.INFO_ROUND_TITLE}</Text>
                  <Text style={styles.infoSectionText}>{txt.INFO_ROUND_DESC}</Text>
                </View>
              </View>

              <View style={[styles.infoSection, {borderBottomWidth: 0, marginBottom: 20}]}>
                <Ionicons name="star" size={30} color="#F1C40F" />
                <View style={{marginLeft: 15, flex: 1}}>
                  <Text style={styles.infoSectionTitle}>{txt.INFO_SCORE_TITLE}</Text>
                  <Text style={styles.infoSectionText}>{txt.INFO_SCORE_DESC}</Text>
                </View>
              </View>

              <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#2ECC71'}]} onPress={() => { playSFX('click'); setShowTutorial(false); }}>
                <Text style={styles.btnPrimaryText}>{txt.UNDERSTAND}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {screen === 'HOME' && (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#ECF0F1" />
          <AnimatedBackgroundDecor />
          
          <TouchableOpacity style={{position: 'absolute', top: 50, right: 20, zIndex: 10}} onPress={() => { playSFX('click'); setShowTutorial(true); }}>
            <Ionicons name="information-circle" size={45} color="#2C3E50" />
          </TouchableOpacity>

          <View style={styles.contentCenter}>
            <View style={styles.titleWrapper}>
              <Text style={styles.hugeMainTitle}>{GAME_NAME}</Text>
              <Animated.View style={[styles.subTitleBox, {transform: [{rotate: rotateSubtitle}]}]}>
                <Text style={styles.subTitleBadgeText}>{txt.GAME_SUB}</Text>
              </Animated.View>
              <View style={styles.versionPill}>
                <Text style={styles.versionText}>{GAME_VERSION}</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#9B59B6', marginBottom: 15}]} onPress={toggleLanguage}>
              <Text style={styles.btnPrimaryText}>{txt.LANG_BTN}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnPrimary, {marginBottom: 15}]} onPress={() => { playSFX('click'); changeScreen('SETUP_ROLES'); }}>
              <Text style={styles.btnPrimaryText}>{txt.START}</Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10, width: '100%'}}>
              <TouchableOpacity style={[styles.btnAction, {flex: 1, marginRight: 10, backgroundColor: '#E67E22', paddingVertical: 15}]} onPress={shareAppGlobal}>
                <Ionicons name="share-social" size={28} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnAction, {flex: 1, marginLeft: 10, backgroundColor: isExtraWordsClaimed ? '#95a5a6' : '#E84393', paddingVertical: 15}]} onPress={() => { playSFX('click'); !isExtraWordsClaimed && setShowPurchaseModal(true); }} disabled={isExtraWordsClaimed}>
                 {isExtraWordsClaimed ? <Ionicons name="checkmark-done" size={28} color="#FFF" /> : <Ionicons name="cart" size={28} color="#FFF" />}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleCopyrightPress}>
               <Text style={{color: '#95a5a6', fontSize: 14, fontWeight: 'bold'}}>Powered by Réand Technology</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {screen === 'SETUP_ROLES' && (() => {
        const maxBanteng = Math.max(1, Math.min(Math.floor(totalPlayers / 2), totalPlayers - mrWhiteCount - 1));
        const maxLutung = Math.max(0, Math.min(totalPlayers >= 4 ? 2 : 0, totalPlayers - undercoverCount - 1));
        const isLutungDisabled = totalPlayers < 4;

        return (
          <SafeAreaView style={styles.container}>
            <AnimatedBackgroundDecor />
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => { playSFX('click'); changeScreen('HOME', true); }} style={styles.backBtn}><Text style={styles.backBtnText}>{txt.BACK}</Text></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{padding: 20}}>
              <Text style={styles.headerText}>{txt.SETUP_ROLE}</Text>
              <View style={styles.cardBase}>
                <View style={styles.rowSetting}>
                  <Text style={styles.labelText}>{txt.TOTAL}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={styles.btnCounter} onPress={() => { playSFX('click'); if(totalPlayers > 3) setTotalPlayers(totalPlayers - 1); }}><Text style={styles.btnCounterText}>-</Text></TouchableOpacity>
                    <Text style={styles.valText}>{totalPlayers}</Text>
                    <TouchableOpacity style={styles.btnCounter} onPress={() => { playSFX('click'); if(totalPlayers < 20) setTotalPlayers(totalPlayers + 1); }}><Text style={styles.btnCounterText}>+</Text></TouchableOpacity>
                  </View>
                </View>

                <View style={styles.rowSetting}>
                  <Text style={styles.labelText}>{txt.ROLE_UNDERCOVER.toUpperCase()}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={styles.btnCounter} onPress={() => { playSFX('click'); if(undercoverCount > 1) setUndercoverCount(undercoverCount - 1); }}><Text style={styles.btnCounterText}>-</Text></TouchableOpacity>
                    <Text style={styles.valText}>{undercoverCount}</Text>
                    <TouchableOpacity style={styles.btnCounter} onPress={() => { playSFX('click'); if(undercoverCount < maxBanteng) setUndercoverCount(undercoverCount + 1); }}><Text style={styles.btnCounterText}>+</Text></TouchableOpacity>
                  </View>
                </View>

                <View style={styles.rowSetting}>
                  <Text style={styles.labelText}>{txt.ROLE_MRWHITE.toUpperCase()}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={[styles.btnCounter, isLutungDisabled && {opacity: 0.4}]} disabled={isLutungDisabled} onPress={() => { playSFX('click'); if(mrWhiteCount > 0) setMrWhiteCount(mrWhiteCount - 1); }}><Text style={styles.btnCounterText}>-</Text></TouchableOpacity>
                    <Text style={styles.valText}>{mrWhiteCount}</Text>
                    <TouchableOpacity style={[styles.btnCounter, isLutungDisabled && {opacity: 0.4}]} disabled={isLutungDisabled} onPress={() => { playSFX('click'); if(mrWhiteCount < maxLutung) setMrWhiteCount(mrWhiteCount + 1); }}><Text style={styles.btnCounterText}>+</Text></TouchableOpacity>
                  </View>
                </View>

                <View style={styles.line} />
                <Text style={[styles.labelText, {textAlign: 'center', color: '#2ECC71'}]}>{txt.ROLE_CIVILIAN.toUpperCase()}: {totalPlayers - undercoverCount - mrWhiteCount}</Text>
              </View>
              <TouchableOpacity style={[styles.btnPrimary, {marginTop: 20}]} onPress={initPlayers}>
                <Text style={styles.btnPrimaryText}>{txt.NEXT}</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        );
      })()}

      {screen === 'SETUP_PLAYERS' && (
        <SafeAreaView style={styles.container}>
          <AnimatedBackgroundDecor />
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => { playSFX('click'); changeScreen('SETUP_ROLES', true); }} style={styles.backBtn}><Text style={styles.backBtnText}>{txt.BACK}</Text></TouchableOpacity>
          </View>
          <Text style={[styles.headerText, {marginHorizontal: 20}]}>{txt.SETUP_PLAYER}</Text>
          
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
            <ScrollView contentContainerStyle={{padding: 15, paddingBottom: 50}}>
              <View style={styles.grid2Col}>
                {players.map((p) => (
                  <View key={p.id} style={styles.gridItem}>
                    <View style={styles.playerSetupBox}>
                      <TouchableOpacity style={styles.imgBox} onPress={() => openCameraForProfile(p.id)}>
                        {p.photoUri ? <Image source={{ uri: p.photoUri }} style={styles.imgFull} /> : <Text style={{fontSize: 40}}>{p.avatar}</Text>}
                        <View style={styles.camIcon}><Text style={{fontSize: 14, fontWeight: 'bold'}}>+</Text></View>
                      </TouchableOpacity>
                      <TextInput style={styles.nameInput} value={p.name} onChangeText={(txtVal) => updatePlayerInfo(p.id, 'name', txtVal)} maxLength={10} />
                    </View>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#2ECC71', marginTop: 20}]} onPress={startRound}>
                <Text style={styles.btnPrimaryText}>{txt.START_ROUND} {round}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}

      {screen === 'PASS_PHONE' && (() => {
        const activePlayer = players[currentPlayerIndex];
        if(!activePlayer.isAlive) { setCurrentPlayerIndex((prev) => (prev + 1) % totalPlayers); return null; }
        
        const aliveCount = players.filter(p => p.isAlive).length;
        const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity };
        const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }], opacity: backOpacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

        return (
          <SafeAreaView style={styles.container}>
            <AnimatedBackgroundDecor />
            <View style={styles.contentCenter}>
              <View style={styles.turnIndicator}><Text style={{fontSize: 24, fontWeight: '900', color: '#FFF'}}>{txt.TURN} {turnCounter} / {aliveCount}</Text></View>
              
              <View style={styles.flipWrapper}>
                <Animated.View pointerEvents={isFlipped ? 'none' : 'auto'} style={[styles.cardBase, frontAnimatedStyle, {justifyContent: 'center', alignItems: 'center', height: '100%'}]}>
                  <View style={[styles.imgBox, {width: 150, height: 150, borderRadius: 0, marginVertical: 30}]}>
                    {activePlayer.photoUri ? <Image source={{ uri: activePlayer.photoUri }} style={styles.imgFull} /> : <Text style={{fontSize: 70}}>{activePlayer.avatar}</Text>}
                  </View>
                  <Text style={styles.bigName}>{activePlayer.name}</Text>
                  <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#F1C40F', marginTop: 40, width: '90%'}]} onPress={flipCardToBack}>
                    <Text style={[styles.btnPrimaryText, {color: '#2C3E50'}]}>{txt.OPEN_CARD}</Text>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View pointerEvents={isFlipped ? 'auto' : 'none'} style={[styles.cardBase, backAnimatedStyle, { height: '100%', padding: 0 }]}>
                  <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center', flexGrow: 1, padding: 25}}>
                    <Text style={styles.subTitleText}>{txt.YOUR_ROLE}</Text>
                    <Text style={[styles.hugeText, {color: activePlayer.role === txt.ROLE_CIVILIAN ? '#3498DB' : '#E74C3C', textAlign: 'center'}]}>{activePlayer.role.toUpperCase()}</Text>
                    <View style={styles.line} />
                    <Text style={styles.subTitleText}>{txt.SECRET_WORD}</Text>
                    <Text style={styles.hugeWord}>{activePlayer.word.toUpperCase()}</Text>
                    
                    <View style={styles.infoBox}>
                      <Text style={styles.infoTitle}>{txt.INFO}</Text>
                      <Text style={styles.infoDesc}>{activePlayer.desc}</Text>
                    </View>

                    <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#E74C3C', marginTop: 30, width: '100%'}]} onPress={processNextPlayer}>
                      <Text style={styles.btnPrimaryText}>{txt.CLOSE_PASS}</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </Animated.View>
              </View>
            </View>
          </SafeAreaView>
        );
      })()}

      {screen === 'DISCUSSION' && (
        <SafeAreaView style={styles.container}>
          <AnimatedBackgroundDecor />
          <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 60}}>
            <Text style={styles.headerText}>{txt.DISCUSSION}</Text>
            <Text style={[styles.labelText, {textAlign: 'center', marginBottom: 20, color: '#7F8C8D'}]}>{txt.HINT}</Text>
            
            <View style={styles.grid2Col}>
              {players.map(p => (
                <View key={p.id} style={styles.gridItem}>
                  <View style={[styles.badge, !p.isAlive && {opacity: 0.5, backgroundColor: '#BDC3C7'}]}>
                    <View style={[styles.imgBox, {width: 60, height: 60}]}>
                      {!p.isAlive ? (p.photoUri ? <Image source={{ uri: p.photoUri }} style={[styles.imgFull, {tintColor: 'gray'}]} /> : <Text style={{fontSize: 30}}>{p.avatar}</Text>) : p.photoUri ? <Image source={{ uri: p.photoUri }} style={styles.imgFull} /> : <Text style={{fontSize: 30}}>{p.avatar}</Text>}
                    </View>
                    <Text style={styles.badgeName} numberOfLines={1}>{p.name}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#F39C12', marginTop: 30}]} onPress={() => changeScreen('VOTE', true)}>
              <Text style={styles.btnPrimaryText}>{txt.VOTE_BTN}</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      )}

      {screen === 'VOTE' && (
        <SafeAreaView style={styles.container}>
          <AnimatedBackgroundDecor />
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => { playSFX('click'); changeScreen('DISCUSSION', true); }} style={styles.backBtn}><Text style={styles.backBtnText}>{txt.BACK}</Text></TouchableOpacity>
          </View>
          <Text style={[styles.headerText, {marginHorizontal: 20}]}>{txt.VOTE_BTN}</Text>
          <ScrollView contentContainerStyle={{padding: 15, paddingBottom: 60}}>
            <View style={styles.grid2Col}>
              {players.filter(p => p.isAlive).map(p => (
                <View key={p.id} style={styles.gridItem}>
                  <TouchableOpacity style={[styles.voteBox, selectedVoteId === p.id && styles.voteBoxActive]} onPress={() => setSelectedVoteId(p.id)}>
                    <View style={[styles.imgBox, {width: 80, height: 80}]}>
                       {p.photoUri ? <Image source={{ uri: p.photoUri }} style={styles.imgFull} /> : <Text style={{fontSize: 40}}>{p.avatar}</Text>}
                    </View>
                    <Text style={styles.voteName}>{p.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {selectedVoteId !== null && (
              <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#E74C3C', marginTop: 20}]} onPress={handleEliminate}>
                <Text style={styles.btnPrimaryText}>{txt.ELIMINATE}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      )}

      {screen === 'ELIMINATED' && (
        <SafeAreaView style={styles.container}>
          <AnimatedBackgroundDecor />
          <Animated.View style={[styles.contentCenter, {transform: [{translateX: shakeAnim}]}]}>
            <View style={[styles.cardBase, {alignItems: 'center', borderColor: '#E74C3C'}]}>
              <View style={[styles.imgBox, {width: 120, height: 120}]}>
                  {eliminatedPlayer.photoUri ? <Image source={{ uri: eliminatedPlayer.photoUri }} style={styles.imgFull} /> : <Text style={{fontSize: 60}}>{eliminatedPlayer.avatar}</Text>}
              </View>
              <Text style={[styles.bigName, {marginTop: 15}]}>{eliminatedPlayer.name}</Text>
              <Text style={[styles.subTitleText, {color: '#E74C3C', marginBottom: 20}]}>{txt.ELIMINATED_TXT}</Text>
              
              <View style={styles.line} />
              <Text style={styles.subTitleText}>{txt.REAL_ROLE}</Text>
              <Text style={[styles.hugeText, {color: '#2C3E50', marginTop: 5}]}>{eliminatedPlayer.role.toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={[styles.btnPrimary, {marginTop: 30}]} onPress={handlePostElimination}>
              <Text style={styles.btnPrimaryText}>{txt.CONTINUE}</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      )}

      {screen === 'MR_WHITE_GUESS' && (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <SafeAreaView style={styles.container}>
            <AnimatedBackgroundDecor />
            <View style={styles.contentCenter}>
              <View style={[styles.cardBase, {alignItems: 'center'}]}>
                <Text style={styles.headerText}>{txt.GUESS_TITLE}</Text>
                <Text style={[styles.labelText, {textAlign: 'center', marginBottom: 20, color: '#7F8C8D'}]}>{txt.GUESS_DESC}</Text>
                
                <TextInput style={styles.textInputFull} placeholder={txt.GUESS_INPUT} value={mrWhiteGuess} onChangeText={setMrWhiteGuess} />
                
                <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#2ECC71', width: '100%', marginTop: 20}]} onPress={handleMrWhiteGuess}>
                  <Text style={styles.btnPrimaryText}>{txt.GUESS_BTN}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}

      {screen === 'SCOREBOARD' && (() => {
        let lbCols = players.length <= 5 ? 1 : players.length <= 10 ? 2 : players.length <= 15 ? 3 : 4;
        let lbWidth = Math.max(screenWidth, lbCols * 350);

        return (
          <SafeAreaView style={styles.container}>
            <AnimatedBackgroundDecor />

            <View style={[StyleSheet.absoluteFillObject, {zIndex: 999}]} pointerEvents="none">
              <ConfettiCannon count={200} origin={{x: screenWidth/2, y: -20}} fallSpeed={3000} colors={['#F1C40F', '#3498DB', '#E74C3C', '#2ECC71']} autoStart={true} />
            </View>

            <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 60}}>
              <View style={[styles.cardBase, {backgroundColor: '#2ECC71', alignItems: 'center', padding: 15, marginBottom: 20}]}>
                <Text style={[styles.headerText, {color: '#FFF', fontSize: 32, marginBottom: 0}]}>{winnerLog}</Text>
              </View>

              <View style={{alignItems: 'center', marginBottom: 20, backgroundColor: '#FFF', padding: 15, ...styles.shadowTactile}}>
                <Text style={styles.subTitleText}>{txt.SECRET_WORD} {txt.ROLE_CIVILIAN.toUpperCase()}:</Text>
                <Text style={[styles.hugeWord, {color: '#3498DB', textAlign: 'center'}]}>{civilianWordObj.word.toUpperCase()}</Text>
              </View>

              <View style={{borderTopWidth: 4, borderColor: '#2C3E50', paddingTop: 15}}>
                <Text style={[styles.headerText, {fontSize: 26, textAlign: 'center', marginBottom: 15}]}>{txt.SCOREBOARD}</Text>
                {players.sort((a,b) => b.score - a.score).map((p, index) => {
                  let rankBadge = `${index + 1}.`;
                  let displayName = `${p.name} (${p.role.toUpperCase()})`;

                  return (
                    <View key={p.id} style={[styles.scoreRow, index === 0 && {backgroundColor: '#FFF2CC'}]}>
                      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                        <Text style={styles.scoreRank}>{rankBadge}</Text>
                        <View style={[styles.imgBox, {width: 45, height: 45, marginHorizontal: 10, shadowOpacity: 0, elevation: 0}]}>
                          {p.photoUri ? <Image source={{ uri: p.photoUri }} style={styles.imgFull} /> : <Text style={{fontSize: 22}}>{p.avatar}</Text>}
                        </View>
                        <Text style={[styles.scoreName, {flexShrink: 1}]} numberOfLines={2}>{displayName}</Text>
                      </View>
                      <Text style={styles.scorePoint}>{p.score} PT</Text>
                    </View>
                  );
                })}
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                <TouchableOpacity style={[styles.btnAction, {flex: 1, marginRight: 10, backgroundColor: '#3498DB', paddingVertical: 15}]} onPress={shareViewShot}>
                  <Ionicons name="share-social" size={28} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnAction, {flex: 1, marginLeft: 10, backgroundColor: '#9B59B6', paddingVertical: 15}]} onPress={startPhotoboothSession}>
                  <Ionicons name="camera" size={28} color="#FFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.btnPrimary, {marginTop: 20, backgroundColor: '#2ECC71'}]} onPress={() => { playSFX('click'); setRound(round + 1); startRound(); }}>
                <Text style={styles.btnPrimaryText}>{txt.PLAY_AGAIN} {round + 1}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#ECF0F1', marginTop: 10}]} onPress={() => { playSFX('click'); changeScreen('HOME', true); }}>
                <Text style={[styles.btnPrimaryText, {color: '#2C3E50'}]}>{txt.MENU}</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={{position: 'absolute', opacity: 0, zIndex: -100, pointerEvents: 'none', top: 0, left: 0}}>
              <ViewShot ref={viewShotRef} style={{ width: lbWidth, backgroundColor: '#FFF', padding: 20 }}>
                <View style={[styles.cardBase, {backgroundColor: '#2ECC71', alignItems: 'center', padding: 15, marginBottom: 20}]}>
                  <Text style={[styles.headerText, {color: '#FFF', fontSize: 32, marginBottom: 0}]}>{winnerLog}</Text>
                </View>
                <View style={{alignItems: 'center', marginBottom: 20, backgroundColor: '#FFF', padding: 15, ...styles.shadowTactile}}>
                  <Text style={styles.subTitleText}>{txt.SECRET_WORD} {txt.ROLE_CIVILIAN.toUpperCase()}:</Text>
                  <Text style={[styles.hugeWord, {color: '#3498DB', textAlign: 'center'}]}>{civilianWordObj.word.toUpperCase()}</Text>
                </View>
                <View style={{borderTopWidth: 4, borderColor: '#2C3E50', paddingTop: 15}}>
                  <Text style={[styles.headerText, {fontSize: 26, textAlign: 'center', marginBottom: 15}]}>{txt.SCOREBOARD}</Text>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                    {players.sort((a,b) => b.score - a.score).map((p, index) => {
                      let rankBadge = `${index + 1}.`;
                      let displayName = `${p.name} (${p.role.toUpperCase()})`;
                      
                      return (
                        <View key={p.id} style={[styles.scoreRow, {width: `${100/lbCols}%`, paddingHorizontal: 10}, index === 0 && {backgroundColor: '#FFF2CC'}]}>
                          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                            <Text style={styles.scoreRank}>{rankBadge}</Text>
                            <View style={[styles.imgBox, {width: 45, height: 45, marginHorizontal: 10, shadowOpacity: 0, elevation: 0}]}>
                              {p.photoUri ? <Image source={{ uri: p.photoUri }} style={styles.imgFull} /> : <Text style={{fontSize: 22}}>{p.avatar}</Text>}
                            </View>
                            <Text style={[styles.scoreName, {flexShrink: 1}]} numberOfLines={2}>{displayName}</Text>
                          </View>
                          <Text style={styles.scorePoint}>{p.score} PT</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </ViewShot>
            </View>

          </SafeAreaView>
        );
      })()}

      {screen === 'PHOTOBOOTH_RESULT' && (() => {
        let pbCols = 2; 
        if (players.length > 6) {
           if (players.length <= 7) pbCols = 3;
           else if (players.length <= 10) pbCols = 5;
           else if (players.length <= 15) pbCols = 7;
           else pbCols = 10;
        }
        
        const isLandscape = players.length > 6;
        let pbWidth = isLandscape ? Math.max(screenWidth, pbCols * 200) : screenWidth;
        let itemWidthStyle = isLandscape ? `${100/pbCols}%` : '50%'; 

        return (
          <SafeAreaView style={styles.container}>
            <AnimatedBackgroundDecor />
            
            <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 60}}>
              <View style={[styles.cardBase, {backgroundColor: '#F1C40F', padding: 20, alignItems: 'center', marginBottom: 20}]}>
                 <Text style={[styles.headerText, {color: '#2C3E50', marginBottom: 0}]}>{GAME_NAME}</Text>
                 <Text style={[styles.subTitleText, {color: '#E74C3C', marginTop: 5}]}>{txt.GAME_SUB}</Text>
                 <Text style={[styles.subTitleText, {color: '#2C3E50', marginTop: 5}]}>LEADERBOARD RONDE {round}</Text>
              </View>
              
              <View style={styles.grid2Col}>
                {players.sort((a,b) => b.score - a.score).map((p, i) => {
                  let displayName = `${p.name} (${p.role.toUpperCase()})`;
                  return (
                    <View key={p.id} style={styles.gridItem}>
                       <View style={styles.boothPhotoCard}>
                          <View style={{width: '100%', aspectRatio: 1, backgroundColor: '#ECF0F1'}}>
                             {boothPhotos[p.id] ? <Image source={{uri: boothPhotos[p.id]}} style={styles.imgFull} /> : <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}><Text style={{fontSize: 50}}>{p.avatar}</Text></View>}
                          </View>
                          <View style={{padding: 10, alignItems: 'center', backgroundColor: '#FFF', borderTopWidth: 4, borderColor: '#2C3E50'}}>
                             <Text style={styles.voteName} numberOfLines={1}>{i + 1}. {displayName}</Text>
                             <Text style={[styles.scorePoint, {fontSize: 18, marginTop: 5}]}>{p.score} PT</Text>
                          </View>
                       </View>
                    </View>
                  );
                })}
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                <TouchableOpacity style={[styles.btnAction, {flex: 1, marginRight: 10, backgroundColor: '#3498DB', paddingVertical: 15}]} onPress={shareViewShot}>
                  <Ionicons name="share-social" size={28} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnAction, {flex: 1, marginLeft: 10, backgroundColor: '#E74C3C', paddingVertical: 15}]} onPress={() => { playSFX('click'); changeScreen('SCOREBOARD', true); }}>
                  <Ionicons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={{position: 'absolute', opacity: 0, zIndex: -100, pointerEvents: 'none', top: 0, left: 0}}>
              <ViewShot ref={viewShotRef} style={{ width: pbWidth, backgroundColor: '#FFF', padding: 20 }}>
                 <View style={[styles.cardBase, {backgroundColor: '#F1C40F', padding: 20, alignItems: 'center', marginBottom: 20}]}>
                    <Text style={[styles.headerText, {color: '#2C3E50', marginBottom: 0}]}>{GAME_NAME}</Text>
                    <Text style={[styles.subTitleText, {color: '#E74C3C', marginTop: 5}]}>{txt.GAME_SUB}</Text>
                    <Text style={[styles.subTitleText, {color: '#2C3E50', marginTop: 5}]}>LEADERBOARD RONDE {round}</Text>
                 </View>
                 
                 <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: isLandscape ? 'flex-start' : 'space-between'}}>
                   {players.sort((a,b) => b.score - a.score).map((p, i) => {
                     let displayName = `${p.name} (${p.role.toUpperCase()})`;
                     return (
                       <View key={p.id} style={{width: itemWidthStyle, padding: 10}}>
                          <View style={styles.boothPhotoCard}>
                             <View style={{width: '100%', aspectRatio: 1, backgroundColor: '#ECF0F1'}}>
                                {boothPhotos[p.id] ? <Image source={{uri: boothPhotos[p.id]}} style={styles.imgFull} /> : <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}><Text style={{fontSize: 50}}>{p.avatar}</Text></View>}
                             </View>
                             <View style={{padding: 10, alignItems: 'center', backgroundColor: '#FFF', borderTopWidth: 4, borderColor: '#2C3E50'}}>
                                <Text style={styles.voteName} numberOfLines={1}>{i + 1}. {displayName}</Text>
                                <Text style={[styles.scorePoint, {fontSize: 18, marginTop: 5}]}>{p.score} PT</Text>
                             </View>
                          </View>
                       </View>
                     );
                   })}
                 </View>
              </ViewShot>
            </View>

          </SafeAreaView>
        );
      })()}
    </>
  );
}

const tactileShadow = {
  borderWidth: 4,
  borderColor: '#2C3E50',
  shadowColor: '#bdc3c7',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 6,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECF0F1' }, 
  contentCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  shadowTactile: tactileShadow,
  
  topBar: { padding: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { backgroundColor: '#F1C40F', paddingHorizontal: 15, paddingVertical: 8, ...tactileShadow },
  backBtnText: { fontSize: 16, fontWeight: '900', color: '#2C3E50' },
  headerText: { fontSize: 30, fontWeight: '900', color: '#2C3E50', textAlign: 'center', marginBottom: 20 },
  
  titleWrapper: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  hugeMainTitle: { fontSize: 46, fontWeight: '900', color: '#2C3E50', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2 },
  subTitleBox: { backgroundColor: '#F39C12', paddingHorizontal: 20, paddingVertical: 10, marginTop: 10, ...tactileShadow },
  subTitleBadgeText: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  versionPill: { backgroundColor: '#34495E', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 15 },
  versionText: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },

  subTitleText: { fontSize: 16, fontWeight: '900', color: '#7F8C8D', letterSpacing: 1 },

  cardBase: { width: '100%', backgroundColor: '#FFF', padding: 25, ...tactileShadow },
  rowSetting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  labelText: { fontSize: 18, fontWeight: '900', color: '#2C3E50' },
  btnCounter: { width: 45, height: 45, backgroundColor: '#F1C40F', justifyContent: 'center', alignItems: 'center', ...tactileShadow },
  btnCounterText: { fontSize: 24, color: '#2C3E50', fontWeight: '900' },
  valText: { fontSize: 26, fontWeight: '900', color: '#2C3E50', width: 50, textAlign: 'center' },
  line: { height: 4, backgroundColor: '#2C3E50', marginVertical: 15, width: '100%' },

  grid2Col: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: 15 },
  playerSetupBox: { backgroundColor: '#FFF', padding: 15, alignItems: 'center', ...tactileShadow },
  
  imgBox: { backgroundColor: '#ECF0F1', justifyContent: 'center', alignItems: 'center', width: 80, height: 80, marginBottom: 10, ...tactileShadow },
  camIcon: { position: 'absolute', bottom: -10, right: -10, backgroundColor: '#F1C40F', padding: 5, ...tactileShadow },
  nameInput: { width: '100%', fontSize: 16, fontWeight: '900', color: '#2C3E50', textAlign: 'center', borderBottomWidth: 4, borderBottomColor: '#2C3E50', paddingBottom: 5 },
  textInputFull: { width: '100%', fontSize: 24, fontWeight: '900', color: '#2C3E50', textAlign: 'center', borderBottomWidth: 4, borderBottomColor: '#2C3E50', paddingVertical: 10 },

  btnPrimary: { width: '100%', backgroundColor: '#3498DB', paddingVertical: 18, alignItems: 'center', ...tactileShadow },
  btnPrimaryText: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  btnAction: { backgroundColor: '#3498DB', paddingVertical: 18, alignItems: 'center', ...tactileShadow },
  btnActionText: { fontSize: 18, fontWeight: '900', color: '#FFF' },

  turnIndicator: { backgroundColor: '#2C3E50', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 20, ...tactileShadow },
  flipWrapper: { width: '100%', height: 550 },
  bigName: { fontSize: 36, fontWeight: '900', color: '#2C3E50', textAlign: 'center' },
  hugeText: { fontSize: 42, fontWeight: '900', marginVertical: 5, textAlign: 'center' },
  hugeWord: { fontSize: 46, fontWeight: '900', color: '#2C3E50', marginVertical: 10, textAlign: 'center' },
  
  infoBox: { backgroundColor: '#ECF0F1', padding: 15, marginTop: 15, width: '100%', ...tactileShadow },
  infoTitle: { fontSize: 18, fontWeight: '900', color: '#2C3E50', marginBottom: 5 },
  infoDesc: { fontSize: 16, fontWeight: 'bold', color: '#34495E', textAlign: 'center', lineHeight: 22 },

  badge: { alignItems: 'center', backgroundColor: '#FFF', padding: 15, ...tactileShadow },
  badgeName: { fontSize: 16, fontWeight: '900', color: '#2C3E50', marginTop: 10 },

  voteBox: { backgroundColor: '#FFF', padding: 15, alignItems: 'center', ...tactileShadow },
  voteBoxActive: { backgroundColor: '#F1C40F' },
  voteName: { fontSize: 18, fontWeight: '900', color: '#2C3E50', marginTop: 12, textAlign: 'center' },

  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, backgroundColor: '#FFF', marginBottom: 12, ...tactileShadow },
  scoreRank: { fontSize: 24, fontWeight: '900', color: '#2C3E50' },
  scoreName: { fontSize: 18, fontWeight: '900', color: '#2C3E50' },
  scorePoint: { fontSize: 26, fontWeight: '900', color: '#E74C3C' },
  imgFull: { width: '100%', height: '100%', resizeMode: 'cover' },

  boothPhotoCard: { backgroundColor: '#FFF', ...tactileShadow },
  camIconBtn: { backgroundColor: '#ECF0F1', padding: 12, borderRadius: 50, ...tactileShadow },
  
  modalOverlayList: { flex: 1, backgroundColor: 'rgba(44, 62, 80, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContentList: { width: '100%', maxHeight: '85%', backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', ...tactileShadow },
  headerTextList: { fontSize: 24, fontWeight: '900', color: '#2C3E50' },
  infoSection: { flexDirection: 'row', marginBottom: 25, borderBottomWidth: 2, borderColor: '#ECF0F1', paddingBottom: 15 },
  infoSectionTitle: { fontSize: 18, fontWeight: '900', color: '#2C3E50', marginBottom: 5 },
  infoSectionText: { fontSize: 15, fontWeight: 'bold', color: '#7F8C8D', lineHeight: 22 }
});