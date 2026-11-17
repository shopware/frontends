import { useRuntimeConfig, useSessionContext } from "#imports";

import type { ShopwarePaymentsClient } from "./snippet-context";

const runtimeConfig = useRuntimeConfig();
const { currency, sessionContext } = useSessionContext();

const endpoint = runtimeConfig.public.shopware?.endpoint;
const accessKey = runtimeConfig.public.shopware?.accessToken;
const context = sessionContext.value;
const salesChannelId = context?.salesChannel?.id;
const contextToken = context?.token;
const currencyCode = currency.value?.isoCode;

if (
  !endpoint ||
  !accessKey ||
  !salesChannelId ||
  !contextToken ||
  !currencyCode
) {
  throw new Error("Shopware session is not ready for ShopwarePayments");
}

// This client keeps the token, currency, and sales channel below.
// Call init() again when one of them changes, and render into new elements.
const shopwarePayments: ShopwarePaymentsClient =
  await window.ShopwarePayments.init({
    // Shopware base URL. A trailing /store-api on the Nuxt endpoint is removed.
    storefrontUrl: endpoint,
    salesChannelId,
    storeApi: {
      accessKey,
      contextToken,
    },
    currencyCode,
    shopId: "YOUR_SHOP_ID",
  });

export { shopwarePayments };
