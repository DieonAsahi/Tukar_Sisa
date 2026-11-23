<template>
  <div class="space-y-4 max-w-4xl mx-auto">
    <!-- Header Dashboard Dampak -->
    <div class="bg-gradient-to-r from-brand-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300 mb-2">
        <span>🌱</span> Kontribusi Nyata Terhadap SDG 12
      </div>
      <h2 class="text-xl sm:text-2xl font-black text-white leading-tight">
        Dashboard Dampak Lingkungan & Pengalihan Sampah
      </h2>
      <p class="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed max-w-2xl">
        Mencegah sisa bernilai dari hulu agar tidak berakhir di TPA. Setiap kilogram sisa yang dialihkan langsung mengurangi timbulan sampah dan emisi metana.
      </p>

      <!-- Metrik Utama Publik -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-5">
        <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
          <span class="text-[11px] font-bold text-slate-300 block uppercase">Total Sisa Dialihkan</span>
          <span class="text-2xl sm:text-3xl font-black text-emerald-300 mt-1 block">
            {{ impactMetrics.total_kg_dialihkan.toLocaleString('id-ID') }} kg
          </span>
          <span class="text-[10px] text-slate-300">Dari transaksi selesai terverifikasi</span>
        </div>

        <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
          <span class="text-[11px] font-bold text-slate-300 block uppercase">Transaksi Selesai</span>
          <span class="text-2xl sm:text-3xl font-black text-white mt-1 block">
            {{ impactMetrics.total_transaksi_selesai }} Deal
          </span>
          <span class="text-[10px] text-slate-300">Sirkulasi antar-pengguna</span>
        </div>

        <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15 col-span-2 sm:col-span-1">
          <span class="text-[11px] font-bold text-slate-300 block uppercase">Postingan Sisa Aktif</span>
          <span class="text-2xl sm:text-3xl font-black text-white mt-1 block">
            {{ impactMetrics.total_postingan_aktif }} Postingan
          </span>
          <span class="text-[10px] text-slate-300">Tersedia siap diambil</span>
        </div>
      </div>
    </div>

    <!-- Dampak Pribadi Saya (Jika Login) -->
    <div v-if="isAuthenticated" class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
          <span>🏅</span> Kontribusi Sisa Saya Sendiri
        </h3>
        <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Akun Terdaftar
        </span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <span class="text-emerald-800 font-bold block text-[11px] uppercase">Limbah yang Saya Alihkan</span>
          <span class="text-2xl font-black text-emerald-950 mt-1 block">
            {{ myPersonalImpact.total_kg }} kg
          </span>
          <span class="text-[10px] text-emerald-700">Tercatat dari seluruh deal selesai Anda</span>
        </div>

        <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <span class="text-slate-500 font-bold block text-[11px] uppercase">Transaksi Berhasil</span>
          <span class="text-2xl font-black text-slate-900 mt-1 block">
            {{ myPersonalImpact.total_transaksi }} Kali
          </span>
          <span class="text-[10px] text-slate-400">Sebagai pemasok maupun pencari</span>
        </div>
      </div>
    </div>

    <!-- Edukasi Titik Intervensi Hulu (PRD Baru) -->
    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
      <h3 class="text-sm font-extrabold text-slate-900 flex items-center gap-2">
        <span>🔄</span> Titik Intervensi: Mencegah di Hulu, Bukan Mengolah di Hilir
      </h3>
      <p>
        Bank sampah dan pengepul umumnya hanya menangani sampah kering anorganik yang bisa didaur ulang pabrik (plastik botol, besi, kardus).
        Sedangkan <strong>sisa organik basah dapur, ampas tahu, serbuk kayu, dan ampas kopi</strong> sering langsung dibuang ke TPA karena pemiliknya tidak tahu siapa yang membutuhkannya di sekitar mereka.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-slate-800">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <strong class="text-slate-900 block font-bold mb-0.5">Sisa Dapur & Sayuran</strong>
          Dapat langsung dimanfaatkan pembudidaya maggot BSF untuk menghasilkan larva pakan protein tinggi.
        </div>
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <strong class="text-slate-900 block font-bold mb-0.5">Serbuk Gergaji Mebel</strong>
          Menjadi media tanam utama (baglog) jamur tiram dan bahan baku briket biomassa padat.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWasteApp } from '../composables/useWasteApp';

const { impactMetrics, myPersonalImpact, isAuthenticated } = useWasteApp();
</script>
