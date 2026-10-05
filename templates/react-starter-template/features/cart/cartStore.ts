import type { ApiClient, Schemas } from "#shopware";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import type { StorefrontSession } from "@/features/session/types";

import { toCartActionErrors } from "./cartErrors";
import type { CartActionResult, CartState } from "./types";

export type CartClient = Pick<ApiClient, "invoke">;

export type AddProductInput = { id: string; quantity?: number };

export type CartStore = {
  getSnapshot(): CartState;
  subscribe(listener: () => void): () => void;
  syncSession(session: StorefrontSession): void;
  refresh(): Promise<void>;
  addProduct(input: AddProductInput): Promise<CartActionResult>;
  removeItem(id: string): Promise<CartActionResult>;
  changeQuantity(id: string, quantity: number): Promise<CartActionResult>;
};

export type CartSummary = {
  lineItems: Schemas["LineItem"][];
  count: number;
  isEmpty: boolean;
  subtotal: number;
  totalPrice: number;
  shippingCosts: Schemas["CartDelivery"][];
};

export const loadingCart: CartState = { status: "loading", cart: null };

const NO_LINE_ITEMS: Schemas["LineItem"][] = [];
const NO_DELIVERIES: Schemas["CartDelivery"][] = [];

export function summarizeCart(cart: Schemas["Cart"] | null): CartSummary {
  const lineItems = cart?.lineItems ?? NO_LINE_ITEMS;
  const count = lineItems.reduce(
    (total, lineItem) =>
      lineItem.good === true ? (lineItem.quantity ?? 0) + total : total,
    0,
  );
  return {
    lineItems,
    count,
    isEmpty: count <= 0,
    subtotal: cart?.price?.positionPrice || 0,
    totalPrice: cart?.price?.totalPrice || 0,
    shippingCosts: cart?.deliveries ?? NO_DELIVERIES,
  };
}

export function cartSessionKey(session: StorefrontSession): string | null {
  if (session.status === "loading") return null;
  const customer = session.context?.customer;
  return JSON.stringify([
    customer?.id ?? null,
    !!customer?.guest,
    session.context?.token ?? null,
  ]);
}

function logReadFailure(error: unknown): void {
  console.error("[Cart] reading the cart failed", error);
}

function settle(): void {}

export function createCartStore(
  getClient: () => Promise<CartClient>,
): CartStore {
  let snapshot = loadingCart;
  const listeners = new Set<() => void>();
  let tail: Promise<void> = Promise.resolve();
  let queuedRefresh: Promise<void> | null = null;
  let sessionKey: string | null = null;

  function publish(next: CartState): void {
    snapshot = next;
    for (const listener of listeners) listener();
  }

  function enqueue<T>(task: () => Promise<T>): Promise<T> {
    queuedRefresh = null;
    const run = tail.then(task);
    tail = run.then(settle, settle);
    return run;
  }

  async function readCart(): Promise<void> {
    try {
      const client = await getClient();
      const { data } = await client.invoke("readCart get /checkout/cart", {
        fetchOptions: { timeout: READ_TIMEOUT_MS },
      });
      publish({ status: "ready", cart: data });
    } catch (error) {
      logReadFailure(error);
      if (snapshot.status !== "error")
        publish({ ...snapshot, status: "error" });
    }
  }

  function refresh(): Promise<void> {
    if (queuedRefresh) return queuedRefresh;
    const run = enqueue(() => {
      if (queuedRefresh === run) queuedRefresh = null;
      return readCart();
    });
    queuedRefresh = run;
    return run;
  }

  function mutate(
    call: (client: CartClient) => Promise<{ data: Schemas["Cart"] }>,
  ): Promise<CartActionResult> {
    return enqueue(async () => {
      try {
        const { data } = await call(await getClient());
        publish({ status: "ready", cart: data });
        return { ok: true, errors: toCartActionErrors(data) };
      } catch (error) {
        return { ok: false, message: resolveApiErrorMessages(error)[0] };
      }
    });
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    syncSession(session) {
      const key = cartSessionKey(session);
      if (key === null || key === sessionKey) return;
      sessionKey = key;
      void refresh();
    },
    refresh,
    addProduct: ({ id, quantity = 1 }) =>
      mutate((client) =>
        client.invoke("addLineItem post /checkout/cart/line-item", {
          body: {
            items: [{ id, referencedId: id, quantity, type: "product" }],
          },
        }),
      ),
    removeItem: (id) =>
      mutate((client) =>
        client.invoke("removeLineItem post /checkout/cart/line-item/delete", {
          body: { ids: [id] },
        }),
      ),
    changeQuantity: (id, quantity) =>
      mutate((client) =>
        client.invoke("updateLineItem patch /checkout/cart/line-item", {
          body: { items: [{ id, quantity }] },
        }),
      ),
  };
}
