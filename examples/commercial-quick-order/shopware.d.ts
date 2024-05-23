import type {
  operations as defaultOperations,
  components as defaultComponents,
} from "./api-types/apiTypes";
import type { createAPIClient } from "@shopware/api-client";

declare module "#shopware" {
  export type operations = defaultOperations;
  export type Schemas = defaultComponents["schemas"];

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
}
