import { createAPIClient } from "@shopware/api-client";
import type { ApiClientRuntimeConfig } from "@shopware/nuxt-module";

import type { operations } from "#shopware";

function toTimeout(value: unknown) {
  const timeout = Number(value);
  return Number.isFinite(timeout) && timeout > 0 ? timeout : undefined;
}

/**
 * Same precedence as the @shopware/nuxt-module plugin on the server: the
 * private endpoint (NUXT_SHOPWARE_ENDPOINT) wins, the public one is the fallback.
 */
export function getShopwareServerEndpoint() {
  const config = useRuntimeConfig();
  return config.shopware.endpoint || config.public.shopware.endpoint;
}

/**
 * Headers and timeout for server-side Store API calls. Like the plugin, each
 * field falls back from the private tier to the public one on its own.
 */
export function getServerApiClientOptions() {
  const config = useRuntimeConfig();
  const privateConfig = config.apiClientConfig as
    | ApiClientRuntimeConfig
    | undefined;
  const publicConfig = config.public.apiClientConfig as
    | ApiClientRuntimeConfig
    | undefined;

  return {
    headers: privateConfig?.headers || publicConfig?.headers,
    timeout:
      toTimeout(privateConfig?.timeout) ?? toTimeout(publicConfig?.timeout),
  };
}

/**
 * Store API client for server routes. It carries no customer session, so use
 * it only for data that is the same for every visitor.
 */
export function createServerApiClient() {
  const { headers, timeout } = getServerApiClientOptions();

  return createAPIClient<operations>({
    baseURL: getShopwareServerEndpoint(),
    accessToken: useRuntimeConfig().public.shopware.accessToken,
    defaultHeaders: headers,
    ...(timeout === undefined ? {} : { fetchOptions: { timeout } }),
  });
}
