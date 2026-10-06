import { useSyncExternalStore } from "react";
import { vi } from "vitest";
import type { Mock } from "vitest";

import type { UseCustomerResult } from "./useCustomer";

export type FakeCustomerState = Pick<UseCustomerResult, "status" | "customer">;

const refresh: Mock<() => Promise<void>> = vi.fn(async () => {});

let current: UseCustomerResult = {
  status: "loading",
  customer: null,
  refresh,
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot(): UseCustomerResult {
  return current;
}

export const fakeCustomer = {
  refresh,
  set(next: FakeCustomerState) {
    current = { ...next, refresh };
    for (const listener of listeners) listener();
  },
  reset() {
    refresh.mockReset();
    refresh.mockImplementation(async () => {});
    current = { status: "loading", customer: null, refresh };
  },
};

export function useFakeCustomer(): UseCustomerResult {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
