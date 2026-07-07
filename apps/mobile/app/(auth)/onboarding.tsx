import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { routes } from '@/src/lib/routes';
import { palette } from '@/src/theme/palette';
import { useAppStore } from '@/src/stores/use-app-store';
import { useShieldTheme } from '@/src/theme/use-shield-theme';

type IconName = keyof typeof Ionicons.glyphMap;
type Option = { value: string; label: string; desc: string; icon: IconName };
type Step = { key: string; question: string; helper: string; multi?: boolean; options: Option[] };

const steps: Step[] = [
  {
    key: 'experience',
    question: 'How would you describe your trading?',
    helper: 'We tune signal depth and lesson difficulty to match.',
    options: [
      { value: 'new', label: 'Just starting', desc: 'New to charts & terms', icon: 'school-outline' },
      { value: 'some', label: 'Some experience', desc: "I've placed real trades", icon: 'trending-up-outline' },
      { value: 'seasoned', label: 'Seasoned', desc: 'I trade with a plan', icon: 'analytics-outline' },
      { value: 'pro', label: 'Advanced', desc: 'I want automation & edge', icon: 'flash-outline' },
    ],
  },
  {
    key: 'markets',
    question: 'Which markets do you trade?',
    helper: 'Pick all that apply — your feed filters to these.',
    multi: true,
    options: [
      { value: 'crypto', label: 'Crypto', desc: 'BTC, ETH, alts', icon: 'logo-bitcoin' },
      { value: 'stocks', label: 'Stocks', desc: 'Equities & ETFs', icon: 'bar-chart-outline' },
      { value: 'fx', label: 'Forex', desc: 'Major & minor pairs', icon: 'swap-horizontal-outline' },
      { value: 'options', label: 'Options', desc: 'Calls, puts, spreads', icon: 'pie-chart-outline' },
    ],
  },
  {
    key: 'goal',
    question: 'What matters most right now?',
    helper: 'This orders your home screen and coaching focus.',
    options: [
      { value: 'learn', label: 'Understand markets', desc: 'Learn why, not just what', icon: 'school-outline' },
      { value: 'consistent', label: 'Get consistent', desc: 'Fix leaks, build a process', icon: 'checkmark-done-outline' },
      { value: 'benchmark', label: 'Beat my benchmark', desc: 'Outperform buy & hold', icon: 'trophy-outline' },
      { value: 'automate', label: 'Automate strategies', desc: "Run what I've mastered", icon: 'git-branch-outline' },
    ],
  },
  {
    key: 'risk',
    question: 'How much risk fits you?',
    helper: 'Sets default sizing and guardrail suggestions.',
    options: [
      { value: 'conservative', label: 'Conservative', desc: 'Protect capital first', icon: 'shield-outline' },
      { value: 'balanced', label: 'Balanced', desc: 'Measured, asymmetric bets', icon: 'options-outline' },
      { value: 'aggressive', label: 'Aggressive', desc: 'Higher risk, higher reward', icon: 'flash-outline' },
    ],
  },
];

export default function OnboardingScreen() {
  const themePref = useAppStore((s) => s.themePref);
  const th = useShieldTheme(themePref);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const done = i >= steps.length;
  const step = steps[i];
  const current = step ? answers[step.key] ?? [] : [];
  const progress = Math.round((Math.min(i, steps.length) / steps.length) * 100);

  const backdrop = th.dark
    ? ([palette.canvas, palette.canvasElevated, '#0a1624'] as const)
    : ([palette.screenLight, '#E4E9F2', '#dce3ef'] as const);

  function toggle(value: string) {
    if (!step) return;
    setAnswers((prev) => {
      const sel = prev[step.key] ?? [];
      if (step.multi) return { ...prev, [step.key]: sel.includes(value) ? sel.filter((v) => v !== value) : [...sel, value] };
      return { ...prev, [step.key]: [value] };
    });
    void Haptics.selectionAsync();
    if (!step.multi) setTimeout(() => setI((n) => n + 1), 240);
  }

  const goalText = useMemo(() => {
    const map: Record<string, string> = {
      learn: 'a learning-first feed with lessons in context',
      consistent: 'coaching tuned to your process leaks',
      benchmark: 'benchmark analytics front-and-center',
      automate: "a path toward guarded automation once you've mastered a strategy",
    };
    return answers.goal?.[0] ? map[answers.goal[0]] : 'a balanced starting feed';
  }, [answers]);

  return (
    <View className={`flex-1 ${th.screen}`}>
      <LinearGradient colors={backdrop} start={{ x: 0, y: 0 }} end={{ x: 0.85, y: 1 }} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16, paddingHorizontal: 16 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Ionicons name="shield-checkmark" size={18} color={palette.mint} />
              <Text className={`font-sans-bold text-caption ${th.textTitle}`}>Smart Shield</Text>
            </View>
            <Text className={`font-mono text-2xs ${th.textFaint}`}>{done ? 'Done' : `Step ${i + 1} of ${steps.length}`}</Text>
          </View>

          <View className="mt-4 h-1 overflow-hidden rounded-full" style={{ backgroundColor: th.dark ? '#1E2A3A' : '#E2E8F0' }}>
            <View style={{ width: `${done ? 100 : progress}%`, height: 4, backgroundColor: palette.mint, borderRadius: 999 }} />
          </View>

          {done ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
              <View className="items-center">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-mint/15">
                  <Ionicons name="checkmark" size={28} color={palette.mint} />
                </View>
                <Text className={`mt-5 font-sans-bold text-hero ${th.textTitle}`}>Your desk is ready</Text>
                <Text className={`mt-2 text-center font-sans text-caption leading-[21px] ${th.textBody}`}>
                  We&rsquo;ve set you up with {goalText}. Change any of it in Settings.
                </Text>
              </View>
              <View className={`mt-6 gap-2.5 rounded-2xl border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
                {[
                  '3 fresh signals waiting in your feed',
                  'First lesson queued: Support & resistance',
                  'Journal ready — log a trade to activate coaching',
                ].map((line) => (
                  <View key={line} className="flex-row items-center gap-2.5">
                    <Ionicons name="checkmark" size={15} color={palette.mint} />
                    <Text className={`flex-1 font-sans text-micro ${th.textBody}`}>{line}</Text>
                  </View>
                ))}
              </View>
              <ScalePressable onPress={() => router.replace(routes.shell)} className="mt-6 flex-row items-center justify-center gap-2 rounded-[14px] bg-mint py-4">
                <Text className="font-sans-bold text-body text-canvas">Enter Smart Shield</Text>
                <Ionicons name="arrow-forward" size={18} color={palette.canvas} />
              </ScalePressable>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 16 }}>
              <Text className={`font-sans-bold text-hero ${th.textTitle}`}>{step.question}</Text>
              <Text className={`mt-2 font-sans text-caption ${th.textMuted}`}>{step.helper}</Text>

              <View className="mt-6 gap-2.5">
                {step.options.map((opt) => {
                  const selected = current.includes(opt.value);
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => toggle(opt.value)}
                      className={`flex-row items-center gap-3 rounded-2xl border p-4 ${selected ? 'border-mint bg-mint/12' : `${th.borderDefault} ${th.surfaceCard}`}`}
                    >
                      <View className={`h-10 w-10 items-center justify-center rounded-xl ${selected ? 'bg-mint' : th.surfaceElevated}`}>
                        <Ionicons name={selected ? 'checkmark' : opt.icon} size={19} color={selected ? palette.canvas : palette.inkMuted} />
                      </View>
                      <View className="flex-1">
                        <Text className={`font-sans-bold text-caption ${th.textTitle}`}>{opt.label}</Text>
                        <Text className={`mt-0.5 font-sans text-2xs ${th.textMuted}`}>{opt.desc}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <View className="mt-6 flex-row items-center justify-between">
                <Pressable disabled={i === 0} onPress={() => setI((n) => Math.max(0, n - 1))} className={`rounded-lg border px-4 py-2.5 ${th.borderDefault} ${i === 0 ? 'opacity-40' : ''}`}>
                  <Text className={`font-sans-medium text-caption ${th.textMuted}`}>Back</Text>
                </Pressable>
                {step.multi ? (
                  <ScalePressable
                    onPress={() => setI((n) => n + 1)}
                    disabled={current.length === 0}
                    className={`flex-row items-center gap-1.5 rounded-lg px-5 py-2.5 ${current.length === 0 ? 'opacity-50' : ''} bg-mint`}
                  >
                    <Text className="font-sans-bold text-caption text-canvas">Continue</Text>
                    <Ionicons name="arrow-forward" size={15} color={palette.canvas} />
                  </ScalePressable>
                ) : null}
              </View>
            </ScrollView>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
