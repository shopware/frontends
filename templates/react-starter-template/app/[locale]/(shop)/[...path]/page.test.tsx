import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildRouteMetadata } from "@/platform/seo/routeMetadata";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
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
vi.mock(
  "@/features/account/customerGroup/CustomerGroupRegistrationPage",
  () => ({
    CustomerGroupRegistrationPage: () => null,
    customerGroupRegistrationMetadata: vi.fn(),
  }),
);

vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveLanguageId: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/seoUrl", () => ({
  resolveSeoPath: vi.fn(),
}));
vi.mock("@/platform/seo/routeMetadata", () => ({
  buildRouteMetadata: vi.fn(),
}));

function props(locale: string, path: string[], query = {}) {
  return {
    params: Promise.resolve({ locale, path }),
    searchParams: Promise.resolve(query),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(resolveLanguageId).mockResolvedValue("language-pl");
});

describe("CatchAllPage generateMetadata", () => {
  it("builds the metadata of the resolved route with the page language and listing page", async () => {
    const route = {
      routeName: "frontend.navigation.page",
      foreignKey: "category-1",
    } as const;
    vi.mocked(resolveSeoPath).mockResolvedValue(route);
    vi.mocked(buildRouteMetadata).mockResolvedValue({ title: "Odzież" });

    await expect(
      generateMetadata(props("pl-PL", ["Clothing"], { p: "2" })),
    ).resolves.toEqual({ title: "Odzież" });

    expect(resolveLanguageId).toHaveBeenCalledExactlyOnceWith("pl-PL");
    expect(resolveSeoPath).toHaveBeenCalledExactlyOnceWith(
      "/Clothing",
      "language-pl",
    );
    expect(buildRouteMetadata).toHaveBeenCalledExactlyOnceWith(route, {
      locale: "pl-PL",
      languageId: "language-pl",
      page: "2",
    });
  });

  it("passes the resolved SEO path of a customer group registration page on", async () => {
    const route = {
      routeName: "frontend.account.customer-group-registration.page",
      foreignKey: "group-1",
      seoPathInfo: "Wholesale",
    } as const;
    vi.mocked(resolveSeoPath).mockResolvedValue(route);
    vi.mocked(buildRouteMetadata).mockResolvedValue({ title: "Hurt" });

    await expect(
      generateMetadata(props("pl-PL", ["Wholesale"])),
    ).resolves.toEqual({ title: "Hurt" });
    expect(buildRouteMetadata).toHaveBeenCalledExactlyOnceWith(route, {
      locale: "pl-PL",
      languageId: "language-pl",
      page: undefined,
    });
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

  it("titles a route without metadata as not found", async () => {
    vi.mocked(resolveSeoPath).mockResolvedValue({
      routeName: "frontend.navigation.page",
      foreignKey: "category-1",
    });
    vi.mocked(buildRouteMetadata).mockResolvedValue(null);

    await expect(
      generateMetadata(props("pl-PL", ["Clothing"])),
    ).resolves.toEqual({ title: "Nie można znaleźć żądanej strony." });
  });

  it("falls back to the layout metadata when a read fails", async () => {
    vi.mocked(resolveSeoPath).mockResolvedValue({
      routeName: "frontend.detail.page",
      foreignKey: "product-1",
    });
    vi.mocked(buildRouteMetadata).mockRejectedValue(new Error("offline"));

    await expect(generateMetadata(props("pl-PL", ["Shirt"]))).resolves.toEqual(
      {},
    );
  });
});
