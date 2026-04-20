import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VITALITY — Planet-first daily impact",
  description: "Track commute, hydration, and travel. See your Earth score and recovery plan.",
  applicationName: "VITALITY",
};

export const viewport: Viewport = {
  themeColor: "#F7FFF7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={lexend.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
