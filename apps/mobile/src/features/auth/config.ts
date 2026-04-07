/**
 * GraphQL endpoint for trading-engine auth (login / register).
 * Set EXPO_PUBLIC_GRAPHQL_URL in .env (e.g. http://192.168.1.x:8080/graphql for a device).
 */

export function getGraphqlEndpoint(): string {
  const fromEnv = process.env.EXPO_PUBLIC_GRAPHQL_URL?.trim();
  if (fromEnv) return fromEnv;
  return 'http://localhost:8000/graphql';
}

/** Optional web URL for “Forgot password” deep link. */
export function getPasswordResetUrl(): string | undefined {
  return process.env.EXPO_PUBLIC_PASSWORD_RESET_URL?.trim() || undefined;
}
