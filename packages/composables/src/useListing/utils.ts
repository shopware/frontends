import type { getListingFilters } from "@shopware/helpers";
import type { ComputedRef } from "vue";
import type { Schemas, operations } from "#shopware";

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

export type ListingType = "productSearchListing" | "categoryListing";

export type ShortcutFilterParam<
  T extends
    keyof Schemas["ProductListingCriteria"] = keyof Schemas["ProductListingCriteria"],
> = {
  code: T;
  value: Schemas["ProductListingCriteria"][T];
};

export type UseListingReturn = {
  /**
   * Listing that is currently set
   * {@link ListingResult} object
   */
  getInitialListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  /**
   * Sets the initial listing - available synchronously
   * @param {@link initialListing} - initial listing to set
   * @returns
   */
  setInitialListing(
    initialListing: Schemas["ProductListingResult"],
  ): Promise<void>;
  /**
   * @deprecated - use `search` instead
   * Searches for the listing based on the criteria
   * @param criteria {@link Schemas['Criteria']}
   * @returns
   */
  initSearch(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<Schemas["ProductListingResult"]>;
  /**
   * Searches for the listing based on the criteria
   * @param criteria
   * @returns
   */
  search(
    criteria:
      | operations["readProductListing post /product-listing/{categoryId}"]["body"]
      | operations["searchPage post /search"]["body"],
  ): Promise<void>;
  /**
   * Loads more (next page) elements to the listing
   */
  loadMore(
    criteria?: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  /**
   * Listing that is currently set
   */
  getCurrentListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  /**
   * Listing elements ({@link Product}) that are currently set
   */
  getElements: ComputedRef<Schemas["ProductListingResult"]["elements"]>;
  /**
   * Available sorting orders
   */
  getSortingOrders: ComputedRef<
    Schemas["ProductSorting"][] | { key: string; label: string }[] | undefined
  >;
  /**
   * Current sorting order
   */
  getCurrentSortingOrder: ComputedRef<string | undefined>;
  /**
   * Changes the current sorting order
   * @param order - i.e. "name-asc"
   * @returns
   */
  changeCurrentSortingOrder(
    order: string,
    query?: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  /**
   * Current page number
   */
  getCurrentPage: ComputedRef<number>;
  /**
   * Changes the current page number
   * @param pageNumber - page number to change to
   * @returns
   */
  changeCurrentPage(
    page: number,
    query?: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  /**
   * Total number of elements found for the current search criteria
   */
  getTotal: ComputedRef<number>;
  /**
   * Total number of pages found for the current search criteria
   */
  getTotalPagesCount: ComputedRef<number>;
  /**
   * Number of elements per page
   */
  getLimit: ComputedRef<number>;
  /**
   * Initial filters
   */
  getInitialFilters: ComputedRef<ReturnType<typeof getListingFilters>>;
  /**
   * All available filters
   */
  getAvailableFilters: ComputedRef<ReturnType<typeof getListingFilters>>;
  /**
   * Filters that are currently set
   */
  getCurrentFilters: ComputedRef<
    Schemas["ProductListingResult"]["currentFilters"]
  >;
  /**
   * Sets the filters to be applied for the listing
   * @param filters
   * @returns
   */
  setCurrentFilters(filters: ShortcutFilterParam[]): Promise<void>;
  /**
   * Indicates if the listing is being fetched
   */
  loading: ComputedRef<boolean>;
  /**
   * Indicates if the listing is being fetched via `loadMore` method
   */
  loadingMore: ComputedRef<boolean>;
  /**
   * Resets the filters - clears the current filters
   */
  resetFilters(): Promise<void>;
  /**
   * Change selected filters to the query object
   */
  filtersToQuery(
    filters: Schemas["ProductListingCriteria"],
  ): Record<string, unknown>;
};
