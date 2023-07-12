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
 * @category CMS
 * @public
 * @deprecated the method is becoming obsolete and will be removed in the future as the SwagShopwarePwa plugin won't be needed.
 */
export async function getCmsPage(
  path: string,
  criteria?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<CmsPageResponse> {
  const resp = await contextInstance.invoke.post(getPageResolverEndpoint(), {
    path: path,
    ...criteria,
  });

  return resp.data;
}

/**
 * Fetches a landing page entity
 *
 * @param {string} landingPageId id of the landing page
 * @param {ShopwareSearchParams} params search criteria for landing page
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category CMS
 * @public
 */
export async function getLandingPage(
  landingPageId: string,
  params?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<LandingPage> {
  const endpoint = getLandingPageDetailsEndpoint(landingPageId);
  const response = await contextInstance.invoke.post(endpoint, params);
  return response?.data;
}

/**
 * Returns an array of SEO URLs for given entity
 * Can be used for other languages as well by providing the languageId
 *
 * @param {string} entityId id of the entity
 * @param {string} languageId id of the language
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @category CMS
 * @public
 */
export async function getSeoUrls(
  entityId: string,
  languageId?: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
) {
  if (languageId) {
    contextInstance.defaults.headers.common["sw-language-id"] = languageId;
  }
  const resp = await contextInstance.invoke.post<
    EntityResult<"seo_url", SeoUrl>
  >(getSeoUrlEndpoint(), {
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
 * Returns an array of SEO URLs for given entity
 *
 * @param {ShopwareSearchParams} params search criteria for SEO URL
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @category CMS
 * @public
 * @throws ClientApiError
 */
export async function getSeoUrl(
  params: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
) {
  const seoUrlResponse = await invokePost<EntityResult<"seo_url", SeoUrl>>(
    {
      address: getSeoUrlEndpoint(),
      payload: params,
    },
    contextInstance,
  );

  return seoUrlResponse.data;
}
