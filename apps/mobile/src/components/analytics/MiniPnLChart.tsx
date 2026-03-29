import { Text, View } from 'react-native';

import { AppCard } from '@/src/components/ui/AppCard';
import { chartSeries } from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function MiniPnLChart() {
  const th = useAppTheme();
  const max = Math.max(...chartSeries.pnl.map((v) => Math.abs(v)));
  return (
    <AppCard className="mb-3">
      <Text className={`mb-2 font-sans-bold text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>
        Week · net PnL
      </Text>
      <View className="flex-row items-end justify-between gap-1" style={{ height: 88 }}>
        {chartSeries.pnl.map((v, i) => {
          const h = (Math.abs(v) / max) * 76 + 8;
          const up = v >= 0;
          return (
            <View key={chartSeries.labels[i]} className="flex-1 items-center">
              <View
                className={`w-[85%] max-w-[32px] rounded-t-md ${up ? 'bg-profit' : 'bg-loss'}`}
                style={{ height: h, opacity: 0.88 }}
              />
              <Text className={`mt-1.5 font-mono text-2xs ${th.textFaint}`}>
                {chartSeries.labels[i]}
              </Text>
            </View>
          );
        })}
      </View>
    </AppCard>
  );
}
