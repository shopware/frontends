import { describe, expect, it } from "vitest";
import { encodeForQuery } from "./index";

describe("helpers/index", () => {
  it("should export encodeForQuery function", () => {
    expect(typeof encodeForQuery).toBe("function");
  });

  it("should work correctly when imported from helpers chunk", () => {
    const testObj = { test: "value", number: 42 };
    const result = encodeForQuery(testObj);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // Should be base64url encoded
    expect(result).not.toContain("+");
    expect(result).not.toContain("/");
    expect(result).not.toContain("=");
  });
});
