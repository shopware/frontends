import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { StorefrontProviders } from "@/features/storefront/components/StorefrontProviders";
import { locales } from "@/i18n/config";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getMessagesFor, getTranslator, localeFromParams } from "@/i18n/server";

import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return {
    title: {
      default: "Shopware Frontends Demo Store",
      template: "%s | Shopware Frontends Demo Store",
    },
    description: t("meta.description"),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const locale = await localeFromParams(params);

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-surface-background font-sans text-surface-on-background antialiased">
        <I18nProvider locale={locale} messages={getMessagesFor(locale)}>
          <StorefrontProviders>{children}</StorefrontProviders>
        </I18nProvider>
      </body>
    </html>
  );
}
