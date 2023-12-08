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

  type changedComponents = defaultComponents;
  // example how to extend Cart schema:
  // type changedComponents = components & {
  //   schemas: {
  //     Cart: defaultComponents["schemas"]["Cart"] & {
  //       myspecialfield: "hello field";
  //     };
  //   };
  // };

  export type changedOperations = defaultOperations<changedComponents> & {
    addCustomizedProductToCart: {
      requestBody?: {
        content: {
          "application/json": {
            // TODO: [OpenAPI][addLineItem] - add proper request body type with required fields
            items: Array<{
              id?: string; // TODO: check if this is used at all?
              referencedd: string;
              quantity?: number;
              type: "product" | "promotion" | "custom" | "credit"; // TODO: [OpenAPI][addLineItem] - add proper type -> see also #456
            }>;
          };
        };
      };
      responses: {
        /** The updated cart. */
        200: {
          content: {
            "application/json": changedComponents["schemas"]["SwagCustomizedProductsTemplate"];
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
