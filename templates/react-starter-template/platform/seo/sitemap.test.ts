import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { apiClientError } from "@/features/session/session.fixture";

import {
  sitemapIndexEntries,
  sitemapNotFound,
  sitemapUnavailable,
} from "./sitemap";
import { SITEMAP_MISS_CACHE_CONTROL } from "./sitemapIndex";

const { readSalesChannelContext, readSitemapFiles } = vi.hoisted(() => ({
  readSalesChannelContext: vi.fn(),
  readSitemapFiles: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/platform/shopware/reads/context", () => ({
  readSalesChannelContext,
}));
vi.mock("@/platform/shopware/reads/sitemap", () => ({ readSitemapFiles }));

const SITE = new URL("https://shop.test");
const SALES_CHANNEL = "0123456789abcdef0123456789abcdef";
const LANGUAGE_EN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const LANGUAGE_DE = "dddddddddddddddddddddddddddddddd";
const DOMAIN_EN = "11111111111111111111111111111111";
const DOMAIN_PL = "22222222222222222222222222222222";
const DOMAIN_DE = "33333333333333333333333333333333";
const DOMAIN_FIGMA = "44444444444444444444444444444444";

function filePath(languageId: string, domainId: string) {
  return `salesChannel-${SALES_CHANNEL}-${languageId}/${SALES_CHANNEL}-${domainId}-sitemap-shop-test-1.xml.gz`;
}

function file(languageId: string, domainId: string) {
  return {
    filename: `https://shop.test/sitemap/${filePath(languageId, domainId)}`,
    created: "2026-10-01T08:00:00.000Z",
  };
}

function withDomains(
  domains: { id: string; url: string; languageId: string }[],
) {
  readSalesChannelContext.mockResolvedValue({
    salesChannel: { domains },
  } as unknown as Schemas["SalesChannelContext"]);
}

async function freshEntries() {
  vi.resetModules();
  const { sitemapIndexEntries: fresh } = await import("./sitemap");
  return fresh;
}

beforeEach(() => {
  vi.clearAllMocks();
  readSitemapFiles.mockImplementation(async (languageId: string) => [
    file(languageId, DOMAIN_EN),
    file(languageId, DOMAIN_PL),
    file(languageId, DOMAIN_DE),
    file(languageId, DOMAIN_FIGMA),
  ]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sitemapIndexEntries", () => {
  it("reads each language of the served domains once and lists their files", async () => {
    withDomains([
      { id: DOMAIN_EN, url: "https://shop.test", languageId: LANGUAGE_EN },
      {
        id: DOMAIN_PL,
        url: "https://shop.test/pl-PL",
        languageId: LANGUAGE_EN,
      },
      {
        id: DOMAIN_DE,
        url: "https://shop.test/de-DE/",
        languageId: LANGUAGE_DE,
      },
      {
        id: DOMAIN_FIGMA,
        url: "https://shop.test/figma",
        languageId: LANGUAGE_DE,
      },
    ]);

    const entries = await sitemapIndexEntries(SITE);

    expect(readSalesChannelContext).toHaveBeenCalledExactlyOnceWith(null);
    expect(readSitemapFiles.mock.calls).toEqual([[LANGUAGE_EN], [LANGUAGE_DE]]);
    expect(entries.map(({ path, languageId }) => [path, languageId])).toEqual([
      [`/sitemap/${filePath(LANGUAGE_EN, DOMAIN_EN)}`, LANGUAGE_EN],
      [`/sitemap/${filePath(LANGUAGE_EN, DOMAIN_PL)}`, LANGUAGE_EN],
      [`/sitemap/${filePath(LANGUAGE_DE, DOMAIN_DE)}`, LANGUAGE_DE],
    ]);
  });

  it("reads no sitemap and warns once when no domain is on STOREFRONT_URL", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    withDomains([
      {
        id: DOMAIN_FIGMA,
        url: "https://demo-frontends.shopware.store/figma",
        languageId: LANGUAGE_EN,
      },
    ]);
    const entries = await freshEntries();

    await expect(entries(SITE)).resolves.toEqual([]);
    await expect(entries(SITE)).resolves.toEqual([]);

    expect(readSitemapFiles).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      "[SEO] no Shopware sitemap file belongs to a sales channel domain of STOREFRONT_URL, so /sitemap.xml answers 404",
    );
  });

  it("warns when the served domains have no file yet", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    withDomains([
      { id: DOMAIN_EN, url: "https://shop.test", languageId: LANGUAGE_EN },
    ]);
    readSitemapFiles.mockResolvedValue([]);
    const entries = await freshEntries();

    await expect(entries(SITE)).resolves.toEqual([]);

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("lets a failed read throw", async () => {
    withDomains([
      { id: DOMAIN_EN, url: "https://shop.test", languageId: LANGUAGE_EN },
    ]);
    readSitemapFiles.mockRejectedValue(new Error("offline"));

    await expect(sitemapIndexEntries(SITE)).rejects.toThrow("offline");
  });
});

describe("sitemap responses", () => {
  it("answers a miss with a short shared cache", async () => {
    const response = sitemapNotFound();

    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toBe(
      SITEMAP_MISS_CACHE_CONTROL,
    );
  });

  it("answers a failed read with an uncached 503 and logs only its summary", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = sitemapUnavailable(
      apiClientError([{ code: "FRAMEWORK__ERROR", detail: "secret" }], 500),
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Retry-After")).toBe("300");
    expect(error).toHaveBeenCalledExactlyOnceWith(
      "[SEO] reading the Shopware sitemap failed",
      { status: 500, codes: ["FRAMEWORK__ERROR"] },
    );
    expect(JSON.stringify(error.mock.calls)).not.toContain("secret");
  });
});
