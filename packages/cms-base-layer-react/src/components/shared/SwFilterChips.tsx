"use client";

import { CloseIcon } from "../icons";
import type { ListingFilter, ListingFilterChip } from "./listingFilterTypes";

export type SwFilterChipsState = {
  manufacturer: string[];
  properties: string[];
  categories?: string[];
  "min-price"?: number;
  "max-price"?: number;
  rating?: number;
  "shipping-free"?: boolean;
};

export type SwFilterChipsProps = {
  filters: SwFilterChipsState;
  availableFilters: ListingFilter[];
  onRemove: (chip: ListingFilterChip) => void;
};

const getTranslatedName = (
  item: { translated?: { name?: string }; name?: string } | undefined,
): string | null => {
  if (!item) return null;
  if ("translated" in item) {
    return item.translated?.name || ("name" in item ? item.name : null) || null;
  }
  return null;
};

function getActiveChips(
  filters: SwFilterChipsState,
  availableFilters: ListingFilter[],
): ListingFilterChip[] {
  const chips: ListingFilterChip[] = [];

  for (const propertyId of filters.properties) {
    for (const filter of availableFilters) {
      if ("options" in filter && filter.options) {
        const option = filter.options.find((entry) => entry.id === propertyId);
        const name = getTranslatedName(option);
        if (name) {
          chips.push({ label: name, code: "properties", value: propertyId });
          break;
        }
      }
    }
  }

  const manufacturerFilter = availableFilters.find(
    (filter) => filter.code === "manufacturer",
  );
  if (manufacturerFilter?.entities) {
    for (const manufacturerId of filters.manufacturer) {
      const entity = manufacturerFilter.entities.find(
        (entry) => entry.id === manufacturerId,
      );
      const name = getTranslatedName(entity);
      if (name) {
        chips.push({
          label: name,
          code: "manufacturer",
          value: manufacturerId,
        });
      }
    }
  }

  const categoryFilter = availableFilters.find(
    (filter) => filter.code === "categories",
  );
  if (categoryFilter?.entities) {
    for (const categoryId of filters.categories ?? []) {
      const entity = categoryFilter.entities.find(
        (entry) => entry.id === categoryId,
      );
      const name = getTranslatedName(entity);
      if (name) {
        chips.push({ label: name, code: "categories", value: categoryId });
      }
    }
  }

  if (filters["min-price"] || filters["max-price"]) {
    const min = filters["min-price"] || 0;
    const max = filters["max-price"] || "∞";
    chips.push({
      label: `Price: ${min} - ${max}`,
      code: "price",
      value: "price-range",
    });
  }

  if (filters.rating) {
    chips.push({
      label: `Rating: ${filters.rating}★`,
      code: "rating",
      value: filters.rating,
    });
  }

  if (filters["shipping-free"]) {
    chips.push({
      label: "Free Shipping",
      code: "shipping-free",
      value: "true",
    });
  }

  return chips;
}

export function SwFilterChips({
  filters,
  availableFilters,
  onRemove,
}: SwFilterChipsProps) {
  const activeChips = getActiveChips(filters, availableFilters);
  if (activeChips.length === 0) return null;

  return (
    <div className="self-stretch inline-flex justify-start items-center gap-4 flex-wrap content-center mb-6">
      {activeChips.map((chip, index) => (
        <button
          key={`${chip.code}-${chip.value}-${index}`}
          type="button"
          onClick={() => onRemove(chip)}
          className="px-4 py-1.5 bg-brand-tertiary rounded-full inline-flex justify-center items-center gap-1 hover:bg-brand-tertiary-hover transition-colors"
        >
          <span className="text-brand-on-tertiary text-base font-normal leading-normal">
            {chip.label}
          </span>
          <CloseIcon className="w-5 h-5 text-brand-on-tertiary" />
        </button>
      ))}
    </div>
  );
}
