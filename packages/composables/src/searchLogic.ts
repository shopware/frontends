import {
  getCategory,
  getProduct,
  invokePost,
} from "@shopware-pwa/shopware-6-client";

export async function searchCms(path: string, query?: any, apiInstance?: any) {
  console.log("searching for:", path, "second:", path.substring(1));
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
    const product = await getProduct(entityFound.foreignKey, null, apiInstance);
    console.error("product", product);
    return {
      product: product,
      cmsPage: (product as any).cmsPage,
      resourceType: entityFound?.routeName,
    };
  }

  console.error("PROBLEM UNRECOGNIZED ENTITY");
}
