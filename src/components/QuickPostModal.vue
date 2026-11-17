<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col">
      <!-- Header Modal -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-extrabold text-slate-900">Posting Sisa Limbah (1 Layar)</h2>
          <p class="text-[11px] text-slate-500 font-medium">Bantu UMKM lain, ciptakan berkah sirkular (Target &lt; 1 mnt)</p>
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

      <!-- Form Body 1 Layar -->
      <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
        <!-- Banner Draf Tersimpan Dipulihkan (PRD Hal. 20) -->
        <div v-if="draftRestored" class="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
          <div class="flex items-center gap-1.5 font-bold">
            <span>💾</span>
            <span>Draf posting sebelumnya dipulihkan</span>
          </div>
          <button
            type="button"
            @click="clearDraft"
            class="text-[11px] text-blue-700 hover:text-red-600 underline font-semibold"
          >
            Hapus Draf
          </button>
        </div>

        <!-- 1. Peringatan Daftar B3 Terlarang (Wajib) -->
        <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-900 leading-snug">
          <strong class="block text-red-950 font-bold mb-0.5">⚠️ Peraturan Limbah: Kategori B3 Dilarang!</strong>
          Dilarang keras memposting limbah medis/faskes, oli bekas, pelumas kimia, aki bekas beracun, dan zat berbahaya PP No. 22/2021.
        </div>

        <!-- 2. Pilihan Kategori Siap Pakai -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Pilih Jenis Limbah Non-B3 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.category_id"
            required
            class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="" disabled>-- Pilih Kategori Non-B3 --</option>
            <option
              v-for="cat in allowedCategories"
              :key="cat.id"
              :value="cat.id"
            >
              ♻️ {{ cat.nama }}
            </option>
          </select>
        </div>

        <!-- 3. Judul Singkat -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Judul Singkat Pasokan <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Contoh: Serbuk Gergaji Kayu Jati Halus Bersih"
            class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <!-- 4. Perkiraan Volume per Minggu & Satuan (kg, karung, liter, ikat) -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Perkiraan Volume per Minggu <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model.number="form.volume_per_week"
              type="number"
              step="any"
              min="0.1"
              required
              placeholder="Jumlah (misal: 50)"
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <select
              v-model="form.unit"
              required
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="karung">Karung</option>
              <option value="liter">Liter</option>
              <option value="ikat">Ikat</option>
            </select>
          </div>
        </div>

        <!-- 5. Foto Kamera Langsung (capture="environment") -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Foto Kamera Langsung <span class="text-red-500">*</span>
          </label>
          <div class="flex items-center gap-2">
            <label class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-300 rounded-xl cursor-pointer text-xs font-bold text-slate-700 transition">
              <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ hasPhoto ? 'Foto Siap (Jepret Ulang)' : 'Buka Kamera Langsung' }}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                @change="onFileChange"
                class="hidden"
              />
            </label>
          </div>
          <p class="text-[10px] text-slate-400 mt-1">
            Foto langsung dari lokasi usaha untuk menjaga keaslian dan kepercayaan antar-UMKM.
          </p>
        </div>

        <!-- 6. Harga (Gratis vs Berbayar) -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Ketentuan Harga
          </label>
          <div class="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              @click="form.price_type = 'gratis'"
              :class="[
                'py-2 px-3 text-xs font-extrabold rounded-xl border transition',
                form.price_type === 'gratis'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              ]"
            >
              🎁 Gratis (Cuma-cuma)
            </button>
            <button
              type="button"
              @click="form.price_type = 'berbayar'"
              :class="[
                'py-2 px-3 text-xs font-extrabold rounded-xl border transition',
                form.price_type === 'berbayar'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              ]"
            >
              💰 Berbayar (Murah)
            </button>
          </div>

          <div v-if="form.price_type === 'berbayar'" class="flex items-center gap-1.5">
            <span class="text-xs font-bold text-slate-600">Rp</span>
            <input
              v-model.number="form.price_amount"
              type="number"
              min="100"
              step="100"
              placeholder="Harga per satuan"
              class="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white outline-none"
            />
            <span class="text-xs font-medium text-slate-500">/ {{ form.unit }}</span>
          </div>
        </div>

        <!-- 7. Metode Pengambilan (Default: Diambil Pencari, Opsi: Diantar Penghasil, Didiskusikan) -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Metode Pengambilan
          </label>
          <div class="grid grid-cols-3 gap-1.5">
            <label class="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-bold cursor-pointer text-center">
              <input type="radio" value="diambil_pencari" v-model="form.pickup_method" class="accent-brand-600 mb-1" />
              <span>🛵 Diambil Pencari</span>
            </label>
            <label class="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-bold cursor-pointer text-center">
              <input type="radio" value="diantar_penghasil" v-model="form.pickup_method" class="accent-brand-600 mb-1" />
              <span>🚚 Diantar Penghasil</span>
            </label>
            <label class="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-bold cursor-pointer text-center">
              <input type="radio" value="didiskusikan" v-model="form.pickup_method" class="accent-brand-600 mb-1" />
              <span>💬 Didiskusikan</span>
            </label>
          </div>
        </div>

        <!-- 8. Catatan Batas Kuota Akun Baru & Kedaluwarsa 14 Hari -->
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px] text-slate-600">
          <div class="flex items-center gap-1 font-bold text-slate-800">
            <svg class="w-3.5 h-3.5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Aturan Posting Bursa UMKM:</span>
          </div>
          <p>• Listing aktif otomatis kedaluwarsa setelah <strong>14 hari</strong> jika tidak diperbarui.</p>
          <p>• Akun baru dibatasi maksimal <strong>3 listing aktif</strong> sampai transaksi pertama terkonfirmasi.</p>
        </div>

        <!-- Tombol Simpan Posting -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>{{ isSubmitting ? 'Menerbitkan Listing...' : 'Terbitkan Pasokan Limbah Sekarang' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

const emit = defineEmits(['close', 'created']);

const { allowedCategories, createListing } = useWasteApp();

const isSubmitting = ref(false);
const hasPhoto = ref(false);
const draftRestored = ref(false);

const form = reactive({
  category_id: '',
  title: '',
  description: 'Sedia sisa limbah produksi rutin bersih dan terawat. Siap dimanfaatkan kembali oleh UMKM terdekat.',
  volume_per_week: 50,
  unit: 'kg' as 'kg' | 'karung' | 'liter' | 'ikat',
  photo_url: '',
  price_type: 'gratis' as 'gratis' | 'berbayar',
  price_amount: 0,
  pickup_method: 'diambil_pencari' as 'diambil_pencari' | 'diantar_penghasil' | 'didiskusikan'
});

// PRD Hal. 20: Simpan form ke draft sementara (localStorage dengan try/catch)
onMounted(() => {
  try {
    const saved = localStorage.getItem('draft_quick_post');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.title || parsed.category_id) {
        Object.assign(form, parsed);
        if (form.photo_url) hasPhoto.value = true;
        draftRestored.value = true;
      }
    }
  } catch (err) {
    console.warn('Gagal membaca draft dari localStorage:', err);
  }
});

watch(
  form,
  (newVal) => {
    try {
      localStorage.setItem('draft_quick_post', JSON.stringify(newVal));
    } catch (err) {
      // Ignore quota exceeded or private mode
    }
  },
  { deep: true }
);

function clearDraft() {
  try {
    localStorage.removeItem('draft_quick_post');
  } catch (err) {}
  form.category_id = '';
  form.title = '';
  form.photo_url = '';
  hasPhoto.value = false;
  draftRestored.value = false;
}

// S4: Pembersihan EXIF geolokasi & kompresi foto di perangkat
function stripExifAndCompress(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const cleanDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(cleanDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    hasPhoto.value = true;
    try {
      const cleanUrl = await stripExifAndCompress(target.files[0]);
      form.photo_url = cleanUrl;
    } catch (err) {
      form.photo_url = URL.createObjectURL(target.files[0]);
    }
  }
}

async function handleSubmit() {
  if (!form.category_id) {
    alert('Harap pilih kategori limbah yang diizinkan.');
    return;
  }

  isSubmitting.value = true;
  try {
    const success = createListing({
      category_id: form.category_id,
      judul: form.title,
      deskripsi: form.description,
      volume_per_minggu: form.volume_per_week,
      satuan: form.unit,
      foto_url: form.photo_url,
      tipe_harga: form.price_type,
      harga_satuan: form.price_amount,
      metode_pengambilan: form.pickup_method
    });

    if (success) {
      clearDraft();
      alert('Listing berhasil diterbitkan! Kini terlihat oleh rekan UMKM terdekat dalam radius pencarian.');
      emit('created');
      emit('close');
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
