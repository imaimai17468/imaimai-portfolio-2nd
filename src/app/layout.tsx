import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NextPageLink } from "@/components/shared/next-page-link/NextPageLink";

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
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen max-w-2xl mx-auto flex flex-col">
          <div className="flex-1">{children}</div>
          <NextPageLink />
        </div>
      </body>
    </html>
  );
}
