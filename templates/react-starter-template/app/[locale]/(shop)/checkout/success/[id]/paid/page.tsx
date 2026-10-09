import type { Metadata } from "next";

import { PaymentResult } from "@/features/checkout/components/PaymentResult";
import { paymentResultTitle } from "@/features/checkout/paymentResult";
import { getTranslator, localeFromParams } from "@/i18n/server";

type CheckoutPaidPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutPaidPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: paymentResultTitle("paid", t) };
}

export default function CheckoutPaidPage() {
  return <PaymentResult status="paid" href="/" />;
}
