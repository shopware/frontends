"use client";

import type { CSSProperties, ChangeEvent } from "react";

import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { ChevronDownIcon } from "../icons";
import { SwPagination } from "./SwPagination";

export type SwProductListingPaginationProps = {
  total: number;
  current: number;
  limit: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
  translations?: CmsTranslations;
  className?: string;
  style?: CSSProperties;
};

const translationDefaults = {
  listing: {
    perPage: "Per Page:",
    product: "Product",
    products: "Products",
  },
};

export function SwProductListingPagination({
  total,
  current,
  limit,
  onChangePage,
  onChangeLimit,
  translations,
  className,
  style,
}: SwProductListingPaginationProps) {
  const t = withTranslationDefaults(translations, translationDefaults);

  if (total <= 0) return null;

  const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChangeLimit(Number(event.target.value));
  };

  return (
    <div
      className={cx("flex flex-col gap-6 sm:gap-8 mt-6 sm:mt-8", className)}
      style={style}
    >
      <div className="flex justify-center w-full">
        <SwPagination
          total={total}
          current={current}
          translations={translations}
          onChangePage={onChangePage}
        />
      </div>

      <div className="flex justify-center items-center gap-3 sm:gap-4">
        <label
          htmlFor="limit"
          className="text-sm sm:text-base text-surface-on-surface"
          data-testid="listing-pagination-limit-label"
        >
          {t.listing.perPage}
        </label>
        <div className="relative">
          <select
            id="limit"
            name="limitchoices"
            value={limit}
            onChange={handleLimitChange}
            className="appearance-none bg-surface-surface border border-outline-outline hover:border-outline-outline-primary focus:border-outline-outline-primary focus:ring-2 focus:ring-outline-outline-primary/20 px-4 py-2 pr-10 rounded-md text-sm sm:text-base text-surface-on-surface cursor-pointer transition-colors"
            data-testid="listing-pagination-limit-select"
          >
            <option value={1}>{`1 ${t.listing.product}`}</option>
            <option value={15}>{`15 ${t.listing.products}`}</option>
            <option value={30}>{`30 ${t.listing.products}`}</option>
            <option value={45}>{`45 ${t.listing.products}`}</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon
              width={16}
              height={16}
              className="transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
