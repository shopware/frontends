# useListing

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#product"><div class="bg-red">Product</div></a>
</div>







## Types


```ts
export function useListing(params?: {
  listingType: ListingType;
  categoryId?: string;
  defaultSearchCriteria?: operations["searchPage post /search"]["body"];
  initialListing?: Schemas["ProductListingResult"] | null;
}): UseListingReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useListing/useListing.ts#L185" target="_blank">source code</a>

```ts
export function createListingComposable({
  searchMethod,
  searchDefaults,
  listingKey,
  initialListing,
}: {
  searchMethod(
    searchParams:
      | operations["readProductListing post /product-listing/{categoryId}"]["body"]
      | operations["searchPage post /search"]["body"],
  ): Promise<Schemas["ProductListingResult"]>;
  searchDefaults: operations["searchPage post /search"]["body"];
  listingKey: string;
  initialListing?: Schemas["ProductListingResult"] | null;
}): UseListingReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useListing/useListing.ts#L299" target="_blank">source code</a>



```ts
export type ListingType = "productSearchListing" | "categoryListing";
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useListing/useListing.ts#L38" target="_blank">source code</a>

```ts
export type ShortcutFilterParam<
  T extends keyof Schemas["ProductListingCriteria"] =
    keyof Schemas["ProductListingCriteria"],
> = {
  code: T;
  value: Schemas["ProductListingCriteria"][T];
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useListing/useListing.ts#L40" target="_blank">source code</a>

```ts
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
    | Schemas["ProductListingResult"]["availableSortings"]
    | { key: string; label: string }[]
    | undefined
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
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useListing/useListing.ts#L48" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
