"use client";

import { Badge, StatTile } from "@/components/app/primitives";
import { cn } from "@/components/ui/cn";
import {
  activityFeed,
  automationStats as st,
  type ActivityKind,
  type Strategy,
  type StrategyStatus,
} from "@/lib/data/automation";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  Link2,
  Lock,
  Pause,
  Play,
  ShieldCheck,
  StopCircle,
  X,
} from "@/components/ui/icons";

const statusMeta: Record<StrategyStatus, { label: string; tone: "profit" | "gold" | "neutral" }> = {
  live: { label: "Live", tone: "profit" },
  paused: { label: "Paused", tone: "gold" },
  locked: { label: "Locked", tone: "gold" },
  draft: { label: "Draft", tone: "neutral" },
};

const kindMeta: Record<ActivityKind, { color: string; icon: React.ReactNode }> = {
  entry: { color: "var(--ss-accent)", icon: <ArrowRight size={12} /> },
  exit: { color: "var(--ss-profit)", icon: <Check size={12} /> },
  blocked: { color: "var(--ss-loss)", icon: <X size={12} /> },
  info: { color: "var(--ss-text-faint)", icon: <ShieldCheck size={12} /> },
};

function StrategyRow({
  s,
  killed,
  onToggle,
  onBacktest,
}: {
  s: Strategy;
  killed: boolean;
  onToggle: (id: string) => void;
  onBacktest: () => void;
}) {
  const meta = statusMeta[s.status];
  const locked = s.status === "locked";
  const live = s.status === "live" && !killed;

  return (
    <div className={cn("ss-card p-4", killed && s.status === "live" && "opacity-70")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              locked ? "bg-[var(--ss-gold-dim)] text-[var(--ss-gold)]" : "bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]"
            )}
          >
            {locked ? <Lock size={16} /> : <Bot size={16} />}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-[14.5px] font-semibold tracking-tight">{s.name}</h3>
              <Badge tone={killed && s.status === "live" ? "loss" : meta.tone}>
                {killed && s.status === "live" ? "Halted" : meta.label}
              </Badge>
            </div>
            <p className="mt-0.5 font-mono text-[10.5px] text-[var(--ss-text-faint)]">
              {s.symbol} · {s.timeframe} · {s.since}
            </p>
          </div>
        </div>

        {locked ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ss-border)] px-3 py-1.5 font-mono text-[11px] text-[var(--ss-text-muted)]">
            <Lock size={13} /> Mastery {s.mastery.done}/{s.mastery.total}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onToggle(s.id)}
            disabled={killed}
            className={cn(
              "ss-btn px-3.5 py-1.5 text-[12.5px] disabled:opacity-40",
              live ? "ss-btn-ghost" : "ss-btn-primary"
            )}
          >
            {live ? (
              <>
                <Pause size={14} /> Pause
              </>
            ) : (
              <>
                <Play size={14} /> Start
              </>
            )}
          </button>
        )}
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">{s.description}</p>

      {/* rule chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[10.5px]">
        {s.rules.map((r, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            {r.kind !== "IF" && (
              <span className="text-[var(--ss-text-faint)]">{r.kind === "THEN" ? "→" : r.kind}</span>
            )}
            {r.kind === "IF" && <span className="rounded bg-[var(--ss-surface-active)] px-1.5 py-0.5 text-[var(--ss-text-faint)]">IF</span>}
            <span
              className={cn(
                "rounded border px-2 py-0.5",
                r.tone === "profit"
                  ? "border-[var(--ss-profit)]/30 bg-[var(--ss-profit-dim)] font-semibold text-[var(--ss-profit)]"
                  : r.tone === "loss"
                    ? "border-[var(--ss-loss)]/30 bg-[var(--ss-loss-dim)] font-semibold text-[var(--ss-loss)]"
                    : "border-[var(--ss-border)] bg-[var(--ss-surface)]"
              )}
            >
              {r.text}
            </span>
          </span>
        ))}
      </div>

      {/* mastery gate for locked */}
      {locked && (
        <div className="mt-3.5 rounded-lg border border-[var(--ss-gold)]/25 bg-[var(--ss-gold-dim)] p-3">
          <div className="mb-2 flex gap-1">
            {Array.from({ length: s.mastery.total }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i < s.mastery.done ? "bg-[var(--ss-gold)]" : "bg-[var(--ss-surface-active)]"
                )}
              />
            ))}
          </div>
          <p className="text-[11.5px] leading-relaxed text-[var(--ss-text-muted)]">
            Automation stays locked until you&rsquo;ve mastered this strategy. Remaining: 30 days of
            paper-trading with ≥ 80% plan adherence.
          </p>
        </div>
      )}

      {/* footer: perf + guardrails */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ss-border)] pt-3">
        {!locked ? (
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-[var(--ss-text-muted)]">{s.perf.trades} trades</span>
            <span className="text-[var(--ss-text-muted)]">{s.perf.winRate}% win</span>
            <span className={s.perf.pnlPct >= 0 ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]"}>
              {s.perf.pnlPct >= 0 ? "+" : ""}
              {s.perf.pnlPct}%
            </span>
          </div>
        ) : (
          <span className="font-mono text-[11px] text-[var(--ss-text-faint)]">Not yet traded live</span>
        )}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[var(--ss-text-faint)]">
            <ShieldCheck size={12} className="text-[var(--ss-accent)]" /> Max DD {s.guardrails.maxDrawdown} · cap{" "}
            {s.guardrails.dailyLossCap}
          </span>
          <button
            type="button"
            onClick={onBacktest}
            className="font-mono text-[10.5px] font-semibold text-[var(--ss-accent)] hover:underline"
          >
            Backtest →
          </button>
        </div>
      </div>
    </div>
  );
}

export function ControlPanel({
  strategies,
  killed,
  onToggle,
  onToggleKill,
  brokerConnected,
  onOpenBroker,
  onGoBacktest,
}: {
  strategies: Strategy[];
  killed: boolean;
  onToggle: (id: string) => void;
  onToggleKill: () => void;
  brokerConnected: boolean;
  onOpenBroker: () => void;
  onGoBacktest: () => void;
}) {
  const liveCount = strategies.filter((s) => s.status === "live").length;

  return (
    <div className="space-y-6">
      {/* broker banner */}
      <div
        className={cn(
          "ss-card flex flex-wrap items-center justify-between gap-3 p-4",
          brokerConnected ? "!border-[var(--ss-accent)]/25 !bg-[var(--ss-accent-dim)]" : ""
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              brokerConnected ? "bg-[var(--ss-accent)] text-[var(--ss-accent-ink)]" : "bg-[var(--ss-surface-active)] text-[var(--ss-text-muted)]"
            )}
          >
            <Link2 size={16} />
          </span>
          <div>
            <p className="text-[13.5px] font-semibold">
              {brokerConnected ? "Binance connected · trade permissions" : "No broker connected"}
            </p>
            <p className="text-[12px] text-[var(--ss-text-muted)]">
              {brokerConnected
                ? "Automations can place orders on your linked account. Revoke anytime."
                : "Connect a broker to let mastered strategies place orders for you. (Demo — no real keys.)"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenBroker}
          className={cn("ss-btn px-4 py-2 text-[13px]", brokerConnected ? "ss-btn-ghost" : "ss-btn-primary")}
        >
          {brokerConnected ? "Manage" : "Connect broker"}
        </button>
      </div>

      {/* KPIs + kill switch */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Live strategies" value={killed ? 0 : liveCount} sub={killed ? "halted" : "running"} />
        <StatTile label="Today · automated" value={`+$${st.todayPnl}`} tone="profit" />
        <StatTile label="Open risk" value={killed ? "0%" : st.openRisk} sub="of equity" />
        <div className={cn("ss-card flex flex-col justify-between p-4", killed && "!border-[var(--ss-loss)]/40 !bg-[var(--ss-loss-dim)]")}>
          <p className="ss-eyebrow !text-[9.5px] flex items-center gap-1.5">
            <AlertTriangle size={12} className={killed ? "text-[var(--ss-loss)]" : "text-[var(--ss-accent)]"} />
            Kill switch
          </p>
          <button
            type="button"
            onClick={onToggleKill}
            className={cn(
              "ss-btn mt-2 w-full py-2 text-[13px] font-semibold",
              killed ? "ss-btn-ghost !text-[var(--ss-accent)]" : ""
            )}
            style={killed ? undefined : { background: "var(--ss-loss)", color: "#fff" }}
          >
            {killed ? (
              <>
                <Play size={14} /> Resume all
              </>
            ) : (
              <>
                <StopCircle size={15} /> Halt everything
              </>
            )}
          </button>
        </div>
      </div>

      {killed && (
        <div className="ss-card flex items-center gap-2.5 border !border-[var(--ss-loss)]/30 !bg-[var(--ss-loss-dim)] p-3.5">
          <AlertTriangle size={16} className="shrink-0 text-[var(--ss-loss)]" />
          <p className="text-[13px] text-[var(--ss-text-muted)]">
            <span className="font-semibold text-[var(--ss-loss)]">Kill switch engaged.</span> All
            automations are halted and no new orders will be placed. Open positions are left untouched.
          </p>
        </div>
      )}

      {/* strategies + activity */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[15px] font-semibold tracking-tight">Your strategies</h2>
            <span className="font-mono text-[11px] text-[var(--ss-text-faint)]">
              {strategies.length} total
            </span>
          </div>
          {strategies.map((s) => (
            <StrategyRow key={s.id} s={s} killed={killed} onToggle={onToggle} onBacktest={onGoBacktest} />
          ))}
        </div>

        {/* live activity feed */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="ss-live-dot h-2 w-2 rounded-full bg-[var(--ss-accent)]" />
            <h2 className="font-display text-[15px] font-semibold tracking-tight">Live activity</h2>
          </div>
          <div className="ss-card overflow-hidden">
            <ul className="ss-scroll max-h-[520px] overflow-y-auto">
              {activityFeed.map((e, i) => {
                const m = kindMeta[e.kind];
                return (
                  <li
                    key={e.id}
                    className={cn("flex gap-3 px-4 py-3", i < activityFeed.length - 1 && "border-b border-[var(--ss-border)]")}
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `color-mix(in srgb, ${m.color} 16%, transparent)`, color: m.color }}
                    >
                      {m.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-mono text-[10px] uppercase tracking-wider text-[var(--ss-text-faint)]">
                          {e.strategy}
                        </span>
                        <span className="ss-tabular shrink-0 font-mono text-[10px] text-[var(--ss-text-faint)]">
                          {e.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] leading-snug text-[var(--ss-text-muted)]">
                        {e.text}
                        {e.pnl && (
                          <span className="ss-tabular ml-1 font-semibold text-[var(--ss-profit)]">{e.pnl}</span>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
