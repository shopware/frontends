"use client";

import { excludeRootCategory, getTranslatedProperty } from "@shopware/helpers";
import { useId, useState } from "react";

import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { ChevronDownIcon } from "../icons";
import { Checkbox } from "../ui/Checkbox";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterDisplayMode,
} from "./listingFilterTypes";

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
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggle = () => setIsFilterVisible((visible) => !visible);
  const idPrefix = useId();

  const categoryOptions = excludeRootCategory(filter.entities, rootCategoryId);
  const selectedIds = selectedFilters.categories ?? [];
  const isChecked = (id: string) => selectedIds.includes(id);

  const selectValue = (id: string) => {
    onSelectValue({ code: filter.code, value: id });
  };

  if (categoryOptions.length === 0) return null;

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      {displayMode === "accordion" && (
        <div className="self-stretch flex flex-col justify-center items-center">
          <button
            type="button"
            className="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer"
            onClick={toggle}
            aria-expanded={isFilterVisible}
            aria-controls={filter.code}
            aria-label={t.listing.categories}
          >
            <div className="flex-1 flex items-center gap-2.5">
              <div className="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">
                {t.listing.categories}
              </div>
            </div>
            <span
              className="flex items-center justify-center"
              aria-hidden="true"
            >
              <ChevronDownIcon
                width={24}
                height={24}
                className={cx(
                  "transition-transform",
                  isFilterVisible && "rotate-180",
                )}
              />
            </span>
          </button>
        </div>
      )}

      {(isFilterVisible || displayMode === "dropdown") && (
        <div
          id={filter.code}
          className="self-stretch flex flex-col justify-start items-start gap-4"
        >
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
        </div>
      )}
    </div>
  );
}
