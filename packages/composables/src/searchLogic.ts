import {
  getCategories,
  getCategory,
  getProduct,
  // getLandingPage,
  invokePost,
} from "@shopware-pwa/shopware-6-client";
import { SearchFilterType } from "@shopware-pwa/commons";
import {
  CategoryResponse,
  LandingPageResponse,
  ProductResponse,
  SearchCmsResult,
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

export async function searchCms(
  path: string,
  query?: any,
  apiInstance?: any
): Promise<SearchCmsResult | undefined> {
  console.log("searching for:", path, "second:", path.substring(1));

  if (path === "/") {
    console.warn("looking for home category");
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

    const category = categoryResponse?.elements?.[0];
    console.warn("home category found:", category);
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
  console.log("seoresult", seoResult.data);

  const entityFound = seoResult?.data?.elements?.[0];
  if (entityFound?.routeName == "frontend.navigation.page") {
    const category: CategoryResponse = (await getCategory(
      entityFound.foreignKey,
      apiInstance
    )) as CategoryResponse;

    return {
      category: category,
      cmsPage: category.cmsPage,
      resourceType: entityFound?.routeName,
    };
  }
  if (entityFound?.routeName == "frontend.detail.page") {
    const productResponse: ProductResponse = (await getProduct(
      entityFound.foreignKey,
      cmsAssociations,
      apiInstance
    )) as ProductResponse;

    console.error("product", productResponse.product);
    return {
      product: productResponse.product,
      cmsPage: productResponse.product.cmsPage,
      configurator: productResponse.configurator,
      resourceType: entityFound?.routeName,
    };
  }

  if (entityFound?.routeName == "frontend.landing.page") {
    // TODO: replace with getLandingPage method from api client once it's merged
    const LandingPageResponse: LandingPageResponse = (await invokePost({
      address: `/store-api/landing-page/${entityFound.foreignKey}`,
      payload: cmsAssociations,
    })) as LandingPageResponse;

    console.error("landing-page", LandingPageResponse);
    return {
      landingPage: LandingPageResponse,
      cmsPage: LandingPageResponse.cmsPage,
      resourceType: entityFound?.routeName,
    };
  }

  console.error("PROBLEM UNRECOGNIZED ENTITY");
}
