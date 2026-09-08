declare module "#shopware" {
  import type { createAPIClient, WithApiOverrides } from "@shopware/api-client";
  import type { operations as StoreOperations } from "@shopware/api-client/store-api-types";

  export type operations = WithApiOverrides<
    StoreOperations,
    import("./api-types/storeApiTypes.overrides").operations
  >;
  export type Schemas =
    import("@shopware/api-client/store-api-types").components["schemas"];
  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
