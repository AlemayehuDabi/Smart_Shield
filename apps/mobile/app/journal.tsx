import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StackHeader } from '@/src/components/ui/StackHeader';
import { StatTile } from '@/src/components/ui/StatTile';
import { Badge } from '@/src/components/ui/Badge';
import { Segmented } from '@/src/components/ui/Segmented';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { TradeForm } from '@/src/components/journal/TradeForm';
import { fmtUsd } from '@/src/data/market';
import { aiReview, seedTrades, type Trade, type TradeStatus } from '@/src/data/portfolio';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type StatusFilter = 'all' | 'open' | 'win' | 'loss';
const statusText: Record<TradeStatus, string> = { win: 'Win', loss: 'Loss', breakeven: 'B/E', open: 'Open' };

export default function JournalScreen() {
  const th = useAppTheme();
  const insets = useSafeAreaInsets();
  const [list, setList] = useState<Trade[]>(seedTrades);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [editing, setEditing] = useState<Trade | null>(null);
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<Trade | null>(null);

  const filtered = useMemo(
    () => list.filter((t) => status === 'all' || t.status === status),
    [list, status],
  );

  const closed = list.filter((t) => t.status !== 'open');
  const realized = closed.reduce((a, t) => a + (t.pnl ?? 0), 0);
  const wins = closed.filter((t) => t.status === 'win').length;
  const winRate = closed.length ? Math.round((wins / closed.length) * 100) : 0;
  const avgR = closed.length ? closed.reduce((a, t) => a + (t.rMultiple ?? 0), 0) / closed.length : 0;
  const avgAdh = list.length ? Math.round(list.reduce((a, t) => a + t.adherence, 0) / list.length) : 0;

  function upsert(t: Trade) {
    setList((prev) => (prev.some((x) => x.id === t.id) ? prev.map((x) => (x.id === t.id ? t : x)) : [t, ...prev]));
    setCreating(false);
    setEditing(null);
  }
  function confirmDelete(t: Trade) {
    Alert.alert('Delete trade?', `${t.symbol} · ${t.setup}. This removes it from coaching stats.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setList((prev) => prev.filter((x) => x.id !== t.id));
          setViewing(null);
        },
      },
    ]);
  }

  const modalOpen = creating || editing !== null;

  return (
    <View className={`flex-1 ${th.screen}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32, paddingHorizontal: 16 }}
      >
        <StackHeader
          title="Journal"
          right={
            <Pressable
              onPress={() => setCreating(true)}
              className="flex-row items-center gap-1 rounded-full bg-mint px-3 py-1.5"
            >
              <Ionicons name="add" size={16} color={palette.canvas} />
              <Text className="font-sans-bold text-2xs text-canvas">Log</Text>
            </Pressable>
          }
        />

        <Text className={`mt-1 mb-4 font-sans text-caption leading-[20px] ${th.textBody}`}>
          Every trade you log makes your coach sharper.
        </Text>

        <View className="mb-3 flex-row gap-2.5">
          <StatTile label="Realized P&L" value={fmtUsd(realized, { sign: true })} tone={realized >= 0 ? 'profit' : 'loss'} sub={`${closed.length} closed`} />
          <StatTile label="Win rate" value={`${winRate}%`} sub={`${wins}/${closed.length}`} />
        </View>
        <View className="mb-5 flex-row gap-2.5">
          <StatTile label="Avg R" value={`${avgR >= 0 ? '+' : ''}${avgR.toFixed(1)}R`} tone={avgR >= 0 ? 'profit' : 'loss'} />
          <StatTile label="Adherence" value={`${avgAdh}%`} sub="all trades" />
        </View>

        <View className="mb-4">
          <Segmented
            fill
            options={[
              { value: 'all', label: 'All', count: list.length },
              { value: 'open', label: 'Open', count: list.filter((t) => t.status === 'open').length },
              { value: 'win', label: 'Wins', count: list.filter((t) => t.status === 'win').length },
              { value: 'loss', label: 'Loss', count: list.filter((t) => t.status === 'loss').length },
            ]}
            value={status}
            onChange={setStatus}
          />
        </View>

        <View className="gap-2.5">
          {filtered.map((t) => (
            <ScalePressable
              key={t.id}
              onPress={() => setViewing(t)}
              className={`rounded-[14px] border p-3.5 ${th.borderDefault} ${th.surfaceCard}`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className={`font-sans-bold text-micro ${th.textTitle}`}>{t.symbol}</Text>
                  <Badge tone={t.direction === 'long' ? 'profit' : 'loss'}>{t.direction}</Badge>
                </View>
                <Text className={`font-sans-bold text-micro ${t.status === 'open' ? th.textMuted : (t.pnl ?? 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {t.status === 'open' ? `${(t.pnlPct ?? 0) >= 0 ? '+' : ''}${t.pnlPct ?? 0}%` : fmtUsd(t.pnl ?? 0, { sign: true })}
                </Text>
              </View>
              <View className="mt-1.5 flex-row items-center justify-between">
                <Text className={`font-sans text-2xs ${th.textMuted}`}>{t.setup}</Text>
                <Text className={`font-mono text-2xs ${t.emotion === 'Revenge' || t.emotion === 'FOMO' ? 'text-loss' : th.textFaint}`}>
                  {t.emotion} · {t.adherence}%
                </Text>
              </View>
            </ScalePressable>
          ))}
          {filtered.length === 0 ? (
            <View className={`items-center rounded-[14px] border p-8 ${th.borderDefault} ${th.surfaceCard}`}>
              <Text className={`font-sans text-micro ${th.textMuted}`}>No trades match this filter.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* create / edit */}
      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => { setCreating(false); setEditing(null); }}>
        <View className="flex-1 justify-end bg-black/55">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View className={`max-h-[88%] rounded-t-3xl border-t ${th.borderDefault} ${th.dark ? 'bg-canvas-elevated' : 'bg-white'}`}>
              <View className={`flex-row items-center justify-between border-b px-5 py-4 ${th.hairline}`}>
                <Text className={`font-sans-bold text-title ${th.textTitle}`}>{editing ? 'Edit trade' : 'Log a trade'}</Text>
                <Pressable onPress={() => { setCreating(false); setEditing(null); }} className={`h-8 w-8 items-center justify-center rounded-full ${th.surfaceElevated}`}>
                  <Ionicons name="close" size={18} color={th.dark ? palette.inkMuted : '#475569'} />
                </Pressable>
              </View>
              <ScrollView className="px-5 py-4" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
                <TradeForm initial={editing} onSave={upsert} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* detail */}
      <Modal visible={viewing !== null} animationType="slide" transparent onRequestClose={() => setViewing(null)}>
        <View className="flex-1 justify-end bg-black/55">
          <View className={`max-h-[88%] rounded-t-3xl border-t ${th.borderDefault} ${th.dark ? 'bg-canvas-elevated' : 'bg-white'}`}>
            {viewing ? (
              <>
                <View className={`flex-row items-center justify-between border-b px-5 py-4 ${th.hairline}`}>
                  <View>
                    <Text className={`font-sans-bold text-title ${th.textTitle}`}>{viewing.symbol}</Text>
                    <Text className={`font-sans text-2xs ${th.textMuted}`}>{viewing.direction.toUpperCase()} · {statusText[viewing.status]} · {viewing.setup}</Text>
                  </View>
                  <Pressable onPress={() => setViewing(null)} className={`h-8 w-8 items-center justify-center rounded-full ${th.surfaceElevated}`}>
                    <Ionicons name="close" size={18} color={th.dark ? palette.inkMuted : '#475569'} />
                  </Pressable>
                </View>
                <ScrollView className="px-5 py-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
                  <View className="flex-row flex-wrap gap-2.5">
                    {[
                      ['Entry', viewing.entry.toString()],
                      ['Exit', viewing.exit?.toString() ?? '—'],
                      ['P&L', viewing.pnl != null ? fmtUsd(viewing.pnl, { sign: true }) : `${(viewing.pnlPct ?? 0) >= 0 ? '+' : ''}${viewing.pnlPct ?? 0}%`],
                      ['R', viewing.rMultiple != null ? `${viewing.rMultiple >= 0 ? '+' : ''}${viewing.rMultiple}R` : '—'],
                      ['Notional', fmtUsd(viewing.notional)],
                      ['Adherence', `${viewing.adherence}%`],
                    ].map(([k, v]) => (
                      <View key={k} className={`w-[31%] rounded-xl border p-2.5 ${th.borderDefault} ${th.surfaceCard}`}>
                        <Text className={`font-mono text-[9px] uppercase tracking-[0.08em] ${th.textFaint}`}>{k}</Text>
                        <Text className={`mt-0.5 font-mono text-micro ${th.textTitle}`}>{v}</Text>
                      </View>
                    ))}
                  </View>

                  {viewing.notes ? (
                    <View className="mt-4">
                      <Text className={`mb-1 font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Your notes</Text>
                      <Text className={`font-sans text-micro leading-[19px] ${th.textBody}`}>{viewing.notes}</Text>
                    </View>
                  ) : null}

                  <View className="mt-4 rounded-2xl border border-mint/25 bg-mint/10 p-4">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="sparkles" size={15} color={palette.mint} />
                      <Text className={`font-sans-bold text-2xs ${th.textTitle}`}>AI trade review</Text>
                    </View>
                    <Text className={`mt-2 font-sans text-micro leading-[19px] ${th.textBody}`}>{aiReview(viewing)}</Text>
                  </View>

                  <View className="mt-5 flex-row gap-2.5">
                    <ScalePressable
                      onPress={() => { const t = viewing; setViewing(null); setEditing(t); }}
                      className={`flex-1 items-center rounded-[14px] border py-3 ${th.borderDefault} ${th.surfaceCard}`}
                    >
                      <Text className={`font-sans-medium text-caption ${th.textTitle}`}>Edit</Text>
                    </ScalePressable>
                    <ScalePressable
                      onPress={() => confirmDelete(viewing)}
                      className="flex-1 items-center rounded-[14px] border border-loss/40 py-3"
                    >
                      <Text className="font-sans-medium text-caption text-loss">Delete</Text>
                    </ScalePressable>
                  </View>
                </ScrollView>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}
