"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { LocaleLink } from "@/components/LocaleLink";
import { useTranslations } from "@/i18n/I18nProvider";

import type { PaymentResultStatus } from "../paymentResult";
import { UndoIcon } from "./CheckoutIcons";

export type PaymentResultProps = {
  status: PaymentResultStatus;
  href?: string;
};

export function PaymentResult({ status, href }: PaymentResultProps) {
  const t = useTranslations();
  const paid = status === "paid";
  return (
    <div
      className="mx-auto my-24 w-full max-w-3xl px-4 text-center"
      data-testid={`checkout-payment-${status}`}
    >
      <h1 className="mb-4 text-4xl leading-none font-extrabold tracking-tight text-surface-on-surface md:text-5xl lg:text-6xl">
        {t("checkout.yourOrder")}{" "}
        <span
          className={cx(
            "underline decoration-8 underline-offset-3",
            paid ? "decoration-states-success" : "decoration-states-error",
          )}
        >
          {t(paid ? "checkout.orderPaid" : "checkout.orderUnpaid")}
        </span>
      </h1>
      <p className="text-lg font-normal text-surface-on-surface-variant lg:text-xl">
        {t(paid ? "checkout.checkStatus" : "checkout.unpaidStatus")}
      </p>
      {href ? (
        <div className="mt-12 text-center">
          <LocaleLink
            href={href}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-center text-base font-medium text-brand-on-primary hover:bg-brand-primary-hover focus-visible:ring-4 focus-visible:ring-outline-outline-focus focus-visible:outline-hidden"
          >
            {t(paid ? "checkout.backToHomepage" : "checkout.checkOrderDetails")}
            <UndoIcon className="size-4" />
          </LocaleLink>
        </div>
      ) : null}
    </div>
  );
}
