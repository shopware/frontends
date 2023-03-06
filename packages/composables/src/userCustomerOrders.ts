import { ref, Ref } from "vue";
import { getCustomerOrders } from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";
import { Order, ShopwareSearchParams } from "@shopware-pwa/types";

export type UseCustomerOrdersReturn = {
  /**
   * All placed orders belonging to the logged-in customer
   */
  orders: Ref<Order[]>;
  /**
   * Changes the current page of the orders list
   */
  changeCurrentPage: (pageNumber: number | string) => Promise<void>;
  /**
   * Fetches the orders list and assigns the result to the `orders` property
   */
  loadOrders: () => Promise<void>;
};

/**
 * Composable for fetching the orders list.
 * @public
 * @category Customer & Account
 */
export function useCustomerOrders(): UseCustomerOrdersReturn {
  const { apiInstance } = useShopwareContext();

  const orders: Ref<Order[]> = ref([]);

  const loadOrders = async (
    parameters: ShopwareSearchParams = {}
  ): Promise<void> => {
    const fetchedOrders = await getCustomerOrders(parameters, apiInstance);
    orders.value = fetchedOrders?.elements;
  };

  const changeCurrentPage = async (pageNumber: number | string) =>
    await loadOrders({ page: +pageNumber });

  return {
    orders,
    changeCurrentPage,
    loadOrders,
  };
}
