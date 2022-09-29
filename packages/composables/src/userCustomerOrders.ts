import { ref, Ref } from "vue";
import { getCustomerOrders } from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";
import { Order, ShopwareSearchParams } from "@shopware-pwa/types";

export type UseCustomerOrdersReturn = {
  orders: Ref<Order[]>;
  changeCurrentPage: (pageNumber: number | string) => Promise<void>;
  loadOrders: () => Promise<void>;
};

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
