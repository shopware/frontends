import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

import type { ApiClient, Schemas, operations } from "#shopware";
import type { AddProductInput } from "@/features/cart/cartStore";
import { orderAssociations } from "@/features/checkout/checkoutApi";
import { paymentReturnUrls } from "@/features/checkout/paymentRedirect";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { ORDER_TIMEOUT_MS } from "@/features/session/readTimeout";

export type OrdersClient = Pick<ApiClient, "invoke">;

export const ORDERS_DEFAULT_LIMIT = 15;

export const ORDERS_PAGE_SIZE_OPTIONS = [1, 15, 30, 45] as const;

export const ORDER_LIST_SORT: Schemas["Sort"][] = [
  { field: "createdAt", order: "DESC" },
];

const ALLOWED_TRANSACTION_STATES = new Set([
  "open",
  "cancelled",
  "reminded",
  "failed",
  "chargeback",
  "unconfirmed",
]);

const ORDER_ID_PATTERN = /^[0-9a-f]{32}$/i;

const INVALID_UUID = "FRAMEWORK__INVALID_UUID";
const DEEP_LINK_NOT_FOUND = "CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND";
const GUEST_NOT_AUTHENTICATED = "CHECKOUT__GUEST_NOT_AUTHENTICATED";
const GUEST_WRONG_CREDENTIALS = "CHECKOUT__GUEST_WRONG_CREDENTIALS";

type ReadOrderBody = operations["readOrder post /order"]["body"];

type ReadOrderParams = {
  body: ReadOrderBody;
  query?: { checkPromotion?: boolean };
};

export type OrderPage = {
  elements: Schemas["Order"][];
  total: number;
};

export type OrderDetails = {
  order: Schemas["Order"];
  paymentChangeable: boolean;
};

export type DeepLinkCredentials = {
  email: string;
  zipcode: string;
};

export type DeepLinkOrderResult =
  | { status: "found"; details: OrderDetails }
  | { status: "notFound" }
  | { status: "authRequired" }
  | { status: "wrongCredentials" }
  | { status: "failed"; messages: string[] };

export type LineItemDownload = {
  id: string;
  fileName: string;
};

export function pageCount(total: number, limit: number): number {
  return Math.max(1, Math.ceil(total / Math.max(1, limit)));
}

export async function readOrders(
  client: OrdersClient,
  { page, limit }: { page: number; limit: number },
): Promise<OrderPage> {
  const { data } = await client.invoke("readOrder post /order", {
    body: {
      page,
      limit,
      associations: orderAssociations,
      "total-count-mode": "exact",
      sort: ORDER_LIST_SORT,
    },
  });
  return {
    elements: data.orders?.elements ?? [],
    total: data.orders?.total ?? 0,
  };
}

function toOrderDetails(
  data: Schemas["OrderRouteResponse"],
): OrderDetails | null {
  const order = data.orders?.elements?.[0];
  if (!order) return null;
  return {
    order,
    paymentChangeable: data.paymentChangeable?.[order.id] === true,
  };
}

export async function readOrderDetails(
  client: OrdersClient,
  orderId: string,
): Promise<OrderDetails | null> {
  if (!isOrderId(orderId)) return null;
  try {
    const { data } = await client.invoke("readOrder post /order", {
      body: {
        ids: [orderId],
        associations: orderAssociations,
        checkPromotion: true,
      },
      query: { checkPromotion: true },
    } as ReadOrderParams);
    return toOrderDetails(data);
  } catch (error) {
    if (errorCodes(error).has(INVALID_UUID)) return null;
    throw error;
  }
}

function errorCodes(error: unknown): Set<string> {
  if (!(error instanceof ApiClientError)) return new Set();
  const errors: ApiError[] | undefined = error.details?.errors;
  if (!Array.isArray(errors)) return new Set();
  return new Set(errors.flatMap(({ code }) => (code ? [code] : [])));
}

export function classifyDeepLinkError(error: unknown): DeepLinkOrderResult {
  const codes = errorCodes(error);
  if (codes.has(DEEP_LINK_NOT_FOUND)) return { status: "notFound" };
  if (codes.has(GUEST_WRONG_CREDENTIALS)) return { status: "wrongCredentials" };
  if (codes.has(GUEST_NOT_AUTHENTICATED)) return { status: "authRequired" };
  return { status: "failed", messages: resolveApiErrorMessages(error) };
}

export async function readDeepLinkOrder(
  client: OrdersClient,
  {
    deepLinkCode,
    credentials = null,
  }: { deepLinkCode: string; credentials?: DeepLinkCredentials | null },
): Promise<DeepLinkOrderResult> {
  try {
    const { data } = await client.invoke("readOrder post /order", {
      body: {
        ...(credentials
          ? { email: credentials.email, zipcode: credentials.zipcode }
          : {}),
        login: true,
        filter: [
          { field: "deepLinkCode", type: "equals", value: deepLinkCode },
        ],
        associations: orderAssociations,
        checkPromotion: true,
      },
      query: { checkPromotion: true },
    } as ReadOrderParams);
    const details = toOrderDetails(data);
    return details ? { status: "found", details } : { status: "notFound" };
  } catch (error) {
    return classifyDeepLinkError(error);
  }
}

export async function setOrderPaymentMethod(
  client: OrdersClient,
  { orderId, paymentMethodId }: { orderId: string; paymentMethodId: string },
): Promise<void> {
  await client.invoke("orderSetPayment post /order/payment", {
    body: { orderId, paymentMethodId },
    fetchOptions: { timeout: ORDER_TIMEOUT_MS },
  });
}

export async function handleOrderPayment(
  client: OrdersClient,
  {
    orderId,
    finishUrl,
    errorUrl,
  }: { orderId: string; finishUrl: string; errorUrl: string },
): Promise<{ redirectUrl: string | null }> {
  const { data } = await client.invoke(
    "handlePaymentMethod post /handle-payment",
    {
      body: { orderId, finishUrl, errorUrl },
      fetchOptions: { timeout: ORDER_TIMEOUT_MS },
    },
  );
  return { redirectUrl: data?.redirectUrl ?? null };
}

export function isOrderId(value: unknown): value is string {
  return typeof value === "string" && ORDER_ID_PATTERN.test(value);
}

export function orderPaymentReturnUrls(
  origin: string,
  orderId: string,
): { finishUrl: string; errorUrl: string } | null {
  return isOrderId(orderId) ? paymentReturnUrls(origin, orderId) : null;
}

function lastTransaction(
  order: Schemas["Order"],
): Schemas["OrderTransaction"] | undefined {
  const transactions = order.transactions;
  return transactions?.length
    ? transactions[transactions.length - 1]
    : undefined;
}

export function isOrderPaymentChangeable({
  order,
  paymentChangeable,
}: OrderDetails): boolean {
  if (!paymentChangeable) return false;
  if (order.stateMachineState?.technicalName !== "open") return false;
  const transactionState =
    lastTransaction(order)?.stateMachineState?.technicalName;
  return !transactionState || ALLOWED_TRANSACTION_STATES.has(transactionState);
}

export function reorderItems(order: Schemas["Order"]): AddProductInput[] {
  return (order.lineItems ?? []).flatMap((lineItem) => {
    if (lineItem.type !== "product" || lineItem.good === false) return [];
    const id = lineItem.productId || lineItem.identifier;
    return id ? [{ id, quantity: lineItem.quantity }] : [];
  });
}

export function lineItemDownloads(
  lineItem: Schemas["OrderLineItem"],
): LineItemDownload[] {
  return (lineItem.downloads ?? []).flatMap((download) =>
    download.accessGranted && download.media
      ? [
          {
            id: download.id,
            fileName: `${download.media.fileName}.${download.media.fileExtension}`,
          },
        ]
      : [],
  );
}

export async function readOrderDownload(
  client: OrdersClient,
  { orderId, downloadId }: { orderId: string; downloadId: string },
): Promise<Blob> {
  const { data } = await client.invoke(
    "orderDownloadFile get /order/download/{orderId}/{downloadId}",
    {
      accept: "application/octet-stream",
      pathParams: { orderId, downloadId },
    },
  );
  return data;
}

export async function readOrderDocument(
  client: OrdersClient,
  { documentId, deepLinkCode }: { documentId: string; deepLinkCode: string },
): Promise<Blob> {
  const { data } = await client.invoke(
    "downloadGet get /document/download/{documentId}/{deepLinkCode}",
    {
      accept: "application/pdf",
      pathParams: { documentId, deepLinkCode },
    },
  );
  return typeof data === "string"
    ? new Blob([data], { type: "application/pdf" })
    : data;
}

export function documentFileName(document: Schemas["Document"]): string {
  return `${document.config.name}.${document.fileType || "pdf"}`;
}
