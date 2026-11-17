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
        <h2 class="text-xl sm:text-2xl font-black text-slate-900">Panel Pengawas Bursa UMKM</h2>
        <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Halaman ini dilindungi untuk Administrator & Tim Pengawas Platform guna moderasi limbah, penegakan standar non-B3, dan investigasi pengaduan.
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
            Panel Moderasi & Pengawas /admin
          </span>
          <!-- A1/A13: Simulasi Status MFA Admin -->
          <button
            @click="isMfaActive = !isMfaActive"
            class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border transition"
            :class="isMfaActive ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300' : 'bg-amber-950/60 border-amber-400 text-amber-300'"
            title="Klik untuk simulasi status MFA Admin (A13)"
          >
            🔒 MFA Admin: {{ isMfaActive ? 'Aktif' : 'Simulasi Off' }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <!-- A11: Tombol Ekspor CSV & Print PDF -->
          <button
            @click="exportImpactDataCsv"
            class="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-1"
            title="Ekspor Data Dampak & Transaksi ke CSV"
          >
            <span>📥</span>
            <span>Ekspor CSV</span>
          </button>
          <button
            @click="handlePrintPdf"
            class="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-1"
            title="Cetak Laporan Moderasi PDF"
          >
            <span>🖨️</span>
            <span>Cetak PDF</span>
          </button>
          <button
            @click="$emit('navigate-home')"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-white/10 px-3.5 py-1.5 rounded-xl transition hover:bg-white/20"
          >
            <span>← Kembali ke Bursa /</span>
          </button>
        </div>
      </div>
      <h1 class="text-xl sm:text-2xl font-black">Panel Kontrol Pengawas Bursa UMKM</h1>
      <p class="text-xs sm:text-sm text-slate-300 font-medium mt-1">
        Masuk sebagai: <strong class="text-white">{{ currentUser?.nama_usaha }}</strong> ({{ currentUser?.email }}) • Standar Mutu Non-B3 & Keamanan UMKM (SDG 8 & 12).
      </p>
    </div>

    <!-- 1. STATISTIK RINGKAS PLATFORM (A2) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Listing Aktif</div>
        <div class="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{{ impactMetrics.total_listing_aktif }}</div>
        <span class="text-[10px] text-emerald-600 font-bold">Terverifikasi Publik</span>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Antrean Tinjauan</div>
        <div class="text-2xl sm:text-3xl font-black text-amber-600 mt-0.5">{{ pendingReviewListings.length }}</div>
        <span class="text-[10px] text-amber-700 font-bold">Listing Akun Baru (A5)</span>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Laporan Terbuka</div>
        <div class="text-2xl sm:text-3xl font-black text-red-600 mt-0.5">{{ openReports.length }}</div>
        <span class="text-[10px] text-red-700 font-bold">Butuh Tindakan (A3)</span>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kg Dialihkan</div>
        <div class="text-2xl sm:text-3xl font-black text-brand-700 mt-0.5">{{ impactMetrics.total_kg_dialihkan.toLocaleString('id-ID') }}</div>
        <span class="text-[10px] text-slate-500 font-bold">SDG 8 & 12 (Rp {{ (impactMetrics.estimasi_penghematan_biaya_buang / 1000).toFixed(0) }}k Dihemat)</span>
      </div>
    </div>

    <!-- Layout Grid: Mobile Tabs vs Desktop Sidebar + Content Area -->
    <div class="md:grid md:grid-cols-12 md:gap-6 items-start">
      <!-- Navigasi Tab Mobile (md:hidden) -->
      <div class="md:hidden flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-2 mb-3">
        <button
          v-for="tab in adminTabs"
          :key="tab.id"
          @click="activeAdminTab = tab.id"
          :class="[
            'px-3.5 py-2 text-xs font-extrabold rounded-xl whitespace-nowrap transition flex items-center gap-1.5',
            activeAdminTab === tab.id
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
          ]"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.badge && tab.badge > 0"
            class="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-500 text-white"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- Desktop Sidebar (hidden md:block md:col-span-4 lg:col-span-3) -->
      <aside class="hidden md:block md:col-span-4 lg:col-span-3 sticky top-20 space-y-3">
        <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-1">
          <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
            Menu Pengawas
          </div>
          <button
            v-for="tab in adminTabs"
            :key="tab.id"
            @click="activeAdminTab = tab.id"
            :class="[
              'w-full px-3.5 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-between text-left',
              activeAdminTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            ]"
          >
            <span class="flex items-center gap-2">
              <span class="text-base">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </span>
            <span
              v-if="tab.badge && tab.badge > 0"
              class="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white"
            >
              {{ tab.badge }}
            </span>
          </button>
        </div>

        <!-- Info Hak Akses RLS -->
        <div class="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100 text-indigo-950 text-xs space-y-1">
          <p class="font-extrabold flex items-center gap-1.5">
            <span>🛡️</span> RLS & Role Guard Aktif
          </p>
          <p class="text-indigo-800 text-[11px] leading-relaxed">
            Hanya akun dengan <code>peran_sistem = 'admin'</code> yang dapat mengakses rute ini dan mengeksekusi aksi moderasi.
          </p>
        </div>
      </aside>

      <!-- Main Content Area (md:col-span-8 lg:col-span-9) -->
      <div class="md:col-span-8 lg:col-span-9 space-y-4">
        <!-- ========================================================================= -->
        <!-- TAB 1: TINJAU LISTING BARU & MODERASI KONTEN (A5, A6) -->
        <!-- ========================================================================= -->
        <div v-if="activeAdminTab === 'moderasi'" class="space-y-3">
          <div class="bg-white rounded-2xl p-4 border border-slate-200">
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-sm sm:text-base font-extrabold text-slate-900">Antrean Moderasi Listing Pertama Akun Baru (A5)</h3>
              <span class="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                {{ pendingReviewListings.length }} Menunggu
              </span>
            </div>
            <p class="text-xs text-slate-500">
              Listing pertama dari UMKM baru wajib diperiksa untuk mencegah barang B3 terlarang, foto tidak pantas, atau spam sebelum tampil di katalog publik.
            </p>
          </div>

          <div v-if="pendingReviewListings.length > 0" class="space-y-3">
            <div
              v-for="item in pendingReviewListings"
              :key="item.id"
              class="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm space-y-3"
            >
              <div class="flex flex-col sm:flex-row sm:items-start gap-4">
                <img :src="item.foto || item.foto_url" :alt="item.judul" class="w-full sm:w-28 sm:h-28 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                <div class="min-w-0 flex-1 space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      {{ item.category_name }}
                    </span>
                    <span class="text-xs text-slate-400">ID: {{ item.id.substring(0, 8) }}</span>
                  </div>
                  <h4 class="text-base font-black text-slate-900 leading-snug">{{ item.judul }}</h4>
                  <p class="text-xs text-slate-600 font-medium">🏪 {{ item.nama_usaha }} • 📍 {{ item.alamat_tampilan }}</p>
                  <div class="text-xs font-extrabold text-brand-700">
                    Volume: {{ item.volume_per_minggu }} {{ item.satuan }}/minggu • Pengambilan: {{ item.metode_pengambilan }}
                  </div>
                </div>
              </div>

              <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                "{{ item.deskripsi }}"
              </p>

              <!-- Aksi Moderasi -->
              <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  @click="moderateListing(item.id, 'setujui', 'Disetujui admin setelah pemeriksaan foto & jenis limbah')"
                  class="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition text-center shadow-sm"
                >
                  ✓ Setujui Tampil Publik
                </button>
                <button
                  @click="moderateListing(item.id, 'sembunyikan', 'Disembunyikan karena butuh konfirmasi lanjutan')"
                  class="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition text-center shadow-sm"
                >
                  👁 Sembunyikan
                </button>
                <button
                  @click="moderateListing(item.id, 'hapus', 'Dihapus karena melanggar aturan limbah B3/spam')"
                  class="py-2.5 px-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition text-center shadow-sm"
                >
                  🗑 Hapus
                </button>
              </div>
            </div>
          </div>

          <div v-else class="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
            <span class="text-3xl">✨</span>
            <div class="text-sm font-extrabold text-slate-800 mt-2">Antrean Moderasi Bersih</div>
            <p class="text-xs text-slate-400 mt-1">Semua postingan baru telah dimoderasi dan siap diakses publik.</p>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- TAB 2: ANTREAN LAPORAN BERPRIORITAS (A3, A4) -->
        <!-- ========================================================================= -->
        <div v-else-if="activeAdminTab === 'laporan'" class="space-y-3">
          <div class="bg-white rounded-2xl p-4 border border-slate-200">
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-sm sm:text-base font-extrabold text-slate-900">Antrean Laporan Komunitas Masuk (A3)</h3>
              <span class="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg">
                {{ openReports.length }} Terbuka
              </span>
            </div>
            <p class="text-xs text-slate-500">
              Tangani keluhan dari pelaku UMKM (alamat tidak sesuai, barang tidak sesuai deskripsi, limbah B3 terlarang, atau penipuan).
            </p>
          </div>

          <!-- Tampilan Desktop: Tabel Scan-Friendly (hidden md:block) -->
          <div class="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3">Prioritas & Alasan</th>
                  <th class="px-4 py-3">Pelapor / Terlapor</th>
                  <th class="px-4 py-3">Rincian Pengaduan</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 text-right">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="rep in reports" :key="rep.id" class="hover:bg-slate-50/80 transition">
                  <td class="px-4 py-3.5">
                    <span
                      :class="[
                        'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded',
                        rep.prioritas === 'tinggi' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      ]"
                    >
                      {{ rep.prioritas }}
                    </span>
                    <div class="font-extrabold text-slate-800 mt-1 capitalize">{{ rep.alasan }}</div>
                  </td>
                  <td class="px-4 py-3.5">
                    <div class="font-bold text-slate-800">{{ rep.pelapor_nama }}</div>
                    <div class="text-red-700 text-[11px] mt-0.5">➔ {{ rep.terlapor_nama }}</div>
                  </td>
                  <td class="px-4 py-3.5 max-w-xs">
                    <div class="text-slate-600 line-clamp-2">"{{ rep.catatan }}"</div>
                    <div v-if="rep.listing_judul" class="text-slate-400 text-[10px] mt-0.5 truncate">
                      Ref: {{ rep.listing_judul }}
                    </div>
                  </td>
                  <td class="px-4 py-3.5">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-black uppercase"
                      :class="rep.status === 'selesai' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-700'"
                    >
                      {{ rep.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-right">
                    <div v-if="rep.status === 'terbuka' || rep.status === 'dalam_tinjauan'" class="flex items-center justify-end gap-1.5">
                      <button
                        @click="handleReportAction(rep.id, 'valid', rep.alasan === 'alamat tidak sesuai', 'Laporan diverifikasi valid oleh admin')"
                        class="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] transition"
                        title="Valid & Berikan Sanksi"
                      >
                        ✓ Valid
                      </button>
                      <button
                        @click="handleReportAction(rep.id, 'tolak', false, 'Pemeriksaan lapangan menunjukkan alamat sah')"
                        class="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-[11px] transition"
                        title="Tolak Laporan"
                      >
                        ✕ Tolak
                      </button>
                    </div>
                    <div v-else class="text-[11px] text-emerald-700 font-bold">
                      ✓ Selesai
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tampilan Mobile: Kartu Vertikal (md:hidden) -->
          <div class="md:hidden space-y-3">
            <div
              v-for="rep in reports"
              :key="rep.id"
              class="bg-white rounded-2xl border p-4 shadow-sm space-y-3"
              :class="rep.status === 'selesai' ? 'border-slate-200 opacity-70' : 'border-red-200'"
            >
              <div class="flex items-center justify-between">
                <span
                  :class="[
                    'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded',
                    rep.prioritas === 'tinggi' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  ]"
                >
                  Prioritas {{ rep.prioritas }} • {{ rep.alasan }}
                </span>
                <span class="text-[11px] font-bold text-slate-400">
                  Status: <strong class="text-slate-800 uppercase">{{ rep.status }}</strong>
                </span>
              </div>

              <div class="text-xs text-slate-800">
                <div>Pelapor: <strong class="text-slate-900">{{ rep.pelapor_nama }}</strong></div>
                <div>Terlapor: <strong class="text-red-700">{{ rep.terlapor_nama }}</strong></div>
              </div>

              <p class="text-xs text-slate-700 bg-red-50/50 p-3 rounded-xl border border-red-100 leading-relaxed font-medium">
                "{{ rep.catatan }}"
              </p>

              <div v-if="rep.status === 'terbuka' || rep.status === 'dalam_tinjauan'" class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  @click="handleReportAction(rep.id, 'valid', rep.alasan === 'alamat tidak sesuai', 'Laporan diverifikasi valid')"
                  class="py-2.5 px-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition text-center"
                >
                  ✓ Valid & Sanksi
                </button>
                <button
                  @click="handleReportAction(rep.id, 'tolak', false, 'Pemeriksaan menunjukkan alamat sah')"
                  class="py-2.5 px-3 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 text-xs font-extrabold rounded-xl transition text-center"
                >
                  ✕ Tolak Laporan
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- TAB 3: MANAJEMEN PENGGUNA & BUKTI VERIFIKASI (A7, A8) -->
        <!-- ========================================================================= -->
        <div v-else-if="activeAdminTab === 'pengguna'" class="space-y-4">
          <div class="bg-white rounded-2xl p-4 border border-slate-200">
            <h3 class="text-sm sm:text-base font-extrabold text-slate-900">Manajemen Pengguna & Bukti Verifikasi Lokasi (A7, A8)</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Pantau status UMKM, berikan sanksi bertahap atau pulihkan akun, dan periksa bukti verifikasi lokasi fisik (toleransi ≤ 200m).
            </p>
          </div>

          <!-- Bukti Verifikasi Lokasi Fisik Masuk (A8) -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">
                Bukti Pengajuan Verifikasi Lokasi Fisik (A8)
              </h4>
              <span class="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                {{ verifications.length }} Pengajuan
              </span>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="v in verifications"
                :key="v.id"
                class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3">
                  <img :src="v.foto_bukti || '/placeholder-location.jpg'" alt="Foto Tempat Usaha" class="w-16 h-16 rounded-lg object-cover bg-slate-200 flex-shrink-0" />
                  <div class="text-xs">
                    <div class="font-bold text-slate-900">ID Usaha: {{ v.user_id.substring(0, 10) }}...</div>
                    <div class="text-slate-500 mt-0.5">
                      Jarak GPS ke Pin: <strong :class="(v.jarak_pin_gps_m ?? 0) <= 200 ? 'text-emerald-700' : 'text-red-700'">{{ v.jarak_pin_gps_m ?? 0 }} meter</strong> (Toleransi ≤ 200m)
                    </div>
                    <div class="text-[11px] text-slate-400">
                      Diajukan: {{ new Date(v.dibuat_pada).toLocaleDateString('id-ID') }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'text-[10px] font-black uppercase px-2 py-1 rounded',
                      v.status === 'disetujui' ? 'bg-emerald-100 text-emerald-800' : v.status === 'ditolak' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    ]"
                  >
                    {{ v.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Pemberian Sanksi Bertahap (A7) -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-sm">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">
              Form Penerapan Sanksi Bertahap (A7)
            </h4>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Pilih Target Pelaku UMKM
              </label>
              <select
                v-model="sanctionTargetId"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-500"
              >
                <option value="u1000000-0000-0000-0000-000000000003">Konveksi Citra Mandiri (Waru, Sidoarjo)</option>
                <option value="u1000000-0000-0000-0000-000000000006">Gudang Fiktif Surabaya (Pengepul Tidak Resmi)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tingkatan Sanksi / Pemulihan
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <button
                  type="button"
                  v-for="s in [
                    { id: 'aktif', label: '0. Pulihkan (Aktif)', color: 'emerald' },
                    { id: 'peringatan', label: '1. Peringatan', color: 'amber' },
                    { id: 'sembunyikan_listing', label: '2. Sembunyikan', color: 'amber' },
                    { id: 'tangguhkan', label: '3. Tangguhkan', color: 'red' },
                    { id: 'blokir', label: '4. Blokir Tetap', color: 'red' }
                  ]"
                  :key="s.id"
                  @click="selectedSanctionLevel = s.id"
                  :class="[
                    'p-2.5 text-xs font-bold rounded-xl border transition text-center',
                    selectedSanctionLevel === s.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  ]"
                >
                  {{ s.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Alasan Tertulis (Wajib Diisi & Ditampilkan ke Pengguna saat Login)
              </label>
              <textarea
                v-model="sanctionReason"
                rows="2"
                placeholder="Tuliskan alasan spesifik..."
                class="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <button
              @click="submitSanction"
              class="w-full py-3 px-4 bg-red-700 hover:bg-red-800 active:scale-95 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition"
            >
              Simpan Tindakan & Catat ke Audit Log
            </button>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- TAB 4: KELOLA KATEGORI & FAKTOR KG (A9) -->
        <!-- ========================================================================= -->
        <div v-else-if="activeAdminTab === 'kategori'" class="space-y-3">
          <div class="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="text-sm sm:text-base font-extrabold text-slate-900">Kelola Kategori & Faktor Konversi Kg (A9)</h3>
              <p class="text-xs text-slate-500 mt-0.5">Atur izin Non-B3 vs B3 dan bobot <code>faktor_ke_kg</code> untuk kalkulasi dampak.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="divide-y divide-slate-100">
              <div
                v-for="cat in categories"
                :key="cat.id"
                class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
              >
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-extrabold text-sm text-slate-900">{{ cat.nama }}</span>
                    <span
                      :class="[
                        'text-[10px] font-black px-2.5 py-0.5 rounded-full',
                        cat.boleh_diposting
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ cat.boleh_diposting ? 'Non-B3 (Boleh Diposting)' : 'DILARANG (B3 / Bahaya)' }}
                    </span>
                    <span class="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      Faktor: {{ cat.faktor_ke_kg }} kg/{{ cat.satuan_default }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500">{{ cat.kelompok }} • Satuan: {{ cat.satuan_default }}</p>
                  <div class="text-[11px] text-slate-600 font-medium">
                    Saran Pemanfaatan: <strong>{{ cat.saran_pemanfaatan?.length || 0 }} Rekomendasi</strong>
                  </div>
                </div>

                <button
                  @click="toggleCategoryStatus(cat.id)"
                  :class="[
                    'px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0',
                    cat.boleh_diposting
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  ]"
                >
                  {{ cat.boleh_diposting ? 'Tandai B3 Dilarang' : 'Izinkan Non-B3' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- TAB 5: PENGATURAN SISTEM (A12) -->
        <!-- ========================================================================= -->
        <div v-else-if="activeAdminTab === 'pengaturan'" class="space-y-3">
          <div class="bg-white rounded-2xl p-4 border border-slate-200">
            <h3 class="text-sm sm:text-base font-extrabold text-slate-900">Pengaturan Parameter Sistem Global (A12)</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Atur ambang batas toleransi verifikasi GPS, kuota akun baru, kedaluwarsa listing, dan batas radius.
            </p>
          </div>

          <form @submit.prevent="saveSettings" class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Toleransi Lokasi Fisik GPS (meter)
                </label>
                <input
                  v-model.number="settingsForm.toleransi_gps_meter"
                  type="number"
                  min="50"
                  max="1000"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white"
                />
                <span class="text-[10px] text-slate-400">Standar PRD: 200 meter</span>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Batas Kuota Akun Baru (Listing Aktif)
                </label>
                <input
                  v-model.number="settingsForm.batas_listing_akun_baru"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white"
                />
                <span class="text-[10px] text-slate-400">Standar PRD: 3 listing (sebelum transaksi pertama)</span>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Masa Berlaku Listing (Hari)
                </label>
                <input
                  v-model.number="settingsForm.masa_kedaluwarsa_hari"
                  type="number"
                  min="7"
                  max="60"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white"
                />
                <span class="text-[10px] text-slate-400">Standar PRD: 14 hari</span>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Radius Pencarian Maksimal (km)
                </label>
                <input
                  v-model.number="settingsForm.radius_maksimal_km"
                  type="number"
                  min="10"
                  max="200"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white"
                />
                <span class="text-[10px] text-slate-400">Standar PRD: 100 km</span>
              </div>
            </div>

            <button
              type="submit"
              class="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-extrabold rounded-xl shadow transition"
            >
              Simpan Pengaturan Sistem
            </button>
          </form>
        </div>

        <!-- ========================================================================= -->
        <!-- TAB 6: CATATAN AUDIT TINDAKAN ADMIN (IMMUTABLE AUDIT LOG - A10) -->
        <!-- ========================================================================= -->
        <div v-else-if="activeAdminTab === 'audit'" class="space-y-3">
          <div class="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="text-sm sm:text-base font-extrabold text-slate-900">Catatan Audit Tindakan Admin (A10)</h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Semua aksi tercatat permanen secara kronologis (Immutable, Append-Only).
              </p>
            </div>
            <!-- Filter Audit Log -->
            <select
              v-model="auditFilter"
              class="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700"
            >
              <option value="semua">Semua Aksi ({{ adminActions.length }})</option>
              <option value="moderasi">Moderasi Listing</option>
              <option value="laporan">Penyelesaian Laporan</option>
              <option value="sanksi">Sanksi Akun</option>
            </select>
          </div>

          <!-- Tabel Audit Desktop & Mobile -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="divide-y divide-slate-100">
              <div
                v-for="act in filteredAuditActions"
                :key="act.id"
                class="p-4 space-y-1.5 hover:bg-slate-50 transition"
              >
                <div class="flex flex-wrap items-center justify-between text-xs gap-2">
                  <span class="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg font-mono text-[11px]">
                    {{ act.aksi }}
                  </span>
                  <span class="text-[11px] text-slate-400">
                    {{ new Date(act.waktu).toLocaleString('id-ID') }}
                  </span>
                </div>
                <div class="text-xs text-slate-700">
                  Admin: <strong>{{ act.admin_nama }}</strong> • Target: <strong class="text-indigo-700">{{ act.jenis_target }} ({{ act.target_id.substring(0, 12) }}...)</strong>
                </div>
                <div class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl font-medium border border-slate-100">
                  Alasan: "{{ act.alasan }}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWasteApp } from '../../composables/useWasteApp';

defineEmits(['navigate-home']);

const {
  currentUser,
  isAdmin,
  loginAs,
  isAuthModalOpen,
  impactMetrics,
  pendingReviewListings,
  reports,
  openReports,
  adminActions,
  verifications,
  categories,
  systemSettings,
  moderateListing,
  handleReportAction,
  applyUserSanction,
  toggleCategoryStatus,
  updateSystemSettings,
  exportImpactDataCsv
} = useWasteApp();

const isMfaActive = ref(true);
const activeAdminTab = ref<'moderasi' | 'laporan' | 'pengguna' | 'kategori' | 'pengaturan' | 'audit'>('moderasi');

const adminTabs = computed(() => [
  { id: 'moderasi' as const, label: 'Tinjau Listing Baru', icon: '📋', badge: pendingReviewListings.value.length },
  { id: 'laporan' as const, label: 'Antrean Laporan', icon: '🚨', badge: openReports.value.length },
  { id: 'pengguna' as const, label: 'Pengguna & Bukti Lokasi', icon: '👥', badge: verifications.value.filter(v => v.status === 'diajukan').length },
  { id: 'kategori' as const, label: 'Kelola Kategori', icon: '🗂️', badge: 0 },
  { id: 'pengaturan' as const, label: 'Pengaturan Sistem', icon: '⚙️', badge: 0 },
  { id: 'audit' as const, label: 'Audit Log (Immutable)', icon: '🔒', badge: adminActions.value.length }
]);

const sanctionTargetId = ref('u1000000-0000-0000-0000-000000000003');
const selectedSanctionLevel = ref('peringatan');
const sanctionReason = ref('Terbukti memberikan alamat tidak akurat saat diverifikasi oleh mitra pencari limbah.');

function submitSanction() {
  const ok = applyUserSanction(
    sanctionTargetId.value,
    selectedSanctionLevel.value as any,
    sanctionReason.value
  );
  if (ok) {
    alert('Tindakan berhasil diterapkan dan dicatat secara permanen di Audit Log Admin.');
  }
}

// Form Pengaturan Sistem
const settingsForm = ref({
  toleransi_gps_meter: systemSettings.value.toleransi_gps_meter,
  batas_listing_akun_baru: systemSettings.value.batas_listing_akun_baru,
  masa_kedaluwarsa_hari: systemSettings.value.masa_kedaluwarsa_hari,
  radius_maksimal_km: systemSettings.value.radius_maksimal_km
});

function saveSettings() {
  updateSystemSettings(settingsForm.value);
  alert('Pengaturan sistem global berhasil diperbarui!');
}

// Filter Audit
const auditFilter = ref('semua');
const filteredAuditActions = computed(() => {
  if (auditFilter.value === 'semua') return adminActions.value;
  if (auditFilter.value === 'moderasi') return adminActions.value.filter(a => a.aksi.includes('listing'));
  if (auditFilter.value === 'laporan') return adminActions.value.filter(a => a.aksi.includes('laporan'));
  if (auditFilter.value === 'sanksi') return adminActions.value.filter(a => a.aksi.includes('sanksi') || a.aksi.includes('lencana'));
  return adminActions.value;
});

function handlePrintPdf() {
  window.print();
}
</script>
