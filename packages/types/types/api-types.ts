import { createAPIClient } from "@shopware/api-client";
import type {
  RequestParameters as DefaultRequestParameters,
  RequestReturnType as DefaultRequestReturnType,
} from "@shopware/api-client";
import type {
  operations as defaultOperations,
  components as defaultComponents,
} from "@shopware/api-client/api-types";

export type operations = defaultOperations;

export type Schemas = defaultComponents["schemas"];

export type ApiClient = ReturnType<typeof createAPIClient<operations>>;

export type RequestParameters<T extends keyof operations> =
  DefaultRequestParameters<T, operations>;

export type RequestReturnType<T extends keyof operations> =
  DefaultRequestReturnType<T, operations>;
