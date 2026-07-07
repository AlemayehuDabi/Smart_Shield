import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

/* Brand glyph — shield with a signal line through it */
export function LogoMark({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 2.5 4.5 5.4v6.1c0 4.6 3.2 8 7.5 9.9 4.3-1.9 7.5-5.3 7.5-9.9V5.4L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7.2 12.8h2.1l1.5-3.4 2.4 5.2 1.4-2.7h2.2"
        stroke="var(--ss-accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const TrendUp = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m3 17 5.5-5.5 3.5 3.5L21 6.5" />
    <path d="M15.5 6.5H21V12" />
  </svg>
);

export const TrendDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m3 7 5.5 5.5L12 9l9 8.5" />
    <path d="M15.5 17.5H21V12" />
  </svg>
);

export const Pulse = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12h4l2.5-6 4 12L16 12h5" />
  </svg>
);

export const ChartCandle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 4v3m0 8v3M7 7h0a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm10-3v2m0 10v4m0-14h0a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
  </svg>
);

export const PieChart = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 12A9 9 0 1 1 12 3v9h9Z" />
    <path d="M21 8.5A9 9 0 0 0 15.5 3v5.5H21Z" />
  </svg>
);

export const BookOpen = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 6.5c-1.8-1.6-4.4-2-7-2v13c2.6 0 5.2.4 7 2 1.8-1.6 4.4-2 7-2v-13c-2.6 0-5.2.4-7 2Z" />
    <path d="M12 6.5v13" />
  </svg>
);

export const Bot = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4.5" y="8" width="15" height="11" rx="2.5" />
    <path d="M12 8V4.5m0 0h3M9 13v1.5m6-1.5v1.5" />
  </svg>
);

export const Journal = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 3.5h12A1.5 1.5 0 0 1 19.5 5v14a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5Z" />
    <path d="M8.5 8h7m-7 4h7m-7 4h4" />
  </svg>
);

export const GraduationCap = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z" />
    <path d="M6.5 11.5v4.2c0 1 2.5 2.3 5.5 2.3s5.5-1.3 5.5-2.3v-4.2M21.5 9v5" />
  </svg>
);

export const Check = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const X = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const Plus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Menu = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const Sun = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5V5m0 14v2.5M4.6 4.6 6.4 6.4m11.2 11.2 1.8 1.8M2.5 12H5m14 0h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
  </svg>
);

export const Moon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
  </svg>
);

export const Lock = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

export const Unlock = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 7.8-1.2" />
  </svg>
);

export const ShieldCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2.5 4.5 5.4v6.1c0 4.6 3.2 8 7.5 9.9 4.3-1.9 7.5-5.3 7.5-9.9V5.4L12 2.5Z" />
    <path d="m8.8 11.8 2.3 2.3 4.2-4.6" />
  </svg>
);

export const Zap = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z" />
  </svg>
);

export const Bell = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 9.5a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
    <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const Search = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.4-4.4" />
  </svg>
);

export const Settings = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h0a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h0a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v0a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
  </svg>
);

export const Play = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 4.8v14.4a.6.6 0 0 0 .92.5l11.1-7.2a.6.6 0 0 0 0-1L7.92 4.3a.6.6 0 0 0-.92.5Z" />
  </svg>
);

export const Pause = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 5.5v13m8-13v13" />
  </svg>
);

export const StopCircle = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
  </svg>
);

export const AlertTriangle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10.3 4.2 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4.5m0 3.2v.1" />
  </svg>
);

export const Info = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5m0-8.2v-.1" />
  </svg>
);

export const Sparkles = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4.5 13.6 9l4.4 1.5-4.4 1.5L12 16.5 10.4 12 6 10.5 10.4 9 12 4.5Z" />
    <path d="M19 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2ZM5 3.5l.6 1.6 1.6.6-1.6.6L5 7.9l-.6-1.6-1.6-.6 1.6-.6L5 3.5Z" />
  </svg>
);

export const Target = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.75" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const Clock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Link2 = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 12h6m-8.5 3.5h-1a3.5 3.5 0 0 1 0-7h3m7 7h1a3.5 3.5 0 0 0 0-7h-3" transform="rotate(0 12 12)" />
  </svg>
);

export const Filter = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 6h16m-13 6h10m-7 6h4" />
  </svg>
);

export const Flame = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21c3.9 0 6.5-2.4 6.5-6 0-2.5-1.3-4.6-2.8-6.3-.4 1-1 1.9-1.9 2.4.2-2.7-1-6-3.8-7.6.2 2.3-.6 3.9-2 5.4-1.4 1.6-2.5 3.4-2.5 6 0 3.7 2.6 6.1 6.5 6.1Z" />
  </svg>
);

export const Scale = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4v16m-6.5 0h13M6 7l6-1.5L18 7M6 7l-2.5 6a3 3 0 0 0 5 0L6 7Zm12 0-2.5 6a3 3 0 0 0 5 0L18 7Z" />
  </svg>
);

export const Layers = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5Z" />
    <path d="m3.5 12.5 8.5 4.5 8.5-4.5m-17 4.5L12 21.5l8.5-4.5" />
  </svg>
);

export const Wallet = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
    <path d="M15 12.5h5v3h-5a1.5 1.5 0 0 1 0-3Z" />
  </svg>
);

export const CreditCard = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M3.5 10h17M7 15h4" />
  </svg>
);

export const LogOut = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2m-5-6h11m0 0-3-3m3 3-3 3" />
  </svg>
);

export const User = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.75" />
    <path d="M5 20c.8-3.2 3.6-5 7-5s6.2 1.8 7 5" />
  </svg>
);

export const Eye = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.75 12 5.75 21.5 12 21.5 12 18 18.25 12 18.25 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.75" />
  </svg>
);

export const EyeOff = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 4.5 20 19.5M9.9 6.1A8.9 8.9 0 0 1 12 5.75c6 0 9.5 6.25 9.5 6.25a16.6 16.6 0 0 1-2.8 3.5m-2.6 1.9A9 9 0 0 1 12 18.25C6 18.25 2.5 12 2.5 12a16.4 16.4 0 0 1 4-4.4" />
    <path d="M10 10.2a2.75 2.75 0 0 0 3.9 3.9" />
  </svg>
);
