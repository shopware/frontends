# useCartItem

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#cart--checkout"><div class="bg-red">Cart & Checkout</div></a>
</div>

Composable to manage specific cart item





## Types


```ts
export function useCartItem(
  cartItem: Ref<Schemas["LineItem"]>,
): UseCartItemReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCartItem/useCartItem.ts#L81" target="_blank">source code</a>



```ts
export type UseCartItemReturn = {
  /**
   * Calculated price {number} for the current item
   */
  itemRegularPrice: ComputedRef<number | undefined>;
  /**
   * Calculated price {number} for the current item if list price is set
   */
  itemSpecialPrice: ComputedRef<number | undefined>;
  /**
   * Total price for the current item of given quantity in the cart
   */
  itemTotalPrice: ComputedRef<number | undefined>;
  /**
   * Thumbnail url for the current item's entity
   */
  itemImageThumbnailUrl: ComputedRef<string>;
  /**
   * Options (of variation) for the current item
   */
  itemOptions: ComputedRef<LineItemOptions>;
  /**
   * Type of the current item: "product" or "promotion"
   */
  itemType: ComputedRef<Schemas["LineItem"]["type"] | undefined>;
  /**
   * Determines if the current item is a product
   */
  isProduct: ComputedRef<boolean>;
  /**
   * Determines if the current item is a promotion
   */
  isPromotion: ComputedRef<boolean>;
  /**
   * Determines if the current item can be removed from cart
   */
  isRemovable: ComputedRef<boolean>;
  /**
   * Determines if the current item's quantity can be changed
   */
  isStackable: ComputedRef<boolean>;
  /**
   * Determines if the current item is a digital product (to download)
   */
  isDigital: ComputedRef<boolean>;
  /**
   * Stock information for the current item
   */
  itemStock: ComputedRef<number | undefined>;
  /**
   * Quantity of the current item in the cart
   */
  itemQuantity: ComputedRef<number | undefined>;
  /**
   * Changes the current item quantity in the cart
   */
  changeItemQuantity(quantity: number): Promise<Schemas["Cart"]>;
  /**
   * Removes the current item from the cart
   */
  removeItem(): Promise<Schemas["Cart"]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCartItem/useCartItem.ts#L13" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
