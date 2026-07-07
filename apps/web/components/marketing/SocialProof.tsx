import { Reveal } from "./Reveal";

const brokers = ["Binance", "Coinbase", "Kraken", "Robinhood", "Interactive Brokers", "Bybit", "OANDA"];

const quotes = [
  {
    quote:
      "I used to take signals on faith and lose money confidently. Now I can read the reasoning, and half the time I spot the setup before the alert fires. That's the whole point, right?",
    name: "Dario M.",
    role: "Crypto trader · 2 years",
    initials: "DM",
    accent: "var(--ss-accent)",
  },
  {
    quote:
      "The coach flagged that 70% of my losses came in the first hour after a stop-out. One sentence, four months of bleeding explained. No spreadsheet ever told me that.",
    name: "Priya K.",
    role: "Equities & options · 5 years",
    initials: "PK",
    accent: "var(--ss-violet)",
  },
  {
    quote:
      "Locking automation behind mastery sounded like a gimmick until I failed the gate twice. By the time my strategy went live, I actually understood every rule in it.",
    name: "Tomás R.",
    role: "FX swing trader · 3 years",
    initials: "TR",
    accent: "var(--ss-gold)",
  },
];

export function SocialProof() {
  return (
    <section id="traders" className="px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* broker compatibility strip */}
        <Reveal className="text-center">
          <p className="ss-eyebrow">Works alongside the broker you already use</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {brokers.map((b) => (
              <span
                key={b}
                className="font-display text-[15px] font-semibold tracking-tight text-[var(--ss-text-faint)] transition-colors hover:text-[var(--ss-text-muted)]"
              >
                {b}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-md font-mono text-[10.5px] leading-relaxed text-[var(--ss-text-faint)]">
            Analytics only — no API keys, no fund custody, no order routing. Your broker stays yours.
          </p>
        </Reveal>

        {/* testimonials */}
        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 80}>
              <figure className="ss-card flex h-full flex-col p-6">
                <span
                  aria-hidden
                  className="font-display text-4xl leading-none"
                  style={{ color: q.accent, opacity: 0.7 }}
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[var(--ss-text-muted)]">
                  {q.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--ss-border)] pt-4">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-[11px] font-semibold"
                    style={{
                      background: `color-mix(in srgb, ${q.accent} 14%, transparent)`,
                      color: q.accent,
                    }}
                  >
                    {q.initials}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold">{q.name}</p>
                    <p className="font-mono text-[10px] tracking-wide text-[var(--ss-text-faint)]">
                      {q.role}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
