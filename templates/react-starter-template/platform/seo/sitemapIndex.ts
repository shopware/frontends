import { localePathPrefixes } from "@/platform/routing/cacheHeaders";

export type SitemapFile = { filename: string; created?: string | null };

export type SitemapIndexEntry = {
  path: string;
  languageId: string;
  lastmod: string | null;
};

export const SITEMAP_CACHE_CONTROL = "public, max-age=0, s-maxage=3600";
export const SITEMAP_MISS_CACHE_CONTROL = "public, max-age=0, s-maxage=60";
export const SITEMAP_PATH_PREFIX = "/sitemap/";

const SITEMAP_FILE_PATH =
  /^salesChannel-([0-9a-f]{32})-([0-9a-f]{32})\/\1-([0-9a-f]{32})-sitemap[\w.-]*\.xml\.gz$/;

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export function isServedDomain(domainUrl: string, siteUrl: URL): boolean {
  let url: URL;
  try {
    url = new URL(domainUrl);
  } catch {
    return false;
  }
  if (url.origin !== siteUrl.origin || url.search || url.hash) return false;
  return localePathPrefixes().includes(url.pathname.replace(/\/+$/, ""));
}

export function sitemapFilePath(filename: string): string | null {
  const path = filename.split(/[?#]/, 1)[0] ?? "";
  const start = path.lastIndexOf(SITEMAP_PATH_PREFIX);
  return start === -1 ? null : path.slice(start + SITEMAP_PATH_PREFIX.length);
}

export function isSitemapFilePath(path: string): boolean {
  return SITEMAP_FILE_PATH.test(path);
}

function lastmodOf(created: string | null | undefined): string | null {
  if (typeof created !== "string") return null;
  const date = new Date(created);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function selectSitemapFiles(
  files: SitemapFile[],
  servedDomainIds: ReadonlySet<string>,
  languageId: string,
): SitemapIndexEntry[] {
  return files.flatMap((file) => {
    const filePath = sitemapFilePath(file.filename);
    const match = filePath === null ? null : SITEMAP_FILE_PATH.exec(filePath);
    if (
      !match ||
      match[2] !== languageId ||
      !servedDomainIds.has(match[3] ?? "")
    ) {
      return [];
    }
    return [
      {
        path: `${SITEMAP_PATH_PREFIX}${filePath}`,
        languageId,
        lastmod: lastmodOf(file.created),
      },
    ];
  });
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char] ?? char);
}

export function sitemapIndexXml(
  entries: SitemapIndexEntry[],
  siteUrl: URL,
): string {
  const sitemaps = entries.map((entry) =>
    [
      "<sitemap>",
      `<loc>${escapeXml(new URL(entry.path, siteUrl).toString())}</loc>`,
      ...(entry.lastmod
        ? [`<lastmod>${escapeXml(entry.lastmod)}</lastmod>`]
        : []),
      "</sitemap>",
    ].join(""),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps,
    "</sitemapindex>",
    "",
  ].join("\n");
}
