import {
  getRedirectUrl,
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import nextConfig from "./next.config";
import { config, proxy } from "./proxy";

const ORIGIN = "https://shop.test";

function run(path: string) {
  return proxy(new NextRequest(`${ORIGIN}${path}`));
}

function passesThrough(response: ReturnType<typeof proxy>) {
  return (
    response.headers.get("x-middleware-next") === "1" &&
    !isRewrite(response) &&
    getRedirectUrl(response) === null
  );
}

describe("proxy rewrites unprefixed paths to the default locale", () => {
  it.each([
    ["/", `${ORIGIN}/en-GB`],
    ["/account", `${ORIGIN}/en-GB/account`],
    [
      "/account/login?redirect=%2Fcheckout",
      `${ORIGIN}/en-GB/account/login?redirect=%2Fcheckout`,
    ],
    ["/Clothing/", `${ORIGIN}/en-GB/Clothing/`],
    [
      "/Clothing/?p=2&order=price-asc",
      `${ORIGIN}/en-GB/Clothing/?p=2&order=price-asc`,
    ],
    ["/Main-product/SW10002.1", `${ORIGIN}/en-GB/Main-product/SW10002.1`],
    ["/Shirt/TS-100.XL", `${ORIGIN}/en-GB/Shirt/TS-100.XL`],
    ["/summer-sale.html", `${ORIGIN}/en-GB/summer-sale.html`],
    ["/pl-pl/account", `${ORIGIN}/en-GB/pl-pl/account`],
    ["/en-GBX", `${ORIGIN}/en-GB/en-GBX`],
    ["/apiary", `${ORIGIN}/en-GB/apiary`],
  ])("%s", (path, target) => {
    const response = run(path);

    expect(isRewrite(response)).toBe(true);
    expect(getRewrittenUrl(response)).toBe(target);
    expect(getRedirectUrl(response)).toBeNull();
  });
});

describe("proxy redirects the default locale prefix away", () => {
  it.each([
    ["/en-GB", `${ORIGIN}/`],
    ["/en-GB/", `${ORIGIN}/`],
    ["/en-GB/account", `${ORIGIN}/account`],
    ["/en-GB/Clothing/?p=2", `${ORIGIN}/Clothing/?p=2`],
  ])("%s with a permanent redirect", (path, target) => {
    const response = run(path);

    expect(response.status).toBe(308);
    expect(getRedirectUrl(response)).toBe(target);
    expect(isRewrite(response)).toBe(false);
  });
});

describe("proxy passes other requests through", () => {
  it.each([
    "/pl-PL",
    "/pl-PL/",
    "/pl-PL/account",
    "/de-DE/Clothing/?p=2",
    "/de-DE/checkout/success/0123456789abcdef0123456789abcdef",
  ])("the prefixed locale path %s", (path) => {
    expect(passesThrough(run(path))).toBe(true);
  });

  it.each([
    "/api",
    "/api/shopware/config",
    "/_next/static/chunks/main.js",
    "/_next/image?url=%2Flogo.svg",
    "/favicon.ico",
    "/logo.svg",
    "/robots.txt",
    "/fonts/inter.woff2",
  ])("the technical or file request %s", (path) => {
    expect(passesThrough(run(path))).toBe(true);
  });
});

describe("proxy matcher", () => {
  it.each([
    ["/", true],
    ["/account", true],
    ["/pl-PL/account", true],
    ["/en-GB/account", true],
    ["/Main-product/SW10002.1", true],
    ["/Shirt/TS-100.XL", true],
    ["/summer-sale.html", true],
    ["/apiary", true],
    ["/api", false],
    ["/api/shopware/config", false],
    ["/_next/static/chunks/main.js", false],
    ["/favicon.ico", false],
    ["/logo-white.svg", false],
    ["/logo.svg", false],
    ["/robots.txt", false],
    ["/fonts/inter.woff2", false],
  ])("runs for %s: %s", (url, expected) => {
    expect(unstable_doesMiddlewareMatch({ config, nextConfig, url })).toBe(
      expected,
    );
  });
});
