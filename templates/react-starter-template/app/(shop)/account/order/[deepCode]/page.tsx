import type { Metadata } from "next";
import { Suspense } from "react";

import { DeepLinkOrderPageContent } from "@/features/account/orders/components/DeepLinkOrderPageContent";
import { OrderDetailSkeleton } from "@/features/account/orders/components/OrderDetailSkeleton";

const t = {
  account: {
    order: {
      order: "Order",
    },
  },
};

export const metadata: Metadata = {
  title: t.account.order.order,
  robots: { index: false, follow: false },
};

type DeepLinkOrderPageProps = {
  params: Promise<{ deepCode: string }>;
};

export default function DeepLinkOrderPage({ params }: DeepLinkOrderPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto my-8 w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <OrderDetailSkeleton />
        </div>
      }
    >
      <DeepLinkOrderPageContent params={params} />
    </Suspense>
  );
}
