import type { Metadata } from "next";

import { OrdersPageContent } from "@/features/account/orders/components/OrdersPageContent";
import { getTranslator, localeFromParams } from "@/i18n/server";

export const instant = false;

type AccountOrdersPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AccountOrdersPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.order.header") };
}

export default function AccountOrdersPage() {
  return <OrdersPageContent />;
}
