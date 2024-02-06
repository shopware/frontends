import { describe, expect, it } from "vitest";
import { getProductName } from "./getProductName";

describe("Shopware helpers - getProductName", () => {
  it("should return empty string if argument wasn't provided", () => {
    const label = getProductName();
    expect(label).toBeNull();
  });

  it("should return default value if product was null", () => {
    const argument = { product: null };
    // @ts-expect-error type should be wrong here
    const label = getProductName(argument);
    expect(label).toBeNull();
  });

  it("should return translated name if it's possible", () => {
    const argument = {
      product: {
        name: "not translated name",
        translated: {
          name: "translated name",
        },
      },
    };
    const label = getProductName(argument);
    expect(label).toBe("translated name");
  });

  it("should return name if translated one does not exist", () => {
    const argument = {
      product: {
        name: "not translated name",
        translated: undefined,
      },
    };
    const label = getProductName(argument);
    expect(label).toBe("not translated name");
  });

  it("should return translated name if the base one does not exist", () => {
    const argument = {
      product: {
        name: null,
        translated: {
          name: "Existing",
        },
      },
    };
    // @ts-expect-error type should be wrong here
    const productName = getProductName(argument);
    expect(productName).toBe("Existing");
  });
});
