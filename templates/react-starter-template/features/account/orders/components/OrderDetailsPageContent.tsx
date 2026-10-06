"use client";

import { use } from "react";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";

import { useOrderDetails } from "../useOrderDetails";
import { OrderBackLink } from "./OrderBackLink";
import { OrderDetailSkeleton } from "./OrderDetailSkeleton";
import { OrderDetailView } from "./OrderDetailView";

const t = {
  account: {
    orderDetails: {
      order: "Order",
      backToOrdersList: "Back to orders list",
    },
    messages: {
      orderSuccessNoOrder: "The order could not be found.",
    },
  },
  listing: {
    error: "Something went wrong while loading results.",
    retry: "Try again",
  },
};

export function orderTitle(orderNumber: string | undefined): string {
  return orderNumber
    ? `${t.account.orderDetails.order} #${orderNumber}`
    : t.account.orderDetails.order;
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
  const { state, reload } = useOrderDetails(orderId);

  function renderBody() {
    switch (state.status) {
      case "loading":
        return <OrderDetailSkeleton />;
      case "notFound":
        return (
          <p role="alert" className="text-surface-on-surface">
            {t.account.messages.orderSuccessNoOrder}
          </p>
        );
      case "error":
        return (
          <div role="alert" className="text-sm">
            <p className="text-surface-on-surface-variant">{t.listing.error}</p>
            <button
              type="button"
              className="mt-3 text-surface-on-surface underline"
              onClick={() => {
                void reload();
              }}
            >
              {t.listing.retry}
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
        <OrderBackLink label={t.account.orderDetails.backToOrdersList} />
      </p>
      <AccountPageHeader
        className="mb-14"
        title={orderTitle(
          state.status === "ready"
            ? state.details.order.orderNumber
            : undefined,
        )}
      />
      {renderBody()}
    </div>
  );
}
