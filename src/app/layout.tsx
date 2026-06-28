import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
