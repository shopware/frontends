import { getProductRoute } from "./getProductRoute";
import { describe, expect, it } from "vitest";

describe("Shopware helpers - getProductRoute", () => {
  it("should return product technical URL", () => {
    const result = getProductRoute({ id: "qwerty" } as any);
    expect(result).toEqual({
      path: "/detail/qwerty",
      state: {
        foreignKey: "qwerty",
        routeName: "frontend.detail.page",
      },
    });
  });

  it("should return default URL if seoUrls is undefined", () => {
    const result = getProductRoute({ id: "qwerty", seoUrls: undefined } as any);
    expect(result).toEqual({
      path: "/detail/qwerty",
      state: {
        foreignKey: "qwerty",
        routeName: "frontend.detail.page",
      },
    });
  });

  it("should return default url for no product", () => {
    const result = getProductRoute(undefined as any);
    expect(result).toEqual({
      path: "/",
      state: {
        foreignKey: undefined,
        routeName: "frontend.detail.page",
      },
    });
  });
  it("should return seo URL if available", () => {
    const result = getProductRoute({
      id: "someProductId",
      seoUrls: [
        {
          seoPathInfo: "pretty-url/012345",
        },
      ],
    } as any);
    expect(result).toEqual({
      path: "/pretty-url/012345",
      state: {
        foreignKey: "someProductId",
        routeName: "frontend.detail.page",
      },
    });
  });
});
