import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { CartPageContent } from "./CartPageContent";
import {
  cartView,
  fakeCart,
  lineItem,
  promotionItem,
} from "./cartView.fixture";
import type { CartView } from "./cartView.fixture";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("./cartView.fixture")).useFakeCart,
}));

const TILE = '[data-testid="checkout-product-tile-item"]';
const SKELETON = '[data-testid="cart-page-skeleton"]';
const PROMO_INPUT = '[data-testid="cart-promotion-code-input"]';

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup(cart: CartView, locale?: Locale) {
  fakeCart.set(cart);
  const notify = vi.fn();
  const page = (
    <CmsActionsProvider actions={{ notify }}>
      <CartPageContent />
    </CmsActionsProvider>
  );
  mounted = await mount(locale ? withI18n(page, locale) : page);
  return { container: mounted.container, notify };
}

function removableCart(items: Schemas["LineItem"][]) {
  const removeItem = vi.fn<CartView["removeItem"]>(async (id) => {
    fakeCart.set(
      cartView({
        lineItems: fakeCart.get().lineItems.filter((item) => item.id !== id),
        removeItem,
      }),
    );
    return { ok: true, errors: [] };
  });
  return cartView({ lineItems: items, removeItem });
}

function removeButton(container: HTMLElement, productId: string) {
  return query<HTMLButtonElement>(
    container,
    `[data-product-id="${productId}"] button[data-line-item-remove]`,
  );
}

function retryButton(container: HTMLElement) {
  const button = queryAll<HTMLButtonElement>(container, "button").find(
    (candidate) => candidate.textContent === "Try again",
  );
  if (!button) throw new Error("No retry button");
  return button;
}

function links(container: HTMLElement) {
  return queryAll<HTMLAnchorElement>(container, "a").map((link) => [
    link.textContent,
    link.getAttribute("href"),
  ]);
}

describe("CartPageContent", () => {
  it("shows the title and a skeleton while the cart is loading", async () => {
    const { container } = await setup(cartView({ status: "loading" }));

    const heading = query<HTMLElement>(container, "h1");
    expect(heading.textContent).toBe("My cart");
    expect(heading.className).toContain("text-[40px]");
    expect(heading.className).toContain("font-serif");

    const skeleton = query<HTMLElement>(container, SKELETON);
    expect(skeleton.getAttribute("aria-busy")).toBe("true");
    expect(container.textContent).not.toContain("Your cart is empty");
    expect(container.querySelector(TILE)).toBeNull();
  });

  it("shows the empty state with a link back to the shop", async () => {
    const { container } = await setup(cartView({ lineItems: [] }));

    expect(container.querySelector(SKELETON)).toBeNull();
    expect(container.textContent).toContain("Your cart is empty");
    expect(links(container)).toEqual([["Continue Shopping", "/"]]);
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(container.querySelector(PROMO_INPUT)).toBeNull();
  });

  it("reports a cart that could not be read and reads it again on retry", async () => {
    let settle!: () => void;
    const refresh = vi.fn<CartView["refresh"]>(
      () =>
        new Promise<void>((resolve) => {
          settle = resolve;
        }),
    );
    const { container } = await setup(
      cartView({ status: "error", cart: null, lineItems: [], refresh }),
    );

    const alert = query<HTMLElement>(container, '[role="alert"]');
    expect(alert.textContent).toContain("Unfortunately, something went wrong.");
    expect(container.textContent).not.toContain("Your cart is empty");
    expect(links(container)).toEqual([["Continue Shopping", "/"]]);

    expect(container.querySelector(PROMO_INPUT)).toBeNull();

    const retry = retryButton(container);
    expect(retry.disabled).toBe(false);
    expect(retry.hasAttribute("aria-busy")).toBe(false);

    await interact(() => retry.click());
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(retryButton(container).disabled).toBe(true);
    expect(retryButton(container).getAttribute("aria-busy")).toBe("true");

    await interact(() => retryButton(container).click());
    expect(refresh).toHaveBeenCalledTimes(1);

    await interact(() => settle());
    expect(retryButton(container).disabled).toBe(false);
    expect(retryButton(container).hasAttribute("aria-busy")).toBe(false);
  });

  it("lists the line items with the summary, the promo code field and the checkout link", async () => {
    const { container } = await setup(
      cartView({
        cart: {
          price: {
            positionPrice: 59.97,
            totalPrice: 64.96,
            taxStatus: "gross",
          },
        } as Schemas["Cart"],
        lineItems: [
          lineItem(),
          lineItem({ id: "line-2", referencedId: "product-2", label: "Lamp" }),
        ],
        subtotal: 59.97,
        totalPrice: 64.96,
        shippingCosts: [
          {
            shippingMethod: { id: "standard", name: "Standard" },
            shippingCosts: { totalPrice: 4.99 },
            location: { country: { name: "Germany" } },
          } as Schemas["CartDelivery"],
        ],
      }),
    );

    const list = query<HTMLElement>(container, "ul");
    const tiles = queryAll<HTMLElement>(list, `li > ${TILE}`);
    expect(tiles.map((tile) => tile.getAttribute("data-product-id"))).toEqual([
      "product-1",
      "product-2",
    ]);
    expect(tiles[0]?.className).toContain("w-full");

    const summary = query<HTMLElement>(
      container,
      'section[aria-labelledby="cart-summary-heading"]',
    );
    expect(
      query<HTMLElement>(summary, "h2#cart-summary-heading").textContent,
    ).toBe("Summary");
    expect(
      query<HTMLElement>(summary, '[data-testid="cart-subtotal"]').textContent,
    ).toBe("€59.97");
    expect(
      query<HTMLElement>(summary, '[data-testid="cart-shipping-cost"]')
        .textContent,
    ).toBe("€4.99");
    expect(
      query<HTMLElement>(summary, '[data-testid="cart-total"]').textContent,
    ).toBe("€64.96");
    expect(summary.textContent).toContain("ShippingStandard");
    expect(
      query<HTMLElement>(summary, '[data-testid="cart-shipping-estimate"]')
        .textContent,
    ).toContain("delivery to Germany");
    expect(summary.querySelector(PROMO_INPUT)).not.toBeNull();
    expect(summary.textContent).not.toContain(
      "Taxes & shipping estimated at checkout.",
    );
    expect(links(container)).toEqual([["Check out", "/checkout"]]);
    expect(container.textContent).not.toContain("Your cart is empty");
  });

  it("reads the cart again on open and reports the errors of that read", async () => {
    const current = { price: { positionPrice: 10 } } as Schemas["Cart"];
    const refreshWithResult = vi.fn<CartView["refreshWithResult"]>(
      async () => ({
        ok: true,
        cart: current,
        errors: [
          {
            messageKey: "payment-method-blocked",
            params: { name: "Invoice" },
            key: "payment-method-blocked-Invoice",
            level: 10,
          },
        ],
        newErrors: [],
      }),
    );
    const refresh = vi.fn<CartView["refresh"]>(async () => {});
    const { notify } = await setup(
      cartView({
        cart: current,
        lineItems: [lineItem()],
        refresh,
        refreshWithResult,
      }),
    );

    await vi.waitFor(() =>
      expect(notify).toHaveBeenCalledWith({
        type: "warning",
        message:
          "The payment method Invoice is blocked for your current shopping cart.",
      }),
    );
    expect(refreshWithResult).toHaveBeenCalledTimes(1);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("removes and changes line items through the cart", async () => {
    const removeItem = vi.fn<CartView["removeItem"]>(async () => ({
      ok: false,
      message: "Removal failed",
    }));
    const changeQuantity = vi.fn<CartView["changeQuantity"]>(async () => ({
      ok: true,
    }));
    const { container, notify } = await setup(
      cartView({ lineItems: [lineItem()], removeItem, changeQuantity }),
    );

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        'button[aria-label="Decrease quantity"]',
      ).click(),
    );
    expect(changeQuantity).toHaveBeenCalledWith("line-1", 1);
    expect(notify).not.toHaveBeenCalled();

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="checkout-product-tile-remove-button"]',
      ).click(),
    );
    expect(removeItem).toHaveBeenCalledWith("line-1");
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "Removal failed",
    });
  });

  it("keeps focus on the Remove button before a removed promotion and announces the removal", async () => {
    const { container, notify } = await setup(
      removableCart([lineItem(), promotionItem()]),
    );
    const remove = removeButton(container, "SUMMER");
    remove.focus();

    await interact(() => remove.click());

    await vi.waitFor(() =>
      expect(document.activeElement).toBe(removeButton(container, "product-1")),
    );
    expect(container.querySelector('[data-product-id="SUMMER"]')).toBeNull();
    expect(notify.mock.calls).toEqual([
      [
        {
          type: "success",
          message: "Promo code removed. Shopping cart updated.",
        },
      ],
    ]);
  });

  it("moves focus to the promo code field when no other line item can be removed", async () => {
    const { container } = await setup(
      removableCart([lineItem({ removable: false }), promotionItem()]),
    );
    const remove = removeButton(container, "SUMMER");
    remove.focus();

    await interact(() => remove.click());

    await vi.waitFor(() =>
      expect(document.activeElement).toBe(query(container, PROMO_INPUT)),
    );
  });

  it("keeps focus on the next Remove button and names the removed product", async () => {
    const { container, notify } = await setup(
      removableCart([
        lineItem(),
        lineItem({ id: "line-2", referencedId: "product-2", label: "Lamp" }),
      ]),
    );
    const remove = removeButton(container, "product-1");
    remove.focus();

    await interact(() => remove.click());

    await vi.waitFor(() =>
      expect(document.activeElement).toBe(removeButton(container, "product-2")),
    );
    expect(notify.mock.calls).toEqual([
      [
        {
          type: "success",
          message:
            '"Aerodynamic Bronze Brandix" has been removed from your shopping cart.',
        },
      ],
    ]);
  });

  it("shows the empty state for a cart with only a promotion", async () => {
    const { container } = await setup(
      cartView({
        lineItems: [lineItem({ type: "promotion", good: false })],
      }),
    );

    expect(container.textContent).toContain("Your cart is empty");
    expect(container.querySelector(TILE)).toBeNull();
  });
});

describe("CartPageContent in other locales", () => {
  it("speaks Polish and links to the Polish checkout", async () => {
    const { container } = await setup(
      cartView({ lineItems: [lineItem()], subtotal: 29.99 }),
      "pl-PL",
    );

    expect(query<HTMLElement>(container, "h1").textContent).toBe("Mój koszyk");
    expect(query<HTMLElement>(container, "h2").textContent).toBe(
      "Podsumowanie",
    );
    expect(container.textContent).toContain("Suma częściowa");
    expect(
      query<HTMLLabelElement>(
        container,
        'label[for="cart-promotion-code-input"]',
      ).textContent,
    ).toBe("Kod promocyjny");
    expect(links(container)).toEqual([["Przejdź do kasy", "/pl-PL/checkout"]]);
  });

  it("links the empty German cart to the German homepage", async () => {
    const { container } = await setup(cartView({ lineItems: [] }), "de-DE");

    expect(container.textContent).toContain("Ihr Warenkorb ist leer");
    expect(links(container)).toEqual([
      ["Mit dem Einkauf fortfahren", "/de-DE"],
    ]);
  });
});
