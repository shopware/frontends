"use client";

import { useMemo, useSyncExternalStore } from "react";

import type { Schemas } from "#shopware";

import { loadingCart, summarizeCart } from "./cartStore";
import type { CartStore, CartSummary } from "./cartStore";
import { useCartStore } from "./components/CartProvider";
import type { CartState, CartStatus } from "./types";

export type UseCartResult = CartSummary & {
  status: CartStatus;
  cart: Schemas["Cart"] | null;
} & Pick<CartStore, "refresh" | "addProduct" | "removeItem" | "changeQuantity">;

function getServerCart(): CartState {
  return loadingCart;
}

export function useCart(): UseCartResult {
  const store = useCartStore();
  const { status, cart } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerCart,
  );
  return useMemo(
    () => ({
      status,
      cart,
      ...summarizeCart(cart),
      refresh: store.refresh,
      addProduct: store.addProduct,
      removeItem: store.removeItem,
      changeQuantity: store.changeQuantity,
    }),
    [status, cart, store],
  );
}
