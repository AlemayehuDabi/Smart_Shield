"use client";

import { cn } from "@/components/ui/cn";

type AuthFormCardProps = {
  children: React.ReactNode;
  className?: string;
  title: string;
  subtitle?: string;
};

export function AuthFormCard({ children, className, title, subtitle }: AuthFormCardProps) {
  return (
    <div
      className={cn(
        "ss-card ss-card-focus ss-animate-in w-full max-w-[420px] p-6 sm:p-8",
        "shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)]",
        className,
      )}
    >
      <header className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--ss-text)]">{title}</h2>
        {subtitle ? <p className="mt-1.5 text-sm text-[var(--ss-text-muted)]">{subtitle}</p> : null}
      </header>
      {children}
    </div>
  );
}
