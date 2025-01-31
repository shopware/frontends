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
const errorDetails = ref();

const { data, error } = await useAsyncData(
  `cmsNavigation${props.navigationId}-${route.query?.manufacturer || "empty"}`,
  async () => {
    console.warn(
      "useAsyncData",
      `cmsNavigation${props.navigationId}-${route.query?.manufacturer || "empty"}`,
    );
    // const responses = await Promise.allSettled([
    //   search(props.navigationId, {
    //     withCmsAssociations: true,
    //     query: {
    //       ...route.query,
    //     },
    //   }),
    // apiClient
    //   .invoke("readBreadcrumb get /breadcrumb/{id}", {
    //     pathParams: {
    //       id: props.navigationId,
    //     },
    //   })
    //   .catch(() => {
    //     console.error("Error while fetching breadcrumbs");
    //   }),
    //]);

    // for (const response of responses) {
    //   if (response.status === "rejected") {
    //     console.error("[FrontendNavigationPage.vue]", response.reason.message);
    //     errorDetails.value = response.reason.message;
    //   }
    // }

    const categoryResponse1 = await search(props.navigationId, {
      withCmsAssociations: true,
      query: {
        ...route.query,
      },
    });

    return {
      category: categoryResponse1 ?? null,
      // breadcrumbs:
      //   responses[1].status === "fulfilled" ? responses[1].value : null,
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
