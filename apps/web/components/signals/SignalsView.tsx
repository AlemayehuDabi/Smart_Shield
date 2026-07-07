"use client";

import { useMemo, useState } from "react";
import { PageHeader, StatTile } from "@/components/app/primitives";
import { Segmented } from "@/components/app/Segmented";
import { SignalCard } from "./SignalCard";
import { SignalDetail } from "./SignalDetail";
import { signals, type Market, type Signal } from "@/lib/data/signals";
import { Filter, Info } from "@/components/ui/icons";

type MarketFilter = "all" | Market;
type StatusFilter = "all" | "active" | "watching" | "closed";

const marketOpts: { value: MarketFilter; label: string }[] = [
  { value: "all", label: "All markets" },
  { value: "crypto", label: "Crypto" },
  { value: "stocks", label: "Stocks" },
  { value: "fx", label: "Forex" },
];

const statusOpts: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "watching", label: "Watching" },
  { value: "closed", label: "Closed" },
];

function matchStatus(s: Signal, f: StatusFilter): boolean {
  if (f === "all") return true;
  if (f === "closed") return s.status.startsWith("closed");
  return s.status === f;
}

export function SignalsView() {
  const [market, setMarket] = useState<MarketFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string>(signals[0].id);

  const filtered = useMemo(
    () =>
      signals.filter(
        (s) => (market === "all" || s.market === market) && matchStatus(s, status)
      ),
    [market, status]
  );

  const selected =
    filtered.find((s) => s.id === selectedId) ?? filtered[0] ?? signals[0];

  const activeCount = signals.filter((s) => s.status === "active").length;
  const avgConf = Math.round(
    signals.filter((s) => !s.status.startsWith("closed")).reduce((a, s) => a + s.confidence, 0) /
      signals.filter((s) => !s.status.startsWith("closed")).length
  );
  const closed = signals.filter((s) => s.status.startsWith("closed"));
  const wins = closed.filter((s) => (s.resultPct ?? 0) > 0).length;
  const winRate = Math.round((wins / closed.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pillar 01 · AI signal engine"
        title="Signals"
        subtitle="Every call comes with the reasoning behind it — and the concepts to learn it. We never touch your funds."
        actions={
          <a href="/learn" className="ss-btn ss-btn-ghost hidden px-3.5 py-2 text-[13px] sm:inline-flex">
            <Info size={15} /> How signals work
          </a>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Active now" value={activeCount} sub="live setups" />
        <StatTile label="Avg confidence" value={`${avgConf}%`} sub="open signals" />
        <StatTile label="Win rate · 90d" value={`${winRate}%`} delta={4.2} />
        <StatTile label="Median R : R" value="2.4:1" sub="published setups" />
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex items-center gap-1.5 text-[var(--ss-text-faint)]">
          <Filter size={15} />
        </span>
        <Segmented options={marketOpts} value={market} onChange={setMarket} size="sm" />
        <Segmented options={statusOpts} value={status} onChange={setStatus} size="sm" />
        <span className="ml-auto font-mono text-[11px] text-[var(--ss-text-faint)]">
          {filtered.length} signal{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* master-detail */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <div className="ss-scroll max-h-none space-y-3 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:pr-1">
          {filtered.length === 0 ? (
            <div className="ss-card p-8 text-center text-[13px] text-[var(--ss-text-muted)]">
              No signals match these filters.
            </div>
          ) : (
            filtered.map((s) => (
              <SignalCard
                key={s.id}
                signal={s}
                active={s.id === selected.id}
                onSelect={setSelectedId}
              />
            ))
          )}
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <SignalDetail signal={selected} />
        </div>
      </div>
    </div>
  );
}
