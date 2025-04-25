import { describe, expect, it } from "vitest";
import { getCategoryUrl } from "./getCategoryUrl";

describe("getCategoryUrl", () => {
  it("should return / if passed category is an empty object", () => {
    // @ts-expect-error type should be wrong here
    expect(getCategoryUrl({})).toBe("/");
  });

  it("should return / if passed category is undefined", () => {
    // @ts-expect-error type should be wrong here
    expect(getCategoryUrl(undefined)).toBe("/");
  });

  it("should return technical URL for navigation", () => {
    expect(
      getCategoryUrl({
        id: "123123123",
        type: "link",
        linkType: "category",
        internalLink: "123",
      }),
    ).toBe("/navigation/123");
  });
  it("should return technical URL for product", () => {
    expect(
      getCategoryUrl({
        id: "123123123",
        type: "link",
        linkType: "product",
        internalLink: "123",
      }),
    ).toBe("/detail/123");
  });

  it("should return technical URL for landing page", () => {
    expect(
      getCategoryUrl({
        id: "123123123",
        type: "link",
        linkType: "landing_page",
        internalLink: "123",
      }),
    ).toBe("/landingPage/123");
  });

  it("should return external URL", () => {
    expect(
      getCategoryUrl({
        id: "123123123",
        type: "link",
        externalLink: "https://shopware.com",
      }),
    ).toBe("https://shopware.com");
  });

  it("should return SEO URL", () => {
    expect(
      getCategoryUrl({
        id: "123123123",
        type: "link",
        seoUrls: [{ seoPathInfo: "/test" }],
      }),
    ).toBe("/test");
  });

  it("should try to return SEO URL for unknown type", () => {
    expect(
      getCategoryUrl({
        id: "123123123",
        type: "unknown",
        seoUrls: [{ seoPathInfo: "test" }],
      }),
    ).toBe("/test");
  });
  it("should try to return technical URL for unknown type", () => {
    expect(
      getCategoryUrl({
        type: "unknown",
        id: "123",
        linkType: "category",
      }),
    ).toBe("/navigation/123");
  });
  it("should deal with uknown link type", () => {
    expect(
      getCategoryUrl({
        type: "unknown",
        id: "123",
        linkType: "unknown",
      }),
    ).toBe("/navigation/123");
  });
});
