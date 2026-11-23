# Panduan Konfigurasi Supabase: Bursa Limbah Antar-UMKM

Panduan langkah-demi-langkah ini disusun secara ramah pemula namun memiliki presisi teknis tinggi untuk menghubungkan aplikasi **Bursa Limbah Antar-UMKM** (SDG 12 & SDG 8) ke proyek Supabase nyata.

Ikuti 11 langkah berurutan di bawah ini.

---

## Daftar Isi
1. [Langkah 1: Membuat Proyek Baru di Supabase](#langkah-1-membuat-proyek-baru-di-supabase)
2. [Langkah 2: Mengaktifkan Ekstensi PostGIS di Database](#langkah-2-mengaktifkan-ekstensi-postgis-di-database)
3. [Langkah 3: Urutan Menjalankan Berkas SQL di SQL Editor](#langkah-3-urutan-menjalankan-berkas-sql-di-sql-editor)
4. [Langkah 4: Konfigurasi Bucket Storage waste-images](#langkah-4-konfigurasi-bucket-storage-waste-images)
5. [Langkah 5: Konfigurasi Secret Pengacak Koordinat (COORDINATE_SHIFT_SECRET)](#langkah-5-konfigurasi-secret-pengacak-koordinat-coordinate_shift_secret)
6. [Langkah 6: Mengisi .env.local dari Project Settings](#langkah-6-mengisi-envlocal-dari-project-settings)
7. [Langkah 7: Konfigurasi Autentikasi OTP & Redirect URLs](#langkah-7-konfigurasi-autentikasi-otp--redirect-urls)
8. [Langkah 8: Cara Membuat Pengguna Admin Pertama](#langkah-8-cara-membuat-pengguna-admin-pertama)
9. [Langkah 9: Konfigurasi Variabel Lingkungan di Vercel](#langkah-9-konfigurasi-variabel-lingkungan-di-vercel)
10. [Langkah 10: Daftar Periksa Uji Coba Manual 2 Akun (End-to-End)](#langkah-10-daftar-periksa-uji-coba-manual-2-akun-end-to-end)
11. [Langkah 11: Penyelesaian Masalah Umum (Troubleshooting)](#langkah-11-penyelesaian-masalah-umum-troubleshooting)

---

## Langkah 1: Membuat Proyek Baru di Supabase
1. Buka peramban (browser) dan kunjungi [https://supabase.com](https://supabase.com). Masuk (*Sign In*) atau buat akun baru.
2. Di dashboard organisasi Anda, klik tombol **New Project**.
3. Lengkapi formulir pembuatan proyek:
   - **Name**: Beri nama proyek, misal: `Bursa Limbah Antar-UMKM`.
   - **Database Password**: Buat kata sandi database yang kuat (minimal 16 karakter acak, kombinasikan huruf besar, huruf kecil, angka, dan simbol). **Catat dan simpan kata sandi ini di tempat aman!**
   - **Region**: Pilih region terdekat dengan target pengguna UMKM Indonesia untuk latensi paling rendah. Sangat direkomendasikan memilih **Singapore (`ap-southeast-1`)**.
   - **Pricing Plan**: Pilih **Free Plan** (sudah mencakup database Postgres, Auth, dan Storage hingga 1 GB).
4. Klik **Create new project**. Tunggu 1 hingga 2 menit sampai status proyek berubah menjadi hijau (*Active*).

---

## Langkah 2: Mengaktifkan Ekstensi PostGIS di Database
Aplikasi ini memanfaatkan fungsi spasial PostGIS untuk menghitung jarak aman antarsesama UMKM tanpa pernah membocorkan koordinat presisi.
1. Pada dashboard Supabase proyek Anda, lihat bilah menu di sebelah kiri.
2. Klik menu **Database** (ikon silinder database).
3. Pilih tab **Extensions** di bagian atas.
4. Pada kotak pencarian ekstensi (*Search extensions*), ketik: `postgis`.
5. Klik tombol toggle untuk mengaktifkan **postgis**.
6. Pastikan statusnya berubah menjadi centang hijau (*Enabled*).

---

## Langkah 3: Urutan Menjalankan Berkas SQL di SQL Editor
Buka menu **SQL Editor** (ikon terminal `>_` pada bilah sisi kiri dashboard Supabase). Jalankan ketiga berkas SQL berikut secara berurutan:

### Berkas 1: `supabase/migrations/20261123_migrate_to_prd_baru.sql`
- **Fungsi**: Membuat ekstensi UUID, tipe enum, 10 tabel inti platform, fungsi penggeseran koordinat aman `save_user_location_shifted`, fungsi RPC katalog `search_public_listings`, logika auto-complete 3 hari `auto_complete_deals_and_expire_listings`, view publik `active_listings`, serta seluruh kebijakan Row Level Security (RLS) dan trigger database.
- **Cara menjalankan**:
  1. Klik tombol **New query** di SQL Editor.
  2. Buka berkas [20261123_migrate_to_prd_baru.sql](file:///c:/Users/athaw/try%20to%20do%20better/Tukar%20Sisa/supabase/migrations/20261123_migrate_to_prd_baru.sql) di editor teks lokal Anda, lalu salin seluruh isinya.
  3. Tempel (*paste*) ke dalam SQL Editor Supabase.
  4. Klik tombol hijau **Run** (atau tekan `Ctrl + Enter`).
  5. Pastikan keluar pesan: `Success. No rows returned`.

### Berkas 2: `supabase/migrations/20261123_storage_triggers_and_sync.sql`
- **Fungsi**: Memasang trigger pembuatan profil otomatis saat user mendaftar (`trg_on_auth_user_created`), trigger penyalinan otomatis titik lokasi ke postingan (`trg_auto_fill_listing_location`), penegasan batas 5 transaksi hanya untuk pencari (`trg_limit_active_deals`), kebijakan RLS storage bucket `waste-images`, serta penjadwalan `pg_cron` otomatis.
- **Cara menjalankan**:
  1. Klik tombol **New query** baru.
  2. Salin seluruh isi berkas [20261123_storage_triggers_and_sync.sql](file:///c:/Users/athaw/try%20to%20do%20better/Tukar%20Sisa/supabase/migrations/20261123_storage_triggers_and_sync.sql).
  3. Tempel ke SQL Editor Supabase dan klik **Run**.
  4. Pastikan keluar pesan sukses.

### Berkas 3: `supabase/seed.sql`
- **Fungsi**: Memasukkan data master 14 kategori limbah/sisa bernilai ekonomis (ampas tahu, kulit buah, serbuk kayu, limbah tekstil, dll.) dengan masa kedaluwarsa dinamis, serta 4 artikel edukasi pemanfaatan limbah bersumber resmi Kementerian/BRIN/Jurnal.
- **Cara menjalankan**:
  1. Klik tombol **New query** baru.
  2. Salin seluruh isi berkas [seed.sql](file:///c:/Users/athaw/try%20to%20do%20better/Tukar%20Sisa/supabase/seed.sql).
  3. Tempel ke SQL Editor Supabase dan klik **Run**.
  4. Pastikan keluar pesan sukses.

---

## Langkah 4: Konfigurasi Bucket Storage `waste-images`
1. Berkas SQL ke-2 di atas sudah memuat query otomatis untuk membuat bucket `waste-images` dan kebijakan keamanannya:
   - Folder `listings/`: Dibaca publik untuk foto postingan sisa, diunggah oleh akun yang terautentikasi.
   - Folder `reports/`: Bersifat privat, hanya bisa dibaca oleh pelapor yang bersangkutan dan Admin Pengawas.
2. Untuk memverifikasinya:
   - Buka menu **Storage** pada bilah sisi kiri dashboard Supabase.
   - Periksa apakah bucket bernama `waste-images` sudah ada.
   - Jika belum ada, klik **New bucket**:
     - *Name*: `waste-images`
     - *Public bucket*: **Disabled** (jangan dicentang, biarkan RLS policy yang mengatur akses publik ke folder `listings/`)
     - *File size limit*: `5MB`
     - *Allowed MIME types*: `image/jpeg, image/png, image/webp`
     - Klik **Save**.

---

## Langkah 5: Konfigurasi Secret Pengacak Koordinat (`COORDINATE_SHIFT_SECRET`)
Platform Bursa Limbah melindungi privasi lokasi fisik UMKM dengan melakukan penggeseran titik koordinat deterministik maksimal 1 km berbasis secret server dan grid kasar. Titik asli tidak pernah tersimpan di database.

Untuk menetapkan kunci rahasia khusus pada database proyek Anda, jalankan query berikut di **SQL Editor**:
```sql
-- Ganti nilai di bawah ini dengan string acak panjang buatan Anda sendiri:
alter database postgres set "app.settings.coordinate_shift_secret" = 'kunci-rahasia-acak-sangat-kuat-bursa-limbah-2026';
```
> [!NOTE]
> Jika pengaturan ini tidak disetel manual, fungsi SQL secara aman akan menggunakan kunci fallback internal default sehingga aplikasi tetap berjalan normal.

---

## Langkah 6: Mengisi `.env.local` dari Project Settings
1. Di dashboard Supabase, klik ikon gerigi **Project Settings** di sudut kiri bawah.
2. Pilih tab menu **API**.
3. Di bagian **Project API keys** dan **Project URL**, salin informasi berikut:
   - **Project URL**: Salin URL proyek (misal: `https://abcdefghijklmnop.supabase.co`).
   - **anon / public key**: Salin kunci publik anonim (`eyJhbGciOi...`).

> [!CAUTION]
> **PERINGATAN KERAS:** JANGAN PERNAH menyalin atau menggunakan kunci **`service_role`** (secret key) pada frontend! Kunci `service_role` memiliki hak superuser yang melewati semua aturan keamanan RLS dan tidak boleh terekspos ke browser publik.

4. Buka direktori proyek Anda di komputer, buat berkas baru bernama `.env.local` (berkas ini sudah dikecualikan di `.gitignore`):
```env
VITE_DEMO_MODE=false
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ganti_dengan_kunci_anon_anda...
```

---

## Langkah 7: Konfigurasi Autentikasi OTP & Redirect URLs
Aplikasi Bursa Limbah menggunakan sistem login OTP Email tanpa password yang ramah UMKM.
1. Buka menu **Authentication** di bilah sisi kiri dashboard Supabase.
2. Buka tab **URL Configuration**:
   - **Site URL**: Masukkan URL deployment Anda, misal: `https://tukar-sisa.vercel.app` (atau `http://localhost:5173` saat pengujian lokal).
   - **Redirect URLs**: Tambahkan:
     - `http://localhost:5173/**`
     - `https://*.vercel.app/**`
3. Buka tab **Providers** -> pilih **Email**:
   - Pastikan provider *Email* dalam status **Enabled**.
   - Untuk kemudahan pengujian pertama kali: Anda dapat mematikan toggle **Confirm email** agar akun pengguna langsung aktif begitu memverifikasi 6-digit OTP tanpa perlu mengklik tautan aktivasi email terpisah.
4. Buka tab **Email Templates** -> pilih **Magic Link / OTP**:
   - Anda dapat menyesuaikan template subjek: `Kode Masuk Bursa Limbah: {{ .Token }}`.
   - Di dalam badan email, tampilkan variabel token 6-digit: `{{ .Token }}`.

---

## Langkah 8: Cara Membuat Pengguna Admin Pertama
Hak akses admin platform diverifikasi secara ketat oleh database pada kolom `public.profiles.peran_sistem`, bukan oleh klien.

1. Buka aplikasi di peramban (`http://localhost:5173` atau URL Vercel).
2. Lakukan pendaftaran / login dengan email Anda menggunakan OTP Email.
3. Setelah berhasil masuk dan profil Anda terdaftar, buka **SQL Editor** di dashboard Supabase.
4. Jalankan query berikut untuk menaikkan level akun Anda menjadi Admin Pengawas:
```sql
-- Ganti 'email-admin-anda@domain.com' dengan email yang Anda gunakan saat login
update public.profiles
set peran_sistem = 'admin'
where id = (
    select id from auth.users where email = 'email-admin-anda@domain.com'
);

-- Periksa untuk memastikan peran sistem telah berubah:
select id, nama_tampilan, peran_sistem, status_akun
from public.profiles
where peran_sistem = 'admin';
```
5. Muat ulang (*refresh*) browser Anda. Sekarang akun Anda memiliki akses penuh ke Panel Pengawas Admin di rute `/admin`.

---

## Langkah 9: Konfigurasi Variabel Lingkungan di Vercel
Saat Anda men-deploy proyek ini ke Vercel:
1. Buka dashboard proyek Anda di [Vercel](https://vercel.com).
2. Masuk ke **Settings** -> pilih tab **Environment Variables**.
3. Tambahkan 3 variabel berikut:

| Key | Value | Environment |
| :--- | :--- | :--- |
| `VITE_DEMO_MODE` | `false` | Production, Preview, Development |
| `VITE_SUPABASE_URL` | `https://abcdefghijklmnop.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (anon key publik) | Production, Preview, Development |

4. Klik **Save**, lalu lakukan redeploy (*Deployments* -> klik titik tiga pada commit terbaru -> *Redeploy*) agar variabel lingkungan aktif di bundel produksi.

---

## Langkah 10: Daftar Periksa Uji Coba Manual 2 Akun (End-to-End)
Ujilah alur transaksi nyata menggunakan dua akun berbeda (gunakan 2 peramban berbeda atau satu peramban reguler dan satu jendela *Incognito*):

- [ ] **1. Pendaftaran Akun A (Pemasok UMKM)**:
  - Buka browser 1, masukkan email Akun A, verifikasi OTP.
  - Lengkapi nama tampilan (misal: "Ibu Nur Bakery") dan nomor WhatsApp (`0812xxxxxxxx`).
- [ ] **2. Simpan Slot Lokasi (Akun A)**:
  - Buka tab Akun / Kelola Lokasi, simpan Slot 1 (misal: "Dapur Produksi"). Izinkan akses GPS sekali saat diminta; titik akan digeser otomatis oleh server.
- [ ] **3. Buat Postingan Sisa (Akun A)**:
  - Klik tombol **Pasang Postingan** (+).
  - Pilih Kategori: *Sisa Dapur & Sayuran*.
  - Pilih Slot Lokasi: *Dapur Produksi*.
  - Isi Stok: `20 kg`, pilih jenis harga (misal: *Gratis* atau *Rp 500/kg*).
  - Unggah 1 foto (metadata EXIF dibersihkan otomatis oleh browser Canvas sebelum diunggah).
  - Klik **Tayangkan Postingan**.
- [ ] **4. Pendaftaran Akun B (Pencari UMKM / Budidaya)**:
  - Buka browser 2 (Incognito), daftar dengan email Akun B, simpan lokasi Slot 1.
- [ ] **5. Temukan Postingan (Akun B)**:
  - Masuk ke tab **Cari**. Postingan Akun A tampil dengan informasi jarak aman (misal: `"kurang dari 2 km"` atau `"3 km"`) tanpa pernah menampilkan koordinat presisi.
- [ ] **6. Hubungi Pemasok via WhatsApp (Akun B)**:
  - Klik tombol **Hubungi via WhatsApp**.
  - Aplikasi membuka tautan WhatsApp dengan draf pesan otomatis yang memuat detail barang dan jarak aman.
  - Transaksi berstatus `berjalan` otomatis dibuat di tab **Aktivitas**.
- [ ] **7. Konfirmasi Serah Terima Barang**:
  - Akun B atau Akun A membuka tab **Aktivitas**, klik **Konfirmasi Selesai**, masukkan jumlah yang diterima (misal: `15 kg`).
  - Status transaksi berubah menjadi `menunggu_otomatis` (dengan batas 3 hari).
  - Pihak kedua mengonfirmasi jumlah -> status transaksi berubah menjadi `selesai`.
  - Stok postingan berkurang otomatis di database, dan counter metrik dampak lingkungan (*Kg dialihkan*) bertambah!

---

## Langkah 11: Penyelesaian Masalah Umum (Troubleshooting)

### A. Error: `type modifier is not allowed for type "geography"` atau `type "geography" does not exist`
- **Penyebab**: Ekstensi PostGIS belum aktif saat mengeksekusi berkas migrasi SQL.
- **Solusi**: Buka dashboard Supabase -> Database -> Extensions -> cari `postgis` -> aktifkan toggle PostGIS. Setelah itu jalankan kembali berkas migrasi SQL 1.

### B. Error: `new row violates row-level security policy for table ...`
- **Penyebab**: Pengguna belum terautentikasi atau mencoba mengubah baris milik pengguna lain.
- **Solusi**: Pastikan user sudah berhasil login (`auth.uid()` terdeteksi). Kebijakan RLS memblokir modifikasi jika `auth.uid() != user_id`.

### C. Error: `Bucket not found` atau `Access Denied` saat Mengunggah Foto
- **Penyebab**: Bucket `waste-images` belum dibuat atau berkas migrasi ke-2 belum dijalankan.
- **Solusi**: Pastikan berkas migrasi `20261123_storage_triggers_and_sync.sql` sudah dijalankan di SQL Editor, dan pastikan bucket bernama `waste-images` terdaftar pada menu Storage.

### D. Kuota Pengiriman Email OTP Habis (*Email rate limit exceeded*)
- **Penyebab**: Layanan pengiriman email bawaan Supabase dibatasi maksimal 3-4 email per jam untuk mencegah spam.
- **Solusi**: Untuk pengujian tim atau produksi, hubungkan penyedia SMTP kustom (seperti Resend, Brevo, SendGrid, atau Google Workspace) pada menu **Authentication** -> **SMTP Settings**.

### E. Masalah CORS (*Cross-Origin Resource Sharing*)
- **Penyebab**: Domain aplikasi belum didaftarkan di URL konfigurasi Supabase Auth.
- **Solusi**: Buka menu **Authentication** -> **URL Configuration**, tambahkan URL domain Vercel dan `http://localhost:5173/**` pada daftar *Redirect URLs*.
