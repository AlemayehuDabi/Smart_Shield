"use client";

import { forwardRef, useId, useState } from "react";
import { cn } from "@/components/ui/cn";

export type AuthFormFieldProps = {
  label: string;
  hint?: string;
  error?: string | null;
  className?: string;
  inputClassName?: string;
  /** Shown when `type` is password */
  showPasswordToggle?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">;

export const AuthFormField = forwardRef<HTMLInputElement, AuthFormFieldProps>(function AuthFormField(
  {
    label,
    hint,
    error,
    id,
    className,
    inputClassName,
    type = "text",
    showPasswordToggle = true,
    disabled,
    ...inputProps
  },
  ref,
) {
  const genId = useId();
  const fieldId = id ?? genId;
  const errId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword && visible ? "text" : type;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={fieldId} className="text-xs font-medium text-[var(--ss-text)]">
          {label}
        </label>
        {hint && !error ? (
          <span id={hintId} className="text-[10px] text-[var(--ss-text-faint)]">
            {hint}
          </span>
        ) : null}
      </div>
      <div className="relative">
        <input
          ref={ref}
          id={fieldId}
          type={effectiveType}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errId : hint ? hintId : undefined}
          className={cn(
            "w-full rounded-[var(--radius-md)] border bg-[var(--ss-bg-elevated)]/60 px-3.5 py-2.5 text-sm text-[var(--ss-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition",
            "border-[var(--ss-border)] placeholder:text-[var(--ss-text-faint)]",
            "hover:border-[var(--ss-border-strong)]",
            "focus:border-[var(--ss-accent)]/50 focus:ring-2 focus:ring-[var(--ss-accent)]/25",
            error && "border-[var(--ss-danger)]/55 focus:ring-[var(--ss-danger)]/20",
            disabled && "cursor-not-allowed opacity-60",
            isPassword && showPasswordToggle && "pr-11",
            inputClassName,
          )}
          {...inputProps}
        />
        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--ss-text-muted)] transition hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/30 disabled:pointer-events-none"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errId} className="text-xs text-[var(--ss-danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
