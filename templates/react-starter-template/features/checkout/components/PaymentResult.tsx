import { cx } from "@shopware/cms-base-layer-react/client";
import Link from "next/link";

import { UndoIcon } from "./CheckoutIcons";

export const paymentResultCopy = {
  checkout: {
    yourOrder: "Your order",
    orderPaid: "has been paid",
    orderUnpaid: "is not paid",
    checkStatus:
      "You can now check the status of the order in your account. Thank you!",
    unpaidStatus:
      "Unfortunately, your order couldn't be paid. You can try to pay it again or contact us.",
    backToHomepage: "Back to homepage",
    checkOrderDetails: "Check the order details",
  },
};

const t = paymentResultCopy;

export type PaymentResultStatus = "paid" | "unpaid";

export function paymentResultTitle(status: PaymentResultStatus): string {
  return `${t.checkout.yourOrder} ${
    status === "paid" ? t.checkout.orderPaid : t.checkout.orderUnpaid
  }`;
}

export type PaymentResultProps = {
  status: PaymentResultStatus;
  href?: string;
};

export function PaymentResult({ status, href }: PaymentResultProps) {
  const paid = status === "paid";
  return (
    <div
      className="mx-auto my-24 w-full max-w-3xl px-4 text-center"
      data-testid={`checkout-payment-${status}`}
    >
      <h1 className="mb-4 text-4xl leading-none font-extrabold tracking-tight text-surface-on-surface md:text-5xl lg:text-6xl">
        {t.checkout.yourOrder}{" "}
        <span
          className={cx(
            "underline decoration-8 underline-offset-3",
            paid ? "decoration-states-success" : "decoration-states-error",
          )}
        >
          {paid ? t.checkout.orderPaid : t.checkout.orderUnpaid}
        </span>
      </h1>
      <p className="text-lg font-normal text-surface-on-surface-variant lg:text-xl">
        {paid ? t.checkout.checkStatus : t.checkout.unpaidStatus}
      </p>
      {href ? (
        <div className="mt-12 text-center">
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-center text-base font-medium text-brand-on-primary hover:bg-brand-primary-hover focus-visible:ring-4 focus-visible:ring-outline-outline-focus focus-visible:outline-hidden"
          >
            {paid ? t.checkout.backToHomepage : t.checkout.checkOrderDetails}
            <UndoIcon className="size-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
