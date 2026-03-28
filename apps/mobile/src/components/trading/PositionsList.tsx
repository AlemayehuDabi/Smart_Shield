import { Text, View } from 'react-native';

import type { PositionRow } from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function PositionsList({ rows }: { rows: PositionRow[] }) {
  const th = useAppTheme();

  return (
    <View className="mb-3">
      {rows.map((p, i) => {
        const long = p.side === 'long';
        return (
          <View
            key={p.id}
            className={`flex-row items-center justify-between rounded-xl border px-2.5 py-2 ${th.borderDefault} ${th.surfaceElevated} ${
              i < rows.length - 1 ? 'mb-1.5' : ''
            }`}>
            <View className="min-w-0 flex-1">
              <Text className={`font-mono text-micro ${th.textMono}`}>{p.symbol}</Text>
              <Text className={`font-sans-medium text-2xs ${long ? 'text-profit' : 'text-loss'}`}>
                {long ? 'LONG' : 'SHORT'} · {p.size}
              </Text>
            </View>
            <View className="items-end pl-2">
              <Text className={`font-mono text-2xs ${th.textMuted}`}>{p.mark}</Text>
              <Text className={`font-mono text-micro ${p.pnl.startsWith('+') ? 'text-profit' : 'text-loss'}`}>
                {p.pnl}{' '}
                <Text className="text-2xs">({p.pnlPct.toFixed(1)}%)</Text>
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
