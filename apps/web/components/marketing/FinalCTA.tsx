import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-36">
      {/* focused glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 50% 100%, color-mix(in srgb, var(--ss-accent) 12%, transparent), transparent 70%)",
        }}
      />
      <div className="ss-dot-grid absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" aria-hidden />

      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="ss-eyebrow mb-5">The market is open</p>
        <h2 className="font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-[3.2rem]">
          Your next trade can be the first one you fully{" "}
          <span className="ss-text-gradient">understand</span>.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--ss-text-muted)]">
          Three signals a day, every one explained, free forever. Bring your own broker — we&rsquo;ll
          bring the reasoning.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="ss-btn ss-btn-primary group px-7 py-3.5 text-[15.5px]">
            Create your free account
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <p className="mt-4 font-mono text-[11px] tracking-wide text-[var(--ss-text-faint)]">
          60 seconds to first signal · no credit card
        </p>
      </Reveal>
    </section>
  );
}
