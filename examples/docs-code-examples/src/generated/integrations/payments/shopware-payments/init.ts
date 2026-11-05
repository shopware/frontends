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

const shopwarePayments: ShopwarePaymentsClient =
  await window.ShopwarePayments.init({
    // Shopware base URL, including a language prefix or subdirectory.
    // Strip a trailing /store-api from the Nuxt endpoint.
    storefrontUrl: endpoint.replace(/\/store-api\/?$/, ""),
    salesChannelId,
    storeApi: {
      accessKey,
      contextToken,
    },
    currencyCode,
    shopId: "YOUR_SHOP_ID",
  });

export { shopwarePayments };
