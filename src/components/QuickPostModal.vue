<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div
      class="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
    >
      <!-- Header Form Unggah -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
            <span>📦</span>
            <span>Unggah Postingan Sisa</span>
          </h2>
          <p class="text-[11px] text-slate-500 font-medium">
            Salurkan sisa bernilai ke yang membutuhkan (Maksimal 10 postingan aktif)
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
        <!-- 1. Kategori Sisa (Masa tayang otomatis) -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Kategori Sisa <strong class="text-red-500">*</strong></span>
            <span v-if="selectedCat" class="text-[11px] text-emerald-700 font-extrabold">
              Masa Tayang: {{ selectedCat.masa_tayang_jam }} Jam ({{ Math.round(selectedCat.masa_tayang_jam / 24) }} Hari)
            </span>
          </label>
          <select
            v-model="form.category_id"
            required
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="" disabled>-- Pilih Kategori Sisa Non-B3 --</option>
            <option
              v-for="cat in allowedCategories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.nama }} (Masa tayang {{ cat.masa_tayang_jam }} jam)
            </option>
          </select>
          <p v-if="selectedCat?.deskripsi" class="text-[11px] text-slate-500 leading-relaxed">
            💡 {{ selectedCat.deskripsi }}
          </p>
        </div>

        <!-- 2. Unggah Foto (1 - 3 Foto, EXIF Dihapus Nyata via Canvas) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-700">
              Foto Sisa (1 - 3 Foto) <strong class="text-red-500">*</strong>
            </label>
            <span class="text-[11px] text-emerald-700 font-medium">
              🛡️ EXIF & GPS dipurging via Canvas 2D
            </span>
          </div>

          <!-- Input File Tersembunyi -->
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            class="hidden"
            @change="handleFileUpload"
          />

          <!-- Preview & Thumbnails -->
          <div class="flex flex-wrap gap-2.5 items-center">
            <div
              v-for="(url, idx) in form.foto_urls"
              :key="idx"
              class="w-20 h-20 rounded-2xl overflow-hidden relative group border border-slate-200"
            >
              <img :src="url" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removePhoto(idx)"
                class="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md opacity-90 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>

            <!-- Tombol Pilih Berkas Asli (EXIF Stripped) -->
            <button
              v-if="form.foto_urls.length < 3"
              type="button"
              @click="triggerFileInput"
              :disabled="isProcessingImage"
              class="w-20 h-20 rounded-2xl border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 flex flex-col items-center justify-center gap-1 transition"
            >
              <span class="text-lg">{{ isProcessingImage ? '⏳' : '📁' }}</span>
              <span class="text-[10px] font-bold">{{ isProcessingImage ? 'Proses...' : 'Pilih Foto' }}</span>
            </button>

            <!-- Tombol Tambah Contoh (Demo) -->
            <button
              v-if="form.foto_urls.length < 3"
              type="button"
              @click="addSamplePhoto"
              class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-500 bg-slate-50 hover:bg-slate-100 text-slate-500 flex flex-col items-center justify-center gap-1 transition"
            >
              <span class="text-lg">📷</span>
              <span class="text-[10px] font-bold">Contoh Demo</span>
            </button>
          </div>
          <p class="text-[10px] text-slate-500">
            * Setiap foto yang dipilih otomatis diproses ulang lewat Canvas HTML5 untuk membuang 100% metadata EXIF, koordinat GPS kamera, dan mengecilkan ukuran berkas.
          </p>
        </div>

        <!-- 3. Judul & Deskripsi -->
        <div class="space-y-3">
          <div>
            <label class="text-xs font-bold text-slate-700">
              Judul Postingan <strong class="text-red-500">*</strong>
            </label>
            <input
              type="text"
              v-model="form.judul"
              required
              placeholder="Contoh: Serbuk Kayu Jati Halus Bersih Tanpa Paku"
              class="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700">
              Keterangan & Kondisi Sisa <strong class="text-red-500">*</strong>
            </label>
            <textarea
              v-model="form.deskripsi"
              required
              rows="3"
              placeholder="Jelaskan kondisi sisa, apakah basah/kering, cara pengemasan, atau syarat pengambilan..."
              class="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>
        </div>

        <!-- 4. Stok, Satuan & Berat per Satuan (Opsional untuk hitung dampak) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label class="text-xs font-bold text-slate-700">Jumlah Stok <strong class="text-red-500">*</strong></label>
            <input
              type="number"
              v-model.number="form.stok"
              min="0.1"
              step="any"
              required
              class="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
            />
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700">Satuan <strong class="text-red-500">*</strong></label>
            <input
              type="text"
              v-model="form.satuan"
              required
              placeholder="kg, karung, ikat, liter"
              class="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
            />
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Berat Satuan (kg)</span>
              <span class="text-[10px] text-slate-400">Opsional</span>
            </label>
            <input
              type="number"
              v-model.number="form.berat_per_satuan_kg"
              min="0"
              step="any"
              placeholder="1"
              class="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
            />
          </div>
        </div>
        <p class="text-[10px] text-slate-400 -mt-2">
          * Berat per satuan dipakai untuk menghitung dampak lingkungan (kg dialihkan) saat transaksi selesai. Nilai awal diisi otomatis dari standar kategori dan dapat Anda sesuaikan.
        </p>

        <!-- 5. Tipe Harga (Gratis, Uang, Barter) -->
        <div class="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <label class="text-xs font-bold text-slate-800 block">
            Skema Penyaluran Sisa <strong class="text-red-500">*</strong>
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="form.jenis_harga = 'gratis'"
              :class="[
                'py-2 px-3 rounded-xl text-xs font-bold border transition text-center',
                form.jenis_harga === 'gratis'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              ]"
            >
              🎁 Gratis (Ambil)
            </button>
            <button
              type="button"
              @click="form.jenis_harga = 'uang'"
              :class="[
                'py-2 px-3 rounded-xl text-xs font-bold border transition text-center',
                form.jenis_harga === 'uang'
                  ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              ]"
            >
              💵 Ganti Ongkos (Rp)
            </button>
            <button
              type="button"
              @click="form.jenis_harga = 'barter'"
              :class="[
                'py-2 px-3 rounded-xl text-xs font-bold border transition text-center',
                form.jenis_harga === 'barter'
                  ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              ]"
            >
              🔄 Barter Sisa
            </button>
          </div>

          <!-- Input Uang jika jenis_harga === 'uang' -->
          <div v-if="form.jenis_harga === 'uang'" class="pt-2">
            <label class="text-xs font-bold text-slate-700">Nominal Pengganti (Rp per satuan)</label>
            <div class="relative mt-1">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                v-model.number="form.nominal_harga"
                min="0"
                step="500"
                required
                class="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 outline-none"
              />
            </div>
          </div>

          <!-- Input Keterangan Barter jika jenis_harga === 'barter' -->
          <div v-if="form.jenis_harga === 'barter'" class="pt-2">
            <label class="text-xs font-bold text-slate-700">Barang / Sisa yang Diinginkan untuk Ditukar</label>
            <input
              type="text"
              v-model="form.keterangan_barter"
              required
              placeholder="Contoh: Barter dengan kardus box packing atau benang jahit"
              class="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none"
            />
          </div>
        </div>

        <!-- 6. Pilih Slot Lokasi (Maksimal 3 Slot Akun) -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-700">
              Titik Lokasi Pengambilan <strong class="text-red-500">*</strong>
            </label>
            <span class="text-[11px] text-slate-400">
              Hanya titik acak tersimpan
            </span>
          </div>

          <select
            v-model="form.location_slot_id"
            required
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
          >
            <option
              v-for="loc in myLocations"
              :key="loc.id"
              :value="loc.id"
            >
              Slot {{ loc.slot_nomor }}: {{ loc.label }}
            </option>
          </select>
          <p class="text-[11px] text-slate-500">
            Pencari hanya melihat estimasi jarak (~1 km). Detail alamat lengkap disepakati sendiri melalui WhatsApp.
          </p>
        </div>

        <!-- Tombol Submit -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-600/30 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span>🚀 Tayangkan Postingan Sisa</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';
import { JenisHarga } from '../types';

const emit = defineEmits(['close', 'created']);

const { allowedCategories, myLocations, createListing } = useWasteApp();

const isSubmitting = ref(false);
const isProcessingImage = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const form = ref({
  category_id: allowedCategories.value[0]?.id || '',
  location_slot_id: myLocations.value[0]?.id || '',
  judul: '',
  deskripsi: '',
  foto_urls: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
  ],
  stok: 10,
  satuan: 'kg',
  berat_per_satuan_kg: 1.0,
  jenis_harga: 'gratis' as JenisHarga,
  nominal_harga: 0,
  keterangan_barter: ''
});

const selectedCat = computed(() => {
  return allowedCategories.value.find((c) => c.id === form.value.category_id);
});

// Bila kategori berubah: isi otomatis satuan & faktor_ke_kg sebagai nilai awal isian
watch(
  selectedCat,
  (cat) => {
    if (cat) {
      form.value.satuan = cat.satuan_default || 'kg';
      if (cat.faktor_ke_kg) {
        form.value.berat_per_satuan_kg = cat.faktor_ke_kg;
      }
    }
  },
  { immediate: true }
);

// Buka dialog file input browser
function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

// S6: Pembersihan EXIF & Resize murni di sisi klien via Canvas 2D
async function processImageAndStripExif(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Redraw ke Canvas HTML5 baru untuk menghapus 100% tag EXIF / GPS / metadata kamera
        const canvas = document.createElement('canvas');
        const maxDim = 1200; // Perkecil ukuran maksimal 1200px (S6)
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw pixel data murni tanpa metadata
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke JPEG berkualitas 85% bebas EXIF
        const cleanDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(cleanDataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas.'));
    reader.readAsDataURL(file);
  });
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  isProcessingImage.value = true;
  try {
    const files = Array.from(target.files);
    for (const file of files) {
      if (form.value.foto_urls.length >= 3) break;
      const cleanUrl = await processImageAndStripExif(file);
      form.value.foto_urls.push(cleanUrl);
    }
  } catch (err: any) {
    alert('Terjadi kesalahan saat memproses gambar: ' + err.message);
  } finally {
    isProcessingImage.value = false;
    if (fileInputRef.value) fileInputRef.value.value = '';
  }
}

const samplePhotos = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
];

function addSamplePhoto() {
  if (form.value.foto_urls.length < 3) {
    const nextPhoto = samplePhotos[form.value.foto_urls.length % samplePhotos.length];
    form.value.foto_urls.push(nextPhoto);
  }
}

function removePhoto(idx: number) {
  form.value.foto_urls.splice(idx, 1);
}

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    const res = await createListing({
      category_id: form.value.category_id,
      location_slot_id: form.value.location_slot_id,
      judul: form.value.judul,
      deskripsi: form.value.deskripsi,
      foto_urls: form.value.foto_urls,
      stok: form.value.stok,
      satuan: form.value.satuan,
      berat_per_satuan_kg: form.value.berat_per_satuan_kg,
      jenis_harga: form.value.jenis_harga,
      nominal_harga: form.value.nominal_harga,
      keterangan_barter: form.value.keterangan_barter
    });

    if (res.success) {
      alert('Postingan sisa Anda berhasil ditayangkan!');
      emit('created');
      emit('close');
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
