import type { Metadata } from "next";
import { Suspense } from "react";

import {
  PaymentResult,
  paymentResultTitle,
} from "@/features/checkout/components/PaymentResult";
import { UnpaidPaymentResult } from "@/features/checkout/components/UnpaidPaymentResult";

export const metadata: Metadata = {
  title: paymentResultTitle("unpaid"),
};

type CheckoutUnpaidPageProps = {
  params: Promise<{ id: string }>;
};

export default function CheckoutUnpaidPage({
  params,
}: CheckoutUnpaidPageProps) {
  return (
    <Suspense fallback={<PaymentResult status="unpaid" />}>
      <UnpaidPaymentResult params={params} />
    </Suspense>
  );
}
