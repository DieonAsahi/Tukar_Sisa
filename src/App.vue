<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 pb-24 md:pb-10">
    <!-- Header Aplikasi & Pengalih Rute -->
    <AppHeader
      :is-current-admin-route="currentPath === '/admin'"
      :current-tab="currentTab"
      @update:tab="currentTab = $event"
      @navigate-admin="handleGoAdmin"
      @navigate-home="handleGoHome"
      @open-verify-location="isLocationVerifyOpen = true"
      @open-profile-setup="isProfileSetupOpen = true"
      @open-quick-post="handleOpenQuickPost"
      @open-material-request="handleOpenMaterialRequest"
      @open-notifications="isNotificationsOpen = true"
      @open-help="isHelpOpen = true"
      @open-settings="isSettingsOpen = true"
    />

    <!-- Banner Peringatan Sanksi Akun & Route Guard -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-3">
      <SanctionBanner />

      <!-- Peringatan Route Guard jika pengguna biasa mencoba akses /admin -->
      <div
        v-if="routeGuardAlert"
        class="p-3 bg-red-100 border border-red-300 rounded-2xl text-xs text-red-900 font-bold mb-3 flex items-center justify-between shadow-sm"
      >
        <div class="flex items-center gap-2">
          <span>🚫</span>
          <span>{{ routeGuardAlert }}</span>
        </div>
        <button @click="routeGuardAlert = null" class="text-red-700 hover:text-red-900 font-black px-1">✕</button>
      </div>
    </div>

    <!-- MAIN BODY -->
    <!-- RUTE 1: /admin (Panel Moderasi & Kontrol) -->
    <main v-if="currentPath === '/admin'" class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4">
      <AdminDashboard @navigate-home="handleGoHome" />
    </main>

    <!-- RUTE 2: / (Mode Bersama: Pengunjung Tamu & Pengguna Terdaftar) -->
    <main v-else class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 space-y-4">
      <!-- V1: HERO SECTION UNTUK PENGUNJUNG PUBLIK / TAMU -->
      <div
        v-if="!isAuthenticated && currentTab === 'katalog'"
        class="bg-gradient-to-tr from-brand-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div class="relative z-10 max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300">
            <span>🌱</span> Platform Ekonomi Sirkular Antar-UMKM (SDG 8 & 12)
          </div>

          <h2 class="text-2xl sm:text-3xl font-black leading-tight text-white">
            Ubah Sisa Limbah UMKM Jadi Peluang Usaha & Cuan Bersama
          </h2>

          <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Jangan biarkan sisa kain konveksi, serbuk kayu, ampas kopi, atau kardus menumpuk dan bayar retribusi sampah mahal. Salurkan langsung ke sesama UMKM yang membutuhkan bahan baku daur ulang!
          </p>

          <!-- 3 Langkah Sederhana (V1) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div class="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10">
              <div class="text-base mb-1">📍 1. Atur Radius</div>
              <div class="text-[11px] text-slate-300">Cari limbah terdekat 1–100 km dari bengkel atau tempat usaha Anda.</div>
            </div>
            <div class="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10">
              <div class="text-base mb-1">🤝 2. Kontak WhatsApp</div>
              <div class="text-[11px] text-slate-300">Buka koordinat presisi & nomor WhatsApp dengan verifikasi OTP Email.</div>
            </div>
            <div class="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10">
              <div class="text-base mb-1">♻️ 3. Ambil & Olah</div>
              <div class="text-[11px] text-slate-300">Cek sampel di lokasi fisik, konfirmasi transaksi, dan catat kg limbah dialihkan.</div>
            </div>
          </div>

          <div class="pt-2 flex flex-wrap items-center gap-3">
            <button
              @click="isAuthModalOpen = true"
              class="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
            >
              Masuk via OTP Email (Gratis)
            </button>
            <button
              @click="isHelpOpen = true"
              class="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
            >
              Baca Aturan & Pedoman Keamanan
            </button>
          </div>
        </div>
      </div>

      <!-- 1. TAB: KATALOG PASOKAN LIMBAH & PETA (SPLIT SCREEN DESKTOP VS 1-COLUMN MOBILE) -->
      <section v-if="currentTab === 'katalog'">
        <div class="lg:grid lg:grid-cols-12 lg:gap-6 items-start space-y-4 lg:space-y-0">
          <!-- Kolom Kiri Desktop (lg:col-span-5, sticky): Pengatur Radius & Peta Interaktif -->
          <div class="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <!-- Pengatur Radius 1–100 km & Deteksi GPS -->
            <RadiusSelector />

            <!-- Peta Sumber Limbah (Lingkaran Samar Tamu vs Pin Presisi Terverifikasi) -->
            <ClientOnly>
              <InteractiveMap
                :listings="filteredListings"
                @select-listing="openListingDetail"
              />
            </ClientOnly>

            <!-- Edukasi Ringkas Radius & Privasi UU PDP -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 space-y-1.5 shadow-sm">
              <div class="font-extrabold text-slate-700 flex items-center justify-between">
                <span class="flex items-center gap-1.5"><span>🛡️</span> Pedoman Privasi UU PDP</span>
                <button @click="isHelpOpen = true" class="text-brand-700 hover:underline font-bold">Rincian</button>
              </div>
              <p class="text-[11px] leading-relaxed">
                Pengunjung umum hanya melihat estimasi radius lingkaran (~800m). Detail alamat jalan presisi dan nomor WhatsApp terlindungi dan hanya dibuka kepada UMKM terdaftar yang hendak bertransaksi.
              </p>
            </div>
          </div>

          <!-- Kolom Kanan Desktop (lg:col-span-7): Filter Bar & Daftar Kartu Pasokan Limbah -->
          <div class="lg:col-span-7 space-y-3">
            <!-- U12: BAR FILTER & PENGURUTAN LENGKAP -->
            <div class="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
                <span class="flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Filter Pasokan ({{ filteredListings.length }} Ditemukan)</span>
                </span>
                <!-- Urutkan (U14) -->
                <div class="flex items-center gap-1.5">
                  <span class="text-slate-400 font-normal">Urutkan:</span>
                  <select
                    v-model="sortBy"
                    class="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="terdekat">Terdekat (GPS)</option>
                    <option value="terbaru">Terbaru Diposting</option>
                    <option value="volume_terbanyak">Volume Terbanyak</option>
                  </select>
                </div>
              </div>

              <!-- Baris Kontrol Filter Kategori, Harga, dan Status Lokasi -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <!-- Dropdown Kategori -->
                <select
                  v-model="filterCategoryId"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="semua">Semua Kategori Non-B3</option>
                  <option
                    v-for="cat in allowedCategories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.nama }}
                  </option>
                </select>

                <!-- Tipe Harga -->
                <select
                  v-model="filterPriceType"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="semua">Semua Harga (Gratis & Jual)</option>
                  <option value="gratis">Hanya Gratis (Hibah Limbah)</option>
                  <option value="berbayar">Hanya Dijual Murah</option>
                </select>

                <!-- Toggle Hanya Lokasi Terverifikasi -->
                <button
                  type="button"
                  @click="filterOnlyVerified = !filterOnlyVerified"
                  :class="[
                    'px-2.5 py-1.5 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1',
                    filterOnlyVerified
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  ]"
                >
                  <span>📍</span>
                  <span>{{ filterOnlyVerified ? 'Hanya Terverifikasi ✓' : 'Semua Lokasi' }}</span>
                </button>
              </div>
            </div>

            <!-- Daftar Kartu Listing Limbah -->
            <div v-if="filteredListings.length > 0" class="space-y-3">
              <ListingCard
                v-for="listing in displayedListings"
                :key="listing.id"
                :listing="listing"
                @click-detail="openListingDetail"
              />

              <!-- U12: Tombol Muat Lebih Banyak -->
              <div v-if="hasMoreListings" class="flex justify-center pt-2 pb-4">
                <button
                  @click="loadMoreListings"
                  class="px-6 py-3 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition"
                >
                  Muat Lebih Banyak ({{ filteredListings.length - displayLimit }} tersisa)
                </button>
              </div>
            </div>

            <!-- State Kosong jika Radius Terlalu Sempit atau Filter Tidak Cocok -->
            <div
              v-else
              class="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2 shadow-sm"
            >
              <div class="text-3xl">🔍</div>
              <div class="text-sm font-extrabold text-slate-800">
                Tidak ada pasokan limbah yang sesuai dalam radius {{ radiusKm }} km
              </div>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">
                Coba perlebar radius pencarian Anda menjadi 25 km atau 50 km, atau ubah filter kategori dan harga di atas.
              </p>
              <button
                @click="setRadius(25); filterCategoryId = 'semua'; filterPriceType = 'semua'; filterOnlyVerified = false; displayLimit = 10"
                class="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold rounded-xl mt-2 transition shadow-sm"
              >
                Reset Filter & Perlebar ke 25 km
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. TAB: CARI BAHAN BAKU & REKOMENDASI MATCHING (U11, F7) -->
      <section v-else-if="currentTab === 'permintaan'" class="max-w-4xl mx-auto">
        <MatchingRecommendationsView @open-material-request="handleOpenMaterialRequest" />
      </section>

      <!-- 3. TAB: KAMUS "LIMBAH -> PELUANG" (F15, V5, V6) -->
      <section v-else-if="currentTab === 'kamus'" class="max-w-4xl mx-auto">
        <WasteDictionaryView />
      </section>

      <!-- 4. TAB: DASHBOARD DAMPAK (PUBLIK V2 & PRIBADI U22, SDG 8 & 12) -->
      <section v-else-if="currentTab === 'dampak'" class="max-w-4xl mx-auto">
        <ImpactDashboardView @open-confirm-tx="openConfirmTxModal" />
      </section>

      <!-- 5. TAB: KELOLA LISTING SAYA & PEMINAT (U9, U10) -->
      <section v-else-if="currentTab === 'kelola'" class="max-w-4xl mx-auto">
        <MyListingsView
          @open-quick-post="handleOpenQuickPost"
          @confirm-deal="openConfirmDealModal"
        />
      </section>

      <!-- 6. TAB: FAVORIT SAYA (U23) -->
      <section v-else-if="currentTab === 'favorit'" class="max-w-4xl mx-auto space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <h2 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>⭐</span> Pasokan Limbah Favorit Saya (U23)
            </h2>
            <p class="text-xs text-slate-500 font-medium">Listing yang Anda simpan untuk dipantau atau dihubungi nanti.</p>
          </div>
          <span class="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
            {{ favoriteListings.length }} Disimpan
          </span>
        </div>

        <div v-if="favoriteListings.length > 0" class="space-y-3">
          <ListingCard
            v-for="item in favoriteListings"
            :key="item.id"
            :listing="item"
            @click-detail="openListingDetail"
          />
        </div>
        <div v-else class="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
          <div class="text-3xl">⭐</div>
          <div class="text-sm font-extrabold text-slate-800">Belum ada listing favorit</div>
          <p class="text-xs text-slate-400">Klik ikon bintang pada kartu pasokan limbah untuk menyimpannya di sini.</p>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation Bar Mobile-First (Hanya tampil di ponsel pada rute /) -->
    <AppBottomNav
      v-if="currentPath === '/'"
      :current-tab="currentTab as any"
      @update:tab="currentTab = $event"
      @open-quick-post="handleOpenQuickPost"
    />

    <!-- MODAL & DIALOG LENGKAP PRD -->
    <!-- Modal Detail Listing & Unlocked Kontak -->
    <ListingDetailModal
      v-if="selectedListing"
      :listing="selectedListing"
      @close="selectedListing = null"
      @open-report="openReportModal"
    />

    <!-- Modal Form Posting 1 Layar (< 1 menit, U8) -->
    <QuickPostModal
      v-if="isQuickPostOpen"
      @close="isQuickPostOpen = false"
      @created="onListingCreated"
    />

    <!-- Modal Pasang Kebutuhan Bahan Baku (U11) -->
    <MaterialRequestModal
      :is-open="isMaterialRequestOpen"
      @close="isMaterialRequestOpen = false"
      @created="onMaterialRequestCreated"
    />

    <!-- Modal Verifikasi Lokasi Fisik (Toleransi <= 200m, U5) -->
    <LocationVerifyModal
      v-if="isLocationVerifyOpen"
      @close="isLocationVerifyOpen = false"
    />

    <!-- Modal Konfirmasi Transaksi Dua Pihak (U17, U18) -->
    <TransactionConfirmModal
      v-if="isConfirmTxOpen"
      :deal="selectedDeal"
      @close="isConfirmTxOpen = false; selectedDeal = null"
    />

    <!-- Modal Pelaporan Listing / Profil (U19) -->
    <ReportModal
      v-if="isReportOpen"
      :listing="reportTargetListing"
      @close="isReportOpen = false"
    />

    <!-- Modal Lengkapi Profil Usaha (U3, U4) -->
    <ProfileSetupModal
      :is-open="isProfileSetupOpen"
      @close="isProfileSetupOpen = false"
    />

    <!-- Modal Login OTP Email (Supabase Auth, U1, U2) -->
    <AuthOtpModal />

    <!-- Modal Bantuan, Pedoman Keselamatan & Privasi UU PDP (V7) -->
    <HelpLegalModal
      :is-open="isHelpOpen"
      @close="isHelpOpen = false"
    />

    <!-- Modal Pusat Notifikasi In-App (U20) -->
    <NotificationsModal
      :is-open="isNotificationsOpen"
      @close="isNotificationsOpen = false"
    />

    <!-- Modal Pengaturan Akun & Hapus Akun UU PDP (U7) -->
    <UserSettingsModal
      :is-open="isSettingsOpen"
      @close="isSettingsOpen = false"
      @open-profile="isProfileSetupOpen = true"
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
import InteractiveMap from './components/InteractiveMap.vue';
import ListingCard from './components/ListingCard.vue';
import ListingDetailModal from './components/ListingDetailModal.vue';
import QuickPostModal from './components/QuickPostModal.vue';
import MaterialRequestModal from './components/MaterialRequestModal.vue';
import LocationVerifyModal from './components/LocationVerifyModal.vue';
import TransactionConfirmModal from './components/TransactionConfirmModal.vue';
import ReportModal from './components/ReportModal.vue';
import ProfileSetupModal from './components/ProfileSetupModal.vue';
import AuthOtpModal from './components/AuthOtpModal.vue';
import HelpLegalModal from './components/HelpLegalModal.vue';
import NotificationsModal from './components/NotificationsModal.vue';
import UserSettingsModal from './components/UserSettingsModal.vue';
import MyListingsView from './components/MyListingsView.vue';
import WasteDictionaryView from './components/WasteDictionaryView.vue';
import ImpactDashboardView from './components/ImpactDashboardView.vue';
import MatchingRecommendationsView from './components/MatchingRecommendationsView.vue';
import AdminDashboard from './components/admin/AdminDashboard.vue';
import ClientOnly from './components/ClientOnly.vue';

const {
  currentUser,
  isAuthenticated,
  filteredListings,
  radiusKm,
  setRadius,
  requireAuth,
  isProfileSetupOpen,
  isAuthModalOpen,
  allowedCategories,
  filterCategoryId,
  filterPriceType,
  filterOnlyVerified,
  sortBy,
  favoriteListings,
  deals,
  loginAs
} = useWasteApp();

const { currentPath, routeGuardAlert, navigateTo } = useAppRouter(() => currentUser.value);

// Inisialisasi rute saat pertama kali dimuat di browser
onMounted(() => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    currentPath.value = '/admin';
    const isDemo = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE !== 'false';
    if (isDemo && (!currentUser.value || currentUser.value.peran_sistem !== 'admin')) {
      loginAs('admin');
    }
  }
});

const currentTab = ref<'katalog' | 'permintaan' | 'kamus' | 'dampak' | 'kelola' | 'favorit'>('katalog');

// U12: Paginasi "Muat Lebih Banyak" untuk katalog
const displayLimit = ref(10);

const displayedListings = computed(() => filteredListings.value.slice(0, displayLimit.value));
const hasMoreListings = computed(() => filteredListings.value.length > displayLimit.value);

function loadMoreListings() {
  displayLimit.value += 10;
}

const selectedListing = ref<WasteListing | null>(null);
const isQuickPostOpen = ref(false);
const isMaterialRequestOpen = ref(false);
const isLocationVerifyOpen = ref(false);
const isConfirmTxOpen = ref(false);
const selectedDeal = ref<Deal | null>(null);
const isReportOpen = ref(false);
const reportTargetListing = ref<WasteListing | null>(null);
const isHelpOpen = ref(false);
const isNotificationsOpen = ref(false);
const isSettingsOpen = ref(false);

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
  if (requireAuth('membuat posting limbah')) {
    isQuickPostOpen.value = true;
  }
}

function handleOpenMaterialRequest() {
  if (requireAuth('membuat permintaan kebutuhan bahan baku')) {
    isMaterialRequestOpen.value = true;
  }
}

function openConfirmTxModal() {
  if (requireAuth('mengonfirmasi transaksi')) {
    // Cari deal yang masih berlangsung
    const pendingDeal = deals.value.find(d => d.status === 'menghubungi');
    selectedDeal.value = pendingDeal || deals.value[0] || null;
    isConfirmTxOpen.value = true;
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
  currentTab.value = 'katalog';
}

function onMaterialRequestCreated() {
  currentTab.value = 'permintaan';
}
</script>
