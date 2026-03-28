import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { palette } from '@/src/theme/palette';

const tabs: { key: string; label: string }[] = [
  { key: 'index', label: 'Pulse' },
  { key: 'trade', label: 'Trade' },
  { key: 'analytics', label: 'Intel' },
  { key: 'profile', label: 'You' },
];

export function ShieldDock({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const active = state.routes[state.index]?.name ?? 'index';

  const orbScale = useSharedValue(1);
  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  const openAssistant = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    orbScale.value = withSpring(0.94, { damping: 14 }, () => {
      orbScale.value = withSpring(1, { damping: 16 });
    });
    router.push('/assistant');
  };

  const go = (routeName: string) => {
    Haptics.selectionAsync();
    navigation.navigate(routeName as never);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 pt-1" style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
      <View
        className="mx-3 overflow-hidden rounded-2xl border border-canvas-stroke"
        style={{ backgroundColor: Platform.OS === 'android' ? `${palette.canvasPanel}F2` : 'transparent' }}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={52} tint="dark" style={{ position: 'absolute', inset: 0 }} />
        ) : null}
        <View className="flex-row items-end justify-between px-1 pb-2.5 pt-1.5">
          {tabs.slice(0, 2).map((t) => {
            const isOn = active === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => go(t.key)}
                className="min-w-[56px] items-center py-1.5"
                accessibilityRole="button"
                accessibilityLabel={t.label}>
                <View className={`mb-0.5 h-0.5 w-7 rounded-full ${isOn ? 'bg-mint' : 'bg-canvas-stroke'}`} />
                <Text className={`font-sans-bold text-2xs ${isOn ? 'text-mint' : 'text-ink-muted'}`}>{t.label}</Text>
              </Pressable>
            );
          })}

          <View className="relative -top-3 items-center px-0.5">
            <Pressable
              onPress={openAssistant}
              accessibilityRole="button"
              accessibilityLabel="Open AI co-pilot"
              className="items-center active:opacity-90">
              <Animated.View style={orbStyle} className="shadow-orb">
                <View
                  className="h-[52px] w-[52px] items-center justify-center rounded-full"
                  style={{ borderWidth: 1.5, borderColor: `${palette.mint}55`, backgroundColor: palette.canvasElevated }}>
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${palette.mint}22` }}>
                    <Text className="font-sans-bold text-micro text-mint">AI</Text>
                  </View>
                </View>
              </Animated.View>
              <Text className="mt-0.5 font-sans-bold text-2xs text-ink-faint">Copilot</Text>
            </Pressable>
          </View>

          {tabs.slice(2).map((t) => {
            const isOn = active === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => go(t.key)}
                className="min-w-[56px] items-center py-1.5"
                accessibilityRole="button"
                accessibilityLabel={t.label}>
                <View className={`mb-0.5 h-0.5 w-7 rounded-full ${isOn ? 'bg-mint' : 'bg-canvas-stroke'}`} />
                <Text className={`font-sans-bold text-2xs ${isOn ? 'text-mint' : 'text-ink-muted'}`}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
