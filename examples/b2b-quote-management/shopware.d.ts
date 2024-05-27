declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";
  import type {
    operations as defaultOperations,
    components as defaultComponents,
  } from "@shopware/api-client/store-api-types";

  export type operations = defaultOperations;
  export type Schemas = defaultComponents["schemas"];

  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
