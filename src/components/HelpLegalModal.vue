<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div
      class="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
    >
      <!-- Header Modal -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Syarat Penggunaan & Panduan Keamanan</span>
          </h2>
          <p class="text-[11px] text-slate-500 font-medium">
            Pedoman keselamatan, barang terlarang, dan batasan tanggung jawab
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="p-5 space-y-4 text-xs text-slate-700 leading-relaxed font-medium">
        <!-- 1. BARANG TERLARANG (DILARANG KERAS SESUAI PRD BARU) -->
        <div class="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2">
          <div class="flex items-center gap-1.5 text-red-950 font-black text-sm">
            <span>🚫</span>
            <span>Daftar Barang Terlarang (Dilarang Keras Diposting)</span>
          </div>
          <p class="text-red-900 text-[11px]">
            Platform Bursa Limbah secara tegas melarang posting dan transaksi sisa berbahaya berikut:
          </p>
          <ul class="list-disc list-inside space-y-1 text-red-900 text-[11px] pl-1 font-semibold">
            <li><strong>Limbah B3:</strong> Oli bekas, aki, bahan kimia industri beracun, jarum medis.</li>
            <li><strong>Elektronik & Baterai:</strong> Baterai lithium, PCB elektronik bekas rusak.</li>
            <li><strong>Obat-obatan & Farmasi:</strong> Obat kedaluwarsa, kosmetik kimia berbahaya.</li>
            <li><strong>Daging Mentah & Bangkai:</strong> Sisa daging mentah hewan, kotoran infeksius.</li>
            <li><strong>Makanan Konsumsi Manusia:</strong> Platform tidak memfasilitasi makanan untuk manusia; hanya sisa dapur afkir untuk pakan larva maggot / ternak.</li>
          </ul>
        </div>

        <!-- 2. BATASAN TANGGUNG JAWAB PLATFORM -->
        <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
          <div class="flex items-center gap-1.5 text-amber-950 font-black text-sm">
            <span>⚖️</span>
            <span>Batasan Tanggung Jawab Platform</span>
          </div>
          <ul class="list-disc list-inside space-y-1 text-amber-900 text-[11px] pl-1">
            <li>Platform hanya mempertemukan pengguna dan tidak memeriksa fisik barang.</li>
            <li>Platform tidak menjamin mutu/kualitas sisa dan tidak memfasilitasi pertemuan.</li>
            <li>Pengambilan barang dilakukan mandiri oleh pencari sisa atas kesepakatan bersama via WhatsApp.</li>
            <li>Tidak ada sistem pembayaran di dalam aplikasi; transaksi uang atau barter disepakati langsung oleh kedua pihak.</li>
          </ul>
        </div>

        <!-- 3. PANDUAN KESELAMATAN PERTEMUAN -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div class="flex items-center gap-1.5 text-slate-900 font-black text-sm">
            <span>🤝</span>
            <span>Panduan Keselamatan Serah Terima Sisa</span>
          </div>
          <ul class="list-disc list-inside space-y-1 text-slate-600 text-[11px] pl-1">
            <li>Bertemu di tempat terang pada siang hari.</li>
            <li>Bawa rekan saat mengambil barang dalam jumlah atau volume besar.</li>
            <li>Ambil sampel kecil terlebih dahulu untuk menguji kesesuaian bahan baku.</li>
            <li><strong>Jangan pernah mentransfer uang di muka</strong> kepada pihak yang belum Anda kenal.</li>
          </ul>
        </div>

        <!-- 4. KEBIJAKAN PRIVASI LOKASI (UU PDP) -->
        <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
          <div class="flex items-center gap-1.5 text-emerald-950 font-black text-sm">
            <span>🔒</span>
            <span>Privasi Lokasi (UU Perlindungan Data Pribadi)</span>
          </div>
          <p class="text-emerald-900 text-[11px] leading-relaxed">
            Aplikasi menggeser koordinat GPS Anda secara tetap maksimal 1 km sebelum disimpan. Hanya titik acak tersebut yang tersimpan, sedangkan koordinat presisi dan alamat Anda tidak pernah disimpan atau ditampilkan kepada publik.
          </p>
        </div>

        <button
          @click="$emit('close')"
          class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow transition"
        >
          Saya Mengerti & Setuju dengan Aturan Platform
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits(['close']);
</script>
