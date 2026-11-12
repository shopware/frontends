"use client";

import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { SwitchButton } from "../ui/SwitchButton";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterDisplayMode,
} from "./listingFilterTypes";
import { SwFilterAccordion } from "./SwFilterAccordion";

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

  const currentFilterData = !!selectedFilters["shipping-free"];

  const handleRadioUpdate = (value: boolean) => {
    onSelectValue({ code: filter.code, value: !!value });
  };

  return (
    <SwFilterAccordion
      label={filter.label}
      displayMode={displayMode}
      panelClassName="self-stretch"
    >
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
    </SwFilterAccordion>
  );
}
