import type { Schemas } from "#shopware";
import { order } from "@/features/checkout/checkout.fixture";

import type { OrderDetails } from "./ordersApi";

export const ORDER_ID = "0190f3b5a1c27d4e8f9a0b1c2d3e4f50";

export function accountOrder(
  overrides: Partial<Schemas["Order"]> = {},
): Schemas["Order"] {
  return order({
    id: ORDER_ID,
    documents: [],
    ...overrides,
  });
}

export function orderDetails(
  overrides: Partial<Schemas["Order"]> = {},
  paymentChangeable = false,
): OrderDetails {
  return { order: accountOrder(overrides), paymentChangeable };
}

export function orderRouteResponse(
  orders: Schemas["Order"][],
  {
    total = orders.length,
    paymentChangeable = {},
  }: { total?: number; paymentChangeable?: Record<string, boolean> } = {},
) {
  return {
    orders: { elements: orders, total },
    paymentChangeable,
  };
}

export function digitalLineItem(
  overrides: Partial<Schemas["OrderLineItem"]> = {},
): Schemas["OrderLineItem"] {
  return {
    id: "line-digital",
    identifier: "line-digital",
    productId: "product-ebook",
    label: "Shopware E-Book",
    quantity: 1,
    unitPrice: 9.99,
    totalPrice: 9.99,
    type: "product",
    good: true,
    states: ["is-download"],
    downloads: [
      {
        id: "download-1",
        accessGranted: true,
        media: { fileName: "ebook", fileExtension: "pdf" },
      },
      {
        id: "download-2",
        accessGranted: false,
        media: { fileName: "locked", fileExtension: "zip" },
      },
    ],
    ...overrides,
  } as unknown as Schemas["OrderLineItem"];
}

export function orderDocument(
  overrides: Partial<Schemas["Document"]> = {},
): Schemas["Document"] {
  return {
    id: "document-1",
    orderId: ORDER_ID,
    deepLinkCode: "document-deep-link",
    documentTypeId: "type-invoice",
    fileType: "pdf",
    config: { name: "invoice_10042", title: "Invoice 10042" },
    createdAt: "2026-10-05T10:30:00.000+00:00",
    ...overrides,
  } as Schemas["Document"];
}
