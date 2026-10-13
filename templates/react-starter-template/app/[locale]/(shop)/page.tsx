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
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  await connection();
  const locale = await localeFromParams(params);
  try {
    return await buildHomeMetadata({
      locale,
      languageId: await resolveLanguageId(locale),
    });
  } catch {
    return {};
  }
}

async function HomeContent({ params }: HomePageProps) {
  await connection();
  const locale = await localeFromParams(params);
  const languageId = await resolveLanguageId(locale);
  const context = await readSalesChannelContext(languageId);
  return (
    <NavigationPage
      navigationId={context.salesChannel.navigationCategoryId}
      searchParams={{}}
      locale={locale}
      languageId={languageId}
      isHome
    />
  );
}

export default function HomePage({ params }: HomePageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomeContent params={params} />
    </Suspense>
  );
}
