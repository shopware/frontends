import type { ReactNode } from "react";

import { Footer } from "@/features/layout/components/Footer";
import { Header } from "@/features/layout/components/Header";
import { getTranslator, localeFromParams } from "@/i18n/server";

export default async function ShopLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const locale = await localeFromParams(params);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header locale={locale} />
      <main
        className="flex-1"
        aria-label={getTranslator(locale)("layout.ariaLabels.mainContent")}
      >
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
