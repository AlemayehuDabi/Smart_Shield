import { useColorScheme } from 'react-native';

import { useAppStore, type ThemePref } from '@/src/stores/use-app-store';

export type ShieldTheme = {
  dark: boolean;
  screen: string;
  /** Page background */
  screenHex: string;
  /** Primary titles (must contrast screen) */
  textTitle: string;
  textBody: string;
  textMuted: string;
  textFaint: string;
  /** Mono / data labels */
  textMono: string;
  surfaceCard: string;
  surfaceElevated: string;
  surfaceInput: string;
  borderDefault: string;
  borderMuted: string;
  /** Legacy aliases for insight cards */
  heading: string;
  body: string;
  faint: string;
  card: string;
  hairline: string;
};

export function useShieldTheme(pref: ThemePref): ShieldTheme {
  const system = useColorScheme();
  const dark = pref === 'dark' || (pref === 'system' && system !== 'light');

  if (dark) {
    return {
      dark: true,
      screen: 'bg-canvas',
      screenHex: '#070A0E',
      textTitle: 'text-ink',
      textBody: 'text-ink-muted',
      textMuted: 'text-ink-muted',
      textFaint: 'text-ink-faint',
      textMono: 'text-ink',
      surfaceCard: 'bg-canvas-panel',
      surfaceElevated: 'bg-canvas-elevated',
      surfaceInput: 'bg-canvas',
      borderDefault: 'border-canvas-stroke',
      borderMuted: 'border-canvas-stroke/80',
      heading: 'text-ink',
      body: 'text-ink-muted',
      faint: 'text-ink-faint',
      card: 'bg-canvas-panel border-canvas-stroke',
      hairline: 'border-canvas-stroke',
    };
  }

  return {
    dark: false,
    screen: 'bg-screen-light',
    screenHex: '#E8ECF3',
    textTitle: 'text-slate-900',
    textBody: 'text-slate-600',
    textMuted: 'text-slate-600',
    textFaint: 'text-slate-500',
    textMono: 'text-slate-900',
    surfaceCard: 'bg-white',
    surfaceElevated: 'bg-slate-100',
    surfaceInput: 'bg-white',
    borderDefault: 'border-slate-200',
    borderMuted: 'border-slate-200/90',
    heading: 'text-slate-900',
    body: 'text-slate-600',
    faint: 'text-slate-500',
    card: 'bg-white border-slate-200',
    hairline: 'border-slate-200',
  };
}

/** Theme from current appearance preference (convenience). */
export function useAppTheme(): ShieldTheme {
  const pref = useAppStore((s) => s.themePref);
  return useShieldTheme(pref);
}
