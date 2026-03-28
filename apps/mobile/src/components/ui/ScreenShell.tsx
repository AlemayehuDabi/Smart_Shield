import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStore } from '@/src/stores/use-app-store';
import { layout } from '@/src/theme/layout';
import { useShieldTheme } from '@/src/theme/use-shield-theme';

export function ScreenShell({
  children,
  scroll = true,
  extraClass = '',
}: {
  children: ReactNode;
  scroll?: boolean;
  extraClass?: string;
}) {
  const insets = useSafeAreaInsets();
  const themePref = useAppStore((s) => s.themePref);
  const t = useShieldTheme(themePref);
  const topPad = insets.top + layout.topInsetExtra;
  const bottomPad = layout.dockReserve + Math.max(insets.bottom, 6);
  const combined = `${t.screen} ${extraClass}`;
  const padX = layout.screenPadX;

  if (scroll) {
    return (
      <ScrollView
        className={`flex-1 ${combined}`}
        contentContainerStyle={{
          paddingTop: topPad,
          paddingBottom: bottomPad,
          paddingHorizontal: padX,
        }}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      className={`flex-1 ${combined}`}
      style={{
        paddingTop: topPad,
        paddingBottom: bottomPad,
        paddingHorizontal: padX,
      }}>
      {children}
    </View>
  );
}
