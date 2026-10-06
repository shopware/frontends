import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import { accountCustomer } from "@/features/account/customer/customer.fixture";
import { CustomerProvider } from "@/features/account/customer/CustomerProvider";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import {
  customer as sessionCustomer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import { testTranslator } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { AccountOverview } from "./AccountOverview";

vi.mock("@/features/account/profile/components/NewsletterSection", () => ({
  NewsletterSection: ({ email }: { email: string }) => (
    <div data-testid="fake-newsletter-section">{email}</div>
  ),
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((settle, fail) => {
    resolve = settle;
    reject = fail;
  });
  return { promise, resolve, reject };
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

async function setup(answers: Array<() => Promise<Schemas["Customer"]>>) {
  const invoke = vi.fn(async (_operation: string, _params?: unknown) => {
    const answer = answers.shift();
    if (!answer) throw new Error("unexpected read");
    return { data: await answer(), status: 200 };
  });
  const client = { invoke } as unknown as ApiClient;
  const getClient = async () => client;
  mounted = await mount(
    <ShopwareClientProvider getClient={getClient}>
      <SessionProvider
        session={toStorefrontSession(salesChannelContext(sessionCustomer()))}
      >
        <CustomerProvider>
          <AccountOverview />
        </CustomerProvider>
      </SessionProvider>
    </ShopwareClientProvider>,
  );
  const { container } = mounted;
  return {
    container,
    invoke,
    headings: () =>
      queryAll<HTMLHeadingElement>(container, "h1, h2").map((heading) => [
        heading.tagName,
        heading.textContent,
      ]),
    skeleton: () =>
      container.querySelector('[data-testid="account-overview-skeleton"]'),
    sectionRows: (title: string) => {
      const heading = queryAll(container, "h2").find(
        (element) => element.textContent === title,
      );
      return [
        ...(heading?.parentElement?.nextElementSibling?.children ?? []),
      ].map((row) => row.textContent);
    },
    alert: () => container.querySelector('[role="alert"]'),
    retryButton: () =>
      [...container.querySelectorAll("button")].find(
        (button) => button.textContent === "Try again",
      ),
  };
}

describe("AccountOverview", () => {
  it("shows the page header and a busy skeleton while the customer loads", async () => {
    const pending = deferred<Schemas["Customer"]>();
    const { container, headings, skeleton } = await setup([
      () => pending.promise,
    ]);

    expect(headings()).toEqual([["H1", "Overview"]]);
    expect(container.textContent).toContain(
      "Directly access your profile information, the default payment method and given addresses.",
    );
    expect(skeleton()?.getAttribute("aria-busy")).toBe("true");
    expect(
      container.querySelector('[data-testid="fake-newsletter-section"]'),
    ).toBeNull();
  });

  it("renders the personal data, the newsletter and the default addresses", async () => {
    const { container, headings, skeleton, alert, invoke, sectionRows } =
      await setup([async () => accountCustomer()]);

    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke.mock.calls[0]?.[0]).toBe(
      "readCustomer post /account/customer",
    );
    expect(skeleton()).toBeNull();
    expect(alert()).toBeNull();
    expect(headings()).toEqual([
      ["H1", "Overview"],
      ["H2", "Personal data"],
      ["H2", "Newsletter subscription"],
      ["H2", "Default billing address"],
      ["H2", "Default shipping address"],
    ]);
    expect(container.textContent).toContain("Jane Doe");
    expect(container.textContent).toContain("jane@example.com");
    expect(
      query(container, '[data-testid="fake-newsletter-section"]').textContent,
    ).toBe("jane@example.com");
    expect(sectionRows("Default billing address")).toEqual([
      "Jane Doe",
      "Main Street 1",
      "12345 Berlin",
      "Germany",
    ]);
    expect(sectionRows("Default shipping address")).toEqual([
      "John Roe",
      "Harbour Road 7",
      "20095 Hamburg",
      "Germany",
    ]);
  });

  it("keeps the address headers without default addresses", async () => {
    const { headings, sectionRows } = await setup([
      async () =>
        accountCustomer({
          defaultBillingAddress: undefined,
          defaultShippingAddress: undefined,
        }),
    ]);

    expect(headings()).toContainEqual(["H2", "Default billing address"]);
    expect(headings()).toContainEqual(["H2", "Default shipping address"]);
    expect(sectionRows("Default billing address")).toEqual([]);
    expect(sectionRows("Default shipping address")).toEqual([]);
  });

  it("joins only the name parts the customer has", async () => {
    const { sectionRows } = await setup([
      async () => accountCustomer({ firstName: "Jane", lastName: "" }),
    ]);

    expect(sectionRows("Personal data")).toEqual(["Jane", "jane@example.com"]);
  });

  it("shows an error with a retry that reads the customer again", async () => {
    const retry = deferred<Schemas["Customer"]>();
    const { container, alert, retryButton, invoke } = await setup([
      async () => {
        throw new Error("offline");
      },
      () => retry.promise,
    ]);

    expect(alert()?.textContent).toBe(
      testTranslator()("errors.message-default"),
    );
    const button = retryButton();
    expect(button).toBeDefined();

    await interact(() => button?.click());

    expect(invoke).toHaveBeenCalledTimes(2);
    expect(retryButton()?.disabled).toBe(true);
    expect(retryButton()?.getAttribute("aria-busy")).toBe("true");

    await interact(() => retry.resolve(accountCustomer()));

    expect(alert()).toBeNull();
    expect(retryButton()).toBeUndefined();
    expect(container.textContent).toContain("jane@example.com");
  });
});
