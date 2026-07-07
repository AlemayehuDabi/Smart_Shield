import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StackHeader } from '@/src/components/ui/StackHeader';
import { Badge } from '@/src/components/ui/Badge';
import { QuizBlock } from '@/src/components/learn/QuizBlock';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { hrefLesson, hrefSignal } from '@/src/lib/routes';
import { lessonById, lessons, tracks } from '@/src/data/lessons';
import { signals } from '@/src/data/signals';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

function MarkComplete({ xp }: { xp: number }) {
  const th = useAppTheme();
  const [done, setDone] = useState(false);
  return (
    <ScalePressable
      onPress={() => setDone(true)}
      className={`flex-row items-center justify-center gap-2 rounded-[14px] py-3.5 ${done ? `border ${th.borderDefault} ${th.surfaceCard}` : 'bg-mint'}`}
    >
      {done ? <Ionicons name="checkmark-circle" size={18} color={palette.mint} /> : null}
      <Text className={`font-sans-bold text-body ${done ? 'text-mint' : 'text-canvas'}`}>
        {done ? `Completed · +${xp} XP` : `Mark complete · +${xp} XP`}
      </Text>
    </ScalePressable>
  );
}

export default function LessonScreen() {
  const th = useAppTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = lessonById(String(id));

  if (!lesson) {
    return (
      <View className={`flex-1 items-center justify-center ${th.screen}`} style={{ paddingTop: insets.top }}>
        <Text className={th.textBody}>Lesson not found.</Text>
      </View>
    );
  }

  const track = tracks.find((t) => t.id === lesson.trackId);
  const related = signals.filter((s) => s.reasoning.some((step) => step.concept === lesson.id));
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[idx + 1];

  return (
    <View className={`flex-1 ${th.screen}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32, paddingHorizontal: 16 }}
      >
        <StackHeader />

        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          {track ? <Badge tone="ai">{track.name}</Badge> : null}
          <View className={`rounded-md border px-2 py-0.5 ${th.borderDefault}`}>
            <Text className={`font-mono text-2xs ${th.textMuted}`}>{lesson.level}</Text>
          </View>
          <Text className={`font-mono text-2xs ${th.textFaint}`}>{lesson.minutes} min · +{lesson.xp} XP</Text>
        </View>

        <Text className={`mt-3 font-sans-bold text-hero ${th.textTitle}`}>{lesson.title}</Text>
        <Text className={`mt-1.5 font-sans text-caption leading-[21px] ${th.textBody}`}>{lesson.blurb}</Text>

        {/* definition */}
        <View className={`mt-4 rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="book-outline" size={15} color={palette.ai} />
            <Text className="font-mono text-2xs uppercase tracking-[0.12em] text-ai">The idea</Text>
          </View>
          <Text className={`mt-2 font-sans text-caption leading-[21px] ${th.textTitle}`}>{lesson.definition}</Text>
        </View>

        {/* key points */}
        <Text className={`mb-2.5 mt-5 font-sans-bold text-caption ${th.textTitle}`}>What to remember</Text>
        <View className="gap-2.5">
          {lesson.keyPoints.map((p) => (
            <View key={p} className="flex-row gap-2.5">
              <Ionicons name="checkmark" size={16} color={palette.mint} style={{ marginTop: 2 }} />
              <Text className={`flex-1 font-sans text-micro leading-[19px] ${th.textBody}`}>{p}</Text>
            </View>
          ))}
        </View>

        {/* seen in live signals */}
        {related.length > 0 ? (
          <View className={`mt-5 overflow-hidden rounded-[16px] border ${th.borderDefault} ${th.surfaceCard}`}>
            <View className={`flex-row items-center gap-2 border-b px-4 py-3 ${th.hairline}`}>
              <Ionicons name="pulse-outline" size={15} color={palette.mint} />
              <Text className={`font-sans-bold text-2xs ${th.textTitle}`}>Seen in live signals</Text>
            </View>
            {related.map((s, i) => (
              <Pressable
                key={s.id}
                onPress={() => router.push(hrefSignal(s.id))}
                className={`flex-row items-center gap-3 px-4 py-3 ${i < related.length - 1 ? `border-b ${th.hairline}` : ''}`}
              >
                <Text className={`font-sans-bold text-2xs ${th.textTitle}`}>{s.symbol}</Text>
                <Text numberOfLines={1} className={`flex-1 font-sans text-2xs ${th.textMuted}`}>{s.thesis}</Text>
                <Ionicons name="chevron-forward" size={14} color={palette.inkFaint} />
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* quiz */}
        <View className="mt-5">
          <QuizBlock {...lesson.quiz} />
        </View>

        {/* complete + next */}
        <View className="mt-5 gap-3">
          <MarkComplete xp={lesson.xp} />
          {next && next.status !== 'locked' ? (
            <ScalePressable
              onPress={() => router.push(hrefLesson(next.id))}
              className={`flex-row items-center justify-between rounded-[14px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}
            >
              <View>
                <Text className={`font-mono text-[10px] uppercase tracking-[0.1em] ${th.textFaint}`}>Up next</Text>
                <Text className={`mt-0.5 font-sans-bold text-micro ${th.textTitle}`}>{next.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.inkFaint} />
            </ScalePressable>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
