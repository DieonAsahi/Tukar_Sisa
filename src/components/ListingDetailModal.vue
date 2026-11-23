<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div
      class="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
    >
      <!-- Header Modal -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {{ listing.category_nama || 'Sisa Bernilai' }}
          </span>
          <span class="text-xs text-slate-400 font-semibold">•</span>
          <span class="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <span>📍</span>
            <span>{{ listing.jarak_teks || 'Dekat Anda' }}</span>
          </span>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>
      </div>

      <!-- Body Modal -->
      <div class="p-5 space-y-4">
        <!-- Galeri Foto (1-3 foto) -->
        <div class="space-y-2">
          <div class="w-full h-60 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 relative">
            <img
              :src="activePhoto"
              :alt="listing.judul"
              class="w-full h-full object-cover"
            />
            <!-- Indikator Jarak -->
            <div class="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-xl text-white text-xs font-bold flex items-center gap-1.5">
              <span>📍 Perkiraan Jarak:</span>
              <span class="text-emerald-300 font-black">{{ listing.jarak_teks || 'dekat' }}</span>
            </div>
          </div>

          <!-- Thumbnails jika lebih dari 1 foto -->
          <div v-if="listing.foto_urls && listing.foto_urls.length > 1" class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="(photo, idx) in listing.foto_urls"
              :key="idx"
              @click="activePhotoIdx = idx"
              :class="[
                'w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition',
                activePhotoIdx === idx ? 'border-brand-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
              ]"
            >
              <img :src="photo" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Judul & Harga / Skema -->
        <div>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span
              v-if="listing.jenis_harga === 'gratis'"
              class="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800"
            >
              🎉 Gratis (Hibah Sisa)
            </span>
            <span
              v-else-if="listing.jenis_harga === 'barter'"
              class="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900"
            >
              🔄 Skema Barter
            </span>
            <span
              v-else
              class="text-xs font-extrabold px-3 py-1 rounded-full bg-brand-100 text-brand-900"
            >
              Rp {{ (listing.nominal_harga || 0).toLocaleString('id-ID') }} / {{ listing.satuan }}
            </span>

            <span class="text-xs font-bold text-slate-500">
              Stok Tersedia: <strong class="text-slate-900">{{ listing.stok }} {{ listing.satuan }}</strong>
            </span>
          </div>

          <h2 class="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            {{ listing.judul }}
          </h2>

          <div v-if="listing.keterangan_barter" class="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
            <strong>Keterangan Barter:</strong> {{ listing.keterangan_barter }}
          </div>
        </div>

        <!-- Deskripsi -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Keterangan Sisa</h4>
          <p class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
            {{ listing.deskripsi }}
          </p>
        </div>

        <!-- Rincian Pengambilan & Satuan -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="text-slate-400 font-bold uppercase text-[10px]">Metode Ambil</div>
            <div class="font-extrabold text-slate-800 mt-0.5">Pencari Ambil Sendiri</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="text-slate-400 font-bold uppercase text-[10px]">Estimasi Berat</div>
            <div class="font-extrabold text-slate-800 mt-0.5">
              {{ listing.berat_per_satuan_kg ? `~${listing.berat_per_satuan_kg} kg/${listing.satuan}` : 'Sesuai kesepakatan' }}
            </div>
          </div>
        </div>

        <!-- Profil Pemasok & Tanda Kepercayaan (PRD) -->
        <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                {{ listing.nama_tampilan.charAt(0) }}
              </div>
              <div>
                <div class="font-black text-slate-900 text-sm">
                  {{ listing.nama_tampilan }}
                </div>
                <div v-if="listing.nama_toko_profesi" class="text-xs font-bold text-emerald-900">
                  {{ listing.nama_toko_profesi }}
                </div>
              </div>
            </div>

            <!-- Tombol Ikuti Pemasok -->
            <button
              @click="handleToggleFollow"
              :class="[
                'px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1',
                listing.is_following
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              ]"
            >
              <span>{{ listing.is_following ? '★' : '☆' }}</span>
              <span>{{ listing.is_following ? 'Mengikuti' : 'Ikuti Pemasok' }}</span>
            </button>
          </div>

          <!-- Tanda Kepercayaan -->
          <TrustBadge
            :nama-toko-profesi="listing.nama_toko_profesi"
            :jumlah-transaksi-selesai="listing.transaksi_selesai"
            :tanggal-bergabung="listing.dibuat_pada"
          />
        </div>

        <!-- Kotak Permintaan Jumlah Sebelum Hubungi WA -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <label class="text-xs font-bold text-slate-700">Jumlah yang Dibutuhkan:</label>
            <div class="flex items-center gap-1.5">
              <button
                @click="requestedQty = Math.max(1, requestedQty - 1)"
                class="w-7 h-7 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                :max="listing.stok"
                v-model.number="requestedQty"
                class="w-16 text-center text-xs font-extrabold bg-white border border-slate-300 rounded-lg py-1 text-slate-900 outline-none"
              />
              <button
                @click="requestedQty = Math.min(listing.stok, requestedQty + 1)"
                class="w-7 h-7 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
              >
                +
              </button>
              <span class="text-xs font-bold text-slate-600">{{ listing.satuan }}</span>
            </div>
          </div>
          <p class="text-[11px] text-slate-500 leading-relaxed">
            Menekan tombol hubungi akan mencatat transaksi berjalan di tab <strong>Aktivitas</strong> dan membuka WhatsApp untuk menyepakati alamat detail & waktu penjemputan.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-1">
          <!-- Tombol Hubungi via WhatsApp -->
          <button
            @click="handleContactWa"
            class="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <span>💬 Hubungi via WhatsApp</span>
            <span>({{ requestedQty }} {{ listing.satuan }})</span>
          </button>

          <!-- Tombol Laporkan Postingan -->
          <div class="flex justify-between items-center pt-2">
            <span class="text-[11px] text-slate-400">
              Menemukan limbah B3 atau pelanggaran?
            </span>
            <button
              @click="$emit('open-report', listing)"
              class="text-xs text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>🚨 Laporkan Postingan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { WasteListing } from '../types';
import { useWasteApp } from '../composables/useWasteApp';
import TrustBadge from './TrustBadge.vue';

const props = defineProps<{
  listing: WasteListing;
}>();

const emit = defineEmits(['close', 'open-report']);

const { contactSupplierViaWa, toggleFollowSupplier } = useWasteApp();

const activePhotoIdx = ref(0);
const requestedQty = ref(1);

const activePhoto = computed(() => {
  if (props.listing.foto_urls && props.listing.foto_urls.length > 0) {
    return props.listing.foto_urls[activePhotoIdx.value] || props.listing.foto_urls[0];
  }
  return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';
});

function handleContactWa() {
  const res = contactSupplierViaWa(props.listing, requestedQty.value);
  if (res.success) {
    emit('close');
  }
}

function handleToggleFollow() {
  toggleFollowSupplier(props.listing.user_id);
}
</script>
