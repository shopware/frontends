"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { useListingNavigation } from "../../listing/useListingNavigation";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { ProductCardSkeleton } from "../shared/ProductCardSkeleton";
import { SwProductListingPagination } from "../shared/SwProductListingPagination";

export type CmsElementProductListingResultsProps = {
  productCount: number;
  limit: number;
  total: number;
  current: number;
  placeholderColor: string;
  isProductSearch?: boolean;
  translations?: CmsTranslations;
  children: ReactNode;
};

const GRID_CLASS =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16";

const translationDefaults = {
  listing: {
    noProducts: "No products found 😔",
  },
};

export function CmsElementProductListingResults({
  productCount,
  limit,
  total,
  current,
  placeholderColor,
  isProductSearch = false,
  translations,
  children,
}: CmsElementProductListingResultsProps) {
  const t = withTranslationDefaults(translations, translationDefaults);
  const { isPending, setPage, setLimit } = useListingNavigation({
    isProductSearch,
  });
  const productListElement = useRef<HTMLDivElement>(null);
  const scrollAfterUpdate = useRef(false);
  const [requestedLimit, setRequestedLimit] = useState<number | null>(null);
  const [syncedLimit, setSyncedLimit] = useState(limit);

  if (syncedLimit !== limit) {
    setSyncedLimit(limit);
    setRequestedLimit(null);
  }

  useEffect(() => {
    if (isPending || !scrollAfterUpdate.current) return;
    scrollAfterUpdate.current = false;
    productListElement.current?.scrollIntoView({ behavior: "smooth" });
  }, [isPending]);

  const changePage = (page: number) => {
    scrollAfterUpdate.current = true;
    setPage(page);
  };

  const changeLimit = (newLimit: number) => {
    scrollAfterUpdate.current = true;
    setRequestedLimit(newLimit);
    setLimit(newLimit);
  };

  if (isPending) {
    const skeletonCount = requestedLimit ?? limit;
    return (
      <div data-testid="loading" className={GRID_CLASS}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductCardSkeleton
            key={index}
            ctx={{ config: { imagePlaceholder: { color: placeholderColor } } }}
            className="w-full"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {productCount < 1 && (
        <div className="text-center text-xl py-16 text-surface-on-surface-variant">
          {t.listing.noProducts}
        </div>
      )}
      <div ref={productListElement} className={GRID_CLASS}>
        {children}
      </div>
      <SwProductListingPagination
        total={total}
        current={current}
        limit={limit}
        translations={translations}
        onChangePage={changePage}
        onChangeLimit={changeLimit}
      />
    </>
  );
}
