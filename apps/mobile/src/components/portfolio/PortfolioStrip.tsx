import { Text, View } from 'react-native';

import type { AllocationSlice } from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

const tone = ['bg-mint/85', 'bg-ai-pulse/75', 'bg-warn/70', 'bg-slate-400/60'];

export function PortfolioStrip({ slices }: { slices: AllocationSlice[] }) {
  const th = useAppTheme();
  const barTrack = th.dark ? 'bg-canvas-elevated' : 'bg-slate-200';

  return (
    <View className={`mb-3 rounded-[14px] border p-3 ${th.borderDefault} ${th.surfaceCard}`}>
      <View className={`mb-2.5 h-2 w-full flex-row overflow-hidden rounded-full ${barTrack}`}>
        {slices.map((s, i) => (
          <View key={s.id} className={`h-full ${tone[i % tone.length]}`} style={{ width: `${s.pct}%` }} />
        ))}
      </View>
      {slices.map((s, i) => (
        <View
          key={s.id}
          className={`flex-row items-center justify-between ${i < slices.length - 1 ? `mb-2 border-b pb-2 ${th.borderDefault}` : ''}`}>
          <Text className={`font-sans-medium text-micro ${th.textMuted}`}>{s.label}</Text>
          <View className="flex-row items-baseline gap-2">
            <Text className={`font-mono text-micro ${th.textMono}`}>{s.value}</Text>
            <Text className="font-mono text-2xs text-mint">{s.pct}%</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
