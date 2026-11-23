<template>
  <div class="space-y-4 max-w-4xl mx-auto">
    <!-- Header Tab Aktivitas -->
    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <span>🔔</span>
          <span>Aktivitas Transaksi & Notifikasi</span>
        </h2>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Pantau kontak berjalan (maks 5), konfirmasi serah terima, dan pembaruan pemasok
        </p>
      </div>

      <!-- Tab Switcher -->
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
        <button
          @click="activeSection = 'deals'"
          :class="[
            'px-3 py-1.5 rounded-lg transition flex items-center gap-1.5',
            activeSection === 'deals' ? 'bg-white text-brand-800 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <span>🤝 Transaksi Berjalan</span>
          <span v-if="myActiveDeals.length > 0" class="px-1.5 py-0.2 bg-brand-100 text-brand-800 rounded-full text-[10px]">
            {{ myActiveDeals.length }}
          </span>
        </button>

        <button
          @click="activeSection = 'notifikasi'"
          :class="[
            'px-3 py-1.5 rounded-lg transition flex items-center gap-1.5',
            activeSection === 'notifikasi' ? 'bg-white text-brand-800 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <span>🔔 Notifikasi</span>
          <span v-if="unreadNotificationsCount > 0" class="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px]">
            {{ unreadNotificationsCount }}
          </span>
        </button>

        <button
          @click="activeSection = 'riwayat'"
          :class="[
            'px-3 py-1.5 rounded-lg transition',
            activeSection === 'riwayat' ? 'bg-white text-brand-800 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          Riwayat Selesai
        </button>
      </div>
    </div>

    <!-- 1. SECTION: TRANSAKSI BERJALAN (DEALS AKTIF) -->
    <div v-if="activeSection === 'deals'" class="space-y-3">
      <div v-if="myActiveDeals.length > 0" class="space-y-3">
        <div
          v-for="deal in myActiveDeals"
          :key="deal.id"
          class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span
              v-if="deal.status === 'menunggu_otomatis'"
              class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 flex items-center gap-1"
            >
              <span>⏳</span>
              <span>Menunggu Konfirmasi Pihak Kedua (Batas 3 Hari)</span>
            </span>
            <span
              v-else-if="deal.status === 'dalam_aduan'"
              class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-100 text-red-900 flex items-center gap-1"
            >
              <span>⚖️</span>
              <span>Dalam Aduan Admin</span>
            </span>
            <span
              v-else
              class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-900 flex items-center gap-1"
            >
              <span>💬</span>
              <span>Deal Berjalan (WhatsApp)</span>
            </span>

            <span class="text-xs text-slate-400 font-medium">
              Dimulai: {{ formatDate(deal.dibuat_pada) }}
            </span>
          </div>

          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-900">
              {{ deal.listing_judul }}
            </h3>
            <div class="text-xs text-slate-600 mt-0.5">
              Jumlah: <strong class="text-brand-700">{{ deal.jumlah_diminta }} {{ deal.satuan || 'kg' }}</strong>
              • Pemasok: <strong>{{ deal.pemasok_nama }}</strong>
              • Pencari: <strong>{{ deal.pencari_nama }}</strong>
            </div>
          </div>

          <!-- Action Buttons untuk Deal -->
          <div class="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <!-- Tombol WhatsApp -->
              <a
                v-if="deal.pemasok_wa"
                :href="`https://wa.me/${deal.pemasok_wa.replace(/\D/g, '')}`"
                target="_blank"
                class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <span>💬 Buka WhatsApp</span>
              </a>
            </div>

            <!-- Tombol Konfirmasi Selesai -->
            <button
              @click="$emit('open-confirm', deal)"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-black shadow transition flex items-center gap-1"
            >
              <span>✓ Konfirmasi Serah Terima Selesai</span>
            </button>
          </div>
        </div>
      </div>

      <!-- State Kosong Deals -->
      <div v-else class="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
        <div class="text-3xl">🤝</div>
        <div class="text-sm font-extrabold text-slate-800">Tidak ada transaksi yang sedang berjalan</div>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">
          Cari sisa yang Anda butuhkan di tab <strong>Cari</strong> dan tekan tombol Hubungi via WhatsApp untuk memulai transaksi baru (maksimal 5 kontak berjalan).
        </p>
      </div>
    </div>

    <!-- 2. SECTION: NOTIFIKASI REALTIME (SRS FR-NOT-JENIS) -->
    <div v-else-if="activeSection === 'notifikasi'" class="space-y-3">
      <div v-if="myNotifications.length > 0" class="space-y-2">
        <div class="flex justify-end">
          <button
            @click="markAllNotificationsRead"
            class="text-xs font-bold text-brand-700 hover:underline"
          >
            Tandai Semua Telah Dibaca
          </button>
        </div>

        <div
          v-for="notif in myNotifications"
          :key="notif.id"
          @click="markNotificationRead(notif.id)"
          :class="[
            'p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer',
            notif.dibaca
              ? 'bg-white border-slate-200 text-slate-600'
              : 'bg-emerald-50/60 border-emerald-200 text-slate-900 shadow-sm'
          ]"
        >
          <!-- Ikon Notifikasi sesuai FR-NOT-JENIS -->
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm shrink-0 mt-0.5">
            <span v-if="notif.tipe === 'deal_baru'">💬</span>
            <span v-else-if="notif.tipe === 'listing_baru_supplier'">📦</span>
            <span v-else-if="notif.tipe === 'konfirmasi_diminta'">⏳</span>
            <span v-else-if="notif.tipe === 'deal_selesai'">🎉</span>
            <span v-else-if="notif.tipe === 'deal_batal'">❌</span>
            <span v-else-if="notif.tipe === 'aduan_deal'">⚖️</span>
            <span v-else-if="notif.tipe === 'laporan_diputuskan'">🛡️</span>
            <span v-else-if="notif.tipe === 'sanksi_admin'">⚠️</span>
            <span v-else-if="notif.tipe === 'stok_habis'">📭</span>
            <span v-else-if="notif.tipe === 'pengikut_baru'">👥</span>
            <span v-else>🔔</span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h4 class="text-xs font-black text-slate-900">{{ notif.judul }}</h4>
              <span class="text-[10px] text-slate-400">{{ formatDate(notif.dibuat_pada) }}</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {{ notif.isi }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
        <div class="text-3xl">🔔</div>
        <div class="text-sm font-extrabold text-slate-800">Belum ada notifikasi</div>
        <p class="text-xs text-slate-400">Pemberitahuan kontak, transaksi, dan unggahan pemasok yang diikuti akan muncul di sini.</p>
      </div>
    </div>

    <!-- 3. SECTION: RIWAYAT TRANSAKSI SELESAI -->
    <div v-else class="space-y-3">
      <div v-if="myCompletedDeals.length > 0" class="space-y-2.5">
        <div
          v-for="deal in myCompletedDeals"
          :key="deal.id"
          class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
        >
          <div>
            <div class="flex items-center gap-1.5 text-[11px] font-black" :class="deal.status === 'selesai' ? 'text-emerald-800' : 'text-slate-500'">
              <span v-if="deal.status === 'selesai'">✓ TRANSAKSI SELESAI</span>
              <span v-else>✕ DIBATALKAN</span>
              <span>•</span>
              <span class="text-slate-400 font-medium">{{ formatDate(deal.selesai_pada || deal.dibuat_pada) }}</span>
            </div>
            <h4 class="text-sm font-bold text-slate-800 mt-0.5">
              {{ deal.listing_judul }}
            </h4>
            <div class="text-xs text-slate-500">
              Jumlah Serah Terima: <strong class="text-slate-700">{{ deal.jumlah_akhir || deal.jumlah_diminta }} {{ deal.satuan || 'kg' }}</strong>
            </div>
          </div>

          <div class="text-xs text-slate-400">
            ID: <span class="font-mono text-[10px]">{{ deal.id.substring(0, 8) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
        <div class="text-3xl">📜</div>
        <div class="text-sm font-extrabold text-slate-800">Belum ada riwayat transaksi selesai</div>
        <p class="text-xs text-slate-400">Transaksi yang telah Anda konfirmasi selesai akan tercatat di sini.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

defineEmits(['open-confirm']);

const {
  myActiveDeals,
  myCompletedDeals,
  myNotifications,
  unreadNotificationsCount,
  markNotificationRead,
  markAllNotificationsRead
} = useWasteApp();

const activeSection = ref<'deals' | 'notifikasi' | 'riwayat'>('deals');

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
