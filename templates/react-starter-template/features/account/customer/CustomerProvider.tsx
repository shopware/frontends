"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { useSession } from "@/features/session/components/SessionProvider";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import { createCustomerStore, loadingCustomer } from "./customerStore";
import type { CustomerStore } from "./customerStore";

export const unavailableCustomerStore: CustomerStore = {
  getSnapshot: () => loadingCustomer,
  subscribe: () => () => {},
  syncCustomer: () => {},
  refresh: async () => {
    console.warn(
      '[Account] "refresh" is not wired up. Mount <CustomerProvider> above the component.',
    );
  },
};

const CustomerStoreContext = createContext<CustomerStore>(
  unavailableCustomerStore,
);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const getClient = useShopwareClient();
  const { isLoggedIn, context } = useSession();
  const customerId = isLoggedIn ? (context?.customer?.id ?? null) : null;
  const [store] = useState(() => createCustomerStore(getClient));

  useEffect(() => {
    store.syncCustomer(customerId);
  }, [store, customerId]);

  return <CustomerStoreContext value={store}>{children}</CustomerStoreContext>;
}

export function useCustomerStore(): CustomerStore {
  return useContext(CustomerStoreContext);
}
