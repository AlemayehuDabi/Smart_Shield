import { Text, View } from 'react-native';

import type { TradingSignal } from '@/src/lib/mock-data';
import { useAppStore } from '@/src/stores/use-app-store';
import { useShieldTheme } from '@/src/theme/use-shield-theme';

const sevColor: Record<TradingSignal['severity'], string> = {
  low: 'border-mint/25 bg-mint/[0.07]',
  medium: 'border-warn/30 bg-warn/[0.06]',
  high: 'border-loss/30 bg-loss/[0.07]',
  critical: 'border-loss/45 bg-loss/[0.1]',
};

export function SignalCard({ s }: { s: TradingSignal }) {
  const pref = useAppStore((st) => st.themePref);
  const th = useShieldTheme(pref);
  return (
    <View className={`mb-2 rounded-[14px] border p-3 ${sevColor[s.severity]}`}>
      <View className="mb-1.5 flex-row items-start justify-between gap-2">
        <Text className={`flex-1 font-sans-bold text-micro leading-5 ${th.heading}`} numberOfLines={3}>
          {s.title}
        </Text>
        <Text className={`shrink-0 font-mono text-2xs uppercase ${th.faint}`}>{s.severity}</Text>
      </View>
      <Text className={`mb-2 font-sans text-2xs leading-[17px] ${th.body}`}>{s.summary}</Text>
      <View className={`rounded-[10px] px-2.5 py-2 ${th.dark ? 'bg-canvas/80' : 'bg-slate-100'}`}>
        <Text className="font-sans-bold text-2xs uppercase tracking-wide text-ai-pulse/90">Model</Text>
        <Text className={`mt-1 font-sans text-micro leading-[19px] ${th.heading}`}>{s.aiExplanation}</Text>
      </View>
      <View className="mt-2 flex-row flex-wrap gap-1.5">
        {s.suggestedActions.map((a) => (
          <View key={a} className="rounded-full border border-mint/20 bg-mint/10 px-2.5 py-1">
            <Text className="font-sans-medium text-2xs text-mint">{a}</Text>
          </View>
        ))}
      </View>
      <Text className={`mt-2 font-mono text-2xs ${th.faint}`}>
        {s.source} · {s.detectedAt}
      </Text>
    </View>
  );
}
