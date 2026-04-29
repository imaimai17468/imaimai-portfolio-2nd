import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "imaimai17468 — Portfolio",
  description: "Front-end Developer / Product Engineer @ Accenture",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={`dark ${jetbrainsMono.variable}`}>
      <body className="font-mono bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
