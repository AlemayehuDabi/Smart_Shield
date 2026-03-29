/**
 * Single source of truth for raw colors used outside NativeWind (SVG, RN APIs, gradients).
 * Keep in sync with tailwind.config.js `theme.extend.colors`.
 */
export const palette = {
  canvas: '#070A0E',
  canvasElevated: '#0D1219',
  canvasPanel: '#121A24',
  stroke: '#1E2A3A',
  ink: '#E8EEF6',
  inkMuted: '#8B9CB3',
  inkFaint: '#5C6D85',
  mint: '#2EE6C9',
  mintDim: '#1A9B87',
  profit: '#34D399',
  profitDim: '#065F46',
  loss: '#FB7185',
  lossDim: '#9F1239',
  warn: '#FBBF24',
  ai: '#7C5CFF',
  aiPulse: '#A78BFA',
  aiDim: '#4C1D95',
  screenLight: '#EEF1F7',
  /** Light dock / sheet surfaces (hex for BlurView fallbacks) */
  surfaceLight: '#FFFFFF',
  surfaceLightMuted: '#F8FAFC',
  strokeLight: '#E2E8F0',
} as const;

export type Palette = typeof palette;
