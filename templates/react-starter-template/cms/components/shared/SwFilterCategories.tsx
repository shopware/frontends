"use client";

import { excludeRootCategory, getTranslatedProperty } from "@shopware/helpers";
import { useId } from "react";

import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { Checkbox } from "../ui/Checkbox";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterDisplayMode,
} from "./listingFilterTypes";
import { SwFilterAccordion } from "./SwFilterAccordion";

export type SwFilterCategoriesProps = {
  filter: ListingFilter;
  selectedFilters: { categories?: string[] };
  displayMode?: ListingFilterDisplayMode;
  rootCategoryId?: string;
  translations?: CmsTranslations;
  onSelectValue: (event: ListingFilterChangeEvent) => void;
};

const defaultTranslations = {
  listing: {
    categories: "Categories",
  },
};

export function SwFilterCategories({
  filter,
  selectedFilters,
  displayMode = "accordion",
  rootCategoryId,
  translations,
  onSelectValue,
}: SwFilterCategoriesProps) {
  const t = withTranslationDefaults(translations, defaultTranslations);
  const idPrefix = useId();

  const categoryOptions = excludeRootCategory(filter.entities, rootCategoryId);
  const selectedIds = selectedFilters.categories ?? [];
  const isChecked = (id: string) => selectedIds.includes(id);

  const selectValue = (id: string) => {
    onSelectValue({ code: filter.code, value: id });
  };

  if (categoryOptions.length === 0) return null;

  return (
    <SwFilterAccordion label={t.listing.categories} displayMode={displayMode}>
      <fieldset className="self-stretch flex flex-col justify-start items-start gap-4">
        <legend className="sr-only">{t.listing.categories}</legend>
        {categoryOptions.map((option) => (
          <label
            key={option.id}
            htmlFor={`${idPrefix}${option.id}`}
            className="self-stretch inline-flex justify-start items-start gap-2 cursor-pointer"
          >
            <div className="w-4 self-stretch pt-[3px] flex justify-start items-start gap-2.5">
              <Checkbox
                id={`${idPrefix}${option.id}`}
                checked={isChecked(option.id)}
                onChange={() => selectValue(option.id)}
              />
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-0.5">
              <div className="inline-flex justify-start items-center gap-1">
                <div className="flex-1 text-surface-on-surface text-base font-normal leading-normal">
                  {getTranslatedProperty(option, "name")}
                </div>
              </div>
            </div>
          </label>
        ))}
      </fieldset>
    </SwFilterAccordion>
  );
}
