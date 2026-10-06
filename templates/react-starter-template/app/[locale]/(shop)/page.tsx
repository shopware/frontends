import { connection } from "next/server";
import { Suspense } from "react";

import { NavigationPage } from "@/features/cms/components/NavigationPage";
import { PageSkeleton } from "@/features/cms/components/PageSkeleton";
import { localeFromParams } from "@/i18n/server";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

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
