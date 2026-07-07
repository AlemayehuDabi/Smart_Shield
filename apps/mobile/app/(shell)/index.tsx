import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { ScreenShell } from '@/src/components/ui/ScreenShell';
import { ShellHeader } from '@/src/components/shell/ShellHeader';
import { Segmented } from '@/src/components/ui/Segmented';
import { StatTile } from '@/src/components/ui/StatTile';
import { SignalCard } from '@/src/components/signals/SignalCard';
import { signals, type Market } from '@/src/data/signals';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type MarketFilter = 'all' | Market;

export default function SignalsScreen() {
  const th = useAppTheme();
  const [market, setMarket] = useState<MarketFilter>('all');

  const filtered = useMemo(
    () => signals.filter((s) => market === 'all' || s.market === market),
    [market],
  );

  const active = signals.filter((s) => s.status === 'active').length;
  const open = signals.filter((s) => !s.status.startsWith('closed'));
  const avgConf = Math.round(open.reduce((a, s) => a + s.confidence, 0) / open.length);
  const closed = signals.filter((s) => s.status.startsWith('closed'));
  const wins = closed.filter((s) => (s.resultPct ?? 0) > 0).length;
  const winRate = closed.length ? Math.round((wins / closed.length) * 100) : 0;

  return (
    <ScreenShell>
      <ShellHeader
        eyebrow="Pillar 01 · Signals"
        title="Signals"
        subtitle="Every call comes with the reasoning behind it — and the concept to learn it."
      />

      <View className="mb-3 flex-row gap-2.5">
        <StatTile label="Active now" value={active} sub="live" />
        <StatTile label="Avg conf." value={`${avgConf}%`} sub="open" />
      </View>
      <View className="mb-5 flex-row gap-2.5">
        <StatTile label="Win rate · 90d" value={`${winRate}%`} delta={4.2} />
        <StatTile label="Median R:R" value="2.4:1" sub="published" />
      </View>

      <View className="mb-4">
        <Segmented
          fill
          options={[
            { value: 'all', label: 'All' },
            { value: 'crypto', label: 'Crypto' },
            { value: 'stocks', label: 'Stocks' },
            { value: 'fx', label: 'FX' },
          ]}
          value={market}
          onChange={setMarket}
        />
      </View>

      <View className="mb-2 flex-row items-center justify-between">
        <Text className={`font-sans-bold text-2xs uppercase tracking-[0.12em] ${th.textFaint}`}>
          {filtered.length} signal{filtered.length === 1 ? '' : 's'}
        </Text>
      </View>

      <View className="gap-3">
        {filtered.map((s) => (
          <SignalCard key={s.id} signal={s} />
        ))}
      </View>
    </ScreenShell>
  );
}
