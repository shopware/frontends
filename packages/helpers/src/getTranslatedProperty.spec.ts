import { getTranslatedProperty } from "./getTranslatedProperty";
import { describe, expect, it } from "vitest";

describe("getTranslatedProperty function", () => {
  it("should return the translated property value", () => {
    const mockObject = {
      translated: {
        property: "translated property value",
      },
      property: "property value",
    };

    const result = getTranslatedProperty(mockObject, "property");
    expect(result).toBe("translated property value");
  });
});

describe("getTranslatedProperty function with wrong property key", () => {
  it("should return '' when the property is wrong", () => {
    const mockObject = {};
    // @ts-ignore
    const result = getTranslatedProperty(mockObject, "wrongProperty");
    expect(result).toBe("");
  });
});
