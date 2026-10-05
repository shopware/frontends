import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { StorefrontProviders } from "@/features/storefront/components/StorefrontProviders";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Shopware Frontends Demo Store",
    template: "%s | Shopware Frontends Demo Store",
  },
  description: "A Next.js storefront template for Shopware 6.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface-background font-sans text-surface-on-background antialiased">
        <StorefrontProviders>{children}</StorefrontProviders>
      </body>
    </html>
  );
}
