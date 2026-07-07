"use client";

import Link from "next/link";
import { useState } from "react";
import { plans } from "@/lib/data/plans";
import { cn } from "@/components/ui/cn";
import { Check } from "@/components/ui/icons";
import { Reveal } from "./Reveal";

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="border-t border-[var(--ss-border)] px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ss-eyebrow mb-4">Pricing</p>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
            Start free. Upgrade when the coach earns it.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--ss-text-muted)]">
            No trading fees, no percentage of profits, no custody. Just a subscription — cancel any
            time.
          </p>

          {/* billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-[var(--ss-border)] bg-[var(--ss-surface)] p-1">
            {(
              [
                ["monthly", "Monthly"],
                ["annual", "Annual · 2 months free"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setAnnual(key === "annual")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-all",
                  (key === "annual") === annual
                    ? "bg-[var(--ss-accent)] text-[var(--ss-accent-ink)] shadow-sm"
                    : "text-[var(--ss-text-muted)] hover:text-[var(--ss-text)]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((p, i) => {
            const price = annual ? p.annualMonthly : p.monthly;
            const isElite = p.id === "elite";
            return (
              <Reveal key={p.id} delay={i * 80}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border p-6 sm:p-7 transition-transform duration-300",
                    p.highlight
                      ? "border-[var(--ss-accent)]/50 bg-[var(--ss-bg-elevated)] shadow-[0_0_60px_-18px_var(--ss-glow)] lg:-translate-y-2"
                      : "ss-card"
                  )}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--ss-accent)] px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-widest text-[var(--ss-accent-ink)]">
                      Most popular
                    </span>
                  )}
                  <div className="flex items-baseline justify-between">
                    <h3
                      className={cn(
                        "font-display text-lg font-semibold tracking-tight",
                        isElite && "text-[var(--ss-gold)]"
                      )}
                    >
                      {p.name}
                    </h3>
                    <span className="ss-eyebrow !text-[9px]">
                      {p.id === "free" ? "Free" : p.id === "pro" ? "Pro" : "Elite"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] text-[var(--ss-text-muted)]">{p.tagline}</p>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="ss-tabular font-display text-4xl font-semibold tracking-tight">
                      ${price}
                    </span>
                    <span className="text-[12px] text-[var(--ss-text-faint)]">/ month</span>
                    {annual && p.monthly > 0 && (
                      <span className="ss-tabular ml-1 rounded-md bg-[var(--ss-profit-dim)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--ss-profit)]">
                        −{Math.round((1 - p.annualMonthly / p.monthly) * 100)}%
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 flex-1 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[var(--ss-text-muted)]">
                        <Check
                          size={13}
                          className={cn(
                            "mt-0.5 shrink-0",
                            isElite ? "text-[var(--ss-gold)]" : "text-[var(--ss-accent)]"
                          )}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup"
                    className={cn(
                      "mt-7 w-full px-4 py-2.5 text-center text-[13.5px]",
                      p.highlight ? "ss-btn ss-btn-primary" : "ss-btn ss-btn-ghost"
                    )}
                  >
                    {p.cta}
                  </Link>
                  {p.footnote && (
                    <p className="mt-3 text-center font-mono text-[9.5px] text-[var(--ss-text-faint)]">
                      {p.footnote}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
