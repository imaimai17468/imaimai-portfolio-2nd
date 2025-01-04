import type { Metadata } from "next";
import "./globals.css";
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
  title: "Imaimai Portfolio",
  description: "クリエイティブなポートフォリオサイト | インタラクティブなUIとアニメーションで彩られた作品集",
  keywords: [
    "portfolio",
    "web development",
    "creative",
    "interactive",
    "UI/UX",
    "animation",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Imaimai" }],
  creator: "Imaimai",
  publisher: "Imaimai",
  robots: "index, follow",
  openGraph: {
    title: "Imaimai Portfolio",
    description: "クリエイティブなポートフォリオサイト | インタラクティブなUIとアニメーションで彩られた作品集",
    url: "https://imaimai.tech",
    siteName: "Imaimai Portfolio",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imaimai Portfolio",
    description: "クリエイティブなポートフォリオサイト | インタラクティブなUIとアニメーションで彩られた作品集",
    creator: "@imaimai_dev",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
