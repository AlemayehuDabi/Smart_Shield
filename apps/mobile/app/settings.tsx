import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StackHeader } from '@/src/components/ui/StackHeader';
import { Badge } from '@/src/components/ui/Badge';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Segmented } from '@/src/components/ui/Segmented';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { routes } from '@/src/lib/routes';
import { plans, type PlanId } from '@/src/data/plans';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import { useAppStore, type ThemePref } from '@/src/stores/use-app-store';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type Section = 'plan' | 'account' | 'alerts' | 'theme';
const currentPlan: PlanId = 'pro';

export default function SettingsScreen() {
  const th = useAppTheme();
  const insets = useSafeAreaInsets();
  const [section, setSection] = useState<Section>('plan');

  return (
    <View className={`flex-1 ${th.screen}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40, paddingHorizontal: 16 }}
      >
        <StackHeader title="Settings" />
        <View className="mb-5 mt-3">
          <Segmented
            fill
            options={[
              { value: 'plan', label: 'Plan' },
              { value: 'account', label: 'Account' },
              { value: 'alerts', label: 'Alerts' },
              { value: 'theme', label: 'Theme' },
            ]}
            value={section}
            onChange={setSection}
          />
        </View>

        {section === 'plan' ? <PlanSection /> : null}
        {section === 'account' ? <AccountSection /> : null}
        {section === 'alerts' ? <AlertsSection /> : null}
        {section === 'theme' ? <ThemeSection /> : null}
      </ScrollView>
    </View>
  );
}

function PlanSection() {
  const th = useAppTheme();
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <View className="gap-4">
      {/* current */}
      <View className="rounded-[16px] border border-mint/25 bg-mint/10 p-4">
        <Text className={`font-mono text-[10px] uppercase tracking-[0.1em] ${th.textFaint}`}>Current plan</Text>
        <View className="mt-1 flex-row items-center gap-2">
          <Text className={`font-sans-bold text-title ${th.textTitle}`}>Operator</Text>
          <Badge tone="mint">Trial · 9 days</Badge>
        </View>
        <Text className={`mt-1 font-sans text-2xs ${th.textMuted}`}>Converts to $24/mo (billed annually) on Jul 15, 2026.</Text>
        <View className="mt-3">
          <View className="mb-1.5 flex-row items-center justify-between">
            <Text className={`font-sans text-2xs ${th.textMuted}`}>Signals used this month</Text>
            <Text className={`font-mono text-2xs ${th.textTitle}`}>Unlimited</Text>
          </View>
          <ProgressBar value={100} />
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-2">
        <Segmented
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'annual', label: 'Annual' },
          ]}
          value={cycle}
          onChange={setCycle}
        />
        <View className="rounded-md bg-mint/15 px-2 py-1">
          <Text className="font-mono text-[10px] font-bold text-mint">Save ~17%</Text>
        </View>
      </View>

      <View className="gap-3">
        {plans.map((p) => {
          const price = cycle === 'annual' ? p.annualMonthly : p.monthly;
          const isCurrent = p.id === currentPlan;
          return (
            <View
              key={p.id}
              className={`rounded-[16px] border p-4 ${p.highlight ? 'border-mint/40' : p.id === 'elite' ? 'border-warn/30' : th.borderDefault} ${th.surfaceCard}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`font-sans-bold text-title ${th.textTitle}`}>{p.name}</Text>
                {p.highlight ? <Badge tone="mint">Popular</Badge> : p.id === 'elite' ? <Badge tone="warn">Automation</Badge> : null}
              </View>
              <Text className={`mt-0.5 font-sans text-2xs ${th.textMuted}`}>{p.tagline}</Text>
              <View className="mt-2 flex-row items-baseline gap-1">
                <Text className={`font-sans-bold text-hero ${th.textTitle}`}>${price}</Text>
                <Text className={`font-sans text-2xs ${th.textFaint}`}>/mo</Text>
              </View>
              <View className="mt-3 gap-1.5">
                {p.features.slice(0, 4).map((f) => (
                  <View key={f} className="flex-row gap-2">
                    <Ionicons name="checkmark" size={14} color={palette.mint} style={{ marginTop: 1 }} />
                    <Text className={`flex-1 font-sans text-2xs ${th.textBody}`}>{f}</Text>
                  </View>
                ))}
              </View>
              <ScalePressable
                disabled={isCurrent}
                className={`mt-4 items-center rounded-[12px] py-2.5 ${isCurrent ? `border ${th.borderDefault}` : p.highlight ? 'bg-mint' : `border ${th.borderDefault}`}`}
              >
                <Text className={`font-sans-bold text-caption ${isCurrent ? th.textMuted : p.highlight ? 'text-canvas' : th.textTitle}`}>
                  {isCurrent ? 'Current plan' : p.id === 'free' ? 'Downgrade' : 'Upgrade'}
                </Text>
              </ScalePressable>
            </View>
          );
        })}
      </View>

      <View className={`overflow-hidden rounded-[16px] border ${th.borderDefault} ${th.surfaceCard}`}>
        <View className={`border-b px-4 py-3 ${th.hairline}`}>
          <Text className={`font-sans-bold text-caption ${th.textTitle}`}>Billing history</Text>
        </View>
        {[
          ['Jun 15, 2026', 'Operator · annual', '$288.00'],
          ['May 15, 2026', 'Operator · monthly', '$29.00'],
          ['Apr 15, 2026', 'Scout · free', '$0.00'],
        ].map(([date, desc, amt], i) => (
          <View key={date} className={`flex-row items-center justify-between px-4 py-3 ${i < 2 ? `border-b ${th.hairline}` : ''}`}>
            <View>
              <Text className={`font-sans text-micro ${th.textTitle}`}>{desc}</Text>
              <Text className={`font-mono text-2xs ${th.textFaint}`}>{date}</Text>
            </View>
            <Text className={`font-mono text-micro ${th.textTitle}`}>{amt}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function AccountSection() {
  const th = useAppTheme();
  const clearSession = useAuthStore((s) => s.clearSession);
  const inputCls = `mt-1.5 rounded-xl border px-3.5 py-3 font-sans text-body ${th.borderDefault} ${th.surfaceInput} ${th.dark ? 'text-ink' : 'text-slate-900'}`;

  const signOut = () =>
    Alert.alert('Sign out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          router.replace(routes.login);
        },
      },
    ]);

  return (
    <View className="gap-4">
      <View className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <View className="flex-row items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-mint/20">
            <Text className="font-sans-bold text-title text-mint">AD</Text>
          </View>
          <ScalePressable className={`rounded-lg border px-3 py-2 ${th.borderDefault}`}>
            <Text className={`font-sans-medium text-2xs ${th.textTitle}`}>Change photo</Text>
          </ScalePressable>
        </View>
        <View className="mt-4">
          <Text className={`font-sans-medium text-2xs ${th.textMuted}`}>Full name</Text>
          <TextInput className={inputCls} defaultValue="Alex Dabi" placeholderTextColor={palette.inkFaint} />
        </View>
        <View className="mt-3">
          <Text className={`font-sans-medium text-2xs ${th.textMuted}`}>Email</Text>
          <TextInput className={inputCls} defaultValue="alex@smartshield.app" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={palette.inkFaint} />
        </View>
        <ScalePressable className="mt-4 items-center rounded-[12px] bg-mint py-2.5">
          <Text className="font-sans-bold text-caption text-canvas">Save changes</Text>
        </ScalePressable>
      </View>

      <Pressable
        onPress={() => router.push(routes.automation)}
        className={`flex-row items-center justify-between rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}
      >
        <View className="flex-row items-center gap-2.5">
          <Ionicons name="link" size={17} color={palette.mint} />
          <View>
            <Text className={`font-sans-bold text-micro ${th.textTitle}`}>Connected brokers</Text>
            <Text className={`font-sans text-2xs ${th.textMuted}`}>None connected</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={palette.inkFaint} />
      </Pressable>

      <ScalePressable onPress={signOut} className={`flex-row items-center justify-center gap-2 rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <Ionicons name="log-out-outline" size={17} color={th.dark ? palette.ink : '#0f172a'} />
        <Text className={`font-sans-medium text-caption ${th.textTitle}`}>Sign out</Text>
      </ScalePressable>

      <View className="rounded-[16px] border border-loss/25 p-4">
        <Text className="font-sans-bold text-caption text-loss">Danger zone</Text>
        <Text className={`mt-1.5 font-sans text-2xs ${th.textMuted}`}>Permanently delete your account, journal, and progress.</Text>
        <ScalePressable className="mt-3 items-center rounded-[12px] border border-loss/40 py-2.5">
          <Text className="font-sans-bold text-caption text-loss">Delete account</Text>
        </ScalePressable>
      </View>
    </View>
  );
}

function AlertsSection() {
  const th = useAppTheme();
  const [prefs, setPrefs] = useState({ signals: true, coach: true, price: false, lessons: true, product: false, weekly: true });
  const rows: { key: keyof typeof prefs; title: string; desc: string }[] = [
    { key: 'signals', title: 'New signal alerts', desc: 'High-confidence setups in your markets.' },
    { key: 'coach', title: 'Behavioral coach nudges', desc: 'When the AI spots a habit worth flagging.' },
    { key: 'price', title: 'Price & level alerts', desc: 'When a watched symbol hits your level.' },
    { key: 'lessons', title: 'Lesson reminders', desc: 'Keep your streak and mastery on track.' },
    { key: 'product', title: 'Product updates', desc: 'New features and model improvements.' },
    { key: 'weekly', title: 'Weekly performance digest', desc: 'Your P&L, adherence, and coach summary.' },
  ];
  return (
    <View className={`overflow-hidden rounded-[16px] border ${th.borderDefault} ${th.surfaceCard}`}>
      {rows.map((r, i) => (
        <View key={r.key} className={`flex-row items-center justify-between gap-4 px-4 py-3.5 ${i < rows.length - 1 ? `border-b ${th.hairline}` : ''}`}>
          <View className="flex-1">
            <Text className={`font-sans-medium text-micro ${th.textTitle}`}>{r.title}</Text>
            <Text className={`mt-0.5 font-sans text-2xs ${th.textMuted}`}>{r.desc}</Text>
          </View>
          <Switch
            value={prefs[r.key]}
            onValueChange={(v) => setPrefs((p) => ({ ...p, [r.key]: v }))}
            trackColor={{ true: palette.mint, false: th.dark ? '#1E2A3A' : '#CBD5E1' }}
            thumbColor="#fff"
          />
        </View>
      ))}
    </View>
  );
}

function ThemeSection() {
  const th = useAppTheme();
  const themePref = useAppStore((s) => s.themePref);
  const setThemePref = useAppStore((s) => s.setThemePref);
  const opts: { id: ThemePref; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'dark', label: 'Dark', icon: 'moon-outline' },
    { id: 'light', label: 'Light', icon: 'sunny-outline' },
    { id: 'system', label: 'System', icon: 'phone-portrait-outline' },
  ];
  return (
    <View className="gap-4">
      <View className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <Text className={`font-sans-bold text-caption ${th.textTitle}`}>Appearance</Text>
        <Text className={`mt-1 font-sans text-2xs ${th.textMuted}`}>Smart Shield is dark by default — built for long sessions on the tape.</Text>
        <View className="mt-4 gap-2.5">
          {opts.map((o) => {
            const active = themePref === o.id;
            return (
              <Pressable
                key={o.id}
                onPress={() => setThemePref(o.id)}
                className={`flex-row items-center gap-3 rounded-2xl border p-3.5 ${active ? 'border-mint bg-mint/10' : th.borderDefault}`}
              >
                <View className={`h-9 w-9 items-center justify-center rounded-lg ${active ? 'bg-mint' : th.surfaceElevated}`}>
                  <Ionicons name={o.icon} size={17} color={active ? palette.canvas : palette.inkMuted} />
                </View>
                <Text className={`flex-1 font-sans-bold text-caption ${th.textTitle}`}>{o.label}</Text>
                {active ? <Ionicons name="checkmark-circle" size={20} color={palette.mint} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className={`flex-row items-center justify-between rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <View>
          <Text className={`font-sans-medium text-micro ${th.textTitle}`}>Tabular figures</Text>
          <Text className={`mt-0.5 font-sans text-2xs ${th.textMuted}`}>Monospaced numerals for prices & P&L.</Text>
        </View>
        <Text className="font-mono text-body text-mint">+$1,240.50</Text>
      </View>
    </View>
  );
}
