import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/src/theme/use-shield-theme';

/** Page / block title: small brand line + headline */
export function ScreenTitle({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const th = useAppTheme();
  return (
    <View className={`mb-5 ${className}`}>
      <Text className="font-mono text-2xs uppercase tracking-[0.14em] text-mint">
        {eyebrow}
      </Text>
      <Text className={`font-sans-bold text-hero ${th.textTitle}`}>
        {title}
      </Text>
      {subtitle ? (
        <Text className={`font-sans text-body leading-5 ${th.textBody}`}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

/** Dense uppercase label above a list or carousel */
export function ListSectionLabel({
  children,
  right,
}: {
  children: string;
  right?: ReactNode;
}) {
  const th = useAppTheme();
  return (
    <View className="mb-2 flex-row items-center justify-between">
      <Text
        className={`font-sans-bold text-2xs uppercase tracking-[0.12em] ${th.textFaint}`}
      >
        {children}
      </Text>
      {right}
    </View>
  );
}
