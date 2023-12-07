<script setup lang="ts">
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
if (categoryResponse.value) {
  const breadcrumbs = getCategoryBreadcrumbs(categoryResponse.value, {
    startIndex: 2,
  });
  useBreadcrumbs(breadcrumbs);
}

const { category } = useCategory(categoryResponse as Ref<Schemas["Category"]>);
useCmsHead(category, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <LayoutBreadcrumbs v-if="route.path != '/'" />
  <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
</template>
