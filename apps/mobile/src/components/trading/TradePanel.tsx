import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type OrderKind = 'Market' | 'Limit' | 'Stop';

export function TradePanel({
  symbol,
  side,
  onFlipSide,
  paperMode,
}: {
  symbol: string;
  side: 'buy' | 'sell';
  onFlipSide: () => void;
  paperMode: boolean;
}) {
  const th = useAppTheme();
  const [kind, setKind] = useState<OrderKind>('Market');
  const [qty, setQty] = useState('0.10');
  const [limit, setLimit] = useState('');

  const execute = () => {
    Haptics.notificationAsync(
      paperMode
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning,
    );
  };

  const kinds: OrderKind[] = ['Market', 'Limit', 'Stop'];
  const segmentBg = th.dark ? 'bg-canvas-elevated' : 'bg-slate-200/80';

  return (
    <View className={`rounded-[14px] border p-3 shadow-card ${th.borderDefault} ${th.surfaceCard}`}>
      <View className="mb-2.5 flex-row items-center justify-between">
        <Text className={`font-mono text-2xs uppercase tracking-wide ${th.textFaint}`}>{symbol}</Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onFlipSide();
          }}
          className={`rounded-full px-3 py-1.5 ${side === 'buy' ? 'bg-profit/18' : 'bg-loss/18'}`}>
          <Text className={`font-sans-bold text-2xs ${side === 'buy' ? 'text-profit' : 'text-loss'}`}>
            {side === 'buy' ? 'BUY' : 'SELL'}
          </Text>
        </Pressable>
      </View>

      <View className={`mb-2.5 flex-row rounded-[10px] p-0.5 ${segmentBg}`}>
        {kinds.map((k) => {
          const on = kind === k;
          return (
            <Pressable
              key={k}
              onPress={() => {
                Haptics.selectionAsync();
                setKind(k);
              }}
              className={`flex-1 rounded-lg py-1.5 ${on ? 'bg-mint/22' : ''}`}>
              <Text className={`text-center font-sans-bold text-2xs ${on ? 'text-mint' : th.textMuted}`}>
                {k}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className={`mb-1 font-sans-bold text-2xs uppercase ${th.textFaint}`}>Size</Text>
      <TextInput
        value={qty}
        onChangeText={setQty}
        keyboardType="decimal-pad"
        className={`mb-2 rounded-[10px] border px-3 py-2.5 font-mono text-body ${th.borderDefault} ${th.surfaceInput} ${th.textTitle}`}
        placeholder="0.00"
        placeholderTextColor={palette.inkFaint}
      />

      {kind !== 'Market' ? (
        <Animated.View entering={FadeIn.duration(200)}>
          <Text className={`mb-1 font-sans-bold text-2xs uppercase ${th.textFaint}`}>
            {kind === 'Limit' ? 'Limit price' : 'Stop trigger'}
          </Text>
          <TextInput
            value={limit}
            onChangeText={setLimit}
            keyboardType="decimal-pad"
            className={`mb-2 rounded-[10px] border px-3 py-2.5 font-mono text-body ${th.borderDefault} ${th.surfaceInput} ${th.textTitle}`}
            placeholder="Price"
            placeholderTextColor={th.dark ? palette.inkFaint : '#94a3b8'}
          />
        </Animated.View>
      ) : null}

      <Pressable
        onPress={execute}
        className={`items-center rounded-[12px] py-3.5 ${side === 'buy' ? 'bg-profit' : 'bg-loss'}`}>
        <Text className="font-sans-bold text-lead text-white">
          {paperMode ? 'Simulate fill' : `Send ${kind}`}
        </Text>
        <Text className="mt-0.5 font-mono text-2xs text-white/75">
          {paperMode ? 'Paper route' : 'Live · confirmations on'}
        </Text>
      </Pressable>
    </View>
  );
}
