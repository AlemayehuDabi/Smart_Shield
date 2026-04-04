import { Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useAppStore } from '@/src/stores/use-app-store';
import { useShieldTheme } from '@/src/theme/use-shield-theme';

type AuthBannerProps = {
  variant: 'error' | 'success';
  message: string | null;
};

export function AuthBanner({ variant, message }: AuthBannerProps) {
  const themePref = useAppStore((s) => s.themePref);
  const th = useShieldTheme(themePref);

  if (!message) return null;

  const isError = variant === 'error';
  const box = isError
    ? th.dark
      ? 'border-loss/35 bg-loss-dim/25'
      : 'border-loss/30 bg-rose-50'
    : th.dark
      ? 'border-mint/35 bg-mint-dim/15'
      : 'border-mint/40 bg-emerald-50';

  const text = isError
    ? 'text-loss'
    : th.dark
      ? 'text-mint-glow'
      : 'text-emerald-800';

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(140)}
      className={`mb-4 rounded-2xl border px-3.5 py-3 ${box}`}>
      <Text className={`font-sans-medium text-caption leading-[20px] ${text}`}>
        {message}
      </Text>
    </Animated.View>
  );
}
