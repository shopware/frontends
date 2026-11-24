import type { Metadata } from "next";

import { PaymentResult } from "@/features/checkout/components/PaymentResult";
import { paymentResultTitle } from "@/features/checkout/paymentResult";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { PRIVATE_PAGE_ROBOTS } from "@/platform/seo/robots";

type CheckoutPaidPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutPaidPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: paymentResultTitle("paid", t), robots: PRIVATE_PAGE_ROBOTS };
}

export default function CheckoutPaidPage() {
  return <PaymentResult status="paid" href="/" />;
}
