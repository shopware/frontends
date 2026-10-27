# useCmsMeta

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#cms-shopping-experiences"><div class="bg-red">CMS (Shopping Experiences)</div></a>
</div>

TODO: remove parameter and use reactive state of cmsResponse provided by useCms composable





## Types


```ts
export function useCmsMeta(
  entity: Schemas["Category"] | Schemas["Product"] | Schemas["LandingPage"],
): UseCmsMetaReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCmsMeta/useCmsMeta.ts#L22" target="_blank">source code</a>



```ts
export type UseCmsMetaReturn = {
  /**
   * Meta title for current page/entity
   */
  title: ComputedRef<string>;
  /**
   * Meta tags for current page/entity
   */
  meta: ComputedRef<{ name: string; content: string }[]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCmsMeta/useCmsMeta.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
