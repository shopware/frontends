import "server-only";
import { createAPIClient } from "@shopware/api-client";

import type { ApiClient, operations } from "#shopware";

import { getShopwareConfig } from "./config";

export function createShopwareClient(contextToken?: string): ApiClient {
  const { endpoint, accessToken } = getShopwareConfig();
  return createAPIClient<operations>({
    baseURL: endpoint,
    accessToken,
    contextToken,
  });
}
