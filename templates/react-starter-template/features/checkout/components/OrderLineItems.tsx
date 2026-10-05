import { getSmallestThumbnailUrl } from "@shopware/helpers";

import type { Schemas } from "#shopware";
import { Price } from "@/components/Price";

import { ImageIcon, PercentageIcon, TagIcon } from "./CheckoutIcons";

const t = {
  account: {
    order: {
      quantity: "Quantity",
    },
  },
  cart: {
    digital: "Digital",
    promotion: "Promotion",
  },
};

type LineItemKind = "product" | "promotion" | "credit" | "custom";

const PRICE_TEST_ID_PREFIX: Record<LineItemKind, string> = {
  product: "order-item",
  promotion: "order-item-promotion",
  credit: "order-item-credit",
  custom: "order-item-custom",
};

const BADGE_CLASS = "ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium";

function lineItemKind(lineItem: Schemas["OrderLineItem"]): LineItemKind {
  switch (lineItem.type) {
    case "promotion":
    case "credit":
    case "custom":
      return lineItem.type;
    default:
      return "product";
  }
}

function LineItemMedia({
  lineItem,
  kind,
}: {
  lineItem: Schemas["OrderLineItem"];
  kind: LineItemKind;
}) {
  if (kind === "promotion") {
    return <TagIcon className="size-8 text-brand-primary" />;
  }
  if (kind === "credit") {
    return <PercentageIcon className="size-8 text-brand-primary" />;
  }
  if (kind === "custom") {
    return <ImageIcon className="size-8 text-brand-primary" />;
  }
  const coverUrl = getSmallestThumbnailUrl(lineItem.cover);
  if (!coverUrl) {
    return <ImageIcon className="size-8 text-surface-on-surface-variant" />;
  }
  return (
    <img
      src={coverUrl}
      alt={lineItem.label}
      className="size-full object-cover object-center"
      loading="lazy"
    />
  );
}

export function OrderLineItem({
  lineItem,
}: {
  lineItem: Schemas["OrderLineItem"];
}) {
  const kind = lineItemKind(lineItem);
  const testIdPrefix = PRICE_TEST_ID_PREFIX[kind];
  const isDigital =
    kind === "product" && Boolean(lineItem.states?.includes("is-download"));

  return (
    <li
      className="flex gap-4 py-4 text-surface-on-surface"
      data-testid="order-line-item"
    >
      <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden bg-surface-surface-container-low">
        <LineItemMedia lineItem={lineItem} kind={kind} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="leading-normal text-surface-on-surface">
            {lineItem.label}
            {isDigital ? (
              <span
                data-testid="cart-product-digital-label"
                className={`${BADGE_CLASS} bg-states-info-container text-states-on-info-container`}
              >
                {t.cart.digital}
              </span>
            ) : null}
            {kind === "promotion" ? (
              <span
                className={`${BADGE_CLASS} bg-states-success-container text-states-on-success-container`}
              >
                {t.cart.promotion}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-sm text-surface-on-surface-variant">
            {t.account.order.quantity} {lineItem.quantity}
          </div>
        </div>
        <div className="shrink-0 sm:text-right">
          {lineItem.totalPrice ? (
            <Price
              value={lineItem.totalPrice}
              className="block text-surface-on-surface"
              data-testid={`${testIdPrefix}-totalprice`}
            />
          ) : null}
          {lineItem.unitPrice && lineItem.quantity > 1 ? (
            <Price
              value={lineItem.unitPrice}
              className="block text-sm font-normal text-surface-on-surface-variant"
              data-testid={`${testIdPrefix}-unitprice`}
            />
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function OrderLineItems({
  lineItems,
}: {
  lineItems: Schemas["OrderLineItem"][];
}) {
  if (lineItems.length === 0) return null;
  return (
    <ul className="divide-y divide-outline-outline-variant">
      {lineItems.map((lineItem) => (
        <OrderLineItem
          key={lineItem.identifier || lineItem.id}
          lineItem={lineItem}
        />
      ))}
    </ul>
  );
}
