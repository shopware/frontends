import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import type { ApiClient } from "#shopware";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import { ORDER_TIMEOUT_MS } from "@/features/session/readTimeout";
import { unavailableSession } from "@/features/session/sessionFromContext";
import type {
  RegistrationInput,
  SessionActionResult,
  StorefrontSession,
} from "@/features/session/types";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll, setInputValue } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import {
  checkoutCustomer,
  checkoutSession,
  countries,
  fakeClient,
  order,
  paymentMethods,
  shippingMethods,
} from "../checkout.fixture";
import type { FakeAnswer } from "../checkout.fixture";
import {
  SessionHarness,
  ShopwareClientHarness,
  apiError,
  cartLineItem,
  cartResult,
  deferred,
  fakeCart,
  sessionControl,
  timeoutError,
} from "../checkoutTestDoubles";
import type { FakeCartResult } from "../checkoutTestDoubles";
import { CheckoutPageContent } from "./CheckoutPageContent";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("../checkoutTestDoubles")).useFakeCart,
}));

const PLACE_ORDER = '[data-testid="checkout-place-order-button"]';
const CREATE_ORDER = "createOrder post /checkout/order";
const UPDATE_CONTEXT = "updateContext patch /context";
const UPDATE_ADDRESS =
  "updateCustomerAddress patch /account/address/{addressId}";
const CHANGE_PROFILE = "changeProfile post /account/change-profile";
const READ_SHIPPING_METHODS = "readShippingMethodGet get /shipping-method";
const GENERIC_ERROR = "An error occurred. Please try again.";
const MESSAGE_DEFAULT =
  "Unfortunately, something went wrong. Please try again in a few moments. If the problem persists, you can return to the homepage or contact our support team for assistance.";
const ORDER_TIMEOUT_MESSAGE =
  "We did not get a confirmation in time. Your order may still have been placed, so please check your orders before trying again.";

const guestSession = checkoutSession({
  customer: checkoutCustomer({ guest: true, id: "guest-1" }),
});

let mounted: Mounted | undefined;

beforeEach(() => {
  push.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

function checkoutAnswer(overrides: Record<string, FakeAnswer> = {}) {
  return (operation: string, params: unknown) => {
    const override = overrides[operation];
    if (override) return override(operation, params);
    switch (operation) {
      case "readShippingMethodGet get /shipping-method":
        return { elements: shippingMethods };
      case "readPaymentMethodGet get /payment-method":
        return { elements: paymentMethods };
      case CREATE_ORDER:
        return order();
      default:
        return {};
    }
  };
}

type SetupOptions = {
  session?: StorefrontSession;
  cart?: FakeCartResult;
  register?: Mock<SessionActions["register"]>;
  refreshSession?: Mock<SessionActions["refreshSession"]>;
  retrySession?: Mock<SessionActions["retrySession"]>;
  answers?: Record<string, FakeAnswer>;
  getClient?: () => Promise<ApiClient>;
  locale?: Locale;
};

async function setup({
  session = checkoutSession(),
  cart = cartResult(),
  register = vi.fn<SessionActions["register"]>(async () => ({ ok: true })),
  refreshSession = vi.fn<SessionActions["refreshSession"]>(async () => {}),
  retrySession = vi.fn<SessionActions["retrySession"]>(async () => session),
  answers = {},
  getClient,
  locale,
}: SetupOptions = {}) {
  const shopware = fakeClient(checkoutAnswer(answers));
  fakeCart.set(cart);
  const notify = vi.fn();
  const actions = { register, refreshSession, retrySession };
  const page = (
    <CmsActionsProvider actions={{ notify }}>
      <SessionHarness initial={session}>
        <SessionActionsProvider actions={actions}>
          <CheckoutPageContent countries={countries} />
        </SessionActionsProvider>
      </SessionHarness>
    </CmsActionsProvider>
  );
  const tree = getClient ? (
    <ShopwareClientProvider getClient={getClient}>
      {page}
    </ShopwareClientProvider>
  ) : (
    <ShopwareClientHarness client={shopware.client}>
      {page}
    </ShopwareClientHarness>
  );
  mounted = await mount(locale ? withI18n(tree, locale) : tree);
  const { container } = mounted;
  return {
    container,
    notify,
    register,
    refreshSession,
    retrySession,
    cart,
    shopware,
    button: () => query<HTMLButtonElement>(container, PLACE_ORDER),
    input: (testId: string) =>
      query<HTMLInputElement>(container, `[data-testid="${testId}"]`),
  };
}

async function fill(
  input: (testId: string) => HTMLInputElement,
  values: Record<string, string>,
) {
  for (const [testId, value] of Object.entries(values)) {
    await interact(() => setInputValue(input(testId), value));
  }
}

async function chooseCountry(container: HTMLElement, name: string) {
  const combobox = query<HTMLInputElement>(
    container,
    '[data-testid="country-select"]',
  );
  await interact(() => combobox.click());
  await interact(() => setInputValue(combobox, name));
  const option = queryAll<HTMLButtonElement>(container, '[role="option"]').find(
    (candidate) => candidate.textContent?.includes(name),
  );
  if (!option) throw new Error(`No country option "${name}"`);
  await interact(() => option.click());
}

const customerData = {
  "checkout-pi-email-input": "jane@example.com",
  "checkout-pi-first-name-input": "Jane",
  "checkout-pi-last-name-input": "Doe",
  "checkout-pi-street-address-input": "Main Street 1",
  "checkout-pi-zip-code-input": "12345",
  "checkout-pi-city-input": "Warsaw",
};

const expectedRegistration: RegistrationInput = {
  accountType: "private",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  password: "",
  guest: true,
  billingAddress: {
    customerId: "",
    id: "",
    firstName: "Jane",
    lastName: "Doe",
    street: "Main Street 1",
    zipcode: "12345",
    city: "Warsaw",
    countryId: "country-pl",
    countryStateId: undefined,
  },
  acceptedDataProtection: true,
};

async function fillGuestForm(
  container: HTMLElement,
  input: (testId: string) => HTMLInputElement,
) {
  await fill(input, customerData);
  await chooseCountry(container, "Poland");
}

function setSelectValue(select: HTMLSelectElement, value: string) {
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function buttonByText(root: ParentNode, text: string) {
  const button = queryAll<HTMLButtonElement>(root, "button").find(
    (candidate) => candidate.textContent === text,
  );
  if (!button) throw new Error(`No button "${text}"`);
  return button;
}

function stateSelect(container: HTMLElement) {
  return query<HTMLSelectElement>(
    container,
    '[data-testid="checkout-pi-state-input"]',
  );
}

function radio(container: HTMLElement, name: string, value: string) {
  return query<HTMLInputElement>(
    container,
    `input[type="radio"][name="${name}"][value="${value}"]`,
  );
}

describe("CheckoutPageContent", () => {
  it("shows a skeleton until the session and the cart are read", async () => {
    const { container } = await setup({
      session: checkoutSession({ status: "loading" }),
    });

    expect(
      query<HTMLElement>(container, '[data-testid="loading"]').getAttribute(
        "aria-busy",
      ),
    ).toBe("true");
    expect(container.querySelector(PLACE_ORDER)).toBeNull();
  });

  it("shows the empty cart state with a link back to the shop", async () => {
    const { container } = await setup({
      cart: cartResult({ lineItems: [] }),
    });

    expect(query(container, "h1").textContent).toBe("Your cart is empty");
    const link = query<HTMLAnchorElement>(container, "a");
    expect(link.textContent).toBe("Continue Shopping");
    expect(link.getAttribute("href")).toBe("/");
    expect(container.querySelector(PLACE_ORDER)).toBeNull();
  });

  it("renders the steps, the methods from the API and the summary", async () => {
    const { container, shopware } = await setup();

    expect(query(container, "h1").textContent).toBe("Checkout");
    expect(queryAll(container, "section h2").map((h) => h.textContent)).toEqual(
      ["Shipping address", "Shipping", "Payment information", "Summary"],
    );
    expect(
      queryAll(container, '[data-testid="checkout-shipping-method"]'),
    ).toHaveLength(2);
    expect(
      radio(container, "shipping-method", "shipping-standard").checked,
    ).toBe(true);
    expect(radio(container, "payment-method", "payment-invoice").checked).toBe(
      true,
    );
    expect(query(container, '[data-testid="cart-subtotal"]').textContent).toBe(
      "€59.98",
    );
    expect(query(container, '[data-testid="cart-total"]').textContent).toBe(
      "€64.97",
    );
    expect(
      query(
        container,
        '[data-testid="checkout-product-tile-item"]',
      ).getAttribute("data-product-id"),
    ).toBe("product-1");
    expect(shopware.operations().sort()).toEqual([
      "readPaymentMethodGet get /payment-method",
      "readShippingMethodGet get /shipping-method",
    ]);
  });

  it("wires the summary tiles to the cart actions", async () => {
    const { container, cart } = await setup({
      cart: cartResult({
        lineItems: [cartLineItem({ removable: true, stackable: true })],
      }),
    });

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="checkout-product-tile-remove-button"]',
      ).click(),
    );
    await interact(() =>
      query<HTMLButtonElement>(
        container,
        'button[aria-label="Increase quantity"]',
      ).click(),
    );

    expect(cart.removeItem).toHaveBeenCalledWith("line-1");
    expect(cart.changeQuantity).toHaveBeenCalledWith("line-1", 3);
  });

  it("validates the customer form and focuses the first invalid field", async () => {
    const { container, register, shopware, button, input } = await setup();

    await interact(() => button().click());

    expect(input("checkout-pi-email-input").getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(container.querySelector("#email-error")?.textContent).toBe(
      "Value is required",
    );
    expect(container.querySelector("#country-error")?.textContent).toBe(
      "Value is required",
    );
    expect(document.activeElement).toBe(input("checkout-pi-email-input"));
    expect(register).not.toHaveBeenCalled();
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(0);
  });

  it("registers a guest, places the order and opens the success page", async () => {
    const steps: string[] = [];
    const register = vi.fn<SessionActions["register"]>(async () => {
      steps.push("register");
      sessionControl.set(guestSession);
      return { ok: true };
    });
    const refreshSession = vi.fn<SessionActions["refreshSession"]>(async () => {
      steps.push("refreshSession");
    });
    const { container, input, button, shopware, cart } = await setup({
      register,
      refreshSession,
      answers: {
        [CREATE_ORDER]: () => {
          steps.push("createOrder");
          return order();
        },
      },
    });

    await fillGuestForm(container, input);
    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(register.mock.calls[0]?.[0]).toEqual(expectedRegistration);
    expect(steps).toEqual(["register", "createOrder", "refreshSession"]);
    expect(shopware.calls(CREATE_ORDER)[0]?.params).toEqual({
      body: {},
      fetchOptions: { timeout: ORDER_TIMEOUT_MS },
    });
    expect(
      shopware.calls("readShippingMethodGet get /shipping-method"),
    ).toHaveLength(2);
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
    expect(cart.refresh).toHaveBeenCalled();
    expect(
      query(container, 'output[aria-label="Placing order…"]').textContent,
    ).toContain("Placing order…");
    expect(container.querySelector("[inert]")).not.toBeNull();
  });

  it("stops when the registration fails and gives the button its focus back", async () => {
    const register = vi.fn<SessionActions["register"]>(
      async (): Promise<SessionActionResult> => ({
        ok: false,
        message: "The email address jane@example.com is already in use",
      }),
    );
    const { container, input, button, shopware, notify } = await setup({
      register,
    });

    await fillGuestForm(container, input);
    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(0);
    expect(push).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
    expect(button().disabled).toBe(false);
    expect(document.activeElement).toBe(button());
    expect(container.querySelector("output")).toBeNull();
    expect(input("checkout-pi-email-input")).toBeDefined();
  });

  it("creates an account when the toggle is used and requires its password", async () => {
    const register = vi.fn<SessionActions["register"]>(async () => {
      sessionControl.set(
        checkoutSession({ customer: checkoutCustomer({ id: "customer-2" }) }),
      );
      return { ok: true };
    });
    const { container, input, button } = await setup({ register });

    expect(container.querySelector("#password")).toBeNull();
    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="checkout-create-account-toggle"]',
      ).click(),
    );

    const password = input("checkout-pi-password-input");
    expect(document.activeElement).toBe(password);
    expect(
      container.querySelector('[data-testid="checkout-create-account-toggle"]'),
    ).toBeNull();

    await fillGuestForm(container, input);
    await interact(() => button().click());

    expect(register).not.toHaveBeenCalled();
    expect(container.querySelector("#password-error")?.textContent).toBe(
      "Value is required",
    );
    expect(document.activeElement).toBe(password);

    await interact(() => setInputValue(password, "password123"));
    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(register.mock.calls[0]?.[0]).toEqual({
      ...expectedRegistration,
      password: "password123",
      guest: false,
    });
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
  });

  it("forgets the password when the customer continues as a guest", async () => {
    const { container, input, button, register } = await setup();
    const createToggle = () =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="checkout-create-account-toggle"]',
      );

    await interact(() => createToggle().click());
    await interact(() =>
      setInputValue(input("checkout-pi-password-input"), "password123"),
    );
    await interact(() => buttonByText(container, "Continue as guest").click());

    expect(container.querySelector("#password")).toBeNull();
    expect(document.activeElement).toBe(createToggle());

    await interact(() => createToggle().click());
    expect(input("checkout-pi-password-input").value).toBe("");
    await interact(() => buttonByText(container, "Continue as guest").click());

    await fillGuestForm(container, input);
    await interact(() => button().click());

    expect(register.mock.calls[0]?.[0]).toEqual(expectedRegistration);
  });

  it("places the order of a logged-in customer with the chosen address and no registration", async () => {
    const { container, register, shopware } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
    });

    expect(
      container.querySelector('[data-testid="checkout-pi-email-input"]'),
    ).toBeNull();
    const address = query<HTMLElement>(
      container,
      '[data-testid="checkout-chosen-address"]',
    );
    expect(address.textContent).toContain("Jane Doe");
    expect(address.textContent).toContain("Main Street 1");
    expect(address.textContent).toContain("12345 Berlin");
    expect(address.textContent).toContain("Germany");

    await interact(() =>
      query<HTMLButtonElement>(container, PLACE_ORDER).click(),
    );

    expect(register).not.toHaveBeenCalled();
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(1);
    expect(
      shopware.calls("changeProfile post /account/change-profile"),
    ).toHaveLength(0);
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
  });

  it("disables the place order button only for a user session without methods", async () => {
    const loggedIn = await setup({
      session: checkoutSession({
        customer: checkoutCustomer(),
        shippingMethodId: null,
      }),
    });
    expect(loggedIn.button().disabled).toBe(true);
    await mounted?.unmount();

    const guest = await setup({
      session: checkoutSession({ shippingMethodId: null }),
    });
    expect(guest.button().disabled).toBe(false);
  });

  it("changes the shipping method and refreshes the session and the cart", async () => {
    const refreshSession = vi.fn<SessionActions["refreshSession"]>(async () => {
      sessionControl.set(
        checkoutSession({ shippingMethodId: "shipping-express" }),
      );
    });
    const { container, shopware, cart } = await setup({ refreshSession });

    await interact(() =>
      radio(container, "shipping-method", "shipping-express").click(),
    );

    expect(shopware.calls(UPDATE_CONTEXT)).toEqual([
      {
        operation: UPDATE_CONTEXT,
        params: { body: { shippingMethodId: "shipping-express" } },
      },
    ]);
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(cart.refresh).toHaveBeenCalledTimes(1);
    expect(
      radio(container, "shipping-method", "shipping-express").checked,
    ).toBe(true);
  });

  it("changes the payment method and falls back to the session choice on an error", async () => {
    const { container, shopware, notify } = await setup({
      answers: {
        [UPDATE_CONTEXT]: () => {
          throw apiError([{ code: "CHECKOUT__UNKNOWN_PAYMENT_METHOD" }]);
        },
      },
    });

    await interact(() =>
      radio(container, "payment-method", "payment-cash").click(),
    );

    expect(shopware.calls(UPDATE_CONTEXT)[0]?.params).toEqual({
      body: { paymentMethodId: "payment-cash" },
    });
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "The selected payment method does not exist.",
    });
    expect(radio(container, "payment-method", "payment-invoice").checked).toBe(
      true,
    );
  });

  it("keeps the page and shows a persistent error when the order is rejected", async () => {
    const { container, notify, button, cart } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      answers: {
        [CREATE_ORDER]: () => {
          throw apiError([{ code: "CHECKOUT__UNKNOWN_PAYMENT_METHOD" }]);
        },
      },
    });

    await interact(() => button().click());

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "The selected payment method does not exist.",
      timeout: 0,
    });
    expect(cart.refresh).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
    expect(query(container, "h1").textContent).toBe("Checkout");
    expect(button().disabled).toBe(false);
    expect(document.activeElement).toBe(button());
  });

  it.each([
    ["placing it timed out", timeoutError],
    ["the gateway timed out", () => apiError([], 504)],
    ["the gateway was unavailable", () => apiError([], 503)],
    ["the connection dropped", () => new TypeError("Failed to fetch")],
  ])(
    "warns that the order may exist when %s and re-reads the cart",
    async (_, failure) => {
      const { container, notify, button, cart } = await setup({
        session: checkoutSession({ customer: checkoutCustomer() }),
        answers: {
          [CREATE_ORDER]: () => {
            throw failure();
          },
        },
      });

      await interact(() => button().click());

      expect(notify).toHaveBeenCalledTimes(1);
      expect(notify).toHaveBeenCalledWith({
        type: "error",
        message: ORDER_TIMEOUT_MESSAGE,
        timeout: 0,
      });
      expect(cart.refresh).toHaveBeenCalledTimes(1);
      expect(push).not.toHaveBeenCalled();
      expect(query(container, "h1").textContent).toBe("Checkout");
      expect(document.activeElement).toBe(button());
    },
  );

  it("shows the empty cart when the re-read after an unconfirmed order finds the cart emptied", async () => {
    const refresh = vi.fn(async () => {
      fakeCart.set(cartResult({ lineItems: [], refresh }));
    });
    const { container } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      cart: cartResult({ refresh }),
      answers: {
        [CREATE_ORDER]: () => {
          throw apiError([], 504);
        },
      },
    });

    await interact(() =>
      query<HTMLButtonElement>(container, PLACE_ORDER).click(),
    );

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(query(container, "h1").textContent).toBe("Your cart is empty");
    expect(container.querySelector(PLACE_ORDER)).toBeNull();
    expect(push).not.toHaveBeenCalled();
  });

  it("does not claim the order may exist when the Store API client is missing", async () => {
    const getClient = vi.fn(async (): Promise<ApiClient> => {
      throw new Error("config down");
    });
    const { notify, button, shopware } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      getClient,
    });

    await interact(() => button().click());

    expect(getClient).toHaveBeenCalled();
    expect(shopware.invocations).toHaveLength(0);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: MESSAGE_DEFAULT,
      timeout: 0,
    });
    expect(push).not.toHaveBeenCalled();
  });

  it("updates the customer details instead of registering again after a failed order", async () => {
    const steps: string[] = [];
    let attempts = 0;
    const register = vi.fn<SessionActions["register"]>(async () => {
      steps.push("register");
      sessionControl.set(guestSession);
      return { ok: true };
    });
    const refreshSession = vi.fn<SessionActions["refreshSession"]>(async () => {
      steps.push("refreshSession");
    });
    const refresh = vi.fn(async () => {
      steps.push("cart.refresh");
    });
    const { container, input, button, shopware } = await setup({
      register,
      refreshSession,
      cart: cartResult({ refresh }),
      answers: {
        [UPDATE_ADDRESS]: () => {
          steps.push("updateCustomerAddress");
          return {};
        },
        [CHANGE_PROFILE]: () => {
          steps.push("changeProfile");
          return {};
        },
        [CREATE_ORDER]: () => {
          steps.push("createOrder");
          attempts += 1;
          if (attempts === 1) {
            throw apiError([{ code: "CHECKOUT__UNKNOWN_PAYMENT_METHOD" }]);
          }
          return order();
        },
      },
    });

    await fillGuestForm(container, input);
    await interact(() => button().click());
    expect(push).not.toHaveBeenCalled();
    expect(input("checkout-pi-email-input").value).toBe("jane@example.com");

    await fill(input, { "checkout-pi-street-address-input": "Other Road 9" });
    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(shopware.calls(UPDATE_ADDRESS)[0]?.params).toMatchObject({
      pathParams: { addressId: "address-1" },
      body: { street: "Other Road 9", city: "Warsaw", countryId: "country-pl" },
    });
    expect(shopware.calls(CHANGE_PROFILE)[0]?.params).toEqual({
      body: {
        firstName: "Jane",
        lastName: "Doe",
        salutationId: "salutation-1",
      },
    });
    expect(steps).toEqual([
      "register",
      "createOrder",
      "cart.refresh",
      "updateCustomerAddress",
      "changeProfile",
      "refreshSession",
      "cart.refresh",
      "createOrder",
      "refreshSession",
      "cart.refresh",
    ]);
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
  });

  it("re-reads the session instead of registering again when the registered customer is not in the session yet", async () => {
    let attempts = 0;
    const register = vi.fn<SessionActions["register"]>(async () => ({
      ok: true,
    }));
    const anonymous = checkoutSession();
    const retrySession = vi
      .fn<SessionActions["retrySession"]>()
      .mockImplementationOnce(async () => anonymous)
      .mockImplementationOnce(async () => {
        sessionControl.set(guestSession);
        return guestSession;
      });
    const { container, input, button, shopware, notify } = await setup({
      register,
      retrySession,
      answers: {
        [CREATE_ORDER]: () => {
          attempts += 1;
          if (attempts === 1) {
            throw apiError([{ code: "CHECKOUT__UNKNOWN_PAYMENT_METHOD" }]);
          }
          return order();
        },
      },
    });

    await fillGuestForm(container, input);
    await interact(() => button().click());
    expect(register).toHaveBeenCalledTimes(1);
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(1);

    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(retrySession).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenLastCalledWith({
      type: "error",
      message: GENERIC_ERROR,
      timeout: 0,
    });
    expect(shopware.calls(CHANGE_PROFILE)).toHaveLength(0);
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(1);
    expect(document.activeElement).toBe(button());

    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(retrySession).toHaveBeenCalledTimes(2);
    expect(shopware.calls(UPDATE_ADDRESS)[0]?.params).toMatchObject({
      pathParams: { addressId: "address-1" },
      body: { street: "Main Street 1", countryId: "country-pl" },
    });
    expect(shopware.calls(CHANGE_PROFILE)).toHaveLength(1);
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(2);
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
  });

  it("places one order for a double click", async () => {
    const pending = deferred<unknown>();
    const { button, shopware } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      answers: { [CREATE_ORDER]: () => pending.promise },
    });

    await interact(() => {
      button().click();
      button().click();
    });
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(1);

    await interact(() => pending.resolve(order()));
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
  });

  it("offers a retry instead of the guest form when the session could not be read", async () => {
    const retrySession = vi.fn<SessionActions["retrySession"]>(async () => {
      sessionControl.set(guestSession);
      return guestSession;
    });
    const { container } = await setup({
      session: unavailableSession,
      retrySession,
    });

    const alert = query<HTMLElement>(container, '[role="alert"]');
    expect(alert.textContent).toContain(GENERIC_ERROR);
    expect(
      container.querySelector('[data-testid="checkout-pi-email-input"]'),
    ).toBeNull();
    expect(container.querySelector(PLACE_ORDER)).toBeNull();

    await interact(() => buttonByText(alert, "Try again").click());

    expect(retrySession).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(
      query(container, '[data-testid="checkout-chosen-address"]').textContent,
    ).toContain("Main Street 1");
    expect(container.querySelector(PLACE_ORDER)).not.toBeNull();
  });

  it("keeps the customer and the methods when a re-read of a known session fails", async () => {
    const { container, button } = await setup({
      session: {
        ...checkoutSession({ customer: checkoutCustomer() }),
        status: "error",
      },
    });

    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(
      query(container, '[data-testid="checkout-chosen-address"]').textContent,
    ).toContain("Main Street 1");
    expect(
      radio(container, "shipping-method", "shipping-standard").checked,
    ).toBe(true);
    expect(button().disabled).toBe(false);
  });

  it("keeps the checkout on screen while the emptied cart refreshes after the order", async () => {
    const refresh = vi.fn(async () => {
      fakeCart.set(cartResult({ lineItems: [], refresh }));
    });
    const { container, button } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      cart: cartResult({ refresh }),
    });

    await interact(() => button().click());

    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
    expect(fakeCart.get().isEmpty).toBe(true);
    expect(query(container, "h1").textContent).toBe("Checkout");
    expect(
      container.querySelector('output[aria-label="Placing order…"]'),
    ).not.toBeNull();
    expect(container.textContent).not.toContain("Your cart is empty");
  });

  it("asks for the state of a country with states and sends it", async () => {
    const { container, input, button, register } = await setup();

    await fill(input, customerData);
    await chooseCountry(container, "Germany");
    await interact(() => button().click());

    const state = query<HTMLSelectElement>(container, "#state");
    expect(state.getAttribute("aria-invalid")).toBe("true");
    expect(container.querySelector("#state-error")?.textContent).toBe(
      "The value is required",
    );
    expect(document.activeElement).toBe(state);
    expect(register).not.toHaveBeenCalled();

    await interact(() => setSelectValue(stateSelect(container), "state-by"));
    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(register.mock.calls[0]?.[0].billingAddress).toMatchObject({
      countryId: "country-de",
      countryStateId: "state-by",
    });
  });

  it("resets the state when the country changes", async () => {
    const { container, input, button, register } = await setup();

    await fill(input, customerData);
    await chooseCountry(container, "Germany");
    await interact(() => setSelectValue(stateSelect(container), "state-by"));
    expect(stateSelect(container).value).toBe("state-by");

    await chooseCountry(container, "Poland");
    expect(
      container.querySelector('[data-testid="checkout-pi-state-input"]'),
    ).toBeNull();

    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    const address = register.mock.calls[0]?.[0].billingAddress;
    expect(address?.countryId).toBe("country-pl");
    expect(address?.countryStateId).toBeUndefined();
  });

  it("shows the sign-up message and stops for a double opt-in registration", async () => {
    const register = vi.fn<SessionActions["register"]>(async () => ({
      ok: true,
      doubleOptIn: true,
    }));
    const { container, input, button, shopware, notify } = await setup({
      register,
    });

    await fillGuestForm(container, input);
    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "info",
      message:
        "Thank you for signing up! You will receive a confirmation email shortly. Click on the link in it to complete the sign-up.",
      timeout: 0,
    });
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(0);
    expect(push).not.toHaveBeenCalled();
    expect(input("checkout-pi-email-input")).toBeDefined();
    expect(button().disabled).toBe(false);
    expect(document.activeElement).toBe(button());
    expect(shopware.calls(READ_SHIPPING_METHODS)).toHaveLength(1);
  });

  it("stops before registering a guest when no shipping method is selected", async () => {
    const { container, input, button, shopware, notify, register } =
      await setup({ session: checkoutSession({ shippingMethodId: null }) });

    await fillGuestForm(container, input);
    await interact(() => button().click());

    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: GENERIC_ERROR,
      timeout: 0,
    });
    expect(register).not.toHaveBeenCalled();
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(0);
    expect(input("checkout-pi-email-input")).toBeDefined();
    expect(container.querySelector("output")).toBeNull();
  });

  it("reports a cart that could not be read and reads it again on retry", async () => {
    const { container, cart } = await setup({
      cart: cartResult({ status: "error", cart: null, lineItems: [] }),
    });

    const alert = query<HTMLElement>(container, '[role="alert"]');
    expect(alert.textContent).toContain(GENERIC_ERROR);
    expect(container.textContent).not.toContain("Your cart is empty");
    expect(container.querySelector(PLACE_ORDER)).toBeNull();

    await interact(() => buttonByText(alert, "Try again").click());

    expect(cart.refresh).toHaveBeenCalledTimes(1);
  });

  it("keeps the newest pending method when an older change settles", async () => {
    const first = deferred<unknown>();
    const second = deferred<unknown>();
    const patches = [first, second];
    const contexts = ["shipping-express", "shipping-standard"];
    const refreshSession = vi.fn<SessionActions["refreshSession"]>(async () => {
      sessionControl.set(
        checkoutSession({ shippingMethodId: contexts.shift() ?? null }),
      );
    });
    const { container } = await setup({
      refreshSession,
      answers: { [UPDATE_CONTEXT]: () => patches.shift()?.promise },
    });

    await interact(() =>
      radio(container, "shipping-method", "shipping-express").click(),
    );
    await interact(() =>
      radio(container, "shipping-method", "shipping-standard").click(),
    );

    await interact(() => first.resolve({}));
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(
      radio(container, "shipping-method", "shipping-standard").checked,
    ).toBe(true);

    await interact(() => second.resolve({}));
    expect(refreshSession).toHaveBeenCalledTimes(2);
    expect(
      radio(container, "shipping-method", "shipping-standard").checked,
    ).toBe(true);
  });
});

describe("CheckoutPageContent in other locales", () => {
  it("renders the steps in German and opens the German success page", async () => {
    const { container, shopware } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      locale: "de-DE",
    });

    expect(query(container, "h1").textContent).toBe("Kasse");
    expect(queryAll(container, "section h2").map((h) => h.textContent)).toEqual(
      ["Versandadresse", "Versand", "Zahlungsinformationen", "Zusammenfassung"],
    );
    expect(query(container, PLACE_ORDER).textContent).toBe("Bestellen");

    await interact(() =>
      query<HTMLButtonElement>(container, PLACE_ORDER).click(),
    );

    expect(shopware.calls(CREATE_ORDER)).toHaveLength(1);
    expect(push).toHaveBeenCalledWith("/de-DE/checkout/success/order-1");
  });

  it("validates the customer form in Polish", async () => {
    const { container, button } = await setup({ locale: "pl-PL" });

    await interact(() => button().click());

    expect(container.querySelector("#email-error")?.textContent).toBe(
      "Wartość jest wymagana",
    );
  });

  it("links the empty cart state to the Polish homepage", async () => {
    const { container } = await setup({
      cart: cartResult({ lineItems: [] }),
      locale: "pl-PL",
    });

    expect(query(container, "h1").textContent).toBe("Twój koszyk jest pusty");
    const link = query<HTMLAnchorElement>(container, "a");
    expect(link.textContent).toBe("Kontynuuj zakupy");
    expect(link.getAttribute("href")).toBe("/pl-PL");
  });
});
