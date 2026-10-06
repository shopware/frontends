"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import { getShippingMethodDeliveryTime } from "@shopware/helpers";
import Link from "next/link";

import type { Schemas } from "#shopware";
import { CheckmarkIcon } from "@/components/icons";
import { Price } from "@/components/Price";

import {
  getOrderBillingAddress,
  getOrderPaymentMethod,
  getOrderShippingAddress,
  getOrderShippingMethod,
  getOrderTotals,
} from "../orderDetails";
import { OrderAddress } from "./OrderAddress";
import { OrderLineItems } from "./OrderLineItems";
import { OrderMethodCard } from "./OrderMethodCard";
import { OrderStatus } from "./OrderStatus";

const t = {
  checkout: {
    summary: "Summary",
    subtotal: "Subtotal",
    success: {
      title: "Thank you for your order",
      header:
        "We have received your order #{0} and will process it as soon as possible.",
      items: "Items ordered",
      deliveryAndPayment: "Delivery and payment",
      continueShopping: "Continue shopping",
      viewInAccount: "View in my account",
      goToPayment: "Go to payment",
      paymentProcessLabel: "Finish payment process.",
      paymentProcessInfo:
        "You will be redirected to the payment gateway in 5 seconds.",
    },
    shippingAddressLabel: "Shipping address",
    paymentMethodLabel: "Payment method",
    billingAddressLabel: "Billing address",
    shippingMethodLabel: "Shipping method",
    takesUpTo: "Takes up to",
    shippingPriceLabel: "Shipping",
    totalLabel: "Total",
  },
  account: {
    order: {
      orderNumber: "Order number",
    },
  },
};

const ORDER_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const PRIMARY_LINK_CLASS =
  "inline-flex items-center justify-center rounded bg-brand-primary px-4 py-3 text-center leading-6 font-bold text-brand-on-primary";

const SECONDARY_LINK_CLASS =
  "inline-flex items-center justify-center rounded border border-brand-primary px-4 py-3 text-center leading-6 font-bold text-brand-primary";

export function formatOrderDate(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "" : ORDER_DATE_FORMAT.format(parsed);
}

function SectionHeader({ title, id }: { title: string; id: string }) {
  return (
    <div className="border-b border-outline-outline pb-2">
      <h2 id={id} className="font-bold text-surface-on-surface">
        {title}
      </h2>
    </div>
  );
}

export type OrderConfirmationProps = {
  order: Schemas["Order"];
  paymentUrl: string | null;
  onGoToPayment: (url: string) => void;
  showAccountLink?: boolean;
};

export function OrderConfirmation({
  order,
  paymentUrl,
  onGoToPayment,
  showAccountLink = false,
}: OrderConfirmationProps) {
  const shippingAddress = getOrderShippingAddress(order);
  const billingAddress = getOrderBillingAddress(order);
  const shippingMethod = getOrderShippingMethod(order);
  const paymentMethod = getOrderPaymentMethod(order);
  const { subtotal, shippingCosts, total } = getOrderTotals(order);
  const deliveryTime = shippingMethod
    ? getShippingMethodDeliveryTime(shippingMethod)
    : undefined;
  const orderDate = order.orderDate ? formatOrderDate(order.orderDate) : "";

  return (
    <div
      className="mx-auto w-full max-w-screen-2xl px-4 py-10 md:py-20"
      data-testid="checkout-success-page"
    >
      <header className="mb-10 flex items-start gap-4 md:mb-16 md:gap-6">
        <div
          className="flex size-12.5 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-brand-on-secondary"
          aria-hidden="true"
        >
          <CheckmarkIcon className="size-6" />
        </div>
        <div className="min-w-0">
          <h1 className="font-serif text-[40px] leading-15 text-surface-on-surface">
            {t.checkout.success.title}
          </h1>
          <p className="mt-2 max-w-2xl leading-normal text-surface-on-surface">
            {t.checkout.success.header.replace("{0}", order.orderNumber ?? "")}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {order.orderNumber ? (
              <span className="text-sm text-surface-on-surface-variant">
                {t.account.order.orderNumber}{" "}
                <span
                  className="font-medium text-surface-on-surface"
                  data-testid="order-number"
                >
                  {order.orderNumber}
                </span>
              </span>
            ) : null}
            {order.stateMachineState ? (
              <OrderStatus state={order.stateMachineState} />
            ) : null}
            {orderDate ? (
              <time
                dateTime={order.orderDate}
                className="text-sm text-surface-on-surface-variant"
              >
                {orderDate}
              </time>
            ) : null}
          </div>
        </div>
      </header>

      {paymentUrl ? (
        <div
          className="mb-10 bg-states-info-container p-4 text-sm text-states-on-info-container"
          role="alert"
        >
          <div className="font-medium">
            {t.checkout.success.paymentProcessLabel}
          </div>
          <p className="mt-1">{t.checkout.success.paymentProcessInfo}</p>
          <BaseButton
            className="mt-4"
            onClick={() => onGoToPayment(paymentUrl)}
          >
            {t.checkout.success.goToPayment}
          </BaseButton>
        </div>
      ) : null}

      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:gap-20">
        <div className="order-2 flex w-full flex-col gap-10 lg:order-1 lg:w-1/2">
          <section aria-labelledby="order-items-heading">
            <SectionHeader
              id="order-items-heading"
              title={t.checkout.success.items}
            />
            <div className="mt-4">
              <OrderLineItems lineItems={order.lineItems ?? []} />
            </div>
          </section>

          <section aria-labelledby="order-delivery-heading">
            <SectionHeader
              id="order-delivery-heading"
              title={t.checkout.success.deliveryAndPayment}
            />
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {shippingAddress ? (
                <OrderAddress
                  address={shippingAddress}
                  label={t.checkout.shippingAddressLabel}
                />
              ) : null}
              {billingAddress ? (
                <OrderAddress
                  address={billingAddress}
                  label={t.checkout.billingAddressLabel}
                />
              ) : null}
              <OrderMethodCard
                label={t.checkout.paymentMethodLabel}
                title={paymentMethod?.translated?.name ?? paymentMethod?.name}
              />
              {shippingMethod ? (
                <OrderMethodCard
                  label={t.checkout.shippingMethodLabel}
                  title={shippingMethod.translated?.name ?? shippingMethod.name}
                  description={
                    deliveryTime
                      ? `${t.checkout.takesUpTo} ${deliveryTime}`
                      : undefined
                  }
                />
              ) : null}
            </div>
          </section>
        </div>

        <aside className="order-1 w-full lg:order-2 lg:w-1/2">
          <section
            className="sticky top-2 border border-outline-outline"
            aria-labelledby="order-summary-heading"
          >
            <div className="border-b border-outline-outline-variant">
              <h2
                id="order-summary-heading"
                className="px-6 font-serif text-[40px] text-surface-on-surface"
              >
                {t.checkout.summary}
              </h2>
            </div>
            <div className="p-6">
              <dl className="flex flex-col gap-1 border-b border-outline-outline-variant py-4">
                <div className="flex justify-between text-sm leading-normal">
                  <dt className="text-surface-on-surface-variant">
                    {t.checkout.subtotal}
                  </dt>
                  <dd>
                    <Price
                      value={subtotal}
                      className="font-normal text-surface-on-surface"
                      data-testid="order-subtotal"
                    />
                  </dd>
                </div>
                <div className="flex justify-between text-sm leading-normal">
                  <dt className="text-surface-on-surface-variant">
                    {t.checkout.shippingPriceLabel}
                  </dt>
                  <dd>
                    <Price
                      value={shippingCosts}
                      className="font-normal text-surface-on-surface"
                      data-testid="order-shipping"
                    />
                  </dd>
                </div>
              </dl>
              <dl className="flex justify-between pt-4">
                <dt className="text-base leading-normal text-surface-on-surface">
                  {t.checkout.totalLabel}
                </dt>
                <dd>
                  <Price
                    value={total}
                    className="text-base leading-normal text-surface-on-surface"
                    data-testid="order-total"
                  />
                </dd>
              </dl>

              <div className="mt-8 flex flex-col gap-3">
                <Link href="/" className={PRIMARY_LINK_CLASS}>
                  {t.checkout.success.continueShopping}
                </Link>
                {showAccountLink ? (
                  <Link
                    href={`/account/order/details/${encodeURIComponent(order.id)}`}
                    className={SECONDARY_LINK_CLASS}
                  >
                    {t.checkout.success.viewInAccount}
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
