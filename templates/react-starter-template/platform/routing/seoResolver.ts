import { encodeForQuery } from "@shopware/api-client/helpers";
import {
  getRouteFromPathInfo,
  isTechnicalPath,
  normalizePath,
} from "@shopware/helpers";

import type { ApiClient, Schemas } from "#shopware";
import { isRenderedRouteName } from "@/platform/shopware/routeNames";

import type { LruCache } from "./lruCache";
import { isMaintenanceError } from "./maintenance";
import type { WaitUntil } from "./maintenance";
import {
  MAX_SEO_PATH_LENGTH,
  decodePathname,
  hasUnsafePathChar,
  sameSeoPath,
  seoPathCandidates,
  toSeoPath,
} from "./paths";

export type SeoResolution =
  | { type: "found" }
  | { type: "redirect"; path: string }
  | { type: "not-found" }
  | { type: "maintenance" }
  | { type: "unavailable" };

export type SeoClient = Pick<ApiClient, "invoke">;

export type SeoResolverDeps = {
  getClient(languageId: string | null): SeoClient;
  cache: LruCache<SeoResolution>;
  now?: () => number;
  onFailure?: (error: unknown) => void;
  onLookup?: (resolution: SeoResolution) => void;
};

export type SeoResolver = {
  resolve(
    pathname: string,
    languageId: string | null,
    options?: { waitUntil?: WaitUntil },
  ): Promise<SeoResolution>;
};

export const SEO_LOOKUP_TIMEOUT_MS = 2500;
export const FOUND_TTL_MS = 3_600_000;
export const REDIRECT_TTL_MS = 300_000;
export const NOT_FOUND_TTL_MS = 60_000;
export const STALE_MS = 86_400_000;
export const UNAVAILABLE_BACKOFF_MS = 5000;

const ENTITY_ID = /^[0-9a-f]{32}$/i;

const FOUND: SeoResolution = { type: "found" };
const NOT_FOUND: SeoResolution = { type: "not-found" };

type SeoUrlRow = Pick<
  Schemas["SeoUrl"],
  "routeName" | "foreignKey" | "seoPathInfo" | "pathInfo"
>;

type SeoUrlFilter =
  | { type: "equals"; field: string; value: string | null }
  | { type: "equalsAny"; field: string; value: string[] };

function isRendered(row: SeoUrlRow): boolean {
  return !!row.foreignKey && isRenderedRouteName(row.routeName);
}

function redirectTo(seoPathInfo: string): SeoResolution | null {
  if (hasUnsafePathChar(seoPathInfo)) return null;
  const path = toSeoPath(seoPathInfo);
  return path.startsWith("//") ? null : { type: "redirect", path };
}

function isInvalidPath(decoded: string): boolean {
  return decoded.length > MAX_SEO_PATH_LENGTH || decoded.includes("//");
}

function lifetimeOf(resolution: SeoResolution) {
  if (resolution.type === "not-found") {
    return { ttlMs: NOT_FOUND_TTL_MS, staleMs: NOT_FOUND_TTL_MS };
  }
  if (resolution.type === "redirect") {
    return { ttlMs: REDIRECT_TTL_MS, staleMs: REDIRECT_TTL_MS };
  }
  return { ttlMs: FOUND_TTL_MS, staleMs: STALE_MS };
}

function isCacheable(resolution: SeoResolution): boolean {
  return (
    resolution.type === "found" ||
    resolution.type === "redirect" ||
    resolution.type === "not-found"
  );
}

async function lookup(
  client: SeoClient,
  filter: SeoUrlFilter[],
  limit: number,
): Promise<SeoUrlRow[]> {
  const { data } = await client.invoke("readSeoUrlGet get /seo-url", {
    query: {
      _criteria: encodeForQuery({
        filter,
        limit,
        includes: {
          seo_url: ["routeName", "foreignKey", "seoPathInfo", "pathInfo"],
        },
      }),
    },
    fetchOptions: { timeout: SEO_LOOKUP_TIMEOUT_MS, retry: 0 },
  });
  return data.elements ?? [];
}

async function resolveTechnicalPath(
  client: SeoClient,
  decoded: string,
): Promise<SeoResolution> {
  const route = getRouteFromPathInfo(decoded);
  if (!route || !ENTITY_ID.test(route.foreignKey)) return NOT_FOUND;
  const [canonical] = await lookup(
    client,
    [{ type: "equals", field: "pathInfo", value: normalizePath(decoded) }],
    1,
  );
  if (typeof canonical?.seoPathInfo !== "string") return FOUND;
  const redirect = redirectTo(canonical.seoPathInfo);
  return redirect && !isTechnicalPath(toSeoPath(canonical.seoPathInfo))
    ? redirect
    : FOUND;
}

async function resolveSupersededPath(
  client: SeoClient,
  candidates: string[],
): Promise<SeoResolution> {
  const [superseded] = await lookup(
    client,
    [
      { type: "equals", field: "isCanonical", value: null },
      { type: "equalsAny", field: "seoPathInfo", value: candidates },
    ],
    1,
  );
  if (!superseded?.pathInfo) return NOT_FOUND;
  const [canonical] = await lookup(
    client,
    [{ type: "equals", field: "pathInfo", value: superseded.pathInfo }],
    1,
  );
  if (typeof canonical?.seoPathInfo !== "string" || !isRendered(canonical)) {
    return NOT_FOUND;
  }
  return redirectTo(canonical.seoPathInfo) ?? NOT_FOUND;
}

async function resolveSeoPath(
  client: SeoClient,
  pathname: string,
): Promise<SeoResolution> {
  const candidates = seoPathCandidates(pathname);
  if (candidates.length === 0) return NOT_FOUND;
  const rows = await lookup(
    client,
    [{ type: "equalsAny", field: "seoPathInfo", value: candidates }],
    2,
  );
  const hit =
    rows.find(
      (row) =>
        typeof row.seoPathInfo === "string" &&
        sameSeoPath(row.seoPathInfo, pathname),
    ) ?? rows[0];
  if (!hit) return resolveSupersededPath(client, candidates);
  if (!isRendered(hit)) return NOT_FOUND;
  if (
    typeof hit.seoPathInfo === "string" &&
    !sameSeoPath(hit.seoPathInfo, pathname)
  ) {
    return redirectTo(hit.seoPathInfo) ?? FOUND;
  }
  return FOUND;
}

export function createSeoResolver({
  getClient,
  cache,
  now = Date.now,
  onFailure,
  onLookup,
}: SeoResolverDeps): SeoResolver {
  const inFlight = new Map<string, Promise<SeoResolution>>();
  let unavailableUntil = Number.NEGATIVE_INFINITY;

  async function compute(
    pathname: string,
    decoded: string,
    languageId: string | null,
  ): Promise<SeoResolution> {
    const client = getClient(languageId);
    try {
      return isTechnicalPath(decoded)
        ? await resolveTechnicalPath(client, decoded)
        : await resolveSeoPath(client, pathname);
    } catch (error) {
      if (isMaintenanceError(error)) return { type: "maintenance" };
      onFailure?.(error);
      return { type: "unavailable" };
    }
  }

  function refresh(
    key: string,
    pathname: string,
    decoded: string,
    languageId: string | null,
  ): Promise<SeoResolution> {
    const running = inFlight.get(key);
    if (running) return running;
    const run = compute(pathname, decoded, languageId)
      .then((resolution) => {
        if (resolution.type === "unavailable") {
          unavailableUntil = now() + UNAVAILABLE_BACKOFF_MS;
        } else {
          onLookup?.(resolution);
        }
        if (isCacheable(resolution)) {
          cache.set(key, resolution, lifetimeOf(resolution));
        }
        return resolution;
      })
      .finally(() => {
        inFlight.delete(key);
      });
    inFlight.set(key, run);
    return run;
  }

  return {
    async resolve(pathname, languageId, { waitUntil } = {}) {
      const decoded = decodePathname(pathname);
      if (isInvalidPath(decoded)) return NOT_FOUND;
      const key = `${languageId ?? "-"}\u0000${decoded}`;
      const cached = cache.get(key);
      if (cached?.state === "fresh") return cached.value;
      if (!cached && now() < unavailableUntil) return { type: "unavailable" };
      const pending = refresh(key, pathname, decoded, languageId);
      if (!cached) return pending;
      waitUntil?.(pending);
      return cached.value;
    },
  };
}
