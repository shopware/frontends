import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { CheckoutPageContent } from "@/features/checkout/components/CheckoutPageContent";
import { CheckoutSkeleton } from "@/features/checkout/components/CheckoutSkeleton";
import { readCountries } from "@/platform/shopware/reads/countries";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

export const metadata: Metadata = {
  title: "Checkout",
};

async function loadCountries(): Promise<{
  countries: CountryOption[];
  countriesUnavailable: boolean;
}> {
  try {
    return { countries: await readCountries(), countriesUnavailable: false };
  } catch (error) {
    console.error("[Checkout] reading countries failed", error);
    return { countries: [], countriesUnavailable: true };
  }
}

async function CheckoutSection() {
  await connection();
  const { countries, countriesUnavailable } = await loadCountries();

  return (
    <CheckoutPageContent
      countries={countries}
      countriesUnavailable={countriesUnavailable}
    />
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutSection />
    </Suspense>
  );
}
