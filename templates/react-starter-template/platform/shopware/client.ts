import "server-only";
import { createAPIClient } from "@shopware/api-client";

import type { ApiClient, operations } from "#shopware";

import { getShopwareConfig } from "./config";

export type ShopwareClientOptions = {
  contextToken?: string;
  languageId?: string | null;
};

export function createShopwareClient({
  contextToken,
  languageId,
}: ShopwareClientOptions = {}): ApiClient {
  const { endpoint, accessToken } = getShopwareConfig();
  return createAPIClient<operations>({
    baseURL: endpoint,
    accessToken,
    contextToken,
    defaultHeaders: languageId ? { "sw-language-id": languageId } : undefined,
  });
}
