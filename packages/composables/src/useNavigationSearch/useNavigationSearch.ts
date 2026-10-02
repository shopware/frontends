import {
  getRouteFromPathInfo,
  isTechnicalPath,
  normalizePath,
} from "@shopware/helpers";

import { useCacheableRead, useSessionContext } from "#imports";
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
  const { invokeRead } = useCacheableRead();
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

    const isTechnicalUrl = isTechnicalPath(path);

    // remove leading slash in case of seo url or remove trailing slash in case of technical url
    const normalizedPath = isTechnicalUrl
      ? normalizePath(path)
      : path.substring(1);

    const criteria = {
      filter: [
        {
          type: "equals" as const,
          field: isTechnicalUrl ? "pathInfo" : "seoPathInfo",
          value: normalizedPath,
        },
      ],
    };
    const seoResult = await invokeRead("readSeoUrl post /seo-url", {
      body: criteria,
    });

    const element = seoResult.data.elements?.[0];
    if (element) {
      return element;
    }

    const fallback = getRouteFromPathInfo(path);
    if (fallback) {
      return fallback as Schemas["SeoUrl"];
    }

    return null;
  }

  return {
    resolvePath,
  };
}
