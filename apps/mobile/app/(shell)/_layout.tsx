import { Tabs } from 'expo-router';

import { ShieldDock } from '@/src/components/shell/ShieldDock';

export default function ShellLayout() {
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
