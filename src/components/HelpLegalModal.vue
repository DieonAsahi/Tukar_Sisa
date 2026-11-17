<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
  >
    <div
      class="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto space-y-5"
    >
      <!-- Header Modal -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>⚖️</span> Panduan, Aturan & Kebijakan Hukum (V7)
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Ketentuan layanan, 4 anjuran keselamatan, dan kepatuhan UU PDP
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

      <!-- Tab Sub-Navigasi -->
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
        <button
          @click="activeTab = 'aturan'"
          :class="[
            'flex-1 py-2 rounded-lg transition text-center',
            activeTab === 'aturan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          Aturan Bisnis
        </button>
        <button
          @click="activeTab = 'keselamatan'"
          :class="[
            'flex-1 py-2 rounded-lg transition text-center',
            activeTab === 'keselamatan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          4 Keselamatan
        </button>
        <button
          @click="activeTab = 'privasi'"
          :class="[
            'flex-1 py-2 rounded-lg transition text-center',
            activeTab === 'privasi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          Privasi UU PDP
        </button>
      </div>

      <!-- Konten Tab 1: Aturan Bisnis Platform (PRD Hal. 11 & 12) -->
      <div v-if="activeTab === 'aturan'" class="space-y-3 text-xs text-slate-600 leading-relaxed">
        <div class="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-emerald-950 font-medium">
          <strong class="block font-black text-sm mb-1 text-emerald-900">1. Platform Sebagai Penghubung Murni</strong>
          Platform Bursa Limbah Antar-UMKM bertugas mempertemukan UMKM penghasil dengan pencari limbah dan mencatat dampak lingkungan. Platform <strong>tidak menangani pembayaran</strong> dan <strong>tidak menyediakan kurir pengiriman</strong>. Kesepakatan harga dan teknis serah terima disepakati langsung oleh kedua pihak.
        </div>

        <div class="space-y-2">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong class="font-bold text-slate-800">2. Teknis Pengambilan (Default Pencari)</strong>
            <p class="mt-0.5">Pencari limbah bertanggung jawab menjemput limbah secara mandiri ke lokasi penghasil, kecuali disepakati lain (diantar penghasil atau didiskusikan).</p>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong class="font-bold text-slate-800">3. Radius Pencarian 1–100 km</strong>
            <p class="mt-0.5">Pencari menentukan sendiri radius pengambilan. Jika radius &gt; 50 km, pencari menanggung armada dan ongkos transportasi mandiri.</p>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong class="font-bold text-slate-800">4. Larangan Keras Limbah B3</strong>
            <p class="mt-0.5">Dilarang keras memposting limbah medis, zat kimia beracun, oli bekas, atau bahan berbahaya PP No. 22/2021. Pelanggar langsung dikenai sanksi pemblokiran akun.</p>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong class="font-bold text-slate-800">5. Kuota 3 Listing Akun Baru & Kedaluwarsa 14 Hari</strong>
            <p class="mt-0.5">Akun baru dibatasi maksimal 3 listing aktif sebelum transaksi pertama selesai. Setiap listing kedaluwarsa otomatis dalam 14 hari bila tidak diperpanjang.</p>
          </div>
        </div>
      </div>

      <!-- Konten Tab 2: 4 Anjuran Keselamatan Transaksi (PRD Hal. 10 & 16) -->
      <div v-else-if="activeTab === 'keselamatan'" class="space-y-3">
        <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 text-xs">
          <strong class="block text-sm font-black text-amber-900 mb-1">🛡️ 4 Pedoman Keselamatan Antar-UMKM:</strong>
          Transaksikan bahan baku sisa secara aman di lapangan dengan mematuhi pedoman wajib berikut:
        </div>

        <div class="grid grid-cols-1 gap-2.5 text-xs">
          <div class="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 shadow-sm">
            <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs shrink-0">1</span>
            <div>
              <strong class="font-bold text-slate-900">Minta Titik Lokasi Presisi Lewat WhatsApp</strong>
              <p class="text-slate-600 mt-0.5">Konfirmasi titik patokan jalan sebelum berangkat menjemput barang agar tidak tersesat atau mendatangi alamat yang keliru.</p>
            </div>
          </div>

          <div class="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 shadow-sm">
            <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs shrink-0">2</span>
            <div>
              <strong class="font-bold text-slate-900">Ambil Sampel Kecil Terlebih Dahulu</strong>
              <p class="text-slate-600 mt-0.5">Uji sampel material (misal: tingkat kebersihan serbuk kayu atau kadar air ampas kopi) sebelum menyepakati pasokan rutin berskala besar.</p>
            </div>
          </div>

          <div class="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 shadow-sm">
            <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs shrink-0">3</span>
            <div>
              <strong class="font-bold text-slate-900">Jangan Transfer Uang Muka Tanpa Tanda Terima</strong>
              <p class="text-slate-600 mt-0.5">Pembayaran dilakukan saat barang dicek fisik dan diserahterimakan langsung di tempat. Platform tidak pernah meminta uang muka.</p>
            </div>
          </div>

          <div class="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 shadow-sm">
            <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs shrink-0">4</span>
            <div>
              <strong class="font-bold text-slate-900">Bertemu di Tempat Usaha Fisik pada Jam Kerja</strong>
              <p class="text-slate-600 mt-0.5">Selalu lakukan transaksi di lokasi bengkel/pabrik/kedai yang terang dan jelas pada jam operasional kerja yang aman.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Konten Tab 3: Privasi & Kepatuhan UU PDP (PRD Hal. 13 & 20) -->
      <div v-else class="space-y-3 text-xs text-slate-600 leading-relaxed">
        <div class="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-950 font-medium">
          <strong class="block font-black text-sm mb-1 text-indigo-900">🔒 Komitmen Kepatuhan UU Pelindungan Data Pribadi</strong>
          Kami mematuhi UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP). Data dikumpulkan seminimal mungkin (email, WhatsApp, koordinat usaha) semata-mata untuk memfasilitasi transaksi sirkular antar-UMKM.
        </div>

        <ul class="space-y-2 list-disc list-inside bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700">
          <li><strong>Pengaburan Titik Lokasi Publik (S2):</strong> Publik dan tamu hanya melihat lingkaran estimasi (~800m). Titik koordinat presisi dan nomor telepon dikunci hingga ada kontak nyata.</li>
          <li><strong>Pembersihan Metadata EXIF (S4):</strong> Setiap foto kamera yang diunggah otomatis dihapus data geolokasi EXIF-nya di perangkat sebelum disimpan.</li>
          <li><strong>Hak Penghapusan Akun (U7):</strong> Pengguna berhak menghapus akun beserta seluruh data riwayatnya kapan saja melalui menu Pengaturan Akun.</li>
        </ul>
      </div>

      <div class="pt-2 text-right">
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
        >
          Saya Mengerti
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  isOpen: boolean;
}>();

defineEmits(['close']);

const activeTab = ref<'aturan' | 'keselamatan' | 'privasi'>('aturan');
</script>
