"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "@/components/ui/icons";

export function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="ss-label flex items-center justify-between">
        {label}
        {hint && <span className="font-normal text-[var(--ss-text-faint)]">{hint}</span>}
      </span>
      <input className="ss-input" {...props} />
    </label>
  );
}

export function PasswordField({
  label = "Password",
  hint,
  ...props
}: { label?: string; hint?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="ss-label flex items-center justify-between">
        {label}
        {hint}
      </span>
      <span className="relative block">
        <input className="ss-input !pr-11" type={show ? "text" : "password"} {...props} />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--ss-text-faint)] transition-colors hover:text-[var(--ss-text)]"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </span>
    </label>
  );
}

export function SocialAuth() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {[
        { name: "Google", glyph: "G" },
        { name: "Apple", glyph: "" },
      ].map((p) => (
        <button
          key={p.name}
          type="button"
          className="ss-btn ss-btn-ghost py-2.5 text-[13px]"
        >
          <span className="font-display text-[15px]">{p.glyph}</span> {p.name}
        </button>
      ))}
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-[var(--ss-border)]" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ss-text-faint)]">
        or
      </span>
      <span className="h-px flex-1 bg-[var(--ss-border)]" />
    </div>
  );
}
