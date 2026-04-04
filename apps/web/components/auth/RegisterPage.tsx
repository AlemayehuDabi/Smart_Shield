"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AuthRequestError, registerAccount } from "@/lib/auth/api";
import { mapAuthErrorMessage } from "@/lib/auth/errors";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
} from "@/lib/auth/validation";
import { useAuth } from "@/hooks/useAuth";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthStatusBanner } from "@/components/auth/AuthStatusBanner";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";

export function RegisterPage() {
  const router = useRouter();
  const { setSession, ready } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const nameErr = touched.name ? validateName(name) : null;
  const emailErr = touched.email ? validateEmail(email) : null;
  const passErr = touched.password ? validatePassword(password) : null;
  const matchErr =
    touched.confirm || touched.password ? validatePasswordMatch(password, confirm) : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (
      validateName(name) ||
      validateEmail(email) ||
      validatePassword(password) ||
      validatePasswordMatch(password, confirm)
    ) {
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const out = await registerAccount(name, email, password);
      setSession(out.token, out.user);
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof AuthRequestError ? err.message : "Registration failed.";
      setFormError(mapAuthErrorMessage(msg));
    } finally {
      setSubmitting(false);
    }
  }

  function goTerminal() {
    router.push("/");
    router.refresh();
  }

  return (
    <AuthShell>
      <AuthFormCard
        title="Create your workspace"
        subtitle="One profile — live quotes, AI coach memory, and alerts stay in sync."
      >
        <AuthStatusBanner variant="success">
          {success
            ? "You are in. Your session is secured with a JWT — continue to the terminal when ready."
            : null}
        </AuthStatusBanner>
        <AuthStatusBanner variant="error">{!success ? formError : null}</AuthStatusBanner>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--ss-text-muted)]">
              The assistant will start learning from your next session — paper or live, your choice.
            </p>
            <button
              type="button"
              onClick={goTerminal}
              className="w-full rounded-[var(--radius-md)] border border-[var(--ss-border-strong)] bg-[var(--ss-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--ss-text)] transition hover:border-[var(--ss-accent)]/35 hover:bg-[var(--ss-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40"
            >
              Open trading terminal
            </button>
          </div>
        ) : (
          <form className="ss-stagger space-y-4" onSubmit={onSubmit} noValidate>
            <AuthFormField
              label="Full name"
              name="name"
              autoComplete="name"
              placeholder="Jordan Lee"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              error={nameErr}
              disabled={!ready || submitting}
            />
            <AuthFormField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@firm.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={emailErr}
              disabled={!ready || submitting}
            />
            <AuthFormField
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              error={passErr}
              disabled={!ready || submitting}
              hint="Min. 8 characters"
            />
            <AuthFormField
              label="Confirm password"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(ev) => setConfirm(ev.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              error={matchErr}
              disabled={!ready || submitting}
            />
            <AuthSubmitButton loading={submitting} disabled={!ready}>
              Create account
            </AuthSubmitButton>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-[var(--ss-text-muted)]">
          Already have access?{" "}
          <Link
            href="/login"
            className="rounded-sm font-medium text-[var(--ss-accent)] underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40"
          >
            Sign in
          </Link>
        </p>
      </AuthFormCard>
    </AuthShell>
  );
}
