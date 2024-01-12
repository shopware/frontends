import { describe, expect, it } from "vitest";
import { buildUrlPrefix } from "./buildUrlPrefix";

describe("test with relativ url and string", () => {
  const prefix = "test";
  const url = "url";
  const result = "/test/url";

  it("should return correct string in url", () => {
    expect(buildUrlPrefix(url, prefix)).toBe(result);
  });
});

describe("test with relativ url and prefix", () => {
  const prefix = "test";
  const url = "/url";
  const result = "/test/url";

  it("should return correct string in url", () => {
    expect(buildUrlPrefix(url, prefix)).toBe(result);
  });
});

describe("test with relativ url and with empty prefix", () => {
  const prefix = "";
  const url = "/url";
  const result = "/url";

  it("should return correct string in url", () => {
    expect(buildUrlPrefix(url, prefix)).toBe(result);
  });
});

describe("test with relativ url and object", () => {
  const prefix = "test";
  const url = { path: "/url" };
  const result = "/test/url";

  it("object url path should be changed", () => {
    const output = buildUrlPrefix(url, prefix);
    expect(output).toMatchObject({ path: result });
  });
});

describe("test with relativ url and wrong object", () => {
  const prefix = "test";
  const url = {};

  it("path is not in url object", () => {
    const output = buildUrlPrefix(url, prefix);
    expect(output).toMatchObject({});
  });
});

describe("test with absolute url", () => {
  const prefix = "test";
  const url = "https://test.com/";
  const result = "https://test.com/";

  it("should return early without changes", () => {
    expect(buildUrlPrefix(url, prefix)).toBe(result);
  });
});
