export type SitemapFile = {
  /** Path below `/sitemap/`, shared by the backend file and the proxied one. */
  path: string;
  /** Where the backend serves the file. */
  url: string;
};

/**
 * Shopware links sitemap files on the host they live on, which is never the
 * headless storefront. Each file is proxied under `/sitemap/<path>` so the
 * index only references this storefront.
 */
export async function listSitemapFiles(): Promise<SitemapFile[]> {
  const { data } = await createServerApiClient().invoke(
    "readSitemap get /sitemap",
  );
  const base = getShopwareServerEndpoint();

  return data.flatMap(({ filename }) => {
    const url = new URL(filename, base).href;
    const path = url.match(/\/sitemap\/(.+\.xml(?:\.gz)?)$/)?.[1];
    return path ? [{ path, url }] : [];
  });
}
