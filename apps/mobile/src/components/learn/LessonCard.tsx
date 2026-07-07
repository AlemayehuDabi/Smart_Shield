import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { hrefLesson } from '@/src/lib/routes';
import { type Lesson } from '@/src/data/lessons';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const th = useAppTheme();
  const locked = lesson.status === 'locked';
  const done = lesson.status === 'done';
  const inProgress = lesson.status === 'in-progress';

  const iconWrap = done ? 'bg-mint' : locked ? th.surfaceElevated : 'bg-ai/15';
  const iconColor = done ? palette.canvas : locked ? palette.inkFaint : palette.ai;
  const iconName = done ? 'checkmark' : locked ? 'lock-closed' : 'school-outline';

  const statusText = done ? 'Completed' : locked ? 'Locked' : inProgress ? 'Resume' : 'Start';
  const statusColor = done ? 'text-mint' : locked ? th.textFaint : 'text-ai';

  const body = (
    <View className={`rounded-[14px] border p-3.5 ${th.borderDefault} ${th.surfaceCard} ${locked ? 'opacity-60' : ''}`}>
      <View className="flex-row items-start justify-between">
        <View className={`h-9 w-9 items-center justify-center rounded-lg ${iconWrap}`}>
          <Ionicons name={iconName} size={17} color={iconColor} />
        </View>
        <View className="flex-row items-center gap-2">
          <Text className={`font-mono text-2xs ${th.textFaint}`}>{lesson.minutes}m</Text>
          <Text className="font-mono text-2xs text-ai">+{lesson.xp} XP</Text>
        </View>
      </View>
      <Text className={`mt-3 font-sans-bold text-lead ${th.textTitle}`}>{lesson.title}</Text>
      <Text className={`mt-1 font-sans text-2xs leading-[17px] ${th.textBody}`}>{lesson.blurb}</Text>
      <View className={`mt-3 flex-row items-center justify-between border-t pt-2.5 ${th.hairline}`}>
        <Text className={`font-mono text-2xs ${th.textFaint}`}>{lesson.level}</Text>
        <View className="flex-row items-center gap-1">
          {!locked && !done ? <Ionicons name="play" size={11} color={palette.ai} /> : null}
          <Text className={`font-sans-bold text-2xs ${statusColor}`}>{statusText}</Text>
        </View>
      </View>
    </View>
  );

  if (locked) return body;
  return (
    <ScalePressable onPress={() => router.push(hrefLesson(lesson.id))}>{body}</ScalePressable>
  );
}
