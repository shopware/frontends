import { describe, expect, it } from "vitest";

import { fakeClient } from "@/features/checkout/checkout.fixture";
import { orderAssociations } from "@/features/checkout/checkoutApi";
import { apiError } from "@/features/checkout/checkoutTestDoubles";
import { ORDER_TIMEOUT_MS } from "@/features/session/readTimeout";
import { testTranslator } from "@/test/i18n";

import {
  ORDER_ID,
  accountOrder,
  digitalLineItem,
  orderDetails,
  orderDocument,
  orderRouteResponse,
} from "./orders.fixture";
import {
  ORDERS_DEFAULT_LIMIT,
  classifyDeepLinkError,
  documentFileName,
  handleOrderPayment,
  isOrderId,
  isOrderPaymentChangeable,
  lineItemDownloads,
  orderPaymentReturnUrls,
  pageCount,
  readDeepLinkOrder,
  readOrderDetails,
  readOrderDocument,
  readOrderDownload,
  readOrders,
  reorderItems,
  setOrderPaymentMethod,
} from "./ordersApi";

const READ_ORDER = "readOrder post /order";

describe("readOrders", () => {
  it("posts the Vue order list criteria and returns the page with its total", async () => {
    const orders = [accountOrder()];
    const shopware = fakeClient(() =>
      orderRouteResponse(orders, { total: 31 }),
    );

    const page = await readOrders(shopware.client, { page: 3, limit: 15 });

    expect(shopware.invocations).toEqual([
      {
        operation: READ_ORDER,
        params: {
          body: {
            page: 3,
            limit: 15,
            associations: orderAssociations,
            "total-count-mode": "exact",
            sort: [{ field: "createdAt", order: "DESC" }],
          },
        },
      },
    ]);
    expect(page).toEqual({ elements: orders, total: 31 });
  });

  it("returns an empty page when the response has no orders", async () => {
    const shopware = fakeClient(() => ({ orders: {} }));

    await expect(
      readOrders(shopware.client, { page: 1, limit: ORDERS_DEFAULT_LIMIT }),
    ).resolves.toEqual({ elements: [], total: 0 });
  });
});

describe("pageCount", () => {
  it("rounds up and never goes below one page", () => {
    expect(pageCount(31, 15)).toBe(3);
    expect(pageCount(30, 15)).toBe(2);
    expect(pageCount(0, 15)).toBe(1);
    expect(pageCount(5, 0)).toBe(5);
  });
});

describe("readOrderDetails", () => {
  it("reads one order with checkPromotion in the query, where the backend reads it, and in the body", async () => {
    const order = accountOrder();
    const shopware = fakeClient(() =>
      orderRouteResponse([order], { paymentChangeable: { [ORDER_ID]: true } }),
    );

    const details = await readOrderDetails(shopware.client, ORDER_ID);

    expect(shopware.invocations).toEqual([
      {
        operation: READ_ORDER,
        params: {
          body: {
            ids: [ORDER_ID],
            associations: orderAssociations,
            checkPromotion: true,
          },
          query: { checkPromotion: true },
        },
      },
    ]);
    expect(details).toEqual({ order, paymentChangeable: true });
  });

  it("treats a missing paymentChangeable entry as not changeable", async () => {
    const shopware = fakeClient(() => ({
      orders: { elements: [accountOrder()] },
    }));

    const details = await readOrderDetails(shopware.client, ORDER_ID);

    expect(details?.paymentChangeable).toBe(false);
  });

  it("returns null when the order is not among the customer's orders", async () => {
    const shopware = fakeClient(() => orderRouteResponse([]));

    await expect(readOrderDetails(shopware.client, ORDER_ID)).resolves.toBe(
      null,
    );
  });

  it("returns null without a request for an id that is not a Shopware id", async () => {
    const shopware = fakeClient(() => orderRouteResponse([accountOrder()]));

    for (const id of ["", "not-an-order", `${ORDER_ID}0`, "order-1"]) {
      await expect(readOrderDetails(shopware.client, id)).resolves.toBe(null);
    }
    expect(shopware.invocations).toEqual([]);
  });

  it("returns null when the backend rejects the id as an invalid uuid", async () => {
    const shopware = fakeClient(() => {
      throw apiError([
        {
          code: "FRAMEWORK__INVALID_UUID",
          status: "400",
          detail: "Value is not a valid UUID",
        },
      ]);
    });

    await expect(readOrderDetails(shopware.client, ORDER_ID)).resolves.toBe(
      null,
    );
  });

  it("rethrows every other error", async () => {
    const failure = apiError([
      { code: "FRAMEWORK__SERVER_ERROR", status: "500", detail: "Down" },
    ]);
    const shopware = fakeClient(() => {
      throw failure;
    });

    await expect(readOrderDetails(shopware.client, ORDER_ID)).rejects.toBe(
      failure,
    );
  });
});

describe("readDeepLinkOrder", () => {
  it("asks for the order by its deep link code and logs a guest in, like [deepCode].vue", async () => {
    const order = accountOrder();
    const shopware = fakeClient(() => orderRouteResponse([order]));

    const result = await readDeepLinkOrder(
      shopware.client,
      { deepLinkCode: "deep-code-1" },
      testTranslator(),
    );

    expect(shopware.invocations).toEqual([
      {
        operation: READ_ORDER,
        params: {
          body: {
            login: true,
            filter: [
              { field: "deepLinkCode", type: "equals", value: "deep-code-1" },
            ],
            associations: orderAssociations,
            checkPromotion: true,
          },
          query: { checkPromotion: true },
        },
      },
    ]);
    expect(result).toEqual({
      status: "found",
      details: { order, paymentChangeable: false },
    });
  });

  it("sends the email and postal code once the guest entered them", async () => {
    const shopware = fakeClient(() => orderRouteResponse([accountOrder()]));

    await readDeepLinkOrder(
      shopware.client,
      {
        deepLinkCode: "deep-code-1",
        credentials: { email: "guest@example.com", zipcode: "12345" },
      },
      testTranslator(),
    );

    expect(shopware.calls(READ_ORDER)[0]?.params).toMatchObject({
      body: { email: "guest@example.com", zipcode: "12345", login: true },
    });
  });

  it("reports an empty result as not found", async () => {
    const shopware = fakeClient(() => orderRouteResponse([]));

    await expect(
      readDeepLinkOrder(
        shopware.client,
        { deepLinkCode: "deep-code-1" },
        testTranslator(),
      ),
    ).resolves.toEqual({ status: "notFound" });
  });

  it("maps the guest authentication errors of the backend", async () => {
    const cases = [
      ["CHECKOUT__GUEST_NOT_AUTHENTICATED", { status: "authRequired" }],
      ["CHECKOUT__GUEST_WRONG_CREDENTIALS", { status: "wrongCredentials" }],
      ["CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND", { status: "notFound" }],
    ] as const;

    for (const [code, expected] of cases) {
      const shopware = fakeClient(() => {
        throw apiError([{ code, status: "403", detail: code }], 403);
      });
      await expect(
        readDeepLinkOrder(
          shopware.client,
          { deepLinkCode: "deep-code-1" },
          testTranslator(),
        ),
      ).resolves.toEqual(expected);
    }
  });

  it("resolves the default message in the language of the translator", () => {
    const pl = testTranslator("pl-PL");

    expect(classifyDeepLinkError(new Error("offline"), pl)).toEqual({
      status: "failed",
      messages: [pl("errors.message-default")],
    });
  });

  it("resolves every other error to its messages", () => {
    expect(
      classifyDeepLinkError(
        apiError(
          [
            {
              code: "CHECKOUT__CUSTOMER_NOT_LOGGED_IN",
              status: "403",
              detail: "Customer is not logged in.",
            },
          ],
          403,
        ),
        testTranslator(),
      ),
    ).toEqual({ status: "failed", messages: ["Customer is not logged in."] });
    expect(
      classifyDeepLinkError(new Error("offline"), testTranslator()),
    ).toEqual({
      status: "failed",
      messages: [
        "Unfortunately, something went wrong. Please try again in a few moments. If the problem persists, you can return to the homepage or contact our support team for assistance.",
      ],
    });
  });
});

describe("setOrderPaymentMethod", () => {
  it("posts the order and the payment method to /order/payment", async () => {
    const shopware = fakeClient(() => ({ success: true }));

    await setOrderPaymentMethod(shopware.client, {
      orderId: ORDER_ID,
      paymentMethodId: "payment-cash",
    });

    expect(shopware.invocations).toEqual([
      {
        operation: "orderSetPayment post /order/payment",
        params: {
          body: { orderId: ORDER_ID, paymentMethodId: "payment-cash" },
          fetchOptions: { timeout: ORDER_TIMEOUT_MS },
        },
      },
    ]);
  });
});

describe("handleOrderPayment", () => {
  it("starts the payment of the order with the return urls and a timeout", async () => {
    const shopware = fakeClient(() => ({
      redirectUrl: "https://psp.test/pay",
    }));
    const urls = {
      finishUrl: `https://shop.test/checkout/success/${ORDER_ID}/paid`,
      errorUrl: `https://shop.test/checkout/success/${ORDER_ID}/unpaid`,
    };

    const result = await handleOrderPayment(shopware.client, {
      orderId: ORDER_ID,
      ...urls,
    });

    expect(shopware.invocations).toEqual([
      {
        operation: "handlePaymentMethod post /handle-payment",
        params: {
          body: { orderId: ORDER_ID, ...urls },
          fetchOptions: { timeout: ORDER_TIMEOUT_MS },
        },
      },
    ]);
    expect(result).toEqual({ redirectUrl: "https://psp.test/pay" });
  });

  it("reports no redirect when the backend sends none", async () => {
    const shopware = fakeClient(() => ({}));

    await expect(
      handleOrderPayment(shopware.client, {
        orderId: ORDER_ID,
        finishUrl: "https://shop.test/paid",
        errorUrl: "https://shop.test/unpaid",
      }),
    ).resolves.toEqual({ redirectUrl: null });
  });
});

describe("orderPaymentReturnUrls", () => {
  it("builds the paid and unpaid pages of a valid order id", () => {
    expect(orderPaymentReturnUrls("https://shop.test", ORDER_ID)).toEqual({
      finishUrl: `https://shop.test/checkout/success/${ORDER_ID}/paid`,
      errorUrl: `https://shop.test/checkout/success/${ORDER_ID}/unpaid`,
    });
  });

  it("refuses anything that is not a Shopware id", () => {
    for (const value of [
      "",
      "order-1",
      `${ORDER_ID}/../evil`,
      `${ORDER_ID}0`,
      "https://evil.test",
    ]) {
      expect(isOrderId(value)).toBe(false);
      expect(orderPaymentReturnUrls("https://shop.test", value)).toBeNull();
    }
  });
});

describe("isOrderPaymentChangeable", () => {
  it("needs the backend flag and an open order, like the Vue detail view", () => {
    expect(isOrderPaymentChangeable(orderDetails({}, true))).toBe(true);
    expect(isOrderPaymentChangeable(orderDetails({}, false))).toBe(false);
    expect(
      isOrderPaymentChangeable(
        orderDetails(
          {
            stateMachineState: {
              technicalName: "completed",
              name: "Done",
            } as never,
          },
          true,
        ),
      ),
    ).toBe(false);
  });

  it("refuses a last transaction in a state the backend will not change", () => {
    const withTransaction = (technicalName: string) =>
      orderDetails(
        {
          transactions: [
            {
              stateMachineState: { technicalName: "paid" },
            },
            {
              stateMachineState: { technicalName },
            },
          ] as never,
        },
        true,
      );

    expect(isOrderPaymentChangeable(withTransaction("paid"))).toBe(false);
    expect(isOrderPaymentChangeable(withTransaction("failed"))).toBe(true);
    expect(isOrderPaymentChangeable(withTransaction("open"))).toBe(true);
  });
});

describe("reorderItems", () => {
  it("adds only the good product line items with their quantity", () => {
    const order = accountOrder({
      lineItems: [
        {
          id: "line-1",
          identifier: "line-1",
          productId: "product-1",
          quantity: 2,
          type: "product",
          good: true,
        },
        {
          id: "line-2",
          identifier: "product-2",
          quantity: 1,
          type: "product",
        },
        {
          id: "line-3",
          identifier: "promotion-1",
          quantity: 1,
          type: "promotion",
        },
        {
          id: "line-4",
          identifier: "line-4",
          productId: "product-4",
          quantity: 1,
          type: "product",
          good: false,
        },
      ] as never,
    });

    expect(reorderItems(order)).toEqual([
      { id: "product-1", quantity: 2 },
      { id: "product-2", quantity: 1 },
    ]);
  });
});

describe("lineItemDownloads", () => {
  it("lists only the downloads the customer has access to", () => {
    expect(lineItemDownloads(digitalLineItem())).toEqual([
      { id: "download-1", fileName: "ebook.pdf" },
    ]);
    expect(lineItemDownloads(accountOrder().lineItems![0]!)).toEqual([]);
  });
});

describe("readOrderDownload", () => {
  it("gets the file of a digital line item as a binary stream", async () => {
    const file = new Blob(["ebook"]);
    const shopware = fakeClient(() => file);

    const result = await readOrderDownload(shopware.client, {
      orderId: ORDER_ID,
      downloadId: "download-1",
    });

    expect(shopware.invocations).toEqual([
      {
        operation:
          "orderDownloadFile get /order/download/{orderId}/{downloadId}",
        params: {
          accept: "application/octet-stream",
          pathParams: { orderId: ORDER_ID, downloadId: "download-1" },
        },
      },
    ]);
    expect(result).toBe(file);
  });
});

describe("readOrderDocument", () => {
  it("downloads a document as a PDF by its deep link code", async () => {
    const file = new Blob(["%PDF"], { type: "application/pdf" });
    const shopware = fakeClient(() => file);

    const result = await readOrderDocument(shopware.client, {
      documentId: "document-1",
      deepLinkCode: "document-deep-link",
    });

    expect(shopware.invocations).toEqual([
      {
        operation:
          "downloadGet get /document/download/{documentId}/{deepLinkCode}",
        params: {
          accept: "application/pdf",
          pathParams: {
            documentId: "document-1",
            deepLinkCode: "document-deep-link",
          },
        },
      },
    ]);
    expect(result).toBe(file);
  });

  it("wraps a text answer into a blob", async () => {
    const shopware = fakeClient(() => "%PDF-1.7");

    const result = await readOrderDocument(shopware.client, {
      documentId: "document-1",
      deepLinkCode: "document-deep-link",
    });

    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe("application/pdf");
    await expect(result.text()).resolves.toBe("%PDF-1.7");
  });
});

describe("documentFileName", () => {
  it("joins the document name and file type like Downloads.vue", () => {
    expect(documentFileName(orderDocument())).toBe("invoice_10042.pdf");
    expect(documentFileName(orderDocument({ fileType: undefined }))).toBe(
      "invoice_10042.pdf",
    );
    expect(documentFileName(orderDocument({ fileType: "xml" }))).toBe(
      "invoice_10042.xml",
    );
  });
});
