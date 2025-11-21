import type { ComputedRef } from "vue";
import type { Schemas, operations } from "#shopware";

export type ListingType = "productSearchListing" | "categoryListing";

export type ShortcutFilterParam<
  T extends
    keyof Schemas["ProductListingCriteria"] = keyof Schemas["ProductListingCriteria"],
> = {
  code: T;
  value: Schemas["ProductListingCriteria"][T];
};

export type UseListingReturn = {
  getInitialListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  setInitialListing(
    initialListing: Schemas["ProductListingResult"],
  ): Promise<void>;
  initSearch(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<Schemas["ProductListingResult"]>;
  search(
    criteria:
      | operations["readProductListing post /product-listing/{categoryId}"]["body"]
      | operations["searchPage post /search"]["body"],
  ): Promise<void>;
  loadMore(
    criteria?: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  getCurrentListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  getElements: ComputedRef<Schemas["ProductListingResult"]["elements"]>;
  getSortingOrders: ComputedRef<
    Schemas["ProductSorting"][] | { key: string; label: string }[] | undefined
  >;
  getCurrentSortingOrder: ComputedRef<string | undefined>;
  changeCurrentSortingOrder(
    order: string,
    query?: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  getCurrentPage: ComputedRef<number>;
  changeCurrentPage(
    page: number,
    query?: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  getTotal: ComputedRef<number>;
  getTotalPagesCount: ComputedRef<number>;
  getLimit: ComputedRef<number>;
  getInitialFilters: ComputedRef<
    ReturnType<typeof import("@shopware/helpers").getListingFilters>
  >;
  getAvailableFilters: ComputedRef<
    ReturnType<typeof import("@shopware/helpers").getListingFilters>
  >;
  getCurrentFilters: ComputedRef<
    Schemas["ProductListingResult"]["currentFilters"]
  >;
  setCurrentFilters(filters: ShortcutFilterParam[]): Promise<void>;
  loading: ComputedRef<boolean>;
  loadingMore: ComputedRef<boolean>;
  resetFilters(): Promise<void>;
  filtersToQuery(
    filters: Schemas["ProductListingCriteria"],
  ): Record<string, unknown>;
};

export function isObject<T>(item: T): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function merge<T extends { [key in keyof T]: unknown }>(
  target: T,
  ...sources: T[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (source === undefined) {
    return target;
  }

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...sources);
}
