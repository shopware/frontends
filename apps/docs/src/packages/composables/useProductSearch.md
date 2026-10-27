# useProductSearch

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#navigation--routing"><div class="bg-red">Navigation & Routing</div></a>
</div>

Composable for product search.





## Types


```ts
export function useProductSearch(): UseProductSearchReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductSearch/useProductSearch.ts#L33" target="_blank">source code</a>



```ts
export type UseProductSearchReturn = {
  /**
   * Searches for a product by its id
   * @param productId
   * @param options - optional parameters accepts `withCmsAssociations` flag to fetch cms-related associations and criteria
   * @returns {Promise<Schemas['ProductDetailResponse']>}
   */
  search: (
    productId: string,
    options?: UseProductSearchReturnOptions,
  ) => Promise<Schemas["ProductDetailResponse"]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductSearch/useProductSearch.ts#L15" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
