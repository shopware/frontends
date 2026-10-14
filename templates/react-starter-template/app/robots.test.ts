import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import robots from "./robots";

const server = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: server.connection }));

beforeEach(() => {
  server.connection.mockClear();
  vi.stubEnv("STOREFRONT_URL", "https://shop.test");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots.txt", () => {
  it("lists the sitemap of STOREFRONT_URL next to the rules", async () => {
    const result = await robots();

    expect(result.sitemap).toBe("https://shop.test/sitemap.xml");
    expect(result.rules).toMatchObject({ userAgent: "*" });
  });

  it("reads STOREFRONT_URL only after opting out of prerendering", async () => {
    server.connection.mockImplementationOnce(async () => {
      vi.stubEnv("STOREFRONT_URL", "https://runtime.test");
    });

    const result = await robots();

    expect(server.connection).toHaveBeenCalledTimes(1);
    expect(result.sitemap).toBe("https://runtime.test/sitemap.xml");
  });

  it.each(["", "not a url", "ftp://shop.test"])(
    "lists no sitemap for STOREFRONT_URL %j",
    async (value) => {
      vi.stubEnv("STOREFRONT_URL", value);

      expect(await robots()).not.toHaveProperty("sitemap");
    },
  );
});
