interface ConfidenceArcProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

/** Confidence tier → color. High = accent, medium = gold, low = neutral. */
export function confidenceColor(value: number): string {
  if (value >= 75) return "var(--ss-accent)";
  if (value >= 60) return "var(--ss-gold)";
  return "var(--ss-text-faint)";
}

export function confidenceTier(value: number): string {
  if (value >= 75) return "High";
  if (value >= 60) return "Medium";
  return "Low";
}

/** Circular confidence gauge with mono numeral center. Pure SVG, server-safe. */
export function ConfidenceArc({
  value,
  size = 56,
  strokeWidth = 4,
  className,
  showLabel = true,
}: ConfidenceArcProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const color = confidenceColor(clamped);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={`Confidence ${clamped} percent — ${confidenceTier(clamped)}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--ss-border)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${(clamped / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {showLabel && (
        <text
          x="50%"
          y="50%"
          dy="0.36em"
          textAnchor="middle"
          fontSize={size * 0.26}
          fontFamily="var(--font-mono-stack)"
          fontWeight={600}
          fill="var(--ss-text)"
          letterSpacing="-0.02em"
        >
          {clamped}
        </text>
      )}
    </svg>
  );
}
