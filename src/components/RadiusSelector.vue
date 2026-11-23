<template>
  <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-3">
    <!-- Header Jarak & GPS -->
    <div class="flex items-center justify-between gap-2 mb-2">
      <div>
        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">
          Radius Pencarian Sisa
        </label>
        <div class="flex items-baseline gap-1.5 mt-0.5">
          <span v-if="radiusKm === 0" class="text-2xl font-black text-brand-700">
            Sekitar Saya
          </span>
          <span v-else class="text-2xl font-black text-brand-700">
            {{ radiusKm }}
          </span>
          <span v-if="radiusKm === 0" class="text-xs font-semibold text-slate-500">
            (&lt; 2 km)
          </span>
          <span v-else class="text-sm font-bold text-slate-600">
            Kilometer
          </span>
        </div>
      </div>

      <!-- Tombol Ambil GPS Saat Ini (Sekali Baca Saja) -->
      <button
        @click="handleDetectGps"
        :disabled="isLocating"
        class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition disabled:opacity-60"
        title="Ambil lokasi GPS perangkat sekali untuk menentukan acuan jarak"
      >
        <svg v-if="!isLocating" class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <svg v-else class="w-4 h-4 text-brand-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>{{ isLocating ? 'Membaca GPS...' : 'Gunakan GPS' }}</span>
      </button>
    </div>

    <!-- Slider Bar (0 - 100 km, default 10 km) -->
    <div class="space-y-2">
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        v-model.number="radiusKm"
        class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
      />

      <div class="flex justify-between text-[11px] font-semibold text-slate-400">
        <span>Sekitar saya</span>
        <span>10 km (Default)</span>
        <span>50 km</span>
        <span>100 km</span>
      </div>
    </div>

    <!-- Presets Cepat -->
    <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
      <button
        v-for="item in presets"
        :key="item.value"
        @click="radiusKm = item.value"
        :class="[
          'px-2.5 py-1 text-xs font-bold rounded-lg transition',
          radiusKm === item.value
            ? 'bg-brand-600 text-white shadow-sm'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        ]"
      >
        {{ item.label }}
      </button>
    </div>

    <!-- Info Privasi Jarak -->
    <div class="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
      <span class="text-sm">🛡️</span>
      <span>Jarak antar-pengguna hanya perkiraan (~1 km). Lokasi fisik dan alamat tidak pernah disimpan atau ditampilkan.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

const { radiusKm, viewerCoords } = useWasteApp();

const isLocating = ref(false);

const presets = [
  { label: 'Sekitar saya', value: 0 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
  { label: '100 km', value: 100 }
];

async function handleDetectGps() {
  if (!navigator.geolocation) {
    alert('Perangkat Anda tidak mendukung fitur deteksi GPS.');
    return;
  }
  isLocating.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // Perbarui titik acak tampilan (koordinat langsung disimpan di ref viewerCoords untuk hitung jarak lokal)
      viewerCoords.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      isLocating.value = false;
      alert('Lokasi acuan pencarian berhasil disesuaikan dengan GPS perangkat Anda.');
    },
    (err) => {
      isLocating.value = false;
      alert('Tidak dapat membaca GPS: ' + (err.message || 'Izin lokasi belum diberikan.'));
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}
</script>
