import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import type { useCart } from "@/features/cart/useCart";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import type { StorefrontSession } from "@/features/session/types";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";

import type { CheckoutClient } from "./checkoutApi";

export type FakeCartResult = ReturnType<typeof useCart>;

export function cartLineItem(
  overrides: Partial<Schemas["LineItem"]> = {},
): Schemas["LineItem"] {
  return {
    id: "line-1",
    referencedId: "product-1",
    label: "Aerodynamic Bag",
    quantity: 2,
    good: true,
    type: "product",
    cover: null,
    ...overrides,
  } as Schemas["LineItem"];
}

export function cartResult(
  overrides: Partial<FakeCartResult> = {},
): FakeCartResult {
  const lineItems = overrides.lineItems ?? [cartLineItem()];
  const count = lineItems.reduce(
    (total, item) => total + (item.quantity ?? 0),
    0,
  );
  const cart =
    overrides.cart !== undefined
      ? overrides.cart
      : ({
          apiAlias: "cart",
          lineItems,
          deliveries: [],
        } as unknown as Schemas["Cart"]);
  return {
    status: "ready",
    cart,
    lineItems,
    count,
    isEmpty: count === 0,
    subtotal: 59.98,
    totalPrice: 64.97,
    shippingCosts: [
      {
        shippingMethod: { id: "shipping-standard" },
        shippingCosts: { totalPrice: 4.99 },
      },
    ] as Schemas["CartDelivery"][],
    appliedPromotionCodes: lineItems.filter(
      (item) => item.type === "promotion",
    ),
    refresh: vi.fn(async () => {}),
    refreshWithResult: vi.fn(async () =>
      cart
        ? { ok: true as const, cart, errors: [], newErrors: [] }
        : { ok: false as const },
    ),
    addProduct: vi.fn(async () => ({ ok: true })),
    addProducts: vi.fn(async () => ({ ok: true })),
    addPromotionCode: vi.fn(async () => ({ ok: true, applied: true })),
    removeItem: vi.fn(async () => ({ ok: true })),
    changeQuantity: vi.fn(async () => ({ ok: true })),
    ...overrides,
  };
}

let currentCart: FakeCartResult = cartResult();
const cartListeners = new Set<() => void>();

function subscribeCart(listener: () => void) {
  cartListeners.add(listener);
  return () => {
    cartListeners.delete(listener);
  };
}

function cartSnapshot() {
  return currentCart;
}

export const fakeCart = {
  set(next: FakeCartResult) {
    currentCart = next;
    for (const listener of cartListeners) listener();
  },
  get: cartSnapshot,
};

export function useFakeCart(): FakeCartResult {
  return useSyncExternalStore(subscribeCart, cartSnapshot, cartSnapshot);
}

export function ShopwareClientHarness({
  client,
  children,
}: {
  client: CheckoutClient;
  children: ReactNode;
}) {
  const [getClient] = useState(() => async () => client as ApiClient);
  return (
    <ShopwareClientProvider getClient={getClient}>
      {children}
    </ShopwareClientProvider>
  );
}

export function apiError(errors: ApiError[], status = 400) {
  return new ApiClientError(
    Object.assign(new Response(null, { status }), { _data: { errors } }),
  );
}

export function timeoutError(): Error {
  return Object.assign(new Error("The operation timed out."), {
    name: "TimeoutError",
  });
}

export function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((settleResolve, settleReject) => {
    resolve = settleResolve;
    reject = settleReject;
  });
  return { promise, resolve, reject };
}

let latestSession: StorefrontSession | null = null;

export const sessionControl: {
  set: (session: StorefrontSession) => void;
  get: () => StorefrontSession | null;
} = {
  set: () => {
    throw new Error("SessionHarness is not mounted");
  },
  get: () => latestSession,
};

export function SessionHarness({
  initial,
  children,
}: {
  initial: StorefrontSession;
  children: ReactNode;
}) {
  const [session, setSession] = useState(() => {
    latestSession = initial;
    return initial;
  });
  useEffect(() => {
    sessionControl.set = (next) => {
      latestSession = next;
      setSession(next);
    };
  }, []);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
