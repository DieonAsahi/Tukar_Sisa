<template>
  <div class="space-y-4">
    <!-- Judul Header Kamus -->
    <div class="bg-gradient-to-r from-brand-700 to-emerald-600 rounded-3xl p-5 text-white shadow-md">
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
        <span>Buku Panduan UMKM Cerdas</span>
        <span>•</span>
        <span>SDG 12 & PRD F15</span>
      </div>
      <h2 class="text-xl font-black mt-1">Kamus "Limbah → Peluang" (V5, V6)</h2>
      <p class="text-xs text-emerald-100 font-medium leading-relaxed mt-1">
        Pilih jenis limbah untuk melihat <strong>siapa yang bisa memakainya</strong> dan <strong>cara pemanfaatannya</strong>, serta daftar kategori non-B3 yang diizinkan vs B3 terlarang.
      </p>
    </div>

    <!-- Tab Pilihan: Diizinkan vs Dilarang -->
    <div class="grid grid-cols-2 gap-2 bg-slate-200 p-1 rounded-2xl">
      <button
        @click="activeSubTab = 'allowed'"
        :class="[
          'py-2.5 px-3 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-1.5',
          activeSubTab === 'allowed'
            ? 'bg-white text-brand-800 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        ]"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Limbah Diizinkan (Non-B3)</span>
      </button>

      <button
        @click="activeSubTab = 'hazardous'"
        :class="[
          'py-2.5 px-3 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-1.5',
          activeSubTab === 'hazardous'
            ? 'bg-white text-red-700 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        ]"
      >
        <span class="w-2 h-2 rounded-full bg-red-500"></span>
        <span>B3 Terlarang (Bahaya)</span>
      </button>
    </div>

    <!-- KONTEN TAB 1: LIMBAH NON-B3 DIIZINKAN & SARAN PEMANFAATAN (F15) -->
    <div v-if="activeSubTab === 'allowed'" class="space-y-3">
      <div
        v-for="item in allowedCategories"
        :key="item.id"
        class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-brand-300 transition"
      >
        <div class="flex items-start justify-between gap-2 mb-2">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ♻️
            </div>
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">{{ item.nama }}</h3>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Non-B3 Aman & Legal • Faktor: {{ item.faktor_ke_kg }} kg/{{ item.satuan_default }}
              </span>
            </div>
          </div>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed mb-3">
          {{ item.deskripsi }}
        </p>

        <!-- Saran Pemanfaatan: Siapa yang bisa memakai & cara olah (F15) -->
        <div class="bg-brand-50/60 rounded-xl p-3 border border-brand-100 mb-2.5">
          <div class="text-[11px] font-extrabold text-brand-900 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <span>💡 Siapa yang Bisa Memakai & Cara Pemanfaatan:</span>
          </div>
          <ul class="grid grid-cols-1 gap-1 text-xs text-brand-950 font-medium">
            <li
              v-for="(saran, idx) in item.saran_pemanfaatan"
              :key="idx"
              class="flex items-start gap-1.5"
            >
              <span class="text-brand-600 font-bold">•</span>
              <span>{{ saran }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- KONTEN TAB 2: DAFTAR B3 / KIMIA TERLARANG -->
    <div v-else class="space-y-3">
      <div class="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-950 leading-relaxed font-medium">
        <strong class="font-bold text-red-900 block mb-1">Pemberitahuan Hukum Perlindungan Lingkungan</strong>
        Sesuai <strong>PP No. 22 Tahun 2021</strong> dan UU Pengelolaan Lingkungan Hidup, material berbahaya berikut dilarang keras diposting di Bursa Limbah Antar-UMKM dan wajib dimusnahkan oleh pihak ketiga berizin khusus.
      </div>

      <div
        v-for="item in hazardousCategories"
        :key="item.id"
        class="bg-white rounded-2xl border border-red-200 p-4 shadow-sm"
      >
        <div class="flex items-center gap-2.5 mb-2">
          <div class="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
            🚫
          </div>
          <div>
            <h3 class="text-sm font-extrabold text-red-900">{{ item.nama }}</h3>
            <span class="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              Dilarang Keras
            </span>
          </div>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed mb-3">
          {{ item.deskripsi }}
        </p>

        <div class="bg-red-50/80 rounded-xl p-3 border border-red-200 text-xs text-red-900">
          <strong class="block font-bold mb-0.5">Bahaya & Peringatan:</strong>
          <p class="leading-relaxed">{{ item.peringatan_bahaya || 'Limbah berbahaya dan beracun, penanganan wajib izin khusus.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

const { allowedCategories, hazardousCategories } = useWasteApp();
const activeSubTab = ref<'allowed' | 'hazardous'>('allowed');
</script>
