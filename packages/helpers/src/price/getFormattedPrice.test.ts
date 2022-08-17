import { describe, expect, it } from "vitest";
import { getFormattedPrice } from "./getFormattedPrice";

describe("Helpers - getFormattedPrice", () => {
  it("should return formatted price", () => {
    const price = getFormattedPrice("2", "$");
    expect(price).toEqual("2.00 $");
  });

  it("should return rtl formatted price", () => {
    const price = getFormattedPrice("2.11", "$", {
      direction: "rtl",
    });
    expect(price).toEqual("$ 2.11");
  });

  it("should return formatted price without decimals", () => {
    const price = getFormattedPrice("6", "$", {
      removeDecimals: true,
    });
    expect(price).toEqual("6 $");
  });

  it("should return formatted price without currency", () => {
    const price = getFormattedPrice("9", "$", {
      removeCurrency: true,
    });
    expect(price).toEqual("9.00");
  });
});
