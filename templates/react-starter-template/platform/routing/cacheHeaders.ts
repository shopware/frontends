import type { NextConfig } from "next";

import { localePrefix, locales } from "../../i18n/config";

export type HeaderRule = Awaited<
  ReturnType<NonNullable<NextConfig["headers"]>>
>[number];

export const PERSONAL_CACHE_CONTROL =
  "private, no-cache, no-store, max-age=0, must-revalidate";

export const PERSONAL_SURROGATE_CONTROL = "no-store";

export const PERSONAL_AREAS = [
  "account",
  "checkout",
  "wishlist",
  "registration/confirm",
  "newsletter-subscribe",
] as const;

export const PUBLIC_ASSETS = ["/logo-white.svg", "/logo.svg"] as const;

export const PUBLIC_ASSET_CACHE_CONTROL = "public, max-age=604800";

export function localePathPrefixes(): string[] {
  return locales.map((locale) => {
    const prefix = localePrefix(locale);
    return prefix ? `/${prefix}` : "";
  });
}

export function personalRouteHeaderRules(): HeaderRule[] {
  return localePathPrefixes().flatMap((prefix) =>
    PERSONAL_AREAS.map((area) => ({
      source: `${prefix}/${area}/:path*`,
      headers: [
        { key: "Cache-Control", value: PERSONAL_CACHE_CONTROL },
        { key: "Surrogate-Control", value: PERSONAL_SURROGATE_CONTROL },
      ],
    })),
  );
}

export function publicAssetHeaderRules(): HeaderRule[] {
  return PUBLIC_ASSETS.map((source) => ({
    source,
    headers: [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE_CONTROL }],
  }));
}

export function cacheHeaderRules(): HeaderRule[] {
  return [...publicAssetHeaderRules(), ...personalRouteHeaderRules()];
}
