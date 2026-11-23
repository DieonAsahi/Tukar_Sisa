<template>
  <div
    @click="$emit('click-detail', listing)"
    class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row group"
  >
    <!-- Foto Postingan (Foto 1 dengan indikator multi-foto) -->
    <div class="sm:w-44 h-48 sm:h-auto shrink-0 relative bg-slate-100 overflow-hidden">
      <img
        :src="mainPhoto"
        :alt="listing.judul"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        loading="lazy"
      />
      <!-- Badge Jumlah Foto -->
      <span
        v-if="listing.foto_urls && listing.foto_urls.length > 1"
        class="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
      >
        <span>📷</span>
        <span>{{ listing.foto_urls.length }} foto</span>
      </span>

      <!-- Badge Jarak Perkiraan Aman (S2) -->
      <span
        class="absolute top-2 left-2 bg-emerald-950/80 backdrop-blur text-emerald-200 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm"
      >
        <span>📍</span>
        <span>{{ listing.jarak_teks || 'Dekat Anda' }}</span>
      </span>
    </div>

    <!-- Konten Informasi Postingan -->
    <div class="p-4 flex-1 flex flex-col justify-between space-y-2">
      <div>
        <!-- Kategori & Jenis Harga -->
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            <span>♻️</span>
            <span>{{ listing.category_nama || 'Limbah Non-B3' }}</span>
          </span>

          <!-- Tag Harga / Barter / Gratis -->
          <span
            v-if="listing.jenis_harga === 'gratis'"
            class="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800"
          >
            Gratis (Hibah)
          </span>
          <span
            v-else-if="listing.jenis_harga === 'barter'"
            class="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900"
          >
            🔄 Barter
          </span>
          <span
            v-else
            class="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-brand-100 text-brand-900"
          >
            Rp {{ (listing.nominal_harga || 0).toLocaleString('id-ID') }} / {{ listing.satuan }}
          </span>
        </div>

        <!-- Judul -->
        <h3 class="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-brand-700 transition leading-snug line-clamp-1">
          {{ listing.judul }}
        </h3>

        <!-- Deskripsi singkat -->
        <p class="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
          {{ listing.deskripsi }}
        </p>

        <!-- Stok Tersedia -->
        <div class="mt-2 flex items-center gap-2 text-xs">
          <span class="font-extrabold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
            📦 Stok: <strong class="text-brand-700">{{ listing.stok }} {{ listing.satuan }}</strong>
            <span v-if="listing.berat_per_satuan_kg" class="text-slate-500 font-normal ml-1">
              (~{{ listing.berat_per_satuan_kg }} kg/{{ listing.satuan }})
            </span>
          </span>
          <span class="text-[11px] text-slate-400 font-medium">
            Pengambilan mandiri
          </span>
        </div>
      </div>

      <!-- Footer Kartu: Profil Pemasok & Tanda Kepercayaan -->
      <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
            {{ listing.nama_tampilan.charAt(0) }}
          </div>
          <div class="min-w-0 text-xs">
            <div class="font-bold text-slate-800 truncate">
              {{ listing.nama_tampilan }}
              <span v-if="listing.nama_toko_profesi" class="font-normal text-slate-500">
                ({{ listing.nama_toko_profesi }})
              </span>
            </div>
            <div class="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span>🤝</span>
              <span>{{ listing.transaksi_selesai || 0 }} transaksi selesai</span>
            </div>
          </div>
        </div>

        <!-- Tombol Ikuti Pemasok Cepat -->
        <button
          @click.stop="handleFollow"
          :class="[
            'px-2.5 py-1 text-xs font-bold rounded-xl border transition flex items-center gap-1 shrink-0',
            listing.is_following
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          ]"
          :title="listing.is_following ? 'Batal ikuti pemasok ini' : 'Ikuti pemasok ini untuk dapat notifikasi postingan baru'"
        >
          <span>{{ listing.is_following ? '★' : '☆' }}</span>
          <span>{{ listing.is_following ? 'Diikuti' : 'Ikuti' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { WasteListing } from '../types';
import { useWasteApp } from '../composables/useWasteApp';

const props = defineProps<{
  listing: WasteListing;
}>();

defineEmits(['click-detail']);

const { toggleFollowSupplier } = useWasteApp();

const mainPhoto = computed(() => {
  if (props.listing.foto_urls && props.listing.foto_urls.length > 0) {
    return props.listing.foto_urls[0];
  }
  return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';
});

function handleFollow() {
  toggleFollowSupplier(props.listing.user_id);
}
</script>
