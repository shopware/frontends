<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { Ref } from "vue";

import { useCategorySearch } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useCategorySearch();
const route = useRoute();
const { buildDynamicBreadcrumbs } = useBreadcrumbs();
const { apiClient } = useShopwareContext();

const { data, error } = await useAsyncData(
  `cmsNavigation${props.navigationId}`,
  async () => {
    const responses = await Promise.allSettled([
      search(props.navigationId, {
        withCmsAssociations: true,
        query: {
          ...route.query,
        },
      }),
      apiClient.invoke("readBreadcrumb get /breadcrumb/{id}", {
        pathParams: {
          id: props.navigationId,
        },
      }),
    ]);

    const [categoryResult, breadcrumbsResult] = responses;
    if (categoryResult.status === "rejected") {
      console.error(
        "[FrontendNavigationPage.vue]",
        categoryResult.reason.message,
      );
      if (
        categoryResult.reason instanceof ApiClientError &&
        categoryResult.reason.status === 404
      ) {
        throw createError({
          statusCode: 404,
          statusMessage: "Category not found",
        });
      }
      throw categoryResult.reason;
    }

    if (breadcrumbsResult.status === "rejected") {
      console.error(
        "[FrontendNavigationPage.vue]",
        breadcrumbsResult.reason.message,
      );
    }

    return {
      category: categoryResult.value,
      breadcrumbs:
        breadcrumbsResult.status === "fulfilled"
          ? breadcrumbsResult.value
          : null,
    };
  },
);
const categoryResponse = ref(data.value?.category);

if (error.value) {
  throw error.value;
}

if (data.value?.breadcrumbs) {
  buildDynamicBreadcrumbs(data.value.breadcrumbs.data);
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
</script>

<template>
  <LayoutBreadcrumbs v-if="route.path != '/'" />
  <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
</template>
