import { Exhibit, GuidedTour, WingInfo } from '../types/museum';

export const MUSEUM_WINGS: WingInfo[] = [
  {
    id: 'kesultanan',
    name: 'Sayap Daulat Kesultanan Aceh',
    subtitle: 'Masa Keemasan Iskandar Muda & Pengakuan Dunia',
    eraPeriod: 'Abad XVI – XIX Masehi',
    bannerColor: '#eab308',
    description: 'Menelusuri kejayaan Kesultanan Aceh Darussalam sebagai poros maritim dunia, hubungan diplomatik dengan Khilafah Utsmaniyah, Sarakata Meukuta Alam, dan kedaulatan pulau Sumatra.',
    entrancePosition: [-16, 1.6, -14],
  },
  {
    id: 'perang_semesta',
    name: 'Sayap Perang Semesta & Syuhada',
    subtitle: '1873 – 1911: Dari Bandar Aceh hingga Alue Bhot',
    eraPeriod: '1873 – 1911 Masehi',
    bannerColor: '#ef4444',
    description: 'Menyaksikan heroisme rakyat Aceh menumbangkan agresi Belanda di Bandar Aceh 1873, kobaran Hikayat Prang Sabil Teungku Chik di Tiro, serta keteguhan Cut Nyak Dhien dan Teuku Umar.',
    entrancePosition: [16, 1.6, -14],
  },
  {
    id: 'deklarasi_halimon',
    name: 'Sayap Acheh Institute & Deklarasi 1976',
    subtitle: 'Dari New York Menuju Puncak Gunung Tjokkan Hill',
    eraPeriod: '1976 Masehi',
    bannerColor: '#38bdf8',
    description: 'Dokumentasi kepulangan Hasan di Tiro dari markas PBB New York, pendaratan rahasia di Kuala Tari Pasi Lhok, hingga Proklamasi Kemerdekaan Aceh Sumatra 4 Desember 1976 di Halimon.',
    entrancePosition: [-16, 1.6, 14],
  },
  {
    id: 'rimba_gerilya',
    name: 'Sayap Belantara & Arsip "The Price of Freedom"',
    subtitle: 'Markas Rimba Tiro, Pelantikan Kabinet & Dokumen Sejarah',
    eraPeriod: '1977 – 1979 Masehi',
    bannerColor: '#10b981',
    description: 'Mengabadikan catatan harian otentik Hasan di Tiro, pelantikan Kabinet Lhok Nilam 1977, pengetikan drama sejarah di tengah kepungan musuh, dan pemancar The Voice of Free Acheh.',
    entrancePosition: [16, 1.6, 14],
  },
];

export const EXHIBITS: Exhibit[] = [
  // SAYAP 1: KESULTANAN ACEH DARUSSALAM
  {
    id: 'cap_sikureueng',
    name: 'Cap Sikureueng (Segel Sembilan Daulat Diraja)',
    nativeTitle: 'Cap Sikureuëng Keurajeuën Atjèh Darussalam',
    wingId: 'kesultanan',
    era: 'Era Kesultanan Aceh Darussalam',
    year: '1607 – 1636 M (Zaman Sultan Iskandar Muda)',
    provenance: 'Istana Darud Donya, Bandar Aceh (Kuta Radja)',
    material: 'Emas Murni Bertatahkan Tembaga & Enamel Arabesque Kaligrafi',
    dimensions: 'Diameter 14 cm; Berat: 1.8 kg',
    pedestalPosition: [-16, 0, -18],
    accentColor: '#eab308',
    meshType: 'cap_sikureueng',
    ambienceTheme: 'seurune',
    curatorNotes: 'Cap Sikureueng adalah meterai stempel agung Kesultanan Aceh yang memuat sembilan lingkaran: lingkaran tengah untuk Sultan yang sedang bertakhta (Sultan Iskandar Muda Meukuta Alam) dikelilingi delapan lingkaran para leluhur pendiri dinasti. Cap ini mengesahkan Sarakata (Kitab Peraturan Perundang-undangan Adat dan Syariah).',
    diaryQuote: {
      date: '27 Desember 1977',
      text: 'Adat bak Po teuh Meureuhom, Hukom bak Sjiah Kuala. Hukum adat kita berasal dari Sultan Iskandar Muda, hukum syariat ditata oleh Syaikh Abdurrauf As-Singkili. Inilah fondasi kedaulatan peradaban Aceh yang tak pernah lekang oleh waktu.',
      pageRef: 'The Price of Freedom, hal. 126 & 209'
    },
    audioNarration: 'Di hadapan Anda terpajang Cap Sikureueng, segel lambang kedaulatan mutlak Kesultanan Aceh Darussalam. Pada masa kejayaan Sultan Iskandar Muda, dokumen internasional yang membawa stempel sembilan lingkaran ini dihormati oleh kerajaan-kerajaan Eropa mulai dari Inggris di bawah Raja James Pertama hingga Prancis dan Kesultanan Utsmaniyah. Kedaulatan ini ditegakkan di atas perpaduan kokoh antara adat istiadat leluhur dan syariat Islam.',
    audioDurationSeconds: 42,
    highlightDetails: [
      'Lingkaran Pusat: Sultan Iskandar Muda Johan Berdaulat (Po Teuh Meureuhom)',
      '8 Lingkaran Keliling: Sultan Ali Mughayat Syah, Sultan Salahuddin, Alauddin Riayat Syah al-Kahar, dll.',
      'Semboyan Adat: "Mate aneuk mupat jeurat, gadoh adat ho tamita"',
      'Legitimasi Diplomatik: Digunakan pada surat resmi traktat antarbangsa abad 17'
    ],
    timeline: [
      { year: '1524 M', title: 'Penyatuan Aceh Raya', description: 'Sultan Ali Mughayat Syah mendirikan Kesultanan Aceh bersatu mengusir Portugis dari Pasai.' },
      { year: '1607 M', title: 'Penobatan Iskandar Muda', description: 'Awal masa keemasan Aceh menguasai Selat Malaka, Semenanjung Melayu hingga pesisir barat Sumatra.' },
      { year: '1636 M', title: 'Pemberlakuan Sarakata', description: 'Kodifikasi hukum perdata dan pidana Islam tercatat dalam hukum negara tertua di kawasan.' }
    ],
    xrayFeatures: [
      { title: 'Struktur Logam Emas Kuningan', description: 'Komposisi metalurgi tinggi khas pandai besi Kesultanan Aceh yang tahan korosi air laut tropis.' },
      { title: 'Inskripsi Kaligrafi Tsuluts', description: 'Ukiran nama sembilan penguasa dengan ketajaman relief 2.5 milimeter.' }
    ]
  },
  {
    id: 'meriam_lada_sicupak',
    name: 'Meriam Lada Sicupak (Armada Kesultanan & Utsmani)',
    nativeTitle: 'Beudé Raksasa Lada Sitjupak',
    wingId: 'kesultanan',
    era: 'Persekutuan Militer Aceh – Ottoman',
    year: '1568 M (Era Sultan Alauddin Riayat Syah al-Kahar)',
    provenance: 'Benteng Kuta Radja / Kiriman Sultan Selim II Istanbul',
    material: 'Perunggu Cor Berkualitas Tinggi dengan Relief Kaligrafi Bintang Khilafah',
    dimensions: 'Panjang: 3.4 meter; Kaliber: 180 mm; Berat: 2.200 kg',
    pedestalPosition: [-11, 0, -22],
    accentColor: '#f59e0b',
    meshType: 'meriam_lada_sicupak',
    ambienceTheme: 'rapai',
    curatorNotes: 'Legenda Lada Sicupak mencatat utusan Aceh yang berlayar ke Istanbul membawa muatan berkapal-kapal lada untuk memohon bantuan pertahanan dari Khilafah Utsmaniyah menghadapi imperialis Portugis. Dipersembahkanlah secupak lada yang tersisa, dan Sultan Utsmani membalas dengan mengirimkan 500 pandai meriam, teknisi senjata, dan meriam-meriam kaliber berat.',
    diaryQuote: {
      date: '23 April 1977',
      text: 'Bukan tanpa sebab para leluhur kita mampu menghancurkan armada Portugis di Malaka dan mengusir penjajah Belanda di Pantai Ceureumen. Tradisi persenjataan dan kedaulatan militer laut Aceh telah diakui dunia berabad-abad.',
      pageRef: 'The Price of Freedom, hal. 60'
    },
    audioNarration: 'Inilah Meriam Lada Sicupak, bukti persaudaraan internasional dan kemampuan maritim Aceh. Ketika Portugis berusaha memonopoli jalur rempah Nusantara, armada laut Aceh menjalin aliansi strategis dengan Kesultanan Utsmaniyah di Istanbul. Meriam perunggu raksasa ini menjadi benteng pertahanan pesisir yang sanggup melontarkan peluru besi hingga menghalau kapal perang musuh di muara Krueng Aceh.',
    audioDurationSeconds: 40,
    highlightDetails: [
      'Lambang Bintang & Bulan Sabit Utsmaniyah terukir di pangkal laras meriam',
      'Kisah Heroik Lada Sicupak: Pengorbanan kapal diplomatik mengarungi Samudra Hindia',
      'Kapasitas Tembak: Mampu menjangkau kapal perang di perairan Selat Malaka',
      'Pabrik Senjata Rimba: Menginspirasi pendirian industri pertahanan lokal di Gayo dan Pidie'
    ],
    timeline: [
      { year: '1565 M', title: 'Misi Diplomatik ke Istanbul', description: 'Sultan Alauddin al-Kahar mengirim delegasi ke Sultan Suleiman I / Selim II.' },
      { year: '1568 M', title: 'Kedatangan Ekspedisi Utsmani', description: 'Dua kapal pembawa ahli artileri militer dan ratusan pucuk senjata tiba di pelabuhan Aceh.' },
      { year: '1873 M', title: 'Dipakai Melawan Agresi Belanda', description: 'Meriam-meriam bersejarah ini kembali mempertahankan Masjid Raya Baiturrahman dari serangan Kohler.' }
    ],
    xrayFeatures: [
      { title: 'Laras Kaliber 180mm', description: 'Ruang bakar tebal berdinding 65mm yang sanggup menahan tekanan bubuk mesiu mesiu mesiu lokal.' },
      { title: 'Bantalan Roda Kayu Jati Tua', description: 'Konstruksi roda kayu keras yang dirancang mobil untuk operasi benteng pertahanan tanah lapang.' }
    ]
  },
  {
    id: 'peta_kuno_sumatra',
    name: 'Peta Kedaulatan Aceh (The Graphic London 1883 & Prancis)',
    nativeTitle: 'Peuta Roayaume d’Achem & Peta Kedaulatan De Jure',
    wingId: 'kesultanan',
    era: 'Diplomasi Internasional Abad XIX',
    year: '1883 M (London Supplement to The Graphic)',
    provenance: 'London & Arsip Nasional Paris / Arsip The Price of Freedom',
    material: 'Kertas Kuno Peta Berwarna, Bingkai Kayu Berukir Motif Aceh Pintu Khop',
    dimensions: '85 cm × 60 cm',
    pedestalPosition: [-21, 0, -14],
    accentColor: '#38bdf8',
    meshType: 'peta_kuno_sumatra',
    ambienceTheme: 'seurune',
    curatorNotes: 'Peta resmi yang diterbitkan surat kabar bergengsi The Graphic di London pada 22 September 1883, membuktikan bahwa 10 tahun setelah deklarasi perang sepihak Belanda (1873), Kesultanan Aceh tetap merupakan entitas berdaulat secara de jure dan de facto yang diakui dunia internasional, bebas dari administrasi Hindia Belanda.',
    diaryQuote: {
      date: '20 Agustus 1977',
      text: 'Lihatlah peta Sumatra sebelum kolonialisme tiba. Kerajaan Aceh mencakup seluruh pulau Sumatra hingga ke batas Jambi dan Riau. Peta resmi Inggris tahun 1883 membuktikan bahwa satu dekade setelah perang meletus, Aceh tetap berdiri berdaulat!',
      pageRef: 'The Price of Freedom, hal. 93 & 127'
    },
    audioNarration: 'Peta bersejarah yang Anda amati diterbitkan di London oleh The Graphic pada tahun 1883, serta peta Prancis Roayaume d’Achem. Dokumen kartografi ini menjadi bukti hukum internasional bahwa wilayah kedaulatan Aceh bukanlah bagian jajahan Belanda. Bahkan Presiden Amerika Serikat Ulysses S. Grant pada tahun 1873 mengeluarkan Proklamasi Netralitas resmi antara dua negara yang berdaulat: Kerajaan Belanda dan Kesultanan Aceh.',
    audioDurationSeconds: 44,
    highlightDetails: [
      'Peta The Graphic London (22 September 1883): Menunjukkan batas de jure teritorial Aceh',
      'Peta Prancis Roayaume d’Achem: Mengonfirmasi kedudukan Kesultanan Aceh atas Sumatra',
      'Proklamasi Netralitas Presiden AS Ulysses S. Grant (1873)',
      'Traktat London 1819 & 1824: Hubungan istimewa dengan Kerajaan Inggris'
    ],
    timeline: [
      { year: '1819 M', title: 'Traktat London Raffles', description: 'Inggris menandatangani traktat persahabatan mengakui kedaulatan abadi Kesultanan Aceh.' },
      { year: '1873 M', title: 'Proklamasi Netralitas Amerika Serikat', description: 'Presiden AS Ulysses Grant menegaskan status hukum perang antardua negara berdaulat.' },
      { year: '1883 M', title: 'Publikasi Peta Kedaulatan', description: 'Pers internasional membongkar klaim palsu Belanda atas penaklukan Aceh.' }
    ],
    xrayFeatures: [
      { title: 'Tinta Cetak Litografi Abad 19', description: 'Garis batas teritorial berwarna merah yang menegaskan wilayah bebas kolonialisme.' },
      { title: 'Segel Kedutaan Konsulat Padang 1615', description: 'Bukti pengakuan hak jalan diplomatik kapal-kapal Eropa di perairan Sumatra.' }
    ]
  },

  // SAYAP 2: PERANG SEMESTA & BARISAN PARA SYUHADA (1873 - 1911)
  {
    id: 'naskah_hikayat_prang_sabil',
    name: 'Kitab Hikayat Prang Sabil & Tongkat Teungku Chik di Tiro',
    nativeTitle: 'Kitab Hikayat Prang Sabi & Bawar Tgk Tjhik di Tiro',
    wingId: 'perang_semesta',
    era: 'Perang Semesta Melawan Agresi Belanda',
    year: '1881 M (Tiro, Pidie)',
    provenance: 'Dayah Tiro / Benteng Aneuk Galong',
    material: 'Kertas Dalang Daluang Bertinta Emas & Gagang Tongkat Tanduk Kerbau',
    dimensions: 'Naskah: 32 × 22 cm, 180 halaman; Tongkat: 110 cm',
    pedestalPosition: [16, 0, -18],
    accentColor: '#ef4444',
    meshType: 'naskah_hikayat_prang_sabil',
    ambienceTheme: 'azan_rimba',
    curatorNotes: 'Kitab epos kepahlawanan religius karya Teungku Chik di Tiro Muhammad Saman (1838–1891). Naskah syair bait-bait ini menggerakkan seluruh lapisan rakyat Aceh dalam perang semesta membela agama dan tanah air. Pengaruhnya begitu dahsyat sehingga pemerintah kolonial Belanda melarang kepemilikan kitab ini dengan ancaman hukuman penjara seumur hidup atau pembuangan.',
    diaryQuote: {
      date: '25 Januari 1978',
      text: 'Teungku Tjhik di Tiro Muhammad Saman adalah pedang sekaligus pena tertajam dalam sejarah bangsa kita. Kitab Hikayat Prang Sabil membakar jiwa perlawanan rakyat selama 17 tahun mengurung Belanda di dalam benteng Kuta Radja.',
      pageRef: 'The Price of Freedom, hal. 139–140'
    },
    audioNarration: 'Inilah naskah legendaris Hikayat Prang Sabil bersama tongkat komando Teungku Chik di Tiro Muhammad Saman. Beliau membangkitkan martabat bangsa dari keterpurukan tahun 1874 dan memimpin perlawanan selama 17 tahun berturut-turut hingga mengurung tentara Belanda di Kuta Radja. Puisi religius ini bukan sekadar sastra, melainkan manifestasi jiwa bangsa yang menolak menyerah kepada siapapun selain Allah.',
    audioDurationSeconds: 45,
    highlightDetails: [
      'Gubahan Syair Sanjak Aceh: Membangkitkan semangat syahadah dan kemuliaan syahid',
      'Larangan Keras Kolonial: Belanda memberlakukan hukum buang bagi pembaca hikayat',
      'Strategi Pengepungan 17 Tahun: Pasukan Tiro mengurung militer Belanda di Kuta Radja',
      'Gelar Raja Perang: Maulana Almudabbir Almalik Teungku Chik di Tiro'
    ],
    timeline: [
      { year: '1881 M', title: 'Teungku Chik di Tiro Memimpin', description: 'Memulai kepemimpinan perlawanan total rakyat Aceh di front Aneuk Galong.' },
      { year: '1891 M', title: 'Syahidnya Sang Pemimpin', description: 'Wafat diracun oleh kaki tangan Belanda di Benteng Aneuk Galong menjelang serangan pamungkas.' },
      { year: '1896 M', title: 'Pertempuran Aneuk Galong', description: 'Putra sulung Teungku Muhammad Amin gugur bersama 200 pejuang tanpa satupun menyerah.' }
    ],
    xrayFeatures: [
      { title: 'Tinta Tradisional Getah Kayu & Jelaga', description: 'Ketahanan pigmen tulisan Arab Jawi (Jawoe) yang bertahan lebih dari satu abad di hutan rimba.' },
      { title: 'Bilah Baja Tongkat Rahasia', description: 'Gagang tongkat menyembunyikan belati bawar baja pamor untuk pertahanan jarak dekat.' }
    ]
  },
  {
    id: 'rencong_cut_nyak_dien',
    name: 'Rencong Pusaka Cut Nyak Dhien & Bawar Teuku Umar',
    nativeTitle: 'Rintjong Meukuta Alam & Peudeueng Meulaboh',
    wingId: 'perang_semesta',
    era: 'Perang Gerilya Aceh Barat & Aceh Besar',
    year: '1899 – 1905 M',
    provenance: 'Meulaboh & Rimba Beutong Leuser',
    material: 'Baja Pamor Meteorit, Gagang Meucangge (Gading Gajah & Emas 22K)',
    dimensions: 'Panjang Bilah: 38 cm; Panjang Sarung: 42 cm',
    pedestalPosition: [11, 0, -22],
    accentColor: '#f97316',
    meshType: 'rencong_cut_nyak_dien',
    ambienceTheme: 'rapai',
    curatorNotes: 'Senjata pusaka Cut Nyak Dhien, Srikandi Agung perang kemerdekaan Aceh. Setelah suaminya Teuku Umar syahid di Ujong Kala Meulaboh (11 Februari 1899), Cut Nyak Dhien mengambil alih komando pasukan dan bergerilya di hutan lebat selama bertahun-tahun hingga usia tua, menderita rabun dan asam urat, namun semangat martabatnya pantang disentuh belas kasihan musuh.',
    diaryQuote: {
      date: '11 Februari 1978',
      text: 'Ketika pengkhianat Pang Laot hendak menyerahkannya agar diobati Belanda, Cut Nyak Dhien menghunus rencongnya dan berseru: "Kita orang Aceh merdeka, hidup untuk kehormatan dan kemuliaan, bukan demi kenyang perut seperti binatang ternak!"',
      pageRef: 'The Price of Freedom, hal. 144'
    },
    audioNarration: 'Rencong pusaka Cut Nyak Dhien melambangkan huruf Arab Bismillah dalam lengkungan bilahnya. Di puncak-puncak gunung berselimut kabut di pedalaman Aceh Barat, wanita perkasa ini memimpin para gerilyawan pria dan wanita. Bahkan saat kedua matanya telah buta dan tubuhnya lunglai, ia menolak tunduk kepada jenderal-jenderal Belanda yang memburunya.',
    audioDurationSeconds: 43,
    highlightDetails: [
      'Morfologi Bilah: Membentuk kaligrafi Bismillahir-Rahmanir-Rahim',
      'Gagang Meucangge: Emas bertatahkan motif flora pucuk rebung khas Aceh',
      'Syahidnya Teuku Umar di Suak Ujong Kala (11 Februari 1899)',
      'Simbol Takhta Kehormatan Wanita Aceh dalam Garis Komando Perang'
    ],
    timeline: [
      { year: '1899 M', title: 'Gugurnya Teuku Umar', description: 'Teuku Umar syahid diterjang peluru serdadu van Heutsz di tepi pantai Meulaboh.' },
      { year: '1899–1905 M', title: 'Komando Rimba Cut Nyak Dhien', description: 'Enam tahun memimpin perang gerilya gerak cepat di hutan belantara Beutong.' },
      { year: '1905 M', title: 'Penangkapan Penuh Kehormatan', description: 'Belanda menangkap beliau dalam kondisi buta dan mengasingkannya ke Sumedang.' }
    ],
    xrayFeatures: [
      { title: 'Lipatan Pamor Baja Damaskus', description: 'Pola lipatan pamor besi meteorit lokal yang memberikan kelenturan sekaligus ketajaman luar biasa.' },
      { title: 'Selongsong Emas Pengunci Gagang', description: 'Ring kuningan padat berukir motif bungong jeumpa pengikat hulu tanduk.' }
    ]
  },
  {
    id: 'pita_darah_alue_simi',
    name: 'Perban Berdarah & Segel Teungku Chik Maat di Tiro (1911)',
    nativeTitle: 'Tjintjin Segel & Ija Balot Darah Syuhada Alue Bhot',
    wingId: 'perang_semesta',
    era: 'Pertempuran Terakhir Para Pemimpin Tiro',
    year: '1910 – 1911 M',
    provenance: 'Alue Simi (Tangse) & Alue Bhot (1911)',
    material: 'Kain Kafan Belacu Bernoda Darah Kering, Cincin Stempel Emas Berukir',
    dimensions: 'Pita: 45 cm × 8 cm; Cincin: Diameter 22 mm',
    pedestalPosition: [21, 0, -14],
    accentColor: '#dc2626',
    meshType: 'pita_darah_alue_simi',
    ambienceTheme: 'azan_rimba',
    curatorNotes: 'Peninggalan paling menyentuh dari gugurnya para pemimpin keluarga Tiro. Teungku Chik Mahyeddin syahid di Alue Simi (1910), dan perbannya dipotong kecil-kecil oleh rakyat Tangse sebagai kenang-kenangan suci. Tahun berikutnya, 3 Desember 1911, keponakannya Teungku Chik Maat di Tiro gugur pada usia 16 tahun di medan Alue Bhot, menutup rantai kepemimpinan bersenjata keluarga Tiro melawan Belanda tanpa sekalipun menyerah.',
    diaryQuote: {
      date: '3 Desember 1977',
      text: 'Kolonel Schmidt mencatat: Teungku Chik Maat di Tiro gugur dengan pistol masih digenggam tangan kanannya, kopiah sutra merah di kepalanya, menatap langit bebas. Di usianya yang baru 16 tahun, ia memilih syahid agar bangsanya tetap hidup!',
      pageRef: 'The Price of Freedom, hal. 119–120'
    },
    audioNarration: 'Benda pusaka ini adalah potongan kain perban dan cincin stempel milik pemimpin muda Teungku Chik Maat di Tiro. Pada 3 Desember 1911, dalam pertempuran sengit di Alue Bhot Tangse, seluruh pasukan pengawal dan pemimpin muda berusia 16 tahun ini gugur hingga orang terakhir. Tak seorang pun bersedia menyerah atau menandatangani surat damai tawaran Belanda. Dari darah inilah Hasan di Tiro melanjutkan obor perjuangan pada 4 Desember 1976.',
    audioDurationSeconds: 46,
    highlightDetails: [
      'Gugurnya Teungku Chik Mahyeddin di Alue Simi (5 September 1910)',
      'Pertempuran Alue Bhot (3 Desember 1911): Seluruh pengawal bertempur hingga syahid',
      'Usia Muda 16 Tahun: Keteladanan keteguhan prinsip tak terkalahkan',
      'Hubungan Genealogis: Teungku Chik Maat adalah paman kandung dari ayah Hasan di Tiro'
    ],
    timeline: [
      { year: '1910 M', title: 'Pertempuran Alue Simi', description: 'Gugurnya Teungku Chik Mahyeddin di Tiro, pahlawan bergelar Tanglong Nanggroe.' },
      { year: '1911 M', title: 'Pertempuran Alue Bhot', description: 'Syahidnya Teungku Maat di Tiro (16 tahun), kepala pemerintahan terakhir Aceh merdeka masa itu.' },
      { year: '1976 M', title: 'Deklarasi 4 Desember', description: 'Hasan di Tiro sengaja memilih tanggal 4 Desember tepat sehari setelah peringatan Alue Bhot.' }
    ],
    xrayFeatures: [
      { title: 'Residu Hemoglobin Kering 1910', description: 'Jejak pigmen organik darah syuhada yang diawetkan rakyat dalam tabung bambu tertutup.' },
      { title: 'Inskripsi Cincin Meterai Maat', description: 'Ukiran nama mikroskopis pada cincin meterai logam mulia penanda jabatan kepala negara.' }
    ]
  },

  // SAYAP 3: DEKLARASI HALIMON 1976 & ACHEH INSTITUTE
  {
    id: 'naskah_deklarasi_1976',
    name: 'Naskah Asli Deklarasi Kemerdekaan Aceh 4 Desember 1976',
    nativeTitle: 'Deklarasi Kemerdekaan Atjèh Meurdéhka (Gunong Halimon)',
    wingId: 'deklarasi_halimon',
    era: 'Kelahiran Front Pembebasan Nasional Aceh Sumatra',
    year: '4 Desember 1976 M',
    provenance: 'Bukit Tjokkan (Gunung Halimon), Tiro, Pidie',
    material: 'Kertas Stensil Roneo, Bertinta Hitam dengan Tanda Tangan Tengku Hasan di Tiro',
    dimensions: '33 cm × 21.5 cm (Ukuran Folio Asli)',
    pedestalPosition: [-16, 0, 18],
    accentColor: '#38bdf8',
    meshType: 'naskah_deklarasi_1976',
    ambienceTheme: 'azan_rimba',
    curatorNotes: 'Naskah proklamasi yang dibacakan di atas mimbar batu perbukitan Tjokkan Hill pada 4 Desember 1976 oleh Tengku Hasan Muhammad di Tiro. Naskah ini menegaskan hak menentukan nasib sendiri (self-determination) bangsa Aceh Sumatra berdasarkan hukum dekolonisasi PBB, menolak penyerahan sepihak wilayah Aceh dari Belanda ke Jawa pada 1949.',
    diaryQuote: {
      date: '4 Desember 1976',
      text: 'Kami, bangsa Aceh, Sumatra, menggunakan hak menentukan nasib sendiri dan melindungi hak milik historis atas tanah air kami, dengan ini menyatakan diri kami bebas dan merdeka dari segala kontrol politik rezim asing Jakarta.',
      pageRef: 'The Price of Freedom, hal. 15–17'
    },
    audioNarration: 'Anda sedang menyaksikan Naskah Proklamasi Kemerdekaan Aceh Sumatra 4 Desember 1976. Ditulis langsung oleh Tengku Hasan di Tiro di bawah naungan pepohonan rimba Bukit Tjokkan, naskah ini membantah klaim kolonial dan merujuk Piagam PBB tentang Dekolonisasi. Tanggal 4 Desember dipilih secara simbolis, sehari setelah gugurnya pemimpin terakhir Teungku Chik Maat di Tiro pada 3 Desember 1911, menandakan kebangkitan kembali kedaulatan bangsa Aceh.',
    audioDurationSeconds: 47,
    highlightDetails: [
      'Tempat Pembacaan: Puncak Bukit Tjokkan (Tjokkan Hill, Tiro)',
      'Doktrin Hukum Internasional: Menolak "Ex injuria jus non oritur" (Hak tak lahir dari kezaliman)',
      'Peringatan Sejarah: Menghidupkan kembali mata rantai kedaulatan yang terputus sejak 1911',
      'Pemberitahuan kepada Bangsa-Bangsa: Dikirimkan ke PBB, Gedung Putih, dan kepala negara dunia'
    ],
    timeline: [
      { year: '4 Sept 1976', title: 'Keberangkatan dari New York', description: 'Hasan di Tiro meninggalkan kehidupan nyaman di New York untuk memulai perjuangan rimba.' },
      { year: '30 Okt 1976', title: 'Pendaratan Kuala Tari', description: 'Mendarat dengan perahu nelayan di Pasi Lhok, disambut Daud Paneuk dan pemuda lokal.' },
      { year: '4 Des 1976', title: 'Proklamasi Kemerdekaan', description: 'Deklarasi Kemerdekaan Aceh Sumatra dibacakan dan ditandatangani di Bukit Tjokkan.' }
    ],
    xrayFeatures: [
      { title: 'Tanda Tangan Tinta Basah Hasan di Tiro', description: 'Goresan pena tebal dengan kalimat penutup: "Hudep beusare, Mate beusadjan".' },
      { title: 'Cap Kop Surat State of Acheh Sumatra', description: 'Lambang singa kembar bermahkota pengapit bulan bintang dan rencong pusaka.' }
    ]
  },
  {
    id: 'arsip_acheh_institute_pbb',
    name: 'Arsip Diplomasi Acheh Institute & Foto PBB New York (1976)',
    nativeTitle: 'Acheh Institute in America & Misi Perserikatan Bangsa-Bangsa',
    wingId: 'deklarasi_halimon',
    era: 'Jalur Diplomasi Internasional',
    year: '1973 – 1976 M',
    provenance: 'Markas Besar PBB, New York / Fifth Avenue',
    material: 'Foto Perak Gelatin Bersejarah, Dokumen Diplomatik & Paspor Internasional',
    dimensions: 'Foto: 25 × 20 cm; Folder Arsip: 35 × 25 cm',
    pedestalPosition: [-11, 0, 22],
    accentColor: '#0ea5e9',
    meshType: 'arsip_acheh_institute_pbb',
    ambienceTheme: 'vivaldi_forest',
    curatorNotes: 'Dokumentasi foto langka yang dimuat dalam buku The Price of Freedom (halaman 237): Tengku Hasan di Tiro sebagai Ketua Acheh Institute in America dan Presiden Doral International Ltd menghadiri resepsi bersama Sekjen PBB Dr. Kurt Waldheim, Duta Besar Prancis, dan Duta Besar Filipina di Markas Besar PBB New York sesaat sebelum beliau kembali ke belantara Aceh.',
    diaryQuote: {
      date: '4 September 1976',
      text: 'Saya meninggalkan kehidupan mapan di Riverdale New York, jaringan bisnis bersama korporasi 50 besar Amerika, dan pertemuan dengan Sekjen PBB Kurt Waldheim, karena hutang sejarah kepada bangsa dan leluhur saya tidak dapat saya tinggalkan.',
      pageRef: 'The Price of Freedom, hal. 6 & 237'
    },
    audioNarration: 'Foto bersejarah ini memperlihatkan Tengku Hasan di Tiro di Markas Besar Perserikatan Bangsa-Bangsa, New York, pada tahun 1976. Sebagai intelektual lulusan Columbia University dan pengusaha internasional, beliau mendirikan Acheh Institute untuk menyuarakan hak sejarah bangsa Aceh di panggung global. Di foto ini, beliau berbincang akrab dengan Sekretaris Jenderal PBB Dr. Kurt Waldheim, membuktikan jaringan diplomatik kaliber tinggi sebelum beliau memilih terjun ke rimba gerilya.',
    audioDurationSeconds: 45,
    highlightDetails: [
      'Foto Otentik Buku Harian: Hasan di Tiro bersama Sekjen PBB Kurt Waldheim',
      'Pendirian Acheh Institute: Pusat riset sejarah dan advokasi dekolonisasi di Amerika Serikat',
      'Pertemuan dengan Raja Faisal Arab Saudi (1973): Mempersembahkan album prangko Teungku Chik di Tiro',
      'Gelar Doktor Hukum Kehormatan (LL.D) dari University of Plano, Amerika Serikat (1975)'
    ],
    timeline: [
      { year: '1958 M', title: 'Perwakilan di PBB', description: 'Menjadi diplomat pejuang Aceh di New York menggalang dukungan hak penentuan nasib sendiri.' },
      { year: '1973 M', title: 'Peringatan 100 Tahun Perang Aceh', description: 'Pidato bersejarah 100 tahun Perang Bandar Aceh di New York menggugah kesadaran generasi muda.' },
      { year: '1976 M', title: 'Acheh Institute di PBB', description: 'Pertemuan diplomatik puncak di New York sebelum bertolak kembali ke Sumatra.' }
    ],
    xrayFeatures: [
      { title: 'Stempel Diplomatik PBB New York', description: 'Verifikasi tanda masuk gedung delegasi PBB Fifth Avenue bertanggal 1976.' },
      { title: 'Kliping Berita New York Times', description: 'Arsip editorial The New York Times 1873 yang disimpan Hasan di Tiro dalam koper rahasia.' }
    ]
  },
  {
    id: 'bendera_bulan_bintang_1976',
    name: 'Bendera Pusaka Bulan Bintang (Garis Hitam Pengapit)',
    nativeTitle: 'Alam Peudeuëng & Bulan Bintang Atjèh Meurdéhka',
    wingId: 'deklarasi_halimon',
    era: 'Simbol Kedaulatan Nasional',
    year: '1976 M (Desain Resmi NLFAS)',
    provenance: 'Rimba Gunung Halimon / Dikibarkan di Kuta Radja',
    material: 'Kain Sutra Merah, Sablon Bulan Bintang Putih & Dua Garis Hitam',
    dimensions: '180 cm × 120 cm',
    pedestalPosition: [-21, 0, 14],
    accentColor: '#ef4444',
    meshType: 'bendera_bulan_bintang_1976',
    ambienceTheme: 'azan_rimba',
    curatorNotes: 'Bendera bersejarah yang dikibarkan di sekeliling wilayah Aceh sejak 4 Desember 1976. Warna merah melambangkan darah para syuhada, bulan sabit dan bintang putih melambangkan keislaman dan tauhid, serta dua garis hitam di atas dan bawah melambangkan duka cita atas hilangnya kemerdekaan serta tekad pantang mundur hingga kedaulatan kembali.',
    diaryQuote: {
      date: '10 Maret 1977',
      text: 'Sejak kami mengibarkan kembali bendera pusaka seribu tahun ini, bendera merah putih penjajah terlihat pucat dan hampa di mata rakyat Aceh. Rakyat menangis terharu di jalanan saat melihat bendera leluhur mereka kembali berkibar!',
      pageRef: 'The Price of Freedom, hal. 50 & 236'
    },
    audioNarration: 'Inilah Bendera Pusaka Bulan Bintang dengan dua garis hitam pengapit. Pertama kali dikibarkan di Bukit Tjokkan Halimon saat proklamasi 1976, bendera ini segera berkibar secara gerilya di tiang-tiang kantor, sekolah, dan puncak bukit di seluruh Aceh. Di Kuta Radja, para mahasiswa bahkan berani mengibarkannya di depan markas militer lawan. Bagi rakyat Aceh, kain merah ini memanggil memori kejayaan armada Iskandar Muda dan keperkasaan para syuhada Tiro.',
    audioDurationSeconds: 43,
    highlightDetails: [
      'Dasar Merah Menyala: Kesucian darah pengorbanan para syuhada pembela tanah air',
      'Bulan Sabit & Bintang: Landasan syariat Islam dan kepatuhan hanya kepada Allah',
      'Dua Garis Hitam Pengapit: Peringatan atas masa pendudukan dan sumpah tidak akan berdamai dengan kezaliman',
      'Upacara Penaikan Bendera: Selalu diiringi lantunan Azan syahdu sebagai seruan kemenangan'
    ],
    timeline: [
      { year: '4 Des 1976', title: 'Pengibaran Pertama di Tjokkan', description: 'Dikibarkan di tiang bambu markas pertama Bukit Tjokkan diiringi takbir.' },
      { year: '11 Mar 1977', title: 'Berkibar di Kuta Radja', description: 'Aktivis mahasiswa mengibarkan bendera di ibu kota hingga disiarkan radio BBC London.' },
      { year: '30 Okt 1977', title: 'Pawai Pasukan di Lhok Nilam', description: '200 prajurit berseragam hijau memberi hormat militer pada apel akbar kabinet.' }
    ],
    xrayFeatures: [
      { title: 'Jahitan Tangan Benang Rona Emas', description: 'Tenunan tangan para ibu di pedalaman Truseb dan Tangse yang menjahit bendera di malam buta.' },
      { title: 'Tali Sabut Pengikat Tiang Hutan', description: 'Anyaman sabut kelapa yang tahan terpaan badai pegunungan tropis Sumatra.' }
    ]
  },

  // SAYAP 4: JEJAK RIMBA & ARSIP "THE PRICE OF FREEDOM"
  {
    id: 'buku_price_of_freedom',
    name: 'Buku Diary Asli "The Price of Freedom" (1984)',
    nativeTitle: 'Buku Diari Sejarah "The Price of Freedom" Hasan di Tiro',
    wingId: 'rimba_gerilya',
    era: 'Penerbitan Pertama 1984',
    year: '1984 M (Catatan 1976 – 1979)',
    provenance: 'National Liberation Front of Acheh Sumatra (NLFAS)',
    material: 'Buku Berjilid Keras (Hardcover) dengan Lambang Singa Kembar Emas',
    dimensions: '23 cm × 15.5 cm; 240 Halaman Lengkap',
    pedestalPosition: [16, 0, 18],
    accentColor: '#10b981',
    meshType: 'buku_price_of_freedom',
    ambienceTheme: 'seurune',
    curatorNotes: 'Mahakarya dokumentasi sejarah primer yang ditulis langsung oleh Tengku Hasan di Tiro selama masa bergerilya 1976–1979 di hutan belantara Aceh. Buku harian ini merekam hari demi hari perjalanan hidup, filosofi Nietzsche dan Islam, pertempuran melawan kelaparan, pengorbanan para pengawal setia, hingga kepindahan rahasia ke luar negeri pada 29 Maret 1979.',
    diaryQuote: {
      date: '4 Desember 1981 (Pengantar Buku)',
      text: 'Nilai suatu hal tidak ditentukan oleh apa yang dapat engkau peroleh darinya, melainkan berapa harga yang rela engkau bayar untuk mendapatkannya. Manusia yang tahu bagaimana cara mati dengan mulia tidak akan pernah dapat diperbudak lagi.',
      pageRef: 'The Price of Freedom, Pengantar hal. 4'
    },
    audioNarration: 'Buku The Price of Freedom karya Tengku Hasan di Tiro adalah salah satu catatan harian perang paling dramatis di abad kedua puluh. Ditulis bukan di ruang kerja nyaman, melainkan di atas alas plastik bocor di bawah guyuran hujan lebat, di sela desingan peluru senapan mesin dan sengatan malaria. Buku ini menjadi manifesto kesadaran sejarah bagi bangsa Aceh yang diselundupkan dan dibaca secara sembunyi-sembunyi di seluruh penjuru negeri.',
    audioDurationSeconds: 46,
    highlightDetails: [
      'Periode Catatan: 4 September 1976 hingga 29 Maret 1979',
      '41 Kamp Gerilya: Jejak Panton Weng, Tjokkan Hill, Camp Karim, Alue Seupot, hingga Batee Iliek',
      'Poster Pencarian "SERUAN": Menampilkan foto 9 tokoh pimpinan NLFAS dengan status Buron',
      'Foto Bersejarah Asli: Hasan Tiro memegang senapan di rimba dan menyeberangi sungai bersama pengawal'
    ],
    timeline: [
      { year: '1976–1979 M', title: 'Penulisan Harian di Rimba', description: 'Dicatat harian dengan mesin tik portabel dan tulisan tangan di sela pertempuran.' },
      { year: '1984 M', title: 'Penerbitan Pertama NLFAS', description: 'Diterbitkan resmi oleh Kementerian Pendidikan dan Informasi Negara Aceh Sumatra.' },
      { year: '2000-an M', title: 'Warisan Inspirasi Peradaban', description: 'Menjadi rujukan primer akademisi internasional mengenai konflik dan sejarah Aceh.' }
    ],
    xrayFeatures: [
      { title: 'Kertas Jilid Asli London/Stockholm', description: 'Kertas tahan air asam dengan cetakan tipe huruf serif manual Olympia.' },
      { title: 'Tanda Tangan Tinta Biru Basah', description: 'Paraf Hasan di Tiro pada halaman pendahuluan bertanggal 4 Desember 1981.' }
    ]
  },
  {
    id: 'mesin_ketik_drama_history',
    name: 'Mesin Ketik Rimba & Naskah Drama of Achehnese History',
    nativeTitle: 'Mesin Tik Portabel Olympia & Naskah Sandiwara Sejarah 1873-1978',
    wingId: 'rimba_gerilya',
    era: 'Markas Rimba Alue Tjring & Puntjeuek Hill',
    year: 'Oktober 1978 M',
    provenance: 'Camp Alue Tjring & Puntjeuek Hill, Tiro',
    material: 'Baja Paduan, Tutup Koper Pelindung & Kertas Berkarbon 4 Rangkap',
    dimensions: '32 cm × 30 cm × 10 cm; Berat: 5.5 kg',
    pedestalPosition: [11, 0, 22],
    accentColor: '#14b8a6',
    meshType: 'mesin_ketik_drama_history',
    ambienceTheme: 'vivaldi_forest',
    curatorNotes: 'Mesin tik manual yang digunakan Hasan di Tiro mengetik naskah The Drama of Achehnese History (1873–1978) setebal 70 halaman, 8 Babak, 23 Adegan. Ditulis di tengah kondisi kelaparan 5 hari berturut-turut di Bukit Puntjeuek dengan meja berkaki pendek di atas rumput. "Mesin tik ini adalah senapan mesin kami untuk saat ini," tegas beliau kepada para pejuang.',
    diaryQuote: {
      date: '20 Oktober 1978',
      text: 'Hari kelima tidak makan, tangan saya gemetar hebat. Menulis tangan mustahil, namun mengetik masih mungkin karena cukup menekan tombol huruf. Geutjhik Uma duduk di belakang saya dengan senjata terkokang, sementara saya terus mengetik 10 halaman sehari.',
      pageRef: 'The Price of Freedom, hal. 201–202'
    },
    audioNarration: 'Mesin tik portabel ini menjadi saksi ketabahan intelektual luar biasa di tengah desingan peluru. Pada Oktober 1978 di Camp Alue Tjring dan Puntjeuek Hill, Tengku Hasan di Tiro mengetik naskah Drama of Achehnese History dalam empat rangkap karbon. Pasukan pengawal yang kelaparan bergantian menjaga beliau. Sandiwara ini kemudian dibacakan di malam hari dengan narator Dr. Husaini Hasan dan diiringi alunan kaset musik Bach dan Vivaldi.',
    audioDurationSeconds: 46,
    highlightDetails: [
      '8 Babak & 23 Adegan: Dari pendaratan Kohler 1873 hingga Deklarasi 4 Desember 1976',
      'Kondisi Penulisan: 5 hari tanpa makanan akibat logistik disergap musuh di Truseb',
      '4 Salinan Karbon: Disebar ke Pidie, Kuta Radja, Batee Iliek, dan arsip pusat',
      'Drama Radio Kaset: Direkam dengan suara burung dan gemericik air sungai hutan'
    ],
    timeline: [
      { year: '1 Juli 1978', title: 'Mulai Menulis Naskah', description: 'Hasan di Tiro mengalokasikan jam 7 pagi hingga 6 sore khusus menulis di hutan.' },
      { year: '25 Okt 1978', title: 'Pengetikan Selesai', description: 'Naskah rampung 70 halaman dan dibacakan pertama kali kepada pasukan di Alue Tjring.' },
      { year: 'Maret 1979', title: 'Rekaman Sandiwara Radio', description: 'Diproduksi ke pita kaset tape recorder disebarkan ke desa-desa di seluruh Aceh.' }
    ],
    xrayFeatures: [
      { title: 'Tuts Huruf Logam Tipe QWERTY', description: 'Bilah tipe huruf baja berkarat ringan bekas terkena kelembaban udara lembah sungai Tiro.' },
      { title: 'Pita Karbon Hitam-Merah', description: 'Pita karbon ganda impor New York yang dibawa Hasan di Tiro di dalam koper hitamnya.' }
    ]
  },
  {
    id: 'radio_voice_of_free_acheh',
    name: 'Pemancar Radio Gerilya "The Voice of Free Acheh"',
    nativeTitle: 'Peunantjara Radio Suara Atjèh Meurdéhka (Alue Seupot 1978)',
    wingId: 'rimba_gerilya',
    era: 'Perang Informasi & Penyiaran Hutan',
    year: 'Januari 1978 M',
    provenance: 'Camp Alue Seupot & Tangse, Pidie',
    material: 'Pemancar Gelombang Pendek SW (Shortwave), Generator Listrik Portabel, Antena Kawat Pohon',
    dimensions: 'Unit Radio: 45 × 35 × 25 cm; Jangkauan: 1.000 Kilometer',
    pedestalPosition: [21, 0, 14],
    accentColor: '#059669',
    meshType: 'radio_voice_of_free_acheh',
    ambienceTheme: 'seurune',
    curatorNotes: 'Stasiun pemancar radio gerilya yang diselundupkan dari Medan ke pedalaman Alue Seupot oleh para aktivis pada 26 Januari 1978. Mengudara di bawah koordinasi Menteri Pendidikan & Informasi Dr. Husaini Hasan dalam tiga bahasa (Aceh, Melayu, Inggris) dengan jangkauan 1.000 km, mematahkan sensor informasi dan kebohongan pers penguasa.',
    diaryQuote: {
      date: '26 Januari 1978',
      text: 'Generator dinyalakan, kabel antena dinaikkan dua prajurit ke pohon tertinggi di belakang kamp. Siaran percobaan berhasil! Suara The Voice of Free Acheh terdengar jernih hingga ke Pidie, Gayo, Peureulak dan sekitarnya. Rakyat menyambutnya dengan gembira!',
      pageRef: 'The Price of Freedom, hal. 142'
    },
    audioNarration: 'Inilah stasiun pemancar The Voice of Free Acheh. Pada Januari 1978, pemancar gelombang pendek ini berhasil dioperasikan di puncak perbukitan Alue Seupot. Siarannya mengudara menembus blokade informasi kolonial, menyiarkan warta kemerdekaan dan pidato menteri-menteri kabinet. Uniknya, di latar belakang rekaman suara sering terdengar suara siamang dan burung rimba tropis, menjadi bukti otentik bahwa suara kebebasan itu benar-benar dipancarkan dari jantung belantara Aceh.',
    audioDurationSeconds: 44,
    highlightDetails: [
      'Jangkauan Siaran: 1.000 km menjangkau seluruh Sumatra hingga semenanjung Malaya',
      'Siaran Tiga Bahasa: Bahasa Aceh, Melayu, dan Bahasa Inggris untuk dunia internasional',
      'Dikelola Dokter & Intelektual: Dr. Husaini Hasan dan pemuda sukarelawan',
      'Akustik Rimba Alami: Suara burung dan kera hutan menjadi ciri khas unik siaran'
    ],
    timeline: [
      { year: '26 Jan 1978', title: 'Siaran Perdana Mengudara', description: 'Uji coba sukses pertama memancarkan siaran The Voice of Free Acheh.' },
      { year: 'Feb 1978', title: 'Pemindahan ke Pos Gunung Terpisah', description: 'Dipindahkan ke puncak terselubung untuk mencegah pelacakan arah sinyal oleh musuh.' },
      { year: '1979 M', title: 'Jaringan Kaset Batee Iliek', description: 'Siaran diproduksi massal dalam ratusan kaset tape dan didengar rakyat di gampong-gampong.' }
    ],
    xrayFeatures: [
      { title: 'Tabung Vakum Pemancar Gelombang SW', description: 'Rangkaian osilator frekuensi kristal dengan penguat tabung berdaya pancar tinggi.' },
      { title: 'Gulungan Kawat Antena Tembaga', description: 'Kabel tembaga enamel 50 meter yang dibentangkan melintang di kanopi pohon sintang.' }
    ]
  },
];

export const GUIDED_TOURS: GuidedTour[] = [
  {
    id: 'tour_halimon_journey',
    title: 'Jejak Deklarasi Kemerdekaan Halimon 1976',
    durationMinutes: 12,
    summary: 'Telusuri momentum paling bersejarah: kepulangan rahasia Hasan di Tiro, pendaratan di Kuala Tari, dan pembacaan Proklamasi Kemerdekaan di puncak Bukit Tjokkan 4 Desember 1976.',
    badge: 'Deklarasi 1976',
    stops: ['naskah_deklarasi_1976', 'bendera_bulan_bintang_1976', 'arsip_acheh_institute_pbb', 'buku_price_of_freedom'],
  },
  {
    id: 'tour_perang_kolonial',
    title: 'Epik Perang Semesta & Dinasti Tiro (1873-1911)',
    durationMinutes: 14,
    summary: 'Kisah keteguhan iman dan keberanian: tumbangnya Jenderal Kohler di Bandar Aceh, kobaran Hikayat Prang Sabil, Cut Nyak Dhien, hingga syahidnya Teungku Chik Maat di Tiro di Alue Bhot.',
    badge: 'Perang Semesta',
    stops: ['cap_sikureueng', 'meriam_lada_sicupak', 'naskah_hikayat_prang_sabil', 'rencong_cut_nyak_dien', 'pita_darah_alue_simi'],
  },
  {
    id: 'tour_diplomasi_dunia',
    title: 'Kedaulatan Hukum & Diplomasi Antarbangsa',
    durationMinutes: 10,
    summary: 'Membongkar arsip internasional: Peta London The Graphic 1883, pengakuan dunia terhadap Kesultanan Aceh, serta kiprah diplomasi Acheh Institute di Markas Besar PBB New York.',
    badge: 'Diplomasi Dunia',
    stops: ['peta_kuno_sumatra', 'arsip_acheh_institute_pbb', 'cap_sikureueng', 'buku_price_of_freedom'],
  },
  {
    id: 'tour_price_of_freedom',
    title: 'Ziarah Sejarah "The Price of Freedom" (1976-1979)',
    durationMinutes: 15,
    summary: 'Tur komprehensif menyelami catatan harian Hasan di Tiro di 41 kamp belantara: perjuangan menembus kepungan, penderitaan kelaparan, ketikan sandiwara sejarah, dan suara radio gerilya.',
    badge: 'Tur Lengkap',
    stops: ['buku_price_of_freedom', 'mesin_ketik_drama_history', 'radio_voice_of_free_acheh', 'naskah_deklarasi_1976', 'bendera_bulan_bintang_1976', 'pita_darah_alue_simi'],
  },
];
