import { ref, Ref, UnwrapRef, reactive } from "vue";
import { getCustomerOrders } from "@shopware-pwa/shopware-6-client";
import { useShopwareContext } from "./useShopwareContext";
import {
  Order,
  ShopwareError,
  ShopwareSearchParams,
} from "@shopware-pwa/types";

/**
 * Composable for managing customer orders.
 *
 * @beta
 */
export function useCustomerOrders(): {
  orders: Ref<Order[] | null>;
  changeCurrentPage: (pageNumber: number | string) => Promise<void>;
  errors: UnwrapRef<{
    loadOrders: ShopwareError[];
  }>;
  loadOrders: () => Promise<void>;
} {
  const { apiInstance } = useShopwareContext();

  const errors: UnwrapRef<{
    loadOrders: ShopwareError[];
  }> = reactive({
    loadOrders: [],
  });

  const orders: Ref<Order[] | null> = ref(null);

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
    errors,
  };
}
