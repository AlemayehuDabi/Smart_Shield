import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { HeroDemo } from "./HeroDemo";

const stats: Array<[string, string]> = [
  ["38,000+", "signals explained, not just called"],
  ["2.4:1", "median reward-to-risk on published setups"],
  ["140+", "lessons taught at the moment they matter"],
  ["0", "broker keys required — your funds stay yours"],
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="ss-animate-in mb-6 inline-flex">
            <span className="ss-chip !text-[11px]">
              <span className="ss-live-dot h-1.5 w-1.5 rounded-full bg-[var(--ss-accent)]" />
              Early access — first 1,000 seats at founder pricing
            </span>
          </div>

          <h1
            className="font-display ss-animate-in text-balance text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-[3.9rem]"
            style={{ animationDelay: "0.08s" }}
          >
            The AI that doesn&rsquo;t just tell you{" "}
            <span className="text-[var(--ss-text-muted)]">what</span> to trade —{" "}
            <span className="ss-text-gradient">it teaches you how</span>, then automates what
            you&rsquo;ve mastered.
          </h1>

          <p
            className="ss-animate-in mx-auto mt-6 max-w-xl text-pretty text-[15.5px] leading-relaxed text-[var(--ss-text-muted)] sm:text-[17px]"
            style={{ animationDelay: "0.16s" }}
          >
            Every signal comes with the reasoning behind it. Every trade you journal makes your AI
            coach sharper. And automation stays locked until you&rsquo;ve proven you understand the
            strategy running it.
          </p>

          <div
            className="ss-animate-in mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.24s" }}
          >
            <Link href="/signup" className="ss-btn ss-btn-primary group px-6 py-3 text-[15px]">
              Start free
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#loop" className="ss-btn ss-btn-ghost px-6 py-3 text-[15px]">
              See how it works
            </a>
          </div>

          <p
            className="ss-animate-in mt-4 font-mono text-[11px] tracking-wide text-[var(--ss-text-faint)]"
            style={{ animationDelay: "0.3s" }}
          >
            Free forever plan · No credit card · No broker connection required
          </p>
        </div>

        <HeroDemo />

        {/* proof strip */}
        <dl className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 lg:mt-24 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="text-center">
              <dt className="sr-only">{label}</dt>
              <dd className="ss-tabular font-display text-3xl font-semibold tracking-tight text-[var(--ss-text)]">
                {value}
              </dd>
              <dd className="mx-auto mt-1.5 max-w-[180px] text-[12px] leading-snug text-[var(--ss-text-faint)]">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
