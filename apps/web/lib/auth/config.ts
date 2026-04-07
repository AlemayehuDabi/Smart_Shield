/**
 * GraphQL endpoint for trading-engine auth (login / register).
 * Defaults to same-origin proxy (/api/graphql) to avoid browser CORS during local dev.
 */

export function getGraphqlEndpoint(): string {
  const fromEnv = process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim();
  if (fromEnv) return fromEnv;
  return 'http://localhost:8000';
}
