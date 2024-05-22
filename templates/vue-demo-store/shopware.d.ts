declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";
  import type {
    operations as defaultOperations,
    components as defaultComponents,
  } from "@shopware/api-client/api-types";

  // type changedComponents = defaultComponents;
  // example how to extend Cart schema:
  // type changedComponents = defaultComponents & {
  //   schemas: {
  //     Cart: defaultComponents["schemas"]["Cart"] & {
  //       myspecialfield: "hello field";
  //     };
  //   };
  // };

  export type operations = defaultOperations;
  // export type operationPaths = defaultOperationPaths;
  export type Schemas = defaultComponents["schemas"];

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<
    typeof createAPIClient<operations, operationPaths>
  >;

  // eslint-disable-next-line
  export type RequestParameters<T extends string> = any; // TODO: fix proper type or remove
  // DefaultRequestParameters<T, operations>;

  // eslint-disable-next-line
  export type RequestReturnType<T extends string> = any; // TODO: fix proper type or remove
  // DefaultRequestReturnType<T, operations>;
}
