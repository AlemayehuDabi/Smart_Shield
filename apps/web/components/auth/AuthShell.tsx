"use client";

import Link from "next/link";
import { cn } from "@/components/ui/cn";

type AuthShellProps = {
  children: React.ReactNode;
  /** Narrow column for form; brand rail on large screens */
  className?: string;
};

export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="ss-backdrop" aria-hidden>
        <div className="ss-grid" />
        <div className="ss-noise" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-10 sm:px-6 lg:flex-row lg:items-stretch lg:gap-10 lg:px-10 lg:py-14">
        <aside className="ss-animate-in mb-10 flex max-w-xl flex-col justify-center lg:mb-0 lg:w-[42%] lg:shrink-0">
          <Link
            href="/"
            className="group mb-8 inline-flex w-fit items-center gap-2 rounded-xl border border-transparent px-1 py-1 text-[var(--ss-text-muted)] transition hover:border-[var(--ss-border)] hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40"
          >
            <span className="flex size-9 items-center justify-center rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] text-[var(--ss-accent)] transition group-hover:border-[var(--ss-border-strong)]">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
              </svg>
            </span>
            <span className="text-xs font-medium tracking-tight">Back to terminal</span>
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--ss-text-faint)]">
            Smart Shield
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ss-text)] sm:text-4xl">
            Trade with an AI that remembers how you decide.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--ss-text-muted)]">
            Real-time execution, behavioral coaching, and memory-driven guardrails — one session at a time.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-[var(--ss-text-muted)]">
            {[
              "Live book context with AI explanations on every move",
              "Alerts and discipline nudges tuned to your risk fingerprint",
              "Journal-grade recall so the assistant improves with you",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--ss-accent)] shadow-[0_0_12px_var(--ss-glow)]"
                  aria-hidden
                />
                <span className="leading-snug">{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 hidden h-px w-full bg-gradient-to-r from-[var(--ss-accent)]/25 via-[var(--ss-violet)]/20 to-transparent lg:block" />
        </aside>

        <div className={cn("flex flex-1 items-center justify-center lg:justify-end", className)}>{children}</div>
      </div>
    </div>
  );
}
