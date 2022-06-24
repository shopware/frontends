import {
  getCategories,
  getCategory,
  getProduct,
  invokePost,
} from "@shopware-pwa/shopware-6-client";

export async function searchCms(path: string, query?: any, apiInstance?: any) {
  console.log("searching for:", path, "second:", path.substring(1));

  if (path === "/") {
    console.warn("looking for home category");
    const categoryResponse = await getCategories(
      {
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
        filter: [
          {
            type: "equals",
            field: "level",
            value: 1,
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
    const category = categoryResponse?.elements?.[0];
    console.warn("home category found:", category);
    return {
      category: category,
      cmsPage: category.cmsPage,
      resourceType: "frontend.navigation.page",
    };
  }

  const seoResult = await invokePost(
    {
      address: "/store-api/seo-url",
      payload: {
        filter: [
          {
            type: "equals",
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
    const category = await getCategory(entityFound.foreignKey, apiInstance);
    console.error("category", category);
    return {
      category: category,
      cmsPage: category.cmsPage,
      resourceType: entityFound?.routeName,
    };
  }
  if (entityFound?.routeName == "frontend.detail.page") {
    const productResponse = await getProduct(
      entityFound.foreignKey,
      {
        associations: {
          media: {},
          options: {},
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
      },
      apiInstance
    );
    console.error("product", productResponse.product);
    return {
      product: productResponse.product,
      cmsPage: (productResponse.product as any).cmsPage,
      configurator: productResponse.configurator,
      resourceType: entityFound?.routeName,
    };
  }

  console.error("PROBLEM UNRECOGNIZED ENTITY");
}
