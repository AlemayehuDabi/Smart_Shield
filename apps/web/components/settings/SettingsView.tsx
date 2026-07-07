"use client";

import { useState } from "react";
import { PageHeader, Badge, Progress } from "@/components/app/primitives";
import { Toggle } from "@/components/app/Toggle";
import { Segmented } from "@/components/app/Segmented";
import { cn } from "@/components/ui/cn";
import { useTheme } from "@/components/theme/ThemeProvider";
import { plans, type PlanId } from "@/lib/data/plans";
import {
  Bell,
  Check,
  CreditCard,
  Link2,
  Moon,
  Sparkles,
  Sun,
  User,
} from "@/components/ui/icons";

type Section = "plan" | "account" | "notifications" | "appearance";

const nav: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "plan", label: "Plan & billing", icon: <CreditCard size={16} /> },
  { id: "account", label: "Account", icon: <User size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "appearance", label: "Appearance", icon: <Sparkles size={16} /> },
];

const currentPlan: PlanId = "pro";

export function SettingsView() {
  const [section, setSection] = useState<Section>("plan");

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="Settings" subtitle="Manage your plan, profile, and how Smart Shield talks to you." />

      <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* section nav */}
        <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
          {nav.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setSection(n.id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                section === n.id
                  ? "bg-[var(--ss-surface-active)] text-[var(--ss-text)]"
                  : "text-[var(--ss-text-muted)] hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)]"
              )}
            >
              <span className={section === n.id ? "text-[var(--ss-accent)]" : "text-[var(--ss-text-faint)]"}>
                {n.icon}
              </span>
              {n.label}
            </button>
          ))}
        </nav>

        <div>
          {section === "plan" && <PlanSection />}
          {section === "account" && <AccountSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "appearance" && <AppearanceSection />}
        </div>
      </div>
    </div>
  );
}

/* ————— Plan & billing ————— */
function PlanSection() {
  const [cycle, setCycle] = useState<"monthly" | "annual">("annual");

  return (
    <div className="space-y-6">
      {/* current plan */}
      <div className="ss-card border !border-[var(--ss-accent)]/25 !bg-[var(--ss-accent-dim)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="ss-eyebrow !text-[9.5px]">Current plan</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold tracking-tight">Operator</h2>
              <Badge tone="accent">Trial · 9 days left</Badge>
            </div>
            <p className="mt-1 text-[12.5px] text-[var(--ss-text-muted)]">
              Your trial converts to $24/mo (billed annually) on July 15, 2026.
            </p>
          </div>
          <button type="button" className="ss-btn ss-btn-primary px-4 py-2 text-[13px]">
            Add payment method
          </button>
        </div>
        <div className="mt-4 border-t border-[var(--ss-accent)]/15 pt-3.5">
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="text-[var(--ss-text-muted)]">Signals used this month</span>
            <span className="ss-tabular font-semibold">Unlimited</span>
          </div>
          <Progress value={100} />
        </div>
      </div>

      {/* cycle toggle */}
      <div className="flex items-center justify-center gap-3">
        <Segmented
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "annual", label: "Annual" },
          ]}
          value={cycle}
          onChange={setCycle}
          size="sm"
        />
        <span className="rounded-md bg-[var(--ss-accent-dim)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--ss-accent)]">
          Save ~17%
        </span>
      </div>

      {/* plans */}
      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((p) => {
          const price = cycle === "annual" ? p.annualMonthly : p.monthly;
          const isCurrent = p.id === currentPlan;
          return (
            <div
              key={p.id}
              className={cn(
                "ss-card flex flex-col p-5",
                p.highlight && "!border-[var(--ss-accent)]/40",
                p.id === "elite" && "!border-[var(--ss-gold)]/30"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[16px] font-semibold tracking-tight">{p.name}</h3>
                {p.highlight && <Badge tone="accent">Popular</Badge>}
                {p.id === "elite" && <Badge tone="gold">Automation</Badge>}
              </div>
              <p className="mt-1 text-[12px] text-[var(--ss-text-muted)]">{p.tagline}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="ss-tabular font-display text-[1.8rem] font-semibold tracking-tight">
                  ${price}
                </span>
                <span className="text-[12px] text-[var(--ss-text-faint)]">/mo</span>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex gap-2 text-[12px] text-[var(--ss-text-muted)]">
                    <Check size={14} className="mt-0.5 shrink-0 text-[var(--ss-accent)]" /> {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent}
                className={cn(
                  "ss-btn mt-4 w-full py-2 text-[13px]",
                  isCurrent ? "ss-btn-ghost !cursor-default" : p.highlight ? "ss-btn-primary" : "ss-btn-ghost"
                )}
              >
                {isCurrent ? "Current plan" : p.id === "free" ? "Downgrade" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>

      {/* invoices */}
      <section className="ss-card overflow-hidden">
        <header className="border-b border-[var(--ss-border)] px-5 py-3.5">
          <h3 className="font-display text-[14px] font-semibold tracking-tight">Billing history</h3>
        </header>
        <table className="ss-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Jun 15, 2026", "Operator · annual", "$288.00", "Paid"],
              ["May 15, 2026", "Operator · monthly", "$29.00", "Paid"],
              ["Apr 15, 2026", "Scout · free", "$0.00", "—"],
            ].map(([date, desc, amt, status]) => (
              <tr key={date}>
                <td className="ss-tabular text-[var(--ss-text-muted)]">{date}</td>
                <td>{desc}</td>
                <td className="ss-tabular text-right">{amt}</td>
                <td className="text-right">
                  {status === "Paid" ? <Badge tone="profit">Paid</Badge> : <span className="text-[var(--ss-text-faint)]">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ————— Account ————— */
function AccountSection() {
  return (
    <div className="space-y-6">
      <section className="ss-card p-5">
        <h3 className="font-display text-[14px] font-semibold tracking-tight">Profile</h3>
        <div className="mt-4 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--ss-accent)] to-[var(--ss-violet)] text-xl font-bold text-[var(--ss-accent-ink)]">
            AD
          </span>
          <button type="button" className="ss-btn ss-btn-ghost px-3.5 py-2 text-[12.5px]">
            Change photo
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="ss-label">Full name</span>
            <input className="ss-input" defaultValue="Alex Dabi" />
          </label>
          <label className="block">
            <span className="ss-label">Email</span>
            <input className="ss-input" type="email" defaultValue="alex@smartshield.app" />
          </label>
          <label className="block">
            <span className="ss-label">Timezone</span>
            <select className="ss-input" defaultValue="et">
              <option value="et">Eastern (ET) · UTC−5</option>
              <option value="pt">Pacific (PT) · UTC−8</option>
              <option value="utc">UTC</option>
              <option value="cet">Central Europe (CET) · UTC+1</option>
            </select>
          </label>
          <label className="block">
            <span className="ss-label">Base currency</span>
            <select className="ss-input" defaultValue="usd">
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
            </select>
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <button type="button" className="ss-btn ss-btn-primary px-4 py-2 text-[13px]">
            Save changes
          </button>
        </div>
      </section>

      <section className="ss-card p-5">
        <div className="flex items-center gap-2">
          <Link2 size={15} className="text-[var(--ss-accent)]" />
          <h3 className="font-display text-[14px] font-semibold tracking-tight">Connected brokers</h3>
        </div>
        <p className="mt-1.5 text-[12.5px] text-[var(--ss-text-muted)]">
          Connect a broker to sync analytics and enable automation.
        </p>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] p-3">
          <span className="text-[13px] text-[var(--ss-text-muted)]">No brokers connected</span>
          <a href="/automation" className="ss-btn ss-btn-ghost px-3.5 py-1.5 text-[12.5px]">
            Connect
          </a>
        </div>
      </section>

      <section className="ss-card border !border-[var(--ss-loss)]/25 p-5">
        <h3 className="font-display text-[14px] font-semibold tracking-tight text-[var(--ss-loss)]">
          Danger zone
        </h3>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12.5px] text-[var(--ss-text-muted)]">
            Permanently delete your account, journal, and progress.
          </p>
          <button
            type="button"
            className="ss-btn border border-[var(--ss-loss)]/40 px-4 py-2 text-[13px] font-semibold text-[var(--ss-loss)] hover:bg-[var(--ss-loss-dim)]"
          >
            Delete account
          </button>
        </div>
      </section>
    </div>
  );
}

/* ————— Notifications ————— */
function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    signals: true,
    coach: true,
    price: false,
    lessons: true,
    product: false,
    weekly: true,
  });
  const rows: { key: keyof typeof prefs; title: string; desc: string }[] = [
    { key: "signals", title: "New signal alerts", desc: "High-confidence setups in your markets." },
    { key: "coach", title: "Behavioral coach nudges", desc: "When the AI spots a habit worth flagging." },
    { key: "price", title: "Price & level alerts", desc: "When a watched symbol hits your level." },
    { key: "lessons", title: "Lesson reminders", desc: "Keep your streak and mastery on track." },
    { key: "product", title: "Product updates", desc: "New features and model improvements." },
    { key: "weekly", title: "Weekly performance digest", desc: "Your P&L, adherence, and coach summary." },
  ];
  return (
    <section className="ss-card divide-y divide-[var(--ss-border)]">
      {rows.map((r) => (
        <div key={r.key} className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-[13.5px] font-medium">{r.title}</p>
            <p className="mt-0.5 text-[12px] text-[var(--ss-text-muted)]">{r.desc}</p>
          </div>
          <Toggle
            checked={prefs[r.key]}
            onChange={(v) => setPrefs((p) => ({ ...p, [r.key]: v }))}
            label={r.title}
          />
        </div>
      ))}
    </section>
  );
}

/* ————— Appearance ————— */
function AppearanceSection() {
  const { theme, setTheme, mounted } = useTheme();
  return (
    <div className="space-y-6">
      <section className="ss-card p-5">
        <h3 className="font-display text-[14px] font-semibold tracking-tight">Theme</h3>
        <p className="mt-1.5 text-[12.5px] text-[var(--ss-text-muted)]">
          Smart Shield is dark by default — built for long sessions on the tape.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-sm">
          {(
            [
              { id: "dark", label: "Dark", icon: <Moon size={15} /> },
              { id: "light", label: "Light", icon: <Sun size={15} /> },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={cn(
                "ss-card flex items-center gap-2.5 p-4 transition-all",
                mounted && theme === opt.id && "!border-[var(--ss-accent)] ring-1 ring-[var(--ss-accent)]/30"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  mounted && theme === opt.id
                    ? "bg-[var(--ss-accent)] text-[var(--ss-accent-ink)]"
                    : "bg-[var(--ss-surface-active)] text-[var(--ss-text-muted)]"
                )}
              >
                {opt.icon}
              </span>
              <span className="text-[13.5px] font-semibold">{opt.label}</span>
              {mounted && theme === opt.id && <Check size={15} className="ml-auto text-[var(--ss-accent)]" />}
            </button>
          ))}
        </div>
      </section>

      <section className="ss-card p-5">
        <h3 className="font-display text-[14px] font-semibold tracking-tight">Number format</h3>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-medium">Tabular figures</p>
            <p className="mt-0.5 text-[12px] text-[var(--ss-text-muted)]">Monospaced numerals for prices and P&L.</p>
          </div>
          <span className="ss-tabular rounded-lg bg-[var(--ss-surface)] px-3 py-1.5 text-[13px]">
            +$1,240.50
          </span>
        </div>
      </section>
    </div>
  );
}
