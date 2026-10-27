# useCheckout

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#cart--checkout"><div class="bg-red">Cart & Checkout</div></a>
</div>

Composable to manage checkout process





## Types


```ts
export function useCheckout(): UseCheckoutReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCheckout/useCheckout.ts#L76" target="_blank">source code</a>



```ts
export type UseCheckoutReturn = {
  /**
   * Fetches all available shipping methods
   */
  getShippingMethods(options?: {
    forceReload: boolean;
  }): Promise<ComputedRef<Schemas["ShippingMethod"][]>>;
  /**
   * List of available shipping methods
   */
  shippingMethods: ComputedRef<Schemas["ShippingMethod"][]>;
  /**
   * Fetches all available payment methods
   */
  getPaymentMethods(options?: {
    forceReload: boolean;
  }): Promise<ComputedRef<Schemas["PaymentMethod"][]>>;
  /**
   * List of available payment methods
   */
  paymentMethods: ComputedRef<Schemas["PaymentMethod"][]>;
  /**
   * Creates order based on the current cart
   */
  createOrder(
    params?: operations["createOrder post /checkout/order"]["body"],
  ): Promise<Schemas["Order"]>;
  /**
   * Shipping address for the current session
   */
  shippingAddress: ComputedRef<Schemas["CustomerAddress"] | undefined>;
  /**
   * Billing address for the current session
   */
  billingAddress: ComputedRef<Schemas["CustomerAddress"] | undefined>;
  /**
   * Selected shipping method for the current session
   * Sugar for {@link useSessionContext.selectedShippingMethod}
   */
  selectedShippingMethod: ComputedRef<Schemas["ShippingMethod"] | null>;
  /**
   * Sets shipping method for the current session
   * Sugar for {@link useSessionContext.setShippingMethod}
   */
  setShippingMethod(shippingMethod: { id: string }): Promise<void>;
  /**
   * Selected payment method for the current session
   * Sugar for {@link useSessionContext.selectedPaymentMethod}
   */
  selectedPaymentMethod: ComputedRef<Schemas["PaymentMethod"] | null>;
  /**
   * Sets payment method for the current session
   * Sugar for {@link useSessionContext.setPaymentMethod}
   */
  setPaymentMethod(paymentMethod: { id: string }): Promise<void>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCheckout/useCheckout.ts#L8" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
