import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-canvas px-5">
        <Text className="font-sans-bold text-title text-ink">This screen does not exist.</Text>
        <Link href="/" className="mt-6">
          <Text className="font-sans-medium text-body text-mint">Return to pulse</Text>
        </Link>
      </View>
    </>
  );
}
