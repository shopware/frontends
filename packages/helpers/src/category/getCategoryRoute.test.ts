import { describe, expect, it } from "vitest";
import { getCategoryRoute } from "./getCategoryRoute";

describe("getCategoryRoute", () => {
  it("should return / if passed category is an empty object", () => {
    // @ts-expect-error type should be wrong here
    expect(getCategoryRoute({})).toEqual("/");
  });

  it("should return / if passed category is undefined", () => {
    // @ts-expect-error type should be wrong here
    expect(getCategoryRoute(undefined)).toEqual("/");
  });

  it("should return technical URL for navigation", () => {
    expect(
      getCategoryRoute({
        // @ts-expect-error type should be wrong here
        id: undefined,
        type: "link",
        linkType: "category",
        internalLink: "123",
      }),
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
        id: "123123123",
        type: "link",
        linkType: "product",
        internalLink: "123",
      }),
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
        id: "123123123",
        type: "link",
        linkType: "landing_page",
        internalLink: "123",
      }),
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
        id: "123123123",
        type: "link",
        externalLink: "https://shopware.com",
      }),
    ).toEqual("https://shopware.com");
  });

  it("should return SEO URL", () => {
    expect(
      getCategoryRoute({
        id: "123123123",
        type: "link",
        seoUrls: [{ seoPathInfo: "/test" }],
      }),
    ).toEqual("/test");
  });

  it("should return SEO URL for category page", () => {
    expect(
      getCategoryRoute({
        // @ts-expect-error type should be wrong here
        id: undefined,
        type: "page",
        seoUrls: [{ seoPathInfo: "summer-trends" }],
      }),
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
        id: "123123123",
        type: "unknown",
        seoUrls: [{ seoPathInfo: "test" }],
      }),
    ).toBe("/test");
  });
  it("should try to return technical URL for unknown type", () => {
    expect(
      getCategoryRoute({
        type: "unknown",
        id: "123",
        linkType: "category",
      }),
    ).toBe("/navigation/123");
  });
});
