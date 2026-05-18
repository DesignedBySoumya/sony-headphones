import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Sony WH-1000XM6 | The Sound of Silence",
  description:
    "Experience the next-generation noise cancellation. The Sony WH-1000XM6 — engineered for those who demand silence in a world that never stops.",
  keywords: ["Sony WH-1000XM6", "noise cancelling headphones", "Sony headphones", "premium audio"],
  openGraph: {
    title: "Sony WH-1000XM6 | The Sound of Silence",
    description: "Next-generation noise cancellation. Engineered for those who demand perfection.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-[#050505]">{children}</body>
    </html>
  );
}
