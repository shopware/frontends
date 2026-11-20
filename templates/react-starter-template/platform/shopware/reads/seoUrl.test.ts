import { beforeEach, describe, expect, it, vi } from "vitest";

import { createShopwareClient } from "../client";
import { resolveSeoPath } from "./seoUrl";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("../client", () => ({
  createShopwareClient: vi.fn(),
}));
vi.mock("./context", () => ({
  readSalesChannelContext: vi.fn(),
}));

const invoke = vi.fn();

const landingPage = {
  seoPathInfo: "Sale",
  routeName: "frontend.landing.page",
  foreignKey: "landing-1",
};
const category = {
  seoPathInfo: "Sale/",
  routeName: "frontend.navigation.page",
  foreignKey: "category-1",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createShopwareClient).mockReturnValue({
    invoke,
  } as unknown as ReturnType<typeof createShopwareClient>);
});

describe("resolveSeoPath", () => {
  it.each([
    ["/Sale", [category, landingPage], "landing-1"],
    ["/Sale/", [landingPage, category], "category-1"],
  ])(
    "prefers the row spelled exactly like %s",
    async (path, elements, foreignKey) => {
      invoke.mockResolvedValue({ data: { elements } });

      await expect(resolveSeoPath(path, null)).resolves.toMatchObject({
        foreignKey,
      });
    },
  );

  it("falls back to the other spelling when only that one exists", async () => {
    invoke.mockResolvedValue({ data: { elements: [category] } });

    await expect(resolveSeoPath("/Sale", null)).resolves.toEqual({
      routeName: "frontend.navigation.page",
      foreignKey: "category-1",
      seoPathInfo: "Sale/",
    });
  });

  it("maps a headless route name to its storefront route", async () => {
    invoke.mockResolvedValue({
      data: {
        elements: [
          {
            seoPathInfo: "Shirt/SW1",
            routeName: "store-api.product.detail",
            foreignKey: "product-1",
          },
        ],
      },
    });

    await expect(resolveSeoPath("/Shirt/SW1", null)).resolves.toMatchObject({
      routeName: "frontend.detail.page",
      foreignKey: "product-1",
    });
  });
});
