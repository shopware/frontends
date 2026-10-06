import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderDetailSkeleton } from "@/features/account/orders/components/OrderDetailSkeleton";
import { OrderDetailsPageContent } from "@/features/account/orders/components/OrderDetailsPageContent";

export const instant = false;

const t = {
  account: {
    orderDetails: {
      order: "Order",
    },
  },
};

export const metadata: Metadata = {
  title: t.account.orderDetails.order,
};

type AccountOrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default function AccountOrderDetailsPage({
  params,
}: AccountOrderDetailsPageProps) {
  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetailsPageContent params={params} />
    </Suspense>
  );
}
