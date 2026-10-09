import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { accountCustomer } from "@/features/account/customer/customer.fixture";
import { fakeCustomer } from "@/features/account/customer/fakeCustomer.fixture";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import {
  ShopwareClientHarness,
  apiError,
  deferred,
} from "@/features/checkout/checkoutTestDoubles";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import { interact, mount, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import {
  DEFAULT_BILLING,
  DEFAULT_SHIPPING,
  DELETE_ADDRESS,
  LIST_ADDRESS,
  billingAddress,
  otherAddress,
  shippingAddress,
} from "../address.fixture";
import { AddressesPageContent } from "./AddressesPageContent";

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

const customer = accountCustomer({
  defaultBillingAddressId: billingAddress.id,
  defaultShippingAddressId: shippingAddress.id,
  defaultBillingAddress: billingAddress,
  defaultShippingAddress: shippingAddress,
});

let mounted: Mounted | undefined;

beforeEach(() => {
  fakeCustomer.reset();
  fakeCustomer.set({ status: "ready", customer });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

function listAnswer(
  addresses: Schemas["CustomerAddress"][] = [
    billingAddress,
    shippingAddress,
    otherAddress,
  ],
): FakeAnswer {
  return (operation) =>
    operation === LIST_ADDRESS ? { elements: addresses } : {};
}

async function setup(answer: FakeAnswer = listAnswer()) {
  const shopware = fakeClient(answer);
  const notify = vi.fn();
  const refreshSession = vi.fn(async () => {});
  mounted = await mount(
    <CmsActionsProvider actions={{ notify }}>
      <SessionActionsProvider actions={{ refreshSession }}>
        <ShopwareClientHarness client={shopware.client}>
          <AddressesPageContent />
        </ShopwareClientHarness>
      </SessionActionsProvider>
    </CmsActionsProvider>,
  );
  await interact(() => {});
  const { container } = mounted;
  return { container, shopware, notify, refreshSession };
}

function tile(root: ParentNode, addressId: string): HTMLElement {
  const match = root.querySelector<HTMLElement>(
    `[data-address-id="${addressId}"]`,
  );
  if (!match) throw new Error(`No tile for ${addressId}`);
  return match;
}

function button(root: ParentNode, text: string): HTMLButtonElement {
  const match = queryAll<HTMLButtonElement>(root, "button").find(
    (candidate) => candidate.textContent === text,
  );
  if (!match) throw new Error(`No button "${text}"`);
  return match;
}

function sectionText(root: ParentNode, title: string): string {
  const heading = queryAll<HTMLElement>(root, "h2").find(
    (candidate) => candidate.textContent === title,
  );
  return heading?.parentElement?.parentElement?.textContent ?? "";
}

describe("AddressesPageContent in the browser", () => {
  it("shows the default addresses and every address with the Vue rules for actions", async () => {
    const { container, shopware } = await setup();

    expect(shopware.operations()).toEqual([LIST_ADDRESS]);
    expect(sectionText(container, "Default billing address")).toContain(
      "Main Street 1",
    );
    expect(sectionText(container, "Default shipping address")).toContain(
      "Harbour Road 7",
    );
    expect(queryAll(container, "[data-address-id]")).toHaveLength(3);

    const billing = tile(container, billingAddress.id);
    expect(billing.textContent).not.toContain("Delete address");
    expect(billing.textContent).not.toContain("Use as default billing address");
    expect(billing.textContent).toContain("Use as default shipping address");

    const shipping = tile(container, shippingAddress.id);
    expect(shipping.textContent).not.toContain("Delete address");
    expect(shipping.textContent).toContain("Use as default billing address");

    const other = tile(container, otherAddress.id);
    expect(other.textContent).toContain("Delete address");
    expect(other.textContent).toContain("Polska");
  });

  it("waits for the customer before it offers any address action", async () => {
    fakeCustomer.set({ status: "loading", customer: null });
    const { container } = await setup();

    expect(container.querySelector("[data-address-id]")).toBeNull();
    expect(container.textContent).not.toContain("Delete address");
    expect(queryAll(container, '[aria-busy="true"]').length).toBeGreaterThan(0);

    await interact(() => fakeCustomer.set({ status: "ready", customer }));

    expect(tile(container, otherAddress.id).textContent).toContain(
      "Delete address",
    );
  });

  it("deletes an address, drops its tile and refreshes the list, the customer and the session", async () => {
    const remaining = [billingAddress, shippingAddress];
    let deleted = false;
    const { container, shopware, refreshSession, notify } = await setup(
      (operation) => {
        if (operation === DELETE_ADDRESS) {
          deleted = true;
          return {};
        }
        if (operation === LIST_ADDRESS) {
          return {
            elements: deleted ? remaining : [...remaining, otherAddress],
          };
        }
        return {};
      },
    );

    await interact(() =>
      button(tile(container, otherAddress.id), "Delete address").click(),
    );

    expect(shopware.calls(DELETE_ADDRESS)).toEqual([
      {
        operation: DELETE_ADDRESS,
        params: { pathParams: { addressId: otherAddress.id } },
      },
    ]);
    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);
    expect(fakeCustomer.refresh).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(
      container.querySelector(`[data-address-id="${otherAddress.id}"]`),
    ).toBeNull();
    expect(queryAll(container, "[data-address-id]")).toHaveLength(2);
    expect(notify).not.toHaveBeenCalled();
  });

  it("marks the tile busy while the delete is in flight", async () => {
    const gate = deferred<unknown>();
    const { container } = await setup((operation) => {
      if (operation === DELETE_ADDRESS) return gate.promise;
      return listAnswer()(operation, undefined);
    });

    await interact(() =>
      button(tile(container, otherAddress.id), "Delete address").click(),
    );

    const busyTile = tile(container, otherAddress.id);
    expect(busyTile.getAttribute("aria-busy")).toBe("true");
    expect(button(busyTile, "Delete address").disabled).toBe(true);

    await interact(() => gate.resolve({}));
  });

  it("keeps the address and shows the API errors when the delete fails", async () => {
    const { container, shopware, notify, refreshSession } = await setup(
      (operation) => {
        if (operation === DELETE_ADDRESS) {
          throw apiError([
            {
              code: "CHECKOUT__CUSTOMER_ADDRESS_IS_DEFAULT",
              status: "400",
              detail:
                "Customer address is a default address and cannot be deleted.",
            },
          ]);
        }
        return listAnswer()(operation, undefined);
      },
    );

    await interact(() =>
      button(tile(container, otherAddress.id), "Delete address").click(),
    );

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: "Customer address is a default address and cannot be deleted.",
    });
    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(1);
    expect(fakeCustomer.refresh).not.toHaveBeenCalled();
    expect(refreshSession).not.toHaveBeenCalled();
    const restored = tile(container, otherAddress.id);
    expect(restored.getAttribute("aria-busy")).toBeNull();
    expect(button(restored, "Delete address").disabled).toBe(false);
  });

  it("sets the default billing address and refreshes before it frees the action", async () => {
    const refreshed = deferred<void>();
    fakeCustomer.refresh.mockImplementation(() => refreshed.promise);
    const { container, shopware, refreshSession } = await setup();

    await interact(() =>
      button(
        tile(container, otherAddress.id),
        "Use as default billing address",
      ).click(),
    );

    expect(shopware.calls(DEFAULT_BILLING)).toEqual([
      {
        operation: DEFAULT_BILLING,
        params: { pathParams: { addressId: otherAddress.id } },
      },
    ]);
    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(
      button(
        tile(container, otherAddress.id),
        "Use as default billing address",
      ).getAttribute("aria-busy"),
    ).toBe("true");

    await interact(() => {
      fakeCustomer.set({
        status: "ready",
        customer: {
          ...customer,
          defaultBillingAddressId: otherAddress.id,
          defaultBillingAddress: otherAddress,
        },
      });
      refreshed.resolve();
    });

    const other = tile(container, otherAddress.id);
    expect(other.getAttribute("aria-busy")).toBeNull();
    expect(other.textContent).toContain("Default billing address");
    expect(other.textContent).not.toContain("Use as default billing address");
    expect(other.textContent).not.toContain("Delete address");
    expect(sectionText(container, "Default billing address")).toContain(
      "Side Street 3",
    );
    expect(tile(container, billingAddress.id).textContent).toContain(
      "Use as default billing address",
    );
  });

  it("sets the default shipping address with its own patch", async () => {
    const { container, shopware } = await setup();

    await interact(() =>
      button(
        tile(container, otherAddress.id),
        "Use as default shipping address",
      ).click(),
    );

    expect(shopware.calls(DEFAULT_SHIPPING)).toEqual([
      {
        operation: DEFAULT_SHIPPING,
        params: { pathParams: { addressId: otherAddress.id } },
      },
    ]);
    expect(shopware.calls(DEFAULT_BILLING)).toEqual([]);
    expect(fakeCustomer.refresh).toHaveBeenCalledTimes(1);
  });

  it("shows the API errors when a default change fails and skips the refresh", async () => {
    const { container, notify, refreshSession } = await setup((operation) => {
      if (operation === DEFAULT_SHIPPING) {
        throw apiError([{ code: "X", status: "400", detail: "Nope" }]);
      }
      return listAnswer()(operation, undefined);
    });

    await interact(() =>
      button(
        tile(container, otherAddress.id),
        "Use as default shipping address",
      ).click(),
    );

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: "Nope",
    });
    expect(refreshSession).not.toHaveBeenCalled();
    expect(
      tile(container, otherAddress.id).getAttribute("aria-busy"),
    ).toBeNull();
  });

  it("shows an alert with a retry when the addresses cannot be read", async () => {
    let fail = true;
    const { container, shopware } = await setup((operation) => {
      if (operation !== LIST_ADDRESS) return {};
      if (fail) throw new Error("offline");
      return { elements: [otherAddress] };
    });

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain(
      "Something went wrong while loading results.",
    );

    fail = false;
    await interact(() => button(container, "Try again").click());

    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(tile(container, otherAddress.id)).toBeDefined();
  });

  it("offers a retry that reloads the customer when it could not be read", async () => {
    fakeCustomer.set({ status: "error", customer: null });
    fakeCustomer.refresh.mockImplementation(async () => {
      fakeCustomer.set({ status: "ready", customer });
    });
    const { container, shopware } = await setup();

    expect(container.querySelector('[role="alert"]')).not.toBeNull();

    await interact(() => button(container, "Try again").click());

    expect(fakeCustomer.refresh).toHaveBeenCalledTimes(1);
    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(1);
    expect(queryAll(container, "[data-address-id]")).toHaveLength(3);
  });

  it("says so when the customer has no addresses", async () => {
    const { container } = await setup(listAnswer([]));

    expect(container.textContent).toContain("No results.");
    expect(container.querySelector("ul")).toBeNull();
  });
});
