import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthFormCard } from "@/components/auth/AuthFormCard";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <AuthFormCard
        title="Reset access"
        subtitle="Self-serve password reset is not wired to the user service yet. Use your existing credentials or contact your workspace admin."
      >
        <p className="text-sm leading-relaxed text-[var(--ss-text-muted)]">
          When the trading-engine exposes a reset mutation, this screen will send a secure link to your email — same JWT trust chain as sign-in.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--ss-border)] bg-[var(--ss-surface)] px-4 py-2.5 text-center text-sm font-medium text-[var(--ss-text)] transition hover:border-[var(--ss-border-strong)] hover:bg-[var(--ss-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40"
          >
            Back to sign in
          </Link>
        </div>
      </AuthFormCard>
    </AuthShell>
  );
}
