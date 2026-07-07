import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignalDetail } from "@/components/signals/SignalDetail";
import { signals } from "@/lib/data/signals";
import { ArrowRight } from "@/components/ui/icons";

export function generateStaticParams() {
  return signals.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const signal = signals.find((s) => s.id === id);
  return { title: signal ? `${signal.symbol} signal` : "Signal" };
}

export default async function SignalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const signal = signals.find((s) => s.id === id);
  if (!signal) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link
        href="/signals"
        className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-[var(--ss-text-muted)] transition-colors hover:text-[var(--ss-text)]"
      >
        <ArrowRight size={13} className="rotate-180" /> All signals
      </Link>
      <SignalDetail signal={signal} />
    </div>
  );
}
