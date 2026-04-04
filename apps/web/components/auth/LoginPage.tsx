"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AuthRequestError, loginWithEmailPassword } from "@/lib/auth/api";
import { mapAuthErrorMessage } from "@/lib/auth/errors";
import { validateEmail, validatePassword } from "@/lib/auth/validation";
import { useAuth } from "@/hooks/useAuth";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthStatusBanner } from "@/components/auth/AuthStatusBanner";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";

export function LoginPage() {
  const router = useRouter();
  const { setSession, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailErr = touched.email ? validateEmail(email) : null;
  const passErr = touched.password ? validatePassword(password) : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (validateEmail(email) || validatePassword(password)) return;
    setFormError(null);
    setSubmitting(true);
    try {
      const out = await loginWithEmailPassword(email, password);
      setSession(out.token, out.user);
      router.push("/");
      router.refresh();
    } catch (err) {
      const msg = err instanceof AuthRequestError ? err.message : "Sign-in failed.";
      setFormError(mapAuthErrorMessage(msg));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <AuthFormCard
        title="Sign in"
        subtitle="Your email is your account ID — the AI ties memory and risk cues to this identity."
      >
        <AuthStatusBanner variant="error">{formError}</AuthStatusBanner>
        <form className="ss-stagger space-y-4" onSubmit={onSubmit} noValidate>
          <AuthFormField
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            placeholder="you@firm.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            error={emailErr}
            disabled={!ready || submitting}
            hint="Also used as username"
          />
          <AuthFormField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={passErr}
            disabled={!ready || submitting}
          />
          <div className="flex justify-end pt-0.5">
            <Link
              href="/forgot-password"
              className="rounded-sm text-xs font-medium text-[var(--ss-accent)] underline-offset-4 transition hover:text-[var(--ss-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40"
            >
              Forgot password?
            </Link>
          </div>
          <AuthSubmitButton loading={submitting} disabled={!ready}>
            Sign in
          </AuthSubmitButton>
        </form>
        <p className="mt-6 text-center text-xs text-[var(--ss-text-muted)]">
          New here?{" "}
          <Link
            href="/register"
            className="rounded-sm font-medium text-[var(--ss-accent)] underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40"
          >
            Create an account
          </Link>
        </p>
      </AuthFormCard>
    </AuthShell>
  );
}
