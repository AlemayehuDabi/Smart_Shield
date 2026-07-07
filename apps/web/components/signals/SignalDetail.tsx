import Link from "next/link";
import { CandleChart } from "@/components/charts/CandleChart";
import { ConfidenceArc, confidenceTier } from "@/components/charts/ConfidenceArc";
import { Badge } from "@/components/app/primitives";
import { ConceptLink } from "./ConceptLink";
import {
  fmtPrice,
  rrRatio,
  statusLabel,
  type Signal,
} from "@/lib/data/signals";
import {
  Bell,
  Clock,
  Journal as JournalIcon,
  Target,
  TrendDown,
  TrendUp,
} from "@/components/ui/icons";

const marketLabel: Record<Signal["market"], string> = {
  crypto: "Crypto",
  stocks: "Stocks",
  fx: "Forex",
};

/** Split a reasoning step's text and inject a ConceptLink for its concept term. */
function ReasoningText({ text, concept }: { text: string; concept?: string }) {
  if (!concept) return <>{text}</>;
  return (
    <>
      {text}{" "}
      <span className="text-[13px] text-[var(--ss-text-faint)]">
        (learn: <ConceptLink id={concept} />)
      </span>
    </>
  );
}

export function SignalDetail({ signal }: { signal: Signal }) {
  const isLong = signal.direction === "long";
  const closed = signal.status.startsWith("closed");

  return (
    <div className="ss-card overflow-hidden">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--ss-border)] p-5">
        <div className="flex items-center gap-3.5">
          <ConfidenceArc value={signal.confidence} size={54} strokeWidth={4} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                {signal.symbol}
              </h2>
              <Badge tone={isLong ? "profit" : "loss"} icon={isLong ? <TrendUp size={11} /> : <TrendDown size={11} />}>
                {signal.direction}
              </Badge>
            </div>
            <p className="mt-0.5 text-[12.5px] text-[var(--ss-text-muted)]">
              {signal.name} · {marketLabel[signal.market]} · {signal.timeframe}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="ss-eyebrow !text-[9px]">Confidence</p>
          <p className="font-display text-lg font-semibold text-[var(--ss-text)]">
            {confidenceTier(signal.confidence)}
          </p>
          <p className="mt-0.5 flex items-center justify-end gap-1 font-mono text-[10.5px] text-[var(--ss-text-faint)]">
            <Clock size={11} /> {signal.generatedAt}
          </p>
        </div>
      </div>

      {/* thesis */}
      <div className="border-b border-[var(--ss-border)] px-5 py-4">
        <p className="text-[14px] leading-relaxed text-[var(--ss-text)]">
          <span className="ss-eyebrow !text-[9px] mr-2 align-middle">Thesis</span>
          {signal.thesis}
        </p>
      </div>

      {/* chart */}
      <div className="border-b border-[var(--ss-border)] p-4">
        <CandleChart
          candles={signal.candles}
          markers={{
            entry: signal.entry,
            target: signal.target,
            stop: signal.stop,
            signalIndex: signal.signalIndex,
            direction: signal.direction,
          }}
          className="h-[240px] w-full"
          height={240}
          width={640}
        />
      </div>

      {/* levels */}
      <div className="grid grid-cols-2 divide-[var(--ss-border)] border-b border-[var(--ss-border)] sm:grid-cols-4 sm:divide-x">
        {[
          { label: "Entry", value: fmtPrice(signal.entry), color: "text-[var(--ss-accent)]" },
          { label: "Target", value: fmtPrice(signal.target), color: "text-[var(--ss-profit)]" },
          { label: "Stop", value: fmtPrice(signal.stop), color: "text-[var(--ss-loss)]" },
          { label: "R : R", value: rrRatio(signal), color: "text-[var(--ss-text)]" },
        ].map((lv) => (
          <div key={lv.label} className="px-5 py-3.5">
            <p className="ss-eyebrow !text-[9px]">{lv.label}</p>
            <p className={`ss-tabular mt-1 text-[17px] font-semibold ${lv.color}`}>{lv.value}</p>
          </div>
        ))}
      </div>

      {/* reasoning chain */}
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Target size={15} className="text-[var(--ss-accent)]" />
          <h3 className="font-display text-[14px] font-semibold tracking-tight">Why the AI called this</h3>
        </div>
        <ol className="space-y-3">
          {signal.reasoning.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="ss-tabular mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--ss-surface-active)] text-[10.5px] font-semibold text-[var(--ss-text-muted)]">
                {i + 1}
              </span>
              <p className="text-[13px] leading-relaxed text-[var(--ss-text-muted)]">
                <ReasoningText text={step.text} concept={step.concept} />
              </p>
            </li>
          ))}
        </ol>

        {/* indicators */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <span className="ss-eyebrow !text-[9px] mr-1">Signals used</span>
          {signal.indicators.map((ind) => (
            <span key={ind} className="ss-chip !py-0.5 !text-[10.5px]">
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* result / actions */}
      {closed ? (
        <div className="flex items-center justify-between border-t border-[var(--ss-border)] bg-[var(--ss-surface)] px-5 py-3.5">
          <span className="ss-eyebrow !text-[9px]">Outcome · {statusLabel(signal.status)}</span>
          <span
            className={`ss-tabular text-[15px] font-semibold ${
              (signal.resultPct ?? 0) >= 0 ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]"
            }`}
          >
            {(signal.resultPct ?? 0) >= 0 ? "+" : ""}
            {signal.resultPct?.toFixed(1)}%
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2.5 border-t border-[var(--ss-border)] p-4">
          <Link href="/journal?new=1" className="ss-btn ss-btn-primary flex-1 py-2 text-[13px]">
            <JournalIcon size={15} /> Log this trade
          </Link>
          <button type="button" className="ss-btn ss-btn-ghost px-4 py-2 text-[13px]">
            <Bell size={15} /> Alert me
          </button>
        </div>
      )}
    </div>
  );
}
