<template>
  <div class="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
    <!-- 1. Tanda Kepercayaan: Nama Toko / Profesi (Opsional) -->
    <span
      v-if="namaTokoProfesi"
      class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-700 border border-slate-200"
      :title="`Toko / Usaha: ${namaTokoProfesi}`"
    >
      <span class="text-[11px]">🏪</span>
      <span class="font-bold">{{ namaTokoProfesi }}</span>
    </span>

    <!-- 2. Tanda Kepercayaan: Jumlah Transaksi Selesai -->
    <span
      v-if="jumlahTransaksiSelesai !== undefined && jumlahTransaksiSelesai > 0"
      class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 border border-emerald-200 font-bold"
      title="Jumlah transaksi limbah yang berhasil diselesaikan"
    >
      <span class="text-[11px]">🤝</span>
      <span>{{ jumlahTransaksiSelesai }} transaksi selesai</span>
    </span>
    <span
      v-else
      class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-slate-500 border border-slate-200 font-medium"
      title="Pengguna baru di platform"
    >
      <span class="text-[11px]">🌱</span>
      <span>Pengguna baru</span>
    </span>

    <!-- 3. Tanda Kepercayaan: Tanggal Bergabung -->
    <span
      v-if="tanggalBergabung"
      class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-slate-500 border border-slate-200 font-normal"
      :title="`Tanggal bergabung: ${formatDate(tanggalBergabung)}`"
    >
      <span class="text-[10px]">🗓️</span>
      <span class="text-[11px]">Gabung {{ formatMonthYear(tanggalBergabung) }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  namaTokoProfesi?: string;
  jumlahTransaksiSelesai?: number;
  tanggalBergabung?: string;
}>();

function formatMonthYear(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}
</script>
