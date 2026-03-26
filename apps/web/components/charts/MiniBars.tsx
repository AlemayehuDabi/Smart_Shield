"use client";

import { cn } from "@/components/ui/cn";

interface MiniBarsProps {
  values: number[];
  labels: string[];
  className?: string;
}

export function MiniBars({ values, labels, className }: MiniBarsProps) {
  const max = Math.max(...values, 1);
  const h = 88;
  const barW = 22;
  const gap = 10;
  const w = values.length * (barW + gap) + gap;

  return (
    <svg viewBox={`0 0 ${w} ${h + 24}`} className={cn("w-full", className)} aria-hidden>
      {values.map((v, i) => {
        const bh = (v / max) * h;
        const x = gap + i * (barW + gap);
        const y = h - bh;
        return (
          <g key={labels[i]}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={Math.max(bh, 2)}
              rx={6}
              fill="rgba(167, 139, 250, 0.35)"
              className="transition-all duration-300 hover:fill-[rgba(167,139,250,0.55)]"
            />
            <text
              x={x + barW / 2}
              y={h + 14}
              textAnchor="middle"
              fill="var(--ss-text-faint)"
              fontSize="9"
              fontFamily="var(--font-mono-stack)"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
