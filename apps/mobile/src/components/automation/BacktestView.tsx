import { Ionicons } from '@expo/vector-icons';
import { Text, View, useWindowDimensions } from 'react-native';

import { Badge } from '@/src/components/ui/Badge';
import { StatTile } from '@/src/components/ui/StatTile';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { AreaLineChart } from '@/src/components/charts/AreaLineChart';
import { MiniBars } from '@/src/components/charts/MiniBars';
import {
  backtestBenchmark,
  backtestEquity,
  backtestMetrics as m,
  backtestMonths,
} from '@/src/data/automation';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function BacktestView({ onEdit }: { onEdit: () => void }) {
  const th = useAppTheme();
  const { width } = useWindowDimensions();
  const grid = th.dark ? '#1E2A3A' : '#E2E8F0';
  const cardW = width - 32 - 24;

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <View>
          <View className="flex-row items-center gap-2">
            <Text className={`font-sans-bold text-lead ${th.textTitle}`}>Mean-reversion · BTC</Text>
            <Badge tone="profit">Passed</Badge>
          </View>
          <Text className={`mt-0.5 font-mono text-2xs ${th.textFaint}`}>BTC/USDT · 4H · vs buy &amp; hold</Text>
        </View>
        <ScalePressable onPress={onEdit} className={`rounded-lg border px-3 py-2 ${th.borderDefault}`}>
          <Text className={`font-sans-medium text-2xs ${th.textTitle}`}>Edit rules</Text>
        </ScalePressable>
      </View>

      <View className="flex-row gap-2.5">
        <StatTile label="Net return" value={`+${m.netReturn}%`} tone="profit" sub={`hold +${m.benchmark}%`} />
        <StatTile label="Win rate" value={`${m.winRate}%`} sub={`${m.trades} trades`} />
      </View>
      <View className="flex-row gap-2.5">
        <StatTile label="Profit factor" value={m.profitFactor.toFixed(1)} />
        <StatTile label="Max DD" value={`${m.maxDrawdown}%`} tone="loss" />
      </View>

      {/* equity */}
      <View className={`overflow-hidden rounded-[16px] border ${th.borderDefault} ${th.surfaceCard}`}>
        <View className={`flex-row items-center justify-between border-b px-4 py-3 ${th.hairline}`}>
          <Text className={`font-mono text-[10px] uppercase tracking-[0.1em] ${th.textFaint}`}>Backtest equity</Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1.5">
              <View className="h-[3px] w-4 rounded-full bg-mint" />
              <Text className={`font-mono text-2xs ${th.textBody}`}>Strategy</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="h-[3px] w-4 rounded-full" style={{ backgroundColor: palette.inkFaint }} />
              <Text className={`font-mono text-2xs ${th.textFaint}`}>Hold</Text>
            </View>
          </View>
        </View>
        <View className="items-center px-3 py-3">
          <AreaLineChart
            uid="bt"
            width={cardW}
            height={190}
            gridColor={grid}
            series={[
              { points: backtestEquity, color: palette.mint, fill: true },
              { points: backtestBenchmark, color: palette.inkFaint, dashed: true },
            ]}
          />
        </View>
      </View>

      {/* breakdown */}
      <View className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <Text className={`mb-3 font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Full breakdown</Text>
        <View className="flex-row flex-wrap gap-y-4">
          {[
            ['Sharpe', m.sharpe.toFixed(2), th.textTitle],
            ['Expectancy', `+$${m.expectancy}`, 'text-profit'],
            ['Avg hold', m.avgHold, th.textTitle],
            ['Best', `+$${m.bestTrade}`, 'text-profit'],
            ['Worst', `−$${Math.abs(m.worstTrade)}`, 'text-loss'],
            ['Trades', m.trades.toString(), th.textTitle],
          ].map(([k, v, cls]) => (
            <View key={k} className="w-1/3">
              <Text className={`font-mono text-[9px] uppercase tracking-[0.08em] ${th.textFaint}`}>{k}</Text>
              <Text className={`mt-0.5 font-mono text-caption ${cls}`}>{v}</Text>
            </View>
          ))}
        </View>
        <View className={`mt-4 border-t pt-3 ${th.hairline}`}>
          <Text className={`mb-2 font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Monthly returns</Text>
          <View className="items-center">
            <MiniBars data={backtestMonths.map((x) => ({ label: x.month, value: x.pct }))} width={cardW} height={110} gridColor={grid} axisColor={palette.inkFaint} />
          </View>
        </View>
      </View>

      {/* verdict */}
      <View className="rounded-[16px] border border-mint/25 bg-mint/10 p-4">
        <View className="flex-row items-center gap-2">
          <Ionicons name="sparkles" size={15} color={palette.mint} />
          <Text className={`font-sans-bold text-2xs ${th.textTitle}`}>AI verdict</Text>
        </View>
        <Text className={`mt-2 font-sans text-2xs leading-[18px] ${th.textBody}`}>
          Strong, stable edge: beats buy-and-hold by <Text className={`font-sans-bold ${th.textTitle}`}>3.8×</Text> with a
          shallower drawdown. Win rate holds across all six months — no single lucky trade carries it.
        </Text>
      </View>

      {/* deploy gate */}
      <View className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <View className="flex-row items-center gap-2">
          <Ionicons name="lock-closed" size={14} color={palette.warn} />
          <Text className={`font-sans-bold text-2xs ${th.textTitle}`}>Before you automate</Text>
        </View>
        <Text className={`mt-2 font-sans text-2xs leading-[18px] ${th.textBody}`}>
          A good backtest isn&rsquo;t mastery. Paper-trade this live for 30 days at ≥80% adherence first.
        </Text>
        <View className="mt-3 flex-row gap-1">
          {[1, 1, 1, 1, 0].map((d, i) => (
            <View key={i} className={`h-1.5 flex-1 rounded-full ${d ? 'bg-warn' : th.surfaceElevated}`} />
          ))}
        </View>
        <Text className={`mt-2 font-mono text-2xs ${th.textFaint}`}>4 of 5 mastery checks · 30 days remaining</Text>
        <ScalePressable className={`mt-3 flex-row items-center justify-center gap-2 rounded-[14px] border py-3 ${th.borderDefault} ${th.surfaceInput}`}>
          <Ionicons name="git-branch-outline" size={15} color={th.dark ? palette.ink : '#0f172a'} />
          <Text className={`font-sans-medium text-caption ${th.textTitle}`}>Start paper-trading</Text>
        </ScalePressable>
      </View>
    </View>
  );
}
