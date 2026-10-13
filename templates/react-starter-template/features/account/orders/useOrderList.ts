"use client";

import type { Schemas } from "#shopware";
import { DEFAULT_PAGE_SIZE } from "@/features/paging/pagination";
import { usePagedList } from "@/features/paging/usePagedList";
import type {
  PagedListState,
  PagedListStatus,
  UsePagedListResult,
} from "@/features/paging/usePagedList";

import { readOrders } from "./ordersApi";

export type OrderListStatus = PagedListStatus;

export type OrderListState = PagedListState<Schemas["Order"]>;

export type UseOrderListResult = UsePagedListResult<Schemas["Order"]>;

export function useOrderList(): UseOrderListResult {
  return usePagedList(
    readOrders,
    DEFAULT_PAGE_SIZE,
    "[Account] reading the orders failed",
  );
}
