<script setup lang="ts">
import { useCmsHead } from "@/composables/useCmsHead";
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
      apiClient
        .invoke("readBreadcrumb get /breadcrumb/{id}", {
          pathParams: {
            id: props.navigationId,
          },
        })
        .catch(() => {
          console.error("Error while fetching breadcrumbs");
        }),
    ]);

    for (const response of responses) {
      if (response.status === "rejected") {
        console.error("[FrontendNavigationPage.vue]", response.reason.message);
      }
    }

    return {
      category: responses[0].status === "fulfilled" ? responses[0].value : null,
      breadcrumbs:
        responses[1].status === "fulfilled" ? responses[1].value : null,
    };
  },
);
const categoryResponse = ref(data.value?.category);

if (data.value?.breadcrumbs) {
  buildDynamicBreadcrumbs(data.value.breadcrumbs.data);
}

if (!categoryResponse.value) {
  console.error("[FrontendNavigationPage.vue]", error.value?.message);
  throw error.value;
}

const { category } = useCategory(categoryResponse as Ref<Schemas["Category"]>);
useCmsHead(category, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <LayoutBreadcrumbs v-if="route.path != '/'" />
  <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
</template>
