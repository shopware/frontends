import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementProductListing as CmsElementProductListingContent } from "../../types";
import { CmsElementProductListing } from "./CmsElementProductListing";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={String(href)} {...props}>
      {children as never}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => {} }),
  usePathname: () => "/Clothing/",
  useSearchParams: () => new URLSearchParams(),
}));

const useListingNavigationSpy = vi.hoisted(() => vi.fn());

vi.mock("../../listing/useListingNavigation", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../listing/useListingNavigation")>();
  return {
    ...actual,
    useListingNavigation: (
      ...args: Parameters<typeof actual.useListingNavigation>
    ) => {
      useListingNavigationSpy(...args);
      return actual.useListingNavigation(...args);
    },
  };
});

function product(id: string, name: string): Schemas["Product"] {
  return {
    id,
    name,
    available: true,
    translated: { name },
    seoUrls: [{ seoPathInfo: `${name}/${id}` }],
    calculatedPrice: {
      unitPrice: 10,
      totalPrice: 10,
      quantity: 1,
      listPrice: null,
      regulationPrice: null,
      referencePrice: null,
      calculatedTaxes: [],
      taxRules: [],
    },
    calculatedPrices: [],
  } as unknown as Schemas["Product"];
}

function listing(
  overrides: Record<string, unknown> = {},
): Schemas["ProductListingResult"] {
  return {
    apiAlias: "product_listing",
    elements: [product("p-1", "Shirt"), product("p-2", "Hat")],
    total: 31,
    limit: 15,
    page: 2,
    sorting: "name-asc",
    availableSortings: [],
    aggregations: {},
    ...overrides,
  } as unknown as Schemas["ProductListingResult"];
}

function content(
  data: Schemas["ProductListingResult"] | undefined,
): CmsElementProductListingContent {
  return {
    id: "slot-listing",
    apiAlias: "cms_slot",
    type: "product-listing",
    slot: "content",
    blockId: "block-listing",
    config: { boxLayout: { source: "static", value: "standard" } },
    data: data ? { apiAlias: "cms_product_listing", listing: data } : undefined,
  } as unknown as CmsElementProductListingContent;
}

const registry = createCmsRegistry();

describe("CmsElementProductListing", () => {
  it("renders the product grid, the limit select and the pagination from the context listing", async () => {
    const html = await renderToHtml(
      <CmsElementProductListing
        content={content(listing({ elements: [] }))}
        ctx={createCmsContext({ registry, listing: listing() })}
        className="custom-slot"
      />,
    );

    expect(html).toContain(
      'class="max-w-2xl mx-auto lg:max-w-full custom-slot"',
    );
    expect(
      html.match(/data-testid="product-box-product-name-link"/g),
    ).toHaveLength(2);
    expect(html).toContain('href="/Shirt/p-1"');
    expect(html).not.toContain('data-testid="loading"');
    expect(html).not.toContain("No products found");
    expect(html).toContain('data-testid="listing-pagination-limit-select"');
    expect(html).toContain('<option value="1">1 Product</option>');
    expect(html).toContain(
      '<option value="15" selected="">15 Products</option>',
    );
    expect(html).toContain("Per Page:");
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('<span class="sr-only">Page </span>3</button>');
  });

  it("falls back to the listing of the slot and shows the empty message", async () => {
    const html = await renderToHtml(
      <CmsElementProductListing
        content={content(listing({ elements: [], total: 0 }))}
        ctx={createCmsContext({ registry })}
      />,
    );

    expect(html).toContain("No products found 😔");
    expect(html).not.toContain("product-box-product-name-link");
    expect(html).not.toContain("listing-pagination-limit-select");
  });

  it("uses the translations from the context", async () => {
    const html = await renderToHtml(
      <CmsElementProductListing
        content={content(undefined)}
        ctx={createCmsContext({
          registry,
          translations: { listing: { noProducts: "Keine Produkte" } },
        })}
      />,
    );

    expect(html).toContain("Keine Produkte");
  });

  it("keeps the search params on the search listing", async () => {
    useListingNavigationSpy.mockClear();

    await renderToHtml(
      <CmsElementProductListing
        content={content(listing())}
        ctx={createCmsContext({ registry, isProductSearch: true })}
      />,
    );

    expect(useListingNavigationSpy).toHaveBeenCalledWith({
      isProductSearch: true,
    });
  });

  it("drops the search params on the category listing", async () => {
    useListingNavigationSpy.mockClear();

    await renderToHtml(
      <CmsElementProductListing
        content={content(listing())}
        ctx={createCmsContext({ registry })}
      />,
    );

    expect(useListingNavigationSpy).toHaveBeenCalledWith({
      isProductSearch: false,
    });
  });
});
