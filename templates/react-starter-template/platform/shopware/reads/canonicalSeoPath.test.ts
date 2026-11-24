import { encodeForQuery } from "@shopware/api-client/helpers";
import { cacheLife, cacheTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createShopwareClient } from "../client";
import { readCanonicalSeoPath } from "./canonicalSeoPath";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("../client", () => ({
  createShopwareClient: vi.fn(),
}));

const invoke = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createShopwareClient).mockReturnValue({
    invoke,
  } as unknown as ReturnType<typeof createShopwareClient>);
});

describe("readCanonicalSeoPath", () => {
  it("reads the entity's SEO URL in the language, cached under the SEO URL tags", async () => {
    invoke.mockResolvedValue({
      data: { elements: [{ seoPathInfo: "Bekleidung/" }] },
    });

    await expect(
      readCanonicalSeoPath("frontend.navigation.page", "c1", "language-de"),
    ).resolves.toBe("Bekleidung/");

    expect(createShopwareClient).toHaveBeenCalledExactlyOnceWith({
      languageId: "language-de",
    });
    expect(invoke).toHaveBeenCalledExactlyOnceWith(
      "readSeoUrlGet get /seo-url",
      {
        query: {
          _criteria: encodeForQuery({
            filter: [
              {
                type: "equals",
                field: "routeName",
                value: "frontend.navigation.page",
              },
              { type: "equals", field: "foreignKey", value: "c1" },
            ],
            limit: 1,
            includes: { seo_url: ["seoPathInfo"] },
          }),
        },
      },
    );
    expect(cacheLife).toHaveBeenCalledExactlyOnceWith("seo");
    expect(cacheTag).toHaveBeenCalledExactlyOnceWith(
      "sw:seo-url",
      "sw:seo-url:language-de",
    );
  });

  it.each([
    ["no SEO URL", { elements: [] }],
    ["an empty path", { elements: [{ seoPathInfo: "" }] }],
    ["no elements", {}],
  ])("gives nothing for %s", async (_, data) => {
    invoke.mockResolvedValue({ data });

    await expect(
      readCanonicalSeoPath("frontend.detail.page", "p1", "language-de"),
    ).resolves.toBeNull();
  });

  it("lets a failed read throw, so the failure is not cached", async () => {
    invoke.mockRejectedValue(new Error("offline"));

    await expect(
      readCanonicalSeoPath("frontend.detail.page", "p1", "language-de"),
    ).rejects.toThrow("offline");
  });
});
