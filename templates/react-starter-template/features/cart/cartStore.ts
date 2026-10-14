import type { ApiClient, Schemas } from "#shopware";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import type { StorefrontSession } from "@/features/session/types";
import type { Translate } from "@/i18n/translate";

import { promotionNotEligibleErrors, toCartActionErrors } from "./cartErrors";
import type { CartActionError } from "./cartErrors";
import {
  isPromotionCodeApplied,
  normalizePromotionCode,
  promotionLineItems,
} from "./promotionCode";
import type {
  CartActionResult,
  CartReadResult,
  CartState,
  PromotionCodeResult,
} from "./types";

export type CartClient = Pick<ApiClient, "invoke">;

export type AddProductInput = { id: string; quantity?: number };

export type CartStore = {
  getSnapshot(): CartState;
  subscribe(listener: () => void): () => void;
  syncSession(session: StorefrontSession): void;
  setTranslate(t: Translate): void;
  refresh(): Promise<void>;
  refreshWithResult(): Promise<CartReadResult>;
  addProduct(input: AddProductInput): Promise<CartActionResult>;
  addProducts(items: AddProductInput[]): Promise<CartActionResult>;
  addPromotionCode(code: string): Promise<PromotionCodeResult>;
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
  appliedPromotionCodes: Schemas["LineItem"][];
};

type QueuedRead = { result: Promise<CartReadResult>; done: Promise<void> };

export const loadingCart: CartState = { status: "loading", cart: null };

const NO_LINE_ITEMS: Schemas["LineItem"][] = [];
const NO_DELIVERIES: Schemas["CartDelivery"][] = [];
const NO_PROMOTIONS: Schemas["LineItem"][] = [];

export function summarizeCart(cart: Schemas["Cart"] | null): CartSummary {
  const lineItems = cart?.lineItems ?? NO_LINE_ITEMS;
  const promotions = promotionLineItems(lineItems);
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
    appliedPromotionCodes: promotions.length > 0 ? promotions : NO_PROMOTIONS,
  };
}

export function cartSessionKey(session: StorefrontSession): string | null {
  if (session.status === "loading") return null;
  const customer = session.context?.customer;
  return JSON.stringify([
    customer?.id ?? null,
    !!customer?.guest,
    session.context?.token ?? null,
    session.context?.context?.languageIdChain?.[0] ?? null,
    session.context?.currency?.id ?? null,
  ]);
}

function logReadFailure(error: unknown): void {
  console.error("[Cart] reading the cart failed", error);
}

function settle(): void {}

function productItems(items: AddProductInput[]) {
  return items.map(({ id, quantity = 1 }) => ({
    id,
    referencedId: id,
    quantity,
    type: "product" as const,
  }));
}

export function createCartStore(
  getClient: () => Promise<CartClient>,
  t: Translate,
): CartStore {
  let snapshot = loadingCart;
  let translate = t;
  const listeners = new Set<() => void>();
  let tail: Promise<void> = Promise.resolve();
  let queuedRead: QueuedRead | null = null;
  let sessionKey: string | null = null;

  function publish(next: CartState): void {
    snapshot = next;
    for (const listener of listeners) listener();
  }

  function enqueue<T>(task: () => Promise<T>): Promise<T> {
    queuedRead = null;
    const run = tail.then(task);
    tail = run.then(settle, settle);
    return run;
  }

  async function readCart(): Promise<CartReadResult> {
    try {
      const client = await getClient();
      const { data } = await client.invoke("readCart get /checkout/cart", {
        fetchOptions: { timeout: READ_TIMEOUT_MS },
      });
      const previous = snapshot.cart;
      publish({ status: "ready", cart: data });
      return {
        ok: true,
        cart: data,
        errors: toCartActionErrors(data),
        newErrors: toCartActionErrors(data, previous),
      };
    } catch (error) {
      logReadFailure(error);
      if (snapshot.status !== "error")
        publish({ ...snapshot, status: "error" });
      return { ok: false };
    }
  }

  function queueRead(): QueuedRead {
    if (queuedRead) return queuedRead;
    const result = enqueue(() => {
      if (queuedRead?.result === result) queuedRead = null;
      return readCart();
    });
    const entry = { result, done: result.then(settle) };
    queuedRead = entry;
    return entry;
  }

  function refresh(): Promise<void> {
    return queueRead().done;
  }

  function refreshWithResult(): Promise<CartReadResult> {
    return queueRead().result;
  }

  function mutate(
    call: (client: CartClient) => Promise<{ data: Schemas["Cart"] }>,
    inspect?: (cart: Schemas["Cart"]) => void,
  ): Promise<CartActionResult> {
    return enqueue(async () => {
      const previous = snapshot.cart;
      try {
        const { data } = await call(await getClient());
        publish({ status: "ready", cart: data });
        inspect?.(data);
        return { ok: true, errors: toCartActionErrors(data, previous) };
      } catch (error) {
        return {
          ok: false,
          message: resolveApiErrorMessages(error, translate)[0],
        };
      }
    });
  }

  function addPromotionCode(code: string): Promise<PromotionCodeResult> {
    const referencedId = normalizePromotionCode(code);
    if (!referencedId) {
      return Promise.resolve({
        ok: false,
        applied: false,
        message: translate("validations.required"),
      });
    }
    let applied = false;
    let notEligible: CartActionError[] = [];
    return mutate(
      (client) =>
        client.invoke("addLineItem post /checkout/cart/line-item", {
          body: { items: [{ type: "promotion", referencedId }] },
        }),
      (cart) => {
        applied = isPromotionCodeApplied(cart.lineItems ?? [], referencedId);
        notEligible = applied ? [] : promotionNotEligibleErrors(cart);
      },
    ).then((result) =>
      result.errors?.length === 0 && notEligible.length > 0
        ? { ...result, applied, errors: notEligible }
        : { ...result, applied },
    );
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
    setTranslate(next) {
      translate = next;
    },
    refresh,
    refreshWithResult,
    addProduct: (input) =>
      mutate((client) =>
        client.invoke("addLineItem post /checkout/cart/line-item", {
          body: { items: productItems([input]) },
        }),
      ),
    addProducts: (items) =>
      items.length === 0
        ? Promise.resolve({ ok: true, errors: [] })
        : mutate((client) =>
            client.invoke("addLineItem post /checkout/cart/line-item", {
              body: { items: productItems(items) },
            }),
          ),
    addPromotionCode,
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
