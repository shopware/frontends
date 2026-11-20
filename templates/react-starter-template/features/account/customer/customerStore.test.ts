import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";

import { accountCustomer } from "./customer.fixture";
import {
  CUSTOMER_CRITERIA,
  createCustomerStore,
  loadingCustomer,
} from "./customerStore";
import type { CustomerClient } from "./customerStore";

const READ_CUSTOMER = "readCustomer post /account/customer";

type Invocation = { operation: string; params: unknown };

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((settle, fail) => {
    resolve = settle;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function setup(
  answer: () => Promise<Schemas["Customer"]> | Schemas["Customer"] = () =>
    accountCustomer(),
) {
  const invocations: Invocation[] = [];
  const client = {
    invoke: async (operation: string, params?: unknown) => {
      invocations.push({ operation, params });
      return { data: await answer(), status: 200 };
    },
  } as unknown as CustomerClient;
  const getClient = vi.fn(async () => client);
  const store = createCustomerStore(getClient);
  const states: unknown[] = [];
  store.subscribe(() => states.push(store.getSnapshot()));
  return { store, invocations, getClient, states };
}

async function flush(): Promise<void> {
  await new Promise((settle) => setTimeout(settle, 0));
}

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createCustomerStore", () => {
  it("starts loading without reading", async () => {
    const { store, invocations, getClient } = setup();

    await flush();

    expect(store.getSnapshot()).toBe(loadingCustomer);
    expect(invocations).toEqual([]);
    expect(getClient).not.toHaveBeenCalled();
  });

  it("reads the customer with the address associations for a customer id", async () => {
    const customer = accountCustomer();
    const { store, invocations } = setup(() => customer);

    store.syncCustomer("customer-1");
    await flush();

    expect(invocations).toEqual([
      {
        operation: READ_CUSTOMER,
        params: {
          body: {
            associations: {
              salutation: {},
              defaultBillingAddress: {
                associations: {
                  country: {},
                  countryState: {},
                  salutation: {},
                },
              },
              defaultShippingAddress: {
                associations: {
                  country: {},
                  countryState: {},
                  salutation: {},
                },
              },
            },
          },
          fetchOptions: { timeout: READ_TIMEOUT_MS },
        },
      },
    ]);
    expect(invocations[0]?.params).toEqual({
      body: CUSTOMER_CRITERIA,
      fetchOptions: { timeout: READ_TIMEOUT_MS },
    });
    expect(store.getSnapshot()).toEqual({ status: "ready", customer });
  });

  it("reads once per customer id", async () => {
    const { store, invocations } = setup();

    store.syncCustomer("customer-1");
    store.syncCustomer("customer-1");
    await flush();
    store.syncCustomer("customer-1");
    await flush();

    expect(invocations).toHaveLength(1);
  });

  it("drops the previous customer and re-reads when the customer id changes", async () => {
    const second = accountCustomer({ id: "customer-2", firstName: "Max" });
    let next = accountCustomer();
    const { store, invocations, states } = setup(() => next);

    store.syncCustomer("customer-1");
    await flush();
    next = second;
    store.syncCustomer("customer-2");

    expect(store.getSnapshot()).toBe(loadingCustomer);

    await flush();

    expect(invocations).toHaveLength(2);
    expect(store.getSnapshot()).toEqual({ status: "ready", customer: second });
    expect(states).toEqual([
      { status: "ready", customer: accountCustomer() },
      loadingCustomer,
      { status: "ready", customer: second },
    ]);
  });

  it("clears the customer without a read when the customer id goes away", async () => {
    const { store, invocations } = setup();

    store.syncCustomer("customer-1");
    await flush();
    store.syncCustomer(null);
    await flush();

    expect(invocations).toHaveLength(1);
    expect(store.getSnapshot()).toBe(loadingCustomer);
  });

  it("ignores an answer for a customer id that is no longer current", async () => {
    const first = deferred<Schemas["Customer"]>();
    const second = accountCustomer({ id: "customer-2" });
    const answers = [() => first.promise, () => second];
    const { store } = setup(() => (answers.shift() ?? (() => second))());

    store.syncCustomer("customer-1");
    await flush();
    store.syncCustomer("customer-2");
    await flush();
    first.resolve(accountCustomer());
    await flush();

    expect(store.getSnapshot()).toEqual({ status: "ready", customer: second });
  });

  it("ignores a read that a refresh overtook", async () => {
    const first = deferred<Schemas["Customer"]>();
    const refreshed = accountCustomer({ firstName: "Janet" });
    const answers = [() => first.promise, () => refreshed];
    const { store } = setup(() => (answers.shift() ?? (() => refreshed))());

    store.syncCustomer("customer-1");
    await flush();
    await store.refresh();
    first.resolve(accountCustomer());
    await flush();

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      customer: refreshed,
    });
  });

  it("ignores a failure of an overtaken read", async () => {
    const first = deferred<Schemas["Customer"]>();
    const refreshed = accountCustomer({ firstName: "Janet" });
    const answers = [() => first.promise, () => refreshed];
    const { store } = setup(() => (answers.shift() ?? (() => refreshed))());

    store.syncCustomer("customer-1");
    await flush();
    await store.refresh();
    first.reject(new Error("late failure"));
    await flush();

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      customer: refreshed,
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("re-reads on refresh and keeps the status while the read is in flight", async () => {
    const pending = deferred<Schemas["Customer"]>();
    const refreshed = accountCustomer({ firstName: "Janet" });
    const answers = [() => accountCustomer(), () => pending.promise];
    const { store, invocations } = setup(() =>
      (answers.shift() ?? (() => refreshed))(),
    );

    store.syncCustomer("customer-1");
    await flush();
    const refresh = store.refresh();
    await flush();

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      customer: accountCustomer(),
    });

    pending.resolve(refreshed);
    await refresh;

    expect(invocations.map(({ operation }) => operation)).toEqual([
      READ_CUSTOMER,
      READ_CUSTOMER,
    ]);
    expect(store.getSnapshot()).toEqual({
      status: "ready",
      customer: refreshed,
    });
  });

  it("reports a failed first read as an error without a customer", async () => {
    const failure = new Error("offline");
    const { store } = setup(() => {
      throw failure;
    });

    store.syncCustomer("customer-1");
    await flush();

    expect(store.getSnapshot()).toEqual({ status: "error", customer: null });
    expect(consoleError).toHaveBeenCalledWith(
      "[Account] reading the customer failed",
      failure,
    );
  });

  it("never rejects a refresh and keeps the last customer when it fails", async () => {
    let fail = false;
    const { store } = setup(() => {
      if (fail) throw new Error("offline");
      return accountCustomer();
    });

    store.syncCustomer("customer-1");
    await flush();
    fail = true;

    await expect(store.refresh()).resolves.toBeUndefined();
    expect(store.getSnapshot()).toEqual({
      status: "error",
      customer: accountCustomer(),
    });

    fail = false;
    await store.refresh();

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      customer: accountCustomer(),
    });
  });

  it("never rejects a refresh when the client cannot be created", async () => {
    const { store, getClient } = setup();
    getClient.mockRejectedValue(new Error("no config"));

    store.syncCustomer("customer-1");
    await expect(store.refresh()).resolves.toBeUndefined();

    expect(store.getSnapshot()).toEqual({ status: "error", customer: null });
  });

  it("resolves a refresh without a read while no customer id is known", async () => {
    const { store, invocations } = setup();

    await expect(store.refresh()).resolves.toBeUndefined();

    expect(invocations).toEqual([]);
    expect(store.getSnapshot()).toBe(loadingCustomer);
  });

  it("stops notifying an unsubscribed listener", async () => {
    const { store } = setup();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.syncCustomer("customer-1");
    await flush();

    expect(listener).not.toHaveBeenCalled();
  });
});
