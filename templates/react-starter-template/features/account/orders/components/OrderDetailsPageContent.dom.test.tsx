import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  checkoutCustomer,
  checkoutSession,
  fakeClient,
  paymentMethods,
} from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import {
  SessionHarness,
  ShopwareClientHarness,
  apiError,
  cartResult,
  deferred,
  fakeCart,
  timeoutError,
} from "@/features/checkout/checkoutTestDoubles";
import { redirectToPayment } from "@/features/checkout/paymentRedirect";
import { ORDER_TIMEOUT_MS } from "@/features/session/readTimeout";
import { interact, mount, query, queryAll, submitForm } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import {
  ORDER_ID,
  accountOrder,
  digitalLineItem,
  orderDocument,
  orderRouteResponse,
} from "../orders.fixture";
import { saveBlob } from "../saveBlob";
import { OrderDetailsPageContent } from "./OrderDetailsPageContent";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("@/features/checkout/checkoutTestDoubles"))
    .useFakeCart,
}));

vi.mock("@/features/checkout/paymentRedirect", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@/features/checkout/paymentRedirect")
  >()),
  redirectToPayment: vi.fn(),
}));

vi.mock("../saveBlob", () => ({ saveBlob: vi.fn() }));

const READ_ORDER = "readOrder post /order";
const READ_PAYMENT_METHODS = "readPaymentMethodGet get /payment-method";
const SET_PAYMENT = "orderSetPayment post /order/payment";
const HANDLE_PAYMENT = "handlePaymentMethod post /handle-payment";
const DOWNLOAD_FILE =
  "orderDownloadFile get /order/download/{orderId}/{downloadId}";
const DOWNLOAD_DOCUMENT =
  "downloadGet get /document/download/{documentId}/{deepLinkCode}";
const GENERIC_ERROR = "An error occurred. Please try again.";
const MODAL = '[data-testid="change-payment-modal"]';
const CONFIRM = '[data-testid="change-payment-confirm-button"]';
const NOT_FOUND = "The order could not be found.";

const loggedIn = checkoutSession({ customer: checkoutCustomer() });

let mounted: Mounted | undefined;

beforeEach(() => {
  vi.mocked(redirectToPayment).mockReset();
  vi.mocked(saveBlob).mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

function detailAnswer(overrides: Record<string, FakeAnswer> = {}): FakeAnswer {
  return (operation, params) => {
    const override = overrides[operation];
    if (override) return override(operation, params);
    if (operation === READ_ORDER) {
      return orderRouteResponse([accountOrder()], {
        paymentChangeable: { [ORDER_ID]: true },
      });
    }
    if (operation === READ_PAYMENT_METHODS) return { elements: paymentMethods };
    if (operation === SET_PAYMENT) return { success: true };
    if (operation === HANDLE_PAYMENT) return { redirectUrl: null };
    return {};
  };
}

async function setup({
  orderId = ORDER_ID,
  answers = {},
  cart = cartResult(),
}: {
  orderId?: string;
  answers?: Record<string, FakeAnswer>;
  cart?: ReturnType<typeof cartResult>;
} = {}) {
  const shopware = fakeClient(detailAnswer(answers));
  const notify = vi.fn();
  fakeCart.set(cart);
  mounted = await mount(
    <CmsActionsProvider actions={{ notify }}>
      <ShopwareClientHarness client={shopware.client}>
        <SessionHarness initial={loggedIn}>
          <Suspense fallback={<p data-testid="suspended" />}>
            <OrderDetailsPageContent
              params={Promise.resolve({ id: orderId })}
            />
          </Suspense>
        </SessionHarness>
      </ShopwareClientHarness>
    </CmsActionsProvider>,
  );
  return { container: mounted.container, shopware, notify, cart };
}

async function openPaymentModal(container: HTMLElement) {
  await interact(() =>
    query<HTMLButtonElement>(
      container,
      '[data-testid="order-change-payment-button"]',
    ).click(),
  );
  return query<HTMLDialogElement>(
    document.body,
    '[data-testid="change-payment-modal"]',
  );
}

async function choosePayment(dialog: HTMLElement, id: string) {
  await interact(() =>
    query<HTMLInputElement>(
      dialog,
      `[data-testid="checkout-payment-method-${id}"]`,
    ).click(),
  );
  await interact(() =>
    query<HTMLButtonElement>(
      dialog,
      '[data-testid="change-payment-confirm-button"]',
    ).click(),
  );
}

describe("OrderDetailsPageContent", () => {
  it("reads the order and renders the details with one order total", async () => {
    const { container, shopware } = await setup();

    expect(shopware.calls(READ_ORDER)[0]?.params).toMatchObject({
      body: { ids: [ORDER_ID] },
      query: { checkPromotion: true },
    });
    expect(query(container, "h1").textContent).toBe("Order #10042");
    expect(
      query<HTMLAnchorElement>(container, 'a[href="/account/order"]')
        .textContent,
    ).toBe("Back to orders list");
    expect(
      queryAll(container, '[data-testid="order-total"]').map(
        (element) => element.textContent,
      ),
    ).toEqual(["€64.97"]);
    expect(
      queryAll(container, '[data-testid="order-detail-line-item"]'),
    ).toHaveLength(1);
  });

  it("shows the skeleton until the order arrives", async () => {
    const pending = deferred<unknown>();
    const { container } = await setup({
      answers: { [READ_ORDER]: () => pending.promise },
    });

    expect(query(container, "h1").textContent).toBe("Order");
    expect(
      query(container, '[data-testid="loading"]').getAttribute("aria-busy"),
    ).toBe("true");

    await interact(() => pending.resolve(orderRouteResponse([accountOrder()])));
    expect(container.querySelector('[data-testid="loading"]')).toBeNull();
  });

  it("says when the order is not the customer's", async () => {
    const { container } = await setup({
      answers: { [READ_ORDER]: () => orderRouteResponse([]) },
    });

    expect(query(container, '[role="alert"]').textContent).toBe(
      "The order could not be found.",
    );
  });

  it("says the order could not be found for an id that is not a Shopware id without asking the backend", async () => {
    const { container, shopware } = await setup({ orderId: "not-an-order" });

    expect(query(container, '[role="alert"]').textContent).toBe(NOT_FOUND);
    expect(shopware.calls(READ_ORDER)).toHaveLength(0);
  });

  it("says the order could not be found when the backend rejects the id", async () => {
    const { container, shopware } = await setup({
      answers: {
        [READ_ORDER]: () => {
          throw apiError([
            {
              code: "FRAMEWORK__INVALID_UUID",
              status: "400",
              detail: "Value is not a valid UUID",
            },
          ]);
        },
      },
    });

    const alert = query(container, '[role="alert"]');
    expect(alert.textContent).toBe(NOT_FOUND);
    expect(alert.querySelector("button")).toBeNull();
    expect(shopware.calls(READ_ORDER)).toHaveLength(1);
  });

  it("offers a retry after a failed read", async () => {
    let fail = true;
    const { container, shopware } = await setup({
      answers: {
        [READ_ORDER]: () => {
          if (fail) throw new Error("offline");
          return orderRouteResponse([accountOrder()]);
        },
      },
    });

    const alert = query(container, '[role="alert"]');
    fail = false;
    await interact(() => query<HTMLButtonElement>(alert, "button").click());

    expect(shopware.calls(READ_ORDER)).toHaveLength(2);
    expect(query(container, '[data-testid="order-total"]').textContent).toBe(
      "€64.97",
    );
  });

  it("hides the payment change when the backend does not allow it", async () => {
    const { container } = await setup({
      answers: {
        [READ_ORDER]: () => orderRouteResponse([accountOrder()]),
      },
    });

    expect(
      container.querySelector('[data-testid="order-change-payment-button"]'),
    ).toBeNull();
  });

  it("lists the available payment methods with the current one selected", async () => {
    const { container, shopware } = await setup();

    const dialog = await openPaymentModal(container);

    expect(shopware.calls(READ_PAYMENT_METHODS)[0]?.params).toEqual({
      query: { onlyAvailable: true },
    });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(
      document.getElementById(dialog.getAttribute("aria-labelledby") ?? "")
        ?.textContent,
    ).toBe("Change payment method");
    const radios = queryAll<HTMLInputElement>(dialog, 'input[type="radio"]');
    expect(radios.map((radio) => radio.dataset.testid)).toEqual([
      "checkout-payment-method-payment-invoice",
      "checkout-payment-method-payment-cash",
    ]);
    expect(radios[0]?.checked).toBe(true);
    expect(dialog.textContent).toContain("Pay within 14 days");
  });

  it("changes the payment method, starts the payment and follows an https redirect", async () => {
    const { container, shopware, notify } = await setup({
      answers: {
        [HANDLE_PAYMENT]: () => ({
          redirectUrl: "https://psp.test/pay?id=1",
        }),
      },
    });
    const dialog = await openPaymentModal(container);

    await choosePayment(dialog, "payment-cash");

    expect(shopware.calls(SET_PAYMENT)[0]?.params).toEqual({
      body: { orderId: ORDER_ID, paymentMethodId: "payment-cash" },
      fetchOptions: { timeout: ORDER_TIMEOUT_MS },
    });
    const successPage = `${window.location.origin}/checkout/success/${ORDER_ID}`;
    expect(shopware.calls(HANDLE_PAYMENT)[0]?.params).toEqual({
      body: {
        orderId: ORDER_ID,
        finishUrl: `${successPage}/paid`,
        errorUrl: `${successPage}/unpaid`,
      },
      fetchOptions: { timeout: ORDER_TIMEOUT_MS },
    });
    expect(redirectToPayment).toHaveBeenCalledWith("https://psp.test/pay?id=1");
    expect(notify).not.toHaveBeenCalled();
    expect(
      document.querySelector('[data-testid="change-payment-modal"]'),
    ).not.toBeNull();
  });

  it("never follows a redirect that is not http(s) and reloads the order instead", async () => {
    const { container, shopware, notify } = await setup({
      answers: {
        [HANDLE_PAYMENT]: () => ({ redirectUrl: "javascript:alert(1)" }),
      },
    });
    const dialog = await openPaymentModal(container);

    await choosePayment(dialog, "payment-cash");

    expect(redirectToPayment).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith({
      type: "success",
      message: "Payment method changed successfully.",
    });
    expect(
      document.querySelector('[data-testid="change-payment-modal"]'),
    ).toBeNull();
    expect(shopware.calls(READ_ORDER)).toHaveLength(2);
  });

  it("keeps the dialog open and shows the API error when the change fails", async () => {
    const { container, shopware, notify } = await setup({
      answers: {
        [SET_PAYMENT]: () => {
          throw apiError([
            {
              code: "CHECKOUT__ORDER_PAYMENT_METHOD_NOT_CHANGEABLE",
              status: "400",
              detail: "The payment method of this order cannot be changed.",
            },
          ]);
        },
      },
    });
    const dialog = await openPaymentModal(container);

    await choosePayment(dialog, "payment-cash");

    expect(shopware.calls(HANDLE_PAYMENT)).toHaveLength(0);
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "The payment method of this order cannot be changed.",
    });
    expect(
      document.querySelector('[data-testid="change-payment-modal"]'),
    ).not.toBeNull();
    expect(
      query<HTMLButtonElement>(
        document.body,
        '[data-testid="change-payment-confirm-button"]',
      ).disabled,
    ).toBe(false);
  });

  it("refuses to start a payment for an order id that is not a Shopware id", async () => {
    const { container, shopware, notify } = await setup({
      answers: {
        [READ_ORDER]: () =>
          orderRouteResponse([accountOrder({ id: "order-1" })], {
            paymentChangeable: { "order-1": true },
          }),
      },
    });
    const dialog = await openPaymentModal(container);

    await choosePayment(dialog, "payment-cash");

    expect(shopware.calls(SET_PAYMENT)).toHaveLength(0);
    expect(shopware.calls(HANDLE_PAYMENT)).toHaveLength(0);
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: GENERIC_ERROR,
    });
  });

  it("reloads the order without a success message when starting the payment fails", async () => {
    const { container, shopware, notify } = await setup({
      answers: {
        [HANDLE_PAYMENT]: () => {
          throw apiError([{ code: "X", status: "400", detail: "PSP down" }]);
        },
      },
    });
    const dialog = await openPaymentModal(container);

    await choosePayment(dialog, "payment-cash");

    expect(shopware.calls(SET_PAYMENT)).toHaveLength(1);
    expect(shopware.calls(HANDLE_PAYMENT)).toHaveLength(1);
    expect(redirectToPayment).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({ type: "error", message: "PSP down" });
    expect(document.querySelector(MODAL)).toBeNull();
    expect(shopware.calls(READ_ORDER)).toHaveLength(2);
  });

  it("reloads the order when changing the payment method timed out", async () => {
    const { container, shopware, notify } = await setup({
      answers: {
        [SET_PAYMENT]: () => {
          throw timeoutError();
        },
      },
    });
    const dialog = await openPaymentModal(container);

    await choosePayment(dialog, "payment-cash");

    expect(shopware.calls(HANDLE_PAYMENT)).toHaveLength(0);
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
    expect(shopware.calls(READ_ORDER)).toHaveLength(2);
    expect(document.querySelector(MODAL)).not.toBeNull();
    expect(query(document.body, CONFIRM).getAttribute("aria-busy")).toBe(
      "false",
    );
  });

  it("keeps the focus inside the dialog while the change runs and after it fails", async () => {
    const pending = deferred<unknown>();
    const { container } = await setup({
      answers: { [SET_PAYMENT]: () => pending.promise },
    });
    const dialog = await openPaymentModal(container);
    const cash = query<HTMLInputElement>(
      dialog,
      '[data-testid="checkout-payment-method-payment-cash"]',
    );
    const invoice = query<HTMLInputElement>(
      dialog,
      '[data-testid="checkout-payment-method-payment-invoice"]',
    );
    await interact(() => cash.click());

    await interact(() => {
      cash.focus();
      submitForm(query<HTMLFormElement>(dialog, "form"));
    });

    const confirm = query<HTMLButtonElement>(dialog, CONFIRM);
    expect(confirm.getAttribute("aria-busy")).toBe("true");
    expect(confirm.getAttribute("aria-disabled")).toBe("true");
    expect(confirm.disabled).toBe(false);
    expect(cash.disabled).toBe(false);
    expect(cash.getAttribute("aria-disabled")).toBe("true");
    expect(dialog.contains(document.activeElement)).toBe(true);

    await interact(() => invoice.click());
    expect(cash.checked).toBe(true);

    await interact(() =>
      pending.reject(
        apiError([
          {
            code: "CHECKOUT__ORDER_PAYMENT_METHOD_NOT_CHANGEABLE",
            status: "400",
            detail: "The payment method of this order cannot be changed.",
          },
        ]),
      ),
    );

    expect(dialog.isConnected).toBe(true);
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(confirm.getAttribute("aria-busy")).toBe("false");
    expect(cash.hasAttribute("aria-disabled")).toBe(false);
  });

  it("closes the busy dialog and reloads the order when the browser restores the page after a payment redirect", async () => {
    const { container, shopware } = await setup({
      answers: {
        [HANDLE_PAYMENT]: () => ({
          redirectUrl: "https://psp.test/pay?id=1",
        }),
      },
    });
    const dialog = await openPaymentModal(container);
    await choosePayment(dialog, "payment-cash");
    expect(redirectToPayment).toHaveBeenCalledTimes(1);
    expect(query(dialog, CONFIRM).getAttribute("aria-busy")).toBe("true");

    await interact(() => {
      window.dispatchEvent(
        Object.assign(new Event("pageshow"), { persisted: false }),
      );
    });
    expect(document.querySelector(MODAL)).not.toBeNull();
    expect(shopware.calls(READ_ORDER)).toHaveLength(1);

    await interact(() => {
      window.dispatchEvent(
        Object.assign(new Event("pageshow"), { persisted: true }),
      );
    });

    expect(document.querySelector(MODAL)).toBeNull();
    expect(shopware.calls(READ_ORDER)).toHaveLength(2);
    const reopened = await openPaymentModal(container);
    const close = [
      ...reopened.querySelectorAll<HTMLButtonElement>("button"),
    ].find((button) => button.textContent === "Close");
    expect(close?.disabled).toBe(false);
    expect(query(reopened, CONFIRM).getAttribute("aria-busy")).toBe("false");
  });

  it("closes the payment dialog with the Close button", async () => {
    const { container } = await setup();
    const dialog = await openPaymentModal(container);

    await interact(() =>
      [...dialog.querySelectorAll<HTMLButtonElement>("button")]
        .find((button) => button.textContent === "Close")
        ?.click(),
    );

    expect(
      document.querySelector('[data-testid="change-payment-modal"]'),
    ).toBeNull();
  });

  it("adds the order's products to the cart again", async () => {
    const cart = cartResult();
    const { container, notify } = await setup({ cart });

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="order-repeat-button"]',
      ).click(),
    );

    expect(cart.addProduct).toHaveBeenCalledWith({
      id: "line-1",
      quantity: 2,
    });
    expect(notify).toHaveBeenCalledWith({
      type: "success",
      message: "Products have been added to the cart.",
      action: { label: "View cart", href: "/checkout/cart" },
    });
  });

  it("reports the cart errors of a repeated order", async () => {
    const cart = cartResult({
      addProduct: vi.fn(async () => ({
        ok: false,
        message: "The product is not available any more",
      })),
    });
    const { container, notify } = await setup({ cart });

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="order-repeat-button"]',
      ).click(),
    );

    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "The product is not available any more",
    });
    expect(notify).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
  });

  it("downloads a digital item and a document", async () => {
    const file = new Blob(["ebook"]);
    const pdf = new Blob(["%PDF"], { type: "application/pdf" });
    const { container, shopware } = await setup({
      answers: {
        [READ_ORDER]: () =>
          orderRouteResponse([
            accountOrder({
              lineItems: [digitalLineItem()],
              documents: [orderDocument()],
            }),
          ]),
        [DOWNLOAD_FILE]: () => file,
        [DOWNLOAD_DOCUMENT]: () => pdf,
      },
    });

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="order-item-download"]',
      ).click(),
    );
    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="order-document-download"]',
      ).click(),
    );

    expect(shopware.calls(DOWNLOAD_FILE)[0]?.params).toMatchObject({
      pathParams: { orderId: ORDER_ID, downloadId: "download-1" },
    });
    expect(shopware.calls(DOWNLOAD_DOCUMENT)[0]?.params).toMatchObject({
      pathParams: {
        documentId: "document-1",
        deepLinkCode: "document-deep-link",
      },
    });
    expect(vi.mocked(saveBlob).mock.calls).toEqual([
      [file, "ebook.pdf"],
      [pdf, "invoice_10042.pdf"],
    ]);
  });
});
