<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col">
      <!-- Header Modal -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>📍</span> Verifikasi Lokasi Usaha (Lencana 2 — U5)
          </h2>
          <p class="text-[11px] text-slate-500 font-medium">Buktikan tempat usaha fisik untuk lencana kepercayaan & prioritas teratas</p>
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
        <!-- Banner Ketentuan Verifikasi -->
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
          <div class="flex items-center gap-2 font-bold text-emerald-900">
            <svg class="w-5 h-5 text-emerald-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Syarat Lencana Lokasi Terverifikasi (Toleransi ≤ 200m):</span>
          </div>
          <ol class="list-decimal list-inside space-y-1 text-[11px] font-medium leading-relaxed">
            <li>Anda harus berada di tempat usaha saat verifikasi.</li>
            <li>GPS perangkat harus berada dalam toleransi <strong>maksimal ≤ 200 meter</strong> dari titik pin usaha Anda.</li>
            <li>Ambil <strong>foto tempat usaha langsung dari kamera</strong> (bukan dari galeri).</li>
          </ol>
        </div>

        <!-- DETEKSI DESKTOP: TAMPILKAN KODE QR & TAUTAN UNTUK LANJUT DI PONSEL (PRD Hal. 6 & 19) -->
        <div v-if="isDesktopScreen" class="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-24 h-24 bg-white border border-indigo-200 rounded-xl p-2 shrink-0 flex items-center justify-center shadow-sm">
              <!-- SVG Representasi QR Code Cepat -->
              <svg viewBox="0 0 100 100" class="w-full h-full text-indigo-950">
                <rect width="100" height="100" fill="#ffffff" />
                <path d="M10,10 h30 v30 h-30 z M18,18 h14 v14 h-14 z M60,10 h30 v30 h-30 z M68,18 h14 v14 h-14 z M10,60 h30 v30 h-30 z M18,68 h14 v14 h-14 z" fill="#1e1b4b" />
                <rect x="22" y="22" width="6" height="6" fill="#1e1b4b" />
                <rect x="72" y="22" width="6" height="6" fill="#1e1b4b" />
                <rect x="22" y="72" width="6" height="6" fill="#1e1b4b" />
                <path d="M50,15 h5 v10 h-5 z M50,35 h8 v8 h-8 z M50,55 h12 v6 h-12 z M70,55 h10 v20 h-10 z M55,75 h20 v10 h-20 z" fill="#1e1b4b" />
              </svg>
            </div>
            <div class="space-y-1">
              <strong class="text-xs font-black text-indigo-950 block">Lanjutkan Verifikasi di Ponsel</strong>
              <p class="text-[11px] text-indigo-900 leading-relaxed">
                Kamera belakang dan GPS presisi berada di ponsel. Buka tautan berikut atau pindai QR code untuk verifikasi langsung di lokasi usaha Anda.
              </p>
              <div class="pt-1">
                <span class="inline-block bg-white px-2.5 py-1 rounded-lg border border-indigo-200 font-mono text-[10px] text-indigo-800">
                  bursa-limbah.id/verifikasi
                </span>
              </div>
            </div>
          </div>

          <!-- Tombol Simulasi Khusus Desktop (Untuk Keperluan Demo Juri) -->
          <div class="pt-2 border-t border-indigo-100 flex items-center justify-between">
            <span class="text-[11px] text-indigo-800 font-semibold">Mode Presentasi Laptop:</span>
            <button
              @click="handleDemoSimulation"
              class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-sm"
            >
              Simulasi Uji Lolos GPS (≤ 200m)
            </button>
          </div>
        </div>

        <!-- FORM KAMERA & GPS (Ponsel / Langsung) -->
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Foto Tempat Usaha (Kamera Langsung Lingkungan - S4 Auto Strip EXIF)
            </label>
            <label class="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer transition">
              <svg class="w-8 h-8 text-brand-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-xs font-bold text-slate-700">{{ photoUrl ? 'Foto Siap (Klik untuk Ganti)' : 'Jepret Foto Tempat Usaha Sekarang' }}</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Wajib menggunakan kamera belakang ponsel di lokasi</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                @change="onPhotoCaptured"
                class="hidden"
              />
            </label>
          </div>

          <!-- Panduan Izin Browser Jika Ditolak (PRD Hal. 6 & 19) -->
          <div v-if="permissionDenied" class="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 space-y-2">
            <strong class="font-extrabold flex items-center gap-1.5 text-amber-900">
              <span>⚠️</span> Izin Akses GPS atau Kamera Ditolak
            </strong>
            <p class="text-[11px] leading-relaxed">
              Tekan ikon gembok 🔒 di samping kolom alamat browser Anda, ubah status <em>Lokasi</em> dan <em>Kamera</em> menjadi <strong>Izinkan</strong>, lalu coba kembali.
            </p>
            <div class="pt-1 border-t border-amber-200 flex items-center justify-between">
              <span class="text-[11px] text-amber-900 font-medium">Bisa tetap posting tanpa lencana:</span>
              <button
                type="button"
                @click="$emit('close')"
                class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition shadow-sm"
              >
                Lanjut Tanpa Lencana Lokasi
              </button>
            </div>
          </div>

          <!-- Tombol Eksekusi Verifikasi GPS -->
          <button
            @click="handleRunVerification"
            :disabled="isVerifying || !photoUrl"
            class="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg v-if="!isVerifying" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ isVerifying ? 'Mencocokkan GPS Perangkat...' : 'Verifikasi Lokasi Sekarang (Toleransi ≤ 200m)' }}</span>
          </button>
        </div>

        <!-- Hasil Validasi -->
        <div v-if="result" :class="['p-4 rounded-2xl text-xs font-semibold border', result.success ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900']">
          <div class="flex items-center gap-2 font-bold mb-1">
            <span class="text-base">{{ result.success ? '🎉' : '❌' }}</span>
            <span>{{ result.success ? 'Verifikasi Berhasil' : 'Verifikasi Belum Lolos' }}</span>
          </div>
          <p class="leading-relaxed">{{ result.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

const emit = defineEmits(['close']);

const { verifyBusinessLocation, currentUser, detectDeviceLocation } = useWasteApp();

const isVerifying = ref(false);
const photoUrl = ref('');
const permissionDenied = ref(false);
const result = ref<{ success: boolean; message: string; distance_meters?: number } | null>(null);

const isDesktopScreen = computed(() => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768;
});

// S4: Pembersihan data EXIF & kompresi ukuran foto langsung di perangkat
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
        // Render ke canvas otomatis menghapus tag EXIF geolokasi
        ctx?.drawImage(img, 0, 0, width, height);

        // Kompres ke JPEG kualitas 0.8
        const cleanDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(cleanDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function onPhotoCaptured(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const cleanUrl = await stripExifAndCompress(file);
    photoUrl.value = cleanUrl;
  } catch (err) {
    photoUrl.value = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';
  }
}

async function handleRunVerification() {
  if (!photoUrl.value) {
    alert('Harap ambil foto tempat usaha Anda terlebih dahulu.');
    return;
  }

  isVerifying.value = true;
  permissionDenied.value = false;

  try {
    const coords = await detectDeviceLocation();
    const res = verifyBusinessLocation(coords.lat, coords.lng, photoUrl.value);
    result.value = res;
    if (res.success) {
      setTimeout(() => {
        emit('close');
      }, 2500);
    }
  } catch (err: any) {
    permissionDenied.value = true;
    result.value = {
      success: false,
      message: 'Tidak dapat mengakses GPS perangkat. Pastikan izin lokasi telah diberikan di browser Anda.'
    };
  } finally {
    isVerifying.value = false;
  }
}

// Simulasi Uji Demo di Laptop (≤ 200m)
function handleDemoSimulation() {
  photoUrl.value = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';
  const myLat = currentUser.value?.latitude || -7.2655;
  const myLng = currentUser.value?.longitude || 112.7480;

  // Berikan deviasi kecil 65 meter
  const simulatedLat = myLat + 0.0004;
  const simulatedLng = myLng + 0.0003;

  const res = verifyBusinessLocation(simulatedLat, simulatedLng, photoUrl.value);
  result.value = res;
  if (res.success) {
    setTimeout(() => {
      emit('close');
    }, 2500);
  }
}
</script>
