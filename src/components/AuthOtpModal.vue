<template>
  <div v-if="isAuthModalOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>🔐</span> Masuk Akun UMKM (OTP Email)
          </h2>
          <p class="text-[11px] text-slate-500 font-medium">Tanpa kata sandi, kode verifikasi dikirim langsung ke email</p>
        </div>
        <button
          @click="isAuthModalOpen = false"
          class="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-5 space-y-4">
        <!-- Banner Pesan Perlindungan Privasi & Contextual Action Notice -->
        <div class="p-3 bg-brand-50 border border-brand-200 rounded-2xl flex items-start gap-2.5 text-xs text-brand-950 font-medium leading-relaxed">
          <svg class="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <strong>{{ authModalMessage || 'Silakan masuk dengan OTP Email untuk melanjutkan.' }}</strong>
            <p class="text-[11px] text-brand-800 mt-0.5">
              Sesuai standar UU PDP & PRD F1/F2, nomor WhatsApp dan titik lokasi presisi terlindungi dan baru terbuka setelah verifikasi OTP email.
            </p>
          </div>
        </div>

        <!-- Peringatan Kunci Percobaan (S3 Rate Limit) -->
        <div v-if="isLockedOut" class="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 font-medium">
          <strong>⛔ Akses Dikunci Sementara (Batas Percobaan):</strong>
          <p class="text-[11px] text-red-800 mt-0.5">
            Anda telah 5 kali salah memasukkan kode OTP. Silakan tunggu {{ lockoutCountdown }} detik sebelum mencoba kembali.
          </p>
        </div>

        <!-- LANGKAH 1: Masukkan Email -->
        <div v-else-if="step === 'email'" class="space-y-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Alamat Email Usaha Anda
            </label>
            <input
              v-model="emailInput"
              type="email"
              required
              placeholder="nama@usahaanda.com"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <button
            @click="handleSendOtp"
            :disabled="!emailInput || isSending || cooldownCountdown > 0"
            class="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg v-if="!isSending" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span v-if="cooldownCountdown > 0">Tunggu {{ cooldownCountdown }}s untuk Kirim Ulang</span>
            <span v-else>{{ isSending ? 'Mengirim Kode OTP...' : 'Kirim Kode Masuk 6-Digit' }}</span>
          </button>

          <!-- Jalan Pintas Demo Cepat (Role Switcher Akun Uji) -->
          <div class="pt-3 border-t border-slate-100 space-y-2">
            <div class="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
              Uji Coba Cepat (Akun Demo):
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="loginAs('regular')"
                type="button"
                class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition text-center"
              >
                👤 Masuk Pengguna UMKM
              </button>
              <button
                @click="loginAs('admin')"
                type="button"
                class="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold rounded-xl transition text-center"
              >
                🛡️ Masuk Admin (/admin)
              </button>
            </div>
          </div>
        </div>

        <!-- LANGKAH 2: Masukkan Kode OTP 6 Digit -->
        <div v-else class="space-y-3">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Kode Verifikasi 6-Digit
              </label>
              <button
                @click="step = 'email'"
                class="text-[11px] font-bold text-brand-600 hover:underline"
              >
                Ganti Email
              </button>
            </div>
            <p class="text-[11px] text-slate-500 mb-2">
              Kode telah dikirim ke <strong>{{ emailInput }}</strong> (Kode Demo: <strong class="font-mono text-brand-700">123456</strong>).
            </p>
            <input
              v-model="otpCode"
              type="text"
              maxlength="6"
              placeholder="123456"
              class="w-full text-center tracking-[0.5em] px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xl font-mono font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <div v-if="failedAttempts > 0" class="text-[11px] text-red-600 font-bold mt-1 text-right">
              Percobaan salah: {{ failedAttempts }}/5
            </div>
          </div>

          <button
            @click="handleVerifyOtp"
            :disabled="otpCode.length !== 6 || isVerifying"
            class="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg v-if="!isVerifying" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ isVerifying ? 'Memeriksa Kode...' : 'Verifikasi & Buka Akses Penuh' }}</span>
          </button>

          <!-- Jeda Kirim Ulang OTP (Cooldown Timer 60 Detik - S3) -->
          <div class="text-center pt-2">
            <button
              v-if="cooldownCountdown === 0"
              @click="handleResendOtp"
              class="text-xs font-bold text-slate-600 hover:text-brand-700 underline"
            >
              Belum menerima kode? Kirim ulang sekarang
            </button>
            <span v-else class="text-xs font-semibold text-slate-400">
              Kirim ulang kode dalam <strong class="text-slate-700">{{ cooldownCountdown }}</strong> detik
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useWasteApp } from '../composables/useWasteApp';

const { isAuthModalOpen, authModalMessage, sendOtpEmail, verifyOtp, loginAs } = useWasteApp();

const step = ref<'email' | 'otp'>('email');
const emailInput = ref('mebel.cakmul@umkm.id');
const otpCode = ref('123456');
const isSending = ref(false);
const isVerifying = ref(false);

// S3: Cooldown timer (60s) & Lockout setelah 5 percobaan salah
const cooldownCountdown = ref(0);
const failedAttempts = ref(0);
const isLockedOut = ref(false);
const lockoutCountdown = ref(0);

let cooldownTimer: any = null;
let lockoutTimer: any = null;

function startCooldown(seconds = 60) {
  cooldownCountdown.value = seconds;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    if (cooldownCountdown.value > 0) {
      cooldownCountdown.value--;
    } else {
      clearInterval(cooldownTimer);
    }
  }, 1000);
}

function startLockout(seconds = 60) {
  isLockedOut.value = true;
  lockoutCountdown.value = seconds;
  if (lockoutTimer) clearInterval(lockoutTimer);
  lockoutTimer = setInterval(() => {
    if (lockoutCountdown.value > 0) {
      lockoutCountdown.value--;
    } else {
      isLockedOut.value = false;
      failedAttempts.value = 0;
      clearInterval(lockoutTimer);
    }
  }, 1000);
}

async function handleSendOtp() {
  isSending.value = true;
  try {
    await sendOtpEmail(emailInput.value);
    step.value = 'otp';
    startCooldown(60);
  } finally {
    isSending.value = false;
  }
}

async function handleResendOtp() {
  if (cooldownCountdown.value > 0) return;
  await handleSendOtp();
}

async function handleVerifyOtp() {
  if (isLockedOut.value) return;

  isVerifying.value = true;
  try {
    await verifyOtp(emailInput.value, otpCode.value);
    isAuthModalOpen.value = false;
    failedAttempts.value = 0;
  } catch (err: any) {
    failedAttempts.value++;
    if (failedAttempts.value >= 5) {
      startLockout(60);
    } else {
      alert(`Kode OTP tidak sesuai (Percobaan ${failedAttempts.value}/5). Masukkan kode 123456 untuk demo.`);
    }
  } finally {
    isVerifying.value = false;
  }
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
  if (lockoutTimer) clearInterval(lockoutTimer);
});
</script>
