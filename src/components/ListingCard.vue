<template>
  <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition mb-3">
    <!-- Gambar & Badge Jarak/Harga -->
    <div class="relative h-44 bg-slate-100 overflow-hidden cursor-pointer" @click="$emit('click-detail', listing)">
      <img
        :src="listing.foto || listing.foto_url"
        :alt="listing.judul"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        loading="lazy"
      />

      <!-- Badge Jarak Radius -->
      <div class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
        <svg class="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{{ listing.jarak_km }} km</span>
      </div>

      <!-- Tombol Bookmark / Favorit (U23) & Badge Harga -->
      <div class="absolute top-3 right-3 flex items-center gap-1.5">
        <button
          @click.stop="toggleFavorite(listing.id)"
          class="p-1.5 rounded-lg backdrop-blur bg-white/80 hover:bg-white text-slate-700 shadow transition"
          :title="isFavorite(listing.id) ? 'Hapus dari favorit' : 'Simpan ke favorit'"
        >
          <span v-if="isFavorite(listing.id)" class="text-amber-500 text-xs">⭐</span>
          <span v-else class="text-slate-400 text-xs">☆</span>
        </button>

        <span
          v-if="listing.harga === 0 || listing.tipe_harga === 'gratis'"
          class="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg shadow uppercase tracking-wide"
        >
          Gratis
        </span>
        <span
          v-else
          class="bg-amber-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg shadow"
        >
          Rp {{ (listing.harga || listing.harga_satuan || 0).toLocaleString('id-ID') }} / {{ listing.satuan }}
        </span>
      </div>

      <!-- Badge Metode Pengambilan -->
      <div class="absolute bottom-2 left-3 bg-white/90 backdrop-blur text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-slate-200">
        {{ listing.metode_pengambilan === 'diambil_pencari' ? '🛵 Diambil Pencari' : listing.metode_pengambilan === 'diantar_penghasil' ? '🚚 Diantar Penghasil' : '💬 Didiskusikan' }}
      </div>
    </div>

    <!-- Konten Informasi Listing -->
    <div class="p-4">
      <!-- Kategori Limbah -->
      <div class="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
        <span class="text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md font-bold">
          {{ listing.category_name }}
        </span>
        <span class="text-slate-400">
          Rutin: <strong class="text-slate-700">{{ listing.volume_per_minggu }} {{ listing.satuan }}/minggu</strong>
        </span>
      </div>

      <!-- Judul Listing -->
      <h3
        @click="$emit('click-detail', listing)"
        class="text-base font-extrabold text-slate-900 leading-snug line-clamp-2 cursor-pointer hover:text-brand-600 transition mb-1"
      >
        {{ listing.judul }}
      </h3>

      <!-- Nama UMKM & Area Ringkas -->
      <div class="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-2">
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="font-bold text-slate-800">{{ listing.nama_usaha }}</span>
        <span>•</span>
        <span>{{ listing.alamat_tampilan }}</span>
      </div>

      <!-- 3 Lencana Kepercayaan (F3, F11) -->
      <div class="mb-2">
        <TrustBadge
          :is-email-verified="listing.is_email_verified"
          :is-location-verified="listing.lokasi_terverifikasi ?? listing.is_lokasi_terverifikasi"
          :has-confirmed-transactions="listing.has_confirmed_transactions"
        />
      </div>

      <!-- Tanda Peringatan Lokasi Belum Terverifikasi (PRD Hal. 9 & 10) -->
      <div
        v-if="!(listing.lokasi_terverifikasi ?? listing.is_lokasi_terverifikasi)"
        class="mb-3 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900 font-bold flex items-center gap-1"
      >
        <span>⚠️</span>
        <span>Lokasi belum terverifikasi GPS — cek fisik sebelum transaksi</span>
      </div>

      <!-- Tombol Aksi: WhatsApp Kontak (Gated untuk Publik/Tamu) -->
      <div class="pt-2 border-t border-slate-100 flex items-center gap-2">
        <button
          @click="$emit('click-detail', listing)"
          class="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition text-center"
        >
          Lihat Rincian
        </button>

        <button
          @click="handleWhatsAppClick"
          class="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
        >
          <svg v-if="listing.is_contact_locked" class="w-3.5 h-3.5 text-brand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{{ listing.is_contact_locked ? 'Buka Kontak & WA' : 'Hubungi WhatsApp' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WasteListing } from '../types';
import TrustBadge from './TrustBadge.vue';
import { useWasteApp } from '../composables/useWasteApp';

const props = defineProps<{
  listing: WasteListing;
}>();

defineEmits(['click-detail']);

const { contactListing, toggleFavorite, isFavorite } = useWasteApp();

function handleWhatsAppClick() {
  contactListing(props.listing);
}
</script>
