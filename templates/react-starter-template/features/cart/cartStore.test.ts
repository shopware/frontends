import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { anonymousSession } from "@/features/session/anonymousSession";
import { errorMessages } from "@/features/session/errorMessages";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import {
  apiClientError,
  customer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import {
  toStorefrontSession,
  unavailableSession,
} from "@/features/session/sessionFromContext";

import { cart, cartError, cartPrice, lineItem } from "./cart.fixture";
import {
  cartSessionKey,
  createCartStore,
  loadingCart,
  summarizeCart,
} from "./cartStore";
import type { CartClient } from "./cartStore";

const READ_CART = "readCart get /checkout/cart";
const ADD_LINE_ITEM = "addLineItem post /checkout/cart/line-item";
const UPDATE_LINE_ITEM = "updateLineItem patch /checkout/cart/line-item";
const REMOVE_LINE_ITEM = "removeLineItem post /checkout/cart/line-item/delete";
const READ_CART_PARAMS = { fetchOptions: { timeout: READ_TIMEOUT_MS } };
const DEFAULT_MESSAGE = errorMessages.errors["message-default"];

type Invocation = { operation: string; params: unknown };
type Answer = (operation: string) => Promise<Schemas["Cart"]> | Schemas["Cart"];

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((settle, fail) => {
    resolve = settle;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function setup(answer: Answer = () => cart()) {
  const invocations: Invocation[] = [];
  const client = {
    invoke: async (operation: string, params?: unknown) => {
      invocations.push({ operation, params });
      return { data: await answer(operation), status: 200 };
    },
  } as unknown as CartClient;
  const getClient = vi.fn(async () => client);
  const store = createCartStore(getClient);
  return { store, invocations, getClient };
}

function readySession(
  currentCustomer: Schemas["Customer"] | null = null,
  token?: string,
) {
  return toStorefrontSession(salesChannelContext(currentCustomer, token));
}

function operations(invocations: Invocation[]): string[] {
  return invocations.map(({ operation }) => operation);
}

async function flush(): Promise<void> {
  await new Promise((settle) => setTimeout(settle, 0));
}

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createCartStore session sync", () => {
  it("does not read the cart while the session is loading", async () => {
    const { store, invocations, getClient } = setup();

    store.syncSession(anonymousSession);
    await flush();

    expect(invocations).toEqual([]);
    expect(getClient).not.toHaveBeenCalled();
    expect(store.getSnapshot()).toBe(loadingCart);
  });

  it("reads the cart once after the first context read", async () => {
    const current = cart({ lineItems: [lineItem()] });
    const { store, invocations } = setup(() => current);

    store.syncSession(readySession());
    store.syncSession(readySession());
    await vi.waitFor(() => expect(store.getSnapshot().status).toBe("ready"));
    await flush();

    expect(invocations).toEqual([
      { operation: READ_CART, params: READ_CART_PARAMS },
    ]);
    expect(store.getSnapshot()).toEqual({ status: "ready", cart: current });
  });

  it("reads the cart after the first context read failed", async () => {
    const { store, invocations } = setup();

    store.syncSession(unavailableSession);
    await vi.waitFor(() => expect(store.getSnapshot().status).toBe("ready"));

    expect(operations(invocations)).toEqual([READ_CART]);
  });

  it.each([
    ["a login", readySession(customer(), "customer-token")],
    ["a guest registration", readySession(customer({ guest: true }))],
    ["a new context token after an order", readySession(null, "order-token")],
  ])("reads the cart again after %s", async (_, next) => {
    const { store, invocations } = setup();
    store.syncSession(readySession());
    await vi.waitFor(() => expect(invocations).toHaveLength(1));

    store.syncSession(next);

    await vi.waitFor(() => expect(invocations).toHaveLength(2));
    expect(operations(invocations)).toEqual([READ_CART, READ_CART]);
  });

  it("reads the cart again after a logout", async () => {
    const { store, invocations } = setup();
    store.syncSession(readySession(customer(), "customer-token"));
    await vi.waitFor(() => expect(invocations).toHaveLength(1));

    store.syncSession(readySession(null, "anonymous-token"));

    await vi.waitFor(() => expect(invocations).toHaveLength(2));
  });

  it("does not read again for a session that keeps customer, guest flag and token", async () => {
    const { store, invocations } = setup();
    store.syncSession(readySession(customer()));
    await vi.waitFor(() => expect(invocations).toHaveLength(1));

    store.syncSession(readySession(customer({ firstName: "Janet" })));
    store.syncSession({
      ...readySession(customer()),
      wishlistCount: 3,
    });
    await flush();

    expect(invocations).toHaveLength(1);
  });
});

describe("createCartStore mutations", () => {
  it("adds a product with its id as referenced id and stores the returned cart", async () => {
    const updated = cart({ lineItems: [lineItem({ quantity: 2 })] });
    const { store, invocations } = setup(() => updated);

    await expect(
      store.addProduct({ id: "product-1", quantity: 2 }),
    ).resolves.toEqual({ ok: true, errors: [] });

    expect(invocations).toEqual([
      {
        operation: ADD_LINE_ITEM,
        params: {
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
        },
      },
    ]);
    expect(store.getSnapshot()).toEqual({ status: "ready", cart: updated });
  });

  it("adds one piece when no quantity is given", async () => {
    const { store, invocations } = setup();

    await store.addProduct({ id: "product-2" });

    expect(invocations[0]?.params).toEqual({
      body: {
        items: [
          {
            id: "product-2",
            referencedId: "product-2",
            quantity: 1,
            type: "product",
          },
        ],
      },
    });
  });

  it("removes a line item by id", async () => {
    const emptied = cart();
    const { store, invocations } = setup(() => emptied);

    await expect(store.removeItem("line-item-1")).resolves.toEqual({
      ok: true,
      errors: [],
    });

    expect(invocations).toEqual([
      {
        operation: REMOVE_LINE_ITEM,
        params: { body: { ids: ["line-item-1"] } },
      },
    ]);
    expect(store.getSnapshot().cart).toBe(emptied);
  });

  it("changes the quantity of a line item", async () => {
    const changed = cart({ lineItems: [lineItem({ quantity: 3 })] });
    const { store, invocations } = setup(() => changed);

    await expect(store.changeQuantity("line-item-1", 3)).resolves.toEqual({
      ok: true,
      errors: [],
    });

    expect(invocations).toEqual([
      {
        operation: UPDATE_LINE_ITEM,
        params: { body: { items: [{ id: "line-item-1", quantity: 3 }] } },
      },
    ]);
    expect(store.getSnapshot().cart).toBe(changed);
  });

  it("returns the mapped errors of the returned cart", async () => {
    const stock = cartError("product-stock-reached", "product-1");
    const added = cartError("promotion-discount-added", "-SUMMER");
    const { store } = setup(() =>
      cart({
        lineItems: [
          lineItem({ label: "Bag", quantityInformation: { maxPurchase: 4 } }),
        ],
        errors: { [stock.key]: stock, [added.key]: added },
      }),
    );

    await expect(store.addProduct({ id: "product-1" })).resolves.toEqual({
      ok: true,
      errors: [
        {
          messageKey: "product-stock-reached",
          params: { name: "Bag", quantity: 4 },
        },
      ],
    });
  });
});

describe("createCartStore failures", () => {
  it("resolves the first API error message and keeps the cart", async () => {
    const current = cart({ lineItems: [lineItem()] });
    let failing = false;
    const { store } = setup((operation) => {
      if (failing && operation === UPDATE_LINE_ITEM) {
        throw apiClientError([
          {
            code: "CHECKOUT__CART_INVALID_LINE_ITEM_QUANTITY",
            meta: { parameters: { quantity: "0" } },
          },
          { code: "product-not-found" },
        ]);
      }
      return current;
    });
    store.syncSession(readySession());
    await vi.waitFor(() => expect(store.getSnapshot().status).toBe("ready"));
    failing = true;

    await expect(store.changeQuantity("product-1", 0)).resolves.toEqual({
      ok: false,
      message: "The quantity must be a positive integer. Given: 0",
    });
    expect(store.getSnapshot()).toEqual({ status: "ready", cart: current });
  });

  it.each([
    ["a network error", () => new TypeError("Failed to fetch")],
    ["an API error without details", () => apiClientError([], 500)],
  ])("resolves the default message for %s", async (_, failure) => {
    const { store } = setup(() => {
      throw failure();
    });

    await expect(store.addProduct({ id: "product-1" })).resolves.toEqual({
      ok: false,
      message: DEFAULT_MESSAGE,
    });
    await expect(store.removeItem("product-1")).resolves.toEqual({
      ok: false,
      message: DEFAULT_MESSAGE,
    });
    expect(store.getSnapshot()).toBe(loadingCart);
  });

  it("resolves the default message when the client cannot be created", async () => {
    const store = createCartStore(async () => {
      throw new Error("config down");
    });

    await expect(store.addProduct({ id: "product-1" })).resolves.toEqual({
      ok: false,
      message: DEFAULT_MESSAGE,
    });
    await expect(store.refresh()).resolves.toBeUndefined();
    expect(store.getSnapshot()).toEqual({ status: "error", cart: null });
  });

  it("marks a failed read as an error, keeps the last cart and recovers", async () => {
    const current = cart({ lineItems: [lineItem()] });
    const recovered = cart();
    const answers: (() => Schemas["Cart"])[] = [
      () => current,
      () => {
        throw new TypeError("Failed to fetch");
      },
      () => recovered,
    ];
    const { store } = setup(() => {
      const next = answers.shift();
      if (!next) throw new Error("Unexpected read");
      return next();
    });

    await store.refresh();
    await expect(store.refresh()).resolves.toBeUndefined();

    expect(store.getSnapshot()).toEqual({ status: "error", cart: current });
    expect(consoleError).toHaveBeenCalledTimes(1);

    await store.refresh();

    expect(store.getSnapshot()).toEqual({ status: "ready", cart: recovered });
  });
});

describe("createCartStore ordering", () => {
  it("sends a mutation only after the read in flight answered, so its cart wins", async () => {
    const pendingRead = deferred<Schemas["Cart"]>();
    const added = cart({ lineItems: [lineItem()] });
    const { store, invocations } = setup((operation) =>
      operation === READ_CART ? pendingRead.promise : added,
    );

    store.syncSession(readySession());
    const result = store.addProduct({ id: "product-1" });
    await vi.waitFor(() => expect(invocations).toHaveLength(1));
    await flush();
    expect(operations(invocations)).toEqual([READ_CART]);

    pendingRead.resolve(cart());
    await expect(result).resolves.toMatchObject({ ok: true });

    expect(operations(invocations)).toEqual([READ_CART, ADD_LINE_ITEM]);
    expect(store.getSnapshot().cart).toBe(added);
  });

  it("reads after the mutations that were requested before the read", async () => {
    const pendingAdd = deferred<Schemas["Cart"]>();
    const afterRemove = cart();
    const { store, invocations } = setup((operation) => {
      if (operation === ADD_LINE_ITEM) return pendingAdd.promise;
      return afterRemove;
    });

    const added = store.addProduct({ id: "product-1" });
    const removed = store.removeItem("product-1");
    const refreshed = store.refresh();
    await vi.waitFor(() => expect(invocations).toHaveLength(1));

    pendingAdd.resolve(cart({ lineItems: [lineItem()] }));
    await Promise.all([added, removed, refreshed]);

    expect(operations(invocations)).toEqual([
      ADD_LINE_ITEM,
      REMOVE_LINE_ITEM,
      READ_CART,
    ]);
    expect(store.getSnapshot().cart).toBe(afterRemove);
  });

  it("keeps processing after a failed operation", async () => {
    const recovered = cart({ lineItems: [lineItem({ quantity: 5 })] });
    const { store, invocations } = setup((operation) => {
      if (operation === ADD_LINE_ITEM) throw new TypeError("Failed to fetch");
      return recovered;
    });

    const failed = store.addProduct({ id: "product-1" });
    const changed = store.changeQuantity("product-1", 5);

    await expect(failed).resolves.toMatchObject({ ok: false });
    await expect(changed).resolves.toEqual({ ok: true, errors: [] });
    expect(operations(invocations)).toEqual([ADD_LINE_ITEM, UPDATE_LINE_ITEM]);
    expect(store.getSnapshot().cart).toBe(recovered);
  });

  it("joins reads that are still queued behind the same operation", async () => {
    const pendingAdd = deferred<Schemas["Cart"]>();
    const { store, invocations } = setup((operation) =>
      operation === ADD_LINE_ITEM ? pendingAdd.promise : cart(),
    );

    const added = store.addProduct({ id: "product-1" });
    const first = store.refresh();
    const second = store.refresh();
    await vi.waitFor(() => expect(invocations).toHaveLength(1));

    expect(second).toBe(first);
    pendingAdd.resolve(cart());
    await Promise.all([added, first]);

    expect(operations(invocations)).toEqual([ADD_LINE_ITEM, READ_CART]);
  });

  it("queues a new read when a mutation was requested after the queued one", async () => {
    const pendingAdd = deferred<Schemas["Cart"]>();
    const { store, invocations } = setup((operation) =>
      operation === ADD_LINE_ITEM ? pendingAdd.promise : cart(),
    );

    const added = store.addProduct({ id: "product-1" });
    const first = store.refresh();
    const removed = store.removeItem("product-1");
    const second = store.refresh();

    expect(second).not.toBe(first);
    pendingAdd.resolve(cart());
    await Promise.all([added, first, removed, second]);

    expect(operations(invocations)).toEqual([
      ADD_LINE_ITEM,
      READ_CART,
      REMOVE_LINE_ITEM,
      READ_CART,
    ]);
  });

  it("reads again when asked while a read is already running", async () => {
    const pendingRead = deferred<Schemas["Cart"]>();
    let reads = 0;
    const { store, invocations } = setup(() => {
      reads += 1;
      return reads === 1 ? pendingRead.promise : cart();
    });

    const first = store.refresh();
    await vi.waitFor(() => expect(invocations).toHaveLength(1));
    const second = store.refresh();

    expect(second).not.toBe(first);
    pendingRead.resolve(cart());
    await Promise.all([first, second]);

    expect(operations(invocations)).toEqual([READ_CART, READ_CART]);
  });
});

describe("createCartStore subscriptions", () => {
  it("notifies subscribers until they unsubscribe", async () => {
    const { store } = setup();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    await store.refresh();
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    await store.addProduct({ id: "product-1" });

    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("summarizeCart", () => {
  it("derives the totals like the Vue useCart", () => {
    const delivery = {
      shippingCosts: { totalPrice: 4.99 },
    } as Schemas["CartDelivery"];
    const summary = summarizeCart(
      cart({
        lineItems: [
          lineItem({ id: "a", quantity: 2 }),
          lineItem({ id: "b", quantity: 3 }),
          lineItem({ id: "promotion", type: "promotion", good: false }),
          lineItem({ id: "c", quantity: undefined }),
        ],
        deliveries: [delivery],
        price: cartPrice(100, 104.99),
      }),
    );

    expect(summary).toMatchObject({
      count: 5,
      isEmpty: false,
      subtotal: 100,
      totalPrice: 104.99,
      shippingCosts: [delivery],
    });
    expect(summary.lineItems).toHaveLength(4);
  });

  it("is empty for a missing cart or a cart without goods", () => {
    expect(summarizeCart(null)).toEqual({
      lineItems: [],
      count: 0,
      isEmpty: true,
      subtotal: 0,
      totalPrice: 0,
      shippingCosts: [],
    });
    expect(
      summarizeCart(
        cart({ lineItems: [lineItem({ type: "promotion", good: false })] }),
      ),
    ).toMatchObject({ count: 0, isEmpty: true });
  });
});

describe("cartSessionKey", () => {
  it("has no key while the session is loading", () => {
    expect(cartSessionKey(anonymousSession)).toBeNull();
  });

  it("changes with the customer, the guest flag and the context token only", () => {
    const anonymous = cartSessionKey(readySession());

    expect(cartSessionKey(readySession())).toBe(anonymous);
    expect(cartSessionKey(unavailableSession)).not.toBe(anonymous);
    expect(cartSessionKey(readySession(null, "other-token"))).not.toBe(
      anonymous,
    );
    expect(cartSessionKey(readySession(customer()))).not.toBe(anonymous);
    expect(cartSessionKey(readySession(customer({ guest: true })))).not.toBe(
      cartSessionKey(readySession(customer())),
    );
  });
});
