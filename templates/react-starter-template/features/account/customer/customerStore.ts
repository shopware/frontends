import type { ApiClient, Schemas } from "#shopware";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";

export type CustomerStatus = "loading" | "ready" | "error";

export type CustomerState = {
  status: CustomerStatus;
  customer: Schemas["Customer"] | null;
};

export type CustomerClient = Pick<ApiClient, "invoke">;

export type CustomerStore = {
  getSnapshot(): CustomerState;
  subscribe(listener: () => void): () => void;
  syncCustomer(customerId: string | null): void;
  refresh(): Promise<void>;
};

const ADDRESS_ASSOCIATIONS = {
  country: {},
  countryState: {},
  salutation: {},
};

export const CUSTOMER_CRITERIA = {
  associations: {
    salutation: {},
    defaultBillingAddress: { associations: ADDRESS_ASSOCIATIONS },
    defaultShippingAddress: { associations: ADDRESS_ASSOCIATIONS },
  },
} satisfies Schemas["NoneFieldsCriteria"];

export const loadingCustomer: CustomerState = {
  status: "loading",
  customer: null,
};

export function createCustomerStore(
  getClient: () => Promise<CustomerClient>,
): CustomerStore {
  let snapshot = loadingCustomer;
  let customerId: string | null = null;
  let readCount = 0;
  const listeners = new Set<() => void>();

  function publish(next: CustomerState): void {
    snapshot = next;
    for (const listener of listeners) listener();
  }

  async function read(): Promise<void> {
    readCount += 1;
    const current = readCount;
    if (!customerId) return;
    try {
      const client = await getClient();
      const { data } = await client.invoke(
        "readCustomer post /account/customer",
        {
          body: CUSTOMER_CRITERIA,
          fetchOptions: { timeout: READ_TIMEOUT_MS },
        },
      );
      if (current !== readCount) return;
      publish({ status: "ready", customer: data });
    } catch (error) {
      if (current !== readCount) return;
      console.error("[Account] reading the customer failed", error);
      publish({ status: "error", customer: snapshot.customer });
    }
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    syncCustomer(nextId) {
      if (nextId === customerId) return;
      customerId = nextId;
      if (snapshot !== loadingCustomer) publish(loadingCustomer);
      void read();
    },
    refresh: read,
  };
}
