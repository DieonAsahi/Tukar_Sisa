<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
  >
    <div
      class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 my-8 max-h-[90vh] overflow-y-auto"
    >
      <!-- Header Modal -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🏪</span> Lengkapi Profil Usaha
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Data ini membantu UMKM mitra mengenali usaha Anda dengan aman.
          </p>
        </div>
        <button
          v-if="canDismiss"
          @click="onClose"
          class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
        <!-- Nama Usaha -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">
            Nama Usaha / Bengkel / Pabrik <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.nama_usaha"
            type="text"
            required
            placeholder="Contoh: Bengkel Kayu Berkah, Konveksi Ibu Siti"
            class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- Jenis Usaha & Peran -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">
              Jenis Usaha <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.jenis_usaha"
              type="text"
              required
              placeholder="Contoh: Kerajinan, Makanan"
              class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">
              Peran Utama <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.peran_usaha"
              class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="keduanya">Keduanya (Hasilkan & Cari Sisa)</option>
              <option value="penghasil">Penghasil Sisa Produksi</option>
              <option value="pencari">Pencari Bahan Baku Sisa</option>
            </select>
          </div>
        </div>

        <!-- Nomor WhatsApp -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">
            Nomor WhatsApp Usaha <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-3.5 top-2.5 text-sm font-bold text-slate-500">📞</span>
            <input
              v-model="form.no_wa"
              type="tel"
              required
              placeholder="08123456789 atau 628123456789"
              class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <p class="text-xs text-slate-500 mt-1">
            🔒 Dilindungi privasi. Nomor hanya tampil bagi sesama pengguna terdaftar saat menekan tombol WhatsApp.
          </p>
        </div>

        <!-- Alamat Tampilan (Publik) & Presisi -->
        <div class="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">
              Area / Wilayah Publik <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.alamat_tampilan"
              type="text"
              required
              placeholder="Contoh: Kec. Tegalsari, Surabaya"
              class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p class="text-xs text-slate-400 mt-1">
              Ini yang dilihat pengunjung umum (lingkaran perkiraan radius).
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">
              Alamat Lengkap Patokan Jalan (Presisi)
            </label>
            <textarea
              v-model="form.alamat_presisi"
              rows="2"
              placeholder="Contoh: Jl. Basuki Rahmat No. 12 (depan minimarket)"
              class="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
            <p class="text-xs text-slate-400 mt-0.5">
              Hanya dibuka setelah pengguna lain menekan konfirmasi kontak.
            </p>
          </div>
        </div>

        <!-- Titik Koordinat & Verifikasi Lokasi Langsung (F3) -->
        <div class="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <span>📍</span> Titik Koordinat GPS Usaha
              </p>
              <p class="text-xs text-emerald-800">
                Koordinat: {{ form.latitude.toFixed(4) }}, {{ form.longitude.toFixed(4) }}
              </p>
            </div>
            <button
              type="button"
              @click="handleDetectGPS"
              :disabled="isDetectingGPS"
              class="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition flex items-center gap-1 shadow-sm"
            >
              <span v-if="isDetectingGPS" class="animate-spin text-xs">⏳</span>
              <span v-else>📡</span>
              <span>Ambil Titik GPS</span>
            </button>
          </div>

          <!-- Lencana Verifikasi Lokasi Status -->
          <div
            v-if="verificationStatus"
            class="p-2.5 rounded-lg text-xs font-medium"
            :class="verificationStatus.isVerified ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'"
          >
            {{ verificationStatus.message }}
          </div>

          <!-- Foto Tempat Usaha langsung dari Kamera (capture="environment") -->
          <div>
            <label class="block text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1">
              <span>📷</span> Foto Tempat Usaha (Kamera Langsung)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              @change="handlePhotoUpload"
              class="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:cursor-pointer"
            />
            <p class="text-[11px] text-emerald-800 mt-1">
              Diambil langsung dari kamera ponsel di lokasi usaha (toleransi GPS ≤ 200m untuk Lencana Lokasi Terverifikasi).
            </p>
            <div v-if="form.foto_usaha" class="mt-2 relative w-24 h-16 rounded-lg overflow-hidden border border-emerald-200 shadow-sm">
              <img :src="form.foto_usaha" alt="Foto Usaha" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex items-center gap-2 pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            <span v-if="isSubmitting">Menyimpan...</span>
            <span v-else>Simpan & Aktifkan Profil</span>
          </button>
          <button
            v-if="canDismiss"
            type="button"
            @click="onClose"
            class="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
          >
            Nanti Saja
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';
import { UserProfile } from '../types';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { currentUser, updateProfile, verifyBusinessLocation } = useWasteApp();

const isSubmitting = ref(false);
const isDetectingGPS = ref(false);
const verificationStatus = ref<{ isVerified: boolean; message: string } | null>(null);

const canDismiss = ref(true);

const form = reactive({
  nama_usaha: '',
  jenis_usaha: '',
  peran_usaha: 'keduanya' as 'penghasil' | 'pencari' | 'keduanya',
  no_wa: '',
  alamat_tampilan: '',
  alamat_presisi: '',
  latitude: -7.2655,
  longitude: 112.7480,
  foto_usaha: ''
});

// Isi form saat profil terbuka
watch(
  () => props.isOpen,
  (open) => {
    if (open && currentUser.value) {
      form.nama_usaha = currentUser.value.nama_usaha || '';
      form.jenis_usaha = currentUser.value.jenis_usaha || '';
      form.peran_usaha = currentUser.value.peran_usaha || 'keduanya';
      form.no_wa = currentUser.value.no_wa || '';
      form.alamat_tampilan = currentUser.value.alamat_tampilan || 'Kec. Tegalsari, Surabaya';
      form.alamat_presisi = currentUser.value.alamat_presisi || '';
      form.latitude = currentUser.value.latitude || -7.2655;
      form.longitude = currentUser.value.longitude || 112.7480;
      form.foto_usaha = currentUser.value.foto_usaha || '';
      canDismiss.value = !!currentUser.value.nama_usaha;
    }
  },
  { immediate: true }
);

function handleDetectGPS() {
  if (!navigator.geolocation) {
    alert('Browser tidak mendukung deteksi lokasi otomatis.');
    return;
  }
  isDetectingGPS.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.latitude = pos.coords.latitude;
      form.longitude = pos.coords.longitude;
      isDetectingGPS.value = false;
    },
    (err) => {
      console.warn('Gagal membaca GPS:', err.message);
      isDetectingGPS.value = false;
      alert('Tidak dapat membaca lokasi GPS. Pastikan izin lokasi aktif.');
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function handlePhotoUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // Baca foto kamera sebagai data URL (mock upload storage)
  const reader = new FileReader();
  reader.onload = () => {
    form.foto_usaha = reader.result as string;

    // Evaluasi verifikasi lokasi (F3: toleransi <= 200m dari GPS saat foto kamera diambil)
    const photoUrl = reader.result as string;
    const result = verifyBusinessLocation(form.latitude, form.longitude, photoUrl);
    if (result.success) {
      verificationStatus.value = {
        isVerified: true,
        message: 'Lencana Lokasi Terverifikasi aktif! Koordinat sesuai toleransi GPS (<= 200m) & foto kamera langsung.'
      };
    } else {
      verificationStatus.value = {
        isVerified: false,
        message: result.message || 'Lokasi belum terverifikasi (jarak pin melebihi toleransi GPS 200m).'
      };
    }
  };
  reader.readAsDataURL(file);
}

function handleSubmit() {
  if (!form.nama_usaha.trim()) {
    alert('Silakan isi nama usaha Anda.');
    return;
  }
  if (!form.no_wa.trim()) {
    alert('Silakan masukkan nomor WhatsApp usaha.');
    return;
  }

  isSubmitting.value = true;
  const updateData: Partial<UserProfile> = {
    nama_usaha: form.nama_usaha,
    jenis_usaha: form.jenis_usaha,
    peran_usaha: form.peran_usaha,
    no_wa: form.no_wa,
    alamat_tampilan: form.alamat_tampilan,
    alamat_presisi: form.alamat_presisi,
    latitude: form.latitude,
    longitude: form.longitude,
    foto_usaha: form.foto_usaha,
    is_lokasi_terverifikasi: verificationStatus.value?.isVerified ?? currentUser.value?.is_lokasi_terverifikasi ?? false
  };

  updateProfile(updateData);
  isSubmitting.value = false;
  emit('close');
}

function onClose() {
  emit('close');
}
</script>
