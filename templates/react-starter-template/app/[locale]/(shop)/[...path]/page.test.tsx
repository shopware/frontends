import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { readCategory } from "@/platform/shopware/reads/category";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { readProductDetail } from "@/platform/shopware/reads/product";
import { resolveSeoPath } from "@/platform/shopware/reads/seoUrl";

import { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("@/features/cms/components/NavigationPage", () => ({
  NavigationPage: () => null,
}));
vi.mock("@/features/cms/components/DetailPage", () => ({
  DetailPage: () => null,
}));
vi.mock("@/features/cms/components/LandingPage", () => ({
  LandingPage: () => null,
}));

vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveLanguageId: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/seoUrl", () => ({
  resolveSeoPath: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/category", () => ({
  readCategory: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/product", () => ({
  readProductDetail: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/landingPage", () => ({
  readLandingPage: vi.fn(),
}));

function props(locale: string, path: string[]) {
  return {
    params: Promise.resolve({ locale, path }),
    searchParams: Promise.resolve({}),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(resolveLanguageId).mockResolvedValue("language-pl");
});

describe("CatchAllPage generateMetadata", () => {
  it("resolves the path and reads the category in the page language", async () => {
    vi.mocked(resolveSeoPath).mockResolvedValue({
      routeName: "frontend.navigation.page",
      foreignKey: "category-1",
    });
    vi.mocked(readCategory).mockResolvedValue({
      name: "Clothing",
      translated: { name: "Odzież", metaDescription: "Opis" },
    } as unknown as Schemas["Category"]);

    await expect(
      generateMetadata(props("pl-PL", ["Clothing"])),
    ).resolves.toEqual({ title: "Odzież", description: "Opis" });

    expect(resolveLanguageId).toHaveBeenCalledExactlyOnceWith("pl-PL");
    expect(resolveSeoPath).toHaveBeenCalledExactlyOnceWith(
      "/Clothing",
      "language-pl",
    );
    expect(readCategory).toHaveBeenCalledExactlyOnceWith(
      "category-1",
      "language-pl",
    );
  });

  it("reads a product in the page language", async () => {
    vi.mocked(resolveSeoPath).mockResolvedValue({
      routeName: "frontend.detail.page",
      foreignKey: "product-1",
    });
    vi.mocked(readProductDetail).mockResolvedValue({
      product: { name: "Shirt", translated: { name: "Koszula" } },
    } as unknown as Schemas["ProductDetailResponse"]);

    const metadata = await generateMetadata(props("pl-PL", ["Shirt", "SW-1"]));

    expect(metadata.title).toBe("Koszula");
    expect(readProductDetail).toHaveBeenCalledExactlyOnceWith(
      "product-1",
      "language-pl",
    );
  });

  it.each([
    ["pl-PL", "Nie można znaleźć żądanej strony."],
    ["de-DE", "Die angeforderte Seite konnte nicht gefunden werden."],
  ])("titles an unknown %s path as not found", async (locale, title) => {
    vi.mocked(resolveSeoPath).mockResolvedValue(null);

    await expect(generateMetadata(props(locale, ["Missing"]))).resolves.toEqual(
      { title },
    );
  });

  it("titles a route the page does not render as not found", async () => {
    vi.mocked(resolveSeoPath).mockResolvedValue({
      routeName: "frontend.account.customer-group-registration.page",
      foreignKey: "group-1",
    });

    await expect(
      generateMetadata(props("pl-PL", ["Wholesale"])),
    ).resolves.toEqual({ title: "Nie można znaleźć żądanej strony." });
  });
});
