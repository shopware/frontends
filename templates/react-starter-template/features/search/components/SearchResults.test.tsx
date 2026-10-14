import type { CmsElementProductListingResultsProps } from "@shopware/cms-base-layer-react";
import type { SwProductListingFiltersProps } from "@shopware/cms-base-layer-react/client";
import { notFound } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { apiClientError } from "@/features/session/session.fixture";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";
import { readProductSearch } from "@/platform/shopware/reads/productSearch";
import { renderToHtml } from "@/test/render";

import { searchListing } from "../search.fixture";
import { SearchResults } from "./SearchResults";
import type { SearchResultsProps } from "./SearchResults";

vi.mock("server-only", () => ({}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@shopware/cms-base-layer-react/client", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@shopware/cms-base-layer-react/client")
  >()),
  SwProductListingFilters: ({
    filters,
    sortOptions,
    currentSort,
    isProductSearch,
    rootCategoryId,
  }: SwProductListingFiltersProps) => (
    <div
      data-testid="listing-filters"
      data-product-search={String(isProductSearch)}
      data-root-category={rootCategoryId}
      data-sort={currentSort}
      data-sort-options={sortOptions?.map(({ key }) => key).join(",")}
    >
      {filters.map(({ code }) => (
        <span key={code} data-testid={`listing-filter-${code}`} />
      ))}
    </div>
  ),
}));

vi.mock("@shopware/cms-base-layer-react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@shopware/cms-base-layer-react")>()),
  CmsElementProductListingResults: ({
    productCount,
    limit,
    total,
    current,
    isProductSearch,
    children,
  }: CmsElementProductListingResultsProps) => (
    <div
      data-testid="listing-results"
      data-product-count={productCount}
      data-limit={limit}
      data-pages={total}
      data-current={current}
      data-product-search={String(isProductSearch)}
    >
      {children}
    </div>
  ),
}));

vi.mock("@/platform/shopware/reads/productSearch", () => ({
  readProductSearch: vi.fn(),
}));

vi.mock("@/platform/shopware/reads/context", () => ({
  readSalesChannelContext: vi.fn(),
}));

const SHIRTS = "0190a1b2c3d4e5f60718293a4b5c6d7e";

async function render(props: Partial<SearchResultsProps> = {}) {
  return renderToHtml(
    await SearchResults({
      searchParams: { search: "shirt" },
      locale: "en-GB",
      languageId: "language-1",
      ...props,
    }),
  );
}

function count(html: string, testId: string): number {
  return html.split(`data-testid="${testId}"`).length - 1;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readProductSearch).mockResolvedValue(searchListing());
  vi.mocked(readSalesChannelContext).mockResolvedValue({
    context: { taxState: "gross" },
    currency: { isoCode: "EUR" },
    salesChannel: { navigationCategoryId: "root" },
  } as unknown as Schemas["SalesChannelContext"]);
});

describe("SearchResults", () => {
  it("reads the search in the page language and heads the results with the term", async () => {
    const html = await render();

    expect(readProductSearch).toHaveBeenCalledExactlyOnceWith(
      "shirt",
      { p: 1 },
      [],
      "language-1",
    );
    expect(readSalesChannelContext).toHaveBeenCalledWith("language-1");
    expect(html).toContain('data-testid="search-results-container"');
    expect(html).toMatch(
      /<h1[^>]*>Search Result for(<!-- -->)? &quot;<strong>shirt<\/strong>&quot;<\/h1>/,
    );
    expect(count(html, "product-box-product-name-link")).toBe(2);
    expect(html).toContain('href="/Linen-Shirt/product-1"');
  });

  it("pages the results by the page size and the page the backend answered", async () => {
    vi.mocked(readProductSearch).mockResolvedValue(
      searchListing({ total: 49, limit: 24, page: 2 }),
    );

    const html = await render();

    const results = html.match(/<div data-testid="listing-results"[^>]*>/)?.[0];
    expect(results).toContain('data-product-count="2"');
    expect(results).toContain('data-limit="24"');
    expect(results).toContain('data-pages="3"');
    expect(results).toContain('data-current="2"');
    expect(results).toContain('data-product-search="true"');
  });

  it("reads the normalized term with the listing parameters and the valid category ids of the URL", async () => {
    await render({
      searchParams: {
        search: ["  linen   shirt ", "ignored"],
        p: "2",
        limit: "1",
        order: "price-asc",
        manufacturer: "maker-1",
        categories: `${SHIRTS}|bogus`,
      },
    });

    expect(readProductSearch).toHaveBeenCalledExactlyOnceWith(
      "linen shirt",
      { p: 2, limit: 1, order: "price-asc", manufacturer: "maker-1" },
      [SHIRTS],
      "language-1",
    );
  });

  it("renders the filters of a product search, the categories filter included, beside the results", async () => {
    const html = await render();

    expect(html).toMatch(/<aside aria-label="Filters"/);
    const filters = html.match(/<div data-testid="listing-filters"[^>]*>/)?.[0];
    expect(filters).toContain('data-product-search="true"');
    expect(filters).toContain('data-root-category="root"');
    expect(filters).toContain('data-sort="score"');
    expect(filters).toContain('data-sort-options="score,price-asc"');
    expect(html).toContain('data-testid="listing-filter-manufacturer"');
    expect(html).toContain('data-testid="listing-filter-categories"');
    expect(html.indexOf("<aside")).toBeLessThan(
      html.indexOf('data-testid="product-box-product-name-link"'),
    );
  });

  it("shows only the heading when nothing matches and no filter is set", async () => {
    vi.mocked(readProductSearch).mockResolvedValue(
      searchListing({ elements: [], total: 0 }),
    );

    const html = await render();

    expect(html).toMatch(/<h1[^>]*>No products found<\/h1>/);
    expect(html).not.toContain("<aside");
    expect(html).not.toContain('data-testid="listing-filter');
    expect(html).not.toContain('data-testid="listing-results"');
  });

  it("keeps the filters while a filter is set, so it can be removed", async () => {
    vi.mocked(readProductSearch).mockResolvedValue(
      searchListing({ elements: [], total: 0 }),
    );

    const html = await render({
      searchParams: { search: "shirt", manufacturer: "maker-1" },
    });

    expect(html).toMatch(/<h1[^>]*>No products found<\/h1>/);
    expect(html).toContain("<aside");
    expect(html).toContain('data-testid="listing-filters"');
    expect(html).not.toContain('data-testid="listing-results"');
  });

  it.each([{}, { search: "   " }, { search: [] }])(
    "asks the user for a term without reading anything for %j",
    async (searchParams) => {
      const html = await render({ searchParams });

      expect(readProductSearch).not.toHaveBeenCalled();
      expect(html).toContain('data-testid="search-results-container"');
      expect(html).toMatch(/<h1[^>]*>Search<\/h1>/);
      expect(html).toContain("Enter a search term to find products.");
    },
  );

  it("names the page in a breadcrumb without structured data", async () => {
    const html = await render();

    expect(html).toMatch(/<span aria-current="page">Search<\/span>/);
    expect(html).not.toContain("application/ld+json");
  });

  it("translates the heading and the trail under pl-PL", async () => {
    const html = await render({ locale: "pl-PL" });

    expect(html).toMatch(
      /<h1[^>]*>Wynik wyszukiwania dla(<!-- -->)? &quot;<strong>shirt<\/strong>&quot;<\/h1>/,
    );
    expect(html).toMatch(/<span aria-current="page">Wyszukiwanie<\/span>/);
    expect(html).toContain('href="/pl-PL/Linen-Shirt/product-1"');
  });

  it("answers not found for a page past the last one", async () => {
    vi.mocked(readProductSearch).mockRejectedValue(
      apiClientError([{ code: "PRODUCT__LISTING_PAGE_OUT_OF_RANGE" }], 404),
    );

    await expect(
      render({ searchParams: { search: "shirt", p: "9" } }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("lets any other failure reach the error boundary", async () => {
    const failure = apiClientError([{ code: "FRAMEWORK__INTERNAL" }], 500);
    vi.mocked(readProductSearch).mockRejectedValue(failure);

    await expect(render()).rejects.toBe(failure);
    expect(notFound).not.toHaveBeenCalled();
  });
});
