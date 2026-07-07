import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface SparklineProps {
  points: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  uid?: string;
  strokeWidth?: number;
}

/** Tiny inline trend line for cards. */
export function Sparkline({
  points,
  width = 96,
  height = 28,
  color = '#2EE6C9',
  fill = false,
  uid = 'sp',
  strokeWidth = 1.6,
}: SparklineProps) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 2;
  const sx = width / (points.length - 1);
  const d = points
    .map((v, i) => {
      const px = i * sx;
      const py = pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(2)},${py.toFixed(2)}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      {fill ? (
        <>
          <Defs>
            <LinearGradient id={`${uid}-f`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={0.28} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#${uid}-f)`} />
        </>
      ) : null}
      <Path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
