<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
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
  async () => {
    try {
      return await search(props.navigationId, {
        withCmsAssociations: true,
        query: {
          ...route.query,
        },
      });
    } catch (searchError) {
      if (searchError instanceof ApiClientError && searchError.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: "Category not found",
        });
      }
      throw searchError;
    }
  },
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

if (error.value) {
  throw error.value;
}

if (!categoryResponse.value) {
  console.error("[FrontendNavigationPage.vue]", "Category not found");
  throw createError({
    statusCode: 404,
    statusMessage: "Category not found",
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
