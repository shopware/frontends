import { ref } from "vue";
import type { Ref } from "vue";
import { useShopwareContext } from "#imports";
import { Schemas } from "#shopware";

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
  loadOrders(parameters?: Schemas["Criteria"]): Promise<void>;
};

/**
 * Composable for fetching the orders list.
 * @public
 * @category Customer & Account
 */
export function useCustomerOrders(): UseCustomerOrdersReturn {
  const { apiClient } = useShopwareContext();

  const orders: Ref<Schemas["Order"][]> = ref([]);

  const loadOrders = async (
    parameters: Schemas["Criteria"] = {},
  ): Promise<void> => {
    const fetchedOrders = await apiClient.invoke(
      "readOrder post /order",
      parameters,
    );
    orders.value = fetchedOrders.orders.elements;
  };

  const changeCurrentPage = async (pageNumber: number | string) =>
    await loadOrders({ page: +pageNumber });

  return {
    orders,
    changeCurrentPage,
    loadOrders,
  };
}
