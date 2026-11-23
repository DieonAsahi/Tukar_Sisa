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
            <h1 class="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Bursa Limbah
            </h1>
            <span class="inline-block text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              SDG 12
            </span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium leading-none mt-0.5 hidden sm:block">
            {{ isCurrentAdminRoute ? 'Panel Pengawas /admin' : 'Penyaluran Sisa Bernilai Antar-Pengguna' }}
          </p>
        </div>
      </div>

      <!-- 2. Navigasi Horizontal Desktop (hidden md:flex) -->
      <nav v-if="!isCurrentAdminRoute" class="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
        <!-- Cari -->
        <button
          @click="$emit('update:tab', 'cari')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5',
            currentTab === 'cari'
              ? 'bg-white text-brand-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>🔍</span>
          <span>Cari</span>
        </button>

        <!-- Unggah -->
        <button
          @click="$emit('open-upload')"
          class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-brand-800 hover:bg-white/60 transition flex items-center gap-1.5"
        >
          <span>📦</span>
          <span>Unggah</span>
        </button>

        <!-- Aktivitas -->
        <button
          v-if="isAuthenticated"
          @click="$emit('update:tab', 'aktivitas')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative',
            currentTab === 'aktivitas'
              ? 'bg-white text-brand-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>🔔</span>
          <span>Aktivitas</span>
          <span
            v-if="unreadNotificationsCount > 0"
            class="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center ml-0.5"
          >
            {{ unreadNotificationsCount }}
          </span>
        </button>

        <!-- Edukasi (Bisa dibaca tamu) -->
        <button
          @click="$emit('update:tab', 'edukasi')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5',
            currentTab === 'edukasi'
              ? 'bg-white text-brand-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>📖</span>
          <span>Edukasi</span>
        </button>

        <!-- Dampak Lingkungan Publik -->
        <button
          @click="$emit('update:tab', 'dampak')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5',
            currentTab === 'dampak'
              ? 'bg-white text-brand-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>🌱</span>
          <span>Dampak (kg)</span>
        </button>

        <!-- Akun (jika login) -->
        <button
          v-if="isAuthenticated"
          @click="$emit('update:tab', 'akun')"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5',
            currentTab === 'akun'
              ? 'bg-white text-brand-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          <span>👤</span>
          <span>Akun</span>
        </button>
      </nav>

      <!-- 3. Tombol Aksi Kanan -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Tombol Syarat & Bantuan -->
        <button
          @click="$emit('open-help')"
          class="p-2 text-slate-500 hover:text-brand-700 hover:bg-slate-100 rounded-xl transition"
          title="Aturan Platform, Barang Terlarang & Panduan Keselamatan"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <!-- Tombol Menuju /admin -->
        <button
          v-if="(isAdmin || isDemoMode) && !isCurrentAdminRoute"
          @click="$emit('navigate-admin')"
          class="px-2.5 py-1.5 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm flex items-center gap-1 transition"
          title="Panel Pengawas & Moderasi /admin"
        >
          <span>🛡️</span>
          <span>/admin</span>
        </button>

        <!-- Tombol Masuk OTP jika Tamu -->
        <button
          v-if="!isAuthenticated"
          @click="openAuthModal"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-xl shadow-sm transition"
        >
          <span>Masuk / OTP</span>
        </button>

        <!-- Profil & Tombol Keluar jika Login -->
        <div v-else class="flex items-center gap-1.5">
          <button
            @click="$emit('open-settings')"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition"
            title="Pengaturan Akun & 3 Slot Lokasi"
          >
            <span>🏪</span>
            <span class="max-w-[120px] truncate">
              {{ currentUser?.nama_tampilan || 'Profil' }}
            </span>
          </button>

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

    <!-- Quick Role Switcher Bar (Demo 30 Detik) -->
    <div
      v-if="isDemoMode"
      class="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-1.5"
    >
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-600">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Simulasi Peran Demo (PRD Baru):</span>
        </span>
        <div class="flex items-center gap-1.5">
          <button
            @click="handleSwitchRole('tamu')"
            :class="[
              'px-2 py-0.5 rounded-lg text-xs font-semibold transition',
              !isAuthenticated ? 'bg-slate-800 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            ]"
          >
            Tamu
          </button>
          <button
            @click="handleSwitchRole('pengguna')"
            :class="[
              'px-2 py-0.5 rounded-lg text-xs font-semibold transition',
              isAuthenticated && !isAdmin && currentUser?.status_akun === 'aktif' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            ]"
          >
            Pengguna
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
            @click="handleSwitchRole('disanksi')"
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
  currentTab?: string;
}>();

const emit = defineEmits([
  'navigate-admin',
  'navigate-home',
  'update:tab',
  'open-upload',
  'open-settings',
  'open-help'
]);

const {
  currentUser,
  isAuthenticated,
  isAdmin,
  unreadNotificationsCount,
  isAuthModalOpen,
  loginAs,
  logout
} = useWasteApp();

function openAuthModal() {
  isAuthModalOpen.value = true;
}

function handleSwitchRole(type: 'tamu' | 'pengguna' | 'admin' | 'disanksi') {
  if (type === 'tamu') {
    logout();
    emit('navigate-home');
  } else if (type === 'pengguna') {
    loginAs('regular');
    emit('navigate-home');
  } else if (type === 'admin') {
    loginAs('admin');
    emit('navigate-admin');
  } else if (type === 'disanksi') {
    loginAs('suspended');
    emit('navigate-home');
  }
}
</script>
