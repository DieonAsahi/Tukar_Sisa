<template>
  <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-3">
    <!-- Header Jarak & GPS -->
    <div class="flex items-center justify-between gap-2 mb-2">
      <div>
        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">
          Radius Pencarian Sisa Limbah
        </label>
        <div class="flex items-baseline gap-1 mt-0.5">
          <span class="text-2xl font-black text-brand-700">{{ radiusKm }}</span>
          <span class="text-sm font-bold text-slate-600">Kilometer</span>
        </div>
      </div>

      <!-- Tombol Ambil GPS Saat Ini -->
      <button
        @click="handleDetectGps"
        :disabled="isLocating"
        class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition disabled:opacity-60"
        title="Sesuaikan titik tengah pencarian dari lokasi GPS perangkat Anda"
      >
        <svg v-if="!isLocating" class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <svg v-else class="w-4 h-4 text-brand-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>{{ isLocating ? 'Mencari...' : 'Gunakan GPS' }}</span>
      </button>
    </div>

    <!-- Slider Bar (1 - 100 km dinamis A12) -->
    <div class="space-y-2">
      <input
        type="range"
        min="1"
        :max="systemSettings.radius_maksimal_km || 100"
        step="1"
        :value="radiusKm"
        @input="onSliderChange"
        class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
      />

      <div class="flex justify-between text-[11px] font-semibold text-slate-400">
        <span>1 km (Sangat Dekat)</span>
        <span>10 km (Default)</span>
        <span>50 km</span>
        <span>{{ systemSettings.radius_maksimal_km || 100 }} km</span>
      </div>
    </div>

    <!-- Pilihan Cepat (Presets) -->
    <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
      <button
        v-for="km in [5, 10, 25, 50, 100]"
        :key="km"
        @click="applyPreset(km)"
        :class="[
          'px-2.5 py-1 text-xs font-bold rounded-lg transition',
          radiusKm === km
            ? 'bg-brand-600 text-white shadow-sm'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        ]"
      >
        {{ km }} km
      </button>
    </div>

    <!-- Pesan Validasi Error (Jika di luar 1 - 100 km) -->
    <div
      v-if="radiusValidationError"
      class="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2"
    >
      <svg class="w-4 h-4 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ radiusValidationError }}</span>
    </div>

    <!-- Peringatan Otomatis Transportasi Mandiri (F6/F8: jika radius > 50 km) -->
    <div
      v-if="isHighRadiusWarning"
      class="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 leading-relaxed font-medium"
    >
      <div class="flex items-start gap-2">
        <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <strong class="font-bold text-amber-950 block">Perhatian: Jarak Pengambilan > 50 km</strong>
          Pencari limbah menanggung sendiri armada kendaraan dan seluruh biaya transportasi pengambilan. Pastikan volume sisa limbah sebanding dengan ongkos jemput mandiri Anda.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

const {
  radiusKm,
  setRadius,
  radiusValidationError,
  isHighRadiusWarning,
  detectDeviceLocation,
  systemSettings
} = useWasteApp();

const isLocating = ref(false);

function onSliderChange(e: Event) {
  const target = e.target as HTMLInputElement;
  setRadius(Number(target.value));
}

function applyPreset(km: number) {
  setRadius(km);
}

async function handleDetectGps() {
  isLocating.value = true;
  try {
    await detectDeviceLocation();
  } catch (err: any) {
    alert('Tidak dapat mendeteksi GPS secara otomatis: ' + (err.message || 'Izin lokasi belum diberikan.'));
  } finally {
    isLocating.value = false;
  }
}
</script>

