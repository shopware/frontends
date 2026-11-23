import { connection } from "next/server";

import {
  sitemapIndexEntries,
  sitemapNotFound,
  sitemapUnavailable,
} from "@/platform/seo/sitemap";
import {
  SITEMAP_CACHE_CONTROL,
  sitemapIndexXml,
} from "@/platform/seo/sitemapIndex";
import type { SitemapIndexEntry } from "@/platform/seo/sitemapIndex";
import { getSiteUrl } from "@/platform/seo/siteUrl";

export async function GET(): Promise<Response> {
  await connection();
  const siteUrl = getSiteUrl();
  if (!siteUrl) return sitemapNotFound();

  let entries: SitemapIndexEntry[];
  try {
    entries = await sitemapIndexEntries(siteUrl);
  } catch (error) {
    return sitemapUnavailable(error);
  }
  if (entries.length === 0) return sitemapNotFound();

  return new Response(sitemapIndexXml(entries, siteUrl), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": SITEMAP_CACHE_CONTROL,
    },
  });
}
