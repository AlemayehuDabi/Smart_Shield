import { Text, View } from 'react-native';

import type { LearningBeat } from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function LearningTimeline({ beats }: { beats: LearningBeat[] }) {
  const th = useAppTheme();
  const connector = th.dark ? 'bg-canvas-stroke' : 'bg-slate-300';

  return (
    <View className="pb-2">
      <Text className={`mb-2 font-sans-bold text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>
        Learning
      </Text>
      {beats.map((b, i) => (
        <View key={b.id} className={`flex-row ${i < beats.length - 1 ? 'mb-2.5' : ''}`}>
          <View className="mr-2.5 items-center pt-1">
            <View className="h-2 w-2 rounded-full bg-ai-pulse" />
            {i < beats.length - 1 ? <View className={`mt-1 h-7 w-px ${connector}`} /> : null}
          </View>
          <View className="min-w-0 flex-1 rounded-xl border border-ai-dim/25 bg-ai-dim/12 px-2.5 py-2">
            <View className="flex-row items-start justify-between gap-2">
              <Text className={`flex-1 font-sans-bold text-micro ${th.textTitle}`}>{b.title}</Text>
              <Text className="shrink-0 font-mono text-2xs text-mint">
                {(b.confidence * 100).toFixed(0)}%
              </Text>
            </View>
            <Text className={`mt-1 font-sans text-2xs leading-[17px] ${th.textBody}`}>{b.detail}</Text>
            <Text className={`mt-1 font-mono text-2xs ${th.textFaint}`}>{b.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
