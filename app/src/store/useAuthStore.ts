import { create } from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';
import { User } from '@/models/User';

interface AuthState {
  isAuthenticated: boolean | null;
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  restoreAuth: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: null, // null means loading/checking
  user: null,
  token: null,

  setAuth: async (user, token) => {
    try {
      await EncryptedStorage.setItem('@auth_token', token);
      await EncryptedStorage.setItem('@auth_user', JSON.stringify(user));
      set({ isAuthenticated: true, user, token });
    } catch (error) {
      console.error('Failed to save auth state', error);
    }
  },

  clearAuth: async () => {
    try {
      await EncryptedStorage.removeItem('@auth_token');
      await EncryptedStorage.removeItem('@auth_user');
      set({ isAuthenticated: false, user: null, token: null });
    } catch (error) {
      console.error('Failed to clear auth state', error);
    }
  },

  restoreAuth: async () => {
    try {
      const token = await EncryptedStorage.getItem('@auth_token');
      const userStr = await EncryptedStorage.getItem('@auth_user');
      
      if (token && userStr) {
        set({ isAuthenticated: true, token, user: JSON.parse(userStr) });
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
      // Fire and forget updating the storage
      EncryptedStorage.setItem('@auth_user', JSON.stringify(updatedUser)).catch(e => console.error(e));
      return { user: updatedUser };
    });
  }
}));
