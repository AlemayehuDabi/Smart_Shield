import Svg, { Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

export interface AreaSeries {
  points: number[];
  color: string;
  fill?: boolean;
  dashed?: boolean;
}

interface AreaLineChartProps {
  series: AreaSeries[];
  width: number;
  height?: number;
  uid: string;
  grid?: boolean;
  gridColor?: string;
  domainPad?: number;
}

function toPath(points: number[], w: number, h: number, min: number, range: number, pad: number): string {
  const n = points.length;
  const sx = w / (n - 1);
  return points
    .map((v, i) => {
      const px = i * sx;
      const py = pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(2)},${py.toFixed(2)}`;
    })
    .join(' ');
}

/** Multi-series line/area chart on a shared y-domain. */
export function AreaLineChart({
  series,
  width,
  height = 180,
  uid,
  grid = true,
  gridColor = '#1E2A3A',
  domainPad = 0.08,
}: AreaLineChartProps) {
  const all = series.flatMap((s) => s.points);
  const rawMin = Math.min(...all);
  const rawMax = Math.max(...all);
  const spread = rawMax - rawMin || 1;
  const min = rawMin - spread * domainPad;
  const range = spread * (1 + domainPad * 2);
  const pad = 6;

  return (
    <Svg width={width} height={height}>
      <Defs>
        {series.map((s, i) =>
          s.fill ? (
            <LinearGradient key={i} id={`${uid}-g${i}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={s.color} stopOpacity={0.24} />
              <Stop offset="1" stopColor={s.color} stopOpacity={0} />
            </LinearGradient>
          ) : null,
        )}
      </Defs>
      {grid
        ? Array.from({ length: 4 }, (_, i) => {
            const gy = pad + ((height - pad * 2) / 3) * i;
            return <Line key={i} x1={0} x2={width} y1={gy} y2={gy} stroke={gridColor} strokeWidth={1} />;
          })
        : null}
      {series.map((s, i) => {
        const d = toPath(s.points, width, height, min, range, pad);
        return (
          <Path key={`f${i}`} d={`${d} L${width},${height} L0,${height} Z`} fill={s.fill ? `url(#${uid}-g${i})` : 'none'} />
        );
      })}
      {series.map((s, i) => {
        const d = toPath(s.points, width, height, min, range, pad);
        return (
          <Path
            key={`l${i}`}
            d={d}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={s.dashed ? '4 5' : undefined}
          />
        );
      })}
    </Svg>
  );
}
