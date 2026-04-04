"use client";

import { cn } from "@/components/ui/cn";

type Variant = "error" | "success";

const styles: Record<Variant, string> = {
  error: "border-[var(--ss-danger)]/35 bg-[var(--ss-loss-dim)] text-[var(--ss-danger)]",
  success: "border-[var(--ss-safe)]/35 bg-[var(--ss-profit-dim)] text-[var(--ss-safe)]",
};

export function AuthStatusBanner({
  variant,
  children,
  className,
}: {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "mb-5 rounded-[var(--radius-md)] border px-3.5 py-2.5 text-sm leading-snug transition-opacity duration-300",
        styles[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
