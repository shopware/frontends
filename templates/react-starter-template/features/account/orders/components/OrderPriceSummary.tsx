"use client";

import { useId } from "react";

import { Price } from "@/components/Price";
import { useTranslations } from "@/i18n/I18nProvider";

export type OrderPriceSummaryProps = {
  subtotal?: number;
  shippingCosts?: number;
  total?: number;
};

export function OrderPriceSummary({
  subtotal,
  shippingCosts,
  total,
}: OrderPriceSummaryProps) {
  const headingId = useId();
  const t = useTranslations();
  return (
    <section className="w-full sm:w-1/3" aria-labelledby={headingId}>
      <div className="rounded-lg bg-surface-surface-container-low p-4">
        <h3
          id={headingId}
          className="mb-2 text-lg font-semibold text-surface-on-surface"
        >
          {t("account.orderDetails.orderSummary")}
        </h3>
        <dl>
          <div className="mb-2 flex justify-between">
            <dt className="text-sm text-surface-on-surface-variant">
              {t("account.orderDetails.subtotal")}
            </dt>
            <dd className="text-sm text-surface-on-surface">
              <Price
                value={subtotal}
                className="font-normal text-surface-on-surface"
                data-testid="order-subtotal"
              />
            </dd>
          </div>
          <div className="mb-2 flex justify-between">
            <dt className="text-sm text-surface-on-surface-variant">
              {t("account.orderDetails.shipping")}
            </dt>
            <dd className="text-sm text-surface-on-surface">
              <Price
                value={shippingCosts}
                className="font-normal text-surface-on-surface"
                data-testid="order-shipping"
              />
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-outline-outline-variant pt-2">
            <dt className="text-base font-semibold text-surface-on-surface">
              {t("account.orderDetails.total")}
            </dt>
            <dd className="text-base font-semibold text-surface-on-surface">
              <Price
                value={total}
                className="text-surface-on-surface"
                data-testid="order-total"
              />
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
