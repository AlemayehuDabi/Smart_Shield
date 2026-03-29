/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#070A0E',
          elevated: '#0D1219',
          panel: '#121A24',
          stroke: '#1E2A3A',
        },
        ink: {
          DEFAULT: '#E8EEF6',
          muted: '#8B9CB3',
          faint: '#5C6D85',
        },
        mint: {
          DEFAULT: '#2EE6C9',
          dim: '#1A9B87',
          glow: '#5FF5DC',
        },
        profit: { DEFAULT: '#34D399', dim: '#065F46' },
        loss: { DEFAULT: '#FB7185', dim: '#9F1239' },
        warn: { DEFAULT: '#FBBF24', dim: '#B45309' },
        ai: { DEFAULT: '#7C5CFF', dim: '#4C1D95', pulse: '#A78BFA' },
        screen: {
          light: '#EEF1F7',
        },
      },
      fontFamily: {
        sans: ['DMSans_400Regular'],
        'sans-medium': ['DMSans_500Medium'],
        'sans-bold': ['DMSans_700Bold'],
        mono: ['JetBrainsMono_500Medium'],
      },
      fontSize: {
        '2xs': ['12px', { lineHeight: 1.8 }], //13
        micro: ['13px', { lineHeight: 2 }], //15
        caption: ['14px', { lineHeight: 2.1 }], //16
        body: ['16px', { lineHeight: 3 }], //20
        lead: ['17px', { lineHeight: 3.1 }], //21
        title: ['20px', { lineHeight: 3.4 }], //24
        hero: ['26px', { lineHeight: 4 }], //30
        display: ['32px', { lineHeight: 4.6 }], //36
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        section: '14px',
        card: '12px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        dock: '0 -8px 40px rgba(0,0,0,0.45)',
        'dock-light': '0 -6px 28px rgba(15,23,42,0.07)',
        orb: '0 0 32px rgba(46,230,201,0.35)',
        'orb-light': '0 4px 20px rgba(46,230,201,0.22)',
        card: '0 4px 24px rgba(0,0,0,0.25)',
        'card-light': '0 1px 3px rgba(15,23,42,0.06)',
      },
    },
  },
  plugins: [],
};
