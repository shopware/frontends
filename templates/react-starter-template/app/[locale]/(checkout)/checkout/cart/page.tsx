import type { Metadata } from "next";

import { CartPageContent } from "@/features/cart/components/CartPageContent";
import { getTranslator, localeFromParams } from "@/i18n/server";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CartPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("cart.title") };
}

export default function CartPage() {
  return <CartPageContent />;
}
