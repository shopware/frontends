import { encodeForQuery } from "@shopware/api-client/helpers";
import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import type {
  CmsActionResult,
  CmsCustomerState,
  CmsNotification,
} from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import { cart, cartError, lineItem } from "@/features/cart/cart.fixture";
import { useCart } from "@/features/cart/useCart";
import { productReviewsCriteria } from "@/features/reviews/productReviewsApi";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import {
  apiClientError,
  customer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import type { SessionActionResult } from "@/features/session/types";
import type { Locale } from "@/i18n/config";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";
import { testTranslator, withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  query,
  queryAll,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { StorefrontProviders, TOAST_TIMEOUT_MS } from "./StorefrontProviders";

const browser = vi.hoisted(() => ({
  invoke: vi.fn<(operation: string, params?: unknown) => Promise<unknown>>(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
}));

vi.mock("@/features/session/browserClient", () => ({
  CONTEXT_TOKEN_COOKIE: "sw-context-token",
  loadPublicConfig: async (): Promise<PublicShopwareConfig> => ({
    endpoint: "https://shop.test/store-api/",
    accessToken: "SWSCTEST",
    devStorefrontUrl: null,
  }),
  createBrowserClient: () =>
    ({ invoke: browser.invoke }) as unknown as ApiClient,
}));

const READ_CONTEXT = "readContext get /context";
const READ_CART = "readCart get /checkout/cart";
const READ_LANGUAGES = "readLanguagesGet get /language";
const ADD_LINE_ITEM = "addLineItem post /checkout/cart/line-item";
const LOGIN = "loginCustomer post /account/login";
const READ_WISHLIST = "readCustomerWishlist post /customer/wishlist";
const ADD_WISHLIST =
  "addProductOnWishlist post /customer/wishlist/add/{productId}";
const DELETE_WISHLIST =
  "deleteProductOnWishlist delete /customer/wishlist/delete/{productId}";
const LOGOUT = "logoutCustomer post /account/logout";
const READ_REVIEWS = "readProductReviewsGet get /product/{productId}/reviews";
const SAVE_REVIEW = "saveProductReview post /product/{productId}/review";
const MESSAGE = '[data-testid="notification-element-message"]';

const backend: {
  cart: Schemas["Cart"];
  afterAdd: Schemas["Cart"];
  signedIn: boolean;
  acceptLogin: boolean;
  wishlist: string[];
  reviews: Schemas["ProductReview"][];
} = {
  cart: cart(),
  afterAdd: cart(),
  signedIn: false,
  acceptLogin: false,
  wishlist: [],
  reviews: [],
};

function wishlistProductId(params: unknown): string {
  return (params as { pathParams: { productId: string } }).pathParams.productId;
}

let mounted: Mounted | undefined;

beforeEach(() => {
  backend.cart = cart();
  backend.afterAdd = cart({ lineItems: [lineItem({ quantity: 2 })] });
  backend.signedIn = false;
  backend.acceptLogin = false;
  backend.wishlist = [];
  backend.reviews = [];
  browser.invoke.mockReset();
  browser.invoke.mockImplementation(async (operation, params) => {
    switch (operation) {
      case READ_CONTEXT:
        return {
          data: salesChannelContext(backend.signedIn ? customer() : null),
          status: 200,
        };
      case READ_LANGUAGES:
        return {
          data: {
            elements: [
              { id: "language-en", translationCode: { code: "en-GB" } },
            ],
          },
          status: 200,
        };
      case READ_CART:
        return { data: backend.cart, status: 200 };
      case ADD_LINE_ITEM:
        backend.cart = backend.afterAdd;
        return { data: backend.cart, status: 200 };
      case READ_WISHLIST:
        return {
          data: {
            products: {
              elements: backend.wishlist.map((id) => ({ id })),
              total: backend.wishlist.length,
            },
          },
          status: 200,
        };
      case ADD_WISHLIST:
        backend.wishlist = [wishlistProductId(params), ...backend.wishlist];
        return { data: { success: true }, status: 200 };
      case DELETE_WISHLIST:
        backend.wishlist = backend.wishlist.filter(
          (id) => id !== wishlistProductId(params),
        );
        return { data: { success: true }, status: 200 };
      case LOGOUT:
        backend.signedIn = false;
        return { data: { contextToken: "guest-token" }, status: 200 };
      case READ_REVIEWS:
        return {
          data: {
            elements: backend.reviews,
            total: backend.reviews.length,
            page: 1,
            limit: 10,
          },
          status: 200,
        };
      case SAVE_REVIEW:
        return { data: undefined, status: 204 };
      case LOGIN:
        if (backend.acceptLogin) {
          backend.signedIn = true;
          return { data: { contextToken: "customer-token" }, status: 200 };
        }
        throw apiClientError(
          [{ code: "0", detail: "No matching customer for the email found." }],
          401,
        );
      default:
        throw apiClientError(
          [{ code: "0", detail: "No matching customer for the email found." }],
          401,
        );
    }
  });
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function toastOf(message: Element): HTMLElement {
  const toast = message.parentElement?.parentElement;
  if (!toast) throw new Error("The message has no toast container");
  return toast;
}

function SessionConsumer({
  onResult,
}: {
  onResult: (result: SessionActionResult) => void;
}) {
  const session = useSession();
  const { login } = useSessionActions();
  return (
    <>
      <output data-testid="session-status">{session.status}</output>
      <output data-testid="session-logged-in">
        {String(session.isLoggedIn)}
      </output>
      <button
        type="button"
        data-testid="call-login"
        onClick={() => {
          void login({
            username: "jane@example.com",
            password: "wrong",
          }).then(onResult);
        }}
      >
        login
      </button>
    </>
  );
}

describe("StorefrontProviders session", () => {
  it("reads the Shopware session in the browser", async () => {
    mounted = await mount(
      <StorefrontProviders>
        <SessionConsumer onResult={() => {}} />
      </StorefrontProviders>,
    );
    const { container } = mounted;

    await vi.waitFor(() =>
      expect(
        query(container, '[data-testid="session-status"]').textContent,
      ).toBe("ready"),
    );
    expect(
      query(container, '[data-testid="session-logged-in"]').textContent,
    ).toBe("false");
    expect(browser.invoke).toHaveBeenCalledWith(READ_CONTEXT, {
      fetchOptions: { timeout: READ_TIMEOUT_MS },
    });
    expect(queryAll(container, MESSAGE)).toHaveLength(0);
  });

  it("shows a failed login as one error toast", async () => {
    const results: SessionActionResult[] = [];
    mounted = await mount(
      <StorefrontProviders>
        <SessionConsumer onResult={(result) => results.push(result)} />
      </StorefrontProviders>,
    );
    const { container } = mounted;

    await interact(() =>
      query<HTMLButtonElement>(container, '[data-testid="call-login"]').click(),
    );
    await vi.waitFor(() => expect(results).toHaveLength(1));

    const message = testTranslator()(
      "errors.login_no_matching_customer_internal",
    );
    expect(results[0]).toEqual({ ok: false, message });
    const toasts = queryAll<HTMLParagraphElement>(container, MESSAGE);
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.textContent).toBe(message);
    const toast = toastOf(toasts[0] as HTMLParagraphElement);
    expect(toast.dataset.testid).toBe("notification-element-danger");
    expect(toast.className).toContain("bg-states-error-container");
  });
});

function CartCount() {
  const { status, count } = useCart();
  return <output data-testid="cart-count">{`${status}:${count}`}</output>;
}

function AddToCartIsland({
  onResult,
}: {
  onResult: (result: CmsActionResult) => void;
}) {
  const actions = useCmsActions();
  return (
    <button
      type="button"
      data-testid="add-to-cart-button"
      onClick={() => {
        void actions
          .addToCart({ productId: "product-1", quantity: 2 })
          .then((result) => {
            const errors = result.errors ?? [];
            for (const { messageKey } of errors) {
              actions.notify({ type: "error", message: messageKey });
            }
            if (errors.length === 0 && result.ok) {
              actions.notify({
                type: "success",
                message: "Aerodynamic Bag has been added to cart.",
                action: { label: "View cart", href: "/checkout/cart" },
              });
            } else if (errors.length === 0 && result.message) {
              actions.notify({ type: "error", message: result.message });
            }
            onResult(result);
          });
      }}
    >
      add to cart
    </button>
  );
}

async function mountShop() {
  const results: CmsActionResult[] = [];
  mounted = await mount(
    <StorefrontProviders>
      <CartCount />
      <AddToCartIsland onResult={(result) => results.push(result)} />
    </StorefrontProviders>,
  );
  const { container } = mounted;
  const cartStatus = () =>
    query(container, '[data-testid="cart-count"]').textContent;
  const addToCart = async () => {
    const before = results.length;
    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="add-to-cart-button"]',
      ).click(),
    );
    await vi.waitFor(() => expect(results).toHaveLength(before + 1));
    return results[before] as CmsActionResult;
  };
  return { container, cartStatus, addToCart };
}

describe("StorefrontProviders cart", () => {
  it("reads the cart after the session and adds to it through the CMS port", async () => {
    const { cartStatus, addToCart } = await mountShop();
    await vi.waitFor(() => expect(cartStatus()).toBe("ready:0"));

    await expect(addToCart()).resolves.toEqual({ ok: true, errors: [] });

    expect(browser.invoke.mock.calls.map(([operation]) => operation)).toEqual([
      READ_CONTEXT,
      READ_LANGUAGES,
      READ_CART,
      ADD_LINE_ITEM,
    ]);
    expect(browser.invoke).toHaveBeenCalledWith(ADD_LINE_ITEM, {
      body: {
        items: [
          {
            id: "product-1",
            referencedId: "product-1",
            quantity: 2,
            type: "product",
          },
        ],
      },
    });
    await vi.waitFor(() => expect(cartStatus()).toBe("ready:2"));
  });

  it("renders the island's success toast with the action link outside the message", async () => {
    const { container, addToCart } = await mountShop();

    await addToCart();

    const messages = queryAll<HTMLElement>(container, MESSAGE);
    expect(messages).toHaveLength(1);
    const message = messages.at(-1) as HTMLElement;
    expect(message.textContent).toBe("Aerodynamic Bag has been added to cart.");
    expect(message.textContent).toMatch(/has been added to cart.$/);
    expect(message.querySelector("a")).toBeNull();
    const link = query<HTMLAnchorElement>(
      container,
      '[data-testid="notification-element-action"]',
    );
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/checkout/cart");
    expect(link.textContent).toBe("View cart");
    expect(message.contains(link)).toBe(false);
    expect(link.previousElementSibling).toBe(message);
    const toast = toastOf(message);
    expect(toast.contains(link)).toBe(true);
    expect(toast.dataset.testid).toBe("notification-element-success");
    expect(toast.className).toContain("pointer-events-auto");
  });

  it("leaves the notification of cart errors to the island", async () => {
    const stock = cartError("product-stock-reached", "product-1");
    backend.afterAdd = cart({
      lineItems: [lineItem({ quantityInformation: { maxPurchase: 1 } })],
      errors: { [stock.key]: stock },
    });
    const { container, addToCart } = await mountShop();

    await expect(addToCart()).resolves.toEqual({
      ok: true,
      errors: [
        {
          messageKey: "product-stock-reached",
          params: { name: "Aerodynamic Bag", quantity: 1 },
        },
      ],
    });

    const messages = queryAll(container, MESSAGE);
    expect(messages.map((message) => message.textContent)).toEqual([
      "product-stock-reached",
    ]);
  });

  it("resolves a failed add with the API message and shows only the island's toast", async () => {
    browser.invoke.mockImplementation(async (operation) => {
      if (operation === READ_CONTEXT) {
        return { data: salesChannelContext(null), status: 200 };
      }
      if (operation === READ_CART) return { data: cart(), status: 200 };
      throw apiClientError([{ code: "product-not-found" }], 404);
    });
    const { container, addToCart } = await mountShop();

    const message = testTranslator()("errors.product-not-found");
    await expect(addToCart()).resolves.toEqual({ ok: false, message });

    const messages = queryAll(container, MESSAGE);
    expect(messages.map((element) => element.textContent)).toEqual([message]);
  });
});

function Notifier({ notification }: { notification: CmsNotification }) {
  const { notify } = useCmsActions();
  return (
    <button
      type="button"
      data-testid="notify"
      onClick={() => notify(notification)}
    >
      notify
    </button>
  );
}

async function showToast(notification: CmsNotification, locale?: Locale) {
  mounted = await mount(
    withI18n(
      <StorefrontProviders>
        <Notifier notification={notification} />
      </StorefrontProviders>,
      locale,
    ),
  );
  const { container } = mounted;
  await interact(() =>
    query<HTMLButtonElement>(container, '[data-testid="notify"]').click(),
  );
  return container;
}

async function advance(ms: number) {
  await interact(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("StorefrontProviders toasts", () => {
  it("dismisses a toast after the default timeout", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const container = await showToast({ type: "info", message: "Saved" });
    expect(queryAll(container, MESSAGE)).toHaveLength(1);

    await advance(TOAST_TIMEOUT_MS - 1);
    expect(queryAll(container, MESSAGE)).toHaveLength(1);

    await advance(1);
    expect(queryAll(container, MESSAGE)).toHaveLength(0);
  });

  it("respects the timeout of the notification", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const container = await showToast({
      type: "warning",
      message: "Hurry",
      timeout: 12_000,
    });

    await advance(TOAST_TIMEOUT_MS);
    expect(queryAll(container, MESSAGE)).toHaveLength(1);

    await advance(12_000 - TOAST_TIMEOUT_MS);
    expect(queryAll(container, MESSAGE)).toHaveLength(0);
  });

  it.each([
    ["a zero", 0],
    ["an infinite", Number.POSITIVE_INFINITY],
    ["a negative", -1],
  ])("keeps a toast with %s timeout until it is closed", async (_, timeout) => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const container = await showToast({
      type: "error",
      message: "Payment failed",
      timeout,
    });

    await advance(60_000);
    expect(queryAll(container, MESSAGE)).toHaveLength(1);

    const close = query<HTMLButtonElement>(
      container,
      '[data-testid="notification-element-button"]',
    );
    expect(close.getAttribute("aria-label")).toBe("Close notification");
    await interact(() => close.click());

    expect(queryAll(container, MESSAGE)).toHaveLength(0);
  });

  it("closes the toast when its action link is followed", async () => {
    const container = await showToast({
      type: "success",
      message: "Added",
      action: { label: "View cart", href: "/checkout/cart" },
    });
    const link = query<HTMLAnchorElement>(
      container,
      '[data-testid="notification-element-action"]',
    );

    await interact(() => {
      link.addEventListener("click", (event) => event.preventDefault(), {
        once: true,
      });
      link.click();
    });

    expect(queryAll(container, MESSAGE)).toHaveLength(0);
  });

  it("labels the close button in Polish and prefixes the action link under the pl-PL provider", async () => {
    const container = await showToast(
      {
        type: "success",
        message: "Dodano",
        action: { label: "Zobacz koszyk", href: "/checkout/cart" },
      },
      "pl-PL",
    );

    expect(
      query<HTMLAnchorElement>(
        container,
        '[data-testid="notification-element-action"]',
      ).getAttribute("href"),
    ).toBe("/pl-PL/checkout/cart");
    expect(
      query<HTMLButtonElement>(
        container,
        '[data-testid="notification-element-button"]',
      ).getAttribute("aria-label"),
    ).toBe("Zamknij powiadomienie");
  });
});

describe("StorefrontProviders CMS stubs", () => {
  it("warns once and leaves no message for the island to repeat", async () => {
    const results: CmsActionResult[] = [];
    function ContactConsumer() {
      const actions = useCmsActions();
      return (
        <button
          type="button"
          data-testid="call-contact"
          onClick={() => {
            void actions
              .submitContactForm({ email: "jane@example.com" })
              .then((result) => {
                if (!result.ok && result.message) {
                  actions.notify({ type: "error", message: result.message });
                }
                results.push(result);
              });
          }}
        >
          contact
        </button>
      );
    }
    mounted = await mount(
      <StorefrontProviders>
        <ContactConsumer />
      </StorefrontProviders>,
    );
    const { container } = mounted;

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="call-contact"]',
      ).click(),
    );
    await vi.waitFor(() => expect(results).toHaveLength(1));

    expect(results[0]).toEqual({ ok: false });
    const toasts = queryAll<HTMLParagraphElement>(container, MESSAGE);
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.textContent).toBe(
      "Forms are not connected to a session yet.",
    );
    expect(toastOf(toasts[0] as HTMLParagraphElement).className).toContain(
      "bg-states-warning-container",
    );
  });
});

type WishlistResult = CmsActionResult & {
  inWishlist?: boolean;
  cancelled?: boolean;
};

function WishlistIsland({
  onResult,
}: {
  onResult: (result: WishlistResult) => void;
}) {
  const actions = useCmsActions();
  return (
    <>
      <output data-testid="in-wishlist">
        {String(actions.isInWishlist("product-1"))}
      </output>
      <button
        type="button"
        data-testid="toggle-wishlist"
        onClick={() => {
          void actions.toggleWishlist("product-1").then(onResult);
        }}
      >
        toggle
      </button>
    </>
  );
}

async function mountWishlistShop() {
  const results: WishlistResult[] = [];
  mounted = await mount(
    <StorefrontProviders>
      <WishlistIsland onResult={(result) => results.push(result)} />
    </StorefrontProviders>,
  );
  const { container } = mounted;
  const inWishlist = () =>
    query(container, '[data-testid="in-wishlist"]').textContent;
  const toggle = () =>
    interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="toggle-wishlist"]',
      ).click(),
    );
  return { results, inWishlist, toggle };
}

function invoked(operation: string): unknown[] {
  return browser.invoke.mock.calls
    .filter(([name]) => name === operation)
    .map(([, params]) => params);
}

function loginDialog(): HTMLDialogElement {
  const dialog = document.body.querySelector<HTMLDialogElement>("dialog");
  if (!dialog) throw new Error("The login modal is not open");
  return dialog;
}

describe("StorefrontProviders wishlist", () => {
  it("adds and removes a product of a signed-in customer through the CMS port", async () => {
    backend.signedIn = true;
    const { results, inWishlist, toggle } = await mountWishlistShop();
    await vi.waitFor(() => expect(invoked(READ_WISHLIST)).toHaveLength(1));

    await toggle();
    await vi.waitFor(() => expect(results).toHaveLength(1));

    expect(results[0]).toEqual({ ok: true, inWishlist: true });
    expect(invoked(ADD_WISHLIST)).toEqual([
      { pathParams: { productId: "product-1" } },
    ]);
    expect(inWishlist()).toBe("true");

    await toggle();
    await vi.waitFor(() => expect(results).toHaveLength(2));

    expect(results[1]).toEqual({ ok: true, inWishlist: false });
    expect(invoked(DELETE_WISHLIST)).toHaveLength(1);
    expect(inWishlist()).toBe("false");
    expect(document.body.querySelector("dialog")).toBeNull();
  });

  it("waits for a loading session before it decides that a customer is logged in", async () => {
    backend.signedIn = true;
    const answer = browser.invoke.getMockImplementation();
    let openContext: () => void = () => {};
    const contextGate = new Promise<void>((resolve) => {
      openContext = resolve;
    });
    browser.invoke.mockImplementation(async (operation, params) => {
      if (operation === READ_CONTEXT) await contextGate;
      return answer?.(operation, params);
    });
    const { results, toggle } = await mountWishlistShop();

    await toggle();
    await interact(() => openContext());
    await vi.waitFor(() => expect(results).toHaveLength(1));

    expect(results[0]).toEqual({ ok: true, inWishlist: true });
    expect(invoked(ADD_WISHLIST)).toHaveLength(1);
    expect(document.body.querySelector("dialog")).toBeNull();
  });

  it("re-reads the session and asks for a login when the backend says the customer is gone", async () => {
    backend.signedIn = true;
    const answer = browser.invoke.getMockImplementation();
    browser.invoke.mockImplementation(async (operation, params) => {
      if (operation === ADD_WISHLIST) {
        backend.signedIn = false;
        throw apiClientError(
          [
            {
              code: "FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN",
              status: "403",
              detail: "Customer is not logged in.",
            },
          ],
          403,
        );
      }
      return answer?.(operation, params);
    });
    const { results, toggle } = await mountWishlistShop();
    await vi.waitFor(() => expect(invoked(READ_WISHLIST)).toHaveLength(1));

    await toggle();
    await vi.waitFor(() => expect(loginDialog()).toBeTruthy());

    expect(invoked(READ_CONTEXT).length).toBeGreaterThanOrEqual(2);
    const close = queryAll<HTMLButtonElement>(loginDialog(), "button").find(
      (button) => button.textContent === "Close",
    );
    await interact(() => close?.click());
    await vi.waitFor(() => expect(results).toHaveLength(1));
    expect(results[0]).toEqual({ ok: false, cancelled: true });
  });

  it("reads the wishlist again when the tab becomes visible after a failed read", async () => {
    backend.signedIn = true;
    backend.wishlist = ["product-1"];
    const answer = browser.invoke.getMockImplementation();
    let failRead = true;
    browser.invoke.mockImplementation(async (operation, params) => {
      if (operation === READ_WISHLIST && failRead) {
        failRead = false;
        throw new Error("offline");
      }
      return answer?.(operation, params);
    });
    const { inWishlist } = await mountWishlistShop();
    await vi.waitFor(() => expect(invoked(READ_WISHLIST)).toHaveLength(1));
    expect(inWishlist()).toBe("false");

    await interact(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    await vi.waitFor(() => expect(inWishlist()).toBe("true"));
    expect(invoked(READ_WISHLIST)).toHaveLength(2);
  });

  it("asks a guest to log in and reports a cancelled toggle when the modal is closed", async () => {
    const { results, toggle } = await mountWishlistShop();

    await toggle();
    await vi.waitFor(() => expect(loginDialog()).toBeTruthy());
    const close = queryAll<HTMLButtonElement>(loginDialog(), "button").find(
      (button) => button.textContent === "Close",
    );
    await interact(() => close?.click());
    await vi.waitFor(() => expect(results).toHaveLength(1));

    expect(results[0]).toEqual({ ok: false, cancelled: true });
    expect(invoked(ADD_WISHLIST)).toEqual([]);
    expect(invoked(READ_WISHLIST)).toEqual([]);
  });

  it("adds the product once a guest logged in through the modal", async () => {
    backend.acceptLogin = true;
    backend.wishlist = ["product-9"];
    const { results, inWishlist, toggle } = await mountWishlistShop();

    await toggle();
    await vi.waitFor(() => expect(loginDialog()).toBeTruthy());
    await interact(() => {
      setInputValue(
        query<HTMLInputElement>(
          loginDialog(),
          '[data-testid="login-email-input"]',
        ),
        "jane@example.com",
      );
      setInputValue(
        query<HTMLInputElement>(
          loginDialog(),
          '[data-testid="login-password-input"]',
        ),
        "secret-password",
      );
    });
    await interact(() =>
      submitForm(
        query<HTMLFormElement>(loginDialog(), '[data-testid="login-form"]'),
      ),
    );
    await vi.waitFor(() => expect(results).toHaveLength(1));

    expect(results[0]).toEqual({ ok: true, inWishlist: true });
    const order = browser.invoke.mock.calls
      .map(([name]) => name)
      .filter((name) => name === READ_WISHLIST || name === ADD_WISHLIST);
    expect(order).toEqual([READ_WISHLIST, ADD_WISHLIST]);
    expect(backend.wishlist).toEqual(["product-1", "product-9"]);
    await vi.waitFor(() => expect(inWishlist()).toBe("true"));
    expect(document.body.querySelector("dialog")).toBeNull();
  });
});

const REVIEW_INPUT = {
  productId: "variant-1",
  title: "Great chair",
  content: "Comfortable, sturdy and easy to assemble in ten minutes.",
  points: 5,
};

function productReview(
  overrides: Partial<Schemas["ProductReview"]> = {},
): Schemas["ProductReview"] {
  return {
    id: "review-1",
    productId: "variant-1",
    salesChannelId: "sales-channel-1",
    languageId: "language-en",
    title: "Solid chair",
    content: "Sturdy and comfortable for long working days at the desk.",
    points: 4,
    status: true,
    ...overrides,
  };
}

function describeCustomer(state: CmsCustomerState | null): string {
  if (!state) return "none";
  return state.status === "customer"
    ? `customer:${state.customerId}`
    : state.status;
}

function ReviewsIsland({
  onResult,
}: {
  onResult: (result: CmsActionResult) => void;
}) {
  const actions = useCmsActions();
  const { logout } = useSessionActions();
  return (
    <>
      <output data-testid="customer-state">
        {describeCustomer(actions.getCustomerState())}
      </output>
      <button
        type="button"
        data-testid="load-reviews"
        onClick={() => {
          void actions
            .loadProductReviews({ productId: "parent-1" })
            .then(onResult);
        }}
      >
        load
      </button>
      <button
        type="button"
        data-testid="submit-review"
        onClick={() => {
          void actions.submitProductReview(REVIEW_INPUT).then(onResult);
        }}
      >
        submit
      </button>
      <button
        type="button"
        data-testid="logout"
        onClick={() => {
          void logout();
        }}
      >
        logout
      </button>
    </>
  );
}

async function mountReviewsShop() {
  const results: CmsActionResult[] = [];
  mounted = await mount(
    <StorefrontProviders>
      <ReviewsIsland onResult={(result) => results.push(result)} />
    </StorefrontProviders>,
  );
  const { container } = mounted;
  const click = (testId: string) =>
    interact(() =>
      query<HTMLButtonElement>(container, `[data-testid="${testId}"]`).click(),
    );
  const call = async (testId: string) => {
    const before = results.length;
    await click(testId);
    await vi.waitFor(() => expect(results).toHaveLength(before + 1));
    return results[before];
  };
  return {
    container,
    results,
    click,
    load: () => call("load-reviews"),
    submit: () => call("submit-review"),
    customerState: () =>
      query(container, '[data-testid="customer-state"]').textContent,
    toasts: () => queryAll(container, MESSAGE),
  };
}

function gateContextReads() {
  const answer = browser.invoke.getMockImplementation();
  let open: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    open = resolve;
  });
  browser.invoke.mockImplementation(async (operation, params) => {
    if (operation === READ_CONTEXT) await gate;
    return answer?.(operation, params);
  });
  return () => interact(() => open());
}

function failSave(error: unknown, before: () => void = () => {}) {
  const answer = browser.invoke.getMockImplementation();
  browser.invoke.mockImplementation(async (operation, params) => {
    if (operation === SAVE_REVIEW) {
      before();
      throw error;
    }
    return answer?.(operation, params);
  });
}

describe("StorefrontProviders reviews", () => {
  it("reads the reviews over GET once the session is ready, without a toast", async () => {
    backend.signedIn = true;
    backend.reviews = [
      productReview(),
      productReview({ id: "review-2", status: false }),
    ];
    const openContext = gateContextReads();
    const shop = await mountReviewsShop();

    await shop.click("load-reviews");
    expect(invoked(READ_REVIEWS)).toEqual([]);
    await openContext();
    await vi.waitFor(() => expect(shop.results).toHaveLength(1));

    expect(shop.results[0]).toEqual({
      ok: true,
      reviews: backend.reviews,
      total: 2,
      page: 1,
      limit: 10,
    });
    expect(invoked(READ_REVIEWS)).toEqual([
      {
        pathParams: { productId: "parent-1" },
        query: { _criteria: encodeForQuery(productReviewsCriteria()) },
        fetchOptions: { timeout: READ_TIMEOUT_MS },
      },
    ]);
    const operations = browser.invoke.mock.calls.map(([name]) => name);
    expect(operations.indexOf(READ_CONTEXT)).toBeLessThan(
      operations.indexOf(READ_REVIEWS),
    );
    expect(shop.toasts()).toHaveLength(0);
  });

  it("resolves a failed read as not ok, logs it and shows no toast", async () => {
    backend.signedIn = true;
    const failure = apiClientError(
      [{ code: "PRODUCT__REVIEW_NOT_ACTIVE", status: "403" }],
      403,
    );
    const answer = browser.invoke.getMockImplementation();
    browser.invoke.mockImplementation(async (operation, params) => {
      if (operation === READ_REVIEWS) throw failure;
      return answer?.(operation, params);
    });
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const shop = await mountReviewsShop();

    await expect(shop.load()).resolves.toEqual({ ok: false });

    expect(consoleError).toHaveBeenCalledWith(
      "[Reviews] reading the product reviews failed",
      failure,
    );
    expect(shop.toasts()).toHaveLength(0);
  });

  it("reports the customer state from loading to the customer and to a guest after a logout", async () => {
    backend.signedIn = true;
    const openContext = gateContextReads();
    const shop = await mountReviewsShop();

    expect(shop.customerState()).toBe("loading");

    await openContext();
    await vi.waitFor(() =>
      expect(shop.customerState()).toBe("customer:customer-1"),
    );

    await shop.click("logout");

    await vi.waitFor(() => expect(shop.customerState()).toBe("guest"));
  });

  it("saves a review under the given product id without a toast", async () => {
    backend.signedIn = true;
    const shop = await mountReviewsShop();

    await expect(shop.submit()).resolves.toEqual({ ok: true });

    expect(invoked(SAVE_REVIEW)).toEqual([
      {
        pathParams: { productId: "variant-1" },
        body: {
          title: REVIEW_INPUT.title,
          content: REVIEW_INPUT.content,
          points: 5,
        },
      },
    ]);
    expect(shop.toasts()).toHaveLength(0);
  });

  it("resolves a second review of the same customer as a violation without a toast", async () => {
    backend.signedIn = true;
    failSave(
      apiClientError(
        [
          {
            code: "VIOLATION::ENTITY_EXISTS",
            status: "400",
            detail: "The review already exists.",
          },
        ],
        400,
      ),
    );
    const shop = await mountReviewsShop();
    await vi.waitFor(() =>
      expect(shop.customerState()).toBe("customer:customer-1"),
    );

    await expect(shop.submit()).resolves.toEqual({
      ok: false,
      violations: [
        {
          code: "VIOLATION::ENTITY_EXISTS",
          detail: "The review already exists.",
        },
      ],
    });

    expect(shop.toasts()).toHaveLength(0);
    expect(invoked(READ_CONTEXT)).toHaveLength(1);
  });

  it("re-reads the session when the backend says the customer is gone", async () => {
    backend.signedIn = true;
    failSave(
      apiClientError(
        [
          {
            code: "FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN",
            status: "403",
            detail: "Customer is not logged in.",
          },
        ],
        403,
      ),
      () => {
        backend.signedIn = false;
      },
    );
    const shop = await mountReviewsShop();
    await vi.waitFor(() =>
      expect(shop.customerState()).toBe("customer:customer-1"),
    );

    await expect(shop.submit()).resolves.toEqual({
      ok: false,
      violations: [
        {
          code: "FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN",
          detail: "Customer is not logged in.",
        },
      ],
    });

    expect(invoked(READ_CONTEXT)).toHaveLength(2);
    expect(shop.customerState()).toBe("guest");
    expect(shop.toasts()).toHaveLength(0);
    expect(document.body.querySelector("dialog")).toBeNull();
  });

  it("resolves a failure without API errors with the default message and no toast", async () => {
    backend.signedIn = true;
    const failure = new Error("offline");
    failSave(failure);
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const shop = await mountReviewsShop();

    await expect(shop.submit()).resolves.toEqual({
      ok: false,
      message: testTranslator()("errors.message-default"),
    });

    expect(consoleError).toHaveBeenCalledWith(
      "[Reviews] saving the product review failed",
      failure,
    );
    expect(shop.toasts()).toHaveLength(0);
  });
});
