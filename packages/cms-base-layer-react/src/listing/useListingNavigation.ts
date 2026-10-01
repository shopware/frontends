"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

import {
  LISTING_DEFAULTS,
  buildListingQuery,
  createEmptyFilterState,
  hasActiveFilters,
  parseListingState,
} from "./query";
import type {
  ListingFilterState,
  ListingSearchParams,
  ListingState,
} from "./query";

export type ToggleableFilterCode = "manufacturer" | "properties" | "categories";

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

export function useListingNavigation(
  options: UseListingNavigationOptions = {},
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isProductSearch = !!options.isProductSearch;

  const state = useMemo(
    () => parseListingState(toRecord(searchParams)),
    [searchParams],
  );

  const navigate = useCallback(
    (next: ListingState) => {
      const query = buildListingQuery(next, { isProductSearch });
      const queryString = query.toString();
      startTransition(() => {
        router.push(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });
      });
    },
    [isProductSearch, pathname, router],
  );

  const setFilters = useCallback(
    (filters: ListingFilterState) => {
      navigate({ ...state, filters, page: undefined });
    },
    [navigate, state],
  );

  const toggleFilterValue = useCallback(
    (code: ToggleableFilterCode, value: string) => {
      const current = state.filters[code];
      const next = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];
      setFilters({ ...state.filters, [code]: next });
    },
    [setFilters, state.filters],
  );

  const setPriceRange = useCallback(
    (min: number | undefined, max: number | undefined) => {
      setFilters({ ...state.filters, "min-price": min, "max-price": max });
    },
    [setFilters, state.filters],
  );

  const setRating = useCallback(
    (rating: number | undefined) => {
      setFilters({ ...state.filters, rating });
    },
    [setFilters, state.filters],
  );

  const setShippingFree = useCallback(
    (shippingFree: boolean) => {
      setFilters({
        ...state.filters,
        "shipping-free": shippingFree ? true : undefined,
      });
    },
    [setFilters, state.filters],
  );

  const clearFilters = useCallback(() => {
    setFilters(createEmptyFilterState());
  }, [setFilters]);

  const setOrder = useCallback(
    (order: string) => {
      navigate({ ...state, order, page: undefined });
    },
    [navigate, state],
  );

  const setLimit = useCallback(
    (limit: number) => {
      navigate({ ...state, limit, page: LISTING_DEFAULTS.page });
    },
    [navigate, state],
  );

  const setPage = useCallback(
    (page: number) => {
      navigate({ ...state, page });
    },
    [navigate, state],
  );

  return {
    state,
    isPending,
    hasActiveFilters: hasActiveFilters(state.filters, { isProductSearch }),
    setFilters,
    toggleFilterValue,
    setPriceRange,
    setRating,
    setShippingFree,
    clearFilters,
    setOrder,
    setLimit,
    setPage,
  };
}
