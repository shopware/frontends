import type { ShopwarePaymentsClient } from "./snippet-context";

// These values are the shopper's current Store API session.
// Call init() again when the token, currency, or sales channel changes,
// and render into new elements.
const shopwarePayments: ShopwarePaymentsClient =
  await window.ShopwarePayments.init({
    // Shopware base URL, including a language prefix or subdirectory.
    // A trailing /store-api is removed.
    storefrontUrl: "https://shop.example/en",
    salesChannelId: "SALES_CHANNEL_ID",
    storeApi: {
      accessKey: "SWSC_ACCESS_KEY",
      contextToken: "CONTEXT_TOKEN",
    },
    currencyCode: "EUR",
  });

export { shopwarePayments };
