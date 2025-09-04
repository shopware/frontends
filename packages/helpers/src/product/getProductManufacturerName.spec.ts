import { describe, expect, it } from "vitest";
import { getProductManufacturerName } from "./getProductManufacturerName";

describe("getProductManufacturerName", () => {
  it("should return the manufacturer name when available", () => {
    const product = {
      manufacturer: {
        translated: {
          name: "Apple",
        },
      },
    };

    expect(getProductManufacturerName(product)).toBe("Apple");
  });

  it("should return empty string when manufacturer is undefined", () => {
    const product = {};

    expect(getProductManufacturerName(product)).toBe("");
  });

  it("should return empty string when translated property is undefined", () => {
    const product = {
      manufacturer: {},
    };

    expect(getProductManufacturerName(product)).toBe("");
  });

  it("should return empty string when name property is undefined", () => {
    const product = {
      manufacturer: {
        translated: {},
      },
    };

    expect(getProductManufacturerName(product)).toBe("");
  });

  it("should return empty string when name is empty", () => {
    const product = {
      manufacturer: {
        translated: {
          name: "",
        },
      },
    };

    expect(getProductManufacturerName(product)).toBe("");
  });

  it("should return empty string when product is null", () => {
    expect(getProductManufacturerName(null)).toBe("");
  });

  it("should return empty string when product is undefined", () => {
    expect(getProductManufacturerName(undefined)).toBe("");
  });

  it("should handle name with special characters", () => {
    const product = {
      manufacturer: {
        translated: {
          name: "Möller & Co.",
        },
      },
    };

    expect(getProductManufacturerName(product)).toBe("Möller & Co.");
  });
});
