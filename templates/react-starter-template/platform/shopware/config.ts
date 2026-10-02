import "server-only";

const DEMO_ENDPOINT = "https://demo-frontends.shopware.store/store-api/";
const DEMO_ACCESS_TOKEN = "SWSCNWDGMUWZM0TLVUU0YKLQVW";

export type ShopwareConfig = {
  endpoint: string;
  accessToken: string;
};

export function getShopwareConfig(): ShopwareConfig {
  return {
    endpoint: process.env.SHOPWARE_ENDPOINT || DEMO_ENDPOINT,
    accessToken: process.env.SHOPWARE_ACCESS_TOKEN || DEMO_ACCESS_TOKEN,
  };
}
