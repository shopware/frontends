import { Activity, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import type { Schemas } from "#shopware";
import { addressListCriteria } from "@/features/account/address/addressApi";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import {
  billingAddress,
  checkoutCustomer,
  fakeClient,
  shippingAddress,
} from "../checkout.fixture";
import type { FakeAnswer } from "../checkout.fixture";
import type { AddressKind } from "../checkoutAddresses";
import {
  ShopwareClientHarness,
  apiError,
  deferred,
} from "../checkoutTestDoubles";
import { CheckoutAddresses } from "./CheckoutAddresses";
import type { PendingAddressChange } from "./CheckoutAddresses";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

const LIST_ADDRESS = "listAddress post /account/list-address";

const addresses = [billingAddress(), shippingAddress()];

const addedAddress = billingAddress({
  id: "address-3",
  firstName: "Anna",
  lastName: "Nowak",
  street: "Dock Lane 3",
});

const visibility: { set: (hidden: boolean) => void } = {
  set: () => {
    throw new Error("PageActivity is not mounted");
  },
};

function PageActivity({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    visibility.set = setHidden;
  }, []);
  return <Activity mode={hidden ? "hidden" : "visible"}>{children}</Activity>;
}

let mounted: Mounted | undefined;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

type SetupOptions = {
  customer?: Schemas["Customer"];
  pending?: PendingAddressChange | null;
  canAddAddress?: boolean;
  onSelect?: Mock<(kind: AddressKind, id: string) => Promise<boolean>>;
  answer?: FakeAnswer;
  locale?: Locale;
};

async function setup({
  customer = checkoutCustomer(),
  pending = null,
  canAddAddress = true,
  onSelect = vi.fn(async () => true),
  answer = () => ({ elements: addresses }),
  locale = "en-GB",
}: SetupOptions = {}) {
  const shopware = fakeClient(answer);
  mounted = await mount(
    withI18n(
      <ShopwareClientHarness client={shopware.client}>
        <PageActivity>
          <CheckoutAddresses
            customer={customer}
            pending={pending}
            canAddAddress={canAddAddress}
            onSelect={onSelect}
          />
        </PageActivity>
      </ShopwareClientHarness>,
      locale,
    ),
  );
  const { container } = mounted;
  const section = (kind: AddressKind) =>
    query<HTMLElement>(
      container,
      `[data-testid="checkout-active-${kind}-address"]`,
    );
  return {
    container,
    shopware,
    onSelect,
    section,
    toggle: (kind: AddressKind) =>
      query<HTMLButtonElement>(
        container,
        `[data-testid="checkout-change-${kind}-address-button"]`,
      ),
    options: (kind: AddressKind) =>
      query<HTMLElement>(container, `#checkout-${kind}-address-options`),
    radio: (kind: AddressKind, id: string) =>
      query<HTMLInputElement>(
        container,
        `[data-testid="checkout-${kind}-address-${id}"]`,
      ),
    use: (kind: AddressKind) =>
      query<HTMLButtonElement>(
        container,
        `[data-testid="checkout-use-${kind}-address-button"]`,
      ),
    status: (kind: AddressKind) =>
      query<HTMLOutputElement>(section(kind), "output.sr-only"),
  };
}

async function leaveAndComeBack() {
  await interact(() => visibility.set(true));
  await interact(() => visibility.set(false));
}

describe("CheckoutAddresses", () => {
  it("shows one card and says the billing address is the same when there is only one address", async () => {
    const { section, shopware } = await setup();

    expect(query(section("shipping"), "h3").textContent).toBe(
      "Shipping address",
    );
    expect(
      query(section("shipping"), '[data-testid="checkout-chosen-address"]')
        .textContent,
    ).toContain("Main Street 1");
    expect(query(section("billing"), "h3").textContent).toBe("Billing address");
    expect(section("billing").textContent).toContain(
      "Same as the shipping address",
    );
    expect(
      section("billing").querySelector(
        '[data-testid="checkout-chosen-address"]',
      ),
    ).toBeNull();
    expect(shopware.invocations).toHaveLength(0);
  });

  it("shows both cards when the shipping address differs", async () => {
    const { section } = await setup({
      customer: checkoutCustomer({ activeShippingAddress: shippingAddress() }),
    });

    expect(section("shipping").textContent).toContain("Harbour Road 7");
    expect(section("billing").textContent).toContain("Main Street 1");
    expect(section("billing").textContent).not.toContain(
      "Same as the shipping address",
    );
  });

  it("reads the addresses once, when a list first opens, and checks the active one", async () => {
    const { toggle, options, radio, shopware } = await setup();

    expect(options("shipping").hidden).toBe(true);
    expect(toggle("shipping").getAttribute("aria-expanded")).toBe("false");
    expect(toggle("shipping").getAttribute("aria-controls")).toBe(
      "checkout-shipping-address-options",
    );

    await interact(() => toggle("shipping").click());

    expect(toggle("shipping").getAttribute("aria-expanded")).toBe("true");
    expect(options("shipping").hidden).toBe(false);
    expect(shopware.calls(LIST_ADDRESS)).toEqual([
      {
        operation: LIST_ADDRESS,
        params: {
          body: addressListCriteria(),
          fetchOptions: { timeout: READ_TIMEOUT_MS },
        },
      },
    ]);
    expect(radio("shipping", "address-1").checked).toBe(true);
    expect(radio("shipping", "address-2").checked).toBe(false);
    expect(query(options("shipping"), "legend").textContent).toBe(
      "Choose a shipping address",
    );

    await interact(() => toggle("shipping").click());
    await interact(() => toggle("billing").click());

    expect(options("shipping").hidden).toBe(true);
    expect(radio("billing", "address-1").checked).toBe(true);
    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(1);
  });

  it("only selects an address when a radio is checked, as arrow keys do", async () => {
    const { toggle, options, radio, onSelect, status } = await setup();

    await interact(() => toggle("shipping").click());
    radio("shipping", "address-2").focus();
    await interact(() => radio("shipping", "address-2").click());

    expect(onSelect).not.toHaveBeenCalled();
    expect(radio("shipping", "address-2").checked).toBe(true);
    expect(radio("shipping", "address-1").checked).toBe(false);
    expect(options("shipping").hidden).toBe(false);
    expect(document.activeElement).toBe(radio("shipping", "address-2"));
    expect(status("shipping").textContent).toBe("");
  });

  it("hands the selected address to onSelect on Use this address, then closes the list, focuses its toggle and announces it", async () => {
    const { toggle, options, radio, use, onSelect, status } = await setup();

    await interact(() => toggle("shipping").click());
    await interact(() => radio("shipping", "address-2").click());
    expect(use("shipping").textContent).toBe("Use this address");
    expect(use("shipping").type).toBe("submit");
    await interact(() => use("shipping").click());

    expect(onSelect).toHaveBeenCalledExactlyOnceWith("shipping", "address-2");
    expect(options("shipping").hidden).toBe(true);
    expect(document.activeElement).toBe(toggle("shipping"));
    expect(status("shipping").textContent).toBe(
      "Shipping address changed to John Smith, Harbour Road 7, 20095 Hamburg, Germany.",
    );
    expect(status("billing").textContent).toBe("");

    await interact(() => toggle("shipping").click());

    expect(status("shipping").textContent).toBe("");
  });

  it("closes the list without a change when the active address is used again", async () => {
    const { toggle, options, use, onSelect, status } = await setup();

    await interact(() => toggle("billing").click());
    await interact(() => use("billing").click());

    expect(onSelect).not.toHaveBeenCalled();
    expect(options("billing").hidden).toBe(true);
    expect(document.activeElement).toBe(toggle("billing"));
    expect(status("billing").textContent).toBe("");
  });

  it("keeps the list open with the selection when the change failed", async () => {
    const onSelect = vi.fn(async () => false);
    const { toggle, options, radio, use, status } = await setup({ onSelect });

    await interact(() => toggle("billing").click());
    await interact(() => radio("billing", "address-2").click());
    await interact(() => use("billing").click());

    expect(onSelect).toHaveBeenCalledExactlyOnceWith("billing", "address-2");
    expect(options("billing").hidden).toBe(false);
    expect(radio("billing", "address-2").checked).toBe(true);
    expect(status("billing").textContent).toBe("");
  });

  it("announces the billing address in the page locale", async () => {
    const { toggle, radio, use, status } = await setup({ locale: "de-DE" });

    await interact(() => toggle("billing").click());
    await interact(() => radio("billing", "address-2").click());
    await interact(() => use("billing").click());

    expect(status("billing").textContent).toBe(
      "Die Rechnungsadresse lautet jetzt John Smith, Harbour Road 7, 20095 Hamburg, Germany.",
    );
  });

  it("shows a pending choice as checked and ignores further choices meanwhile", async () => {
    const { toggle, options, radio, onSelect } = await setup({
      pending: { kind: "shipping", id: "address-2" },
    });

    await interact(() => toggle("shipping").click());

    expect(radio("shipping", "address-2").checked).toBe(true);
    expect(
      query(options("shipping"), "fieldset").getAttribute("aria-busy"),
    ).toBe("true");

    await interact(() => radio("shipping", "address-1").click());
    await interact(() =>
      query<HTMLButtonElement>(
        options("shipping"),
        '[data-testid="checkout-use-shipping-address-button"]',
      ).click(),
    );

    expect(radio("shipping", "address-2").checked).toBe(true);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("reports a failed read and reads again on retry", async () => {
    let reads = 0;
    const { container, toggle, options, radio, shopware } = await setup({
      answer: () => {
        reads += 1;
        if (reads === 1) throw apiError([], 500);
        return { elements: addresses };
      },
    });

    await interact(() => toggle("shipping").click());

    const alert = query<HTMLElement>(options("shipping"), '[role="alert"]');
    expect(alert.textContent).toContain("Your addresses could not be loaded.");
    expect(console.error).toHaveBeenCalledWith(
      "[Checkout] reading the customer addresses failed",
      { status: 500, codes: [] },
    );

    const retry = queryAll<HTMLButtonElement>(alert, "button").find(
      (button) => button.textContent === "Try again",
    );
    await interact(() => retry?.click());

    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(radio("shipping", "address-2")).toBeDefined();
  });

  it("reads the list again when the page comes back with the list open, so a new address shows", async () => {
    const reads = [addresses, [...addresses, addedAddress]];
    const { toggle, options, container, shopware } = await setup({
      answer: () => ({ elements: reads.shift() ?? [] }),
    });

    await interact(() => toggle("shipping").click());
    expect(
      container.querySelector(
        '[data-testid="checkout-shipping-address-address-3"]',
      ),
    ).toBeNull();

    await leaveAndComeBack();

    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);
    expect(options("shipping").hidden).toBe(false);
    expect(
      container.querySelector(
        '[data-testid="checkout-shipping-address-address-3"]',
      ),
    ).not.toBeNull();
  });

  it("reads the list again when it opens after the page came back", async () => {
    const reads = [addresses, [...addresses, addedAddress]];
    const { toggle, radio, shopware } = await setup({
      answer: () => ({ elements: reads.shift() ?? [] }),
    });

    await interact(() => toggle("shipping").click());
    await interact(() => toggle("shipping").click());
    await leaveAndComeBack();

    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(1);

    await interact(() => toggle("billing").click());

    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);
    expect(radio("billing", "address-3")).toBeDefined();
  });

  it("keeps a list that arrived while the page was hidden and reads it again on return", async () => {
    const first = deferred<unknown>();
    const second = deferred<unknown>();
    const answers = [first.promise, second.promise];
    const { container, toggle, options, radio, shopware } = await setup({
      answer: () => answers.shift(),
    });
    const loading = () =>
      container.querySelector("#checkout-shipping-address-options output");

    await interact(() => toggle("shipping").click());
    expect(loading()?.textContent).toBe("Loading...");
    await interact(() => visibility.set(true));
    await interact(() => first.resolve({ elements: addresses }));
    await interact(() => visibility.set(false));

    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);
    expect(loading()).toBeNull();
    expect(radio("shipping", "address-2")).toBeDefined();
    expect(options("shipping").querySelector('[value="address-3"]')).toBeNull();

    await interact(() =>
      second.resolve({ elements: [...addresses, addedAddress] }),
    );

    expect(radio("shipping", "address-3")).toBeDefined();
  });

  it("shows only the newest read when an older one answers last", async () => {
    const stale = deferred<unknown>();
    const fresh = deferred<unknown>();
    const answers = [stale.promise, fresh.promise];
    const { container, toggle, shopware } = await setup({
      answer: () => answers.shift(),
    });

    await interact(() => toggle("shipping").click());
    await leaveAndComeBack();
    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);

    await interact(() =>
      fresh.resolve({ elements: [...addresses, addedAddress] }),
    );
    await interact(() => stale.resolve({ elements: [billingAddress()] }));

    expect(
      queryAll(
        container,
        '#checkout-shipping-address-options input[type="radio"]',
      ).map((input) => (input as HTMLInputElement).value),
    ).toEqual(["address-1", "address-2", "address-3"]);
  });

  it("links a customer to a new address that comes back to the checkout, in the page locale", async () => {
    const { toggle, options } = await setup({ locale: "pl-PL" });

    await interact(() => toggle("shipping").click());

    const link = query<HTMLAnchorElement>(
      options("shipping"),
      '[data-testid="checkout-add-shipping-address-link"]',
    );
    expect(link.textContent).toBe("Dodaj nowy adres");
    expect(link.getAttribute("href")).toBe(
      "/pl-PL/account/address/new?redirect=%2Fpl-PL%2Fcheckout",
    );
  });

  it("offers no new address to a guest", async () => {
    const { container, toggle } = await setup({
      customer: checkoutCustomer({ guest: true }),
      canAddAddress: false,
    });

    await interact(() => toggle("shipping").click());

    expect(
      container.querySelector('[href*="/account/address/new"]'),
    ).toBeNull();
  });
});
