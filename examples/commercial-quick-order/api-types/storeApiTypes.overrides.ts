import type { components as coreComponents } from "./storeApiTypes";

export type components = coreComponents & {
  schemas: Schemas;
};

// TODO(MD): Discover and define proper type, prefferably already existing in core
export type Schemas = {
  B2BProductDefinition: {
    id: string;
    quantity: number;
    name: string;
    productNumber: string;
    translated: {
      name?: string;
    };
    options: Array<{
      id: string;
      group: {
        translated: {
          name?: string;
        };
      };
      translated: {
        name?: string;
      };
    }>;
    calculatedPrice: {
      unitPrice: number;
      totalPrice: number;
    };
  };
};

export type operations = {
  "quickOrderProductSearch get /quick-order/product": {
    contentType?: "application/json";
    accept?: "application/json";
    query: {
      /** Product search string  */
      search: string;
    };
    response: {
      elements: components["schemas"]["B2BProductDefinition"][];
    };
    responseCode: 200;
  };
  "quickOrderLoadFile post /quick-order/load-file": {
    contentType: "multipart/form-data";
    accept?: "application/json";
    body: FormData;
    response: {
      products: components["schemas"]["B2BProductDefinition"][];
    };
    responseCode: 200;
  };
};
