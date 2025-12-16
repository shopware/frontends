declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";

  // Use locally generated types that include Content API
  export type operations = import("./api-types/storeApiTypes").operations;

  export type Schemas =
    import("./api-types/storeApiTypes").components["schemas"];

  // ApiClient with local operations including Content API
  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
