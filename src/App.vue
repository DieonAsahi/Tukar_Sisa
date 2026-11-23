<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 pb-24 md:pb-10">
    <!-- Header Aplikasi & Pengalih Rute -->
    <AppHeader
      :is-current-admin-route="currentPath === '/admin'"
      :current-tab="currentTab"
      @update:tab="currentTab = $event"
      @navigate-admin="handleGoAdmin"
      @navigate-home="handleGoHome"
      @open-upload="handleOpenQuickPost"
      @open-settings="isSettingsOpen = true"
      @open-help="isHelpOpen = true"
    />

    <!-- Banner Peringatan Sanksi Akun -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-3">
      <SanctionBanner />
    </div>

    <!-- MAIN BODY -->
    <!-- RUTE 1: /admin (Panel Moderasi & Pengawas) -->
    <main v-if="currentPath === '/admin'" class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4">
      <AdminDashboard @navigate-home="handleGoHome" />
    </main>

    <!-- RUTE 2: / (Cari, Unggah, Aktivitas, Akun, Edukasi, Dampak) -->
    <main v-else class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 space-y-4">
      <!-- HERO SECTION UNTUK PENGUNJUNG TAMU (G1) -->
      <div
        v-if="!isAuthenticated && currentTab === 'cari'"
        class="bg-gradient-to-tr from-brand-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div class="relative z-10 max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300">
            <span>🌱</span> Platform Sisa Bernilai Antar-Pengguna (SDG 12)
          </div>

          <h2 class="text-2xl sm:text-3xl font-black leading-tight text-white">
            Ubah Sisa Bernilai Jadi Peluang Usaha & Cuan Bersama
          </h2>

          <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Percepat rantai pemakaian ulang sisa dapur, ampas kopi, kain perca, dan serbuk kayu sebelum menjadi sampah. Tanpa perantara, tanpa kurir, dan lokasi terlindungi.
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              @click="isAuthModalOpen = true"
              class="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
            >
              Masuk via OTP Email (Gratis)
            </button>
            <button
              @click="currentTab = 'edukasi'"
              class="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
            >
              📖 Baca Panduan Edukasi
            </button>
            <button
              @click="isHelpOpen = true"
              class="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
            >
              Aturan & Barang Terlarang
            </button>
          </div>
        </div>
      </div>

      <!-- 1. TAB: CARI SISA (U6 - TANPA PETA) -->
      <section v-if="currentTab === 'cari'">
        <div class="lg:grid lg:grid-cols-12 lg:gap-6 items-start space-y-4 lg:space-y-0">
          <!-- Kolom Kiri Desktop (lg:col-span-4): Pengatur Radius Slider (0-100 km) & Panduan -->
          <div class="lg:col-span-4 lg:sticky lg:top-20 space-y-3">
            <RadiusSelector />

            <!-- Banner Privasi Lokasi Aman -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 space-y-1.5 shadow-sm">
              <div class="font-extrabold text-slate-800 flex items-center justify-between">
                <span class="flex items-center gap-1.5"><span>🛡️</span> Privasi Tanpa Peta</span>
                <button @click="isHelpOpen = true" class="text-brand-700 hover:underline font-bold">Rincian</button>
              </div>
              <p class="text-[11px] leading-relaxed">
                Platform tidak menampilkan peta atau alamat presisi. Jarak yang Anda lihat dihitung antar titik acak (pergeseran tetap maks 1 km).
              </p>
            </div>
          </div>

          <!-- Kolom Kanan Desktop (lg:col-span-8): Filter & Daftar Kartu Sisa -->
          <div class="lg:col-span-8 space-y-3">
            <!-- Filter Bar: Kata Kunci, Kategori, Harga, Urutkan -->
            <div class="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
              <!-- Baris 1: Pencarian Kata Kunci & Urutan -->
              <div class="flex flex-col sm:flex-row items-center gap-2">
                <div class="relative flex-1 w-full">
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Cari sisa: ampas kopi, serbuk kayu, kain perca..."
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                </div>

                <div class="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  <span class="text-xs text-slate-400 font-medium">Urutkan:</span>
                  <select
                    v-model="sortBy"
                    class="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="jarak">Terdekat</option>
                    <option value="terbaru">Terbaru Diposting</option>
                  </select>
                </div>
              </div>

              <!-- Baris 2: Dropdown Kategori & Jenis Harga -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <!-- Dropdown Kategori Non-B3 -->
                <select
                  v-model="selectedCategoryId"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="semua">Semua Kategori Sisa</option>
                  <option
                    v-for="cat in allowedCategories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.nama }} ({{ cat.masa_tayang_jam }} jam)
                  </option>
                </select>

                <!-- Filter Jenis Harga -->
                <select
                  v-model="selectedPriceType"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="semua">Semua Skema (Gratis, Uang, Barter)</option>
                  <option value="gratis">Hanya Gratis (Hibah Sisa)</option>
                  <option value="uang">Hanya Dijual Uang</option>
                  <option value="barter">Hanya Skema Barter</option>
                </select>
              </div>
            </div>

            <!-- Total Temuan -->
            <div class="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Menampilkan {{ filteredListings.length }} postingan sisa bernilai</span>
              <span v-if="radiusKm === 0" class="text-brand-700">Radius: Sekitar Saya (&lt; 2 km)</span>
              <span v-else class="text-slate-600">Radius: {{ radiusKm }} km</span>
            </div>

            <!-- Daftar Kartu Listing -->
            <div v-if="filteredListings.length > 0" class="space-y-3">
              <ListingCard
                v-for="listing in displayedListings"
                :key="listing.id"
                :listing="listing"
                @click-detail="openListingDetail"
              />

              <!-- Paginasi Muat Lebih Banyak -->
              <div v-if="hasMoreListings" class="flex justify-center pt-2 pb-4">
                <button
                  @click="loadMoreListings"
                  class="px-6 py-3 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition"
                >
                  Muat Lebih Banyak ({{ filteredListings.length - displayLimit }} tersisa)
                </button>
              </div>
            </div>

            <!-- State Kosong jika Tidak Ada Hasil -->
            <div
              v-else
              class="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500 space-y-2 shadow-sm"
            >
              <div class="text-3xl">🔍</div>
              <div class="text-sm font-extrabold text-slate-800">
                Tidak ada sisa bernilai dalam radius {{ radiusKm === 0 ? '< 2' : radiusKm }} km
              </div>
              <p class="text-xs text-slate-400 max-w-sm mx-auto">
                Coba perlebar radius pencarian menjadi 25 km atau 50 km, atau ubah filter kategori di atas.
              </p>
              <button
                @click="resetFilters"
                class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl mt-2 transition"
              >
                Reset Filter & Perlebar ke 25 km
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. TAB: AKTIVITAS (DEALS BERJALAN & NOTIFIKASI REALTIME) -->
      <section v-else-if="currentTab === 'aktivitas'">
        <ActivityView @open-confirm="openConfirmDealModal" />
      </section>

      <!-- 3. TAB: EDUKASI (PANDUAN PEMANFAATAN BERSUMBER) -->
      <section v-else-if="currentTab === 'edukasi'">
        <EducationView />
      </section>

      <!-- 4. TAB: DAMPAK LINGKUNGAN (SDG 12) -->
      <section v-else-if="currentTab === 'dampak'">
        <ImpactDashboardView />
      </section>

      <!-- 5. TAB: AKUN SAYA (PROFIL, 3 SLOT LOKASI, POSTINGAN SAYA) -->
      <section v-else-if="currentTab === 'akun'">
        <AccountView
          @open-settings="isSettingsOpen = true"
          @open-upload="handleOpenQuickPost"
        />
      </section>
    </main>

    <!-- Bottom Navigation Bar Mobile-First (4 Tab: Cari | Unggah | Aktivitas | Akun) -->
    <AppBottomNav
      v-if="currentPath === '/'"
      :current-tab="currentTab as any"
      @update:tab="currentTab = $event"
      @open-upload="handleOpenQuickPost"
    />

    <!-- MODAL LENGKAP -->
    <!-- Modal Detail Postingan Sisa -->
    <ListingDetailModal
      v-if="selectedListing"
      :listing="selectedListing"
      @close="selectedListing = null"
      @open-report="openReportModal"
    />

    <!-- Modal Form Unggah Postingan Sisa (1-3 Foto, Hapus EXIF, 3 Slot Lokasi) -->
    <QuickPostModal
      v-if="isQuickPostOpen"
      @close="isQuickPostOpen = false"
      @created="onListingCreated"
    />

    <!-- Modal Konfirmasi Serah Terima Transaksi & Aduan -->
    <TransactionConfirmModal
      v-if="isConfirmTxOpen && selectedDeal"
      :deal="selectedDeal"
      @close="isConfirmTxOpen = false; selectedDeal = null"
    />

    <!-- Modal Laporan Pelanggaran (Wajib Lampirkan Foto Bukti) -->
    <ReportModal
      v-if="isReportOpen"
      :listing="reportTargetListing"
      @close="isReportOpen = false"
    />

    <!-- Modal Login OTP Email -->
    <AuthOtpModal />

    <!-- Modal Syarat Penggunaan, Barang Terlarang & Panduan Keamanan -->
    <HelpLegalModal
      :is-open="isHelpOpen"
      @close="isHelpOpen = false"
    />

    <!-- Modal Pengaturan Akun & 3 Slot Lokasi (UU PDP) -->
    <UserSettingsModal
      v-if="isSettingsOpen"
      @close="isSettingsOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { WasteListing, Deal } from './types';
import { useWasteApp } from './composables/useWasteApp';
import { useAppRouter } from './composables/useAppRouter';

import AppHeader from './components/AppHeader.vue';
import AppBottomNav from './components/AppBottomNav.vue';
import SanctionBanner from './components/SanctionBanner.vue';
import RadiusSelector from './components/RadiusSelector.vue';
import ListingCard from './components/ListingCard.vue';
import ListingDetailModal from './components/ListingDetailModal.vue';
import QuickPostModal from './components/QuickPostModal.vue';
import TransactionConfirmModal from './components/TransactionConfirmModal.vue';
import ReportModal from './components/ReportModal.vue';
import AuthOtpModal from './components/AuthOtpModal.vue';
import HelpLegalModal from './components/HelpLegalModal.vue';
import UserSettingsModal from './components/UserSettingsModal.vue';
import ActivityView from './components/ActivityView.vue';
import EducationView from './components/EducationView.vue';
import ImpactDashboardView from './components/ImpactDashboardView.vue';
import AccountView from './components/AccountView.vue';
import AdminDashboard from './components/admin/AdminDashboard.vue';

const {
  currentUser,
  isAuthenticated,
  filteredListings,
  allowedCategories,
  radiusKm,
  searchQuery,
  selectedCategoryId,
  selectedPriceType,
  sortBy,
  isAuthModalOpen,
  requireAuth,
  loginAs
} = useWasteApp();

const { currentPath, navigateTo } = useAppRouter(() => currentUser.value);

const currentTab = ref<'cari' | 'unggah' | 'aktivitas' | 'akun' | 'edukasi' | 'dampak'>('cari');

// Paginasi
const displayLimit = ref(10);
const displayedListings = computed(() => filteredListings.value.slice(0, displayLimit.value));
const hasMoreListings = computed(() => filteredListings.value.length > displayLimit.value);

function loadMoreListings() {
  displayLimit.value += 10;
}

function resetFilters() {
  radiusKm.value = 25;
  searchQuery.value = '';
  selectedCategoryId.value = 'semua';
  selectedPriceType.value = 'semua';
}

const selectedListing = ref<WasteListing | null>(null);
const isQuickPostOpen = ref(false);
const isConfirmTxOpen = ref(false);
const selectedDeal = ref<Deal | null>(null);
const isReportOpen = ref(false);
const reportTargetListing = ref<WasteListing | null>(null);
const isHelpOpen = ref(false);
const isSettingsOpen = ref(false);

onMounted(() => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    currentPath.value = '/admin';
    const isDemo = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE !== 'false';
    if (isDemo && (!currentUser.value || currentUser.value.peran_sistem !== 'admin')) {
      loginAs('admin');
    }
  }
});

function handleGoAdmin() {
  const isDemo = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE !== 'false';
  if (isDemo && (!currentUser.value || currentUser.value.peran_sistem !== 'admin')) {
    loginAs('admin');
  }
  navigateTo('/admin', currentUser.value);
}

function handleGoHome() {
  navigateTo('/');
}

function openListingDetail(listing: WasteListing) {
  selectedListing.value = listing;
}

function handleOpenQuickPost() {
  if (requireAuth('mengunggah postingan sisa')) {
    isQuickPostOpen.value = true;
  }
}

function openConfirmDealModal(deal: Deal) {
  selectedDeal.value = deal;
  isConfirmTxOpen.value = true;
}

function openReportModal(listing: WasteListing) {
  reportTargetListing.value = listing;
  isReportOpen.value = true;
}

function onListingCreated() {
  currentTab.value = 'cari';
}
</script>
