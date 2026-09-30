import { gunzipSync } from "node:zlib";

import type { Page } from "@playwright/test";

export const LISTING_TIMEOUT = 30000;

/** POST body, or gzipped `_criteria` on GET. Both, so #2691 cannot break it. */
function listingCriteria(request: {
  method: () => string;
  url: () => string;
  postDataJSON: () => unknown;
}): Record<string, unknown> {
  if (request.method() === "POST") {
    try {
      return (request.postDataJSON() as Record<string, unknown>) ?? {};
    } catch {
      return {};
    }
  }

  const query = new URL(request.url()).searchParams;
  const encoded = query.get("_criteria");
  if (!encoded) return Object.fromEntries(query);
  try {
    return JSON.parse(
      gunzipSync(Buffer.from(encoded, "base64url")).toString(),
    ) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/**
 * Path-matched, since /search-suggest is not a listing. `carrying` requires the
 * filter to be in the request, so a changed query alone cannot pass.
 */
export function listingRequested(
  page: Page,
  carrying?: "manufacturer" | "properties",
) {
  return page.waitForResponse(
    (response) => {
      const path = new URL(response.url()).pathname;
      const isListing =
        path.endsWith("/store-api/search") ||
        path.includes("/store-api/product-listing/");
      const method = response.request().method();
      if (!isListing || (method !== "POST" && method !== "GET")) return false;
      if (!response.ok()) return false;
      if (!carrying) return true;

      const applied = listingCriteria(response.request())[carrying];
      return Array.isArray(applied) ? applied.length > 0 : !!applied;
    },
    { timeout: LISTING_TIMEOUT },
  );
}
