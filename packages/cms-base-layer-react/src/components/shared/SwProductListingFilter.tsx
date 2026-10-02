"use client";

import type { CSSProperties } from "react";

import { cx } from "../../helpers/cx";
import type { CmsTranslations } from "../../translations";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterDisplayMode,
  SelectedListingFilters,
} from "./listingFilterTypes";
import { SwFilterCategories } from "./SwFilterCategories";
import { SwFilterPrice } from "./SwFilterPrice";
import { SwFilterProperties } from "./SwFilterProperties";
import { SwFilterRating } from "./SwFilterRating";
import { SwFilterShippingFree } from "./SwFilterShippingFree";

export type SwProductListingFilterProps = {
  filter: ListingFilter;
  selectedManufacturer: string[];
  selectedProperties: string[];
  selectedCategories?: string[];
  selectedMinPrice: number | undefined;
  selectedMaxPrice: number | undefined;
  selectedRating: number | undefined;
  selectedShippingFree: boolean | undefined;
  displayMode?: ListingFilterDisplayMode;
  rootCategoryId?: string;
  translations?: CmsTranslations;
  onFilterChange: (event: ListingFilterChangeEvent) => void;
  className?: string;
  style?: CSSProperties;
};

export function SwProductListingFilter({
  filter,
  selectedManufacturer,
  selectedProperties,
  selectedCategories = [],
  selectedMinPrice,
  selectedMaxPrice,
  selectedRating,
  selectedShippingFree,
  displayMode = "accordion",
  rootCategoryId,
  translations,
  onFilterChange,
  className,
  style,
}: SwProductListingFilterProps) {
  const selectedFilters: SelectedListingFilters = {
    price: { min: selectedMinPrice, max: selectedMaxPrice },
    rating: selectedRating,
    "shipping-free": selectedShippingFree,
    manufacturer: selectedManufacturer,
    properties: selectedProperties,
    categories: selectedCategories,
  };

  const renderFilter = () => {
    switch (filter.code) {
      case "manufacturer":
        return (
          <SwFilterProperties
            filter={filter}
            selectedFilters={selectedFilters}
            displayMode={displayMode}
            onSelectValue={onFilterChange}
          />
        );
      case "categories":
        return (
          <SwFilterCategories
            filter={filter}
            selectedFilters={selectedFilters}
            displayMode={displayMode}
            rootCategoryId={rootCategoryId}
            translations={translations}
            onSelectValue={onFilterChange}
          />
        );
      case "price":
        return (
          <SwFilterPrice
            filter={filter}
            selectedFilters={selectedFilters}
            displayMode={displayMode}
            translations={translations}
            onSelectValue={onFilterChange}
          />
        );
      case "rating":
        return (
          <SwFilterRating
            filter={filter}
            selectedFilters={selectedFilters}
            displayMode={displayMode}
            onSelectValue={onFilterChange}
          />
        );
      case "shipping-free":
        return (
          <SwFilterShippingFree
            filter={filter}
            selectedFilters={selectedFilters}
            displayMode={displayMode}
            translations={translations}
            onSelectValue={onFilterChange}
          />
        );
      default:
        return "options" in filter ? (
          <SwFilterProperties
            filter={filter}
            selectedFilters={selectedFilters}
            displayMode={displayMode}
            onSelectValue={onFilterChange}
          />
        ) : null;
    }
  };

  return (
    <div
      data-testid={`listing-filter-${filter.code}`}
      className={cx(className) || undefined}
      style={style}
    >
      {renderFilter()}
    </div>
  );
}
