import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sitemapIndexEntries } from "@/platform/seo/sitemap";
import {
  SITEMAP_CACHE_CONTROL,
  SITEMAP_MISS_CACHE_CONTROL,
} from "@/platform/seo/sitemapIndex";
import { readSitemapFile } from "@/platform/shopware/reads/sitemap";

import { GET } from "./route";

const server = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: server.connection }));
vi.mock("@/platform/seo/sitemap", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/platform/seo/sitemap")>()),
  sitemapIndexEntries: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/sitemap", () => ({
  readSitemapFile: vi.fn(),
}));

const SALES_CHANNEL = "0123456789abcdef0123456789abcdef";
const LANGUAGE = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const DIRECTORY = `salesChannel-${SALES_CHANNEL}-${LANGUAGE}`;
const LISTED = `${SALES_CHANNEL}-11111111111111111111111111111111-sitemap-shop-test-1.xml.gz`;
const UNLISTED = `${SALES_CHANNEL}-22222222222222222222222222222222-sitemap-shop-test-1.xml.gz`;

function request(directory: string, name: string) {
  return GET(new Request(`https://shop.test/sitemap/${directory}/${name}`), {
    params: Promise.resolve({ file: [directory, name] }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STOREFRONT_URL", "https://shop.test");
  vi.mocked(sitemapIndexEntries).mockResolvedValue([
    {
      path: `/sitemap/${DIRECTORY}/${LISTED}`,
      languageId: LANGUAGE,
      lastmod: null,
    },
  ]);
  vi.mocked(readSitemapFile).mockResolvedValue(
    new Uint8Array([0x1f, 0x8b, 8]).buffer,
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("GET /sitemap/<directory>/<file>.xml.gz", () => {
  it("streams a listed file in its language as a cacheable gzip file", async () => {
    const response = await request(DIRECTORY, LISTED);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/gzip");
    expect(response.headers.get("Content-Encoding")).toBeNull();
    expect(response.headers.get("Cache-Control")).toBe(SITEMAP_CACHE_CONTROL);
    expect([...new Uint8Array(await response.arrayBuffer())]).toEqual([
      0x1f, 0x8b, 8,
    ]);
    expect(readSitemapFile).toHaveBeenCalledExactlyOnceWith(
      `${DIRECTORY}/${LISTED}`,
      LANGUAGE,
    );
  });

  it("answers 404 for a file that is not in the index, without asking Shopware for it", async () => {
    const response = await request(DIRECTORY, UNLISTED);

    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toBe(
      SITEMAP_MISS_CACHE_CONTROL,
    );
    expect(readSitemapFile).not.toHaveBeenCalled();
  });

  it.each([
    ["a name that is not a sitemap file", DIRECTORY, "robots.xml.gz"],
    ["a directory of another shape", "..", LISTED],
  ])("answers 404 for %s without any read", async (_, directory, name) => {
    const response = await request(directory, name);

    expect(response.status).toBe(404);
    expect(sitemapIndexEntries).not.toHaveBeenCalled();
    expect(readSitemapFile).not.toHaveBeenCalled();
  });

  it("answers 404 without STOREFRONT_URL", async () => {
    vi.stubEnv("STOREFRONT_URL", "");

    const response = await request(DIRECTORY, LISTED);

    expect(response.status).toBe(404);
    expect(sitemapIndexEntries).not.toHaveBeenCalled();
  });

  it("answers 404 when Shopware has no such file in the language", async () => {
    vi.mocked(readSitemapFile).mockResolvedValue(null);

    const response = await request(DIRECTORY, LISTED);

    expect(response.status).toBe(404);
  });

  it.each([
    ["the index", () => vi.mocked(sitemapIndexEntries)],
    ["the file", () => vi.mocked(readSitemapFile)],
  ])("answers an uncached 503 when reading %s fails", async (_, failing) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    failing().mockRejectedValue(new Error("offline"));

    const response = await request(DIRECTORY, LISTED);

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
