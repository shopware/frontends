<script setup lang="ts">
import { getProductName } from "@shopware/helpers";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useProductSearch();
const { buildDynamicBreadcrumbs, pushBreadcrumb } = useBreadcrumbs();
const { apiClient } = useShopwareContext();
const errorDetails = ref();

const { data, error } = await useAsyncData(
  `cmsProduct${props.navigationId}`,
  async () => {
    const responses = await Promise.allSettled([
      search(props.navigationId, {
        withCmsAssociations: true,
        associations: {
          seoUrls: {},
        },
      }),
      apiClient.invoke("readBreadcrumb get /breadcrumb/{id}", {
        pathParams: {
          id: props.navigationId,
        },
      }),
    ]);

    for (const response of responses) {
      if (response.status === "rejected") {
        console.error("[FrontendDetailPage.vue]", response.reason.message);
        errorDetails.value = response.reason.message;
      }
    }

    return {
      productResponse:
        responses[0].status === "fulfilled" ? responses[0].value : null,
      breadcrumbs:
        responses[1].status === "fulfilled" ? responses[1].value : null,
    };
  },
);
const productResponse = ref(data.value?.productResponse);

if (data.value?.breadcrumbs) {
  buildDynamicBreadcrumbs(data.value.breadcrumbs.data);
}

if (!productResponse.value) {
  const statusMessage = error.value || errorDetails.value;
  console.error("[FrontendDetailPage.vue]", statusMessage);
  throw createError({
    statusCode: 500,
    message: statusMessage,
  });
}

useProductJsonLD(productResponse.value.product);

pushBreadcrumb({
  name: getProductName({ product: productResponse.value.product }) ?? "",
  path: `/${productResponse.value.product.seoUrls?.[0]?.seoPathInfo}`,
});

const { product } = useProduct(
  productResponse.value.product,
  productResponse.value.configurator,
);

useCmsHead(product, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <LayoutBreadcrumbs />
  <div v-if="product?.cmsPage" class="container mx-auto bg-white flex flex-col">
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
