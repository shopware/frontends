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

  type extendedPaths =
    | "quickOrderProductSearch get /store-api/quick-order/product?search"
    | "quickOrderLoadFile post /store-api/quick-order/load-file"
    | defaultOperationPaths;

  type extendedOperations = {
    quickOrderProductSearch: {
      parameters: {
        query: {
          /** Product search string  */
          search: string;
        };
      };
      responses: {
        204: never;
        400: never;
        200: {
          content: {
            "application/json": {
              elements: any;
            };
          };
        };
      };
    };
    quickOrderLoadFile: {
      requestBody: {
        content: {
          "application/json": {
            formData: any;
          };
        };
      };
      responses: {
        204: never;
        400: never;
        200: {
          content: {
            "application/json": {
              products: any;
            };
          };
        };
      };
    };
  } & defaultOperations<changedComponents>;

  export type operations = extendedOperations;
  export type operationPaths = extendedPaths;
  export type Schemas = changedComponents["schemas"];

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<
    typeof createAPIClient<extendedOperations, extendedPaths>
  >;
  export type RequestParameters<T extends keyof operations> =
    DefaultRequestParameters<T, operations>;

  export type RequestReturnType<T extends keyof operations> =
    DefaultRequestReturnType<T, operations>;
}
