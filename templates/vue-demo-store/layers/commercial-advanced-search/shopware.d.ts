declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";

  export type operations = import("./api-types/storeApiTypes").operations;

  export type Schemas =
    import("./api-types/storeApiTypes").components["schemas"];

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
