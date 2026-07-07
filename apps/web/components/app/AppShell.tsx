"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { cn } from "@/components/ui/cn";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  Bell,
  Bot,
  ChevronRight,
  GraduationCap,
  Journal,
  LogoMark,
  Menu,
  Moon,
  PieChart,
  Pulse,
  Search,
  Settings,
  Sparkles,
  Sun,
  X,
} from "@/components/ui/icons";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  tier?: "pro" | "elite";
};

const primaryNav: NavItem[] = [
  { href: "/signals", label: "Signals", icon: Pulse, badge: "3" },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/journal", label: "Journal", icon: Journal },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/automation", label: "Automation", icon: Bot, tier: "elite" },
];

const secondaryNav: NavItem[] = [{ href: "/settings", label: "Settings", icon: Settings }];

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
        active
          ? "bg-[var(--ss-surface-active)] text-[var(--ss-text)]"
          : "text-[var(--ss-text-muted)] hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)]"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-full bg-[var(--ss-accent)]" />
      )}
      <Icon
        size={17}
        className={cn(
          "shrink-0 transition-colors",
          active ? "text-[var(--ss-accent)]" : "text-[var(--ss-text-faint)] group-hover:text-[var(--ss-text-muted)]"
        )}
      />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="ss-tabular flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ss-accent-dim)] px-1 text-[10px] font-semibold text-[var(--ss-accent)]">
          {item.badge}
        </span>
      )}
      {item.tier === "elite" && (
        <span className="rounded bg-[var(--ss-gold-dim)] px-1.5 py-px font-mono text-[8.5px] font-semibold uppercase tracking-wider text-[var(--ss-gold)]">
          Elite
        </span>
      )}
    </Link>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/signals"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-3 pb-5 pt-1 text-[var(--ss-text)]"
      >
        <LogoMark size={26} />
        <span className="font-display text-[15px] font-semibold tracking-tight">Smart Shield</span>
      </Link>

      <nav className="flex-1 space-y-0.5">
        <p className="ss-eyebrow !text-[9px] px-3 pb-1.5 pt-2">Workspace</p>
        {primaryNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname.startsWith(item.href)}
            onNavigate={onNavigate}
          />
        ))}
        <p className="ss-eyebrow !text-[9px] px-3 pb-1.5 pt-4">Account</p>
        {secondaryNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname.startsWith(item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* upgrade card */}
      <div className="mt-4 rounded-xl border border-[var(--ss-border)] bg-[var(--ss-surface)] p-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]">
            <Sparkles size={13} />
          </span>
          <span className="text-[12.5px] font-semibold">Operator trial</span>
        </div>
        <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--ss-text-muted)]">
          9 days left. Unlock unlimited signals, coaching &amp; backtests.
        </p>
        <Link
          href="/settings"
          onClick={onNavigate}
          className="ss-btn ss-btn-primary mt-3 w-full py-1.5 text-[12.5px]"
        >
          Upgrade
        </Link>
      </div>

      {/* user */}
      <Link
        href="/settings"
        onClick={onNavigate}
        className="mt-3 flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--ss-surface)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ss-accent)] to-[var(--ss-violet)] text-[12px] font-bold text-[var(--ss-accent-ink)]">
          AD
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold">Alex Dabi</p>
          <p className="truncate font-mono text-[10px] text-[var(--ss-text-faint)]">Operator · trial</p>
        </div>
        <ChevronRight size={14} className="text-[var(--ss-text-faint)]" />
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  // close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--ss-bg)]">
      {/* fixed sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-[var(--ss-border)] bg-[var(--ss-bg-deep)] px-4 py-5 lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="ss-animate-in fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-[var(--ss-border)] bg-[var(--ss-bg-deep)] px-4 py-5 lg:hidden">
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      <div className="lg:pl-[248px]">
        {/* top strip */}
        <header className="ss-glass sticky top-0 z-20 border-b border-[var(--ss-border)]">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="ss-btn ss-btn-ghost h-9 w-9 !p-0 lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>

            {/* market status */}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="ss-live-dot h-2 w-2 rounded-full bg-[var(--ss-profit)]" />
              <span className="font-mono text-[11px] text-[var(--ss-text-muted)]">
                Markets open · <span className="text-[var(--ss-text)]">NY 10:42</span>
              </span>
            </div>

            {/* search */}
            <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ss-text-faint)]"
              />
              <input
                className="ss-input !py-1.5 !pl-9 !text-[13px]"
                placeholder="Search symbols, lessons…"
                aria-label="Search"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[var(--ss-border)] px-1.5 py-0.5 font-mono text-[9.5px] text-[var(--ss-text-faint)]">
                ⌘K
              </kbd>
            </div>

            <div className="ml-auto flex items-center gap-1.5 md:ml-0">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="ss-btn ss-btn-ghost h-9 w-9 rounded-full !p-0"
              >
                {mounted && theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <button
                type="button"
                aria-label="Notifications"
                className="ss-btn ss-btn-ghost relative h-9 w-9 rounded-full !p-0"
              >
                <Bell size={15} />
                <span className="ss-alert-dot absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--ss-danger)]" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
