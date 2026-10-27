# useProductSearchSuggest

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#product"><div class="bg-red">Product</div></a>
</div>

Composable for product suggest search.





## Types


```ts
export function useProductSearchSuggest(): UseProductSearchSuggestReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductSearchSuggest/useProductSearchSuggest.ts#L45" target="_blank">source code</a>



```ts
export type UseProductSearchSuggestReturn = {
  /**
   * Current search term
   */
  searchTerm: Ref<string>;
  /**
   * Indicates if the search is in progress
   */
  loading: ComputedRef<boolean>;
  /**
   * Performs the search
   * @param additionalCriteria - additional search criteria of type {@link ShopwareSearchParams}
   * @returns
   */
  search(
    additionalCriteria?: Partial<operations["searchPage post /search"]["body"]>,
  ): Promise<void>;
  /**
   * Loads more products for current search criteria
   */
  loadMore(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  /**
   * Returns the product list found by the search
   */
  getProducts: ComputedRef<Schemas["ProductListingResult"]["elements"]>;
  /**
   * Returns the total number of products found by the search
   */
  getTotal: ComputedRef<number>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductSearchSuggest/useProductSearchSuggest.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
