import { createAPIClient } from "@shopware/api-client";
import type {
  operations as defaultOperations,
  components as defaultComponents,
} from "@shopware/api-client/api-types";

export type operations = defaultOperations;

export type Schemas = defaultComponents["schemas"];

export type ApiClient = ReturnType<typeof createAPIClient<operations>>;
