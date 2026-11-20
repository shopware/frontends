import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl, parseSiteUrl } from "./siteUrl";

vi.mock("server-only", () => ({}));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("parseSiteUrl", () => {
  it("keeps only the origin of an http(s) URL", () => {
    expect(parseSiteUrl("https://shop.test/base/?x=1")?.toString()).toBe(
      "https://shop.test/",
    );
    expect(parseSiteUrl("http://localhost:3000")?.toString()).toBe(
      "http://localhost:3000/",
    );
  });

  it.each(["", "ftp://shop.test", "not a url", undefined])(
    "rejects %s",
    (value) => {
      expect(parseSiteUrl(value)).toBeNull();
    },
  );
});

describe("getSiteUrl", () => {
  it("reads STOREFRONT_URL", () => {
    vi.stubEnv("STOREFRONT_URL", "https://shop.test");
    expect(getSiteUrl()?.origin).toBe("https://shop.test");
    vi.stubEnv("STOREFRONT_URL", "");
    expect(getSiteUrl()).toBeNull();
  });
});
