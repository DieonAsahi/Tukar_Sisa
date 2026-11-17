<template>
  <div v-if="currentUser && isAccountSanctioned" class="bg-red-600 text-white p-4 rounded-2xl shadow-lg border border-red-700 space-y-2 mb-3">
    <div class="flex items-start gap-2.5">
      <svg class="w-6 h-6 flex-shrink-0 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <h3 class="text-sm font-black uppercase tracking-wide">
          Akun Usaha Anda Sedang {{ currentUser.status_akun === 'diblokir' ? 'DIBLOKIR PERMANEN' : 'DITANGGUHKAN SEMENTARA' }}
        </h3>
        <p class="text-xs text-red-100 mt-1 leading-relaxed">
          Semua postingan sisa limbah Anda disembunyikan dari katalog publik untuk sementara waktu.
        </p>
      </div>
    </div>

    <!-- Alasan Sanksi Resmi dari Admin Pengawas -->
    <div class="bg-red-800/80 p-3 rounded-xl border border-red-500/50 text-xs">
      <div class="text-[11px] font-bold text-red-200 uppercase tracking-wider mb-0.5">
        Alasan Sanksi dari Administrator:
      </div>
      <p class="font-semibold text-white leading-relaxed">
        "{{ currentUser.alasan_sanksi || 'Pelanggaran ketentuan keselamatan dan keaslian alamat UMKM.' }}"
      </p>
    </div>

    <div class="text-[11px] text-red-200 text-right">
      Hubungi admin pengawas melalui email <strong>bantuan@bursa-limbah.id</strong> jika ingin mengajukan peninjauan ulang.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWasteApp } from '../composables/useWasteApp';

const { currentUser, isAccountSanctioned } = useWasteApp();
</script>

