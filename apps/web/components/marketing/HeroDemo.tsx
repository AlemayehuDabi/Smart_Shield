import { CandleChart } from "@/components/charts/CandleChart";
import { ConfidenceArc } from "@/components/charts/ConfidenceArc";
import { GraduationCap, ShieldCheck, TrendUp } from "@/components/ui/icons";
import { heroSignal, rrRatio, fmtPrice } from "@/lib/data/signals";

/**
 * The proof-shot: a framed product window showing a real signal —
 * chart with entry/target/stop overlays, confidence, plain-English
 * reasoning, and the in-context lesson hook. Everything the product
 * does, in one glance.
 */
export function HeroDemo() {
  const s = heroSignal;

  return (
    <div className="relative mx-auto mt-14 w-full max-w-5xl sm:mt-16">
      {/* backdrop glow */}
      <div
        aria-hidden
        className="absolute -inset-x-8 -top-16 bottom-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 40%, color-mix(in srgb, var(--ss-accent) 9%, transparent), transparent 70%)",
        }}
      />

      {/* window frame */}
      <div className="ss-panel overflow-hidden rounded-2xl border-[var(--ss-border-strong)] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)]">
        {/* titlebar */}
        <div className="flex items-center justify-between border-b border-[var(--ss-border)] bg-[var(--ss-bg)]/70 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--ss-loss)]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--ss-gold)]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--ss-profit)]/60" />
            </div>
            <span className="ss-eyebrow hidden sm:inline">Signals / {s.symbol}</span>
          </div>
          <span className="flex items-center gap-1.5 text-[10.5px] font-medium tracking-wide text-[var(--ss-accent)]">
            <span className="ss-live-dot h-1.5 w-1.5 rounded-full bg-[var(--ss-accent)]" />
            LIVE
          </span>
        </div>

        <div className="grid md:grid-cols-[1.6fr_1fr]">
          {/* chart panel */}
          <div className="relative border-b border-[var(--ss-border)] p-3 sm:p-4 md:border-b-0 md:border-r">
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-sm font-semibold tracking-tight">{s.symbol}</span>
                <span className="ss-tabular text-xs text-[var(--ss-profit)]">
                  {fmtPrice(s.candles[s.candles.length - 1].c)} +1.24%
                </span>
              </div>
              <div className="flex gap-1" aria-hidden>
                {(["15m", "1H", "4H", "1D"] as const).map((tf) => (
                  <span
                    key={tf}
                    className={
                      tf === s.timeframe
                        ? "rounded-md bg-[var(--ss-accent-dim)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--ss-accent)]"
                        : "rounded-md px-1.5 py-0.5 font-mono text-[10px] text-[var(--ss-text-faint)]"
                    }
                  >
                    {tf}
                  </span>
                ))}
              </div>
            </div>
            <CandleChart
              candles={s.candles}
              markers={{
                entry: s.entry,
                target: s.target,
                stop: s.stop,
                signalIndex: s.signalIndex,
                direction: s.direction,
              }}
              zone={{ from: 34, to: 44, label: "RSI divergence" }}
              className="h-auto w-full"
            />
          </div>

          {/* signal card panel */}
          <div className="flex flex-col gap-3.5 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-[15px] font-semibold tracking-tight">
                    {s.name}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--ss-profit-dim)] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--ss-profit)]">
                    <TrendUp size={11} /> Long
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[10.5px] tracking-wide text-[var(--ss-text-faint)]">
                  {s.timeframe} · {s.generatedAt}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <ConfidenceArc value={s.confidence} size={52} />
                <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[var(--ss-text-faint)]">
                  Confidence
                </span>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed text-[var(--ss-text-muted)]">{s.thesis}</p>

            {/* reasoning with in-context concept link */}
            <div className="rounded-xl border border-[var(--ss-border)] bg-[var(--ss-surface)] p-3">
              <p className="ss-eyebrow mb-1.5 !text-[9.5px]">Why this signal</p>
              <p className="text-[12px] leading-relaxed text-[var(--ss-text-muted)]">
                RSI made a higher low while price made a lower low —{" "}
                <span className="cursor-help border-b border-dashed border-[var(--ss-violet)] font-medium text-[var(--ss-violet)]">
                  bullish divergence
                </span>
                . Historically precedes reversal on this pair 63% of the time.
              </p>
            </div>

            {/* levels */}
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["Entry", fmtPrice(s.entry), "var(--ss-accent)"],
                  ["Target", fmtPrice(s.target), "var(--ss-profit)"],
                  ["Stop", fmtPrice(s.stop), "var(--ss-loss)"],
                ] as const
              ).map(([label, val, color]) => (
                <div
                  key={label}
                  className="rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] px-2 py-1.5 text-center"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--ss-text-faint)]">
                    {label}
                  </p>
                  <p className="ss-tabular mt-0.5 text-[12.5px] font-semibold" style={{ color }}>
                    {val}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-[var(--ss-border)] pt-3">
              <span className="ss-tabular text-[11px] text-[var(--ss-text-faint)]">
                R:R {rrRatio(s)}
              </span>
              <span className="font-mono text-[10.5px] font-medium text-[var(--ss-accent)]">
                Full reasoning →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* floating: in-context lesson (education pillar) */}
      <div className="ss-float absolute -right-10 -top-12 hidden w-60 xl:block" style={{ animationDelay: "0.8s" }}>
        <div className="ss-card !rounded-xl border-[var(--ss-violet)]/25 bg-[var(--ss-bg-elevated)] p-3.5 shadow-[0_16px_48px_-16px_rgba(124,140,248,0.25)]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--ss-violet-dim)] text-[var(--ss-violet)]">
              <GraduationCap size={15} />
            </span>
            <p className="font-mono text-[9.5px] uppercase tracking-widest text-[var(--ss-violet)]">
              New concept for you
            </p>
          </div>
          <p className="mt-2 text-[12.5px] font-semibold leading-snug">RSI Divergence</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--ss-text-muted)]">
            Learn why this pattern fires reversals — 3-min lesson, linked to this exact chart.
          </p>
        </div>
      </div>

      {/* floating: behavioral coach (portfolio pillar) */}
      <div className="ss-float absolute -bottom-7 -left-9 hidden w-64 xl:block" style={{ animationDelay: "2s" }}>
        <div className="ss-card !rounded-xl bg-[var(--ss-bg-elevated)] p-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]">
              <ShieldCheck size={15} />
            </span>
            <p className="font-mono text-[9.5px] uppercase tracking-widest text-[var(--ss-accent)]">
              Coach check
            </p>
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--ss-text-muted)]">
            This draft is <span className="ss-tabular font-semibold text-[var(--ss-text)]">2.1×</span> your
            median size after two losses — your revenge-trade pattern. Consider half size.
          </p>
        </div>
      </div>
    </div>
  );
}
