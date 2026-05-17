import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sony WH-1000XM6 | Engineered to Perfection",
  description: "Experience the ultimate in noise-canceling technology with the new Sony WH-1000XM6.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
