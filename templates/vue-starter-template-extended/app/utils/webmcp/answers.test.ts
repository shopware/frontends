import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import {
  LISTING_INCLUDES,
  cartAnswer,
  cartWarnings,
  listingAnswer,
  pathWithoutLocale,
  productAnswer,
  productSummary,
  readCount,
  readPrice,
  readProductId,
  readText,
  shorten,
} from "./answers";

const ID = "019e6ec6e53f72edb6472e71f78cf831";

function product(fields: Record<string, unknown>) {
  return {
    id: ID,
    translated: { name: "Wooden iPlug" },
    available: true,
    calculatedPrice: { unitPrice: 98.09 },
    ...fields,
  } as unknown as Schemas["Product"];
}

describe("productSummary", () => {
  it("gives the price the cart charges for one, not the base price", () => {
    const summary = productSummary(
      product({
        calculatedPrices: [
          { unitPrice: 11797.77, quantity: 10 },
          { unitPrice: 7550.57, quantity: 11 },
        ],
        calculatedCheapestPrice: { unitPrice: 7550.57 },
      }),
    );
    expect(summary).toEqual({
      productId: ID,
      name: "Wooden iPlug",
      price: 11797.77,
      priceFrom: 7550.57,
    });
  });

  it("uses the base price without volume prices, and sends no equal priceFrom", () => {
    const summary = productSummary(
      product({ calculatedCheapestPrice: { unitPrice: 98.09 } }),
    );
    expect(summary).toEqual({
      productId: ID,
      name: "Wooden iPlug",
      price: 98.09,
    });
  });

  it("names the options and marks a product that cannot be bought", () => {
    const summary = productSummary(
      product({
        available: false,
        options: [{ translated: { name: "Red" } }, { name: "XL" }],
      }),
    );
    expect(summary).toMatchObject({ options: ["Red", "XL"], available: false });
  });
});

describe("LISTING_INCLUDES", () => {
  it("asks the Store API for every product field productSummary reads", () => {
    const read = new Set<string>();
    const tracked = new Proxy(
      product({
        calculatedPrices: [{ unitPrice: 10, quantity: 1 }],
        calculatedCheapestPrice: { unitPrice: 9 },
        options: [{ translated: { name: "Red" } }],
      }) as object,
      {
        get(target, key, receiver) {
          if (typeof key === "string") read.add(key);
          return Reflect.get(target, key, receiver);
        },
      },
    ) as Schemas["Product"];
    productSummary(tracked);
    expect([...read].sort()).toEqual(
      [...read].filter((key) => LISTING_INCLUDES.product.includes(key)).sort(),
    );
    expect(read.size).toBeGreaterThan(5);
  });
});

describe("productAnswer", () => {
  it("keeps a long product under 1500 characters", () => {
    const answer = productAnswer(
      product({
        translated: { name: "N".repeat(500) },
        options: Array.from({ length: 60 }, (_, index) => ({
          name: `Option ${index}`,
        })),
      }),
      {
        url: "/a-very-long-path",
        currency: "EUR",
        description: 'A "quoted" line. '.repeat(400),
      },
    );
    expect(JSON.stringify(answer).length).toBeLessThanOrEqual(1500);
    expect(answer.name).toHaveLength(150);
    expect(answer.options?.length).toBeLessThan(60);
    expect(answer.description.length).toBeGreaterThan(100);
    expect(answer).toMatchObject({ url: "/a-very-long-path", currency: "EUR" });
  });

  it("keeps a short description whole", () => {
    const answer = productAnswer(product({ availableStock: 7 }), {
      url: "/wooden-iplug",
      description: "Hand made.",
    });
    expect(answer).toMatchObject({ stock: 7, description: "Hand made." });
  });
});

describe("cartWarnings", () => {
  it("reads the problems from the cart the write returned", () => {
    const cart = {
      errors: {
        "product-stock-reached": {
          messageKey: "product-stock-reached",
          message: "Only 100 left",
        },
        "promotion-discount-added": {
          messageKey: "promotion-discount-added",
          message: "Discount added",
        },
      },
    } as unknown as Schemas["Cart"];
    expect(cartWarnings(cart).map(({ message }) => message)).toEqual([
      "Only 100 left",
    ]);
    expect(cartWarnings({ errors: [] } as unknown as Schemas["Cart"])).toEqual(
      [],
    );
  });
});

describe("reading agent input", () => {
  it("accepts numbers sent as text", () => {
    expect(readCount("2", "quantity", 1)).toBe(2);
    expect(readPrice("50", "maxPrice")).toBe(50);
    expect(readPrice(null, "maxPrice")).toBeUndefined();
    expect(readText("  candle ", "query")).toBe("candle");
  });

  it("says what is wrong with bad input", () => {
    expect(() => readCount("two", "quantity", 1)).toThrow("quantity must be");
    expect(() => readCount(1.5, "quantity", 1)).toThrow("whole number");
    expect(() => readCount(0, "quantity", 1)).toThrow("at least 1");
    expect(() => readPrice(-1, "maxPrice")).toThrow("maxPrice must be");
    expect(() => readPrice("cheap", "maxPrice")).toThrow("maxPrice must be");
    expect(() => readText("  ", "query")).toThrow("query must be");
    expect(() => readProductId("Wooden iPlug")).toThrow("productId must be");
    expect(readProductId(ID)).toBe(ID);
  });
});

describe("shorten", () => {
  it("keeps whole items that fit the room", () => {
    const items = ["aaaa", "bbbb", "cccc"];
    expect(shorten(items, 100)).toEqual(items);
    expect(shorten(items, 15)).toEqual(["aaaa", "bbbb"]);
    expect(shorten(items, 3)).toEqual([]);
  });
});

describe("cartAnswer", () => {
  const line = (index: number) =>
    ({
      id: `line-${index}`,
      type: "product",
      referencedId: `product-${index}`,
      label: `Product ${index}`,
      quantity: 1,
      price: { unitPrice: 10, totalPrice: 10 },
    }) as Schemas["LineItem"];

  it("gives products by productId and other lines by type", () => {
    const answer = cartAnswer(
      [
        {
          ...line(1),
          payload: { options: [{ option: "Red" }] },
        } as Schemas["LineItem"],
        { ...line(2), type: "promotion", label: "Winter sale" },
      ],
      { subtotal: 10, total: 15, currency: "EUR" },
    );
    expect(answer).toEqual({
      items: [
        {
          productId: "product-1",
          name: "Product 1",
          options: ["Red"],
          quantity: 1,
          unitPrice: 10,
          lineTotal: 10,
        },
        {
          type: "promotion",
          name: "Winter sale",
          quantity: 1,
          unitPrice: 10,
          lineTotal: 10,
        },
      ],
      subtotal: 10,
      total: 15,
      currency: "EUR",
    });
  });

  it("says how many lines it left out", () => {
    const lines = Array.from({ length: 30 }, (_, index) => line(index));
    const answer = cartAnswer(lines, { subtotal: 300, total: 300 });
    expect(answer.items.length).toBeLessThan(30);
    expect(answer.moreItems).toBe(30 - answer.items.length);
    expect(JSON.stringify(answer).length).toBeLessThanOrEqual(1500);
  });
});

describe("listingAnswer", () => {
  const listing = (count: number, total = count) =>
    ({
      total,
      elements: Array.from({ length: count }, () => product({})),
    }) as Schemas["ProductListingResult"];

  it("lists the products with no hint when all are shown", () => {
    const answer = listingAnswer(listing(3), { currency: "EUR", shown: true });
    expect(answer).toMatchObject({ total: 3, currency: "EUR" });
    expect(answer.products).toHaveLength(3);
    expect(answer).not.toHaveProperty("hint");
  });

  it("says how many products are not listed", () => {
    const answer = listingAnswer(listing(3, 13), { shown: true });
    expect(answer.hint).toBe(
      "Showing 3 of 13 products. Set minPrice or maxPrice to see others.",
    );
  });

  it("offers the categories when nothing is found", () => {
    const answer = listingAnswer(listing(0), {
      shown: true,
      categories: ["Candles"],
    });
    expect(answer.hint).toContain("No products found.");
    expect(answer.categories).toEqual(["Candles"]);
  });

  it("keeps both hints when nothing is found and the shopper moved on", () => {
    const answer = listingAnswer(listing(0), {
      shown: false,
      categories: ["Candles"],
    });
    expect(answer.hint).toContain("not on screen");
    expect(answer.hint).toContain("No products found.");
  });

  it("stays under 1500 characters with ten long products", () => {
    const answer = listingAnswer(listing(10, 100), {
      currency: "EUR",
      shown: true,
    });
    expect(JSON.stringify(answer).length).toBeLessThanOrEqual(1500);
  });
});

describe("pathWithoutLocale", () => {
  it("drops only a real language prefix", () => {
    expect(pathWithoutLocale("/de-DE/Calm-Drift/CND-002", "de-DE")).toBe(
      "/Calm-Drift/CND-002",
    );
    expect(pathWithoutLocale("/Calm-Drift/CND-002", "en-GB")).toBe(
      "/Calm-Drift/CND-002",
    );
    expect(pathWithoutLocale("/de-DEX/Calm-Drift", "de-DE")).toBe(
      "/de-DEX/Calm-Drift",
    );
  });
});
