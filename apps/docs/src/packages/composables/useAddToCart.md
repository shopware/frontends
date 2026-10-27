# useAddToCart

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#cart--checkout"><div class="bg-red">Cart & Checkout</div></a>
</div>

Composable to manage adding product to cart

With this composable you can:
- Add product to cart
- Get product quantity
- Get product stock
- Get product available stock
- Check if product is in cart
- Get product count in cart





## Types


```ts
export function useAddToCart(
  product: Ref<Schemas["Product"] | undefined>,
): UseAddToCartReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useAddToCart/useAddToCart.ts#L48" target="_blank">source code</a>



```ts
export type UseAddToCartReturn = {
  /**
   * Add to cart method
   * @type {function}
   */
  addToCart(): Promise<Schemas["Cart"]>;
  /**
   * If you want to add more that 1 product set quantity before invoking `addToCart`
   */
  quantity: Ref<number>;
  /**
   * Returns product count in stock
   */
  getStock: ComputedRef<number | undefined>;
  /**
   * Returns product count in available stock
   */
  getAvailableStock: ComputedRef<number | undefined>;
  /**
   * Flag if product is already in cart
   */
  isInCart: ComputedRef<boolean>;
  /**
   * count of the product quantity already in the cart
   */
  count: ComputedRef<number>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useAddToCart/useAddToCart.ts#L6" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
