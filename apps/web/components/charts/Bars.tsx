interface BarsProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  className?: string;
  /** positive/negative aware coloring */
  signed?: boolean;
  color?: string;
}

/** Vertical bar chart with baseline at zero. Pure SVG, server-safe. */
export function Bars({
  data,
  width = 320,
  height = 120,
  className,
  signed = true,
  color = "var(--ss-accent)",
}: BarsProps) {
  const vals = data.map((d) => d.value);
  const max = Math.max(...vals, 0);
  const min = Math.min(...vals, 0);
  const range = max - min || 1;
  const padTop = 6;
  const padBot = 16;
  const plotH = height - padTop - padBot;
  const zeroY = padTop + (max / range) * plotH;
  const slot = width / data.length;
  const barW = Math.min(slot * 0.56, 34);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Bar chart"
      preserveAspectRatio="none"
    >
      <line x1={0} x2={width} y1={zeroY} y2={zeroY} stroke="var(--ss-chart-grid)" strokeWidth={1} />
      {data.map((d, i) => {
        const cx = i * slot + slot / 2;
        const h = (Math.abs(d.value) / range) * plotH;
        const positive = d.value >= 0;
        const fill = signed
          ? positive
            ? "var(--ss-profit)"
            : "var(--ss-loss)"
          : color;
        const y = positive ? zeroY - h : zeroY;
        return (
          <g key={d.label}>
            <rect
              x={cx - barW / 2}
              y={y}
              width={barW}
              height={Math.max(h, 1)}
              rx={2}
              fill={fill}
              opacity={0.85}
            />
            <text
              x={cx}
              y={height - 4}
              fontSize={9}
              fontFamily="var(--font-mono-stack)"
              fill="var(--ss-text-faint)"
              textAnchor="middle"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
