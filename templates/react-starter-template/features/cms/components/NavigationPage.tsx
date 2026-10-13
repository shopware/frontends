import {
  CmsPage,
  buildListingQueryParams,
  hasListingQuery,
} from "@shopware/cms-base-layer-react";
import type { ListingSearchParams } from "@shopware/cms-base-layer-react";
import { getProductListingFromCmsPage } from "@shopware/helpers";

import type { Schemas } from "#shopware";
import { toBreadcrumbItems } from "@/features/navigation/breadcrumbs";
import { Breadcrumbs } from "@/features/navigation/components/Breadcrumbs";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { readCategoryNavigation } from "@/platform/cms/categoryNavigation";
import { createStorefrontCmsContext } from "@/platform/cms/context";
import { getSiteUrl } from "@/platform/seo/siteUrl";
import { notFoundOn404 } from "@/platform/shopware/errors";
import { readBreadcrumbOrNothing } from "@/platform/shopware/reads/breadcrumb";
import { readCategory } from "@/platform/shopware/reads/category";
import { resolveContentLanguage } from "@/platform/shopware/reads/languages";
import { readProductListing } from "@/platform/shopware/reads/productListing";

export type NavigationPageProps = {
  navigationId: string;
  searchParams: ListingSearchParams;
  locale: Locale;
  languageId: string | null;
  isHome?: boolean;
};

export async function NavigationPage({
  navigationId,
  searchParams,
  locale,
  languageId,
  isHome = false,
}: NavigationPageProps) {
  const category = await readCategory(navigationId, languageId).catch(
    notFoundOn404,
  );
  const cmsPage = category.cmsPage;

  const cmsListing = cmsPage
    ? getProductListingFromCmsPage<Schemas["ProductListingResult"]>(cmsPage)
    : null;
  const needsListing = cmsListing !== null && hasListingQuery(searchParams);

  const [navigation, listing, breadcrumbs, { contentLang }] = await Promise.all(
    [
      readCategoryNavigation(
        cmsPage,
        isHome ? "main-navigation" : navigationId,
        languageId,
      ),
      needsListing
        ? readProductListing(
            navigationId,
            buildListingQueryParams(searchParams, {
              limit: cmsListing.limit,
              order: cmsListing.sorting,
            }),
            languageId,
          )
        : undefined,
      isHome
        ? []
        : readBreadcrumbOrNothing(navigationId, "category", languageId),
      resolveContentLanguage(locale),
    ],
  );

  const ctx = await createStorefrontCmsContext({
    locale,
    languageId,
    routeName: "frontend.navigation.page",
    foreignKey: navigationId,
    category,
    navigation,
    listing,
  });

  const trail = (
    <Breadcrumbs
      items={toBreadcrumbItems(breadcrumbs, locale)}
      locale={locale}
      contentLang={contentLang}
      siteUrl={getSiteUrl()}
    />
  );

  if (!cmsPage) {
    return (
      <>
        {trail}
        <p className="mx-auto w-full max-w-screen-2xl px-4 py-8 text-surface-on-surface-variant">
          {getTranslator(locale)("cms.noLayout.category")}
        </p>
      </>
    );
  }

  return (
    <>
      {trail}
      <div className="text-lg">
        <CmsPage content={cmsPage} ctx={ctx} />
      </div>
    </>
  );
}
