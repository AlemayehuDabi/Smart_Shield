import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import type { Candle } from '@/src/lib/mock-data';
import { layout } from '@/src/theme/layout';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

function triggerHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

interface CandleChartProps {
  candles: Candle[];
  overlayBarIndex?: number;
  overlayLabel?: string;
  height?: number;
}

export function CandleChart({
  candles,
  overlayBarIndex,
  overlayLabel,
  height = 196,
}: CandleChartProps) {
  const th = useAppTheme();
  const { width: screenW } = useWindowDimensions();
  const chartWidth = Math.max(260, screenW - layout.screenPadX * 2);
  const gridStroke = th.dark ? palette.stroke : '#CBD5E1';
  const axisLabel = th.dark ? palette.inkFaint : '#64748B';

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startScale = useSharedValue(1);
  const lastHaptic = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((ev) => {
      translateX.value = startX.value + ev.translationX;
      if (Math.abs(ev.velocityX) > 900 && Date.now() - lastHaptic.value > 200) {
        lastHaptic.value = Date.now();
        runOnJS(triggerHaptic)();
      }
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((ev) => {
      scale.value = Math.min(3.2, Math.max(0.55, startScale.value * ev.scale));
    })
    .onEnd(() => {
      runOnJS(triggerHaptic)();
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const candleMotion = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const padL = 40;
  const padR = 6;
  const padT = 10;
  const padB = 24;
  const innerH = height - padT - padB;

  const chartBody = useMemo(() => {
    if (candles.length === 0) return null;
    const highs = candles.map((c) => c.h);
    const lows = candles.map((c) => c.l);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const span = max - min || 1;
    return { slice: candles, max, min, span };
  }, [candles]);

  if (!chartBody) return null;

  const { slice, max, min, span } = chartBody;

  return (
    <View className={`overflow-hidden rounded-[14px] border ${th.borderDefault} ${th.surfaceCard}`}>
      <View className={`flex-row items-center justify-between border-b px-2.5 py-1.5 ${th.borderMuted}`}>
        <Text className={`font-sans-bold text-2xs uppercase tracking-[0.1em] ${th.textFaint}`}>Chart</Text>
        <Text className={`font-mono text-2xs ${th.textFaint}`}>pinch · pan</Text>
      </View>
      <View style={{ height, width: chartWidth, alignSelf: 'center' }}>
        <Svg width={chartWidth} height={height} style={{ position: 'absolute' }}>
          <Line
            x1={padL}
            y1={padT + innerH * 0.35}
            x2={chartWidth - padR}
            y2={padT + innerH * 0.35}
            stroke={gridStroke}
            strokeDasharray="4 6"
          />
          <Line
            x1={padL}
            y1={padT + innerH * 0.7}
            x2={chartWidth - padR}
            y2={padT + innerH * 0.7}
            stroke={gridStroke}
            strokeDasharray="4 6"
          />
          <SvgText x={2} y={padT + 10} fill={axisLabel} fontSize={10} fontFamily="JetBrainsMono_500Medium">
            {max.toFixed(0)}
          </SvgText>
          <SvgText
            x={2}
            y={padT + innerH * 0.55}
            fill={axisLabel}
            fontSize={10}
            fontFamily="JetBrainsMono_500Medium">
            {((max + min) / 2).toFixed(0)}
          </SvgText>
          <SvgText x={2} y={padT + innerH - 2} fill={axisLabel} fontSize={10} fontFamily="JetBrainsMono_500Medium">
            {min.toFixed(0)}
          </SvgText>
        </Svg>

        <GestureDetector gesture={composed}>
          <Animated.View style={[{ width: chartWidth, height }, candleMotion]}>
            <Svg width={chartWidth} height={height}>
              <G>
                {slice.map((c, i) => {
                  const slot = (chartWidth - padL - padR) / slice.length;
                  const cx = padL + i * slot + slot * 0.2;
                  const cw = slot * 0.5;
                  const yFor = (price: number) => padT + ((max - price) / span) * innerH;
                  const yHigh = yFor(c.h);
                  const yLow = yFor(c.l);
                  const yOpen = yFor(c.o);
                  const yClose = yFor(c.c);
                  const up = c.c >= c.o;
                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyH = Math.max(4, Math.abs(yClose - yOpen));
                  const isOverlay = overlayBarIndex === i;
                  return (
                    <G key={i}>
                      <Line
                        x1={cx + cw / 2}
                        y1={yHigh}
                        x2={cx + cw / 2}
                        y2={yLow}
                        stroke={isOverlay ? palette.aiPulse : up ? palette.profit : palette.loss}
                        strokeWidth={isOverlay ? 2 : 1}
                      />
                      <Rect
                        x={cx}
                        y={bodyTop}
                        width={cw}
                        height={bodyH}
                        rx={2}
                        fill={isOverlay ? palette.ai : up ? palette.profitDim : palette.lossDim}
                        stroke={isOverlay ? palette.aiPulse : up ? palette.profit : palette.loss}
                        strokeWidth={1}
                      />
                    </G>
                  );
                })}
              </G>
            </Svg>
          </Animated.View>
        </GestureDetector>
      </View>
      {overlayLabel ? (
        <View className={`border-t px-2.5 py-2 ${th.borderMuted} ${th.dark ? 'bg-ai-dim/15' : 'bg-violet-50'}`}>
          <Text className="font-sans text-2xs leading-[17px] text-ai">{overlayLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}
