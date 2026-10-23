import { describe, expect, it } from "vitest";

import { encodeForQuery, mergeRequestHeaders } from "./index";
import type { RequestHeaders } from "./index";

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

  it("should export mergeRequestHeaders with its RequestHeaders type", () => {
    const headers: RequestHeaders = { "sw-include-seo-urls": true };

    expect(mergeRequestHeaders(headers, undefined)).toEqual({
      "sw-include-seo-urls": "true",
    });
  });
});
