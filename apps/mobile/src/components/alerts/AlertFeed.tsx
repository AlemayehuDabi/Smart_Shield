import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { AlertItem } from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

const accent: Record<number, { bar: string; dot: string }> = {
  1: { bar: 'bg-warn', dot: 'bg-warn' },
  2: { bar: 'bg-mint', dot: 'bg-mint' },
  3: { bar: 'bg-slate-400', dot: 'bg-slate-500' },
};

function pick(priority: number, dark: boolean) {
  if (dark) {
    const d: Record<number, { bar: string; dot: string }> = {
      1: { bar: 'bg-warn', dot: 'bg-warn' },
      2: { bar: 'bg-mint', dot: 'bg-mint' },
      3: { bar: 'bg-ink-faint', dot: 'bg-ink-muted' },
    };
    return d[priority] ?? d[3];
  }
  return accent[priority] ?? accent[3];
}

export function AlertFeed({ items }: { items: AlertItem[] }) {
  const th = useAppTheme();

  return (
    <View className="gap-2">
      {items.map((a, i) => {
        const c = pick(a.priority, th.dark);
        const surface = a.read
          ? th.dark
            ? 'border-canvas-stroke bg-canvas-elevated/55'
            : 'border-slate-200 bg-slate-100'
          : `${th.borderDefault} ${th.surfaceCard}`;
        return (
          <Animated.View key={a.id} entering={FadeInDown.delay(i * 55).duration(320)}>
            <Pressable
              onPress={() => Haptics.selectionAsync()}
              className={`flex-row overflow-hidden rounded-xl border ${surface}`}>
              <View className={`w-1 ${c.bar} ${a.read ? 'opacity-40' : ''}`} />
              <View className="flex-1 flex-row items-start gap-2.5 py-2.5 pl-2.5 pr-3">
                <View className={`mt-1.5 h-1.5 w-1.5 rounded-full ${c.dot} ${a.read ? 'opacity-30' : ''}`} />
                <View className="min-w-0 flex-1">
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className={`flex-1 font-sans-bold text-micro ${th.textTitle}`} numberOfLines={2}>
                      {a.title}
                    </Text>
                    {!a.read ? <View className="h-1.5 w-1.5 rounded-full bg-warn" /> : null}
                  </View>
                  <Text className={`mt-0.5 font-sans text-2xs leading-[17px] ${th.textBody}`} numberOfLines={3}>
                    {a.body}
                  </Text>
                  <Text className={`mt-1 font-mono text-2xs ${th.textFaint}`}>{a.time}</Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}
