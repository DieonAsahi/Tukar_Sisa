<template>
  <div class="space-y-4 max-w-7xl mx-auto">
    <!-- A1: Gerbang Akses Khusus /admin (Tampil jika belum login sebagai Admin) -->
    <div
      v-if="!isAdmin"
      class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center max-w-md mx-auto space-y-5 my-8"
    >
      <div class="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner">
        🛡️
      </div>
      <div>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 mb-2">
          Akses Khusus /admin (A1)
        </span>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900">Panel Pengawas Bursa Limbah</h2>
        <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Halaman ini dilindungi untuk Administrator & Tim Pengawas guna moderasi postingan, penegakan larangan B3, dan penanganan laporan pengaduan.
        </p>
      </div>

      <div class="space-y-2.5 pt-2">
        <button
          @click="loginAs('admin')"
          class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2"
        >
          <span>⚡</span>
          <span>Masuk Cepat sebagai Admin Demo (1-Klik)</span>
        </button>
        <button
          @click="isAuthModalOpen = true"
          class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
        >
          Masuk dengan Email Admin via OTP
        </button>
      </div>

      <div class="pt-3 border-t border-slate-100">
        <button
          @click="$emit('navigate-home')"
          class="text-xs text-slate-500 hover:text-slate-800 font-bold inline-flex items-center gap-1 transition"
        >
          <span>←</span>
          <span>Kembali ke Beranda Bursa Limbah /</span>
        </button>
      </div>
    </div>

    <!-- Panel Moderasi & Kontrol Utama (Tampil Jika Admin) -->
    <div v-else class="space-y-4">
      <!-- Header Admin Panel -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl border border-slate-800">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-bold text-indigo-300">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Panel Pengawas & Moderasi /admin
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="handlePrintPdf"
              class="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-1"
              title="Cetak Laporan Moderasi"
            >
              <span>🖨️</span>
              <span>Cetak Laporan</span>
            </button>
            <button
              @click="$emit('navigate-home')"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-white/10 px-3.5 py-1.5 rounded-xl transition hover:bg-white/20"
            >
              <span>← Kembali ke Bursa /</span>
            </button>
          </div>
        </div>
        <h1 class="text-xl sm:text-2xl font-black">Panel Kontrol Pengawas Bursa Limbah</h1>
        <p class="text-xs sm:text-sm text-slate-300 font-medium mt-1">
          Masuk sebagai: <strong class="text-white">{{ currentUser?.nama_tampilan }}</strong> ({{ currentUser?.email }}) • Standar Mutu Non-B3 & Kepatuhan SDG 12.
        </p>
      </div>

      <!-- 1. STATISTIK RINGKAS PLATFORM (A2) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Postingan Aktif</div>
          <div class="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{{ impactMetrics.total_postingan_aktif }}</div>
          <span class="text-[10px] text-emerald-600 font-bold">Siap Disalurkan</span>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Antrean Laporan</div>
          <div class="text-2xl sm:text-3xl font-black text-red-600 mt-0.5">{{ adminReportsQueue.length }}</div>
          <span class="text-[10px] text-red-700 font-bold">Wajib Foto Bukti (A3)</span>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transaksi Selesai</div>
          <div class="text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5">{{ impactMetrics.total_transaksi_selesai }}</div>
          <span class="text-[10px] text-emerald-700 font-bold">Dikonfirmasi Kedua Pihak</span>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Limbah Dialihkan</div>
          <div class="text-2xl sm:text-3xl font-black text-brand-700 mt-0.5">{{ impactMetrics.total_kg_dialihkan.toLocaleString('id-ID') }} kg</div>
          <span class="text-[10px] text-slate-500 font-bold">Pencegahan Sampah di Hulu</span>
        </div>
      </div>

      <!-- 2. NAVIGASI TAB ADMIN -->
      <div class="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex flex-wrap gap-1">
        <button
          v-for="tab in adminTabs"
          :key="tab.id"
          @click="activeAdminTab = tab.id"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5',
            activeAdminTab === tab.id
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          ]"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.badge !== undefined && tab.badge > 0"
            :class="[
              'px-1.5 py-0.2 rounded-full text-[10px] font-black',
              activeAdminTab === tab.id ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'
            ]"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- 3. KONTEN TAB ADMIN -->
      <!-- TAB A: ANTREAN LAPORAN (Diurutkan dari target terbanyak, wajib bukti foto - A3, A4) -->
      <div v-if="activeAdminTab === 'laporan'" class="space-y-3">
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Antrean Laporan Pengaduan Pengguna (A3)</h3>
            <p class="text-xs text-slate-500 font-medium">Diurutkan berdasarkan akumulasi laporan terbanyak per target (wajib foto bukti fisik).</p>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 bg-red-100 text-red-800 rounded-lg">
            {{ adminReportsQueue.length }} Kasus Terbuka
          </span>
        </div>

        <div v-if="adminReportsQueue.length > 0" class="space-y-3">
          <div
            v-for="rep in adminReportsQueue"
            :key="rep.id"
            class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-800">
                Laporan Target: {{ rep.target_type }}
              </span>
              <span class="text-xs text-slate-400 font-medium">
                Dilaporkan oleh: <strong>{{ rep.reporter_nama }}</strong>
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- Info Kasus -->
              <div class="md:col-span-2 space-y-1.5 text-xs">
                <div class="font-black text-slate-900 text-sm">
                  Alasan: "{{ rep.alasan }}"
                </div>
                <div v-if="rep.target_judul" class="text-slate-700 font-semibold">
                  Target: {{ rep.target_judul }}
                </div>
                <div v-if="rep.terlapor_nama" class="text-slate-600">
                  Terlapor: <strong class="text-slate-900">{{ rep.terlapor_nama }}</strong>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium leading-relaxed">
                  Catatan Pelapor: "{{ rep.catatan }}"
                </div>
              </div>

              <!-- Foto Bukti Wajib (A3) -->
              <div class="space-y-1">
                <label class="text-[11px] font-bold text-slate-500 uppercase">Foto Bukti Fisik Pelapor:</label>
                <div class="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img :src="rep.foto_bukti" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <!-- Form Putuskan Kasus (A4 - Alasan Wajib!) -->
            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <input
                type="text"
                v-model="actionReasons[rep.id]"
                placeholder="Tuliskan alasan tindakan admin secara tertulis (wajib)..."
                class="flex-1 min-w-[240px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 outline-none"
              />

              <div class="flex items-center gap-2">
                <button
                  @click="handleResolveReport(rep.id, 'selesai', rep.terlapor_id)"
                  class="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold transition"
                >
                  Sanksi & Selesaikan
                </button>
                <button
                  @click="handleResolveReport(rep.id, 'diabaikan')"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Abaikan Laporan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400 text-xs">
          Semua laporan pengaduan telah selesai ditindaklanjuti.
        </div>
      </div>

      <!-- TAB B: KELOLA POSTINGAN (A5) -->
      <div v-else-if="activeAdminTab === 'postingan'" class="space-y-3">
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <h3 class="text-sm font-extrabold text-slate-900">Moderasi Postingan Sisa (A5)</h3>
          <span class="text-xs font-bold text-slate-500">{{ listings.length }} Total Postingan</span>
        </div>

        <div class="space-y-2.5">
          <div
            v-for="item in listings"
            :key="item.id"
            class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'px-2 py-0.2 rounded font-black uppercase text-[10px]',
                    item.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ item.status }}
                </span>
                <span class="font-bold text-slate-500">{{ item.category_nama }}</span>
                <span>•</span>
                <span class="font-bold text-slate-700">Pemasok: {{ item.nama_tampilan }}</span>
              </div>
              <h4 class="text-sm font-extrabold text-slate-900 mt-0.5">{{ item.judul }}</h4>
              <p class="text-slate-500 font-medium line-clamp-1 mt-0.5">{{ item.deskripsi }}</p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                v-if="item.status === 'aktif'"
                @click="adminModerateListing(item.id, 'sembunyikan', 'Disembunyikan oleh pengawas platform')"
                class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold transition"
              >
                Sembunyikan
              </button>
              <button
                v-else
                @click="adminModerateListing(item.id, 'pulihkan', 'Dipulihkan oleh admin setelah pemeriksaan')"
                class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold transition"
              >
                Pulihkan
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB C: KELOLA KATEGORI (Masa Tayang, Satuan, Boleh Diposting - A6) -->
      <div v-else-if="activeAdminTab === 'kategori'" class="space-y-3">
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Kelola Kategori & Masa Tayang (A6)</h3>
            <p class="text-xs text-slate-500">Masa tayang sesuai jenis barang (sisa dapur 3 hari, kayu 14 hari).</p>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-slate-900 text-sm">{{ cat.nama }}</span>
                <span class="px-2 py-0.2 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {{ cat.kelompok }}
                </span>
                <span
                  :class="[
                    'px-2 py-0.2 rounded-md text-[10px] font-black',
                    cat.boleh_diposting ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ cat.boleh_diposting ? 'Boleh Diposting' : 'Dilarang Keras' }}
                </span>
              </div>
              <div class="text-slate-500 mt-1">
                Masa tayang: <strong class="text-slate-900">{{ cat.masa_tayang_jam }} jam ({{ Math.round(cat.masa_tayang_jam / 24) }} hari)</strong>
                • Satuan default: <strong>{{ cat.satuan_default }}</strong>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                @click="cat.boleh_diposting = !cat.boleh_diposting"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition"
              >
                Ubah Status
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB D: KONTEN EDUKASI BERSIFAT ILMIAH (A7) -->
      <div v-else-if="activeAdminTab === 'edukasi'" class="space-y-3">
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <h3 class="text-sm font-extrabold text-slate-900">Kelola Konten Edukasi Pemanfaatan Sisa (A7)</h3>
          <span class="text-xs font-bold text-slate-500">{{ educationArticles.length }} Artikel</span>
        </div>

        <div class="space-y-2.5">
          <div
            v-for="art in educationArticles"
            :key="art.id"
            class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1.5 text-xs"
          >
            <div class="flex items-center justify-between">
              <h4 class="font-extrabold text-slate-900 text-sm">{{ art.judul }}</h4>
              <span class="text-slate-400 text-[11px]">Wajib bersumber</span>
            </div>
            <p class="text-slate-600">{{ art.ringkasan }}</p>
            <div class="pt-1 text-[11px] text-slate-500">
              Sumber: <strong class="text-slate-800">{{ art.sumber }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB E: LOG AUDIT IMMUTABLE (A8, S8) -->
      <div v-else class="space-y-3">
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Log Audit Tindakan Pengawas (A8, S8)</h3>
            <p class="text-xs text-slate-500 font-medium">Catatan append-only yang tidak dapat diubah atau dihapus.</p>
          </div>
          <span class="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg">
            {{ adminActions.length }} Catatan
          </span>
        </div>

        <div class="space-y-2">
          <div
            v-for="act in adminActions"
            :key="act.id"
            class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1 text-xs"
          >
            <div class="flex items-center justify-between text-slate-400 text-[11px]">
              <span class="font-black text-indigo-700 uppercase">{{ act.aksi }}</span>
              <span>{{ act.waktu }}</span>
            </div>
            <div class="font-extrabold text-slate-800">
              Admin: {{ act.admin_nama || 'Admin' }} • Target: {{ act.target_type }} ({{ act.target_id }})
            </div>
            <div class="text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 font-medium">
              Alasan: "{{ act.alasan }}"
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useWasteApp } from '../../composables/useWasteApp';

defineEmits(['navigate-home']);

const {
  currentUser,
  isAdmin,
  loginAs,
  isAuthModalOpen,
  impactMetrics,
  adminReportsQueue,
  listings,
  categories,
  educationArticles,
  adminActions,
  adminModerateListing,
  adminResolveReport,
  adminSanctionAccount
} = useWasteApp();

const activeAdminTab = ref<'laporan' | 'postingan' | 'kategori' | 'edukasi' | 'audit'>('laporan');
const actionReasons = reactive<Record<string, string>>({});

const adminTabs = [
  { id: 'laporan' as const, label: 'Antrean Laporan', icon: '🚨', badge: 1 },
  { id: 'postingan' as const, label: 'Moderasi Postingan', icon: '📋' },
  { id: 'kategori' as const, label: 'Kategori Sisa', icon: '🗂️' },
  { id: 'edukasi' as const, label: 'Artikel Edukasi', icon: '📖' },
  { id: 'audit' as const, label: 'Log Audit (Immutable)', icon: '🔒' }
];

function handleResolveReport(reportId: string, decision: 'selesai' | 'diabaikan', terlaporId?: string) {
  const reason = actionReasons[reportId] || 'Tindakan verifikasi laporan oleh tim pengawas';
  adminResolveReport(reportId, decision, reason);

  if (decision === 'selesai' && terlaporId) {
    adminSanctionAccount(terlaporId, 'peringatan', reason);
  }

  alert(`Laporan berhasil diputuskan: ${decision.toUpperCase()}. Tindakan dicatat ke Log Audit.`);
}

function handlePrintPdf() {
  window.print();
}
</script>
