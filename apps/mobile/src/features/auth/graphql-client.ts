import { getGraphqlEndpoint } from '@/src/features/auth/config';
import type { GraphQLResponse } from '@/src/features/auth/types';

export class AuthRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AuthRequestError';
  }
}

export async function graphqlRequest<TData>(
  query: string,
  variables?: Record<string, unknown>,
  bearerToken?: string | null,
): Promise<TData> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }

  let res: Response;
  try {
    res = await fetch(getGraphqlEndpoint(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
  } catch {
    throw new AuthRequestError('Network error — check the API is reachable.');
  }

  let body: GraphQLResponse<TData>;
  try {
    body = (await res.json()) as GraphQLResponse<TData>;
  } catch {
    throw new AuthRequestError('Invalid response from server.', res.status);
  }

  if (body.errors?.length) {
    const msg = body.errors.map((e) => e.message).join(' ') || 'Request failed';
    throw new AuthRequestError(msg, res.status);
  }

  if (!res.ok) {
    throw new AuthRequestError(`HTTP ${res.status}`, res.status);
  }

  if (!body.data) {
    throw new AuthRequestError('Empty response from server.');
  }

  return body.data;
}
