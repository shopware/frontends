import { useSyncExternalStore } from "react";

import type { Schemas } from "#shopware";
import type { useCart } from "@/features/cart/useCart";

export type CartView = ReturnType<typeof useCart>;

export function lineItem(
  overrides: Partial<Schemas["LineItem"]> = {},
): Schemas["LineItem"] {
  return {
    id: "line-1",
    referencedId: "product-1",
    type: "product",
    label: "Aerodynamic Bronze Brandix",
    quantity: 2,
    good: true,
    removable: true,
    stackable: true,
    cover: {
      url: "https://cdn.test/cover.jpg",
      thumbnails: [
        { width: 800, url: "https://cdn.test/cover-800.jpg" },
        { width: 280, url: "https://cdn.test/cover-280.jpg" },
        { width: 400, url: "https://cdn.test/cover-400.jpg" },
      ],
    } as unknown as Schemas["Media"],
    price: {
      apiAlias: "calculated_price",
      quantity: 2,
      unitPrice: 19.99,
      totalPrice: 39.98,
    },
    quantityInformation: { minPurchase: 1, maxPurchase: 10, purchaseSteps: 1 },
    payload: {
      options: [
        { group: "Size", option: "XL" },
        { group: "Color", option: "Blue" },
      ],
    } as unknown as Schemas["LineItem"]["payload"],
    ...overrides,
  };
}

export function promotionItem(
  overrides: Partial<Schemas["LineItem"]> = {},
): Schemas["LineItem"] {
  return lineItem({
    id: "promotion-1",
    referencedId: "SUMMER",
    type: "promotion",
    label: "Summer sale",
    quantity: 1,
    good: false,
    removable: true,
    stackable: false,
    cover: null,
    price: {
      apiAlias: "calculated_price",
      quantity: 1,
      unitPrice: -5,
      totalPrice: -5,
    },
    payload: undefined,
    quantityInformation: undefined,
    ...overrides,
  });
}

export function cartView(overrides: Partial<CartView> = {}): CartView {
  const lineItems = overrides.lineItems ?? [];
  const count = lineItems.reduce(
    (sum, item) => (item.good === true ? sum + (item.quantity ?? 0) : sum),
    0,
  );
  return {
    status: "ready",
    cart: null,
    lineItems,
    count,
    isEmpty: count <= 0,
    subtotal: 0,
    totalPrice: 0,
    shippingCosts: [],
    refresh: async () => {},
    addProduct: async () => ({ ok: true }),
    removeItem: async () => ({ ok: true }),
    changeQuantity: async () => ({ ok: true }),
    ...overrides,
  };
}

const listeners = new Set<() => void>();
let current: CartView = cartView({ status: "loading" });

export const fakeCart = {
  get: (): CartView => current,
  set(next: CartView) {
    current = next;
    for (const listener of listeners) listener();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useFakeCart(): CartView {
  return useSyncExternalStore(fakeCart.subscribe, fakeCart.get, fakeCart.get);
}
