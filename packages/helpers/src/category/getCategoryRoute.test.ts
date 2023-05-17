import { describe, expect, it } from "vitest";
import { getCategoryRoute } from "./getCategoryRoute";

describe("getCategoryRoute", () => {
  it("should return / if passed category is an empty object", () => {
    expect(getCategoryRoute({} as any)).toEqual("/");
  });

  it("should return / if passed category is undefined", () => {
    expect(getCategoryRoute(undefined as any)).toEqual("/");
  });

  it("should return technical URL for navigation", () => {
    expect(
      getCategoryRoute({
        type: "link",
        linkType: "category",
        internalLink: "123",
      } as any)
    ).toEqual({
      path: "/navigation/123",
      state: {
        foreignKey: undefined,
        routeName: "frontend.navigation.page",
      },
    });
  });

  it("should return technical URL for product", () => {
    expect(
      getCategoryRoute({
        type: "link",
        linkType: "product",
        internalLink: "123",
      } as any)
    ).toEqual({
      path: "/detail/123",
      state: {
        foreignKey: "123",
        routeName: "frontend.detail.page",
      },
    });
  });

  it("should return technical URL for landing page", () => {
    expect(
      getCategoryRoute({
        type: "link",
        linkType: "landing_page",
        internalLink: "123",
      } as any)
    ).toEqual({
      path: "/landingPage/123",
      state: {
        foreignKey: "123",
        routeName: "frontend.landing.page",
      },
    });
  });

  it("should return external URL", () => {
    expect(
      getCategoryRoute({
        type: "link",
        externalLink: "https://shopware.com",
      } as any)
    ).toEqual("https://shopware.com");
  });

  it("should return SEO URL", () => {
    expect(
      getCategoryRoute({
        type: "link",
        seoUrls: [{ seoPathInfo: "/test" }],
      } as any)
    ).toEqual("/test");
  });

  it("should return SEO URL for category page", () => {
    expect(
      getCategoryRoute({
        type: "page",
        seoUrls: [{ seoPathInfo: "summer-trends" }],
      } as any)
    ).toEqual({
      path: "/summer-trends",
      state: {
        foreignKey: undefined,
        routeName: "frontend.navigation.page",
      },
    });
  });

  it("should try to return SEO URL for unknown type", () => {
    expect(
      getCategoryRoute({
        type: "unknown",
        seoUrls: [{ seoPathInfo: "test" }],
      } as any)
    ).toBe("/test");
  });
  it("should try to return technical URL for unknown type", () => {
    expect(
      getCategoryRoute({
        type: "unknown",
        id: "123",
        linkType: "category",
      } as any)
    ).toBe("/navigation/123");
  });
});
