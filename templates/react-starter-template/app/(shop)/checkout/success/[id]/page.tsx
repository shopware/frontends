import type { Metadata } from "next";
import { Suspense } from "react";

import { SuccessPageContent } from "@/features/checkout/components/SuccessPageContent";
import { SuccessSkeleton } from "@/features/checkout/components/SuccessSkeleton";

export const metadata: Metadata = {
  title: "Order confirmation",
};

type CheckoutSuccessPageProps = {
  params: Promise<{ id: string }>;
};

export default function CheckoutSuccessPage({
  params,
}: CheckoutSuccessPageProps) {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessPageContent params={params} />
    </Suspense>
  );
}
