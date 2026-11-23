<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div
      class="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
    >
      <!-- Header Modal -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
            <span>⚙️</span>
            <span>Pengaturan Akun & 3 Slot Lokasi</span>
          </h2>
          <p class="text-[11px] text-slate-500 font-medium">
            Kelola profil, slot lokasi acak, dan privasi akun Anda
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>
      </div>

      <!-- Tab Switcher Internal -->
      <div class="flex border-b border-slate-100 px-5 pt-2 gap-2 text-xs font-bold">
        <button
          @click="activeSubTab = 'profil'"
          :class="[
            'pb-2.5 px-3 border-b-2 transition flex items-center gap-1',
            activeSubTab === 'profil'
              ? 'border-brand-600 text-brand-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          ]"
        >
          <span>👤</span>
          <span>Profil Usaha</span>
        </button>
        <button
          @click="activeSubTab = 'lokasi'"
          :class="[
            'pb-2.5 px-3 border-b-2 transition flex items-center gap-1',
            activeSubTab === 'lokasi'
              ? 'border-brand-600 text-brand-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          ]"
        >
          <span>📍</span>
          <span>3 Slot Lokasi (Maks 1 km)</span>
        </button>
        <button
          @click="activeSubTab = 'privasi'"
          :class="[
            'pb-2.5 px-3 border-b-2 transition flex items-center gap-1',
            activeSubTab === 'privasi'
              ? 'border-red-600 text-red-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          ]"
        >
          <span>🛡️</span>
          <span>Privasi & Hapus Akun</span>
        </button>
      </div>

      <!-- Body Modal -->
      <div class="p-5">
        <!-- 1. TAB PROFIL -->
        <form v-if="activeSubTab === 'profil'" @submit.prevent="handleSaveProfile" class="space-y-3.5">
          <div>
            <label class="text-xs font-bold text-slate-700">Nama Tampilan <strong class="text-red-500">*</strong></label>
            <input
              type="text"
              v-model="profileForm.nama_tampilan"
              required
              class="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
            />
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700">
              Nama Toko / Profesi <span class="text-slate-400 font-normal">(Opsional - Tanda Kepercayaan)</span>
            </label>
            <input
              type="text"
              v-model="profileForm.nama_toko_profesi"
              placeholder="Contoh: Bengkel Kayu Berkah, Warkop Senja, Peternak Maggot..."
              class="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none"
            />
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700">Nomor WhatsApp <strong class="text-red-500">*</strong></label>
            <input
              type="text"
              v-model="profileForm.no_wa"
              required
              placeholder="628xxxxxxxxxx"
              class="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
            />
            <p class="text-[11px] text-slate-400 mt-1">
              Dipakai saat rekan menekan tombol hubungi via WhatsApp untuk menyepakati transaksi.
            </p>
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700">Foto Profil URL</label>
            <input
              type="url"
              v-model="profileForm.foto"
              placeholder="https://..."
              class="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none"
            />
          </div>

          <div class="pt-2">
            <button
              type="submit"
              class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow transition"
            >
              Simpan Perubahan Profil
            </button>
          </div>
        </form>

        <!-- 2. TAB KELOLA 3 SLOT LOKASI (U3, S1, S2) -->
        <div v-else-if="activeSubTab === 'lokasi'" class="space-y-4">
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-1">
            <div class="font-extrabold flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Perlindungan Privasi Lokasi (PRD Baru)</span>
            </div>
            <p class="text-[11px] leading-relaxed text-blue-900 font-medium">
              Aplikasi membaca GPS perangkat hanya sekali, lalu server menggeser titik secara <strong>tetap maksimal 1 km</strong> (berdasar hash rahasia). Yang disimpan hanyalah titik acak tersebut, koordinat presisi dan alamat Anda dibuang selamanya!
            </p>
          </div>

          <!-- Daftar 3 Slot Lokasi -->
          <div class="space-y-3">
            <div
              v-for="slotNum in ([1, 2, 3] as const)"
              :key="slotNum"
              class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                  <span class="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] flex items-center justify-center">
                    {{ slotNum }}
                  </span>
                  <span>Slot Lokasi {{ slotNum }}</span>
                </span>
                <span v-if="getSlot(slotNum)" class="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Tersimpan (Titik Acak Aktif)
                </span>
                <span v-else class="text-[10px] text-slate-400 font-medium">
                  Belum disetel
                </span>
              </div>

              <!-- Input Label Slot -->
              <div>
                <label class="text-[11px] font-bold text-slate-600">Nama Tempat (Label):</label>
                <input
                  type="text"
                  v-model="slotLabels[slotNum]"
                  :placeholder="`Misal: Rumah, Dapur, Bengkel ${slotNum}`"
                  class="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <!-- Tombol Setel dari GPS -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="handleSetLocationFromGps(slotNum)"
                  :disabled="locatingSlot === slotNum"
                  class="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <span>📍</span>
                  <span>{{ locatingSlot === slotNum ? 'Membaca GPS & Mengacak...' : 'Setel dari GPS Sekarang' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. TAB PRIVASI & HAPUS AKUN (UU PDP) -->
        <div v-else class="space-y-4">
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-2">
            <h4 class="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
              <span>📜</span> Ketentuan Privasi & Kepatuhan UU PDP
            </h4>
            <p class="text-[11px] leading-relaxed text-slate-600">
              Platform Bursa Limbah membatasi data pribadi seminimal mungkin:
            </p>
            <ul class="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1 font-medium">
              <li>Koordinat presisi dan alamat jalan <strong>tidak pernah disimpan</strong> di server mana pun.</li>
              <li>Pencari hanya melihat perkiraan jarak antar titik acak (maksimal 1 km pergeseran tetap).</li>
              <li>Komunikasi dilakukan langsung antar-pengguna via WhatsApp tanpa perantara.</li>
              <li>Anda berhak menghapus akun dan seluruh jejak data Anda kapan pun.</li>
            </ul>
          </div>

          <div class="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2">
            <div class="text-xs font-black text-red-950 flex items-center gap-1">
              <span>⚠️</span>
              <span>Zona Bahaya: Hapus Akun Permanen</span>
            </div>
            <p class="text-[11px] text-red-900 leading-relaxed font-medium">
              Tindakan ini akan menghapus akun, seluruh postingan aktif, slot lokasi, dan riwayat transaksi Anda secara permanen sesuai ketentuan UU Perlindungan Data Pribadi (UU PDP).
            </p>
            <button
              @click="handleDeleteAccount"
              class="py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs rounded-xl shadow transition"
            >
              Hapus Akun & Data Pribadi Saya
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

const emit = defineEmits(['close']);

const { currentUser, myLocationSlots, updateProfile, saveLocationSlot, deleteAccount } = useWasteApp();

const activeSubTab = ref<'profil' | 'lokasi' | 'privasi'>('profil');
const locatingSlot = ref<number | null>(null);

const profileForm = reactive({
  nama_tampilan: currentUser.value?.nama_tampilan || '',
  nama_toko_profesi: currentUser.value?.nama_toko_profesi || '',
  no_wa: currentUser.value?.no_wa || '',
  foto: currentUser.value?.foto || ''
});

const slotLabels = reactive<Record<number, string>>({
  1: myLocationSlots.value.find((s) => s.slot_nomor === 1)?.label || 'Lokasi Utama',
  2: myLocationSlots.value.find((s) => s.slot_nomor === 2)?.label || 'Lokasi 2',
  3: myLocationSlots.value.find((s) => s.slot_nomor === 3)?.label || 'Lokasi 3'
});

function getSlot(slotNum: 1 | 2 | 3) {
  return myLocationSlots.value.find((s) => s.slot_nomor === slotNum);
}

function handleSaveProfile() {
  updateProfile({
    nama_tampilan: profileForm.nama_tampilan,
    nama_toko_profesi: profileForm.nama_toko_profesi,
    no_wa: profileForm.no_wa,
    foto: profileForm.foto
  });
  alert('Profil berhasil diperbarui!');
  emit('close');
}

function handleSetLocationFromGps(slotNum: 1 | 2 | 3) {
  if (!navigator.geolocation) {
    alert('Perangkat Anda tidak mendukung GPS.');
    return;
  }

  locatingSlot.value = slotNum;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locatingSlot.value = null;
      try {
        saveLocationSlot(
          slotNum,
          slotLabels[slotNum],
          pos.coords.latitude,
          pos.coords.longitude
        );
        alert(`Slot Lokasi ${slotNum} berhasil disetel! Titik acak tetap telah disimpan dan koordinat asli dibuang.`);
      } catch (err: any) {
        alert(err.message || 'Gagal menyimpan lokasi.');
      }
    },
    (err) => {
      locatingSlot.value = null;
      // Fallback simulasi jika GPS browser ditolak
      const dummyLat = -7.2655 + (slotNum * 0.01);
      const dummyLng = 112.7480 + (slotNum * 0.01);
      saveLocationSlot(slotNum, slotLabels[slotNum], dummyLat, dummyLng);
      alert(`GPS tidak dapat diakses (${err.message}). Slot Lokasi ${slotNum} disetel menggunakan titik acak Surabaya.`);
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function handleDeleteAccount() {
  if (confirm('YAKIN INGIN MENGHAPUS AKUN? Tindakan ini tidak dapat dibatalkan.')) {
    deleteAccount();
    emit('close');
  }
}
</script>
