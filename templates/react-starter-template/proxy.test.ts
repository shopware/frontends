import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  getRedirectUrl,
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import type { NextFetchEvent, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { APP_ROUTE_SEGMENTS } from "@/platform/routing/paths";
import type { SeoResolution } from "@/platform/routing/seoResolver";

import nextConfig from "./next.config";
import {
  NOT_FOUND_CACHE_CONTROL,
  REDIRECT_CACHE_CONTROL,
  config,
  proxy,
} from "./proxy";

const routing = vi.hoisted(() => ({
  maintenance: false,
  languagesUnavailable: false,
  resolution: { type: "found" } as SeoResolution,
  resolve: vi.fn(),
  isActive: vi.fn(),
}));

vi.mock("@/platform/routing/shopwareRouting", () => ({
  maintenanceMonitor: {
    isActive: routing.isActive,
  },
  resolveProxyLanguageId: async (locale: string) =>
    routing.languagesUnavailable
      ? { status: "unavailable" }
      : {
          status: "resolved",
          languageId: locale === "pl-PL" ? "language-pl" : "language-en",
        },
  seoResolver: { resolve: routing.resolve },
}));

const ORIGIN = "https://shop.test";

beforeEach(() => {
  routing.maintenance = false;
  routing.languagesUnavailable = false;
  routing.resolution = { type: "found" };
  routing.resolve.mockReset();
  routing.resolve.mockImplementation(async () => routing.resolution);
  routing.isActive.mockReset();
  routing.isActive.mockImplementation(async () => routing.maintenance);
});

function run(path: string, event?: NextFetchEvent) {
  return proxy(new NextRequest(`${ORIGIN}${path}`), event);
}

function passesThrough(response: NextResponse) {
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
    ["/wishlist", `${ORIGIN}/en-GB/wishlist`],
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
  ])("%s", async (path, target) => {
    const response = await run(path);

    expect(isRewrite(response)).toBe(true);
    expect(getRewrittenUrl(response)).toBe(target);
    expect(getRedirectUrl(response)).toBeNull();
    expect(response.headers.get("cache-control")).toBeNull();
  });
});

describe("proxy redirects the default locale prefix away", () => {
  it.each([
    ["/en-GB", `${ORIGIN}/`],
    ["/en-GB/", `${ORIGIN}/`],
    ["/en-GB/account", `${ORIGIN}/account`],
    ["/en-GB/Clothing/?p=2", `${ORIGIN}/Clothing/?p=2`],
  ])("%s with a permanent redirect", async (path, target) => {
    const response = await run(path);

    expect(response.status).toBe(308);
    expect(getRedirectUrl(response)).toBe(target);
    expect(isRewrite(response)).toBe(false);
    expect(routing.resolve).not.toHaveBeenCalled();
    expect(routing.isActive).not.toHaveBeenCalled();
  });
});

describe("proxy passes other requests through", () => {
  it.each([
    "/pl-PL",
    "/pl-PL/",
    "/pl-PL/account",
    "/de-DE/Clothing/?p=2",
    "/de-DE/checkout/success/0123456789abcdef0123456789abcdef",
  ])("the prefixed locale path %s", async (path) => {
    expect(passesThrough(await run(path))).toBe(true);
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
  ])("the technical or file request %s", async (path) => {
    expect(passesThrough(await run(path))).toBe(true);
    expect(routing.isActive).not.toHaveBeenCalled();
  });
});

describe("proxy SEO resolution", () => {
  it("asks the resolver with the path without the locale and the locale's language", async () => {
    const waitUntil = vi.fn();
    await run("/pl-PL/Clothing/?p=2", {
      waitUntil,
    } as unknown as NextFetchEvent);

    expect(routing.resolve).toHaveBeenCalledWith("/Clothing/", "language-pl", {
      waitUntil: expect.any(Function),
    });
    const [, , options] = routing.resolve.mock.calls[0] as [
      string,
      string,
      { waitUntil: (promise: Promise<unknown>) => void },
    ];
    const pending = Promise.resolve();
    options.waitUntil(pending);
    expect(waitUntil).toHaveBeenCalledWith(pending);
  });

  it.each(["/", "/pl-PL", "/account/login", "/checkout/cart", "/wishlist"])(
    "does not look up %s",
    async (path) => {
      await run(path);

      expect(routing.resolve).not.toHaveBeenCalled();
    },
  );

  it.each([
    [
      "/navigation/0123456789abcdef0123456789abcdef?p=2",
      `${ORIGIN}/Clothing/?p=2`,
    ],
    [
      "/pl-PL/navigation/0123456789abcdef0123456789abcdef",
      `${ORIGIN}/pl-PL/Clothing/`,
    ],
  ])("redirects %s permanently to the SEO URL", async (path, target) => {
    routing.resolution = { type: "redirect", path: "/Clothing/" };

    const response = await run(path);

    expect(response.status).toBe(301);
    expect(getRedirectUrl(response)).toBe(target);
    expect(response.headers.get("cache-control")).toBe(REDIRECT_CACHE_CONTROL);
  });

  it("keeps non-ASCII redirect targets valid", async () => {
    routing.resolution = { type: "redirect", path: "/Möbel/" };

    const response = await run("/moebel");

    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/M%C3%B6bel/`);
  });

  it.each([
    ["/missing-page?x=1", `${ORIGIN}/en-GB/sw/not-found`],
    ["/de-DE/missing-page", `${ORIGIN}/de-DE/sw/not-found`],
    ["/sw/not-found", `${ORIGIN}/en-GB/sw/not-found`],
  ])("renders the not-found page for %s", async (path, target) => {
    routing.resolution = { type: "not-found" };

    const response = await run(path);

    expect(isRewrite(response)).toBe(true);
    expect(getRewrittenUrl(response)).toBe(target);
    expect(response.headers.get("cache-control")).toBe(NOT_FOUND_CACHE_CONTROL);
  });

  it("falls back to rendering when the resolver is unavailable", async () => {
    routing.resolution = { type: "unavailable" };

    const response = await run("/Clothing/");

    expect(getRewrittenUrl(response)).toBe(`${ORIGIN}/en-GB/Clothing/`);
    expect(response.headers.get("cache-control")).toBeNull();
  });

  it("renders without a lookup while the languages cannot be read", async () => {
    routing.languagesUnavailable = true;

    const response = await run("/pl-PL/Meble/");

    expect(passesThrough(response)).toBe(true);
    expect(routing.resolve).not.toHaveBeenCalled();
  });

  it("never redirects to another host", async () => {
    routing.resolution = { type: "redirect", path: "//evil.test/x" };

    const response = await run("/x");

    expect(getRedirectUrl(response)).toBeNull();
    expect(getRewrittenUrl(response)).toBe(`${ORIGIN}/en-GB/x`);
  });
});

describe("proxy maintenance mode", () => {
  it.each(["/", "/account", "/Clothing/"])(
    "answers %s with a 503 page while the shop is in maintenance",
    async (path) => {
      routing.maintenance = true;

      const response = await run(path);
      const html = await response.text();

      expect(response.status).toBe(503);
      expect(response.headers.get("retry-after")).toBe("300");
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(response.headers.get("content-type")).toBe(
        "text/html; charset=utf-8",
      );
      expect(html).toContain('<html lang="en-GB">');
      expect(html).toContain("<h1>503</h1>");
      expect(html).toContain('<meta name="robots" content="noindex">');
      expect(routing.resolve).not.toHaveBeenCalled();
    },
  );

  it("localizes the 503 page", async () => {
    routing.maintenance = true;

    const html = await (await run("/pl-PL/Clothing/")).text();

    expect(html).toContain('<html lang="pl-PL">');
    expect(html).toContain(
      "<h2>W sklepie trwają prace serwisowe. Wróć wkrótce.</h2>",
    );
  });

  it("answers 503 when the lookup reports maintenance", async () => {
    routing.resolution = { type: "maintenance" };

    const response = await run("/Clothing/");

    expect(response.status).toBe(503);
  });

  it("hands the background maintenance check to the request's waitUntil", async () => {
    const waitUntil = vi.fn();
    await run("/account", { waitUntil } as unknown as NextFetchEvent);

    const [handOver] = routing.isActive.mock.calls[0] as [
      (promise: Promise<unknown>) => void,
    ];
    const pending = Promise.resolve();
    handOver(pending);
    expect(waitUntil).toHaveBeenCalledWith(pending);
  });
});

describe("proxy app routes", () => {
  it("lists every static top-level route segment of the app", () => {
    const root = fileURLToPath(new URL("./app/[locale]", import.meta.url));
    const staticSegments = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => {
          if (entry.name.startsWith("(")) {
            return staticSegments(`${dir}/${entry.name}`);
          }
          return entry.name.startsWith("[") ? [] : [entry.name];
        });

    expect(
      [...new Set(staticSegments(root))].filter((name) => name !== "sw").sort(),
    ).toEqual([...APP_ROUTE_SEGMENTS].sort());
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
