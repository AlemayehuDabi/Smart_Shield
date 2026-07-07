import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark, ShieldCheck } from "@/components/ui/icons";
import { SignalsFeedMock } from "@/components/marketing/PillarMocks";

/**
 * Split auth layout: focused form on the left, brand proof panel on the right.
 * Right panel is hidden on small screens.
 */
export function AuthShell({
  children,
  quote,
}: {
  children: ReactNode;
  quote?: { text: string; author: string; role: string };
}) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      <div className="ss-backdrop" aria-hidden>
        <div className="ss-grid" />
        <div className="ss-noise" />
      </div>

      {/* form side */}
      <div className="relative z-10 flex min-h-screen flex-col px-5 py-8 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-[var(--ss-text)]">
          <LogoMark size={26} />
          <span className="font-display text-[15px] font-semibold tracking-tight">Smart Shield</span>
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center font-mono text-[10.5px] text-[var(--ss-text-faint)]">
          © 2026 Smart Shield · No broker keys, ever
        </p>
      </div>

      {/* brand side */}
      <div className="relative z-10 hidden overflow-hidden border-l border-[var(--ss-border)] bg-[var(--ss-bg-deep)] lg:flex lg:flex-col lg:justify-center lg:px-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 70% 0%, color-mix(in srgb, var(--ss-accent) 14%, transparent), transparent), radial-gradient(ellipse 60% 40% at 0% 100%, color-mix(in srgb, var(--ss-violet) 12%, transparent), transparent)",
          }}
          aria-hidden
        />
        <div className="relative max-w-md">
          <span className="ss-chip !text-[11px]">
            <ShieldCheck size={13} className="text-[var(--ss-accent)]" />
            Your analytical edge — not your broker
          </span>
          <h2 className="font-display mt-5 text-[2rem] font-semibold leading-tight tracking-tight">
            Signals you understand.
            <br />
            Skills you keep.
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--ss-text-muted)]">
            Join traders who stopped chasing tips and started building an edge they actually
            understand.
          </p>

          <div className="mt-8">
            <SignalsFeedMock />
          </div>

          {quote && (
            <figure className="mt-8 border-l-2 border-[var(--ss-accent)] pl-4">
              <blockquote className="text-[13.5px] leading-relaxed text-[var(--ss-text)]">
                “{quote.text}”
              </blockquote>
              <figcaption className="mt-2 font-mono text-[11px] text-[var(--ss-text-faint)]">
                {quote.author} · {quote.role}
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </div>
  );
}
