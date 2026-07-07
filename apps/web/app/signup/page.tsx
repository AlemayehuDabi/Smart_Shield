"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, PasswordField, SocialAuth, OrDivider } from "@/components/auth/fields";
import { ArrowRight, Check } from "@/components/ui/icons";

const perks = [
  "3 AI signals a day, free forever",
  "Plain-English reasoning on every call",
  "No credit card · no broker connection",
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/onboarding"), 550);
  }

  return (
    <AuthShell
      quote={{
        text: "It's the first product that treats me like someone who wants to get better, not someone to sell signals to.",
        author: "Devin K.",
        role: "Scout → Operator",
      }}
    >
      <h1 className="font-display text-[1.65rem] font-semibold tracking-tight">
        Start your edge
      </h1>
      <p className="mt-1.5 text-[13.5px] text-[var(--ss-text-muted)]">
        Create a free account. Upgrade only when you&rsquo;re ready.
      </p>

      <ul className="mt-5 space-y-1.5">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-2 text-[12.5px] text-[var(--ss-text-muted)]">
            <Check size={14} className="text-[var(--ss-accent)]" /> {p}
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-3">
        <SocialAuth />
        <OrDivider />
      </div>

      <form onSubmit={onSubmit} className="mt-3 space-y-4">
        <Field label="Full name" name="name" autoComplete="name" placeholder="Alex Dabi" required />
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@email.com"
          required
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="8+ characters"
          hint={<span className="text-[11px] font-normal text-[var(--ss-text-faint)]">8+ chars</span>}
          required
        />
        <label className="flex cursor-pointer items-start gap-2 text-[12px] leading-relaxed text-[var(--ss-text-muted)]">
          <input type="checkbox" required className="mt-0.5 accent-[var(--ss-accent)]" />
          <span>
            I agree to the{" "}
            <span className="text-[var(--ss-text)] underline decoration-dotted">Terms</span> and{" "}
            <span className="text-[var(--ss-text)] underline decoration-dotted">Privacy Policy</span>.
          </span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="ss-btn ss-btn-primary w-full py-2.5 text-[14px] disabled:opacity-70"
        >
          {loading ? "Creating account…" : "Create free account"}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[var(--ss-text-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--ss-accent)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
