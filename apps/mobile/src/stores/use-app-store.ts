import { create } from 'zustand';

export type ThemePref = 'system' | 'light' | 'dark';

interface AppState {
  paperMode: boolean;
  themePref: ThemePref;
  selectedSymbol: string;
  setPaperMode: (v: boolean) => void;
  setThemePref: (v: ThemePref) => void;
  setSelectedSymbol: (s: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  paperMode: false,
  /** Default dark — light surfaces need theme-aware text; use Profile → Appearance for system/light */
  themePref: 'dark',
  selectedSymbol: 'BTC-PERP',
  setPaperMode: (paperMode) => set({ paperMode }),
  setThemePref: (themePref) => set({ themePref }),
  setSelectedSymbol: (selectedSymbol) => set({ selectedSymbol }),
}));
