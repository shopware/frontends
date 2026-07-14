<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers";
import type { Ref } from "vue";

import { useCmsHead } from "#imports";
import { useCategorySearch } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useCategorySearch();
const route = useRoute();
const { buildDynamicBreadcrumbs, clearBreadcrumbs } = useBreadcrumbs();
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
  `cmsNavigation${props.navigationId}`,
  async () =>
    await search(props.navigationId, {
      withCmsAssociations: true,
      query: {
        ...route.query,
      },
    }),
);
const categoryResponse = ref(data.value);

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
  } catch (error) {
    if (breadcrumbRequestController?.signal.aborted) return;
    console.error("[FrontendNavigationPage.vue]", error);
  }
});

if (!categoryResponse.value) {
  const statusMessage = error.value?.message || "Failed to load category";
  console.error("[FrontendNavigationPage.vue]", statusMessage);
  throw createError({
    statusCode: 500,
    message: statusMessage,
  });
}

const { category } = useCategory(categoryResponse as Ref<Schemas["Category"]>);
useCmsHead(category, { mainShopTitle: "Shopware Frontends Demo Store" });

const categoryName = computed(() =>
  getTranslatedProperty(category.value, "name"),
);
</script>

<template>
  <LayoutBreadcrumbs v-if="route.path != '/'" />
  <div class="text-lg">
    <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
  </div>
</template>
