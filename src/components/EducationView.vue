<template>
  <div class="space-y-4 max-w-4xl mx-auto">
    <!-- Header Edukasi -->
    <div class="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300 mb-2">
        <span>📖</span> Edukasi Pemanfaatan Sisa (SDG 12)
      </div>
      <h2 class="text-xl sm:text-2xl font-black text-white leading-tight">
        Panduan Pemanfaatan Sisa Bernilai & Rantai Daur Ulang
      </h2>
      <p class="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed max-w-2xl">
        Seluruh artikel disusun berdasarkan riset dan referensi ilmiah resmi dari instansi lingkungan dan perguruan tinggi, agar sisa bernilai dapat diolah secara higienis dan produktif.
      </p>
    </div>

    <!-- Filter Kategori Edukasi -->
    <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
      <button
        @click="filterCatId = 'semua'"
        :class="[
          'px-3 py-1.5 rounded-xl text-xs font-bold transition',
          filterCatId === 'semua' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        ]"
      >
        Semua Kategori ({{ educationArticles.length }})
      </button>

      <button
        v-for="cat in allowedCategories"
        :key="cat.id"
        @click="filterCatId = cat.id"
        :class="[
          'px-3 py-1.5 rounded-xl text-xs font-bold transition',
          filterCatId === cat.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        ]"
      >
        {{ cat.nama }}
      </button>
    </div>

    <!-- Daftar Artikel Edukasi -->
    <div class="space-y-3.5">
      <div
        v-for="article in filteredArticles"
        :key="article.id"
        class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200">
            {{ article.category_nama || 'Organik & Biomassa' }}
          </span>
          <span class="text-[11px] text-slate-400 font-medium">
            Riset Ilmiah
          </span>
        </div>

        <h3 class="text-base sm:text-lg font-black text-slate-900 leading-snug">
          {{ article.judul }}
        </h3>

        <div class="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-bold leading-relaxed">
          💡 {{ article.ringkasan }}
        </div>

        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {{ article.konten }}
        </p>

        <!-- Sumber Resmi (WAJIB SESUAI PRD BARU) -->
        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
            <span>📚 Sumber Referensi:</span>
            <strong class="text-slate-800">{{ article.sumber }}</strong>
            <span
              v-if="article.perlu_verifikasi"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300"
            >
              ⚠️ Perlu Verifikasi Lanjutan
            </span>
            <span
              v-else-if="article.terverifikasi_manual"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800"
            >
              ✓ Terverifikasi Khusus
            </span>
            <span
              v-else
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700"
            >
              Sumber rujukan umum
            </span>
          </div>

          <a
            v-if="article.url_sumber"
            :href="article.url_sumber"
            target="_blank"
            class="text-[11px] text-brand-700 hover:underline font-bold flex items-center gap-1"
          >
            <span>Buka Tautan Resmi</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

const { educationArticles, allowedCategories } = useWasteApp();

const filterCatId = ref<string>('semua');

const filteredArticles = computed(() => {
  if (filterCatId.value === 'semua') return educationArticles.value;
  return educationArticles.value.filter((a) => a.category_id === filterCatId.value);
});
</script>
