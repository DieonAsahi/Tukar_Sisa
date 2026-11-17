<template>
  <div v-if="listing" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-extrabold text-slate-900">Laporkan Listing Ini</h2>
          <p class="text-[11px] text-slate-500 font-medium">Bantu kami menjaga ekosistem UMKM yang aman & terpercaya</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
        <!-- Target Listing Ringkas -->
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
          <div class="font-bold text-slate-900">{{ listing.judul }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Pemilik: {{ listing.nama_usaha }}</div>
        </div>

        <!-- 4 Pilihan Alasan Wajib (PRD F12) -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Pilih Alasan Pelaporan <span class="text-red-500">*</span>
          </label>
          <div class="space-y-2">
            <label
              v-for="r in reportReasons"
              :key="r"
              class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 cursor-pointer transition capitalize"
            >
              <input
                type="radio"
                name="reason"
                :value="r"
                v-model="selectedReason"
                class="accent-red-600 w-4 h-4"
                required
              />
              <span>{{ r }}</span>
            </label>
          </div>
        </div>

        <!-- Rincian Masalah -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Jelaskan Rincian Masalah <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="details"
            rows="3"
            required
            placeholder="Contoh: Saat dihubungi via WA ternyata limbahnya adalah oli bekas bengkel, bukan serbuk kayu."
            class="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none"
          ></textarea>
        </div>

        <!-- Tombol Kirim -->
        <button
          type="submit"
          class="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Kirim Laporan Pelanggaran</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WasteListing, AlasanLaporan } from '../types';
import { useWasteApp } from '../composables/useWasteApp';

const props = defineProps<{
  listing: WasteListing | null;
}>();

const emit = defineEmits(['close']);

const { submitReport } = useWasteApp();

const reportReasons: AlasanLaporan[] = [
  'alamat tidak sesuai',
  'barang tidak sesuai',
  'kategori terlarang',
  'perilaku mengganggu'
];

const selectedReason = ref<AlasanLaporan>('barang tidak sesuai');
const details = ref('');

function handleSubmit() {
  if (!props.listing) return;
  const ok = submitReport(props.listing.id, 'listing', selectedReason.value, details.value);
  if (ok) {
    alert(
      `Laporan Anda telah berhasil dikirim ke Antrean Moderasi Admin /admin:\n` +
      `- Alasan: ${selectedReason.value}\n` +
      `- Terlapor: ${props.listing.nama_usaha}\n\n` +
      `Admin akan memeriksa laporan ini demi keselamatan ekosistem UMKM.`
    );
    emit('close');
  }
}
</script>
