import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { toCheckoutSettings } from "@/features/checkout/checkoutSettings";
import { CheckoutPageContent } from "@/features/checkout/components/CheckoutPageContent";
import { CheckoutSkeleton } from "@/features/checkout/components/CheckoutSkeleton";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";
import { loadShopSettings } from "@/platform/shopware/loadShopSettings";
import { LEGAL_LINKS } from "@/site/legalLinks";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("checkout.title") };
}

async function CheckoutSection({ params }: CheckoutPageProps) {
  await connection();
  const locale = await localeFromParams(params);
  const [{ countries, countriesUnavailable }, shopSettings] = await Promise.all(
    [loadCountryOptions(locale, "Checkout"), loadShopSettings()],
  );

  return (
    <CheckoutPageContent
      countries={countries}
      countriesUnavailable={countriesUnavailable}
      settings={toCheckoutSettings(shopSettings, LEGAL_LINKS)}
    />
  );
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutSection params={params} />
    </Suspense>
  );
}
