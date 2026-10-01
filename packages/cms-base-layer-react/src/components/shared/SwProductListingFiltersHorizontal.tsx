"use client";

import type { CSSProperties } from "react";

import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { CloseIcon, SpinnerIcon } from "../icons";
import type { ListingFilter, ListingSortOption } from "./listingFilterTypes";
import { SwFilterDropdown } from "./SwFilterDropdown";
import { SwProductListingFilter } from "./SwProductListingFilter";
import { SwSortDropdown } from "./SwSortDropdown";
import { useListingFilters } from "./useListingFilters";

export type SwProductListingFiltersHorizontalProps = {
  filters: ListingFilter[];
  sortOptions?: ListingSortOption[];
  currentSort?: string;
  isProductSearch?: boolean;
  rootCategoryId?: string;
  translations?: CmsTranslations;
  className?: string;
  style?: CSSProperties;
};

const defaultTranslations = {
  listing: {
    filters: "Filters",
    sort: "Sort",
    resetFilters: "Reset filters",
    loading: "Loading",
  },
};

export function SwProductListingFiltersHorizontal({
  filters,
  sortOptions = [],
  currentSort = "",
  isProductSearch = false,
  rootCategoryId,
  translations,
  className,
  style,
}: SwProductListingFiltersHorizontalProps) {
  const t = withTranslationDefaults(translations, defaultTranslations);
  const {
    selectedFilters,
    visibleFilters,
    showResetFiltersButton,
    currentSortingOrder,
    handleFilterChange,
    handleSortChange,
    invokeCleanFilters,
    isPending,
  } = useListingFilters({ filters, isProductSearch, currentSort });

  const hasActiveFilter = (filter: { code: string }) => {
    if (filter.code === "manufacturer") {
      return selectedFilters.manufacturer.length > 0;
    }
    if (filter.code === "categories") {
      return selectedFilters.categories.length > 0;
    }
    if (filter.code === "price") {
      return (
        selectedFilters["min-price"] !== undefined ||
        selectedFilters["max-price"] !== undefined
      );
    }
    if (filter.code === "rating") {
      return selectedFilters.rating !== undefined;
    }
    if (filter.code === "shipping-free") {
      return selectedFilters["shipping-free"] !== undefined;
    }
    return selectedFilters.properties.length > 0;
  };

  return (
    <div className={cx(className) || undefined} style={style}>
      <div className="flex flex-wrap items-center justify-start gap-4 z-10">
        {visibleFilters.map((filter) => (
          <SwFilterDropdown
            key={filter.id ?? filter.code}
            label={filter.label}
            isActive={hasActiveFilter(filter)}
          >
            <SwProductListingFilter
              filter={filter}
              displayMode="dropdown"
              selectedManufacturer={selectedFilters.manufacturer}
              selectedProperties={selectedFilters.properties}
              selectedCategories={selectedFilters.categories}
              selectedMinPrice={selectedFilters["min-price"]}
              selectedMaxPrice={selectedFilters["max-price"]}
              selectedRating={selectedFilters.rating}
              selectedShippingFree={selectedFilters["shipping-free"]}
              rootCategoryId={rootCategoryId}
              translations={translations}
              onFilterChange={handleFilterChange}
            />
          </SwFilterDropdown>
        ))}

        <SwSortDropdown
          sortOptions={sortOptions}
          currentSort={currentSortingOrder}
          label={t.listing.sort}
          onSortChange={handleSortChange}
        />

        {showResetFiltersButton && (
          <button
            type="button"
            onClick={invokeCleanFilters}
            className="inline-flex justify-center items-center gap-2 rounded font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 px-4 py-3 text-base bg-transparent text-surface-on-surface-variant hover:text-surface-on-surface focus:ring-surface-on-surface"
          >
            <span>
              {t.listing.resetFilters}
              <CloseIcon className="w-5 h-5 inline-block align-middle ml-1" />
            </span>
          </button>
        )}

        {isPending && (
          <output data-testid="loading" className="inline-flex items-center">
            <SpinnerIcon
              className="w-5 h-5 animate-spin text-brand-primary"
              aria-label={t.listing.loading}
            />
          </output>
        )}
      </div>
    </div>
  );
}
