"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/components/ui/cn";
import { X } from "@/components/ui/icons";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "ss-animate-in relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-[var(--ss-border)] bg-[var(--ss-bg-elevated)] shadow-2xl sm:rounded-2xl",
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md"
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--ss-border)] px-5 py-4">
          <div>
            <h2 className="font-display text-[16px] font-semibold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-[12.5px] text-[var(--ss-text-muted)]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ss-btn ss-btn-ghost h-8 w-8 shrink-0 rounded-full !p-0"
          >
            <X size={16} />
          </button>
        </header>
        <div className="ss-scroll flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-2.5 border-t border-[var(--ss-border)] px-5 py-3.5">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
