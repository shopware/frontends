import type { Schemas } from "#shopware";

import type { SearchSuggestResult } from "./searchSuggestApi";

export function suggestProduct(
  overrides: Partial<Schemas["Product"]> = {},
): Schemas["Product"] {
  const id = overrides.id ?? "product-1";
  const name = overrides.name ?? "Linen Shirt";
  return {
    id,
    name,
    translated: { name },
    seoUrls: [{ seoPathInfo: `${name.replaceAll(" ", "-")}/${id}` }],
    cover: {
      media: {
        url: `https://cdn.test/${id}.jpg`,
        thumbnails: [
          { width: 800, url: `https://cdn.test/${id}-800.jpg` },
          { width: 280, url: `https://cdn.test/${id}-280.jpg` },
        ],
      },
    },
    calculatedPrice: { unitPrice: 19.99, totalPrice: 19.99 },
    calculatedPrices: [],
    ...overrides,
  } as unknown as Schemas["Product"];
}

export function suggestResult(
  overrides: Partial<SearchSuggestResult> = {},
): SearchSuggestResult {
  const products = overrides.products ?? [
    suggestProduct(),
    suggestProduct({ id: "product-2", name: "Wool Shirt" }),
  ];
  return { products, total: overrides.total ?? products.length };
}

export function searchListing(
  overrides: Partial<Schemas["ProductListingResult"]> = {},
): Schemas["ProductListingResult"] {
  const elements = overrides.elements ?? [
    suggestProduct(),
    suggestProduct({ id: "product-2", name: "Wool Shirt" }),
  ];
  return {
    apiAlias: "product_listing",
    elements,
    total: elements.length,
    page: 1,
    limit: 24,
    sorting: "score",
    availableSortings: [
      { key: "score", translated: { label: "Top results" } },
      { key: "price-asc", translated: { label: "Price ascending" } },
    ],
    aggregations: {
      manufacturer: {
        entities: [
          { id: "maker-1", name: "Shopware", translated: { name: "Shopware" } },
        ],
      },
      categories: {
        entities: [
          { id: "root", name: "Catalogue", translated: { name: "Catalogue" } },
          {
            id: "category-shirts",
            name: "Shirts",
            translated: { name: "Shirts" },
          },
        ],
      },
      "categories-counts": {
        buckets: [
          { key: "root", count: 2 },
          { key: "category-shirts", count: 2 },
        ],
      },
    },
    ...overrides,
  } as unknown as Schemas["ProductListingResult"];
}
