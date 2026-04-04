import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import type { AuthUser } from '@/src/features/auth/types';

const TOKEN_KEY = 'smartshield_auth_token';
const USER_KEY = 'smartshield_auth_user';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (token: string, user: AuthUser) => Promise<void>;
  clearSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const raw = await SecureStore.getItemAsync(USER_KEY);
      let user: AuthUser | null = null;
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.id && parsed?.email) user = parsed;
      }
      if (token && !user) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        set({ token: null, user: null, hydrated: true });
        return;
      }
      set({ token: token ?? null, user, hydrated: true });
    } catch {
      set({ token: null, user: null, hydrated: true });
    }
  },

  setSession: async (token, user) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },

  clearSession: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch {
      /* ignore */
    }
    set({ token: null, user: null });
  },
}));
