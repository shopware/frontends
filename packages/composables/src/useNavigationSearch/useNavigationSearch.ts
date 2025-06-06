import { useSessionContext, useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

export type UseNavigationSearchReturn = {
  /**
   * Get {@link SeoUrl} entity for given path
   * @example resolvePath("/my-category/my-product") or resolvePath("/") for home page
   */
  resolvePath(path: string): Promise<Schemas["SeoUrl"] | null>;
};

/**
 * Composable to get search for SeoUrl entity for given path.
 * @public
 * @category Navigation & Routing
 */
export function useNavigationSearch(): UseNavigationSearchReturn {
  const { apiClient } = useShopwareContext();
  const { sessionContext } = useSessionContext();

  async function resolvePath(path: string): Promise<Schemas["SeoUrl"] | null> {
    if (path === "/") {
      // please ignore optional chaining for salesChannel object as it's always present (type definition issue)
      const categoryId =
        sessionContext.value?.salesChannel?.navigationCategoryId;

      return {
        routeName: "frontend.navigation.page",
        foreignKey: categoryId,
      } as Schemas["SeoUrl"];
    }

    const isTechnicalUrl =
      path.startsWith("/navigation/") ||
      path.startsWith("/detail/") ||
      path.startsWith("/landingPage/");

    // remove leading slash in case of seo url or remove trailing slash in case of technical url
    const normalizedPath = isTechnicalUrl
      ? path.endsWith("/")
        ? path.slice(0, -1)
        : path
      : path.substring(1);

    const seoResult = await apiClient.invoke("readSeoUrl post /seo-url", {
      body: {
        filter: [
          {
            type: "equals",
            field: isTechnicalUrl ? "pathInfo" : "seoPathInfo",
            value: normalizedPath,
          },
        ],
      },
    });

    return seoResult.data.elements?.[0] ?? null;
  }

  return {
    resolvePath,
  };
}
