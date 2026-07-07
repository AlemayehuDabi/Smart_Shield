import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/src/theme/use-shield-theme';

export function StatTile({
  label,
  value,
  delta,
  sub,
  tone,
}: {
  label: string;
  value: ReactNode;
  delta?: number; // signed pct, auto-colored
  sub?: string;
  tone?: 'profit' | 'loss';
}) {
  const th = useAppTheme();
  const valueColor =
    tone === 'profit' ? 'text-profit' : tone === 'loss' ? 'text-loss' : th.textTitle;
  return (
    <View className={`flex-1 rounded-[14px] border p-3 ${th.borderDefault} ${th.surfaceCard}`}>
      <Text className={`font-mono text-[10px] uppercase tracking-[0.1em] ${th.textFaint}`}>{label}</Text>
      <Text className={`mt-1.5 font-sans-bold text-title ${valueColor}`}>{value}</Text>
      <View className="mt-1 flex-row items-center gap-1">
        {typeof delta === 'number' ? (
          <Text className={`font-mono text-[11px] ${delta >= 0 ? 'text-profit' : 'text-loss'}`}>
            {delta >= 0 ? '▲' : '▼'} {delta >= 0 ? '+' : ''}
            {delta.toFixed(1)}%
          </Text>
        ) : null}
        {sub ? <Text className={`font-sans text-[11px] ${th.textFaint}`}>{sub}</Text> : null}
      </View>
    </View>
  );
}
