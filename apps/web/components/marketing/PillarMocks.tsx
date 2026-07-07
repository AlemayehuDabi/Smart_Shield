import { AreaLine } from "@/components/charts/AreaLine";
import { ConfidenceArc } from "@/components/charts/ConfidenceArc";
import { genSeries } from "@/lib/data/market";
import { cn } from "@/components/ui/cn";
import {
  AlertTriangle,
  Check,
  GraduationCap,
  Lock,
  Play,
  TrendDown,
  TrendUp,
} from "@/components/ui/icons";

/* ————— Pillar 1 · Signals: the feed ————— */

const feedRows = [
  { sym: "BTC/USDT", dir: "long", conf: 84, note: "Bullish divergence at 3×-tested support", time: "12m" },
  { sym: "NVDA", dir: "long", conf: 76, note: "Volatility squeeze under all-time highs", time: "1h" },
  { sym: "ETH/USDT", dir: "short", conf: 68, note: "Fourth rejection at supply, momentum rolling", time: "26m" },
] as const;

export function SignalsFeedMock() {
  return (
    <div className="ss-panel overflow-hidden rounded-2xl">
      <div className="flex items-center gap-1.5 border-b border-[var(--ss-border)] px-4 py-2.5">
        {["All", "Crypto", "Stocks", "FX"].map((f, i) => (
          <span
            key={f}
            className={cn(
              "rounded-md px-2 py-1 font-mono text-[10px] font-medium",
              i === 0
                ? "bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]"
                : "text-[var(--ss-text-faint)]"
            )}
          >
            {f}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-[var(--ss-accent)]">
          <span className="ss-live-dot h-1.5 w-1.5 rounded-full bg-[var(--ss-accent)]" /> 3 active
        </span>
      </div>
      <ul>
        {feedRows.map((r, i) => (
          <li
            key={r.sym}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              i < feedRows.length - 1 && "border-b border-[var(--ss-border)]"
            )}
          >
            <ConfidenceArc value={r.conf} size={38} strokeWidth={3.5} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-[13px] font-semibold tracking-tight">{r.sym}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-1.5 py-px font-mono text-[9px] font-semibold uppercase tracking-wider",
                    r.dir === "long"
                      ? "bg-[var(--ss-profit-dim)] text-[var(--ss-profit)]"
                      : "bg-[var(--ss-loss-dim)] text-[var(--ss-loss)]"
                  )}
                >
                  {r.dir === "long" ? <TrendUp size={10} /> : <TrendDown size={10} />}
                  {r.dir}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[11.5px] text-[var(--ss-text-muted)]">{r.note}</p>
            </div>
            <span className="font-mono text-[10px] text-[var(--ss-text-faint)]">{r.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ————— Pillar 2 · Portfolio: equity vs benchmark + coach ————— */

const you = genSeries(7, 40, { base: 100, drift: 0.004, vol: 0.02 });
const spy = genSeries(11, 40, { base: 100, drift: 0.0018, vol: 0.011 });

export function PortfolioMock() {
  return (
    <div className="ss-panel overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-[var(--ss-border)] px-4 py-2.5">
        <span className="ss-eyebrow !text-[9.5px]">Equity curve · 90d</span>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="flex items-center gap-1.5 text-[var(--ss-text-muted)]">
            <span className="h-[3px] w-4 rounded-full bg-[var(--ss-chart-1)]" /> You +18.4%
          </span>
          <span className="flex items-center gap-1.5 text-[var(--ss-text-faint)]">
            <span className="h-[3px] w-4 rounded-full bg-[var(--ss-chart-neutral)]" /> SPY +6.1%
          </span>
        </div>
      </div>
      <div className="px-2 pt-2">
        <AreaLine
          uid="pf-mock"
          series={[
            { points: you, color: "var(--ss-chart-1)", fill: true, label: "Your portfolio" },
            { points: spy, color: "var(--ss-chart-neutral)", dashed: true, label: "SPY benchmark" },
          ]}
          height={150}
          className="h-auto w-full"
        />
      </div>
      <div className="grid grid-cols-3 divide-x divide-[var(--ss-border)] border-t border-[var(--ss-border)]">
        {(
          [
            ["Win rate", "58%", "up"],
            ["Expectancy", "+$142/trade", "up"],
            ["Max drawdown", "−7.2%", null],
          ] as const
        ).map(([label, val]) => (
          <div key={label} className="px-3 py-2.5 text-center">
            <p className="font-mono text-[8.5px] uppercase tracking-widest text-[var(--ss-text-faint)]">
              {label}
            </p>
            <p className="ss-tabular mt-0.5 text-[13px] font-semibold">{val}</p>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-2.5 border-t border-[var(--ss-border)] bg-[var(--ss-surface)] px-4 py-3">
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--ss-gold)]" />
        <p className="text-[11.5px] leading-relaxed text-[var(--ss-text-muted)]">
          <span className="font-semibold text-[var(--ss-text)]">Coach:</span> your average loser runs{" "}
          <span className="ss-tabular font-semibold text-[var(--ss-loss)]">2.9×</span> longer than your
          average winner. You&rsquo;re cutting flowers and watering weeds.
        </p>
      </div>
    </div>
  );
}

/* ————— Pillar 3 · Education: lesson-in-context ————— */

export function EducationMock() {
  return (
    <div className="ss-panel overflow-hidden rounded-2xl">
      <div className="border-b border-[var(--ss-border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="ss-eyebrow !text-[9.5px] !text-[var(--ss-violet)]">
            Track · Reading momentum
          </span>
          <span className="ss-tabular text-[10.5px] text-[var(--ss-text-faint)]">7 of 11 lessons</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--ss-surface-active)]">
          <div className="h-full w-[64%] rounded-full bg-[var(--ss-violet)]" />
        </div>
      </div>

      <div className="space-y-2.5 p-4">
        <p className="text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">
          This signal fired on{" "}
          <span className="border-b border-dashed border-[var(--ss-violet)] font-medium text-[var(--ss-violet)]">
            RSI divergence
          </span>{" "}
          — a term you haven&rsquo;t studied yet.
        </p>

        {/* the in-context tooltip, expanded */}
        <div className="rounded-xl border border-[var(--ss-violet)]/30 bg-[var(--ss-violet-dim)] p-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--ss-violet)]/20 text-[var(--ss-violet)]">
              <GraduationCap size={13} />
            </span>
            <p className="text-[12px] font-semibold">RSI Divergence — 3 min</p>
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--ss-text-muted)]">
            When price makes a new low but momentum doesn&rsquo;t, sellers are exhausting. You&rsquo;ll
            learn to spot it on the exact chart that triggered this signal.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--ss-violet)] px-2.5 py-1 text-[10.5px] font-semibold text-white">
              <Play size={11} /> Start lesson
            </span>
            <span className="font-mono text-[9.5px] text-[var(--ss-text-faint)]">
              +40 XP · counts toward automation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {["Support & resistance", "EMA basics", "Risk : reward"].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--ss-border)] px-2 py-1 font-mono text-[9px] text-[var(--ss-text-muted)]"
            >
              <Check size={10} className="text-[var(--ss-violet)]" /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ————— Pillar 4 · Automation: earned, guarded ————— */

export function AutomationMock() {
  return (
    <div className="ss-panel overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-[var(--ss-border)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ss-gold-dim)] text-[var(--ss-gold)]">
            <Lock size={15} />
          </span>
          <div>
            <p className="text-[13px] font-semibold">Mean-reversion · BTC 4H</p>
            <p className="font-mono text-[9.5px] uppercase tracking-widest text-[var(--ss-text-faint)]">
              Your strategy · draft #3
            </p>
          </div>
        </div>
        <span className="rounded-md bg-[var(--ss-gold-dim)] px-2 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-[var(--ss-gold)]">
          Locked
        </span>
      </div>

      {/* rule chips */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-3.5 font-mono text-[10.5px]">
        <span className="rounded-md bg-[var(--ss-surface-active)] px-2 py-1 text-[var(--ss-text-faint)]">IF</span>
        <span className="rounded-md border border-[var(--ss-border)] bg-[var(--ss-surface)] px-2 py-1">RSI(14) &lt; 30</span>
        <span className="rounded-md bg-[var(--ss-surface-active)] px-2 py-1 text-[var(--ss-text-faint)]">AND</span>
        <span className="rounded-md border border-[var(--ss-border)] bg-[var(--ss-surface)] px-2 py-1">price &gt; EMA(200)</span>
        <span className="rounded-md bg-[var(--ss-surface-active)] px-2 py-1 text-[var(--ss-text-faint)]">→</span>
        <span className="rounded-md border border-[var(--ss-profit)]/30 bg-[var(--ss-profit-dim)] px-2 py-1 font-semibold text-[var(--ss-profit)]">
          LONG · risk 1%
        </span>
      </div>

      {/* mastery gate */}
      <div className="border-t border-[var(--ss-border)] px-4 py-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[11.5px] font-medium text-[var(--ss-text-muted)]">Mastery to unlock live</p>
          <p className="ss-tabular text-[11px] font-semibold text-[var(--ss-gold)]">4 of 5</p>
        </div>
        <div className="mt-2 flex gap-1">
          {[1, 1, 1, 1, 0].map((done, i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                done ? "bg-[var(--ss-gold)]" : "bg-[var(--ss-surface-active)]"
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-[var(--ss-text-faint)]">
          Remaining: 30 days of paper-trading this strategy with plan-adherence ≥ 80%.
        </p>
      </div>

      {/* guardrails */}
      <div className="flex items-center justify-between border-t border-[var(--ss-border)] bg-[var(--ss-surface)] px-4 py-2.5">
        <div className="flex items-center gap-3 font-mono text-[9.5px] text-[var(--ss-text-muted)]">
          <span>Max DD −5%</span>
          <span className="text-[var(--ss-border-strong)]">|</span>
          <span>Daily loss cap $250</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ss-loss)]/30 px-2 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-[var(--ss-loss)]">
          Kill switch
        </span>
      </div>
    </div>
  );
}
