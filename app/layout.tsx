import type { Metadata, Viewport } from "next";
import { Geist, DM_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "RouteFlow — Optimización de Rutas Logísticas",
  description:
    "Plataforma B2B de optimización de rutas para coordinadores logísticos de PyMEs latinoamericanas.",
};

export const viewport: Viewport = {
  themeColor: "#0d0f14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${dmMono.variable} bg-bg-base h-full antialiased`}
    >
      <body className="min-h-full font-sans text-text-primary">{children}</body>
    </html>
  );
}
