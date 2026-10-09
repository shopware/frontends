import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { useRef } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, pressKey, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import {
  cartView,
  fakeCart,
  lineItem,
  promotionItem,
} from "./cartView.fixture";
import type { CartView } from "./cartView.fixture";
import { MiniCart } from "./MiniCart";

const route = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  let pathname = "/";
  return {
    get: () => pathname,
    set(next: string) {
      pathname = next;
      for (const listener of listeners) listener();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
});

vi.mock("next/navigation", async () => {
  const { useSyncExternalStore } = await import("react");
  return {
    usePathname: () =>
      useSyncExternalStore(route.subscribe, route.get, route.get),
  };
});

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("./cartView.fixture")).useFakeCart,
}));

const CONTAINER = '[data-testid="mini-cart-container"]';
const TILE = '[data-testid="checkout-product-tile-item"]';
const REMOVE = '[data-testid="checkout-product-tile-remove-button"]';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

function Harness({ onClose }: { onClose(): void }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={triggerRef} type="button" data-testid="trigger">
        Cart
      </button>
      <MiniCart id="mini-cart" triggerRef={triggerRef} onClose={onClose} />
      <p data-testid="outside">Outside</p>
    </>
  );
}

let mounted: Mounted | undefined;

beforeEach(() => {
  route.set("/");
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup(cart: Partial<CartView> = {}, locale?: Locale) {
  fakeCart.set(
    cartView({
      lineItems: [
        lineItem(),
        lineItem({ id: "line-2", referencedId: "product-2", label: "Lamp" }),
      ],
      subtotal: 59.97,
      ...cart,
    }),
  );
  const onClose = vi.fn();
  const notify = vi.fn();
  const page: ReactNode = (
    <CmsActionsProvider actions={{ notify }}>
      <Harness onClose={onClose} />
    </CmsActionsProvider>
  );
  mounted = await mount(locale ? withI18n(page, locale) : page);
  const { container } = mounted;
  return {
    container,
    onClose,
    notify,
    panel: () => query<HTMLElement>(container, CONTAINER),
    trigger: query<HTMLButtonElement>(container, '[data-testid="trigger"]'),
  };
}

describe("MiniCart", () => {
  it("lists the line items with the subtotal and the checkout links", async () => {
    const { panel, onClose } = await setup();

    const container = panel();
    expect(container.id).toBe("mini-cart");
    const heading = query<HTMLElement>(container, "h2");
    expect(heading.textContent).toBe("My cart");
    expect(container.getAttribute("aria-labelledby")).toBe(heading.id);

    const list = query<HTMLElement>(container, "ul");
    expect(list.className).toContain("max-h-[365px]");
    expect(list.className).toContain("overflow-y-auto");
    expect(
      queryAll<HTMLElement>(list, TILE).map((tile) =>
        tile.getAttribute("data-product-id"),
      ),
    ).toEqual(["product-1", "product-2"]);

    expect(container.textContent).toContain("Subtotal€59.97");
    expect(container.textContent).toContain(
      "Taxes & shipping estimated at checkout.",
    );

    const checkout = query<HTMLAnchorElement>(
      container,
      '[data-testid="checkout-cart-link"]',
    );
    expect(checkout.getAttribute("href")).toBe("/checkout");
    expect(checkout.textContent).toBe("Proceed to checkout");
    const cartLink = queryAll<HTMLAnchorElement>(container, "a").find(
      (link) => link.textContent === "Go to shopping cart",
    );
    expect(cartLink?.getAttribute("href")).toBe("/checkout/cart");

    const close = query<HTMLButtonElement>(
      container,
      '[data-testid="mini-cart-close-button"]',
    );
    expect(close.getAttribute("aria-label")).toBe("Close");
    expect(close.type).toBe("button");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("heads the panel with a sand strip and shows the checkout links as ink pills", async () => {
    const { panel } = await setup();
    const container = panel();

    expect(
      query<HTMLElement>(container, "h2").parentElement?.className,
    ).toContain("bg-shell-sand");
    const checkout = query<HTMLAnchorElement>(
      container,
      '[data-testid="checkout-cart-link"]',
    );
    expect(checkout.className).toContain("rounded-full");
    expect(checkout.className).toContain("bg-shell-ink");
    expect(checkout.className).toContain("text-shell-on-ink");
    expect(checkout.className).toContain("hover:bg-shell-ink-soft");
    expect(checkout.className).toContain("focus-visible:outline-shell-ink");
    const cartLink = queryAll<HTMLAnchorElement>(container, "a").find(
      (link) => link.textContent === "Go to shopping cart",
    );
    expect(cartLink?.className).toContain(
      "rounded-full border border-shell-ink bg-surface-surface",
    );
    expect(cartLink?.className).toContain("text-shell-ink");
    expect(cartLink?.className).toContain("focus-visible:outline-shell-ink");
    for (const link of [checkout, cartLink]) {
      expect(link?.className).toMatch(/(^| )border( |$)/);
      expect(link?.className).toContain("py-2.5");
      expect(link?.className).toContain("leading-6");
    }
  });

  it("keeps the subtotal and both checkout links on screen by shrinking only the list from lg up", async () => {
    const { panel } = await setup();
    const container = panel();
    const [title, list, footer] = [...container.children] as HTMLElement[];

    expect(container.className).toContain("flex");
    expect(container.className).toContain("flex-col");
    expect(container.className).toContain(
      "lg:max-h-[calc(100dvh_-_var(--sticky-header-height)_+_2rem)]",
    );
    expect(title?.className).toContain("shrink-0");
    expect(list?.tagName).toBe("UL");
    expect(list?.className).toContain("min-h-0");
    expect(list?.className).toContain("overscroll-contain");
    expect(list?.className).not.toContain("flex-1");
    expect(list?.className).not.toContain("shrink-0");
    expect(footer?.className).toContain("shrink-0");
    expect(
      query(footer as HTMLElement, '[data-testid="checkout-cart-link"]'),
    ).toBeDefined();
  });

  it("closes from the close button and returns focus to the cart button", async () => {
    const { panel, onClose, trigger } = await setup();

    await interact(() =>
      query<HTMLButtonElement>(
        panel(),
        '[data-testid="mini-cart-close-button"]',
      ).click(),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on Escape and returns focus from inside the panel", async () => {
    const { panel, onClose, trigger } = await setup();
    query<HTMLButtonElement>(panel(), REMOVE).focus();

    await interact(() => pressKey(document, "Escape"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on Escape without taking focus from elsewhere on the page", async () => {
    const { container, onClose } = await setup();
    const input = document.createElement("input");
    container.append(input);
    input.focus();

    await interact(() => pressKey(document, "Escape"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input);
  });

  it("closes on a mousedown outside but not inside or on the cart button", async () => {
    const { container, panel, onClose, trigger } = await setup();

    await interact(() =>
      query<HTMLElement>(panel(), TILE).dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      ),
    );
    await interact(() =>
      trigger.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
    );
    expect(onClose).not.toHaveBeenCalled();

    await interact(() =>
      query<HTMLElement>(container, '[data-testid="outside"]').dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      ),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the route changes", async () => {
    const { onClose } = await setup();

    await interact(() => route.set("/Clothing/"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes once the cart is empty", async () => {
    const { onClose, trigger } = await setup();

    await interact(() =>
      fakeCart.set(cartView({ lineItems: [lineItem()], subtotal: 39.98 })),
    );
    expect(onClose).not.toHaveBeenCalled();

    await interact(() => fakeCart.set(cartView({ lineItems: [] })));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
  });

  it("does not close while the cart is loading", async () => {
    const { onClose } = await setup({ status: "loading", lineItems: [] });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("removes a line item once while the removal is pending", async () => {
    const request = deferred<{ ok: boolean }>();
    const removeItem = vi.fn<CartView["removeItem"]>(() => request.promise);
    const { panel, notify } = await setup({ removeItem });
    const remove = query<HTMLButtonElement>(
      panel(),
      `[data-product-id="product-2"] ${REMOVE}`,
    );

    await interact(() => remove.click());
    await interact(() => remove.click());

    expect(removeItem).toHaveBeenCalledTimes(1);
    expect(removeItem).toHaveBeenCalledWith("line-2");

    await interact(() => request.resolve({ ok: true }));
    expect(notify).not.toHaveBeenCalled();

    await interact(() => remove.click());
    expect(removeItem).toHaveBeenCalledTimes(2);
  });

  it("notifies the error of a failed removal", async () => {
    const removeItem = vi.fn<CartView["removeItem"]>(async () => ({
      ok: false,
      message: "The line item could not be removed.",
    }));
    const { panel, notify } = await setup({ removeItem });

    await interact(() => query<HTMLButtonElement>(panel(), REMOVE).click());

    expect(removeItem).toHaveBeenCalledWith("line-1");
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "The line item could not be removed.",
    });
  });

  it("does not notify a failure without a message", async () => {
    const removeItem = vi.fn<CartView["removeItem"]>(async () => ({
      ok: false,
    }));
    const { panel, notify } = await setup({ removeItem });

    await interact(() => query<HTMLButtonElement>(panel(), REMOVE).click());

    expect(notify).not.toHaveBeenCalled();
  });

  it("notifies the cart errors of a quantity change", async () => {
    const changeQuantity = vi.fn<CartView["changeQuantity"]>(async () => ({
      ok: true,
      errors: [
        {
          messageKey: "product-stock-reached",
          params: { name: "Lamp", quantity: 3 },
        },
        { messageKey: "unknown-code", params: { message: "Backend text" } },
        { messageKey: "unknown-code-without-text" },
      ],
    }));
    const { panel, notify } = await setup({ changeQuantity });

    await interact(() =>
      query<HTMLButtonElement>(
        panel(),
        'button[aria-label="Increase quantity"]',
      ).click(),
    );

    expect(changeQuantity).toHaveBeenCalledTimes(1);
    expect(changeQuantity).toHaveBeenCalledWith("line-1", 3);
    expect(notify.mock.calls).toEqual([
      [
        {
          type: "error",
          message: "The product Lamp is only available 3 times",
        },
      ],
      [{ type: "error", message: "Backend text" }],
    ]);
  });

  it("leaves out the quantity of a promotion", async () => {
    const { panel } = await setup({
      lineItems: [lineItem(), promotionItem()],
    });

    const tiles = queryAll<HTMLElement>(panel(), TILE);
    expect(tiles).toHaveLength(2);
    expect(
      tiles[1]?.querySelector('[data-testid="product-quantity"]'),
    ).toBeNull();
  });
});

describe("MiniCart in other locales", () => {
  it("speaks Polish and links to the Polish checkout and cart", async () => {
    const { panel } = await setup({}, "pl-PL");

    const container = panel();
    expect(query<HTMLElement>(container, "h2").textContent).toBe("Koszyk");
    expect(
      query<HTMLButtonElement>(
        container,
        '[data-testid="mini-cart-close-button"]',
      ).getAttribute("aria-label"),
    ).toBe("Zamknij");
    expect(
      queryAll<HTMLAnchorElement>(container, "a").map((link) => [
        link.textContent,
        link.getAttribute("href"),
      ]),
    ).toEqual([
      ["Przejdź do kasy", "/pl-PL/checkout"],
      ["Przejdź do koszyka", "/pl-PL/checkout/cart"],
    ]);
  });
});
