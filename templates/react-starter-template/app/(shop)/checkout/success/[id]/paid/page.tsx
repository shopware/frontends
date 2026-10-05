import type { Metadata } from "next";

import {
  PaymentResult,
  paymentResultTitle,
} from "@/features/checkout/components/PaymentResult";

export const metadata: Metadata = {
  title: paymentResultTitle("paid"),
};

export default function CheckoutPaidPage() {
  return <PaymentResult status="paid" href="/" />;
}
