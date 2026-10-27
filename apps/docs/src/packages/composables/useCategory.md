# useCategory

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#product"><div class="bg-red">Product</div></a>
</div>

Composable to get the category from current CMS context





## Types


```ts
export function useCategory(
  category?: Ref<Schemas["Category"]>,
): UseCategoryReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCategory/useCategory.ts#L22" target="_blank">source code</a>



```ts
export type UseCategoryReturn = {
  /**
   * Current category entity
   */
  category: ComputedRef<Schemas["Category"]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCategory/useCategory.ts#L9" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
