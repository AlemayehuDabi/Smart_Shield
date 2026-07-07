"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, PasswordField, SocialAuth, OrDivider } from "@/components/auth/fields";
import { ArrowRight } from "@/components/ui/icons";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // UI-only demo: no real auth
    setTimeout(() => router.push("/signals"), 550);
  }

  return (
    <AuthShell
      quote={{
        text: "I finally understand why I'm in a trade. The coaching caught a habit that was quietly costing me every month.",
        author: "Maya R.",
        role: "Operator plan",
      }}
    >
      <h1 className="font-display text-[1.65rem] font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-[13.5px] text-[var(--ss-text-muted)]">
        Sign in to your trading desk.
      </p>

      <div className="mt-7 space-y-3">
        <SocialAuth />
        <OrDivider />
      </div>

      <form onSubmit={onSubmit} className="mt-3 space-y-4">
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@email.com"
          defaultValue="alex@smartshield.app"
          required
        />
        <PasswordField
          hint={
            <Link
              href="/forgot-password"
              className="text-[12px] font-normal text-[var(--ss-accent)] hover:underline"
            >
              Forgot?
            </Link>
          }
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          defaultValue="demo-password"
          required
        />
        <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-[var(--ss-text-muted)]">
          <input type="checkbox" defaultChecked className="accent-[var(--ss-accent)]" /> Keep me
          signed in
        </label>
        <button
          type="submit"
          disabled={loading}
          className="ss-btn ss-btn-primary w-full py-2.5 text-[14px] disabled:opacity-70"
        >
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[var(--ss-text-muted)]">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-[var(--ss-accent)] hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
