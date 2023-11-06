import type { SeoUrl } from "@shopware-pwa/types";
import { _parseUrlQuery } from "@shopware-pwa/helpers-next";
import { useShopwareContext, useSessionContext } from "#imports";
import { getSeoUrl } from "@shopware-pwa/api-client";
import { _useContext } from "./internal/_useContext";

export type UseNavigationSearchReturn = {
  /**
   * Get {@link SeoUrl} entity for given path
   * @example resolvePath("/my-category/my-product") or resolvePath("/") for home page
   */
  resolvePath(path: string): Promise<SeoUrl | null>;
};

/**
 * Composable to get search for SeoUrl entity for given path.
 * @public
 * @category Navigation & Routing
 */
export function useNavigationSearch(): UseNavigationSearchReturn {
  const { apiInstance } = useShopwareContext();
  const { sessionContext } = useSessionContext();

  async function resolvePath(path: string) {
    if (path === "/") {
      // please ignore optional chaining for salesChannel object as it's always present (type definition issue)
      const categoryId =
        sessionContext.value?.salesChannel?.navigationCategoryId;

      return {
        routeName: "frontend.navigation.page",
        foreignKey: categoryId,
      } as SeoUrl;
    }

    const isTechnicalUrl =
      path.startsWith("/navigation/") ||
      path.startsWith("/detail/") ||
      path.startsWith("/landingPage/");

    // remove leading slash in case of seo url
    const normalizedPath = isTechnicalUrl ? path : path.substring(1);
    // console.error("looking for path", normalizedPath);

    const seoResult = await getSeoUrl(
      {
        filter: [
          {
            type: "equals",
            field: isTechnicalUrl ? "pathInfo" : "seoPathInfo",
            value: normalizedPath,
          },
        ],
      },
      apiInstance,
    );

    return seoResult.elements?.[0];
  }

  return {
    resolvePath,
  };
}
