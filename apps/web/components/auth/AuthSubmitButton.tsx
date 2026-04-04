"use client";

import { cn } from "@/components/ui/cn";

type AuthSubmitButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AuthSubmitButton({
  children,
  loading,
  disabled,
  className,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={cn(
        "group relative mt-2 w-full overflow-hidden rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold tracking-tight transition",
        "bg-[var(--ss-accent-dim)] text-[var(--ss-text)]",
        "border border-[var(--ss-border-strong)]",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.35)_inset,0_1px_0_rgba(255,255,255,0.06)_inset]",
        "hover:border-[var(--ss-accent)]/45 hover:shadow-[0_0_32px_-8px_var(--ss-glow)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/45",
        "active:scale-[0.99]",
        (disabled || loading) && "pointer-events-none opacity-60",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          "bg-gradient-to-r from-transparent via-white/5 to-transparent ss-shimmer",
        )}
        aria-hidden
      />
      <span className="relative inline-flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span
              className="size-4 animate-spin rounded-full border-2 border-[var(--ss-text-muted)] border-t-[var(--ss-accent)]"
              aria-hidden
            />
            <span>Working…</span>
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}
