"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { useTranslations } from "@/i18n/I18nProvider";

const BAR = "rounded bg-surface-on-surface/10";

const ROWS = [0, 1, 2];

function AddressPlaceholder() {
  return (
    <div className="flex-1">
      <div className={cx("mb-3 h-5 w-1/3", BAR)} />
      <div className={cx("mb-2 h-3 w-2/3", BAR)} />
      <div className={cx("mb-2 h-3 w-1/2", BAR)} />
      <div className={cx("h-3 w-1/3", BAR)} />
    </div>
  );
}

function CardPlaceholder() {
  return (
    <div className="mt-8 rounded-lg bg-surface-on-surface/5 p-6">
      <div className={cx("mb-4 h-5 w-1/4", BAR)} />
      <div className={cx("h-4 w-1/3", BAR)} />
    </div>
  );
}

export function OrderDetailSkeleton() {
  const t = useTranslations();
  return (
    <div className="animate-pulse" aria-busy="true" data-testid="loading">
      <output className="sr-only">{t("form.loading")}</output>
      <div aria-hidden="true">
        <div className="mb-6 flex flex-col justify-between sm:flex-row">
          <div className={cx("h-4 w-1/4", BAR)} />
          <div className={cx("mt-4 h-6 w-24 sm:mt-0", BAR)} />
        </div>
        <div className="mb-2 h-12 rounded-lg bg-surface-on-surface/10" />
        {ROWS.map((row) => (
          <div
            key={row}
            className="flex items-center gap-4 border-b border-outline-outline-variant py-4"
          >
            <div className={cx("size-10", BAR)} />
            <div className={cx("h-4 w-2/3 flex-1", BAR)} />
            <div className={cx("h-4 w-10", BAR)} />
            <div className={cx("h-4 w-16", BAR)} />
            <div className={cx("h-4 w-16", BAR)} />
          </div>
        ))}
        <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row">
          <AddressPlaceholder />
          <AddressPlaceholder />
          <div className="w-full sm:w-1/3">
            <div className="rounded-lg bg-surface-on-surface/5 p-4">
              <div className={cx("mb-4 h-5 w-1/2", BAR)} />
              <div className="mb-2 flex justify-between">
                <div className={cx("h-3 w-1/4", BAR)} />
                <div className={cx("h-3 w-1/5", BAR)} />
              </div>
              <div className="mb-2 flex justify-between">
                <div className={cx("h-3 w-1/4", BAR)} />
                <div className={cx("h-3 w-1/5", BAR)} />
              </div>
              <div className="mt-2 flex justify-between border-t border-outline-outline-variant pt-2">
                <div className={cx("h-4 w-1/4", BAR)} />
                <div className={cx("h-4 w-1/5", BAR)} />
              </div>
            </div>
          </div>
        </div>
        <CardPlaceholder />
        <CardPlaceholder />
      </div>
    </div>
  );
}
