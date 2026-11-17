<template>
  <div class="space-y-4">
    <!-- Header Kelola Listing Saya -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
          <span>📑</span> Kelola Posting Limbah Saya (U9 & U10)
        </h2>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Pantau status pasokan, perpanjang kedaluwarsa 14 hari, dan tindak lanjuti mitra pencari yang berminat.
        </p>
      </div>

      <button
        @click="$emit('open-quick-post')"
        class="shrink-0 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        <span>+ Posting Limbah Baru</span>
      </button>
    </div>

    <!-- Daftar Listing Saya -->
    <div v-if="myListings.length > 0" class="space-y-4">
      <div
        v-for="item in myListings"
        :key="item.id"
        class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3"
      >
        <div class="flex flex-col sm:flex-row sm:items-start gap-3">
          <img
            :src="item.foto || item.foto_url"
            :alt="item.judul"
            class="w-full sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 flex-shrink-0"
          />
          <div class="min-w-0 flex-1 space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                {{ item.category_name }}
              </span>
              <span
                :class="[
                  'text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full',
                  item.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' : item.status === 'dipesan' ? 'bg-amber-100 text-amber-800' : item.status === 'selesai' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                ]"
              >
                {{ item.status }}
              </span>
            </div>

            <h3 class="text-sm font-extrabold text-slate-900 leading-snug">
              {{ item.judul }}
            </h3>

            <p class="text-xs text-slate-500">
              Volume: <strong class="text-slate-800">{{ item.volume_per_minggu }} {{ item.satuan }}/minggu</strong> • Harga: <strong class="text-slate-800">{{ item.harga === 0 ? 'Gratis' : `Rp ${item.harga.toLocaleString('id-ID')}` }}</strong>
            </p>

            <div class="text-[11px] text-slate-400">
              Kedaluwarsa: {{ new Date(item.kedaluwarsa_pada).toLocaleDateString('id-ID') }}
            </div>
          </div>
        </div>

        <!-- Tombol Aksi Kontrol Status & Perpanjang 14 Hari (U9) -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div class="flex flex-wrap items-center gap-1.5">
            <button
              v-if="item.status === 'aktif'"
              @click="handleStatusChange(item.id, 'dipesan')"
              class="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg transition"
            >
              📦 Tandai Dipesan
            </button>
            <button
              v-if="item.status === 'dipesan'"
              @click="handleStatusChange(item.id, 'aktif')"
              class="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition"
            >
              ✓ Aktifkan Kembali
            </button>
            <button
              v-if="item.status !== 'selesai'"
              @click="handleStatusChange(item.id, 'selesai')"
              class="px-2.5 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg transition"
            >
              🤝 Tandai Selesai
            </button>
            <button
              v-if="item.status !== 'disembunyikan'"
              @click="handleStatusChange(item.id, 'disembunyikan')"
              class="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            >
              👁 Tutup Listing
            </button>
          </div>

          <button
            @click="handleExtend(item.id)"
            class="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
            title="Perpanjang masa aktif 14 hari ke depan"
          >
            ⏳ Perpanjang +14 Hari
          </button>
        </div>

        <!-- U10: Daftar Peminat yang Menghubungi Listing Ini (Deals) -->
        <div class="pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Daftar Peminat Terhubung ({{ getListingDeals(item.id).length }} Rekanan):</span>
          </div>

          <div v-if="getListingDeals(item.id).length > 0" class="space-y-2">
            <div
              v-for="d in getListingDeals(item.id)"
              :key="d.id"
              class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
            >
              <div>
                <div class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>🏪</span>
                  <span>{{ d.seeker_nama || 'Mitra Pencari Limbah' }}</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  Status: <strong class="capitalize" :class="d.status === 'selesai' ? 'text-emerald-700' : 'text-amber-700'">{{ d.status }}</strong>
                  <span v-if="d.volume_aktual_kg"> • {{ d.volume_aktual_kg }} kg</span>
                </div>
                <!-- 3 Lencana Kepercayaan Peminat (F3, F11) -->
                <div class="mt-1.5">
                  <TrustBadge
                    :is-email-verified="true"
                    :is-location-verified="true"
                    :has-confirmed-transactions="true"
                  />
                </div>
              </div>

              <div class="flex items-center gap-2">
                <!-- Tombol Chat WA -->
                <a
                  v-if="d.seeker_wa"
                  :href="`https://wa.me/${d.seeker_wa.replace(/\D/g, '')}`"
                  target="_blank"
                  class="px-2.5 py-1.5 text-[11px] font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg transition flex items-center gap-1"
                >
                  <span>💬</span>
                  <span>WhatsApp Peminat</span>
                </a>

                <button
                  v-if="d.status !== 'selesai'"
                  @click="$emit('confirm-deal', d)"
                  class="px-3 py-1.5 text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition"
                >
                  ✓ Konfirmasi Selesai
                </button>
                <span v-else class="text-[11px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                  ✓ Transaksi Selesai
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-[11px] text-slate-400 italic">
            Belum ada pencari yang menghubungi listing ini.
          </div>
        </div>
      </div>
    </div>

    <!-- State Kosong jika belum ada listing -->
    <div v-else class="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
      <div class="text-3xl">📦</div>
      <div class="text-sm font-extrabold text-slate-800">Anda belum memiliki postingan limbah</div>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Ubah sisa produksi usaha Anda menjadi berkah ekonomi dan kurangi tumpukan sampah di TPA.
      </p>
      <button
        @click="$emit('open-quick-post')"
        class="mt-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow transition"
      >
        + Buat Postingan Limbah Pertama (1 Layar)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StatusListing, Deal } from '../types';
import TrustBadge from './TrustBadge.vue';
import { useWasteApp } from '../composables/useWasteApp';

const emit = defineEmits(['open-quick-post', 'confirm-deal']);

const { myListings, deals, updateListingStatus, extendListingExpiry } = useWasteApp();

function getListingDeals(listingId: string): Deal[] {
  return deals.value.filter(d => d.listing_id === listingId);
}

function handleStatusChange(listingId: string, newStatus: StatusListing) {
  updateListingStatus(listingId, newStatus);
}

function handleExtend(listingId: string) {
  const ok = extendListingExpiry(listingId);
  if (ok) {
    alert('Masa berlaku listing berhasil diperpanjang 14 hari!');
  }
}
</script>
