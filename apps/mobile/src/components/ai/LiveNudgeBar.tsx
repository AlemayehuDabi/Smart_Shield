import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { insightSummary, preTradeWarning } from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

const lines = [
  'Live AI nudge: vol elevated — favor staged entries.',
  preTradeWarning,
  insightSummary.slice(0, 118) + '…',
];

type Variant = 'card' | 'inline';

export function LiveNudgeBar({ active, variant = 'card' }: { active: boolean; variant?: Variant }) {
  const th = useAppTheme();
  const [idx, setIdx] = useState(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setIdx((x) => (x + 1) % lines.length), 8200);
    return () => clearInterval(t);
  }, [active]);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(0.55, { duration: 1200 }), -1, true);
  }, [pulse]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  if (variant === 'inline') {
    return (
      <View className="flex-row items-start gap-2">
        <Animated.View style={dotStyle} className="mt-1 h-1.5 w-1.5 rounded-full bg-ai-pulse" />
        <View className="flex-1">
          <Text className="font-sans-bold text-2xs uppercase tracking-wide text-ai-pulse/90">AI nudge</Text>
          <Text className={`mt-0.5 font-sans text-2xs leading-[18px] ${th.textBody}`}>{lines[idx]}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-3 flex-row items-center gap-2 rounded-xl border border-ai-dim/35 bg-ai-dim/15 px-3 py-2">
      <Animated.View style={dotStyle} className="h-2 w-2 rounded-full bg-ai-pulse" />
      <Text className={`flex-1 font-sans text-2xs leading-4 ${th.textBody}`}>{lines[idx]}</Text>
    </View>
  );
}
