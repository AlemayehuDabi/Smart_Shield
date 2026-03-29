import { Text, View } from 'react-native';

import { JournalTeaser } from '@/src/components/journal/JournalTeaser';
import { LearningTimeline } from '@/src/components/analytics/LearningTimeline';
import { MiniPnLChart } from '@/src/components/analytics/MiniPnLChart';
import { PersonalityBars } from '@/src/components/analytics/PersonalityBars';
import { AppCard } from '@/src/components/ui/AppCard';
import { ListSectionLabel, ScreenTitle } from '@/src/components/ui/SectionHeader';
import { ScreenShell } from '@/src/components/ui/ScreenShell';
import {
  chartSeries,
  journalEntries,
  learningBeats,
  mistakePatterns,
  patternHighlights,
  personalityAxes,
} from '@/src/lib/mock-data';
import { useAppTheme } from '@/src/theme/use-shield-theme';

export default function AnalyticsScreen() {
  const th = useAppTheme();
  const tradeVol = chartSeries.trades.reduce((a, b) => a + b, 0);
  const rowSurface = th.dark
    ? 'border-canvas-stroke bg-canvas-elevated/35'
    : 'border-slate-200/90 bg-slate-50';

  return (
    <ScreenShell>
      <ScreenTitle
        eyebrow="Analytics"
        title="Edge & behavior"
        subtitle="Mistakes, personality, and learning — optimized for quick vertical scans."
      />

      <MiniPnLChart />

      <AppCard className="mb-3">
        <Text className={`font-sans-bold text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>
          Strategy evolution
        </Text>
        <Text className={`mt-2 font-sans text-micro leading-[20px] ${th.textBody}`}>
          Week volume {tradeVol} trades. EV improves when plan adherence ≥ 80% — you are at{' '}
          {patternHighlights[2].value} {patternHighlights[2].detail}.
        </Text>
      </AppCard>

      <ListSectionLabel>Behavioral</ListSectionLabel>
      <View className="mb-3">
        {patternHighlights.map((p, i) => (
          <View
            key={p.label}
            className={`flex-row items-center justify-between rounded-xl border px-3 py-2 ${rowSurface} ${
              i < patternHighlights.length - 1 ? 'mb-1.5' : ''
            }`}
          >
            <View className="min-w-0 flex-1 pr-2">
              <Text className={`font-sans-bold text-micro ${th.textTitle}`}>{p.label}</Text>
              <Text className={`mt-0.5 font-sans text-2xs ${th.textFaint}`}>{p.detail}</Text>
            </View>
            <Text className="shrink-0 font-mono text-lead text-mint">{p.value}</Text>
          </View>
        ))}
      </View>

      <ListSectionLabel>Mistakes</ListSectionLabel>
      <View className="mb-3">
        {mistakePatterns.map((m, i) => (
          <View
            key={m.id}
            className={`flex-row items-center justify-between rounded-xl border border-loss/20 bg-loss/[0.05] px-2.5 py-2 ${
              i < mistakePatterns.length - 1 ? 'mb-1.5' : ''
            }`}
          >
            <View className="min-w-0 flex-1 pr-2">
              <Text className={`font-sans-bold text-micro ${th.textTitle}`}>{m.label}</Text>
              <Text className={`font-mono text-2xs ${th.textFaint}`}>{m.count}× logged</Text>
            </View>
            <Text className="shrink-0 font-mono text-micro text-loss">{m.impact}</Text>
          </View>
        ))}
      </View>

      <PersonalityBars axes={personalityAxes} />

      <JournalTeaser entries={journalEntries} />

      <LearningTimeline beats={learningBeats} />
    </ScreenShell>
  );
}
