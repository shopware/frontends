import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sitemapIndexEntries } from "@/platform/seo/sitemap";
import {
  SITEMAP_CACHE_CONTROL,
  SITEMAP_MISS_CACHE_CONTROL,
} from "@/platform/seo/sitemapIndex";

import { GET } from "./route";

const server = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: server.connection }));
vi.mock("@/platform/seo/sitemap", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/platform/seo/sitemap")>()),
  sitemapIndexEntries: vi.fn(),
}));

const ENTRY = {
  path: "/sitemap/salesChannel-a-b/c.xml.gz",
  languageId: "l1",
  lastmod: "2026-10-01T08:00:00.000Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STOREFRONT_URL", "https://shop.test");
  vi.mocked(sitemapIndexEntries).mockResolvedValue([ENTRY]);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("GET /sitemap.xml", () => {
  it("answers the sitemap index of STOREFRONT_URL as cacheable XML", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
    expect(response.headers.get("Cache-Control")).toBe(SITEMAP_CACHE_CONTROL);
    expect(await response.text()).toContain(
      "<loc>https://shop.test/sitemap/salesChannel-a-b/c.xml.gz</loc>",
    );
    expect(sitemapIndexEntries).toHaveBeenCalledExactlyOnceWith(
      new URL("https://shop.test"),
    );
  });

  it("reads STOREFRONT_URL only after opting out of prerendering", async () => {
    server.connection.mockImplementationOnce(async () => {
      vi.stubEnv("STOREFRONT_URL", "https://runtime.test");
    });

    const response = await GET();

    expect(await response.text()).toContain("https://runtime.test/sitemap/");
  });

  it("answers 404 without STOREFRONT_URL and reads nothing", async () => {
    vi.stubEnv("STOREFRONT_URL", "");

    const response = await GET();

    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toBe(
      SITEMAP_MISS_CACHE_CONTROL,
    );
    expect(sitemapIndexEntries).not.toHaveBeenCalled();
  });

  it("answers 404 when no file belongs to the storefront", async () => {
    vi.mocked(sitemapIndexEntries).mockResolvedValue([]);

    const response = await GET();

    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toBe(
      SITEMAP_MISS_CACHE_CONTROL,
    );
  });

  it("answers an uncached 503 when a read fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sitemapIndexEntries).mockRejectedValue(new Error("offline"));

    const response = await GET();

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Retry-After")).toBe("300");
  });
});
