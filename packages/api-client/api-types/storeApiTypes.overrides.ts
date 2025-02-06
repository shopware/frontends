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
  SwagPaypalVaultToken: {
    // TODO: [OpenAPI][SwagPaypalVaultToken] - add SwagPaypalVaultToken definition to schema
    /** Format: date-time */
    createdAt: string;
    customer?: components["schemas"]["Customer"];
    customerId: string;
    id?: string;
    identifier: string;
    mainMapping?: components["schemas"]["SwagPaypalVaultTokenMapping"];
    paymentMethod?: components["schemas"]["PaymentMethod"];
    paymentMethodId: string;
    /** Format: date-time */
    updatedAt?: string;
  };
};

export type operations = {
  "updateLineItem patch /checkout/cart/line-item": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      // TODO: [OpenAPI][updateLineItem] - add proper request body type with required fields
      items: Array<{
        id: string;
        quantity: number;
      }>;
    };
    response: components["schemas"]["Cart"];
    responseCode: 200;
  };
  "readProduct post /product": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["Product"][]; // TODO: [OpenAPI][readProduct]: add elements property as required
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readShippingMethod post /shipping-method": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    query?: {
      /** List only available shipping methods. This filters shipping methods methods which can not be used in the actual context because of their availability rule. */
      onlyAvailable?: boolean;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      /** aggregation result */
      aggregations?: Record<string, never>;
      elements: components["schemas"]["ShippingMethod"][]; // TODO: [OpenAPI][readShippingMethod]: response should be `EntitySearchResult` and elements should be required
      /** Total amount */
      total?: number;
    };
    responseCode: 200;
  };
  "readBreadcrumb get /breadcrumb/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string; //TODO: [OpenAPI][readBreadcrumb] - sw-language-id should be added
    };
    query?: {
      /** Type: category or product (optional - default: product) */
      type?: "product" | "category";
      /** UUID for referrer category only used for product breadcrumb */
      referrerCategoryId?: string;
    };
    pathParams: {
      /** UUID for product or category */
      id: string;
    };
    response: components["schemas"]["BreadcrumbCollection"];
    responseCode: 200;
  };
};
