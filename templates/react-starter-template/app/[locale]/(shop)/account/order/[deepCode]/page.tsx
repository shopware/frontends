import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { DeepLinkOrderPageContent } from "@/features/account/orders/components/DeepLinkOrderPageContent";
import { OrderDetailSkeleton } from "@/features/account/orders/components/OrderDetailSkeleton";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { loadShopSettings } from "@/platform/shopware/loadShopSettings";

type DeepLinkOrderPageProps = {
  params: Promise<{ locale: string; deepCode: string }>;
};

export async function generateMetadata({
  params,
}: DeepLinkOrderPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return {
    title: t("account.order.order"),
    robots: { index: false, follow: false },
  };
}

async function DeepLinkOrderSection({ params }: DeepLinkOrderPageProps) {
  await connection();
  const { cart } = await loadShopSettings();
  return (
    <DeepLinkOrderPageContent
      params={params}
      orderRefundsEnabled={cart.enableOrderRefunds}
    />
  );
}

export default function DeepLinkOrderPage({ params }: DeepLinkOrderPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto my-8 w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <OrderDetailSkeleton />
        </div>
      }
    >
      <DeepLinkOrderSection params={params} />
    </Suspense>
  );
}
