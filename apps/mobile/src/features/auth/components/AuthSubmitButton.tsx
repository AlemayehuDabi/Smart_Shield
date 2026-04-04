import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Text, type ViewStyle } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { palette } from '@/src/theme/palette';
import { useAppStore } from '@/src/stores/use-app-store';
import { useShieldTheme } from '@/src/theme/use-shield-theme';

type AuthSubmitButtonProps = {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

const gradientDark: [string, string] = [palette.mintDim, palette.mint];
const gradientLight: [string, string] = ['#1A9B87', '#2EE6C9'];

export function AuthSubmitButton({
  label,
  loading = false,
  disabled = false,
  onPress,
}: AuthSubmitButtonProps) {
  const themePref = useAppStore((s) => s.themePref);
  const th = useShieldTheme(themePref);
  const inactive = disabled || loading;
  const colors = th.dark ? gradientDark : gradientLight;

  const shellStyle: ViewStyle = {
    borderRadius: 14,
    overflow: 'hidden',
    opacity: inactive ? 0.55 : 1,
  };

  return (
    <ScalePressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      className="mt-1 w-full"
      style={shellStyle}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
        {loading ? (
          <ActivityIndicator color="#070A0E" />
        ) : (
          <Text className="font-sans-bold text-body text-canvas">
            {label}
          </Text>
        )}
      </LinearGradient>
    </ScalePressable>
  );
}
