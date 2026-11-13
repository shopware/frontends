import "server-only";
import { createAPIClient } from "@shopware/api-client";

import type { ApiClient, operations } from "#shopware";

const DEMO_ENDPOINT = "https://demo-frontends.shopware.store/store-api/";
const DEMO_ACCESS_TOKEN = "SWSCNWDGMUWZM0TLVUU0YKLQVW";

export function createShopwareClient(): ApiClient {
  return createAPIClient<operations>({
    baseURL: process.env.SHOPWARE_ENDPOINT || DEMO_ENDPOINT,
    accessToken: process.env.SHOPWARE_ACCESS_TOKEN || DEMO_ACCESS_TOKEN,
  });
}
