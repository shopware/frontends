<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { getProductName } from "@shopware/helpers";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useProductSearch();
const { buildDynamicBreadcrumbs, pushBreadcrumb } = useBreadcrumbs();
const { apiClient } = useShopwareContext();

const { data, error } = await useAsyncData(
  `cmsProduct${props.navigationId}`,
  async () => {
    const responses = await Promise.allSettled([
      search(props.navigationId, {
        withCmsAssociations: true,
        associations: {
          openGraphMedia: {
            associations: {
              thumbnails: {},
            },
          },
          seoUrls: {},
        },
      }),
      apiClient.invoke("readBreadcrumb get /breadcrumb/{id}", {
        pathParams: {
          id: props.navigationId,
        },
      }),
    ]);

    const [productResult, breadcrumbsResult] = responses;
    if (productResult.status === "rejected") {
      console.error("[FrontendDetailPage.vue]", productResult.reason.message);
      if (
        productResult.reason instanceof ApiClientError &&
        productResult.reason.status === 404
      ) {
        throw createError({
          statusCode: 404,
          statusMessage: "Product not found",
        });
      }
      throw productResult.reason;
    }

    if (breadcrumbsResult.status === "rejected") {
      console.error(
        "[FrontendDetailPage.vue]",
        breadcrumbsResult.reason.message,
      );
    }

    return {
      productResponse: productResult.value,
      breadcrumbs:
        breadcrumbsResult.status === "fulfilled"
          ? breadcrumbsResult.value
          : null,
    };
  },
);
const productResponse = data.value?.productResponse;

if (error.value) {
  throw error.value;
}

if (data.value?.breadcrumbs) {
  buildDynamicBreadcrumbs(data.value.breadcrumbs.data);
}

if (!productResponse) {
  console.error("[FrontendDetailPage.vue]", "Product not found");
  throw createError({
    statusCode: 404,
    statusMessage: "Product not found",
  });
}

useProductJsonLD(productResponse.product);

pushBreadcrumb({
  name: getProductName({ product: productResponse.product }) ?? "",
  path: `/${productResponse.product.seoUrls?.[0]?.seoPathInfo}`,
});

const { product } = useProduct(
  productResponse.product,
  productResponse.configurator,
);

useCmsHead(product, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <LayoutBreadcrumbs />
  <div
    v-if="product?.cmsPage"
    class="container mx-auto bg-white flex flex-col p-6 md:p-0"
  >
    <CmsPage :content="product.cmsPage" />
  </div>
  <div
    v-if="!product?.cmsPage"
    class="container mx-auto bg-white flex flex-col"
  >
    <!-- Since Shopware Version 6.6.0.0 there should be always a cmsPage for products -->
    <span>😱 cmsPage is missing.</span>
  </div>
</template>
