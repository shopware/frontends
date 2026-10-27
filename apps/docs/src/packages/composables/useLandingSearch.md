# useLandingSearch

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#navigation--routing"><div class="bg-red">Navigation & Routing</div></a>
</div>

Composable for landing page search.





## Types


```ts
export function useLandingSearch(): {
  search: (
    navigationId: string,
    options?: {
      withCmsAssociations?: boolean;
    },
  ) => Promise<Schemas["LandingPage"]>;
} 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useLandingSearch/useLandingSearch.ts#L24" target="_blank">source code</a>



```ts
export type UseLandingSearchReturn = {
  /**
   * Search for landing page by ID
   * Accepts optional media associations
   */
  search(
    navigationId: string,
    options?: {
      withCmsAssociations?: boolean;
    },
  ): Promise<Schemas["LandingPage"]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useLandingSearch/useLandingSearch.ts#L6" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
