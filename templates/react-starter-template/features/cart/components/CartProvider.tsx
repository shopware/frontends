"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { useSession } from "@/features/session/components/SessionProvider";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useTranslations } from "@/i18n/I18nProvider";

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
  setTranslate: () => {},
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
  const t = useTranslations();
  const [store] = useState(() => createCartStore(getClient, t));

  useEffect(() => {
    store.setTranslate(t);
  }, [store, t]);

  useEffect(() => {
    store.syncSession(session);
  }, [store, session]);

  return <CartStoreContext value={store}>{children}</CartStoreContext>;
}

export function useCartStore(): CartStore {
  return useContext(CartStoreContext);
}
