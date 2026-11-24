"use client";

import { useMemo, useSyncExternalStore } from "react";

import { useWishlistStore } from "./components/WishlistProvider";
import { loadingWishlist } from "./wishlistStore";
import type { WishlistState, WishlistStore } from "./wishlistStore";

export type UseWishlistResult = WishlistState &
  Pick<WishlistStore, "add" | "remove" | "refresh"> & {
    has(productId: string): boolean;
  };

function getServerWishlist(): WishlistState {
  return loadingWishlist;
}

export function useWishlist(): UseWishlistResult {
  const store = useWishlistStore();
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerWishlist,
  );
  return useMemo(() => {
    const ids = new Set(state.productIds);
    return {
      ...state,
      has: (productId: string) => ids.has(productId),
      add: store.add,
      remove: store.remove,
      refresh: store.refresh,
    };
  }, [state, store]);
}
