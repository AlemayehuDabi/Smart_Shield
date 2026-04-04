import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { forwardRef, useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { useAppStore } from '@/src/stores/use-app-store';
import { useShieldTheme } from '@/src/theme/use-shield-theme';

export type AuthInputProps = {
  label: string;
  error?: string | null;
  hint?: string;
  containerClassName?: string;
  /** When true, shows visibility toggle (password fields). */
  secureToggle?: boolean;
} & TextInputProps;

export const AuthInput = forwardRef<TextInput, AuthInputProps>(function AuthInput(
  {
    label,
    error,
    hint,
    containerClassName = '',
    secureToggle = false,
    secureTextEntry,
    editable = true,
    onFocus,
    onBlur,
    className,
    ...rest
  },
  ref,
) {
  const themePref = useAppStore((s) => s.themePref);
  const th = useShieldTheme(themePref);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const isSecure = secureToggle ? !visible : Boolean(secureTextEntry);

  function onFocusWrapped(e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) {
    setFocused(true);
    onFocus?.(e);
  }

  function onBlurWrapped(e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) {
    setFocused(false);
    onBlur?.(e);
  }

  const borderTone = error
    ? 'border-loss/75'
    : focused
      ? 'border-mint/55'
      : th.hairline;

  const bgTone = th.dark ? 'bg-canvas' : 'bg-white';
  const shadow =
    focused && !error
      ? th.dark
        ? 'shadow-orb'
        : 'shadow-orb-light'
      : '';

  return (
    <View className={containerClassName}>
      <Text
        className={`mb-1.5 font-sans-medium text-caption ${th.textMuted}`}
        accessibilityRole="text">
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-2xl border ${borderTone} ${bgTone} ${shadow} px-3.5`}>
        <TextInput
          ref={ref}
          {...rest}
          editable={editable}
          secureTextEntry={isSecure}
          onFocus={onFocusWrapped}
          onBlur={onBlurWrapped}
          placeholderTextColor={th.dark ? '#5C6D85' : '#94a3b8'}
          className={`min-h-[52px] flex-1 py-3.5 font-sans text-body ${th.dark ? 'text-ink' : 'text-slate-900'} ${className ?? ''}`}
          style={[
            Platform.OS === 'android' && { paddingVertical: 0 },
            rest.style,
          ]}
        />
        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            hitSlop={10}
            onPress={() => {
              void Haptics.selectionAsync();
              setVisible((v) => !v);
            }}
            className="ml-1 p-1.5">
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={th.dark ? '#8B9CB3' : '#64748b'}
            />
          </Pressable>
        ) : null}
      </View>
      {hint && !error ? (
        <Text className={`mt-1.5 font-sans text-2xs ${th.textFaint}`}>{hint}</Text>
      ) : null}
      {error ? (
        <Text
          className="mt-1.5 font-sans text-2xs text-loss"
          accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
});
