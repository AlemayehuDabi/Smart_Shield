import Link from "next/link";
import { LogoMark } from "@/components/ui/icons";

const cols: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: "Product",
    links: [
      ["Signals", "#product"],
      ["Portfolio & journal", "#product"],
      ["Learning hub", "#product"],
      ["Automation", "#product"],
      ["Pricing", "#pricing"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#"],
      ["Methodology", "#"],
      ["Track record", "#"],
      ["Careers", "#"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Trading glossary", "#"],
      ["Blog", "#"],
      ["Changelog", "#"],
      ["Support", "#"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms", "#"],
      ["Privacy", "#"],
      ["Risk disclosure", "#"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--ss-border)] bg-[var(--ss-bg)]/60 px-5 pb-10 pt-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark size={26} />
              <span className="font-display text-[15px] font-semibold tracking-tight">
                Smart Shield
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">
              The AI trading mentor. Signals with reasoning, coaching from your own history, lessons
              in context — and automation you earn.
            </p>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="ss-eyebrow !text-[9.5px]">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[12.5px] text-[var(--ss-text-muted)] transition-colors hover:text-[var(--ss-text)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="ss-hairline my-9" aria-hidden />

        <p className="max-w-3xl text-[10.5px] leading-relaxed text-[var(--ss-text-faint)]">
          Smart Shield is an analytics and education platform. Nothing on this site is investment,
          financial, or trading advice, and signals are not recommendations to buy or sell any
          asset. Trading involves substantial risk of loss. Past performance — including backtested
          or model performance — does not guarantee future results. Smart Shield never takes custody
          of funds.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10.5px] text-[var(--ss-text-faint)]">
            © {new Date().getFullYear()} Smart Shield, Inc.
          </p>
          <p className="font-mono text-[10.5px] text-[var(--ss-text-faint)]">
            Markets never sleep. Neither does your mentor.
          </p>
        </div>
      </div>
    </footer>
  );
}
