<template>
  <div class="space-y-4">
    <!-- Header Hero Dampak Publik & Pribadi -->
    <div class="bg-gradient-to-tr from-slate-900 via-brand-950 to-brand-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
      <div class="relative z-10">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-[11px] font-bold text-brand-300">
            <span class="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            Data Riil Transaksi Antar-UMKM
          </div>

          <!-- Switcher Mode: Dampak Publik (V2) vs Dampak Usaha Saya (U22) -->
          <div v-if="isAuthenticated" class="flex items-center bg-white/10 p-1 rounded-xl border border-white/20">
            <button
              @click="viewMode = 'publik'"
              :class="[
                'px-2.5 py-1 text-xs font-bold rounded-lg transition',
                viewMode === 'publik' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
              ]"
            >
              🌍 Publik
            </button>
            <button
              @click="viewMode = 'pribadi'"
              :class="[
                'px-2.5 py-1 text-xs font-bold rounded-lg transition',
                viewMode === 'pribadi' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
              ]"
            >
              🏪 Usaha Saya
            </button>
          </div>
        </div>

        <h2 class="text-xl font-black leading-tight">
          {{ viewMode === 'publik' ? 'Dashboard Dampak Lingkungan & Ekonomi' : 'Dampak Nyata Usaha Anda (SDG)' }}
        </h2>
        <p class="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
          {{ viewMode === 'publik' 
            ? 'Kontribusi nyata jejaring UMKM lokal dalam mewujudkan SDG 8 (Pertumbuhan Ekonomi) & SDG 12 (Produksi Bertanggung Jawab).'
            : 'Perhitungan otomatis limbah yang berhasil dialihkan dan biaya yang dihemat dari transaksi usaha Anda.'
          }}
        </p>
      </div>
    </div>

    <!-- 4 Kartu Metrik (Berdasarkan Mode: Publik vs Pribadi) -->
    <div class="grid grid-cols-2 gap-3">
      <!-- 1. Total Limbah Dialihkan -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-2">
          ♻️
        </div>
        <div class="text-2xl font-black text-slate-900 leading-none">
          {{ activeMetrics.total_kg_dialihkan.toLocaleString('id-ID') }}
          <span class="text-xs font-bold text-slate-500">kg</span>
        </div>
        <div class="text-xs font-bold text-slate-700 mt-1">Limbah Dialihkan</div>
        <p class="text-[10px] text-slate-400 mt-0.5">Dicegah menumpuk di TPA lokal</p>
      </div>

      <!-- 2. Penghematan Biaya Buang -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-2">
          💰
        </div>
        <div class="text-2xl font-black text-slate-900 leading-none">
          <span class="text-xs font-bold text-slate-500">Rp</span>
          {{ (activeMetrics.estimasi_penghematan_biaya_buang / 1000).toFixed(0) }}k
        </div>
        <div class="text-xs font-bold text-slate-700 mt-1">Biaya Buang Dihemat</div>
        <p class="text-[10px] text-slate-400 mt-0.5">Estimasi retribusi & truk sampah</p>
      </div>

      <!-- 3. Transaksi Selesai -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-2">
          🤝
        </div>
        <div class="text-2xl font-black text-slate-900 leading-none">
          {{ activeMetrics.total_transaksi }}
        </div>
        <div class="text-xs font-bold text-slate-700 mt-1">Transaksi Berhasil</div>
        <p class="text-[10px] text-slate-400 mt-0.5">Divalidasi kedua pihak UMKM</p>
      </div>

      <!-- 4. UMKM Terlibat -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-2">
          🏭
        </div>
        <div class="text-2xl font-black text-slate-900 leading-none">
          {{ 'total_umkm_terlibat' in activeMetrics ? (activeMetrics as any).total_umkm_terlibat : 1 }}
        </div>
        <div class="text-xs font-bold text-slate-700 mt-1">
          {{ viewMode === 'publik' ? 'UMKM Tergabung' : 'Mitra Terhubung' }}
        </div>
        <p class="text-[10px] text-slate-400 mt-0.5">Penghasil & pencari bahan baku</p>
      </div>
    </div>

    <!-- Kartu Komitmen SDG 8 & SDG 12 -->
    <div class="space-y-3">
      <!-- SDG 12 Card -->
      <div class="bg-white rounded-2xl border-l-4 border-l-[#bf8b2e] border-slate-200 p-4 shadow-sm">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-black uppercase tracking-wider text-[#bf8b2e]">
            SDG 12: Konsumsi & Produksi Bertanggung Jawab
          </span>
          <span class="text-base">🌍</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          Mengubah sisa operasional bengkel kayu, konveksi, kedai kopi, dan pasar menjadi bahan baku produktif, sehingga beban TPA daerah berkurang secara terukur.
        </p>
      </div>

      <!-- SDG 8 Card -->
      <div class="bg-white rounded-2xl border-l-4 border-l-[#a21942] border-slate-200 p-4 shadow-sm">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-black uppercase tracking-wider text-[#a21942]">
            SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi
          </span>
          <span class="text-base">📈</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          Menekan biaya pengadaan bahan baku bagi pengrajin daur ulang lokal dan menciptakan pendapatan tambahan bagi UMKM penghasil limbah.
        </p>
      </div>
    </div>

    <!-- Riwayat Transaksi Sukses Komunitas (Deals yang selesai) -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800">
          Riwayat Serah Terima Sukses
        </h3>
        <button
          @click="$emit('open-confirm-tx')"
          class="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
        >
          <span>+ Konfirmasi Transaksi Selesai</span>
        </button>
      </div>

      <div class="space-y-2.5">
        <div
          v-for="d in completedDeals"
          :key="d.id"
          class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
        >
          <div class="min-w-0">
            <div class="text-xs font-bold text-slate-900 truncate">
              {{ d.listing_judul || 'Pasokan Limbah UMKM' }}
            </div>
            <div class="text-[11px] text-slate-500 truncate">
              ID Kesepakatan: #{{ d.id.substring(0, 8) }}
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="text-xs font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
              {{ d.volume_aktual || d.volume_aktual_kg || 0 }} {{ d.satuan }}
            </span>
            <div class="text-[10px] text-emerald-600 font-bold mt-0.5">✓ Selesai</div>
          </div>
        </div>

        <div v-if="completedDeals.length === 0" class="text-center py-6 text-slate-400 text-xs">
          Belum ada transaksi yang diselesaikan.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

defineEmits(['open-confirm-tx']);

const { impactMetrics, myImpactMetrics, deals, isAuthenticated } = useWasteApp();

const viewMode = ref<'publik' | 'pribadi'>('publik');

const activeMetrics = computed(() => {
  if (viewMode.value === 'pribadi' && isAuthenticated.value) {
    return myImpactMetrics.value;
  }
  return impactMetrics.value;
});

const completedDeals = computed(() => {
  return deals.value.filter(d => d.status === 'selesai');
});
</script>
