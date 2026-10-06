import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import {
  customer as sessionCustomer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import type { StorefrontSession } from "@/features/session/types";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import { interact, mount } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { accountCustomer } from "./customer.fixture";
import { CustomerProvider } from "./CustomerProvider";
import { useCustomer } from "./useCustomer";
import type { UseCustomerResult } from "./useCustomer";

const READ_CUSTOMER = "readCustomer post /account/customer";

function sessionFor(customer: Schemas["Customer"] | null): StorefrontSession {
  return toStorefrontSession(salesChannelContext(customer));
}

const sessionControl: { set?: (session: StorefrontSession) => void } = {};

function ControlledSession({
  initial,
  children,
}: {
  initial: StorefrontSession;
  children: ReactNode;
}) {
  const [session, setSession] = useState(initial);
  useEffect(() => {
    sessionControl.set = setSession;
    return () => {
      sessionControl.set = undefined;
    };
  }, []);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

const seen: { current?: UseCustomerResult } = {};

function Probe() {
  const result = useCustomer();
  useEffect(() => {
    seen.current = result;
  });
  return (
    <p data-status={result.status}>
      {result.customer
        ? `${result.customer.firstName} ${result.customer.lastName}`
        : ""}
    </p>
  );
}

let mounted: Mounted | undefined;

beforeEach(() => {
  seen.current = undefined;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

async function setup(
  initial: StorefrontSession,
  answer: (call: number) => Schemas["Customer"] | Promise<Schemas["Customer"]>,
) {
  const invoke = vi.fn(async (_operation: string, _params?: unknown) => ({
    data: await answer(invoke.mock.calls.length),
    status: 200,
  }));
  const client = { invoke } as unknown as ApiClient;
  const getClient = async () => client;
  mounted = await mount(
    <ShopwareClientProvider getClient={getClient}>
      <ControlledSession initial={initial}>
        <CustomerProvider>
          <Probe />
        </CustomerProvider>
      </ControlledSession>
    </ShopwareClientProvider>,
  );
  const text = () => mounted?.container.querySelector("p");
  return { invoke, text };
}

describe("CustomerProvider", () => {
  it("reads the logged-in customer through the shared client", async () => {
    const { invoke, text } = await setup(sessionFor(sessionCustomer()), () =>
      accountCustomer(),
    );

    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke.mock.calls[0]?.[0]).toBe(READ_CUSTOMER);
    expect(text()?.dataset.status).toBe("ready");
    expect(text()?.textContent).toBe("Jane Doe");
  });

  it("does not read for a guest or an anonymous session", async () => {
    const { invoke, text } = await setup(
      sessionFor(sessionCustomer({ guest: true })),
      () => accountCustomer(),
    );

    await interact(() => sessionControl.set?.(sessionFor(null)));

    expect(invoke).not.toHaveBeenCalled();
    expect(text()?.dataset.status).toBe("loading");
  });

  it("keeps the read when the session refreshes for the same customer", async () => {
    const { invoke } = await setup(sessionFor(sessionCustomer()), () =>
      accountCustomer(),
    );

    await interact(() =>
      sessionControl.set?.(sessionFor(sessionCustomer({ firstName: "Janet" }))),
    );

    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("re-reads when the session switches to another customer", async () => {
    const { invoke, text } = await setup(
      sessionFor(sessionCustomer()),
      (call) =>
        call === 1
          ? accountCustomer()
          : accountCustomer({
              id: "customer-2",
              firstName: "Max",
              lastName: "Mustermann",
            }),
    );

    await interact(() =>
      sessionControl.set?.(sessionFor(sessionCustomer({ id: "customer-2" }))),
    );

    expect(invoke).toHaveBeenCalledTimes(2);
    expect(text()?.textContent).toBe("Max Mustermann");
  });

  it("forgets the customer after a logout", async () => {
    const { text } = await setup(sessionFor(sessionCustomer()), () =>
      accountCustomer(),
    );

    await interact(() => sessionControl.set?.(sessionFor(null)));

    expect(text()?.dataset.status).toBe("loading");
    expect(text()?.textContent).toBe("");
  });

  it("refreshes through the hook without rejecting", async () => {
    let fail = false;
    const { invoke, text } = await setup(sessionFor(sessionCustomer()), () => {
      if (fail) throw new Error("offline");
      return accountCustomer();
    });
    fail = true;

    let outcome: unknown = "pending";
    await interact(() => {
      void seen.current?.refresh().then(
        () => {
          outcome = "resolved";
        },
        () => {
          outcome = "rejected";
        },
      );
    });

    expect(invoke).toHaveBeenCalledTimes(2);
    expect(outcome).toBe("resolved");
    expect(text()?.dataset.status).toBe("error");
    expect(text()?.textContent).toBe("Jane Doe");
  });
});

describe("useCustomer without a provider", () => {
  it("stays loading and warns on refresh", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mounted = await mount(<Probe />);

    await interact(() => {
      void seen.current?.refresh();
    });

    expect(mounted.container.querySelector("p")?.dataset.status).toBe(
      "loading",
    );
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
