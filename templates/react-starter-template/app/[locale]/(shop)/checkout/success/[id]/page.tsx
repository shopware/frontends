import type { Metadata } from "next";
import { Suspense } from "react";

import { SuccessPageContent } from "@/features/checkout/components/SuccessPageContent";
import { SuccessSkeleton } from "@/features/checkout/components/SuccessSkeleton";
import { getTranslator, localeFromParams } from "@/i18n/server";

type CheckoutSuccessPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutSuccessPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("checkout.success.pageTitle") };
}

export default function CheckoutSuccessPage({
  params,
}: CheckoutSuccessPageProps) {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessPageContent params={params} />
    </Suspense>
  );
}
