import {
  WasteCategory,
  WasteListing,
  ListingLocation,
  MaterialRequest,
  Deal,
  Verification,
  UserProfile,
  ReportItem,
  AdminAction,
  AppNotification,
  ImpactMetrics,
  SystemSettings
} from '../types';

export const INITIAL_CATEGORIES: WasteCategory[] = [
  // Kategori Non-B3 Diizinkan
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    nama: 'Kayu & Serbuk Gergaji',
    kelompok: 'Kayu & Biomassa',
    boleh_diposting: true,
    faktor_ke_kg: 1.0,
    satuan_default: 'kg',
    slug: 'kayu-serbuk-gergaji',
    ikon: 'Trees',
    deskripsi: 'Sisa potongan kayu murni dan serbuk gergaji mesin serut bengkel mebel / pertukangan.',
    saran_pemanfaatan: [
      'Petani Jamur Tiram: Sebagai media utama baglog budidaya jamur berprotein',
      'Pengrajin Briket: Dipres padat menjadi briket biomassa pengganti arang kayu',
      'Peternak Unggas: Alas kandang higienis penyerap kelembapan dan bau amonia',
      'Pengrajin Batako: Campuran agregat ringan ramah lingkungan'
    ]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    nama: 'Kain Perca & Sisa Tekstil',
    kelompok: 'Tekstil & Serat',
    boleh_diposting: true,
    faktor_ke_kg: 20.0, // 1 karung kain ~ 20 kg
    satuan_default: 'karung',
    slug: 'kain-perca-tekstil',
    ikon: 'Scissors',
    deskripsi: 'Potongan sisa kain bersih dari konveksi pakaian, penjahit rumahan, dan sablon kaos.',
    saran_pemanfaatan: [
      'Pengrajin Keset Tenun: Dianyam menjadi keset kaki bernilai jual tinggi',
      'Produsen Boneka & Bantal: Isian empuk alternatif dakron murah',
      'UMKM Tas Patchwork: Dijahit menjadi tote bag daur ulang modis anak muda',
      'Pengrajin Bros: Aksesoris jilbab dan pernak-pernik suvenir pernikahan'
    ]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    nama: 'Ampas Kopi & Kulit Kopi',
    kelompok: 'Organik Olahan',
    boleh_diposting: true,
    faktor_ke_kg: 1.0,
    satuan_default: 'kg',
    slug: 'ampas-kopi',
    ikon: 'Coffee',
    deskripsi: 'Ampas seduhan kopi harian dari warung kopi, kedai espresso, kafe, dan roastery lokal.',
    saran_pemanfaatan: [
      'Petani Organik: Pupuk kompos alami kaya unsur nitrogen dan penurun pH tanah',
      'UMKM Kosmetik Alami: Scrub eksfoliasi kulit (lulur badan alami)',
      'Pengrajin Briket: Campuran arang aroma terapi wangi kopi',
      'Rumah Tangga: Penetral bau tak sedap kulkas dan rak sepatu'
    ]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    nama: 'Sabut & Tempurung Kelapa',
    kelompok: 'Kayu & Biomassa',
    boleh_diposting: true,
    faktor_ke_kg: 15.0, // 1 karung batok/sabut ~ 15 kg
    satuan_default: 'karung',
    slug: 'kelapa-sabut-tempurung',
    ikon: 'Nut',
    deskripsi: 'Sisa batok kering dan serabut kelapa dari pedagang kelapa parut dan industri santan.',
    saran_pemanfaatan: [
      'Pabrik Briket Arang: Dibuat briket shisha kualitas ekspor bertemperatur tinggi',
      'Petani Hidroponik: Serabut diolah jadi cocopeat media tanam penahan air',
      'Pengrajin Kayu/Dapur: Mangkok estetik dan kerajinan sendok sayur tradisional',
      'Pengolah Air Bersih: Bahan baku karbon aktif penyerap racun filter air'
    ]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    nama: 'Ampas Tahu & Kedelai',
    kelompok: 'Organik Basah',
    boleh_diposting: true,
    faktor_ke_kg: 1.0,
    satuan_default: 'kg',
    slug: 'ampas-tahu',
    ikon: 'Egg',
    deskripsi: 'Sisa perasan bubur kedelai produksi tahu basah higienis tanpa fermentasi kimia.',
    saran_pemanfaatan: [
      'Peternak Sapi & Bebek: Campuran pakan basah tinggi protein',
      'Pembudidaya Maggot BSF: Media biokonversi lalat tentara hitam',
      'Produsen Pangan Olahan: Bahan baku tempe gembus atau kerupuk ampas tahu'
    ]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    nama: 'Kardus & Kertas Kraft',
    kelompok: 'Kertas & Karton',
    boleh_diposting: true,
    faktor_ke_kg: 1.0,
    satuan_default: 'kg',
    slug: 'kardus-kertas',
    ikon: 'Box',
    deskripsi: 'Kardus bekas kemasan barang dan kertas buram bersih sisa retail atau percetakan.',
    saran_pemanfaatan: [
      'UMKM Toko Online: Pengemasan ulang paket hemat ramah lingkungan',
      'Pabrik Wadah Telur: Dihancurkan jadi bubur kertas (egg tray karton)',
      'Pengrajin Kertas Seni: Kertas daur ulang bertekstur estetik untuk suvenir'
    ]
  },

  // Kategori Terlarang (B3 / Kimia / Medis Berbahaya)
  {
    id: 'c1000000-0000-0000-0000-000000000091',
    nama: 'Limbah Medis & Jarum Suntik (DILARANG)',
    kelompok: 'B3 Berbahaya',
    boleh_diposting: false,
    faktor_ke_kg: 1.0,
    satuan_default: 'kg',
    slug: 'limbah-medis-dilarang',
    ikon: 'AlertTriangle',
    deskripsi: 'Limbah faskes/klinik, perban bekas, spuit jarum, obat kadaluwarsa, dan botol infus.',
    saran_pemanfaatan: [],
    peringatan_bahaya: 'DILARANG KERAS! Berbahaya menularkan infeksi mematikan. Wajib dimusnahkan di insinerator suhu tinggi berizin KLHK sesuai PP No. 22/2021.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000092',
    nama: 'Oli Bekas & Pelumas Sintetis (DILARANG)',
    kelompok: 'B3 Berbahaya',
    boleh_diposting: false,
    faktor_ke_kg: 1.0,
    satuan_default: 'liter',
    slug: 'oli-bekas-dilarang',
    ikon: 'AlertOctagon',
    deskripsi: 'Pelumas mesin bekas bengkel motor/mobil, gemuk mesin, oli gardan, cairan hidrolik.',
    saran_pemanfaatan: [],
    peringatan_bahaya: 'DILARANG! Masuk Limbah B3 Cair (Kode B105d). Mengandung hidrokarbon karsinogenik perusak air tanah seumur hidup.'
  }
];

export const MOCK_ADMIN_USER: UserProfile = {
  id: 'u0000000-0000-0000-0000-000000000001',
  email: 'admin@bursa.id',
  nama_usaha: 'Pusat Moderasi Bursa UMKM',
  no_wa: '6281100000001',
  jenis_usaha: 'Badan Pengawas Komunitas',
  peran_usaha: 'keduanya',
  peran_sistem: 'admin',
  status_akun: 'aktif',
  latitude: -7.2575,
  longitude: 112.7521,
  alamat_tampilan: 'Genteng, Surabaya',
  alamat_presisi: 'Gedung Sentra UMKM Lt. 3, Jl. Pemuda No. 1, Surabaya',
  foto_usaha: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  is_lokasi_terverifikasi: true,
  jumlah_transaksi_terkonfirmasi: 50
};

export const MOCK_REGULAR_USER: UserProfile = {
  id: 'u1000000-0000-0000-0000-000000000001',
  email: 'mebel.cakmul@umkm.id',
  nama_usaha: 'Mebel Kayu Berkah Cak Mul',
  no_wa: '6281234567001',
  jenis_usaha: 'Bengkel Kayu & Mebel Jati',
  peran_usaha: 'penghasil',
  peran_sistem: 'pengguna',
  status_akun: 'aktif',
  latitude: -7.2655,
  longitude: 112.7480,
  alamat_tampilan: 'Tegalsari, Surabaya',
  alamat_presisi: 'Jl. Kedungsari No. 42B, RT 03/RW 04, Tegalsari, Surabaya',
  foto_usaha: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  is_lokasi_terverifikasi: true,
  jumlah_transaksi_terkonfirmasi: 5
};

export const MOCK_SEEKER_USER: UserProfile = {
  id: 'u1000000-0000-0000-0000-000000000004',
  email: 'jamur.organik@umkm.id',
  nama_usaha: 'Budidaya Jamur Sejahtera',
  no_wa: '6281234567004',
  jenis_usaha: 'Petani Jamur Tiram',
  peran_usaha: 'pencari',
  peran_sistem: 'pengguna',
  status_akun: 'aktif',
  latitude: -7.3100,
  longitude: 112.7280,
  alamat_tampilan: 'Gayungan, Surabaya',
  alamat_presisi: 'Jl. Menanggal VII No. 15, Gayungan, Surabaya',
  foto_usaha: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80',
  is_lokasi_terverifikasi: true,
  jumlah_transaksi_terkonfirmasi: 4
};

export const MOCK_SUSPENDED_USER: UserProfile = {
  id: 'u1000000-0000-0000-0000-000000000006',
  email: 'spammer.kayu@umkm.id',
  nama_usaha: 'Gudang Fiktif Surabaya',
  no_wa: '6281999999999',
  jenis_usaha: 'Pengepul Tidak Resmi',
  peran_usaha: 'penghasil',
  peran_sistem: 'pengguna',
  status_akun: 'ditangguhkan',
  alasan_sanksi: 'Akun ditangguhkan 7 hari oleh Admin Moderasi karena terbukti mencantumkan alamat fiktif dan memposting drum bekas zat kimia berbahaya.',
  latitude: -7.2500,
  longitude: 112.7500,
  alamat_tampilan: 'Bubutan, Surabaya',
  alamat_presisi: 'Jl. Demak No. 999, Surabaya',
  is_lokasi_terverifikasi: false,
  jumlah_transaksi_terkonfirmasi: 0
};

export const INITIAL_LISTINGS: WasteListing[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    owner_id: 'u1000000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000001',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Kayu & Serbuk Gergaji',
    category_icon: 'Trees',
    judul: 'Serbuk Gergaji Halus Kayu Jati & Mahoni Bersih',
    deskripsi: 'Rutin dihasilkan setiap Sabtu dari mesin ketam serut. Bersih dari paku, kering tidak terkena air, cocok sekali untuk media bibit jamur tiram atau alas kandang kelinci/ayam.',
    volume_per_minggu: 120,
    satuan: 'kg',
    foto: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    foto_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    harga: 0,
    tipe_harga: 'gratis',
    harga_satuan: 0,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    status_moderasi: 'disetujui',
    lokasi_terverifikasi: true,
    is_lokasi_terverifikasi: true,
    kedaluwarsa_pada: '2026-11-29T10:00:00Z',
    dibuat_pada: '2026-11-15T08:30:00Z',
    jarak_km: 1.2,
    is_contact_locked: true,
    nama_usaha: 'Mebel Kayu Berkah Cak Mul',
    jenis_usaha: 'Bengkel Kayu & Mebel Jati',
    alamat_tampilan: 'Tegalsari, Surabaya',
    no_wa: '6281234567001',
    exact_latitude: -7.2655,
    exact_longitude: 112.7480,
    approx_latitude: -7.27,
    approx_longitude: 112.75,
    approx_radius_meters: 800,
    is_email_verified: true,
    has_confirmed_transactions: true
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    owner_id: 'u1000000-0000-0000-0000-000000000002',
    user_id: 'u1000000-0000-0000-0000-000000000002',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    category_name: 'Ampas Kopi & Kulit Kopi',
    category_icon: 'Coffee',
    judul: 'Ampas Kopi Espresso & Robusta Segar',
    deskripsi: 'Ampas seduhan harian kedai kami sekitar 15 kg per hari atau 90-100 kg per minggu. Sudah ditiriskan dalam karung berpori. Bagus untuk bahan kompos organik dan briket aroma.',
    volume_per_minggu: 90,
    satuan: 'kg',
    foto: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    foto_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    harga: 0,
    tipe_harga: 'gratis',
    harga_satuan: 0,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    status_moderasi: 'disetujui',
    lokasi_terverifikasi: true,
    is_lokasi_terverifikasi: true,
    kedaluwarsa_pada: '2026-11-27T12:00:00Z',
    dibuat_pada: '2026-11-14T09:00:00Z',
    jarak_km: 4.8,
    is_contact_locked: true,
    nama_usaha: 'Warung Kopi Ruang Temu',
    jenis_usaha: 'Kedai Kopi & Cafe',
    alamat_tampilan: 'Mulyorejo, Surabaya',
    no_wa: '6281234567002',
    exact_latitude: -7.2810,
    exact_longitude: 112.7930,
    approx_latitude: -7.28,
    approx_longitude: 112.79,
    approx_radius_meters: 800,
    is_email_verified: true,
    has_confirmed_transactions: true
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    owner_id: 'u1000000-0000-0000-0000-000000000003',
    user_id: 'u1000000-0000-0000-0000-000000000003',
    category_id: 'c1000000-0000-0000-0000-000000000002',
    category_name: 'Kain Perca & Sisa Tekstil',
    category_icon: 'Scissors',
    judul: 'Kain Perca Katun Combed Sisa Jahit Kaos',
    deskripsi: 'Potongan kain perca warna-warni ukuran telapak tangan hingga 30 cm. Bahan katun combed 24s/30s bersih tanpa noda minyak mesin.',
    volume_per_minggu: 15,
    satuan: 'karung',
    foto: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    foto_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    harga: 15000,
    tipe_harga: 'berbayar',
    harga_satuan: 15000,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    status_moderasi: 'disetujui',
    lokasi_terverifikasi: false, // Lokasi Belum Terverifikasi
    is_lokasi_terverifikasi: false,
    kedaluwarsa_pada: '2026-11-25T14:00:00Z',
    dibuat_pada: '2026-11-13T10:15:00Z',
    jarak_km: 9.6,
    is_contact_locked: true,
    nama_usaha: 'Konveksi Citra Mandiri',
    jenis_usaha: 'Garmen & Konveksi Kaos',
    alamat_tampilan: 'Waru, Sidoarjo',
    no_wa: '6281234567003',
    exact_latitude: -7.3420,
    exact_longitude: 112.7210,
    approx_latitude: -7.34,
    approx_longitude: 112.72,
    approx_radius_meters: 1000,
    is_email_verified: true,
    has_confirmed_transactions: false
  },
  {
    id: 'a1000000-0000-0000-0000-000000000004',
    owner_id: 'u1000000-0000-0000-0000-000000000007',
    user_id: 'u1000000-0000-0000-0000-000000000007',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    category_name: 'Ampas Tahu & Kedelai',
    category_icon: 'Egg',
    judul: 'Ampas Tahu Basah Segar Setiap Pagi',
    deskripsi: 'Sisa olahan kedai tahu harian sekitar 300 kg/minggu masih hangat. Bagus langsung diambil peternak sapi atau bebek. Pakan berprotein tinggi.',
    volume_per_minggu: 300,
    satuan: 'kg',
    foto: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    foto_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    harga: 500,
    tipe_harga: 'berbayar',
    harga_satuan: 500,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    status_moderasi: 'disetujui',
    lokasi_terverifikasi: true,
    is_lokasi_terverifikasi: true,
    kedaluwarsa_pada: '2026-11-30T10:00:00Z',
    dibuat_pada: '2026-11-16T08:00:00Z',
    jarak_km: 3.5,
    is_contact_locked: true,
    nama_usaha: 'Pabrik Tahu Sumber Barokah',
    jenis_usaha: 'Produsen Tahu & Tempe',
    alamat_tampilan: 'Sawahan, Surabaya',
    no_wa: '6281234567007',
    exact_latitude: -7.2750,
    exact_longitude: 112.7300,
    approx_latitude: -7.27,
    approx_longitude: 112.73,
    approx_radius_meters: 800,
    is_email_verified: true,
    has_confirmed_transactions: true
  },
  {
    id: 'a1000000-0000-0000-0000-000000000005',
    owner_id: 'u1000000-0000-0000-0000-000000000009',
    user_id: 'u1000000-0000-0000-0000-000000000009',
    category_id: 'c1000000-0000-0000-0000-000000000006',
    category_name: 'Kardus & Kertas Kraft',
    category_icon: 'Box',
    judul: 'Kardus Bekas Box Kraft Double Wall Tebal',
    deskripsi: 'Kardus bekas kemasan spare part kondisi bersih 90% utuh. Ukuran rata-rata 40x30x20 cm siap dipres ikat.',
    volume_per_minggu: 200,
    satuan: 'kg',
    foto: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    foto_url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    harga: 1200,
    tipe_harga: 'berbayar',
    harga_satuan: 1200,
    metode_pengambilan: 'didiskusikan',
    status: 'aktif',
    status_moderasi: 'disetujui',
    lokasi_terverifikasi: true,
    is_lokasi_terverifikasi: true,
    kedaluwarsa_pada: '2026-11-28T14:00:00Z',
    dibuat_pada: '2026-11-14T11:00:00Z',
    jarak_km: 4.1,
    is_contact_locked: true,
    nama_usaha: 'Percetakan & Karton Sentosa',
    jenis_usaha: 'Percetakan & Offset Box',
    alamat_tampilan: 'Krembangan, Surabaya',
    no_wa: '6281234567009',
    exact_latitude: -7.2400,
    exact_longitude: 112.7400,
    approx_latitude: -7.24,
    approx_longitude: 112.74,
    approx_radius_meters: 800,
    is_email_verified: true,
    has_confirmed_transactions: true
  },
  {
    id: 'a1000000-0000-0000-0000-000000000006',
    owner_id: 'u1000000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000001',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Kayu & Serbuk Gergaji',
    category_icon: 'Trees',
    judul: 'Potongan Balok Kayu Jati Sisa Ukir',
    deskripsi: 'Balok kayu panjang 20-50 cm potongan rapi. Cocok untuk kerajinan tatakan gelas atau mainan anak edukatif.',
    volume_per_minggu: 40,
    satuan: 'ikat',
    foto: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    foto_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    harga: 5000,
    tipe_harga: 'berbayar',
    harga_satuan: 5000,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    status_moderasi: 'disetujui',
    lokasi_terverifikasi: true,
    is_lokasi_terverifikasi: true,
    kedaluwarsa_pada: '2026-11-26T15:00:00Z',
    dibuat_pada: '2026-11-12T16:00:00Z',
    jarak_km: 1.5,
    is_contact_locked: true,
    nama_usaha: 'Mebel Kayu Berkah Cak Mul',
    jenis_usaha: 'Bengkel Kayu & Mebel Jati',
    alamat_tampilan: 'Tegalsari, Surabaya',
    no_wa: '6281234567001',
    exact_latitude: -7.2655,
    exact_longitude: 112.7480,
    approx_latitude: -7.27,
    approx_longitude: 112.75,
    approx_radius_meters: 800,
    is_email_verified: true,
    has_confirmed_transactions: true
  },
  {
    id: 'a1000000-0000-0000-0000-000000000007',
    owner_id: 'u1000000-0000-0000-0000-000000000005',
    user_id: 'u1000000-0000-0000-0000-000000000005',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    category_name: 'Sabut & Tempurung Kelapa',
    category_icon: 'Nut',
    judul: 'Batok Tempurung Kelapa Kering Grade A',
    deskripsi: 'Sisa batok kelapa pemecahan santan industri. Volume 50 karung siap jemput pick up untuk arang briket shisha.',
    volume_per_minggu: 50,
    satuan: 'karung',
    foto: 'https://images.unsplash.com/photo-1598449356475-b9f71db7d847?auto=format&fit=crop&w=600&q=80',
    foto_url: 'https://images.unsplash.com/photo-1598449356475-b9f71db7d847?auto=format&fit=crop&w=600&q=80',
    harga: 10000,
    tipe_harga: 'berbayar',
    harga_satuan: 10000,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    status_moderasi: 'menunggu_tinjauan', // Antrean Moderasi Admin (A5)
    lokasi_terverifikasi: true,
    is_lokasi_terverifikasi: true,
    kedaluwarsa_pada: '2026-11-30T17:00:00Z',
    dibuat_pada: '2026-11-16T11:00:00Z',
    jarak_km: 6.4,
    is_contact_locked: true,
    nama_usaha: 'Briket Hijau Nusantara',
    jenis_usaha: 'Pengrajin Briket & Arang Aktif',
    alamat_tampilan: 'Rungkut Industri, Surabaya',
    no_wa: '6281234567005',
    exact_latitude: -7.3150,
    exact_longitude: 112.7680,
    approx_latitude: -7.31,
    approx_longitude: 112.77,
    approx_radius_meters: 800,
    is_email_verified: true,
    has_confirmed_transactions: true
  },
  {
    id: 'a1000000-0000-0000-0000-000000000008',
    owner_id: 'u1000000-0000-0000-0000-000000000003',
    user_id: 'u1000000-0000-0000-0000-000000000003',
    category_id: 'c1000000-0000-0000-0000-000000000002',
    category_name: 'Kain Perca & Sisa Tekstil',
    category_icon: 'Scissors',
    judul: 'Sisa Kain Denim & Kanvas Tebal',
    deskripsi: 'Sisa celana jeans dan jaket kanvas. Potongan sedang sangat cocok untuk tas selempang vintage atau apron kerja UMKM.',
    volume_per_minggu: 10,
    satuan: 'karung',
    foto: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=600&q=80',
    foto_url: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=600&q=80',
    harga: 20000,
    tipe_harga: 'berbayar',
    harga_satuan: 20000,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    status_moderasi: 'disetujui',
    lokasi_terverifikasi: false,
    is_lokasi_terverifikasi: false,
    kedaluwarsa_pada: '2026-11-26T09:00:00Z',
    dibuat_pada: '2026-11-12T09:00:00Z',
    jarak_km: 9.8,
    is_contact_locked: true,
    nama_usaha: 'Konveksi Citra Mandiri',
    jenis_usaha: 'Garmen & Konveksi Kaos',
    alamat_tampilan: 'Waru, Sidoarjo',
    no_wa: '6281234567003',
    exact_latitude: -7.3420,
    exact_longitude: 112.7210,
    approx_latitude: -7.34,
    approx_longitude: 112.72,
    approx_radius_meters: 1000,
    is_email_verified: true,
    has_confirmed_transactions: false
  }
];

export const INITIAL_LOCATIONS: Record<string, ListingLocation> = {
  'a1000000-0000-0000-0000-000000000001': {
    listing_id: 'a1000000-0000-0000-0000-000000000001',
    lat_presisi: -7.2655,
    lng_presisi: 112.7480,
    alamat_presisi: 'Jl. Kedungsari No. 42B, RT 03/RW 04, Tegalsari, Surabaya',
    dibuat_pada: '2026-11-15T08:30:00Z'
  },
  'a1000000-0000-0000-0000-000000000002': {
    listing_id: 'a1000000-0000-0000-0000-000000000002',
    lat_presisi: -7.2810,
    lng_presisi: 112.7930,
    alamat_presisi: 'Jl. Dr. Ir. H. Soekarno No. 88 (Dekat Kampus C UNAIR), Surabaya',
    dibuat_pada: '2026-11-14T09:00:00Z'
  },
  'a1000000-0000-0000-0000-000000000003': {
    listing_id: 'a1000000-0000-0000-0000-000000000003',
    lat_presisi: -7.3420,
    lng_presisi: 112.7210,
    alamat_presisi: 'Jl. Raya Waru Gg. Melati No. 12, Waru, Sidoarjo',
    dibuat_pada: '2026-11-13T10:15:00Z'
  },
  'a1000000-0000-0000-0000-000000000004': {
    listing_id: 'a1000000-0000-0000-0000-000000000004',
    lat_presisi: -7.2750,
    lng_presisi: 112.7300,
    alamat_presisi: 'Jl. Banyu Urip Wetan No. 55, Sawahan, Surabaya',
    dibuat_pada: '2026-11-16T08:00:00Z'
  },
  'a1000000-0000-0000-0000-000000000005': {
    listing_id: 'a1000000-0000-0000-0000-000000000005',
    lat_presisi: -7.2400,
    lng_presisi: 112.7400,
    alamat_presisi: 'Jl. Dupak Bangunrejo No. 8, Krembangan, Surabaya',
    dibuat_pada: '2026-11-14T11:00:00Z'
  },
  'a1000000-0000-0000-0000-000000000006': {
    listing_id: 'a1000000-0000-0000-0000-000000000006',
    lat_presisi: -7.2655,
    lng_presisi: 112.7480,
    alamat_presisi: 'Jl. Kedungsari No. 42B, RT 03/RW 04, Tegalsari, Surabaya',
    dibuat_pada: '2026-11-12T16:00:00Z'
  },
  'a1000000-0000-0000-0000-000000000007': {
    listing_id: 'a1000000-0000-0000-0000-000000000007',
    lat_presisi: -7.3150,
    lng_presisi: 112.7680,
    alamat_presisi: 'Kawasan Industri SIER Blok E-4, Rungkut, Surabaya',
    dibuat_pada: '2026-11-16T11:00:00Z'
  },
  'a1000000-0000-0000-0000-000000000008': {
    listing_id: 'a1000000-0000-0000-0000-000000000008',
    lat_presisi: -7.3420,
    lng_presisi: 112.7210,
    alamat_presisi: 'Jl. Raya Waru Gg. Melati No. 12, Waru, Sidoarjo',
    dibuat_pada: '2026-11-12T09:00:00Z'
  }
};

export const INITIAL_REQUESTS: MaterialRequest[] = [
  {
    id: 'r1000000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000004',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Kayu & Serbuk Gergaji',
    judul: 'Dibutuhkan: Serbuk Kayu Gergaji Halus untuk Baglog Jamur',
    deskripsi: 'Kami membutuhkan pasokan rutin serbuk kayu gergaji non-cat dan non-minyak minimal 100 kg per minggu. Siap ambil sendiri dengan pick up di area Surabaya & Sidoarjo.',
    volume_dibutuhkan: 100,
    satuan: 'kg',
    frekuensi: 'rutin_mingguan',
    radius_km: 25,
    lat: -7.3100,
    lng: 112.7280,
    status: 'aktif',
    nama_usaha: 'Budidaya Jamur Sejahtera',
    jarak_km: 5.2,
    dibuat_pada: '2026-11-14T10:00:00Z'
  },
  {
    id: 'r1000000-0000-0000-0000-000000000002',
    user_id: 'u1000000-0000-0000-0000-000000000008',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    category_name: 'Ampas Tahu & Kedelai',
    judul: 'Dicari: Pasokan Ampas Tahu Segar Harian untuk Pakan Bebek',
    deskripsi: 'Dibutuhkan ampas tahu basah minimal 200 kg per 2 hari. Jemput rutin pagi hari wilayah Surabaya Selatan atau Sidoarjo.',
    volume_dibutuhkan: 200,
    satuan: 'kg',
    frekuensi: 'rutin_mingguan',
    radius_km: 20,
    lat: -7.3600,
    lng: 112.7000,
    status: 'aktif',
    nama_usaha: 'Peternakan Bebek Makmur',
    jarak_km: 10.8,
    dibuat_pada: '2026-11-15T09:00:00Z'
  },
  {
    id: 'r1000000-0000-0000-0000-000000000003',
    user_id: 'u1000000-0000-0000-0000-000000000005',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    category_name: 'Sabut & Tempurung Kelapa',
    judul: 'Mencari Batok Tempurung Kelapa Kering untuk Briket',
    deskripsi: 'Butuh batok kelapa kering untuk pabrik briket arang shisha ekspor. Siap tampung 50-100 karung per minggu.',
    volume_dibutuhkan: 50,
    satuan: 'karung',
    frekuensi: 'rutin_mingguan',
    radius_km: 40,
    lat: -7.3150,
    lng: 112.7680,
    status: 'aktif',
    nama_usaha: 'Briket Hijau Nusantara',
    jarak_km: 6.4,
    dibuat_pada: '2026-11-16T12:00:00Z'
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    listing_id: 'a1000000-0000-0000-0000-000000000001',
    listing_judul: 'Serbuk Gergaji Halus Kayu Jati & Mahoni Bersih',
    category_name: 'Kayu & Serbuk Gergaji',
    seeker_id: 'u1000000-0000-0000-0000-000000000004',
    seeker_nama: 'Budidaya Jamur Sejahtera',
    seeker_wa: '6281234567004',
    provider_id: 'u1000000-0000-0000-0000-000000000001',
    provider_nama: 'Mebel Kayu Berkah Cak Mul',
    provider_wa: '6281234567001',
    request_id: 'r1000000-0000-0000-0000-000000000001',
    status: 'selesai',
    volume_aktual: 250,
    satuan: 'kg',
    harga_aktual: 0,
    volume_aktual_kg: 250,
    penghematan_biaya_rp: 112500, // 250 kg * Rp 450
    konfirmasi_penghasil_pada: '2026-11-12T14:00:00Z',
    konfirmasi_pencari_pada: '2026-11-12T14:15:00Z',
    sesuai_deskripsi: true,
    dibuat_pada: '2026-11-10T10:00:00Z'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    listing_id: 'a1000000-0000-0000-0000-000000000004',
    listing_judul: 'Ampas Tahu Basah Segar Setiap Pagi',
    category_name: 'Ampas Tahu & Kedelai',
    seeker_id: 'u1000000-0000-0000-0000-000000000008',
    seeker_nama: 'Peternakan Bebek Makmur',
    seeker_wa: '6281234567008',
    provider_id: 'u1000000-0000-0000-0000-000000000007',
    provider_nama: 'Pabrik Tahu Sumber Barokah',
    provider_wa: '6281234567007',
    request_id: 'r1000000-0000-0000-0000-000000000002',
    status: 'selesai',
    volume_aktual: 500,
    satuan: 'kg',
    harga_aktual: 250000,
    volume_aktual_kg: 500,
    penghematan_biaya_rp: 225000, // 500 kg * Rp 450
    konfirmasi_penghasil_pada: '2026-11-15T10:00:00Z',
    konfirmasi_pencari_pada: '2026-11-15T11:00:00Z',
    sesuai_deskripsi: true,
    dibuat_pada: '2026-11-13T09:00:00Z'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000003',
    listing_id: 'a1000000-0000-0000-0000-000000000002',
    listing_judul: 'Ampas Kopi Espresso & Robusta Segar',
    category_name: 'Ampas Kopi & Kulit Kopi',
    seeker_id: 'u1000000-0000-0000-0000-000000000005',
    seeker_nama: 'Briket Hijau Nusantara',
    seeker_wa: '6281234567005',
    provider_id: 'u1000000-0000-0000-0000-000000000002',
    provider_nama: 'Warung Kopi Ruang Temu',
    provider_wa: '6281234567002',
    status: 'menghubungi',
    volume_aktual: null,
    satuan: 'kg',
    harga_aktual: null,
    volume_aktual_kg: null,
    penghematan_biaya_rp: null,
    konfirmasi_penghasil_pada: null,
    konfirmasi_pencari_pada: null,
    sesuai_deskripsi: null,
    dibuat_pada: '2026-11-16T14:00:00Z'
  }
];

export const INITIAL_VERIFICATIONS: Verification[] = [
  {
    id: 'v1000000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000001',
    user_nama: 'Mebel Kayu Berkah Cak Mul',
    jenis_lencana: 'lokasi',
    status: 'disetujui',
    jarak_pin_gps_m: 45.2,
    foto_bukti: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    diperiksa_pada: '2026-11-10T11:00:00Z',
    dibuat_pada: '2026-11-10T10:30:00Z'
  },
  {
    id: 'v1000000-0000-0000-0000-000000000002',
    user_id: 'u1000000-0000-0000-0000-000000000002',
    user_nama: 'Warung Kopi Ruang Temu',
    jenis_lencana: 'lokasi',
    status: 'disetujui',
    jarak_pin_gps_m: 82.5,
    foto_bukti: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    diperiksa_pada: '2026-11-11T12:00:00Z',
    dibuat_pada: '2026-11-11T11:30:00Z'
  },
  {
    id: 'v1000000-0000-0000-0000-000000000003',
    user_id: 'u1000000-0000-0000-0000-000000000003',
    user_nama: 'Konveksi Citra Mandiri',
    jenis_lencana: 'lokasi',
    status: 'diajukan',
    jarak_pin_gps_m: 420.0, // Melebihi toleransi 200m
    foto_bukti: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    diperiksa_pada: null,
    dibuat_pada: '2026-11-14T15:00:00Z'
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep00000-0000-0000-0000-000000000001',
    reporter_id: 'u1000000-0000-0000-0000-000000000004',
    pelapor_nama: 'Budidaya Jamur Sejahtera',
    jenis_target: 'listing',
    target_id: 'a1000000-0000-0000-0000-000000000003',
    listing_judul: 'Kain Perca Katun Combed Sisa Jahit Kaos',
    terlapor_user_id: 'u1000000-0000-0000-0000-000000000003',
    terlapor_nama: 'Konveksi Citra Mandiri',
    alasan: 'alamat tidak sesuai',
    catatan: 'Saat kami tiba di titik Waru Sidoarjo sesuai alamat tertera, lokasi ternyata tanah kosong bukan bengkel konveksi.',
    prioritas: 'tinggi',
    status: 'terbuka',
    dibuat_pada: '2026-11-16T15:00:00Z'
  },
  {
    id: 'rep00000-0000-0000-0000-000000000002',
    reporter_id: 'u1000000-0000-0000-0000-000000000002',
    pelapor_nama: 'Warung Kopi Ruang Temu',
    jenis_target: 'profile',
    target_id: 'u1000000-0000-0000-0000-000000000006',
    terlapor_user_id: 'u1000000-0000-0000-0000-000000000006',
    terlapor_nama: 'Gudang Fiktif Surabaya',
    alasan: 'kategori terlarang',
    catatan: 'Pengguna mengirim pesan via WhatsApp menawarkan cairan drum oli bekas yang dilarang PP No. 22/2021.',
    prioritas: 'tinggi',
    status: 'terbuka',
    dibuat_pada: '2026-11-16T16:30:00Z'
  }
];

export const INITIAL_ADMIN_ACTIONS: AdminAction[] = [
  {
    id: 'act00000-0000-0000-0000-000000000001',
    admin_id: 'u0000000-0000-0000-0000-000000000001',
    admin_nama: 'Administrator Moderasi Pusat',
    aksi: 'setujui_listing',
    jenis_target: 'listing',
    target_id: 'a1000000-0000-0000-0000-000000000001',
    alasan: 'Listing serbuk gergaji kayu non-B3 memenuhi syarat foto dan deskripsi jelas.',
    waktu: '2026-11-15T09:00:00Z'
  },
  {
    id: 'act00000-0000-0000-0000-000000000002',
    admin_id: 'u0000000-0000-0000-0000-000000000001',
    admin_nama: 'Administrator Moderasi Pusat',
    aksi: 'tangguhkan_akun',
    jenis_target: 'user',
    target_id: 'u1000000-0000-0000-0000-000000000006',
    alasan: 'Akun ditangguhkan 7 hari karena terbukti menawarkan limbah B3 oli bekas dan alamat fiktif.',
    waktu: '2026-11-16T12:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000001',
    jenis: 'ada_peminat',
    isi: 'Budidaya Jamur Sejahtera tertarik dan telah membuka kontak WhatsApp pada pasokan Serbuk Gergaji Anda.',
    dibaca: false,
    dibuat_pada: '2026-11-16T14:00:00Z'
  },
  {
    id: 'notif000-0000-0000-0000-000000000002',
    user_id: 'u1000000-0000-0000-0000-000000000004',
    jenis: 'konfirmasi_transaksi',
    isi: 'Harap konfirmasi penyelesaian transaksi serbuk gergaji kayu bersama Mebel Kayu Berkah Cak Mul.',
    dibaca: true,
    dibuat_pada: '2026-11-12T14:05:00Z'
  },
  {
    id: 'notif000-0000-0000-0000-000000000003',
    user_id: 'u1000000-0000-0000-0000-000000000003',
    jenis: 'sanksi_admin',
    isi: 'Peringatan: Listing Anda dilaporkan memiliki alamat yang tidak sesuai. Harap perbarui data lokasi presisi.',
    dibaca: false,
    dibuat_pada: '2026-11-16T15:30:00Z'
  }
];

export const INITIAL_IMPACT: ImpactMetrics = {
  total_kg_dialihkan: 750, // 250 kg + 500 kg
  estimasi_penghematan_biaya_buang: 337500, // 750 * Rp 450
  total_transaksi: 2,
  total_listing_aktif: 7,
  total_laporan_terbuka: 2,
  total_umkm_terlibat: 8
};

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  toleransi_gps_meter: 200,
  batas_listing_akun_baru: 3,
  masa_kedaluwarsa_hari: 14,
  radius_maksimal_km: 100,
  biaya_retribusi_per_kg: 450
};
