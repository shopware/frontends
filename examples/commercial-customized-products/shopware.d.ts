declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";
  import type {
    operationPaths as defaultOperationPaths,
    operations as defaultOperations,
    components as defaultComponents,
  } from "@shopware/api-client/api-types";
  import type {
    RequestParameters as DefaultRequestParameters,
    RequestReturnType as DefaultRequestReturnType,
  } from "@shopware/api-client";

  type changedComponents = defaultComponents & {
    schemas: {
      Product: defaultComponents["schemas"]["Product"] & {
        extensions: {
          swagCustomizedProductsTemplate: SwagCustomizedProductsTemplate;
        };
      };
    };
  };

  export type SwagCustomizedProductsTemplate = {
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
    media: null | Schemas["Media"];
    products: null | changedComponents["schemas"]["Product"][];
    exclusions: unknown[];
    configurations: null | unknown;
    id: string;
    parentVersionId: string;
    options: CustomizedProductOption[];
    apiAlias: "swag_customized_products_template";
  };

  export type CustomizedProductOptionValue = {
    versionId: string;
    translated: {
      displayName: string;
    };
    createdAt: string;
    updatedAt: null | string;
    oneTimeSurcharge: boolean;
    relativeSurcharge: boolean;
    advancedSurcharge: boolean;
    taxId: string;
    tax: null | unknown;
    price: Schemas["ProductPrice"][];
    percentageSurcharge: number;
    prices: [];
    id: string;
    templateOptionId: string;
    value: {
      _value: string;
    };
    displayName: string;
    itemNumber: null | number;
    default: boolean;
    position: number;
    templateOption: null | unknown;
    translations: null | unknown;
    templateExclusionConditions: null | unknown;
    templateOptionVersionId: string;
    apiAlias: "swag_customized_products_template_option_value";
  };

  export type CustomizedProductOption = {
    translated: {
      displayName: string;
      description: null | string;
      placeholder: null | string;
    };
    createdAt: string;
    updatedAt: null | string;
    oneTimeSurcharge: boolean;
    relativeSurcharge: boolean;
    advancedSurcharge: boolean;
    taxId: null | string;
    tax: null | string;
    calculatedPrice: null;
    percentageSurcharge: number;
    price: Schemas["ProductPrice"];
    prices: [];
    id: string;
    type:
      | "select"
      | "colorselect"
      | "imageupload"
      | "textfield"
      | "imageselect";
    displayName: string;
    description: null | string;
    placeholder: null | string;
    templateId: string;
    typeProperties: {
      isMultiSelect: boolean;
    };
    itemNumber: null | number;
    required: boolean;
    position: number;
    translations: null | unknown;
    template: null | unknown;
    values: CustomizedProductOptionValue[];
  };

  /**
   * Payload for adding product to a cart
   */
  export type AddToCartPayload = {
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
          value: string | defaultComponents["schemas"]["Media"][];
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

  export type changedOperations = defaultOperations<changedComponents> & {
    addCustomizedProductToCart: {
      requestBody?: {
        content: {
          "application/json": AddToCartPayload; // TODO: [OpenAPI][addLineItem] - add proper request body type with required fields
        };
      };
      responses: {
        204: {
          content: {};
        };
      };
    };
    uploadCustomizedProductImage: {
      requestBody?: {
        content: {
          "multipart/form-data": FormData;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": {
              mediaId: string;
              fileName: string;
            };
          };
        };
      };
    };
  };
  export type operations = changedOperations;
  export type operationPaths =
    | defaultOperationPaths
    | "addCustomizedProductToCart post /checkout/customized-products/add-to-cart"
    | "uploadCustomizedProductImage post /customized-products/upload";
  export type Schemas = changedComponents["schemas"];

  //We're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<
    typeof createAPIClient<operations, operationPaths>
  >;
  export type RequestParameters<T extends keyof operations> =
    DefaultRequestParameters<T, operations>;

  export type RequestReturnType<T extends keyof operations> =
    DefaultRequestReturnType<T, operations>;
}
