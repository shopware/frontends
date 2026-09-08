declare module "#shopware" {
  import type { createAPIClient, WithApiOverrides } from "@shopware/api-client";
  import type {
    components as StoreComponents,
    operations as StoreOperations,
  } from "@shopware/api-client/store-api-types";

  export type operations = WithApiOverrides<
    StoreOperations,
    import("./api-types/storeApiTypes.overrides").operations
  >;
  export type Schemas = WithApiOverrides<
    StoreComponents["schemas"],
    import("./api-types/storeApiTypes.overrides").Schemas
  >;
  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
