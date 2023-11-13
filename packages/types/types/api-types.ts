import { createAPIClient } from "@shopware/api-client";
import type {
  operationPaths as defaultOperationPaths,
  operations as defaultOperations,
  components as defaultComponents,
} from "@shopware/api-client/api-types";

export type operations = defaultOperations<defaultComponents>;
export type operationPaths = defaultOperationPaths;

export type Schemas = defaultComponents["schemas"];

// Most used specific schema types
export type Cart = Schemas["Cart"];

export type Product = Schemas["Product"];

export type ApiClient = ReturnType<
  typeof createAPIClient<operations, operationPaths>
>;
