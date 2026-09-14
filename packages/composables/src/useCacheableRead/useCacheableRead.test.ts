import { encodeForQuery } from "@shopware/api-client/helpers";
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import type { Schemas } from "#shopware";

import { useSetup } from "../_test";
import { canUseCacheableGet, useCacheableRead } from "./useCacheableRead";

const salesChannel = {
  currencyId: "currency",
  countryId: "country",
  paymentMethodId: "payment",
  shippingMethodId: "shipping",
  languageId: "language",
};

function guestSession(overrides: Record<string, unknown> = {}) {
  return {
    token: "token",
    salesChannel,
    context: { currencyId: "currency", languageIdChain: ["language"] },
    shippingLocation: { country: { id: "country" }, state: null },
    paymentMethod: { id: "payment" },
    shippingMethod: { id: "shipping" },
    ...overrides,
  } as unknown as Schemas["SalesChannelContext"];
}

function cartOf(overrides: Record<string, unknown> = {}) {
  return {
    token: "token",
    lineItems: [],
    ...overrides,
  } as unknown as Schemas["Cart"];
}

describe("canUseCacheableGet", () => {
  const withToken = { "sw-context-token": "token" };

  it.each([
    {
      name: "no token, unknown session",
      headers: {},
      session: undefined,
      expected: true,
    },
    { name: "no token, default guest session", headers: {}, expected: true },
    {
      name: "no token, language header",
      headers: { "sw-language-id": "language" },
      session: undefined,
      expected: false,
    },
    {
      name: "no token, currency header",
      headers: { "sw-currency-id": "currency" },
      session: undefined,
      expected: false,
    },
    { name: "token, unknown session", session: undefined, expected: false },
    {
      name: "token differs from the session token",
      session: guestSession({ token: "old" }),
      expected: false,
    },
    { name: "default guest with an empty cart", expected: true },
    {
      name: "default guest with the currency entity and a cart without line items",
      session: guestSession({
        context: { languageIdChain: ["language"] },
        currency: { id: "currency" },
      }),
      cart: cartOf({ lineItems: undefined }),
      expected: true,
    },
    {
      name: "customer",
      session: guestSession({ customer: { id: "customer" } }),
      expected: false,
    },
    {
      name: "guest account",
      session: guestSession({ customer: { id: "customer", guest: true } }),
      expected: false,
    },
    {
      name: "non-default currency in the context",
      session: guestSession({
        context: { currencyId: "other", languageIdChain: ["language"] },
      }),
      expected: false,
    },
    {
      name: "non-default currency without a context currency",
      session: guestSession({ context: undefined, currency: { id: "other" } }),
      expected: false,
    },
    {
      name: "non-default currency header",
      headers: { ...withToken, "sw-currency-id": "other" },
      expected: false,
    },
    {
      name: "non-default country",
      session: guestSession({ shippingLocation: { country: { id: "other" } } }),
      expected: false,
    },
    {
      name: "country state",
      session: guestSession({
        shippingLocation: { country: { id: "country" }, state: { id: "s" } },
      }),
      expected: false,
    },
    {
      name: "non-default payment method",
      session: guestSession({ paymentMethod: { id: "other" } }),
      expected: false,
    },
    {
      name: "non-default shipping method",
      session: guestSession({ shippingMethod: { id: "other" } }),
      expected: false,
    },
    {
      name: "non-default language in the context",
      session: guestSession({
        context: { currencyId: "currency", languageIdChain: ["other"] },
      }),
      expected: false,
    },
    {
      name: "non-default language header",
      headers: { ...withToken, "sw-language-id": "other" },
      expected: false,
    },
    { name: "cart unknown", cart: undefined, expected: false },
    {
      name: "cart token differs",
      cart: cartOf({ token: "old" }),
      expected: false,
    },
    {
      name: "cart with line items",
      cart: cartOf({ lineItems: [{ id: "item" }] }),
      expected: false,
    },
    {
      name: "guest server render skips the cart",
      cart: undefined,
      guestServerRender: true,
      expected: true,
    },
    {
      name: "missing sales channel",
      session: guestSession({ salesChannel: undefined }),
      expected: false,
    },
  ])("$name", ({ expected, ...params }) => {
    expect(
      canUseCacheableGet({
        headers: withToken,
        session: guestSession(),
        cart: cartOf(),
        ...params,
      }),
    ).toBe(expected);
  });
});

describe("useCacheableRead", () => {
  function setup({
    cacheableReads = true,
    defaultHeaders = { "sw-context-token": "token" },
    session = ref(guestSession()),
  }: {
    cacheableReads?: boolean;
    defaultHeaders?: Record<string, string>;
    session?: unknown;
  } = {}) {
    return useSetup(useCacheableRead, {
      shopware: { cacheableReads },
      apiClient: { invoke: vi.fn(), defaultHeaders },
      swSessionContext: session,
      swCart: ref(cartOf()),
    } as Parameters<typeof useSetup>[1]);
  }

  const criteria = { limit: 1 };

  it("keeps the POST call unchanged when cacheableReads is off", async () => {
    const { vm, injections } = setup({ cacheableReads: false });

    await vm.invokeRead("readLanguages post /language");
    await vm.invokeRead("readCountry post /country", { body: criteria });

    expect(injections.apiClient.invoke).toHaveBeenNthCalledWith(
      1,
      "readLanguages post /language",
    );
    expect(injections.apiClient.invoke).toHaveBeenNthCalledWith(
      2,
      "readCountry post /country",
      { body: criteria },
    );
  });

  it("sends a default guest read as GET without the context token", async () => {
    const { vm, injections } = setup();

    await vm.invokeRead("readProductDetail post /product/{productId}", {
      headers: { "sw-include-seo-urls": true },
      pathParams: { productId: "product" },
      body: criteria,
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readProductDetailGet get /product/{productId}",
      {
        headers: { "sw-include-seo-urls": true, "sw-context-token": "" },
        pathParams: { productId: "product" },
        query: { _criteria: encodeForQuery(criteria) },
      },
    );
  });

  it("sends no _criteria for a read without a body", async () => {
    const { vm, injections } = setup({ defaultHeaders: {}, session: null });

    await vm.invokeRead("readLanguages post /language");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readLanguagesGet get /language",
      { headers: { "sw-context-token": "" }, query: {} },
    );
  });

  it("keeps POST when a per-call language header is not known to be default", async () => {
    const { vm, injections } = setup({ defaultHeaders: {}, session: null });
    const params = { headers: { "sw-language-id": "other" }, body: criteria };

    await vm.invokeRead("readSalutation post /salutation", params);

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readSalutation post /salutation",
      params,
    );
  });

  it("moves buildTree and depth of readNavigation to plain query params", async () => {
    const { vm, injections } = setup();

    await vm.invokeRead("readNavigation post /navigation/{activeId}/{rootId}", {
      pathParams: { activeId: "main", rootId: "main" },
      body: { buildTree: false as never, depth: 2, limit: 1 },
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readNavigationGet get /navigation/{activeId}/{rootId}",
      {
        headers: { "sw-context-token": "" },
        pathParams: { activeId: "main", rootId: "main" },
        query: {
          _criteria: encodeForQuery({ limit: 1 }),
          buildTree: false,
          depth: 2,
        },
      },
    );
  });

  it("checks the session on every request", async () => {
    const session = ref(guestSession());
    const { vm, injections } = setup({ session });

    await vm.invokeRead("readSalutation post /salutation");
    session.value = guestSession({ customer: { id: "customer" } });
    await vm.invokeRead("readSalutation post /salutation");

    expect(injections.apiClient.invoke).toHaveBeenNthCalledWith(
      1,
      "readSalutationGet get /salutation",
      expect.anything(),
    );
    expect(injections.apiClient.invoke).toHaveBeenNthCalledWith(
      2,
      "readSalutation post /salutation",
    );
  });
});
