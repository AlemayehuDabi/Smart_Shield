import { Text, View } from 'react-native';

import type { JournalEntry } from '@/src/lib/mock-data';

const resultStyle: Record<JournalEntry['result'], string> = {
  win: 'border-profit/25 bg-profit/[0.06]',
  loss: 'border-loss/25 bg-loss/[0.06]',
  scratch: 'border-canvas-stroke bg-canvas-elevated/40',
};

export function JournalTeaser({ entries }: { entries: JournalEntry[] }) {
  return (
    <View className="mb-3">
      <Text className="mb-2 font-sans-bold text-2xs uppercase tracking-[0.1em] text-ink-faint">Journal · explainability</Text>
      {entries.map((j, i) => (
        <View
          key={j.id}
          className={`rounded-xl border px-2.5 py-2 ${resultStyle[j.result]} ${i < entries.length - 1 ? 'mb-1.5' : ''}`}>
          <View className="flex-row items-center justify-between gap-2">
            <Text className="font-mono text-micro text-ink">{j.symbol}</Text>
            <Text className="font-mono text-2xs text-ink-faint">{j.date}</Text>
          </View>
          <Text className="mt-0.5 font-sans text-2xs text-ink-muted">{j.side}</Text>
          <Text className="mt-1 font-mono text-micro text-ink">{j.pnl}</Text>
          <View className="mt-1.5 rounded-lg border border-ai-dim/20 bg-ai-dim/10 px-2 py-1.5">
            <Text className="font-sans-bold text-2xs uppercase text-ai-pulse/90">AI</Text>
            <Text className="mt-0.5 font-sans text-2xs leading-[17px] text-ink">{j.aiNote}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
