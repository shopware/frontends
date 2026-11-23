import "server-only";
import { getSiteUrl } from "@/platform/seo/siteUrl";
import { getShopwareConfig } from "@/platform/shopware/config";

export type ResourceHintOrigins = {
  media: string | null;
  storeApi: string | null;
};

let warnedAboutMediaOrigin = false;

function httpOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.origin
      : null;
  } catch {
    return null;
  }
}

function configuredMediaOrigin(mediaOrigin: string | null): string | null {
  if (mediaOrigin === null) return null;
  const origin = httpOrigin(mediaOrigin);
  if (origin === null && !warnedAboutMediaOrigin) {
    warnedAboutMediaOrigin = true;
    console.warn(
      "[Shopware] SHOPWARE_MEDIA_ORIGIN is not an http(s) URL, so it is ignored",
    );
  }
  return origin;
}

export function resourceHintOrigins(): ResourceHintOrigins {
  const { publicEndpoint, mediaOrigin } = getShopwareConfig();
  const siteOrigin = getSiteUrl()?.origin ?? null;
  const crossOrigin = (origin: string | null) =>
    origin === siteOrigin ? null : origin;
  const storeApi = httpOrigin(publicEndpoint);
  return {
    media: crossOrigin(configuredMediaOrigin(mediaOrigin) ?? storeApi),
    storeApi: crossOrigin(storeApi),
  };
}
