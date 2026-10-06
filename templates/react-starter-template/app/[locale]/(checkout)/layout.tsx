import type { ReactNode } from "react";

import { CheckoutHeader } from "@/features/checkout/components/CheckoutHeader";
import { getTranslator, localeFromParams } from "@/i18n/server";

export default async function CheckoutLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const locale = await localeFromParams(params);

  return (
    <div className="flex min-h-dvh flex-col">
      <CheckoutHeader locale={locale} />
      <main
        className="mb-20 flex-1"
        aria-label={getTranslator(locale)("layout.ariaLabels.checkout")}
      >
        {children}
      </main>
    </div>
  );
}
