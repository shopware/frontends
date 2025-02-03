<script setup lang="ts">
import { useCmsHead } from "@/composables/useCmsHead";
import type { Ref } from "vue";
import { useCategorySearch } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useCategorySearch();
const { buildDynamicBreadcrumbs } = useBreadcrumbs();
const { apiClient } = useShopwareContext();
const errorDetails = ref();

const { data, error } = await useAsyncData(
  `cmsNavigation${props.navigationId}`,
  async () => {
    const route = useRoute();

    const queryParams = route.query;

    const categoryResponse1 = await search(props.navigationId, {
      withCmsAssociations: true,
      query: {
        ...queryParams,
      },
    });

    return {
      category: categoryResponse1 ?? null,
    };
  },
);

const categoryResponse = ref(data.value?.category);

// if (data.value?.breadcrumbs) {
//   //buildDynamicBreadcrumbs(data.value.breadcrumbs.data);
// }

// const statusMessage = error.value || errorDetails.value;
// console.error("[FrontendNavigationPage.vue]", statusMessage);
// throw createError({
//   statusCode: 500,
//   message: statusMessage,
// });

const { category } = useCategory(
  categoryResponse as unknown as Ref<Schemas["Category"]>,
);
useCmsHead(category, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template :key="`${route.query.manufacturer}`">
  <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
</template>
