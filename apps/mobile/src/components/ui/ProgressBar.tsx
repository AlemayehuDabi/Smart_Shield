import { View } from 'react-native';

import { useAppTheme } from '@/src/theme/use-shield-theme';

const toneColor: Record<'mint' | 'ai' | 'warn', string> = {
  mint: '#2EE6C9',
  ai: '#7C5CFF',
  warn: '#FBBF24',
};

export function ProgressBar({
  value,
  tone = 'mint',
  height = 6,
  trackColor,
}: {
  value: number; // 0–100
  tone?: 'mint' | 'ai' | 'warn';
  height?: number;
  trackColor?: string;
}) {
  const th = useAppTheme();
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View
      className="w-full overflow-hidden rounded-full"
      style={{ height, backgroundColor: trackColor ?? (th.dark ? '#1E2A3A' : '#E2E8F0') }}
    >
      <View style={{ width: `${clamped}%`, height, backgroundColor: toneColor[tone], borderRadius: 999 }} />
    </View>
  );
}
