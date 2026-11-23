<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg px-2 py-1 max-w-md mx-auto">
    <div class="grid grid-cols-4 items-center text-center">
      <!-- 1. Cari (Jelajah Sisa) -->
      <button
        @click="$emit('update:tab', 'cari')"
        :class="[
          'flex flex-col items-center py-1 rounded-xl transition',
          currentTab === 'cari' ? 'text-brand-700 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'
        ]"
      >
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="text-[10px] leading-tight">Cari</span>
      </button>

      <!-- 2. Unggah (Posting Sisa) -->
      <button
        @click="$emit('open-upload')"
        :class="[
          'flex flex-col items-center py-1 rounded-xl transition',
          currentTab === 'unggah' ? 'text-brand-700 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'
        ]"
      >
        <div class="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center -mt-1 shadow-md shadow-brand-600/30">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span class="text-[10px] leading-tight font-bold text-slate-800 mt-0.5">Unggah</span>
      </button>

      <!-- 3. Aktivitas (Transaksi Berjalan, Notifikasi, Riwayat) -->
      <button
        @click="$emit('update:tab', 'aktivitas')"
        :class="[
          'flex flex-col items-center py-1 rounded-xl transition relative',
          currentTab === 'aktivitas' ? 'text-brand-700 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'
        ]"
      >
        <div class="relative">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse"
          >
            {{ unreadCount }}
          </span>
        </div>
        <span class="text-[10px] leading-tight">Aktivitas</span>
      </button>

      <!-- 4. Akun (Profil, 3 Slot Lokasi, Postingan Saya) -->
      <button
        @click="$emit('update:tab', 'akun')"
        :class="[
          'flex flex-col items-center py-1 rounded-xl transition',
          currentTab === 'akun' ? 'text-brand-700 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'
        ]"
      >
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-[10px] leading-tight">Akun</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

defineProps<{
  currentTab: 'cari' | 'unggah' | 'aktivitas' | 'akun' | 'edukasi' | 'dampak';
}>();

defineEmits(['update:tab', 'open-upload']);

const { unreadNotificationsCount } = useWasteApp();
const unreadCount = computed(() => unreadNotificationsCount.value);
</script>
