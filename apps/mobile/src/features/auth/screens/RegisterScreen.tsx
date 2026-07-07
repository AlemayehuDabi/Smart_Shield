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

export default function RegisterScreen() {
  const themePref = useAppStore((s) => s.themePref);
  const th = useShieldTheme(themePref);
  const insets = useSafeAreaInsets();
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [submitting, setSubmitting] = useState(false);

  const nameErr = touched.name && !name.trim() ? 'Enter your name' : null;
  const emailErr = touched.email ? validateEmail(email) : null;
  const passErr = touched.password ? validatePassword(password) : null;

  const onSubmit = useCallback(async () => {
    setTouched({ name: true, email: true, password: true });
    if (!name.trim() || validateEmail(email) || validatePassword(password)) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));
    await setSession(`demo-${Date.now()}`, { id: 'u-demo', email, name: name.trim(), role: 'trader' });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(routes.onboarding);
  }, [name, email, password, setSession, router]);

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
          <Pressable onPress={() => router.back()} className="mb-6 flex-row items-center gap-1 self-start py-1">
            <Ionicons name="chevron-back" size={18} color={th.dark ? palette.inkMuted : '#475569'} />
            <Text className={`font-sans-medium text-caption ${th.textMuted}`}>Back</Text>
          </Pressable>

          <View className="mb-6">
            <Text className={`font-sans-bold text-hero ${th.textTitle}`}>Start your edge</Text>
            <Text className={`mt-2 max-w-[320px] font-sans text-caption leading-[21px] ${th.textBody}`}>
              Create a free account. Upgrade only when you&rsquo;re ready.
            </Text>
          </View>

          <View className={`rounded-3xl border p-5 ${cardSurface}`}>
            <AuthInput
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="Alex Dabi"
              error={nameErr}
              editable={!submitting}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            />
            <View className="h-4" />
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
              placeholder="8+ characters"
              error={passErr}
              editable={!submitting}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            />
            <View className="mt-6">
              <AuthSubmitButton label="Create free account" loading={submitting} disabled={submitting} onPress={() => void onSubmit()} />
            </View>
          </View>

          <View className="mt-8 flex-row items-center justify-center gap-1">
            <Text className={`font-sans text-2xs ${th.textFaint}`}>Already have an account?</Text>
            <Pressable onPress={() => router.replace(routes.login)} className="py-1">
              <Text className="font-sans-bold text-2xs text-mint">Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
