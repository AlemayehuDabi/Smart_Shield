"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, PageHeader, Progress, StatTile } from "@/components/app/primitives";
import { Segmented } from "@/components/app/Segmented";
import { Modal } from "@/components/app/Modal";
import { TradeForm } from "./TradeForm";
import { cn } from "@/components/ui/cn";
import {
  fmtUsd,
  trades as seedTrades,
  type Trade,
  type TradeStatus,
} from "@/lib/data/portfolio";
import { Plus, Search, Sparkles, TrendDown, TrendUp } from "@/components/ui/icons";

type StatusFilter = "all" | "open" | "win" | "loss";

const statusTone: Record<TradeStatus, "profit" | "loss" | "neutral" | "accent"> = {
  win: "profit",
  loss: "loss",
  breakeven: "neutral",
  open: "accent",
};
const statusText: Record<TradeStatus, string> = {
  win: "Win",
  loss: "Loss",
  breakeven: "B/E",
  open: "Open",
};

/** Deterministic mock "AI trade review". */
function aiReview(t: Trade): string {
  if (t.status === "open") {
    return `Position still open. You logged this as a "${t.setup}" with ${t.adherence}% plan adherence — stay mechanical and let the thesis play out. Don't move your stop up on hope.`;
  }
  if (t.emotion === "Revenge" || t.emotion === "FOMO") {
    return `This was flagged "${t.emotion}" with only ${t.adherence}% adherence. The setup ("${t.setup}") may be valid, but the entry wasn't earned — you acted on emotion, not on your plan. This is your single highest-leverage habit to fix.`;
  }
  if ((t.pnlPct ?? 0) < 0 && t.adherence >= 75) {
    return `A losing trade that followed the plan (${t.adherence}% adherence) is a good trade. The "${t.setup}" thesis didn't play out and your stop capped the damage at ${t.rMultiple ?? -1}R. Nothing to change here — repeat the process.`;
  }
  return `Clean execution: "${t.setup}", ${t.adherence}% adherence, ${t.emotion.toLowerCase()} mindset, closed for ${t.rMultiple ?? "+"}R. This is your edge — do more of exactly this.`;
}

export function JournalView() {
  const params = useSearchParams();
  const [list, setList] = useState<Trade[]>(seedTrades);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Trade | null>(null);
  const [creating, setCreating] = useState(params.get("new") === "1");
  const [viewing, setViewing] = useState<Trade | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      list.filter((t) => {
        const s =
          status === "all" ||
          (status === "open" && t.status === "open") ||
          (status === "win" && t.status === "win") ||
          (status === "loss" && t.status === "loss");
        const q = query.trim().toLowerCase();
        const m = !q || t.symbol.toLowerCase().includes(q) || t.setup.toLowerCase().includes(q);
        return s && m;
      }),
    [list, status, query]
  );

  const closed = list.filter((t) => t.status !== "open");
  const realized = closed.reduce((a, t) => a + (t.pnl ?? 0), 0);
  const wins = closed.filter((t) => t.status === "win").length;
  const winRate = closed.length ? Math.round((wins / closed.length) * 100) : 0;
  const avgR =
    closed.length
      ? closed.reduce((a, t) => a + (t.rMultiple ?? 0), 0) / closed.length
      : 0;
  const avgAdherence = list.length
    ? Math.round(list.reduce((a, t) => a + t.adherence, 0) / list.length)
    : 0;

  function upsert(t: Trade) {
    setList((prev) => {
      const exists = prev.some((x) => x.id === t.id);
      return exists ? prev.map((x) => (x.id === t.id ? t : x)) : [t, ...prev];
    });
    setCreating(false);
    setEditing(null);
  }
  function remove(id: string) {
    setList((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
    if (viewing?.id === id) setViewing(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pillar 02 · Trade journal"
        title="Journal"
        subtitle="Every trade you log makes your coach sharper. Tag the setup, the feeling, and how closely you followed your plan."
        actions={
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="ss-btn ss-btn-primary px-4 py-2 text-[13px]"
          >
            <Plus size={15} /> Log a trade
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Realized P&L" value={fmtUsd(realized, { sign: true })} tone={realized >= 0 ? "profit" : "loss"} sub={`${closed.length} closed`} />
        <StatTile label="Win rate" value={`${winRate}%`} sub={`${wins} of ${closed.length}`} />
        <StatTile label="Avg R multiple" value={`${avgR >= 0 ? "+" : ""}${avgR.toFixed(1)}R`} tone={avgR >= 0 ? "profit" : "loss"} />
        <StatTile label="Plan adherence" value={`${avgAdherence}%`} sub="across all trades" />
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Segmented
          options={[
            { value: "all", label: "All", count: list.length },
            { value: "open", label: "Open", count: list.filter((t) => t.status === "open").length },
            { value: "win", label: "Wins", count: list.filter((t) => t.status === "win").length },
            { value: "loss", label: "Losses", count: list.filter((t) => t.status === "loss").length },
          ]}
          value={status}
          onChange={setStatus}
          size="sm"
        />
        <div className="relative ml-auto w-full max-w-[220px]">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ss-text-faint)]" />
          <input
            className="ss-input !py-1.5 !pl-9 !text-[13px]"
            placeholder="Symbol or setup…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* table */}
      <div className="ss-card overflow-hidden">
        <div className="ss-scroll overflow-x-auto">
          <table className="ss-table min-w-[760px]">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Setup</th>
                <th>Mindset</th>
                <th className="text-right">Entry → Exit</th>
                <th className="text-right">P&amp;L</th>
                <th className="text-right">R</th>
                <th className="text-right">Adherence</th>
                <th className="text-right">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="group cursor-pointer" onClick={() => setViewing(t)}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[13px] font-semibold">{t.symbol}</span>
                      <Badge tone={t.direction === "long" ? "profit" : "loss"} icon={t.direction === "long" ? <TrendUp size={10} /> : <TrendDown size={10} />}>
                        {t.direction}
                      </Badge>
                    </div>
                  </td>
                  <td className="text-[var(--ss-text-muted)]">{t.setup}</td>
                  <td>
                    <span
                      className={cn(
                        "font-mono text-[11px]",
                        t.emotion === "Revenge" || t.emotion === "FOMO"
                          ? "text-[var(--ss-loss)]"
                          : "text-[var(--ss-text-muted)]"
                      )}
                    >
                      {t.emotion}
                    </span>
                  </td>
                  <td className="ss-tabular text-right text-[var(--ss-text-muted)]">
                    {t.entry}
                    {t.exit ? ` → ${t.exit}` : " → —"}
                  </td>
                  <td
                    className={cn(
                      "ss-tabular text-right font-semibold",
                      t.status === "open"
                        ? "text-[var(--ss-text-muted)]"
                        : (t.pnl ?? 0) >= 0
                          ? "text-[var(--ss-profit)]"
                          : "text-[var(--ss-loss)]"
                    )}
                  >
                    {t.status === "open"
                      ? `${(t.pnlPct ?? 0) >= 0 ? "+" : ""}${t.pnlPct ?? 0}%`
                      : fmtUsd(t.pnl ?? 0, { sign: true })}
                  </td>
                  <td
                    className={cn(
                      "ss-tabular text-right",
                      (t.rMultiple ?? 0) >= 0 ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]"
                    )}
                  >
                    {t.rMultiple != null ? `${t.rMultiple >= 0 ? "+" : ""}${t.rMultiple}R` : "—"}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden w-12 sm:block">
                        <Progress value={t.adherence} tone={t.adherence >= 75 ? "accent" : "gold"} />
                      </div>
                      <span className="ss-tabular text-[var(--ss-text-muted)]">{t.adherence}%</span>
                    </div>
                  </td>
                  <td className="ss-tabular text-right text-[var(--ss-text-faint)]">
                    {(t.closedAt ?? t.openedAt).slice(5)}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(t);
                        }}
                        className="rounded-md px-2 py-1 font-mono text-[10.5px] text-[var(--ss-text-muted)] hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(t.id);
                        }}
                        className="rounded-md px-2 py-1 font-mono text-[10.5px] text-[var(--ss-text-muted)] hover:bg-[var(--ss-loss-dim)] hover:text-[var(--ss-loss)]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-[13.5px] text-[var(--ss-text-muted)]">No trades match your filters.</p>
            <button type="button" onClick={() => setCreating(true)} className="ss-btn ss-btn-ghost mt-3 px-4 py-2 text-[13px]">
              <Plus size={15} /> Log your first trade
            </button>
          </div>
        )}
      </div>

      {/* create / edit */}
      <Modal
        open={creating || editing !== null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? "Edit trade" : "Log a trade"}
        subtitle={editing ? editing.symbol : "The more honest the tags, the better your coaching."}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="ss-btn ss-btn-ghost px-4 py-2 text-[13px]"
            >
              Cancel
            </button>
            <button type="submit" form="trade-form" className="ss-btn ss-btn-primary px-5 py-2 text-[13px]">
              {editing ? "Save changes" : "Save trade"}
            </button>
          </>
        }
      >
        <TradeForm initial={editing} formId="trade-form" onSave={upsert} />
      </Modal>

      {/* detail / AI review */}
      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing ? `${viewing.symbol} · ${viewing.setup}` : ""}
        subtitle={viewing ? `${viewing.direction.toUpperCase()} · ${statusText[viewing.status]}` : ""}
        size="lg"
        footer={
          viewing && (
            <>
              <button
                type="button"
                onClick={() => {
                  const t = viewing;
                  setViewing(null);
                  setEditing(t);
                }}
                className="ss-btn ss-btn-ghost px-4 py-2 text-[13px]"
              >
                Edit
              </button>
            </>
          )
        }
      >
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Entry", viewing.entry.toString()],
                ["Exit", viewing.exit?.toString() ?? "—"],
                ["Notional", fmtUsd(viewing.notional)],
                ["P&L", viewing.pnl != null ? fmtUsd(viewing.pnl, { sign: true }) : `${(viewing.pnlPct ?? 0) >= 0 ? "+" : ""}${viewing.pnlPct ?? 0}%`],
                ["R multiple", viewing.rMultiple != null ? `${viewing.rMultiple >= 0 ? "+" : ""}${viewing.rMultiple}R` : "—"],
                ["Adherence", `${viewing.adherence}%`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] p-3">
                  <p className="ss-eyebrow !text-[9px]">{k}</p>
                  <p className="ss-tabular mt-1 text-[14px] font-semibold">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Badge tone={statusTone[viewing.status]}>{statusText[viewing.status]}</Badge>
              <Badge tone={viewing.emotion === "Revenge" || viewing.emotion === "FOMO" ? "loss" : "neutral"}>
                {viewing.emotion}
              </Badge>
            </div>

            {viewing.notes && (
              <div>
                <p className="ss-eyebrow !text-[9px] mb-1.5">Your notes</p>
                <p className="text-[13px] leading-relaxed text-[var(--ss-text-muted)]">{viewing.notes}</p>
              </div>
            )}

            <div className="rounded-xl border border-[var(--ss-accent)]/25 bg-[var(--ss-accent-dim)] p-4">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[var(--ss-accent)]" />
                <p className="text-[12.5px] font-semibold">AI trade review</p>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">
                {aiReview(viewing)}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* delete confirm */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete this trade?"
        subtitle="This removes it from your journal and coaching stats."
        footer={
          <>
            <button type="button" onClick={() => setDeleteId(null)} className="ss-btn ss-btn-ghost px-4 py-2 text-[13px]">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteId && remove(deleteId)}
              className="ss-btn px-5 py-2 text-[13px] font-semibold"
              style={{ background: "var(--ss-loss)", color: "#fff" }}
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-[13px] text-[var(--ss-text-muted)]">
          You can&rsquo;t undo this in the demo. In production, deleted trades are archived for 30 days.
        </p>
      </Modal>
    </div>
  );
}
