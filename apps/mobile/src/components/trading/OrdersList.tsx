import { Text, View } from 'react-native';

import type { OrderRow } from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

const statusTone: Record<OrderRow['status'], string> = {
  filled: 'text-profit',
  working: 'text-warn',
  cancelled: 'text-slate-400',
};

export function OrdersList({ rows }: { rows: OrderRow[] }) {
  const th = useAppTheme();

  return (
    <View className="pb-2">
      {rows.map((o, i) => (
        <View
          key={o.id}
          className={`flex-row items-center justify-between rounded-lg border px-2.5 py-2 ${th.borderDefault} ${
            th.dark ? 'bg-canvas-panel/40' : 'bg-white/80'
          } ${i < rows.length - 1 ? 'mb-1.5' : ''}`}>
          <View className="min-w-0 flex-1 pr-2">
            <Text className={`font-mono text-micro ${th.textMono}`}>{o.symbol}</Text>
            <Text className={`font-sans text-2xs ${th.textBody}`} numberOfLines={1}>
              {o.side.toUpperCase()} · {o.type} · {o.qty} @ {o.price}
            </Text>
          </View>
          <View className="items-end">
            <Text
              className={`font-mono text-2xs uppercase ${
                o.status === 'cancelled' ? th.textFaint : statusTone[o.status]
              }`}>
              {o.status}
            </Text>
            <Text className={`font-mono text-2xs ${th.textFaint}`}>{o.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
