import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { AlertFeed } from '@/src/components/alerts/AlertFeed';
import { MetricPills } from '@/src/components/dashboard/MetricPills';
import { SignalCard } from '@/src/components/insights/SignalCard';
import { PortfolioStrip } from '@/src/components/portfolio/PortfolioStrip';
import {
  ListSectionLabel,
  ScreenTitle,
} from '@/src/components/ui/SectionHeader';
import { ScreenShell } from '@/src/components/ui/ScreenShell';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';
import {
  alerts,
  allocation,
  insightSummary,
  metrics,
  timeline,
  tradingSignals,
} from '@/src/lib/mock-data';

const toneDot: Record<(typeof timeline)[0]['tone'], string> = {
  neutral: 'bg-ink-faint',
  info: 'bg-ai-pulse',
  warn: 'bg-warn',
  danger: 'bg-loss',
  profit: 'bg-profit',
  loss: 'bg-loss',
};

export default function PulseScreen() {
  const th = useAppTheme();
  const ping = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  const shortcut = Gesture.LongPress()
    .minDuration(480)
    .onStart(() => {
      runOnJS(ping)();
    });

  return (
    <ScreenShell>
      <GestureDetector gesture={shortcut}>
        <View>
          <ScreenTitle
            eyebrow="Smart Shield"
            title="Pulse"
            subtitle="Trade → AI feedback → learn. Long-press header for readiness haptic."
          />
        </View>
      </GestureDetector>

      <View
        className={`mb-3 overflow-hidden rounded-[14px] border ${th.borderDefault}`}
      >
        <LinearGradient
          colors={[palette.canvasPanel, palette.canvasElevated, palette.canvas]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingVertical: 12, paddingHorizontal: 14 }}
        >
          <Text className="font-sans-bold text-2xs uppercase tracking-[0.12em] text-mint/90">
            Co-pilot digest
          </Text>
          <Text className="mt-2 font-sans text-body leading-[22px] text-ink">
            {insightSummary}
          </Text>
        </LinearGradient>
      </View>

      <ListSectionLabel>Portfolio</ListSectionLabel>
      <PortfolioStrip slices={allocation} />

      <ListSectionLabel>Alerts</ListSectionLabel>
      <AlertFeed items={alerts} />

      <View className="h-3" />

      <ListSectionLabel>Performance</ListSectionLabel>
      <MetricPills items={metrics} />

      <View className="h-4" />

      <ListSectionLabel>Session</ListSectionLabel>
      <View className="mb-2">
        {timeline.map((e, i) => (
          <View
            key={e.id}
            className={`flex-row gap-2.5 ${i < timeline.length - 1 ? 'mb-3' : ''}`}
          >
            <View className="items-center pt-1">
              <View className={`h-2 w-2 rounded-full ${toneDot[e.tone]}`} />
            </View>
            <View className={`min-w-0 flex-1 border-b pb-3 ${th.hairline}`}>
              <Text className={`font-mono text-2xs ${th.textFaint}`}>
                {e.time}
              </Text>
              <Text
                className={`mt-0.5 font-sans-bold text-micro ${th.textTitle}`}
              >
                {e.title}
              </Text>
              <Text
                className={`mt-0.5 font-sans text-2xs leading-[17px] ${th.textBody}`}
              >
                {e.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <ListSectionLabel>Signals</ListSectionLabel>
      <View className="pb-2">
        {tradingSignals.map((s) => (
          <SignalCard key={s.id} s={s} />
        ))}
      </View>
    </ScreenShell>
  );
}
