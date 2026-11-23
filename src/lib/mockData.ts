import {
  UserProfile,
  UserLocation,
  WasteCategory,
  WasteListing,
  Deal,
  Follow,
  AppNotification,
  ReportItem,
  AdminAction,
  EducationArticle,
  ImpactMetrics
} from '../types';

// ============================================================================
// 1. DATA PENGGUNA (PROFILES)
// Tanda kepercayaan: nama toko/profesi, tanggal bergabung, transaksi selesai
// ============================================================================
export const MOCK_ADMIN_USER: UserProfile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  email: 'admin@bursa.id',
  nama_tampilan: 'Admin Pengawas',
  nama_toko_profesi: 'Pusat Moderasi Bursa Limbah',
  no_wa: '6281100000001',
  foto: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
  peran_sistem: 'admin',
  status_akun: 'aktif',
  jumlah_transaksi_selesai: 45,
  dibuat_pada: '2026-08-15T08:00:00Z'
};

export const MOCK_REGULAR_USER: UserProfile = {
  id: 'b1000000-0000-0000-0000-000000000001',
  email: 'mebel.cakmul@umkm.id',
  nama_tampilan: 'Cak Mulyono',
  nama_toko_profesi: 'Bengkel Kayu Berkah',
  no_wa: '6281234567001',
  foto: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
  peran_sistem: 'pengguna',
  status_akun: 'aktif',
  jumlah_transaksi_selesai: 8,
  dibuat_pada: '2026-09-01T10:00:00Z'
};

export const MOCK_SEEKER_USER: UserProfile = {
  id: 'b1000000-0000-0000-0000-000000000004',
  email: 'jamur.organik@umkm.id',
  nama_tampilan: 'Pak Budianto',
  nama_toko_profesi: 'Petani Jamur Tiram Sejahtera',
  no_wa: '6281234567004',
  foto: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=400&q=80',
  peran_sistem: 'pengguna',
  status_akun: 'aktif',
  jumlah_transaksi_selesai: 6,
  dibuat_pada: '2026-09-12T07:30:00Z'
};

export const MOCK_SUSPENDED_USER: UserProfile = {
  id: 'b1000000-0000-0000-0000-000000000006',
  email: 'pelanggar@umkm.id',
  nama_tampilan: 'Gudang Rusak',
  nama_toko_profesi: 'Pengepul Liar',
  no_wa: '6281999999999',
  peran_sistem: 'pengguna',
  status_akun: 'ditangguhkan',
  alasan_sanksi: 'Memposting limbah B3 aki bekas yang dilarang dan tidak merespons aduan pembeli.',
  jumlah_transaksi_selesai: 0,
  dibuat_pada: '2026-10-01T12:00:00Z'
};

export const INITIAL_PROFILES: UserProfile[] = [
  MOCK_ADMIN_USER,
  MOCK_REGULAR_USER,
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    email: 'kopi.senja@umkm.id',
    nama_tampilan: 'Siti Rahma',
    nama_toko_profesi: 'Kopi Senja Ruang Temu',
    no_wa: '6281234567002',
    foto: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
    peran_sistem: 'pengguna',
    status_akun: 'aktif',
    jumlah_transaksi_selesai: 12,
    dibuat_pada: '2026-09-20T09:15:00Z'
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    email: 'konveksi.citra@umkm.id',
    nama_tampilan: 'Ibu Citra',
    nama_toko_profesi: 'Konveksi Citra Mandiri',
    no_wa: '6281234567003',
    foto: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
    peran_sistem: 'pengguna',
    status_akun: 'aktif',
    jumlah_transaksi_selesai: 3,
    dibuat_pada: '2026-10-05T14:20:00Z'
  },
  MOCK_SEEKER_USER,
  {
    id: 'b1000000-0000-0000-0000-000000000005',
    email: 'ternak.maggot@umkm.id',
    nama_tampilan: 'Rian Kurniawan',
    nama_toko_profesi: 'Ternak Maggot BSF',
    no_wa: '6281234567005',
    foto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80',
    peran_sistem: 'pengguna',
    status_akun: 'aktif',
    jumlah_transaksi_selesai: 15,
    dibuat_pada: '2026-08-25T11:00:00Z'
  },
  MOCK_SUSPENDED_USER
];

// ============================================================================
// 2. SLOT LOKASI PENGGUNA (USER_LOCATIONS)
// Maksimal 3 slot; Koordinat lat/lng presisi TIDAK PERNAH dikirim ke browser
// ============================================================================
export const INITIAL_LOCATIONS: UserLocation[] = [
  {
    id: 'l1000000-0000-0000-0000-000000000001',
    user_id: 'b1000000-0000-0000-0000-000000000001',
    label: 'Bengkel Mebel Tegalsari',
    slot_nomor: 1
  },
  {
    id: 'l1000000-0000-0000-0000-000000000002',
    user_id: 'b1000000-0000-0000-0000-000000000002',
    label: 'Kedai Kopi Mulyorejo',
    slot_nomor: 1
  },
  {
    id: 'l1000000-0000-0000-0000-000000000003',
    user_id: 'b1000000-0000-0000-0000-000000000003',
    label: 'Workshop Garmen Waru',
    slot_nomor: 1
  },
  {
    id: 'l1000000-0000-0000-0000-000000000004',
    user_id: 'b1000000-0000-0000-0000-000000000004',
    label: 'Kumbung Jamur Gayungan',
    slot_nomor: 1
  },
  {
    id: 'l1000000-0000-0000-0000-000000000005',
    user_id: 'b1000000-0000-0000-0000-000000000005',
    label: 'Biopond BSF Rungkut',
    slot_nomor: 1
  }
];

// ============================================================================
// 3. KATEGORI SISA (WASTE_CATEGORIES)
// Masa tayang dalam JAM (sisa dapur 24 jam, kayu 336 jam)
// ============================================================================
export const INITIAL_CATEGORIES: WasteCategory[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    nama: 'Sisa Dapur & Sayuran',
    kelompok: 'Organik Basah',
    masa_tayang_jam: 24, // 24 jam (cepat rusak)
    boleh_diposting: true,
    satuan_default: 'kg',
    faktor_ke_kg: 1.0,
    slug: 'sisa-dapur-sayuran',
    ikon: 'Apple',
    deskripsi: 'Sisa kulit buah, sayuran afkir pasar, sisa racikan dapur bersih untuk pakan maggot BSF & ternak.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    nama: 'Ampas Tahu & Kedelai',
    kelompok: 'Organik Olahan',
    masa_tayang_jam: 48,
    boleh_diposting: true,
    satuan_default: 'kg',
    faktor_ke_kg: 1.0,
    slug: 'ampas-tahu-kedelai',
    ikon: 'Egg',
    deskripsi: 'Ampas perasan tahu basah kaya protein untuk pakan ternak sapi, bebek, dan fermentasi.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    nama: 'Ampas Kopi & Kulit Kopi',
    kelompok: 'Organik Olahan',
    masa_tayang_jam: 72,
    boleh_diposting: true,
    satuan_default: 'kg',
    faktor_ke_kg: 1.0,
    slug: 'ampas-kopi',
    ikon: 'Coffee',
    deskripsi: 'Ampas seduhan espresso harian warkop & kafe untuk pupuk kompos kaya nitrogen & lilin aromaterapi.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    nama: 'Serbuk Kayu & Potongan',
    kelompok: 'Kayu & Biomassa',
    masa_tayang_jam: 336, // 14 hari
    boleh_diposting: true,
    satuan_default: 'karung',
    faktor_ke_kg: 15.0,
    slug: 'serbuk-kayu-potongan',
    ikon: 'Trees',
    deskripsi: 'Serbuk gergaji mesin serut mebel dan potongan kayu bersih untuk media baglog jamur & briket biomassa.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    nama: 'Kain Perca & Sisa Tekstil',
    kelompok: 'Tekstil & Serat',
    masa_tayang_jam: 336, // 14 hari
    boleh_diposting: true,
    satuan_default: 'karung',
    faktor_ke_kg: 20.0,
    slug: 'kain-perca-tekstil',
    ikon: 'Scissors',
    deskripsi: 'Potongan kain katun/rayon sisa konveksi untuk pengrajin keset tenun, dompet perca, dan isian boneka.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    nama: 'Kardus & Kertas Bekas',
    kelompok: 'Kertas & Karton',
    masa_tayang_jam: 168, // 7 hari
    boleh_diposting: true,
    satuan_default: 'ikat',
    faktor_ke_kg: 10.0,
    slug: 'kardus-kertas-bekas',
    ikon: 'Box',
    deskripsi: 'Kardus box bersih dan potongan kertas layak pakai untuk kemasan paket olshop.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    nama: 'Barang Terlarang (B3 & Makanan Matang)',
    kelompok: 'Dilarang Keras',
    masa_tayang_jam: 24,
    boleh_diposting: false, // Dilarang di platform!
    satuan_default: 'unit',
    slug: 'barang-terlarang',
    ikon: 'AlertTriangle',
    deskripsi: 'DILARANG: Limbah B3, aki/baterai, obat-obatan, elektronik rusak, daging mentah, dan makanan matang konsumsi manusia.'
  }
];

// ============================================================================
// 4. POSTINGAN SISA (LISTINGS)
// Jarak terformat "kurang dari 2 km", koordinat TIDAK PERNAH dikirim ke browser
// Status: 'aktif' | 'habis' | 'kedaluwarsa' | 'disembunyikan'
// ============================================================================
export const INITIAL_LISTINGS: WasteListing[] = [
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    user_id: 'b1000000-0000-0000-0000-000000000001',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    category_nama: 'Serbuk Kayu & Potongan',
    category_ikon: 'Trees',
    location_slot_id: 'l1000000-0000-0000-0000-000000000001',
    judul: 'Serbuk Gergaji Kayu Jati Halus Bersih',
    deskripsi: 'Sisa pasah serut kayu jati murni tanpa paku atau kawat. Sangat bagus untuk media baglog jamur tiram atau alas kandang ayam.',
    foto_urls: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80'
    ],
    stok: 15,
    satuan: 'karung',
    berat_per_satuan_kg: 15.0,
    jenis_harga: 'gratis',
    nominal_harga: 0,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    dibuat_pada: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    masa_tayang_jam: 336,
    nama_tampilan: 'Cak Mulyono',
    nama_toko_profesi: 'Bengkel Kayu Berkah',
    no_wa: '6281234567001',
    transaksi_selesai: 8,
    jarak_km: undefined,
    jarak_teks: 'kurang dari 2 km',
    is_following: true
  },
  {
    id: 'e1000000-0000-0000-0000-000000000002',
    user_id: 'b1000000-0000-0000-0000-000000000002',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    category_nama: 'Ampas Kopi & Kulit Kopi',
    category_ikon: 'Coffee',
    location_slot_id: 'l1000000-0000-0000-0000-000000000002',
    judul: 'Ampas Kopi Espresso Kering Emberan',
    deskripsi: 'Ampas kopi seduhan harian warung kopi, dikumpulkan higienis dalam ember bersih tertutup. Bebas puntung rokok.',
    foto_urls: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80'
    ],
    stok: 25,
    satuan: 'kg',
    berat_per_satuan_kg: 1.0,
    jenis_harga: 'gratis',
    nominal_harga: 0,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    dibuat_pada: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    masa_tayang_jam: 72,
    nama_tampilan: 'Siti Rahma',
    nama_toko_profesi: 'Kopi Senja Ruang Temu',
    no_wa: '6281234567002',
    transaksi_selesai: 12,
    jarak_km: 5,
    jarak_teks: '5 km',
    is_following: false
  },
  {
    id: 'e1000000-0000-0000-0000-000000000003',
    user_id: 'b1000000-0000-0000-0000-000000000003',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    category_nama: 'Kain Perca & Sisa Tekstil',
    category_ikon: 'Scissors',
    location_slot_id: 'l1000000-0000-0000-0000-000000000003',
    judul: 'Kain Perca Katun Motif Campur',
    deskripsi: 'Sisa potongan kain garmen bersih, mayoritas bahan katun rayon adem. Cocok untuk kerajinan keset atau sarung bantal.',
    foto_urls: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
    ],
    stok: 8,
    satuan: 'karung',
    berat_per_satuan_kg: 20.0,
    jenis_harga: 'barter',
    nominal_harga: 0,
    keterangan_barter: 'Barter dengan kardus box packing atau benang jahit putih.',
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    dibuat_pada: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    masa_tayang_jam: 336,
    nama_tampilan: 'Ibu Citra',
    nama_toko_profesi: 'Konveksi Citra Mandiri',
    no_wa: '6281234567003',
    transaksi_selesai: 3,
    jarak_km: 8,
    jarak_teks: '8 km',
    is_following: false
  },
  {
    id: 'e1000000-0000-0000-0000-000000000004',
    user_id: 'b1000000-0000-0000-0000-000000000005',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_nama: 'Sisa Dapur & Sayuran',
    category_ikon: 'Apple',
    location_slot_id: 'l1000000-0000-0000-0000-000000000005',
    judul: 'Sisa Sayuran Afkir Pasar & Kulit Buah',
    deskripsi: 'Kulit pepaya, melon, dan sayuran sawi sortiran pasar pagi. Masih segar dan basah, siap masuk bio-pond pakan maggot.',
    foto_urls: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
    ],
    stok: 50,
    satuan: 'kg',
    berat_per_satuan_kg: 1.0,
    jenis_harga: 'uang',
    nominal_harga: 500,
    metode_pengambilan: 'diambil_pencari',
    status: 'aktif',
    dibuat_pada: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    masa_tayang_jam: 24,
    nama_tampilan: 'Rian Kurniawan',
    nama_toko_profesi: 'Ternak Maggot BSF',
    no_wa: '6281234567005',
    transaksi_selesai: 15,
    jarak_km: 6,
    jarak_teks: '6 km',
    is_following: false
  }
];

// ============================================================================
// 5. TRANSAKSI (DEALS)
// ============================================================================
export const INITIAL_DEALS: Deal[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    listing_id: 'e1000000-0000-0000-0000-000000000001',
    listing_judul: 'Serbuk Gergaji Kayu Jati Halus Bersih',
    category_nama: 'Serbuk Kayu & Potongan',
    pencari_id: 'b1000000-0000-0000-0000-000000000004',
    pencari_nama: 'Pak Budianto (Petani Jamur)',
    pencari_wa: '6281234567004',
    pemasok_id: 'b1000000-0000-0000-0000-000000000001',
    pemasok_nama: 'Cak Mulyono (Bengkel Kayu)',
    pemasok_wa: '6281234567001',
    jumlah_diminta: 5,
    jumlah_akhir: 5,
    satuan: 'karung',
    berat_per_satuan_kg: 15.0,
    status: 'selesai',
    konfirmasi_pencari_pada: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    konfirmasi_pemasok_pada: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    dibuat_pada: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    selesai_pada: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    listing_id: 'e1000000-0000-0000-0000-000000000002',
    listing_judul: 'Ampas Kopi Espresso Kering Emberan',
    category_nama: 'Ampas Kopi & Kulit Kopi',
    pencari_id: 'b1000000-0000-0000-0000-000000000001',
    pencari_nama: 'Cak Mulyono',
    pencari_wa: '6281234567001',
    pemasok_id: 'b1000000-0000-0000-0000-000000000002',
    pemasok_nama: 'Siti Rahma (Kopi Senja)',
    pemasok_wa: '6281234567002',
    jumlah_diminta: 10,
    satuan: 'kg',
    berat_per_satuan_kg: 1.0,
    status: 'berjalan',
    dibuat_pada: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

// ============================================================================
// 6. IKUTI PEMASOK (FOLLOWS)
// ============================================================================
export const INITIAL_FOLLOWS: Follow[] = [
  {
    id: 'f1000000-0000-0000-0000-000000000001',
    follower_id: 'b1000000-0000-0000-0000-000000000001',
    supplier_id: 'b1000000-0000-0000-0000-000000000002',
    supplier_nama: 'Siti Rahma',
    supplier_toko: 'Kopi Senja Ruang Temu',
    dibuat_pada: '2026-10-10T10:00:00Z'
  }
];

// ============================================================================
// 7. NOTIFIKASI DALAM APLIKASI (NOTIFICATIONS - FR-NOT-JENIS)
// ============================================================================
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1000000-0000-0000-0000-000000000001',
    user_id: 'b1000000-0000-0000-0000-000000000001',
    tipe: 'deal_baru',
    jenis: 'deal_baru',
    judul: 'Kontak Penawaran Baru',
    isi: 'Seorang pencari telah menghubungi Anda via WhatsApp untuk postingan serbuk kayu.',
    link_target: '/aktivitas',
    dibaca: true,
    dibuat_pada: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'n1000000-0000-0000-0000-000000000002',
    user_id: 'b1000000-0000-0000-0000-000000000001',
    tipe: 'listing_baru_supplier',
    jenis: 'listing_baru_supplier',
    judul: 'Postingan Baru dari Pemasok',
    isi: 'Postingan sisa baru telah diunggah oleh Kopi Senja Ruang Temu.',
    link_target: '/cari',
    dibaca: false,
    dibuat_pada: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  }
];

// ============================================================================
// 8. LAPORAN PENGADUAN (REPORTS)
// Wajib foto bukti; diurutkan berdasarkan jumlah laporan terbanyak di admin
// ============================================================================
export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'r1000000-0000-0000-0000-000000000001',
    reporter_id: 'b1000000-0000-0000-0000-000000000004',
    reporter_nama: 'Pak Budianto',
    target_type: 'listing',
    target_id: 'e1000000-0000-0000-0000-000000000003',
    target_judul: 'Kain Perca Katun Motif Campur',
    terlapor_id: 'b1000000-0000-0000-0000-000000000003',
    terlapor_nama: 'Ibu Citra (Konveksi Citra Mandiri)',
    alasan: 'Barang bercampur sampah plastik kotor',
    catatan: 'Kain perca di karung kedua basah dan bercampur sampah bungkus makanan yang bau.',
    foto_bukti: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=400&q=80',
    status: 'terbuka',
    dibuat_pada: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
  }
];

// ============================================================================
// 9. LOG TINDAKAN ADMIN (ADMIN_ACTIONS)
// Bersifat immutable (hanya append-only)
// ============================================================================
export const INITIAL_ADMIN_ACTIONS: AdminAction[] = [
  {
    id: 'act-0000000-0000-0000-0000-000000000001',
    admin_id: 'a0000000-0000-0000-0000-000000000001',
    admin_nama: 'Admin Pengawas',
    aksi: 'tangguhkan_akun',
    target_type: 'profile',
    target_id: 'b1000000-0000-0000-0000-000000000006',
    alasan: 'Terbukti mengunggah limbah B3 aki bekas yang melanggar syarat penggunaan.',
    waktu: '2026-10-20T14:30:00Z'
  }
];

// ============================================================================
// 10. ARTIKEL EDUKASI (EDUCATION_ARTICLES)
// Dapat dibaca tamu; wajib mencantumkan sumber resmi dan url_sumber nyata
// ============================================================================
export const INITIAL_ARTICLES: EducationArticle[] = [
  {
    id: 'ed100000-0000-0000-0000-000000000001',
    judul: 'Biokonversi Sisa Dapur Menjadi Pakan Ternak Maggot BSF',
    slug: 'biokonversi-maggot-bsf',
    ringkasan: '10.000 larva Black Soldier Fly mampu mereduksi hingga 2 kg sampah organik basah per hari dan bernilai gizi protein 40%.',
    konten: 'Lalat tentara hitam (Hermetia illucens) bukan vektor penyakit dan tidak memiliki mulut saat dewasa. Larvanya sangat rakus memakan sisa sayur, buah, dan ampas dapur. Residu biokonversi berupa kasgot (bekas maggot) menjadi pupuk organik bermutu tinggi tanpa aroma busuk menyengat.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_nama: 'Sisa Dapur & Sayuran',
    sumber: 'Sistem Informasi Pengelolaan Sampah Nasional (SIPSN) KLHK RI',
    url_sumber: 'https://sipsn.menlhk.go.id/',
    perlu_verifikasi: false,
    ikon: 'Apple',
    dibuat_pada: '2026-10-01T08:00:00Z'
  },
  {
    id: 'ed100000-0000-0000-0000-000000000002',
    judul: 'Formulasi Serbuk Kayu untuk Baglog Jamur Tiram Berdaya Hasil Tinggi',
    slug: 'baglog-serbuk-kayu-jamur',
    ringkasan: 'Kandungan lignin dan selulosa pada serbuk kayu sengon dan jati menjadi nutrisi ideal bagi pertumbuhan miselium jamur.',
    konten: 'Serbuk gergaji kayu sengon atau jati yang telah diayak bersih dicampur dedak bekatul 15% dan kalsium karbonat 1.5%. Kadar air dijaga pada kisaran 60-65% sebelum disterilisasi uap selama 8 jam. Pastikan serbuk gergaji bebas dari serbuk cat sintetis atau sisa pelitur kimia.',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    category_nama: 'Serbuk Kayu & Potongan',
    sumber: 'Pusat Riset Mikrobiologi Terapan - Badan Riset dan Inovasi Nasional (BRIN)',
    url_sumber: 'https://www.brin.go.id/',
    perlu_verifikasi: false,
    ikon: 'Trees',
    dibuat_pada: '2026-10-05T09:00:00Z'
  },
  {
    id: 'ed100000-0000-0000-0000-000000000003',
    judul: 'Ampas Kopi: Dari Kompos Kaya Nitrogen Hingga Briket Rendah Asap',
    slug: 'ampas-kopi-kompos-briket',
    ringkasan: 'Ampas kopi memiliki nilai kalor 5.000 kkal/kg dan rasio C/N seimbang (20:1) yang sangat baik untuk perbaikan struktur tanah.',
    konten: 'Pengeringan ampas kopi dan pemadatan menggunakan perekat tapioka menghasilkan briket arang aromaterapi dengan nyala bara stabil. Dalam pembuatan kompos, ampas kopi bertindak sebagai materi hijau yang mempercepat penguraian daun kering cokelat.',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    category_nama: 'Ampas Kopi & Kulit Kopi',
    sumber: 'Jurnal Pengelolaan Sumberdaya Alam dan Lingkungan - IPB University',
    url_sumber: 'https://journal.ipb.ac.id/index.php/jpsl',
    perlu_verifikasi: false,
    ikon: 'Coffee',
    dibuat_pada: '2026-10-10T10:00:00Z'
  }
];

// ============================================================================
// 11. METRIK DAMPAK LINGKUNGAN (SDG 12)
// Dihitung dari transaksi berstatus 'selesai': jumlah x berat per satuan
// ============================================================================
export const INITIAL_IMPACT: ImpactMetrics = {
  total_kg_dialihkan: 75.0, // 5 karung x 15 kg dari deal selesai Cak Mulyono
  total_transaksi_selesai: 1,
  total_postingan_aktif: 4,
  total_laporan_terbuka: 1
};
