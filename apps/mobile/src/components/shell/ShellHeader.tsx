import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { routes } from '@/src/lib/routes';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function ShellHeader({
  eyebrow,
  title,
  subtitle,
  right,
  showSettings = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  showSettings?: boolean;
}) {
  const th = useAppTheme();
  const iconColor = th.dark ? palette.inkMuted : '#475569';

  return (
    <View className="mb-5">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-mono text-2xs uppercase tracking-[0.14em] text-mint">{eyebrow}</Text>
          <Text className={`font-sans-bold text-hero ${th.textTitle}`}>{title}</Text>
        </View>
        <View className="flex-row items-center gap-2 pt-1">
          {right}
          {showSettings ? (
            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                router.push(routes.settings);
              }}
              className={`h-9 w-9 items-center justify-center rounded-full border ${th.borderDefault} ${th.surfaceCard}`}
              accessibilityRole="button"
              accessibilityLabel="Settings"
            >
              <Ionicons name="settings-outline" size={17} color={iconColor} />
            </Pressable>
          ) : null}
        </View>
      </View>
      {subtitle ? (
        <Text className={`mt-1.5 font-sans text-caption leading-[20px] ${th.textBody}`}>{subtitle}</Text>
      ) : null}
    </View>
  );
}
