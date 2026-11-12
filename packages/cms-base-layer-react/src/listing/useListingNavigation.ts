"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";

import {
  createEmptyFilterState,
  getListingHref,
  hasActiveFilters,
  parseListingState,
  toggleFilterValue,
  withFilters,
  withLimit,
  withOrder,
} from "./query";
import type {
  ListingFilterState,
  ListingSearchParams,
  ListingState,
  ToggleableFilterCode,
} from "./query";

export type { ToggleableFilterCode } from "./query";

export type UseListingNavigationOptions = {
  isProductSearch?: boolean;
};

function toRecord(searchParams: URLSearchParams): ListingSearchParams {
  const record: ListingSearchParams = {};
  for (const [key, value] of searchParams.entries()) {
    const existing = record[key];
    if (existing === undefined) record[key] = value;
    else if (Array.isArray(existing)) existing.push(value);
    else record[key] = [existing, value];
  }
  return record;
}

const pendingSources = new Set<symbol>();
const pendingListeners = new Set<() => void>();

function setSourcePending(source: symbol, pending: boolean) {
  if (pendingSources.has(source) === pending) return;
  if (pending) pendingSources.add(source);
  else pendingSources.delete(source);
  for (const listener of pendingListeners) listener();
}

function subscribeToPending(listener: () => void) {
  pendingListeners.add(listener);
  return () => {
    pendingListeners.delete(listener);
  };
}

const getPendingSnapshot = () => pendingSources.size > 0;
const getPendingServerSnapshot = () => false;

export function useListingNavigation(
  options: UseListingNavigationOptions = {},
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const [pendingSource] = useState(() => Symbol("listing-navigation"));
  useEffect(() => {
    setSourcePending(pendingSource, isNavigating);
    return () => setSourcePending(pendingSource, false);
  }, [pendingSource, isNavigating]);
  const isPending = useSyncExternalStore(
    subscribeToPending,
    getPendingSnapshot,
    getPendingServerSnapshot,
  );
  const isProductSearch = !!options.isProductSearch;

  const urlState = useMemo(
    () => parseListingState(toRecord(searchParams)),
    [searchParams],
  );
  const [state, setOptimisticState] = useOptimistic(urlState);

  const navigate = (next: ListingState) => {
    startTransition(() => {
      setOptimisticState(next);
      router.push(getListingHref(pathname, next, { isProductSearch }), {
        scroll: false,
      });
    });
  };

  const setFilters = (filters: ListingFilterState) =>
    navigate(withFilters(state, filters));

  return {
    state,
    isPending,
    hasActiveFilters: hasActiveFilters(state.filters, { isProductSearch }),
    setFilters,
    toggleFilterValue: (code: ToggleableFilterCode, value: string) =>
      setFilters(toggleFilterValue(state.filters, code, value)),
    setPriceRange: (min: number | undefined, max: number | undefined) =>
      setFilters({ ...state.filters, "min-price": min, "max-price": max }),
    setRating: (rating: number | undefined) =>
      setFilters({ ...state.filters, rating }),
    setShippingFree: (shippingFree: boolean) =>
      setFilters({
        ...state.filters,
        "shipping-free": shippingFree ? true : undefined,
      }),
    clearFilters: () => setFilters(createEmptyFilterState()),
    setOrder: (order: string) => navigate(withOrder(state, order)),
    setLimit: (limit: number) => navigate(withLimit(state, limit)),
    setPage: (page: number) => navigate({ ...state, page }),
  };
}
