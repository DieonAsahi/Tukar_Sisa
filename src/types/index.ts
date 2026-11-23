// ============================================================================
// DEFINISI TIPE DATA BURSA LIMBAH ANTAR-UMKM (10 TABEL INTI PRD BARU)
// ============================================================================

export type PeranSistem = 'pengguna' | 'admin';
export type StatusAkun = 'aktif' | 'peringatan' | 'ditangguhkan' | 'diblokir';
export type JenisHarga = 'gratis' | 'uang' | 'barter';
export type StatusListing = 'aktif' | 'habis' | 'kedaluwarsa' | 'disembunyikan';
export type StatusDeal = 'berjalan' | 'menunggu_otomatis' | 'selesai' | 'dalam_aduan' | 'batal';
export type TargetLaporan = 'listing' | 'profile' | 'deal';
export type StatusLaporan = 'terbuka' | 'dalam_tinjauan' | 'selesai' | 'diabaikan';

// SRS FR-NOT-JENIS (Daftar tipe resmi notifikasi)
export type JenisNotifikasi =
  | 'listing_baru_supplier'
  | 'deal_baru'
  | 'konfirmasi_diminta'
  | 'selesai_otomatis_segera'
  | 'deal_selesai'
  | 'deal_batal'
  | 'aduan_deal'
  | 'keputusan_aduan'
  | 'laporan_diputuskan'
  | 'sanksi_admin'
  | 'listing_hampir_kedaluwarsa'
  | 'listing_kedaluwarsa'
  | 'stok_habis'
  | 'pengikut_baru';

// 1. PROFILES (Satu jenis akun untuk mencari & mengunggah)
export interface UserProfile {
  id: string; // Auth UUID
  email?: string;
  nama_tampilan: string;
  nama_toko_profesi?: string; // Tanda kepercayaan: nama toko / profesi
  no_wa: string; // Format 628xxxxxxxxxx
  foto?: string;
  peran_sistem: PeranSistem;
  status_akun: StatusAkun;
  alasan_sanksi?: string;
  jumlah_transaksi_selesai: number; // Tanda kepercayaan
  dibuat_pada: string; // Tanda kepercayaan: tanggal bergabung
  diperbarui_pada?: string;
}

// 2. USER_LOCATIONS (Maksimal 3 slot lokasi per akun)
// Koordinat asli dibuang; tidak ada lat/lng presisi di klien
export interface UserLocation {
  id: string;
  user_id: string;
  label: string; // Misal: 'Bengkel', 'Dapur Rumah', 'Gudang'
  slot_nomor: 1 | 2 | 3;
  dibuat_pada?: string;
  diperbarui_pada?: string;
}

// 3. WASTE_CATEGORIES
export interface WasteCategory {
  id: string;
  nama: string;
  kelompok: string;
  masa_tayang_jam: number; // PRD: Masa tayang dalam jam (sisa dapur 24 jam, kayu 336 jam)
  boleh_diposting: boolean;
  satuan_default: string;
  faktor_ke_kg?: number; // Nilai awal isian di form pengunggah
  ikon: string;
  slug: string;
  deskripsi?: string;
  dibuat_pada?: string;
}

// 4. LISTINGS (Postingan sisa)
// Klien SAMA SEKALI TIDAK menerima koordinat lat/lng
export interface WasteListing {
  id: string;
  user_id: string;
  category_id: string;
  category_nama?: string;
  category_ikon?: string;
  location_slot_id?: string;
  judul: string;
  deskripsi: string;
  foto_urls: string[]; // 1 - 3 foto (EXIF dihapus)
  stok: number; // Berkurang saat transaksi selesai
  satuan: string;
  berat_per_satuan_kg?: number; // Digunakan untuk menghitung dampak kg (jumlah x berat_per_satuan_kg)
  jenis_harga: JenisHarga; // 'gratis' | 'uang' | 'barter'
  nominal_harga: number; // Jika jenis_harga === 'uang'
  keterangan_barter?: string; // Jika jenis_harga === 'barter'
  metode_pengambilan: string; // Default: 'diambil_pencari'
  status: StatusListing; // 'aktif' | 'habis' | 'kedaluwarsa' | 'disembunyikan'
  dibuat_pada: string;
  diperbarui_pada?: string;
  masa_tayang_jam?: number;

  // Metadata pemilik & jarak (tanpa pernah membocorkan koordinat)
  nama_tampilan: string;
  nama_toko_profesi?: string;
  no_wa?: string;
  transaksi_selesai: number;
  jarak_km?: number; // Jarak bulat dalam kilometer (null jika < 2 km)
  jarak_teks?: string; // "kurang dari 2 km", "5 km", "sekitar saya"
  is_following?: boolean;
}

// 5. DEALS (Transaksi antar-pengguna)
export interface Deal {
  id: string;
  listing_id: string;
  listing_judul?: string;
  category_nama?: string;
  pencari_id: string;
  pencari_nama?: string;
  pencari_wa?: string;
  pemasok_id: string;
  pemasok_nama?: string;
  pemasok_wa?: string;
  jumlah_diminta: number;
  jumlah_akhir?: number;
  jumlah_akhir_pencari?: number;
  jumlah_akhir_pemasok?: number;
  satuan?: string;
  berat_per_satuan_kg?: number;
  status: StatusDeal; // 'berjalan' | 'menunggu_otomatis' | 'selesai' | 'dalam_aduan' | 'batal'
  konfirmasi_pencari_pada?: string;
  konfirmasi_pemasok_pada?: string;
  batas_otomatis_pada?: string; // 3 hari setelah 1 pihak konfirmasi
  aduan_teks?: string;
  aduan_oleh?: string;
  aduan_pada?: string;
  catatan_admin?: string;
  dibuat_pada: string;
  selesai_pada?: string;
}

// 6. FOLLOWS (Ikuti pemasok)
export interface Follow {
  id: string;
  follower_id: string;
  supplier_id: string;
  supplier_nama?: string;
  supplier_toko?: string;
  dibuat_pada: string;
}

// 7. NOTIFICATIONS (Notifikasi in-app realtime)
export interface AppNotification {
  id: string;
  user_id: string;
  tipe: JenisNotifikasi;
  jenis?: JenisNotifikasi; // Kompatibilitas alias
  judul: string;
  isi: string;
  link_target?: string;
  dibaca: boolean;
  dibuat_pada: string;
}

// 8. REPORTS (Laporan Pengaduan - wajib foto bukti)
export interface ReportItem {
  id: string;
  reporter_id: string;
  reporter_nama?: string;
  target_type: TargetLaporan;
  target_id: string;
  target_judul?: string;
  terlapor_id?: string;
  terlapor_nama?: string;
  alasan: string;
  catatan: string;
  foto_bukti: string; // Wajib foto
  status: StatusLaporan;
  tindakan_admin?: string;
  ditangani_oleh?: string;
  ditangani_pada?: string;
  dibuat_pada: string;
}

// 9. ADMIN_ACTIONS (Catatan Tindakan Admin - Immutable)
export interface AdminAction {
  id: string;
  admin_id: string;
  admin_nama?: string;
  aksi: string;
  target_type: string;
  target_id: string;
  alasan: string;
  waktu: string;
}

// 10. EDUCATION_ARTICLES (Artikel edukasi pemanfaatan bersumber resmi)
export interface EducationArticle {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string;
  konten: string;
  category_id?: string;
  category_nama?: string;
  sumber: string; // Wajib bersumber
  url_sumber: string; // URL resmi nyata
  perlu_verifikasi?: boolean;
  terverifikasi_manual?: boolean; // Default false (PRD: jangan nyatakan terverifikasi kecuali ada penanda manual)
  ikon: string;
  dibuat_pada: string;
}

// Metrik Dampak Lingkungan (Kg dialihkan dari transaksi selesai)
export interface ImpactMetrics {
  total_kg_dialihkan: number;
  total_transaksi_selesai: number;
  total_postingan_aktif: number;
  total_laporan_terbuka: number;
}
