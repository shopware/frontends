declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";

  // Default imports: comment out once you'll generate your own types using @shopware/api-gen cli
  import type {
    operations as defaultOperations,
    components as defaultComponents,
  } from "@shopware/api-client/store-api-types";
  // Local import: uncomment once you'll generate your own types using @shopware/api-gen cli
  // import type {
  //   operations as defaultOperations,
  //   components as defaultComponents,
  // } from "./api-types/storeApiTypes";

  export type operations = defaultOperations;
  export type Schemas = defaultComponents["schemas"];

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}

// declare module "#shopware" {
//   import type { createAPIClient } from "@shopware/api-client";
//   import type {
//     operations as defaultOperations,
//     components as defaultComponents,
//   } from "@shopware/api-client/store-api-types";

//   type changedComponents = defaultComponents;
//   // example how to extend Cart schema:
//   // type changedComponents = components & {
//   //   schemas: {
//   //     Cart: defaultComponents["schemas"]["Cart"] & {
//   //       myspecialfield: "hello field";
//   //     };
//   //   };
//   // };

//   type extendedPaths =
//     | "payPalCreateOrder post /store-api/paypal/express/create-order?isPayPalExpressCheckout=1"
//     | "payPalPrepare post /store-api/paypal/express/prepare-checkout?isPayPalExpressCheckout=1"
//     | operationPaths;
//   type extendedOperations = {
//     payPalCreateOrder: {
//       responses: {
//         204: never;
//         400: never;
//       };
//     };
//     payPalPrepare: {
//       requestBody: {
//         content: {
//           "application/json": {
//             token: string;
//           };
//         };
//       };
//       responses: {
//         /** Returns a success response indicating a successful update */
//         200: {
//           content: {
//             "application/json": changedComponents["schemas"]["SuccessResponse"];
//           };
//         };
//       };
//     };
//   } & operations;

//   export type operations = defaultOperations<changedComponents>;
//   export type operationPaths = defaultOperationPaths;
//   export type Schemas = changedComponents["schemas"];

//   // we're exporting our own Api Client definition as it depends on our own instance
//   export type ApiClient = ReturnType<
//     typeof createAPIClient<extendedOperations, extendedPaths>
//   >;
//   export type RequestParameters<T extends keyof operations> =
//     DefaultRequestParameters<T, operations>;

//   export type RequestReturnType<T extends keyof operations> =
//     DefaultRequestReturnType<T, operations>;
// }
