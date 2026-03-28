"use client";

import type { LearningBeat, PersonalityAxis } from "@/lib/mock-data";
import { insightSummary } from "@/lib/mock-data";

export function CoachView({ beats, axes }: { beats: LearningBeat[]; axes: PersonalityAxis[] }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ss-text-faint)]">AI learning &amp; memory</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ss-text)] md:text-2xl">Coach</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          The model’s posterior over <em className="not-italic text-[var(--ss-text)]">you</em> — not the market. Every suggestion carries a confidence trace tied to your trades.
        </p>
      </div>

      <div className="ss-card ss-card-focus border-[var(--ss-violet)]/20 bg-gradient-to-br from-[var(--ss-violet-dim)]/30 to-transparent p-5 md:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ss-violet)]">Synthesis</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ss-text-muted)]">{insightSummary}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ss-card p-5">
          <p className="text-xs font-medium text-[var(--ss-text)]">Learning timeline</p>
          <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">What changed in the model’s view of your behavior</p>
          <ul className="mt-5 space-y-4">
            {beats.map((b) => (
              <li key={b.id} className="relative border-l border-[var(--ss-border)] pl-4">
                <span className="absolute -left-px top-1.5 size-2 -translate-x-1/2 rounded-full bg-[var(--ss-accent)]" />
                <p className="font-mono text-[10px] text-[var(--ss-text-faint)]">{b.time}</p>
                <p className="mt-1 text-sm font-medium text-[var(--ss-text)]">{b.title}</p>
                <p className="mt-1 text-xs text-[var(--ss-text-muted)]">{b.detail}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-[var(--ss-text-faint)]">Confidence</span>
                  <div className="h-1.5 flex-1 max-w-[120px] overflow-hidden rounded-full bg-[var(--ss-bg)]">
                    <div
                      className="h-full rounded-full bg-[var(--ss-accent)] transition-all duration-500"
                      style={{ width: `${Math.round(b.confidence * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[var(--ss-accent)]">{(b.confidence * 100).toFixed(0)}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="ss-card p-5">
          <p className="text-xs font-medium text-[var(--ss-text)]">Trading personality</p>
          <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Axes are interpretable — not black-box scores</p>
          <div className="mt-6 space-y-5">
            {axes.map((a) => (
              <div key={a.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--ss-text)]">{a.label}</span>
                  <span className="font-mono text-[var(--ss-text-muted)]">{a.score}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--ss-bg)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--ss-accent)] to-[var(--ss-violet)]"
                    style={{ width: `${a.score}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[var(--ss-text-faint)]">{a.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
