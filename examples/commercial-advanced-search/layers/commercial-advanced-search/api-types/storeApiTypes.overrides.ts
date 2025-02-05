import type { components as mainComponents } from "./storeApiTypes";
export type components = mainComponents;

export type Schemas = {
  AdvancedSearchExtension: {
    multiSuggestResult: {
      suggestResults: {
        product_manufacturer: mainComponents["schemas"]["EntitySearchResult"] & {
          elements: {
            [key: string]: mainComponents["schemas"]["ProductManufacturer"];
          };
        };
        category: mainComponents["schemas"]["EntitySearchResult"] & {
          elements: {
            [key: string]: mainComponents["schemas"]["Category"];
          };
        };
      };
      apiAlias: "shopware_commercial_advanced_search_domain_suggest_multi_suggest_result";
    };
    completionResult: {
      apiAlias: "array_struct";
      [key: number]: string;
    };
  };
  SearchActions: {
    /** @enum {string} */
    apiAlias?: "search_action_result";
    /** @enum {string} */
    type: "FORWARD_ROUTE";
    url: string;
    validFrom: string;
    validTo: string;
    route: "frontend.detail.page" | "frontend.navigation.page";
    seoUrls: components["schemas"]["SeoUrl"][];
    routeParameters:
      | {
          productId: string;
        }
      | {
          navigationId: string;
        };
  };
};

export type operations = {
  "searchPage post /search":
    | {
        contentType?: "application/json";
        accept?: "application/json";
        headers: {
          /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
          "sw-include-seo-urls": boolean;
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: string;
        };
        body: {
          /** Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag. */
          search: string;
        } & components["schemas"]["ProductListingCriteria"] &
          components["schemas"]["ProductListingFlags"];
        response: components["schemas"]["ProductListingResult"] & {
          extensions?: {
            searchActions?: Schemas["SearchActions"];
          };
        };
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept?: "application/json";
        headers: {
          /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: string;
        };
        body: {
          /** Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag. */
          search: string;
        } & components["schemas"]["ProductListingCriteria"] &
          components["schemas"]["ProductListingFlags"];
        response: components["schemas"]["ProductListingResult"] & {
          extensions?: {
            searchActions?: components["schemas"]["SearchActions"];
          };
        } & components["schemas"]["ProductListingResult"] & {
            extensions?: {
              searchActions?: components["schemas"]["SearchActions"];
            } & {};
          };
        responseCode: 200;
      };
  "searchSuggest post /search-suggest": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      /** Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag. */
      search: string;
    } & components["schemas"]["ProductListingFlags"];
    response: components["schemas"]["ProductListingResult"] & {
      extensions?: components["schemas"]["AdvancedSearchExtension"];
    };
    responseCode: 200;
  };
};
