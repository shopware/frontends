"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

import { useSession } from "@/features/session/components/SessionProvider";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useTranslations } from "@/i18n/I18nProvider";

import { createWishlistStore, loadingWishlist } from "../wishlistStore";
import type { WishlistActionResult, WishlistStore } from "../wishlistStore";

function notWired(name: keyof WishlistStore): WishlistActionResult {
  console.warn(
    `[Wishlist] "${name}" is not wired up. Mount <WishlistProvider> above the component.`,
  );
  return { ok: false, inWishlist: false };
}

export const unavailableWishlistStore: WishlistStore = {
  getSnapshot: () => loadingWishlist,
  subscribe: () => () => {},
  syncSession: () => {},
  setTranslate: () => {},
  refresh: async () => {
    notWired("refresh");
  },
  add: async () => notWired("add"),
  remove: async () => notWired("remove"),
};

const WishlistStoreContext = createContext<WishlistStore>(
  unavailableWishlistStore,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const getClient = useShopwareClient();
  const session = useSession();
  const t = useTranslations();
  const [store] = useState(() => createWishlistStore(getClient, t));

  useEffect(() => {
    store.setTranslate(t);
  }, [store, t]);

  useEffect(() => {
    store.syncSession(session);
  }, [store, session]);

  const failed =
    useSyncExternalStore(
      store.subscribe,
      () => store.getSnapshot().status,
      () => loadingWishlist.status,
    ) === "error";

  useEffect(() => {
    if (!failed) return;
    const retry = () => {
      if (document.visibilityState === "visible") void store.refresh();
    };
    window.addEventListener("online", retry);
    document.addEventListener("visibilitychange", retry);
    return () => {
      window.removeEventListener("online", retry);
      document.removeEventListener("visibilitychange", retry);
    };
  }, [failed, store]);

  return <WishlistStoreContext value={store}>{children}</WishlistStoreContext>;
}

export function useWishlistStore(): WishlistStore {
  return useContext(WishlistStoreContext);
}
