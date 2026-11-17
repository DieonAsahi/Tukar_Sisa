# Bursa Limbah Antar-UMKM (SDG 8 & SDG 12)

Web app mobile-first untuk pertukaran sisa produksi/limbah non-B3 antar-UMKM lokal dengan pembagian akses:
- **Rute `/` (dan sub-rute publik)**: Digunakan bersama oleh **Pengunjung Tamu (Guest)** dan **Pengguna Terdaftar** (dengan fitur terkunci sebelum verifikasi OTP Email).
- **Rute `/admin`**: Khusus akun dengan **`peran_sistem = 'admin'`** yang dilindungi middleware route guard dan RLS Supabase (pengguna biasa tidak bisa mengangkat dirinya sendiri menjadi admin).

---

## 1. Arsitektur, Keamanan & Privasi (UU PDP)
- **Frontend**: Vue 3 + TypeScript + Tailwind CSS (Mobile-First UI/UX: font besar, tombol jelas, bahasa sehari-hari tanpa jargon teknis, navigasi bottom bar).
- **Backend & Database**: Supabase (PostgreSQL + PostGIS geospasial dengan indeks GiST untuk pencarian radius 100 km < 2 detik, Auth OTP Email, Row Level Security, dan Storage).
- **Perlindungan Privasi**:
  - Koordinat presisi, nomor WhatsApp, dan alamat jalan disamarkan untuk pengunjung tamu. Peta publik menampilkan **lingkaran area perkiraan (~800m)**.
  - Akun yang disanksi (`ditangguhkan` atau `diblokir`) otomatis menerima banner alasan resmi tertulis dari Administrator.
  - Tabel `admin_actions` bersifat **IMMUTABLE** (hanya mendukung `INSERT` dan `SELECT` untuk admin, tidak bisa di-`UPDATE` atau di-`DELETE`).

---

## 2. Struktur Proyek & File

```
Tukar Sisa/
├── supabase/
│   ├── migrations/
│   │   └── 20261117_init_bursa_limbah.sql    # Skema 9 Tabel Inti, PostGIS, RLS, Triggers, & RPC
│   └── seed.sql                             # Benih data realistis untuk pengujian 30 detik
├── src/
│   ├── assets/
│   │   └── main.css                         # Tailwind CSS styling & mobile touch reset
│   ├── composables/
│   │   ├── useAppRouter.ts                  # Routing client-side (/ vs /admin) & Route Guard
│   │   └── useWasteApp.ts                    # State reaktif utama, moderasi admin, & validasi radius
│   ├── components/
│   │   ├── AppHeader.vue                    # Header mobile, pengalih rute /admin, & demo role switcher
│   │   ├── AppBottomNav.vue                 # 4 Tab utama + tombol aksi bulat posting di tengah
│   │   ├── SanctionBanner.vue               # Banner resmi alasan sanksi jika akun ditangguhkan/diblokir
│   │   ├── RadiusSelector.vue               # Slider radius 1-100 km + validasi & peringatan armada >50 km
│   │   ├── InteractiveMap.vue               # Peta canvas: Lingkaran samar tamu vs Pin presisi
│   │   ├── ListingCard.vue                  # Kartu pasokan: foto, volume, badge lencana, tombol WA gated
│   │   ├── ListingDetailModal.vue           # Rincian, Anjuran Keselamatan (4 poin), unlock kontak WA
│   │   ├── QuickPostModal.vue               # Form 1 layar (< 1 mnt) + filter B3 terlarang + kamera
│   │   ├── LocationVerifyModal.vue          # Validasi toleransi <= 200m & foto kamera tempat usaha
│   │   ├── TransactionConfirmModal.vue      # Konfirmasi 2 arah + input kg riil ke Dashboard Dampak
│   │   ├── AuthOtpModal.vue                 # Modal Login OTP Email (tanpa password)
│   │   ├── ReportModal.vue                  # Modal Laporkan dengan 4 pilihan alasan wajib
│   │   ├── WasteDictionaryView.vue          # Kamus "Limbah -> Peluang" (Non-B3 vs B3 Dilarang, F15)
│   │   ├── ImpactDashboardView.vue          # Dashboard Dampak Publik (kg dialihkan & rupiah dihemat)
│   │   ├── MatchingRecommendationsView.vue  # Rekomendasi kecocokan limbah otomatis (F7 & F8)
│   │   └── admin/
│   │       └── AdminDashboard.vue           # Panel Kontrol /admin (Moderasi, Laporan, Sanksi, Audit Log)
│   ├── types/
│   │   └── index.ts                         # Kontrak tipe TypeScript 9 entitas
│   ├── lib/
│   │   ├── supabase.ts                      # Client Supabase
│   │   └── mockData.ts                      # Dataset awal interaktif siap demo
│   ├── App.vue                              # Layout utama aplikasi & manajemen modal
│   └── main.ts
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 3. Matriks Hak Akses Rute `/` vs `/admin`

| Fitur / Halaman | Pengunjung Tamu (`/`) | Pengguna Terdaftar (`/`) | Administrator (`/admin`) |
|---|---|---|---|
| Jelajah Katalog & Kebutuhan | ✅ Ya (radius 1–100 km) | ✅ Ya | ✅ Ya |
| Tampilan Peta Sumber Limbah | **Lingkaran Perkiraan (~800m)** | **Pin Presisi & Rute** | **Pin Presisi & Rute** |
| Kontak WhatsApp Pemilik | 🔒 Terkunci (Modal OTP) | ✅ Terbuka (`wa.me` otomatis) | ✅ Terbuka |
| Form Posting 1 Layar (< 1 mnt) | 🔒 Terkunci (Modal OTP) | ✅ Ya (Maks 3 listing akun baru) | ✅ Ya |
| Konfirmasi Selesai Dua Pihak | 🔒 Terkunci | ✅ Ya (Input kg aktual) | ✅ Ya |
| Pelaporan Listing / Profil | 🔒 Terkunci | ✅ Ya (4 alasan wajib) | ✅ Ya |
| Kamus "Limbah → Peluang" | ✅ Ya (Non-B3 vs B3) | ✅ Ya | ✅ Ya |
| Dashboard Dampak Publik | ✅ Ya (Metrik SDG 8 & 12) | ✅ Ya | ✅ Ya |
| Akses Rute `/admin` | ❌ Ditolak (Route Guard) | ❌ Ditolak (Route Guard) | ✅ **Akses Penuh** |
| Tinjau & Setujui Listing Baru | ❌ Tidak | ❌ Tidak | ✅ **Setujui / Sembunyikan / Hapus** |
| Antrean Laporan Berprioritas | ❌ Tidak | ❌ Tidak | ✅ **Validasi & Cabut Lencana** |
| Sanksi Akun Berjenjang | ❌ Tidak | ❌ Menerima alasan tertulis | ✅ **Peringatan ➔ Suspend ➔ Blokir** |
| Kelola Kategori & Izin B3 | ❌ Tidak | ❌ Tidak | ✅ **Tambah & Toggle Boleh Diposting** |
| Catatan Audit Tindakan | ❌ Tidak | ❌ Tidak | ✅ **Lihat Log (Immutable)** |

---

## 4. Cara Menjalankan & Skenario Pengujian Demo 30 Detik

### A. Menjalankan Frontend
```powershell
cd "c:\Users\athaw\try to do better\Tukar Sisa"
npm install
npm run dev
```
Buka browser di `http://localhost:3000` (aktifkan tampilan mobile responsive pada browser devtools).

---

### B. Skenario Pengujian Demo 30 Detik

Di bagian atas aplikasi (`AppHeader`), tersedia **Bar Pengalih Peran Demo**:
`[Tamu (Publik)]` • `[Pengguna UMKM]` • `[Admin]` • `[Disanksi]`

1. **Uji Mode Tamu di Rute `/` (Langkah 1)**:
   - Klik `Tamu (Publik)`.
   - Perhatikan peta: listing limbah ditampilkan dalam bentuk **lingkaran area perkiraan** (~800 meter). Nomor WhatsApp dan koordinat presisi tersembunyi.
   - Klik tombol **Hubungi via WA** pada kartu listing; perhatikan munculnya modal Login OTP Email.
   - Geser slider radius ke **60 km**; amati banner peringatan transportasi mandiri.
2. **Uji Pengguna Terdaftar & Posting 1 Layar (Langkah 2)**:
   - Di modal login, klik **Masuk Pengguna UMKM** (atau gunakan tombol bar peran).
   - Perhatikan bahwa status peta berubah membuka titik pin presisi, dan tombol WhatsApp aktif membuka chat dengan format teks otomatis.
   - Klik tombol bundar **(+)** di navigasi bawah untuk membuka **Form Posting 1 Layar**. Pilih kategori, masukkan jumlah volume, klik foto kamera, dan terbitkan pasokan.
3. **Uji Otomatis Matching & Konfirmasi Dampak (Langkah 3)**:
   - Buka tab **Cari Bahan** untuk melihat kartu **Rekomendasi Matching Otomatis** (kecocokan 96.5% pasokan vs kebutuhan bahan baku).
   - Buka tab **Dampak** dan klik **+ Uji Konfirmasi Transaksi** untuk memasukkan volume aktual (kg) dan melihat angka kg limbah dialihkan meningkat.
4. **Uji Panel Moderasi & Kontrol di Rute `/admin` (Langkah 4)**:
   - Klik tombol `[Admin]` di header, atau klik tombol **`/admin`**.
   - Buka tab **Tinjau Listing Baru**: Setujui listing pertama akun baru.
   - Buka tab **Antrean Laporan**: Lakukan validasi laporan "alamat tidak sesuai" dan klik **"Nyatakan Valid & Cabut Lencana"**.
   - Buka tab **Sanksi Akun Bertahap**: Berikan sanksi dengan alasan tertulis.
   - Buka tab **Audit Log (Immutable)**: Amati semua tindakan admin tercatat kronologis secara permanen.
5. **Uji Akun Disanksi (Langkah 5)**:
   - Klik tombol `[Disanksi]` di header.
   - Halaman utama `/` seketika menampilkan **Banner Merah Resmi Administrator** yang memuat alasan penangguhan akun pengguna secara transparan.

---

## 5. Eksekusi Skema Database di Supabase
1. Buka dashboard Supabase Anda -> **SQL Editor**.
2. Salin dan jalankan seluruh isi file `supabase/migrations/20261117_init_bursa_limbah.sql`.
3. Salin dan jalankan isi file `supabase/seed.sql` untuk mengisi data benih awal.
