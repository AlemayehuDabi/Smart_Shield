import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { ChatThread } from '@/src/components/ai/ChatThread';
import { Composer } from '@/src/components/ai/Composer';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { suggestionChips } from '@/src/lib/mock-data';
import { useChatStore } from '@/src/stores/use-chat-store';

export default function AssistantModal() {
  const insets = useSafeAreaInsets();
  const messages = useChatStore((s) => s.messages);
  const appendUser = useChatStore((s) => s.appendUser);

  return (
    <View className="flex-1 bg-canvas" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between border-b border-canvas-stroke px-4 py-2.5">
        <View className="min-w-0 flex-1 pr-2">
          <Text className="font-mono text-2xs uppercase tracking-[0.12em] text-mint">Co-pilot</Text>
          <Text className="mt-0.5 font-sans-bold text-title text-ink">Assistant</Text>
        </View>
        <ScalePressable
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
          className="rounded-full border border-canvas-stroke px-3 py-1.5"
          accessibilityLabel="Close assistant">
          <Text className="font-sans-bold text-2xs text-ink-muted">Close</Text>
        </ScalePressable>
      </View>

      <View className="border-b border-canvas-stroke px-4 py-2">
        <Text className="mb-1.5 font-sans-bold text-2xs uppercase tracking-wide text-ink-faint">Try</Text>
        <View className="flex-row flex-wrap gap-1.5">
          {suggestionChips.map((c, i) => (
            <Animated.View key={c} entering={FadeInRight.delay(i * 40).duration(280)}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  appendUser(c);
                }}
                className="rounded-full border border-ai-dim/35 bg-ai-dim/18 px-2.5 py-1.5">
                <Text className="font-sans-medium text-2xs text-ai-pulse">{c}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </View>

      <View className="flex-1 px-3">
        <ChatThread messages={messages} />
      </View>

      <Composer onSend={appendUser} />
      <View style={{ height: Math.max(insets.bottom, 6) }} />
    </View>
  );
}
