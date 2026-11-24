import "server-only";
import { createShopwareClient } from "@/platform/shopware/client";
import { toLanguageOptions } from "@/platform/shopware/reads/languageOptions";

import { createLanguageResolver } from "./languageResolver";
import { createLruCache } from "./lruCache";
import { createMaintenanceMonitor, isMaintenanceError } from "./maintenance";
import { SEO_LOOKUP_TIMEOUT_MS, createSeoResolver } from "./seoResolver";
import type { SeoResolution } from "./seoResolver";

const SEO_CACHE_SIZE = 5000;
const FAILURE_LOG_INTERVAL_MS = 60_000;
const LOOKUP_FETCH_OPTIONS = { timeout: SEO_LOOKUP_TIMEOUT_MS, retry: 0 };

let lastFailureLog = Number.NEGATIVE_INFINITY;

function logFailure(scope: string, error: unknown): void {
  const now = Date.now();
  if (now - lastFailureLog < FAILURE_LOG_INTERVAL_MS) return;
  lastFailureLog = now;
  console.error(`[Routing] ${scope} failed`, error);
}

export const resolveProxyLanguageId = createLanguageResolver({
  read: async () => {
    const { data } = await createShopwareClient().invoke(
      "readLanguagesGet get /language",
      { fetchOptions: LOOKUP_FETCH_OPTIONS },
    );
    return toLanguageOptions(data.elements ?? []);
  },
  onFailure: (error) => logFailure("reading the languages", error),
});

export const maintenanceMonitor = createMaintenanceMonitor({
  probe: async () => {
    try {
      await createShopwareClient().invoke("readContext get /context", {
        fetchOptions: LOOKUP_FETCH_OPTIONS,
      });
      return false;
    } catch (error) {
      return isMaintenanceError(error);
    }
  },
});

export const seoResolver = createSeoResolver({
  getClient: (languageId) => createShopwareClient({ languageId }),
  cache: createLruCache<SeoResolution>({ max: SEO_CACHE_SIZE }),
  onFailure: (error) => logFailure("resolving an SEO path", error),
  onLookup: (resolution) =>
    maintenanceMonitor.report(resolution.type === "maintenance"),
});
