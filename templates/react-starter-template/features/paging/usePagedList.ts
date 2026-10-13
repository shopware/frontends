"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ApiClient } from "#shopware";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import { pageCount } from "./pagination";

export type PagedListStatus = "loading" | "ready" | "error";

export type PagedListPage<T> = {
  elements: T[];
  total: number;
};

export type PagedListState<T> = {
  status: PagedListStatus;
  page: number;
  limit: number;
  data: PagedListPage<T> | null;
};

export type UsePagedListResult<T> = PagedListState<T> & {
  totalPages: number;
  changePage(page: number): Promise<void>;
  changeLimit(limit: number): Promise<void>;
  retry(): Promise<void>;
};

export type PagedListRead<T> = (
  client: Pick<ApiClient, "invoke">,
  params: { page: number; limit: number },
) => Promise<PagedListPage<T>>;

export function usePagedList<T>(
  read: PagedListRead<T>,
  defaultLimit: number,
  failureMessage: string,
): UsePagedListResult<T> {
  const getClient = useShopwareClient();
  const [state, setState] = useState<PagedListState<T>>({
    status: "loading",
    page: 1,
    limit: defaultLimit,
    data: null,
  });
  const latestRequest = useRef(0);
  const params = useRef({ page: 1, limit: defaultLimit });

  const fetchPage = useCallback(
    async (request: number, page: number, limit: number): Promise<void> => {
      try {
        const client = await getClient();
        let shownPage = page;
        let data = await read(client, { page, limit });
        const lastPage = pageCount(data.total, limit);
        if (data.total > 0 && page > lastPage) {
          shownPage = lastPage;
          if (request === latestRequest.current) {
            params.current = { page: shownPage, limit };
          }
          data = await read(client, { page: shownPage, limit });
        }
        if (request !== latestRequest.current) return;
        setState({ status: "ready", page: shownPage, limit, data });
      } catch (error) {
        if (request !== latestRequest.current) return;
        console.error(failureMessage, error);
        setState((previous) => ({ ...previous, status: "error" }));
      }
    },
    [getClient, read, failureMessage],
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
