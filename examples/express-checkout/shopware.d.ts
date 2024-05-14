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
    | "payPalCreateOrder post /paypal/express/create-order"
    | "payPalPrepare post /paypal/express/prepare-checkout"
    | defaultOperationPaths;
  type extendedOperations = defaultOperations<changedComponents> & {
    handlePaymentMethod: {
      parameters: {
        query: {
          isPayPalExpressCheckout?: boolean;
          paypalOrderId?: string;
        };
      };
    };
    payPalCreateOrder: {
      responses: {
        200: {
          content: {
            "application/json": {
              token: string;
            };
          };
        };
        204: never;
        400: never;
      };
    };
    payPalPrepare: {
      requestBody: {
        content: {
          "application/json": {
            token: string;
          };
        };
      };
      responses: {
        /** Returns a success response indicating a successful update */
        200: {
          content: {
            "application/json": changedComponents["schemas"]["SuccessResponse"];
          };
        };
      };
    };
  };

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
