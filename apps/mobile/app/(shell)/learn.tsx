import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { ScreenShell } from '@/src/components/ui/ScreenShell';
import { ShellHeader } from '@/src/components/shell/ShellHeader';
import { Segmented } from '@/src/components/ui/Segmented';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { LessonCard } from '@/src/components/learn/LessonCard';
import { hrefLesson } from '@/src/lib/routes';
import { learnProgress as lp, lessons, tracks, type LessonLevel } from '@/src/data/lessons';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type LevelFilter = 'all' | LessonLevel;
const accentHex: Record<string, string> = { mint: palette.mint, ai: palette.ai, warn: palette.warn };

export default function LearnScreen() {
  const th = useAppTheme();
  const [level, setLevel] = useState<LevelFilter>('all');

  const visible = useMemo(() => lessons.filter((l) => level === 'all' || l.level === level), [level]);
  const nextUp = lessons.find((l) => l.status === 'in-progress') ?? lessons.find((l) => l.status === 'available');

  return (
    <ScreenShell>
      <ShellHeader
        eyebrow="Pillar 03 · Learn"
        title="Learn"
        subtitle="Concepts taught the moment they matter — every signal links to the lesson behind it."
      />

      {/* progress */}
      <View className={`mb-3 rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-ai/15">
              <Ionicons name="school" size={22} color={palette.ai} />
            </View>
            <View>
              <Text className={`font-mono text-[10px] uppercase tracking-[0.1em] ${th.textFaint}`}>Rank</Text>
              <Text className={`font-sans-bold text-title ${th.textTitle}`}>{lp.rank}</Text>
              <Text className={`font-mono text-2xs ${th.textFaint}`}>{lp.lessonsDone} of {lp.lessonsTotal} lessons</Text>
            </View>
          </View>
          <View className="items-center">
            <View className="flex-row items-center gap-1">
              <Ionicons name="flame" size={16} color={palette.warn} />
              <Text className={`font-sans-bold text-title ${th.textTitle}`}>{lp.streakDays}</Text>
            </View>
            <Text className={`font-mono text-[9px] uppercase tracking-[0.1em] ${th.textFaint}`}>day streak</Text>
          </View>
        </View>
        <View className="mt-4">
          <View className="mb-1.5 flex-row items-center justify-between">
            <Text className={`font-sans text-2xs ${th.textBody}`}>XP to Strategist</Text>
            <Text className="font-mono text-2xs text-ai">{lp.xp} / {lp.xpToNext}</Text>
          </View>
          <ProgressBar value={(lp.xp / lp.xpToNext) * 100} tone="ai" />
        </View>
      </View>

      {/* continue + automation tie-in */}
      {nextUp ? (
        <ScalePressable
          onPress={() => router.push(hrefLesson(nextUp.id))}
          className={`mb-3 flex-row items-center justify-between rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}
        >
          <View className="flex-1">
            <Text className="font-mono text-[10px] uppercase tracking-[0.1em] text-ai">Continue learning</Text>
            <Text className={`mt-1 font-sans-bold text-lead ${th.textTitle}`}>{nextUp.title}</Text>
          </View>
          <View className="flex-row items-center gap-1.5 rounded-lg bg-ai px-3 py-2">
            <Ionicons name="play" size={13} color="#fff" />
            <Text className="font-sans-bold text-2xs text-white">{nextUp.minutes}m</Text>
          </View>
        </ScalePressable>
      ) : null}

      <View className={`mb-5 flex-row items-start gap-2.5 rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
        <Ionicons name="git-branch-outline" size={18} color={palette.warn} />
        <Text className={`flex-1 font-sans text-2xs leading-[18px] ${th.textBody}`}>
          <Text className={`font-sans-bold ${th.textTitle}`}>Mastery unlocks automation.</Text> Completing a
          track proves you understand a strategy before you can automate it.
        </Text>
      </View>

      <View className="mb-4">
        <Segmented
          fill
          options={[
            { value: 'all', label: 'All' },
            { value: 'Foundation', label: 'Basics' },
            { value: 'Intermediate', label: 'Inter.' },
            { value: 'Advanced', label: 'Adv.' },
          ]}
          value={level}
          onChange={setLevel}
        />
      </View>

      {/* tracks */}
      <View className="gap-6">
        {tracks.map((track) => {
          const items = visible.filter((l) => l.trackId === track.id);
          if (items.length === 0) return null;
          const done = items.filter((l) => l.status === 'done').length;
          return (
            <View key={track.id}>
              <View className="mb-2.5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                  <View className="h-4 w-1 rounded-full" style={{ backgroundColor: accentHex[track.accent] }} />
                  <View>
                    <Text className={`font-sans-bold text-caption ${th.textTitle}`}>{track.name}</Text>
                    <Text className={`font-sans text-2xs ${th.textMuted}`}>{track.description}</Text>
                  </View>
                </View>
                <Text className={`font-mono text-2xs ${th.textFaint}`}>{done}/{items.length}</Text>
              </View>
              <View className="gap-2.5">
                {items.map((l) => (
                  <LessonCard key={l.id} lesson={l} />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </ScreenShell>
  );
}
