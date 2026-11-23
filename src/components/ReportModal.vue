<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div
      class="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
    >
      <!-- Header Modal -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
            <span>🚨</span>
            <span>Laporkan Pelanggaran</span>
          </h2>
          <p class="text-[11px] text-slate-500 font-medium">
            Laporan pengaduan wajib menyertakan foto bukti fisik
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>
      </div>

      <!-- Body Form -->
      <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
        <!-- Rincian Target yang Dilaporkan -->
        <div class="p-3 bg-red-50/70 border border-red-200 rounded-2xl text-xs space-y-1">
          <div class="text-red-800 font-bold uppercase text-[10px]">Target Pengaduan</div>
          <div class="font-black text-slate-900">
            {{ targetTitle }}
          </div>
          <div v-if="terlaporNama" class="text-slate-600 font-medium text-[11px]">
            Pengguna terlapor: <strong class="text-slate-900">{{ terlaporNama }}</strong>
          </div>
        </div>

        <!-- 1. Alasan Pengaduan -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-700">
            Alasan Pengaduan <strong class="text-red-500">*</strong>
          </label>
          <select
            v-model="alasan"
            required
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="" disabled>-- Pilih Alasan Pelanggaran --</option>
            <option value="Limbah B3 / Barang Terlarang">Limbah B3 / Barang Terlarang (Baterai, Aki, Obat, dll)</option>
            <option value="Barang Tidak Sesuai Deskripsi / Rusak">Barang Tidak Sesuai Deskripsi / Rusak / Bercampur Sampah</option>
            <option value="Alamat Fiktif / Tidak Bisa Ditemui">Alamat Fiktif / Rekan Tidak Bisa Ditemui</option>
            <option value="Perilaku Mengganggu / Penipuan">Perilaku Kasar / Meminta Uang Transfer di Muka</option>
            <option value="Lainnya">Pelanggaran Aturan Lainnya</option>
          </select>
        </div>

        <!-- 2. Catatan Rincian Kejadian -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-700">
            Rincian & Kronologi Kejadian <strong class="text-red-500">*</strong>
          </label>
          <textarea
            v-model="catatan"
            required
            rows="3"
            placeholder="Jelaskan secara jelas apa yang terjadi saat Anda memeriksa barang atau menghubungi rekan..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>
        </div>

        <!-- 3. Foto Bukti (WAJIB SESUAI PRD) -->
        <div class="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-800">
              Foto Bukti Fisik <strong class="text-red-500">* (Wajib)</strong>
            </label>
            <span class="text-[10px] text-red-600 font-extrabold uppercase">Wajib Dilampirkan</span>
          </div>

          <!-- Preview Foto Bukti -->
          <div v-if="fotoBukti" class="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
            <img :src="fotoBukti" class="w-full h-full object-cover" />
            <button
              type="button"
              @click="fotoBukti = ''"
              class="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow"
            >
              ✕
            </button>
          </div>

          <div v-else class="space-y-2">
            <div class="flex gap-2">
              <button
                type="button"
                @click="setSamplePhoto('https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80')"
                class="px-3 py-1.5 bg-white border border-slate-300 hover:border-red-400 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                + Lampirkan Foto Bukti Sampah Kotor
              </button>
              <button
                type="button"
                @click="setSamplePhoto('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80')"
                class="px-3 py-1.5 bg-white border border-slate-300 hover:border-red-400 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                + Foto Limbah Berbahaya
              </button>
            </div>
            <p class="text-[11px] text-slate-500 leading-relaxed">
              Laporan tanpa foto bukti fisik tidak akan diproses oleh tim pengawas platform.
            </p>
          </div>
        </div>

        <!-- Tombol Kirim -->
        <div class="pt-1">
          <button
            type="submit"
            :disabled="!fotoBukti || isSubmitting"
            class="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-red-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>Kirim Laporan Pengaduan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { WasteListing, TargetLaporan } from '../types';
import { useWasteApp } from '../composables/useWasteApp';

const props = defineProps<{
  listing?: WasteListing | null;
  targetType?: TargetLaporan;
  targetId?: string;
  targetTitle?: string;
  terlaporNama?: string;
}>();

const emit = defineEmits(['close']);

const { submitReport } = useWasteApp();

const alasan = ref('');
const catatan = ref('');
const fotoBukti = ref('https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80');
const isSubmitting = ref(false);

const targetType = computed<TargetLaporan>(() => {
  return props.targetType || 'listing';
});

const targetId = computed<string>(() => {
  return props.targetId || props.listing?.id || 'target-id';
});

const targetTitle = computed<string>(() => {
  return props.targetTitle || props.listing?.judul || 'Postingan Sisa';
});

const terlaporNama = computed<string>(() => {
  return props.terlaporNama || props.listing?.nama_tampilan || '';
});

function setSamplePhoto(url: string) {
  fotoBukti.value = url;
}

async function handleSubmit() {
  if (!fotoBukti.value) {
    alert('Foto bukti wajib dilampirkan!');
    return;
  }

  isSubmitting.value = true;
  try {
    const res = await submitReport({
      target_type: targetType.value,
      target_id: targetId.value,
      target_judul: targetTitle.value,
      terlapor_id: props.listing?.user_id,
      terlapor_nama: terlaporNama.value,
      alasan: alasan.value,
      catatan: catatan.value,
      foto_bukti: fotoBukti.value
    });

    if (res.success) {
      emit('close');
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
