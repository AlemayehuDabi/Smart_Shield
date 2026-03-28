import * as Haptics from 'expo-haptics';
import { ScrollView, Text } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { layout } from '@/src/theme/layout';
import { useAppTheme } from '@/src/theme/use-shield-theme';

import type { WatchRow } from '@/src/lib/mock-data';

export function WatchlistChips({
  rows,
  selected,
  onSelect,
}: {
  rows: WatchRow[];
  selected: string;
  onSelect: (symbol: string) => void;
}) {
  const th = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -layout.screenPadX, marginBottom: 12 }}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        paddingHorizontal: layout.screenPadX,
      }}>
      {rows.map((w) => {
        const on = w.symbol === selected;
        const up = w.chgPct >= 0;
        return (
          <ScalePressable
            key={w.symbol}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(w.symbol);
            }}
            className={`min-w-[100px] rounded-xl border px-2.5 py-2 ${
              on ? 'border-mint bg-mint/12' : `${th.borderDefault} ${th.surfaceCard}`
            }`}>
            <Text className={`font-mono text-2xs ${th.textFaint}`}>{w.symbol}</Text>
            <Text className={`mt-0.5 font-mono text-micro ${th.textMono}`}>{w.last}</Text>
            <Text className={`mt-0.5 font-mono text-2xs ${up ? 'text-profit' : 'text-loss'}`}>
              {up ? '+' : ''}
              {w.chgPct.toFixed(2)}%
            </Text>
          </ScalePressable>
        );
      })}
    </ScrollView>
  );
}
