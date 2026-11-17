<template>
  <div class="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
    <!-- Lencana 1: Email Terverifikasi -->
    <span
      v-if="isEmailVerified"
      class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 border border-blue-200"
      title="Terverifikasi melalui OTP Email resmi"
    >
      <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
      </svg>
      Email Terverifikasi
    </span>

    <!-- Lencana 2: Lokasi Terverifikasi vs Belum Terverifikasi -->
    <span
      v-if="isLocationVerified"
      class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 border border-emerald-300 font-bold"
      title="Titik GPS fisik tervalidasi toleransi <= 200m dari kamera tempat usaha"
    >
      <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Lokasi Terverifikasi
    </span>
    <span
      v-else
      class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-800 border border-amber-300 font-medium"
      title="Pengguna belum melakukan verifikasi GPS di tempat usahanya"
    >
      <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      Lokasi belum terverifikasi
    </span>

    <!-- Lencana 3: Transaksi Terkonfirmasi -->
    <span
      v-if="hasConfirmedTransactions"
      class="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-purple-700 border border-purple-200"
      title="Telah menyelesaikan transaksi sirkular nyata dengan UMKM lain"
    >
      <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
      Transaksi Sukses
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isEmailVerified?: boolean;
  isLocationVerified?: boolean;
  hasConfirmedTransactions?: boolean;
}>();
</script>

