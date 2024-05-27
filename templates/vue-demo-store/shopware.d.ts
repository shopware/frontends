declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";

  // Default imports: comment out once you'll generate your own types using @shopware/api-gen cli
  import type {
    operations as defaultOperations,
    components as defaultComponents,
  } from "@shopware/api-client/store-api-types";
  // Local import: uncomment once you'll generate your own types using @shopware/api-gen cli
  import type {
    operations as defaultOperations,
    components as defaultComponents,
  } from "./api-types/storeApiTypes";

  export type operations = defaultOperations;
  export type Schemas = defaultComponents["schemas"];

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
