import type { ListingSearchParams } from "@shopware/cms-base-layer-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { NavigationPage } from "@/features/cms/components/NavigationPage";
import { PageSkeleton } from "@/features/cms/components/PageSkeleton";
import { localeFromParams } from "@/i18n/server";
import { buildHomeMetadata } from "@/platform/seo/routeMetadata";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ListingSearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: HomePageProps): Promise<Metadata> {
  await connection();
  const [locale, query] = await Promise.all([
    localeFromParams(params),
    searchParams,
  ]);
  try {
    return await buildHomeMetadata({
      locale,
      languageId: await resolveLanguageId(locale),
      page: query.p,
    });
  } catch {
    return {};
  }
}

async function HomeContent({ params, searchParams }: HomePageProps) {
  await connection();
  const [locale, query] = await Promise.all([
    localeFromParams(params),
    searchParams,
  ]);
  const languageId = await resolveLanguageId(locale);
  const context = await readSalesChannelContext(languageId);
  return (
    <NavigationPage
      navigationId={context.salesChannel.navigationCategoryId}
      searchParams={query}
      locale={locale}
      languageId={languageId}
      isHome
    />
  );
}

export default function HomePage(props: HomePageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomeContent {...props} />
    </Suspense>
  );
}
