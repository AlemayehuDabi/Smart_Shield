import { Redirect, Tabs } from 'expo-router';

import { ShieldDock } from '@/src/components/shell/ShieldDock';
import { routes } from '@/src/lib/routes';
import { useAuth } from '@/src/features/auth/hooks/use-auth';

export default function ShellLayout() {
  const { token, hydrated } = useAuth();
  if (!hydrated) return null;
  if (!token) return <Redirect href={routes.login} />;

  return (
    <Tabs
      tabBar={(props) => <ShieldDock {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="portfolio" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="automation" />
    </Tabs>
  );
}
