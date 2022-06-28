import {
  ShopwareApiInstance,
  getCategories,
  getCategory,
  getProduct,
  invokePost,
} from "@shopware-pwa/shopware-6-client";

import {
  CategoryResponse,
  LandingPageResponse,
  ProductResponse,
  ResourceType,
  SearchCmsResult,
  SeoResult,
  SeoUrl,
  SearchFilterType,
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

// TODO: replace with the method from the shopware-6-client
async function getSeoUrlEntityByPath(
  path: string,
  apiInstance?: ShopwareApiInstance
): Promise<SeoUrl> {
  // const getClientMethodForRoute = (route: ResourceType) => {
  //   switch (route) {
  //     case "frontend.detail.page":
  //       return (id: string, params: ShopwareSearchParams) => getProduct(id, apiInstance);
  //       break;
  //     case "frontend.navigation.page":
  //       return (id: string) => getCategory(id, apiInstance);
  //       break;
  //     case "frontend.landing.page":
  //       return (id: string) => getCategory(id, apiInstance);
  //       break;
  //     default:
  //       throw new Error(
  //         `Unknown entity found for path ${path} for ${entityFound.routeName}`
  //       );
  //   }
  // };

  const seoResult: SeoResult = await invokePost(
    {
      address: "/store-api/seo-url",
      payload: {
        filter: [
          {
            type: SearchFilterType.EQUALS,
            field: "seoPathInfo",
            value: path.substring(1),
          },
        ],
      },
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
      Object.assign({}, cmsAssociations, {
        filter: [
          {
            type: SearchFilterType.EQUALS,
            field: "level",
            value: "1",
          },
          {
            type: SearchFilterType.EQUALS,
            field: "path",
            value: null,
          },
          {
            type: SearchFilterType.EQUALS,
            field: "parentId",
            value: null,
          },
        ],
      }),
      apiInstance
    );

    const category = categoryResponse?.elements?.[0] as CategoryResponse;

    return {
      category: category,
      cmsPage: category.cmsPage,
      resourceType: "frontend.navigation.page",
    };
  }

  // TODO: replace with getSeoUrl method from api client once it's merged
  const seoResult = await invokePost(
    {
      address: "/store-api/seo-url",
      payload: {
        filter: [
          {
            type: SearchFilterType.EQUALS,
            field: "seoPathInfo",
            value: path.substring(1),
          },
        ],
      },
    },
    apiInstance
  );

  const seoUrlEntity = await getSeoUrlEntityByPath(
    path.substring(1),
    apiInstance
  );

  if (seoUrlEntity?.routeName == "frontend.navigation.page") {
    const category: CategoryResponse = (await getCategory(
      seoUrlEntity.foreignKey,
      apiInstance
    )) as CategoryResponse;

    return {
      category: category,
      cmsPage: category.cmsPage,
      resourceType: seoUrlEntity?.routeName,
    };
  }
  if (seoUrlEntity?.routeName == "frontend.detail.page") {
    const productResponse: ProductResponse = (await getProduct(
      seoUrlEntity.foreignKey,
      cmsAssociations,
      apiInstance
    )) as ProductResponse;

    return {
      product: productResponse.product,
      cmsPage: productResponse.product.cmsPage,
      configurator: productResponse.configurator,
      resourceType: seoUrlEntity?.routeName,
    };
  }

  if (seoUrlEntity?.routeName == "frontend.landing.page") {
    // TODO: replace with getLandingPage method from shopware-6-client package once it's merged
    const LandingPageResponse: LandingPageResponse = (await invokePost({
      address: `/store-api/landing-page/${seoUrlEntity.foreignKey}`,
      payload: cmsAssociations,
    })) as LandingPageResponse;

    return {
      landingPage: LandingPageResponse,
      cmsPage: LandingPageResponse.cmsPage,
      resourceType: seoUrlEntity?.routeName,
    };
  }

  console.error("PROBLEM UNRECOGNIZED ENTITY");
}
