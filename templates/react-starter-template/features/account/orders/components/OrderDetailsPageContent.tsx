"use client";

import { use } from "react";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { useTranslations } from "@/i18n/I18nProvider";
import type { Translate } from "@/i18n/translate";

import { useOrderDetails } from "../useOrderDetails";
import { OrderBackLink } from "./OrderBackLink";
import { OrderDetailSkeleton } from "./OrderDetailSkeleton";
import { OrderDetailView } from "./OrderDetailView";

export function orderTitle(
  t: Translate,
  orderNumber: string | undefined,
): string {
  const label = t("account.orderDetails.order");
  return orderNumber ? `${label} #${orderNumber}` : label;
}

export type OrderDetailsPageContentProps = {
  params: Promise<{ id: string }>;
};

export function OrderDetailsPageContent({
  params,
}: OrderDetailsPageContentProps) {
  const { id } = use(params);
  return <OrderDetails key={id} orderId={id} />;
}

function OrderDetails({ orderId }: { orderId: string }) {
  const t = useTranslations();
  const { state, reload } = useOrderDetails(orderId);

  function renderBody() {
    switch (state.status) {
      case "loading":
        return <OrderDetailSkeleton />;
      case "notFound":
        return (
          <p role="alert" className="text-surface-on-surface">
            {t("account.messages.orderSuccessNoOrder")}
          </p>
        );
      case "error":
        return (
          <div role="alert" className="text-sm">
            <p className="text-surface-on-surface-variant">
              {t("listing.error")}
            </p>
            <button
              type="button"
              className="mt-3 text-surface-on-surface underline"
              onClick={() => {
                void reload();
              }}
            >
              {t("listing.retry")}
            </button>
          </div>
        );
      case "ready":
        return <OrderDetailView details={state.details} onReload={reload} />;
    }
  }

  return (
    <div className="mb-20">
      <p className="mb-2">
        <OrderBackLink label={t("account.orderDetails.backToOrdersList")} />
      </p>
      <AccountPageHeader
        className="mb-14"
        title={orderTitle(
          t,
          state.status === "ready"
            ? state.details.order.orderNumber
            : undefined,
        )}
      />
      {renderBody()}
    </div>
  );
}
