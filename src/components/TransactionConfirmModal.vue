<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>🤝</span> Konfirmasi Transaksi Dua Pihak (U17 & U18)
          </h2>
          <p class="text-[11px] text-slate-500 font-medium">Validasi serah terima sisa limbah & penilaian barang</p>
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

      <div class="p-5 space-y-4">
        <!-- Info Listing / Deal -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
          <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Kesepakatan Serah Terima Limbah Antar-UMKM
          </div>
          <div class="text-sm font-extrabold text-slate-900">
            {{ targetDeal?.listing_judul || 'Serbuk Gergaji Halus Kayu Jati & Mahoni Bersih' }}
          </div>
          <div class="text-xs text-slate-600 flex justify-between pt-1 border-t border-slate-200/60">
            <span>Penghasil: <strong>{{ targetDeal?.provider_nama || 'Mebel Kayu Berkah Cak Mul' }}</strong></span>
            <span>Pencari: <strong>{{ targetDeal?.seeker_nama || 'Budidaya Jamur Sejahtera' }}</strong></span>
          </div>
        </div>

        <!-- Status Konfirmasi Dua Pihak (U17) -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div
            class="p-2.5 rounded-xl border flex items-center gap-1.5 font-bold"
            :class="hasProviderConfirmed ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'"
          >
            <span v-if="hasProviderConfirmed">✓</span>
            <span v-else class="animate-pulse">⏳</span>
            <span>Penghasil: {{ hasProviderConfirmed ? 'Selesai' : 'Menunggu' }}</span>
          </div>

          <div
            class="p-2.5 rounded-xl border flex items-center gap-1.5 font-bold"
            :class="hasSeekerConfirmed ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'"
          >
            <span v-if="hasSeekerConfirmed">✓</span>
            <span v-else class="animate-pulse">⏳</span>
            <span>Pencari: {{ hasSeekerConfirmed ? 'Selesai' : 'Menunggu' }}</span>
          </div>
        </div>

        <!-- Input Volume & Harga Aktual (U17) -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Volume Riil Diserahkan <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-1.5">
              <input
                v-model.number="actualVolume"
                type="number"
                min="1"
                required
                placeholder="100"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-extrabold text-slate-800 focus:bg-white outline-none"
              />
              <span class="text-xs font-bold text-slate-500">{{ targetDeal?.satuan || 'satuan' }}</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Total Biaya (Rp)
            </label>
            <input
              v-model.number="actualPrice"
              type="number"
              min="0"
              placeholder="0 (Gratis)"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-extrabold text-slate-800 focus:bg-white outline-none"
            />
          </div>
        </div>

        <!-- Kalkulasi Konversi Satuan & Dampak Riil (S6) -->
        <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
          <div class="font-extrabold text-emerald-900 flex items-center gap-1">
            <span>🌱</span> Kalkulasi Dampak Otomatis (S6):
          </div>
          <div class="text-emerald-800 text-[11px] font-medium leading-relaxed">
            {{ actualVolume }} {{ targetDeal?.satuan || 'satuan' }} × faktor {{ conversionFactor }} kg = 
            <strong class="font-black text-emerald-950">{{ calculatedKg }} kg limbah dialihkan dari TPA</strong>.
            Estimasi penghematan biaya buang: <strong class="text-emerald-950">Rp {{ (calculatedKg * 450).toLocaleString('id-ID') }}</strong>.
          </div>
        </div>

        <!-- U18: Penilaian Singkat Kesesuaian Barang -->
        <div class="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
          <label class="block text-xs font-bold text-blue-950">
            Penilaian Singkat: Apakah barang limbah sesuai deskripsi? (U18) <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="sesuaiDeskripsi = true"
              :class="[
                'py-2 px-3 text-xs font-extrabold rounded-xl border transition flex items-center justify-center gap-1.5',
                sesuaiDeskripsi === true ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200'
              ]"
            >
              <span>👍</span>
              <span>Ya, Sesuai</span>
            </button>

            <button
              type="button"
              @click="sesuaiDeskripsi = false"
              :class="[
                'py-2 px-3 text-xs font-extrabold rounded-xl border transition flex items-center justify-center gap-1.5',
                sesuaiDeskripsi === false ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200'
              ]"
            >
              <span>👎</span>
              <span>Tidak Sesuai</span>
            </button>
          </div>
        </div>

        <!-- Opsi Simulasi Konfirmasi Pihak Kedua Otomatis (Untuk Kemudahan Demo 3 Menit) -->
        <label class="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs">
          <input
            v-model="simulateBothParties"
            type="checkbox"
            class="rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5"
          />
          <div>
            <strong class="text-slate-800">Simulasi Konfirmasi Otomatis Pihak Kedua (Demo 3 Menit)</strong>
            <p class="text-[11px] text-slate-500 mt-0.5">
              Centang untuk langsung menyelesaikan transaksi 2 pihak secara simultan tanpa harus berganti akun demo.
            </p>
          </div>
        </label>

        <!-- Tombol Konfirmasi Selesai -->
        <button
          @click="handleConfirm"
          :disabled="!actualVolume || actualVolume <= 0"
          class="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ simulateBothParties ? 'Selesaikan Transaksi & Tambah ke Dashboard Dampak' : 'Kirim Konfirmasi Pihak Anda' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Deal } from '../types';
import { useWasteApp } from '../composables/useWasteApp';

const props = defineProps<{
  deal?: Deal | null;
  transaction?: any;
}>();

const emit = defineEmits(['close']);

const { deals, confirmDeal, listings, categories, currentUser } = useWasteApp();

const targetDeal = ref<Deal | null>(props.deal || deals.value[0] || null);
const actualVolume = ref<number>(targetDeal.value?.volume_aktual || 100);
const actualPrice = ref<number>(targetDeal.value?.harga_aktual || 0);
const sesuaiDeskripsi = ref<boolean>(true);
const simulateBothParties = ref<boolean>(true);

const hasProviderConfirmed = computed(() => {
  return !!targetDeal.value?.konfirmasi_penghasil_pada;
});

const hasSeekerConfirmed = computed(() => {
  return !!targetDeal.value?.konfirmasi_pencari_pada;
});

const conversionFactor = computed(() => {
  if (!targetDeal.value) return 1;
  const l = listings.value.find(item => item.id === targetDeal.value?.listing_id);
  const c = categories.value.find(item => item.id === l?.category_id);
  return c?.faktor_ke_kg || 1;
});

const calculatedKg = computed(() => {
  return (actualVolume.value || 0) * conversionFactor.value;
});

function handleConfirm() {
  if (!targetDeal.value || !actualVolume.value) return;

  const ok = confirmDeal(
    targetDeal.value.id,
    actualVolume.value,
    actualPrice.value,
    sesuaiDeskripsi.value,
    simulateBothParties.value
  );

  if (ok) {
    if (simulateBothParties.value) {
      alert(
        `Selamat! Transaksi sebesar ${actualVolume.value} ${targetDeal.value.satuan || 'satuan'} (${calculatedKg.value} kg) telah terkonfirmasi selesai oleh kedua pihak.\n\n` +
        `Dampak sirkular langsung tercatat di Dashboard Dampak Publik (SDG 12) dan Lencana Transaksi Sukses akun Anda telah aktif!`
      );
    } else {
      alert(
        `Konfirmasi Anda telah dicatat!\n\n` +
        `Transaksi berstatus 'menunggu konfirmasi rekanan' dan baru menambah Dashboard Dampak setelah pihak kedua memberikan konfirmasi.`
      );
    }
    emit('close');
  }
}
</script>
