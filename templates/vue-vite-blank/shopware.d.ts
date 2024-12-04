declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";

  // for default types
  export type {
    operations,
    Schemas,
  } from "@shopware/api-client/store-api-types";

  // or locally generated types
  // export type { operations, Schemas } from "./api-types/storeApiTypes";

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
