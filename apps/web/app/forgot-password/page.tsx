"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field } from "@/components/auth/fields";
import { ArrowRight, Check } from "@/components/ui/icons";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <AuthShell>
      {sent ? (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]">
            <Check size={22} />
          </div>
          <h1 className="font-display mt-4 text-[1.5rem] font-semibold tracking-tight">
            Check your inbox
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-[13.5px] text-[var(--ss-text-muted)]">
            If an account exists for that email, a reset link is on its way.
          </p>
          <Link href="/login" className="ss-btn ss-btn-ghost mt-6 w-full py-2.5 text-[13.5px]">
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-display text-[1.65rem] font-semibold tracking-tight">
            Reset password
          </h1>
          <p className="mt-1.5 text-[13.5px] text-[var(--ss-text-muted)]">
            Enter your email and we&rsquo;ll send a reset link.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-7 space-y-4"
          >
            <Field label="Email" type="email" placeholder="you@email.com" required />
            <button type="submit" className="ss-btn ss-btn-primary w-full py-2.5 text-[14px]">
              Send reset link <ArrowRight size={16} />
            </button>
          </form>
          <p className="mt-6 text-center text-[13px] text-[var(--ss-text-muted)]">
            Remembered it?{" "}
            <Link href="/login" className="font-semibold text-[var(--ss-accent)] hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
