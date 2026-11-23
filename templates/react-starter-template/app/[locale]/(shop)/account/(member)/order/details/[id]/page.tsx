import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { OrderDetailSkeleton } from "@/features/account/orders/components/OrderDetailSkeleton";
import { OrderDetailsPageContent } from "@/features/account/orders/components/OrderDetailsPageContent";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { loadShopSettings } from "@/platform/shopware/loadShopSettings";

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

async function OrderDetailsSection({ params }: AccountOrderDetailsPageProps) {
  await connection();
  const { cart } = await loadShopSettings();
  return (
    <OrderDetailsPageContent
      params={params}
      orderRefundsEnabled={cart.enableOrderRefunds}
    />
  );
}

export default function AccountOrderDetailsPage({
  params,
}: AccountOrderDetailsPageProps) {
  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetailsSection params={params} />
    </Suspense>
  );
}
