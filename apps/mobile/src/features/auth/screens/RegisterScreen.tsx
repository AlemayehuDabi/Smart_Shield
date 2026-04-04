import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthBanner } from '@/src/features/auth/components/AuthBanner';
import { AuthInput } from '@/src/features/auth/components/AuthInput';
import { AuthSubmitButton } from '@/src/features/auth/components/AuthSubmitButton';
import { registerAccount, AuthRequestError } from '@/src/features/auth/api';
import { mapAuthErrorMessage } from '@/src/features/auth/errors';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
} from '@/src/features/auth/validation';
import { palette } from '@/src/theme/palette';
import { layout } from '@/src/theme/layout';
import { useAppStore } from '@/src/stores/use-app-store';
import { useShieldTheme } from '@/src/theme/use-shield-theme';
import { ScalePressable } from '@/src/components/ui/ScalePressable';

export function RegisterScreen() {
  const themePref = useAppStore((s) => s.themePref);
  const th = useShieldTheme(themePref);
  const insets = useSafeAreaInsets();
  const { token, hydrated } = useAuth();
  const setSession = useAuthStore((s) => s.setSession);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const nameErr = touched.name ? validateName(name) : null;
  const emailErr = touched.email ? validateEmail(email) : null;
  const passErr = touched.password ? validatePassword(password) : null;
  const matchErr =
    touched.confirm || touched.password ? validatePasswordMatch(password, confirm) : null;

  const onSubmit = useCallback(async () => {
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (
      validateName(name) ||
      validateEmail(email) ||
      validatePassword(password) ||
      validatePasswordMatch(password, confirm)
    ) {
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const out = await registerAccount(name, email, password);
      await setSession(out.token, out.user);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess(true);
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = err instanceof AuthRequestError ? err.message : 'Registration failed.';
      setFormError(mapAuthErrorMessage(msg));
    } finally {
      setSubmitting(false);
    }
  }, [name, email, password, confirm, setSession]);

  const enterApp = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(shell)');
  }, []);

  if (hydrated && token && !success) {
    return <Redirect href="/(shell)" />;
  }

  const backdrop = th.dark
    ? ([palette.canvas, '#0c1420', palette.canvasElevated] as const)
    : ([palette.screenLight, '#e8ecf4', '#dfe6f2'] as const);

  const cardSurface = th.dark
    ? 'border-canvas-stroke bg-canvas-panel/95'
    : 'border-slate-200/90 bg-white shadow-card-light';

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${th.screen}`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
      <LinearGradient
        colors={backdrop}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + layout.topInsetExtra + 8,
            paddingBottom: Math.max(insets.bottom, 20) + 24,
            paddingHorizontal: layout.screenPadX,
          }}
          showsVerticalScrollIndicator={false}>
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              router.back();
            }}
            accessibilityRole="button"
            className="mb-6 flex-row items-center self-start py-1 active:opacity-70">
            <Text className="font-sans-medium text-caption text-mint">← Back to sign in</Text>
          </Pressable>

          <View className="mb-6">
            <Text className={`font-sans-bold text-hero ${th.textTitle}`}>Create workspace</Text>
            <Text className={`mt-2 max-w-[340px] font-sans text-caption leading-[22px] ${th.textBody}`}>
              One profile — live quotes, AI memory, and behavioral nudges stay in sync across
              sessions.
            </Text>
          </View>

          <View className={`rounded-3xl border p-5 ${cardSurface}`}>
            {success ? (
              <>
                <AuthBanner
                  variant="success"
                  message="You are in. Your session is secured with a JWT — continue when you are ready."
                />
                <Text className={`font-sans text-caption leading-[22px] ${th.textBody}`}>
                  The assistant will start learning from your next session — paper or live, your
                  choice.
                </Text>
                <View className="mt-6">
                  <ScalePressable
                    onPress={enterApp}
                    className={`items-center rounded-2xl border py-4 ${th.hairline} ${th.surfaceElevated}`}>
                    <Text className={`font-sans-bold text-body ${th.textTitle}`}>
                      Enter Smart Shield
                    </Text>
                  </ScalePressable>
                </View>
              </>
            ) : (
              <>
                <Text className={`font-sans-bold text-title ${th.textTitle}`}>Register</Text>
                <Text className={`mt-1 font-sans text-micro ${th.textFaint}`}>
                  Password must be at least 8 characters, matching the trading-engine policy.
                </Text>

                <View className="mt-6">
                  <AuthBanner variant="error" message={formError} />
                </View>

                <AuthInput
                  label="Full name"
                  value={name}
                  onChangeText={setName}
                  autoComplete="name"
                  placeholder="Jordan Lee"
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
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="you@firm.com"
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
                  hint="Min. 8 characters"
                  error={passErr}
                  editable={!submitting}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                />

                <View className="h-4" />

                <AuthInput
                  label="Confirm password"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureToggle
                  placeholder="••••••••"
                  error={matchErr}
                  editable={!submitting}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                />

                <View className="mt-6">
                  <AuthSubmitButton
                    label="Create account"
                    loading={submitting}
                    disabled={submitting}
                    onPress={() => void onSubmit()}
                  />
                </View>
              </>
            )}
          </View>

          {!success ? (
            <View className="mt-8 flex-row flex-wrap items-center justify-center gap-1 px-2">
              <Text className={`text-center font-sans text-2xs ${th.textFaint}`}>
                Already have access?
              </Text>
              <Pressable
                onPress={() => {
                  void Haptics.selectionAsync();
                  router.back();
                }}
                accessibilityRole="link"
                className="py-1">
                <Text className="font-sans-bold text-2xs text-mint">Sign in</Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
