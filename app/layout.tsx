import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/CartProvider";
import { ChatButton } from "@/components/ChatButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { store } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: store.name, template: `%s | ${store.name}` },
  description: store.description,
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/rubik.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
          <ChatButton />
        </CartProvider>
      </body>
    </html>
  );
}
