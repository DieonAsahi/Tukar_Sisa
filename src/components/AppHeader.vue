<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
      <!-- 1. Logo & Branding -->
      <div class="flex items-center gap-2.5 cursor-pointer shrink-0" @click="$emit('navigate-home')">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <h1 class="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
              Bursa Limbah UMKM
            </h1>
            <span class="inline-block text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              SDG 8 & 12
            </span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium leading-none mt-0.5 hidden sm:block">
            {{ isCurrentAdminRoute ? 'Panel Pengawas /admin' : 'Pertukaran Bahan Baku Antar-UMKM' }}
          </p>
        </div>
      </div>

      <!-- 2. Navigasi Horizontal Desktop (hidden md:flex) -->
      <nav v-if="!isCurrentAdminRoute" class="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
        <button
          @click="$emit('update:tab', 'katalog')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1',
            currentTab === 'katalog'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>🗺️</span>
          <span>Peta & Sisa</span>
        </button>

        <button
          @click="$emit('update:tab', 'permintaan')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1',
            currentTab === 'permintaan'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>📦</span>
          <span>Cari Bahan</span>
        </button>

        <button
          @click="$emit('update:tab', 'kamus')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1',
            currentTab === 'kamus'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>📖</span>
          <span>Kamus</span>
        </button>

        <button
          @click="$emit('update:tab', 'dampak')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1',
            currentTab === 'dampak'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>🌱</span>
          <span>Dampak</span>
        </button>

        <!-- Tab Khusus Pengguna Login: Listing Saya (U9) & Favorit (U23) -->
        <button
          v-if="isAuthenticated"
          @click="$emit('update:tab', 'kelola')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1',
            currentTab === 'kelola'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>📑</span>
          <span>Posting Saya</span>
        </button>

        <button
          v-if="isAuthenticated"
          @click="$emit('update:tab', 'favorit')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1',
            currentTab === 'favorit'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>⭐</span>
          <span>Favorit</span>
        </button>
      </nav>

      <!-- 3. Action Buttons & User Area -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <!-- Tombol Bantuan, Pedoman Keselamatan & Privasi UU PDP (V7) -->
        <button
          @click="$emit('open-help')"
          class="p-2 text-slate-500 hover:text-brand-700 hover:bg-slate-100 rounded-xl transition"
          title="Bantuan, Aturan Platform, Pedoman Keselamatan & Privasi UU PDP"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <!-- Tombol Notifikasi In-App (U20) jika sudah login -->
        <button
          v-if="isAuthenticated"
          @click="$emit('open-notifications')"
          class="relative p-2 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-xl transition"
          title="Pusat Notifikasi"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span
            v-if="unreadNotificationsCount > 0"
            class="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse"
          >
            {{ unreadNotificationsCount }}
          </span>
        </button>

        <!-- Tombol Desktop + Posting Limbah & + Kebutuhan -->
        <div v-if="!isCurrentAdminRoute" class="hidden md:flex items-center gap-1.5">
          <button
            @click="$emit('open-material-request')"
            class="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
            title="Cari Pasokan Bahan Baku yang Anda Butuhkan"
          >
            <span>📦</span>
            <span>+ Kebutuhan</span>
          </button>

          <button
            @click="$emit('open-quick-post')"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 active:scale-95 transition"
            title="Posting Limbah Produksi Anda (Cepat < 1 Menit)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Posting Limbah</span>
          </button>
        </div>

        <!-- Tombol Beralih ke /admin (jika akun admin) -->
        <button
          v-if="isAdmin && !isCurrentAdminRoute"
          @click="$emit('navigate-admin')"
          class="px-2.5 sm:px-3 py-1.5 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm flex items-center gap-1 transition"
          title="Buka Panel Moderasi /admin"
        >
          <span>🛡️</span>
          <span>/admin</span>
        </button>

        <!-- Jika belum login -> Tombol Masuk OTP -->
        <button
          v-if="!isAuthenticated"
          @click="openAuthModal"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-xl shadow-sm transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span>Masuk / OTP</span>
        </button>

        <!-- Jika sudah login -->
        <div v-else class="flex items-center gap-1.5 sm:gap-2">
          <!-- Profil Usaha & Lencana -->
          <button
            @click="$emit('open-profile-setup')"
            class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition"
            title="Klik untuk melihat dan melengkapi Profil Usaha Anda"
          >
            <span>🏪</span>
            <span class="max-w-[100px] sm:max-w-[140px] truncate">
              {{ currentUser?.nama_usaha || currentUser?.email?.split('@')[0] || 'Profil Usaha' }}
            </span>
            <span
              v-if="currentUser?.is_lokasi_terverifikasi"
              class="w-2 h-2 rounded-full bg-emerald-500"
              title="Lokasi Terverifikasi"
            ></span>
          </button>

          <!-- Tombol Pengaturan Akun & Hapus Akun UU PDP (U7) -->
          <button
            @click="$emit('open-settings')"
            class="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            title="Pengaturan Akun & Privasi UU PDP"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <!-- Tombol Keluar -->
          <button
            @click="logout"
            class="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-xl transition"
            title="Keluar Akun"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Role Switcher Bar (Alat Bantu Demo 30 Detik - Hanya Tampil Jika VITE_DEMO_MODE === 'true') -->
    <div
      v-if="isDemoMode"
      class="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-1.5"
    >
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-600">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Demo Role Switcher (Simulasi Cepat):</span>
        </span>
        <div class="flex items-center gap-1.5">
          <button
            @click="handleSwitchRole('tamu')"
            :class="[
              'px-2 py-0.5 rounded-lg text-xs font-semibold transition',
              !isAuthenticated ? 'bg-slate-800 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            ]"
          >
            Tamu (Publik)
          </button>
          <button
            @click="handleSwitchRole('pengguna')"
            :class="[
              'px-2 py-0.5 rounded-lg text-xs font-semibold transition',
              isAuthenticated && !isAdmin && currentUser?.status_akun === 'aktif' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            ]"
          >
            Pengguna UMKM
          </button>
          <button
            @click="handleSwitchRole('admin')"
            :class="[
              'px-2 py-0.5 rounded-lg text-xs font-semibold transition',
              isAdmin ? 'bg-indigo-700 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            ]"
          >
            Admin (/admin)
          </button>
          <button
            @click="handleSwitchRole('ditangguhkan')"
            :class="[
              'px-2 py-0.5 rounded-lg text-xs font-semibold transition',
              currentUser?.status_akun === 'ditangguhkan' ? 'bg-red-700 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            ]"
          >
            Disanksi
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

const isDemoMode = computed(() => import.meta.env.VITE_DEMO_MODE === 'true');

defineProps<{
  isCurrentAdminRoute?: boolean;
  currentTab?: 'katalog' | 'permintaan' | 'kamus' | 'dampak' | 'kelola' | 'favorit';
}>();

const emit = defineEmits([
  'open-verify-location',
  'open-profile-setup',
  'open-quick-post',
  'open-material-request',
  'open-notifications',
  'open-help',
  'open-settings',
  'navigate-admin',
  'navigate-home',
  'update:tab'
]);

const { currentUser, isAuthenticated, isAdmin, isAuthModalOpen, unreadNotificationsCount, loginAs, logout } = useWasteApp();

function openAuthModal() {
  isAuthModalOpen.value = true;
}

function handleSwitchRole(type: 'tamu' | 'pengguna' | 'admin' | 'ditangguhkan') {
  if (type === 'tamu') {
    logout();
    emit('navigate-home');
  } else if (type === 'pengguna') {
    loginAs('regular');
    emit('navigate-home');
  } else if (type === 'admin') {
    loginAs('admin');
    emit('navigate-admin');
  } else if (type === 'ditangguhkan') {
    loginAs('suspended');
    emit('navigate-home');
  }
}
</script>
