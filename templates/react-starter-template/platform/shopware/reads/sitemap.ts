import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";

export async function readSitemapFiles(
  languageId: string,
): Promise<Schemas["Sitemap"][]> {
  "use cache";
  cacheLife("seo");
  cacheTag(...languageCacheTags("sw:sitemap", languageId));

  const { data } = await createShopwareClient({ languageId }).invoke(
    "readSitemap get /sitemap",
  );
  return Array.isArray(data) ? data : [];
}

export async function readSitemapFile(
  filePath: string,
  languageId: string,
): Promise<ArrayBuffer | null> {
  const { data, status } = await createShopwareClient({ languageId }).invoke(
    "getSitemapFile get /sitemap/{filePath}",
    { accept: "application/gzip", pathParams: { filePath } },
  );
  if (status !== 200 || !(data instanceof Blob)) return null;
  return data.arrayBuffer();
}
