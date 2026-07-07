import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";
import { TrendUp, TrendDown } from "@/components/ui/icons";

/* ————————————————————————————————————————————
   PageHeader — every app page opens with one
   ———————————————————————————————————————————— */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="ss-eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--ss-text-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
    </div>
  );
}

/* ————————————————————————————————————————————
   Badge — semantic pill
   ———————————————————————————————————————————— */
export type Tone =
  | "accent"
  | "violet"
  | "gold"
  | "profit"
  | "loss"
  | "warn"
  | "neutral";

const toneMap: Record<Tone, string> = {
  accent: "bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]",
  violet: "bg-[var(--ss-violet-dim)] text-[var(--ss-violet)]",
  gold: "bg-[var(--ss-gold-dim)] text-[var(--ss-gold)]",
  profit: "bg-[var(--ss-profit-dim)] text-[var(--ss-profit)]",
  loss: "bg-[var(--ss-loss-dim)] text-[var(--ss-loss)]",
  warn: "bg-[var(--ss-gold-dim)] text-[var(--ss-warn)]",
  neutral:
    "bg-[var(--ss-surface-active)] text-[var(--ss-text-muted)]",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  icon,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        toneMap[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/* ————————————————————————————————————————————
   StatTile — KPI cell
   ———————————————————————————————————————————— */
export function StatTile({
  label,
  value,
  delta,
  sub,
  tone,
  className,
}: {
  label: string;
  value: ReactNode;
  /** signed percentage number, colored automatically */
  delta?: number;
  sub?: ReactNode;
  tone?: "profit" | "loss";
  className?: string;
}) {
  const valueColor =
    tone === "profit"
      ? "text-[var(--ss-profit)]"
      : tone === "loss"
        ? "text-[var(--ss-loss)]"
        : "text-[var(--ss-text)]";
  return (
    <div className={cn("ss-card p-4", className)}>
      <p className="ss-eyebrow !text-[9.5px]">{label}</p>
      <p
        className={cn(
          "ss-tabular mt-2 font-display text-[1.6rem] font-semibold leading-none tracking-tight",
          valueColor
        )}
      >
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {typeof delta === "number" && (
          <span
            className={cn(
              "ss-tabular inline-flex items-center gap-0.5 text-[11.5px] font-semibold",
              delta >= 0 ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]"
            )}
          >
            {delta >= 0 ? <TrendUp size={12} /> : <TrendDown size={12} />}
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        )}
        {sub && (
          <span className="text-[11.5px] text-[var(--ss-text-faint)]">{sub}</span>
        )}
      </div>
    </div>
  );
}

/* ————————————————————————————————————————————
   Progress — thin bar
   ———————————————————————————————————————————— */
export function Progress({
  value,
  tone = "accent",
  className,
}: {
  value: number; // 0–100
  tone?: "accent" | "violet" | "gold";
  className?: string;
}) {
  const color =
    tone === "violet"
      ? "var(--ss-violet)"
      : tone === "gold"
        ? "var(--ss-gold)"
        : "var(--ss-accent)";
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-[var(--ss-surface-active)]",
        className
      )}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: color,
        }}
      />
    </div>
  );
}

/* ————————————————————————————————————————————
   SectionCard — titled panel wrapper
   ———————————————————————————————————————————— */
export function SectionCard({
  title,
  eyebrow,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("ss-card overflow-hidden", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-[var(--ss-border)] px-5 py-3.5">
          <div>
            {eyebrow && <p className="ss-eyebrow !text-[9.5px]">{eyebrow}</p>}
            {title && (
              <h2 className="font-display text-[15px] font-semibold tracking-tight">
                {title}
              </h2>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
