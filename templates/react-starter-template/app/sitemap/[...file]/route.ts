import { connection } from "next/server";

import {
  sitemapIndexEntries,
  sitemapNotFound,
  sitemapUnavailable,
} from "@/platform/seo/sitemap";
import {
  isSitemapFilePath,
  SITEMAP_CACHE_CONTROL,
  SITEMAP_PATH_PREFIX,
} from "@/platform/seo/sitemapIndex";
import { getSiteUrl } from "@/platform/seo/siteUrl";
import { readSitemapFile } from "@/platform/shopware/reads/sitemap";

type SitemapFileContext = { params: Promise<{ file: string[] }> };

export async function GET(
  _request: Request,
  { params }: SitemapFileContext,
): Promise<Response> {
  await connection();
  const { file } = await params;
  const filePath = file.join("/");
  const siteUrl = getSiteUrl();
  if (!siteUrl || !isSitemapFilePath(filePath)) return sitemapNotFound();

  let body: ArrayBuffer | null;
  try {
    const entry = (await sitemapIndexEntries(siteUrl)).find(
      ({ path }) => path === `${SITEMAP_PATH_PREFIX}${filePath}`,
    );
    if (!entry) return sitemapNotFound();
    body = await readSitemapFile(filePath, entry.languageId);
  } catch (error) {
    return sitemapUnavailable(error);
  }
  if (!body) return sitemapNotFound();

  return new Response(body, {
    headers: {
      "Content-Type": "application/gzip",
      "Cache-Control": SITEMAP_CACHE_CONTROL,
    },
  });
}
