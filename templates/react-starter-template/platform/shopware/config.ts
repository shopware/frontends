import "server-only";

const DEMO_ENDPOINT = "https://demo-frontends.shopware.store/store-api/";
const DEMO_ACCESS_TOKEN = "SWSCNWDGMUWZM0TLVUU0YKLQVW";
const DEMO_STOREFRONT_URL = "https://demo-frontends.shopware.store/figma";
const DEMO_ORIGIN = new URL(DEMO_ENDPOINT).origin;

export type ShopwareConfig = {
  endpoint: string;
  publicEndpoint: string;
  accessToken: string;
  devStorefrontUrl: string | null;
};

let warnedAboutDemoLeftovers = false;

function pointsAtDemo(url: string | null): boolean {
  if (!url) return false;
  try {
    return new URL(url).origin === DEMO_ORIGIN;
  } catch {
    return false;
  }
}

function warnAboutDemoLeftovers(config: ShopwareConfig): void {
  if (warnedAboutDemoLeftovers || pointsAtDemo(config.endpoint)) return;
  const leftovers = [
    pointsAtDemo(config.publicEndpoint) && "SHOPWARE_PUBLIC_ENDPOINT",
    pointsAtDemo(config.devStorefrontUrl) && "SHOPWARE_DEV_STOREFRONT_URL",
  ].filter(Boolean);
  if (leftovers.length === 0) return;
  warnedAboutDemoLeftovers = true;
  console.warn(
    `[Shopware] SHOPWARE_ENDPOINT points at your own instance, but ${leftovers.join(" and ")} still point at the demo backend, so the browser sends logins and registrations there. Leave them empty or point them at your instance.`,
  );
}

export function getShopwareConfig(): ShopwareConfig {
  const endpoint = process.env.SHOPWARE_ENDPOINT || DEMO_ENDPOINT;
  const config: ShopwareConfig = {
    endpoint,
    publicEndpoint: process.env.SHOPWARE_PUBLIC_ENDPOINT || endpoint,
    accessToken: process.env.SHOPWARE_ACCESS_TOKEN || DEMO_ACCESS_TOKEN,
    devStorefrontUrl:
      process.env.SHOPWARE_DEV_STOREFRONT_URL ||
      (endpoint === DEMO_ENDPOINT ? DEMO_STOREFRONT_URL : null),
  };
  warnAboutDemoLeftovers(config);
  return config;
}
