import "server-only";
import { apiFailureSummary } from "@/features/session/apiErrors";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";
import { readSitemapFiles } from "@/platform/shopware/reads/sitemap";

import {
  isServedDomain,
  selectSitemapFiles,
  SITEMAP_MISS_CACHE_CONTROL,
} from "./sitemapIndex";
import type { SitemapIndexEntry } from "./sitemapIndex";

export const SITEMAP_RETRY_AFTER_SECONDS = 300;

let warnedAboutNoSitemap = false;

export async function sitemapIndexEntries(
  siteUrl: URL,
): Promise<SitemapIndexEntry[]> {
  const context = await readSalesChannelContext(null);
  const domains = (context.salesChannel.domains ?? []).filter((domain) =>
    isServedDomain(domain.url, siteUrl),
  );
  const languageIds = [...new Set(domains.map((domain) => domain.languageId))];
  const entries = (
    await Promise.all(
      languageIds.map(async (languageId) =>
        selectSitemapFiles(
          await readSitemapFiles(languageId),
          new Set(
            domains
              .filter((domain) => domain.languageId === languageId)
              .map((domain) => domain.id),
          ),
          languageId,
        ),
      ),
    )
  ).flat();
  if (entries.length === 0 && !warnedAboutNoSitemap) {
    warnedAboutNoSitemap = true;
    console.warn(
      "[SEO] no Shopware sitemap file belongs to a sales channel domain of STOREFRONT_URL, so /sitemap.xml answers 404",
    );
  }
  return entries;
}

export function sitemapNotFound(): Response {
  return new Response("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": SITEMAP_MISS_CACHE_CONTROL,
    },
  });
}

export function sitemapUnavailable(error: unknown): Response {
  console.error(
    "[SEO] reading the Shopware sitemap failed",
    apiFailureSummary(error),
  );
  return new Response("Service Unavailable", {
    status: 503,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": String(SITEMAP_RETRY_AFTER_SECONDS),
    },
  });
}
