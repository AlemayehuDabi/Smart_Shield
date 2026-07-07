import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smartshield.app"),
  title: {
    default: "Smart Shield — The AI that teaches you how to trade",
    template: "%s · Smart Shield",
  },
  description:
    "The AI that doesn't just tell you what to trade — it teaches you how to trade, then automates what you've mastered. Signals with plain-English reasoning, behavioral analytics, in-context education, and strategy automation.",
  openGraph: {
    title: "Smart Shield — Your 24/7 AI trading mentor",
    description:
      "Signals you understand. Analytics that coach you. Lessons at the exact moment they matter. Automation you've earned.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
