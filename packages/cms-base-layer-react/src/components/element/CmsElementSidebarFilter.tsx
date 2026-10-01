import type { CmsComponentProps } from "../../registry";
import type { CmsElementSidebarFilter as CmsElementSidebarFilterContent } from "../../types";
import { SwProductListingFilters } from "../shared/SwProductListingFilters";
import { SwProductListingFiltersHorizontal } from "../shared/SwProductListingFiltersHorizontal";
import { getClientListingFilters } from "./clientListingFilters";

export function CmsElementSidebarFilter({
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementSidebarFilterContent>) {
  const listing = ctx.listing;
  const isInSidebar = ctx.sectionLayout === "sidebar";
  const filterProps = {
    filters: getClientListingFilters(listing?.aggregations),
    sortOptions: listing?.availableSortings ?? [],
    currentSort: listing?.sorting ?? "",
    isProductSearch: ctx.isProductSearch,
    translations: ctx.translations,
    rootCategoryId: ctx.navigationCategoryId,
  };

  return (
    <div className={className} style={style}>
      {isInSidebar ? (
        <SwProductListingFilters {...filterProps} />
      ) : (
        <SwProductListingFiltersHorizontal {...filterProps} />
      )}
    </div>
  );
}
