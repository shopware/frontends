import { getSitemapEndpoint } from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import type { SitemapResult } from "@shopware-pwa/types";

/**
 * Get sitemap
 *
 * @throws ClientApiError
 * @public
 */
export async function getSitemap(
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<SitemapResult[]> {
  const resp = await contextInstance.invoke.get(`${getSitemapEndpoint()}`);
  return resp.data;
}
