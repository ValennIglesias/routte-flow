import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={`${geistSans.variable} bg-bg-base h-full antialiased`}
    >
      <body className="min-h-full font-sans text-text-primary">{children}</body>
    </html>
  );
}
