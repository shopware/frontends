export type paths = {
  "/customer/wishlist/{productId}": {
    post: operations["myRequestWithParams"];
    get: operations["myRequestWithOptionalParams"];
  };
};

export type webhooks = Record<string, never>;
export type components = {
  schemas: {};
  parameters: {
    /** Accepted response content types */
    accept: string;
    /** Content type of the request */
    contentType: string;
    criteriaIds: string[];
  };
};

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = {
  myRequestWithParams: {
    parameters: {
      query: {
        /** A list of product identifiers. */
        ids?: components["parameters"]["criteriaIds"];
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
