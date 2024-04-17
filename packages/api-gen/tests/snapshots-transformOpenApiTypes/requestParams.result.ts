type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
type OneOf<T extends any[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
    ? OneOf<[XOR<A, B>, ...Rest]>
    : never;
type GenericRecord =
  | never
  | null
  | string
  | string[]
  | number
  | { [key: string]: GenericRecord };
export type components = {
  schemas: Schemas;
};
export type Schemas = {};
export type operations = {
  "myRequestWithParams post /customer/wishlist/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers: {
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
    headers: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
    };
    query: {
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
