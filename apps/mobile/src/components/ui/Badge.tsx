import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/src/theme/use-shield-theme';

export type Tone = 'mint' | 'ai' | 'warn' | 'profit' | 'loss' | 'neutral';

const toneClass: Record<Exclude<Tone, 'neutral'>, string> = {
  mint: 'bg-mint/15',
  ai: 'bg-ai/15',
  warn: 'bg-warn/20',
  profit: 'bg-profit/15',
  loss: 'bg-loss/15',
};
const textClass: Record<Exclude<Tone, 'neutral'>, string> = {
  mint: 'text-mint',
  ai: 'text-ai',
  warn: 'text-warn',
  profit: 'text-profit',
  loss: 'text-loss',
};

export function Badge({
  children,
  tone = 'neutral',
  icon,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}) {
  const th = useAppTheme();
  const bg = tone === 'neutral' ? th.surfaceElevated : toneClass[tone];
  const fg = tone === 'neutral' ? th.textMuted : textClass[tone];
  return (
    <View className={`flex-row items-center gap-1 self-start rounded-md px-1.5 py-0.5 ${bg}`}>
      {icon}
      <Text className={`font-sans-bold text-[10px] uppercase tracking-[0.08em] ${fg}`}>{children}</Text>
    </View>
  );
}
