import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementSidebarFilter as CmsElementSidebarFilterContent } from "../../types";
import { getClientListingFilters } from "./clientListingFilters";
import { CmsElementSidebarFilter } from "./CmsElementSidebarFilter";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => {} }),
  usePathname: () => "/Clothing/",
  useSearchParams: () => new URLSearchParams(),
}));

const content = {
  id: "slot-sidebar-filter",
  apiAlias: "cms_slot",
  type: "sidebar-filter",
  slot: "content",
  blockId: "block-sidebar-filter",
  config: {},
} as unknown as CmsElementSidebarFilterContent;

const listing = {
  apiAlias: "product_listing",
  elements: [],
  total: 0,
  limit: 15,
  page: 1,
  sorting: "name-asc",
  availableSortings: [
    { key: "name-asc", label: "Name A-Z", translated: { label: "Name A-Z" } },
  ],
  aggregations: {
    manufacturer: {
      entities: [{ id: "acme", name: "Acme", translated: { name: "Acme" } }],
    },
  },
} as unknown as Schemas["ProductListingResult"];

const registry = createCmsRegistry();

describe("CmsElementSidebarFilter", () => {
  it("renders the accordion filters inside a sidebar section", async () => {
    const html = await renderToHtml(
      <CmsElementSidebarFilter
        content={content}
        ctx={{
          ...createCmsContext({ registry, listing }),
          sectionLayout: "sidebar",
        }}
        className="custom-slot"
      />,
    );

    expect(html).toContain('class="custom-slot"');
    expect(html).toContain(">Filters<");
    expect(html).toContain('data-testid="listing-filter-manufacturer"');
    expect(html).toContain("Name A-Z");
  });

  it("renders the horizontal dropdown filters outside a sidebar section", async () => {
    const html = await renderToHtml(
      <CmsElementSidebarFilter
        content={content}
        ctx={createCmsContext({ registry, listing })}
      />,
    );

    expect(html).not.toContain(">Filters<");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("manufacturer");
    expect(html).toContain("Sort");
  });

  it("renders without a listing", async () => {
    const html = await renderToHtml(
      <CmsElementSidebarFilter
        content={content}
        ctx={createCmsContext({ registry })}
      />,
    );

    expect(html).toContain("Sort");
    expect(html).not.toContain("listing-filter-");
  });

  it("shows the category filter only on the search listing", async () => {
    const searchListing = {
      ...listing,
      aggregations: {
        categories: {
          entities: [{ id: "shoes", translated: { name: "Shoes" } }],
        },
      },
    } as unknown as Schemas["ProductListingResult"];
    const render = (isProductSearch: boolean) =>
      renderToHtml(
        <CmsElementSidebarFilter
          content={content}
          ctx={{
            ...createCmsContext({
              registry,
              isProductSearch,
              listing: searchListing,
            }),
            sectionLayout: "sidebar",
          }}
        />,
      );

    expect(await render(true)).toContain(
      'data-testid="listing-filter-categories"',
    );
    expect(await render(false)).not.toContain(
      'data-testid="listing-filter-categories"',
    );
  });
});

describe("getClientListingFilters", () => {
  it("reduces aggregation entities to id, translated name and count", () => {
    const filters = getClientListingFilters({
      manufacturer: {
        apiAlias: "product_manufacturer_aggregation",
        entities: [
          {
            id: "acme",
            name: "Acme",
            translated: { name: "ACME GmbH", customFields: {} },
            media: { id: "media", url: "https://cdn.example/logo.png" },
            seoUrls: [{ id: "seo" }],
            customFields: { foo: "bar" },
          },
        ],
      },
      properties: {
        entities: [
          {
            id: "color",
            name: "Color",
            translated: { name: "Farbe" },
            displayType: "color",
            options: [
              {
                id: "red",
                name: "Red",
                translated: { name: "Rot" },
                colorHexCode: "#ff0000",
                media: { id: "swatch" },
                group: { id: "color" },
              },
            ],
          },
        ],
      },
      price: { apiAlias: "stats_aggregation", min: 10, max: 250.5 },
      rating: { max: 4 },
      "shipping-free": { max: 1 },
    });

    expect(filters).toEqual([
      {
        code: "manufacturer",
        label: "manufacturer",
        entities: [{ id: "acme", name: "ACME GmbH" }],
      },
      {
        code: "properties",
        label: "Farbe",
        id: "color",
        name: "Farbe",
        options: [{ id: "red", name: "Rot" }],
      },
      { code: "price", label: "price", min: 10, max: 250.5 },
      { code: "rating", label: "rating", max: 4 },
      { code: "shipping-free", label: "shipping-free", max: 1 },
    ]);
  });

  it("keeps the category counts and drops the rest of the category entity", () => {
    const filters = getClientListingFilters({
      categories: {
        entities: [
          {
            id: "shoes",
            name: "Shoes",
            translated: { name: "Schuhe" },
            cmsPage: { id: "cms" },
            breadcrumb: ["Home", "Shoes"],
          },
        ],
      },
      "categories-counts": { buckets: [{ key: "shoes", count: 7 }] },
    });

    expect(filters).toEqual([
      {
        code: "categories",
        label: "categories",
        id: "categories",
        name: "categories",
        entities: [{ id: "shoes", name: "Schuhe", count: 7 }],
      },
    ]);
  });

  it("returns an empty list without aggregations", () => {
    expect(getClientListingFilters(undefined)).toEqual([]);
    expect(getClientListingFilters(null)).toEqual([]);
  });
});
