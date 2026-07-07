"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/components/ui/cn";
import { LogoMark, Menu, Moon, Sun, X } from "@/components/ui/icons";
import { useTheme } from "@/components/theme/ThemeProvider";

const links = [
  { href: "#product", label: "Product" },
  { href: "#loop", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "ss-glass border-b border-[var(--ss-border)]"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-[var(--ss-text)]">
          <LogoMark size={26} />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Smart Shield
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-medium text-[var(--ss-text-muted)] transition-colors hover:text-[var(--ss-text)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ss-btn ss-btn-ghost h-9 w-9 rounded-full !p-0"
          >
            {mounted && theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link href="/login" className="ss-btn ss-btn-ghost px-4 py-2 text-[13.5px]">
            Sign in
          </Link>
          <Link href="/signup" className="ss-btn ss-btn-primary px-4 py-2 text-[13.5px]">
            Start free
          </Link>
        </div>

        <button
          type="button"
          className="ss-btn ss-btn-ghost h-9 w-9 !p-0 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={17} /> : <Menu size={17} />}
        </button>
      </nav>

      {/* mobile sheet */}
      {open && (
        <div className="ss-glass border-t border-[var(--ss-border)] px-5 pb-6 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-[var(--ss-text-muted)] transition-colors hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)]"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Link href="/login" className="ss-btn ss-btn-ghost flex-1 px-4 py-2.5 text-sm">
              Sign in
            </Link>
            <Link href="/signup" className="ss-btn ss-btn-primary flex-1 px-4 py-2.5 text-sm">
              Start free
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="ss-btn ss-btn-ghost h-10 w-10 rounded-full !p-0"
            >
              {mounted && theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
