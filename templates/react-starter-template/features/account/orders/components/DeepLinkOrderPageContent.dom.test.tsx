import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { StrictMode, Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  checkoutCustomer,
  checkoutSession,
  fakeClient,
} from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import {
  SessionHarness,
  ShopwareClientHarness,
  apiError,
  cartResult,
  fakeCart,
} from "@/features/checkout/checkoutTestDoubles";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import type { StorefrontSession } from "@/features/session/types";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  query,
  queryAll,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { accountOrder, orderRouteResponse } from "../orders.fixture";
import { DeepLinkOrderPageContent } from "./DeepLinkOrderPageContent";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("@/features/checkout/checkoutTestDoubles"))
    .useFakeCart,
}));

const READ_ORDER = "readOrder post /order";
const WRONG_DATA =
  "The email address or postal code is incorrect. Please try again.";

function guestError(code: string) {
  return () => {
    throw apiError([{ code, status: "403", detail: code }], 403);
  };
}

const notAuthenticated = guestError("CHECKOUT__GUEST_NOT_AUTHENTICATED");

type ReadOrderBody = { email?: string; zipcode?: string };

function hasCredentials(params: unknown): boolean {
  const body = (params as { body: ReadOrderBody }).body;
  return body.email !== undefined;
}

let mounted: Mounted | undefined;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

async function setup({
  answer,
  session = checkoutSession(),
  strict = false,
  locale = "en-GB",
}: {
  answer: FakeAnswer;
  session?: StorefrontSession;
  strict?: boolean;
  locale?: Locale;
}) {
  const shopware = fakeClient(answer);
  const notify = vi.fn();
  const refreshSession = vi.fn<SessionActions["refreshSession"]>(
    async () => {},
  );
  fakeCart.set(cartResult());
  const tree = withI18n(
    <CmsActionsProvider actions={{ notify }}>
      <ShopwareClientHarness client={shopware.client}>
        <SessionHarness initial={session}>
          <SessionActionsProvider actions={{ refreshSession }}>
            <Suspense fallback={<p data-testid="suspended" />}>
              <DeepLinkOrderPageContent
                params={Promise.resolve({ deepCode: "deep-code-1" })}
              />
            </Suspense>
          </SessionActionsProvider>
        </SessionHarness>
      </ShopwareClientHarness>
    </CmsActionsProvider>,
    locale,
  );
  mounted = await mount(strict ? <StrictMode>{tree}</StrictMode> : tree);
  return { container: mounted.container, shopware, notify, refreshSession };
}

function bodies(shopware: ReturnType<typeof fakeClient>) {
  return shopware
    .calls(READ_ORDER)
    .map(({ params }) => (params as { body: Record<string, unknown> }).body);
}

async function fillAndSubmit(
  container: HTMLElement,
  { email, zipcode }: { email: string; zipcode: string },
) {
  await interact(() => {
    setInputValue(
      query<HTMLInputElement>(container, "#deep-link-email"),
      email,
    );
    setInputValue(
      query<HTMLInputElement>(container, "#deep-link-postal-code"),
      zipcode,
    );
  });
  await interact(() =>
    submitForm(
      query<HTMLFormElement>(container, '[data-testid="deep-link-order-form"]'),
    ),
  );
}

describe("DeepLinkOrderPageContent", () => {
  it("asks a guest for the email address and postal code", async () => {
    const { container, shopware } = await setup({
      answer: notAuthenticated,
      strict: true,
    });

    expect(bodies(shopware)).toHaveLength(1);
    expect(bodies(shopware)[0]).toMatchObject({
      login: true,
      filter: [{ field: "deepLinkCode", type: "equals", value: "deep-code-1" }],
    });
    expect(bodies(shopware)[0]).not.toHaveProperty("email");
    expect(query(container, "h1").textContent).toBe("Verify your order");
    expect(container.textContent).toContain(
      "Please enter the email address and postal code used when placing the order.",
    );
    const email = query<HTMLInputElement>(container, "#deep-link-email");
    expect(email.type).toBe("email");
    expect(email.autocomplete).toBe("email");
    expect(
      query<HTMLLabelElement>(container, 'label[for="deep-link-email"]')
        .textContent,
    ).toContain("Email address");
    expect(
      query<HTMLLabelElement>(container, 'label[for="deep-link-postal-code"]')
        .textContent,
    ).toContain("Postal code");
    expect(
      query(container, '[data-testid="deep-link-order-submit-button"]')
        .textContent,
    ).toBe("Verify order");
    expect(container.querySelector('a[href="/account/order"]')).toBeNull();
  });

  it("validates the form before asking the backend", async () => {
    const { container, shopware } = await setup({ answer: notAuthenticated });

    await fillAndSubmit(container, { email: "", zipcode: "" });

    expect(bodies(shopware)).toHaveLength(1);
    const email = query<HTMLInputElement>(container, "#deep-link-email");
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(email);
    expect(
      queryAll(container, "p.text-states-error").map(
        (error) => error.textContent,
      ),
    ).toEqual(["Value is required", "Value is required"]);

    await fillAndSubmit(container, { email: "guest", zipcode: "12345" });

    expect(bodies(shopware)).toHaveLength(1);
    expect(
      query(container, `#${CSS.escape("deep-link-email-error")}`).textContent,
    ).toBe("Value is not a valid email address");
  });

  it("tells the guest when the email address or postal code is wrong", async () => {
    const { container, shopware, notify, refreshSession } = await setup({
      answer: (operation, params) =>
        hasCredentials(params)
          ? guestError("CHECKOUT__GUEST_WRONG_CREDENTIALS")()
          : notAuthenticated(),
    });

    await fillAndSubmit(container, {
      email: "guest@example.com",
      zipcode: "99999",
    });

    expect(bodies(shopware)[1]).toMatchObject({
      email: "guest@example.com",
      zipcode: "99999",
      login: true,
    });
    expect(notify).toHaveBeenCalledWith({ type: "error", message: WRONG_DATA });
    expect(
      query(container, '[data-testid="deep-link-order-form"]'),
    ).toBeTruthy();
    expect(query<HTMLInputElement>(container, "#deep-link-email").value).toBe(
      "guest@example.com",
    );
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("renders the order after a successful verification and refreshes the session the guest login changed", async () => {
    const { container, refreshSession, notify } = await setup({
      answer: (operation, params) =>
        hasCredentials(params)
          ? orderRouteResponse([accountOrder()])
          : notAuthenticated(),
    });

    await fillAndSubmit(container, {
      email: "guest@example.com",
      zipcode: "12345",
    });

    expect(
      container.querySelector('[data-testid="deep-link-order-form"]'),
    ).toBeNull();
    expect(query(container, "h1").textContent).toBe("Order #10042");
    expect(query(container, '[data-testid="order-total"]').textContent).toBe(
      "€64.97",
    );
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(notify).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(query(container, "h1"));
  });

  it("reports a failed verification with one toast and keeps the form", async () => {
    const { container, notify } = await setup({
      answer: (operation, params) => {
        if (!hasCredentials(params)) return notAuthenticated();
        throw apiError(
          [
            {
              code: "CHECKOUT__CUSTOMER_NOT_LOGGED_IN",
              status: "403",
              detail: "Customer is not logged in.",
            },
          ],
          403,
        );
      },
    });

    await fillAndSubmit(container, {
      email: "guest@example.com",
      zipcode: "12345",
    });

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: "Customer is not logged in.",
    });
    expect(
      query(container, '[data-testid="deep-link-order-form"]'),
    ).toBeTruthy();
    expect(query(container, '[role="alert"]').textContent).toBe("");
  });

  it("says the order could not be found when verified data match no order", async () => {
    const { container } = await setup({ answer: notAuthenticated });

    await fillAndSubmit(container, {
      email: "guest@example.com",
      zipcode: "12345",
    });

    expect(query(container, '[role="alert"]').textContent).toContain(
      "The order could not be found.",
    );
    expect(query(container, "h2").textContent).toBe("Verify your order");
    expect(
      query(container, '[data-testid="deep-link-order-form"]'),
    ).toBeTruthy();
  });

  it("shows the order of a customer who is already logged in without asking", async () => {
    const { container, shopware, refreshSession } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      answer: () => orderRouteResponse([accountOrder()]),
    });

    expect(bodies(shopware)).toHaveLength(1);
    expect(container.querySelector("form")).toBeNull();
    expect(
      query<HTMLAnchorElement>(container, 'a[href="/account/order"]')
        .textContent,
    ).toBe("Back to orders list");
    expect(query(container, '[data-testid="order-total"]').textContent).toBe(
      "€64.97",
    );
    expect(refreshSession).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(query(container, "h1"));
  });

  it("says the order could not be found for an unknown or expired link", async () => {
    const { container } = await setup({
      answer: guestError("CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND"),
    });

    expect(query(container, "h1").textContent).toBe(
      "The order could not be found.",
    );
    expect(container.querySelector("form")).toBeNull();
  });

  it("shows other errors once and lets the visitor try again", async () => {
    let fail = true;
    const { container, notify, shopware } = await setup({
      answer: () => {
        if (fail) {
          throw apiError(
            [
              {
                code: "CHECKOUT__CUSTOMER_NOT_LOGGED_IN",
                status: "403",
                detail: "Customer is not logged in.",
              },
            ],
            403,
          );
        }
        return orderRouteResponse([accountOrder()]);
      },
    });

    expect(notify).not.toHaveBeenCalled();
    const alert = query(container, '[role="alert"]');
    expect(alert.textContent).toContain("Customer is not logged in.");

    fail = false;
    await interact(() => query<HTMLButtonElement>(alert, "button").click());

    expect(bodies(shopware)).toHaveLength(2);
    expect(query(container, '[data-testid="order-total"]').textContent).toBe(
      "€64.97",
    );
    expect(document.activeElement).toBe(query(container, "h1"));
  });

  it("shows the default message for a failure without details", async () => {
    const { container, notify } = await setup({
      answer: () => {
        throw apiError([], 500);
      },
    });

    expect(notify).not.toHaveBeenCalled();
    expect(query(container, '[role="alert"]').textContent).toContain(
      "Unfortunately, something went wrong.",
    );
  });
});

describe("DeepLinkOrderPageContent in Polish", () => {
  it("asks for the credentials in Polish and validates them in Polish", async () => {
    const { container, notify } = await setup({
      answer: (_operation, params) => {
        if (hasCredentials(params)) {
          return guestError("CHECKOUT__GUEST_WRONG_CREDENTIALS")();
        }
        return notAuthenticated();
      },
      locale: "pl-PL",
    });

    expect(query(container, "h1").textContent).toBe(
      "Zweryfikuj swoje zamówienie",
    );

    await fillAndSubmit(container, { email: "guest", zipcode: "" });
    expect(container.querySelector("#deep-link-email-error")?.textContent).toBe(
      "Wartość nie jest prawidłowym adresem e-mail",
    );
    expect(
      container.querySelector("#deep-link-postal-code-error")?.textContent,
    ).toBe("Wartość jest wymagana");

    await fillAndSubmit(container, {
      email: "guest@example.com",
      zipcode: "12345",
    });
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message:
        "Adres e-mail lub kod pocztowy jest nieprawidłowy. Spróbuj ponownie.",
    });
  });

  it("links a logged-in customer back to the prefixed orders list", async () => {
    const { container } = await setup({
      answer: () => orderRouteResponse([accountOrder()]),
      session: checkoutSession({ customer: checkoutCustomer() }),
      locale: "pl-PL",
    });

    expect(
      query(container, 'a[href="/pl-PL/account/order"]').textContent,
    ).toContain("Powrót do listy zamówień");
    expect(query(container, "h1").textContent).toBe("Zamówienie #10042");
  });
});
