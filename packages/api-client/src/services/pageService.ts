import {
  getLandingPageDetailsEndpoint,
  getPageResolverEndpoint,
  getSeoUrlEndpoint,
} from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import {
  ShopwareSearchParams,
  CmsPageResponse,
  EntityResult,
  SeoUrl,
  LandingPage,
} from "@shopware-pwa/types";
import { invokePost } from "./pluginService";

/**
 * @throws ClientApiError
 * @public
 * @deprecated the method is becoming obsolete and will be removed in the future as the SwagShopwarePwa plugin won't be needed.
 */
export async function getCmsPage(
  path: string,
  criteria?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<CmsPageResponse> {
  const resp = await contextInstance.invoke.post(getPageResolverEndpoint(), {
    path: path,
    ...criteria,
  });

  return resp.data;
}

/**
 * Fetches a landing page entity
 * @throws ClientApiError
 * @public
 */
export async function getLandingPage(
  landingPageId: string,
  params?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<LandingPage> {
  const endpoint = getLandingPageDetailsEndpoint(landingPageId);
  const response = await contextInstance.invoke.post(endpoint, params);
  return response?.data;
}

/**
 * Returns an array of SEO URLs for given entity
 * Can be used for other languages as well by providing the languageId
 *
 * @public
 */
export async function getSeoUrls(
  entityId: string,
  languageId?: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<
  EntityResult<"seo_url", { apiAlias: string; seoPathInfo: string }[]>
> {
  if (languageId) {
    contextInstance.defaults.headers.common["sw-language-id"] = languageId;
  }
  const resp = await contextInstance.invoke.post(getSeoUrlEndpoint(), {
    filter: [
      {
        type: "equals",
        field: "foreignKey",
        value: entityId,
      },
    ],
    includes: {
      seo_url: ["seoPathInfo"],
    },
  });

  return resp.data;
}

/**
 *
 *
 * @public
 * @throws ClientApiError
 */
export async function getSeoUrl(
  params: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<EntityResult<"seo_url", SeoUrl[]>> {
  const seoUrlResponse = await invokePost(
    {
      address: getSeoUrlEndpoint(),
      payload: params,
    },
    contextInstance
  );

  return (seoUrlResponse as { data: EntityResult<"seo_url", SeoUrl[]> }).data;
}
