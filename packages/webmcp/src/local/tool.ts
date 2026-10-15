import type { createAPIClient } from "@shopware/api-client";

import type {
  ToolAnnotations,
  ToolCallContext,
  ToolDescriptor,
  ToolInput,
  ToolResult,
  WebMcpMode,
} from "../types";
import { toJsonSchema, validateInput } from "./validate";
import type { ParamsSpec } from "./validate";

/** The api-client as created by `createAPIClient` with the default Store API types. */
export type StoreApiClient = ReturnType<typeof createAPIClient>;

export type LocalToolDefinition = {
  name: string;
  title: string;
  description: string;
  params: ParamsSpec;
  annotations?: ToolAnnotations;
  minimumMode: Exclude<WebMcpMode, "off">;
  execute(
    input: ToolInput,
    context: ToolCallContext,
    apiClient: StoreApiClient,
  ): Promise<ToolResult>;
};

export type LocalTool = {
  descriptor: ToolDescriptor;
  run(
    input: ToolInput,
    context: ToolCallContext,
    apiClient: StoreApiClient,
  ): Promise<ToolResult>;
};

export function defineLocalTool(definition: LocalToolDefinition): LocalTool {
  return {
    descriptor: {
      name: definition.name,
      title: definition.title,
      description: definition.description,
      inputSchema: toJsonSchema(definition.params),
      annotations: definition.annotations,
      minimumMode: definition.minimumMode,
    },
    run: (input, context, apiClient) =>
      definition.execute(
        validateInput(definition.params, input),
        context,
        apiClient,
      ),
  };
}

/** SEO URLs are not loaded by default; without them the card links to /detail/{id}. */
export const PRODUCT_ASSOCIATIONS = { seoUrls: {} };

export const PRODUCT_INCLUDES = {
  product: [
    "id",
    "productNumber",
    "name",
    "translated",
    "description",
    "calculatedPrice",
    "stock",
    "isCloseout",
    "seoUrls",
    "parentId",
    "options",
  ],
  seo_url: ["seoPathInfo"],
  property_group_option: ["name", "translated", "group"],
  property_group: ["name", "translated"],
  calculated_price: ["unitPrice", "totalPrice", "listPrice"],
};
