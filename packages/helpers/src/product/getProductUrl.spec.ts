import { describe, expect, it } from "vitest";
import { getProductUrl } from "./getProductUrl";

describe("Shopware helpers - getProductUrl", () => {
  it("should return product technical URL", () => {
    const result = getProductUrl({ id: "qwerty" });
    expect(result).toEqual("/detail/qwerty");
  });

  it("should return default URL if seoUrls is undefined", () => {
    const result = getProductUrl({ id: "qwerty", seoUrls: undefined });
    expect(result).toEqual("/detail/qwerty");
  });

  it("should return default url for no product", () => {
    const result = getProductUrl(undefined);
    expect(result).toEqual("/");
  });
  it("should return seo URL if available", () => {
    const result = getProductUrl({
      id: "qwerty",
      seoUrls: [
        {
          seoPathInfo: "pretty-url/012345",
        },
      ],
    });
    expect(result).toEqual("/pretty-url/012345");
  });
});
