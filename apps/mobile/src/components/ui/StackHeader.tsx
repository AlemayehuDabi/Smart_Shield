import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function StackHeader({
  title,
  right,
  onBack,
}: {
  title?: string;
  right?: ReactNode;
  onBack?: () => void;
}) {
  const th = useAppTheme();
  const iconColor = th.dark ? palette.ink : '#0f172a';
  return (
    <View className="mb-1 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-2">
        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            if (onBack) onBack();
            else router.back();
          }}
          className={`h-9 w-9 items-center justify-center rounded-full border ${th.borderDefault} ${th.surfaceCard}`}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={18} color={iconColor} />
        </Pressable>
        {title ? (
          <Text numberOfLines={1} className={`flex-1 font-sans-bold text-title ${th.textTitle}`}>
            {title}
          </Text>
        ) : null}
      </View>
      {right ? <View className="flex-row items-center gap-2">{right}</View> : null}
    </View>
  );
}
