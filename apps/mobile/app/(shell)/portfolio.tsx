import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import { ScreenShell } from '@/src/components/ui/ScreenShell';
import { ShellHeader } from '@/src/components/shell/ShellHeader';
import { Segmented } from '@/src/components/ui/Segmented';
import { StatTile } from '@/src/components/ui/StatTile';
import { Badge } from '@/src/components/ui/Badge';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { AreaLineChart } from '@/src/components/charts/AreaLineChart';
import { MiniBars } from '@/src/components/charts/MiniBars';
import { routes } from '@/src/lib/routes';
import { fmtUsd } from '@/src/data/market';
import {
  benchmarkCurve,
  coachInsights,
  equityCurve,
  exposure,
  monthlyReturns,
  portfolioStats as st,
  positions,
} from '@/src/data/portfolio';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type Range = '1W' | '1M' | '3M' | 'All';
const rangeLen: Record<Range, number> = { '1W': 7, '1M': 30, '3M': 90, All: 90 };

const insightIcon = { loss: 'alert-circle', warn: 'warning', mint: 'sparkles' } as const;

export default function PortfolioScreen() {
  const th = useAppTheme();
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<Range>('3M');
  const grid = th.dark ? '#1E2A3A' : '#E2E8F0';
  const cardW = width - 32 - 24;

  const { you, spy } = useMemo(() => {
    const n = rangeLen[range];
    return { you: equityCurve.slice(-n), spy: benchmarkCurve.slice(-n) };
  }, [range]);

  return (
    <ScreenShell>
      <ShellHeader
        eyebrow="Pillar 02 · Portfolio"
        title="Portfolio"
        subtitle="Your book, your benchmark, and a coach that reads your behavior."
      />

      <View className="mb-3 flex-row gap-2.5">
        <StatTile label="Value" value={fmtUsd(st.totalValue)} delta={st.dayChangePct} sub="today" />
        <StatTile label="Net return" value={`+${st.totalReturnPct}%`} tone="profit" sub={`SPY +${st.benchmarkReturnPct}%`} />
      </View>
      <View className="mb-5 flex-row gap-2.5">
        <StatTile label="Win rate" value={`${st.winRate}%`} sub={`${st.totalTrades} trades`} />
        <StatTile label="Profit factor" value={st.profitFactor.toFixed(1)} delta={11} />
      </View>

      {/* equity curve */}
      <View className={`mb-4 overflow-hidden rounded-[16px] border ${th.borderDefault} ${th.surfaceCard}`}>
        <View className={`flex-row items-center justify-between border-b px-4 py-3 ${th.hairline}`}>
          <View>
            <Text className={`font-mono text-[10px] uppercase tracking-[0.1em] ${th.textFaint}`}>Equity curve</Text>
            <View className="mt-1 flex-row items-center gap-3">
              <View className="flex-row items-center gap-1.5">
                <View className="h-[3px] w-4 rounded-full bg-mint" />
                <Text className={`font-mono text-2xs ${th.textBody}`}>You +{st.totalReturnPct}%</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="h-[3px] w-4 rounded-full" style={{ backgroundColor: palette.inkFaint }} />
                <Text className={`font-mono text-2xs ${th.textFaint}`}>SPY +{st.benchmarkReturnPct}%</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="items-center px-3 py-3">
          <AreaLineChart
            uid="pf-eq"
            width={cardW}
            height={190}
            gridColor={grid}
            series={[
              { points: you, color: palette.mint, fill: true },
              { points: spy, color: palette.inkFaint, dashed: true },
            ]}
          />
        </View>
        <View className="px-4 pb-3">
          <Segmented
            fill
            options={[
              { value: '1W', label: '1W' },
              { value: '1M', label: '1M' },
              { value: '3M', label: '3M' },
              { value: 'All', label: 'All' },
            ]}
            value={range}
            onChange={setRange}
          />
        </View>
      </View>

      {/* exposure */}
      <View className={`mb-4 rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <Text className={`mb-3 font-mono text-[10px] uppercase tracking-[0.1em] ${th.textFaint}`}>Exposure by market</Text>
        <View className="gap-3">
          {exposure.map((e) => (
            <View key={e.label}>
              <View className="mb-1.5 flex-row items-center justify-between">
                <Text className={`font-sans text-micro ${th.textBody}`}>{e.label}</Text>
                <Text className={`font-mono text-micro ${th.textTitle}`}>{e.pct}%</Text>
              </View>
              <View className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: grid }}>
                <View style={{ width: `${e.pct}%`, height: 8, backgroundColor: e.tone, borderRadius: 999 }} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* coach */}
      <View className="mb-2 flex-row items-center gap-2">
        <Ionicons name="sparkles" size={15} color={palette.mint} />
        <Text className={`font-sans-bold text-caption ${th.textTitle}`}>Behavioral coach</Text>
      </View>
      <View className="mb-4 gap-3">
        {coachInsights.map((ins) => (
          <View key={ins.title} className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={insightIcon[ins.tone]}
                size={16}
                color={ins.tone === 'mint' ? palette.mint : ins.tone === 'warn' ? palette.warn : palette.loss}
              />
              <Text className={`flex-1 font-sans-bold text-micro ${th.textTitle}`}>{ins.title}</Text>
            </View>
            <Text className={`mt-2 font-sans text-micro leading-[18px] ${th.textBody}`}>{ins.body}</Text>
            <Text className={`mt-2 font-sans-bold text-2xs ${th.textTitle}`}>{ins.metric}</Text>
          </View>
        ))}
      </View>

      {/* positions */}
      <View className={`mb-4 overflow-hidden rounded-[16px] border ${th.borderDefault} ${th.surfaceCard}`}>
        <View className={`flex-row items-center justify-between border-b px-4 py-3 ${th.hairline}`}>
          <Text className={`font-sans-bold text-caption ${th.textTitle}`}>Open positions</Text>
          <Text className={`font-mono text-2xs ${th.textFaint}`}>{positions.length}</Text>
        </View>
        {positions.map((p, i) => (
          <View key={p.symbol} className={`flex-row items-center px-4 py-3 ${i < positions.length - 1 ? `border-b ${th.hairline}` : ''}`}>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className={`font-sans-bold text-micro ${th.textTitle}`}>{p.symbol}</Text>
                <Badge tone={p.direction === 'long' ? 'profit' : 'loss'}>{p.direction}</Badge>
              </View>
              <View className="mt-1.5 w-20">
                <ProgressBar value={p.weight} height={4} />
              </View>
            </View>
            <View className="items-end">
              <Text className={`font-mono text-micro ${th.textTitle}`}>{fmtUsd(p.value)}</Text>
              <Text className={`font-mono text-2xs ${p.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                {fmtUsd(p.pnl, { sign: true })} ({p.pnlPct >= 0 ? '+' : ''}
                {p.pnlPct}%)
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* monthly */}
      <View className={`mb-4 rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <Text className={`mb-2 font-mono text-[10px] uppercase tracking-[0.1em] ${th.textFaint}`}>Monthly returns</Text>
        <View className="items-center">
          <MiniBars data={monthlyReturns.map((m) => ({ label: m.month, value: m.pct }))} width={cardW} height={120} gridColor={grid} axisColor={palette.inkFaint} />
        </View>
      </View>

      {/* journal link */}
      <ScalePressable
        onPress={() => router.push(routes.journal)}
        className={`flex-row items-center justify-between rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}
      >
        <View className="flex-row items-center gap-2.5">
          <Ionicons name="book-outline" size={18} color={palette.mint} />
          <Text className={`font-sans-medium text-caption ${th.textTitle}`}>Open trade journal</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={th.dark ? palette.inkFaint : '#94a3b8'} />
      </ScalePressable>
    </ScreenShell>
  );
}
