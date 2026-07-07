import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { builderPalette as pal } from '@/src/data/automation';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type Condition = { id: string; indicator: string; operator: string; value: string };
let seq = 0;
const uid = () => `c${++seq}`;

export function StrategyBuilder({ onRunBacktest }: { onRunBacktest: () => void }) {
  const th = useAppTheme();
  const [name, setName] = useState('Mean-reversion · BTC');
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('4H');
  const [action, setAction] = useState('LONG');
  const [risk, setRisk] = useState('1');
  const [conditions, setConditions] = useState<Condition[]>([
    { id: uid(), indicator: 'RSI(14)', operator: '<', value: '30' },
    { id: uid(), indicator: 'EMA(200)', operator: '<', value: 'price' },
  ]);

  const inputCls = `rounded-xl border px-3 py-2.5 font-sans text-caption ${th.borderDefault} ${th.surfaceInput} ${th.dark ? 'text-ink' : 'text-slate-900'}`;
  const labelCls = `mb-1.5 font-sans-medium text-2xs ${th.textMuted}`;

  const addCondition = (indicator: string) =>
    setConditions((prev) => [...prev, { id: uid(), indicator, operator: '>', value: '' }]);
  const removeCondition = (id: string) => setConditions((prev) => prev.filter((c) => c.id !== id));
  const cycleOp = (id: string) =>
    setConditions((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, operator: pal.operators[(pal.operators.indexOf(c.operator) + 1) % pal.operators.length] } : c,
      ),
    );

  const compiled = [
    ...conditions.map((c, i) => `${i === 0 ? 'IF   ' : 'AND  '}${c.indicator} ${c.operator} ${c.value || '…'}`),
    `THEN ${action} · risk ${risk}%`,
  ].join('\n');

  return (
    <View className="gap-4">
      {/* meta */}
      <View className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <Text className={`mb-3 font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Strategy</Text>
        <Text className={labelCls}>Name</Text>
        <TextInput className={inputCls} value={name} onChangeText={setName} placeholderTextColor={palette.inkFaint} />
        <View className="mt-3 flex-row gap-3">
          <View className="flex-1">
            <Text className={labelCls}>Instrument</Text>
            <TextInput className={inputCls} value={symbol} onChangeText={setSymbol} autoCapitalize="characters" placeholderTextColor={palette.inkFaint} />
          </View>
          <View className="flex-1">
            <Text className={labelCls}>Timeframe</Text>
            <View className="flex-row gap-1.5">
              {['1H', '4H', '1D'].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTimeframe(t)}
                  className={`flex-1 items-center rounded-lg border py-2.5 ${timeframe === t ? 'border-mint bg-mint/15' : th.borderDefault}`}
                >
                  <Text className={`font-mono text-2xs ${timeframe === t ? 'text-mint' : th.textMuted}`}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* conditions */}
      <View className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <Text className={`mb-3 font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Entry conditions</Text>
        <View className="gap-2">
          {conditions.map((c, i) => (
            <View key={c.id} className="flex-row items-center gap-2">
              <Text className={`w-8 font-mono text-2xs ${th.textFaint}`}>{i === 0 ? 'IF' : 'AND'}</Text>
              <View className={`flex-1 rounded-lg border px-2.5 py-2 ${th.borderDefault} ${th.surfaceInput}`}>
                <Text className={`font-mono text-2xs ${th.textTitle}`}>{c.indicator}</Text>
              </View>
              <Pressable onPress={() => cycleOp(c.id)} className={`rounded-lg border px-2.5 py-2 ${th.borderDefault}`}>
                <Text className="font-mono text-2xs text-mint">{c.operator}</Text>
              </Pressable>
              <TextInput
                className={`w-16 rounded-lg border px-2 py-2 text-center font-mono text-2xs ${th.borderDefault} ${th.surfaceInput} ${th.dark ? 'text-ink' : 'text-slate-900'}`}
                placeholder="val"
                placeholderTextColor={palette.inkFaint}
                value={c.value}
                onChangeText={(v) => setConditions((prev) => prev.map((x) => (x.id === c.id ? { ...x, value: v } : x)))}
              />
              <Pressable onPress={() => removeCondition(c.id)} className="h-7 w-7 items-center justify-center">
                <Ionicons name="close" size={16} color={palette.inkFaint} />
              </Pressable>
            </View>
          ))}
        </View>

        <Text className={`mb-2 mt-4 font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Tap to add</Text>
        <View className="flex-row flex-wrap gap-1.5">
          {pal.indicators.map((ind) => (
            <Pressable
              key={ind}
              onPress={() => addCondition(ind)}
              className={`flex-row items-center gap-1 rounded-lg border px-2.5 py-1.5 ${th.borderDefault} ${th.surfaceInput}`}
            >
              <Ionicons name="add" size={12} color={palette.mint} />
              <Text className={`font-mono text-2xs ${th.textMuted}`}>{ind}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* action */}
      <View className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <Text className={`mb-3 font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Action</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className={labelCls}>Then</Text>
            <View className="flex-row gap-1.5">
              {pal.actions.map((a) => (
                <Pressable
                  key={a}
                  onPress={() => setAction(a)}
                  className={`flex-1 items-center rounded-lg border py-2.5 ${action === a ? 'border-mint bg-mint/15' : th.borderDefault}`}
                >
                  <Text className={`font-mono text-2xs ${action === a ? 'text-mint' : th.textMuted}`}>{a}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View className="w-24">
            <Text className={labelCls}>Risk %</Text>
            <TextInput className={inputCls} value={risk} onChangeText={setRisk} keyboardType="numeric" placeholderTextColor={palette.inkFaint} />
          </View>
        </View>
      </View>

      {/* compiled */}
      <View className={`overflow-hidden rounded-[16px] border ${th.borderDefault} ${th.surfaceCard}`}>
        <View className={`flex-row items-center gap-2 border-b px-4 py-2.5 ${th.hairline}`}>
          <Ionicons name="sparkles" size={14} color={palette.mint} />
          <Text className={`font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Compiled</Text>
        </View>
        <View className="px-4 py-3" style={{ backgroundColor: th.dark ? palette.canvas : '#F1F5F9' }}>
          <Text className={`font-mono text-2xs leading-[19px] ${th.textBody}`}>{compiled}</Text>
        </View>
        <View className={`flex-row items-center gap-2 border-t px-4 py-2.5 ${th.hairline}`}>
          <Ionicons name="shield-checkmark-outline" size={13} color={palette.mint} />
          <Text className={`flex-1 font-sans text-2xs ${th.textMuted}`}>Guardrails auto-attached: DD −8%, daily cap $250.</Text>
        </View>
      </View>

      <ScalePressable onPress={onRunBacktest} className="flex-row items-center justify-center gap-2 rounded-[14px] bg-mint py-3.5">
        <Ionicons name="play" size={16} color={palette.canvas} />
        <Text className="font-sans-bold text-body text-canvas">Run backtest</Text>
      </ScalePressable>
      <View className="flex-row items-center justify-center gap-1.5">
        <Ionicons name="git-branch-outline" size={13} color={palette.warn} />
        <Text className="font-mono text-2xs text-warn">Live deploy unlocks after mastery</Text>
      </View>
    </View>
  );
}
