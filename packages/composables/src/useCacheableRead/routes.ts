import type { operations } from "#shopware";

// no runtime imports: scripts/checkCacheableReads.ts loads this file with esno

type GetTwin<OPERATION> = OPERATION extends `${infer NAME} post ${infer PATH}`
  ? `${NAME}Get get ${PATH}` & keyof operations
  : never;

/**
 * POST reads with a cacheable GET twin. `query`: body keys sent as plain query
 * params.
 */
export const cacheableReadRoutes = {
  "readCategoryList post /category": {
    get: "readCategoryListGet get /category",
  },
  "readCategory post /category/{navigationId}": {
    get: "readCategoryGet get /category/{navigationId}",
    // the listing reads these from the request, `_criteria` drops `limit`
    query: [
      "slots",
      "limit",
      "p",
      "order",
      "manufacturer",
      "properties",
      "min-price",
      "max-price",
      "rating",
      "shipping-free",
    ],
  },
  "readCountry post /country": {
    get: "readCountryGet get /country",
  },
  "readLanguages post /language": {
    get: "readLanguagesGet get /language",
  },
  "readNavigation post /navigation/{activeId}/{rootId}": {
    get: "readNavigationGet get /navigation/{activeId}/{rootId}",
    query: ["buildTree", "depth"],
  },
  "readProduct post /product": {
    get: "readProductGet get /product",
  },
  "readProductDetail post /product/{productId}": {
    get: "readProductDetailGet get /product/{productId}",
  },
  "readProductReviews post /product/{productId}/reviews": {
    get: "readProductReviewsGet get /product/{productId}/reviews",
  },
  "readSalutation post /salutation": {
    get: "readSalutationGet get /salutation",
  },
  "readSeoUrl post /seo-url": {
    get: "readSeoUrlGet get /seo-url",
  },
} satisfies {
  [OPERATION in keyof operations]?: {
    get: GetTwin<OPERATION>;
    query?: string[];
  };
};

/** POST reads with a GET twin that stay POST, and why. */
export const postOnlyReads = {
  "contextGateway post /context/gateway": "app gateway, changes the context",
  "download post /document/download/{documentId}/{deepLinkCode}":
    "customer document",
  "getEmployeeContexts post /employee/context": "B2B, per employee",
  "handlePaymentMethod post /handle-payment": "payment flow, not a read",
  "readBudget post /budget/{id}": "B2B, per customer",
  "readBudgets post /budgets": "B2B, per customer",
  "readCms post /cms/{id}": "not migrated yet",
  "readCountryState post /country-state/{countryId}": "not migrated yet",
  "readCurrency post /currency": "not migrated yet",
  "readLandingPage post /landing-page/{landingPageId}": "not migrated yet",
  "readMedia post /media": "not migrated yet",
  "readPaymentMethod post /payment-method": "depends on the cart and customer",
  "readProductCrossSellings post /product/{productId}/cross-selling":
    "not migrated yet",
  "readProductListing post /product-listing/{categoryId}": "#2691",
  "readShippingMethod post /shipping-method":
    "depends on the cart and customer",
  "searchPage post /search": "#2691",
  "searchProductVariantIds post /product/{productId}/find-variant":
    "not migrated yet",
  "searchQuoteProducts post /quote/{quoteId}/product-search":
    "B2B, per customer",
  "searchSuggest post /search-suggest": "not migrated yet",
} satisfies { [OPERATION in keyof operations]?: string };
