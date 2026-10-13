import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import {
  cartView,
  fakeCart,
} from "@/features/cart/components/cartView.fixture";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import { ShopwareClientHarness } from "@/features/checkout/checkoutTestDoubles";
import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import {
  apiClientError,
  customer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import type { StorefrontSession } from "@/features/session/types";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { fakeWishlist, wishlistView } from "../wishlist.fixture";
import { WishlistPageContent } from "./WishlistPageContent";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("@/features/cart/components/cartView.fixture"))
    .useFakeCart,
}));

vi.mock("@/features/wishlist/useWishlist", async () => ({
  useWishlist: (await import("@/features/wishlist/wishlist.fixture"))
    .useFakeWishlist,
}));

const READ = "readCustomerWishlist post /customer/wishlist";
const PRODUCT_BOX = '[data-testid="wishlist-product-box"]';
const EMPTY = '[data-testid="wishlist-empty-container"]';
const REMOVE = '[data-testid="wishlist-product-box-toggle-button"]';
const ADD_TO_CART = '[data-testid="wishlist-add-to-cart-button"]';

type ReadParams = { body: { page: number; limit: number } };

function product(id: string, name: string): Schemas["Product"] {
  return {
    id,
    name,
    translated: { name },
    seoUrls: [{ seoPathInfo: `${name.replaceAll(" ", "-")}/${id}` }],
    cover: {
      media: { url: `https://cdn.test/${id}.jpg`, thumbnails: [] },
    },
    calculatedPrice: { totalPrice: 19.99 },
  } as unknown as Schemas["Product"];
}

const signedIn: StorefrontSession = toStorefrontSession(
  salesChannelContext(customer()),
);

const guest: StorefrontSession = toStorefrontSession(salesChannelContext(null));

const notFound = apiClientError(
  [{ code: "CHECKOUT__WISHLIST_NOT_FOUND", status: "404" }],
  404,
);

const backend: { products: Schemas["Product"][] } = { products: [] };

function wishlistAnswer(): FakeAnswer {
  return (_operation, params) => {
    const { page, limit } = (params as ReadParams).body;
    const offset = (page - 1) * limit;
    return {
      products: {
        elements: backend.products.slice(offset, offset + limit),
        total: backend.products.length,
      },
    };
  };
}

let mounted: Mounted | undefined;
const notify = vi.fn();
const remove = vi.fn();
const addProduct = vi.fn();
const refreshSession = vi.fn(async () => {});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  backend.products = [product("a", "Oak Chair"), product("b", "Birch Desk")];
  notify.mockReset();
  remove.mockReset();
  remove.mockImplementation(async (id: string) => {
    backend.products = backend.products.filter((item) => item.id !== id);
    return { ok: true, inWishlist: false };
  });
  refreshSession.mockClear();
  addProduct.mockReset();
  addProduct.mockResolvedValue({ ok: true, errors: [] });
  fakeWishlist.set(wishlistView({ remove }));
  fakeCart.set(cartView({ addProduct }));
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

async function setup(
  session: StorefrontSession,
  answer: FakeAnswer = wishlistAnswer(),
  locale: Locale = "en-GB",
) {
  const shopware = fakeClient(answer);
  mounted = await mount(
    withI18n(
      <ShopwareClientHarness client={shopware.client}>
        <SessionProvider session={session}>
          <SessionActionsProvider actions={{ refreshSession }}>
            <CmsActionsProvider actions={{ notify }}>
              <WishlistPageContent />
            </CmsActionsProvider>
          </SessionActionsProvider>
        </SessionProvider>
      </ShopwareClientHarness>,
      locale,
    ),
  );
  return { container: mounted.container, shopware };
}

function reads(shopware: ReturnType<typeof fakeClient>) {
  return shopware
    .calls(READ)
    .map(({ params }) => (params as ReadParams).body)
    .map(({ page, limit }) => ({ page, limit }));
}

describe("WishlistPageContent", () => {
  it("shows the header and placeholders while the session loads", async () => {
    const { container, shopware } = await setup(anonymousSession);

    expect(query(container, "h1").textContent).toBe("Wishlist");
    expect(query(container, '[aria-busy="true"]')).toBeTruthy();
    expect(queryAll(container, PRODUCT_BOX)).toHaveLength(0);
    expect(shopware.invocations).toHaveLength(0);
  });

  it("asks a guest to log in or register and comes back to the wishlist", async () => {
    const { container, shopware } = await setup(guest);

    expect(query(container, "h1").textContent).toBe("Your wishlist is empty");
    const links = queryAll<HTMLAnchorElement>(container, "a").map((link) => [
      link.textContent,
      link.getAttribute("href"),
    ]);
    expect(links).toEqual([
      ["Login", "/account/login?redirect=%2Fwishlist"],
      ["Register", "/account/login?redirect=%2Fwishlist#registration"],
      ["Continue shopping", "/"],
    ]);
    expect(queryAll(container, EMPTY)).toHaveLength(0);
    expect(shopware.invocations).toHaveLength(0);
  });

  it("keeps the locale prefix in the login links under the pl-PL provider", async () => {
    const { container } = await setup(guest, wishlistAnswer(), "pl-PL");

    expect(query<HTMLAnchorElement>(container, "a").getAttribute("href")).toBe(
      "/pl-PL/account/login?redirect=%2Fpl-PL%2Fwishlist",
    );
    expect(query(container, "a").textContent).toBe("Zaloguj się");
  });

  it("lists the products of the first page with links, price and actions", async () => {
    const { container, shopware } = await setup(signedIn);

    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2),
    );
    expect(reads(shopware)).toEqual([{ page: 1, limit: 15 }]);
    const [first] = queryAll<HTMLElement>(container, PRODUCT_BOX);
    const links = queryAll<HTMLAnchorElement>(first as HTMLElement, "a");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/Oak-Chair/a",
      "/Oak-Chair/a",
    ]);
    expect(links[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(links[0]?.getAttribute("tabindex")).toBe("-1");
    expect(links[1]?.textContent).toBe("Oak Chair");
    expect(first?.textContent).toContain("19.99");
    expect(query(first as HTMLElement, REMOVE).getAttribute("aria-label")).toBe(
      "Remove from wishlist",
    );
    expect(query(first as HTMLElement, ADD_TO_CART).textContent).toBe(
      "Add to cart",
    );
  });

  it("shows the empty state to a customer who never had a wishlist", async () => {
    const { container } = await setup(signedIn, () => {
      throw notFound;
    });

    await vi.waitFor(() => expect(queryAll(container, EMPTY)).toHaveLength(1));
    const empty = query(container, EMPTY);
    expect(empty.textContent).toContain("Your wishlist is empty");
    expect(query<HTMLAnchorElement>(empty, "a").getAttribute("href")).toBe("/");
    expect(queryAll(container, '[role="alert"]')).toHaveLength(0);
  });

  it("removes a product, reads the page again and ends on the empty state", async () => {
    const { container, shopware } = await setup(signedIn);
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2),
    );

    await interact(() => query<HTMLButtonElement>(container, REMOVE).click());
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(1),
    );
    await interact(() => query<HTMLButtonElement>(container, REMOVE).click());
    await vi.waitFor(() => expect(queryAll(container, EMPTY)).toHaveLength(1));

    expect(remove.mock.calls).toEqual([["a"], ["b"]]);
    expect(reads(shopware)).toHaveLength(3);
    expect(queryAll(container, PRODUCT_BOX)).toHaveLength(0);
  });

  it("keeps the product and reports a failed removal", async () => {
    remove.mockResolvedValue({
      ok: false,
      inWishlist: true,
      message: "Wishlist is not activated!",
    });
    const { container, shopware } = await setup(signedIn);
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2),
    );

    await interact(() => query<HTMLButtonElement>(container, REMOVE).click());

    await vi.waitFor(() =>
      expect(notify).toHaveBeenCalledWith({
        type: "error",
        message: "Wishlist is not activated!",
      }),
    );
    expect(reads(shopware)).toHaveLength(1);
    expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2);
  });

  it("adds a product to the cart and offers the cart link", async () => {
    const { container } = await setup(signedIn);
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2),
    );

    await interact(() =>
      query<HTMLButtonElement>(container, ADD_TO_CART).click(),
    );

    await vi.waitFor(() =>
      expect(notify).toHaveBeenCalledWith({
        type: "success",
        message: "Products have been added to the cart.",
        action: { label: "View cart", href: "/checkout/cart" },
      }),
    );
    expect(addProduct).toHaveBeenCalledWith({ id: "a" });
    expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2);
  });

  it("reports cart errors instead of the success message", async () => {
    addProduct.mockResolvedValue({
      ok: true,
      errors: [
        {
          messageKey: "product-stock-reached",
          params: { name: "Oak Chair", quantity: 1 },
        },
      ],
    });
    const { container } = await setup(signedIn);
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2),
    );

    await interact(() =>
      query<HTMLButtonElement>(container, ADD_TO_CART).click(),
    );

    await vi.waitFor(() => expect(notify).toHaveBeenCalledTimes(1));
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "The product Oak Chair is only available 1 times",
    });
  });

  it("offers a retry when the wishlist cannot be read", async () => {
    let calls = 0;
    const { container, shopware } = await setup(signedIn, (...args) => {
      calls += 1;
      if (calls === 1) throw new Error("offline");
      return wishlistAnswer()(...args);
    });
    await vi.waitFor(() =>
      expect(query(container, '[role="alert"]').textContent).toContain(
        "Something went wrong while loading results.",
      ),
    );

    await interact(() =>
      query<HTMLButtonElement>(container, '[role="alert"] button').click(),
    );

    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2),
    );
    expect(reads(shopware)).toHaveLength(2);
  });

  it("announces a removal and moves focus to the page heading", async () => {
    const { container } = await setup(signedIn);
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2),
    );
    const removeButton = query<HTMLButtonElement>(container, REMOVE);
    removeButton.focus();

    await interact(() => removeButton.click());
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(1),
    );

    expect(notify).toHaveBeenCalledWith({
      type: "success",
      message: "Oak Chair has been removed from wishlist.",
    });
    expect(document.activeElement).toBe(query(container, "h1"));
    expect(document.activeElement?.textContent).toBe("Wishlist");
  });

  it("moves focus to the empty state heading after the last removal", async () => {
    backend.products = [product("a", "Oak Chair")];
    const { container } = await setup(signedIn);
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(1),
    );

    await interact(() => query<HTMLButtonElement>(container, REMOVE).click());
    await vi.waitFor(() => expect(queryAll(container, EMPTY)).toHaveLength(1));

    expect(document.activeElement?.textContent).toBe("Your wishlist is empty");
  });

  it("ignores repeated clicks while a removal or an add to cart runs", async () => {
    const removal = deferred<{ ok: boolean; inWishlist: boolean }>();
    const adding = deferred<{ ok: boolean; errors: never[] }>();
    remove.mockImplementation(() => removal.promise);
    addProduct.mockImplementation(() => adding.promise);
    const { container } = await setup(signedIn);
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2),
    );
    const removeButton = query<HTMLButtonElement>(container, REMOVE);
    const addButton = query<HTMLButtonElement>(container, ADD_TO_CART);

    await interact(() => {
      removeButton.click();
      removeButton.click();
      addButton.click();
      addButton.click();
    });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(addProduct).toHaveBeenCalledTimes(1);
    for (const button of [removeButton, addButton]) {
      expect(button.getAttribute("aria-disabled")).toBe("true");
      expect(button.getAttribute("aria-busy")).toBe("true");
      expect(button.disabled).toBe(false);
    }

    await interact(() => {
      removal.resolve({ ok: false, inWishlist: true });
      adding.resolve({ ok: true, errors: [] });
    });

    for (const button of [removeButton, addButton]) {
      expect(button.hasAttribute("aria-disabled")).toBe(false);
      expect(button.hasAttribute("aria-busy")).toBe(false);
    }
  });

  it("names every tile action after its product and lists the tiles", async () => {
    const { container } = await setup(signedIn);
    await vi.waitFor(() =>
      expect(queryAll(container, PRODUCT_BOX)).toHaveLength(2),
    );
    const [first] = queryAll<HTMLElement>(container, PRODUCT_BOX);
    const tile = first as HTMLElement;
    const nameId = query(tile, "a:not([aria-hidden])").getAttribute("id");

    expect(tile.tagName).toBe("LI");
    expect(tile.parentElement?.tagName).toBe("UL");
    expect(nameId).toBeTruthy();
    expect(query(tile, REMOVE).getAttribute("aria-describedby")).toBe(nameId);
    expect(query(tile, ADD_TO_CART).getAttribute("aria-describedby")).toBe(
      nameId,
    );
  });

  it("re-reads the session when the backend says the customer is no longer logged in", async () => {
    const loggedOut = apiClientError(
      [{ code: "FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN", status: "403" }],
      403,
    );
    const { container } = await setup(signedIn, () => {
      throw loggedOut;
    });

    await vi.waitFor(() =>
      expect(queryAll(container, '[role="alert"]')).toHaveLength(1),
    );
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });
});
