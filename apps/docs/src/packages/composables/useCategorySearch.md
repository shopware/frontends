# useCategorySearch

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#navigation--routing"><div class="bg-red">Navigation & Routing</div></a>
</div>

Composable for category search.





## Types


```ts
export function useCategorySearch(): UseCategorySearchReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCategorySearch/useCategorySearch.ts#L39" target="_blank">source code</a>



```ts
export type UseCategorySearchReturn = {
  /**
   * Search for category by ID
   * Accepts optional query params and associations
   */
  search(
    categoryId: string,
    options?: {
      withCmsAssociations?: boolean;
      query?: Schemas["Criteria"];
    },
  ): Promise<Schemas["Category"]>;

  /**
   * Search based on the query
   */
  advancedSearch(options: {
    withCmsAssociations?: boolean;
    query: Schemas["Criteria"];
  }): Promise<Schemas["Category"][]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCategorySearch/useCategorySearch.ts#L12" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
