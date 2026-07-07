"use client";

import { cn } from "@/components/ui/cn";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] p-0.5",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[6px] font-medium transition-colors",
              size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]",
              active
                ? "bg-[var(--ss-bg-elevated)] text-[var(--ss-text)] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                : "text-[var(--ss-text-muted)] hover:text-[var(--ss-text)]"
            )}
          >
            {opt.label}
            {typeof opt.count === "number" && (
              <span
                className={cn(
                  "ss-tabular rounded-full px-1.5 text-[10px] font-semibold",
                  active
                    ? "bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]"
                    : "bg-[var(--ss-surface-active)] text-[var(--ss-text-faint)]"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
