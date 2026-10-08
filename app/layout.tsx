import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YŌTA Candles — Light up your moments",
  description: "Hand-poured scented candles, made to make home feel like yours.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
