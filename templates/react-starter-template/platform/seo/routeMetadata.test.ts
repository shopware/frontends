import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { readCanonicalSeoPath } from "@/platform/shopware/reads/canonicalSeoPath";
import { readCategory } from "@/platform/shopware/reads/category";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";
import { readCustomerGroupRegistration } from "@/platform/shopware/reads/customerGroupRegistration";
import { readLandingPage } from "@/platform/shopware/reads/landingPage";
import { readLanguages } from "@/platform/shopware/reads/languages";
import { readProductDetail } from "@/platform/shopware/reads/product";

import { buildHomeMetadata, buildRouteMetadata } from "./routeMetadata";

vi.mock("server-only", () => ({}));
vi.mock("@/platform/shopware/reads/canonicalSeoPath", () => ({
  readCanonicalSeoPath: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/category", () => ({
  readCategory: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/context", () => ({
  readSalesChannelContext: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/customerGroupRegistration", () => ({
  readCustomerGroupRegistration: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/landingPage", () => ({
  readLandingPage: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/languages", () => ({
  readLanguages: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/product", () => ({
  readProductDetail: vi.fn(),
}));

const EN_AND_DE = [
  { id: "language-en", code: "en-GB" },
  { id: "language-de", code: "de-DE" },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STOREFRONT_URL", "https://shop.test");
  vi.mocked(readLanguages).mockResolvedValue([]);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function canonical(metadata: unknown): unknown {
  return (metadata as { alternates?: { canonical?: unknown } }).alternates
    ?.canonical;
}

function languages(metadata: unknown): unknown {
  return (metadata as { alternates?: { languages?: unknown } }).alternates
    ?.languages;
}

describe("buildRouteMetadata", () => {
  it("links a category page to its SEO URL in the locale with the listing page", async () => {
    vi.mocked(readCategory).mockResolvedValue({
      name: "Clothing",
      translated: { name: "Odzież" },
      seoUrls: [{ seoPathInfo: "Clothing/" }],
    } as unknown as Schemas["Category"]);

    const metadata = await buildRouteMetadata(
      { routeName: "frontend.navigation.page", foreignKey: "c1" },
      { locale: "pl-PL", languageId: "language-pl", page: "3" },
    );

    expect(readCategory).toHaveBeenCalledExactlyOnceWith("c1", "language-pl");
    expect(canonical(metadata)).toBe("https://shop.test/pl-PL/Clothing/?p=3");
    expect(metadata?.openGraph).toMatchObject({
      siteName: "Shopware Frontends Demo Store",
    });
  });

  it("links a product without an SEO URL to its technical path", async () => {
    vi.mocked(readProductDetail).mockResolvedValue({
      product: {
        id: "variant-1",
        name: "Chair",
        translated: { name: "Chair" },
      },
    } as unknown as Schemas["ProductDetailResponse"]);

    const metadata = await buildRouteMetadata(
      { routeName: "frontend.detail.page", foreignKey: "parent-1" },
      { locale: "en-GB", languageId: "language-en" },
    );

    expect(readProductDetail).toHaveBeenCalledExactlyOnceWith(
      "parent-1",
      "language-en",
    );
    expect(metadata?.title).toBe("Chair");
    expect(canonical(metadata)).toBe("https://shop.test/detail/variant-1");
  });

  it("links a landing page to its SEO URL", async () => {
    vi.mocked(readLandingPage).mockResolvedValue({
      name: "Summer",
      translated: { name: "Summer" },
      seoUrls: [{ seoPathInfo: "summer" }],
    } as unknown as Schemas["LandingPage"]);

    const metadata = await buildRouteMetadata(
      { routeName: "frontend.landing.page", foreignKey: "l1" },
      { locale: "de-DE", languageId: "language-de" },
    );

    expect(readLandingPage).toHaveBeenCalledExactlyOnceWith(
      "l1",
      "language-de",
    );
    expect(metadata?.title).toBe("Summer");
    expect(canonical(metadata)).toBe("https://shop.test/de-DE/summer");
  });

  it("titles a customer group registration page and links its SEO URL", async () => {
    vi.mocked(readCustomerGroupRegistration).mockResolvedValue({
      id: "g1",
      title: "Merchant registration",
      introduction: null,
      companyOnly: true,
      metaDescription: "Become a merchant",
    });

    const metadata = await buildRouteMetadata(
      {
        routeName: "frontend.account.customer-group-registration.page",
        foreignKey: "g1",
        seoPathInfo: "Merchants",
      },
      { locale: "pl-PL", languageId: "language-pl" },
    );

    expect(readCustomerGroupRegistration).toHaveBeenCalledExactlyOnceWith(
      "g1",
      "language-pl",
    );
    expect(metadata).toMatchObject({
      title: "Merchant registration",
      description: "Become a merchant",
    });
    expect(canonical(metadata)).toBe("https://shop.test/pl-PL/Merchants");
  });

  it("titles a customer group registration page without an SEO URL without a canonical", async () => {
    vi.mocked(readCustomerGroupRegistration).mockResolvedValue({
      id: "g1",
      title: "Merchant registration",
      introduction: null,
      companyOnly: false,
      metaDescription: null,
    });

    await expect(
      buildRouteMetadata(
        {
          routeName: "frontend.account.customer-group-registration.page",
          foreignKey: "g1",
        },
        { locale: "en-GB", languageId: null },
      ),
    ).resolves.toEqual({ title: "Merchant registration" });
  });

  it("links a category to its translations in the other storefront locales", async () => {
    vi.mocked(readLanguages).mockResolvedValue(EN_AND_DE);
    vi.mocked(readCanonicalSeoPath).mockResolvedValue("Clothing/");
    vi.mocked(readCategory).mockResolvedValue({
      id: "c1",
      name: "Bekleidung",
      translated: { name: "Bekleidung" },
      seoUrls: [{ seoPathInfo: "Bekleidung/" }],
    } as unknown as Schemas["Category"]);

    const metadata = await buildRouteMetadata(
      { routeName: "frontend.navigation.page", foreignKey: "c1" },
      { locale: "de-DE", languageId: "language-de", page: "3" },
    );

    expect(readCanonicalSeoPath).toHaveBeenCalledExactlyOnceWith(
      "frontend.navigation.page",
      "c1",
      "language-en",
    );
    expect(canonical(metadata)).toBe("https://shop.test/de-DE/Bekleidung/?p=3");
    expect(languages(metadata)).toEqual({
      "en-GB": "https://shop.test/Clothing/?p=3",
      "de-DE": "https://shop.test/de-DE/Bekleidung/?p=3",
      "x-default": "https://shop.test/Clothing/?p=3",
    });
  });

  it("looks up the translations of the rendered product, not of the requested id", async () => {
    vi.mocked(readLanguages).mockResolvedValue(EN_AND_DE);
    vi.mocked(readCanonicalSeoPath).mockResolvedValue("Chair/SW1.1");
    vi.mocked(readProductDetail).mockResolvedValue({
      product: {
        id: "variant-1",
        name: "Stuhl",
        translated: { name: "Stuhl" },
        seoUrls: [{ seoPathInfo: "Stuhl/SW1.1" }],
      },
    } as unknown as Schemas["ProductDetailResponse"]);

    const metadata = await buildRouteMetadata(
      { routeName: "frontend.detail.page", foreignKey: "parent-1" },
      { locale: "de-DE", languageId: "language-de" },
    );

    expect(readCanonicalSeoPath).toHaveBeenCalledExactlyOnceWith(
      "frontend.detail.page",
      "variant-1",
      "language-en",
    );
    expect(languages(metadata)).toMatchObject({
      "en-GB": "https://shop.test/Chair/SW1.1",
    });
  });

  it("links a landing page to its translations", async () => {
    vi.mocked(readLanguages).mockResolvedValue(EN_AND_DE);
    vi.mocked(readCanonicalSeoPath).mockResolvedValue("summer");
    vi.mocked(readLandingPage).mockResolvedValue({
      id: "l1",
      name: "Sommer",
      translated: { name: "Sommer" },
      seoUrls: [{ seoPathInfo: "sommer" }],
    } as unknown as Schemas["LandingPage"]);

    const metadata = await buildRouteMetadata(
      { routeName: "frontend.landing.page", foreignKey: "l1" },
      { locale: "de-DE", languageId: "language-de" },
    );

    expect(readCanonicalSeoPath).toHaveBeenCalledExactlyOnceWith(
      "frontend.landing.page",
      "l1",
      "language-en",
    );
    expect(languages(metadata)).toMatchObject({
      "de-DE": "https://shop.test/de-DE/sommer",
    });
  });

  it("gives a page without an SEO URL no translations", async () => {
    vi.mocked(readLanguages).mockResolvedValue(EN_AND_DE);
    vi.mocked(readProductDetail).mockResolvedValue({
      product: {
        id: "variant-1",
        name: "Chair",
        translated: { name: "Chair" },
      },
    } as unknown as Schemas["ProductDetailResponse"]);

    const metadata = await buildRouteMetadata(
      { routeName: "frontend.detail.page", foreignKey: "variant-1" },
      { locale: "en-GB", languageId: "language-en" },
    );

    expect(canonical(metadata)).toBe("https://shop.test/detail/variant-1");
    expect(languages(metadata)).toBeUndefined();
    expect(readCanonicalSeoPath).not.toHaveBeenCalled();
  });

  it("keeps the canonical when the translations cannot be read", async () => {
    vi.mocked(readLanguages).mockRejectedValue(new Error("offline"));
    vi.mocked(readCategory).mockResolvedValue({
      id: "c1",
      name: "Clothing",
      translated: { name: "Clothing" },
      seoUrls: [{ seoPathInfo: "Clothing/" }],
    } as unknown as Schemas["Category"]);

    const metadata = await buildRouteMetadata(
      { routeName: "frontend.navigation.page", foreignKey: "c1" },
      { locale: "en-GB", languageId: "language-en" },
    );

    expect(canonical(metadata)).toBe("https://shop.test/Clothing/");
    expect(languages(metadata)).toBeUndefined();
  });

  it("gives a customer group registration page no translations", async () => {
    vi.mocked(readLanguages).mockResolvedValue(EN_AND_DE);
    vi.mocked(readCustomerGroupRegistration).mockResolvedValue({
      id: "g1",
      title: "Merchant registration",
      introduction: null,
      companyOnly: true,
      metaDescription: null,
    });

    const metadata = await buildRouteMetadata(
      {
        routeName: "frontend.account.customer-group-registration.page",
        foreignKey: "g1",
        seoPathInfo: "Merchants",
      },
      { locale: "de-DE", languageId: "language-de" },
    );

    expect(languages(metadata)).toBeUndefined();
    expect(readLanguages).not.toHaveBeenCalled();
  });

  it("has nothing for other routes", async () => {
    await expect(
      buildRouteMetadata(
        { routeName: "frontend.other.page", foreignKey: "x" },
        { locale: "en-GB", languageId: null },
      ),
    ).resolves.toBeNull();
  });
});

describe("buildHomeMetadata", () => {
  it("reads the root category and links the locale home", async () => {
    vi.mocked(readSalesChannelContext).mockResolvedValue({
      salesChannel: { navigationCategoryId: "root" },
    } as unknown as Schemas["SalesChannelContext"]);
    vi.mocked(readCategory).mockResolvedValue({
      name: "Home",
      translated: { name: "Home", metaDescription: "Welcome" },
    } as unknown as Schemas["Category"]);

    const metadata = await buildHomeMetadata({
      locale: "pl-PL",
      languageId: "language-pl",
    });

    expect(readCategory).toHaveBeenCalledExactlyOnceWith("root", "language-pl");
    expect(canonical(metadata)).toBe("https://shop.test/pl-PL");
    expect(metadata.description).toBe("Welcome");
    expect(languages(metadata)).toBeUndefined();
  });

  it("links the home page of every locale with a language of its own", async () => {
    vi.mocked(readLanguages).mockResolvedValue(EN_AND_DE);
    vi.mocked(readSalesChannelContext).mockResolvedValue({
      salesChannel: { navigationCategoryId: "root" },
    } as unknown as Schemas["SalesChannelContext"]);
    vi.mocked(readCategory).mockResolvedValue({
      name: "Home",
      translated: { name: "Home" },
    } as unknown as Schemas["Category"]);

    const metadata = await buildHomeMetadata({
      locale: "de-DE",
      languageId: "language-de",
      page: "2",
    });

    expect(languages(metadata)).toEqual({
      "en-GB": "https://shop.test/?p=2",
      "de-DE": "https://shop.test/de-DE?p=2",
      "x-default": "https://shop.test/?p=2",
    });
    expect(readCanonicalSeoPath).not.toHaveBeenCalled();
  });
});
