import { create } from "zustand";
import type { AuthUser } from "@/lib/auth/types";

const TOKEN_KEY = "ss_access_token";
const USER_KEY = "ss_user_profile";

export type AuthStoreState = {
  token: string | null;
  user: AuthUser | null;
  /** False until `bootstrap` runs on the client */
  ready: boolean;
  bootstrap: () => void;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  token: null,
  user: null,
  ready: false,

  bootstrap: () => {
    if (typeof window === "undefined") return;
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const raw = localStorage.getItem(USER_KEY);
      if (t && raw) {
        const user = JSON.parse(raw) as AuthUser;
        if (user?.id && user?.email) {
          set({ token: t, user, ready: true });
          return;
        }
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    set({ token: null, user: null, ready: true });
  },

  setSession: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, ready: true });
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null, ready: true });
  },
}));
