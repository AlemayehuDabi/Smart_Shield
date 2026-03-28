import { Text, View } from 'react-native';

import { JournalTeaser } from '@/src/components/journal/JournalTeaser';
import { LearningTimeline } from '@/src/components/analytics/LearningTimeline';
import { MiniPnLChart } from '@/src/components/analytics/MiniPnLChart';
import { PersonalityBars } from '@/src/components/analytics/PersonalityBars';
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

export default function AnalyticsScreen() {
  const tradeVol = chartSeries.trades.reduce((a, b) => a + b, 0);

  return (
    <ScreenShell>
      <ScreenTitle
        eyebrow="Analytics"
        title="Edge & behavior"
        subtitle="Mistakes, personality, and learning — optimized for quick vertical scans."
      />

      <MiniPnLChart />

      <View className="mb-3 rounded-[14px] border border-canvas-stroke bg-canvas-panel p-3">
        <Text className="font-sans-bold text-2xs uppercase tracking-[0.1em] text-ink-faint">Strategy evolution</Text>
        <Text className="mt-2 font-sans text-micro leading-[20px] text-ink-muted">
          Week volume {tradeVol} trades. EV improves when plan adherence ≥ 80% — you are at {patternHighlights[2].value}{' '}
          {patternHighlights[2].detail}.
        </Text>
      </View>

      <ListSectionLabel>Behavioral</ListSectionLabel>
      <View className="mb-3">
        {patternHighlights.map((p, i) => (
          <View
            key={p.label}
            className={`flex-row items-center justify-between rounded-xl border border-canvas-stroke bg-canvas-elevated/35 px-3 py-2 ${
              i < patternHighlights.length - 1 ? 'mb-1.5' : ''
            }`}>
            <View className="min-w-0 flex-1 pr-2">
              <Text className="font-sans-bold text-micro text-ink">{p.label}</Text>
              <Text className="mt-0.5 font-sans text-2xs text-ink-faint">{p.detail}</Text>
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
            }`}>
            <View className="min-w-0 flex-1 pr-2">
              <Text className="font-sans-bold text-micro text-ink">{m.label}</Text>
              <Text className="font-mono text-2xs text-ink-faint">{m.count}× logged</Text>
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
