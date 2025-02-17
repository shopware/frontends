import type { components as mainComponents } from "./storeApiTypes";

export type components = mainComponents;
//   & {
//   schemas: schemas;
// };

export type Schemas = {
  ProductListingResult: components["schemas"]["EntitySearchResult"] & {
    /** @enum {string} */
    apiAlias: "product_listing";
    /** Contains the available sorting. These can be used to show a sorting select-box in the product listing. */
    availableSortings: {
      /** @enum {string} */
      apiAlias: "product_sorting";
      key: string;
      label: string;
      priority: number;
      translated: {
        apiAlias?: string;
        key?: string;
        label: string;
      };
    }[];
    /** Contains the state of the filters. These can be used to create listing filters. */
    currentFilters: {
      manufacturer: string[];
      navigationId: string;
      price: {
        /** @default 0 */
        max: number;
        /** @default 0 */
        min: number;
      };
      properties: string[];
      rating?: number; // TODO: [OpenAPI][ProductListingResult] - rating should be defined the same as in body of the request
      search: string; // TODO: [OpenAPI][ProductListingResult] - search should be required as is required in body of the request, otherwise everywhere optional
      /** @default false */
      "shipping-free": boolean;
    };
    elements: components["schemas"]["Product"][];
    /** @enum {string} */
    entity?: "product";
    sorting?: string;
  };
};

// export type operations = {};
