import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { emotions, setups, type Trade, type TradeStatus } from '@/src/data/portfolio';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type Draft = {
  symbol: string;
  market: Trade['market'];
  direction: Trade['direction'];
  status: TradeStatus;
  entry: string;
  exit: string;
  size: string;
  setup: string;
  emotion: string;
  adherence: number;
  notes: string;
};

function toDraft(t?: Trade | null): Draft {
  return {
    symbol: t?.symbol ?? '',
    market: t?.market ?? 'crypto',
    direction: t?.direction ?? 'long',
    status: t?.status ?? 'open',
    entry: t?.entry?.toString() ?? '',
    exit: t?.exit?.toString() ?? '',
    size: t?.size?.toString() ?? '',
    setup: t?.setup ?? setups[0],
    emotion: t?.emotion ?? emotions[0],
    adherence: t?.adherence ?? 80,
    notes: t?.notes ?? '',
  };
}

export function TradeForm({
  initial,
  onSave,
}: {
  initial?: Trade | null;
  onSave: (t: Trade) => void;
}) {
  const th = useAppTheme();
  const [d, setD] = useState<Draft>(toDraft(initial));
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const isOpen = d.status === 'open';

  const inputCls = `rounded-xl border px-3.5 py-3 font-sans text-body ${th.borderDefault} ${th.surfaceInput} ${th.dark ? 'text-ink' : 'text-slate-900'}`;
  const labelCls = `mb-1.5 font-sans-medium text-caption ${th.textMuted}`;

  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      className={`rounded-lg border px-3 py-1.5 ${active ? 'border-mint bg-mint/15' : th.borderDefault}`}
    >
      <Text className={`font-sans-medium text-2xs ${active ? 'text-mint' : th.textMuted}`}>{label}</Text>
    </Pressable>
  );

  const ChipRow = ({ label, options, value, onSelect }: { label: string; options: readonly string[]; value: string; onSelect: (v: string) => void }) => (
    <View>
      <Text className={labelCls}>{label}</Text>
      <View className="flex-row flex-wrap gap-1.5">
        {options.map((o) => (
          <Chip key={o} label={o} active={value === o} onPress={() => onSelect(o)} />
        ))}
      </View>
    </View>
  );

  function submit() {
    const entry = parseFloat(d.entry) || 0;
    const exit = d.exit ? parseFloat(d.exit) : undefined;
    const size = parseFloat(d.size) || 0;
    let pnl: number | undefined;
    let pnlPct: number | undefined;
    if (!isOpen && exit) {
      const raw = d.direction === 'long' ? exit - entry : entry - exit;
      pnlPct = entry ? (raw / entry) * 100 : 0;
      pnl = raw * size;
    }
    onSave({
      id: initial?.id ?? `t-${Date.now()}`,
      symbol: d.symbol.trim().toUpperCase() || '—',
      market: d.market,
      direction: d.direction,
      status: d.status,
      entry,
      exit,
      size,
      notional: entry * size,
      pnl,
      pnlPct: pnlPct != null ? Math.round(pnlPct * 10) / 10 : undefined,
      rMultiple: initial?.rMultiple,
      openedAt: initial?.openedAt ?? new Date().toISOString().slice(0, 10),
      closedAt: !isOpen ? initial?.closedAt ?? new Date().toISOString().slice(0, 10) : undefined,
      setup: d.setup,
      emotion: d.emotion,
      adherence: d.adherence,
      notes: d.notes.trim(),
    });
  }

  return (
    <View className="gap-4">
      <View>
        <Text className={labelCls}>Symbol</Text>
        <TextInput
          className={inputCls}
          placeholder="BTC/USDT"
          placeholderTextColor={th.dark ? '#5C6D85' : '#94a3b8'}
          autoCapitalize="characters"
          value={d.symbol}
          onChangeText={(v) => set('symbol', v)}
        />
      </View>

      <ChipRow label="Market" options={['crypto', 'stocks', 'fx']} value={d.market} onSelect={(v) => set('market', v as Trade['market'])} />
      <ChipRow label="Direction" options={['long', 'short']} value={d.direction} onSelect={(v) => set('direction', v as Trade['direction'])} />
      <ChipRow label="Status" options={['open', 'win', 'loss', 'breakeven']} value={d.status} onSelect={(v) => set('status', v as TradeStatus)} />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className={labelCls}>Size</Text>
          <TextInput className={inputCls} placeholder="0.1" placeholderTextColor={th.dark ? '#5C6D85' : '#94a3b8'} keyboardType="numeric" value={d.size} onChangeText={(v) => set('size', v)} />
        </View>
        <View className="flex-1">
          <Text className={labelCls}>Entry</Text>
          <TextInput className={inputCls} placeholder="0.00" placeholderTextColor={th.dark ? '#5C6D85' : '#94a3b8'} keyboardType="numeric" value={d.entry} onChangeText={(v) => set('entry', v)} />
        </View>
        <View className="flex-1">
          <Text className={labelCls}>Exit</Text>
          <TextInput
            className={`${inputCls} ${isOpen ? 'opacity-40' : ''}`}
            editable={!isOpen}
            placeholder={isOpen ? '—' : '0.00'}
            placeholderTextColor={th.dark ? '#5C6D85' : '#94a3b8'}
            keyboardType="numeric"
            value={isOpen ? '' : d.exit}
            onChangeText={(v) => set('exit', v)}
          />
        </View>
      </View>

      <ChipRow label="Setup" options={setups} value={d.setup} onSelect={(v) => set('setup', v)} />
      <ChipRow label="How you felt" options={emotions} value={d.emotion} onSelect={(v) => set('emotion', v)} />

      <View>
        <View className="mb-1.5 flex-row items-center justify-between">
          <Text className={`font-sans-medium text-caption ${th.textMuted}`}>Plan adherence</Text>
          <Text className="font-mono text-caption text-mint">{d.adherence}%</Text>
        </View>
        <View className="flex-row gap-1.5">
          {[40, 60, 70, 80, 90, 100].map((n) => (
            <Chip key={n} label={`${n}`} active={d.adherence === n} onPress={() => set('adherence', n)} />
          ))}
        </View>
      </View>

      <View>
        <Text className={labelCls}>Notes</Text>
        <TextInput
          className={`${inputCls} min-h-[88px]`}
          multiline
          textAlignVertical="top"
          placeholder="What did you see, and what would you do again?"
          placeholderTextColor={th.dark ? '#5C6D85' : '#94a3b8'}
          value={d.notes}
          onChangeText={(v) => set('notes', v)}
        />
      </View>

      <ScalePressable onPress={submit} className="mt-1 overflow-hidden rounded-[14px]">
        <LinearGradient colors={[palette.mintDim, palette.mint]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 15, alignItems: 'center' }}>
          <Text className="font-sans-bold text-body text-canvas">{initial ? 'Save changes' : 'Save trade'}</Text>
        </LinearGradient>
      </ScalePressable>
    </View>
  );
}
