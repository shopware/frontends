"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { useSession } from "@/features/session/components/SessionProvider";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import { createCartStore, loadingCart } from "../cartStore";
import type { CartStore } from "../cartStore";
import type { CartActionResult } from "../types";

function notWired(name: keyof CartStore): CartActionResult {
  console.warn(
    `[Cart] "${name}" is not wired up. Mount <CartProvider> above the component.`,
  );
  return { ok: false };
}

export const unavailableCartStore: CartStore = {
  getSnapshot: () => loadingCart,
  subscribe: () => () => {},
  syncSession: () => {},
  refresh: async () => {
    notWired("refresh");
  },
  addProduct: async () => notWired("addProduct"),
  removeItem: async () => notWired("removeItem"),
  changeQuantity: async () => notWired("changeQuantity"),
};

const CartStoreContext = createContext<CartStore>(unavailableCartStore);

export function CartProvider({ children }: { children: ReactNode }) {
  const getClient = useShopwareClient();
  const session = useSession();
  const [store] = useState(() => createCartStore(getClient));

  useEffect(() => {
    store.syncSession(session);
  }, [store, session]);

  return <CartStoreContext value={store}>{children}</CartStoreContext>;
}

export function useCartStore(): CartStore {
  return useContext(CartStoreContext);
}
