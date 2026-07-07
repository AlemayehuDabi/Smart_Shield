interface SparklineProps {
  points: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  uid?: string;
  className?: string;
  strokeWidth?: number;
}

/** Tiny inline trend line. Pure SVG, server-safe. */
export function Sparkline({
  points,
  width = 96,
  height = 28,
  color = "var(--ss-accent)",
  fill = false,
  uid,
  className,
  strokeWidth = 1.6,
}: SparklineProps) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 2;
  const sx = width / (points.length - 1);
  const d = points
    .map((v, i) => {
      const px = i * sx;
      const py = pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2);
      return `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden preserveAspectRatio="none">
      {fill && uid && (
        <defs>
          <linearGradient id={`${uid}-sf`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
      )}
      {fill && uid && (
        <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#${uid}-sf)`} stroke="none" />
      )}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
