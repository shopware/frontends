"use client";

import type { CSSProperties } from "react";

import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { CloseFilledIcon, SpinnerIcon } from "../icons";
import type { ListingFilter, ListingSortOption } from "./listingFilterTypes";
import { SwFilterChips } from "./SwFilterChips";
import { SwProductListingFilter } from "./SwProductListingFilter";
import { SwSortDropdown } from "./SwSortDropdown";
import { useListingFilters } from "./useListingFilters";

export type SwProductListingFiltersProps = {
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

export function SwProductListingFilters({
  filters,
  sortOptions = [],
  currentSort = "",
  isProductSearch = false,
  rootCategoryId,
  translations,
  className,
  style,
}: SwProductListingFiltersProps) {
  const t = withTranslationDefaults(translations, defaultTranslations);
  const {
    selectedFilters,
    visibleFilters,
    showResetFiltersButton,
    currentSortingOrder,
    handleFilterChange,
    handleRemoveFilterChip,
    handleSortChange,
    invokeCleanFilters,
    isPending,
  } = useListingFilters({ filters, isProductSearch, currentSort });

  return (
    <div className={cx(className) || undefined} style={style}>
      <SwFilterChips
        filters={selectedFilters}
        availableFilters={visibleFilters}
        onRemove={handleRemoveFilterChip}
      />

      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="flex flex-row items-center justify-between w-full mb-4 py-3 border-b border-outline-outline-variant">
          <div className="flex-1 text-surface-on-surface text-base font-bold leading-normal">
            {t.listing.filters}
          </div>
          {isPending && (
            <output
              data-testid="loading"
              className="inline-flex items-center mr-2"
            >
              <SpinnerIcon
                className="w-5 h-5 animate-spin text-brand-primary"
                aria-label={t.listing.loading}
              />
            </output>
          )}
          <SwSortDropdown
            sortOptions={sortOptions}
            currentSort={currentSortingOrder}
            label={t.listing.sort}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        {visibleFilters.map((filter) => (
          <SwProductListingFilter
            key={filter.id ?? filter.code}
            filter={filter}
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
            className="w-full"
          />
        ))}
        {showResetFiltersButton && (
          <div className="w-full">
            <button
              type="button"
              onClick={invokeCleanFilters}
              className="inline-flex justify-center items-center gap-2 rounded font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 px-4 py-3 text-base bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary focus:ring-brand-primary w-full"
            >
              <span>
                {t.listing.resetFilters}
                <CloseFilledIcon className="w-6 h-6 inline-block align-middle ml-2" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
