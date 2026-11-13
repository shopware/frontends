"use client";

import type { CSSProperties } from "react";

import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

export type SwPaginationProps = {
  total: number;
  current: number;
  onChangePage: (page: number) => void;
  translations?: CmsTranslations;
  className?: string;
  style?: CSSProperties;
};

const translationDefaults = {
  listing: {
    previous: "Previous",
    next: "Next",
  },
};

const PAGE_BUTTON_CLASS =
  "bg-white border-outline-outline-variant text-surface-on-surface-variant hover:bg-surface-surface-container-low relative inline-flex items-center px-4 py-2 border text-sm font-medium";

const ELLIPSIS_CLASS =
  "relative inline-flex items-center px-4 py-2 border border-outline-outline-variant bg-white text-sm font-medium text-surface-on-surface";

export function SwPagination({
  total,
  current,
  onChangePage,
  translations,
  className,
  style,
}: SwPaginationProps) {
  const t = withTranslationDefaults(translations, translationDefaults);

  return (
    <nav
      className={cx(
        "relative z-0 inline-flex rounded-md shadow-xs space-x-px",
        className,
      )}
      style={style}
      aria-label="Pagination"
    >
      {current - 1 >= 2 && (
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-outline-outline-variant bg-white text-sm font-medium text-surface-on-surface-variant hover:bg-surface-surface-container-low"
          onClick={() => onChangePage(current - 1)}
        >
          <span className="sr-only">{t.listing.previous}</span>
          <ChevronLeftIcon
            width={20}
            height={20}
            className="transition-transform"
          />
        </button>
      )}
      {current > 2 && (
        <button
          type="button"
          className={PAGE_BUTTON_CLASS}
          onClick={() => onChangePage(1)}
        >
          <span className="sr-only">Page </span>1
        </button>
      )}
      {current - 1 > 2 && <span className={ELLIPSIS_CLASS}>...</span>}
      {current > 1 && (
        <button
          type="button"
          className={cx(
            PAGE_BUTTON_CLASS,
            current === 2 &&
              "rounded-l-md border border-outline-outline-variant",
          )}
          onClick={() => onChangePage(current - 1)}
        >
          <span className="sr-only">Page </span>
          {current - 1}
        </button>
      )}
      <button
        type="button"
        aria-current="page"
        className={cx(
          "bg-surface-surface-primary border-brand-primary text-brand-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium",
          current - 1 >= 1
            ? ""
            : "rounded-l-md border border-outline-outline-variant",
          total === current &&
            "rounded-r-md border border-outline-outline-variant",
        )}
      >
        <span className="sr-only">Page </span>
        {current}
      </button>
      {current < total && (
        <button
          type="button"
          className={cx(
            PAGE_BUTTON_CLASS,
            total === current + 1 &&
              "rounded-r-md border border-outline-outline-variant",
          )}
          onClick={() => onChangePage(current + 1)}
        >
          <span className="sr-only">Page </span>
          {current + 1}
        </button>
      )}
      {total - current > 2 && <span className={ELLIPSIS_CLASS}>...</span>}
      {total - current > 1 && (
        <button
          type="button"
          className={PAGE_BUTTON_CLASS}
          onClick={() => onChangePage(total)}
        >
          {total}
        </button>
      )}
      {total > current + 1 && (
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-outline-outline-variant bg-white text-sm font-medium text-surface-on-surface-variant hover:bg-surface-surface-container-low"
          onClick={() => onChangePage(current + 1)}
        >
          <span className="sr-only">{t.listing.next}</span>
          <ChevronRightIcon
            width={20}
            height={20}
            className="transition-transform"
          />
        </button>
      )}
    </nav>
  );
}
