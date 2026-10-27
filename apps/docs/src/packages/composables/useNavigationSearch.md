# useNavigationSearch

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#navigation--routing"><div class="bg-red">Navigation & Routing</div></a>
</div>

Composable to get search for SeoUrl entity for given path.





## Types


```ts
export function useNavigationSearch(): UseNavigationSearchReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNavigationSearch/useNavigationSearch.ts#L25" target="_blank">source code</a>



```ts
export type UseNavigationSearchReturn = {
  /**
   * Get {@link SeoUrl} entity for given path
   * @example resolvePath("/my-category/my-product") or resolvePath("/") for home page
   */
  resolvePath(path: string): Promise<Schemas["SeoUrl"] | null>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNavigationSearch/useNavigationSearch.ts#L12" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
