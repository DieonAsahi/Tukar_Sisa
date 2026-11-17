<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
  >
    <div
      class="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col"
    >
      <!-- Header Modal -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>📦</span> Pasang Kebutuhan Bahan Baku (U11)
          </h2>
          <p class="text-[11px] text-slate-500 font-medium">Beri tahu penghasil limbah bahan apa yang Anda cari</p>
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
        <!-- Kategori Bahan -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Pilih Jenis Bahan Baku Non-B3 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.category_id"
            required
            class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white outline-none"
          >
            <option value="" disabled>-- Pilih Kategori --</option>
            <option
              v-for="cat in allowedCategories"
              :key="cat.id"
              :value="cat.id"
            >
              ♻️ {{ cat.nama }}
            </option>
          </select>
        </div>

        <!-- Judul Singkat -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Judul Kebutuhan <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.judul"
            type="text"
            required
            placeholder="Contoh: Dicari Serbuk Kayu Bersih untuk Jamur"
            class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white outline-none"
          />
        </div>

        <!-- Volume & Satuan -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Volume Dibutuhkan <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.volume_dibutuhkan"
              type="number"
              min="1"
              required
              placeholder="100"
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Satuan
            </label>
            <select
              v-model="form.satuan"
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white outline-none"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="karung">Karung</option>
              <option value="liter">Liter</option>
              <option value="ikat">Ikat</option>
            </select>
          </div>
        </div>

        <!-- Frekuensi Kebutuhan -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Frekuensi Kebutuhan
          </label>
          <select
            v-model="form.frekuensi"
            class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white outline-none"
          >
            <option value="rutin_mingguan">Rutin Setiap Minggu</option>
            <option value="rutin_bulanan">Rutin Setiap Bulan</option>
            <option value="insidental">Insidental (Sewaktu-waktu)</option>
          </select>
        </div>

        <!-- Radius Pilihan (1-100 km) -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Radius Maksimal Penjemputan
            </label>
            <span class="text-xs font-extrabold text-brand-700">{{ form.radius_km }} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            v-model.number="form.radius_km"
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>

        <!-- Deskripsi Singkat -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Keterangan Spesifikasi Bahan
          </label>
          <textarea
            v-model="form.deskripsi"
            rows="2"
            placeholder="Jelaskan kondisi bahan yang dicari (misal: kering, non-minyak, siap jemput mandiri)"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white outline-none"
          ></textarea>
        </div>

        <!-- Tombol Terbitkan Kebutuhan -->
        <button
          type="submit"
          class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold rounded-2xl shadow-md transition"
        >
          Terbitkan Kebutuhan Bahan Baku
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';
import { SatuanLimbah } from '../types';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);

const { allowedCategories, createMaterialRequest } = useWasteApp();

const form = reactive({
  category_id: '',
  judul: '',
  deskripsi: '',
  volume_dibutuhkan: 100,
  satuan: 'kg' as SatuanLimbah,
  frekuensi: 'rutin_mingguan',
  radius_km: 25
});

function handleSubmit() {
  if (!form.category_id || !form.judul) {
    alert('Harap isi kategori dan judul kebutuhan bahan.');
    return;
  }

  const ok = createMaterialRequest({
    category_id: form.category_id,
    judul: form.judul,
    deskripsi: form.deskripsi || 'Dicari pasokan limbah rutin untuk diolah kembali.',
    volume_dibutuhkan: form.volume_dibutuhkan,
    satuan: form.satuan,
    frekuensi: form.frekuensi,
    radius_km: form.radius_km
  });

  if (ok) {
    alert('Permintaan bahan baku berhasil diposting!');
    emit('close');
  }
}
</script>
