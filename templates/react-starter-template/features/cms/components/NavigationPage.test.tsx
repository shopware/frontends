import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
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
    salesChannel: { navigationCategoryId: "root" },
  } as unknown as Schemas["SalesChannelContext"]);
});

describe("NavigationPage", () => {
  it("reads the category, its navigation and the context in the page language", async () => {
    const html = await renderToHtml(
      await NavigationPage({
        navigationId: "n",
        searchParams: {},
        locale: "de-DE",
        languageId: "language-de",
      }),
    );

    expect(readCategory).toHaveBeenCalledExactlyOnceWith("n", "language-de");
    expect(readNavigation).toHaveBeenCalledExactlyOnceWith(
      "n",
      2,
      "language-de",
    );
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
