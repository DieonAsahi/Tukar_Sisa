<template>
  <div class="relative w-full h-64 sm:h-72 lg:h-[420px] bg-slate-200 rounded-2xl overflow-hidden border border-slate-300 shadow-inner mb-3">
    <!-- SVG Canvas Peta Interaktif -->
    <svg class="w-full h-full cursor-grab active:cursor-grabbing bg-[#e5e9ec]" viewBox="0 0 500 350">
      <defs>
        <!-- Pola Grid Peta Jalan -->
        <pattern id="road-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5dbe0" stroke-width="1.5" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="#f0f3f6" stroke-width="0.8" />
          <line x1="20" y1="0" x2="20" y2="40" stroke="#f0f3f6" stroke-width="0.8" />
        </pattern>
        <!-- Efek Bayangan Pin -->
        <filter id="pin-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3" />
        </filter>
      </defs>

      <!-- Background Grid -->
      <rect width="100%" height="100%" fill="url(#road-grid)" />

      <!-- Sungai / Elemen Geografis Kota Simbolik -->
      <path d="M-10,180 Q150,120 280,210 T510,170" fill="none" stroke="#bfdbfe" stroke-width="14" opacity="0.7" />

      <!-- Lingkaran Radius Pencarian Aktif -->
      <circle
        :cx="centerCanvasX"
        :cy="centerCanvasY"
        :r="mapRadiusPx"
        fill="#22c55e"
        fill-opacity="0.08"
        stroke="#16a34a"
        stroke-width="1.5"
        stroke-dasharray="4 3"
      />

      <!-- Titik Acuan Lokasi Pengguna (Pencari) -->
      <g :transform="`translate(${centerCanvasX}, ${centerCanvasY})`">
        <!-- Lingkaran Denyut GPS -->
        <circle r="18" fill="#3b82f6" fill-opacity="0.2" class="animate-ping" />
        <circle r="8" fill="#2563eb" stroke="#ffffff" stroke-width="2.5" />
        <text y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e3a8a">
          Titik Anda
        </text>
      </g>

      <!-- Marker / Lingkaran Listing Limbah -->
      <g
        v-for="item in mappedListings"
        :key="item.id"
        @click="$emit('select-listing', item)"
        class="cursor-pointer group"
      >
        <!-- KONDISI 1: PENGUNJUNG TAMU (Tanpa Login) -> Tampilkan LINGKARAN AREA PERKIRAAN SAMAR (PRD Bagian 2) -->
        <template v-if="item.is_contact_locked">
          <!-- Lingkaran area perkiraan (~800 meter) -->
          <circle
            :cx="item.mapX"
            :cy="item.mapY"
            r="32"
            fill="#f59e0b"
            fill-opacity="0.22"
            stroke="#d97706"
            stroke-width="1.8"
            stroke-dasharray="3 3"
            class="group-hover:fill-opacity-35 transition"
          />
          <!-- Titik pusat samar -->
          <circle :cx="item.mapX" :cy="item.mapY" r="5" fill="#d97706" stroke="#ffffff" stroke-width="1.5" />

          <rect
            :x="item.mapX - 44"
            :y="item.mapY + 8"
            width="88"
            height="18"
            rx="4"
            fill="#ffffff"
            stroke="#e2e8f0"
            filter="url(#pin-shadow)"
          />
          <text
            :x="item.mapX"
            :y="item.mapY + 21"
            text-anchor="middle"
            font-size="9"
            font-weight="bold"
            fill="#475569"
          >
            Area ~{{ item.jarak_km }} km
          </text>
        </template>

        <!-- KONDISI 2: PENGGUNA TERVERIFIKASI -> Tampilkan PIN KOORDINAT PRESISI -->
        <template v-else>
          <g :transform="`translate(${item.mapX}, ${item.mapY})`" filter="url(#pin-shadow)">
            <!-- Pin Icon -->
            <path
              d="M0 0 C-8 -8 -12 -16 -12 -24 A12 12 0 1 1 12 -24 C12 -16 8 -8 0 0 Z"
              :fill="(item.is_lokasi_terverifikasi ?? item.lokasi_terverifikasi) ? '#16a34a' : '#f59e0b'"
              stroke="#ffffff"
              stroke-width="1.5"
            />
            <circle cx="0" cy="-24" r="5" fill="#ffffff" />
            <text y="-32" text-anchor="middle" font-size="10" font-weight="extrabold" fill="#0f172a">
              {{ (item.nama_usaha || 'UMKM').split(' ')[0] }}
            </text>
          </g>
        </template>
      </g>
    </svg>

    <!-- Banner Info Privasi Pengunjung Tamu -->
    <div
      v-if="!isAuthenticated"
      class="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur text-white text-[11px] px-3 py-1.5 rounded-xl flex items-center justify-between gap-2 shadow"
    >
      <div class="flex items-center gap-1.5 truncate">
        <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span class="truncate">
          <strong>Mode Tamu:</strong> Titik koordinat presisi disamarkan.
        </span>
      </div>
      <button
        @click="openAuthModal"
        class="text-amber-300 font-bold underline flex-shrink-0 hover:text-white"
      >
        Buka Akses
      </button>
    </div>

    <!-- Status Verifikasi Peta jika sudah login -->
    <div
      v-else
      class="absolute top-2 right-2 bg-white/90 backdrop-blur text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      Koordinat Presisi Terbuka
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { WasteListing } from '../types';
import { useWasteApp } from '../composables/useWasteApp';

const props = defineProps<{
  listings: WasteListing[];
}>();

defineEmits(['select-listing']);

const { radiusKm, isAuthenticated, isAuthModalOpen } = useWasteApp();

const centerCanvasX = 250;
const centerCanvasY = 175;

const mapRadiusPx = computed(() => {
  return Math.min(160, Math.max(40, radiusKm.value * 7.5));
});

const mappedListings = computed(() => {
  const centerLat = -7.2655;
  const centerLng = 112.7480;

  return props.listings.map((item) => {
    const lat = item.exact_latitude ?? item.approx_latitude;
    const lng = item.exact_longitude ?? item.approx_longitude;

    const deltaLat = (lat - centerLat) * 900;
    const deltaLng = (lng - centerLng) * 900;

    return {
      ...item,
      mapX: Math.min(460, Math.max(40, centerCanvasX + deltaLng)),
      mapY: Math.min(310, Math.max(40, centerCanvasY - deltaLat))
    };
  });
});

function openAuthModal() {
  isAuthModalOpen.value = true;
}
</script>
