<template>
  <div v-if="listing" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col">
      <!-- Header Bar Modal -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <h2 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
          <span>📋</span> Rincian Pasokan Sisa Limbah
        </h2>
        <div class="flex items-center gap-1">
          <!-- Tombol Favorit (U23) -->
          <button
            @click="toggleFavorite(listing.id)"
            class="p-1.5 text-slate-500 hover:text-amber-500 hover:bg-slate-100 rounded-xl transition"
            :title="isFavorite(listing.id) ? 'Hapus dari favorit' : 'Simpan ke favorit'"
          >
            <span v-if="isFavorite(listing.id)" class="text-amber-500 text-sm">⭐</span>
            <span v-else class="text-slate-400 text-sm">☆</span>
          </button>
          <button
            @click="$emit('close')"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-5 space-y-4">
        <!-- Foto Listing -->
        <div class="relative h-56 rounded-2xl overflow-hidden bg-slate-100">
          <img
            :src="listing.foto || listing.foto_url"
            :alt="listing.judul"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            Jarak: ~{{ listing.jarak_km }} km
          </div>
          <div class="absolute top-3 right-3">
            <span
              v-if="listing.harga === 0 || listing.tipe_harga === 'gratis'"
              class="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider"
            >
              Gratis
            </span>
            <span
              v-else
              class="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-lg"
            >
              Rp {{ (listing.harga || listing.harga_satuan || 0).toLocaleString('id-ID') }} / {{ listing.satuan }}
            </span>
          </div>
        </div>

        <!-- Judul & Kategori -->
        <div>
          <span class="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
            {{ listing.category_name }}
          </span>
          <h1 class="text-lg font-black text-slate-900 leading-snug mt-1.5">
            {{ listing.judul }}
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Volume Rutin: <strong class="text-slate-800">{{ listing.volume_per_minggu }} {{ listing.satuan }}/minggu</strong> • Metode: <strong class="text-slate-800">{{ listing.metode_pengambilan === 'diambil_pencari' ? 'Diambil Pencari' : listing.metode_pengambilan === 'diantar_penghasil' ? 'Diantar Penghasil' : 'Didiskusikan' }}</strong>
          </p>
        </div>

        <!-- 3 Lencana Kepercayaan Profil Pemilik (F3, F11) -->
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div class="flex items-center gap-2 mb-2.5">
            <div class="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-black text-sm">
              {{ (listing.nama_usaha || 'U').charAt(0) }}
            </div>
            <div>
              <div class="text-xs font-extrabold text-slate-900 leading-tight">
                {{ listing.nama_usaha }}
              </div>
              <div class="text-[11px] text-slate-500 font-medium">
                {{ listing.jenis_usaha || 'Pelaku UMKM Terdaftar' }}
              </div>
            </div>
          </div>

          <TrustBadge
            :is-email-verified="listing.is_email_verified"
            :is-location-verified="listing.lokasi_terverifikasi ?? listing.is_lokasi_terverifikasi"
            :has-confirmed-transactions="listing.has_confirmed_transactions"
          />

          <!-- Peringatan jika lokasi belum terverifikasi (F3 & F11) -->
          <div
            v-if="!(listing.lokasi_terverifikasi ?? listing.is_lokasi_terverifikasi)"
            class="mt-2.5 p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-tight flex items-start gap-1.5 font-medium"
          >
            <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong>Peringatan Keamanan:</strong> Lokasi fisik usaha ini belum diverifikasi lewat GPS kamera perangkat. Selalu periksa barang langsung di lokasi sebelum kesepakatan.
            </span>
          </div>
        </div>

        <!-- Deskripsi Barang Limbah -->
        <div>
          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Keterangan Limbah
          </h4>
          <p class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {{ listing.deskripsi }}
          </p>
        </div>

        <!-- Informasi Lokasi & WhatsApp (Batas Akses Pengunjung Tamu) -->
        <div class="p-4 rounded-2xl border transition" :class="listing.is_contact_locked ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-black uppercase tracking-wider" :class="listing.is_contact_locked ? 'text-amber-900' : 'text-emerald-900'">
              {{ listing.is_contact_locked ? '🔒 Lokasi & Kontak Terkunci (Mode Tamu)' : '✅ Lokasi & Kontak Terbuka' }}
            </span>
            <span class="text-[11px] text-slate-500 font-bold">
              Kedaluwarsa: 14 hari
            </span>
          </div>

          <!-- KONDISI TERKUNCI (Pengunjung Tamu) -->
          <div v-if="listing.is_contact_locked" class="space-y-2">
            <p class="text-xs text-slate-600">
              Alamat: <strong>{{ listing.alamat_tampilan }}</strong> (Jalan presisi disamarkan).
            </p>
            <p class="text-xs text-slate-600">
              WhatsApp: <span class="font-mono bg-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">+62 812-****-****</span>
            </p>
            <button
              @click="handleUnlockClick"
              class="w-full mt-2 py-3 px-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-xl shadow transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Masuk via OTP Email untuk Buka Kontak & Titik Presisi</span>
            </button>
          </div>

          <!-- KONDISI TERBUKA (Pengguna Terverifikasi) -->
          <div v-else class="space-y-2.5">
            <div class="text-xs text-slate-800">
              <div class="font-bold">Alamat Penjemputan Presisi:</div>
              <div class="text-slate-900 font-medium">{{ listing.alamat_tampilan }}</div>
              <div v-if="listing.exact_latitude" class="text-[11px] text-slate-500 font-mono mt-0.5">
                Koordinat Presisi: {{ listing.exact_latitude?.toFixed(5) }}, {{ listing.exact_longitude?.toFixed(5) }}
              </div>
            </div>

            <!-- Tombol Hubungi WhatsApp Resmi (Mencatat Deal & Membuka WA) -->
            <button
              @click="handleWhatsApp"
              class="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-sm font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Hubungi via WhatsApp (Format Resmi)</span>
            </button>
            <p class="text-[10px] text-center text-slate-400">
              Format salam, volume, dan ID kesepakatan terisi otomatis. Kuota kontak: 10/hari.
            </p>
          </div>
        </div>

        <!-- 4 ANJURAN KESELAMATAN WAJIB (PRD Hal. 10 & V7) -->
        <div class="bg-blue-50/80 border border-blue-200 rounded-2xl p-4">
          <div class="flex items-center gap-1.5 text-xs font-black text-blue-900 mb-2">
            <svg class="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>4 Pedoman Keselamatan Antar-UMKM:</span>
          </div>
          <ul class="space-y-1.5 text-[11px] text-blue-950 font-medium list-disc list-inside leading-relaxed">
            <li><strong>Minta titik lokasi</strong> lewat WhatsApp sebelum berangkat ke lokasi penjemputan.</li>
            <li><strong>Ambil sampel kecil</strong> terlebih dahulu untuk memastikan kecocokan bahan baku daur ulang Anda.</li>
            <li><strong>Jangan transfer uang di muka</strong>. Pembayaran dilakukan saat barang dicek fisik di lokasi.</li>
            <li><strong>Bertemu di tempat usaha fisik</strong> pada jam operasional kerja yang aman dan terang.</li>
          </ul>
        </div>

        <!-- Tombol Laporkan Listing (F12) -->
        <div class="pt-2 text-center">
          <button
            @click="handleReportClick"
            class="text-xs font-bold text-red-600 hover:text-red-700 hover:underline inline-flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Laporkan Listing / Pemilik Tidak Sesuai</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WasteListing } from '../types';
import TrustBadge from './TrustBadge.vue';
import { useWasteApp } from '../composables/useWasteApp';

const props = defineProps<{
  listing: WasteListing | null;
}>();

const emit = defineEmits(['close', 'open-report']);

const { requireAuth, contactListing, toggleFavorite, isFavorite } = useWasteApp();

function handleUnlockClick() {
  requireAuth('membuka titik lokasi presisi dan nomor WhatsApp pemilik listing');
}

function handleWhatsApp() {
  if (props.listing) {
    contactListing(props.listing);
  }
}

function handleReportClick() {
  if (requireAuth('melaporkan listing')) {
    emit('open-report', props.listing);
  }
}
</script>
