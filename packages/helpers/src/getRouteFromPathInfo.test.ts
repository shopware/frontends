import { describe, expect, it } from "vitest";

import {
  getCanonicalPathForTechnicalPath,
  getRouteFromPathInfo,
  isTechnicalPath,
} from "./getRouteFromPathInfo";

describe("getRouteFromPathInfo", () => {
  it("detects technical paths", () => {
    expect(isTechnicalPath("/navigation/123")).toBe(true);
    expect(isTechnicalPath("/detail/abc/")).toBe(true);
    expect(isTechnicalPath("/landingPage/landing-1")).toBe(true);
  });

  it("returns false for non-technical path", () => {
    expect(isTechnicalPath("/my-seo-path")).toBe(false);
  });

  it("returns navigation route info", () => {
    expect(getRouteFromPathInfo("/navigation/123")).toEqual({
      routeName: "frontend.navigation.page",
      foreignKey: "123",
    });
  });

  it("returns detail route info", () => {
    expect(getRouteFromPathInfo("/detail/abc")).toEqual({
      routeName: "frontend.detail.page",
      foreignKey: "abc",
    });
  });

  it("returns landing page route info", () => {
    expect(getRouteFromPathInfo("/landingPage/landing-1")).toEqual({
      routeName: "frontend.landing.page",
      foreignKey: "landing-1",
    });
  });

  it("normalizes trailing slash", () => {
    expect(getRouteFromPathInfo("/navigation/123/")).toEqual({
      routeName: "frontend.navigation.page",
      foreignKey: "123",
    });
  });

  it("returns null for SEO-style path", () => {
    expect(getRouteFromPathInfo("/my-seo-path")).toBeNull();
  });

  it("returns null for invalid technical path with extra segments", () => {
    expect(getRouteFromPathInfo("/navigation/123/extra")).toBeNull();
  });
});

describe("getCanonicalPathForTechnicalPath", () => {
  it.each([
    ["/navigation/category-id", "Category/Outdoor", "/Category/Outdoor"],
    ["/detail/product-id", "Product/Example", "/Product/Example"],
    ["/landingPage/landing-id", "Campaign/Summer", "/Campaign/Summer"],
  ])(
    "resolves mapped technical path %s",
    (technicalPath, seoPathInfo, expectedPath) => {
      expect(
        getCanonicalPathForTechnicalPath(technicalPath, { seoPathInfo }),
      ).toBe(expectedPath);
    },
  );

  it("normalizes leading and trailing slashes in the SEO path", () => {
    expect(
      getCanonicalPathForTechnicalPath("/detail/product-id/", {
        seoPathInfo: "/Product/Example/",
      }),
    ).toBe("/Product/Example");
  });

  it.each([undefined, {}, { seoPathInfo: undefined }, { seoPathInfo: null }])(
    "returns null without a usable SEO mapping",
    (seoUrl) => {
      expect(
        getCanonicalPathForTechnicalPath("/detail/product-id", seoUrl),
      ).toBeNull();
    },
  );

  it("resolves an empty SEO path to the storefront root", () => {
    expect(
      getCanonicalPathForTechnicalPath("/navigation/root-category-id", {
        seoPathInfo: "",
      }),
    ).toBe("/");
  });

  it("returns null for a non-technical request", () => {
    expect(
      getCanonicalPathForTechnicalPath("/Product/Example", {
        seoPathInfo: "Product/Example",
      }),
    ).toBeNull();
  });

  it("does not redirect to another technical path", () => {
    expect(
      getCanonicalPathForTechnicalPath("/detail/product-id", {
        seoPathInfo: "detail/other-product-id",
      }),
    ).toBeNull();
  });
});
