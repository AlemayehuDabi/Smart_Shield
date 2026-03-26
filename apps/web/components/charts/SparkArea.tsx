"use client";

import { useId } from "react";
import { cn } from "@/components/ui/cn";

interface SparkAreaProps {
  values: number[];
  className?: string;
  stroke?: string;
  fill?: string;
  height?: number;
}

export function SparkArea({
  values,
  className,
  stroke = "rgba(94, 234, 212, 0.85)",
  fill,
  height = 96,
}: SparkAreaProps) {
  const gid = useId();
  const fillId = `ss-spark-fill-${gid.replace(/:/g, "")}`;
  const fillRef = fill ?? `url(#${fillId})`;
  const w = 320;
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const innerW = w - pad * 2;
  const innerH = height - pad * 2;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1 || 1)) * innerW;
    const y = pad + innerH - ((v - min) / range) * innerH;
    return { x, y };
  });

  const lineD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaD = `${lineD} L ${points[points.length - 1]!.x.toFixed(1)} ${(height - pad).toFixed(1)} L ${pad} ${(height - pad).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      className={cn("w-full max-w-full", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(94, 234, 212, 0.25)" />
          <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={fillRef} stroke="none" />
      <path
        d={lineD}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
