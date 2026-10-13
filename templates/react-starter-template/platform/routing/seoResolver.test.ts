import { gunzipSync } from "node:zlib";

import { describe, expect, it, vi } from "vitest";

import { apiClientError } from "@/features/session/session.fixture";

import { createLruCache } from "./lruCache";
import {
  FOUND_TTL_MS,
  NOT_FOUND_TTL_MS,
  REDIRECT_TTL_MS,
  SEO_LOOKUP_TIMEOUT_MS,
  UNAVAILABLE_BACKOFF_MS,
  createSeoResolver,
} from "./seoResolver";
import type { SeoClient, SeoResolution } from "./seoResolver";

const READ_SEO_URL = "readSeoUrlGet get /seo-url";
const ID = "0123456789abcdef0123456789abcdef";

type Filter = { type: string; field: string; value: unknown };
type Criteria = { filter: Filter[]; limit: number; includes: unknown };
type Row = {
  routeName?: string;
  foreignKey?: string;
  seoPathInfo?: string;
  pathInfo?: string;
};
type Answer = (criteria: Criteria) => Row[] | Promise<Row[]>;

function decodeCriteria(encoded: string): Criteria {
  return JSON.parse(gunzipSync(Buffer.from(encoded, "base64url")).toString());
}

function clock() {
  let time = 0;
  return {
    now: () => time,
    advance(ms: number) {
      time += ms;
    },
  };
}

function setup(answer: Answer, now = clock()) {
  const lookups: { languageId: string | null; criteria: Criteria }[] = [];
  const fetchOptions: unknown[] = [];
  const onFailure = vi.fn();
  const onLookup = vi.fn();
  const cache = createLruCache<SeoResolution>({ max: 100, now: now.now });
  const getClient = (languageId: string | null): SeoClient =>
    ({
      invoke: async (
        operation: string,
        params: { query: { _criteria: string }; fetchOptions: unknown },
      ) => {
        if (operation !== READ_SEO_URL) throw new Error(operation);
        const criteria = decodeCriteria(params.query._criteria);
        lookups.push({ languageId, criteria });
        fetchOptions.push(params.fetchOptions);
        return { data: { elements: await answer(criteria) }, status: 200 };
      },
    }) as unknown as SeoClient;
  const resolver = createSeoResolver({
    getClient,
    cache,
    now: now.now,
    onFailure,
    onLookup,
  });
  return {
    resolver,
    lookups,
    fetchOptions,
    onFailure,
    onLookup,
    cache,
    clock: now,
  };
}

function category(seoPathInfo: string): Row {
  return {
    routeName: "frontend.navigation.page",
    foreignKey: ID,
    seoPathInfo,
    pathInfo: `/navigation/${ID}`,
  };
}

function hasFilter(criteria: Criteria, field: string): boolean {
  return criteria.filter.some((filter) => filter.field === field);
}

describe("createSeoResolver for SEO paths", () => {
  it("finds a stored path with the language client, a timeout and no retry", async () => {
    const { resolver, lookups, fetchOptions } = setup(() => [
      category("Clothing/"),
    ]);

    await expect(
      resolver.resolve("/Clothing/", "language-pl"),
    ).resolves.toEqual({ type: "found" });
    expect(lookups).toEqual([
      {
        languageId: "language-pl",
        criteria: {
          filter: [
            {
              type: "equalsAny",
              field: "seoPathInfo",
              value: ["Clothing", "Clothing/"],
            },
          ],
          limit: 2,
          includes: {
            seo_url: ["routeName", "foreignKey", "seoPathInfo", "pathInfo"],
          },
        },
      },
    ]);
    expect(fetchOptions).toEqual([
      { timeout: SEO_LOOKUP_TIMEOUT_MS, retry: 0 },
    ]);
  });

  it("redirects another case or slash spelling to the stored one", async () => {
    const { resolver } = setup(() => [category("Clothing/")]);

    await expect(resolver.resolve("/clothing", null)).resolves.toEqual({
      type: "redirect",
      path: "/Clothing/",
    });
  });

  it("prefers the row that matches the request exactly", async () => {
    const { resolver } = setup(() => [
      category("Clothing"),
      category("Clothing/"),
    ]);

    await expect(resolver.resolve("/Clothing/", null)).resolves.toEqual({
      type: "found",
    });
  });

  it("treats encoded and decoded spellings as the same path", async () => {
    const { resolver } = setup(() => [category("M%C3%B6bel/")]);

    await expect(resolver.resolve("/M%C3%B6bel/", null)).resolves.toEqual({
      type: "found",
    });
    await expect(resolver.resolve("/Möbel/", "other")).resolves.toEqual({
      type: "found",
    });
  });

  it("renders a customer group registration page", async () => {
    const { resolver } = setup(() => [
      {
        routeName: "frontend.account.customer-group-registration.page",
        foreignKey: ID,
        seoPathInfo: "B2B-signup",
      },
    ]);

    await expect(resolver.resolve("/B2B-signup", null)).resolves.toEqual({
      type: "found",
    });
  });

  it("does not render route names the storefront has no page for", async () => {
    const { resolver } = setup(() => [
      { routeName: "frontend.unknown.page", foreignKey: ID, seoPathInfo: "x" },
    ]);

    await expect(resolver.resolve("/x", null)).resolves.toEqual({
      type: "not-found",
    });
  });

  it("redirects a superseded path to the canonical one", async () => {
    const { resolver, lookups } = setup((criteria) => {
      if (hasFilter(criteria, "isCanonical")) return [category("Old-name/")];
      if (hasFilter(criteria, "pathInfo")) return [category("New-name/")];
      return [];
    });

    await expect(resolver.resolve("/Old-name/", null)).resolves.toEqual({
      type: "redirect",
      path: "/New-name/",
    });
    expect(lookups[1]?.criteria.filter).toEqual([
      { type: "equals", field: "isCanonical", value: null },
      {
        type: "equalsAny",
        field: "seoPathInfo",
        value: ["Old-name", "Old-name/"],
      },
    ]);
    expect(lookups[2]?.criteria.filter).toEqual([
      { type: "equals", field: "pathInfo", value: `/navigation/${ID}` },
    ]);
  });

  it("answers not-found for an unknown path and remembers it for a minute", async () => {
    const time = clock();
    const { resolver, lookups } = setup(() => [], time);

    await expect(resolver.resolve("/missing", null)).resolves.toEqual({
      type: "not-found",
    });
    await resolver.resolve("/missing", null);
    expect(lookups).toHaveLength(2);

    time.advance(NOT_FOUND_TTL_MS * 2);
    await resolver.resolve("/missing", null);
    expect(lookups).toHaveLength(4);
  });

  it.each([`/${"a".repeat(751)}`, "/a//b"])(
    "rejects %s without asking the API",
    async (path) => {
      const { resolver, lookups } = setup(() => []);

      await expect(resolver.resolve(path, null)).resolves.toEqual({
        type: "not-found",
      });
      expect(lookups).toEqual([]);
    },
  );
});

describe("createSeoResolver for technical paths", () => {
  it("redirects to the SEO URL and keeps its trailing slash", async () => {
    const { resolver, lookups } = setup(() => [category("Clothing/")]);

    await expect(resolver.resolve(`/navigation/${ID}/`, null)).resolves.toEqual(
      { type: "redirect", path: "/Clothing/" },
    );
    expect(lookups[0]?.criteria.filter).toEqual([
      { type: "equals", field: "pathInfo", value: `/navigation/${ID}` },
    ]);
  });

  it("redirects the root category to the home page", async () => {
    const { resolver } = setup(() => [category("")]);

    await expect(resolver.resolve(`/navigation/${ID}`, null)).resolves.toEqual({
      type: "redirect",
      path: "/",
    });
  });

  it.each([
    ["without an SEO URL", []],
    ["whose SEO URL is technical", [category(`detail/${ID}`)]],
  ])("renders a technical path %s", async (_, rows) => {
    const { resolver } = setup(() => rows);

    await expect(resolver.resolve(`/detail/${ID}`, null)).resolves.toEqual({
      type: "found",
    });
  });

  it.each(["/navigation/a/b", "/detail/not-an-id"])(
    "answers not-found for %s without asking the API",
    async (path) => {
      const { resolver, lookups } = setup(() => []);

      await expect(resolver.resolve(path, null)).resolves.toEqual({
        type: "not-found",
      });
      expect(lookups).toEqual([]);
    },
  );
});

describe("createSeoResolver failures and caching", () => {
  it("reports maintenance without caching it", async () => {
    let maintenance = true;
    const { resolver, lookups } = setup(() => {
      if (maintenance) {
        throw apiClientError(
          [
            {
              code: "FRAMEWORK__API_SALES_CHANNEL_MAINTENANCE_MODE",
              status: "503",
            },
          ],
          503,
        );
      }
      return [category("Clothing/")];
    });

    await expect(resolver.resolve("/Clothing/", null)).resolves.toEqual({
      type: "maintenance",
    });
    maintenance = false;
    await expect(resolver.resolve("/Clothing/", null)).resolves.toEqual({
      type: "found",
    });
    expect(lookups).toHaveLength(2);
  });

  it("answers unavailable when the API fails and nothing is cached", async () => {
    const failure = new Error("timeout");
    const { resolver, onFailure } = setup(() => {
      throw failure;
    });

    await expect(resolver.resolve("/Clothing/", null)).resolves.toEqual({
      type: "unavailable",
    });
    expect(onFailure).toHaveBeenCalledWith(failure);
  });

  it("serves a stale answer while it refreshes and keeps it when the refresh fails", async () => {
    const time = clock();
    let fail = false;
    const { resolver, lookups } = setup(() => {
      if (fail) throw new Error("timeout");
      return [category("Clothing/")];
    }, time);
    await resolver.resolve("/Clothing/", null);
    time.advance(FOUND_TTL_MS);
    fail = true;
    const waitUntil = vi.fn();

    await expect(
      resolver.resolve("/Clothing/", null, { waitUntil }),
    ).resolves.toEqual({ type: "found" });
    expect(waitUntil).toHaveBeenCalledTimes(1);
    await waitUntil.mock.calls[0]?.[0];
    expect(lookups).toHaveLength(2);
    await expect(resolver.resolve("/Clothing/", null)).resolves.toEqual({
      type: "found",
    });
  });

  it("shares one lookup between concurrent requests and keys the cache by language", async () => {
    const { resolver, lookups } = setup(() => [category("Clothing/")]);

    await Promise.all([
      resolver.resolve("/Clothing/", "language-en"),
      resolver.resolve("/Clothing/", "language-en"),
    ]);
    await resolver.resolve("/Clothing/", "language-pl");

    expect(lookups.map(({ languageId }) => languageId)).toEqual([
      "language-en",
      "language-pl",
    ]);
  });
});

describe("createSeoResolver safety and observation", () => {
  it("reports only live lookups to its observer", async () => {
    const { resolver, onLookup } = setup(() => [category("Clothing/")]);

    await resolver.resolve("/Clothing/", null);
    await resolver.resolve("/Clothing/", null);

    expect(onLookup.mock.calls).toEqual([[{ type: "found" }]]);
  });

  it("stops asking a failing API for uncached paths for a few seconds", async () => {
    const time = clock();
    let calls = 0;
    const { resolver } = setup(() => {
      calls += 1;
      throw new Error("timeout");
    }, time);

    await resolver.resolve("/a", null);
    await expect(resolver.resolve("/b", null)).resolves.toEqual({
      type: "unavailable",
    });
    expect(calls).toBe(1);

    time.advance(UNAVAILABLE_BACKOFF_MS);
    await resolver.resolve("/b", null);
    expect(calls).toBe(2);
  });

  it("does not cache paths it rejects", async () => {
    const { resolver, cache } = setup(() => []);

    await resolver.resolve(`/${"a".repeat(751)}`, null);

    expect(cache.size).toBe(0);
  });

  it.each(["\\evil.test/x", "bad\u0007path"])(
    "never redirects to the stored spelling %s",
    async (seoPathInfo) => {
      const { resolver } = setup(() => [category(seoPathInfo)]);

      await expect(resolver.resolve("/other", null)).resolves.toEqual({
        type: "found",
      });
    },
  );

  it("remembers a redirect only for a few minutes", async () => {
    const time = clock();
    const { resolver, lookups } = setup(() => [category("Clothing/")], time);

    await resolver.resolve("/clothing", null);
    time.advance(REDIRECT_TTL_MS * 2);
    await resolver.resolve("/clothing", null);

    expect(lookups).toHaveLength(2);
  });
});
