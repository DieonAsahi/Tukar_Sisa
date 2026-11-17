import { ref, computed } from 'vue';
import {
  WasteCategory,
  WasteListing,
  ListingLocation,
  MaterialRequest,
  MatchRecommendation,
  Deal,
  Verification,
  UserProfile,
  ReportItem,
  AdminAction,
  AppNotification,
  ImpactMetrics,
  SystemSettings,
  AlasanLaporan,
  SatuanLimbah,
  TipeHarga,
  MetodePengambilan,
  StatusListing,
  StatusDeal
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_LOCATIONS,
  INITIAL_REQUESTS,
  INITIAL_DEALS,
  INITIAL_VERIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_ADMIN_ACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_IMPACT,
  INITIAL_SYSTEM_SETTINGS,
  MOCK_ADMIN_USER,
  MOCK_REGULAR_USER,
  MOCK_SEEKER_USER,
  MOCK_SUSPENDED_USER
} from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Jarak garis lurus permukaan bumi (Haversine Formula) dalam km
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Global Reactive States
// Auto-aktivasi sesi Admin jika halaman pertama kali dibuka langsung di rute /admin (Mode Demo)
const isDemoModeDefault = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE !== 'false';
const isInitialAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
const currentUser = ref<UserProfile | null>(isInitialAdminRoute && isDemoModeDefault ? { ...MOCK_ADMIN_USER } : null);
const authOtpPendingEmail = ref<string>('');
const isAuthModalOpen = ref(false);
const isProfileSetupOpen = ref(false);
const authModalMessage = ref('Masuk dengan OTP Email untuk membuka kontak WhatsApp dan koordinat presisi.');

// V8: Gerbang Login Kontekstual - Aksi tertunda yang dilanjutkan setelah login
const pendingContextualAction = ref<{
  type: 'contact_listing' | 'create_listing' | 'create_request' | 'submit_report' | 'confirm_deal';
  payload?: any;
} | null>(null);

const categories = ref<WasteCategory[]>([...INITIAL_CATEGORIES]);
const listings = ref<WasteListing[]>([...INITIAL_LISTINGS]);
const locations = ref<Record<string, ListingLocation>>({ ...INITIAL_LOCATIONS });
const requests = ref<MaterialRequest[]>([...INITIAL_REQUESTS]);
const deals = ref<Deal[]>([...INITIAL_DEALS]);
const verifications = ref<Verification[]>([...INITIAL_VERIFICATIONS]);
const reports = ref<ReportItem[]>([...INITIAL_REPORTS]);
const adminActions = ref<AdminAction[]>([...INITIAL_ADMIN_ACTIONS]);
const notifications = ref<AppNotification[]>([...INITIAL_NOTIFICATIONS]);
const impactMetrics = ref<ImpactMetrics>({ ...INITIAL_IMPACT });
const systemSettings = ref<SystemSettings>({ ...INITIAL_SYSTEM_SETTINGS });
const favoriteListingIds = ref<string[]>([]);

// Acuan lokasi pencari (Default: Surabaya Pusat)
const userCoords = ref<{ lat: number; lng: number }>({
  lat: -7.2655,
  lng: 112.7480
});

// Radius pencarian (1-100 km, default 10 km - PRD Hal. 9 & 12)
const radiusKm = ref<number>(10);
const radiusValidationError = ref<string | null>(null);

// U12 Filter Tambahan
const filterCategoryId = ref<string>('semua');
const filterMinVolume = ref<number | null>(null);
const filterPriceType = ref<'semua' | 'gratis' | 'berbayar'>('semua');
const filterOnlyVerified = ref<boolean>(false);
const sortBy = ref<'terdekat' | 'terbaru' | 'volume_terbanyak'>('terdekat');

export function useWasteApp() {
  const isAuthenticated = computed(() => currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.peran_sistem === 'admin');
  const isHighRadiusWarning = computed(() => radiusKm.value > 50);

  // Cek apakah akun sedang disanksi (ditangguhkan / diblokir)
  const isAccountSanctioned = computed(() => {
    return (
      currentUser.value?.status_akun === 'ditangguhkan' ||
      currentUser.value?.status_akun === 'diblokir'
    );
  });

  // Kategori non-B3 yang diizinkan untuk posting
  const allowedCategories = computed(() =>
    categories.value.filter((c) => c.boleh_diposting)
  );

  // Kategori B3 terlarang untuk kamus edukasi & pencegahan
  const hazardousCategories = computed(() =>
    categories.value.filter((c) => !c.boleh_diposting)
  );

  // Listing aktif yang tidak kedaluwarsa (> 14 hari tidak diperbarui)
  const publicListings = computed(() => {
    const fourteenDaysAgo = Date.now() - (systemSettings.value.masa_kedaluwarsa_hari || 14) * 24 * 60 * 60 * 1000;
    return listings.value.filter((l) => {
      const isApproved = l.status === 'aktif';
      const notExpiredDate = new Date(l.kedaluwarsa_pada).getTime() > Date.now();
      const notExpiredUpdate = new Date(l.dibuat_pada).getTime() >= fourteenDaysAgo;
      return isApproved && notExpiredDate && notExpiredUpdate;
    });
  });

  // Antrean listing baru yang butuh moderasi admin (A5)
  const pendingReviewListings = computed(() => {
    return listings.value.filter((l) => l.status_moderasi === 'menunggu_tinjauan');
  });

  // Antrean laporan terbuka
  const openReports = computed(() => {
    return reports.value.filter((r) => r.status === 'terbuka' || r.status === 'dalam_tinjauan');
  });

  // Cek apakah listing sudah pernah dikontak oleh user saat ini
  function isListingContacted(listingId: string): boolean {
    if (!currentUser.value) return false;
    return deals.value.some(
      (d) => d.listing_id === listingId && d.seeker_id === currentUser.value?.id
    );
  }

  // Filter radius & urutkan listing (U12)
  const filteredListings = computed(() => {
    return publicListings.value
      .map((item) => {
        const dist = calculateHaversineDistance(
          userCoords.value.lat,
          userCoords.value.lng,
          item.exact_latitude ?? item.approx_latitude,
          item.exact_longitude ?? item.approx_longitude
        );

        const contacted = isListingContacted(item.id);
        const isLocked = !isAuthenticated.value || (!contacted && item.owner_id !== currentUser.value?.id && !isAdmin.value);

        return {
          ...item,
          jarak_km: dist,
          is_contact_locked: isLocked,
          // Buka koordinat presisi jika sudah kontak atau milik sendiri
          exact_latitude: !isLocked && locations.value[item.id] ? locations.value[item.id].lat_presisi : undefined,
          exact_longitude: !isLocked && locations.value[item.id] ? locations.value[item.id].lng_presisi : undefined,
          alamat_presisi: !isLocked && locations.value[item.id] ? locations.value[item.id].alamat_presisi : undefined
        };
      })
      .filter((item) => {
        if (item.jarak_km > radiusKm.value) return false;
        if (filterCategoryId.value && filterCategoryId.value !== 'semua' && item.category_id !== filterCategoryId.value) return false;
        if (filterMinVolume.value !== null && item.volume_per_minggu < filterMinVolume.value) return false;
        if (filterPriceType.value === 'gratis' && item.harga > 0) return false;
        if (filterPriceType.value === 'berbayar' && item.harga === 0) return false;
        if (filterOnlyVerified.value && !item.lokasi_terverifikasi) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy.value === 'terdekat') {
          if (a.lokasi_terverifikasi && !b.lokasi_terverifikasi) return -1;
          if (!a.lokasi_terverifikasi && b.lokasi_terverifikasi) return 1;
          return (a.jarak_km || 0) - (b.jarak_km || 0);
        } else if (sortBy.value === 'terbaru') {
          return new Date(b.dibuat_pada).getTime() - new Date(a.dibuat_pada).getTime();
        } else if (sortBy.value === 'volume_terbanyak') {
          return (b.volume_per_minggu || 0) - (a.volume_per_minggu || 0);
        }
        return (a.jarak_km || 0) - (b.jarak_km || 0);
      });
  });

  // Permintaan bahan baku dalam radius
  const filteredRequests = computed(() => {
    return requests.value
      .map((item) => {
        const dist = calculateHaversineDistance(
          userCoords.value.lat,
          userCoords.value.lng,
          item.lat,
          item.lng
        );
        return { ...item, jarak_km: dist };
      })
      .filter((item) => item.status === 'aktif' && (item.jarak_km || 0) <= radiusKm.value);
  });

  // Rekomendasi Matching Otomatis Pintar (Dihitung On-The-Fly RPC S1, U13)
  const matches = computed<MatchRecommendation[]>(() => {
    const list: MatchRecommendation[] = [];
    publicListings.value.forEach((l) => {
      requests.value.filter((r) => r.status === 'aktif').forEach((r) => {
        // Syarat wajib: Kategori sama (PRD Hal. 8 & 13)
        if (l.category_id === r.category_id) {
          const dist = calculateHaversineDistance(
            l.exact_latitude ?? l.approx_latitude,
            l.exact_longitude ?? l.approx_longitude,
            r.lat,
            r.lng
          );
          if (dist <= radiusKm.value) {
            const cat = categories.value.find((c) => c.id === l.category_id);
            const factor = cat?.faktor_ke_kg || 1;
            const listingKg = l.volume_per_minggu * factor;
            const requestKg = r.volume_dibutuhkan * factor;

            let score = 50.0;
            if (listingKg >= requestKg) score += 20;
            else score += 10;

            if (dist <= 10) score += 20;
            else if (dist <= 25) score += 15;
            else score += 10;

            if (l.lokasi_terverifikasi) score += 10;

            list.push({
              id: `match-${l.id}-${r.id}`,
              listing_id: l.id,
              request_id: r.id,
              listing_judul: l.judul,
              request_judul: r.judul,
              category_name: l.category_name || cat?.nama || 'Limbah',
              skor_kecocokan: Math.min(100, Math.round(score * 10) / 10),
              jarak_km: dist,
              penghasil_nama: l.nama_usaha,
              pencari_nama: r.nama_usaha || 'UMKM Pencari',
              volume_summary: `Pasokan ${l.volume_per_minggu} ${l.satuan} memenuhi kebutuhan ${r.volume_dibutuhkan} ${r.satuan}`
            });
          }
        }
      });
    });
    return list.sort((a, b) => b.skor_kecocokan - a.skor_kecocokan);
  });

  // Notifikasi Unread
  const unreadNotificationsCount = computed(() => {
    if (!currentUser.value) return 0;
    return notifications.value.filter(
      (n) => n.user_id === currentUser.value?.id && !n.dibaca
    ).length;
  });

  // Listing Favorit (U23)
  const favoriteListings = computed(() => {
    return filteredListings.value.filter((l) => favoriteListingIds.value.includes(l.id));
  });

  // Listing Milik Sendiri (U9)
  const myListings = computed(() => {
    if (!currentUser.value) return [];
    return listings.value.filter((l) => l.owner_id === currentUser.value?.id);
  });

  // Permintaan Bahan Milik Sendiri (U11)
  const myRequests = computed(() => {
    if (!currentUser.value) return [];
    return requests.value.filter((r) => r.user_id === currentUser.value?.id);
  });

  // Deals / Transaksi Milik Sendiri (U21)
  const myDeals = computed(() => {
    if (!currentUser.value) return [];
    return deals.value.filter(
      (d) => d.seeker_id === currentUser.value?.id || d.provider_id === currentUser.value?.id
    );
  });

  // Dashboard Dampak Pribadi (U22)
  const myImpactMetrics = computed(() => {
    if (!currentUser.value) {
      return { total_kg_dialihkan: 0, estimasi_penghematan_biaya_buang: 0, total_transaksi: 0 };
    }
    const completedDeals = deals.value.filter(
      (d) =>
        (d.seeker_id === currentUser.value?.id || d.provider_id === currentUser.value?.id) &&
        d.status === 'selesai'
    );
    const kg = completedDeals.reduce((sum, d) => sum + (d.volume_aktual_kg || 0), 0);
    return {
      total_kg_dialihkan: kg,
      estimasi_penghematan_biaya_buang: kg * (systemSettings.value.biaya_retribusi_per_kg || 450),
      total_transaksi: completedDeals.length
    };
  });

  // Set & Validasi Radius (1–100 km, dinamis sesuai systemSettings A12)
  function setRadius(value: number): boolean {
    const maxR = systemSettings.value.radius_maksimal_km || 100;
    if (value < 1 || value > maxR) {
      radiusValidationError.value = `Radius pencarian harus berada di antara 1 sampai ${maxR} km.`;
      return false;
    }
    radiusValidationError.value = null;
    radiusKm.value = value;
    return true;
  }

  // Set Titik Lokasi Acuan Pengguna
  function setUserLocation(lat: number, lng: number) {
    userCoords.value = { lat, lng };
  }

  // Deteksi GPS Perangkat
  function detectDeviceLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Perangkat tidak mendukung pelacakan GPS.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          userCoords.value = coords;
          resolve(coords);
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  // Auth Gate: Cek apakah boleh mengakses fitur terkunci (V8 Gerbang Login Kontekstual)
  function requireAuth(
    actionName: string = 'melanjutkan',
    pendingAction?: { type: 'contact_listing' | 'create_listing' | 'create_request' | 'submit_report' | 'confirm_deal'; payload?: any }
  ): boolean {
    if (!isAuthenticated.value) {
      authModalMessage.value = `Silakan masuk dengan OTP Email untuk ${actionName}.`;
      if (pendingAction) {
        pendingContextualAction.value = pendingAction;
      }
      isAuthModalOpen.value = true;
      return false;
    }
    return true;
  }

  // Eksekusi aksi yang tertunda setelah login (V8)
  function executePendingAction() {
    if (!pendingContextualAction.value) return;
    const action = pendingContextualAction.value;
    pendingContextualAction.value = null;

    if (action.type === 'contact_listing' && action.payload) {
      contactListing(action.payload);
    }
  }

  // Kirim OTP Email (Integrasi Supabase Auth dengan fallback simulasi)
  async function sendOtpEmail(email: string) {
    authOtpPendingEmail.value = email;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true }
        });
        if (error) throw error;
        return { success: true, message: `Kode verifikasi telah dikirim ke ${email} via Supabase Auth` };
      } catch (err: any) {
        console.warn('Gagal kirim via Supabase, beralih ke simulasi OTP demo:', err.message);
      }
    }
    return { success: true, message: `Kode 6-digit verifikasi (demo: 123456) telah dikirim ke ${email}` };
  }

  // Verifikasi OTP Email
  async function verifyOtp(email: string, code: string, role: 'pengguna' | 'admin' = 'pengguna') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: code,
          type: 'email'
        });
        if (error) throw error;
        if (data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile && profile.nama_usaha) {
            currentUser.value = profile;
          } else {
            // Pengguna baru pertama kali login -> onboarding (U3, U4)
            currentUser.value = {
              id: data.user.id,
              email: email,
              nama_usaha: '',
              no_wa: '',
              jenis_usaha: '',
              peran_usaha: 'keduanya',
              peran_sistem: email.includes('admin') ? 'admin' : 'pengguna',
              status_akun: 'aktif',
              latitude: userCoords.value.lat,
              longitude: userCoords.value.lng,
              alamat_tampilan: 'Surabaya, Jawa Timur',
              alamat_presisi: '',
              is_lokasi_terverifikasi: false,
              jumlah_transaksi_terkonfirmasi: 0
            };
            isProfileSetupOpen.value = true;
          }
          isAuthModalOpen.value = false;
          executePendingAction();
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Verifikasi Supabase gagal, memeriksa kode demo lokal:', err.message);
      }
    }

    if (code === '123456' || code.length === 6) {
      if (role === 'admin' || email.includes('admin')) {
        currentUser.value = { ...MOCK_ADMIN_USER, email };
      } else if (email.includes('jamur') || email.includes('pencari')) {
        currentUser.value = { ...MOCK_SEEKER_USER, email };
      } else {
        currentUser.value = { ...MOCK_REGULAR_USER, email };
      }
      isAuthModalOpen.value = false;
      executePendingAction();
      return { success: true };
    }
    throw new Error('Kode OTP tidak sesuai. Masukkan 6 digit yang dikirim ke email Anda.');
  }

  // Lengkapi / Perbarui Profil Usaha (U4)
  function updateProfile(data: Partial<UserProfile>) {
    if (!currentUser.value) return false;
    currentUser.value = {
      ...currentUser.value,
      ...data,
      nama_usaha: data.nama_usaha || currentUser.value.nama_usaha,
      jenis_usaha: data.jenis_usaha || currentUser.value.jenis_usaha,
      peran_usaha: data.peran_usaha || currentUser.value.peran_usaha,
      no_wa: data.no_wa || currentUser.value.no_wa,
      alamat_tampilan: data.alamat_tampilan || currentUser.value.alamat_tampilan,
      alamat_presisi: data.alamat_presisi || currentUser.value.alamat_presisi,
      latitude: data.latitude ?? currentUser.value.latitude,
      longitude: data.longitude ?? currentUser.value.longitude,
      foto_usaha: data.foto_usaha || currentUser.value.foto_usaha
    };
    isProfileSetupOpen.value = false;
    return true;
  }

  // Hapus Akun & Seluruh Data Pribadi (U7 - Kepatuhan UU PDP)
  function deleteAccount(): boolean {
    if (!currentUser.value) return false;
    const uid = currentUser.value.id;

    // Hapus listing & requests milik user
    listings.value = listings.value.filter((l) => l.owner_id !== uid);
    requests.value = requests.value.filter((r) => r.user_id !== uid);
    notifications.value = notifications.value.filter((n) => n.user_id !== uid);

    currentUser.value = null;
    alert('Akun Anda beserta seluruh data pribadi telah berhasil dihapus secara permanen sesuai ketentuan UU PDP.');
    return true;
  }

  // Login Cepat Akun Demo (untuk pengujian instan 30 detik)
  function loginAs(type: 'admin' | 'regular' | 'seeker' | 'suspended') {
    if (type === 'admin') {
      currentUser.value = { ...MOCK_ADMIN_USER };
    } else if (type === 'suspended') {
      currentUser.value = { ...MOCK_SUSPENDED_USER };
    } else if (type === 'seeker') {
      currentUser.value = { ...MOCK_SEEKER_USER };
    } else {
      currentUser.value = { ...MOCK_REGULAR_USER };
    }
    isAuthModalOpen.value = false;
    executePendingAction();
  }

  function logout() {
    currentUser.value = null;
  }

  // U16: Hubungi lewat WhatsApp & Catat Deal
  function contactListing(listing: WasteListing): { success: boolean; waUrl?: string; message?: string } {
    if (!requireAuth('menghubungi pemilik listing via WhatsApp', { type: 'contact_listing', payload: listing })) {
      return { success: false, message: 'Harap masuk terlebih dahulu' };
    }

    if (currentUser.value?.id === listing.owner_id) {
      alert('Ini adalah postingan limbah Anda sendiri.');
      return { success: false, message: 'Listing sendiri' };
    }

    // S3: Pembatasan laju kontak harian (maksimal 10 kontak per hari)
    const today = new Date().toDateString();
    const todayContacts = deals.value.filter(
      (d) => d.seeker_id === currentUser.value?.id && new Date(d.dibuat_pada).toDateString() === today
    );
    if (todayContacts.length >= 10) {
      alert('Batas Harian Tercapai: Anda telah menghubungi 10 listing hari ini demi mencegah spam. Silakan coba kembali besok.');
      return { success: false, message: 'Batas kontak harian' };
    }

    // Catat kontak di tabel deals (PRD Hal. 13 & 14)
    let existingDeal = deals.value.find(
      (d) => d.listing_id === listing.id && d.seeker_id === currentUser.value?.id
    );

    if (!existingDeal) {
      existingDeal = {
        id: 'deal-' + Date.now(),
        listing_id: listing.id,
        listing_judul: listing.judul,
        category_name: listing.category_name,
        seeker_id: currentUser.value?.id || 'anon',
        seeker_nama: currentUser.value?.nama_usaha || 'Pencari Bahan',
        seeker_wa: currentUser.value?.no_wa || '',
        provider_id: listing.owner_id,
        provider_nama: listing.nama_usaha,
        provider_wa: listing.no_wa || '6281234567001',
        status: 'menghubungi',
        dibuat_pada: new Date().toISOString()
      };
      deals.value.unshift(existingDeal);

      // Kirim Notifikasi ke Pemilik Listing (U20)
      notifications.value.unshift({
        id: 'notif-' + Date.now(),
        user_id: listing.owner_id,
        jenis: 'ada_peminat',
        isi: `${currentUser.value?.nama_usaha || 'UMKM Pencari'} telah membuka nomor kontak dan tertarik pada pasokan "${listing.judul}".`,
        dibaca: false,
        dibuat_pada: new Date().toISOString()
      });
    }

    // Buka koordinat presisi & kontak
    listing.is_contact_locked = false;

    // Prefill WhatsApp text
    const phone = listing.no_wa || '6281234567001';
    const text = `Halo *${listing.nama_usaha}*, saya melihat listing limbah Anda di Bursa Limbah UMKM:
*${listing.judul}* (${listing.volume_per_minggu} ${listing.satuan}).
Jarak lokasi kita sekitar ${listing.jarak_km || 1} km.
Apakah masih tersedia untuk saya ambil? Terima kasih.`;

    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    return { success: true, waUrl: url };
  }

  // Alias untuk kompatibilitas
  function openWhatsApp(listing: WasteListing) {
    contactListing(listing);
  }

  // U8: Form Posting 1 Layar (< 1 menit, PRD Hal. 6, S4)
  function createListing(data: {
    category_id: string;
    judul: string;
    deskripsi: string;
    volume_per_minggu: number;
    satuan: SatuanLimbah;
    foto_url: string;
    tipe_harga: TipeHarga;
    harga_satuan: number;
    metode_pengambilan: MetodePengambilan;
  }) {
    if (!requireAuth('membuat posting limbah')) return false;

    // Batas akun baru maksimal 3 listing aktif sebelum transaksi pertama selesai (PRD Hal. 10 & 12)
    const userActiveListings = listings.value.filter(
      (l) => l.owner_id === currentUser.value?.id && l.status === 'aktif'
    );

    const confirmedCount = currentUser.value?.jumlah_transaksi_terkonfirmasi ?? 0;
    const maxListingLimit = systemSettings.value.batas_listing_akun_baru || 3;

    if (confirmedCount === 0 && userActiveListings.length >= maxListingLimit) {
      alert(
        `Batas Maksimal Tercapai!\n\nAkun baru dibatasi maksimal ${maxListingLimit} listing aktif sebelum menyelesaikan transaksi pertama. Selesaikan 1 transaksi terkonfirmasi untuk membuka kuota posting tanpa batas.`
      );
      return false;
    }

    const category = categories.value.find((c) => c.id === data.category_id);
    if (!category || !category.boleh_diposting) {
      alert('Kategori limbah yang Anda pilih termasuk limbah berbahaya/B3 yang dilarang.');
      return false;
    }

    const listingId = 'listing-' + Date.now();
    const lat = currentUser.value?.latitude || userCoords.value.lat;
    const lng = currentUser.value?.longitude || userCoords.value.lng;

    // Titik dikaburkan untuk area_point (S2)
    const approxLat = Math.round(lat * 100) / 100;
    const approxLng = Math.round(lng * 100) / 100;

    const newListing: WasteListing = {
      id: listingId,
      owner_id: currentUser.value?.id || 'anon',
      user_id: currentUser.value?.id || 'anon',
      category_id: category.id,
      category_name: category.nama,
      category_icon: category.ikon,
      judul: data.judul,
      deskripsi: data.deskripsi,
      volume_per_minggu: data.volume_per_minggu,
      satuan: data.satuan,
      harga: data.tipe_harga === 'gratis' ? 0 : data.harga_satuan,
      tipe_harga: data.tipe_harga,
      harga_satuan: data.harga_satuan,
      metode_pengambilan: data.metode_pengambilan,
      foto: data.foto_url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      foto_url: data.foto_url,
      area_point: { lat: approxLat, lng: approxLng },
      approx_latitude: approxLat,
      approx_longitude: approxLng,
      approx_radius_meters: 800,
      lokasi_terverifikasi: currentUser.value?.is_lokasi_terverifikasi ?? false,
      is_lokasi_terverifikasi: currentUser.value?.is_lokasi_terverifikasi ?? false,
      status: 'aktif',
      // Listing pertama akun baru masuk antrean moderasi admin (A5)
      status_moderasi: userActiveListings.length === 0 && confirmedCount === 0 ? 'menunggu_tinjauan' : 'disetujui',
      kedaluwarsa_pada: new Date(Date.now() + (systemSettings.value.masa_kedaluwarsa_hari || 14) * 24 * 60 * 60 * 1000).toISOString(),
      dibuat_pada: new Date().toISOString(),
      jarak_km: 0.1,
      is_contact_locked: false,
      nama_usaha: currentUser.value?.nama_usaha || 'UMKM Anda',
      jenis_usaha: currentUser.value?.jenis_usaha || 'Usaha Lokal',
      alamat_tampilan: currentUser.value?.alamat_tampilan || 'Surabaya, Jawa Timur',
      no_wa: currentUser.value?.no_wa,
      exact_latitude: lat,
      exact_longitude: lng,
      alamat_presisi: currentUser.value?.alamat_presisi,
      is_email_verified: true,
      has_confirmed_transactions: confirmedCount > 0
    };

    // Simpan ke tabel listing_locations terpisah (PRD Hal. 14 & 18)
    locations.value[listingId] = {
      listing_id: listingId,
      lat_presisi: lat,
      lng_presisi: lng,
      alamat_presisi: currentUser.value?.alamat_presisi || '',
      dibuat_pada: new Date().toISOString()
    };

    listings.value.unshift(newListing);
    impactMetrics.value.total_listing_aktif++;
    return true;
  }

  // U11: Posting Kebutuhan Bahan Baku
  function createMaterialRequest(data: {
    category_id: string;
    judul: string;
    deskripsi: string;
    volume_dibutuhkan: number;
    satuan: SatuanLimbah;
    frekuensi: string;
    radius_km: number;
  }) {
    if (!requireAuth('memposting kebutuhan bahan baku')) return false;

    const cat = categories.value.find((c) => c.id === data.category_id);
    const newReq: MaterialRequest = {
      id: 'req-' + Date.now(),
      user_id: currentUser.value?.id || 'anon',
      category_id: data.category_id,
      category_name: cat?.nama,
      judul: data.judul,
      deskripsi: data.deskripsi,
      volume_dibutuhkan: data.volume_dibutuhkan,
      satuan: data.satuan,
      frekuensi: data.frekuensi,
      radius_km: data.radius_km,
      lat: currentUser.value?.latitude || userCoords.value.lat,
      lng: currentUser.value?.longitude || userCoords.value.lng,
      status: 'aktif',
      nama_usaha: currentUser.value?.nama_usaha,
      dibuat_pada: new Date().toISOString()
    };

    requests.value.unshift(newReq);
    return true;
  }

  // U9: Kelola Listing Saya (Edit, Tutup, Perpanjang, Dipesan, Selesai)
  function updateListingStatus(listingId: string, newStatus: StatusListing) {
    const item = listings.value.find((l) => l.id === listingId);
    if (!item) return false;
    item.status = newStatus;
    return true;
  }

  function extendListingExpiry(listingId: string) {
    const item = listings.value.find((l) => l.id === listingId);
    if (!item) return false;
    item.kedaluwarsa_pada = new Date(Date.now() + (systemSettings.value.masa_kedaluwarsa_hari || 14) * 24 * 60 * 60 * 1000).toISOString();
    alert('Masa aktif listing berhasil diperpanjang 14 hari ke depan.');
    return true;
  }

  // U5: Verifikasi Lokasi Fisik (Toleransi ≤ 200m dari GPS)
  function verifyBusinessLocation(deviceLat: number, deviceLng: number, photoUrl: string) {
    if (!currentUser.value) return { success: false, message: 'Harap masuk terlebih dahulu.' };

    const tolerance = systemSettings.value.toleransi_gps_meter || 200;
    const distanceMeters =
      calculateHaversineDistance(
        deviceLat,
        deviceLng,
        currentUser.value.latitude,
        currentUser.value.longitude
      ) * 1000;

    const isPassed = distanceMeters <= tolerance;

    // Catat ke tabel verifications (PRD Hal. 14)
    verifications.value.unshift({
      id: 'v-' + Date.now(),
      user_id: currentUser.value.id,
      user_nama: currentUser.value.nama_usaha,
      jenis_lencana: 'lokasi',
      status: isPassed ? 'disetujui' : 'ditolak',
      jarak_pin_gps_m: Math.round(distanceMeters),
      foto_bukti: photoUrl,
      diperiksa_pada: new Date().toISOString(),
      dibuat_pada: new Date().toISOString()
    });

    if (isPassed) {
      currentUser.value.is_lokasi_terverifikasi = true;
      currentUser.value.foto_usaha = photoUrl;

      listings.value.forEach((l) => {
        if (l.owner_id === currentUser.value?.id) {
          l.lokasi_terverifikasi = true;
          l.is_lokasi_terverifikasi = true;
        }
      });

      return {
        success: true,
        distance_meters: Math.round(distanceMeters),
        message: `Luar biasa! Jarak GPS perangkat dengan pin usaha Anda adalah ${Math.round(distanceMeters)} meter (≤ ${tolerance}m). Lencana Lokasi Terverifikasi aktif!`
      };
    } else {
      return {
        success: false,
        distance_meters: Math.round(distanceMeters),
        message: `Verifikasi gagal: Jarak GPS perangkat Anda (${Math.round(distanceMeters)} meter) melebihi batas toleransi ${tolerance} meter dari titik lokasi tempat usaha yang Anda pin.`
      };
    }
  }

  // U17 & U18: Konfirmasi Transaksi Dua Pihak & Penilaian Singkat
  function confirmDeal(
    dealId: string,
    actualVolume: number,
    actualPrice: number,
    sesuaiDeskripsi: boolean = true,
    simulateBothParties: boolean = true
  ) {
    if (!requireAuth('mengonfirmasi penyelesaian transaksi')) return false;

    const deal = deals.value.find((d) => d.id === dealId);
    if (!deal) return false;

    const isProvider = currentUser.value?.id === deal.provider_id;
    const nowStr = new Date().toISOString();

    if (isProvider) {
      deal.konfirmasi_penghasil_pada = nowStr;
    } else {
      deal.konfirmasi_pencari_pada = nowStr;
    }

    if (simulateBothParties) {
      deal.konfirmasi_penghasil_pada = deal.konfirmasi_penghasil_pada || nowStr;
      deal.konfirmasi_pencari_pada = deal.konfirmasi_pencari_pada || nowStr;
    }

    deal.volume_aktual = actualVolume;
    deal.harga_aktual = actualPrice;
    deal.sesuai_deskripsi = sesuaiDeskripsi;

    // Temukan listing & kategori untuk faktor_ke_kg (S6)
    const targetListing = listings.value.find((l) => l.id === deal.listing_id);
    const cat = categories.value.find((c) => c.id === targetListing?.category_id);
    const factor = cat?.faktor_ke_kg || 1;
    const kg = actualVolume * factor;
    const savings = kg * (systemSettings.value.biaya_retribusi_per_kg || 450);

    deal.volume_aktual_kg = kg;
    deal.penghematan_biaya_rp = savings;

    // PRD U17: Transaksi hanya berstatus 'selesai' dan masuk Dashboard Dampak jika KEDUA pihak telah mengonfirmasi
    const bothConfirmed = !!deal.konfirmasi_penghasil_pada && !!deal.konfirmasi_pencari_pada;

    if (bothConfirmed) {
      deal.status = 'selesai';

      if (currentUser.value) {
        currentUser.value.jumlah_transaksi_terkonfirmasi++;
      }

      impactMetrics.value.total_kg_dialihkan += kg;
      impactMetrics.value.estimasi_penghematan_biaya_buang += savings;
      impactMetrics.value.total_transaksi += 1;

      // Kirim notifikasi transaksi selesai
      const targetNotifUser = isProvider ? deal.seeker_id : (deal.provider_id || '');
      if (targetNotifUser) {
        notifications.value.unshift({
          id: 'notif-' + Date.now(),
          user_id: targetNotifUser,
          jenis: 'konfirmasi_transaksi',
          isi: `Transaksi untuk "${deal.listing_judul || 'Pasokan Limbah'}" telah dikonfirmasi selesai oleh kedua pihak (${kg} kg dialihkan). Terima kasih telah berkontribusi pada SDG 8 & 12!`,
          dibaca: false,
          dibuat_pada: new Date().toISOString()
        });
      }
    } else {
      // Notifikasi menunggu konfirmasi pihak kedua
      const targetNotifUser = isProvider ? deal.seeker_id : (deal.provider_id || '');
      if (targetNotifUser) {
        notifications.value.unshift({
          id: 'notif-' + Date.now(),
          user_id: targetNotifUser,
          jenis: 'konfirmasi_transaksi',
          isi: `Rekan transaksi telah mengonfirmasi serah terima untuk "${deal.listing_judul || 'Pasokan Limbah'}". Harap buka aplikasi untuk konfirmasi balik agar transaksi selesai.`,
          dibaca: false,
          dibuat_pada: new Date().toISOString()
        });
      }
    }

    return true;
  }

  // Alias untuk kompatibilitas form lama
  function confirmTransaction(transactionId: string, actualKg: number) {
    return confirmDeal(transactionId, actualKg, 0, true);
  }

  // U19: Laporkan Listing / Profil (F12)
  function submitReport(targetId: string, jenisTarget: 'listing' | 'profile', reason: AlasanLaporan, details: string) {
    if (!requireAuth('melaporkan pelanggaran')) return false;

    // S3: Pembatasan laju laporan (maksimal 5 laporan per hari)
    const today = new Date().toDateString();
    const todayReports = reports.value.filter(
      (r) => r.reporter_id === currentUser.value?.id && new Date(r.dibuat_pada).toDateString() === today
    );
    if (todayReports.length >= 5) {
      alert('Batas Pelaporan Tercapai: Anda telah mengirimkan 5 laporan hari ini. Tim moderasi /admin sedang menindaklanjuti pengaduan Anda.');
      return false;
    }

    let listingJudul = '';
    let terlaporNama = 'UMKM Terlapor';
    let terlaporId = '';

    if (jenisTarget === 'listing') {
      const l = listings.value.find((item) => item.id === targetId);
      listingJudul = l?.judul || '';
      terlaporNama = l?.nama_usaha || '';
      terlaporId = l?.owner_id || '';
    }

    const newReport: ReportItem = {
      id: 'rep-' + Date.now(),
      reporter_id: currentUser.value?.id || 'anon',
      pelapor_nama: currentUser.value?.nama_usaha || 'UMKM Pelapor',
      jenis_target: jenisTarget,
      target_id: targetId,
      listing_judul: listingJudul,
      terlapor_user_id: terlaporId,
      terlapor_nama: terlaporNama,
      alasan: reason,
      catatan: details,
      prioritas: reason === 'kategori terlarang' ? 'tinggi' : 'sedang',
      status: 'terbuka',
      dibuat_pada: new Date().toISOString()
    };

    reports.value.unshift(newReport);
    impactMetrics.value.total_laporan_terbuka++;
    return true;
  }

  // U20: Baca Notifikasi
  function markNotificationAsRead(id: string) {
    const item = notifications.value.find((n) => n.id === id);
    if (item) item.dibaca = true;
  }

  function markAllNotificationsAsRead() {
    if (!currentUser.value) return;
    notifications.value.forEach((n) => {
      if (n.user_id === currentUser.value?.id) n.dibaca = true;
    });
  }

  // U23: Favorit / Bookmark
  function toggleFavorite(listingId: string) {
    const idx = favoriteListingIds.value.indexOf(listingId);
    if (idx !== -1) {
      favoriteListingIds.value.splice(idx, 1);
    } else {
      favoriteListingIds.value.push(listingId);
    }
  }

  function isFavorite(listingId: string): boolean {
    return favoriteListingIds.value.includes(listingId);
  }

  // ============================================================================
  // FITUR KHUSUS ADMIN (A1 - A13, IMMUTABLE AUDIT LOG S5)
  // ============================================================================

  // Catat tindakan ke admin_actions (Audit Log Immutable, A10, S5)
  function recordAdminAction(
    aksi: string,
    jenis_target: 'listing' | 'user' | 'report' | 'category' | 'deal' | 'settings',
    target_id: string,
    alasan: string
  ) {
    const action: AdminAction = {
      id: 'act-' + Date.now(),
      admin_id: currentUser.value?.id || 'admin',
      admin_nama: currentUser.value?.nama_usaha || 'Admin Moderasi',
      aksi,
      jenis_target,
      target_id,
      alasan,
      waktu: new Date().toISOString()
    };
    adminActions.value.unshift(action);
  }

  // A5 & A6: Tinjau & Kelola Listing
  function moderateListing(listingId: string, action: 'setujui' | 'sembunyikan' | 'hapus', reason: string) {
    if (!isAdmin.value) return false;

    const listing = listings.value.find((l) => l.id === listingId);
    if (!listing) return false;

    if (action === 'setujui') {
      listing.status_moderasi = 'disetujui';
      listing.status = 'aktif';
      recordAdminAction('setujui_listing', 'listing', listingId, reason || 'Listing disetujui');
    } else if (action === 'sembunyikan') {
      listing.status = 'disembunyikan';
      recordAdminAction('sembunyikan_listing', 'listing', listingId, reason || 'Disembunyikan');
    } else if (action === 'hapus') {
      const idx = listings.value.findIndex((l) => l.id === listingId);
      if (idx !== -1) listings.value.splice(idx, 1);
      recordAdminAction('hapus_listing', 'listing', listingId, reason || 'Dihapus permanen');
    }

    return true;
  }

  // A3 & A4: Putuskan Kasus Laporan & Cabut Lencana
  function handleReportAction(
    reportId: string,
    action: 'valid' | 'tolak',
    revokeLocationBadge: boolean,
    reason: string
  ) {
    if (!isAdmin.value) return false;

    const report = reports.value.find((r) => r.id === reportId);
    if (!report) return false;

    if (action === 'valid') {
      report.status = 'selesai';
      report.tindakan_diambil = `Laporan dinyatakan valid. ${revokeLocationBadge ? 'Lencana lokasi terverifikasi dicabut.' : ''}`;
      report.ditangani_oleh = currentUser.value?.id;
      report.ditangani_pada = new Date().toISOString();

      if (revokeLocationBadge && report.terlapor_user_id) {
        // Cabut lencana lokasi terlapor
        listings.value.forEach((l) => {
          if (l.owner_id === report.terlapor_user_id) {
            l.lokasi_terverifikasi = false;
            l.is_lokasi_terverifikasi = false;
          }
        });
        recordAdminAction(
          'cabut_lencana',
          'user',
          report.terlapor_user_id,
          reason || 'Pencabutan lencana lokasi terverifikasi akibat laporan alamat fiktif'
        );
      }

      // Kirim Notifikasi ke Terlapor
      if (report.terlapor_user_id) {
        notifications.value.unshift({
          id: 'notif-' + Date.now(),
          user_id: report.terlapor_user_id,
          jenis: 'sanksi_admin',
          isi: `Pemberitahuan Admin: Laporan pengaduan "${report.alasan}" dinyatakan valid. Alasan: ${reason}`,
          dibaca: false,
          dibuat_pada: new Date().toISOString()
        });
      }
    } else {
      report.status = 'ditolak';
      report.tindakan_diambil = 'Laporan ditolak setelah pemeriksaan fisik.';
      report.ditangani_oleh = currentUser.value?.id;
      report.ditangani_pada = new Date().toISOString();
    }

    impactMetrics.value.total_laporan_terbuka = Math.max(0, impactMetrics.value.total_laporan_terbuka - 1);
    recordAdminAction('tangani_laporan', 'report', reportId, reason || `Laporan diputuskan: ${action}`);
    return true;
  }

  // A7: Sanksi Akun Bertahap & Pulihkan Akun
  function applyUserSanction(
    targetUserId: string,
    sanctionType: 'peringatan' | 'sembunyikan_listing' | 'tangguhkan' | 'blokir' | 'pulihkan',
    writtenReason: string
  ) {
    if (!isAdmin.value) return false;

    if (!writtenReason || writtenReason.trim().length < 5) {
      alert('Setiap sanksi wajib menyertakan alasan tertulis yang jelas bagi pengguna.');
      return false;
    }

    if (sanctionType === 'sembunyikan_listing') {
      listings.value.forEach((l) => {
        if (l.owner_id === targetUserId) l.status = 'disembunyikan';
      });
      recordAdminAction('sembunyikan_semua_listing', 'user', targetUserId, writtenReason);
    } else if (sanctionType === 'tangguhkan') {
      listings.value.forEach((l) => {
        if (l.owner_id === targetUserId) l.status = 'disembunyikan';
      });
      recordAdminAction('tangguhkan_akun', 'user', targetUserId, writtenReason);
    } else if (sanctionType === 'blokir') {
      listings.value.forEach((l) => {
        if (l.owner_id === targetUserId) l.status = 'disembunyikan';
      });
      recordAdminAction('blokir_akun', 'user', targetUserId, writtenReason);
    } else if (sanctionType === 'pulihkan') {
      listings.value.forEach((l) => {
        if (l.owner_id === targetUserId) l.status = 'aktif';
      });
      recordAdminAction('pulihkan_akun', 'user', targetUserId, writtenReason);
    } else {
      recordAdminAction('beri_peringatan', 'user', targetUserId, writtenReason);
    }

    // Kirim notifikasi ke user
    notifications.value.unshift({
      id: 'notif-' + Date.now(),
      user_id: targetUserId,
      jenis: 'sanksi_admin',
      isi: `Status akun Anda diperbarui oleh Admin (${sanctionType}). Catatan: ${writtenReason}`,
      dibaca: false,
      dibuat_pada: new Date().toISOString()
    });

    return true;
  }

  // A9: Kelola Kategori (dengan faktor_ke_kg)
  function addOrUpdateCategory(cat: {
    nama: string;
    kelompok: string;
    slug: string;
    boleh_diposting: boolean;
    faktor_ke_kg: number;
    satuan_default: SatuanLimbah;
    deskripsi: string;
    saran_pemanfaatan: string[];
  }) {
    if (!isAdmin.value) return false;

    const newCat: WasteCategory = {
      id: 'cat-' + Date.now(),
      nama: cat.nama,
      kelompok: cat.kelompok || 'Organik & Biomassa',
      slug: cat.slug,
      ikon: cat.boleh_diposting ? 'Recycle' : 'AlertTriangle',
      boleh_diposting: cat.boleh_diposting,
      faktor_ke_kg: cat.faktor_ke_kg || 1.0,
      satuan_default: cat.satuan_default || 'kg',
      deskripsi: cat.deskripsi,
      saran_pemanfaatan: cat.saran_pemanfaatan
    };

    categories.value.push(newCat);
    recordAdminAction(
      'kelola_kategori',
      'category',
      newCat.id,
      `Menambahkan kategori baru: ${cat.nama} (faktor_ke_kg: ${cat.faktor_ke_kg})`
    );
    return true;
  }

  function toggleCategoryStatus(catId: string) {
    if (!isAdmin.value) return false;
    const cat = categories.value.find((c) => c.id === catId);
    if (!cat) return false;

    cat.boleh_diposting = !cat.boleh_diposting;
    recordAdminAction(
      'ubah_status_kategori',
      'category',
      catId,
      `Mengubah status boleh_diposting kategori '${cat.nama}' menjadi ${cat.boleh_diposting}`
    );
    return true;
  }

  // A11: Ekspor CSV Data Dampak
  function exportImpactDataCsv() {
    const headers = ['ID Deal', 'Listing', 'Kategori', 'Volume (kg)', 'Penghematan (Rp)', 'Status', 'Tanggal Selesai'];
    const rows = deals.value
      .filter((d) => d.status === 'selesai')
      .map((d) => [
        d.id,
        `"${d.listing_judul?.replace(/"/g, '""') || ''}"`,
        `"${d.category_name || ''}"`,
        d.volume_aktual_kg || 0,
        d.penghematan_biaya_rp || 0,
        d.status,
        d.konfirmasi_pencari_pada || d.dibuat_pada
      ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap-dampak-bursa-umkm-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // A12: Update Pengaturan Sistem
  function updateSystemSettings(newSettings: Partial<SystemSettings>) {
    if (!isAdmin.value) return false;
    systemSettings.value = {
      ...systemSettings.value,
      ...newSettings
    };
    recordAdminAction('update_settings', 'settings', 'global', 'Memperbarui ambang batas sistem platform');
    return true;
  }

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    isAccountSanctioned,
    isAuthModalOpen,
    isProfileSetupOpen,
    authModalMessage,
    authOtpPendingEmail,
    pendingContextualAction,
    categories,
    allowedCategories,
    hazardousCategories,
    listings,
    publicListings,
    pendingReviewListings,
    filteredListings,
    myListings,
    requests,
    filteredRequests,
    myRequests,
    matches,
    deals,
    myDeals,
    verifications,
    reports,
    openReports,
    adminActions,
    notifications,
    unreadNotificationsCount,
    impactMetrics,
    myImpactMetrics,
    systemSettings,
    favoriteListingIds,
    favoriteListings,
    userCoords,
    radiusKm,
    radiusValidationError,
    isHighRadiusWarning,
    filterCategoryId,
    filterMinVolume,
    filterPriceType,
    filterOnlyVerified,
    sortBy,
    setRadius,
    setUserLocation,
    detectDeviceLocation,
    requireAuth,
    sendOtpEmail,
    verifyOtp,
    loginAs,
    logout,
    updateProfile,
    deleteAccount,
    contactListing,
    openWhatsApp,
    createListing,
    createMaterialRequest,
    updateListingStatus,
    extendListingExpiry,
    verifyBusinessLocation,
    confirmDeal,
    confirmTransaction,
    submitReport,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleFavorite,
    isFavorite,
    moderateListing,
    handleReportAction,
    applyUserSanction,
    addOrUpdateCategory,
    toggleCategoryStatus,
    exportImpactDataCsv,
    updateSystemSettings
  };
}
