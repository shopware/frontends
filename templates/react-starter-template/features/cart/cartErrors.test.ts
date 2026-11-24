import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { cartError, lineItem } from "./cart.fixture";
import {
  CART_STATE_ERRORS,
  getCartErrors,
  resolveCartError,
  toCartActionErrors,
} from "./cartErrors";
import type { CartErrorEntry } from "./cartErrors";

const STOCK_ITEM_ID = "c29ad46d64474ef0b72845832f0d879b";

describe("getCartErrors", () => {
  it("returns every error of the keyed map", () => {
    const stock = cartError("product-stock-reached", STOCK_ITEM_ID);
    const blocked = cartError("shipping-method-blocked", "-UPS");

    expect(
      getCartErrors({
        errors: { [stock.key]: stock, [blocked.key]: blocked },
      }),
    ).toEqual([stock, blocked]);
  });

  it("drops the success codes", () => {
    const added = cartError("promotion-discount-added", "-SUMMER");
    const invalid = cartError("shipping-address-invalid");

    expect(
      getCartErrors({ errors: { [added.key]: added, [invalid.key]: invalid } }),
    ).toEqual([invalid]);
  });

  it.each([
    ["no errors", undefined],
    ["an empty list", []],
    ["a list", [cartError("product-not-found")] as Schemas["CartError"][]],
  ])("returns nothing for %s", (_, errors) => {
    expect(getCartErrors({ errors })).toEqual([]);
  });

  it("skips entries that are not cart errors", () => {
    const invalid = cartError("billing-address-invalid");

    expect(
      getCartErrors({
        errors: {
          broken: null,
          [invalid.key]: invalid,
        } as unknown as Schemas["Cart"]["errors"],
      }),
    ).toEqual([invalid]);
  });
});

describe("resolveCartError", () => {
  const stockReached = cartError(
    "product-stock-reached",
    STOCK_ITEM_ID,
    "The product Greta Glass is only available 5 times",
  );

  it("names the line item and its maximum for product-stock-reached", () => {
    expect(
      resolveCartError(stockReached, [
        lineItem({ id: "other", label: "Other" }),
        lineItem({
          id: STOCK_ITEM_ID,
          label: "Greta Glass",
          quantityInformation: { maxPurchase: 5 },
        }),
      ]),
    ).toEqual({
      messageKey: "product-stock-reached",
      params: { name: "Greta Glass", quantity: 5 },
      key: `product-stock-reached${STOCK_ITEM_ID}`,
      level: 10,
    });
  });

  it.each([
    ["the line item is missing", []],
    [
      "the line item has no label",
      [
        lineItem({
          id: STOCK_ITEM_ID,
          label: "",
          quantityInformation: { maxPurchase: 5 },
        }),
      ],
    ],
    [
      "the line item has no maximum",
      [lineItem({ id: STOCK_ITEM_ID, label: "Greta Glass" })],
    ],
  ])(
    "falls back to product-stock-reached-empty when %s",
    (_, lineItems: Schemas["LineItem"][]) => {
      expect(resolveCartError(stockReached, lineItems)).toEqual({
        messageKey: "product-stock-reached-empty",
        key: `product-stock-reached${STOCK_ITEM_ID}`,
        level: 10,
      });
    },
  );

  it("takes the shipping method name from the message", () => {
    expect(
      resolveCartError(
        cartError(
          "shipping-method-blocked",
          "-UPS",
          "shipping-method-blocked-UPS",
        ),
        [],
      ),
    ).toEqual({
      messageKey: "shipping-method-blocked",
      params: { name: "UPS" },
      key: "shipping-method-blocked-UPS",
      level: 10,
    });
  });

  it("uses an empty shipping method name without a message", () => {
    const error = {
      ...cartError("shipping-method-blocked", "-UPS"),
      message: undefined,
    } as unknown as CartErrorEntry;

    expect(resolveCartError(error, [])).toEqual({
      messageKey: "shipping-method-blocked",
      params: { name: "" },
      key: "shipping-method-blocked-UPS",
      level: 10,
    });
  });

  it("passes every other error through with its fields as params", () => {
    const error = cartError("promotion-not-found", "-CODE", "Not found", 20);

    expect(resolveCartError(error, [])).toEqual({
      messageKey: "promotion-not-found",
      params: { ...error },
      key: "promotion-not-found-CODE",
      level: 20,
    });
  });

  it.each([0, 10, 20] as const)("keeps the level %i", (level) => {
    expect(
      resolveCartError(cartError("promotion-excluded", "", "", level), []),
    ).toMatchObject({ level });
  });

  it.each([
    ["an unknown level", 30],
    ["a level sent as text", "10"],
    ["no level", undefined],
  ])("treats %s as an error", (_, level) => {
    const error = {
      ...cartError("product-not-found"),
      level,
    } as unknown as CartErrorEntry;

    expect(resolveCartError(error, [])).toMatchObject({ level: 20 });
  });
});

describe("toCartActionErrors", () => {
  it("resolves the errors against the line items of the same cart", () => {
    const stock = cartError("product-stock-reached", STOCK_ITEM_ID);
    const added = cartError("promotion-discount-added", "-SUMMER");

    expect(
      toCartActionErrors({
        errors: { [stock.key]: stock, [added.key]: added },
        lineItems: [
          lineItem({
            id: STOCK_ITEM_ID,
            label: "Greta Glass",
            quantityInformation: { maxPurchase: 2 },
          }),
        ],
      }),
    ).toEqual([
      {
        messageKey: "product-stock-reached",
        params: { name: "Greta Glass", quantity: 2 },
        key: stock.key,
        level: 10,
      },
    ]);
  });

  it("resolves a stock error without line items to the empty variant", () => {
    const stock = cartError("product-stock-reached", STOCK_ITEM_ID);

    expect(toCartActionErrors({ errors: { [stock.key]: stock } })).toEqual([
      { messageKey: "product-stock-reached-empty", key: stock.key, level: 10 },
    ]);
  });

  it("returns no errors for a clean cart", () => {
    expect(toCartActionErrors({ errors: [], lineItems: [] })).toEqual([]);
  });
});

function keyed(...errors: CartErrorEntry[]): Schemas["Cart"]["errors"] {
  return Object.fromEntries(errors.map((error) => [error.key, error]));
}

function notEligible(reason?: string): CartErrorEntry {
  const messageKey = reason
    ? `promotion-not-eligible-${reason}`
    : "promotion-not-eligible";
  return {
    ...cartError(messageKey, "", messageKey, 0),
    key: "promotion-not-eligible",
  };
}

function messageKeys(errors: { messageKey: string }[]): string[] {
  return errors.map(({ messageKey }) => messageKey);
}

describe("toCartActionErrors against the cart before a mutation", () => {
  const blockedUps = cartError("shipping-method-blocked", "-UPS");
  const blockedDhl = cartError("shipping-method-blocked", "-DHL");
  const stock = cartError("product-stock-reached", STOCK_ITEM_ID);

  it("leaves out the state errors the previous cart already had", () => {
    const previous = { errors: keyed(blockedUps, notEligible()) };

    expect(
      toCartActionErrors(
        { errors: keyed(blockedUps, notEligible()), lineItems: [] },
        previous,
      ),
    ).toEqual([]);
  });

  it("keeps a state error that is new, also when another one of its code repeats", () => {
    const errors = toCartActionErrors(
      { errors: keyed(blockedUps, blockedDhl), lineItems: [] },
      { errors: keyed(blockedUps) },
    );

    expect(errors.map(({ key }) => key)).toEqual([blockedDhl.key]);
  });

  it("always keeps one-shot errors, also when the previous cart had them", () => {
    const alreadyAdded = notEligible("already-added");
    const previous = { errors: keyed(stock, alreadyAdded) };

    expect(
      messageKeys(
        toCartActionErrors(
          { errors: keyed(stock, alreadyAdded), lineItems: [] },
          previous,
        ),
      ),
    ).toEqual([
      "product-stock-reached-empty",
      "promotion-not-eligible-already-added",
    ]);
  });

  it("reports a not-logged-in promotion after a one-shot error under the same key", () => {
    const previous = { errors: keyed(notEligible("already-added")) };

    expect(
      messageKeys(
        toCartActionErrors(
          { errors: keyed(notEligible("not-logged-in")), lineItems: [] },
          previous,
        ),
      ),
    ).toEqual(["promotion-not-eligible-not-logged-in"]);
  });

  it("reports a second promotion that is not eligible under the key the first one holds", () => {
    const promotionA = {
      ...notEligible(),
      name: "A",
      message: "Promotion A not eligible for cart!",
    };
    const promotionB = {
      ...notEligible(),
      name: "B",
      message: "Promotion B not eligible for cart!",
    };

    expect(
      toCartActionErrors(
        { errors: keyed(promotionB), lineItems: [] },
        { errors: keyed(promotionA) },
      ),
    ).toMatchObject([
      {
        messageKey: "promotion-not-eligible",
        params: { name: "B", message: "Promotion B not eligible for cart!" },
      },
    ]);
    expect(
      toCartActionErrors(
        { errors: keyed(promotionA), lineItems: [] },
        { errors: keyed(promotionA) },
      ),
    ).toEqual([]);
  });

  it("drops nothing without a previous cart", () => {
    const errors = keyed(blockedUps, notEligible());

    expect(messageKeys(toCartActionErrors({ errors, lineItems: [] }))).toEqual([
      "shipping-method-blocked",
      "promotion-not-eligible",
    ]);
    expect(
      messageKeys(toCartActionErrors({ errors, lineItems: [] }, null)),
    ).toEqual(["shipping-method-blocked", "promotion-not-eligible"]);
  });

  it("counts the calculator's promotion notices and the validator errors as states", () => {
    expect([...CART_STATE_ERRORS]).toEqual(
      expect.arrayContaining([
        "shipping-method-blocked",
        "payment-method-blocked",
        "billing-address-invalid",
        "promotion-not-eligible-not-logged-in",
        "promotion-not-eligible-specific-products",
      ]),
    );
    expect(CART_STATE_ERRORS.has("promotion-not-eligible-already-added")).toBe(
      false,
    );
    expect(CART_STATE_ERRORS.has("product-stock-reached")).toBe(false);
  });
});
