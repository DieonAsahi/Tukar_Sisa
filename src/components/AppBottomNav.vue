<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg px-2 py-1.5 max-w-md mx-auto">
    <div class="grid grid-cols-5 items-center text-center">
      <!-- 1. Katalog & Peta -->
      <button
        @click="$emit('update:tab', 'katalog')"
        :class="[
          'flex flex-col items-center py-1 rounded-xl transition',
          currentTab === 'katalog' ? 'text-brand-700 font-bold' : 'text-slate-500 font-medium hover:text-slate-700'
        ]"
      >
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span class="text-[10px] leading-tight">Peta & Sisa</span>
      </button>

      <!-- 2. Permintaan Bahan Baku -->
      <button
        @click="$emit('update:tab', 'permintaan')"
        :class="[
          'flex flex-col items-center py-1 rounded-xl transition',
          currentTab === 'permintaan' ? 'text-brand-700 font-bold' : 'text-slate-500 font-medium hover:text-slate-700'
        ]"
      >
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text-[10px] leading-tight">Cari Bahan</span>
      </button>

      <!-- 3. Tombol Tengah: POSTING LIMBAH (Action Button) -->
      <div class="flex justify-center -mt-5">
        <button
          @click="$emit('open-quick-post')"
          class="w-13 h-13 w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-lg shadow-brand-600/40 flex items-center justify-center border-4 border-white transition"
          title="Pasang Listing Limbah Baru (1 Layar)"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- 4. Kamus Limbah Peluang -->
      <button
        @click="$emit('update:tab', 'kamus')"
        :class="[
          'flex flex-col items-center py-1 rounded-xl transition',
          currentTab === 'kamus' ? 'text-brand-700 font-bold' : 'text-slate-500 font-medium hover:text-slate-700'
        ]"
      >
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span class="text-[10px] leading-tight">Kamus</span>
      </button>

      <!-- 5. Dashboard Dampak Publik (SDG) -->
      <button
        @click="$emit('update:tab', 'dampak')"
        :class="[
          'flex flex-col items-center py-1 rounded-xl transition',
          currentTab === 'dampak' ? 'text-brand-700 font-bold' : 'text-slate-500 font-medium hover:text-slate-700'
        ]"
      >
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span class="text-[10px] leading-tight">Dampak</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  currentTab: 'katalog' | 'permintaan' | 'kamus' | 'dampak';
}>();

defineEmits(['update:tab', 'open-quick-post']);
</script>

