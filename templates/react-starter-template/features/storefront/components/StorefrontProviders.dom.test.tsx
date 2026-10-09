import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import type {
  CmsActionResult,
  CmsNotification,
} from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import { cart, cartError, lineItem } from "@/features/cart/cart.fixture";
import { useCart } from "@/features/cart/useCart";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import {
  apiClientError,
  salesChannelContext,
} from "@/features/session/session.fixture";
import type { SessionActionResult } from "@/features/session/types";
import type { Locale } from "@/i18n/config";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";
import { testTranslator, withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { StorefrontProviders, TOAST_TIMEOUT_MS } from "./StorefrontProviders";

const browser = vi.hoisted(() => ({
  invoke: vi.fn<(operation: string, params?: unknown) => Promise<unknown>>(),
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
const MESSAGE = '[data-testid="notification-element-message"]';

const backend: { cart: Schemas["Cart"]; afterAdd: Schemas["Cart"] } = {
  cart: cart(),
  afterAdd: cart(),
};

let mounted: Mounted | undefined;

beforeEach(() => {
  backend.cart = cart();
  backend.afterAdd = cart({ lineItems: [lineItem({ quantity: 2 })] });
  browser.invoke.mockReset();
  browser.invoke.mockImplementation(async (operation) => {
    switch (operation) {
      case READ_CONTEXT:
        return { data: salesChannelContext(null), status: 200 };
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
