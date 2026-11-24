import { useSyncExternalStore } from "react";

import type { UseWishlistResult } from "./useWishlist";

export function wishlistView(
  overrides: Partial<UseWishlistResult> = {},
): UseWishlistResult {
  const productIds = overrides.productIds ?? [];
  return {
    status: "ready",
    productIds,
    count: productIds.length,
    has: (productId) => productIds.includes(productId),
    add: async () => ({ ok: true, inWishlist: true }),
    remove: async () => ({ ok: true, inWishlist: false }),
    refresh: async () => {},
    ...overrides,
  };
}

let current = wishlistView();
const listeners = new Set<() => void>();

export const fakeWishlist = {
  get: (): UseWishlistResult => current,
  set(next: UseWishlistResult) {
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

export function useFakeWishlist(): UseWishlistResult {
  return useSyncExternalStore(
    fakeWishlist.subscribe,
    fakeWishlist.get,
    fakeWishlist.get,
  );
}
