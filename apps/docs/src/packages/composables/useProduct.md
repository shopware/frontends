# useProduct

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#product"><div class="bg-red">Product</div></a>
</div>

Composable for product management.





## Types


```ts
export function useProduct(
  product?: Ref<Schemas["Product"]> | Schemas["Product"],
  configurator?: Ref<Schemas["PropertyGroup"][]> | Schemas["PropertyGroup"][],
): UseProductReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProduct/useProduct.ts#L31" target="_blank">source code</a>



```ts
export type UseProductReturn = {
  /**
   * Returns product object
   * {@link Product} object
   */
  product: ComputedRef<Schemas["Product"]>;
  /**
   * {@link PropertyGroup} array that defines the product possible configurations
   */
  configurator: ComputedRef<Schemas["PropertyGroup"][]>;
  /**
   * Merges the current product with the new variant data
   * @param variant - {@link Product} object with the new variant data
   */
  changeVariant(variant?: Partial<Schemas["Product"]>): void;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProduct/useProduct.ts#L9" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
