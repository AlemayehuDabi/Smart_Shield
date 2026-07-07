import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Badge } from '@/src/components/ui/Badge';
import { StatTile } from '@/src/components/ui/StatTile';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import {
  activityFeed,
  automationStats as st,
  type ActivityKind,
  type Strategy,
  type StrategyStatus,
} from '@/src/data/automation';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

const statusTone: Record<StrategyStatus, 'profit' | 'warn'> = { live: 'profit', paused: 'warn', locked: 'warn' };
const statusLabel: Record<StrategyStatus, string> = { live: 'Live', paused: 'Paused', locked: 'Locked' };
const kindColor: Record<ActivityKind, string> = {
  entry: palette.mint,
  exit: palette.profit,
  blocked: palette.loss,
  info: palette.inkFaint,
};
const kindIcon: Record<ActivityKind, keyof typeof Ionicons.glyphMap> = {
  entry: 'arrow-forward',
  exit: 'checkmark',
  blocked: 'close',
  info: 'shield-checkmark-outline',
};

function ruleColor(tone?: 'profit' | 'loss' | 'neutral') {
  if (tone === 'profit') return 'border-profit/30 bg-profit/12';
  if (tone === 'loss') return 'border-loss/30 bg-loss/12';
  return '';
}

function StrategyCard({ s, killed, onToggle }: { s: Strategy; killed: boolean; onToggle: (id: string) => void }) {
  const th = useAppTheme();
  const locked = s.status === 'locked';
  const live = s.status === 'live' && !killed;

  return (
    <View className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start gap-3">
          <View className={`h-9 w-9 items-center justify-center rounded-lg ${locked ? 'bg-warn/15' : 'bg-mint/15'}`}>
            <Ionicons name={locked ? 'lock-closed' : 'git-branch-outline'} size={16} color={locked ? palette.warn : palette.mint} />
          </View>
          <View>
            <View className="flex-row items-center gap-2">
              <Text className={`font-sans-bold text-micro ${th.textTitle}`}>{s.name}</Text>
              <Badge tone={killed && s.status === 'live' ? 'loss' : statusTone[s.status]}>
                {killed && s.status === 'live' ? 'Halted' : statusLabel[s.status]}
              </Badge>
            </View>
            <Text className={`mt-0.5 font-mono text-2xs ${th.textFaint}`}>{s.symbol} · {s.timeframe} · {s.since}</Text>
          </View>
        </View>
        {!locked ? (
          <ScalePressable
            onPress={() => onToggle(s.id)}
            disabled={killed}
            className={`flex-row items-center gap-1.5 rounded-lg px-3 py-1.5 ${live ? `border ${th.borderDefault}` : 'bg-mint'} ${killed ? 'opacity-40' : ''}`}
          >
            <Ionicons name={live ? 'pause' : 'play'} size={13} color={live ? (th.dark ? palette.ink : '#0f172a') : palette.canvas} />
            <Text className={`font-sans-bold text-2xs ${live ? th.textTitle : 'text-canvas'}`}>{live ? 'Pause' : 'Start'}</Text>
          </ScalePressable>
        ) : (
          <View className={`flex-row items-center gap-1 rounded-lg border px-2.5 py-1.5 ${th.borderDefault}`}>
            <Ionicons name="lock-closed" size={12} color={palette.warn} />
            <Text className={`font-mono text-2xs ${th.textMuted}`}>{s.mastery.done}/{s.mastery.total}</Text>
          </View>
        )}
      </View>

      <Text className={`mt-3 font-sans text-2xs leading-[18px] ${th.textBody}`}>{s.description}</Text>

      {/* rule chips */}
      <View className="mt-3 flex-row flex-wrap items-center gap-1.5">
        {s.rules.map((r, i) => (
          <View key={i} className="flex-row items-center gap-1.5">
            <Text className={`font-mono text-2xs ${th.textFaint}`}>{r.kind === 'THEN' ? '→' : r.kind}</Text>
            <View className={`rounded-md border px-2 py-1 ${ruleColor(r.tone) || th.borderDefault}`}>
              <Text
                className={`font-mono text-2xs ${
                  r.tone === 'profit' ? 'text-profit' : r.tone === 'loss' ? 'text-loss' : th.textMuted
                }`}
              >
                {r.text}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {locked ? (
        <View className="mt-3 rounded-xl border border-warn/25 bg-warn/10 p-3">
          <View className="mb-2 flex-row gap-1">
            {Array.from({ length: s.mastery.total }).map((_, i) => (
              <View key={i} className={`h-1 flex-1 rounded-full ${i < s.mastery.done ? 'bg-warn' : th.surfaceElevated}`} />
            ))}
          </View>
          <Text className={`font-sans text-2xs leading-[17px] ${th.textBody}`}>
            Locked until mastered. Remaining: 30 days of paper-trading at ≥80% adherence.
          </Text>
        </View>
      ) : (
        <View className={`mt-3 flex-row items-center justify-between border-t pt-3 ${th.hairline}`}>
          <View className="flex-row items-center gap-3">
            <Text className={`font-mono text-2xs ${th.textMuted}`}>{s.perf.trades} trades</Text>
            <Text className={`font-mono text-2xs ${th.textMuted}`}>{s.perf.winRate}% win</Text>
            <Text className={`font-mono text-2xs ${s.perf.pnlPct >= 0 ? 'text-profit' : 'text-loss'}`}>
              {s.perf.pnlPct >= 0 ? '+' : ''}{s.perf.pnlPct}%
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="shield-checkmark-outline" size={12} color={palette.mint} />
            <Text className={`font-mono text-2xs ${th.textFaint}`}>DD {s.guardrails.maxDrawdown}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export function ControlPanel({
  strategies,
  killed,
  onToggle,
  onToggleKill,
  brokerConnected,
  onOpenBroker,
}: {
  strategies: Strategy[];
  killed: boolean;
  onToggle: (id: string) => void;
  onToggleKill: () => void;
  brokerConnected: boolean;
  onOpenBroker: () => void;
}) {
  const th = useAppTheme();
  const liveCount = killed ? 0 : strategies.filter((s) => s.status === 'live').length;

  return (
    <View className="gap-4">
      {/* broker banner */}
      <View className={`flex-row items-center justify-between rounded-[16px] border p-4 ${brokerConnected ? 'border-mint/25 bg-mint/10' : `${th.borderDefault} ${th.surfaceCard}`}`}>
        <View className="flex-1 flex-row items-center gap-3 pr-3">
          <View className={`h-9 w-9 items-center justify-center rounded-lg ${brokerConnected ? 'bg-mint' : th.surfaceElevated}`}>
            <Ionicons name="link" size={16} color={brokerConnected ? palette.canvas : palette.inkMuted} />
          </View>
          <View className="flex-1">
            <Text className={`font-sans-bold text-2xs ${th.textTitle}`}>
              {brokerConnected ? 'Binance connected' : 'No broker connected'}
            </Text>
            <Text className={`mt-0.5 font-sans text-2xs ${th.textMuted}`}>
              {brokerConnected ? 'Automations can place orders within guardrails.' : 'Demo — no real keys requested.'}
            </Text>
          </View>
        </View>
        <ScalePressable onPress={onOpenBroker} className={`rounded-lg px-3 py-2 ${brokerConnected ? `border ${th.borderDefault}` : 'bg-mint'}`}>
          <Text className={`font-sans-bold text-2xs ${brokerConnected ? th.textTitle : 'text-canvas'}`}>
            {brokerConnected ? 'Manage' : 'Connect'}
          </Text>
        </ScalePressable>
      </View>

      {/* KPIs + kill switch */}
      <View className="flex-row gap-2.5">
        <StatTile label="Live" value={liveCount} sub={killed ? 'halted' : 'running'} />
        <StatTile label="Today" value={`+$${st.todayPnl}`} tone="profit" />
        <StatTile label="Open risk" value={killed ? '0%' : st.openRisk} sub="equity" />
      </View>

      <ScalePressable
        onPress={onToggleKill}
        className={`flex-row items-center justify-center gap-2 rounded-[16px] py-3.5 ${killed ? `border ${th.borderDefault} ${th.surfaceCard}` : ''}`}
        style={killed ? undefined : { backgroundColor: palette.loss }}
      >
        <Ionicons name={killed ? 'play' : 'stop-circle'} size={18} color={killed ? palette.mint : '#fff'} />
        <Text className={`font-sans-bold text-body ${killed ? 'text-mint' : 'text-white'}`}>
          {killed ? 'Resume all automations' : 'Kill switch — halt everything'}
        </Text>
      </ScalePressable>

      {killed ? (
        <View className="flex-row items-center gap-2.5 rounded-[16px] border border-loss/30 bg-loss/10 p-3.5">
          <Ionicons name="warning" size={16} color={palette.loss} />
          <Text className={`flex-1 font-sans text-2xs leading-[17px] ${th.textBody}`}>
            <Text className="font-sans-bold text-loss">Kill switch engaged.</Text> No new orders will be placed.
            Open positions are left untouched.
          </Text>
        </View>
      ) : null}

      {/* strategies */}
      <View className="mt-1 gap-3">
        <Text className={`font-sans-bold text-caption ${th.textTitle}`}>Your strategies</Text>
        {strategies.map((s) => (
          <StrategyCard key={s.id} s={s} killed={killed} onToggle={onToggle} />
        ))}
      </View>

      {/* activity feed */}
      <View className="mt-1">
        <View className="mb-2.5 flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-mint" />
          <Text className={`font-sans-bold text-caption ${th.textTitle}`}>Live activity</Text>
        </View>
        <View className={`overflow-hidden rounded-[16px] border ${th.borderDefault} ${th.surfaceCard}`}>
          {activityFeed.map((e, i) => (
            <View key={e.id} className={`flex-row gap-3 px-4 py-3 ${i < activityFeed.length - 1 ? `border-b ${th.hairline}` : ''}`}>
              <View
                className="mt-0.5 h-5 w-5 items-center justify-center rounded-full"
                style={{ backgroundColor: `${kindColor[e.kind]}22` }}
              >
                <Ionicons name={kindIcon[e.kind]} size={11} color={kindColor[e.kind]} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className={`font-mono text-[10px] uppercase tracking-[0.06em] ${th.textFaint}`} numberOfLines={1}>
                    {e.strategy}
                  </Text>
                  <Text className={`font-mono text-[10px] ${th.textFaint}`}>{e.time}</Text>
                </View>
                <Text className={`mt-0.5 font-sans text-2xs leading-[17px] ${th.textBody}`}>
                  {e.text}
                  {e.pnl ? <Text className="font-sans-bold text-profit"> {e.pnl}</Text> : null}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
