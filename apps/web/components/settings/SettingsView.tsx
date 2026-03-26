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

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium tracking-tight text-[var(--ss-text)]">Settings</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          Tune how aggressive the shield is, how chatty it is, and what reaches your operators.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ss-card divide-y divide-[var(--ss-border)] px-5">
          <p className="py-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--ss-text-faint)]">
            AI behavior
          </p>
          <Toggle
            label="Executive-first summaries"
            description="Prefer crisp narratives over raw telemetry in copilot replies."
            defaultOn
          />
          <Toggle
            label="Auto-tighten on drift"
            description="Allow policy tightening when correlated risk crosses threshold."
            defaultOn
          />
          <Toggle
            label="Verbose reasoning traces"
            description="Include intermediate steps for auditors (slightly higher latency)."
            defaultOn={false}
          />
        </div>

        <div className="ss-card divide-y divide-[var(--ss-border)] px-5">
          <p className="py-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--ss-text-faint)]">
            Notifications
          </p>
          <Toggle label="Critical-only push" description="Suppress lower-severity mobile alerts." defaultOn={false} />
          <Toggle label="Digest at 08:00 local" description="Daily roll-up with suggested actions." defaultOn />
          <Toggle label="Slack bridge" description="Mirror high-priority items to your channel." defaultOn />
        </div>
      </div>

      <div className="ss-card px-5 py-4">
        <label htmlFor="persona" className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ss-text-faint)]">
          Response persona
        </label>
        <select
          id="persona"
          className="mt-3 w-full max-w-md rounded-xl border border-[var(--ss-border)] bg-[var(--ss-bg-elevated)] px-3 py-2.5 text-sm text-[var(--ss-text)] focus:border-[var(--ss-accent)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--ss-accent)]/20"
          defaultValue="operator"
        >
          <option value="operator">Operator — fast, imperative</option>
          <option value="executive">Executive — concise, decision-ready</option>
          <option value="analyst">Analyst — evidence-heavy</option>
        </select>
      </div>
    </div>
  );
}
