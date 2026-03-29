import { Text, View } from 'react-native';

import type { JournalEntry } from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function JournalTeaser({ entries }: { entries: JournalEntry[] }) {
  const th = useAppTheme();

  const resultStyle = (result: JournalEntry['result']) => {
    if (result === 'win') return 'border-profit/25 bg-profit/[0.06]';
    if (result === 'loss') return 'border-loss/25 bg-loss/[0.06]';
    return th.dark
      ? 'border-canvas-stroke bg-canvas-elevated/40'
      : 'border-slate-200/90 bg-slate-50';
  };

  return (
    <View className="mb-3">
      <Text className={`mb-2 font-sans-bold text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>
        Journal · explainability
      </Text>
      {entries.map((j, i) => (
        <View
          key={j.id}
          className={`rounded-xl border px-2.5 py-2 ${resultStyle(j.result)} ${
            i < entries.length - 1 ? 'mb-1.5' : ''
          }`}
        >
          <View className="flex-row items-center justify-between gap-2">
            <Text className={`font-mono text-micro ${th.textTitle}`}>{j.symbol}</Text>
            <Text className={`font-mono text-2xs ${th.textFaint}`}>{j.date}</Text>
          </View>
          <Text className={`mt-0.5 font-sans text-2xs ${th.textBody}`}>{j.side}</Text>
          <Text className={`mt-1 font-mono text-micro ${th.textTitle}`}>{j.pnl}</Text>
          <View className="mt-1.5 rounded-lg border border-ai-dim/20 bg-ai-dim/10 px-2 py-1.5">
            <Text className="font-sans-bold text-2xs uppercase text-ai-pulse/90">AI</Text>
            <Text className={`mt-0.5 font-sans text-2xs leading-[17px] ${th.textTitle}`}>
              {j.aiNote}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
