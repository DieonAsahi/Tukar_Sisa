<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
  >
    <div
      class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[85vh] overflow-y-auto space-y-4"
    >
      <!-- Header Modal -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>🔔</span> Notifikasi Aktivitas (U20)
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Pemberitahuan peminat, konfirmasi transaksi & kedaluwarsa listing
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Action: Tandai Semua Dibaca -->
      <div class="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>{{ userNotifications.length }} Pemberitahuan</span>
        <button
          v-if="userNotifications.some((n) => !n.dibaca)"
          @click="markAllNotificationsAsRead"
          class="text-brand-700 hover:underline"
        >
          Tandai Semua Dibaca
        </button>
      </div>

      <!-- Daftar Notifikasi -->
      <div v-if="userNotifications.length > 0" class="space-y-2.5">
        <div
          v-for="notif in userNotifications"
          :key="notif.id"
          @click="markNotificationAsRead(notif.id)"
          :class="[
            'p-3.5 rounded-2xl border transition cursor-pointer space-y-1',
            notif.dibaca
              ? 'bg-slate-50 border-slate-200 text-slate-600 opacity-80'
              : 'bg-emerald-50/60 border-emerald-200 text-slate-800 shadow-sm'
          ]"
        >
          <div class="flex items-center justify-between text-[11px] font-bold">
            <span
              :class="[
                'px-2 py-0.5 rounded uppercase tracking-wider text-[10px]',
                notif.jenis === 'ada_peminat' ? 'bg-blue-100 text-blue-800' :
                notif.jenis === 'konfirmasi_transaksi' ? 'bg-emerald-100 text-emerald-800' :
                notif.jenis === 'sanksi_admin' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              ]"
            >
              {{ notif.jenis.replace(/_/g, ' ') }}
            </span>
            <span class="text-slate-400 text-[10px]">
              {{ new Date(notif.dibuat_pada).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>

          <p class="text-xs font-medium leading-relaxed">
            {{ notif.isi }}
          </p>
        </div>
      </div>

      <!-- State Kosong -->
      <div v-else class="text-center py-8 text-slate-400 space-y-1">
        <div class="text-3xl">🔕</div>
        <p class="text-xs font-bold text-slate-600">Belum Ada Notifikasi Baru</p>
        <p class="text-[11px]">Aktivitas seputar limbah dan transaksi Anda akan tampil di sini.</p>
      </div>

      <div class="pt-2 text-right">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

defineProps<{
  isOpen: boolean;
}>();

defineEmits(['close']);

const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useWasteApp();

const userNotifications = computed(() => {
  if (!currentUser.value) return [];
  return notifications.value.filter((n) => n.user_id === currentUser.value?.id);
});
</script>
