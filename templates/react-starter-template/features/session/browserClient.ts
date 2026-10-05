import { createAPIClient } from "@shopware/api-client";
import Cookies from "js-cookie";

import type { ApiClient, operations } from "#shopware";
import { parsePublicShopwareConfig } from "@/platform/shopware/publicConfig";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";

import { READ_TIMEOUT_MS } from "./readTimeout";

export const CONTEXT_TOKEN_COOKIE = "sw-context-token";
export const PUBLIC_CONFIG_PATH = "/api/shopware/config";

const CONTEXT_TOKEN_LIFETIME_DAYS = 365;

let publicConfig: Promise<PublicShopwareConfig> | null = null;

async function fetchPublicConfig(
  fetchImpl: typeof fetch,
): Promise<PublicShopwareConfig> {
  const response = await fetchImpl(PUBLIC_CONFIG_PATH, {
    cache: "no-store",
    signal: AbortSignal.timeout(READ_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(
      `[Session] ${PUBLIC_CONFIG_PATH} responded with ${response.status}`,
    );
  }
  return parsePublicShopwareConfig(await response.json());
}

export function loadPublicConfig(
  fetchImpl: typeof fetch = fetch,
): Promise<PublicShopwareConfig> {
  if (!publicConfig) {
    const pending = fetchPublicConfig(fetchImpl);
    publicConfig = pending;
    pending.catch(() => {
      if (publicConfig === pending) publicConfig = null;
    });
  }
  return publicConfig;
}

export function createBrowserClient(config: PublicShopwareConfig): ApiClient {
  const client = createAPIClient<operations>({
    baseURL: config.endpoint,
    accessToken: config.accessToken,
    contextToken: Cookies.get(CONTEXT_TOKEN_COOKIE),
  });
  client.hook("onContextChanged", (contextToken) => {
    Cookies.set(CONTEXT_TOKEN_COOKIE, contextToken, {
      expires: CONTEXT_TOKEN_LIFETIME_DAYS,
      path: "/",
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    });
  });
  return client;
}
