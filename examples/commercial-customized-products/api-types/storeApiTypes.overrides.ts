import type { components as coreComponents } from "./storeApiTypes";

export type components = coreComponents & {
  schemas: Schemas;
};

export type Schemas = {
  AddToCartPayload: {
    "customized-products-template": {
      id: string;
      options: {
        [optionId: string]: {
          media?: {
            [filename: string]: {
              id: string;
              filename: string;
            };
          };
          value: string | components["schemas"]["Media"][];
        };
      };
    };
    lineItems: {
      [productId: string]: {
        id: string;
        type: string;
        referencedId: string;
        quantity: number;
        stackable: boolean;
        removable: boolean;
      };
    };
  };
  SwagCustomizedProductsTemplate: {
    versionId: string;
    translated: {
      displayName: string;
      description: string;
    };
    createdAt: string;
    updatedAt: null | string;
    internalName: string;
    displayName: string;
    description: string;
    mediaId: null | string;
    active: boolean;
    stepByStep: boolean;
    confirmInput: boolean;
    optionsAutoCollapse: boolean;
    decisionTree: unknown[];
    translations: null | unknown;
    media: null | components["schemas"];
    products: null | components["schemas"]["Product"][];
    exclusions: unknown[];
    configurations: null | unknown;
    id: string;
    parentVersionId: string;
    options: components["schemas"]["SwagCustomizedProductsTemplateOption"][];
    apiAlias: "swag_customized_products_template";
  };
};

export type operations = {
  "addCustomizedProductToCart post /customized-products/add-to-cart": {
    accept?: "application/json";
    body: components["schemas"]["AddToCartPayload"];
    response: never;
    responseCode: 204;
  };
  "uploadCustomizedProductImage post /customized-products/upload": {
    accept?: "application/json";
    body: FormData;
    headers?: {
      "Content-Type": "multipart/form-data";
    };
    response: {
      mediaId: string;
      fileName: string;
    };
    responseCode: 200;
  };
};
