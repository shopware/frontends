import { describe, expect, it } from "vitest";

import { firstQueryValue, toNumber } from "./routeQuery";

describe("firstQueryValue", () => {
  it("returns a plain string value", () => {
    expect(firstQueryValue("name-asc")).toBe("name-asc");
  });

  it("returns the first element of a repeated (array) param", () => {
    expect(firstQueryValue(["30", "45"])).toBe("30");
  });

  it("returns undefined for undefined", () => {
    expect(firstQueryValue(undefined)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(firstQueryValue(null)).toBeUndefined();
  });

  it("returns undefined for an empty array", () => {
    expect(firstQueryValue([])).toBeUndefined();
  });

  it("returns undefined when the first array element is null", () => {
    expect(firstQueryValue([null])).toBeUndefined();
  });
});

describe("toNumber", () => {
  it("parses an integer string", () => {
    expect(toNumber("15")).toBe(15);
  });

  it("parses a decimal string", () => {
    expect(toNumber("19.99")).toBe(19.99);
  });

  it("parses zero and negative values", () => {
    expect(toNumber("0")).toBe(0);
    expect(toNumber("-5")).toBe(-5);
  });

  it("returns undefined for undefined", () => {
    expect(toNumber(undefined)).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    expect(toNumber("")).toBeUndefined();
  });

  it("returns undefined for a non-numeric string", () => {
    expect(toNumber("abc")).toBeUndefined();
    expect(toNumber("12px")).toBeUndefined();
  });

  it("returns undefined for non-finite values", () => {
    expect(toNumber("Infinity")).toBeUndefined();
  });

  it("composes with firstQueryValue for repeated numeric params", () => {
    expect(toNumber(firstQueryValue(["30", "45"]))).toBe(30);
  });
});
