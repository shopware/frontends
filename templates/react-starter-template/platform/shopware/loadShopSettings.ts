import "server-only";
import { apiFailureSummary } from "@/features/session/apiErrors";
import { TEMPLATE_SHOP_SETTINGS } from "@/site/shopSettings";

import { readShopSettings } from "./reads/shopSettings";
import { mergeShopSettings } from "./shopSettings";
import type { ShopSettings } from "./shopSettings";

let warnedMissingRoute = false;

export async function loadShopSettings(): Promise<ShopSettings> {
  try {
    const remote = await readShopSettings();
    if (remote === null && !warnedMissingRoute) {
      warnedMissingRoute = true;
      console.warn(
        "[Shopware] GET /store-api/shop-settings is not available (Shopware before 6.7.14), so site/shopSettings.ts is used",
      );
    }
    return mergeShopSettings(remote, TEMPLATE_SHOP_SETTINGS);
  } catch (error) {
    console.error(
      "[Shopware] reading the shop settings failed, so site/shopSettings.ts is used",
      apiFailureSummary(error),
    );
    return mergeShopSettings(null, TEMPLATE_SHOP_SETTINGS);
  }
}
