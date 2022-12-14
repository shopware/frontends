import { SeoUrl } from "@shopware-pwa/types";
import { _parseUrlQuery } from "@shopware-pwa/helpers-next";
import { useShopwareContext } from "./useShopwareContext";
import { getCategories, getSeoUrl } from "@shopware-pwa/api-client";
import { _useContext } from "./internal/_useContext";

export type UseNavigationSearchReturn = {
  resolvePath: (path: string) => Promise<SeoUrl | null>;
};

export function useNavigationSearch(): UseNavigationSearchReturn {
  const { apiInstance } = useShopwareContext();

  async function resolvePath(path: string) {
    // TODO: IMPORTANT - core issue to resolve home path
    if (path === "/") {
      const categoryResponse = await getCategories(
        {
          includes: {
            category: ["id"],
          },
          filter: [
            {
              type: "equals",
              field: "level",
              value: "1",
            },
            {
              type: "equals",
              field: "path",
              value: null,
            },
            {
              type: "equals",
              field: "parentId",
              value: null,
            },
          ],
        },
        apiInstance
      );

      return {
        routeName: "frontend.navigation.page",
        foreignKey: categoryResponse.elements[0].id,
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
      apiInstance
    );

    return seoResult.elements?.[0];
  }

  return {
    resolvePath,
  };
}
