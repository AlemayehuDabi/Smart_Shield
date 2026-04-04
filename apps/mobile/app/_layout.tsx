import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { QueryProvider } from '@/src/providers/query-provider';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import { useAppStore } from '@/src/stores/use-app-store';
import { palette } from '@/src/theme/palette';
import { resolveShieldDark } from '@/src/theme/use-shield-theme';

import '../global.css';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

const darkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: palette.canvas,
    card: palette.canvasPanel,
    text: palette.ink,
    border: palette.stroke,
    primary: palette.mint,
  },
};

const lightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.screenLight,
    card: palette.surfaceLight,
    text: '#0f172a',
    border: palette.strokeLight,
    primary: palette.mint,
  },
};

function ThemedStack() {
  const themePref = useAppStore((s) => s.themePref);
  const system = useColorScheme();
  const dark = resolveShieldDark(themePref, system);

  const navTheme = dark ? darkNavTheme : lightNavTheme;
  const stackBg = dark ? palette.canvas : palette.screenLight;

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      contentStyle: { backgroundColor: stackBg },
    }),
    [stackBg],
  );

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(shell)" />
        <Stack.Screen
          name="assistant"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (loaded && hydrated) SplashScreen.hideAsync();
  }, [loaded, hydrated]);

  if (!loaded || !hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ThemedStack />
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
