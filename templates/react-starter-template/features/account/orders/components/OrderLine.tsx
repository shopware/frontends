"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { getTranslatedProperty } from "@shopware/helpers";
import { useId, useState } from "react";

import type { Schemas } from "#shopware";
import { ChevronDownIcon } from "@/components/icons";
import { LocaleLink } from "@/components/LocaleLink";
import { Price } from "@/components/Price";
import { formatOrderDate } from "@/features/checkout/components/OrderConfirmation";
import { OrderLineItems } from "@/features/checkout/components/OrderLineItems";
import { OrderStatus } from "@/features/checkout/components/OrderStatus";
import {
  getOrderPaymentMethod,
  getOrderShippingMethod,
  getOrderTotals,
} from "@/features/checkout/orderDetails";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import type { Translate } from "@/i18n/translate";

export function orderDetailsHref(orderId: string): string {
  return `/account/order/details/${encodeURIComponent(orderId)}`;
}

function translatedName(
  entity: { name?: string; translated?: { name?: string } } | null | undefined,
): string {
  if (!entity) return "";
  return getTranslatedProperty(entity, "name") || entity.name || "";
}

function shippingStatusLabel(order: Schemas["Order"], t: Translate): string {
  const state =
    order.deliveries?.[0]?.stateMachineState ?? order.stateMachineState;
  return (
    translatedName(state) ||
    state?.technicalName ||
    t("account.order.statusUnknown")
  );
}

function LineData({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="border-b border-outline-outline-variant p-4 leading-6 font-bold text-surface-on-surface">
        {label}:
      </dt>
      <dd className="p-4 leading-6">{value}</dd>
    </div>
  );
}

export function OrderLine({
  order,
  className,
}: {
  order: Schemas["Order"];
  className?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const headingId = useId();
  const productsId = useId();
  const products = (order.lineItems ?? []).filter(
    (lineItem) => lineItem.type === "product",
  );
  const paymentMethod = getOrderPaymentMethod(order);
  const shippingMethod = getOrderShippingMethod(order);
  const { subtotal, shippingCosts, total } = getOrderTotals(order);
  const orderDate = order.orderDate
    ? formatOrderDate(order.orderDate, locale)
    : "";

  return (
    <article
      className={cx("border border-outline-outline p-4", className)}
      aria-labelledby={headingId}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-outline-outline pb-2">
        <div>
          <h2 id={headingId} className="font-bold text-surface-on-surface">
            <LocaleLink
              href={orderDetailsHref(order.id)}
              className="hover:text-brand-primary"
            >
              {t("account.order.orderLabel")}: {order.orderNumber}
            </LocaleLink>
          </h2>
          {orderDate ? (
            <p className="text-sm text-surface-on-surface-variant">
              {t("account.order.orderDate")}:{" "}
              <time dateTime={order.orderDate}>{orderDate}</time>
            </p>
          ) : null}
        </div>
        {order.stateMachineState ? (
          <OrderStatus state={order.stateMachineState} />
        ) : null}
      </div>

      <dl className="mt-4 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {order.orderNumber ? (
          <LineData
            label={t("account.order.orderNumber")}
            value={order.orderNumber}
          />
        ) : null}
        <LineData
          label={t("account.order.shippingStatus")}
          value={shippingStatusLabel(order, t)}
        />
        {paymentMethod ? (
          <LineData
            label={t("account.order.paymentMethod")}
            value={translatedName(paymentMethod)}
          />
        ) : null}
        {shippingMethod ? (
          <LineData
            label={t("account.order.shippingMethod")}
            value={translatedName(shippingMethod)}
          />
        ) : null}
      </dl>

      {products.length > 0 ? (
        <div className="mt-4 mb-2">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 border-b border-brand-primary bg-transparent text-sm text-brand-primary transition-opacity hover:opacity-80"
            aria-expanded={expanded}
            aria-controls={productsId}
            onClick={() => setExpanded((current) => !current)}
          >
            <span>
              {expanded
                ? t("account.order.seeLess")
                : t("account.order.seeMore")}
            </span>
            <ChevronDownIcon
              className={cx(
                "h-2 w-3.5 transition-transform duration-300 ease-in-out",
                expanded && "rotate-180",
              )}
            />
          </button>
        </div>
      ) : null}
      <div id={productsId} className="mt-4 overflow-hidden">
        {expanded ? <OrderLineItems lineItems={products} /> : null}
      </div>

      <dl className="mt-4">
        <div className="flex justify-between">
          <dt className="text-sm text-surface-on-surface-variant">
            {t("account.order.subtotal")}
          </dt>
          <dd>
            <Price
              value={subtotal}
              className="text-sm text-surface-on-surface"
            />
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-surface-on-surface-variant">
            {t("account.order.shipping")}
          </dt>
          <dd>
            <Price
              value={shippingCosts}
              className="text-sm text-surface-on-surface"
            />
          </dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-outline-outline-variant pt-2">
          <dt className="text-surface-on-surface">
            {t("account.order.total")}
          </dt>
          <dd>
            <Price value={total} className="text-surface-on-surface" />
          </dd>
        </div>
      </dl>
    </article>
  );
}
