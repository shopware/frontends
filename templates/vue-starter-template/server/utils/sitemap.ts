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

/**
 * On the backend host the file can sit behind the Store API, which needs the
 * access key and the configured headers. Those never go to another host,
 * such as a CDN.
 */
export function fetchSitemapFile(file: SitemapFile) {
  const { headers, timeout } = getServerApiClientOptions();
  const backendOrigin = new URL(getShopwareServerEndpoint()).origin;
  const isBackend = new URL(file.url).origin === backendOrigin;

  return fetch(file.url, {
    headers: isBackend
      ? {
          "sw-access-key": useRuntimeConfig().public.shopware.accessToken,
          ...headers,
        }
      : undefined,
    signal: timeout === undefined ? undefined : AbortSignal.timeout(timeout),
  });
}
