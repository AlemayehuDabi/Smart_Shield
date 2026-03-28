import { useRef } from 'react';
import { FlatList, Text, View } from 'react-native';

import type { ChatMessage } from '@/src/lib/mock-data';

function Bubble({ m }: { m: ChatMessage }) {
  const ai = m.role === 'assistant';
  return (
    <View className={`mb-2 max-w-[92%] ${ai ? 'self-start' : 'self-end'}`}>
      <View
        className={`rounded-2xl px-3 py-2 ${
          ai ? 'rounded-tl-sm border border-ai-dim/30 bg-ai-dim/18' : 'rounded-tr-sm border border-mint/25 bg-mint/12'
        }`}>
        <Text className="font-sans text-body leading-[22px] text-ink">{m.content}</Text>
      </View>
      <Text className={`mt-0.5 font-mono text-2xs text-ink-faint ${ai ? 'text-left' : 'text-right'}`}>
        {ai ? 'Shield' : 'You'} · {m.time}
      </Text>
    </View>
  );
}

export function ChatThread({ messages }: { messages: ChatMessage[] }) {
  const ref = useRef<FlatList>(null);
  return (
    <FlatList
      ref={ref}
      data={messages}
      keyExtractor={(item) => item.id}
      onContentSizeChange={() => ref.current?.scrollToEnd({ animated: true })}
      contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <Bubble m={item} />}
    />
  );
}
