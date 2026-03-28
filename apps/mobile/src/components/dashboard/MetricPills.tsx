import { FlatList, Text, View, type ListRenderItem } from 'react-native';

import type { Metric } from '@/src/lib/mock-data';
import { layout } from '@/src/theme/layout';
import { useAppTheme } from '@/src/theme/use-shield-theme';

const PILL_W = 108;

export function MetricPills({ items }: { items: Metric[] }) {
  const th = useAppTheme();

  const renderItem: ListRenderItem<Metric> = ({ item: m }) => (
    <View
      style={{ width: PILL_W, marginRight: 8 }}
      className={`rounded-xl border ${th.borderDefault} ${th.surfaceElevated} px-2.5 py-2`}>
      <Text className={`font-sans-medium text-2xs uppercase tracking-wide ${th.textFaint}`}>{m.label}</Text>
      <Text className={`mt-0.5 font-mono text-title ${th.textTitle}`}>{m.value}</Text>
      <Text
        className={`mt-0.5 font-mono text-2xs ${
          m.trend === 'up' ? 'text-profit' : m.trend === 'down' ? 'text-loss' : th.textMuted
        }`}>
        {m.delta}
      </Text>
    </View>
  );

  return (
    <View style={{ marginHorizontal: -layout.screenPadX }}>
      <FlatList
        data={items}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces
        style={{ maxHeight: 96 }}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: layout.screenPadX,
          paddingVertical: 2,
        }}
      />
    </View>
  );
}
