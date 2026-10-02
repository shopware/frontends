"use client";

import { useId, useState } from "react";

import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { ChevronDownIcon } from "../icons";
import { SwitchButton } from "../ui/SwitchButton";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterDisplayMode,
} from "./listingFilterTypes";

export type SwFilterShippingFreeProps = {
  filter: ListingFilter;
  selectedFilters: { "shipping-free"?: boolean };
  description?: string;
  displayMode?: ListingFilterDisplayMode;
  translations?: CmsTranslations;
  onSelectValue: (event: ListingFilterChangeEvent) => void;
};

const defaultTranslations = {
  listing: {
    freeShipping: "Free shipping",
  },
};

export function SwFilterShippingFree({
  filter,
  selectedFilters,
  description,
  displayMode = "accordion",
  translations,
  onSelectValue,
}: SwFilterShippingFreeProps) {
  const t = withTranslationDefaults(translations, defaultTranslations);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const panelId = useId();
  const toggle = () => setIsFilterVisible((visible) => !visible);

  const currentFilterData = !!selectedFilters["shipping-free"];

  const handleRadioUpdate = (value: boolean) => {
    onSelectValue({ code: filter.code, value: !!value });
  };

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      {displayMode === "accordion" && (
        <div className="self-stretch flex flex-col justify-center items-center">
          <button
            type="button"
            className="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer"
            onClick={toggle}
            aria-expanded={isFilterVisible}
            aria-controls={panelId}
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
        <div id={panelId} className="self-stretch">
          <div className="pt-6 space-y-4">
            <div className="self-stretch inline-flex justify-start items-start gap-2 w-full">
              <div className="flex-1 pt-[3px]">
                <SwitchButton
                  checked={currentFilterData}
                  onChange={handleRadioUpdate}
                  name={filter.code}
                  ariaLabel={filter.label}
                  label={filter.label}
                  description={description || t.listing.freeShipping}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
