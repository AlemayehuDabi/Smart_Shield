import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function QuizBlock({
  question,
  options,
  answer,
  explanation,
}: {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}) {
  const th = useAppTheme();
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <View className={`rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
      <View className="flex-row items-center gap-2">
        <Ionicons name="sparkles" size={15} color={palette.ai} />
        <Text className="font-mono text-2xs uppercase tracking-[0.12em] text-ai">Check your understanding</Text>
      </View>
      <Text className={`mt-2.5 font-sans-medium text-caption ${th.textTitle}`}>{question}</Text>

      <View className="mt-3 gap-2">
        {options.map((opt, i) => {
          const correct = i === answer;
          const chosen = picked === i;
          let cls = th.borderDefault;
          if (answered && correct) cls = 'border-mint/50 bg-mint/12';
          else if (answered && chosen) cls = 'border-loss/50 bg-loss/12';
          else if (answered) cls = `${th.borderDefault} opacity-55`;
          return (
            <Pressable
              key={opt}
              disabled={answered}
              onPress={() => {
                void Haptics.selectionAsync();
                setPicked(i);
              }}
              className={`flex-row items-center gap-2.5 rounded-xl border px-3.5 py-3 ${cls}`}
            >
              <View
                className={`h-5 w-5 items-center justify-center rounded-full border ${
                  answered && correct ? 'border-mint bg-mint' : answered && chosen ? 'border-loss' : th.borderDefault
                }`}
              >
                {answered && correct ? (
                  <Ionicons name="checkmark" size={12} color={palette.canvas} />
                ) : answered && chosen ? (
                  <Ionicons name="close" size={11} color={palette.loss} />
                ) : (
                  <Text className={`font-mono text-[10px] ${th.textFaint}`}>{String.fromCharCode(65 + i)}</Text>
                )}
              </View>
              <Text className={`flex-1 font-sans text-micro ${th.textTitle}`}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>

      {answered ? (
        <View className={`mt-3 rounded-xl p-3 ${th.surfaceElevated}`}>
          <Text className={`font-sans text-2xs leading-[18px] ${th.textBody}`}>
            <Text className={`font-sans-bold ${picked === answer ? 'text-mint' : 'text-loss'}`}>
              {picked === answer ? 'Correct. ' : 'Not quite. '}
            </Text>
            {explanation}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
