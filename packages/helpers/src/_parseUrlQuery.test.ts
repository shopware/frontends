import { describe, expect, it } from "vitest";
import { _parseUrlQuery } from "./urlHelpers";

describe("_parseUrlQuery", () => {
  it("should return an empty object if query is null", () => {
    const query = null;
    const result = _parseUrlQuery(query);
    expect(result).toEqual({});
  });

  it("should return an empty object if query is not an object", () => {
    const query = "invalid query";
    const result = _parseUrlQuery(query);
    expect(result).toEqual({});
  });

  it("should parse JSON values in the query", () => {
    const query = {
      param1: '{"key": "value"}',
      param2: "[1, 2, 3]",
    };
    const result = _parseUrlQuery(query);
    expect(result.param1).toEqual({ key: "value" });
    expect(result.param2).toEqual([1, 2, 3]);
  });

  it("should handle invalid JSON values in the query", () => {
    const query = {
      param1: '{"key": "value}',
      param2: "invalid json",
    };
    const result = _parseUrlQuery(query);
    expect(result.param1).toBeUndefined();
    expect(result.param2).toBe("invalid json");
  });
});
