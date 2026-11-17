"use client";

import { useState } from "react";

import { StarFilledIcon, StarIcon } from "../icons";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterDisplayMode,
} from "./listingFilterTypes";
import { SwFilterAccordion } from "./SwFilterAccordion";

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
    <SwFilterAccordion label={filter.label} displayMode={displayMode}>
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
    </SwFilterAccordion>
  );
}
