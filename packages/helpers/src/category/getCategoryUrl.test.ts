import { describe, expect, it } from "vitest";
import { getCategoryUrl } from "./getCategoryUrl";

describe("getCategoryUrl", () => {
  it("should return / if passed category is an empty object", () => {
    expect(getCategoryUrl({} as any)).toBe("/");
  });

  it("should return / if passed category is undefined", () => {
    expect(getCategoryUrl(undefined as any)).toBe("/");
  });

  it("should return technical URL for navigation", () => {
    expect(
      getCategoryUrl({
        type: "link",
        linkType: "category",
        internalLink: "123",
      } as any)
    ).toBe("/navigation/123");
  });
  it("should return technical URL for product", () => {
    expect(
      getCategoryUrl({
        type: "link",
        linkType: "product",
        internalLink: "123",
      } as any)
    ).toBe("/detail/123");
  });

  it("should return technical URL for landing page", () => {
    expect(
      getCategoryUrl({
        type: "link",
        linkType: "landing_page",
        internalLink: "123",
      } as any)
    ).toBe("/landingPage/123");
  });

  it("should return external URL", () => {
    expect(
      getCategoryUrl({
        type: "link",
        externalLink: "https://shopware.com",
      } as any)
    ).toBe("https://shopware.com");
  });

  it("should return SEO URL", () => {
    expect(
      getCategoryUrl({
        type: "link",
        seoUrls: [{ seoPathInfo: "/test" }],
      } as any)
    ).toBe("/test");
  });

  it("should try to return SEO URL for unknown type", () => {
    expect(
      getCategoryUrl({
        type: "unknown",
        seoUrls: [{ seoPathInfo: "test" }],
      } as any)
    ).toBe("/test");
  });
  it("should try to return technical URL for unknown type", () => {
    expect(
      getCategoryUrl({
        type: "unknown",
        id: "123",
        linkType: "category",
      } as any)
    ).toBe("/navigation/123");
  });
});
