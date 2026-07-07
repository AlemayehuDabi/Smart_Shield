import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthInput } from '@/src/features/auth/components/AuthInput';
import { AuthSubmitButton } from '@/src/features/auth/components/AuthSubmitButton';
import { validateEmail, validatePassword } from '@/src/features/auth/validation';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import { routes } from '@/src/lib/routes';
import { palette } from '@/src/theme/palette';
import { layout } from '@/src/theme/layout';
import { useAppStore } from '@/src/stores/use-app-store';
import { useShieldTheme } from '@/src/theme/use-shield-theme';

const perks = ['3 AI signals a day, free forever', 'Plain-English reasoning on every call', 'No broker keys, ever'];

export default function LoginScreen() {
  const themePref = useAppStore((s) => s.themePref);
  const th = useShieldTheme(themePref);
  const insets = useSafeAreaInsets();
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  const [email, setEmail] = useState('alex@smartshield.app');
  const [password, setPassword] = useState('demo-password');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);

  const emailErr = touched.email ? validateEmail(email) : null;
  const passErr = touched.password ? validatePassword(password) : null;

  const onSubmit = useCallback(async () => {
    setTouched({ email: true, password: true });
    if (validateEmail(email) || validatePassword(password)) return;
    setSubmitting(true);
    // UI-only demo — no backend call
    await new Promise((r) => setTimeout(r, 450));
    await setSession(`demo-${Date.now()}`, { id: 'u-demo', email, name: 'Alex Dabi', role: 'trader' });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(routes.shell);
  }, [email, password, setSession, router]);

  const backdrop = th.dark
    ? ([palette.canvas, palette.canvasElevated, '#0a1624'] as const)
    : ([palette.screenLight, '#E4E9F2', '#dce3ef'] as const);
  const cardSurface = th.dark ? 'border-canvas-stroke bg-canvas-panel/95' : 'border-slate-200/90 bg-white shadow-card-light';

  return (
    <KeyboardAvoidingView className={`flex-1 ${th.screen}`} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={backdrop} start={{ x: 0, y: 0 }} end={{ x: 0.85, y: 1 }} style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.screenPadX }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-7">
            <View className="mb-4 flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-xl bg-mint/15">
                <Ionicons name="shield-checkmark" size={18} color={palette.mint} />
              </View>
              <Text className={`font-sans-bold text-title ${th.textTitle}`}>Smart Shield</Text>
            </View>
            <Text className={`font-sans-bold text-hero ${th.textTitle}`}>Signals you understand.</Text>
            <Text className="font-sans-bold text-hero text-mint">Skills you keep.</Text>
            <Text className={`mt-2.5 max-w-[320px] font-sans text-caption leading-[21px] ${th.textBody}`}>
              The AI that teaches you how to trade — then automates what you&rsquo;ve mastered.
            </Text>
            <View className="mt-4 gap-1.5">
              {perks.map((p) => (
                <View key={p} className="flex-row items-center gap-2">
                  <Ionicons name="checkmark" size={14} color={palette.mint} />
                  <Text className={`font-sans text-2xs ${th.textMuted}`}>{p}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={`rounded-3xl border p-5 ${cardSurface}`}>
            <Text className={`font-sans-bold text-title ${th.textTitle}`}>Sign in</Text>
            <Text className={`mt-1 font-sans text-micro ${th.textFaint}`}>Demo mode — any details work.</Text>

            <View className="mt-6">
              <AuthInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@email.com"
                error={emailErr}
                editable={!submitting}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
              <View className="h-4" />
              <AuthInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureToggle
                placeholder="••••••••"
                error={passErr}
                editable={!submitting}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              />
            </View>

            <View className="mt-6">
              <AuthSubmitButton label="Sign in" loading={submitting} disabled={submitting} onPress={() => void onSubmit()} />
            </View>
          </View>

          <View className="mt-8 flex-row items-center justify-center gap-1">
            <Text className={`font-sans text-2xs ${th.textFaint}`}>New to Smart Shield?</Text>
            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                router.push(routes.register);
              }}
              className="py-1"
            >
              <Text className="font-sans-bold text-2xs text-mint">Create an account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
