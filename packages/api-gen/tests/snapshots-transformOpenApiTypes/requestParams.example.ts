/** OneOf type helpers */
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

export type paths = {
  "/customer/wishlist/{productId}": {
    post: operations["myRequestWithParams"];
    get: operations["myRequestWithOptionalParams"];
  };
};

export type webhooks = Record<string, never>;
export type components = {
  schemas: {};
};

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = {
  myRequestWithParams: {
    parameters: {
      header: {
        /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
        "sw-include-seo-urls"?: boolean;
      };
      query: {
        /** A list of product identifiers. */
        ids: string[];
      };
      path: {
        /** Identifier of the product to be added. */
        productId: string;
      };
    };
    responses: {
      /** The updated cart. */
      200: {
        content: {
          "application/json": {
            success: boolean;
          };
        };
      };
    };
  };
  myRequestWithOptionalParams: {
    parameters: {
      header?: {
        /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
        "sw-include-seo-urls"?: boolean;
      };
      query?: {
        /** A list of product identifiers. */
        ids?: string[];
      };
      path: {
        /** Identifier of the product to be added. */
        productId: string;
      };
    };
    responses: {
      /** The updated cart. */
      200: {
        content: {
          "application/json": {
            success: boolean;
          };
        };
      };
    };
  };
};
