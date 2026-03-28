import { type ReactNode } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/src/theme/use-shield-theme';

export function AppCard({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  const th = useAppTheme();
  return (
    <View
      className={`rounded-[14px] border ${th.borderDefault} ${th.surfaceCard} ${padded ? 'p-3' : ''} ${className}`}>
      {children}
    </View>
  );
}
