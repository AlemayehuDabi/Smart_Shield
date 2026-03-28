"use client";

import { useId, useMemo } from "react";
import type { Candle } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

interface CandleChartProps {
  candles: Candle[];
  highlightBar?: number;
  className?: string;
  title?: string;
}

export function CandleChart({ candles, highlightBar, className, title }: CandleChartProps) {
  const gid = useId().replace(/:/g, "");
  const w = 720;
  const h = 320;
  const pad = { t: 28, r: 12, b: 56, l: 52 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const volH = 44;

  const { minP, maxP, paths } = useMemo(() => {
    if (!candles.length) return { minP: 0, maxP: 1, paths: null };
    let min = Infinity;
    let max = -Infinity;
    for (const c of candles) {
      min = Math.min(min, c.l);
      max = Math.max(max, c.h);
    }
    const padPct = (max - min) * 0.06 || min * 0.001;
    const minP = min - padPct;
    const maxP = max + padPct;
    const range = maxP - minP || 1;
    const n = candles.length;
    const bw = innerW / n;
    const volMax = Math.max(...candles.map((c) => c.v), 1);

    const maPeriod = 12;
    const maVals: number[] = [];
    for (let i = 0; i < n; i++) {
      const a = Math.max(0, i - maPeriod + 1);
      let s = 0;
      for (let j = a; j <= i; j++) s += candles[j]!.c;
      maVals.push(s / (i - a + 1));
    }

    const candleEls = candles.map((c, i) => {
      const x = pad.l + i * bw + bw * 0.15;
      const cw = bw * 0.7;
      const yh = pad.t + innerH - ((c.h - minP) / range) * innerH;
      const yl = pad.t + innerH - ((c.l - minP) / range) * innerH;
      const yo = pad.t + innerH - ((Math.max(c.o, c.c) - minP) / range) * innerH;
      const yc = pad.t + innerH - ((Math.min(c.o, c.c) - minP) / range) * innerH;
      const up = c.c >= c.o;
      const bodyH = Math.max(yc - yo, 1);
      const cx = x + cw / 2;
      const isHi = highlightBar === i;
      return (
        <g key={i}>
          <line
            x1={cx}
            y1={yh}
            x2={cx}
            y2={yl}
            stroke={up ? "var(--ss-bid)" : "var(--ss-ask)"}
            strokeWidth={isHi ? 2 : 1}
            opacity={isHi ? 1 : 0.85}
          />
          <rect
            x={x}
            y={yo}
            width={cw}
            height={bodyH}
            rx={1}
            fill={up ? "var(--ss-profit-dim)" : "var(--ss-loss-dim)"}
            stroke={up ? "var(--ss-profit)" : "var(--ss-loss)"}
            strokeWidth={isHi ? 2 : 1}
            className={cn("transition-opacity duration-300", isHi && "ss-ai-nudge")}
          />
        </g>
      );
    });

    const volEls = candles.map((c, i) => {
      const x = pad.l + i * bw + bw * 0.2;
      const vw = bw * 0.6;
      const vh = (c.v / volMax) * volH;
      const y = h - pad.b - vh;
      const up = c.c >= c.o;
      return <rect key={`v-${i}`} x={x} y={y} width={vw} height={vh} fill={up ? "var(--ss-profit)" : "var(--ss-loss)"} opacity={0.35} rx={1} />;
    });

    const maPts = maVals.map((v, i) => {
      const x = pad.l + i * bw + bw / 2;
      const y = pad.t + innerH - ((v - minP) / range) * innerH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    });
    const maD = maPts.join(" ");

    return { minP, maxP, paths: { candles: candleEls, vol: volEls, ma: maD } };
  }, [candles, highlightBar]);

  const gridLines = 5;
  const gridEls = [];
  for (let g = 0; g <= gridLines; g++) {
    const y = pad.t + (innerH / gridLines) * g;
    gridEls.push(
      <line
        key={g}
        x1={pad.l}
        y1={y}
        x2={w - pad.r}
        y2={y}
        stroke="var(--ss-chart-grid)"
        strokeWidth={1}
      />,
    );
  }

  const priceLabels = [];
  if (paths) {
    for (let g = 0; g <= gridLines; g++) {
      const y = pad.t + (innerH / gridLines) * g;
      const price = maxP - ((maxP - minP) / gridLines) * g;
      priceLabels.push(
        <text
          key={`pl-${g}`}
          x={pad.l - 8}
          y={y + 4}
          textAnchor="end"
          fill="var(--ss-text-faint)"
          fontSize="10"
          fontFamily="var(--font-mono-stack)"
        >
          {price.toFixed(price >= 1000 ? 0 : 2)}
        </text>,
      );
    }
  }

  return (
    <div className={cn("relative overflow-hidden rounded-[var(--radius-md)]", className)}>
      {title && (
        <div className="absolute left-3 top-2 z-10 flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-tight text-[var(--ss-text)]">{title}</span>
          <span className="rounded border border-[var(--ss-border)] bg-[var(--ss-surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ss-text-muted)]">
            15m · OHLCV
          </span>
        </div>
      )}
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[min(42vh,360px)] w-full bg-[var(--ss-chart-bg)]" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Candlestick chart">
        <defs>
          <linearGradient id={`volFade-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ss-accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--ss-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridEls}
        {paths && (
          <>
            <path
              d={paths.ma}
              fill="none"
              stroke="var(--ss-violet)"
              strokeWidth={1.25}
              strokeLinejoin="round"
              opacity={0.85}
            />
            {paths.candles}
            <line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke="var(--ss-border)" strokeWidth={1} />
            {paths.vol}
          </>
        )}
        {priceLabels}
      </svg>
    </div>
  );
}
