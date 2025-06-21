import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const roboto = localFont({
  src: [
    {
      path: "../fonts/roboto/Roboto-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/roboto/Roboto-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/roboto/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/roboto/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roboto",
});

const raleway = localFont({
  src: "../fonts/Raleway-Black.ttf",
  variable: "--font-raleway",
});

const nakamori = localFont({
  src: "../fonts/Nakamori.ttf",
  variable: "--font-nakamori",
});

const cinecaption = localFont({
  src: "../fonts/cinecaption.ttf",
  variable: "--font-cinecaption",
});

export const metadata: Metadata = {
  title: "imaimai17468's Portfolio",
  description:
    "imaimai17468のポートフォリオサイト | クリエイティブなWeb開発者として、技術とデザインで新しい体験を創造します",
  keywords: [
    "imaimai17468",
    "portfolio",
    "web development",
    "creative coding",
    "interactive",
    "UI/UX",
    "animation",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "imaimai17468" }],
  creator: "imaimai17468",
  publisher: "imaimai17468",
  robots: "index, follow",
  openGraph: {
    title: "imaimai17468's Portfolio 2nd",
    description: "imaimai17468のポートフォリオサイト | フロントエンドエンジニアとして、常に自分を示し続けます",
    url: "https://imaimai.tech",
    siteName: "imaimai17468's Portfolio",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "imaimai17468's Portfolio 2nd",
    description: "imaimai17468のポートフォリオサイト | フロントエンドエンジニアとして、常に自分を示し続けます",
    creator: "@imaimai17468",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${raleway.variable} ${nakamori.variable} ${cinecaption.variable} font-roboto`}
    >
      <body className="dark">
        <NuqsAdapter>
          <MainLayout>{children}</MainLayout>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
