import Svg, { Circle, Text as SvgText } from 'react-native-svg';

export function confidenceColor(value: number): string {
  if (value >= 75) return '#2EE6C9'; // mint
  if (value >= 60) return '#FBBF24'; // warn/gold
  return '#5C6D85'; // faint
}

interface ConfidenceRingProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  trackColor?: string;
  textColor?: string;
}

/** Circular confidence gauge with a mono numeral center. */
export function ConfidenceRing({
  value,
  size = 48,
  strokeWidth = 4,
  showLabel = true,
  trackColor = '#1E2A3A',
  textColor = '#E8EEF6',
}: ConfidenceRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const color = confidenceColor(clamped);
  const dash = (clamped / 100) * c;

  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {showLabel ? (
        <SvgText
          x={size / 2}
          y={size / 2 + size * 0.12}
          textAnchor="middle"
          fontSize={size * 0.3}
          fontFamily="JetBrainsMono_500Medium"
          fill={textColor}
        >
          {clamped}
        </SvgText>
      ) : null}
    </Svg>
  );
}
