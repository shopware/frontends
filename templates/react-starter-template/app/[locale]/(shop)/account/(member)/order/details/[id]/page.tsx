import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderDetailSkeleton } from "@/features/account/orders/components/OrderDetailSkeleton";
import { OrderDetailsPageContent } from "@/features/account/orders/components/OrderDetailsPageContent";
import { getTranslator, localeFromParams } from "@/i18n/server";

export const instant = false;

type AccountOrderDetailsPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: AccountOrderDetailsPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.orderDetails.order") };
}

export default function AccountOrderDetailsPage({
  params,
}: AccountOrderDetailsPageProps) {
  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetailsPageContent params={params} />
    </Suspense>
  );
}
