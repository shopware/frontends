# useOrderDetails

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#customer--account"><div class="bg-red">Customer & Account</div></a>
</div>

Composable for managing an existing order.





## Types


```ts
export function useOrderDetails(
  orderId: string,
  associations?: Schemas["Criteria"]["associations"],
): UseOrderDetailsReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useOrderDetails/useOrderDetails.ts#L128" target="_blank">source code</a>



```ts
export type UseOrderDetailsReturn = {
  /**
   * {@link Schemas['Order']} object
   */
  order: ComputedRef<Schemas["Order"] | undefined | null>;
  /**
   * Order status (e.g. 'Open', 'Cancelled')
   */
  status: ComputedRef<string | undefined>;
  /**
   * Order status technical name (e.g. 'open', 'cancelled')
   */
  statusTechnicalName: ComputedRef<string | undefined>;
  /**
   * Order total price
   */
  total: ComputedRef<number | undefined>;
  /**
   * Order subtotal price for all items
   */
  subtotal: ComputedRef<number | undefined>;
  /**
   * Order shipping costs
   */
  shippingCosts: ComputedRef<number | undefined>;
  /**
   * Shipping address
   */
  shippingAddress: ComputedRef<Schemas["OrderAddress"] | undefined>;
  /**
   * Billing address
   */
  billingAddress: ComputedRef<Schemas["OrderAddress"] | undefined>;
  /**
   * Basic personal details
   */
  personalDetails: ComputedRef<{
    email: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
  }>;
  /**
   * Payment URL for external payment methods (e.g. async payment in external payment gateway)
   */
  paymentUrl: Ref<null | string>;
  /**
   * Returns current selected shipping method for the order. Last element in delivery array.
   */
  shippingMethod: ComputedRef<Schemas["ShippingMethod"] | undefined | null>;
  /**
   * Returns current selected payment method for the order. Last element in transactions array.
   */
  paymentMethod: ComputedRef<Schemas["PaymentMethod"] | undefined | null>;
  /**
   * Get order object including additional associations.
   * useDefaults describes what order object should look like.
   */
  loadOrderDetails(): Promise<Schemas["OrderRouteResponse"]>;
  /**
   * Handle payment for existing error.
   *
   * Pass custom success and error URLs (optionally).
   */
  handlePayment(
    successUrl?: string,
    errorUrl?: string,
    paymentDetails?: unknown,
  ): void;
  /**
   * Cancel an order.
   *
   * Action cannot be reverted.
   */
  cancel(): Promise<Schemas["StateMachineState"]>;
  /**
   * Changes the payment method for current cart.
   * @param paymentMethodId - ID of the payment method to be set
   * @returns
   */
  changePaymentMethod(
    paymentMethodId: string,
  ): Promise<Schemas["SuccessResponse"]>;
  /**
   * Get media content
   *
   * @param {string} downloadId
   * @returns {Blob}
   */
  getMediaFile: (downloadId: string) => Promise<Blob>;
  /**
   * Get order documents
   * @param {string} documentId
   * @param {string} deepLinkCode
   * @returns Binary document content (PDF, HTML, or XML)
   */
  getDocumentFile: (
    documentId: string,
    deepLinkCode: string,
  ) => Promise<Blob | string>;
  /**
   * Check if order has documents
   */
  hasDocuments: ComputedRef<boolean>;
  /**
   * Get order documents
   */
  documents: ComputedRef<Schemas["Document"][]>;
  /**
   * Fetches all available payment methods
   */
  getPaymentMethods(): Promise<Schemas["PaymentMethod"][]>;

  paymentChangeable: ComputedRef<boolean>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useOrderDetails/useOrderDetails.ts#L8" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
