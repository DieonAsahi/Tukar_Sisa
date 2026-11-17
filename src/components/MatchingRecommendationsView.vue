<template>
  <div class="space-y-4">
    <!-- Header Permintaan Bahan -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <h2 class="text-sm font-extrabold text-slate-900">Kebutuhan Bahan Baku UMKM (U11)</h2>
          <span class="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
            {{ filteredRequests.length }} Kebutuhan Aktif
          </span>
        </div>
        <p class="text-xs text-slate-500 font-medium leading-relaxed">
          Daftar UMKM yang sedang mencari pasokan limbah untuk diolah kembali menjadi produk bernilai tambah (SDG 8 & 12).
        </p>
      </div>

      <!-- Tombol Pasang Kebutuhan (U11) -->
      <button
        @click="$emit('open-material-request')"
        class="shrink-0 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
      >
        <span>📦</span>
        <span>+ Pasang Kebutuhan</span>
      </button>
    </div>

    <!-- SEKSI 1: REKOMENDASI MATCHING OTOMATIS (PRD F7 & F8) -->
    <div v-if="matches.length > 0" class="bg-gradient-to-r from-emerald-50 via-teal-50 to-brand-50 border border-emerald-200 rounded-3xl p-4 shadow-sm">
      <div class="flex items-center gap-1.5 text-xs font-black text-emerald-950 uppercase tracking-wider mb-2.5">
        <span class="text-base">⚡</span>
        <span>Rekomendasi Matching Otomatis Pintar</span>
      </div>

      <div class="space-y-2.5">
        <div
          v-for="match in matches"
          :key="match.id"
          class="bg-white rounded-2xl p-3.5 border border-emerald-100 shadow-sm"
        >
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
              Kecocokan {{ match.skor_kecocokan }}%
            </span>
            <span class="text-xs font-bold text-slate-500">
              Jarak: {{ match.jarak_km }} km
            </span>
          </div>

          <div class="text-xs font-extrabold text-slate-900 leading-snug">
            {{ match.listing_judul }}
          </div>
          <div class="text-[11px] text-slate-600 font-medium mt-0.5">
            ⇄ Cocok dengan: <strong>{{ match.request_judul }}</strong>
          </div>

          <div class="mt-2 p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
            <span>{{ match.volume_summary }}</span>
            <button
              @click="handleRespond"
              class="text-xs font-extrabold text-brand-700 hover:text-brand-800 underline"
            >
              Hubungi Rekanan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SEKSI 2: DAFTAR PERMINTAAN BAHAN BAKU -->
    <div class="space-y-3">
      <div
        v-for="req in filteredRequests"
        :key="req.id"
        class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-brand-300 transition"
      >
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            {{ req.category_name }}
          </span>
          <span class="text-xs font-bold text-slate-500">
            ~{{ req.jarak_km }} km
          </span>
        </div>

        <h3 class="text-sm font-extrabold text-slate-900 leading-snug mb-1">
          {{ req.judul }}
        </h3>

        <p class="text-xs text-slate-600 leading-relaxed mb-3">
          {{ req.deskripsi }}
        </p>

        <div class="flex items-center justify-between pt-2.5 border-t border-slate-100">
          <div class="text-xs text-slate-700 font-semibold">
            Butuh: <strong class="text-brand-700 font-bold">{{ req.volume_dibutuhkan }} {{ req.satuan }}/minggu</strong>
          </div>

          <button
            @click="handleRespond"
            class="py-2 px-3.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-extrabold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Tawari Pasokan</span>
          </button>
        </div>
      </div>

      <div v-if="filteredRequests.length === 0" class="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
        <span class="text-3xl">📦</span>
        <div class="text-sm font-extrabold text-slate-800 mt-2">Belum ada permintaan bahan dalam radius ini</div>
        <p class="text-xs text-slate-400 mt-1">Jadilah yang pertama memasang kebutuhan bahan baku daur ulang Anda.</p>
        <button
          @click="$emit('open-material-request')"
          class="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow hover:bg-emerald-700 transition"
        >
          + Pasang Kebutuhan Sekarang
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWasteApp } from '../composables/useWasteApp';

defineEmits(['open-material-request']);

const { filteredRequests, matches, requireAuth } = useWasteApp();

function handleRespond() {
  requireAuth('menghubungi pencari bahan baku via WhatsApp');
}
</script>
