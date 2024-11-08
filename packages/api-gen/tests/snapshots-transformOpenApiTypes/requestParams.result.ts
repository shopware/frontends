/**
 * This file is auto-generated. Do not make direct changes to the file.
 * Instead override it in your shopware.d.ts file.
 *
 * Shopware API version: 0.0.0
 *
 */
export type components = {
  schemas: Schemas;
};
export type Schemas = {};
export type operations = {
  "myRequestWithParams post /customer/wishlist/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
    };
    query: {
      /** A list of product identifiers. */
      ids: string[];
    };
    pathParams: {
      /** Identifier of the product to be added. */
      productId: string;
    };
    response: {
      success: boolean;
    };
    responseCode: 200;
  };
  "myRequestWithOptionalParams get /customer/wishlist/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
    };
    query?: {
      /** A list of product identifiers. */
      ids?: string[];
    };
    pathParams: {
      /** Identifier of the product to be added. */
      productId: string;
    };
    response: {
      success: boolean;
    };
    responseCode: 200;
  };
};
