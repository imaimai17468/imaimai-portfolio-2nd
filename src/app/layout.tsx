import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AiWidget } from "@/components/shared/ai-widget/AiWidget";
import { ConsentBanner } from "@/components/shared/consent-banner/ConsentBanner";
import { Header } from "@/components/shared/header/Header";
import { KonamiCode } from "@/components/shared/konami-code/KonamiCode";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  metadataBase: new URL("https://imaim.ai"),
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
    url: "https://imaim.ai",
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
          <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
            <Header />
            <main className="flex-1">{children}</main>
            <footer>
              <AiWidget />
              <ConsentBanner />
            </footer>
          </div>
        </ThemeProvider>
        <KonamiCode />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
      </body>
    </html>
  );
}
