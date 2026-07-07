import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "See the signal",
    body: "A setup fires with entry, target, stop and a confidence score — never a naked arrow.",
  },
  {
    n: "02",
    title: "Understand it",
    body: "Read the reasoning. Unfamiliar concept? A three-minute lesson opens on that exact chart.",
  },
  {
    n: "03",
    title: "Trade it your way",
    body: "Execute on your own broker — Binance, Robinhood, wherever. We never touch your funds.",
  },
  {
    n: "04",
    title: "Journal & get coached",
    body: "Log the trade in seconds. The coach studies your patterns and calls out what's costing you.",
  },
  {
    n: "05",
    title: "Earn automation",
    body: "Prove mastery — lessons passed, plan followed — and that strategy unlocks for automation.",
  },
];

export function HowItWorks() {
  return (
    <section id="loop" className="relative border-y border-[var(--ss-border)] bg-[var(--ss-bg)]/40 px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="ss-eyebrow mb-4">The loop</p>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
            From copying signals to owning strategies.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--ss-text-muted)]">
            Most tools stop at step one and keep you paying for answers. Ours is designed so you
            need it less for signals over time — and more for everything after.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--ss-border)] bg-[var(--ss-border)] sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} as="li" delay={i * 60} className="bg-[var(--ss-bg-elevated)]">
              <div className="group relative h-full p-5 transition-colors hover:bg-[var(--ss-surface-hover)] sm:p-6">
                <span className="ss-tabular text-[11px] font-medium text-[var(--ss-accent)]">
                  {s.n}
                </span>
                <span
                  aria-hidden
                  className="mt-2 block h-px w-6 bg-[var(--ss-accent)] opacity-40 transition-all duration-300 group-hover:w-10 group-hover:opacity-100"
                />
                <h3 className="mt-4 font-display text-[15px] font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
