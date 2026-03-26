"use client";

import { useEffect } from "react";
import type { AppView } from "@/components/shell/RailNav";
import { RailNav } from "@/components/shell/RailNav";

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  active: AppView;
  onNavigate: (v: AppView) => void;
}

export function NavDrawer({ open, onClose, active, onNavigate }: NavDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm md:hidden"
        aria-label="Close navigation"
        onClick={onClose}
      />
      <div
        className="fixed inset-y-0 left-0 z-[50] flex w-[min(100vw-2.5rem,300px)] flex-col border-r border-[var(--ss-border)] bg-[var(--ss-bg-elevated)] shadow-2xl md:hidden ss-animate-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nav-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-[var(--ss-border)] px-4 py-3">
          <div id="nav-drawer-title">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--ss-text-faint)]">Navigate</p>
            <p className="text-sm font-medium text-[var(--ss-text)]">Smart Shield</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--ss-text-muted)] transition hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)]"
            aria-label="Close"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="ss-scroll flex-1 overflow-y-auto">
          <RailNav
            variant="drawer"
            active={active}
            onChange={(v) => {
              onNavigate(v);
              onClose();
            }}
          />
        </div>
      </div>
    </>
  );
}
