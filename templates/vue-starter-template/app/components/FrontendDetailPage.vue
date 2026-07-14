<script setup lang="ts">
import { getProductName } from "@shopware/helpers";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useProductSearch();
const { buildDynamicBreadcrumbs, clearBreadcrumbs, pushBreadcrumb } =
  useBreadcrumbs();
const { apiClient } = useShopwareContext();
const router = useRouter();
const breadcrumbRequestController = import.meta.client
  ? new AbortController()
  : undefined;

if (import.meta.client) {
  const removeBreadcrumbRequestGuard = router.beforeEach((to, from) => {
    if (to.fullPath === from.fullPath) return;
    breadcrumbRequestController?.abort();
  });

  onBeforeUnmount(() => {
    breadcrumbRequestController?.abort();
    removeBreadcrumbRequestGuard();
  });
}

const { data, error } = await useAsyncData(
  `cmsProduct${props.navigationId}`,
  async () =>
    await search(props.navigationId, {
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
);
const productResponse = data.value;

if (!productResponse) {
  const statusMessage = error.value?.message || "Failed to load product";
  console.error("[FrontendDetailPage.vue]", statusMessage);
  throw createError({
    statusCode: 500,
    message: statusMessage,
  });
}

useProductJsonLD(productResponse.product);

const productBreadcrumb = {
  name: getProductName({ product: productResponse.product }) ?? "",
  path: `/${productResponse.product.seoUrls?.[0]?.seoPathInfo}`,
};

clearBreadcrumbs();

onMounted(async () => {
  try {
    const breadcrumbsResponse = await apiClient.invoke(
      "readBreadcrumb get /breadcrumb/{id}",
      {
        pathParams: {
          id: props.navigationId,
        },
        fetchOptions: {
          signal: breadcrumbRequestController?.signal,
        },
      },
    );
    await buildDynamicBreadcrumbs(breadcrumbsResponse.data);
    pushBreadcrumb(productBreadcrumb);
  } catch (error) {
    if (breadcrumbRequestController?.signal.aborted) return;
    console.error("[FrontendDetailPage.vue]", error);
  }
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
