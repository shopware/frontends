import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import { cart as cartData, cartError } from "@/features/cart/cart.fixture";
import { toCartActionErrors } from "@/features/cart/cartErrors";
import type { CartErrorEntry } from "@/features/cart/cartErrors";
import type { CartReadResult } from "@/features/cart/types";
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
  billingAddress,
  checkoutCustomer,
  checkoutSession,
  checkoutSettings,
  countries,
  fakeClient,
  order,
  paymentMethods,
  shippingAddress,
  shippingMethods,
} from "../checkout.fixture";
import type { FakeAnswer } from "../checkout.fixture";
import type { CheckoutSettings } from "../checkoutSettings";
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

const { push, requestLogin } = vi.hoisted(() => ({
  push: vi.fn(),
  requestLogin: vi.fn<() => Promise<boolean>>(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/features/account/components/LoginModal", () => ({
  useRequestLogin: () => requestLogin,
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
const CREATE_ADDRESS = "createCustomerAddress post /account/address";
const DEFAULT_SHIPPING =
  "defaultShippingAddress patch /account/address/default-shipping/{addressId}";
const LIST_ADDRESS = "listAddress post /account/list-address";
const READ_SHIPPING_METHODS = "readShippingMethodGet get /shipping-method";
const READ_PAYMENT_METHODS = "readPaymentMethodGet get /payment-method";
const TOS = '[data-testid="checkout-t&c-checkbox-tos"]';
const SIGN_IN = '[data-testid="checkout-sign-in-link"]';
const GENERIC_ERROR = "An error occurred. Please try again.";
const MESSAGE_DEFAULT =
  "Unfortunately, something went wrong. Please try again in a few moments. If the problem persists, you can return to the homepage or contact our support team for assistance.";
const ORDER_TIMEOUT_MESSAGE =
  "We did not get a confirmation in time. Your order may still have been placed, so please check your orders before trying again.";
const ADDRESS_UNCONFIRMED =
  "Your address change could not be confirmed. Please choose the address again before placing your order.";

const guestSession = checkoutSession({
  customer: checkoutCustomer({ guest: true, id: "guest-1" }),
});

let mounted: Mounted | undefined;

beforeEach(() => {
  push.mockReset();
  requestLogin.mockReset();
  requestLogin.mockResolvedValue(false);
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
  settings?: CheckoutSettings;
};

async function setup({
  session = checkoutSession(),
  cart = cartResult(),
  register = vi.fn<SessionActions["register"]>(async () => ({ ok: true })),
  refreshSession = vi.fn<SessionActions["refreshSession"]>(async () => {}),
  retrySession = vi.fn<SessionActions["retrySession"]>(
    async () => sessionControl.get() ?? session,
  ),
  answers = {},
  getClient,
  locale,
  settings = checkoutSettings(),
}: SetupOptions = {}) {
  const shopware = fakeClient(checkoutAnswer(answers));
  fakeCart.set(cart);
  const notify = vi.fn();
  const actions = { register, refreshSession, retrySession };
  const page = (
    <CmsActionsProvider actions={{ notify }}>
      <SessionHarness initial={session}>
        <SessionActionsProvider actions={actions}>
          <CheckoutPageContent countries={countries} settings={settings} />
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

async function chooseCountry(
  container: HTMLElement,
  name: string,
  testId = "country-select",
) {
  const combobox = query<HTMLInputElement>(
    container,
    `[data-testid="${testId}"]`,
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
  acceptedDataProtection: false,
};

async function fillGuestForm(
  container: HTMLElement,
  input: (testId: string) => HTMLInputElement,
) {
  await fill(input, customerData);
  await chooseCountry(container, "Poland");
}

async function acceptTerms(container: HTMLElement) {
  await interact(() => query<HTMLInputElement>(container, TOS).click());
}

function setTextAreaValue(textarea: HTMLTextAreaElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value",
  );
  descriptor?.set?.call(textarea, value);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
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
      ["Your address", "Shipping", "Payment information", "Summary"],
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
    await acceptTerms(container);
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
    await acceptTerms(container);
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
    await acceptTerms(container);
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
    await acceptTerms(container);
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

    await acceptTerms(container);
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
    expect(cart.refreshWithResult).toHaveBeenCalledTimes(1);

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
    expect(cart.refreshWithResult).toHaveBeenCalledTimes(2);
    expect(cart.refresh).not.toHaveBeenCalled();
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

    await acceptTerms(container);
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

      await acceptTerms(container);
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

    await acceptTerms(container);
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
    const { container, notify, button, shopware } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      getClient,
    });

    await acceptTerms(container);
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
    const refreshWithResult = vi.fn(async (): Promise<CartReadResult> => {
      steps.push("cart.refreshWithResult");
      return { ok: false };
    });
    const { container, input, button, shopware } = await setup({
      register,
      refreshSession,
      cart: cartResult({ refresh, refreshWithResult }),
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
    await acceptTerms(container);
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
      "cart.refreshWithResult",
      "register",
      "createOrder",
      "cart.refresh",
      "updateCustomerAddress",
      "changeProfile",
      "refreshSession",
      "cart.refreshWithResult",
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
    await acceptTerms(container);
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
    const { container, button, shopware } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      answers: { [CREATE_ORDER]: () => pending.promise },
    });

    await acceptTerms(container);
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

    await acceptTerms(container);
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
    await acceptTerms(container);
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

    await acceptTerms(container);
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
    await acceptTerms(container);
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
    await acceptTerms(container);
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

  it("reports a cart that could not be read, reads it once on its own and again on retry", async () => {
    const { container, cart } = await setup({
      cart: cartResult({ status: "error", cart: null, lineItems: [] }),
    });

    const alert = query<HTMLElement>(container, '[role="alert"]');
    expect(alert.textContent).toContain(GENERIC_ERROR);
    expect(container.textContent).not.toContain("Your cart is empty");
    expect(container.querySelector(PLACE_ORDER)).toBeNull();
    expect(cart.refreshWithResult).toHaveBeenCalledTimes(1);
    expect(cart.refresh).not.toHaveBeenCalled();

    await interact(() => buttonByText(alert, "Try again").click());

    expect(cart.refresh).toHaveBeenCalledTimes(1);
    expect(cart.refreshWithResult).toHaveBeenCalledTimes(1);
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

const TOS_REQUIRED =
  "Please accept the general terms and conditions to place your order.";

const shippingData = {
  "checkout-shipping-first-name-input": "John",
  "checkout-shipping-last-name-input": "Smith",
  "checkout-shipping-street-address-input": "Harbour Road 7",
  "checkout-shipping-zip-code-input": "20095",
  "checkout-shipping-city-input": "Hamburg",
};

const loggedIn = checkoutSession({ customer: checkoutCustomer() });

function byTestId<T extends Element>(container: HTMLElement, testId: string) {
  return query<T>(container, `[data-testid="${testId}"]`);
}

async function fillShippingAddress(
  container: HTMLElement,
  input: (testId: string) => HTMLInputElement,
) {
  await fill(input, shippingData);
  await chooseCountry(container, "Poland", "checkout-shipping-country-select");
}

const shippingBlocked = cartError(
  "shipping-method-blocked",
  "-Express",
  "shipping-method-blocked-Express",
  10,
);
const paymentBlocked = cartError(
  "payment-method-blocked",
  "-Cash",
  "payment-method-blocked-Cash",
  10,
);
const SHIPPING_BLOCKED_NOTICE = {
  type: "warning",
  message:
    "The shipping method Express is blocked for your current shopping cart.",
};

function cartWith(...errors: CartErrorEntry[]): Schemas["Cart"] {
  return cartData({
    lineItems: [cartLineItem()],
    errors: Object.fromEntries(errors.map((error) => [error.key, error])),
  });
}

function cartReads(...reads: Schemas["Cart"][]): FakeCartResult {
  const refreshWithResult = vi.fn(async (): Promise<CartReadResult> => {
    const read = reads.length > 1 ? reads.shift() : reads[0];
    if (!read) return { ok: false };
    const previous = fakeCart.get().cart;
    fakeCart.set({ ...fakeCart.get(), cart: read });
    return {
      ok: true,
      cart: read,
      errors: toCartActionErrors(read),
      newErrors: toCartActionErrors(read, previous),
    };
  });
  return cartResult({ cart: reads[0] ?? null, refreshWithResult });
}

describe("CheckoutPageContent sign-in", () => {
  it("offers a visitor to sign in and shows the customer's addresses after a login", async () => {
    requestLogin.mockImplementation(async () => {
      sessionControl.set(loggedIn);
      return true;
    });
    const { container, shopware } = await setup();

    expect(byTestId(container, "checkout-sign-in-prompt").textContent).toBe(
      "Already have an account? Sign in",
    );
    const signIn = query<HTMLButtonElement>(container, SIGN_IN);
    expect(signIn.getAttribute("aria-haspopup")).toBe("dialog");

    await interact(() => signIn.click());

    expect(requestLogin).toHaveBeenCalledTimes(1);
    expect(container.querySelector(SIGN_IN)).toBeNull();
    expect(
      container.querySelector('[data-testid="checkout-pi-email-input"]'),
    ).toBeNull();
    expect(
      byTestId(container, "checkout-chosen-address").textContent,
    ).toContain("Main Street 1");
    const heading = query(container, "#checkout-step-1-heading");
    expect(document.activeElement).toBe(heading);
    expect(heading.getAttribute("tabindex")).toBe("-1");
    expect(shopware.calls(READ_SHIPPING_METHODS)).toHaveLength(2);
    expect(shopware.calls(READ_PAYMENT_METHODS)).toHaveLength(2);
  });

  it("changes nothing when the login is cancelled", async () => {
    const { container, shopware } = await setup();

    await interact(() => query<HTMLButtonElement>(container, SIGN_IN).click());

    expect(requestLogin).toHaveBeenCalledTimes(1);
    expect(container.querySelector(SIGN_IN)).not.toBeNull();
    expect(
      container.querySelector('[data-testid="checkout-pi-email-input"]'),
    ).not.toBeNull();
    expect(shopware.calls(READ_SHIPPING_METHODS)).toHaveLength(1);
  });

  it("offers sign-in to a returning guest session but not to a customer", async () => {
    const guest = await setup({ session: guestSession });
    expect(guest.container.querySelector(SIGN_IN)).not.toBeNull();
    expect(
      byTestId(guest.container, "checkout-chosen-address").textContent,
    ).toContain("Main Street 1");
    await mounted?.unmount();

    const customer = await setup({ session: loggedIn });
    expect(customer.container.querySelector(SIGN_IN)).toBeNull();
  });

  it("hides sign-in once the visitor registered on this page", async () => {
    const register = vi.fn<SessionActions["register"]>(async () => {
      sessionControl.set(guestSession);
      return { ok: true };
    });
    const { container, input, button } = await setup({
      register,
      answers: {
        [CREATE_ORDER]: () => {
          throw apiError([{ code: "CHECKOUT__UNKNOWN_PAYMENT_METHOD" }]);
        },
      },
    });

    await fillGuestForm(container, input);
    await acceptTerms(container);
    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(input("checkout-pi-email-input")).toBeDefined();
    expect(container.querySelector(SIGN_IN)).toBeNull();
  });
});

describe("CheckoutPageContent terms", () => {
  it("registers no one and places no order until the terms are accepted", async () => {
    const { container, input, button, register, shopware } = await setup();

    await fillGuestForm(container, input);
    await interact(() => button().click());

    const tos = query<HTMLInputElement>(container, TOS);
    expect(register).not.toHaveBeenCalled();
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(0);
    expect(tos.getAttribute("aria-invalid")).toBe("true");
    expect(container.querySelector("#tos-error")?.textContent).toBe(
      TOS_REQUIRED,
    );
    expect(document.activeElement).toBe(tos);
    expect(
      container.querySelector('[data-testid="checkout-t&c-revocation"]'),
    ).toBeNull();

    await acceptTerms(container);
    expect(container.querySelector("#tos-error")).toBeNull();
    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
  });

  it("asks a logged-in customer for the terms too", async () => {
    const { container, button, shopware } = await setup({ session: loggedIn });

    await interact(() => button().click());

    expect(shopware.calls(CREATE_ORDER)).toHaveLength(0);
    expect(document.activeElement).toBe(query(container, TOS));

    await acceptTerms(container);
    await interact(() => button().click());

    expect(shopware.calls(CREATE_ORDER)).toHaveLength(1);
  });

  it("asks for the revocation waiver when the cart holds a digital product and sends neither box", async () => {
    const { container, button, shopware } = await setup({
      session: loggedIn,
      cart: cartResult({
        lineItems: [cartLineItem({ states: ["is-download"] })],
      }),
    });

    await acceptTerms(container);
    await interact(() => button().click());

    const revocation = byTestId<HTMLInputElement>(
      container,
      "checkout-t&c-checkbox-revocation",
    );
    expect(shopware.calls(CREATE_ORDER)).toHaveLength(0);
    expect(document.activeElement).toBe(revocation);

    await interact(() => revocation.click());
    await interact(() => button().click());

    expect(shopware.calls(CREATE_ORDER)[0]?.params).toEqual({
      body: {},
      fetchOptions: { timeout: ORDER_TIMEOUT_MS },
    });
  });

  it("asks a new customer for the data protection consent when the shop requires it and sends it", async () => {
    const { container, input, button, register } = await setup({
      settings: checkoutSettings({ requireDataProtectionCheckbox: true }),
    });

    await fillGuestForm(container, input);
    await acceptTerms(container);
    await interact(() => button().click());

    const consent = byTestId<HTMLInputElement>(
      container,
      "checkout-t&c-checkbox-data-protection",
    );
    expect(register).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(consent);
    expect(container.querySelector("#data-protection-error")?.textContent).toBe(
      "Please confirm that you have read the data protection information.",
    );

    await interact(() => consent.click());
    await interact(() => button().click());

    expect(register.mock.calls[0]?.[0]).toEqual({
      ...expectedRegistration,
      acceptedDataProtection: true,
    });
  });

  it("asks a logged-in customer for no data protection consent", async () => {
    const { container, button, shopware } = await setup({
      session: loggedIn,
      settings: checkoutSettings({ requireDataProtectionCheckbox: true }),
    });

    expect(
      container.querySelector(
        '[data-testid="checkout-t&c-checkbox-data-protection"]',
      ),
    ).toBeNull();
    await acceptTerms(container);
    await interact(() => button().click());

    expect(shopware.calls(CREATE_ORDER)).toHaveLength(1);
  });

  it("requires the password minimum of the shop for a new account", async () => {
    const { container, input, button, register } = await setup({
      settings: checkoutSettings({ passwordMinLength: 12 }),
    });

    await interact(() =>
      byTestId<HTMLButtonElement>(
        container,
        "checkout-create-account-toggle",
      ).click(),
    );
    await interact(() =>
      setInputValue(input("checkout-pi-password-input"), "password123"),
    );
    await fillGuestForm(container, input);
    await acceptTerms(container);
    await interact(() => button().click());

    expect(register).not.toHaveBeenCalled();
    expect(container.querySelector("#password-error")?.textContent).toBe(
      "This minimum length should be at least 12",
    );

    await interact(() =>
      setInputValue(input("checkout-pi-password-input"), "password1234"),
    );
    await interact(() => button().click());

    expect(register.mock.calls[0]?.[0]).toMatchObject({
      password: "password1234",
      guest: false,
    });
  });
});

describe("CheckoutPageContent customer comment", () => {
  it("sends the comment trimmed when the shop shows the field, again after a failed attempt", async () => {
    let attempts = 0;
    const { container, button, shopware } = await setup({
      session: loggedIn,
      settings: checkoutSettings({ showCustomerComment: true }),
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

    const comment = byTestId<HTMLTextAreaElement>(
      container,
      "checkout-customer-comment-input",
    );
    expect(comment.getAttribute("aria-describedby")).toBe(
      "customer-comment-hint",
    );
    expect(query(container, 'label[for="customer-comment"]').textContent).toBe(
      "Comment on your order",
    );
    await interact(() =>
      setTextAreaValue(comment, "  Ring twice\nBack door  "),
    );
    await acceptTerms(container);
    await interact(() => button().click());
    await interact(() => button().click());

    const bodies = shopware
      .calls(CREATE_ORDER)
      .map(({ params }) => (params as { body: unknown }).body);
    expect(bodies).toEqual([
      { customerComment: "Ring twice\nBack door" },
      { customerComment: "Ring twice\nBack door" },
    ]);
  });

  it("shows no comment field when the shop does not ask for one", async () => {
    const { container } = await setup({ session: loggedIn });

    expect(
      container.querySelector(
        '[data-testid="checkout-customer-comment-input"]',
      ),
    ).toBeNull();
  });
});

describe("CheckoutPageContent separate shipping address", () => {
  it("validates the second address and registers a guest with it", async () => {
    const { container, input, button, register } = await setup();

    await fillGuestForm(container, input);
    const toggle = byTestId<HTMLInputElement>(
      container,
      "checkout-custom-shipping-address-checkbox",
    );
    expect(toggle.hasAttribute("aria-controls")).toBe(false);
    expect(
      container.querySelector("#checkout-shipping-address-fields"),
    ).toBeNull();

    await interact(() => toggle.click());

    expect(toggle.getAttribute("aria-controls")).toBe(
      "checkout-shipping-address-fields",
    );
    expect(
      query(container, "#checkout-shipping-address-fields legend").textContent,
    ).toBe("Shipping address");
    await acceptTerms(container);
    await interact(() => button().click());

    expect(register).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(
      input("checkout-shipping-first-name-input"),
    );
    expect(
      container.querySelector("#shipping-country-error")?.textContent,
    ).toBe("Value is required");

    await fill(input, shippingData);
    await chooseCountry(
      container,
      "Germany",
      "checkout-shipping-country-select",
    );
    await interact(() =>
      setSelectValue(
        byTestId<HTMLSelectElement>(container, "checkout-shipping-state-input"),
        "state-by",
      ),
    );
    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(register.mock.calls[0]?.[0]).toEqual({
      ...expectedRegistration,
      shippingAddress: {
        customerId: "",
        id: "",
        firstName: "John",
        lastName: "Smith",
        street: "Harbour Road 7",
        zipcode: "20095",
        city: "Hamburg",
        countryId: "country-de",
        countryStateId: "state-by",
      },
    });
  });

  it("sends no shipping address once the box is unticked again", async () => {
    const { container, input, button, register } = await setup();

    await fillGuestForm(container, input);
    const toggle = byTestId<HTMLInputElement>(
      container,
      "checkout-custom-shipping-address-checkbox",
    );
    await interact(() => toggle.click());
    await interact(() => toggle.click());
    await acceptTerms(container);
    await interact(() => button().click());

    expect(register.mock.calls[0]?.[0]).toEqual(expectedRegistration);
  });

  it("saves the separate shipping address on the next attempt after a failed order", async () => {
    let attempts = 0;
    const register = vi.fn<SessionActions["register"]>(async () => {
      sessionControl.set(guestSession);
      return { ok: true };
    });
    const { container, input, button, shopware } = await setup({
      register,
      answers: {
        [CREATE_ADDRESS]: () => shippingAddress({ id: "address-new" }),
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
    await interact(() =>
      byTestId<HTMLInputElement>(
        container,
        "checkout-custom-shipping-address-checkbox",
      ).click(),
    );
    await fillShippingAddress(container, input);
    await acceptTerms(container);
    await interact(() => button().click());
    expect(register.mock.calls[0]?.[0].shippingAddress).toMatchObject({
      street: "Harbour Road 7",
      countryId: "country-pl",
    });

    await interact(() => button().click());

    expect(register).toHaveBeenCalledTimes(1);
    expect(
      shopware
        .operations()
        .filter((operation) =>
          [
            UPDATE_ADDRESS,
            CREATE_ADDRESS,
            DEFAULT_SHIPPING,
            CHANGE_PROFILE,
          ].includes(operation),
        ),
    ).toEqual([
      UPDATE_ADDRESS,
      CREATE_ADDRESS,
      DEFAULT_SHIPPING,
      CHANGE_PROFILE,
    ]);
    expect(shopware.calls(CREATE_ADDRESS)[0]?.params).toEqual({
      body: {
        firstName: "John",
        lastName: "Smith",
        street: "Harbour Road 7",
        zipcode: "20095",
        city: "Hamburg",
        countryId: "country-pl",
        countryStateId: undefined,
      },
    });
    expect(shopware.calls(DEFAULT_SHIPPING)[0]?.params).toEqual({
      pathParams: { addressId: "address-new" },
    });
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
  });

  it("updates the shipping address it created instead of creating another when the save is retried", async () => {
    let orders = 0;
    let profileChanges = 0;
    const register = vi.fn<SessionActions["register"]>(async () => {
      sessionControl.set(guestSession);
      return { ok: true };
    });
    const { container, input, button, shopware, notify } = await setup({
      register,
      answers: {
        [CREATE_ADDRESS]: () => shippingAddress({ id: "address-new" }),
        [CHANGE_PROFILE]: () => {
          profileChanges += 1;
          if (profileChanges === 1) throw apiError([], 503);
          return {};
        },
        [CREATE_ORDER]: () => {
          orders += 1;
          if (orders === 1) {
            throw apiError([{ code: "CHECKOUT__UNKNOWN_PAYMENT_METHOD" }]);
          }
          return order();
        },
      },
    });

    await fillGuestForm(container, input);
    await interact(() =>
      byTestId<HTMLInputElement>(
        container,
        "checkout-custom-shipping-address-checkbox",
      ).click(),
    );
    await fillShippingAddress(container, input);
    await acceptTerms(container);
    await interact(() => button().click());
    await interact(() => button().click());

    expect(notify).toHaveBeenLastCalledWith({
      type: "error",
      message: MESSAGE_DEFAULT,
      timeout: 0,
    });
    expect(push).not.toHaveBeenCalled();

    await fill(input, { "checkout-shipping-street-address-input": "Pier 4" });
    await interact(() => button().click());

    expect(shopware.calls(CREATE_ADDRESS)).toHaveLength(1);
    expect(
      shopware
        .operations()
        .filter((operation) =>
          [
            UPDATE_ADDRESS,
            CREATE_ADDRESS,
            DEFAULT_SHIPPING,
            CHANGE_PROFILE,
          ].includes(operation),
        ),
    ).toEqual([
      UPDATE_ADDRESS,
      CREATE_ADDRESS,
      DEFAULT_SHIPPING,
      CHANGE_PROFILE,
      UPDATE_ADDRESS,
      UPDATE_ADDRESS,
      DEFAULT_SHIPPING,
      CHANGE_PROFILE,
    ]);
    expect(shopware.calls(UPDATE_ADDRESS)[2]?.params).toMatchObject({
      pathParams: { addressId: "address-new" },
      body: { street: "Pier 4", city: "Hamburg" },
    });
    expect(shopware.calls(DEFAULT_SHIPPING)[1]?.params).toEqual({
      pathParams: { addressId: "address-new" },
    });
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
  });
});

describe("CheckoutPageContent address choice", () => {
  const addressAnswers = {
    [LIST_ADDRESS]: () => ({ elements: [billingAddress(), shippingAddress()] }),
  };

  async function chooseShippingAddress(container: HTMLElement, id: string) {
    await interact(() =>
      byTestId<HTMLButtonElement>(
        container,
        "checkout-change-shipping-address-button",
      ).click(),
    );
    await interact(() =>
      byTestId<HTMLInputElement>(
        container,
        `checkout-shipping-address-${id}`,
      ).click(),
    );
    await interact(() =>
      byTestId<HTMLButtonElement>(
        container,
        "checkout-use-shipping-address-button",
      ).click(),
    );
  }

  const switchedSession = checkoutSession({
    customer: checkoutCustomer({ activeShippingAddress: shippingAddress() }),
  });

  it("switches the shipping address of the context, then refreshes and re-reads the methods", async () => {
    const patch = deferred<unknown>();
    const refreshSession = vi.fn<SessionActions["refreshSession"]>(async () => {
      sessionControl.set(
        checkoutSession({
          customer: checkoutCustomer({
            activeShippingAddress: shippingAddress(),
          }),
        }),
      );
    });
    const { container, shopware, cart, button } = await setup({
      session: loggedIn,
      refreshSession,
      answers: { ...addressAnswers, [UPDATE_CONTEXT]: () => patch.promise },
    });

    await chooseShippingAddress(container, "address-2");

    expect(shopware.calls(UPDATE_CONTEXT)).toEqual([
      {
        operation: UPDATE_CONTEXT,
        params: { body: { shippingAddressId: "address-2" } },
      },
    ]);
    expect(button().disabled).toBe(true);

    await interact(() => patch.resolve({}));

    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(cart.refreshWithResult).toHaveBeenCalledTimes(2);
    expect(cart.refresh).not.toHaveBeenCalled();
    expect(shopware.calls(READ_SHIPPING_METHODS)).toHaveLength(2);
    expect(shopware.calls(READ_PAYMENT_METHODS)).toHaveLength(2);
    expect(button().disabled).toBe(false);
    expect(
      byTestId(container, "checkout-active-shipping-address").textContent,
    ).toContain("Harbour Road 7");
    expect(document.activeElement).toBe(
      byTestId(container, "checkout-change-shipping-address-button"),
    );
  });

  it("keeps the address and shows the error when the switch is rejected", async () => {
    const { container, shopware, notify, refreshSession, button } = await setup(
      {
        session: loggedIn,
        answers: {
          ...addressAnswers,
          [UPDATE_CONTEXT]: () => {
            throw apiError([
              {
                code: "CHECKOUT__CUSTOMER_ADDRESS_NOT_FOUND",
                detail: "The address could not be found.",
              },
            ]);
          },
        },
      },
    );

    await chooseShippingAddress(container, "address-2");

    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "The address could not be found.",
    });
    expect(refreshSession).not.toHaveBeenCalled();
    expect(shopware.calls(READ_SHIPPING_METHODS)).toHaveLength(1);
    expect(
      query(
        byTestId(container, "checkout-active-shipping-address"),
        '[data-testid="checkout-chosen-address"]',
      ).textContent,
    ).toContain("Main Street 1");
    expect(
      byTestId<HTMLInputElement>(
        container,
        "checkout-shipping-address-address-2",
      ).checked,
    ).toBe(true);
    expect(
      query<HTMLElement>(container, "#checkout-shipping-address-options")
        .hidden,
    ).toBe(false);
    expect(button().disabled).toBe(false);
  });

  it("warns about a shipping method that the new shipping address blocks", async () => {
    const { container, notify } = await setup({
      session: loggedIn,
      refreshSession: vi.fn(async () => sessionControl.set(switchedSession)),
      cart: cartReads(cartWith(), cartWith(shippingBlocked)),
      answers: addressAnswers,
    });
    expect(notify).not.toHaveBeenCalled();

    await chooseShippingAddress(container, "address-2");

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(SHIPPING_BLOCKED_NOTICE);
  });

  it("reports an address change that the session re-read cannot confirm and keeps place order disabled until a read succeeds", async () => {
    const unread = { ...loggedIn, status: "error" as const };
    const refreshSession = vi.fn<SessionActions["refreshSession"]>(async () => {
      sessionControl.set(unread);
    });
    const retrySession = vi.fn<SessionActions["retrySession"]>(
      async () => unread,
    );
    const { container, notify, button } = await setup({
      session: loggedIn,
      refreshSession,
      retrySession,
      answers: addressAnswers,
    });

    await chooseShippingAddress(container, "address-2");

    expect(retrySession).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: ADDRESS_UNCONFIRMED,
      timeout: 0,
    });
    expect(
      query<HTMLElement>(container, "#checkout-shipping-address-options")
        .hidden,
    ).toBe(false);
    expect(
      byTestId(container, "checkout-active-shipping-address").textContent,
    ).toContain("Main Street 1");
    expect(button().disabled).toBe(true);

    await acceptTerms(container);
    await interact(() => button().click());
    expect(push).not.toHaveBeenCalled();

    await interact(() => sessionControl.set(switchedSession));

    expect(button().disabled).toBe(false);
    expect(
      byTestId(container, "checkout-active-shipping-address").textContent,
    ).toContain("Harbour Road 7");
  });

  it("confirms an address change with the session that the retry reads", async () => {
    const refreshSession = vi.fn<SessionActions["refreshSession"]>(async () => {
      sessionControl.set({ ...loggedIn, status: "error" });
    });
    const retrySession = vi.fn<SessionActions["retrySession"]>(async () => {
      sessionControl.set(switchedSession);
      return switchedSession;
    });
    const { container, notify, button } = await setup({
      session: loggedIn,
      refreshSession,
      retrySession,
      answers: addressAnswers,
    });

    await chooseShippingAddress(container, "address-2");

    expect(notify).not.toHaveBeenCalled();
    expect(
      query<HTMLElement>(container, "#checkout-shipping-address-options")
        .hidden,
    ).toBe(true);
    expect(button().disabled).toBe(false);
  });

  it("reports an address change that the session read shows another address for, without blocking the order", async () => {
    const { container, notify, button } = await setup({
      session: loggedIn,
      answers: addressAnswers,
    });

    await chooseShippingAddress(container, "address-2");

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: ADDRESS_UNCONFIRMED,
      timeout: 0,
    });
    expect(
      query<HTMLElement>(container, "#checkout-shipping-address-options")
        .hidden,
    ).toBe(false);
    expect(button().disabled).toBe(false);
  });

  it("reads the addresses again for a customer who signs in over a guest session", async () => {
    requestLogin.mockImplementation(async () => {
      sessionControl.set(loggedIn);
      return true;
    });
    const { container, shopware } = await setup({
      session: guestSession,
      answers: addressAnswers,
    });
    const toggle = () =>
      byTestId<HTMLButtonElement>(
        container,
        "checkout-change-shipping-address-button",
      );

    await interact(() => toggle().click());
    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(1);
    expect(
      container.querySelector(
        '[data-testid="checkout-add-shipping-address-link"]',
      ),
    ).toBeNull();

    await interact(() => query<HTMLButtonElement>(container, SIGN_IN).click());

    expect(toggle().getAttribute("aria-expanded")).toBe("false");
    await interact(() => toggle().click());

    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);
    expect(
      byTestId<HTMLAnchorElement>(
        container,
        "checkout-add-shipping-address-link",
      ).getAttribute("href"),
    ).toBe("/account/address/new?redirect=%2Fcheckout");
  });
});

describe("CheckoutPageContent cart notices", () => {
  function chooseExpress(container: HTMLElement) {
    return interact(() =>
      radio(container, "shipping-method", "shipping-express").click(),
    );
  }

  it("reads a ready cart once on open and shows the errors of that read", async () => {
    const { notify, cart } = await setup({
      cart: cartReads(cartWith(shippingBlocked)),
    });

    expect(cart.refreshWithResult).toHaveBeenCalledTimes(1);
    expect(cart.refresh).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(SHIPPING_BLOCKED_NOTICE);
  });

  it("warns about a shipping method that the re-read after the switch reports as blocked", async () => {
    const { container, notify } = await setup({
      cart: cartReads(cartWith(), cartWith(shippingBlocked)),
    });
    expect(notify).not.toHaveBeenCalled();

    await chooseExpress(container);

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(SHIPPING_BLOCKED_NOTICE);
  });

  it("does not repeat a state error the cart already had before the switch", async () => {
    const { container, notify } = await setup({
      cart: cartReads(
        cartWith(paymentBlocked),
        cartWith(paymentBlocked, shippingBlocked),
      ),
    });
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify.mock.calls[0]?.[0]).toMatchObject({
      type: "warning",
      message: expect.stringContaining("The payment method"),
    });
    notify.mockClear();

    await chooseExpress(container);

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(SHIPPING_BLOCKED_NOTICE);
  });

  it("does not repeat a state error that a cart change during the switch already reported", async () => {
    const patch = deferred<unknown>();
    const { container, notify } = await setup({
      cart: cartReads(cartWith(), cartWith(shippingBlocked)),
      answers: { [UPDATE_CONTEXT]: () => patch.promise },
    });

    await chooseExpress(container);
    await interact(() =>
      fakeCart.set({ ...fakeCart.get(), cart: cartWith(shippingBlocked) }),
    );
    await interact(() => patch.resolve({}));

    expect(notify).not.toHaveBeenCalled();
  });

  it("warns about a shipping method that the saved customer details block", async () => {
    let orders = 0;
    const register = vi.fn<SessionActions["register"]>(async () => {
      sessionControl.set(guestSession);
      return { ok: true };
    });
    const { container, input, button, notify } = await setup({
      register,
      cart: cartReads(cartWith(), cartWith(shippingBlocked)),
      answers: {
        [CREATE_ORDER]: () => {
          orders += 1;
          if (orders === 1) {
            throw apiError([{ code: "CHECKOUT__UNKNOWN_PAYMENT_METHOD" }]);
          }
          return order();
        },
      },
    });

    await fillGuestForm(container, input);
    await acceptTerms(container);
    await interact(() => button().click());
    notify.mockClear();
    await interact(() => button().click());

    expect(notify).toHaveBeenCalledExactlyOnceWith(SHIPPING_BLOCKED_NOTICE);
    expect(push).toHaveBeenCalledWith("/checkout/success/order-1");
  });

  it.each([
    [
      "answers without a cart",
      async (): Promise<CartReadResult> => ({ ok: false }),
    ],
    [
      "rejects",
      async (): Promise<CartReadResult> => {
        throw new Error("offline");
      },
    ],
  ])(
    "shows no cart notice when the re-read after the switch %s",
    async (_, failedRead) => {
      const cart = cartReads(cartWith());
      const { container, notify, refreshSession } = await setup({ cart });
      vi.mocked(cart.refreshWithResult).mockImplementation(failedRead);

      await chooseExpress(container);

      expect(refreshSession).toHaveBeenCalledTimes(1);
      expect(cart.refreshWithResult).toHaveBeenCalledTimes(2);
      expect(notify).not.toHaveBeenCalled();
    },
  );
});

describe("CheckoutPageContent in other locales", () => {
  it("renders the steps in German and opens the German success page", async () => {
    const { container, shopware } = await setup({
      session: checkoutSession({ customer: checkoutCustomer() }),
      locale: "de-DE",
    });

    expect(query(container, "h1").textContent).toBe("Kasse");
    expect(queryAll(container, "section h2").map((h) => h.textContent)).toEqual(
      ["Ihre Adresse", "Versand", "Zahlungsinformationen", "Zusammenfassung"],
    );
    expect(query(container, PLACE_ORDER).textContent).toBe("Bestellen");

    await acceptTerms(container);
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
