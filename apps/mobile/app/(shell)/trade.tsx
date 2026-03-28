import { useState } from 'react';
import { Text, View } from 'react-native';

import { CandleChart } from '@/src/components/charts/CandleChart';
import { OrdersList } from '@/src/components/trading/OrdersList';
import { PositionsList } from '@/src/components/trading/PositionsList';
import { TradeContextStrip } from '@/src/components/trading/TradeContextStrip';
import { TradePanel } from '@/src/components/trading/TradePanel';
import { WatchlistChips } from '@/src/components/trading/WatchlistChips';
import { AppCard } from '@/src/components/ui/AppCard';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { ListSectionLabel, ScreenTitle } from '@/src/components/ui/SectionHeader';
import { ScreenShell } from '@/src/components/ui/ScreenShell';
import { useLiveQuote } from '@/src/hooks/use-live-quote';
import {
  chartCandles,
  chartOverlayNote,
  positions,
  preTradeWarning,
  recentOrders,
  watchlist,
} from '@/src/lib/mock-data';
import { useAppStore } from '@/src/stores/use-app-store';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export default function TradeScreen() {
  const th = useAppTheme();
  const paperMode = useAppStore((s) => s.paperMode);
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const setSymbol = useAppStore((s) => s.setSelectedSymbol);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const q = useLiveQuote();

  return (
    <ScreenShell>
      <View className="mb-3 flex-row items-start justify-between gap-2">
        <View className="min-w-0 flex-1">
          <ScreenTitle
            className="mb-0"
            eyebrow="Terminal"
            title={selectedSymbol}
            subtitle={
              paperMode ? 'Paper book — no capital at risk' : 'Live · AI co-pilot latched to this book'
            }
          />
        </View>
        {paperMode ? (
          <View className="mt-1 rounded-full border border-mint/35 bg-mint/10 px-2.5 py-1">
            <Text className="font-sans-bold text-2xs uppercase tracking-wide text-mint">Paper</Text>
          </View>
        ) : null}
      </View>

      <WatchlistChips rows={watchlist} selected={selectedSymbol} onSelect={setSymbol} />

      <AppCard className={`mb-3 ${th.dark ? 'bg-canvas-elevated/60' : 'bg-slate-50'}`}>
        <View className="flex-row items-end justify-between">
          <View className="min-w-0 flex-1">
            <Text className={`font-mono text-2xs uppercase ${th.textFaint}`}>{q.name}</Text>
            <Text className={`mt-0.5 font-mono text-hero ${th.textTitle}`} numberOfLines={1}>
              {q.formatted}
            </Text>
            <Text className={`mt-0.5 font-mono text-micro ${q.chgPct >= 0 ? 'text-profit' : 'text-loss'}`}>
              {q.chgPct >= 0 ? '+' : ''}
              {q.chgPct.toFixed(2)}% · vol {q.vol}
            </Text>
          </View>
          <ScalePressable
            onPress={() => setSide((s) => (s === 'buy' ? 'sell' : 'buy'))}
            className={`rounded-lg border px-3 py-2 ${th.borderDefault} ${th.surfaceCard}`}>
            <Text className={`font-sans-medium text-2xs ${th.textMuted}`}>Side</Text>
            <Text className={`mt-0.5 text-center font-sans-bold text-micro ${side === 'buy' ? 'text-profit' : 'text-loss'}`}>
              {side === 'buy' ? 'BUY' : 'SELL'}
            </Text>
          </ScalePressable>
        </View>
      </AppCard>

      <TradeContextStrip preTradeText={preTradeWarning} />

      <View className="mb-3">
        <CandleChart
          candles={chartCandles}
          overlayBarIndex={chartOverlayNote.barIndex}
          overlayLabel={`${chartOverlayNote.label}: ${chartOverlayNote.text}`}
          height={196}
        />
      </View>

      <ListSectionLabel>Positions</ListSectionLabel>
      <PositionsList rows={positions} />

      <View className={`mb-3 border-t pt-3 ${th.borderMuted}`}>
        <ListSectionLabel>Execute</ListSectionLabel>
        <TradePanel
          symbol={selectedSymbol}
          side={side}
          onFlipSide={() => setSide((s) => (s === 'buy' ? 'sell' : 'buy'))}
          paperMode={paperMode}
        />
      </View>

      <ListSectionLabel>Orders</ListSectionLabel>
      <OrdersList rows={recentOrders} />
    </ScreenShell>
  );
}
