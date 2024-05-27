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
//   import type { PaymentMethod, StoredPaymentMethod } from "./adyen";
//   import type {
//     operations as defaultOperations,
//     components as defaultComponents,
//   } from "@shopware/api-client/store-api-types";
//   import type {
//     RequestParameters as DefaultRequestParameters,
//     RequestReturnType as DefaultRequestReturnType,
//   } from "@shopware/api-client";

//   type changedComponents = defaultComponents & {
//     schemas: {
//       SalesChannelContext: defaultComponents["schemas"]["SalesChannelContext"] & {
//         extensions: {
//           adyenData: unknown;
//         };
//       };
//     };
//   };

//   export type operations = defaultOperations<changedComponents> & {
//     readAdyenConfiguration: {
//       responses: {
//         200: {
//           content: {
//             "application/json": {
//               data: {
//                 paymentMethods: PaymentMethod[];
//                 storedPaymentMethods: StoredPaymentMethod[];
//               };
//             };
//           };
//         };
//       };
//     };
//     handlePaymentMethod: {
//       requestBody: {
//         content: {
//           "application/json": {
//             stateData?: string;
//           };
//         };
//       };
//     };
//     readAdyenPaymentStatus: {
//       requestBody: {
//         content: {
//           "application/json": {
//             orderId: string;
//           };
//         };
//       };
//       responses: {
//         200: {
//           content: {
//             "application/json": {
//               data: {};
//             };
//           };
//         };
//       };
//     };
//   };
//   export type operationPaths =
//     | defaultOperationPaths
//     | "readAdyenConfiguration get /adyen/payment-methods"
//     | "readAdyenPaymentStatus post /adyen/payment-status";

//   export type Schemas = changedComponents["schemas"];

//   // we're exporting our own Api Client definition as it depends on our own instance
//   export type ApiClient = ReturnType<
//     typeof createAPIClient<operations, operationPaths>
//   >;
//   export type RequestParameters<T extends keyof operations> =
//     DefaultRequestParameters<T, operations>;

//   export type RequestReturnType<T extends keyof operations> =
//     DefaultRequestReturnType<T, operations>;
// }
