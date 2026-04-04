import { graphqlRequest, AuthRequestError } from "@/lib/auth/graphql-client";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "@/lib/auth/operations";
import type { AuthPayload, AuthUser } from "@/lib/auth/types";

type LoginResponse = { login: AuthPayload };
type RegisterResponse = { register: AuthPayload };

function normalizeUser(raw: {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}): AuthUser {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name ?? null,
    role: raw.role,
  };
}

export async function loginWithEmailPassword(email: string, password: string): Promise<AuthPayload> {
  try {
    const data = await graphqlRequest<LoginResponse>(LOGIN_MUTATION, {
      input: { email: email.trim(), password },
    });
    return {
      token: data.login.token,
      user: normalizeUser(data.login.user),
    };
  } catch (e) {
    if (e instanceof AuthRequestError) throw e;
    throw new AuthRequestError("Sign-in failed.");
  }
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
): Promise<AuthPayload> {
  try {
    const data = await graphqlRequest<RegisterResponse>(REGISTER_MUTATION, {
      input: { name: name.trim(), email: email.trim(), password },
    });
    return {
      token: data.register.token,
      user: normalizeUser(data.register.user),
    };
  } catch (e) {
    if (e instanceof AuthRequestError) throw e;
    throw new AuthRequestError("Registration failed.");
  }
}

export { AuthRequestError };
