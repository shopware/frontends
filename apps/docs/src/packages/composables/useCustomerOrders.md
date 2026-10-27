# useCustomerOrders

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#customer--account"><div class="bg-red">Customer & Account</div></a>
</div>

Composable for fetching the orders list.





## Types


```ts
export function useCustomerOrders(): UseCustomerOrdersReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCustomerOrders/useCustomerOrders.ts#L43" target="_blank">source code</a>



```ts
export type UseCustomerOrdersReturn = {
  /**
   * All placed orders belonging to the logged-in customer
   */
  orders: Ref<Schemas["Order"][]>;
  /**
   * Changes the current page of the orders list
   *
   * In order to change a page with additional parameters please use `loadOrders` method.
   */
  changeCurrentPage(pageNumber: number | string): Promise<void>;
  /**
   * Fetches the orders list and assigns the result to the `orders` property
   */
  loadOrders(
    parameters?: operations["readOrder post /order"]["body"],
  ): Promise<void>;
  /**
   * Current page number
   */
  currentPage: ComputedRef<number>;
  /**
   * total pages
   */
  totalPages: ComputedRef<number>;
  /**
   * Limit of orders per page
   */
  limit: Ref<number>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCustomerOrders/useCustomerOrders.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
