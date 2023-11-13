<script setup lang="ts">
import type { Category } from "@shopware-pwa/types";
import { useCategorySearch } from "#imports";
import type { Ref } from "vue";
import { getCategoryBreadcrumbs } from "@shopware-pwa/helpers-next";
import { useCmsHead } from "@/composables/useCmsHead";
import type { Schemas } from "#shopware";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useCategorySearch();
const route = useRoute();

const { data: categoryResponse } = await useAsyncData(
  "cmsNavigation" + props.navigationId,
  async () => {
    const category = await search(props.navigationId, {
      withCmsAssociations: true,
      query: {
        ...route.query,
      },
    });
    return category;
  },
);

const breadcrumbs = getCategoryBreadcrumbs(
  categoryResponse.value as unknown as Schemas["Category"], // TODO: [OpenAPI][Category] - category needs to be defined properly
  {
    startIndex: 2,
  },
);
useBreadcrumbs(breadcrumbs);

const { category } = useCategory(categoryResponse as Ref<Category>);
useCmsHead(category, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <LayoutBreadcrumbs />
  <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
</template>
