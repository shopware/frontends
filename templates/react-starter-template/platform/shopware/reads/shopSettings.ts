import "server-only";
import { ApiClientError } from "@shopware/api-client";
import { cacheLife, cacheTag } from "next/cache";

import { createShopwareClient } from "../client";
import type { ShopSettingsResponse } from "../shopSettings";

export async function readShopSettings(): Promise<ShopSettingsResponse | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("sw:shop-settings");

  try {
    const { data } = await createShopwareClient().invoke(
      "getShopSettings get /shop-settings",
    );
    return data;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) return null;
    throw error;
  }
}
