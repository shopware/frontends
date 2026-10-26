import { ApiClientError } from "@shopware/api-client";

export type SitemapFile = {
  /** Path below `/sitemap/`, the same on the backend and on this host. */
  path: string;
  /** The Store API serves a file only for the language it belongs to. */
  languageId: string;
};

const SITEMAP_PATH = /\/sitemap\/(salesChannel-[^/]+\/[^/]+\.xml\.gz)$/;

/** A 4xx, such as a language without a domain, fails the same way every time. */
function isPermanentFailure(error: unknown) {
  return (
    error instanceof ApiClientError &&
    error.status >= 400 &&
    error.status < 500 &&
    ![408, 429].includes(error.status)
  );
}

/**
 * Shopware links each file on the sales channel domain, or on the host the
 * files live on. That domain can be this storefront, so a listed URL may point
 * back here. The files are always read through the Store API instead, and
 * proxied under `/sitemap/<path>` so the index only references this host.
 *
 * Shopware lists the files of one language per request, so this asks once for
 * every language of the sales channel. The list is cached for a few minutes,
 * because a crawler fetches every file right after the index.
 */
export const listSitemapFiles = defineCachedFunction(
  async (): Promise<SitemapFile[]> => {
    const apiClient = createServerApiClient();
    const { endpoint } = getShopwareServerConfig();
    const { data: languages } = useRuntimeConfig().public.shopware
      .cacheableReads
      ? await apiClient.invoke("readLanguagesGet get /language")
      : await apiClient.invoke("readLanguages post /language");

    const results = await Promise.allSettled(
      languages.elements.map(async ({ id: languageId }) => {
        const { data } = await apiClient.invoke("readSitemap get /sitemap", {
          headers: { "sw-language-id": languageId },
        });
        return data.flatMap(({ filename }) => {
          const { pathname } = new URL(filename, endpoint);
          const path = pathname.match(SITEMAP_PATH)?.[1];
          return path ? [{ path, languageId }] : [];
        });
      }),
    );

    return results.flatMap((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      // Anything else must not end up in the cache as a partial list.
      if (!isPermanentFailure(result.reason)) {
        throw result.reason;
      }
      console.warn(
        `[sitemap] Skipped language ${languages.elements[index]?.id}:`,
        result.reason,
      );
      return [];
    });
  },
  { name: "sitemap-files", maxAge: 60 * 10 },
);

/**
 * Reads one listed file from the Store API with the access key and the
 * configured headers. Shopware answers 204 for a file it does not serve.
 */
export function fetchSitemapFile(file: SitemapFile) {
  const { endpoint, accessToken } = getShopwareServerConfig();
  const { headers, timeout } = getServerApiClientOptions();

  return fetch(`${endpoint.replace(/\/+$/, "")}/sitemap/${file.path}`, {
    headers: {
      "sw-access-key": accessToken,
      ...headers,
      "sw-language-id": file.languageId,
    },
    signal: timeout === undefined ? undefined : AbortSignal.timeout(timeout),
  });
}
