import { Text, View } from 'react-native';

import type { LearningBeat } from '@/src/lib/mock-data';

export function LearningTimeline({ beats }: { beats: LearningBeat[] }) {
  return (
    <View className="pb-2">
      <Text className="mb-2 font-sans-bold text-2xs uppercase tracking-[0.1em] text-ink-faint">Learning</Text>
      {beats.map((b, i) => (
        <View key={b.id} className={`flex-row ${i < beats.length - 1 ? 'mb-2.5' : ''}`}>
          <View className="mr-2.5 items-center pt-1">
            <View className="h-2 w-2 rounded-full bg-ai-pulse" />
            {i < beats.length - 1 ? <View className="mt-1 h-7 w-px bg-canvas-stroke" /> : null}
          </View>
          <View className="min-w-0 flex-1 rounded-xl border border-ai-dim/25 bg-ai-dim/12 px-2.5 py-2">
            <View className="flex-row items-start justify-between gap-2">
              <Text className="flex-1 font-sans-bold text-micro text-ink">{b.title}</Text>
              <Text className="shrink-0 font-mono text-2xs text-mint">{(b.confidence * 100).toFixed(0)}%</Text>
            </View>
            <Text className="mt-1 font-sans text-2xs leading-[17px] text-ink-muted">{b.detail}</Text>
            <Text className="mt-1 font-mono text-2xs text-ink-faint">{b.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
