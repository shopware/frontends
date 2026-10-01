"use client";

import { getTranslatedProperty } from "@shopware/helpers";
import { useId, useState } from "react";

import { cx } from "../../helpers/cx";
import { ChevronDownIcon } from "../icons";
import { Checkbox } from "../ui/Checkbox";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterDisplayMode,
} from "./listingFilterTypes";

export type SwFilterPropertiesProps = {
  filter: ListingFilter;
  selectedFilters: { manufacturer?: string[]; properties?: string[] };
  displayMode?: ListingFilterDisplayMode;
  onSelectValue: (event: ListingFilterChangeEvent) => void;
};

export function SwFilterProperties({
  filter,
  selectedFilters,
  displayMode = "accordion",
  onSelectValue,
}: SwFilterPropertiesProps) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggle = () => setIsFilterVisible((visible) => !visible);
  const idPrefix = useId();

  const selectedIds =
    filter.code === "manufacturer"
      ? (selectedFilters.manufacturer ?? [])
      : (selectedFilters.properties ?? []);
  const isChecked = (id: string) => selectedIds.includes(id);

  const selectValue = (id: string) => {
    const emitCode =
      filter.code === "manufacturer" ? "manufacturer" : "properties";
    onSelectValue({ code: emitCode, value: id });
  };

  const options = filter.options ?? filter.entities ?? [];

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
            aria-label={filter.label}
          >
            <div className="flex-1 flex items-center gap-2.5">
              <div className="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">
                {filter.label}
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
            <legend className="sr-only">{filter.name}</legend>
            {options.map((option) => (
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
