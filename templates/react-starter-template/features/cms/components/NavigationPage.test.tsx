import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { readBreadcrumbOrNothing } from "@/platform/shopware/reads/breadcrumb";
import { readCategory } from "@/platform/shopware/reads/category";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";
import { readLandingPage } from "@/platform/shopware/reads/landingPage";
import { readNavigation } from "@/platform/shopware/reads/navigation";
import { readProductDetail } from "@/platform/shopware/reads/product";
import { readProductListing } from "@/platform/shopware/reads/productListing";
import { renderToHtml } from "@/test/render";

import { DetailPage } from "./DetailPage";
import { LandingPage } from "./LandingPage";
import { NavigationPage } from "./NavigationPage";

vi.mock("server-only", () => ({}));

vi.mock("@/platform/shopware/reads/category", () => ({
  readCategory: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/navigation", () => ({
  readNavigation: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/productListing", () => ({
  readProductListing: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/context", () => ({
  readSalesChannelContext: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/product", () => ({
  readProductDetail: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/landingPage", () => ({
  readLandingPage: vi.fn(),
}));
vi.mock("@/platform/seo/clock", () => ({
  catalogNow: async () => Date.parse("2026-10-13T12:00:00Z"),
}));
vi.mock("@/platform/shopware/reads/breadcrumb", () => ({
  readBreadcrumbOrNothing: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveContentLanguage: async (locale: string) => ({
    languageId: null,
    contentLang: locale === "de-DE" ? "en-GB" : undefined,
  }),
}));

function breadcrumb(name: string, path: string): Schemas["Breadcrumb"] {
  return {
    categoryId: `${name}-id`,
    name,
    path,
    type: "page",
    translated: { name },
  } as unknown as Schemas["Breadcrumb"];
}

function anchor(html: string, text: string): string {
  const match = html.match(new RegExp(`<a [^>]*>${text}</a>`));
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

function jsonLdBlocks(html: string): unknown[] {
  return [
    ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g),
  ].map((match) => JSON.parse(match[1] ?? "null"));
}

function pageWithListing(listing: object): Schemas["CmsPage"] {
  return {
    sections: [
      {
        blocks: [{ slots: [{ type: "product-listing", data: { listing } }] }],
      },
    ],
  } as unknown as Schemas["CmsPage"];
}

const listingPage = pageWithListing({});

const categoryNavigationPage = {
  sections: [
    {
      id: "s",
      apiAlias: "cms_section",
      type: "default",
      blocks: [
        {
          id: "b",
          apiAlias: "cms_block",
          type: "category-navigation",
          slots: [
            {
              id: "slot",
              apiAlias: "cms_slot",
              type: "category-navigation",
              slot: "content",
              config: {},
            },
          ],
        },
      ],
    },
  ],
} as unknown as Schemas["CmsPage"];

const clothing = {
  id: "clothing",
  type: "page",
  name: "Clothing",
  translated: { name: "Clothing" },
  seoUrls: [{ seoPathInfo: "Clothing/" }],
  children: [],
} as unknown as Schemas["Category"];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readCategory).mockResolvedValue({
    id: "n",
    cmsPage: null,
  } as unknown as Schemas["Category"]);
  vi.mocked(readNavigation).mockResolvedValue([]);
  vi.mocked(readProductListing).mockResolvedValue(
    {} as Schemas["ProductListingResult"],
  );
  vi.mocked(readSalesChannelContext).mockResolvedValue({
    context: { taxState: "gross" },
    currency: { isoCode: "EUR" },
    salesChannel: { navigationCategoryId: "root" },
  } as unknown as Schemas["SalesChannelContext"]);
  vi.mocked(readBreadcrumbOrNothing).mockResolvedValue([]);
  vi.unstubAllEnvs();
});

describe("NavigationPage", () => {
  it("reads the category and the context in the page language", async () => {
    const html = await renderToHtml(
      await NavigationPage({
        navigationId: "n",
        searchParams: {},
        locale: "de-DE",
        languageId: "language-de",
      }),
    );

    expect(readCategory).toHaveBeenCalledExactlyOnceWith("n", "language-de");
    expect(readNavigation).not.toHaveBeenCalled();
    expect(readSalesChannelContext).toHaveBeenCalledExactlyOnceWith(
      "language-de",
    );
    expect(readProductListing).not.toHaveBeenCalled();
    expect(html).toContain("Dieser Kategorie ist kein Layout zugewiesen.");
  });

  it("reads a requested listing in the page language", async () => {
    vi.mocked(readCategory).mockResolvedValue({
      id: "n",
      cmsPage: listingPage,
    } as unknown as Schemas["Category"]);

    await NavigationPage({
      navigationId: "n",
      searchParams: { order: "price-asc" },
      locale: "pl-PL",
      languageId: "language-pl",
    });

    expect(readProductListing).toHaveBeenCalledExactlyOnceWith(
      "n",
      expect.objectContaining({ order: "price-asc" }),
      "language-pl",
    );
  });
});

describe("NavigationPage listing pages", () => {
  it("reads further pages with the page size and sorting of the CMS listing, not hardcoded ones", async () => {
    vi.mocked(readCategory).mockResolvedValue({
      id: "n",
      cmsPage: pageWithListing({ limit: 24, sorting: "topseller", page: 1 }),
    } as unknown as Schemas["Category"]);

    await NavigationPage({
      navigationId: "n",
      searchParams: { p: "2" },
      locale: "en-GB",
      languageId: null,
    });

    expect(readProductListing).toHaveBeenCalledExactlyOnceWith(
      "n",
      { p: 2, limit: 24, order: "topseller" },
      null,
    );
  });

  it("lets the URL limit and order win over the CMS listing", async () => {
    vi.mocked(readCategory).mockResolvedValue({
      id: "n",
      cmsPage: pageWithListing({ limit: 24, sorting: "topseller" }),
    } as unknown as Schemas["Category"]);

    await NavigationPage({
      navigationId: "n",
      searchParams: { p: "3", limit: "30", order: "price-asc" },
      locale: "en-GB",
      languageId: null,
    });

    expect(readProductListing).toHaveBeenCalledExactlyOnceWith(
      "n",
      { p: 3, limit: 30, order: "price-asc" },
      null,
    );
  });

  it("leaves limit and order to the backend when the CMS listing has none", async () => {
    vi.mocked(readCategory).mockResolvedValue({
      id: "n",
      cmsPage: listingPage,
    } as unknown as Schemas["Category"]);

    await NavigationPage({
      navigationId: "n",
      searchParams: { p: "2" },
      locale: "en-GB",
      languageId: null,
    });

    expect(readProductListing).toHaveBeenCalledExactlyOnceWith(
      "n",
      { p: 2 },
      null,
    );
  });
});

describe("DetailPage", () => {
  it("reads the product and the context in the page language", async () => {
    vi.mocked(readProductDetail).mockResolvedValue({
      product: { id: "p", cmsPage: null },
    } as unknown as Schemas["ProductDetailResponse"]);

    const html = await renderToHtml(
      await DetailPage({
        productId: "p",
        locale: "de-DE",
        languageId: "language-de",
      }),
    );

    expect(readProductDetail).toHaveBeenCalledExactlyOnceWith(
      "p",
      "language-de",
    );
    expect(readSalesChannelContext).toHaveBeenCalledExactlyOnceWith(
      "language-de",
    );
    expect(html).toContain("Diesem Produkt ist kein Layout zugewiesen.");
  });
});

describe("LandingPage", () => {
  it("reads the landing page and the context in the page language", async () => {
    vi.mocked(readLandingPage).mockResolvedValue({
      id: "l",
      cmsPage: null,
    } as unknown as Schemas["LandingPage"]);

    const html = await renderToHtml(
      await LandingPage({
        landingPageId: "l",
        locale: "de-DE",
        languageId: "language-de",
      }),
    );

    expect(readLandingPage).toHaveBeenCalledExactlyOnceWith("l", "language-de");
    expect(readSalesChannelContext).toHaveBeenCalledExactlyOnceWith(
      "language-de",
    );
    expect(html).toContain("Dieser Landingpage ist kein Layout zugewiesen.");
  });
});

describe("catalog breadcrumbs", () => {
  it("renders the category trail after a home link in the page locale", async () => {
    vi.mocked(readBreadcrumbOrNothing).mockResolvedValue([
      breadcrumb("Furniture", "Furniture/"),
      breadcrumb("Chairs", "Furniture/Chairs/"),
    ]);

    const html = await renderToHtml(
      await NavigationPage({
        navigationId: "n",
        searchParams: {},
        locale: "de-DE",
        languageId: "language-de",
      }),
    );

    expect(readBreadcrumbOrNothing).toHaveBeenCalledExactlyOnceWith(
      "n",
      "category",
      "language-de",
    );
    expect(html).toMatch(/<nav aria-label="[^"]+"[^>]*><ol/);
    expect(anchor(html, "Startseite")).toContain('href="/de-DE"');
    const furniture = anchor(html, "Furniture");
    expect(furniture).toMatch(/href="\/de-DE\/Furniture\/?"/);
    expect(furniture).toContain('lang="en-GB"');
    expect(furniture).not.toContain("aria-current");
    const chairs = anchor(html, "Chairs");
    expect(chairs).toMatch(/href="\/de-DE\/Furniture\/Chairs\/?"/);
    expect(chairs).toContain('aria-current="page"');
  });

  it("skips the trail on the home page", async () => {
    const html = await renderToHtml(
      await NavigationPage({
        navigationId: "root",
        searchParams: {},
        locale: "en-GB",
        languageId: null,
        isHome: true,
      }),
    );

    expect(readBreadcrumbOrNothing).not.toHaveBeenCalled();
    expect(html).not.toContain("<nav");
  });

  it("adds the product to its trail and describes it as structured data", async () => {
    vi.stubEnv("STOREFRONT_URL", "https://shop.test");
    vi.mocked(readBreadcrumbOrNothing).mockResolvedValue([
      breadcrumb("Chairs", "Chairs/"),
    ]);
    vi.mocked(readProductDetail).mockResolvedValue({
      product: {
        id: "variant-1",
        productNumber: "SW-1",
        name: "Oak Chair",
        translated: { name: "Oak Chair" },
        seoUrls: [{ seoPathInfo: "Oak-Chair/SW-1" }],
        calculatedPrice: { unitPrice: 99.5 },
        calculatedPrices: [],
        stock: 5,
        cmsPage: null,
      },
    } as unknown as Schemas["ProductDetailResponse"]);

    const html = await renderToHtml(
      await DetailPage({
        productId: "parent-1",
        locale: "en-GB",
        languageId: null,
      }),
    );

    expect(readBreadcrumbOrNothing).toHaveBeenCalledExactlyOnceWith(
      "variant-1",
      "product",
      null,
    );
    const productCrumb = anchor(html, "Oak Chair");
    expect(productCrumb).toContain('href="/Oak-Chair/SW-1"');
    expect(productCrumb).toContain('aria-current="page"');
    const [trail, product] = jsonLdBlocks(html) as Record<string, unknown>[];
    expect(trail?.["@type"]).toBe("BreadcrumbList");
    expect(product).toMatchObject({
      "@type": "Product",
      url: "https://shop.test/Oak-Chair/SW-1",
      sku: "SW-1",
      offers: { "@type": "Offer", price: 99.5, priceCurrency: "EUR" },
    });
  });

  it("shows the landing page name as its only crumb", async () => {
    vi.mocked(readLandingPage).mockResolvedValue({
      id: "l",
      name: "Summer",
      translated: { name: "Summer" },
      cmsPage: null,
    } as unknown as Schemas["LandingPage"]);

    const html = await renderToHtml(
      await LandingPage({
        landingPageId: "l",
        locale: "en-GB",
        languageId: null,
      }),
    );

    expect(html).toMatch(/<span aria-current="page">Summer<\/span>/);
    expect(readBreadcrumbOrNothing).not.toHaveBeenCalled();
  });
});

describe("CMS category navigation", () => {
  it("lists the children of the category in the page language", async () => {
    vi.mocked(readCategory).mockResolvedValue({
      id: "n",
      cmsPage: categoryNavigationPage,
    } as unknown as Schemas["Category"]);
    vi.mocked(readNavigation).mockResolvedValue([clothing]);

    const html = await renderToHtml(
      await NavigationPage({
        navigationId: "n",
        searchParams: {},
        locale: "de-DE",
        languageId: "language-de",
      }),
    );

    expect(readNavigation).toHaveBeenCalledExactlyOnceWith(
      "n",
      2,
      "language-de",
    );
    expect(anchor(html, "Clothing")).toMatch(/href="\/de-DE\/Clothing\/?"/);
  });

  it("lists the main navigation on the home page", async () => {
    vi.mocked(readCategory).mockResolvedValue({
      id: "root",
      cmsPage: categoryNavigationPage,
    } as unknown as Schemas["Category"]);
    vi.mocked(readNavigation).mockResolvedValue([clothing]);

    const html = await renderToHtml(
      await NavigationPage({
        navigationId: "root",
        searchParams: {},
        locale: "en-GB",
        languageId: null,
        isHome: true,
      }),
    );

    expect(readNavigation).toHaveBeenCalledExactlyOnceWith(
      "main-navigation",
      2,
      null,
    );
    expect(anchor(html, "Clothing")).toMatch(/href="\/Clothing\/?"/);
  });

  it("renders the category without the sidebar when the navigation cannot be read", async () => {
    vi.mocked(readCategory).mockResolvedValue({
      id: "n",
      cmsPage: categoryNavigationPage,
    } as unknown as Schemas["Category"]);
    vi.mocked(readBreadcrumbOrNothing).mockResolvedValue([
      breadcrumb("Furniture", "Furniture/"),
    ]);
    const failure = new Error("offline");
    vi.mocked(readNavigation).mockRejectedValue(failure);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = await renderToHtml(
      await NavigationPage({
        navigationId: "n",
        searchParams: {},
        locale: "en-GB",
        languageId: null,
      }),
    );

    expect(anchor(html, "Furniture")).toMatch(/href="\/Furniture\/?"/);
    expect(html).not.toContain("Clothing");
    expect(error).toHaveBeenCalledExactlyOnceWith(
      "[CMS] reading the category navigation failed",
      failure,
    );
    error.mockRestore();
  });

  it("lists the main navigation on a landing page in the page language", async () => {
    vi.mocked(readLandingPage).mockResolvedValue({
      id: "l",
      cmsPage: categoryNavigationPage,
    } as unknown as Schemas["LandingPage"]);
    vi.mocked(readNavigation).mockResolvedValue([clothing]);

    const html = await renderToHtml(
      await LandingPage({
        landingPageId: "l",
        locale: "de-DE",
        languageId: "language-de",
      }),
    );

    expect(readNavigation).toHaveBeenCalledExactlyOnceWith(
      "main-navigation",
      2,
      "language-de",
    );
    expect(anchor(html, "Clothing")).toMatch(/href="\/de-DE\/Clothing\/?"/);
  });

  it("reads no navigation for a landing page whose layout has no category navigation", async () => {
    vi.mocked(readLandingPage).mockResolvedValue({
      id: "l",
      cmsPage: pageWithListing({}),
    } as unknown as Schemas["LandingPage"]);

    await LandingPage({
      landingPageId: "l",
      locale: "de-DE",
      languageId: "language-de",
    });

    expect(readNavigation).not.toHaveBeenCalled();
  });

  it("renders the landing page without the sidebar when the navigation cannot be read", async () => {
    vi.mocked(readLandingPage).mockResolvedValue({
      id: "l",
      name: "Summer",
      translated: { name: "Summer" },
      cmsPage: categoryNavigationPage,
    } as unknown as Schemas["LandingPage"]);
    const failure = new Error("offline");
    vi.mocked(readNavigation).mockRejectedValue(failure);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = await renderToHtml(
      await LandingPage({
        landingPageId: "l",
        locale: "en-GB",
        languageId: null,
      }),
    );

    expect(html).toMatch(/<span aria-current="page">Summer<\/span>/);
    expect(html).not.toContain("Clothing");
    expect(error).toHaveBeenCalledExactlyOnceWith(
      "[CMS] reading the category navigation failed",
      failure,
    );
    error.mockRestore();
  });

  it("lists the main navigation on a product page in the page language", async () => {
    vi.mocked(readProductDetail).mockResolvedValue({
      product: { id: "p", cmsPage: categoryNavigationPage },
    } as unknown as Schemas["ProductDetailResponse"]);
    vi.mocked(readNavigation).mockResolvedValue([clothing]);

    const html = await renderToHtml(
      await DetailPage({
        productId: "p",
        locale: "de-DE",
        languageId: "language-de",
      }),
    );

    expect(readNavigation).toHaveBeenCalledExactlyOnceWith(
      "main-navigation",
      2,
      "language-de",
    );
    expect(anchor(html, "Clothing")).toMatch(/href="\/de-DE\/Clothing\/?"/);
    expect(jsonLdBlocks(html)).toContainEqual(
      expect.objectContaining({ "@type": "Product" }),
    );
  });

  it("reads no navigation for a product whose layout has no category navigation", async () => {
    vi.mocked(readProductDetail).mockResolvedValue({
      product: { id: "p", cmsPage: pageWithListing({}) },
    } as unknown as Schemas["ProductDetailResponse"]);

    await DetailPage({
      productId: "p",
      locale: "de-DE",
      languageId: "language-de",
    });

    expect(readNavigation).not.toHaveBeenCalled();
  });
});
