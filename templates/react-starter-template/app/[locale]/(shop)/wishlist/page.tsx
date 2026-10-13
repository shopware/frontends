import type { Metadata } from "next";

import { WishlistPageContent } from "@/features/wishlist/components/WishlistPageContent";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { PRIVATE_PAGE_ROBOTS } from "@/platform/seo/robots";

type WishlistPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: WishlistPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("wishlist.header"), robots: PRIVATE_PAGE_ROBOTS };
}

export default function WishlistPage() {
  return <WishlistPageContent />;
}
