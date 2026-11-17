import { createAPIClient } from "@shopware/api-client";
import type {
  ApiClientRuntimeConfig,
  ShopwareNuxtOptions,
} from "@shopware/nuxt-module";

import type { operations } from "#shopware";

function toTimeout(value: unknown) {
  const timeout = Number(value);
  return Number.isFinite(timeout) && timeout > 0 ? timeout : undefined;
}

/**
 * Endpoint and access key for server-side Store API calls, read like the
 * @shopware/nuxt-module plugin on the server: the private endpoint
 * (NUXT_SHOPWARE_ENDPOINT) wins over the public one, and the deprecated
 * `shopwareEndpoint` and `shopwareAccessToken` keys are read too.
 */
export function getShopwareServerConfig() {
  const config = useRuntimeConfig();
  const privateConfig = config.shopware as ShopwareNuxtOptions | undefined;
  const publicConfig = config.public.shopware as ShopwareNuxtOptions;

  const endpoint =
    (privateConfig?.endpoint ?? privateConfig?.shopwareEndpoint) ||
    (publicConfig.endpoint ?? publicConfig.shopwareEndpoint);
  const accessToken =
    publicConfig.accessToken ?? publicConfig.shopwareAccessToken;

  if (!endpoint || !accessToken) {
    throw new Error(
      "Make sure that endpoint and accessToken are settled in the configuration",
    );
  }

  return { endpoint, accessToken };
}

/**
 * Headers and timeout for server-side Store API calls, from
 * `runtimeConfig.apiClientConfig`. Like the plugin, each field falls back from
 * the private tier to the public one on its own. The deprecated
 * `shopware.apiClientConfig` is not read.
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
  const { endpoint, accessToken } = getShopwareServerConfig();
  const { headers, timeout } = getServerApiClientOptions();

  return createAPIClient<operations>({
    baseURL: endpoint,
    accessToken,
    defaultHeaders: headers,
    ...(timeout === undefined ? {} : { fetchOptions: { timeout } }),
  });
}
