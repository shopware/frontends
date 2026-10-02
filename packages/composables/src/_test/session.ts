import type { Schemas } from "#shopware";

export const salesChannel = {
  currencyId: "currency",
  countryId: "country",
  paymentMethodId: "payment",
  shippingMethodId: "shipping",
  languageId: "language",
};

export function guestSession(overrides: Record<string, unknown> = {}) {
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

export function cartOf(overrides: Record<string, unknown> = {}) {
  return {
    token: "token",
    lineItems: [],
    ...overrides,
  } as unknown as Schemas["Cart"];
}
