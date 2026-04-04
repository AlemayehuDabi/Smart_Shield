import { Redirect, Tabs } from 'expo-router';

import { ShieldDock } from '@/src/components/shell/ShieldDock';
import { hrefAuthLogin } from '@/src/features/auth/hrefs';
import { useAuth } from '@/src/features/auth/hooks/use-auth';

export default function ShellLayout() {
  const { token, hydrated } = useAuth();
  if (!hydrated) return null;
  if (!token) return <Redirect href={hrefAuthLogin} />;

  return (
    <Tabs
      tabBar={(props) => <ShieldDock {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="trade" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
