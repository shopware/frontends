import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { CheckoutPageContent } from "@/features/checkout/components/CheckoutPageContent";
import { CheckoutSkeleton } from "@/features/checkout/components/CheckoutSkeleton";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";

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
  const { countries, countriesUnavailable } = await loadCountryOptions(
    await localeFromParams(params),
    "Checkout",
  );

  return (
    <CheckoutPageContent
      countries={countries}
      countriesUnavailable={countriesUnavailable}
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
