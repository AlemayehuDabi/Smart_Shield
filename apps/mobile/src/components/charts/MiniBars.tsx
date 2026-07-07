import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

interface MiniBarsProps {
  data: { label: string; value: number }[];
  width: number;
  height?: number;
  axisColor?: string;
  gridColor?: string;
}

/** Vertical bar chart with a zero baseline; positive/negative aware. */
export function MiniBars({
  data,
  width,
  height = 120,
  axisColor = '#5C6D85',
  gridColor = '#1E2A3A',
}: MiniBarsProps) {
  const vals = data.map((d) => d.value);
  const max = Math.max(...vals, 0);
  const min = Math.min(...vals, 0);
  const range = max - min || 1;
  const padTop = 6;
  const padBot = 18;
  const plotH = height - padTop - padBot;
  const zeroY = padTop + (max / range) * plotH;
  const slot = width / data.length;
  const barW = Math.min(slot * 0.5, 30);

  return (
    <Svg width={width} height={height}>
      <Line x1={0} x2={width} y1={zeroY} y2={zeroY} stroke={gridColor} strokeWidth={1} />
      {data.map((d, i) => {
        const cx = i * slot + slot / 2;
        const h = (Math.abs(d.value) / range) * plotH;
        const positive = d.value >= 0;
        const fill = positive ? '#34D399' : '#FB7185';
        const y = positive ? zeroY - h : zeroY;
        return (
          <Rect key={`b${i}`} x={cx - barW / 2} y={y} width={barW} height={Math.max(h, 1)} rx={2} fill={fill} opacity={0.9} />
        );
      })}
      {data.map((d, i) => {
        const cx = i * slot + slot / 2;
        return (
          <SvgText key={`t${i}`} x={cx} y={height - 4} fontSize={9} fontFamily="JetBrainsMono_500Medium" fill={axisColor} textAnchor="middle">
            {d.label}
          </SvgText>
        );
      })}
    </Svg>
  );
}
