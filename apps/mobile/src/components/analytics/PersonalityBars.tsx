import { Text, View } from 'react-native';

import type { PersonalityAxis } from '@/src/lib/mock-data';

export function PersonalityBars({ axes }: { axes: PersonalityAxis[] }) {
  return (
    <View className="mb-3 rounded-[14px] border border-canvas-stroke bg-canvas-panel p-3">
      <Text className="font-sans-bold text-micro text-ink">Personality</Text>
      <Text className="mt-0.5 font-sans text-2xs text-ink-muted">Posterior from fills + journal</Text>
      <View className="mt-3">
        {axes.map((a, i) => (
          <View key={a.id} className={i < axes.length - 1 ? 'mb-3' : ''}>
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="font-sans-bold text-2xs text-ink-muted">{a.label}</Text>
              <Text className="font-mono text-2xs text-mint">{a.score}</Text>
            </View>
            <View className="h-1.5 overflow-hidden rounded-full bg-canvas-elevated">
              <View className="h-full rounded-full bg-mint" style={{ width: `${a.score}%` }} />
            </View>
            <Text className="mt-0.5 font-sans text-2xs text-ink-faint">{a.hint}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
