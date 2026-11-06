"use client";

import { useCallback, useMemo } from "react";

import { getVisibleListingFilters } from "../../listing/query";
import type { ListingFilterState } from "../../listing/query";
import { useListingNavigation } from "../../listing/useListingNavigation";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterChip,
  ListingFilterValue,
} from "./listingFilterTypes";

export type UseListingFiltersOptions = {
  filters: ListingFilter[];
  isProductSearch: boolean;
  currentSort?: string;
};

const toOptionalNumber = (value: ListingFilterValue): number | undefined => {
  if (value === undefined || typeof value === "object") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toPriceRange = (
  value: ListingFilterValue,
): { min: number | undefined; max: number | undefined } => {
  if (typeof value !== "object" || value === null) {
    return { min: undefined, max: undefined };
  }
  return { min: toOptionalNumber(value.min), max: toOptionalNumber(value.max) };
};

export function useListingFilters({
  filters,
  isProductSearch,
  currentSort,
}: UseListingFiltersOptions) {
  const {
    state,
    isPending,
    hasActiveFilters,
    toggleFilterValue,
    setPriceRange,
    setRating,
    setShippingFree,
    clearFilters,
    setOrder,
  } = useListingNavigation({ isProductSearch });

  const selectedFilters: ListingFilterState = state.filters;

  const visibleFilters = useMemo(
    () => getVisibleListingFilters(filters, { isProductSearch }),
    [filters, isProductSearch],
  );

  const handleFilterChange = useCallback(
    ({ code, value }: ListingFilterChangeEvent) => {
      if (
        code === "manufacturer" ||
        code === "properties" ||
        code === "categories"
      ) {
        toggleFilterValue(code, String(value));
      } else if (code === "price") {
        const { min, max } = toPriceRange(value);
        setPriceRange(min, max);
      } else if (code === "rating") {
        setRating(toOptionalNumber(value));
      } else if (code === "shipping-free") {
        setShippingFree(Boolean(value));
      }
    },
    [setPriceRange, setRating, setShippingFree, toggleFilterValue],
  );

  const handleRemoveFilterChip = useCallback(
    (chip: ListingFilterChip) => {
      if (
        chip.code === "properties" ||
        chip.code === "manufacturer" ||
        chip.code === "categories"
      ) {
        toggleFilterValue(chip.code, String(chip.value));
      } else if (chip.code === "price") {
        setPriceRange(undefined, undefined);
      } else if (chip.code === "rating") {
        setRating(undefined);
      } else if (chip.code === "shipping-free") {
        setShippingFree(false);
      }
    },
    [setPriceRange, setRating, setShippingFree, toggleFilterValue],
  );

  const handleSortChange = useCallback(
    (sortKey: string) => {
      setOrder(sortKey);
    },
    [setOrder],
  );

  return {
    selectedFilters,
    visibleFilters,
    showResetFiltersButton: hasActiveFilters,
    currentSortingOrder: state.order ?? currentSort ?? "",
    handleFilterChange,
    handleRemoveFilterChip,
    handleSortChange,
    invokeCleanFilters: clearFilters,
    isPending,
  };
}
