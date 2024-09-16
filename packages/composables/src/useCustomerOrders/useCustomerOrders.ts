import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

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

/**
 * Composable for fetching the orders list.
 * @public
 * @category Customer & Account
 */
export function useCustomerOrders(): UseCustomerOrdersReturn {
  const { apiClient } = useShopwareContext();

  const orders: Ref<Schemas["Order"][]> = ref([]);

  const currentPaginationPage = ref<number>(1);
  const limit = ref<number>(15);

  const totalOrderItemsCount: Ref<number> = ref(0);

  const currentParams = ref<Schemas["Criteria"]>({});

  const loadOrders = async (
    parameters: Schemas["Criteria"] = {},
  ): Promise<void> => {
    const params = {
      ...parameters,
      limit: limit.value,
    };
    currentParams.value = params;
    const fetchedOrders = await apiClient.invoke("readOrder post /order", {
      body: { ...params, "total-count-mode": "exact" },
    });
    orders.value = fetchedOrders.data.orders.elements;
    totalOrderItemsCount.value = fetchedOrders.data.orders.total ?? 0;
  };

  const changeCurrentPage = async (pageNumber: number) => {
    await loadOrders({ ...currentParams.value, page: pageNumber });
    currentPaginationPage.value = pageNumber;
  };

  const currentPage = computed(() => currentPaginationPage.value);

  const totalPages = computed(() => {
    return Math.ceil(totalOrderItemsCount.value / limit.value);
  });

  return {
    orders,
    changeCurrentPage,
    loadOrders,
    currentPage,
    totalPages,
    limit,
  };
}
