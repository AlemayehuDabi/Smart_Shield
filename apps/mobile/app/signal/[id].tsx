import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StackHeader } from '@/src/components/ui/StackHeader';
import { Badge } from '@/src/components/ui/Badge';
import { ConfidenceRing } from '@/src/components/charts/ConfidenceRing';
import { SignalChart } from '@/src/components/charts/SignalChart';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { hrefLesson, routes } from '@/src/lib/routes';
import { fmtPrice } from '@/src/data/market';
import { conceptLabel } from '@/src/data/lessons';
import {
  confidenceTier,
  rrRatio,
  signalById,
  statusLabel,
  type ReasoningStep,
} from '@/src/data/signals';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

const marketLabel = { crypto: 'Crypto', stocks: 'Stocks', fx: 'Forex' } as const;

function ConceptLink({ concept }: { concept: string }) {
  return (
    <Pressable onPress={() => router.push(hrefLesson(concept))} className="active:opacity-70">
      <Text className="font-sans-medium text-2xs text-ai">learn: {conceptLabel(concept).toLowerCase()} →</Text>
    </Pressable>
  );
}

function Reasoning({ step, index, hairline }: { step: ReasoningStep; index: number; hairline: string }) {
  const th = useAppTheme();
  return (
    <View className="flex-row gap-3">
      <View className={`mt-0.5 h-5 w-5 items-center justify-center rounded-md ${th.surfaceElevated}`}>
        <Text className={`font-mono text-2xs ${th.textMuted}`}>{index + 1}</Text>
      </View>
      <View className="flex-1">
        <Text className={`font-sans text-micro leading-[19px] ${th.textBody}`}>{step.text}</Text>
        {step.concept ? (
          <View className="mt-1">
            <ConceptLink concept={step.concept} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default function SignalDetailScreen() {
  const th = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const signal = signalById(String(id));

  if (!signal) {
    return (
      <View className={`flex-1 items-center justify-center ${th.screen}`} style={{ paddingTop: insets.top }}>
        <Text className={th.textBody}>Signal not found.</Text>
      </View>
    );
  }

  const isLong = signal.direction === 'long';
  const closed = signal.status.startsWith('closed');
  const chartW = width - 32 - 24; // screen - screen pad - card pad
  const grid = th.dark ? '#1E2A3A' : '#E2E8F0';

  return (
    <View className={`flex-1 ${th.screen}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32, paddingHorizontal: 16 }}
      >
        <StackHeader title={signal.symbol} />

        {/* header card */}
        <View className={`mt-3 rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <ConfidenceRing value={signal.confidence} size={54} strokeWidth={4} trackColor={grid} textColor={th.dark ? '#E8EEF6' : '#0f172a'} />
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className={`font-sans-bold text-title ${th.textTitle}`}>{signal.symbol}</Text>
                  <Badge tone={isLong ? 'profit' : 'loss'}>{signal.direction}</Badge>
                </View>
                <Text className={`mt-0.5 font-sans text-2xs ${th.textMuted}`}>
                  {signal.name} · {marketLabel[signal.market]} · {signal.timeframe}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className={`font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Conf.</Text>
              <Text className={`font-sans-bold text-lead ${th.textTitle}`}>{confidenceTier(signal.confidence)}</Text>
              <Text className={`font-mono text-2xs ${th.textFaint}`}>{signal.generatedAt}</Text>
            </View>
          </View>
        </View>

        {/* thesis */}
        <View className={`mt-3 rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
          <Text className="mb-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-mint">Thesis</Text>
          <Text className={`font-sans text-caption leading-[21px] ${th.textTitle}`}>{signal.thesis}</Text>
        </View>

        {/* chart */}
        <View className={`mt-3 rounded-[16px] border p-3 ${th.borderDefault} ${th.surfaceCard}`}>
          <SignalChart
            candles={signal.candles}
            entry={signal.entry}
            target={signal.target}
            stop={signal.stop}
            signalIndex={signal.signalIndex}
            direction={signal.direction}
            width={chartW}
            height={210}
            gridColor={grid}
          />
        </View>

        {/* levels */}
        <View className="mt-3 flex-row gap-2.5">
          {[
            { label: 'Entry', value: fmtPrice(signal.entry), cls: 'text-mint' },
            { label: 'Target', value: fmtPrice(signal.target), cls: 'text-profit' },
            { label: 'Stop', value: fmtPrice(signal.stop), cls: 'text-loss' },
            { label: 'R:R', value: rrRatio(signal), cls: th.textTitle },
          ].map((lv) => (
            <View key={lv.label} className={`flex-1 rounded-[12px] border p-2.5 ${th.borderDefault} ${th.surfaceCard}`}>
              <Text className={`font-mono text-[9px] uppercase tracking-[0.1em] ${th.textFaint}`}>{lv.label}</Text>
              <Text className={`mt-1 font-mono text-caption ${lv.cls}`}>{lv.value}</Text>
            </View>
          ))}
        </View>

        {/* reasoning */}
        <View className={`mt-3 rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
          <View className="mb-3 flex-row items-center gap-2">
            <Ionicons name="git-network-outline" size={16} color={palette.mint} />
            <Text className={`font-sans-bold text-caption ${th.textTitle}`}>Why the AI called this</Text>
          </View>
          <View className="gap-3">
            {signal.reasoning.map((step, i) => (
              <Reasoning key={i} step={step} index={i} hairline={th.hairline} />
            ))}
          </View>
          <View className={`mt-4 flex-row flex-wrap gap-1.5 border-t pt-3 ${th.hairline}`}>
            {signal.indicators.map((ind) => (
              <View key={ind} className={`rounded-md border px-2 py-1 ${th.borderDefault}`}>
                <Text className={`font-mono text-2xs ${th.textMuted}`}>{ind}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* outcome / actions */}
        {closed ? (
          <View className={`mt-3 flex-row items-center justify-between rounded-[16px] border p-4 ${th.borderDefault} ${th.surfaceElevated}`}>
            <Text className={`font-mono text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>
              Outcome · {statusLabel(signal.status)}
            </Text>
            <Text className={`font-sans-bold text-title ${(signal.resultPct ?? 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
              {(signal.resultPct ?? 0) >= 0 ? '+' : ''}
              {signal.resultPct?.toFixed(1)}%
            </Text>
          </View>
        ) : (
          <View className="mt-4 flex-row gap-2.5">
            <ScalePressable onPress={() => router.push(routes.journal)} className="flex-1 overflow-hidden rounded-[14px]">
              <LinearGradient colors={[palette.mintDim, palette.mint]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                <Ionicons name="add" size={18} color={palette.canvas} />
                <Text className="font-sans-bold text-caption text-canvas">Log this trade</Text>
              </LinearGradient>
            </ScalePressable>
            <ScalePressable className={`h-[50px] flex-row items-center justify-center gap-2 rounded-[14px] border px-5 ${th.borderDefault} ${th.surfaceCard}`}>
              <Ionicons name="notifications-outline" size={17} color={th.dark ? palette.ink : '#0f172a'} />
              <Text className={`font-sans-medium text-caption ${th.textTitle}`}>Alert</Text>
            </ScalePressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
