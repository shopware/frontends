import { createAPIClient } from "@shopware/api-client";
import type { ApiClientRuntimeConfig } from "@shopware/nuxt-module";

import type { operations } from "#shopware";

/**
 * Same precedence as the @shopware/nuxt-module plugin on the server: the
 * private endpoint (NUXT_SHOPWARE_ENDPOINT) wins, the public one is the fallback.
 */
export function getShopwareServerEndpoint() {
  const config = useRuntimeConfig();
  return config.shopware.endpoint || config.public.shopware.endpoint;
}

/**
 * Store API client for server routes. It carries no customer session, so use
 * it only for data that is the same for every visitor.
 */
export function createServerApiClient() {
  const config = useRuntimeConfig();
  const apiClientConfig = (config.apiClientConfig ??
    config.public.apiClientConfig) as ApiClientRuntimeConfig | undefined;
  const timeout = Number(apiClientConfig?.timeout);

  return createAPIClient<operations>({
    baseURL: getShopwareServerEndpoint(),
    accessToken: config.public.shopware.accessToken,
    defaultHeaders: apiClientConfig?.headers,
    ...(Number.isFinite(timeout) && timeout > 0
      ? { fetchOptions: { timeout } }
      : {}),
  });
}
