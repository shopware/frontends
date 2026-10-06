import type { Metadata } from "next";
import { Suspense } from "react";

import { PaymentResult } from "@/features/checkout/components/PaymentResult";
import { UnpaidPaymentResult } from "@/features/checkout/components/UnpaidPaymentResult";
import { paymentResultTitle } from "@/features/checkout/paymentResult";
import { getTranslator, localeFromParams } from "@/i18n/server";

type CheckoutUnpaidPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutUnpaidPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: paymentResultTitle("unpaid", t) };
}

export default function CheckoutUnpaidPage({
  params,
}: CheckoutUnpaidPageProps) {
  return (
    <Suspense fallback={<PaymentResult status="unpaid" />}>
      <UnpaidPaymentResult params={params} />
    </Suspense>
  );
}
