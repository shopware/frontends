import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { CartPageContent } from "./CartPageContent";
import { cartView, fakeCart, lineItem } from "./cartView.fixture";
import type { CartView } from "./cartView.fixture";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("./cartView.fixture")).useFakeCart,
}));

const TILE = '[data-testid="checkout-product-tile-item"]';
const SKELETON = '[data-testid="cart-page-skeleton"]';

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

  it("lists the line items with the subtotal and the checkout link", async () => {
    const { container } = await setup(
      cartView({
        cart: { price: { positionPrice: 59.97 } } as Schemas["Cart"],
        lineItems: [
          lineItem(),
          lineItem({ id: "line-2", referencedId: "product-2", label: "Lamp" }),
        ],
        subtotal: 59.97,
      }),
    );

    const list = query<HTMLElement>(container, "ul");
    const tiles = queryAll<HTMLElement>(list, `li > ${TILE}`);
    expect(tiles.map((tile) => tile.getAttribute("data-product-id"))).toEqual([
      "product-1",
      "product-2",
    ]);
    expect(tiles[0]?.className).toContain("w-full");

    expect(container.textContent).toContain("Subtotal€59.97");
    expect(container.textContent).toContain(
      "Taxes & shipping estimated at checkout.",
    );
    expect(links(container)).toEqual([["Check out", "/checkout"]]);
    expect(container.textContent).not.toContain("Your cart is empty");
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
    expect(container.textContent).toContain(
      "Podatki & koszty wysyłki będą obliczone przy płatności.",
    );
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
