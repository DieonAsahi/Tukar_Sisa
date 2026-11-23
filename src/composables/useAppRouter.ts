import { ref, computed } from 'vue';
import { UserProfile } from '../types';

export type AppRoute = '/' | '/admin';

function getPathFromLocation(): AppRoute {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return '/admin';
  }
  return '/';
}

const currentPath = ref<AppRoute>(getPathFromLocation());
const routeGuardAlert = ref<string | null>(null);

// Listener global popstate satu kali
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    currentPath.value = getPathFromLocation();
  });
}

export function useAppRouter(currentUserGetter?: () => UserProfile | null) {
  const isCurrentAdmin = computed(() => currentPath.value === '/admin');
  const currentRoute = currentPath;

  // Pastikan sinkronisasi saat composable dipanggil
  if (typeof window !== 'undefined') {
    const currentLoc = getPathFromLocation();
    if (currentPath.value !== currentLoc) {
      currentPath.value = currentLoc;
    }
  }

  function navigateTo(path: AppRoute, user?: UserProfile | null) {
    routeGuardAlert.value = null;

    // Route Guard untuk /admin jika bukan admin
    if (path === '/admin') {
      const activeUser = user !== undefined ? user : currentUserGetter ? currentUserGetter() : null;
      const isDemo = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE === 'true';
      
      // Jika mode demo tidak aktif dan bukan akun admin
      if (!isDemo && activeUser && activeUser.peran_sistem !== 'admin') {
        routeGuardAlert.value = 'Perhatian: Membuka panel moderasi /admin dengan akun non-admin.';
      }
    }

    currentPath.value = path;
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    return true;
  }

  return {
    currentPath,
    currentRoute,
    isCurrentAdmin,
    routeGuardAlert,
    navigateTo
  };
}
