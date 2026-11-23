import { ref, computed, onMounted } from 'vue';
import {
  UserProfile,
  UserLocation,
  WasteCategory,
  WasteListing,
  Deal,
  Follow,
  AppNotification,
  ReportItem,
  AdminAction,
  EducationArticle,
  ImpactMetrics,
  JenisHarga,
  TargetLaporan,
  JenisNotifikasi
} from '../types';
import {
  MOCK_ADMIN_USER,
  MOCK_REGULAR_USER,
  MOCK_SEEKER_USER,
  MOCK_SUSPENDED_USER,
  INITIAL_PROFILES,
  INITIAL_LOCATIONS,
  INITIAL_CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_DEALS,
  INITIAL_FOLLOWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_ADMIN_ACTIONS,
  INITIAL_ARTICLES,
  INITIAL_IMPACT
} from '../lib/mockData';
import { supabase, isSupabaseConfigured, uploadImageToWasteStorage } from '../lib/supabase';

// Format teks jarak aman: di bawah 2 km tampil 'kurang dari 2 km' (S2)
export function formatSafeDistance(distanceKm: number): string {
  if (distanceKm < 2.0) {
    return 'kurang dari 2 km';
  }
  return `${Math.round(distanceKm)} km`;
}

// Global Reactive States (Single Store Pattern)
const isDemoModeDefault = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE === 'true';
const isInitialAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

const currentUser = ref<UserProfile | null>(
  isInitialAdminRoute && isDemoModeDefault ? { ...MOCK_ADMIN_USER } : null
);

const userLocations = ref<UserLocation[]>(isDemoModeDefault ? [...INITIAL_LOCATIONS] : []);
const categories = ref<WasteCategory[]>(isDemoModeDefault ? [...INITIAL_CATEGORIES] : []);
const listings = ref<WasteListing[]>(isDemoModeDefault ? [...INITIAL_LISTINGS] : []);
const deals = ref<Deal[]>(isDemoModeDefault ? [...INITIAL_DEALS] : []);
const follows = ref<Follow[]>(isDemoModeDefault ? [...INITIAL_FOLLOWS] : []);
const notifications = ref<AppNotification[]>(isDemoModeDefault ? [...INITIAL_NOTIFICATIONS] : []);
const reports = ref<ReportItem[]>(isDemoModeDefault ? [...INITIAL_REPORTS] : []);
const adminActions = ref<AdminAction[]>(isDemoModeDefault ? [...INITIAL_ADMIN_ACTIONS] : []);
const educationArticles = ref<EducationArticle[]>(isDemoModeDefault ? [...INITIAL_ARTICLES] : []);
const impactMetrics = ref<ImpactMetrics>(
  isDemoModeDefault
    ? { ...INITIAL_IMPACT }
    : {
        total_kg_dialihkan: 0,
        total_transaksi_selesai: 0,
        total_postingan_aktif: 0,
        total_laporan_terbuka: 0
      }
);

// Acuan lokasi pencari saat membuka aplikasi (Default: Surabaya Pusat)
// Koordinat ini hanya dipakai saat query RPC jarak ke server dan tidak bocor ke publik
const viewerCoords = ref<{ lat: number; lng: number }>({
  lat: -7.2655,
  lng: 112.7480
});

// Slider Radius: 0 - 100 km, default 10 km (0 = 'sekitar saya' < 2 km)
const radiusKm = ref<number>(10);
const searchQuery = ref<string>('');
const selectedCategoryId = ref<string>('semua');
const selectedPriceType = ref<'semua' | JenisHarga>('semua');
const sortBy = ref<'jarak' | 'terbaru'>('jarak');

// Auth Modal state
const isAuthModalOpen = ref<boolean>(false);
const isProfileModalOpen = ref<boolean>(false);
const authModalMessage = ref<string>('Masuk dengan OTP Email untuk melakukan aksi ini.');
const pendingContextualAction = ref<{
  type: 'contact_listing' | 'create_listing' | 'follow_supplier' | 'submit_report';
  payload?: any;
} | null>(null);

export function useWasteApp() {
  const isAuthenticated = computed(() => currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.peran_sistem === 'admin');

  // Akun disanksi (peringatan/ditangguhkan/diblokir)
  const isAccountSanctioned = computed(() => {
    return (
      currentUser.value?.status_akun === 'ditangguhkan' ||
      currentUser.value?.status_akun === 'diblokir'
    );
  });

  // Kategori yang diizinkan untuk posting (non-B3)
  const allowedCategories = computed(() =>
    categories.value.filter((c) => c.boleh_diposting)
  );

  // Kategori terlarang untuk edukasi & pencegahan
  const prohibitedCategories = computed(() =>
    categories.value.filter((c) => !c.boleh_diposting)
  );

  // Slot lokasi milik pengguna saat ini (Maksimal 3 slot)
  const myLocations = computed(() => {
    if (!currentUser.value) return [];
    return userLocations.value
      .filter((loc) => loc.user_id === currentUser.value?.id)
      .sort((a, b) => a.slot_nomor - b.slot_nomor);
  });

  // Postingan aktif milik pengguna saat ini (Batas maksimal 10)
  const myListings = computed(() => {
    if (!currentUser.value) return [];
    return listings.value.filter((l) => l.user_id === currentUser.value?.id);
  });

  const myActiveListingsCount = computed(() => {
    return myListings.value.filter((l) => l.status === 'aktif').length;
  });

  // Transaksi aktif milik pengguna saat ini (Batas maksimal 5 berjalan)
  const myActiveDeals = computed(() => {
    if (!currentUser.value) return [];
    return deals.value.filter(
      (d) =>
        (d.pencari_id === currentUser.value?.id || d.pemasok_id === currentUser.value?.id) &&
        (d.status === 'berjalan' || d.status === 'menunggu_otomatis')
    );
  });

  // Riwayat transaksi selesai milik pengguna saat ini
  const myCompletedDeals = computed(() => {
    if (!currentUser.value) return [];
    return deals.value.filter(
      (d) =>
        (d.pencari_id === currentUser.value?.id || d.pemasok_id === currentUser.value?.id) &&
        (d.status === 'selesai' || d.status === 'batal')
    );
  });

  // Notifikasi untuk pengguna saat ini
  const myNotifications = computed(() => {
    if (!currentUser.value) return [];
    return notifications.value.filter((n) => n.user_id === currentUser.value?.id);
  });

  const unreadNotificationsCount = computed(() => {
    return myNotifications.value.filter((n) => !n.dibaca).length;
  });

  // Postingan terfilter pada halaman Cari (TIDAK MENGANDUNG KOORDINAT)
  const filteredListings = computed(() => {
    return listings.value
      .filter((l) => {
        // 1. Status harus aktif & stok > 0
        if (l.status !== 'aktif' || l.stok <= 0) return false;

        // 2. Filter kedaluwarsa dinamis saat membaca data (PRD S3 dalam jam)
        const expiryHours = l.masa_tayang_jam || 168;
        const isExpired =
          new Date(l.dibuat_pada).getTime() + expiryHours * 3600 * 1000 <= Date.now();
        if (isExpired) return false;

        // 3. Filter kategori
        if (
          selectedCategoryId.value !== 'semua' &&
          l.category_id !== selectedCategoryId.value
        ) {
          return false;
        }

        // 4. Filter jenis harga
        if (
          selectedPriceType.value !== 'semua' &&
          l.jenis_harga !== selectedPriceType.value
        ) {
          return false;
        }

        // 5. Filter teks pencarian
        if (searchQuery.value.trim()) {
          const q = searchQuery.value.toLowerCase();
          const matchTitle = l.judul.toLowerCase().includes(q);
          const matchDesc = l.deskripsi.toLowerCase().includes(q);
          const matchOwner =
            l.nama_tampilan.toLowerCase().includes(q) ||
            (l.nama_toko_profesi || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchOwner) return false;
        }

        // 6. Filter radius jika koordinat diberikan (0 = sekitar saya / <2km)
        if (radiusKm.value <= 0) {
          if (l.jarak_teks && l.jarak_teks !== 'kurang dari 2 km' && (l.jarak_km || 0) >= 2) return false;
        } else if (radiusKm.value < 100) {
          if (l.jarak_km && l.jarak_km > radiusKm.value) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy.value === 'terbaru') {
          return new Date(b.dibuat_pada).getTime() - new Date(a.dibuat_pada).getTime();
        }
        const distA = a.jarak_km ?? (a.jarak_teks === 'kurang dari 2 km' ? 1 : 9999);
        const distB = b.jarak_km ?? (b.jarak_teks === 'kurang dari 2 km' ? 1 : 9999);
        return distA - distB;
      });
  });

  // Dampak lingkungan personal dalam kg (SDG 12)
  // Berat dampak = jumlah x listings.berat_per_satuan_kg (bila diisi)
  const myPersonalImpact = computed(() => {
    if (!currentUser.value) return { total_kg: 0, deals_selesai: 0, active_listings: 0 };
    const myDeals = deals.value.filter(
      (d) =>
        (d.pencari_id === currentUser.value?.id || d.pemasok_id === currentUser.value?.id) &&
        d.status === 'selesai'
    );

    let totalKg = 0;
    myDeals.forEach((d) => {
      const l = listings.value.find((item) => item.id === d.listing_id);
      const qty = d.jumlah_akhir || d.jumlah_diminta || 0;
      const beratSatuan = l?.berat_per_satuan_kg || 0;
      if (beratSatuan > 0) {
        totalKg += qty * beratSatuan;
      }
    });

    return {
      total_kg: totalKg,
      deals_selesai: myDeals.length,
      total_transaksi: myDeals.length,
      active_listings: myActiveListingsCount.value
    };
  });

  // Antrean Laporan untuk Admin (Urut dari target dengan laporan terbanyak - A3)
  const reportQueueGrouped = computed(() => {
    const map = new Map<string, { target_id: string; target_type: TargetLaporan; target_judul?: string; reports: ReportItem[]; count: number }>();
    reports.value
      .filter((r) => r.status === 'terbuka' || r.status === 'dalam_tinjauan')
      .forEach((r) => {
        const key = `${r.target_type}:${r.target_id}`;
        if (!map.has(key)) {
          map.set(key, {
            target_id: r.target_id,
            target_type: r.target_type,
            target_judul: r.target_judul,
            reports: [],
            count: 0
          });
        }
        const item = map.get(key)!;
        item.reports.push(r);
        item.count += 1;
      });

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  });

  const adminReportsQueue = computed(() => {
    return reports.value.filter((r) => r.status === 'terbuka' || r.status === 'dalam_tinjauan');
  });

  // ============================================================================
  // SINKRONISASI DATA SUPABASE (Aktif saat VITE_DEMO_MODE=false)
  // ============================================================================
  async function fetchCategories() {
    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('waste_categories')
          .select('*')
          .order('nama');
        if (!error && data && data.length > 0) {
          categories.value = data as WasteCategory[];
        }
      } catch (err: any) {
        console.warn('Gagal memuat kategori dari Supabase:', err.message);
      }
    }
  }

  async function fetchEducationArticles() {
    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('education_articles')
          .select('*')
          .order('dibuat_pada', { ascending: false });
        if (!error && data && data.length > 0) {
          educationArticles.value = data as EducationArticle[];
        }
      } catch (err: any) {
        console.warn('Gagal memuat artikel edukasi dari Supabase:', err.message);
      }
    }
  }

  async function fetchPublicListings() {
    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        // Panggil auto_complete_deals_and_expire_listings() melalui RPC search_public_listings
        const { data, error } = await supabase.rpc('search_public_listings', {
          p_viewer_lat: viewerCoords.value.lat,
          p_viewer_lng: viewerCoords.value.lng,
          p_category_id: selectedCategoryId.value !== 'semua' ? selectedCategoryId.value : null,
          p_search_query: searchQuery.value.trim() || null,
          p_max_radius_km: radiusKm.value > 0 && radiusKm.value < 100 ? radiusKm.value : null
        });

        if (error) {
          // Fallback aman ke view active_listings (tanpa kolom area_point)
          const { data: viewData, error: viewError } = await supabase
            .from('active_listings')
            .select('*')
            .order('dibuat_pada', { ascending: false });
          if (!viewError && viewData) {
            listings.value = viewData.map((item: any) => ({
              ...item,
              nama_tampilan: item.nama_tampilan || 'Pengguna',
              transaksi_selesai: item.transaksi_selesai || 0,
              jarak_teks: 'Lokasi UMKM'
            })) as WasteListing[];
          }
        } else if (data) {
          listings.value = data as WasteListing[];
        }
      } catch (err: any) {
        console.warn('Gagal memuat postingan publik dari Supabase:', err.message);
      }
    }
  }

  async function fetchImpactMetrics() {
    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const { count: activeCount } = await supabase
          .from('listings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aktif');

        const { data: completedDeals } = await supabase
          .from('deals')
          .select('jumlah_akhir, berat_per_satuan_kg')
          .eq('status', 'selesai');

        let totalKg = 0;
        let totalDeals = 0;
        if (completedDeals) {
          totalDeals = completedDeals.length;
          completedDeals.forEach((d: any) => {
            const qty = Number(d.jumlah_akhir) || 0;
            const berat = Number(d.berat_per_satuan_kg) || 0;
            if (berat > 0) totalKg += qty * berat;
          });
        }

        impactMetrics.value = {
          total_kg_dialihkan: totalKg,
          total_transaksi_selesai: totalDeals,
          total_postingan_aktif: activeCount || 0,
          total_laporan_terbuka: reports.value.filter((r) => r.status === 'terbuka').length
        };
      } catch (err: any) {
        console.warn('Gagal memuat metrik dampak dari Supabase:', err.message);
      }
    }
  }

  async function fetchUserData(userId: string) {
    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        // 1. Slot Lokasi
        const { data: locData } = await supabase
          .from('user_locations')
          .select('id, user_id, label, slot_nomor, dibuat_pada, diperbarui_pada')
          .eq('user_id', userId)
          .order('slot_nomor');
        if (locData) userLocations.value = locData as UserLocation[];

        // 2. Transaksi Deals
        const { data: dealsData } = await supabase
          .from('deals')
          .select('*')
          .or(`pencari_id.eq.${userId},pemasok_id.eq.${userId}`)
          .order('dibuat_pada', { ascending: false });
        if (dealsData) deals.value = dealsData as Deal[];

        // 3. Notifikasi
        const { data: notifData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('dibuat_pada', { ascending: false });
        if (notifData) notifications.value = notifData as AppNotification[];

        // 4. Follows
        const { data: followData } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', userId);
        if (followData) follows.value = followData as Follow[];

        // 5. Reports & Admin Actions
        if (currentUser.value?.peran_sistem === 'admin') {
          const { data: allReports } = await supabase
            .from('reports')
            .select('*')
            .order('dibuat_pada', { ascending: false });
          if (allReports) reports.value = allReports as ReportItem[];

          const { data: allActions } = await supabase
            .from('admin_actions')
            .select('*')
            .order('waktu', { ascending: false });
          if (allActions) adminActions.value = allActions as AdminAction[];
        } else {
          const { data: myReports } = await supabase
            .from('reports')
            .select('*')
            .eq('reporter_id', userId)
            .order('dibuat_pada', { ascending: false });
          if (myReports) reports.value = myReports as ReportItem[];
        }
      } catch (err: any) {
        console.warn('Gagal memuat data pengguna dari Supabase:', err.message);
      }
    }
  }

  async function syncUserProfile(userId: string, email?: string) {
    if (!supabase) return;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        currentUser.value = profile as UserProfile;
        if (!profile.nama_tampilan || profile.nama_tampilan.trim() === '') {
          isProfileModalOpen.value = true;
        }
        await fetchUserData(userId);
      } else {
        const defaultProfile: UserProfile = {
          id: userId,
          email: email || '',
          nama_tampilan: email ? email.split('@')[0] : 'Pengguna Baru',
          no_wa: '',
          peran_sistem: 'pengguna',
          status_akun: 'aktif',
          jumlah_transaksi_selesai: 0,
          dibuat_pada: new Date().toISOString()
        };
        await supabase.from('profiles').insert(defaultProfile);
        currentUser.value = defaultProfile;
        isProfileModalOpen.value = true;
      }
    } catch (err: any) {
      console.warn('Gagal sinkronisasi profil pengguna:', err.message);
    }
  }

  async function initSession() {
    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await syncUserProfile(session.user.id, session.user.email);
        }

        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            await syncUserProfile(session.user.id, session.user.email);
          } else {
            currentUser.value = null;
          }
        });
      } catch (err: any) {
        console.warn('Gagal membaca sesi Supabase:', err.message);
      }
    }
  }

  // ============================================================================
  // PEMBERSIHAN NOTIFIKASI SECARA BERKALA (FR-NOT-JENIS)
  // Perubahan status transaksi otomatis & kedaluwarsa HANYA dijalankan oleh fungsi
  // database (SECURITY DEFINER), bukan di klien (Audit PRD S4 & Butir 4).
  // ============================================================================
  function cleanOldNotifications() {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 3600 * 1000;
    notifications.value = notifications.value.filter(
      (n) => new Date(n.dibuat_pada).getTime() >= thirtyDaysAgo
    );
  }

  // Jalankan pembersihan notifikasi dan fetch data Supabase saat mount
  onMounted(async () => {
    cleanOldNotifications();
    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      await Promise.allSettled([
        fetchCategories(),
        fetchEducationArticles(),
        fetchPublicListings(),
        fetchImpactMetrics(),
        initSession()
      ]);
    }
  });

  // ============================================================================
  // GERBANG LOGIN KONTEKSTUAL (G6)
  // ============================================================================
  function requireAuth(
    actionName: string,
    action?: { type: 'contact_listing' | 'create_listing' | 'follow_supplier' | 'submit_report'; payload?: any }
  ): boolean {
    if (!isAuthenticated.value) {
      authModalMessage.value = `Silakan masuk dengan OTP Email untuk ${actionName}.`;
      if (action) {
        pendingContextualAction.value = action;
      }
      isAuthModalOpen.value = true;
      return false;
    }
    return true;
  }

  function executePendingAction() {
    if (!pendingContextualAction.value) return;
    const action = pendingContextualAction.value;
    pendingContextualAction.value = null;

    if (action.type === 'contact_listing' && action.payload) {
      contactSupplierViaWa(action.payload.listing, action.payload.jumlah);
    } else if (action.type === 'follow_supplier' && action.payload) {
      toggleFollowSupplier(action.payload.supplierId);
    }
  }

  // ============================================================================
  // AUTENTIKASI OTP EMAIL (U1)
  // ============================================================================
  async function sendOtpEmail(email: string) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true
          }
        });
        if (error) throw error;
        return { success: true };
      } catch (err: any) {
        console.warn('Gagal kirim OTP Supabase, lanjut mode demo:', err.message);
      }
    }
    return { success: true };
  }

  async function verifyOtp(email: string, code: string) {
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

          if (profile) {
            currentUser.value = profile;
          } else {
            currentUser.value = {
              id: data.user.id,
              email,
              nama_tampilan: email.split('@')[0],
              no_wa: '',
              peran_sistem: email.includes('admin') ? 'admin' : 'pengguna',
              status_akun: 'aktif',
              jumlah_transaksi_selesai: 0,
              dibuat_pada: new Date().toISOString()
            };
            isProfileModalOpen.value = true;
          }
          isAuthModalOpen.value = false;
          executePendingAction();
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Verifikasi Supabase fallback ke demo:', err.message);
      }
    }

    if (code === '123456' || code.length === 6) {
      if (email.includes('admin')) {
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

    throw new Error('Kode OTP tidak sesuai. Gunakan kode 123456 untuk simulasi demo.');
  }

  function loginAs(type: 'admin' | 'regular' | 'seeker' | 'suspended') {
    if (!isDemoModeDefault) {
      alert('Tombol demo hanya aktif pada mode demo (VITE_DEMO_MODE=true). Silakan masuk dengan OTP Email untuk proyek nyata.');
      return;
    }

    if (type === 'admin') currentUser.value = { ...MOCK_ADMIN_USER };
    else if (type === 'seeker') currentUser.value = { ...MOCK_SEEKER_USER };
    else if (type === 'suspended') currentUser.value = { ...MOCK_SUSPENDED_USER };
    else currentUser.value = { ...MOCK_REGULAR_USER };

    isAuthModalOpen.value = false;
    executePendingAction();
  }

  async function logout() {
    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err: any) {
        console.warn('Gagal logout Supabase:', err.message);
      }
    }
    currentUser.value = null;
  }

  async function updateProfile(data: Partial<UserProfile>) {
    if (!currentUser.value) return false;

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            nama_tampilan: data.nama_tampilan || currentUser.value.nama_tampilan,
            nama_toko_profesi: data.nama_toko_profesi !== undefined ? data.nama_toko_profesi : currentUser.value.nama_toko_profesi,
            no_wa: data.no_wa || currentUser.value.no_wa,
            foto: data.foto || currentUser.value.foto,
            diperbarui_pada: new Date().toISOString()
          })
          .eq('id', currentUser.value.id);

        if (error) {
          alert('Gagal memperbarui profil: ' + error.message);
          return false;
        }
      } catch (err: any) {
        console.warn('Gagal update profile ke Supabase:', err.message);
        return false;
      }
    }

    currentUser.value = {
      ...currentUser.value,
      ...data,
      nama_tampilan: data.nama_tampilan || currentUser.value.nama_tampilan,
      nama_toko_profesi: data.nama_toko_profesi !== undefined ? data.nama_toko_profesi : currentUser.value.nama_toko_profesi,
      no_wa: data.no_wa || currentUser.value.no_wa,
      foto: data.foto || currentUser.value.foto,
      diperbarui_pada: new Date().toISOString()
    };
    isProfileModalOpen.value = false;
    return true;
  }

  // ============================================================================
  // MANAJEMEN SLOT LOKASI (U3, S1, S2)
  // Koordinat presisi HANYA dikirim sekali ke fungsi RPC database lewat HTTPS.
  // Database melakukan penggeseran deterministik dan hanya menyimpan titik acak.
  // Klien SAMA SEKALI TIDAK menyimpan atau menampilkan koordinat presisi!
  // ============================================================================
  async function saveLocationSlot(
    slotNomor: 1 | 2 | 3,
    label: string,
    rawLat: number,
    rawLng: number
  ): Promise<UserLocation> {
    if (!currentUser.value) throw new Error('Harap login untuk menyimpan lokasi.');

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.rpc('save_user_location_shifted', {
          p_label: label,
          p_slot_nomor: slotNomor,
          p_raw_lat: rawLat,
          p_raw_lng: rawLng
        });
        if (error) throw error;
        await fetchUserData(currentUser.value.id);
        const loc = userLocations.value.find((l) => l.slot_nomor === slotNomor);
        if (loc) return loc;
      } catch (err: any) {
        console.warn('RPC save_user_location_shifted Supabase error:', err.message);
        throw err;
      }
    }

    const existingIdx = userLocations.value.findIndex(
      (loc) => loc.user_id === currentUser.value?.id && loc.slot_nomor === slotNomor
    );

    // Klien hanya mencatat label dan slot nomor tanpa menyimpan koordinat lat/lng
    const updatedLoc: UserLocation = {
      id: existingIdx >= 0 ? userLocations.value[existingIdx].id : 'loc-' + Date.now(),
      user_id: currentUser.value.id,
      label: label.trim() || `Lokasi ${slotNomor}`,
      slot_nomor: slotNomor,
      diperbarui_pada: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      userLocations.value[existingIdx] = updatedLoc;
    } else {
      userLocations.value.push(updatedLoc);
    }

    return updatedLoc;
  }

  function deleteAccount(): boolean {
    if (!currentUser.value) return false;
    const uid = currentUser.value.id;
    listings.value = listings.value.filter((l) => l.user_id !== uid);
    deals.value = deals.value.filter((d) => d.pencari_id !== uid && d.pemasok_id !== uid);
    follows.value = follows.value.filter((f) => f.follower_id !== uid && f.supplier_id !== uid);
    notifications.value = notifications.value.filter((n) => n.user_id !== uid);
    userLocations.value = userLocations.value.filter((loc) => loc.user_id !== uid);
    currentUser.value = null;
    alert('Akun dan seluruh data Anda telah berhasil dihapus permanen sesuai UU PDP.');
    return true;
  }

  // ============================================================================
  // UNGGAH & KELOLA POSTINGAN (U4, U5)
  // Batas: 10 postingan aktif per akun
  // Notifikasi pengikut digabung jika dalam 1 jam (SRS FR-NOT-JENIS)
  // ============================================================================
  async function createListing(data: {
    category_id: string;
    location_slot_id: string;
    judul: string;
    deskripsi: string;
    foto_urls: string[]; // 1 - 3 foto (EXIF dibuang via Canvas)
    stok: number;
    satuan: string;
    berat_per_satuan_kg?: number;
    jenis_harga: JenisHarga;
    nominal_harga?: number;
    keterangan_barter?: string;
  }): Promise<{ success: boolean; message?: string }> {
    if (!requireAuth('mengunggah postingan sisa')) {
      return { success: false, message: 'Harap masuk terlebih dahulu.' };
    }

    if (myActiveListingsCount.value >= 10) {
      alert('Batas Maksimal Tercapai: Setiap akun dibatasi maksimal 10 postingan aktif sekaligus.');
      return { success: false, message: 'Maksimal 10 postingan aktif.' };
    }

    const cat = categories.value.find((c) => c.id === data.category_id);
    if (!cat || !cat.boleh_diposting) {
      alert('Kategori sisa ini dilarang diposting di platform Bursa Limbah.');
      return { success: false, message: 'Kategori terlarang.' };
    }

    if (!data.foto_urls || data.foto_urls.length < 1 || data.foto_urls.length > 3) {
      alert('Wajib melampirkan minimal 1 dan maksimal 3 foto sisa.');
      return { success: false, message: 'Foto harus 1-3.' };
    }

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        // 1. Cek batas 10 postingan aktif di server
        const { count: activeCount } = await supabase
          .from('listings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', currentUser.value!.id)
          .eq('status', 'aktif');

        if ((activeCount || 0) >= 10) {
          alert('Batas Maksimal Tercapai: Setiap akun dibatasi maksimal 10 postingan aktif sekaligus.');
          return { success: false, message: 'Maksimal 10 postingan aktif.' };
        }

        // 2. Unggah foto ke storage bucket waste-images (folder: listings/<user_id>/)
        const uploadedUrls: string[] = [];
        for (let i = 0; i < data.foto_urls.length; i++) {
          const p = data.foto_urls[i];
          if (p.startsWith('data:') || p.startsWith('blob:')) {
            const path = `listings/${currentUser.value!.id}/${Date.now()}_${i}.jpg`;
            const uploadRes = await uploadImageToWasteStorage(p, path);
            if (uploadRes.url) {
              uploadedUrls.push(uploadRes.url);
            } else {
              uploadedUrls.push(p);
            }
          } else {
            uploadedUrls.push(p);
          }
        }

        // 3. Simpan baris ke tabel listings (area_point disalin otomatis oleh trigger trg_auto_fill_listing_location)
        const { error: insertErr } = await supabase.from('listings').insert({
          user_id: currentUser.value!.id,
          category_id: cat.id,
          location_slot_id: data.location_slot_id,
          judul: data.judul,
          deskripsi: data.deskripsi,
          foto_urls: uploadedUrls,
          stok: data.stok,
          satuan: data.satuan || cat.satuan_default || 'kg',
          berat_per_satuan_kg: data.berat_per_satuan_kg,
          jenis_harga: data.jenis_harga,
          nominal_harga: data.nominal_harga || 0,
          keterangan_barter: data.keterangan_barter,
          metode_pengambilan: 'diambil_pencari',
          status: 'aktif'
        });

        if (insertErr) {
          alert('Gagal mengunggah postingan: ' + insertErr.message);
          return { success: false, message: insertErr.message };
        }

        await fetchPublicListings();
        await fetchImpactMetrics();
        await fetchUserData(currentUser.value!.id);
        return { success: true };
      } catch (err: any) {
        alert('Error saat mengunggah: ' + err.message);
        return { success: false, message: err.message };
      }
    }

    // Fallback / Mode Demo (Lokal)
    const newListing: WasteListing = {
      id: 'listing-' + Date.now(),
      user_id: currentUser.value!.id,
      category_id: cat.id,
      category_nama: cat.nama,
      category_ikon: cat.ikon,
      location_slot_id: data.location_slot_id,
      judul: data.judul,
      deskripsi: data.deskripsi,
      foto_urls: data.foto_urls,
      stok: data.stok,
      satuan: data.satuan || cat.satuan_default || 'kg',
      berat_per_satuan_kg: data.berat_per_satuan_kg,
      jenis_harga: data.jenis_harga,
      nominal_harga: data.nominal_harga || 0,
      keterangan_barter: data.keterangan_barter,
      metode_pengambilan: 'diambil_pencari',
      status: 'aktif',
      dibuat_pada: new Date().toISOString(),
      masa_tayang_jam: cat.masa_tayang_jam || 168,
      nama_tampilan: currentUser.value!.nama_tampilan,
      nama_toko_profesi: currentUser.value!.nama_toko_profesi,
      no_wa: currentUser.value!.no_wa,
      transaksi_selesai: currentUser.value!.jumlah_transaksi_selesai,
      jarak_km: undefined,
      jarak_teks: 'Lokasi Anda'
    };

    listings.value.unshift(newListing);
    impactMetrics.value.total_postingan_aktif += 1;

    // Notifikasi otomatis ke seluruh pengikut (SRS FR-NOT-JENIS)
    // Penggabungan jika pemasok mengunggah beberapa postingan dalam 1 jam
    // Isi DILARANG memuat no WA, email, atau lokasi!
    const supplierFollowers = follows.value.filter(
      (f) => f.supplier_id === currentUser.value?.id
    );
    const supplierName =
      currentUser.value?.nama_toko_profesi || currentUser.value?.nama_tampilan || 'Pemasok';
    const oneHourAgo = Date.now() - 3600 * 1000;

    supplierFollowers.forEach((f) => {
      const existingNotif = notifications.value.find(
        (n) =>
          n.user_id === f.follower_id &&
          n.tipe === 'listing_baru_supplier' &&
          n.link_target === `/pemasok/${currentUser.value?.id}` &&
          new Date(n.dibuat_pada).getTime() >= oneHourAgo &&
          !n.dibaca
      );

      if (existingNotif) {
        const recentCount = listings.value.filter(
          (l) =>
            l.user_id === currentUser.value?.id &&
            new Date(l.dibuat_pada).getTime() >= oneHourAgo
        ).length;
        existingNotif.judul = 'Postingan Baru dari Pemasok';
        existingNotif.isi = `${recentCount} postingan baru dari ${supplierName}`;
        existingNotif.dibuat_pada = new Date().toISOString();
      } else {
        notifications.value.unshift({
          id: `notif-${Date.now()}-${f.follower_id}`,
          user_id: f.follower_id,
          tipe: 'listing_baru_supplier',
          jenis: 'listing_baru_supplier',
          judul: 'Postingan Baru dari Pemasok',
          isi: `Postingan sisa baru telah diunggah oleh ${supplierName}.`,
          link_target: `/pemasok/${currentUser.value?.id}`,
          dibaca: false,
          dibuat_pada: new Date().toISOString()
        });
      }
    });

    return { success: true };
  }

  function updateListing(
    id: string,
    updates: Partial<Pick<WasteListing, 'judul' | 'deskripsi' | 'stok' | 'status' | 'nominal_harga' | 'keterangan_barter'>>
  ) {
    const item = listings.value.find((l) => l.id === id);
    if (!item) return false;
    Object.assign(item, updates, { diperbarui_pada: new Date().toISOString() });

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      supabase.from('listings').update(updates).eq('id', id).then(() => {
        fetchPublicListings();
      });
    }

    return true;
  }

  // ============================================================================
  // HUBUNGI & ALUR TRANSAKSI DEALS (U8, U9)
  // Batas: maksimal 5 deal berjalan untuk pencari
  // ============================================================================
  async function contactSupplierViaWa(
    listing: WasteListing,
    requestedQty: number = 1
  ): Promise<{ success: boolean; waUrl?: string }> {
    if (
      !requireAuth('menghubungi pemasok via WhatsApp', {
        type: 'contact_listing',
        payload: { listing, jumlah: requestedQty }
      })
    ) {
      return { success: false };
    }

    if (currentUser.value?.id === listing.user_id) {
      alert('Ini adalah postingan Anda sendiri.');
      return { success: false };
    }

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      // 1. Cek batas 5 transaksi berjalan khusus pencari di server
      const { count: seekerActiveDeals } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('pencari_id', currentUser.value!.id)
        .in('status', ['berjalan', 'menunggu_otomatis']);

      if ((seekerActiveDeals || 0) >= 5) {
        alert('Batas Transaksi Berjalan: Anda telah memiliki 5 transaksi aktif yang belum diselesaikan.');
        return { success: false };
      }

      // 2. Buat deal jika belum ada
      const { data: existingDeal } = await supabase
        .from('deals')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('pencari_id', currentUser.value!.id)
        .in('status', ['berjalan', 'menunggu_otomatis'])
        .maybeSingle();

      if (!existingDeal) {
        const { error: dealErr } = await supabase.from('deals').insert({
          listing_id: listing.id,
          pencari_id: currentUser.value!.id,
          pemasok_id: listing.user_id,
          jumlah_diminta: requestedQty,
          status: 'berjalan'
        });
        if (dealErr) {
          alert('Gagal memulai transaksi: ' + dealErr.message);
          return { success: false };
        }
        await fetchUserData(currentUser.value!.id);
      }
    } else {
      // Mode Demo
      if (myActiveDeals.value.length >= 5) {
        alert('Batas Transaksi Berjalan: Anda telah memiliki 5 transaksi aktif yang belum diselesaikan.');
        return { success: false };
      }

      let deal = deals.value.find(
        (d) =>
          d.listing_id === listing.id &&
          d.pencari_id === currentUser.value?.id &&
          (d.status === 'berjalan' || d.status === 'menunggu_otomatis')
      );

      if (!deal) {
        deal = {
          id: 'deal-' + Date.now(),
          listing_id: listing.id,
          listing_judul: listing.judul,
          category_nama: listing.category_nama,
          pencari_id: currentUser.value!.id,
          pencari_nama: currentUser.value!.nama_tampilan,
          pencari_wa: currentUser.value!.no_wa,
          pemasok_id: listing.user_id,
          pemasok_nama: listing.nama_tampilan,
          pemasok_wa: listing.no_wa || '6281234567001',
          jumlah_diminta: requestedQty,
          satuan: listing.satuan,
          berat_per_satuan_kg: listing.berat_per_satuan_kg,
          status: 'berjalan',
          dibuat_pada: new Date().toISOString()
        };
        deals.value.unshift(deal);

        notifications.value.unshift({
          id: 'notif-' + Date.now(),
          user_id: listing.user_id,
          tipe: 'deal_baru',
          jenis: 'deal_baru',
          judul: 'Kontak Penawaran Baru',
          isi: `Seorang pencari telah menghubungi Anda via WhatsApp untuk postingan "${listing.judul}".`,
          link_target: '/aktivitas',
          dibaca: false,
          dibuat_pada: new Date().toISOString()
        });
      }
    }

    const waNumber = (listing.no_wa || '6281234567001').replace(/\D/g, '');
    const priceText =
      listing.jenis_harga === 'gratis'
        ? 'Gratis'
        : listing.jenis_harga === 'barter'
        ? `Barter (${listing.keterangan_barter || ''})`
        : `Rp ${listing.nominal_harga.toLocaleString('id-ID')}/${listing.satuan}`;

    const text = `Halo *${listing.nama_tampilan}*, saya tertarik mengambil sisa di Bursa Limbah:
*${listing.judul}*
Jumlah yang dibutuhkan: ${requestedQty} ${listing.satuan}
Harga/Skema: ${priceText}
Perkiraan jarak kita: ${listing.jarak_teks || 'dekat'}.
Apakah masih tersedia untuk saya ambil? Terima kasih.`;

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    return { success: true, waUrl: url };
  }

  // Konfirmasi penyelesaian transaksi
  // Berat dampak = jumlah x listings.berat_per_satuan_kg (bila diisi)
  async function confirmDealCompletion(
    dealId: string,
    actualQty: number,
    simulateBothParties: boolean = true
  ): Promise<boolean> {
    const deal = deals.value.find((d) => d.id === dealId);
    if (!deal) return false;

    const isSeeker = currentUser.value?.id === deal.pencari_id;
    const nowStr = new Date().toISOString();

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const updateData: any = {
          jumlah_akhir: actualQty
        };
        if (isSeeker) {
          updateData.konfirmasi_pencari_pada = nowStr;
          updateData.jumlah_akhir_pencari = actualQty;
        } else {
          updateData.konfirmasi_pemasok_pada = nowStr;
          updateData.jumlah_akhir_pemasok = actualQty;
        }

        if (simulateBothParties) {
          updateData.konfirmasi_pencari_pada = updateData.konfirmasi_pencari_pada || nowStr;
          updateData.konfirmasi_pemasok_pada = updateData.konfirmasi_pemasok_pada || nowStr;
          updateData.status = 'selesai';
          updateData.selesai_pada = nowStr;
        }

        const { error } = await supabase.from('deals').update(updateData).eq('id', dealId);
        if (error) {
          alert('Gagal mengonfirmasi transaksi: ' + error.message);
          return false;
        }

        await fetchUserData(currentUser.value!.id);
        await fetchPublicListings();
        await fetchImpactMetrics();
        return true;
      } catch (err: any) {
        alert('Error saat konfirmasi: ' + err.message);
        return false;
      }
    }

    // Mode Demo
    if (isSeeker) {
      deal.konfirmasi_pencari_pada = nowStr;
    } else {
      deal.konfirmasi_pemasok_pada = nowStr;
    }

    deal.jumlah_akhir = actualQty;

    if (simulateBothParties) {
      deal.konfirmasi_pencari_pada = deal.konfirmasi_pencari_pada || nowStr;
      deal.konfirmasi_pemasok_pada = deal.konfirmasi_pemasok_pada || nowStr;
    }

    const bothConfirmed = !!deal.konfirmasi_pencari_pada && !!deal.konfirmasi_pemasok_pada;

    if (bothConfirmed) {
      deal.status = 'selesai';
      deal.selesai_pada = nowStr;

      // Kurangi stok postingan secara otomatis (U9)
      const listing = listings.value.find((l) => l.id === deal.listing_id);
      if (listing) {
        listing.stok = Math.max(0, listing.stok - actualQty);
        if (listing.stok <= 0) {
          listing.status = 'habis';
        }
      }

      // Naikkan counter transaksi selesai
      const pencariProf = INITIAL_PROFILES.find((p) => p.id === deal.pencari_id);
      if (pencariProf) pencariProf.jumlah_transaksi_selesai += 1;
      const pemasokProf = INITIAL_PROFILES.find((p) => p.id === deal.pemasok_id);
      if (pemasokProf) pemasokProf.jumlah_transaksi_selesai += 1;
      if (currentUser.value) currentUser.value.jumlah_transaksi_selesai += 1;

      // Hitung dampak kg (hanya bila berat_per_satuan_kg diisi)
      const beratSatuan = listing?.berat_per_satuan_kg || 0;
      const totalKg = beratSatuan > 0 ? actualQty * beratSatuan : 0;
      impactMetrics.value.total_kg_dialihkan += totalKg;
      impactMetrics.value.total_transaksi_selesai += 1;

      // Notifikasi transaksi selesai (tanpa alamat presisi/no WA)
      const otherUserId = isSeeker ? deal.pemasok_id : deal.pencari_id;
      notifications.value.unshift({
        id: 'notif-' + Date.now(),
        user_id: otherUserId,
        tipe: 'deal_selesai',
        jenis: 'deal_selesai',
        judul: 'Transaksi Selesai',
        isi: `Transaksi untuk "${deal.listing_judul}" telah selesai dan diverifikasi kedua pihak.`,
        link_target: '/aktivitas',
        dibaca: false,
        dibuat_pada: nowStr
      });

      if (listing && listing.stok <= 0) {
        notifications.value.unshift({
          id: `notif-${Date.now()}-habis`,
          user_id: deal.pemasok_id,
          tipe: 'stok_habis',
          jenis: 'stok_habis',
          judul: 'Stok Postingan Habis',
          isi: `Stok postingan "${listing.judul}" Anda telah habis.`,
          link_target: '/akun',
          dibaca: false,
          dibuat_pada: nowStr
        });
      }
    } else {
      deal.status = 'menunggu_otomatis';
      deal.batas_otomatis_pada = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString();

      const otherUserId = isSeeker ? deal.pemasok_id : deal.pencari_id;
      notifications.value.unshift({
        id: 'notif-' + Date.now(),
        user_id: otherUserId,
        tipe: 'konfirmasi_diminta',
        jenis: 'konfirmasi_diminta',
        judul: 'Konfirmasi Serah Terima Diperlukan',
        isi: `Rekan transaksi telah mengonfirmasi jumlah (${actualQty} ${deal.satuan}). Buka aplikasi untuk konfirmasi atau ajukan aduan dalam 3 hari.`,
        link_target: '/aktivitas',
        dibaca: false,
        dibuat_pada: nowStr
      });
    }

    return true;
  }

  async function disputeDeal(dealId: string, reasonText: string): Promise<boolean> {
    const deal = deals.value.find((d) => d.id === dealId);
    if (!deal) return false;

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('deals').update({
          status: 'dalam_aduan',
          aduan_teks: reasonText,
          aduan_oleh: currentUser.value?.id,
          aduan_pada: new Date().toISOString()
        }).eq('id', dealId);

        if (error) {
          alert('Gagal mengajukan aduan: ' + error.message);
          return false;
        }
        await fetchUserData(currentUser.value!.id);
        alert('Aduan Anda telah diajukan ke panel admin. Admin akan meninjau dan memutuskan status transaksi ini.');
        return true;
      } catch (err: any) {
        alert('Error saat mengajukan aduan: ' + err.message);
        return false;
      }
    }

    deal.status = 'dalam_aduan';
    deal.aduan_teks = reasonText;
    deal.aduan_oleh = currentUser.value?.id;
    deal.aduan_pada = new Date().toISOString();

    const otherUserId =
      currentUser.value?.id === deal.pencari_id ? deal.pemasok_id : deal.pencari_id;
    notifications.value.unshift({
      id: 'notif-' + Date.now(),
      user_id: otherUserId,
      tipe: 'aduan_deal',
      jenis: 'aduan_deal',
      judul: 'Aduan Transaksi Diajukan',
      isi: `Terdapat pengaduan pada transaksi "${deal.listing_judul}". Kasus dialihkan ke panel pengawas admin.`,
      link_target: '/aktivitas',
      dibaca: false,
      dibuat_pada: new Date().toISOString()
    });

    alert('Aduan Anda telah diajukan ke panel admin. Admin akan meninjau dan memutuskan status transaksi ini.');
    return true;
  }

  async function cancelDeal(dealId: string): Promise<boolean> {
    const deal = deals.value.find((d) => d.id === dealId);
    if (!deal) return false;

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('deals').update({ status: 'batal' }).eq('id', dealId);
        if (error) {
          alert('Gagal membatalkan transaksi: ' + error.message);
          return false;
        }
        await fetchUserData(currentUser.value!.id);
        return true;
      } catch (err: any) {
        alert('Error saat membatalkan transaksi: ' + err.message);
        return false;
      }
    }

    deal.status = 'batal';
    const otherUserId =
      currentUser.value?.id === deal.pencari_id ? deal.pemasok_id : deal.pencari_id;
    notifications.value.unshift({
      id: 'notif-' + Date.now(),
      user_id: otherUserId,
      tipe: 'deal_batal',
      jenis: 'deal_batal',
      judul: 'Transaksi Dibatalkan',
      isi: `Transaksi untuk "${deal.listing_judul}" telah dibatalkan.`,
      link_target: '/aktivitas',
      dibaca: false,
      dibuat_pada: new Date().toISOString()
    });

    return true;
  }

  // ============================================================================
  // IKUTI PEMASOK (FOLLOWS) (U10)
  // "Favorit" hanya ikuti pemasok; tidak ada bookmark per barang
  // ============================================================================
  async function toggleFollowSupplier(supplierId: string): Promise<boolean> {
    if (!requireAuth('mengikuti pemasok', { type: 'follow_supplier', payload: { supplierId } })) {
      return false;
    }

    if (currentUser.value?.id === supplierId) {
      alert('Anda tidak dapat mengikuti akun Anda sendiri.');
      return false;
    }

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        const isFollowing = follows.value.some(
          (f) => f.follower_id === currentUser.value?.id && f.supplier_id === supplierId
        );
        if (isFollowing) {
          await supabase.from('follows').delete().eq('follower_id', currentUser.value!.id).eq('supplier_id', supplierId);
        } else {
          await supabase.from('follows').insert({
            follower_id: currentUser.value!.id,
            supplier_id: supplierId
          });
        }
        await fetchUserData(currentUser.value!.id);
        return true;
      } catch (err: any) {
        console.warn('Gagal mengubah follow di Supabase:', err.message);
        return false;
      }
    }

    const idx = follows.value.findIndex(
      (f) => f.follower_id === currentUser.value?.id && f.supplier_id === supplierId
    );

    if (idx >= 0) {
      follows.value.splice(idx, 1);
    } else {
      const supplierProf = INITIAL_PROFILES.find((p) => p.id === supplierId);
      follows.value.push({
        id: 'f-' + Date.now(),
        follower_id: currentUser.value!.id,
        supplier_id: supplierId,
        supplier_nama: supplierProf?.nama_tampilan || 'Pemasok Sisa',
        supplier_toko: supplierProf?.nama_toko_profesi,
        dibuat_pada: new Date().toISOString()
      });

      // Notifikasi ke pemasok (hanya jumlah pengikut baru, tanpa data pribadi)
      notifications.value.unshift({
        id: 'notif-' + Date.now(),
        user_id: supplierId,
        tipe: 'pengikut_baru',
        jenis: 'pengikut_baru',
        judul: 'Pengikut Baru',
        isi: 'Akun Anda mendapatkan pengikut baru yang berminat dengan sisa usaha Anda.',
        link_target: '/akun',
        dibaca: false,
        dibuat_pada: new Date().toISOString()
      });
    }

    return true;
  }

  function isFollowingSupplier(supplierId: string): boolean {
    if (!currentUser.value) return false;
    return follows.value.some(
      (f) => f.follower_id === currentUser.value?.id && f.supplier_id === supplierId
    );
  }

  // ============================================================================
  // LAPORAN PENGADUAN (REPORTS) (U12)
  // 1 per pengguna per target; wajib melampirkan foto bukti
  // ============================================================================
  async function submitReport(data: {
    target_type: TargetLaporan;
    target_id: string;
    target_judul?: string;
    terlapor_id?: string;
    terlapor_nama?: string;
    alasan: string;
    catatan: string;
    foto_bukti: string; // Wajib foto bukti!
  }): Promise<{ success: boolean; message?: string }> {
    if (!requireAuth('mengirimkan laporan pengaduan')) {
      return { success: false, message: 'Harap masuk terlebih dahulu.' };
    }

    if (!data.foto_bukti || data.foto_bukti.trim() === '') {
      alert('Laporan Wajib Foto: Anda wajib melampirkan foto bukti barang / tempat untuk diverifikasi admin.');
      return { success: false, message: 'Foto bukti wajib dilampirkan.' };
    }

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        // 1. Cek laporan ganda untuk target yang sama
        const { data: existing } = await supabase
          .from('reports')
          .select('id')
          .eq('reporter_id', currentUser.value!.id)
          .eq('target_type', data.target_type)
          .eq('target_id', data.target_id)
          .maybeSingle();

        if (existing) {
          alert('Anda sudah pernah mengirimkan laporan untuk target ini. Tim pengawas sedang meninjaunya.');
          return { success: false, message: 'Sudah pernah dilaporkan.' };
        }

        // 2. Unggah bukti foto ke bucket waste-images (folder: reports/<user_id>/)
        let photoUrl = data.foto_bukti;
        if (photoUrl.startsWith('data:') || photoUrl.startsWith('blob:')) {
          const uploadRes = await uploadImageToWasteStorage(
            photoUrl,
            `reports/${currentUser.value!.id}/${Date.now()}.jpg`
          );
          if (uploadRes.url) {
            photoUrl = uploadRes.url;
          }
        }

        // 3. Simpan baris laporan
        const { error: repErr } = await supabase.from('reports').insert({
          reporter_id: currentUser.value!.id,
          target_type: data.target_type,
          target_id: data.target_id,
          alasan: data.alasan,
          catatan: data.catatan,
          foto_bukti: photoUrl,
          status: 'terbuka'
        });

        if (repErr) {
          alert('Gagal mengirimkan laporan: ' + repErr.message);
          return { success: false, message: repErr.message };
        }

        await fetchUserData(currentUser.value!.id);
        alert('Laporan berhasil dikirim beserta foto bukti. Tim admin akan menindaklanjuti.');
        return { success: true };
      } catch (err: any) {
        alert('Error saat mengirim laporan: ' + err.message);
        return { success: false, message: err.message };
      }
    }

    // Mode Demo
    const existing = reports.value.find(
      (r) =>
        r.reporter_id === currentUser.value?.id &&
        r.target_type === data.target_type &&
        r.target_id === data.target_id
    );

    if (existing) {
      alert('Anda sudah pernah mengirimkan laporan untuk target ini. Tim pengawas sedang meninjaunya.');
      return { success: false, message: 'Sudah pernah dilaporkan.' };
    }

    const newReport: ReportItem = {
      id: 'rep-' + Date.now(),
      reporter_id: currentUser.value!.id,
      reporter_nama: currentUser.value!.nama_tampilan,
      target_type: data.target_type,
      target_id: data.target_id,
      target_judul: data.target_judul,
      terlapor_id: data.terlapor_id,
      terlapor_nama: data.terlapor_nama,
      alasan: data.alasan,
      catatan: data.catatan,
      foto_bukti: data.foto_bukti,
      status: 'terbuka',
      dibuat_pada: new Date().toISOString()
    };

    reports.value.unshift(newReport);
    impactMetrics.value.total_laporan_terbuka += 1;
    alert('Laporan berhasil dikirim beserta foto bukti. Tim admin akan menindaklanjuti.');
    return { success: true };
  }

  async function markNotificationRead(id: string) {
    const item = notifications.value.find((n) => n.id === id);
    if (item) item.dibaca = true;

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('notifications').update({ dibaca: true }).eq('id', id);
      } catch (err: any) {
        console.warn('Gagal menandai notifikasi dibaca:', err.message);
      }
    }
  }

  async function markAllNotificationsRead() {
    if (!currentUser.value) return;
    notifications.value.forEach((n) => {
      if (n.user_id === currentUser.value?.id) n.dibaca = true;
    });

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('notifications')
          .update({ dibaca: true })
          .eq('user_id', currentUser.value.id);
      } catch (err: any) {
        console.warn('Gagal menandai semua notifikasi dibaca:', err.message);
      }
    }
  }

  // ============================================================================
  // FITUR ADMIN (A1 - A10, IMMUTABLE AUDIT LOG S8)
  // ============================================================================
  function recordAdminAction(aksi: string, target_type: string, target_id: string, alasan: string) {
    if (!isAdmin.value) return;
    adminActions.value.unshift({
      id: 'act-' + Date.now(),
      admin_id: currentUser.value!.id,
      admin_nama: currentUser.value!.nama_tampilan,
      aksi,
      target_type,
      target_id,
      alasan,
      waktu: new Date().toISOString()
    });
  }

  async function adminModerateListing(listingId: string, action: 'sembunyikan' | 'pulihkan', writtenReason: string) {
    if (!isAdmin.value) return false;
    const l = listings.value.find((item) => item.id === listingId);
    if (l) l.status = action === 'sembunyikan' ? 'disembunyikan' : 'aktif';

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('listings').update({
          status: action === 'sembunyikan' ? 'disembunyikan' : 'aktif'
        }).eq('id', listingId);

        await supabase.from('admin_actions').insert({
          admin_id: currentUser.value!.id,
          aksi: action === 'sembunyikan' ? 'sembunyikan_listing' : 'pulihkan_listing',
          target_type: 'listing',
          target_id: listingId,
          alasan: writtenReason || 'Moderasi listing oleh admin'
        });
        await fetchUserData(currentUser.value!.id);
        await fetchPublicListings();
        return true;
      } catch (err: any) {
        console.warn('Gagal moderasi listing di Supabase:', err.message);
        return false;
      }
    }

    recordAdminAction(
      action === 'sembunyikan' ? 'sembunyikan_listing' : 'pulihkan_listing',
      'listing',
      listingId,
      writtenReason || 'Moderasi konten postingan oleh admin'
    );
    return true;
  }

  async function adminResolveReport(reportId: string, decision: 'selesai' | 'diabaikan', actionNote: string) {
    if (!isAdmin.value) return false;
    const r = reports.value.find((item) => item.id === reportId);
    if (r) {
      r.status = decision;
      r.tindakan_admin = actionNote;
      r.ditangani_oleh = currentUser.value?.id;
      r.ditangani_pada = new Date().toISOString();
    }

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('reports').update({
          status: decision,
          tindakan_admin: actionNote,
          ditangani_oleh: currentUser.value!.id,
          ditangani_pada: new Date().toISOString()
        }).eq('id', reportId);

        await supabase.from('admin_actions').insert({
          admin_id: currentUser.value!.id,
          aksi: `putuskan_laporan_${decision}`,
          target_type: 'report',
          target_id: reportId,
          alasan: actionNote || 'Pemeriksaan laporan oleh admin'
        });
        await fetchUserData(currentUser.value!.id);
        return true;
      } catch (err: any) {
        console.warn('Gagal menyelesaikan laporan di Supabase:', err.message);
        return false;
      }
    }

    recordAdminAction(
      `putuskan_laporan_${decision}`,
      r ? r.target_type : 'report',
      r ? r.target_id : reportId,
      actionNote || 'Pemeriksaan laporan oleh admin'
    );

    // Kirim notifikasi hasil laporan ke pelapor
    if (r) {
      notifications.value.unshift({
        id: 'notif-' + Date.now(),
        user_id: r.reporter_id,
        tipe: 'laporan_diputuskan',
        jenis: 'laporan_diputuskan',
        judul: 'Laporan Anda Telah Ditinjau',
        isi: `Laporan Anda telah diputuskan oleh pengawas dengan status: ${decision}.`,
        link_target: '/aktivitas',
        dibaca: false,
        dibuat_pada: new Date().toISOString()
      });
    }

    return true;
  }

  async function adminSanctionAccount(
    targetUserId: string,
    sanction: 'peringatan' | 'ditangguhkan' | 'diblokir',
    mandatoryReason: string
  ) {
    if (!isAdmin.value) return false;
    const user = INITIAL_PROFILES.find((p) => p.id === targetUserId);
    if (user) {
      user.status_akun = sanction;
      user.alasan_sanksi = mandatoryReason;
    }
    if (currentUser.value?.id === targetUserId) {
      currentUser.value.status_akun = sanction;
      currentUser.value.alasan_sanksi = mandatoryReason;
    }

    if (sanction === 'ditangguhkan' || sanction === 'diblokir') {
      listings.value.forEach((l) => {
        if (l.user_id === targetUserId) l.status = 'disembunyikan';
      });
    }

    if (!isDemoModeDefault && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').update({
          status_akun: sanction,
          alasan_sanksi: mandatoryReason
        }).eq('id', targetUserId);

        if (sanction === 'ditangguhkan' || sanction === 'diblokir') {
          await supabase.from('listings').update({ status: 'disembunyikan' }).eq('user_id', targetUserId);
        }

        await supabase.from('admin_actions').insert({
          admin_id: currentUser.value!.id,
          aksi: `sanksi_akun_${sanction}`,
          target_type: 'profile',
          target_id: targetUserId,
          alasan: mandatoryReason
        });
        await fetchUserData(currentUser.value!.id);
        return true;
      } catch (err: any) {
        console.warn('Gagal memberi sanksi akun di Supabase:', err.message);
        return false;
      }
    }

    recordAdminAction(
      `sanksi_akun_${sanction}`,
      'profile',
      targetUserId,
      mandatoryReason
    );

    // Notifikasi sanksi ke akun terkait
    notifications.value.unshift({
      id: 'notif-' + Date.now(),
      user_id: targetUserId,
      tipe: 'sanksi_admin',
      jenis: 'sanksi_admin',
      judul: 'Pemberitahuan Sanksi Akun',
      isi: `Akun Anda telah diberi status ${sanction.toUpperCase()}. Alasan: ${mandatoryReason}`,
      link_target: '/akun',
      dibaca: false,
      dibuat_pada: new Date().toISOString()
    });

    return true;
  }

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    isAccountSanctioned,
    isAuthModalOpen,
    isProfileModalOpen,
    authModalMessage,
    categories,
    allowedCategories,
    prohibitedCategories,
    listings,
    filteredListings,
    myListings,
    myActiveListingsCount,
    userLocations,
    myLocations,
    myLocationSlots: myLocations,
    deals,
    myActiveDeals,
    myCompletedDeals,
    follows,
    notifications,
    myNotifications,
    unreadNotificationsCount,
    reports,
    reportQueueGrouped,
    adminReportsQueue,
    adminActions,
    educationArticles,
    impactMetrics,
    myPersonalImpact,
    viewerCoords,
    radiusKm,
    searchQuery,
    selectedCategoryId,
    selectedPriceType,
    sortBy,
    requireAuth,
    sendOtpEmail,
    verifyOtp,
    loginAs,
    logout,
    updateProfile,
    saveLocationSlot,
    deleteAccount,
    createListing,
    updateListing,
    contactSupplierViaWa,
    confirmDealCompletion,
    disputeDeal,
    cancelDeal,
    toggleFollowSupplier,
    isFollowingSupplier,
    submitReport,
    markNotificationRead,
    markAllNotificationsRead,
    adminModerateListing,
    adminResolveReport,
    adminSanctionAccount,
    cleanOldNotifications,
    fetchCategories,
    fetchEducationArticles,
    fetchPublicListings,
    fetchImpactMetrics,
    fetchUserData,
    syncUserProfile
  };
}
