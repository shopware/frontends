# useProductAssociations

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#product"><div class="bg-red">Product</div></a>
</div>

Get product association entity.





## Types


```ts
export function useProductAssociations(
  product: ComputedRef<Schemas["Product"]>,
  options: {
    associationContext: "cross-selling" | "reviews";
    includeSeoUrls?: boolean;
  },
): UseProductAssociationsReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductAssociations/useProductAssociations.ts#L31" target="_blank">source code</a>



```ts
export type UseProductAssociationsReturn = {
  /**
   * Start loading resources. Search Parameters and HTTP method can be passed.
   *
   */
  loadAssociations(params: {
    method?: "post" | "get";
    searchParams: Schemas["Criteria"];
  }): Promise<void>;
  /**
   * If it's loading - indicator
   */
  isLoading: ComputedRef<boolean>;
  /**
   * Product associations, like CrossSelling[]
   */
  productAssociations: ComputedRef<Schemas["CrossSellingElementCollection"]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductAssociations/useProductAssociations.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
