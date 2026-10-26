declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";

  export type operations =
    import("@shopware/api-client/store-api-types").operations;

  export type Schemas =
    import("@shopware/api-client/store-api-types").components["schemas"];

  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
