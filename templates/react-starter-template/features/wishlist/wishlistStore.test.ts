import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { anonymousSession } from "@/features/session/anonymousSession";
import {
  apiClientError,
  customer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import { testTranslator } from "@/test/i18n";

import type { WishlistClient } from "./wishlistApi";
import {
  applyWishlistWrite,
  createWishlistStore,
  loadingWishlist,
  wishlistSessionKey,
} from "./wishlistStore";

const READ = "readCustomerWishlist post /customer/wishlist";
const ADD = "addProductOnWishlist post /customer/wishlist/add/{productId}";
const DELETE =
  "deleteProductOnWishlist delete /customer/wishlist/delete/{productId}";

type Invocation = { operation: string; params: unknown };
type Answer = (operation: string, params: unknown) => unknown;

const en = testTranslator("en-GB");

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

function idsResponse(ids: string[], total = ids.length) {
  return {
    products: {
      elements: ids.map((id) => ({ id }) as Schemas["Product"]),
      total,
    },
  };
}

function setup(answer: Answer = () => idsResponse([])) {
  const invocations: Invocation[] = [];
  const client = {
    invoke: async (operation: string, params?: unknown) => {
      invocations.push({ operation, params });
      return { data: await answer(operation, params), status: 200 };
    },
  } as unknown as WishlistClient;
  const store = createWishlistStore(async () => client, en);
  return { store, invocations };
}

function signedIn(id = "customer-1") {
  return toStorefrontSession(
    salesChannelContext(customer({ id }), `token-${id}`),
  );
}

const guest = toStorefrontSession(salesChannelContext(null));

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

describe("wishlistSessionKey", () => {
  it("waits for the session, keys guests together and customers by id", () => {
    expect(wishlistSessionKey(anonymousSession)).toBeNull();
    expect(wishlistSessionKey(guest)).toBe("guest");
    expect(
      wishlistSessionKey(
        toStorefrontSession(salesChannelContext(customer({ guest: true }))),
      ),
    ).toBe("guest");
    expect(wishlistSessionKey(signedIn("customer-7"))).toBe("customer-7");
  });
});

describe("applyWishlistWrite", () => {
  const ready = { status: "ready" as const, productIds: ["a", "b"], count: 5 };

  it("puts an added product first and counts it once", () => {
    expect(applyWishlistWrite(ready, "c", true, "changed")).toEqual({
      status: "ready",
      productIds: ["c", "a", "b"],
      count: 6,
    });
    expect(applyWishlistWrite(ready, "b", true, "unchanged")).toEqual({
      status: "ready",
      productIds: ["b", "a"],
      count: 5,
    });
  });

  it("drops a removed product and only counts a real removal", () => {
    expect(applyWishlistWrite(ready, "a", false, "changed")).toEqual({
      status: "ready",
      productIds: ["b"],
      count: 4,
    });
    expect(applyWishlistWrite(ready, "z", false, "unchanged")).toEqual(ready);
  });

  it("leaves the count alone while the ids are not known", () => {
    const failed = { status: "error" as const, productIds: [], count: 0 };

    expect(applyWishlistWrite(failed, "a", true, "changed")).toEqual({
      status: "error",
      productIds: ["a"],
      count: 0,
    });
  });
});

describe("createWishlistStore session sync", () => {
  it("does not read while the session is loading", async () => {
    const { store, invocations } = setup();

    store.syncSession(anonymousSession);
    await flush();

    expect(invocations).toEqual([]);
    expect(store.getSnapshot()).toBe(loadingWishlist);
  });

  it("shows an empty wishlist to guests without asking the API", async () => {
    const { store, invocations } = setup();

    store.syncSession(guest);
    await flush();

    expect(invocations).toEqual([]);
    expect(store.getSnapshot()).toEqual({
      status: "ready",
      productIds: [],
      count: 0,
    });
  });

  it("reads the ids and the exact count once for a signed-in customer", async () => {
    const { store, invocations } = setup(() => idsResponse(["a", "b"], 120));

    store.syncSession(signedIn());
    store.syncSession({ ...signedIn(), customerName: "Janet Doe" });
    await vi.waitFor(() => expect(store.getSnapshot().status).toBe("ready"));
    await flush();

    expect(operations(invocations)).toEqual([READ]);
    expect(store.getSnapshot()).toEqual({
      status: "ready",
      productIds: ["a", "b"],
      count: 120,
    });
  });

  it("reads again for another customer", async () => {
    const { store, invocations } = setup();
    store.syncSession(signedIn("customer-1"));
    await vi.waitFor(() => expect(invocations).toHaveLength(1));

    store.syncSession(signedIn("customer-2"));

    await vi.waitFor(() => expect(invocations).toHaveLength(2));
    expect(operations(invocations)).toEqual([READ, READ]);
  });

  it("empties the wishlist on logout and ignores the read still in flight", async () => {
    const pending = deferred<unknown>();
    const { store, invocations } = setup(() => pending.promise);
    store.syncSession(signedIn());
    await vi.waitFor(() => expect(invocations).toHaveLength(1));

    store.syncSession(guest);
    pending.resolve(idsResponse(["a"]));
    await flush();

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      productIds: [],
      count: 0,
    });
  });

  it("marks the wishlist as failed when the read fails", async () => {
    const failure = new Error("offline");
    const { store } = setup(() => {
      throw failure;
    });

    store.syncSession(signedIn());

    await vi.waitFor(() => expect(store.getSnapshot().status).toBe("error"));
    expect(consoleError).toHaveBeenCalledWith(
      "[Wishlist] reading the wishlist failed",
      failure,
    );
  });

  it("does not ask the API on refresh for a guest", async () => {
    const { store, invocations } = setup();
    store.syncSession(guest);

    await store.refresh();

    expect(invocations).toEqual([]);
  });
});

describe("createWishlistStore writes", () => {
  it("adds a product after the initial read and counts it", async () => {
    const { store, invocations } = setup((operation) =>
      operation === READ ? idsResponse(["a"]) : { success: true },
    );
    store.syncSession(signedIn());

    const result = await store.add("b");

    expect(result).toEqual({ ok: true, inWishlist: true });
    expect(invocations).toEqual([
      expect.objectContaining({ operation: READ }),
      { operation: ADD, params: { pathParams: { productId: "b" } } },
    ]);
    expect(store.getSnapshot()).toEqual({
      status: "ready",
      productIds: ["b", "a"],
      count: 2,
    });
  });

  it("treats a duplicate as added and reads the ids again to correct the count", async () => {
    let reads = 0;
    const { store, invocations } = setup((operation) => {
      if (operation === READ) {
        reads += 1;
        return reads === 1 ? idsResponse([], 3) : idsResponse(["b", "x"], 5);
      }
      throw apiClientError(
        [{ code: "CHECKOUT__DUPLICATE_WISHLIST_PRODUCT", status: "400" }],
        400,
      );
    });
    store.syncSession(signedIn());

    await expect(store.add("b")).resolves.toEqual({
      ok: true,
      inWishlist: true,
    });
    await vi.waitFor(() =>
      expect(operations(invocations)).toEqual([READ, ADD, READ]),
    );
    await flush();

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      productIds: ["b", "x"],
      count: 5,
    });
  });

  it("treats a product already gone as removed and reads the ids again", async () => {
    let reads = 0;
    const { store, invocations } = setup((operation) => {
      if (operation === READ) {
        reads += 1;
        return reads === 1 ? idsResponse(["a"], 2) : idsResponse(["y"], 1);
      }
      throw apiClientError(
        [{ code: "CHECKOUT__WISHLIST_PRODUCT_NOT_FOUND", status: "404" }],
        404,
      );
    });
    store.syncSession(signedIn());

    await expect(store.remove("a")).resolves.toEqual({
      ok: true,
      inWishlist: false,
    });
    await vi.waitFor(() =>
      expect(operations(invocations)).toEqual([READ, DELETE, READ]),
    );
    await flush();

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      productIds: ["y"],
      count: 1,
    });
  });

  it("reads the ids again after a write that followed a failed read", async () => {
    let reads = 0;
    const { store, invocations } = setup((operation) => {
      if (operation !== READ) return { success: true };
      reads += 1;
      if (reads === 1) throw new Error("offline");
      return idsResponse(["a", "b"], 2);
    });
    store.syncSession(signedIn());
    await vi.waitFor(() => expect(store.getSnapshot().status).toBe("error"));

    await store.add("a");
    await vi.waitFor(() =>
      expect(operations(invocations)).toEqual([READ, ADD, READ]),
    );
    await flush();

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      productIds: ["a", "b"],
      count: 2,
    });
  });

  it("marks a write the backend refused for a logged-out customer", async () => {
    const { store } = setup((operation) => {
      if (operation === READ) return idsResponse([]);
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
    });
    store.syncSession(signedIn());

    await expect(store.add("a")).resolves.toEqual({
      ok: false,
      inWishlist: false,
      message: "Customer is not logged in.",
      loggedOut: true,
    });
  });

  it("removes a product and counts the removal", async () => {
    const { store, invocations } = setup((operation) =>
      operation === READ ? idsResponse(["a", "b"]) : { success: true },
    );
    store.syncSession(signedIn());

    await expect(store.remove("a")).resolves.toEqual({
      ok: true,
      inWishlist: false,
    });

    expect(invocations.at(-1)).toEqual({
      operation: DELETE,
      params: { pathParams: { productId: "a" } },
    });
    expect(store.getSnapshot()).toEqual({
      status: "ready",
      productIds: ["b"],
      count: 1,
    });
  });

  it("resolves a failed write with the API message and keeps the state", async () => {
    const { store } = setup((operation) => {
      if (operation === READ) return idsResponse(["a"]);
      throw apiClientError(
        [
          {
            code: "CHECKOUT__WISHLIST_IS_NOT_ACTIVATED",
            status: "403",
            detail: "Wishlist is not activated!",
          },
        ],
        403,
      );
    });
    store.syncSession(signedIn());

    await expect(store.remove("a")).resolves.toEqual({
      ok: false,
      inWishlist: true,
      message: "Wishlist is not activated!",
    });
    expect(store.getSnapshot().productIds).toEqual(["a"]);
  });

  it("refuses writes for guests without asking the API", async () => {
    const { store, invocations } = setup();
    store.syncSession(guest);

    await expect(store.add("a")).resolves.toEqual({
      ok: false,
      inWishlist: false,
    });
    expect(invocations).toEqual([]);
  });

  it("runs writes one after another", async () => {
    const first = deferred<unknown>();
    const { store, invocations } = setup((operation, params) => {
      if (operation === READ) return idsResponse([]);
      const { productId } = (params as { pathParams: { productId: string } })
        .pathParams;
      return productId === "a" ? first.promise : { success: true };
    });
    store.syncSession(signedIn());

    const adding = store.add("a");
    const removing = store.remove("b");
    await flush();
    expect(operations(invocations)).toEqual([READ, ADD]);

    first.resolve({ success: true });
    await Promise.all([adding, removing]);

    expect(operations(invocations)).toEqual([READ, ADD, DELETE]);
  });

  it("does not apply a write that finishes after the customer logged out", async () => {
    const pending = deferred<unknown>();
    const { store } = setup((operation) =>
      operation === READ ? idsResponse([]) : pending.promise,
    );
    store.syncSession(signedIn());
    await vi.waitFor(() => expect(store.getSnapshot().status).toBe("ready"));

    const adding = store.add("a");
    await flush();
    store.syncSession(guest);
    pending.resolve({ success: true });
    await adding;

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      productIds: [],
      count: 0,
    });
  });
});
