import { afterEach, describe, expect, it, vi } from "vitest";
import { computed, effectScope, ref } from "vue";
import type { EffectScope } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import type { RouteLocationRaw } from "vue-router";

import type { Schemas } from "#shopware";

import { LISTING_INCLUDES } from "./answers";
import { createWebMcpHandlers } from "./handlers";
import type { WebMcpPage } from "./handlers";

const ID = "019e6ec6e53f72edb6472e71f78cf831";
const PRODUCT = {
  id: ID,
  translated: { name: "Wooden iPlug", description: "<p>Hand made.</p>" },
  calculatedPrice: { unitPrice: 98.09 },
  available: true,
};
const LISTING = { elements: [PRODUCT], total: 1, sorting: "name-asc" };
const STOCK = {
  "product-stock-reached": {
    messageKey: "product-stock-reached",
    message: "Only 1 left.",
  },
};

function line(quantity = 1) {
  return {
    id: "line-1",
    type: "product",
    referencedId: ID,
    label: "Wooden iPlug",
    quantity,
    price: { unitPrice: 98.09, totalPrice: 98.09 * quantity },
  };
}

function cartOf(lineItems: object[], errors = {}) {
  return { lineItems, errors } as unknown as Schemas["Cart"];
}

/** A promise the test settles by hand. */
function gate<T>() {
  let open = (_value: T) => {};
  const closed = new Promise<T>((resolve) => {
    open = resolve;
  });
  return { closed, open };
}

const running = () => new AbortController().signal;
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const now = () => performance.now();
/** Lets the clock move on, so a navigation comes after the call. */
const later = () => new Promise((resolve) => setTimeout(resolve, 2));

const scopes: EffectScope[] = [];
afterEach(() => {
  for (const scope of scopes.splice(0)) scope.stop();
  vi.unstubAllGlobals();
});

/** A page with a real router and a cart kept in memory. */
async function shop(stored?: Schemas["Cart"]) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:path(.*)*", component: {} }],
  });
  await router.push("/");
  const cart = ref(stored);
  const keep = (next: Schemas["Cart"]) => {
    cart.value = next;
    return next;
  };
  const page = {
    apiClient: { invoke: vi.fn() },
    invokeRead: vi.fn(),
    cart: {
      cart,
      cartItems: computed(() => cart.value?.lineItems ?? []),
      isEmpty: computed(() => !cart.value?.lineItems?.length),
      subtotal: computed(() => 0),
      totalPrice: computed(() => 0),
      refreshCart: vi.fn(async () => keep(cart.value ?? cartOf([]))),
      addProduct: vi.fn(async () => keep(cartOf([line()]))),
      changeProductQuantity: vi.fn(async ({ quantity }: { quantity: number }) =>
        keep(cartOf([line(quantity)])),
      ),
      removeItemById: vi.fn(async () => keep(cartOf([]))),
      consumeCartErrors: vi.fn(),
    },
    currency: ref({ isoCode: "EUR" }),
    navigation: {
      navigationElements: ref([
        { id: "c1", type: "page", translated: { name: "Candles" } },
      ]),
      loadNavigationElements: vi.fn(async () => {}),
    },
    resolvePath: vi.fn(async () => null),
    notifications: { pushSuccess: vi.fn(), pushWarning: vi.fn() },
    i18n: {
      t: (key: string) => `t(${key})`,
      te: (key: string) => key.startsWith("errors."),
      locale: ref("en-GB"),
    },
    localePath: (path: string) => path,
    router,
    navigate: (to: RouteLocationRaw) => router.push(to),
    nextPage: async () => {},
  };
  const scope = effectScope();
  scopes.push(scope);
  const created = scope.run(() =>
    createWebMcpHandlers(page as unknown as WebMcpPage),
  );
  if (!created) throw new Error("The scope is not active.");
  return { page, cart, keep, router, handlers: created.handlers };
}

describe("add_to_cart", () => {
  it("waits for the page's first cart read before it writes", async () => {
    const { page, cart, handlers } = await shop();
    const answer = handlers.add_to_cart({ productId: ID }, running());
    await settle();
    expect(page.cart.addProduct).not.toHaveBeenCalled();

    cart.value = cartOf([]);
    await answer;
    expect(page.cart.addProduct).toHaveBeenCalledWith({ id: ID, quantity: 1 });
    expect(page.cart.refreshCart).not.toHaveBeenCalled();
  });

  it("confirms a clean add with the shop's own message", async () => {
    const { page, handlers } = await shop(cartOf([]));
    const answer = await handlers.add_to_cart({ productId: ID }, running());
    expect(answer).toMatchObject({ items: [{ productId: ID }], warnings: [] });
    expect(page.notifications.pushSuccess).toHaveBeenCalledWith(
      "Wooden iPlug t(product.addedToCart)",
      expect.anything(),
    );
  });

  it("tells the shopper and the agent about the cart's problems", async () => {
    const { page, keep, handlers } = await shop(cartOf([]));
    page.cart.addProduct.mockImplementationOnce(async () =>
      keep(cartOf([line()], STOCK)),
    );
    const answer = await handlers.add_to_cart({ productId: ID }, running());
    expect(answer.warnings).toEqual(["t(errors.product-stock-reached)"]);
    expect(page.notifications.pushWarning).toHaveBeenCalledWith(
      "t(errors.product-stock-reached)",
    );
    expect(page.notifications.pushSuccess).not.toHaveBeenCalled();
    expect(page.cart.consumeCartErrors).toHaveBeenCalled();
  });

  it("says why when the product did not land in the cart", async () => {
    const { page, keep, handlers } = await shop(cartOf([]));
    page.cart.addProduct.mockImplementationOnce(async () => keep(cartOf([])));
    await expect(
      handlers.add_to_cart({ productId: ID }, running()),
    ).rejects.toThrow("If it has variants");
  });

  it("never writes for a call that was stopped while it waited", async () => {
    const { page, cart, handlers } = await shop();
    const controller = new AbortController();
    const answer = handlers.add_to_cart({ productId: ID }, controller.signal);
    controller.abort(new Error("cancelled"));
    await expect(answer).rejects.toThrow("cancelled");

    cart.value = cartOf([]);
    await settle();
    expect(page.cart.addProduct).not.toHaveBeenCalled();
  });

  it("shows nothing more when the call stops during the write", async () => {
    const { page, keep, handlers } = await shop(cartOf([]));
    const controller = new AbortController();
    page.cart.addProduct.mockImplementationOnce(async () => {
      controller.abort();
      return keep(cartOf([line()], STOCK));
    });
    const answer = await handlers.add_to_cart(
      { productId: ID },
      controller.signal,
    );
    expect(answer.items).toHaveLength(1);
    expect(page.notifications.pushWarning).not.toHaveBeenCalled();
    expect(page.notifications.pushSuccess).not.toHaveBeenCalled();
  });
});

describe("update_cart_item", () => {
  it("changes the quantity, and 0 removes the item", async () => {
    const { page, handlers } = await shop(cartOf([line(2)]));
    await handlers.update_cart_item({ productId: ID, quantity: 3 }, running());
    expect(page.cart.changeProductQuantity).toHaveBeenCalledWith({
      id: "line-1",
      quantity: 3,
    });

    await handlers.update_cart_item({ productId: ID, quantity: 0 }, running());
    expect(page.cart.removeItemById).toHaveBeenCalledWith("line-1");
  });

  it("refuses a product that is not in the cart", async () => {
    const { page, handlers } = await shop(cartOf([]));
    await expect(
      handlers.update_cart_item({ productId: ID, quantity: 1 }, running()),
    ).rejects.toThrow("not in the cart");
    expect(page.cart.changeProductQuantity).not.toHaveBeenCalled();
  });
});

describe("go_to_checkout", () => {
  it("opens checkout", async () => {
    const { router, handlers } = await shop(cartOf([line()]));
    expect(await handlers.go_to_checkout({}, running(), now())).toEqual({
      url: "/checkout",
    });
    expect(router.currentRoute.value.path).toBe("/checkout");
  });

  it("refuses an empty cart", async () => {
    const { handlers } = await shop(cartOf([]));
    await expect(handlers.go_to_checkout({}, running(), now())).rejects.toThrow(
      "empty",
    );
  });

  it("keeps a shopper who opened another page meanwhile", async () => {
    const { cart, router, handlers } = await shop();
    const answer = handlers.go_to_checkout({}, running(), now());
    await later();
    await router.push("/wooden-iplug");
    cart.value = cartOf([line()]);
    await expect(answer).rejects.toThrow("opened another page");
    expect(router.currentRoute.value.path).toBe("/wooden-iplug");
  });
});

describe("search_products and browse_category", () => {
  it("open the list with the same filters and order, asking only for the listed fields", async () => {
    const { page, router, handlers } = await shop();
    page.apiClient.invoke.mockResolvedValueOnce({ data: LISTING });
    const signal = running();
    const answer = await handlers.search_products(
      { query: "iplug", maxPrice: 100 },
      signal,
      now(),
    );
    expect(page.apiClient.invoke).toHaveBeenCalledWith(
      "searchPage post /search",
      {
        body: expect.objectContaining({
          search: "iplug",
          limit: 10,
          "max-price": 100,
          includes: LISTING_INCLUDES,
        }),
        fetchOptions: { signal },
      },
    );
    expect(router.currentRoute.value.path).toBe("/search");
    expect(router.currentRoute.value.query).toEqual({
      search: "iplug",
      "max-price": "100",
      order: "name-asc",
    });
    expect(answer).not.toHaveProperty("hint");
  });

  it("do not move a shopper who opened another page while the list loaded", async () => {
    const { page, router, handlers } = await shop();
    const read = gate<{ data: typeof LISTING }>();
    page.apiClient.invoke.mockReturnValueOnce(read.closed);
    const answer = handlers.search_products(
      { query: "iplug" },
      running(),
      now(),
    );
    await later();
    await router.push("/wooden-iplug");
    read.open({ data: LISTING });
    expect((await answer).hint).toContain("not on screen");
    expect(router.currentRoute.value.path).toBe("/wooden-iplug");
  });

  it("do not move a shopper who opened another page while the call waited in the queue", async () => {
    const { page, router, handlers } = await shop();
    page.apiClient.invoke.mockResolvedValueOnce({ data: LISTING });
    const madeAt = now();
    await later();
    await router.push("/wooden-iplug");
    const answer = await handlers.search_products(
      { query: "iplug" },
      running(),
      madeAt,
    );
    expect(answer.hint).toContain("not on screen");
    expect(router.currentRoute.value.path).toBe("/wooden-iplug");
  });

  it("do not count a list that an earlier call opened as the shopper's page", async () => {
    const { page, router, handlers } = await shop();
    page.apiClient.invoke.mockResolvedValue({ data: LISTING });
    const madeAt = now();
    await later();
    await handlers.search_products({ query: "iplug" }, running(), now());
    await handlers.browse_category({ category: "candles" }, running(), madeAt);
    expect(router.currentRoute.value.path).toBe("/navigation/c1");
  });

  it("open a menu category by its name", async () => {
    const { page, router, handlers } = await shop();
    page.apiClient.invoke.mockResolvedValueOnce({ data: LISTING });
    await handlers.browse_category({ category: "candles" }, running(), now());
    expect(page.apiClient.invoke).toHaveBeenCalledWith(
      "readProductListing post /product-listing/{categoryId}",
      expect.objectContaining({ pathParams: { categoryId: "c1" } }),
    );
    expect(router.currentRoute.value.path).toBe("/navigation/c1");
  });
});

describe("reads stop with the call", () => {
  it("get_product passes the stop signal to the product read", async () => {
    vi.stubGlobal(
      "DOMParser",
      class {
        parseFromString(markup: string) {
          return { body: { textContent: markup.replace(/<[^>]+>/g, "") } };
        }
      },
    );
    const { page, handlers } = await shop();
    page.invokeRead.mockResolvedValueOnce({ data: { product: PRODUCT } });
    const signal = running();
    const answer = await handlers.get_product({ productId: ID }, signal);
    expect(page.invokeRead).toHaveBeenCalledWith(
      "readProductDetail post /product/{productId}",
      expect.objectContaining({
        pathParams: { productId: ID },
        fetchOptions: { signal },
      }),
    );
    expect(answer).toMatchObject({ productId: ID, description: "Hand made." });
  });

  it("get_cart stops waiting for a slow cart read when the call is cancelled", async () => {
    const { page, handlers } = await shop(cartOf([]));
    page.cart.refreshCart.mockReturnValueOnce(gate<Schemas["Cart"]>().closed);
    const controller = new AbortController();
    const answer = handlers.get_cart({}, controller.signal);
    await vi.waitFor(() => expect(page.cart.refreshCart).toHaveBeenCalled());
    controller.abort(new Error("cancelled"));
    await expect(answer).rejects.toThrow("cancelled");
  });
});
