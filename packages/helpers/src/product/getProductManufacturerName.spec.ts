import { describe, expect, it } from "vitest";
import { getProductManufacturerName } from "./getProductManufacturerName";

interface ProductWithManufacturer {
  manufacturer?: {
    translated?: {
      name?: string;
    };
  };
}

describe("getProductManufacturerName", () => {
  it("should return the manufacturer name when available", () => {
    const product: ProductWithManufacturer = {
      manufacturer: {
        translated: {
          name: "Apple",
        },
      },
    };

    expect(getProductManufacturerName(product)).toBe("Apple");
  });

  it("should return empty string when manufacturer is undefined", () => {
    const product: ProductWithManufacturer = {};

    expect(getProductManufacturerName(product)).toBe("");
  });

  it("should return empty string when translated property is undefined", () => {
    const product: ProductWithManufacturer = {
      manufacturer: {},
    };

    expect(getProductManufacturerName(product)).toBe("");
  });

  it("should return empty string when name property is undefined", () => {
    const product: ProductWithManufacturer = {
      manufacturer: {
        translated: {},
      },
    };

    expect(getProductManufacturerName(product)).toBe("");
  });

  it("should return empty string when name is empty", () => {
    const product: ProductWithManufacturer = {
      manufacturer: {
        translated: {
          name: "",
        },
      },
    };

    expect(getProductManufacturerName(product)).toBe("");
  });

  it("should handle name with special characters", () => {
    const product: ProductWithManufacturer = {
      manufacturer: {
        translated: {
          name: "Möller & Co.",
        },
      },
    };

    expect(getProductManufacturerName(product)).toBe("Möller & Co.");
  });
});
