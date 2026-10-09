import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { accountCustomer } from "@/features/account/customer/customer.fixture";
import { useCustomer } from "@/features/account/customer/useCustomer";
import type { CheckoutClient } from "@/features/checkout/checkoutApi";
import {
  SessionHarness,
  ShopwareClientHarness,
  sessionControl,
} from "@/features/checkout/checkoutTestDoubles";
import {
  customer as sessionCustomer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import { interact, mount, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { AccountShell } from "./AccountShell";

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigation.push, replace: navigation.replace }),
  usePathname: () => "/account",
}));

const READ_CUSTOMER = "readCustomer post /account/customer";
const PROBE = '[data-testid="customer-probe"]';
const SKELETON = '[data-testid="account-guard-skeleton"]';

function Probe() {
  const { status, customer } = useCustomer();
  return (
    <p data-testid="customer-probe" data-status={status}>
      {customer ? `${customer.firstName} ${customer.lastName}` : ""}
    </p>
  );
}

let mounted: Mounted | undefined;

beforeEach(() => {
  navigation.push.mockReset();
  navigation.replace.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

async function setup() {
  const invoke = vi.fn(async (_operation: string, _params?: unknown) => ({
    data: accountCustomer(),
    status: 200,
  }));
  const client = { invoke } as unknown as CheckoutClient;
  const notify = vi.fn();
  mounted = await mount(
    <CmsActionsProvider actions={{ notify }}>
      <ShopwareClientHarness client={client}>
        <SessionHarness
          initial={toStorefrontSession(salesChannelContext(sessionCustomer()))}
        >
          <AccountShell>
            <Probe />
          </AccountShell>
        </SessionHarness>
      </ShopwareClientHarness>
    </CmsActionsProvider>,
  );
  return { container: mounted.container, invoke, notify };
}

describe("AccountShell in the browser", () => {
  it("reads the logged-in customer once and hands it to the page", async () => {
    const { container, invoke } = await setup();

    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke.mock.calls[0]?.[0]).toBe(READ_CUSTOMER);
    const probe = query<HTMLElement>(container, PROBE);
    expect(probe.dataset.status).toBe("ready");
    expect(probe.textContent).toBe("Jane Doe");
    expect(container.querySelector(SKELETON)).toBeNull();
  });

  it("hides the page again and sends the visitor to the login once the session logs out", async () => {
    const { container, notify } = await setup();

    await interact(() =>
      sessionControl.set(toStorefrontSession(salesChannelContext(null))),
    );

    expect(container.querySelector(PROBE)).toBeNull();
    expect(container.querySelector(SKELETON)).not.toBeNull();
    expect(navigation.replace).toHaveBeenCalledTimes(1);
    expect(navigation.replace.mock.calls[0]?.[0]).toMatch(
      /^\/account\/login\?redirect=/,
    );
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ type: "info" }),
    );
  });
});
