# useCart

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#cart--checkout"><div class="bg-red">Cart & Checkout</div></a>
</div>







## Types


```ts
export function useCartFunction(): UseCartReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCart/useCart.ts#L107" target="_blank">source code</a>



```ts
export type UseCartReturn = {
  /**
   * Add product by id and quantity
   */
  addProduct(params: {
    id: string;
    quantity?: number;
  }): Promise<Schemas["Cart"]>;
  /**
   * Add products by array of items
   */
  addProducts(
    items: operations["addLineItem post /checkout/cart/line-item"]["body"]["items"],
  ): Promise<Schemas["Cart"]>;
  /**
   * Adds a promotion code to the cart
   */
  addPromotionCode(promotionCode: string): Promise<Schemas["Cart"]>;
  /**
   * Lists all applied and active promotion codes
   */
  appliedPromotionCodes: ComputedRef<Schemas["LineItem"][]>;
  /**
   * Current Cart object
   */
  cart: ComputedRef<Schemas["Cart"] | undefined>;
  /**
   * All items in the cart
   */
  cartItems: ComputedRef<Schemas["LineItem"][]>;
  /**
   * Changes the quantity of a product in the cart
   */
  changeProductQuantity(params: {
    id: string;
    quantity: number;
  }): Promise<Schemas["Cart"]>;
  /**
   * The number of items in the cart
   */
  count: ComputedRef<number>;
  /**
   * Refreshes the cart object and related data
   * If @param newCart is provided, it will be used as a new cart object
   */
  refreshCart(newCart?: Schemas["Cart"]): Promise<Schemas["Cart"]>;
  /**
   * Removes the provided LineItem from the cart
   */
  removeItem(lineItem: Schemas["LineItem"]): Promise<Schemas["Cart"]>;
  /**
   * Removes the item with the provided id from the cart
   */
  removeItemById(id: string): Promise<Schemas["Cart"]>;
  /**
   * The total price of the cart (including calculated costs like shipping)
   */
  totalPrice: ComputedRef<number>;
  /**
   * Shipping price
   *
   * @deprecated Use `shippingCosts` instead
   */
  shippingTotal: ComputedRef<number>;
  /**
   * Shipping costs
   */
  shippingCosts: ComputedRef<Schemas["CartDelivery"][]>;
  /**
   * The total price of all cart items
   */
  subtotal: ComputedRef<number>;
  /**
   * `true` if the cart contains no items
   */
  isEmpty: ComputedRef<boolean>;
  /**
   * `true` if cart contains only digital items
   */
  isVirtualCart: ComputedRef<boolean>;
  /**
   * Get cart errors
   */
  consumeCartErrors(): Schemas["Cart"]["errors"];
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCart/useCart.ts#L14" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
