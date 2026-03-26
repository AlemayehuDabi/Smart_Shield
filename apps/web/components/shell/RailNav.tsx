"use client";

import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

export type AppView = "overview" | "threats" | "analytics" | "modules" | "settings";

const items: { id: AppView; label: string; icon: ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: "threats",
    label: "Threats",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    id: "modules",
    label: "Modules",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A.75.75 0 014.5 5.25h6a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75V6zM12.75 5.25h6a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75zM12.75 12.75h6a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75zM3.75 12.75h6a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

interface RailNavProps {
  active: AppView;
  onChange: (v: AppView) => void;
  variant?: "rail" | "drawer";
}

export function RailNav({ active, onChange, variant = "rail" }: RailNavProps) {
  if (variant === "drawer") {
    return (
      <nav className="flex flex-col gap-1 p-3" aria-label="Primary">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40",
                isActive
                  ? "border-[var(--ss-border-strong)] bg-[var(--ss-surface-hover)] text-[var(--ss-accent)]"
                  : "border-transparent text-[var(--ss-text-muted)] hover:border-[var(--ss-border)] hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)]",
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--ss-border)] bg-[var(--ss-bg-elevated)] text-current">
                {item.icon}
              </span>
              <span className="text-sm font-medium tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  /* Desktop sidebar: icon + label (aside is md+ only in SmartShieldApp) */
  return (
    <nav className="flex w-full flex-col gap-1 px-3 py-4" aria-label="Primary">
      <div className="mb-5 flex items-center gap-3 border-b border-[var(--ss-border)] pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ss-border)] bg-[var(--ss-surface)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-xs font-semibold tracking-tight text-[var(--ss-accent)]">SS</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-[var(--ss-text)]">Smart Shield</p>
          <p className="text-[11px] text-[var(--ss-text-faint)]">Protection console</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40",
                isActive
                  ? "border-[var(--ss-border-strong)] bg-[var(--ss-surface-hover)] text-[var(--ss-accent)] shadow-[0_0_24px_-12px_var(--ss-glow)]"
                  : "border-transparent text-[var(--ss-text-muted)] hover:border-[var(--ss-border)] hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)]",
              )}
            >
              {isActive && (
                <span
                  className="absolute -left-px top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-[var(--ss-accent)]"
                  aria-hidden
                />
              )}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ss-border)] bg-[var(--ss-bg-elevated)] text-current [&_svg]:size-[18px]">
                {item.icon}
              </span>
              <span className="min-w-0 truncate text-sm font-medium tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
