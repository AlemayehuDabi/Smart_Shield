import { Text, View } from 'react-native';

import { LiveNudgeBar } from '@/src/components/ai/LiveNudgeBar';
import { AppCard } from '@/src/components/ui/AppCard';
import { useAppTheme } from '@/src/theme/use-shield-theme';

/** Pre-trade shield + rotating AI nudge — one cohesive mobile block */
export function TradeContextStrip({ preTradeText }: { preTradeText: string }) {
  const th = useAppTheme();
  return (
    <AppCard className={`mb-3 border-warn/30 ${th.dark ? 'bg-warn/[0.06]' : 'bg-amber-50/90'}`}>
      <View className="flex-row gap-2.5">
        <View className="mt-0.5 h-6 w-0.5 rounded-full bg-warn/80" />
        <View className="flex-1">
          <Text className="font-sans-bold text-2xs uppercase tracking-wide text-warn">Pre-trade</Text>
          <Text className={`mt-1 font-sans text-micro leading-[21px] ${th.textTitle}`}>{preTradeText}</Text>
        </View>
      </View>
      <View className={`mt-3 border-t pt-2.5 ${th.borderMuted}`}>
        <LiveNudgeBar active variant="inline" />
      </View>
    </AppCard>
  );
}
