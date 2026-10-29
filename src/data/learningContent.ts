import { Scenario, CurriculumUnit, VocabularyWord } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'taaruf',
    title: 'Perkenalan',
    arabicTitle: 'التَّعَارُفُ وَالتَّحِيَّاتُ',
    category: 'Sosial & Kampus',
    description: 'Berkenalan dengan teman baru penutur bahasa Arab di lingkungan kampus atau acara akademik.',
    userRole: 'Mahasiswa baru yang ingin berkenalan',
    aiRole: 'Teman mahasiswa penutur bahasa Arab yang ramah',
    target: 'Menyampaikan nama, asal kampus, jurusan, dan menanyakan kabar secara sopan.',
    keyVocabulary: ['مَرْحَبًا', 'اسْمِي', 'مِنْ أَيْنَ أَنْتَ؟', 'طَالِبٌ', 'كُلِّيَّةُ التَّرْبِيَةِ', 'تَشَرَّفْنَا'],
    helpfulPhrases: [
      { arabic: 'السَّلَامُ عَلَيْكُمْ، كَيْفَ حَالُكَ؟', indonesian: 'Assalamu alaikum, bagaimana kabarmu?' },
      { arabic: 'اسْمِي أَحْمَد، أَنَا طَالِبٌ فِي قِسْمِ تَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ', indonesian: 'Nama saya Ahmad, saya mahasiswa jurusan Pendidikan Bahasa Arab' },
      { arabic: 'فُرْصَةٌ سَعِيدَةٌ، تَشَرَّفْنَا!', indonesian: 'Senang bertemu denganmu!' }
    ],
    starterMessage: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ! أَهْلًا وَسَهْلًا بِكَ. أَنَا طَالِبٌ هُنَا أَيْضًا، مَا اسْمُكَ الْكَرِيمُ؟'
  },
  {
    id: 'university',
    title: 'Di Kampus',
    arabicTitle: 'فِي الْجَامِعَةِ',
    category: 'Akademik',
    description: 'Percakapan seputar perkuliahan, jadwal kuliah, dosen pengampu, dan tugas perkuliahan.',
    userRole: 'Mahasiswa yang mencari ruang kuliah dan mendiskusikan materi',
    aiRole: 'Senior mahasiswa atau ketua kelas yang membantu',
    target: 'Menanyakan ruang kuliah, jadwal mata kuliah, dan topik presentasi kelompok.',
    keyVocabulary: ['مُحَاضَرَةٌ', 'قَاعَةُ الدِّرَاسَةِ', 'أُسْتَاذٌ', 'جَدْوَلٌ دِرَاسِيٌّ', 'وَاجِبٌ مَنْزِلِيٌّ', 'امْتِحَانٌ'],
    helpfulPhrases: [
      { arabic: 'أَيْنَ قَاعَةُ مُحَاضَرَةِ عِلْمِ اللُّغَةِ الْيَوْمَ؟', indonesian: 'Di mana ruang kuliah linguistik hari ini?' },
      { arabic: 'هَلْ أَنْهَيْتَ كِتَابَةَ الْبَحْثِ؟', indonesian: 'Apakah kamu sudah menyelesaikan penulisan makalah?' },
      { arabic: 'السَّاعَةُ الْعَاشِرَةُ صَبَاحًا', indonesian: 'Pukul sepuluh pagi' }
    ],
    starterMessage: 'أَهْلًا يَا صَدِيقِي! هَلْ تَبْحَثُ عَنْ قَاعَةِ الْمُحَاضَرَةِ أَمْ جَدْوَلِ الْيَوْمِ؟'
  },
  {
    id: 'restaurant',
    title: 'Di Restoran',
    arabicTitle: 'فِي الْمَطْعَمِ',
    category: 'Kehidupan Sehari-hari',
    description: 'Memesan makanan dan minuman khas Timur Tengah serta menanyakan rekomendasi hidangan.',
    userRole: 'Pelanggan yang memesan makanan',
    aiRole: 'Pelayan restoran yang ramah dan cekatan',
    target: 'Meminta buku menu, memesan makanan kesukaan, dan meminta tagihan/pembayaran.',
    keyVocabulary: ['قَائِمَةُ الطَّعَامِ', 'حِسَابٌ', 'لَذِيذٌ', 'شَايٌ بِالنَّعْنَاعِ', 'أَرُزٌّ', 'دَجَاجٌ مَشْوِيٌّ'],
    helpfulPhrases: [
      { arabic: 'مِنْ فَضْلِكَ، أُرِيدُ قَائِمَةَ الطَّعَامِ', indonesian: 'Tolong, saya ingin melihat menu' },
      { arabic: 'مَا هُوَ الطَّبَقُ الْمُمَيَّزُ هُنَا؟', indonesian: 'Apa hidangan spesial di sini?' },
      { arabic: 'الْحِسَابَ مِنْ فَضْلِكَ', indonesian: 'Berapa tagihannya, tolong' }
    ],
    starterMessage: 'مَرْحَبًا بِكَ فِي مَطْعَمِنَا! تَفَضَّلْ بِالْجُلُوسِ. هَلْ تُحِبُّ أَنْ تَطَّلِعَ عَلَى قَائِمَةِ الطَّعَامِ أَمْ تَطْلُبَ شَيْئًا لِلشُّرْبِ أَوَّلًا؟'
  },
  {
    id: 'market',
    title: 'Di Pasar',
    arabicTitle: 'فِي السُّوقِ',
    category: 'Kehidupan Sehari-hari',
    description: 'Membeli buah, sayur, pakaian atau souvenir sambil mempraktikkan ungkapan tawar-menawar.',
    userRole: 'Pembeli yang mencari barang berkualitas dan harga terjangkau',
    aiRole: 'Pedagang pasar tradisional yang ramah dan pandai mempromosikan barang',
    target: 'Menanyakan harga barang, meminta diskon atau ukuran lain, dan membayar.',
    keyVocabulary: ['بِكَمْ هَذَا؟', 'غَالٍ جِدًّا', 'رَخِيصٌ', 'تَخْفِيضٌ', 'كِيلُوغْرَام', 'نُقُودٌ'],
    helpfulPhrases: [
      { arabic: 'بِكَمْ هَذَا الْقَمِيصُ مِنْ فَضْلِكَ؟', indonesian: 'Berapa harga kemeja ini, tolong?' },
      { arabic: 'هَلْ هُنَاكَ تَخْفِيضٌ قَلِيلًا؟', indonesian: 'Apakah ada sedikit potongan harga?' },
      { arabic: 'أُرِيدُ كِيلُو وَاحِدًا مِنَ التَّمْرِ', indonesian: 'Saya ingin satu kilo kurma' }
    ],
    starterMessage: 'أَهْلًا وَسَهْلًا يَا أَخِي! لَدَيْنَا الْيَوْمَ أَفْضَلُ الْبَضَائِعِ الطَّازَجَةِ. مَا الَّذِي تَبْحَثُ عَنْهُ؟'
  },
  {
    id: 'library',
    title: 'Di Perpustakaan',
    arabicTitle: 'فِي الْمَكْتَبَةِ',
    category: 'Akademik',
    description: 'Mencari kitab referensi bahasa Arab, kamus (Mu\'jam), dan meminjam buku untuk tugas.',
    userRole: 'Mahasiswa yang mencari referensi skripsi atau tugas',
    aiRole: 'Petugas perpustakaan pusat bahasa yang informatif',
    target: 'Menanyakan letak rak buku tata bahasa Arab (Nahwu) dan prosedur peminjaman.',
    keyVocabulary: ['مُعْجَمٌ', 'كِتَابُ النَّحْوِ', 'اسْتِعَارَةٌ', 'رَفٌّ', 'بَحْثٌ عِلْمِيٌّ', 'بِطَاقَةٌ'],
    helpfulPhrases: [
      { arabic: 'أَبْحَثُ عَنْ مُعْجَمِ لِسَانِ الْعَرَبِ', indonesian: 'Saya mencari kamus Lisan al-Arab' },
      { arabic: 'كَيْفَ أَسْتَعِيرُ هَذَا الْكِتَابَ؟', indonesian: 'Bagaimana cara meminjam buku ini?' },
      { arabic: 'كَمْ يَوْمًا يُمْكِنُنِي الِاحْتِفَاظُ بِهِ؟', indonesian: 'Berapa hari saya boleh meminjamnya?' }
    ],
    starterMessage: 'مَرْحَبًا بِكَ فِي مَكْتَبَةِ الْجَامِعَةِ. كَيْفَ يُمْكِنُنِي مُسَاعَدَتُكَ فِي الْبَحْثِ عَنِ الْمَرَاجِعِ الْيَوْمَ؟'
  },
  {
    id: 'direction',
    title: 'Bertanya Arah',
    arabicTitle: 'السُّؤَالُ عَنِ الطَّرِيقِ',
    category: 'Perjalanan',
    description: 'Menanyakan arah jalan menuju stasiun, masjid raya, atau gedung rektorat.',
    userRole: 'Pengelana / mahasiswa yang sedang mencari lokasi tertentu',
    aiRole: 'Warga setempat yang menjelaskan rute dengan ramah',
    target: 'Memahami dan mengucapkan kata arah (kanan, kiri, lurus, di depan, di samping).',
    keyVocabulary: ['يَمِينًا', 'يَسَارًا', 'إِلَى الْأَمَامِ', 'قَرِيبٌ مِنْ', 'بَعِيدٌ عَنْ', 'مَحَطَّةٌ'],
    helpfulPhrases: [
      { arabic: 'عَفْوًا، أَيْنَ الْمَسْجِدُ الْكَبِيرُ؟', indonesian: 'Permisi, di mana masjid raya?' },
      { arabic: 'هَلْ هُوَ قَرِيبٌ أَمْ بَعِيدٌ؟', indonesian: 'Apakah itu dekat atau jauh?' },
      { arabic: 'شُكْرًا جَزِيلًا عَلَى الْمُسَاعَدَةِ', indonesian: 'Terima kasih banyak atas bantuannya' }
    ],
    starterMessage: 'تَفَضَّلْ يَا أَخِي، هَلْ تَحْتَاجُ إِلَى إِرْشَادٍ أَوْ سُؤَالٍ عَنِ الطَّرِيقِ؟'
  },
  {
    id: 'doctor',
    title: 'Di Dokter / Klinik',
    arabicTitle: 'عِنْدَ الطَّبِيبِ',
    category: 'Kesehatan',
    description: 'Menjelaskan keluhan kesehatan ringan, gejala flu, sakit kepala, dan cara minum obat.',
    userRole: 'Pasien yang menjelaskan gejala penyakit',
    aiRole: 'Dokter yang memeriksa dan memberi resep',
    target: 'Mengungkapkan keluhan sakit pada anggota tubuh dan menanyakan aturan minum obat.',
    keyVocabulary: ['صُدَاعٌ', 'أَلَمٌ', 'دَوَاءٌ', 'حَرَارَةٌ', 'شِفَاءٌ', 'رَاحَةٌ'],
    helpfulPhrases: [
      { arabic: 'أَشْعُرُ بِصُدَاعٍ شَدِيدٍ وَأَلَمٍ فِي الْحَلْقِ', indonesian: 'Saya merasakan pusing hebat dan radang tenggorokan' },
      { arabic: 'مُنْذُ مَتَى وَأَنْتَ تَشْعُرُ بِهَذَا؟', indonesian: 'Sejak kapan kamu merasakan ini?' },
      { arabic: 'كَمْ مَرَّةً أَتَنَاوَلُ هَذَا الدَّوَاءَ فِي الْيَوْمِ؟', indonesian: 'Berapa kali saya minum obat ini sehari?' }
    ],
    starterMessage: 'شَفَاكَ اللهُ وَعَافَاكَ! مَا هِيَ شَكْوَاكَ الْيَوْمَ؟ مِمَّ تَعَانِي؟'
  },
  {
    id: 'daily',
    title: 'Aktivitas Sehari-hari',
    arabicTitle: 'الْأَنْشِطَةُ الْيَوْمِيَّةُ',
    category: 'Kehidupan Sehari-hari',
    description: 'Menceritakan rutinitas harian dari bangun tidur subuh, belajar, berolahraga hingga tidur malam.',
    userRole: 'Mahasiswa yang menceritakan rutinitas produktifnya',
    aiRole: 'Teman akrab yang saling bertukar cerita keseharian',
    target: 'Menggunakan fi\'il mudhari\' (kata kerja bentuk kini) untuk menyatakan kebiasaan.',
    keyVocabulary: ['أَسْتَيْقِظُ', 'أُصَلِّي الصُّبْحَ', 'أَتَنَاوَلُ الْفُطُورَ', 'أَذْهَبُ إِلَى', 'أُذَاكِرُ', 'أَنَامُ'],
    helpfulPhrases: [
      { arabic: 'أَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ وَالنِّصْفِ صَبَاحًا', indonesian: 'Saya bangun pukul 4.30 pagi' },
      { arabic: 'مَاذَا تَفْعَلُ فِي أَوْقَاتِ الْفَرَاغِ؟', indonesian: 'Apa yang kamu lakukan di waktu luang?' },
      { arabic: 'أُحِبُّ قِرَاءَةَ الْكُتُبِ وَمُمَارَسَةَ الرِّيَاضَةِ', indonesian: 'Saya suka membaca buku dan berolahraga' }
    ],
    starterMessage: 'أَهْلًا بِكَ! كَيْفَ كَانَ يَوْمُكَ؟ أَخْبِرْنِي، مَتَى اسْتَيْقَظْتَ الْيَوْمَ وَمَاذَا فَعَلْتَ فِي الصَّبَاحِ؟'
  }
];

export const CURRICULUM_UNITS: CurriculumUnit[] = [
  // LEVEL 1: BEGINNER (مبتدئ)
  {
    id: 'l1-u1',
    level: 'beginner',
    levelLabel: 'Level 1 — مبتدئ',
    unitNumber: 1,
    title: 'Salam dan Perkenalan',
    arabicTitle: 'التَّحِيَّاتُ وَالتَّعَارُفُ',
    objective: 'Mampu memberi salam, menanyakan kabar, dan menyebutkan nama sendiri dengan lancar.',
    targetExpressions: ['السَّلَامُ عَلَيْكُمْ', 'كَيْفَ حَالُكَ؟', 'أَنَا بِخَيْرٍ وَالْحَمْدُ لِلَّهِ', 'اسْمِي...'],
    speakingMission: 'Perkenalkan dirimu dalam 2 kalimat: sebutkan salam, nama, dan tanyakan kabar teman bicara.',
    keyVocab: [
      { arabic: 'مَرْحَبًا', translation: 'Halo / Selamat datang' },
      { arabic: 'اسْمِي', translation: 'Nama saya' },
      { arabic: 'بِخَيْرٍ', translation: 'Baik / Sehat' },
      { arabic: 'تَشَرَّفْنَا', translation: 'Senang berkenalan' }
    ],
    dialogueStarter: 'السَّلَامُ عَلَيْكُمْ! أَنَا مُعَلِّمُكَ كَلَام بَدِي. مَا اسْمُكَ يَا صَدِيقِي؟'
  },
  {
    id: 'l1-u2',
    level: 'beginner',
    levelLabel: 'Level 1 — مبتدئ',
    unitNumber: 2,
    title: 'Identitas Diri & Asal',
    arabicTitle: 'الْبَيَانَاتُ الشَّخْصِيَّةُ وَالْمَوْطِنُ',
    objective: 'Mampu menjelaskan asal kota/negara, kewarganegaraan, dan status sebagai mahasiswa.',
    targetExpressions: ['مِنْ أَيْنَ أَنْتَ؟', 'أَنَا مِنْ إِنْدُونِيسِيَا', 'أَنَا طَالِبٌ فِي الْجَامِعَةِ'],
    speakingMission: 'Ceritakan asal kota atau daerahmu dan sebutkan bahwa kamu adalah mahasiswa bahasa Arab.',
    keyVocab: [
      { arabic: 'مَدِينَةٌ', translation: 'Kota' },
      { arabic: 'طَالِبٌ / طَالِبَةٌ', translation: 'Mahasiswa / Mahasiswi' },
      { arabic: 'إِنْدُونِيسِيَا', translation: 'Indonesia' },
      { arabic: 'بَلَدٌ', translation: 'Negara / Daerah' }
    ],
    dialogueStarter: 'أَهْلًا بِكَ! مِنْ أَيِّ مَدِينَةٍ أَنْتَ فِي إِنْدُونِيسِيَا؟'
  },
  {
    id: 'l1-u3',
    level: 'beginner',
    levelLabel: 'Level 1 — مبتدئ',
    unitNumber: 3,
    title: 'Angka dan Waktu',
    arabicTitle: 'الْأَرْقَامُ وَالسَّاعَةُ',
    objective: 'Mengenal angka 1-20 dan mampu menyebutkan jam waktu dalam bahasa Arab.',
    targetExpressions: ['كَمِ السَّاعَةُ الْآنَ؟', 'السَّاعَةُ الْآنَ السَّابِعَةُ صَبَاحًا', 'رَقْمُ هَاتِفِي هُوَ...'],
    speakingMission: 'Jawab pertanyaan tentang jam berapa kamu biasa sarapan dan jam berapa kuliah dimulai.',
    keyVocab: [
      { arabic: 'السَّاعَةُ', translation: 'Jam / Waktu' },
      { arabic: 'صَبَاحًا', translation: 'Pagi hari' },
      { arabic: 'مَسَاءً', translation: 'Sore / Malam hari' },
      { arabic: 'وَاحِد، اِثْنَان، ثَلَاثَة', translation: 'Satu, dua, tiga' }
    ],
    dialogueStarter: 'مَرْحَبًا! كَمِ السَّاعَةُ الْآنَ عِنْدَكَ؟'
  },
  {
    id: 'l1-u4',
    level: 'beginner',
    levelLabel: 'Level 1 — مبتدئ',
    unitNumber: 4,
    title: 'Benda di Sekitar & Kelas',
    arabicTitle: 'الْأَشْيَاءُ فِي الْفَصْلِ',
    objective: 'Menyebutkan peralatan belajar dan barang di ruang kelas dengan Isim Isyarah (هَذَا / هَذِهِ).',
    targetExpressions: ['هَذَا كِتَابٌ', 'هَذِهِ حَقِيبَةٌ', 'مَا هَذَا؟', 'الْقَلَمُ عَلَى الْمَكْتَبِ'],
    speakingMission: 'Sebutkan 3 benda yang ada di mejamu saat ini menggunakan bahasa Arab.',
    keyVocab: [
      { arabic: 'كِتَابٌ', translation: 'Buku' },
      { arabic: 'قَلَمٌ', translation: 'Pena' },
      { arabic: 'حَاسُوبٌ', translation: 'Laptop / Komputer' },
      { arabic: 'مَكْتَبٌ', translation: 'Meja' }
    ],
    dialogueStarter: 'انْظُرْ حَوْلَكَ فِي الْغُرْفَةِ، مَا هَذَا الَّذِي عَلَى مَكْتَبِكَ؟'
  },
  {
    id: 'l1-u5',
    level: 'beginner',
    levelLabel: 'Level 1 — مبتدئ',
    unitNumber: 5,
    title: 'Kegiatan Sehari-hari Pemula',
    arabicTitle: 'الْأَنْشِطَةُ الْيَوْمِيَّةُ الْبَسِيطَةُ',
    objective: 'Menggunakan kata kerja dasar (makan, minum, pergi, belajar) dalam kalimat sederhana.',
    targetExpressions: ['أَنَا أَذْهَبُ إِلَى...', 'أَنَا أَدْرُسُ اللُّغَةَ الْعَرَبِيَّةَ', 'أَنَا أَشْرَبُ الْمَاءَ'],
    speakingMission: 'Katakan bahwa kamu sedang belajar bahasa Arab dan suka membaca buku.',
    keyVocab: [
      { arabic: 'أَدْرُسُ', translation: 'Saya belajar' },
      { arabic: 'أَذْهَبُ', translation: 'Saya pergi' },
      { arabic: 'أَأْكُلُ', translation: 'Saya makan' },
      { arabic: 'أَشْرَبُ', translation: 'Saya minum' }
    ],
    dialogueStarter: 'مَاذَا تَفْعَلُ الْآنَ يَا صَدِيقِي؟ هَلْ تَدْرُسُ مَعِي؟'
  },

  // LEVEL 2: ELEMENTARY (أساسي)
  {
    id: 'l2-u6',
    level: 'elementary',
    levelLabel: 'Level 2 — أساسي',
    unitNumber: 6,
    title: 'Kehidupan Kampus & Perkuliahan',
    arabicTitle: 'الْحَيَاةُ الْجَامِعِيَّةُ',
    objective: 'Mendiskusikan mata kuliah, dosen, tugas kelompok, dan fasilitas kampus.',
    targetExpressions: ['مَا هِيَ مَادَّتُكَ الْمُفَضَّلَةُ؟', 'أُحِبُّ دِرَاسَةَ قَوَاعِدِ اللُّغَةِ', 'عِنْدِي امْتِحَانٌ غَدًا'],
    speakingMission: 'Ceritakan mata kuliah yang paling kamu sukai di jurusan PBA dan alasannya.',
    keyVocab: [
      { arabic: 'مَادَّةٌ دِرَاسِيَّةٌ', translation: 'Mata kuliah' },
      { arabic: 'مُفَضَّلٌ', translation: 'Favorit / Disukai' },
      { arabic: 'أُسْتَاذٌ', translation: 'Dosen' },
      { arabic: 'مَشْرُوعٌ جَمَاعِيٌّ', translation: 'Tugas kelompok' }
    ],
    dialogueStarter: 'مَرْحَبًا يَا طَالِبَ اللُّغَةِ الْعَرَبِيَّةِ! مَا هِيَ أَكْثَرُ مَادَّةٍ تُحِبُّهَا فِي الْجَامِعَةِ؟'
  },
  {
    id: 'l2-u7',
    level: 'elementary',
    levelLabel: 'Level 2 — أساسي',
    unitNumber: 7,
    title: 'Hobi dan Minat',
    arabicTitle: 'الْهِوَايَاتُ وَأَوْقَاتُ الْفَرَاغِ',
    objective: 'Mengekspresikan kegemaran seperti membaca, olahraga, menyanyi lagu Arab, atau kaligrafi.',
    targetExpressions: ['هِوَايَتِي الْمُفَضَّلَةُ هِيَ...', 'أُفَضِّلُ لَعِبَ كُرَةِ الْقَدَمِ', 'فِي وَقْتِ الْفَرَاغِ أَقْرَأُ'],
    speakingMission: 'Sebutkan dua hobi utamamu dan jelaskan kapan kamu melakukannya.',
    keyVocab: [
      { arabic: 'هِوَايَةٌ', translation: 'Hobi' },
      { arabic: 'كُرَةُ الْقَدَمِ', translation: 'Sepak bola' },
      { arabic: 'الْخَطُّ الْعَرَبِيُّ', translation: 'Kaligrafi Arab' },
      { arabic: 'السَّفَرُ', translation: 'Traveling / Jalan-jalan' }
    ],
    dialogueStarter: 'الْحَيَاةُ لَيْسَتْ دِرَاسَةً فَقَطْ! مَا هِيَ هِوَايَتُكَ الَّتِي تُحِبُّ مُمارَسَتَهَا؟'
  },
  {
    id: 'l2-u8',
    level: 'elementary',
    levelLabel: 'Level 2 — أساسي',
    unitNumber: 8,
    title: 'Makanan dan Restoran',
    arabicTitle: 'الطَّعَامُ وَالشَّرَابُ',
    objective: 'Mendeskripsikan rasa makanan, memesan hidangan, dan menceritakan masakan tradisional favorit.',
    targetExpressions: ['طَعَامٌ لَذِيذٌ جِدًّا', 'أَنَا جَائِعٌ / عَطْشَانُ', 'أُفَضِّلُ الْأَطْعِمَةَ الْحَارَّةَ'],
    speakingMission: 'Ceritakan makanan favoritmu dari Indonesia dan jelaskan rasanya kepada AI tutor.',
    keyVocab: [
      { arabic: 'لَذِيذٌ', translation: 'Lezat' },
      { arabic: 'حَارٌّ', translation: 'Pedas / Panas' },
      { arabic: 'حُلْوٌ', translation: 'Manis' },
      { arabic: 'وَجْبَةٌ', translation: 'Porsi makanan' }
    ],
    dialogueStarter: 'أَشْعُرُ بِالْجُوعِ قَلِيلًا! مَا هُوَ طَعَامُكَ الْمُفَضَّلُ فِي مَدِينَتِكَ؟'
  },
  {
    id: 'l2-u9',
    level: 'elementary',
    levelLabel: 'Level 2 — أساسي',
    unitNumber: 9,
    title: 'Berbelanja dan Transaksi',
    arabicTitle: 'التَّسَوُّقُ وَالشِّرَاءُ',
    objective: 'Melakukan tawar menawar, menanyakan diskon, warna, dan ukuran produk.',
    targetExpressions: ['كَمْ ثَمَنُ هَذَا؟', 'هَلْ هُنَاكَ لَوْنٌ آخَرُ؟', 'هَذَا سِعْرٌ مُنَاسِبٌ'],
    speakingMission: 'Praktikkan simulasi membeli buku cerita bahasa Arab di toko buku.',
    keyVocab: [
      { arabic: 'ثَمَنٌ / سِعْرٌ', translation: 'Harga' },
      { arabic: 'مَجَّانًا', translation: 'Gratis' },
      { arabic: 'فَاتُورَةٌ', translation: 'Nota / Struk' },
      { arabic: 'تَخْفِيضٌ', translation: 'Diskon' }
    ],
    dialogueStarter: 'أَهْلًا بِكَ فِي مَكْتَبَةِ الْكُتُبِ، عَنْ أَيِّ كِتَابٍ تَبْحَثُ الْيَوْمَ؟'
  },
  {
    id: 'l2-u10',
    level: 'elementary',
    levelLabel: 'Level 2 — أساسي',
    unitNumber: 10,
    title: 'Meminta Bantuan dan Izin',
    arabicTitle: 'طَلَبُ الْمُسَاعَدَةِ وَالِاسْتِئْذَانِ',
    objective: 'Menggunakan ungkapan santun (من فضلك، لو سمحت) untuk memohon bantuan atau izin.',
    targetExpressions: ['لَوْ سَمَحْتَ، هَلْ يُمْكِنُكَ مُسَاعَدَتِي؟', 'مِنْ فَضْلِكَ', 'هَلْ تَسْمَحُ لِي بِـ...'],
    speakingMission: 'Minta tolong kepada tutor untuk mengulangi perkataannya secara sopan.',
    keyVocab: [
      { arabic: 'لَوْ سَمَحْتَ', translation: 'Permisi / Tolong' },
      { arabic: 'مُسَاعَدَةٌ', translation: 'Bantuan' },
      { arabic: 'إِعَادَةٌ', translation: 'Pengulangan' },
      { arabic: 'بِكُلِّ سُرُورٍ', translation: 'Dengan senang hati' }
    ],
    dialogueStarter: 'مَرْحَبًا يَا عَزِيزِي، إِذَا احْتَجْتَ إِلَى أَيِّ شَيْءٍ فَلَا تَتَرَدَّدْ فِي سُؤَالِي!'
  },

  // LEVEL 3: INTERMEDIATE (متوسط)
  {
    id: 'l3-u11',
    level: 'intermediate',
    levelLabel: 'Level 3 — متوسط',
    unitNumber: 11,
    title: 'Menceritakan Pengalaman Masa Lalu',
    arabicTitle: 'التَّحَدُّثُ عَنِ التَّجَارِبِ الْمَاضِيَةِ',
    objective: 'Menguasai fi\'il madhi (kata kerja lampau) untuk menceritakan kisah liburan atau pengalaman kuliah.',
    targetExpressions: ['فِي الْعَامِ الْمَاضِي سَافَرْتُ إِلَى...', 'تَعَلَّمْتُ دَرْسًا مُهِمًّا', 'كَانَتْ تَجْرِبَةً رَائِعَةً'],
    speakingMission: 'Ceritakan satu pengalaman menarik yang pernah kamu alami saat pertama kali masuk universitas.',
    keyVocab: [
      { arabic: 'تَجْرِبَةٌ', translation: 'Pengalaman' },
      { arabic: 'سَافَرْتُ', translation: 'Saya telah bepergian' },
      { arabic: 'ذِكْرَيَاتٌ', translation: 'Kenangan' },
      { arabic: 'فِي الْمَاضِي', translation: 'Di masa lalu' }
    ],
    dialogueStarter: 'كُلُّ إِنْسَانٍ لَدَيْهِ قِصَّةٌ جَمِيلَةٌ. حَدِّثْنِي عَنْ تَجْرِبَةٍ لَا تَنْسَاهَا فِي حَيَاتِكَ!'
  },
  {
    id: 'l3-u12',
    level: 'intermediate',
    levelLabel: 'Level 3 — متوسط',
    unitNumber: 12,
    title: 'Menyampaikan Pendapat & Argumen',
    arabicTitle: 'إِبْدَاءُ الرَّأْيِ وَالتَّعْلِيلُ',
    objective: 'Mengutarakan pandangan pribadi beserta alasan logis menggunakan ungkapan persetujuan dan sanggahan.',
    targetExpressions: ['فِي رَأْيِي الشَّخْصِيِّ...', 'أَعْتَقِدُ أَنَّ...', 'أُوَافِقُكَ الرَّأْيَ لِأَنَّ...', 'لَا أَتَّفِقُ مَعَ هَذَا'],
    speakingMission: 'Sampaikan pendapatmu: apakah belajar bahasa Arab lebih efektif lewat berbicara langsung atau teori nahwu?',
    keyVocab: [
      { arabic: 'رَأْيٌ', translation: 'Pendapat' },
      { arabic: 'أَعْتَقِدُ', translation: 'Saya meyakini / berpendapat' },
      { arabic: 'أُوَافِقُ', translation: 'Saya setuju' },
      { arabic: 'لِأَنَّ', translation: 'Karena' }
    ],
    dialogueStarter: 'مَا رَأْيُكَ الشَّخْصِيُّ: هَلْ مُمَارَسَةُ الْمُحَادَثَةِ أَهَمُّ أَمْ حِفْظُ قَوَاعِدِ النَّحْوِ لِإِتْقَانِ اللُّغَةِ؟'
  },
  {
    id: 'l3-u13',
    level: 'intermediate',
    levelLabel: 'Level 3 — متوسط',
    unitNumber: 13,
    title: 'Diskusi Pendidikan Bahasa Arab',
    arabicTitle: 'حِوَارٌ فِي تَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ',
    objective: 'Membahas tantangan dan peluang mengajar bahasa Arab di era digital dan pemanfaatan AI.',
    targetExpressions: ['تَحَدِّيَاتُ تَعْلِيمِ اللُّغَةِ', 'الذَّكَاءُ الِاصْطِنَاعِيُّ فِي التَّعْلِيمِ', 'تَطْوِيرُ الْمَهَارَاتِ اللُّغَوِيَّةِ'],
    speakingMission: 'Jelaskan bagaimana teknologi AI seperti Kalām Buddy dapat membantu mahasiswa PBA mengatasi rasa minder bicara.',
    keyVocab: [
      { arabic: 'تَعْلِيمٌ', translation: 'Pendidikan / Pengajaran' },
      { arabic: 'مَهَارَةُ الْكَلَامِ', translation: 'Keterampilan berbicara (Maharah Kalam)' },
      { arabic: 'الثِّقَةُ بِالنَّفْسِ', translation: 'Percaya diri' },
      { arabic: 'تَقْنِيَةٌ حَدِيثَةٌ', translation: 'Teknologi modern' }
    ],
    dialogueStarter: 'بِصِفَتِكَ طَالِبًا فِي قِسْمِ تَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ، كَيْفَ تُسَاعِدُنَا التَّكْنُولُوجْيَا فِي كَسْرِ حَاجِزِ الْخَوْفِ مِنَ التَّحَدُّثِ؟'
  },
  {
    id: 'l3-u14',
    level: 'intermediate',
    levelLabel: 'Level 3 — متوسط',
    unitNumber: 14,
    title: 'Rencana & Cita-cita Masa Depan',
    arabicTitle: 'الْخُطَطُ وَالطُّمُوحَاتُ الْمُسْتَقْبَلِيَّةُ',
    objective: 'Menggunakan ungkapan harapan dan masa depan (سَـ / سَوْفَ / أَتَمَنَّى أَنْ) untuk mendeskripsikan karir impian.',
    targetExpressions: ['سَوْفَ أَتَخَرَّجُ فِي...', 'أَتَمَنَّى أَنْ أُصْبِحَ أُسْتَاذًا', 'أُخَطِّطُ لِلسَّفَرِ إِلَى الدُّوَلِ الْعَرَبِيَّةِ'],
    speakingMission: 'Ceritakan impianmu setelah lulus kuliah: apakah ingin menjadi guru, diplomat, penerjemah, atau peneliti.',
    keyVocab: [
      { arabic: 'طُمُوحٌ', translation: 'Cita-cita / Ambisi' },
      { arabic: 'مُسْتَقْبَلٌ', translation: 'Masa depan' },
      { arabic: 'مُتَرْجِمٌ', translation: 'Penerjemah' },
      { arabic: 'أَتَمَنَّى', translation: 'Saya berharap' }
    ],
    dialogueStarter: 'مَا شَاءَ الله! بَعْدَ تَخَرُّجِكَ إِنْ شَاءَ اللهُ، مَاذَا تُخَطِّطُ أَنْ تَعْمَلَ؟ مَا هُوَ حُلْمُكَ؟'
  },
  {
    id: 'l3-u15',
    level: 'intermediate',
    levelLabel: 'Level 3 — متوسط',
    unitNumber: 15,
    title: 'Percakapan Panjang & Debat Santai',
    arabicTitle: 'مُنَاقَشَةٌ عَامَّةٌ وَحِوَارٌ شَامِلٌ',
    objective: 'Melakukan dialog spontan berdurasi panjang, mempertahankan ritme percakapan, dan menanggapi spontan.',
    targetExpressions: ['بِالْإِضَافَةِ إِلَى ذَلِكَ...', 'مِنْ نَاحِيَةٍ أُخْرَى...', 'خُلَاصَةُ الْقَوْلِ...'],
    speakingMission: 'Lakukan percakapan terbuka selama 5 putaran penuh tanpa jeda panjang bersama Kalām Buddy.',
    keyVocab: [
      { arabic: 'مُنَاقَشَةٌ', translation: 'Diskusi / Perdebatan' },
      { arabic: 'وُجْهَةُ نَظَرٍ', translation: 'Sudut pandang' },
      { arabic: 'مُقْنِعٌ', translation: 'Meyakinkan' },
      { arabic: 'فَصَاحَةٌ', translation: 'Kelancaran / Kefasihan' }
    ],
    dialogueStarter: 'مَرْحَبًا يَا بَطَلَ اللُّغَةِ الْعَرَبِيَّةِ! أَنْتَ الْآنَ فِي الْوَحْدَةِ الْأَخِيرَةِ. دَعْنَا نَتَحَاوَرْ حِوَارًا مَفْتُوحًا كَأَصْدِقَاءَ قُدَامَى!'
  }
];

export const INITIAL_VOCABULARY_LIST: Omit<VocabularyWord, 'id' | 'userId' | 'createdAt'>[] = [
  {
    arabic: 'التَّعَارُفُ',
    transliteration: "at-Ta'āruf",
    translation: 'Saling mengenal / Perkenalan',
    exampleSentence: 'التَّعَارُفُ خُطْوَةٌ أُولَى لِبِنَاءِ الصَّدَاقَةِ.',
    category: 'Dasar',
    masteryLevel: 4,
    isFavorite: true
  },
  {
    arabic: 'طَالِبٌ جَامِعِيٌّ',
    transliteration: "Ṭālibun Jāmi'iyy",
    translation: 'Mahasiswa universitas',
    exampleSentence: 'أَنَا طَالِبٌ جَامِعِيٌّ فِي قِسْمِ تَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ.',
    category: 'Akademik',
    masteryLevel: 3,
    isFavorite: true
  },
  {
    arabic: 'الثِّقَةُ بِالنَّفْسِ',
    transliteration: 'aś-Śiqatu bin-Nafs',
    translation: 'Rasa percaya diri',
    exampleSentence: 'مُمَارَسَةُ الْكَلَامِ تَبْنِي الثِّقَةَ بِالنَّفْسِ.',
    category: 'Motivasi',
    masteryLevel: 4,
    isFavorite: true
  },
  {
    arabic: 'مُحَادَثَةٌ يَوْمِيَّةٌ',
    transliteration: 'Muḥādaśatun Yaumiyyah',
    translation: 'Percakapan sehari-hari',
    exampleSentence: 'أَسْتَمِعُ إِلَى مُحَادَثَةٍ يَوْمِيَّةٍ كُلَّ صَبَاحٍ.',
    category: 'Komunikasi',
    masteryLevel: 2,
    isFavorite: false
  },
  {
    arabic: 'مُعْجَمٌ لُغَوِيٌّ',
    transliteration: "Mu'jamun Lugawiyy",
    translation: 'Kamus bahasa',
    exampleSentence: 'أَسْتَخْدِمُ الْمُعْجَمَ لِمَعْرِفَةِ مَعْنَى الْكَلِمَاتِ الْجَدِيدَةِ.',
    category: 'Akademik',
    masteryLevel: 3,
    isFavorite: false
  },
  {
    arabic: 'فُرْصَةٌ سَعِيدَةٌ',
    transliteration: "Furṣatun Sa'īdah",
    translation: 'Kesempatan yang membahagiakan (Senang berkenalan)',
    exampleSentence: 'فُرْصَةٌ سَعِيدَةٌ، تَشَرَّفْتُ بِمَعْرِفَتِكَ يَا أَخِي.',
    category: 'Ungkapan',
    masteryLevel: 5,
    isFavorite: true
  }
];
