"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { ELLIPSIS, paginationCells } from "../pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "./OrderIcons";

const t = {
  layout: {
    ariaLabels: {
      pagination: "Pagination",
      page: "Page {page}",
      previousPage: "Previous page",
      nextPage: "Next page",
    },
  },
};

const CELL_CLASS =
  "relative inline-flex min-w-12 items-center justify-center border px-4 py-2 text-sm";

const ARROW_CLASS =
  "relative inline-flex items-center border border-outline-outline-variant bg-surface-surface px-2 py-2 text-sm text-surface-on-surface disabled:cursor-not-allowed disabled:opacity-40";

export type PaginationProps = {
  total: number;
  current: number;
  onChangePage: (page: number) => void;
  className?: string;
};

export function Pagination({
  total,
  current,
  onChangePage,
  className,
}: PaginationProps) {
  const change = (page: number) => {
    if (page === current || page < 1 || page > total) return;
    onChangePage(page);
  };

  return (
    <nav
      className={cx(
        "relative z-0 inline-flex space-x-px rounded-md",
        className,
      )}
      aria-label={t.layout.ariaLabels.pagination}
    >
      <button
        type="button"
        className={cx(ARROW_CLASS, "rounded-l-md")}
        disabled={current <= 1}
        aria-label={t.layout.ariaLabels.previousPage}
        onClick={() => change(current - 1)}
      >
        <ChevronLeftIcon className="size-5" />
      </button>
      {paginationCells(total, current).map((cell, index) =>
        cell === ELLIPSIS ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className={cx(
              CELL_CLASS,
              "border-outline-outline-variant bg-surface-surface text-surface-on-surface",
            )}
          >
            ...
          </span>
        ) : (
          <button
            key={cell}
            type="button"
            className={cx(
              CELL_CLASS,
              cell === current
                ? "cursor-default border-brand-primary bg-brand-primary text-brand-on-primary"
                : "border-outline-outline-variant bg-surface-surface text-surface-on-surface hover:bg-surface-surface-container-low",
            )}
            aria-current={cell === current ? "page" : undefined}
            aria-label={t.layout.ariaLabels.page.replace(
              "{page}",
              String(cell),
            )}
            onClick={() => change(cell)}
          >
            {cell}
          </button>
        ),
      )}
      <button
        type="button"
        className={cx(ARROW_CLASS, "rounded-r-md")}
        disabled={current >= total}
        aria-label={t.layout.ariaLabels.nextPage}
        onClick={() => change(current + 1)}
      >
        <ChevronRightIcon className="size-5" />
      </button>
    </nav>
  );
}
