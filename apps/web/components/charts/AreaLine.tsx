export interface AreaSeries {
  points: number[];
  /** CSS color (token) for the stroke */
  color: string;
  /** soft gradient fill under the line */
  fill?: boolean;
  label?: string;
  dashed?: boolean;
}

interface AreaLineProps {
  series: AreaSeries[];
  width?: number;
  height?: number;
  /** unique id prefix for gradient defs when multiple charts share a page */
  uid: string;
  className?: string;
  grid?: boolean;
  /** draw-in animation on the first series */
  animate?: boolean;
  /** pad domain by this fraction */
  domainPad?: number;
}

function path(points: number[], w: number, h: number, min: number, range: number, pad: number): string {
  const n = points.length;
  const sx = w / (n - 1);
  return points
    .map((v, i) => {
      const px = i * sx;
      const py = pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)}`;
    })
    .join(" ");
}

/** Multi-series line/area chart on a single shared y-domain. Pure SVG, server-safe. */
export function AreaLine({
  series,
  width = 480,
  height = 180,
  uid,
  className,
  grid = true,
  animate = false,
  domainPad = 0.08,
}: AreaLineProps) {
  const all = series.flatMap((s) => s.points);
  const rawMin = Math.min(...all);
  const rawMax = Math.max(...all);
  const spread = rawMax - rawMin || 1;
  const min = rawMin - spread * domainPad;
  const range = spread * (1 + domainPad * 2);
  const pad = 6;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={series.map((s) => s.label).filter(Boolean).join(" vs ") || "Line chart"}
      preserveAspectRatio="none"
    >
      <defs>
        {series.map(
          (s, i) =>
            s.fill && (
              <linearGradient key={i} id={`${uid}-g${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            )
        )}
      </defs>
      {grid &&
        Array.from({ length: 4 }, (_, i) => {
          const gy = pad + ((height - pad * 2) / 3) * i;
          return (
            <line key={i} x1={0} x2={width} y1={gy} y2={gy} stroke="var(--ss-chart-grid)" strokeWidth={1} />
          );
        })}
      {series.map((s, i) => {
        const d = path(s.points, width, height, min, range, pad);
        return (
          <g key={i}>
            {s.fill && (
              <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#${uid}-g${i})`} stroke="none" />
            )}
            <path
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={s.dashed ? "4 5" : undefined}
              className={animate && i === 0 ? "ss-draw" : undefined}
              style={animate && i === 0 ? ({ "--draw-len": 1400 } as React.CSSProperties) : undefined}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </svg>
  );
}
