import { gunzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";
import { fakeClient } from "@/features/checkout/checkout.fixture";

import {
  currencyLabel,
  readCurrencies,
  toCurrencyOptions,
} from "./currencyOptions";
import { READ_TIMEOUT_MS } from "./readTimeout";

function decodeCriteria(encoded: unknown): unknown {
  if (typeof encoded !== "string") throw new Error("criteria is not a string");
  return JSON.parse(gunzipSync(Buffer.from(encoded, "base64url")).toString());
}

function currency(
  overrides: Partial<Schemas["Currency"]>,
): Schemas["Currency"] {
  return {
    id: "currency-eur",
    isoCode: "EUR",
    symbol: "€",
    name: "Euro",
    position: 1,
    ...overrides,
  } as Schemas["Currency"];
}

describe("currencyLabel", () => {
  it("names the ISO code with the symbol, like the Vue currency switcher", () => {
    expect(currencyLabel({ isoCode: "EUR", symbol: "€" })).toBe("EUR (€)");
    expect(currencyLabel({ isoCode: "USD", symbol: "$" })).toBe("USD ($)");
  });

  it("names only the ISO code when the currency has no symbol", () => {
    expect(currencyLabel({ isoCode: "CHF", symbol: "" })).toBe("CHF");
  });
});

describe("toCurrencyOptions", () => {
  it("keeps the order of the read and drops entries without an id", () => {
    expect(
      toCurrencyOptions([
        currency({ id: "currency-usd", isoCode: "USD", symbol: "$" }),
        null,
        currency({ id: "", isoCode: "XXX" }),
        currency({ id: "currency-chf", isoCode: "CHF", symbol: "" }),
      ]),
    ).toEqual([
      { id: "currency-usd", isoCode: "USD", label: "USD ($)" },
      { id: "currency-chf", isoCode: "CHF", label: "CHF" },
    ]);
  });
});

describe("readCurrencies", () => {
  it("reads the sales channel currencies over GET sorted by position, then name, with the read timeout", async () => {
    const { client, invocations } = fakeClient(() => [
      currency({}),
      currency({ id: "currency-gbp", isoCode: "GBP", symbol: "£" }),
    ]);

    await expect(readCurrencies(client)).resolves.toEqual([
      { id: "currency-eur", isoCode: "EUR", label: "EUR (€)" },
      { id: "currency-gbp", isoCode: "GBP", label: "GBP (£)" },
    ]);

    expect(invocations).toHaveLength(1);
    const [{ operation, params }] = invocations as [
      { operation: string; params: unknown },
    ];
    expect(operation).toBe("readCurrencyGet get /currency");
    const { query, fetchOptions } = params as {
      query: { _criteria: string };
      fetchOptions: unknown;
    };
    expect(Object.keys(query)).toEqual(["_criteria"]);
    expect(decodeCriteria(query._criteria)).toEqual({
      sort: [
        { field: "position", order: "ASC" },
        { field: "name", order: "ASC" },
      ],
    });
    expect(fetchOptions).toEqual({ timeout: READ_TIMEOUT_MS });
  });

  it("lets a failed read reject", async () => {
    const failure = new TypeError("Failed to fetch");
    const { client } = fakeClient(() => {
      throw failure;
    });

    await expect(readCurrencies(client)).rejects.toBe(failure);
  });
});
