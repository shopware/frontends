import type { ListingSearchParams } from "@shopware/cms-base-layer-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { PageSkeleton } from "@/features/cms/components/PageSkeleton";
import { SearchResults } from "@/features/search/components/SearchResults";
import { normalizeSearchTerm } from "@/features/search/searchTerm";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { PRIVATE_PAGE_ROBOTS } from "@/platform/seo/robots";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";

type SearchPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ListingSearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const [locale, query] = await Promise.all([
    localeFromParams(params),
    searchParams,
  ]);
  const t = getTranslator(locale);
  const term = normalizeSearchTerm(query.search);
  return {
    title: term ? t("search.metaTitle", { term }) : t("breadcrumbs.search"),
    robots: PRIVATE_PAGE_ROBOTS,
  };
}

async function SearchContent({ params, searchParams }: SearchPageProps) {
  const [locale, query] = await Promise.all([
    localeFromParams(params),
    searchParams,
  ]);
  const languageId = await resolveLanguageId(locale);
  return (
    <SearchResults
      searchParams={query}
      locale={locale}
      languageId={languageId}
    />
  );
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SearchContent {...props} />
    </Suspense>
  );
}
