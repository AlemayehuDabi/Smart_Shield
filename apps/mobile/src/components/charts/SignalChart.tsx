import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';

import { type Candle } from '@/src/data/market';
import { fmtPrice } from '@/src/data/market';

interface SignalChartProps {
  candles: Candle[];
  entry: number;
  target: number;
  stop: number;
  signalIndex: number;
  direction: 'long' | 'short';
  width: number;
  height?: number;
  gridColor?: string;
}

/** Static candlestick chart with entry / target / stop overlays + fire marker. */
export function SignalChart({
  candles,
  entry,
  target,
  stop,
  signalIndex,
  direction,
  width,
  height = 220,
  gridColor = '#1E2A3A',
}: SignalChartProps) {
  const labelGutter = 52;
  const n = candles.length;
  const plotW = width - labelGutter;
  const padTop = 12;
  const padBot = 8;
  const plotH = height - padTop - padBot;

  const levels = [entry, target, stop];
  const lows = candles.map((c) => c.l);
  const highs = candles.map((c) => c.h);
  const min = Math.min(...lows, ...levels);
  const max = Math.max(...highs, ...levels);
  const range = max - min || 1;
  const y = (v: number) => padTop + plotH - ((v - min) / range) * plotH;
  const step = plotW / n;
  const bodyW = Math.max(step * 0.55, 2);
  const x = (i: number) => i * step + step / 2;

  const mint = '#2EE6C9';
  const profit = '#34D399';
  const loss = '#FB7185';

  const level = (value: number, color: string, label: string, dashed: boolean) => (
    <G key={label}>
      <Line x1={0} x2={plotW} y1={y(value)} y2={y(value)} stroke={color} strokeWidth={1} strokeDasharray={dashed ? '3 4' : undefined} opacity={0.85} />
      <SvgText x={plotW + 5} y={y(value) + 3} fontSize={9} fontFamily="JetBrainsMono_500Medium" fill={color}>
        {label} {fmtPrice(value)}
      </SvgText>
    </G>
  );

  return (
    <Svg width={width} height={height}>
      {Array.from({ length: 5 }, (_, i) => {
        const gy = padTop + (plotH / 4) * i;
        return <Line key={`g${i}`} x1={0} x2={plotW} y1={gy} y2={gy} stroke={gridColor} strokeWidth={1} />;
      })}

      {candles.map((c, i) => {
        const up = c.c >= c.o;
        const color = up ? profit : loss;
        const bodyTop = y(Math.max(c.o, c.c));
        const bodyH = Math.max(Math.abs(y(c.o) - y(c.c)), 1.25);
        return (
          <G key={i}>
            <Line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1} opacity={0.75} />
            <Rect x={x(i) - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} rx={0.75} fill={color} opacity={up ? 0.9 : 0.85} />
          </G>
        );
      })}

      {level(target, profit, 'TP', true)}
      {level(entry, mint, direction === 'long' ? 'LONG' : 'SHORT', false)}
      {level(stop, loss, 'SL', true)}

      {signalIndex >= 0 && signalIndex < n ? (
        <G>
          <Line x1={x(signalIndex)} x2={x(signalIndex)} y1={padTop} y2={padTop + plotH} stroke={mint} strokeWidth={1} strokeDasharray="2 3" opacity={0.45} />
          <Circle cx={x(signalIndex)} cy={y(candles[signalIndex].c)} r={7} fill={mint} opacity={0.18} />
          <Circle cx={x(signalIndex)} cy={y(candles[signalIndex].c)} r={3.2} fill={mint} />
        </G>
      ) : null}
    </Svg>
  );
}
