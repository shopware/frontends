# useProductPrice

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#product"><div class="bg-red">Product</div></a>
</div>

The purpose of the `useProductPrice` function is to abstract the logic to expose most useful helpers for price displaying.





## Types


```ts
export function useProductPrice(
  product: Ref<Schemas["Product"] | undefined>,
): UseProductPriceReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductPrice/useProductPrice.ts#L61" target="_blank">source code</a>



```ts
export type UseProductPriceReturn = {
  /**
   * Whole calculated price object
   */
  price: ComputedRef<Schemas["CalculatedPrice"] | undefined>;
  /**
   * Calculated price value for one selling unit
   */
  totalPrice: ComputedRef<number | undefined>;
  /**
   * Current unit price value
   */
  unitPrice: ComputedRef<number | undefined>;
  /**
   * Can be used if hasListPrice is set to true
   */
  referencePrice: ComputedRef<
    Schemas["CalculatedPrice"]["referencePrice"] | undefined
  >;
  /**
   * determines if `price` contains the minimum tier price
   */
  displayFrom: ComputedRef<boolean>;
  /**
   * cheapest price value for a variant if exists
   */
  displayFromVariants: ComputedRef<number | false | undefined>;
  /**
   * array of TierPrice object
   */
  tierPrices: ComputedRef<TierPrice[]>;
  /**
   * Whether the product currently has a list price reduction / discount
   * (e.g. for strikethrough / discount display, typically based on `listPrice.percentage`).
   */
  hasListPrice: ComputedRef<boolean>;
  /**
   * Whether the product currently has a list price reduction / discount.
   * @deprecated Use `hasListPrice` instead. Will be removed in a future version.
   */
  isListPrice: ComputedRef<boolean>;
  /**
   * price for products with regulation price
   */
  regulationPrice: ComputedRef<number | undefined>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductPrice/useProductPrice.ts#L8" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
