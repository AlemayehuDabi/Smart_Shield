import { Text, View } from 'react-native';

import { AppCard } from '@/src/components/ui/AppCard';
import type { PersonalityAxis } from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function PersonalityBars({ axes }: { axes: PersonalityAxis[] }) {
  const th = useAppTheme();
  const track = th.dark ? 'bg-canvas-elevated' : 'bg-slate-200';

  return (
    <AppCard className="mb-3">
      <Text className={`font-sans-bold text-micro ${th.textTitle}`}>Personality</Text>
      <Text className={`mt-0.5 font-sans text-2xs ${th.textBody}`}>
        Posterior from fills + journal
      </Text>
      <View className="mt-3">
        {axes.map((a, i) => (
          <View key={a.id} className={i < axes.length - 1 ? 'mb-3' : ''}>
            <View className="mb-1 flex-row items-center justify-between">
              <Text className={`font-sans-bold text-2xs ${th.textMuted}`}>{a.label}</Text>
              <Text className="font-mono text-2xs text-mint">{a.score}</Text>
            </View>
            <View className={`h-1.5 overflow-hidden rounded-full ${track}`}>
              <View className="h-full rounded-full bg-mint" style={{ width: `${a.score}%` }} />
            </View>
            <Text className={`mt-0.5 font-sans text-2xs ${th.textFaint}`}>{a.hint}</Text>
          </View>
        ))}
      </View>
    </AppCard>
  );
}
