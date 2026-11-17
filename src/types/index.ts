// ============================================================================
// DEFINISI TIPE DATA BURSA LIMBAH ANTAR-UMKM (10 TABEL INTI PRD TERBARU)
// ============================================================================

export type PeranUsaha = 'penghasil' | 'pencari' | 'keduanya';
export type PeranSistem = 'pengguna' | 'admin';
export type StatusAkun = 'aktif' | 'ditangguhkan' | 'diblokir';
export type SatuanLimbah = 'kg' | 'karung' | 'liter' | 'ikat';
export type TipeHarga = 'gratis' | 'berbayar';
export type MetodePengambilan = 'diambil_pencari' | 'diantar_penghasil' | 'didiskusikan';
export type StatusListing = 'aktif' | 'dipesan' | 'selesai' | 'disembunyikan';
export type StatusModerasi = 'menunggu_tinjauan' | 'disetujui' | 'ditolak';
export type StatusDeal = 'menghubungi' | 'selesai' | 'batal';
export type JenisLencana = 'email' | 'lokasi' | 'transaksi';
export type StatusVerifikasi = 'diajukan' | 'disetujui' | 'ditolak';
export type AlasanLaporan = 'alamat tidak sesuai' | 'barang tidak sesuai' | 'kategori terlarang' | 'perilaku mengganggu';
export type PrioritasLaporan = 'rendah' | 'sedang' | 'tinggi';
export type StatusLaporan = 'terbuka' | 'dalam_tinjauan' | 'selesai' | 'ditolak';
export type JenisNotifikasi = 'ada_peminat' | 'konfirmasi_transaksi' | 'hampir_kedaluwarsa' | 'listing_baru_cocok' | 'sanksi_admin';

// 1. PROFILES (PRD Hal. 14)
export interface UserProfile {
  id: string; // Sama dengan akun Supabase Auth
  email?: string;
  nama_usaha: string;
  no_wa: string;
  jenis_usaha: string;
  peran_usaha: PeranUsaha;
  peran_sistem: PeranSistem;
  status_akun: StatusAkun;
  alasan_sanksi?: string;
  foto_usaha?: string;
  // Lokasi dasar (untuk pencarian & profil)
  latitude: number;
  longitude: number;
  alamat_tampilan: string;
  alamat_presisi?: string;
  is_lokasi_terverifikasi: boolean;
  jumlah_transaksi_terkonfirmasi: number;
  dibuat_pada?: string;
  diperbarui_pada?: string;
}

// 2. WASTE_CATEGORIES (PRD Hal. 14)
export interface WasteCategory {
  id: string;
  nama: string;
  kelompok: string; // contoh: 'Organik Basah', 'Kayu & Biomassa', 'Tekstil & Serat', 'Kertas & Karton', 'B3 Berbahaya'
  boleh_diposting: boolean; // true: Non-B3 aman, false: B3 dilarang
  faktor_ke_kg: number; // Pengali konversi ke kg (misal karung = 20, liter = 1, ikat = 5, kg = 1)
  satuan_default: SatuanLimbah;
  saran_pemanfaatan: string[]; // Siapa yang bisa memakai & cara olah
  deskripsi?: string;
  ikon?: string;
  slug?: string;
  peringatan_bahaya?: string;
}

// 3. LISTINGS & VIEW LISTINGS_PUBLIC (PRD Hal. 14)
export interface WasteListing {
  id: string;
  owner_id: string; // FK ke profiles
  user_id?: string; // Alias kompatibilitas
  category_id: string;
  category_name?: string;
  category_icon?: string;
  judul: string;
  deskripsi: string;
  volume_per_minggu: number;
  satuan: SatuanLimbah;
  harga: number; // 0 = gratis, >0 = harga per satuan
  tipe_harga?: TipeHarga;
  harga_satuan?: number; // Alias
  metode_pengambilan: MetodePengambilan;
  foto: string; // URL foto limbah
  foto_url?: string; // Alias
  area_point?: { lat: number; lng: number }; // Titik koordinat dikaburkan
  approx_latitude: number;
  approx_longitude: number;
  approx_radius_meters: number;
  lokasi_terverifikasi: boolean;
  is_lokasi_terverifikasi?: boolean; // Alias
  status: StatusListing;
  status_moderasi?: StatusModerasi;
  kedaluwarsa_pada: string;
  dibuat_pada: string;
  diperbarui_pada?: string;
  jarak_km?: number;

  // Metadata pemilik yang digabung pada view listings_public
  nama_usaha: string;
  jenis_usaha: string;
  alamat_tampilan: string;
  is_email_verified: boolean;
  has_confirmed_transactions: boolean;

  // Terbuka hanya jika sudah klik Hubungi (tercatat di deals)
  is_contact_locked: boolean;
  no_wa?: string;
  exact_latitude?: number;
  exact_longitude?: number;
  alamat_presisi?: string;
}

// 4. LISTING_LOCATIONS (Tabel Terpisah 1-ke-1, PRD Hal. 14 & 18)
export interface ListingLocation {
  listing_id: string; // PK, FK ke listings
  lat_presisi: number;
  lng_presisi: number;
  alamat_presisi?: string;
  dibuat_pada: string;
}

// 5. MATERIAL_REQUESTS (PRD Hal. 14)
export interface MaterialRequest {
  id: string;
  user_id: string; // FK ke profiles
  category_id: string;
  category_name?: string;
  judul: string;
  deskripsi: string;
  volume_dibutuhkan: number;
  satuan: SatuanLimbah;
  frekuensi: string; // 'rutin_mingguan', 'rutin_bulanan', 'insidental'
  radius_km: number; // 1-100 km
  lat: number;
  lng: number;
  status: 'aktif' | 'terpenuhi' | 'batal';
  nama_usaha?: string;
  jarak_km?: number;
  dibuat_pada: string;
}

// 6. DEALS (Gabungan Kontak & Transaksi, PRD Hal. 14)
export interface Deal {
  id: string;
  listing_id: string; // FK ke listings
  listing_judul?: string;
  category_name?: string;
  seeker_id: string; // FK ke profiles
  seeker_nama?: string;
  seeker_wa?: string;
  provider_id?: string;
  provider_nama?: string;
  provider_wa?: string;
  request_id?: string | null; // FK opsional ke material_requests
  status: StatusDeal; // 'menghubungi', 'selesai', 'batal'
  volume_aktual?: number | null;
  satuan?: SatuanLimbah;
  harga_aktual?: number | null;
  volume_aktual_kg?: number | null; // Setelah dikali faktor_ke_kg
  penghematan_biaya_rp?: number | null;
  konfirmasi_penghasil_pada?: string | null;
  konfirmasi_pencari_pada?: string | null;
  sesuai_deskripsi?: boolean | null; // Penilaian singkat U18 (Ya/Tidak)
  dibuat_pada: string;
}

// 7. VERIFICATIONS (PRD Hal. 14)
export interface Verification {
  id: string;
  user_id: string; // FK ke profiles
  user_nama?: string;
  jenis_lencana: JenisLencana;
  status: StatusVerifikasi;
  jarak_pin_gps_m?: number | null;
  foto_bukti?: string | null;
  diperiksa_pada?: string | null;
  dibuat_pada: string;
}

// 8. REPORTS (PRD Hal. 14)
export interface ReportItem {
  id: string;
  reporter_id: string; // FK ke profiles
  pelapor_nama: string;
  jenis_target: 'listing' | 'profile';
  target_id: string;
  listing_judul?: string;
  terlapor_user_id?: string;
  terlapor_nama?: string;
  alasan: AlasanLaporan;
  catatan: string;
  prioritas: PrioritasLaporan;
  status: StatusLaporan;
  ditangani_oleh?: string | null;
  tindakan_diambil?: string | null;
  ditangani_pada?: string | null;
  dibuat_pada: string;
}

// 9. ADMIN_ACTIONS (Catatan Audit Immutable, PRD Hal. 15)
export interface AdminAction {
  id: string;
  admin_id: string; // FK ke profiles
  admin_nama: string;
  aksi: string;
  jenis_target: 'listing' | 'user' | 'report' | 'category' | 'deal' | 'settings';
  target_id: string;
  alasan: string;
  waktu: string;
}

// 10. NOTIFICATIONS (PRD Hal. 15, U20)
export interface AppNotification {
  id: string;
  user_id: string; // FK ke profiles
  jenis: JenisNotifikasi;
  isi: string;
  dibaca: boolean;
  link_aksi?: string;
  dibuat_pada: string;
}

// Rekomendasi Matching Otomatis Pintar (Dihitung On-The-Fly RPC S1, U13)
export interface MatchRecommendation {
  id: string;
  listing_id: string;
  request_id: string;
  listing_judul: string;
  request_judul: string;
  category_name: string;
  skor_kecocokan: number; // 0 - 100%
  jarak_km: number;
  penghasil_nama: string;
  pencari_nama: string;
  volume_summary: string;
}

// Dashboard Dampak Publik & Pribadi (PRD Hal. 14, S6)
export interface ImpactMetrics {
  total_kg_dialihkan: number;
  estimasi_penghematan_biaya_buang: number;
  total_transaksi: number;
  total_listing_aktif: number;
  total_laporan_terbuka: number;
  total_umkm_terlibat: number;
}

// Pengaturan Sistem Admin (A12)
export interface SystemSettings {
  toleransi_gps_meter: number; // Default 200m
  batas_listing_akun_baru: number; // Default 3
  masa_kedaluwarsa_hari: number; // Default 14 hari
  radius_maksimal_km: number; // Default 100 km
  biaya_retribusi_per_kg: number; // Rp 450 per kg
}
