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
import { useAppTheme } from '@/src/theme/use-shield-theme';

const tabs: { key: string; label: string }[] = [
  { key: 'index', label: 'Pulse' },
  { key: 'trade', label: 'Trade' },
  { key: 'analytics', label: 'Intel' },
  { key: 'profile', label: 'You' },
];

export function ShieldDock({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const th = useAppTheme();
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

  const androidBarBg = th.dark
    ? `${palette.canvasPanel}F2`
    : `${palette.surfaceLight}F0`;

  const orbOuterBg = th.dark ? palette.canvasElevated : palette.surfaceLight;
  const orbInnerBg = th.dark ? `${palette.mint}22` : `${palette.mint}18`;
  const inactiveBar = th.dark ? 'bg-canvas-stroke' : 'bg-slate-300';

  return (
    <View
      className="absolute bottom-0 left-0 right-0 pt-1"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      <View
        className={`mx-3 overflow-hidden rounded-2xl border ${th.borderDefault} ${th.dark ? 'shadow-dock' : 'shadow-dock-light'}`}
        style={{
          backgroundColor:
            Platform.OS === 'android' ? androidBarBg : undefined,
        }}
      >
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={th.dark ? 52 : 72}
            tint={th.dark ? 'dark' : 'light'}
            style={{ position: 'absolute', inset: 0 }}
          />
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
                accessibilityLabel={t.label}
              >
                <View
                  className={`mb-0.5 h-0.5 w-7 rounded-full ${isOn ? 'bg-mint' : inactiveBar}`}
                />
                <Text
                  className={`font-sans-bold text-2xs ${isOn ? 'text-mint' : th.textMuted}`}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}

          <View className="relative items-center px-0.5">
            <Pressable
              onPress={openAssistant}
              accessibilityRole="button"
              accessibilityLabel="Open AI co-pilot"
              className="items-center active:opacity-90"
            >
              <Animated.View
                style={orbStyle}
                className={th.dark ? 'shadow-orb' : 'shadow-orb-light'}
              >
                <View
                  className="h-[52px] w-[52px] items-center justify-center rounded-full"
                  style={{
                    borderWidth: 1.5,
                    borderColor: `${palette.mint}55`,
                    backgroundColor: orbOuterBg,
                  }}
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: orbInnerBg }}
                  >
                    <Text className="font-sans-bold text-micro text-mint">
                      AI
                    </Text>
                  </View>
                </View>
              </Animated.View>
              <Text
                className={`mt-0.5 font-sans-bold text-2xs ${th.textFaint}`}
              >
                Copilot
              </Text>
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
                accessibilityLabel={t.label}
              >
                <View
                  className={`mb-0.5 h-0.5 w-7 rounded-full ${isOn ? 'bg-mint' : inactiveBar}`}
                />
                <Text
                  className={`font-sans-bold text-2xs ${isOn ? 'text-mint' : th.textMuted}`}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
