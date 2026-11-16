"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

import { cx } from "../../helpers/cx";
import { ChevronDownIcon } from "../icons";
import type { ListingFilterDisplayMode } from "./listingFilterTypes";

export type SwFilterAccordionProps = {
  label: string;
  displayMode: ListingFilterDisplayMode;
  panelClassName?: string;
  children: ReactNode;
};

export function SwFilterAccordion({
  label,
  displayMode,
  panelClassName = "self-stretch flex flex-col justify-start items-start gap-4",
  children,
}: SwFilterAccordionProps) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const panelId = useId();

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      {displayMode === "accordion" && (
        <div className="self-stretch flex flex-col justify-center items-center">
          <button
            type="button"
            className="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer"
            onClick={() => setIsFilterVisible((visible) => !visible)}
            aria-expanded={isFilterVisible}
            aria-controls={panelId}
          >
            <div className="flex-1 flex items-center gap-2.5">
              <div className="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">
                {label}
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
        <div id={panelId} className={panelClassName}>
          {children}
        </div>
      )}
    </div>
  );
}
