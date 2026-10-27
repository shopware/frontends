# useAddress

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#cart--checkout"><div class="bg-red">Cart & Checkout</div></a>
</div>

Composable to manage customer addresses

With this composable you can:
- Fetch customer addresses
- Return customer addresses
- Create new customer address
- Update existing customer address
- Delete existing customer address
- Set default billing address
- Set default shipping address
- Format error message





## Types


```ts
export function useAddress(): UseAddressReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useAddress/useAddress.ts#L67" target="_blank">source code</a>



```ts
export type UseAddressReturn = {
  /**
   * List of customer addresses
   */
  customerAddresses: ComputedRef<Schemas["CustomerAddress"][]>;
  /**
   * Loads the addresses that are available under `customerAddresses` property
   */
  loadCustomerAddresses(): Promise<Schemas["CustomerAddress"][]>;
  /**
   * Allows to create new address for a current customer
   */
  createCustomerAddress(
    customerAddress: Schemas["CustomerAddress"],
  ): Promise<Schemas["CustomerAddress"]>;
  /**
   * Allows to update existing address for a current customer
   */
  updateCustomerAddress(
    customerAddress: Schemas["CustomerAddress"],
  ): Promise<Schemas["CustomerAddress"]>;
  /**
   * Allows to delete existing address for a current customer
   */
  deleteCustomerAddress(addressId: string): Promise<void>;
  /**
   * Sets the address for given ID as default billing address
   */
  setDefaultCustomerBillingAddress(addressId: string): Promise<string>;
  /**
   * Sets the address for given ID as default shipping address
   */
  setDefaultCustomerShippingAddress(addressId: string): Promise<string>;
  /**
   * Returns formatted error message
   *
   * @param {ShopwareError} error
   */
  errorMessageBuilder(error: ApiError): string | null;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useAddress/useAddress.ts#L9" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
