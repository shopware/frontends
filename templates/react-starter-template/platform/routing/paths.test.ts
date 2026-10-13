import { describe, expect, it } from "vitest";

import {
  decodePathname,
  hasUnsafePathChar,
  isAppRoute,
  sameSeoPath,
  seoPathCandidates,
  toSeoPath,
} from "./paths";

describe("isAppRoute", () => {
  it.each([
    ["/account", true],
    ["/account/order", true],
    ["/checkout/cart", true],
    ["/wishlist", true],
    ["/accountancy/", false],
    ["/wishlists", false],
    ["/Clothing/", false],
    ["/", false],
  ])("%s: %s", (path, expected) => {
    expect(isAppRoute(path)).toBe(expected);
  });
});

describe("decodePathname", () => {
  it("decodes each segment and keeps a segment it cannot decode", () => {
    expect(decodePathname("/M%C3%B6bel/%E0%A4%A/x%20y")).toBe(
      "/Möbel/%E0%A4%A/x y",
    );
  });
});

describe("seoPathCandidates", () => {
  it("offers the path with and without the trailing slash", () => {
    expect(seoPathCandidates("/Clothing/")).toEqual(["Clothing", "Clothing/"]);
    expect(seoPathCandidates("/Main-product/SW1")).toEqual([
      "Main-product/SW1",
      "Main-product/SW1/",
    ]);
  });

  it("offers the decoded and the encoded spelling", () => {
    expect(seoPathCandidates("/M%C3%B6bel/")).toEqual([
      "Möbel",
      "Möbel/",
      "M%C3%B6bel",
      "M%C3%B6bel/",
    ]);
  });

  it("offers nothing for the root", () => {
    expect(seoPathCandidates("/")).toEqual([]);
  });
});

describe("toSeoPath and sameSeoPath", () => {
  it("adds exactly one leading slash", () => {
    expect(toSeoPath("Clothing/")).toBe("/Clothing/");
    expect(toSeoPath("/Clothing/")).toBe("/Clothing/");
    expect(toSeoPath("")).toBe("/");
  });

  it("compares decoded paths case and slash sensitively", () => {
    expect(sameSeoPath("Clothing/", "/Clothing/")).toBe(true);
    expect(sameSeoPath("M%C3%B6bel/", "/Möbel/")).toBe(true);
    expect(sameSeoPath("Möbel/", "/M%C3%B6bel/")).toBe(true);
    expect(sameSeoPath("Clothing/", "/clothing/")).toBe(false);
    expect(sameSeoPath("Clothing/", "/Clothing")).toBe(false);
  });
});

describe("hasUnsafePathChar", () => {
  it("flags backslashes and control characters", () => {
    expect(hasUnsafePathChar("Clothing/")).toBe(false);
    expect(hasUnsafePathChar("a\\b")).toBe(true);
    expect(hasUnsafePathChar("a\u0007b")).toBe(true);
    expect(hasUnsafePathChar("a\u007fb")).toBe(true);
  });
});
