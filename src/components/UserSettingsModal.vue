<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
  >
    <div
      class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto space-y-5"
    >
      <!-- Header Modal -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>⚙️</span> Pengaturan Akun & Privasi (U7)
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Kelola profil usaha dan kepatuhan privasi UU PDP
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Ringkasan Akun -->
      <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
        <div class="flex items-center justify-between font-bold text-slate-700">
          <span>Email Terdaftar:</span>
          <span class="font-mono text-slate-900">{{ currentUser?.email || 'mebel.cakmul@umkm.id' }}</span>
        </div>
        <div class="flex items-center justify-between font-bold text-slate-700">
          <span>Peran Akun:</span>
          <span class="capitalize text-brand-700">{{ currentUser?.peran_usaha || 'penghasil & pencari' }}</span>
        </div>
        <div class="flex items-center justify-between font-bold text-slate-700">
          <span>Status Akun:</span>
          <span class="capitalize text-emerald-700 font-black">{{ currentUser?.status_akun || 'aktif' }}</span>
        </div>
      </div>

      <!-- Tombol Aksi Profil -->
      <div class="space-y-2">
        <button
          @click="$emit('open-profile-edit')"
          class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-between"
        >
          <span class="flex items-center gap-2">
            <span>🏪</span>
            <span>Ubah Data Profil Usaha & Lokasi</span>
          </span>
          <span>→</span>
        </button>

        <button
          @click="$emit('open-verify-location')"
          class="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition flex items-center justify-between"
        >
          <span class="flex items-center gap-2">
            <span>📍</span>
            <span>Verifikasi Ulang Lokasi Usaha (Lencana 2)</span>
          </span>
          <span>→</span>
        </button>
      </div>

      <!-- Zona Bahaya: Hapus Akun & Data (UU PDP) -->
      <div class="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-3">
        <div class="text-xs font-bold text-red-950 flex items-center gap-1.5">
          <span>⚠️</span> Zona Penghapusan Akun (Hak UU PDP)
        </div>
        <p class="text-[11px] text-red-800 leading-relaxed">
          Sesuai ketentuan UU Perlindungan Data Pribadi, Anda berhak menghapus akun beserta seluruh data listing, kontak, dan riwayat usaha Anda dari sistem. Tindakan ini bersifat permanen.
        </p>

        <button
          @click="confirmDeleteAccount"
          class="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition shadow-sm"
        >
          🗑️ Hapus Akun & Seluruh Data Saya
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWasteApp } from '../composables/useWasteApp';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'open-profile-edit', 'open-verify-location']);

const { currentUser, deleteAccount } = useWasteApp();

function confirmDeleteAccount() {
  const confirmed = confirm(
    'PERINGATAN HUKUM UU PDP:\n\nApakah Anda yakin ingin menghapus akun Anda beserta seluruh data postingan limbah dan riwayat transaksi secara permanen?\n\nTindakan ini tidak dapat dibatalkan.'
  );
  if (confirmed) {
    deleteAccount();
    emit('close');
  }
}
</script>
