import { create } from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';
import { User } from '@/models/User';
import { authService } from '../services/AuthService';
import { TokenStorage } from '../api/TokenStorage';

interface AuthState {
  isAuthenticated: boolean | null;
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => Promise<void>;
  restoreAuth: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: null,
  user: null,
  token: null,

  setAuth: (user, token) => {
    EncryptedStorage.setItem('@auth_user', JSON.stringify(user)).catch(e => console.error(e));
    set({ isAuthenticated: true, user, token });
  },

  clearAuth: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      await EncryptedStorage.removeItem('@auth_user');
      set({ isAuthenticated: false, user: null, token: null });
    }
  },

  restoreAuth: async () => {
    try {
      const accessToken = await TokenStorage.getAccessToken();
      const userStr = await EncryptedStorage.getItem('@auth_user');
      
      if (accessToken && userStr) {
        // Optimistically set auth so UI loads fast
        set({ isAuthenticated: true, token: accessToken, user: JSON.parse(userStr) });
        
        // Fetch real user data to ensure token is valid and data is fresh
        try {
          const freshUser = await authService.getMe();
          set({ user: freshUser });
          EncryptedStorage.setItem('@auth_user', JSON.stringify(freshUser)).catch(_e => {});
        } catch {
          // If /me fails (e.g. refresh token expired), clear auth
          set({ isAuthenticated: false, user: null, token: null });
        }
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.error('Failed to restore auth state', error);
      set({ isAuthenticated: false });
    }
  },

  updateProfile: (profile) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...profile };
      EncryptedStorage.setItem('@auth_user', JSON.stringify(updatedUser)).catch(e => console.error(e));
      return { user: updatedUser };
    });
  }
}));
