"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";

function Toggle({
  label,
  description,
  defaultOn,
}: {
  label: string;
  description: string;
  defaultOn: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-[var(--ss-text)]">{label}</p>
        <p className="mt-1 text-xs text-[var(--ss-text-muted)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full border transition",
          on
            ? "border-[rgba(94,234,212,0.4)] bg-[var(--ss-accent-dim)]"
            : "border-[var(--ss-border)] bg-[var(--ss-surface)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-6 rounded-full bg-[var(--ss-text)] transition-transform",
            on ? "left-5" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded border border-[var(--ss-border)] bg-[var(--ss-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ss-text-muted)]">
      {children}
    </kbd>
  );
}

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ss-text-faint)]">Workspace</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ss-text)] md:text-2xl">Settings</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          Execution guardrails, coach voice, and alert policy — same knobs prop traders expect, wired to the AI loop.
        </p>
      </div>

      <div className="ss-card px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ss-text-faint)]">Power shortcuts</p>
        <p className="mt-2 text-xs text-[var(--ss-text-muted)]">Illustrative — wire to command palette in production.</p>
        <ul className="mt-4 grid gap-2 text-xs text-[var(--ss-text)] sm:grid-cols-2">
          <li className="flex items-center justify-between gap-2 rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)]/40 px-3 py-2">
            <span>Focus order ticket</span>
            <Kbd>⌘</Kbd> + <Kbd>O</Kbd>
          </li>
          <li className="flex items-center justify-between gap-2 rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)]/40 px-3 py-2">
            <span>Toggle copilot</span>
            <Kbd>⌘</Kbd> + <Kbd>J</Kbd>
          </li>
          <li className="flex items-center justify-between gap-2 rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)]/40 px-3 py-2">
            <span>Paper / live</span>
            <Kbd>⌘</Kbd> + <Kbd>⇧</Kbd> + <Kbd>P</Kbd>
          </li>
          <li className="flex items-center justify-between gap-2 rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)]/40 px-3 py-2">
            <span>Flatten book (confirm)</span>
            <Kbd>⌘</Kbd> + <Kbd>⌫</Kbd>
          </li>
        </ul>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ss-card divide-y divide-[var(--ss-border)] px-5">
          <p className="py-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--ss-text-faint)]">Coach &amp; AI</p>
          <Toggle
            label="Pre-trade friction on size outliers"
            description="Extra confirm step when draft size &gt; statistical band."
            defaultOn
          />
          <Toggle
            label="Post-trade auto-journal"
            description="Every fill gets a draft note with behavior tags."
            defaultOn
          />
          <Toggle
            label="Verbose model traces"
            description="Show confidence factors in copilot (more tokens)."
            defaultOn={false}
          />
        </div>

        <div className="ss-card divide-y divide-[var(--ss-border)] px-5">
          <p className="py-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--ss-text-faint)]">Alerts</p>
          <Toggle label="Vol &amp; correlation bursts" description="Smart batching — no spam." defaultOn />
          <Toggle label="Daily performance digest" description="08:00 local with coach actions." defaultOn />
          <Toggle label="Mobile — critical only" description="Everything else in-app." defaultOn={false} />
        </div>
      </div>

      <div className="ss-card px-5 py-4">
        <label htmlFor="persona" className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ss-text-faint)]">
          Copilot voice
        </label>
        <select
          id="persona"
          className="mt-3 w-full max-w-md rounded-xl border border-[var(--ss-border)] bg-[var(--ss-bg-elevated)] px-3 py-2.5 text-sm text-[var(--ss-text)] focus:border-[var(--ss-accent)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--ss-accent)]/20"
          defaultValue="operator"
        >
          <option value="operator">Desk — fast, imperative</option>
          <option value="mentor">Mentor — Socratic, fewer trades</option>
          <option value="quant">Quant — stats-forward</option>
        </select>
      </div>
    </div>
  );
}
