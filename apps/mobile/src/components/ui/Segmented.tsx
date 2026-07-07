import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/src/theme/use-shield-theme';

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  fill = false,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  /** stretch tabs to fill width */
  fill?: boolean;
}) {
  const th = useAppTheme();
  return (
    <View
      className={`flex-row items-center gap-1 self-start rounded-xl border p-1 ${th.borderDefault} ${th.surfaceElevated}`}
      style={fill ? { alignSelf: 'stretch' } : undefined}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => {
              void Haptics.selectionAsync();
              onChange(opt.value);
            }}
            className={`flex-row items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 ${active ? th.surfaceCard : ''}`}
            style={fill ? { flex: 1 } : undefined}
          >
            <Text className={`font-sans-medium text-caption ${active ? th.textTitle : th.textMuted}`}>{opt.label}</Text>
            {typeof opt.count === 'number' ? (
              <Text className={`font-mono text-[10px] ${active ? 'text-mint' : th.textFaint}`}>{opt.count}</Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
