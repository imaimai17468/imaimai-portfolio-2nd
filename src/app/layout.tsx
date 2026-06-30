import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AiWidget } from "@/components/shared/ai-widget/AiWidget";
import { ConsentBanner } from "@/components/shared/consent-banner/ConsentBanner";
import { Header } from "@/components/shared/header/Header";
import { PageTracker } from "@/components/shared/page-tracker/PageTracker";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  metadataBase: new URL("https://imaimai.tech"),
  title: "imaimai17468's Portfolio",
  description:
    "imaimai17468のポートフォリオサイト | クリエイティブなWeb開発者として、技術とデザインで新しい体験を創造します",
  keywords: [
    "imaimai17468",
    "portfolio",
    "web development",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "imaimai17468" }],
  creator: "imaimai17468",
  publisher: "imaimai17468",
  robots: "index, follow",
  openGraph: {
    title: "imaimai17468's Portfolio",
    description:
      "imaimai17468のポートフォリオサイト | フロントエンドエンジニアとして、常に自分を示し続けます",
    url: "https://imaimai.tech",
    siteName: "imaimai17468's Portfolio",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "imaimai17468's Portfolio",
    description:
      "imaimai17468のポートフォリオサイト | フロントエンドエンジニアとして、常に自分を示し続けます",
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
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="max-w-2xl mx-auto">
            <Header />
            <main>{children}</main>
          </div>
          <PageTracker />
          <AiWidget />
          <ConsentBanner />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
