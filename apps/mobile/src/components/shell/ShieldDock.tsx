import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { routes } from '@/src/lib/routes';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type IconName = keyof typeof Ionicons.glyphMap;
const tabs: { key: string; label: string; icon: IconName }[] = [
  { key: 'index', label: 'Signals', icon: 'pulse-outline' },
  { key: 'portfolio', label: 'Portfolio', icon: 'pie-chart-outline' },
  { key: 'learn', label: 'Learn', icon: 'school-outline' },
  { key: 'automation', label: 'Auto', icon: 'git-branch-outline' },
];

type DockProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

export function ShieldDock({ state, navigation }: DockProps) {
  const insets = useSafeAreaInsets();
  const th = useAppTheme();
  const active = state.routes[state.index]?.name ?? 'index';

  const orbScale = useSharedValue(1);
  const orbStyle = useAnimatedStyle(() => ({ transform: [{ scale: orbScale.value }] }));

  const openAssistant = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    orbScale.value = withSpring(0.94, { damping: 14 }, () => {
      orbScale.value = withSpring(1, { damping: 16 });
    });
    router.push(routes.assistant);
  };

  const go = (routeName: string) => {
    void Haptics.selectionAsync();
    navigation.navigate(routeName as never);
  };

  const androidBarBg = th.dark ? `${palette.canvasPanel}F2` : `${palette.surfaceLight}F0`;
  const orbOuterBg = th.dark ? palette.canvasElevated : palette.surfaceLight;
  const orbInnerBg = th.dark ? `${palette.mint}22` : `${palette.mint}18`;

  const renderTab = (t: { key: string; label: string; icon: IconName }) => {
    const isOn = active === t.key;
    return (
      <Pressable
        key={t.key}
        onPress={() => go(t.key)}
        className="min-w-[54px] items-center py-1"
        accessibilityRole="button"
        accessibilityLabel={t.label}
        accessibilityState={{ selected: isOn }}
      >
        <Ionicons name={t.icon} size={20} color={isOn ? palette.mint : th.dark ? palette.inkFaint : '#94a3b8'} />
        <Text className={`mt-0.5 font-sans-medium text-[10px] ${isOn ? 'text-mint' : th.textFaint}`}>{t.label}</Text>
      </Pressable>
    );
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 pt-1" style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
      <View
        className={`mx-3 overflow-hidden rounded-2xl border ${th.borderDefault} ${th.dark ? 'shadow-dock' : 'shadow-dock-light'}`}
        style={{ backgroundColor: Platform.OS === 'android' ? androidBarBg : undefined }}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={th.dark ? 52 : 72} tint={th.dark ? 'dark' : 'light'} style={{ position: 'absolute', inset: 0 }} />
        ) : null}
        <View className="flex-row items-center justify-between px-1.5 pb-2 pt-2">
          {tabs.slice(0, 2).map(renderTab)}

          <View className="items-center px-0.5">
            <Pressable onPress={openAssistant} accessibilityRole="button" accessibilityLabel="Open AI copilot" className="items-center active:opacity-90">
              <Animated.View style={orbStyle} className={th.dark ? 'shadow-orb' : 'shadow-orb-light'}>
                <View
                  className="h-[50px] w-[50px] items-center justify-center rounded-full"
                  style={{ borderWidth: 1.5, borderColor: `${palette.mint}55`, backgroundColor: orbOuterBg }}
                >
                  <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: orbInnerBg }}>
                    <Ionicons name="sparkles" size={18} color={palette.mint} />
                  </View>
                </View>
              </Animated.View>
              <Text className={`mt-0.5 font-sans-medium text-[10px] ${th.textFaint}`}>Copilot</Text>
            </Pressable>
          </View>

          {tabs.slice(2).map(renderTab)}
        </View>
      </View>
    </View>
  );
}
