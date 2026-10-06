"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { useId, useRef } from "react";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";

import { ORDERS_PAGE_SIZE_OPTIONS } from "../ordersApi";
import { useOrderList } from "../useOrderList";
import { OrderLine } from "./OrderLine";
import { OrderLineSkeleton } from "./OrderLineSkeleton";
import { PageSizeSelector } from "./PageSizeSelector";
import { Pagination } from "./Pagination";

const t = {
  account: {
    order: {
      header: "Orders",
      subHeader: "View your current and past orders",
    },
  },
  listing: {
    loading: "Loading…",
    empty: "No results.",
    error: "Something went wrong while loading results.",
    retry: "Try again",
  },
};

const MAX_SKELETONS = 3;

function scrollToList(target: HTMLElement | null): void {
  if (!target) return;
  const top = target.getBoundingClientRect().top;
  if (top >= 0 && top <= document.documentElement.clientHeight) return;
  const reducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView?.({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

export function OrdersPageContent() {
  const list = useOrderList();
  const listRef = useRef<HTMLDivElement>(null);
  const pageSizeId = useId();

  const { status, data, limit, totalPages } = list;
  const currentPage = Math.min(list.page, totalPages);
  const loading = status === "loading";

  function changePage(page: number) {
    scrollToList(listRef.current);
    void list.changePage(page);
  }

  function renderBody() {
    if (status === "error") {
      return (
        <div className="py-8 text-center text-sm" role="alert">
          <p className="text-surface-on-surface-variant">{t.listing.error}</p>
          <button
            type="button"
            className="mt-3 text-surface-on-surface underline"
            onClick={() => {
              void list.retry();
            }}
          >
            {t.listing.retry}
          </button>
        </div>
      );
    }

    if (!data) {
      return (
        <div aria-busy="true" data-testid="orders-loading">
          <output className="sr-only">{t.listing.loading}</output>
          {Array.from(
            { length: Math.min(limit, MAX_SKELETONS) },
            (_, index) => (
              <OrderLineSkeleton key={index} className="mb-4" />
            ),
          )}
        </div>
      );
    }

    if (data.elements.length === 0) {
      return (
        <p className="py-8 text-center text-sm text-surface-on-surface-variant">
          {t.listing.empty}
        </p>
      );
    }

    return (
      <>
        <div
          className={cx(
            "transition-opacity",
            loading && "pointer-events-none opacity-60",
          )}
          aria-busy={loading}
        >
          {data.elements.map((order) => (
            <OrderLine key={order.id} order={order} className="mb-4" />
          ))}
        </div>
        <div className="mt-8 mb-12 flex flex-col items-center gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-2">
          <Pagination
            className="sm:col-start-2"
            total={totalPages}
            current={currentPage}
            onChangePage={changePage}
          />
          <PageSizeSelector
            id={pageSizeId}
            className="sm:col-start-3 sm:justify-self-end"
            value={limit}
            options={ORDERS_PAGE_SIZE_OPTIONS}
            onChange={(size) => {
              void list.changeLimit(size);
            }}
          />
        </div>
      </>
    );
  }

  return (
    <div>
      <AccountPageHeader
        className="mb-14"
        title={t.account.order.header}
        subtitle={t.account.order.subHeader}
      />
      <div ref={listRef}>{renderBody()}</div>
    </div>
  );
}
