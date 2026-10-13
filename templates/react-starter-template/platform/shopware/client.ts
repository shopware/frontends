import "server-only";
import { createAPIClient } from "@shopware/api-client";

import type { ApiClient, operations } from "#shopware";

import { getShopwareConfig } from "./config";
import { getServerApiRequestOptions } from "./requestOptions";

export type ShopwareClientOptions = {
  contextToken?: string;
  languageId?: string | null;
};

export function createShopwareClient({
  contextToken,
  languageId,
}: ShopwareClientOptions = {}): ApiClient {
  const { endpoint, accessToken } = getShopwareConfig();
  const { timeout, headers } = getServerApiRequestOptions();
  return createAPIClient<operations>({
    baseURL: endpoint,
    accessToken,
    contextToken,
    defaultHeaders: languageId
      ? { ...headers, "sw-language-id": languageId }
      : headers,
    fetchOptions: timeout === undefined ? undefined : { timeout },
  });
}
