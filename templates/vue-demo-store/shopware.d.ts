declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";
  import type {
    operationPaths,
    operations,
    components,
  } from "@shopware/api-client/api-types";

  type changedComponents = components;
  // example how to extend Cart schema:
  // type changedComponents = components & {
  //   schemas: {
  //     Cart: components["schemas"]["Cart"] & {
  //       myspecialfield: "hello field";
  //     };
  //   };
  // };

  export type operations = operations<changedComponents>;
  export type operationPaths = operationPaths;
  export type Schemas = changedComponents["schemas"];

  export type Cart = changedComponents["schemas"]["Cart"];

  export type Product = changedComponents["schemas"]["Product"];

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<
    typeof createAPIClient<operations<changedComponents>, operationPaths>
  >;
}
