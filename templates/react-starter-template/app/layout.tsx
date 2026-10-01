import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import type { ReactNode } from "react";

import { MainNavigation } from "@/features/navigation/components/MainNavigation";
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
        <StorefrontProviders>
          <header className="border-b border-outline-outline-variant bg-surface-surface">
            <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:gap-10">
              <Link
                href="/"
                className="text-lg font-bold tracking-tight text-brand-primary"
              >
                Shopware Frontends
              </Link>
              <Suspense
                fallback={
                  <div className="h-5 w-64 animate-pulse rounded bg-surface-surface-container" />
                }
              >
                <MainNavigation />
              </Suspense>
            </div>
          </header>
          <main className="min-h-dvh">{children}</main>
        </StorefrontProviders>
      </body>
    </html>
  );
}
