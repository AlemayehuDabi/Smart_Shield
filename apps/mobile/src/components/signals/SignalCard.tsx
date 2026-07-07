import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { Badge } from '@/src/components/ui/Badge';
import { ConfidenceRing } from '@/src/components/charts/ConfidenceRing';
import { Sparkline } from '@/src/components/charts/Sparkline';
import { hrefSignal } from '@/src/lib/routes';
import { statusLabel, type Signal } from '@/src/data/signals';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function SignalCard({ signal }: { signal: Signal }) {
  const th = useAppTheme();
  const isLong = signal.direction === 'long';
  const closed = signal.status.startsWith('closed');
  const spark = signal.candles.slice(-24).map((c) => c.c);
  const result = signal.resultPct ?? 0;

  return (
    <ScalePressable
      onPress={() => router.push(hrefSignal(signal.id))}
      className={`rounded-[14px] border p-3.5 ${th.borderDefault} ${th.surfaceCard}`}
    >
      <View className="flex-row items-center gap-3">
        <ConfidenceRing value={signal.confidence} size={44} strokeWidth={3.5} trackColor={th.dark ? '#1E2A3A' : '#E2E8F0'} textColor={th.dark ? '#E8EEF6' : '#0f172a'} />
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className={`font-sans-bold text-lead ${th.textTitle}`}>{signal.symbol}</Text>
            <Badge tone={isLong ? 'profit' : 'loss'}>{signal.direction}</Badge>
            <Text className={`ml-auto font-mono text-2xs ${th.textFaint}`}>
              {signal.timeframe} · {signal.generatedAt}
            </Text>
          </View>
          <Text numberOfLines={2} className={`mt-1 font-sans text-micro leading-[18px] ${th.textBody}`}>
            {signal.thesis}
          </Text>
        </View>
      </View>

      <View className={`mt-3 flex-row items-center justify-between border-t pt-2.5 ${th.hairline}`}>
        {closed ? (
          <Text className={`font-mono text-caption ${result >= 0 ? 'text-profit' : 'text-loss'}`}>
            {result >= 0 ? '+' : ''}
            {result.toFixed(1)}% · {statusLabel(signal.status)}
          </Text>
        ) : (
          <View className="flex-row items-center gap-1.5">
            {signal.status === 'active' ? <View className="h-1.5 w-1.5 rounded-full bg-mint" /> : null}
            <Text className={`font-mono text-2xs ${signal.status === 'active' ? 'text-mint' : th.textFaint}`}>
              {statusLabel(signal.status)}
            </Text>
          </View>
        )}
        <Sparkline points={spark} width={84} height={22} color={isLong ? '#34D399' : '#FB7185'} uid={signal.id} />
      </View>
    </ScalePressable>
  );
}
