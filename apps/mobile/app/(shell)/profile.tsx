import * as Haptics from 'expo-haptics';
import { Pressable, Switch, Text, View } from 'react-native';

import {
  ListSectionLabel,
  ScreenTitle,
} from '@/src/components/ui/SectionHeader';
import { ScreenShell } from '@/src/components/ui/ScreenShell';
import { labModules } from '@/src/lib/mock-data';
import { useAppStore, type ThemePref } from '@/src/stores/use-app-store';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

const themeOptions: { key: ThemePref; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'dark', label: 'Dark' },
  { key: 'light', label: 'Light' },
];

export default function ProfileScreen() {
  const th = useAppTheme();
  const paperMode = useAppStore((s) => s.paperMode);
  const setPaper = useAppStore((s) => s.setPaperMode);
  const themePref = useAppStore((s) => s.themePref);
  const setTheme = useAppStore((s) => s.setThemePref);

  return (
    <ScreenShell>
      <ScreenTitle
        eyebrow="Account"
        title="Control"
        subtitle="Paper mode, appearance, lab. Long-press Pulse header for readiness haptic."
      />

      <View className={`mb-3 rounded-[14px] border p-3 ${th.card}`}>
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className={`font-sans-bold text-micro ${th.textTitle}`}>
              Paper trading
            </Text>
            <Text
              className={`mt-0.5 font-sans text-2xs leading-[17px] ${th.textBody}`}
            >
              Simulated fills, live-style book — no capital risk.
            </Text>
          </View>
          <Switch
            value={paperMode}
            onValueChange={(v) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setPaper(v);
            }}
            trackColor={{
              false: th.dark ? palette.stroke : palette.strokeLight,
              true: palette.mint,
            }}
            thumbColor={
              paperMode
                ? th.dark
                  ? palette.canvas
                  : palette.surfaceLight
                : th.dark
                  ? palette.inkFaint
                  : '#CBD5E1'
            }
          />
        </View>

        <View className={`mt-4 border-t pt-3 ${th.borderMuted}`}>
          <ListSectionLabel>Appearance</ListSectionLabel>
          <View className="mt-2 flex-row gap-1.5">
            {themeOptions.map((o) => {
              const on = themePref === o.key;
              return (
                <Pressable
                  key={o.key}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setTheme(o.key);
                  }}
                  className={`flex-1 items-center rounded-[10px] border py-2 ${
                    on
                      ? 'border-mint bg-mint/12'
                      : `${th.borderDefault} ${th.surfaceElevated}`
                  }`}
                >
                  <Text
                    className={`font-sans-bold text-2xs ${on ? 'text-mint' : th.textMuted}`}
                  >
                    {o.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <ListSectionLabel>Lab</ListSectionLabel>
      <View className="pb-2">
        {labModules.map((m, i) => (
          <View
            key={m.id}
            className={`rounded-xl border px-3 py-2.5 ${th.borderDefault} ${
              th.dark ? 'bg-canvas-elevated/40' : 'bg-slate-50'
            } ${i < labModules.length - 1 ? 'mb-1.5' : ''}`}
          >
            <View className="flex-row items-center justify-between gap-2">
              <Text className={`flex-1 font-sans-bold text-micro ${th.textTitle}`}>
                {m.name}
              </Text>
              <Text
                className={`shrink-0 font-mono text-2xs uppercase ${
                  m.status === 'running'
                    ? 'text-warn'
                    : m.status === 'ready'
                      ? 'text-profit'
                      : th.textFaint
                }`}
              >
                {m.status}
              </Text>
            </View>
            <Text
              className={`mt-1 font-sans text-2xs leading-[17px] ${th.textBody}`}
            >
              {m.description}
            </Text>
            {m.lastRun ? (
              <Text className={`mt-1 font-mono text-2xs ${th.textFaint}`}>
                {m.lastRun}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}
