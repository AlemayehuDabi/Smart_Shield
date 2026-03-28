import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { palette } from '@/src/theme/palette';

export function Composer({ onSend }: { onSend: (t: string) => void }) {
  const [text, setText] = useState('');
  const submit = () => {
    const t = text.trim();
    if (!t) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(t);
    setText('');
  };
  return (
    <View className="flex-row items-end gap-2 border-t border-canvas-stroke bg-canvas-elevated px-3 py-2.5">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Message co-pilot…"
        placeholderTextColor={palette.inkFaint}
        multiline
        className="max-h-24 min-h-10 flex-1 rounded-xl border border-canvas-stroke bg-canvas px-3 py-2.5 font-sans text-body text-ink"
        onSubmitEditing={submit}
      />
      <Pressable
        onPress={submit}
        className="mb-0.5 rounded-xl bg-mint px-4 py-2.5"
        accessibilityLabel="Send message">
        <Text className="font-sans-bold text-micro text-canvas">Send</Text>
      </Pressable>
    </View>
  );
}
