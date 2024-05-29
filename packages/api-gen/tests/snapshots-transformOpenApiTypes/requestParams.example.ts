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
