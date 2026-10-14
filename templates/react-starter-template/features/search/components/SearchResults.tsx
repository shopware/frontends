import {
  CmsElementProductListingResults,
  LISTING_DEFAULTS,
  SwProductCard,
  getClientListingFilters,
  hasActiveFilters,
  parseListingFilters,
} from "@shopware/cms-base-layer-react";
import type { ListingSearchParams } from "@shopware/cms-base-layer-react";
import { SwProductListingFilters } from "@shopware/cms-base-layer-react/client";

import { Breadcrumbs } from "@/features/navigation/components/Breadcrumbs";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { createStorefrontCmsContext } from "@/platform/cms/context";
import { notFoundOn404 } from "@/platform/shopware/errors";
import { readProductSearch } from "@/platform/shopware/reads/productSearch";

import { buildSearchListingQuery } from "../searchListingQuery";
import { normalizeSearchTerm } from "../searchTerm";

export type SearchResultsProps = {
  searchParams: ListingSearchParams;
  locale: Locale;
  languageId: string | null;
};

const CONTAINER_CLASS = "mx-auto mb-8 w-full max-w-screen-2xl px-4";

const HEADING_CLASS = "mt-8 mb-8 text-center text-3xl lg:mt-0";

export async function SearchResults({
  searchParams,
  locale,
  languageId,
}: SearchResultsProps) {
  const t = getTranslator(locale);
  const term = normalizeSearchTerm(searchParams.search);
  const trail = (
    <Breadcrumbs
      items={[{ key: "search", name: t("breadcrumbs.search") }]}
      locale={locale}
      siteUrl={null}
    />
  );

  if (!term) {
    return (
      <>
        {trail}
        <div data-testid="search-results-container" className={CONTAINER_CLASS}>
          <h1 className={HEADING_CLASS}>{t("breadcrumbs.search")}</h1>
          <p className="text-center text-surface-on-surface-variant">
            {t("search.emptyTerm")}
          </p>
        </div>
      </>
    );
  }

  const { query, categoryIds } = buildSearchListingQuery(searchParams);
  const [listing, ctx] = await Promise.all([
    readProductSearch(term, query, categoryIds, languageId).catch(
      notFoundOn404,
    ),
    createStorefrontCmsContext({ locale, languageId, isProductSearch: true }),
  ]);

  const elements = listing.elements ?? [];
  const total = listing.total ?? 0;
  const limit = listing.limit || LISTING_DEFAULTS.limit;
  const current = listing.page || LISTING_DEFAULTS.page;
  const filtersActive = hasActiveFilters(parseListingFilters(searchParams), {
    isProductSearch: true,
  });

  return (
    <>
      {trail}
      <div data-testid="search-results-container" className={CONTAINER_CLASS}>
        <h1 className={HEADING_CLASS}>
          {total > 0 ? (
            <>
              {t("search.resultsHeader")} &quot;<strong>{term}</strong>&quot;
            </>
          ) : (
            t("search.noResults")
          )}
        </h1>
        {total > 0 || filtersActive ? (
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
            <aside
              aria-label={t("listing.filters")}
              className="w-full shrink-0 lg:w-72 xl:w-80"
            >
              <SwProductListingFilters
                filters={getClientListingFilters(listing.aggregations)}
                sortOptions={listing.availableSortings ?? []}
                currentSort={listing.sorting ?? ""}
                isProductSearch
                rootCategoryId={ctx.navigationCategoryId}
                translations={ctx.translations}
              />
            </aside>
            <div className="min-w-0 flex-1">
              {total > 0 ? (
                <CmsElementProductListingResults
                  productCount={elements.length}
                  limit={limit}
                  total={Math.ceil(total / limit)}
                  current={current}
                  placeholderColor={ctx.config.imagePlaceholder.color}
                  isProductSearch
                  translations={ctx.translations}
                >
                  {elements.map((product) => (
                    <SwProductCard
                      key={product.id}
                      product={product}
                      ctx={ctx}
                      className="w-full"
                    />
                  ))}
                </CmsElementProductListingResults>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
