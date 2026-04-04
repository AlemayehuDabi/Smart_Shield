import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Shield — AI trading terminal",
  description:
    "Real-time trading with an AI co-pilot that learns your behavior, explains outcomes, and tightens discipline before you click.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans min-h-full flex flex-col">
        <ThemeProvider>
          <AuthBootstrap />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
