import {
  ShopwareApiInstance,
  getCategories,
  getCategory,
  invokePost,
  getProduct,
  getSeoUrl,
  getLandingPage,
  getCategoryDetailsEndpoint,
} from "@shopware-pwa/api-client";

import {
  SearchCmsResult,
  CATEGORY_ROUTE_NAME,
  PRODUCT_ROUTE_NAME,
  LANDING_PAGE_ROUTE_NAME,
} from "./types";

const cmsAssociations = {
  associations: {
    media: {},
    cmsPage: {
      associations: {
        sections: {
          associations: {
            blocks: {
              associations: {
                slots: {
                  associations: {
                    block: {
                      associations: {
                        slots: {
                          associations: {},
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

async function getSeoUrlEntityByPath(
  path: string,
  apiInstance?: ShopwareApiInstance
) {
  const isTechnicalUrl =
    path.startsWith("/navigation/") ||
    path.startsWith("/detail/") ||
    path.startsWith("/landingPage/");

  // remove leading slash in case of seo url
  const normalizedPath = isTechnicalUrl ? path : path.substring(1);
  console.error("looking for path", normalizedPath);

  // consider not calling seo-url endpoint in case of technical url as the ID of the entity is known from URL.
  const seoResult = await getSeoUrl(
    {
      filter: [
        {
          type: "equals",
          field: isTechnicalUrl ? "pathInfo" : "seoPathInfo",
          value: normalizedPath,
        },
      ] as any, // TODO fix types in shopware-6-client
    },
    apiInstance
  );

  return seoResult?.elements?.[0];
}

export async function searchCms(
  path: string,
  query?: any,
  apiInstance?: ShopwareApiInstance
): Promise<SearchCmsResult | undefined> {
  // fallback for homepage
  // @TODO: create an issue in the API core to expose information of main entrypoint for specific sales channel in category entity
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
        ] as any, // TODO fix types in shopware-6-client
      },
      apiInstance
    );

    const category = await getCategory(
      categoryResponse?.elements?.[0].id,
      apiInstance
    );

    return {
      category: category,
      cmsPage: category.cmsPage,
      resourceType: CATEGORY_ROUTE_NAME,
    };
  }

  const seoUrlEntity = await getSeoUrlEntityByPath(path, apiInstance);

  if (seoUrlEntity?.routeName === CATEGORY_ROUTE_NAME) {
    const { data: category } = await invokePost(
      {
        address: getCategoryDetailsEndpoint(seoUrlEntity.foreignKey),
        payload: cmsAssociations,
      },
      apiInstance
    );

    return {
      category: category,
      cmsPage: category.cmsPage,
      resourceType: seoUrlEntity?.routeName,
    };
  }
  if (seoUrlEntity?.routeName === PRODUCT_ROUTE_NAME) {
    const productResponse = await getProduct(
      seoUrlEntity.foreignKey,
      cmsAssociations,
      apiInstance
    );

    return {
      product: productResponse.product,
      cmsPage: productResponse.product.cmsPage,
      configurator: productResponse.configurator,
      resourceType: seoUrlEntity?.routeName,
    };
  }

  if (seoUrlEntity?.routeName === LANDING_PAGE_ROUTE_NAME) {
    const LandingPageResponse = await getLandingPage(
      seoUrlEntity.foreignKey,
      cmsAssociations,
      apiInstance
    );

    return {
      landingPage: LandingPageResponse,
      cmsPage: LandingPageResponse.cmsPage,
      resourceType: seoUrlEntity?.routeName,
    };
  }

  console.error("PROBLEM UNRECOGNIZED ENTITY");
}
