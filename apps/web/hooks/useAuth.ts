import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Session state backed by Zustand + localStorage (JWT + user profile).
 * Call `bootstrap` once on app mount via `AuthBootstrap`.
 */
export function useAuth() {
  return useAuthStore(
    useShallow((s) => ({
      token: s.token,
      user: s.user,
      ready: s.ready,
      isAuthenticated: Boolean(s.token && s.user),
      setSession: s.setSession,
      clearSession: s.clearSession,
      bootstrap: s.bootstrap,
    })),
  );
}
