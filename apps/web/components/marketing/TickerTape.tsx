import { tickerTape } from "@/lib/data/market";
import { cn } from "@/components/ui/cn";

/** Thin marquee of market quotes — the genre cue, kept quiet. */
export function TickerTape() {
  const items = [...tickerTape, ...tickerTape]; // doubled for seamless loop
  return (
    <div
      className="relative overflow-hidden border-b border-[var(--ss-border)] bg-[var(--ss-bg)]/60"
      aria-hidden
    >
      <div className="ss-marquee flex w-max items-center gap-8 px-6 py-1.5">
        {items.map((q, i) => (
          <span key={i} className="ss-tabular flex items-center gap-2 text-[11px] whitespace-nowrap">
            <span className="text-[var(--ss-text-faint)]">{q.symbol}</span>
            <span className="text-[var(--ss-text-muted)]">{q.price}</span>
            <span
              className={cn(
                q.changePct >= 0 ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]"
              )}
            >
              {q.changePct >= 0 ? "+" : ""}
              {q.changePct.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--ss-bg-deep)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--ss-bg-deep)] to-transparent" />
    </div>
  );
}
