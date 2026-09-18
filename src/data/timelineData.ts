import { WingId } from '../types/museum';

export interface TimelineMilestone {
  id: string;
  year: string;
  yearNum: number;
  title: string;
  subtitle: string;
  description: string;
  wingId: WingId;
  exhibitId: string;
  location: string;
  quote?: string;
}

export interface HistoricalEra {
  id: string;
  wingId: WingId;
  name: string;
  shortName: string;
  periodLabel: string;
  startYear: number;
  endYear: number;
  color: string;
  bgGradient: string;
  borderColor: string;
  headline: string;
  summary: string;
  milestones: TimelineMilestone[];
}

export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'era_kesultanan',
    wingId: 'kesultanan',
    name: 'Sayap Daulat Kesultanan Aceh',
    shortName: 'Kesultanan Aceh',
    periodLabel: '1607 – 1873 M',
    startYear: 1607,
    endYear: 1873,
    color: '#eab308',
    bgGradient: 'from-amber-950/40 to-yellow-950/20',
    borderColor: 'border-amber-500/50',
    headline: 'Masa Keemasan Iskandar Muda & Kedaulatan Antarbangsa',
    summary:
      'Kesultanan Aceh Darussalam berdiri tegak sebagai lima besar imperium Islam terkuat dunia, menjalin diplomasi maritim dengan Khalifah Utsmaniyah Istanbul, menguasai Selat Malaka, serta memberlakukan Cap Sikureueng sebagai segel kedaulatan diraja.',
    milestones: [
      {
        id: 'ms_1607',
        year: '1607 M',
        yearNum: 1607,
        title: 'Penobatan Sultan Iskandar Muda Meukuta Alam',
        subtitle: 'Masa Puncak Kedaulatan & Sarakata Meukuta Alam',
        description:
          'Sultan Iskandar Muda menduduki takhta Kesultanan Aceh Darussalam, mencetak Cap Sikureueng sebagai segel diraja kedaulatan 9 lingkaran leluhur yang berdaulat atas seluruh pulau Sumatra.',
        wingId: 'kesultanan',
        exhibitId: 'cap_sikureueng',
        location: 'Istana Darud Donya, Bandar Aceh',
        quote: 'Adat bak Po Teumeureuhom, Hukom bak Syiah Kuala.',
      },
      {
        id: 'ms_1614',
        year: '1614 M',
        yearNum: 1614,
        title: 'Armada Lada Sicupak & Hubungan Utsmaniyah',
        subtitle: 'Aliansi Militer & Teknologi Meriam Perunggu',
        description:
          'Kapal utusan Aceh membawa segantang lada ke Istanbul; Sultan Selim II membalas dengan bantuan kapal perang, perwira artileri, dan meriam perunggu legendaris "Lada Sicupak" untuk membentengi Selat Malaka.',
        wingId: 'kesultanan',
        exhibitId: 'meriam_lada_sicupak',
        location: 'Kuta Radja & Selat Malaka',
        quote: 'Persaudaraan abadi antara Utsmaniyah dan Singa Malaka.',
      },
      {
        id: 'ms_1871',
        year: '1824 – 1871 M',
        yearNum: 1871,
        title: 'Traktat London & Pengakuan Kedaulatan',
        subtitle: 'Pengakuan Internasional Batas-Batas Wilayah Aceh',
        description:
          'Peta litografi abad ke-19 mendokumentasikan kedaulatan Aceh sebagai negara merdeka berdaulat yang diakui Inggris dan Belanda melalui Traktat London 1824 sebelum dikhianati oleh Traktat Sumatra 1871.',
        wingId: 'kesultanan',
        exhibitId: 'peta_kuno_sumatra',
        location: 'Arsip Batavia & London',
      },
    ],
  },
  {
    id: 'era_perang_semesta',
    wingId: 'perang_semesta',
    name: 'Sayap Perang Semesta & Syuhada',
    shortName: 'Perang Semesta 1873',
    periodLabel: '1873 – 1911 M',
    startYear: 1873,
    endYear: 1911,
    color: '#ef4444',
    bgGradient: 'from-red-950/40 to-rose-950/20',
    borderColor: 'border-red-500/50',
    headline: 'Perang 38 Tahun Menumbangkan Penjajahan Belanda',
    summary:
      'Dimulai dari agresi militer Belanda 26 Maret 1873 di Pantai Cermin hingga tewasnya Jenderal Kohler di depan Masjid Raya Baiturrahman. Rakyat Aceh bangkit dalam perang semesta yang digelorakan oleh Hikayat Prang Sabil dan kepemimpinan srikandi Cut Nyak Dhien.',
    milestones: [
      {
        id: 'ms_1873',
        year: '26 Mar 1873',
        yearNum: 1873,
        title: 'Maklumat Perang Belanda & Gugurnya Kohler',
        subtitle: 'Ekspedisi Pertama Belanda Hancur Lebur',
        description:
          'Belanda mengumumkan perang resmi terhadap Aceh. Pasukan elit KNIL di bawah Mayor Jenderal J.H.R. Köhler dipukul mundur; Köhler tewas ditembak sniper pejuang Aceh di halaman Masjid Raya Baiturrahman.',
        wingId: 'perang_semesta',
        exhibitId: 'naskah_hikayat_prang_sabil',
        location: 'Pantai Cermin & Masjid Raya Baiturrahman',
      },
      {
        id: 'ms_1881',
        year: '1881 M',
        yearNum: 1881,
        title: 'Seruan Hikayat Prang Sabil Teungku Chik di Tiro',
        subtitle: 'Kebangkitan Total Perang Suci Semesta',
        description:
          'Teungku Chik Muhammad Saman di Tiro menyusun dan menggandakan manuskrip Hikayat Prang Sabil, mengobarkan semangat syahid rakyat di seluruh pelosok Pidie, Aceh Besar, dan Pasee.',
        wingId: 'perang_semesta',
        exhibitId: 'naskah_hikayat_prang_sabil',
        location: 'Dayah Tiro & Benteng Cot Plieng',
        quote: 'Jangan engkau sangka orang yang gugur di jalan Allah itu mati...',
      },
      {
        id: 'ms_1905',
        year: '1905 M',
        yearNum: 1905,
        title: 'Gerilya Rimba Raya Cut Nyak Dhien & Rencong Bawar',
        subtitle: 'Keteguhan Srikandi Agung di Rimba Meulaboh',
        description:
          'Meskipun rabun dan menderita sakit encok di belantara Meulaboh, Cut Nyak Dhien menolak menyerah dan tetap memegang rencong pusakanya saat disergap pasukan Marsose Belanda.',
        wingId: 'perang_semesta',
        exhibitId: 'rencong_cut_nyak_dien',
        location: 'Belantara Beutong & Meulaboh',
      },
      {
        id: 'ms_1911',
        year: '3 Des 1911',
        yearNum: 1911,
        title: 'Gugurnya Teungku Maat di Tiro di Alue Simi',
        subtitle: 'Saksi Darah Generasi Terakhir Dinasti Tiro',
        description:
          'Teungku Muhammad Mat Amin (Teungku Maat di Tiro) syahid dalam pertempuran sengit di Tangse Pidie pada usia 16 tahun, meninggalkan pita darah yang kelak menginspirasi cucu saudaranya, Hasan di Tiro.',
        wingId: 'perang_semesta',
        exhibitId: 'pita_darah_alue_simi',
        location: 'Alue Simi, Tangse, Pidie',
      },
    ],
  },
  {
    id: 'era_deklarasi_halimon',
    wingId: 'deklarasi_halimon',
    name: 'Sayap Acheh Institute & Deklarasi 1976',
    shortName: 'Deklarasi Halimon',
    periodLabel: '1976 M',
    startYear: 1976,
    endYear: 1976,
    color: '#38bdf8',
    bgGradient: 'from-sky-950/40 to-cyan-950/20',
    borderColor: 'border-sky-500/50',
    headline: 'Pendaratan Rahasia Pasi Lhok & Proklamasi Gunung Halimon',
    summary:
      'Setelah bertahun-tahun melobi delegasi internasional di markas PBB New York melalui Acheh Institute, Dr. Tengku Hasan M. di Tiro kembali ke tanah leluhurnya dengan perahu kayu rahasia dan memproklamasikan Kemerdekaan Aceh Sumatra pada 4 Desember 1976 di Puncak Bukit Tjokkan.',
    milestones: [
      {
        id: 'ms_1976_oct',
        year: '30 Okt 1976',
        yearNum: 1976,
        title: 'Pendaratan Rahasia di Kuala Tari Pasi Lhok',
        subtitle: 'Kepulangan dari Markas PBB New York',
        description:
          'Membawa koper arsip diplomatik Acheh Institute, paspor, dan naskah kajian sejarah internasional, Hasan di Tiro mendarat secara senyap di pantai Pasi Lhok, Pidie, dengan kapal nelayan kecil.',
        wingId: 'deklarasi_halimon',
        exhibitId: 'arsip_acheh_institute_pbb',
        location: 'Kuala Tari, Pasi Lhok, Pidie',
      },
      {
        id: 'ms_1976_dec',
        year: '4 Des 1976',
        yearNum: 1976,
        title: 'Deklarasi Kemerdekaan Aceh Sumatra di Halimon',
        subtitle: 'Pembacaan Proklamasi & Pengibaran Bulan Bintang',
        description:
          'Di atas batu cadas Bukit Tjokkan, Gunung Halimon, naskah deklarasi resmi dalam bahasa Inggris dan Aceh dibacakan di hadapan para tokoh pejuang, memulihkan kedaulatan bangsa Aceh.',
        wingId: 'deklarasi_halimon',
        exhibitId: 'naskah_deklarasi_1976',
        location: 'Bukit Tjokkan, Gunung Halimon',
        quote: 'We, the people of Acheh, Sumatra, exercising our inherent right...',
      },
      {
        id: 'ms_1976_flag',
        year: 'Desember 1976',
        yearNum: 1976,
        title: 'Pengibaran Sang Saka Bulan Bintang Pertama',
        subtitle: 'Lambang Perjuangan di Atas Puncak Halimon',
        description:
          'Bendera Bulan Bintang dengan kain merah bergaris ganda hitam-putih dikibarkan pertama kali di markas gerilya Gunung Halimon sebagai simbol resmi identitas dan martabat bangsa.',
        wingId: 'deklarasi_halimon',
        exhibitId: 'bendera_bulan_bintang_1976',
        location: 'Puncak Halimon & Markas Bukit Tjokkan',
      },
    ],
  },
  {
    id: 'era_rimba_gerilya',
    wingId: 'rimba_gerilya',
    name: 'Sayap Belantara & The Price of Freedom',
    shortName: 'Belantara Rimba 1977-79',
    periodLabel: '1977 – 1979 M',
    startYear: 1977,
    endYear: 1979,
    color: '#10b981',
    bgGradient: 'from-emerald-950/40 to-teal-950/20',
    borderColor: 'border-emerald-500/50',
    headline: 'Markas Rimba Tiro, Pelantikan Kabinet & Suara Merdeka',
    summary:
      'Perjuangan mempertahankan eksistensi pemerintahan di tengah lebatnya rimba raya Tiro, Lhok Nilam, dan Alue Tjring. Hasan di Tiro mencatat setiap peristiwa bersejarah, mendirikan pemancar radio gerilya, dan merampungkan mahakarya catatan hariannya.',
    milestones: [
      {
        id: 'ms_1977',
        year: '15 Jan 1977',
        yearNum: 1977,
        title: 'Pelantikan Kabinet Pertama di Rimba Lhok Nilam',
        subtitle: 'Pembentukan Pemerintahan Gerilya Berdaulat',
        description:
          'Di bawah naungan pohon-pohon rimba Lhok Nilam, kabinet pertama dilantik secara khidmat dengan pengucapan sumpah setia pada Al-Quran dan cita-cita kemerdekaan bangsa.',
        wingId: 'rimba_gerilya',
        exhibitId: 'buku_price_of_freedom',
        location: 'Rimba Lhok Nilam, Pidie',
      },
      {
        id: 'ms_1977_drama',
        year: '1977 – 1978 M',
        yearNum: 1977.5,
        title: 'Pengetikan The Drama of Achehnese History',
        subtitle: 'Mesin Tik Olympia di Tengah Hujan Peluru',
        description:
          'Menggunakan mesin ketik portabel Olympia di gubuk bambu Alue Tjring, naskah buku sejarah dan surat-surat diplomatik ke PBB diketik di bawah temaram lampu teplok.',
        wingId: 'rimba_gerilya',
        exhibitId: 'mesin_ketik_drama_history',
        location: 'Camp Rimba Alue Tjring',
      },
      {
        id: 'ms_1978_radio',
        year: '1978 M',
        yearNum: 1978,
        title: 'Siaran Radio "The Voice of Free Acheh"',
        subtitle: 'Memecah Kebisuan Melalui Gelombang Radio Rimba',
        description:
          'Stasiun pemancar gelombang pendek bertenaga aki mobil menyiarkan warta perjuangan dan pidato-pidato kemerdekaan yang didengar oleh masyarakat di pesisir dan mancanegara.',
        wingId: 'rimba_gerilya',
        exhibitId: 'radio_voice_of_free_acheh',
        location: 'Camp Alue Bhot & Puncak Gunung Tjokkan',
      },
      {
        id: 'ms_1979_diary',
        year: 'Maret 1979',
        yearNum: 1979,
        title: 'Penyelesaian Naskah The Price of Freedom',
        subtitle: 'Warisan Abadi Menembus Blokade Musuh',
        description:
          'Menjelang keberangkatan melanjutkan mandat diplomatik internasional, buku harian "The Price of Freedom" tuntas dirapikan, mendokumentasikan setiap tetes pengorbanan pejuang rimba.',
        wingId: 'rimba_gerilya',
        exhibitId: 'buku_price_of_freedom',
        location: 'Rimba Jeunieb & Pesisir Selat Malaka',
      },
    ],
  },
];
