import {
  CmsPage,
  buildListingQueryParams,
  hasListingQuery,
} from "@shopware/cms-base-layer-react";
import type { ListingSearchParams } from "@shopware/cms-base-layer-react";
import { getProductListingFromCmsPage } from "@shopware/helpers";

import { createStorefrontCmsContext } from "@/platform/cms/context";
import { notFoundOn404 } from "@/platform/shopware/errors";
import { readCategory } from "@/platform/shopware/reads/category";
import { readNavigation } from "@/platform/shopware/reads/navigation";
import { readProductListing } from "@/platform/shopware/reads/productListing";

export type NavigationPageProps = {
  navigationId: string;
  searchParams: ListingSearchParams;
};

export async function NavigationPage({
  navigationId,
  searchParams,
}: NavigationPageProps) {
  const category = await readCategory(navigationId).catch(notFoundOn404);
  const cmsPage = category.cmsPage;

  const needsListing =
    !!cmsPage &&
    hasListingQuery(searchParams) &&
    getProductListingFromCmsPage(cmsPage) !== null;

  const [navigation, listing] = await Promise.all([
    readNavigation(navigationId, 2),
    needsListing
      ? readProductListing(navigationId, buildListingQueryParams(searchParams))
      : undefined,
  ]);

  const ctx = await createStorefrontCmsContext({
    routeName: "frontend.navigation.page",
    foreignKey: navigationId,
    category,
    navigation,
    listing,
  });

  if (!cmsPage) {
    return (
      <p className="mx-auto w-full max-w-screen-2xl px-4 py-8 text-surface-on-surface-variant">
        This category has no layout assigned.
      </p>
    );
  }

  return (
    <div className="text-lg">
      <CmsPage content={cmsPage} ctx={ctx} />
    </div>
  );
}
