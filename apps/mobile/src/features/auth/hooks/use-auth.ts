import { useAuthStore } from '@/src/features/auth/store/auth-store';

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const clearSession = useAuthStore((s) => s.clearSession);

  return {
    user,
    token,
    isAuthenticated: Boolean(token),
    hydrated,
    signOut: clearSession,
  };
}
