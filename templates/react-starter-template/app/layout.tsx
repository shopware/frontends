import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shopware Frontends React Starter",
  description: "A Next.js storefront template for Shopware 6.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface-background font-sans text-surface-on-background antialiased">
        {children}
      </body>
    </html>
  );
}
