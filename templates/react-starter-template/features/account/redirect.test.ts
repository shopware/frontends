import { describe, expect, it } from "vitest";

import { resolveRedirectFromSearch, resolveRedirectTarget } from "./redirect";

describe("resolveRedirectTarget", () => {
  it("falls back to the home page without a target", () => {
    expect(resolveRedirectTarget(null)).toBe("/");
    expect(resolveRedirectTarget(undefined)).toBe("/");
    expect(resolveRedirectTarget("")).toBe("/");
  });

  it("keeps same-origin paths", () => {
    expect(resolveRedirectTarget("/account")).toBe("/account");
    expect(resolveRedirectTarget("/Clothing/Men/?p=2")).toBe(
      "/Clothing/Men/?p=2",
    );
  });

  it("refuses absolute and protocol-relative targets", () => {
    expect(resolveRedirectTarget("https://example.com")).toBe("/");
    expect(resolveRedirectTarget("//example.com/path")).toBe("/");
    expect(resolveRedirectTarget("/\\example.com")).toBe("/");
    expect(resolveRedirectTarget("javascript:alert(1)")).toBe("/");
  });

  it("refuses targets the URL parser would turn into another origin", () => {
    expect(resolveRedirectTarget("/\t/evil.example")).toBe("/");
    expect(resolveRedirectTarget("/\n/evil.example")).toBe("/");
    expect(resolveRedirectTarget("/\r/evil.example")).toBe("/");
    expect(resolveRedirectTarget("/\t\\evil.example")).toBe("/");
    expect(resolveRedirectTarget("/account\u007f")).toBe("/");
  });

  it.each([
    "/.//evil.example",
    "/..//evil.example",
    "/%2e//evil.example",
    "/%2E%2E//evil.example",
    "/a/..//evil.example",
  ])("refuses %s, which normalizes to a protocol-relative path", (target) => {
    expect(resolveRedirectTarget(target)).toBe("/");
  });

  it("returns the normalized path the router will navigate to", () => {
    expect(resolveRedirectTarget("/Clothing/./Men/../Women/?p=2#top")).toBe(
      "/Clothing/Women/?p=2#top",
    );
  });

  it("uses the given fallback", () => {
    expect(resolveRedirectTarget(null, "/account")).toBe("/account");
    expect(resolveRedirectTarget("https://example.com", "/account")).toBe(
      "/account",
    );
  });
});

describe("resolveRedirectFromSearch", () => {
  it("reads the redirect query parameter", () => {
    expect(resolveRedirectFromSearch("?redirect=%2FClothing%2FMen%2F")).toBe(
      "/Clothing/Men/",
    );
    expect(resolveRedirectFromSearch("redirect=%2Faccount")).toBe("/account");
  });

  it("falls back to the home page without a usable parameter", () => {
    expect(resolveRedirectFromSearch("")).toBe("/");
    expect(resolveRedirectFromSearch("?redirect=")).toBe("/");
    expect(
      resolveRedirectFromSearch("?redirect=https%3A%2F%2Fexample.com"),
    ).toBe("/");
    expect(
      resolveRedirectFromSearch("?redirect=%2F%252e%2F%2Fevil.example"),
    ).toBe("/");
  });

  it("prefers an explicit target over the query parameter", () => {
    expect(resolveRedirectFromSearch("?redirect=%2FClothing", "/account")).toBe(
      "/account",
    );
    expect(
      resolveRedirectFromSearch("?redirect=%2FClothing", "//example.com"),
    ).toBe("/");
  });
});
