"use client";

import { useMemo, useSyncExternalStore } from "react";

import { useCustomerStore } from "./CustomerProvider";
import { loadingCustomer } from "./customerStore";
import type { CustomerState } from "./customerStore";

export type UseCustomerResult = CustomerState & {
  refresh(): Promise<void>;
};

function getServerCustomer(): CustomerState {
  return loadingCustomer;
}

export function useCustomer(): UseCustomerResult {
  const store = useCustomerStore();
  const { status, customer } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerCustomer,
  );
  return useMemo(
    () => ({ status, customer, refresh: store.refresh }),
    [status, customer, store],
  );
}
