import { StrictMode, Suspense } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { unavailableSession } from "@/features/session/sessionFromContext";
import type { StorefrontSession } from "@/features/session/types";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import {
  checkoutCustomer,
  checkoutSession,
  fakeClient,
  order,
} from "../checkout.fixture";
import type { FakeAnswer } from "../checkout.fixture";
import {
  SessionHarness,
  ShopwareClientHarness,
  sessionControl,
} from "../checkoutTestDoubles";
import { redirectToPayment } from "../paymentRedirect";
import { SuccessPageContent } from "./SuccessPageContent";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace, refresh: vi.fn() }),
}));

vi.mock("../paymentRedirect", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../paymentRedirect")>()),
  redirectToPayment: vi.fn(),
}));

const READ_ORDER = "readOrder post /order";
const HANDLE_PAYMENT = "handlePaymentMethod post /handle-payment";
const SUCCESS_PAGE = '[data-testid="checkout-success-page"]';

const loggedIn = checkoutSession({ customer: checkoutCustomer() });

let mounted: Mounted | undefined;

beforeEach(() => {
  replace.mockReset();
  vi.mocked(redirectToPayment).mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function successAnswer(overrides: Record<string, FakeAnswer> = {}) {
  return (operation: string, params: unknown) => {
    const override = overrides[operation];
    if (override) return override(operation, params);
    if (operation === READ_ORDER) return { orders: { elements: [order()] } };
    if (operation === HANDLE_PAYMENT) return { redirectUrl: null };
    return {};
  };
}

async function setup({
  session = loggedIn,
  answers = {},
  wrap = (node) => node,
}: {
  session?: StorefrontSession;
  answers?: Record<string, FakeAnswer>;
  wrap?: (node: ReactNode) => ReactNode;
} = {}) {
  const shopware = fakeClient(successAnswer(answers));
  mounted = await mount(
    wrap(
      <ShopwareClientHarness client={shopware.client}>
        <SessionHarness initial={session}>
          <Suspense fallback={<p data-testid="suspended" />}>
            <SuccessPageContent params={Promise.resolve({ id: "order-1" })} />
          </Suspense>
        </SessionHarness>
      </ShopwareClientHarness>,
    ),
  );
  return { container: mounted.container, shopware };
}

describe("SuccessPageContent", () => {
  it("loads the order and renders the confirmation", async () => {
    const { container, shopware } = await setup();

    expect(shopware.calls(READ_ORDER)).toHaveLength(1);
    expect(shopware.calls(READ_ORDER)[0]?.params).toMatchObject({
      body: { ids: ["order-1"], checkPromotion: true },
    });
    const page = query<HTMLElement>(container, SUCCESS_PAGE);
    expect(query(page, "h1").textContent).toBe("Thank you for your order");
    expect(page.textContent).toContain(
      "We have received your order #10042 and will process it as soon as possible.",
    );
    expect(query(page, '[data-testid="order-number"]').textContent).toBe(
      "10042",
    );
    expect(query(page, '[data-testid="order-status"]').textContent).toBe(
      "Open",
    );
    expect(query(page, '[data-testid="order-subtotal"]').textContent).toBe(
      "€59.98",
    );
    expect(query(page, '[data-testid="order-shipping"]').textContent).toBe(
      "€4.99",
    );
    expect(query(page, '[data-testid="order-total"]').textContent).toBe(
      "€64.97",
    );
    expect(queryAll(page, '[data-testid="order-line-item"]')).toHaveLength(1);
    expect(page.textContent).toContain("Takes up to 1-3 days");
    expect(page.querySelector('[role="alert"]')).toBeNull();
    expect(replace).not.toHaveBeenCalled();
  });

  it("starts the payment with the paid and unpaid pages as return URLs", async () => {
    const { shopware } = await setup();
    const successPage = `${window.location.origin}/checkout/success/order-1`;

    expect(shopware.operations()).toEqual([READ_ORDER, HANDLE_PAYMENT]);
    expect(shopware.calls(HANDLE_PAYMENT)[0]?.params).toEqual({
      body: {
        orderId: "order-1",
        finishUrl: `${successPage}/paid`,
        errorUrl: `${successPage}/unpaid`,
      },
    });
  });

  it("reads the order and starts the payment once under StrictMode", async () => {
    const { shopware } = await setup({
      wrap: (node) => <StrictMode>{node}</StrictMode>,
    });

    expect(shopware.operations()).toEqual([READ_ORDER, HANDLE_PAYMENT]);
  });

  it("does not start the payment again when the session changes after the order loaded", async () => {
    const { container, shopware } = await setup();
    expect(shopware.operations()).toEqual([READ_ORDER, HANDLE_PAYMENT]);

    await interact(() => sessionControl.set(unavailableSession));
    await interact(() => sessionControl.set(loggedIn));

    expect(shopware.calls(READ_ORDER)).toHaveLength(1);
    expect(shopware.calls(HANDLE_PAYMENT)).toHaveLength(1);
    expect(query(container, SUCCESS_PAGE)).toBeDefined();
    expect(replace).not.toHaveBeenCalled();
  });

  it("shows the payment alert and redirects to the gateway after five seconds", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const { container } = await setup({
      answers: {
        [HANDLE_PAYMENT]: () => ({ redirectUrl: "https://psp.test/pay/1" }),
      },
    });

    const alert = query<HTMLElement>(container, '[role="alert"]');
    expect(alert.textContent).toContain("Finish payment process.");
    expect(alert.textContent).toContain(
      "You will be redirected to the payment gateway in 5 seconds.",
    );

    await interact(() => vi.advanceTimersByTime(4999));
    expect(redirectToPayment).not.toHaveBeenCalled();

    await interact(() => vi.advanceTimersByTime(1));
    expect(redirectToPayment).toHaveBeenCalledTimes(1);
    expect(redirectToPayment).toHaveBeenCalledWith("https://psp.test/pay/1");
  });

  it("goes to the payment right away from the alert button", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const { container } = await setup({
      answers: {
        [HANDLE_PAYMENT]: () => ({ redirectUrl: "https://psp.test/pay/1" }),
      },
    });

    const button = queryAll<HTMLButtonElement>(container, "button").find(
      (candidate) => candidate.textContent === "Go to payment",
    );
    await interact(() => button?.click());

    expect(redirectToPayment).toHaveBeenCalledWith("https://psp.test/pay/1");
  });

  it("does not redirect for a redirect URL that is not http or https", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const { container } = await setup({
      answers: {
        [HANDLE_PAYMENT]: () => ({ redirectUrl: "javascript:alert(1)" }),
      },
    });

    await interact(() => vi.advanceTimersByTime(10000));

    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(redirectToPayment).not.toHaveBeenCalled();
  });

  it("cancels the pending redirect when the page unmounts", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    await setup({
      answers: {
        [HANDLE_PAYMENT]: () => ({ redirectUrl: "https://psp.test/pay/1" }),
      },
    });

    await mounted?.unmount();
    mounted = undefined;
    vi.advanceTimersByTime(10000);

    expect(redirectToPayment).not.toHaveBeenCalled();
  });

  it("keeps the confirmation when starting the payment fails", async () => {
    const { container } = await setup({
      answers: {
        [HANDLE_PAYMENT]: () => {
          throw new Error("payment failed");
        },
      },
    });

    expect(query(container, '[data-testid="order-total"]').textContent).toBe(
      "€64.97",
    );
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it("sends an anonymous visitor home without reading the order", async () => {
    const { container, shopware } = await setup({
      session: checkoutSession(),
    });

    expect(replace).toHaveBeenCalledWith("/");
    expect(shopware.invocations).toHaveLength(0);
    expect(container.querySelector(SUCCESS_PAGE)).toBeNull();
  });

  it("waits for the session before reading the order of a guest", async () => {
    const { container, shopware } = await setup({
      session: checkoutSession({ status: "loading" }),
    });

    expect(shopware.invocations).toHaveLength(0);
    expect(query(container, '[data-testid="loading"] output').textContent).toBe(
      "Loading...",
    );

    await interact(() =>
      sessionControl.set(
        checkoutSession({ customer: checkoutCustomer({ guest: true }) }),
      ),
    );

    expect(replace).not.toHaveBeenCalled();
    expect(shopware.calls(READ_ORDER)).toHaveLength(1);
    expect(container.querySelector(SUCCESS_PAGE)).not.toBeNull();
  });

  it("shows the load error with a way back to the shop", async () => {
    const { container, shopware } = await setup({
      answers: {
        [READ_ORDER]: () => {
          throw new Error("order not readable");
        },
      },
    });

    expect(query(container, '[role="alert"]').textContent).toBe(
      "We could not load your order. Your session may have expired.",
    );
    const link = query<HTMLAnchorElement>(container, "a");
    expect(link.textContent).toBe("Continue shopping");
    expect(link.getAttribute("href")).toBe("/");
    expect(shopware.calls(HANDLE_PAYMENT)).toHaveLength(0);
  });

  it("treats a missing order as a load error", async () => {
    const { container } = await setup({
      answers: { [READ_ORDER]: () => ({ orders: { elements: [] } }) },
    });

    expect(query(container, '[role="alert"]').textContent).toContain(
      "We could not load your order.",
    );
  });
});
