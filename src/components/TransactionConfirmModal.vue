<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div
      class="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
    >
      <!-- Header Modal -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
            <span>🤝</span>
            <span>Konfirmasi Serah Terima Sisa</span>
          </h2>
          <p class="text-[11px] text-slate-500 font-medium">
            Status: <span class="uppercase font-bold text-brand-700">{{ deal.status }}</span>
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>
      </div>

      <!-- Body Modal -->
      <div class="p-5 space-y-4">
        <!-- Rincian Transaksi -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
          <div class="text-xs text-slate-500 font-bold uppercase tracking-wider">Postingan Sisa</div>
          <div class="font-extrabold text-slate-900 text-sm">
            {{ deal.listing_judul }}
          </div>
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span class="text-slate-400 block text-[10px]">Pemasok:</span>
              <strong class="text-slate-800">{{ deal.pemasok_nama }}</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Pencari:</span>
              <strong class="text-slate-800">{{ deal.pencari_nama }}</strong>
            </div>
          </div>
        </div>

        <!-- Input Jumlah Akhir yang Diterima -->
        <div v-if="deal.status === 'berjalan' || deal.status === 'menunggu_otomatis'" class="space-y-2 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <label class="text-xs font-bold text-slate-800 block">
            Jumlah Akhir yang Diserahkan / Diterima:
          </label>
          <div class="flex items-center gap-2">
            <input
              type="number"
              min="0.1"
              step="any"
              v-model.number="actualQty"
              required
              class="w-32 bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm font-extrabold text-slate-900 outline-none"
            />
            <span class="text-xs font-extrabold text-slate-700">{{ deal.satuan || 'kg' }}</span>
          </div>
          <p class="text-[11px] text-slate-600 leading-relaxed">
            Kedua pihak saling mengonfirmasi jumlah akhir. Begitu selesai, stok postingan akan otomatis berkurang dan tercatat dalam dampak lingkungan.
          </p>

          <!-- Toggle Simulasi Kedua Pihak (Untuk Kemudahan Uji Coba Demo) -->
          <div class="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
            <label class="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" v-model="simulateBoth" class="rounded accent-emerald-600" />
              <span>Simulasi konfirmasi kedua pihak sekaligus (Demo Cepat)</span>
            </label>
          </div>
        </div>

        <!-- Tombol Aksi Konfirmasi -->
        <div v-if="deal.status === 'berjalan' || deal.status === 'menunggu_otomatis'" class="space-y-2 pt-1">
          <button
            @click="handleConfirm"
            class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <span>✓ Konfirmasi Transaksi Selesai</span>
          </button>

          <!-- Tombol Aduan Transaksi (Dalam masa 3 hari) -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              @click="isDisputeFormOpen = !isDisputeFormOpen"
              class="text-xs text-red-600 hover:text-red-700 font-bold hover:underline"
            >
              ⚠️ Ajukan Aduan Transaksi
            </button>
            <button
              @click="handleCancel"
              class="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Batalkan Transaksi
            </button>
          </div>

          <!-- Form Aduan -->
          <div v-if="isDisputeFormOpen" class="p-3 bg-red-50 border border-red-200 rounded-2xl space-y-2 mt-2">
            <label class="text-xs font-bold text-red-900 block">Jelaskan Permasalahan:</label>
            <textarea
              v-model="disputeReason"
              rows="2"
              placeholder="Contoh: Barang tidak sesuai jumlah atau rekan membatalkan sepihak..."
              class="w-full bg-white border border-red-300 rounded-xl p-2 text-xs text-slate-800 outline-none"
            ></textarea>
            <button
              @click="handleDispute"
              class="w-full py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Kirim Aduan ke Admin
            </button>
          </div>
        </div>

        <!-- Status Selesai -->
        <div v-else-if="deal.status === 'selesai'" class="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-center space-y-1">
          <div class="text-2xl">🎉</div>
          <div class="text-sm font-black text-emerald-900">Transaksi Telah Selesai</div>
          <p class="text-xs text-emerald-800">
            Sebanyak {{ deal.jumlah_akhir || deal.jumlah_diminta }} {{ deal.satuan }} telah berhasil dialihkan dan dimanfaatkan ulang.
          </p>
        </div>

        <!-- Status Dalam Aduan -->
        <div v-else-if="deal.status === 'dalam_aduan'" class="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-center space-y-1">
          <div class="text-2xl">⚖️</div>
          <div class="text-sm font-black text-amber-900">Transaksi Dalam Peninjauan Admin</div>
          <p class="text-xs text-amber-800">
            Aduan telah diterima. Admin sedang memeriksa dan akan memutuskan status akhir transaksi ini.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Deal } from '../types';
import { useWasteApp } from '../composables/useWasteApp';

const props = defineProps<{
  deal: Deal;
}>();

const emit = defineEmits(['close']);

const { confirmDealCompletion, disputeDeal, cancelDeal } = useWasteApp();

const actualQty = ref(props.deal.jumlah_akhir || props.deal.jumlah_diminta || 1);
const simulateBoth = ref(true);
const isDisputeFormOpen = ref(false);
const disputeReason = ref('');

async function handleConfirm() {
  const ok = await confirmDealCompletion(props.deal.id, actualQty.value, simulateBoth.value);
  if (ok) {
    alert('Konfirmasi berhasil disimpan!');
    emit('close');
  }
}

async function handleDispute() {
  if (!disputeReason.value.trim()) {
    alert('Harap tuliskan alasan aduan secara jelas.');
    return;
  }
  const ok = await disputeDeal(props.deal.id, disputeReason.value);
  if (ok) {
    emit('close');
  }
}

async function handleCancel() {
  if (confirm('Apakah Anda yakin ingin membatalkan transaksi ini? Stok postingan tidak akan berubah.')) {
    await cancelDeal(props.deal.id);
    emit('close');
  }
}
</script>
