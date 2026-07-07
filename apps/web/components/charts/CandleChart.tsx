import type { Candle } from "@/lib/data/market";
import { fmtPrice } from "@/lib/data/signals";

interface Marker {
  entry?: number;
  target?: number;
  stop?: number;
  signalIndex?: number;
  direction?: "long" | "short";
}

interface CandleChartProps {
  candles: Candle[];
  markers?: Marker;
  width?: number;
  height?: number;
  /** reserve right gutter for price labels */
  labelGutter?: number;
  className?: string;
  /** annotate a zone of bars (e.g. divergence window) with a soft violet band */
  zone?: { from: number; to: number; label?: string };
}

/**
 * Static SVG candlestick chart with signal overlays (entry / target / stop
 * levels, fire marker, concept zone). Pure — renders on the server.
 */
export function CandleChart({
  candles,
  markers,
  width = 560,
  height = 260,
  labelGutter = 52,
  className,
  zone,
}: CandleChartProps) {
  const n = candles.length;
  const plotW = width - labelGutter;
  const padTop = 14;
  const padBot = 8;
  const plotH = height - padTop - padBot;

  const levels = [markers?.entry, markers?.target, markers?.stop].filter(
    (v): v is number => typeof v === "number"
  );
  const lows = candles.map((c) => c.l);
  const highs = candles.map((c) => c.h);
  const min = Math.min(...lows, ...levels);
  const max = Math.max(...highs, ...levels);
  const range = max - min || 1;
  const y = (v: number) => padTop + plotH - ((v - min) / range) * plotH;
  const step = plotW / n;
  const bodyW = Math.max(step * 0.55, 2);
  const x = (i: number) => i * step + step / 2;

  const gridLines = 4;

  const level = (
    value: number,
    color: string,
    label: string,
    dashed: boolean
  ) => (
    <g key={label}>
      <line
        x1={0}
        x2={plotW}
        y1={y(value)}
        y2={y(value)}
        stroke={color}
        strokeWidth={1}
        strokeDasharray={dashed ? "3 4" : undefined}
        opacity={0.85}
      />
      <text
        x={plotW + 6}
        y={y(value) + 3}
        fontSize={9}
        fontFamily="var(--font-mono-stack)"
        fill={color}
        letterSpacing="0.04em"
      >
        {label} {fmtPrice(value)}
      </text>
    </g>
  );

  const sig = markers?.signalIndex;
  const dir = markers?.direction ?? "long";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Price chart with signal levels"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* grid */}
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const gy = padTop + (plotH / gridLines) * i;
        return (
          <line
            key={i}
            x1={0}
            x2={plotW}
            y1={gy}
            y2={gy}
            stroke="var(--ss-chart-grid)"
            strokeWidth={1}
          />
        );
      })}

      {/* concept zone */}
      {zone && (
        <g>
          <rect
            x={x(zone.from) - step / 2}
            y={padTop}
            width={x(zone.to) - x(zone.from) + step}
            height={plotH}
            fill="var(--ss-violet)"
            opacity={0.07}
          />
          <line
            x1={x(zone.from) - step / 2}
            x2={x(zone.from) - step / 2}
            y1={padTop}
            y2={padTop + plotH}
            stroke="var(--ss-violet)"
            strokeWidth={1}
            strokeDasharray="2 3"
            opacity={0.5}
          />
          <line
            x1={x(zone.to) + step / 2}
            x2={x(zone.to) + step / 2}
            y1={padTop}
            y2={padTop + plotH}
            stroke="var(--ss-violet)"
            strokeWidth={1}
            strokeDasharray="2 3"
            opacity={0.5}
          />
          {zone.label && (
            <text
              x={(x(zone.from) + x(zone.to)) / 2}
              y={padTop + 10}
              fontSize={8.5}
              fontFamily="var(--font-mono-stack)"
              fill="var(--ss-violet)"
              textAnchor="middle"
              letterSpacing="0.08em"
            >
              {zone.label.toUpperCase()}
            </text>
          )}
        </g>
      )}

      {/* candles */}
      {candles.map((c, i) => {
        const up = c.c >= c.o;
        const color = up ? "var(--ss-profit)" : "var(--ss-loss)";
        const bodyTop = y(Math.max(c.o, c.c));
        const bodyH = Math.max(Math.abs(y(c.o) - y(c.c)), 1.25);
        return (
          <g key={i}>
            <line
              x1={x(i)}
              x2={x(i)}
              y1={y(c.h)}
              y2={y(c.l)}
              stroke={color}
              strokeWidth={1}
              opacity={0.75}
            />
            <rect
              x={x(i) - bodyW / 2}
              y={bodyTop}
              width={bodyW}
              height={bodyH}
              rx={0.75}
              fill={color}
              opacity={up ? 0.9 : 0.85}
            />
          </g>
        );
      })}

      {/* levels */}
      {typeof markers?.target === "number" &&
        level(markers.target, "var(--ss-profit)", "TP", true)}
      {typeof markers?.entry === "number" &&
        level(markers.entry, "var(--ss-accent)", dir === "long" ? "LONG" : "SHORT", false)}
      {typeof markers?.stop === "number" &&
        level(markers.stop, "var(--ss-loss)", "SL", true)}

      {/* signal fire marker */}
      {typeof sig === "number" && sig >= 0 && sig < n && (
        <g>
          <line
            x1={x(sig)}
            x2={x(sig)}
            y1={padTop}
            y2={padTop + plotH}
            stroke="var(--ss-accent)"
            strokeWidth={1}
            strokeDasharray="2 3"
            opacity={0.45}
          />
          <circle cx={x(sig)} cy={y(candles[sig].c)} r={8} fill="var(--ss-accent)" opacity={0.16} />
          <circle cx={x(sig)} cy={y(candles[sig].c)} r={3.2} fill="var(--ss-accent)" />
          <circle
            cx={x(sig)}
            cy={y(candles[sig].c)}
            r={3.2}
            fill="none"
            stroke="var(--ss-bg)"
            strokeWidth={1.4}
          />
        </g>
      )}
    </svg>
  );
}
