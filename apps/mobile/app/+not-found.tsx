import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export default function NotFoundScreen() {
  const th = useAppTheme();
  const bg = th.dark ? palette.canvas : palette.screenLight;

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center px-5" style={{ backgroundColor: bg }}>
        <Text className={`font-sans-bold text-title ${th.textTitle}`}>This screen does not exist.</Text>
        <Link href="/" className="mt-6">
          <Text className="font-sans-medium text-body text-mint">Return to pulse</Text>
        </Link>
      </View>
    </>
  );
}
