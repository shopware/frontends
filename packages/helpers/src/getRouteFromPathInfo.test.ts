import { describe, expect, it } from "vitest";
import { getRouteFromPathInfo, isTechnicalPath } from "./getRouteFromPathInfo";

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
