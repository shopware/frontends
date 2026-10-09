"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import { ORDERS_DEFAULT_LIMIT, pageCount, readOrders } from "./ordersApi";
import type { OrderPage } from "./ordersApi";

export type OrderListStatus = "loading" | "ready" | "error";

export type OrderListState = {
  status: OrderListStatus;
  page: number;
  limit: number;
  data: OrderPage | null;
};

export type UseOrderListResult = OrderListState & {
  totalPages: number;
  changePage(page: number): Promise<void>;
  changeLimit(limit: number): Promise<void>;
  retry(): Promise<void>;
};

const INITIAL_STATE: OrderListState = {
  status: "loading",
  page: 1,
  limit: ORDERS_DEFAULT_LIMIT,
  data: null,
};

export function useOrderList(): UseOrderListResult {
  const getClient = useShopwareClient();
  const [state, setState] = useState<OrderListState>(INITIAL_STATE);
  const latestRequest = useRef(0);
  const params = useRef({
    page: INITIAL_STATE.page,
    limit: INITIAL_STATE.limit,
  });

  const fetchPage = useCallback(
    async (request: number, page: number, limit: number): Promise<void> => {
      try {
        const client = await getClient();
        let shownPage = page;
        let data = await readOrders(client, { page, limit });
        const lastPage = pageCount(data.total, limit);
        if (data.total > 0 && page > lastPage) {
          shownPage = lastPage;
          if (request === latestRequest.current) {
            params.current = { page: shownPage, limit };
          }
          data = await readOrders(client, { page: shownPage, limit });
        }
        if (request !== latestRequest.current) return;
        setState({ status: "ready", page: shownPage, limit, data });
      } catch (error) {
        if (request !== latestRequest.current) return;
        console.error("[Account] reading the orders failed", error);
        setState((previous) => ({ ...previous, status: "error" }));
      }
    },
    [getClient],
  );

  const load = useCallback(
    (page: number, limit: number): Promise<void> => {
      const request = ++latestRequest.current;
      params.current = { page, limit };
      setState((previous) => ({ ...previous, status: "loading", page, limit }));
      return fetchPage(request, page, limit);
    },
    [fetchPage],
  );

  useEffect(() => {
    const request = ++latestRequest.current;
    void fetchPage(request, params.current.page, params.current.limit);
  }, [fetchPage]);

  const changePage = useCallback(
    (page: number) => load(page, params.current.limit),
    [load],
  );

  const changeLimit = useCallback((limit: number) => load(1, limit), [load]);

  const retry = useCallback(
    () => load(params.current.page, params.current.limit),
    [load],
  );

  return {
    ...state,
    totalPages: pageCount(state.data?.total ?? 0, state.limit),
    changePage,
    changeLimit,
    retry,
  };
}
