<template>
  <div class="space-y-4 max-w-4xl mx-auto">
    <!-- 1. KARTU PROFIL PENGGUNA & TANDA KEPERCAYAAN -->
    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center text-xl font-black shadow-md shadow-brand-500/20 shrink-0">
            {{ currentUser?.nama_tampilan?.charAt(0) || 'U' }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {{ currentUser?.nama_tampilan }}
              </h2>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                {{ currentUser?.peran_sistem }}
              </span>
            </div>
            <p v-if="currentUser?.nama_toko_profesi" class="text-xs font-bold text-slate-600 mt-0.5">
              🏪 {{ currentUser.nama_toko_profesi }}
            </p>
            <p class="text-xs text-slate-500 font-medium">
              WhatsApp: {{ currentUser?.no_wa || '-' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="$emit('open-settings')"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <span>⚙️</span>
            <span>Edit Profil & Lokasi</span>
          </button>
        </div>
      </div>

      <!-- Tanda Kepercayaan & Dampak Pribadi -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 text-xs">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Transaksi Selesai</span>
          <span class="text-base font-black text-emerald-700 mt-0.5 block">
            {{ currentUser?.jumlah_transaksi_selesai || 0 }} Transaksi
          </span>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Limbah Dialihkan</span>
          <span class="text-base font-black text-brand-700 mt-0.5 block">
            {{ myPersonalImpact.total_kg }} kg
          </span>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Bergabung Sejak</span>
          <span class="text-xs font-bold text-slate-700 mt-0.5 block">
            {{ formatDate(currentUser?.dibuat_pada) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 2. KELOLA 3 SLOT LOKASI -->
    <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>📍</span> 3 Slot Lokasi Penjemputan Sisa
          </h3>
          <p class="text-xs text-slate-500 font-medium">Titik acak tetap maksimal 1 km (koordinat asli tidak disimpan)</p>
        </div>
        <button
          @click="$emit('open-settings')"
          class="text-xs font-bold text-brand-700 hover:underline"
        >
          Kelola Slot
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div
          v-for="slotNum in ([1, 2, 3] as const)"
          :key="slotNum"
          class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1"
        >
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-slate-700">Slot {{ slotNum }}</span>
            <span v-if="getSlot(slotNum)" class="text-emerald-700 font-extrabold text-[10px]">✓ Aktif</span>
            <span v-else class="text-slate-400 font-normal text-[10px]">Kosong</span>
          </div>
          <div class="font-extrabold text-slate-800 text-xs truncate">
            {{ getSlot(slotNum)?.label || 'Belum diatur' }}
          </div>
          <div class="text-[10px] text-slate-400">
            {{ getSlot(slotNum) ? 'Titik acak tersimpan' : 'Klik kelola untuk setel GPS' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 3. POSTINGAN SAYA (BATAS: 10 AKTIF) -->
    <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>📑</span> Postingan Sisa Saya
          </h3>
          <p class="text-xs text-slate-500 font-medium">
            {{ myActiveListingsCount }} dari maksimal 10 postingan aktif
          </p>
        </div>
        <button
          @click="$emit('open-upload')"
          class="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1"
        >
          <span>+ Unggah Sisa</span>
        </button>
      </div>

      <div v-if="myListings.length > 0" class="space-y-2.5">
        <div
          v-for="item in myListings"
          :key="item.id"
          class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <img
              :src="item.foto_urls[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80'"
              class="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div>
              <div class="flex items-center gap-1.5">
                <span
                  :class="[
                    'text-[10px] font-black uppercase px-2 py-0.2 rounded-md',
                    item.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  ]"
                >
                  {{ item.status }}
                </span>
                <span class="text-xs text-slate-400 font-bold">•</span>
                <span class="text-xs font-bold text-slate-600">Stok: {{ item.stok }} {{ item.satuan }}</span>
              </div>
              <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                {{ item.judul }}
              </h4>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              v-if="item.status === 'aktif'"
              @click="handleCloseListing(item.id)"
              class="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition"
            >
              Tutup Postingan
            </button>
            <button
              v-else-if="item.status === 'habis' || item.status === 'kedaluwarsa'"
              @click="handleReopenListing(item.id)"
              class="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-300 transition"
            >
              Aktifkan Lagi
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-6 text-slate-400 text-xs">
        Anda belum mengunggah postingan sisa. Klik tombol di atas untuk mulai menyalurkan sisa bernilai!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWasteApp } from '../composables/useWasteApp';

defineEmits(['open-settings', 'open-upload']);

const {
  currentUser,
  myLocationSlots,
  myListings,
  myActiveListingsCount,
  myPersonalImpact,
  updateListing
} = useWasteApp();

function getSlot(slotNum: 1 | 2 | 3) {
  return myLocationSlots.value.find((s) => s.slot_nomor === slotNum);
}

function handleCloseListing(id: string) {
  if (confirm('Tutup postingan ini sehingga tidak muncul lagi di pencarian?')) {
    updateListing(id, { status: 'habis' });
  }
}

function handleReopenListing(id: string) {
  if (myActiveListingsCount.value >= 10) {
    alert('Maksimal 10 postingan aktif tercapai!');
    return;
  }
  updateListing(id, { status: 'aktif' });
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  } catch {
    return '-';
  }
}
</script>
