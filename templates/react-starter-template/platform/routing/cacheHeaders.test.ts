import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import { defaultLocale, locales } from "@/i18n/config";
import nextConfig from "@/next.config";

import {
  PERSONAL_CACHE_CONTROL,
  PUBLIC_ASSETS,
  PUBLIC_ASSET_CACHE_CONTROL,
  cacheHeaderRules,
  localePathPrefixes,
} from "./cacheHeaders";

const PUBLIC_DIR = fileURLToPath(new URL("../../public", import.meta.url));

async function headersFor(url: string, headers: Record<string, string> = {}) {
  const response = await unstable_getResponseFromNextConfig({
    url: `https://shop.test${url}`,
    nextConfig,
    headers,
  });
  return {
    cacheControl: response.headers.get("cache-control"),
    surrogateControl: response.headers.get("surrogate-control"),
  };
}

const personalPaths = [
  "/checkout",
  "/checkout/",
  "/checkout/cart",
  "/checkout/success/0190f0c1d2e3f4a5/paid",
  "/account",
  "/account/",
  "/account/login",
  "/account/login/imitate-customer",
  "/account/order/details/1",
  "/account/order/abc",
  "/wishlist",
  "/wishlist/",
  "/pl-PL/checkout/cart",
  "/pl-PL/account",
  "/pl-PL/wishlist",
  "/de-DE/account/profile",
  "/de-DE/checkout",
  "/de-DE/wishlist/",
  "/registration/confirm",
  "/registration/confirm/",
  "/pl-PL/registration/confirm",
  "/newsletter-subscribe",
  "/newsletter-subscribe/",
  "/de-DE/newsletter-subscribe",
];

const publicPaths = [
  "/",
  "/pl-PL",
  "/de-DE/",
  "/Clothing/",
  "/Clothing/?p=2&order=price-asc",
  "/accountancy/",
  "/checkout-tips/",
  "/wishlists",
  "/my/account",
  "/Main-product/SW10002.1",
  "/en-GB/checkout",
  "/api/shopware/config",
  "/_next/static/chunks/app.js",
  "/favicon.ico",
  "/pl-PL/logo.svg",
  "/logo.svg.map",
  "/search?search=shirt",
  "/pl-PL/search",
  "/registration",
  "/Registration",
  "/registration-info/",
  "/newsletter-subscribers",
];

describe("cache headers of personal routes", () => {
  it.each(personalPaths)(
    "%s is never stored by a browser or a CDN",
    async (path) => {
      await expect(headersFor(path)).resolves.toEqual({
        cacheControl: PERSONAL_CACHE_CONTROL,
        surrogateControl: "no-store",
      });
    },
  );

  it.each(["/checkout/cart", "/pl-PL/account/address", "/wishlist"])(
    "%s keeps the headers for RSC requests",
    async (path) => {
      await expect(headersFor(path, { rsc: "1" })).resolves.toEqual({
        cacheControl: PERSONAL_CACHE_CONTROL,
        surrogateControl: "no-store",
      });
      await expect(headersFor(`${path}?_rsc=abc12`)).resolves.toEqual({
        cacheControl: PERSONAL_CACHE_CONTROL,
        surrogateControl: "no-store",
      });
    },
  );
});

describe("cache headers of everything else", () => {
  it.each(publicPaths)(
    "%s keeps the Cache-Control of Next.js",
    async (path) => {
      await expect(headersFor(path)).resolves.toEqual({
        cacheControl: null,
        surrogateControl: null,
      });
    },
  );
});

describe("cache headers of public assets", () => {
  it.each(PUBLIC_ASSETS)(
    "%s is cached for a week, not immutable",
    async (path) => {
      await expect(headersFor(path)).resolves.toEqual({
        cacheControl: "public, max-age=604800",
        surrogateControl: null,
      });
      expect(PUBLIC_ASSET_CACHE_CONTROL).not.toContain("immutable");
    },
  );

  it("lists every file in public/", () => {
    expect([...PUBLIC_ASSETS].sort()).toEqual(
      readdirSync(PUBLIC_DIR)
        .map((file) => `/${file}`)
        .sort(),
    );
  });
});

describe("cacheHeaderRules", () => {
  it("covers the unprefixed path and every prefixed locale", () => {
    expect(localePathPrefixes()).toEqual([
      "",
      ...locales
        .filter((locale) => locale !== defaultLocale)
        .map((locale) => `/${locale}`),
    ]);
  });

  it("is what next.config serves", async () => {
    await expect(nextConfig.headers?.()).resolves.toEqual(cacheHeaderRules());
  });

  it("has no rule that matches every path", () => {
    for (const { source } of cacheHeaderRules()) {
      expect(source).not.toMatch(/^\/:path|^\/\(\.\*\)|^\/_next|^\/api/);
    }
  });
});
