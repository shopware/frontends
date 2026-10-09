import type { Schemas } from "#shopware";

import type { CartErrorEntry } from "./cartErrors";

export function lineItem(
  overrides: Partial<Schemas["LineItem"]> = {},
): Schemas["LineItem"] {
  return {
    id: "product-1",
    referencedId: "product-1",
    label: "Aerodynamic Bag",
    quantity: 1,
    good: true,
    type: "product",
    cover: null,
    ...overrides,
  } as Schemas["LineItem"];
}

export function cartError(
  messageKey: string,
  keySuffix = "",
  message = messageKey,
): CartErrorEntry {
  return {
    code: 0,
    key: `${messageKey}${keySuffix}`,
    level: 10,
    message,
    messageKey,
  };
}

export function cartPrice(
  positionPrice: number,
  totalPrice: number,
): Schemas["CartPrice"] {
  return {
    apiAlias: "cart_price",
    calculatedTaxes: [],
    netPrice: totalPrice,
    positionPrice,
    rawTotal: totalPrice,
    taxRules: [],
    taxStatus: "gross",
    totalPrice,
  };
}

export function cart(
  overrides: Partial<Schemas["Cart"]> = {},
): Schemas["Cart"] {
  return {
    apiAlias: "cart",
    token: "context-token-1",
    lineItems: [],
    errors: [],
    deliveries: [],
    price: cartPrice(0, 0),
    ...overrides,
  };
}
