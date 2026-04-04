import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
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
import { loginWithEmailPassword, AuthRequestError } from '@/src/features/auth/api';
import { hrefAuthRegister } from '@/src/features/auth/hrefs';
import { getPasswordResetUrl } from '@/src/features/auth/config';
import { mapAuthErrorMessage } from '@/src/features/auth/errors';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import { validateEmail, validatePassword } from '@/src/features/auth/validation';
import { palette } from '@/src/theme/palette';
import { layout } from '@/src/theme/layout';
import { useAppStore } from '@/src/stores/use-app-store';
import { useShieldTheme } from '@/src/theme/use-shield-theme';

export function LoginScreen() {
  const themePref = useAppStore((s) => s.themePref);
  const th = useShieldTheme(themePref);
  const insets = useSafeAreaInsets();
  const { token, hydrated } = useAuth();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailErr = touched.email ? validateEmail(email) : null;
  const passErr = touched.password ? validatePassword(password) : null;

  const onSubmit = useCallback(async () => {
    setTouched({ email: true, password: true });
    if (validateEmail(email) || validatePassword(password)) return;
    setFormError(null);
    setSubmitting(true);
    try {
      const out = await loginWithEmailPassword(email, password);
      await setSession(out.token, out.user);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(shell)');
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = err instanceof AuthRequestError ? err.message : 'Sign-in failed.';
      setFormError(mapAuthErrorMessage(msg));
    } finally {
      setSubmitting(false);
    }
  }, [email, password, setSession]);

  const onForgotPassword = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const url = getPasswordResetUrl();
    if (url) {
      void Linking.openURL(url);
      return;
    }
    Alert.alert(
      'Reset password',
      'Password reset is available from the Smart Shield web app. Ask your admin for the reset link, or set EXPO_PUBLIC_PASSWORD_RESET_URL for in-app opening.',
    );
  }, []);

  if (hydrated && token) {
    return <Redirect href="/(shell)" />;
  }

  const backdrop = th.dark
    ? ([palette.canvas, palette.canvasElevated, '#0a1624'] as const)
    : ([palette.screenLight, '#E4E9F2', '#dce3ef'] as const);

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
        end={{ x: 0.85, y: 1 }}
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
          <View className="mb-8">
            <Text
              className={`font-sans-bold text-hero ${th.textTitle}`}
              accessibilityRole="header">
              Smart Shield
            </Text>
            <Text className={`mt-2 max-w-[320px] font-sans text-caption leading-[22px] ${th.textBody}`}>
              Real-time trading with an AI co-pilot that learns how you move size, time, and risk.
            </Text>
            <View className="mt-4 h-1 w-12 rounded-full bg-mint/90" />
          </View>

          <View className={`rounded-3xl border p-5 ${cardSurface}`}>
            <Text className={`font-sans-bold text-title ${th.textTitle}`}>Sign in</Text>
            <Text className={`mt-1 font-sans text-micro ${th.textFaint}`}>
              Use the email tied to your workspace. JWT session is stored securely on device.
            </Text>

            <View className="mt-6">
              <AuthBanner variant="error" message={formError} />
            </View>

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
              error={passErr}
              editable={!submitting}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            />

            <Pressable
              accessibilityRole="button"
              onPress={onForgotPassword}
              className="mt-3 self-end py-1 active:opacity-70">
              <Text className="font-sans-medium text-caption text-mint">Forgot password?</Text>
            </Pressable>

            <View className="mt-6">
              <AuthSubmitButton
                label="Sign in"
                loading={submitting}
                disabled={submitting}
                onPress={() => void onSubmit()}
              />
            </View>
          </View>

          <View className="mt-8 flex-row flex-wrap items-center justify-center gap-1 px-2">
            <Text className={`text-center font-sans text-2xs ${th.textFaint}`}>
              New to Smart Shield?
            </Text>
            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                router.push(hrefAuthRegister);
              }}
              accessibilityRole="link"
              className="py-1">
              <Text className="font-sans-bold text-2xs text-mint">Create an account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
