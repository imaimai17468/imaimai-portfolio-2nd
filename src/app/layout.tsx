import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "imaimai17468",
  description: "Portfolio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
