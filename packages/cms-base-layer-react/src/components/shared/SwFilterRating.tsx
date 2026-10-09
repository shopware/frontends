"use client";

import { useId, useState } from "react";

import { cx } from "../../helpers/cx";
import { ChevronDownIcon, StarFilledIcon, StarIcon } from "../icons";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterDisplayMode,
} from "./listingFilterTypes";

export type SwFilterRatingProps = {
  filter: ListingFilter;
  selectedFilters: { rating?: number };
  displayMode?: ListingFilterDisplayMode;
  onSelectValue: (event: ListingFilterChangeEvent) => void;
};

const STARS = [1, 2, 3, 4, 5];

export function SwFilterRating({
  filter,
  selectedFilters,
  displayMode = "accordion",
  onSelectValue,
}: SwFilterRatingProps) {
  const [isHoverActive, setIsHoverActive] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const panelId = useId();
  const toggle = () => setIsFilterVisible((visible) => !visible);

  const displayedScore = isHoverActive
    ? hoveredIndex
    : (selectedFilters.rating ?? 0);

  const hoverRating = (key: number) => {
    setHoveredIndex(key);
    setIsHoverActive(true);
  };

  const onChangeRating = (key: number) => {
    const newValue = selectedFilters.rating !== key ? key : undefined;
    onSelectValue({ code: filter.code, value: newValue });
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
        <div
          id={panelId}
          className="self-stretch flex flex-col justify-start items-start gap-4"
        >
          <div className="flex flex-row items-center gap-2 mt-2">
            {STARS.map((index) => {
              const Star = displayedScore >= index ? StarFilledIcon : StarIcon;
              return (
                <button
                  key={index}
                  type="button"
                  className="h-6 w-6 cursor-pointer"
                  aria-pressed={selectedFilters.rating === index}
                  aria-label={`${index} star${index !== 1 ? "s" : ""}`}
                  onMouseLeave={() => setIsHoverActive(false)}
                  onBlur={() => setIsHoverActive(false)}
                  onMouseOver={() => hoverRating(index)}
                  onFocus={() => hoverRating(index)}
                  onClick={() => {
                    hoverRating(index);
                    onChangeRating(index);
                  }}
                >
                  <Star className="h-6 w-6" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
