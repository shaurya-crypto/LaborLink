import { create } from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';

type Role = 'worker' | 'employer' | null;

interface AppState {
  hasSelectedLanguage: boolean;
  language: 'en' | 'hi';
  role: Role;
  locationPermissionGranted: boolean;
  city: string | null;
  hasCompletedOnboarding: boolean;

  setLanguage: (lang: 'en' | 'hi') => Promise<void>;
  setRole: (role: Role) => Promise<void>;
  setLocation: (granted: boolean, city: string | null) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  restoreAppState: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  hasSelectedLanguage: false,
  language: 'en',
  role: null,
  locationPermissionGranted: false,
  city: null,
  hasCompletedOnboarding: false,

  setLanguage: async (lang) => {
    await EncryptedStorage.setItem('@app_language', lang);
    set({ language: lang, hasSelectedLanguage: true });
  },

  setRole: async (role) => {
    if (role) await EncryptedStorage.setItem('@app_role', role);
    else await EncryptedStorage.removeItem('@app_role');
    set({ role });
  },

  setLocation: async (granted, city) => {
    await EncryptedStorage.setItem('@app_location_granted', JSON.stringify(granted));
    if (city) await EncryptedStorage.setItem('@app_city', city);
    set({ locationPermissionGranted: granted, city });
  },

  completeOnboarding: async () => {
    await EncryptedStorage.setItem('@app_onboarding_completed', 'true');
    set({ hasCompletedOnboarding: true });
  },

  restoreAppState: async () => {
    try {
      const lang = await EncryptedStorage.getItem('@app_language') as 'en' | 'hi' | null;
      const role = await EncryptedStorage.getItem('@app_role') as Role;
      const locGranted = await EncryptedStorage.getItem('@app_location_granted');
      const city = await EncryptedStorage.getItem('@app_city');
      const onboardingCompleted = await EncryptedStorage.getItem('@app_onboarding_completed');

      set({
        language: lang || 'en',
        hasSelectedLanguage: !!lang,
        role: role || null,
        locationPermissionGranted: locGranted === 'true',
        city: city || null,
        hasCompletedOnboarding: onboardingCompleted === 'true',
      });
    } catch (e) {
      console.error('Failed to restore app state', e);
    }
  },
}));
