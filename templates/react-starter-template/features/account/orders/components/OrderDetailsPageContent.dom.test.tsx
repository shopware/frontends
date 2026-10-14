import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CartActionError } from "@/features/cart/cartErrors";
import type { CartActionResult } from "@/features/cart/types";
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
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  pressKey,
  query,
  queryAll,
  submitForm,
} from "@/test/mount";
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
const CANCEL_ORDER = "cancelOrder post /order/state/cancel";
const CANCEL_BUTTON = '[data-testid="order-cancel-button"]';
const CANCEL_MODAL = '[data-testid="cancel-order-modal"]';
const CANCEL_CONFIRM = '[data-testid="cancel-order-confirm-button"]';
const REPEAT = '[data-testid="order-repeat-button"]';

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
  locale = "en-GB",
  orderRefundsEnabled,
}: {
  orderId?: string;
  answers?: Record<string, FakeAnswer>;
  cart?: ReturnType<typeof cartResult>;
  locale?: Locale;
  orderRefundsEnabled?: boolean;
} = {}) {
  const shopware = fakeClient(detailAnswer(answers));
  const notify = vi.fn();
  fakeCart.set(cart);
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify }}>
        <ShopwareClientHarness client={shopware.client}>
          <SessionHarness initial={loggedIn}>
            <Suspense fallback={<p data-testid="suspended" />}>
              <OrderDetailsPageContent
                params={Promise.resolve({ id: orderId })}
                orderRefundsEnabled={orderRefundsEnabled}
              />
            </Suspense>
          </SessionHarness>
        </ShopwareClientHarness>
      </CmsActionsProvider>,
      locale,
    ),
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

  it("adds every product of the order to the cart in one request", async () => {
    const cart = cartResult();
    const { container, notify } = await setup({
      cart,
      answers: {
        [READ_ORDER]: () =>
          orderRouteResponse([
            accountOrder({
              lineItems: [
                ...(accountOrder().lineItems ?? []),
                digitalLineItem(),
                {
                  id: "promo",
                  identifier: "promo",
                  label: "10% off",
                  quantity: 1,
                  type: "promotion",
                },
              ] as never,
            }),
          ]),
      },
    });

    await interact(() => query<HTMLButtonElement>(container, REPEAT).click());

    expect(cart.addProducts).toHaveBeenCalledTimes(1);
    expect(cart.addProducts).toHaveBeenCalledWith([
      { id: "line-1", quantity: 2 },
      { id: "product-ebook", quantity: 1 },
    ]);
    expect(cart.addProduct).not.toHaveBeenCalled();
    expect(notify.mock.calls).toEqual([
      [
        {
          type: "success",
          message: "Products have been added to the cart.",
          action: { label: "View cart", href: "/checkout/cart" },
        },
      ],
    ]);
  });

  it("toasts each cart error of a repeated order once, typed by its level, before the success", async () => {
    const errors: CartActionError[] = [
      {
        key: "product-stock-reachedline-1",
        level: 10,
        messageKey: "product-stock-reached",
        params: { name: "Aerodynamic Bag", quantity: 1 },
      },
      {
        key: "product-not-foundproduct-gone",
        level: 20,
        messageKey: "product-not-found",
      },
      {
        key: "product-not-foundproduct-deleted",
        level: 20,
        messageKey: "product-not-found",
      },
    ];
    const cart = cartResult({
      addProducts: vi.fn(async () => ({ ok: true, errors })),
    });
    const { container, notify } = await setup({ cart });

    await interact(() => query<HTMLButtonElement>(container, REPEAT).click());

    expect(notify.mock.calls).toEqual([
      [
        {
          type: "warning",
          message: "The product Aerodynamic Bag is only available 1 times",
        },
      ],
      [{ type: "error", message: "The product could not be found." }],
      [
        {
          type: "success",
          message: "Products have been added to the cart.",
          action: { label: "View cart", href: "/checkout/cart" },
        },
      ],
    ]);
  });

  it("reports a failed repeated order without the success toast", async () => {
    const cart = cartResult({
      addProducts: vi.fn(async () => ({
        ok: false,
        message: "The product is not available any more",
      })),
    });
    const { container, notify } = await setup({ cart });

    await interact(() => query<HTMLButtonElement>(container, REPEAT).click());

    expect(notify.mock.calls).toEqual([
      [{ type: "error", message: "The product is not available any more" }],
    ]);
  });

  it("sends one request when Repeat order is pressed twice before the cart answers", async () => {
    const pending = deferred<CartActionResult>();
    const cart = cartResult({ addProducts: vi.fn(() => pending.promise) });
    const { container, notify } = await setup({ cart });
    const button = query<HTMLButtonElement>(container, REPEAT);

    await interact(() => {
      button.click();
      button.click();
    });

    expect(cart.addProducts).toHaveBeenCalledTimes(1);
    expect(query<HTMLButtonElement>(container, REPEAT).disabled).toBe(true);

    await interact(() => pending.resolve({ ok: true }));

    expect(query<HTMLButtonElement>(container, REPEAT).disabled).toBe(false);
    expect(notify).toHaveBeenCalledTimes(1);
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

describe("OrderDetailsPageContent in Polish", () => {
  it("renders the Polish details with a prefixed back link", async () => {
    const { container } = await setup({ locale: "pl-PL" });

    expect(query(container, "h1").textContent).toBe("Zamówienie #10042");
    expect(
      query(container, 'a[href="/pl-PL/account/order"]').textContent,
    ).toContain("Powrót do listy zamówień");
    expect(container.textContent).toContain("Złożone dnia 5.10.2026");
    expect(container.textContent).toContain("Podsumowanie zamówienia");
  });

  it("sends the payment provider back to the prefixed success pages", async () => {
    const { container, shopware } = await setup({
      locale: "pl-PL",
      answers: {
        [HANDLE_PAYMENT]: () => ({
          redirectUrl: "https://psp.test/pay?id=1",
        }),
      },
    });
    const dialog = await openPaymentModal(container);

    await choosePayment(dialog, "payment-cash");

    const successPage = `${window.location.origin}/pl-PL/checkout/success/${ORDER_ID}`;
    expect(shopware.calls(HANDLE_PAYMENT)[0]?.params).toEqual({
      body: {
        orderId: ORDER_ID,
        finishUrl: `${successPage}/paid`,
        errorUrl: `${successPage}/unpaid`,
      },
      fetchOptions: { timeout: ORDER_TIMEOUT_MS },
    });
  });

  it("links the repeated order toast to the prefixed cart", async () => {
    const cart = cartResult();
    const { container, notify } = await setup({ cart, locale: "pl-PL" });

    await interact(() => query<HTMLButtonElement>(container, REPEAT).click());

    expect(cart.addProducts).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "success",
      message: "Produkty zostały dodane do koszyka.",
      action: { label: "Zobacz koszyk", href: "/pl-PL/checkout/cart" },
    });
  });
});

function cancellableOrder() {
  let state = "open";
  return {
    setState(next: string) {
      state = next;
    },
    answers: {
      [READ_ORDER]: () =>
        orderRouteResponse([
          accountOrder({
            stateMachineState: {
              technicalName: state,
              name: state,
              translated: { name: state === "open" ? "Open" : "Cancelled" },
            },
          } as never),
        ]),
      [CANCEL_ORDER]: () => {
        state = "cancelled";
        return { technicalName: "cancelled" };
      },
    } satisfies Record<string, FakeAnswer>,
  };
}

async function openCancelModal(container: HTMLElement) {
  await interact(() =>
    query<HTMLButtonElement>(container, CANCEL_BUTTON).click(),
  );
  return query<HTMLDialogElement>(document.body, CANCEL_MODAL);
}

function cancelRefusal(code: string, status: number) {
  return () => {
    throw apiError(
      [{ code, status: String(status), detail: "backend detail" }],
      status,
    );
  };
}

describe("OrderDetailsPageContent cancellation", () => {
  it("offers no cancellation when the shop does not allow refunds", async () => {
    const { container } = await setup({ answers: cancellableOrder().answers });

    expect(container.querySelector(CANCEL_BUTTON)).toBeNull();
  });

  it("asks for confirmation in a dialog that Back closes without a request", async () => {
    const { container, shopware } = await setup({
      answers: cancellableOrder().answers,
      orderRefundsEnabled: true,
    });
    const trigger = query<HTMLButtonElement>(container, CANCEL_BUTTON);
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    trigger.focus();

    const dialog = await openCancelModal(container);

    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(
      document.getElementById(dialog.getAttribute("aria-labelledby") ?? "")
        ?.textContent,
    ).toBe("Cancel order");
    expect(
      queryAll(dialog, "p").map((paragraph) => paragraph.textContent),
    ).toEqual([
      "Once cancelled, the order can no longer be paid or changed. Its discounts and promotions no longer apply, and a voucher code you used may not work again.",
      "Do you really want to cancel this order?",
    ]);

    await interact(() =>
      queryAll<HTMLButtonElement>(dialog, "button")
        .find((button) => button.textContent === "Back")
        ?.click(),
    );

    expect(document.querySelector(CANCEL_MODAL)).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(shopware.calls(CANCEL_ORDER)).toHaveLength(0);
  });

  it("cancels the order once, reads it again, confirms it and moves focus to the new status", async () => {
    const order = cancellableOrder();
    const { container, shopware, notify } = await setup({
      answers: order.answers,
      orderRefundsEnabled: true,
    });
    const dialog = await openCancelModal(container);

    await interact(() => submitForm(query<HTMLFormElement>(dialog, "form")));

    expect(shopware.calls(CANCEL_ORDER).map(({ params }) => params)).toEqual([
      {
        body: { orderId: ORDER_ID },
        fetchOptions: { timeout: ORDER_TIMEOUT_MS },
      },
    ]);
    expect(shopware.calls(READ_ORDER)).toHaveLength(2);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "The order has been cancelled.",
    });
    expect(document.querySelector(CANCEL_MODAL)).toBeNull();
    expect(container.querySelector(CANCEL_BUTTON)).toBeNull();
    const status = query(container, '[data-testid="order-status"]');
    expect(status.textContent).toBe("Cancelled");
    expect(document.activeElement).toBe(status.parentElement);
    expect(document.activeElement?.getAttribute("tabindex")).toBe("-1");
  });

  it("sends nothing more while a cancellation runs and ignores Escape until it ends", async () => {
    const pending = deferred<unknown>();
    const { container, shopware } = await setup({
      answers: {
        ...cancellableOrder().answers,
        [CANCEL_ORDER]: () => pending.promise,
      },
      orderRefundsEnabled: true,
    });
    const dialog = await openCancelModal(container);
    const confirm = query<HTMLButtonElement>(dialog, CANCEL_CONFIRM);

    await interact(() => confirm.click());
    await interact(() => confirm.click());
    await interact(() => submitForm(query<HTMLFormElement>(dialog, "form")));

    expect(shopware.calls(CANCEL_ORDER)).toHaveLength(1);
    expect(confirm.getAttribute("aria-busy")).toBe("true");
    expect(confirm.getAttribute("aria-disabled")).toBe("true");
    expect(confirm.disabled).toBe(false);

    await interact(() => pressKey(document, "Escape"));
    await interact(() =>
      queryAll<HTMLButtonElement>(dialog, "button")
        .find((button) => button.textContent === "Back")
        ?.click(),
    );
    expect(document.querySelector(CANCEL_MODAL)).not.toBeNull();

    await interact(() =>
      pending.reject(
        apiError([{ code: "FRAMEWORK__ERROR", status: "500" }], 500),
      ),
    );
    expect(confirm.getAttribute("aria-busy")).toBe("false");
    await interact(() => pressKey(document, "Escape"));
    expect(document.querySelector(CANCEL_MODAL)).toBeNull();
  });

  it("sends one request when the confirmation is submitted twice before the page renders again", async () => {
    const pending = deferred<unknown>();
    const { container, shopware } = await setup({
      answers: {
        ...cancellableOrder().answers,
        [CANCEL_ORDER]: () => pending.promise,
      },
      orderRefundsEnabled: true,
    });
    const dialog = await openCancelModal(container);
    const form = query<HTMLFormElement>(dialog, "form");

    await interact(() => {
      submitForm(form);
      submitForm(form);
    });

    expect(shopware.calls(CANCEL_ORDER)).toHaveLength(1);
    await interact(() =>
      pending.reject(
        apiError([{ code: "FRAMEWORK__ERROR", status: "500" }], 500),
      ),
    );
  });

  it("marks the trigger disabled while a cancellation runs and still moves the focus to the new status", async () => {
    const order = cancellableOrder();
    const pending = deferred<unknown>();
    const { container } = await setup({
      answers: {
        ...order.answers,
        [CANCEL_ORDER]: () => pending.promise,
      },
      orderRefundsEnabled: true,
    });
    const dialog = await openCancelModal(container);
    await interact(() =>
      query<HTMLButtonElement>(dialog, CANCEL_CONFIRM).click(),
    );
    const trigger = query<HTMLButtonElement>(container, CANCEL_BUTTON);
    expect(trigger.getAttribute("aria-disabled")).toBe("true");

    await interact(() => trigger.click());
    await interact(() => {
      order.setState("cancelled");
      pending.resolve({ technicalName: "cancelled" });
    });

    expect(document.querySelector(CANCEL_MODAL)).toBeNull();
    expect(document.activeElement).toBe(
      query(container, '[data-testid="order-status"]').parentElement,
    );
  });

  it.each([
    ["CHECKOUT__ORDER_NOT_CANCELLABLE", 403],
    ["SYSTEM__ILLEGAL_STATE_TRANSITION", 400],
  ])(
    "closes the dialog, explains the refusal and hides the button after %s",
    async (code, status) => {
      const { container, shopware, notify } = await setup({
        answers: {
          ...cancellableOrder().answers,
          [CANCEL_ORDER]: cancelRefusal(code, status),
        },
        orderRefundsEnabled: true,
      });
      const dialog = await openCancelModal(container);

      await interact(() =>
        query<HTMLButtonElement>(dialog, CANCEL_CONFIRM).click(),
      );

      expect(notify).toHaveBeenCalledExactlyOnceWith({
        type: "error",
        message: "This order can no longer be cancelled.",
      });
      expect(document.querySelector(CANCEL_MODAL)).toBeNull();
      expect(container.querySelector(CANCEL_BUTTON)).toBeNull();
      expect(shopware.calls(READ_ORDER)).toHaveLength(2);
      expect(document.activeElement).toBe(
        query(container, '[data-testid="order-status"]').parentElement,
      );
      expect(console.error).toHaveBeenCalledWith(
        "[Account] cancelling the order failed",
        { status, codes: [code] },
      );
    },
  );

  it("keeps the dialog open with the message after any other error", async () => {
    const { container, shopware, notify } = await setup({
      answers: {
        ...cancellableOrder().answers,
        [CANCEL_ORDER]: () => {
          throw apiError(
            [{ code: "CHECKOUT__ORDER_ORDER_NOT_FOUND", status: "404" }],
            404,
          );
        },
      },
      orderRefundsEnabled: true,
    });
    const dialog = await openCancelModal(container);

    await interact(() =>
      query<HTMLButtonElement>(dialog, CANCEL_CONFIRM).click(),
    );

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: "This order could not be found.",
    });
    expect(dialog.isConnected).toBe(true);
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(query(dialog, CANCEL_CONFIRM).getAttribute("aria-busy")).toBe(
      "false",
    );
    expect(shopware.calls(READ_ORDER)).toHaveLength(1);
    expect(container.querySelector(CANCEL_BUTTON)).not.toBeNull();
  });

  it("reads the order again after a timeout, since it may be cancelled", async () => {
    const order = cancellableOrder();
    const { container, shopware, notify } = await setup({
      answers: {
        ...order.answers,
        [CANCEL_ORDER]: () => {
          order.setState("cancelled");
          throw timeoutError();
        },
      },
      orderRefundsEnabled: true,
    });
    const dialog = await openCancelModal(container);

    await interact(() =>
      query<HTMLButtonElement>(dialog, CANCEL_CONFIRM).click(),
    );

    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
    expect(shopware.calls(READ_ORDER)).toHaveLength(2);
    expect(document.querySelector(CANCEL_MODAL)).toBeNull();
    expect(container.querySelector(CANCEL_BUTTON)).toBeNull();
    expect(query(container, '[data-testid="order-status"]').textContent).toBe(
      "Cancelled",
    );
  });

  it("closes the busy dialog when the browser restores the page", async () => {
    const pending = deferred<unknown>();
    const { container } = await setup({
      answers: {
        ...cancellableOrder().answers,
        [CANCEL_ORDER]: () => pending.promise,
      },
      orderRefundsEnabled: true,
    });
    const dialog = await openCancelModal(container);
    await interact(() =>
      query<HTMLButtonElement>(dialog, CANCEL_CONFIRM).click(),
    );

    await interact(() => {
      window.dispatchEvent(
        Object.assign(new Event("pageshow"), { persisted: true }),
      );
    });

    expect(document.querySelector(CANCEL_MODAL)).toBeNull();
    const reopened = await openCancelModal(container);
    expect(query(reopened, CANCEL_CONFIRM).getAttribute("aria-busy")).toBe(
      "false",
    );
  });

  it("asks in Polish", async () => {
    const { container } = await setup({
      answers: cancellableOrder().answers,
      orderRefundsEnabled: true,
      locale: "pl-PL",
    });

    expect(query(container, CANCEL_BUTTON).textContent).toBe(
      "Anuluj zamówienie",
    );
    const dialog = await openCancelModal(container);
    expect(dialog.textContent).toContain(
      "Czy na pewno chcesz anulować to zamówienie?",
    );
    expect(dialog.textContent).toContain("Powrót");
  });
});
