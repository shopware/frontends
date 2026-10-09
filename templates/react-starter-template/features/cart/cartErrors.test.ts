import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { cartError, lineItem } from "./cart.fixture";
import {
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
    });
  });

  it("passes every other error through with its fields as params", () => {
    const error = cartError("promotion-not-found", "-CODE", "Not found");

    expect(resolveCartError(error, [])).toEqual({
      messageKey: "promotion-not-found",
      params: { ...error },
    });
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
      },
    ]);
  });

  it("resolves a stock error without line items to the empty variant", () => {
    const stock = cartError("product-stock-reached", STOCK_ITEM_ID);

    expect(toCartActionErrors({ errors: { [stock.key]: stock } })).toEqual([
      { messageKey: "product-stock-reached-empty" },
    ]);
  });

  it("returns no errors for a clean cart", () => {
    expect(toCartActionErrors({ errors: [], lineItems: [] })).toEqual([]);
  });
});
