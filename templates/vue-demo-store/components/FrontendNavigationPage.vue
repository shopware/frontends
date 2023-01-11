<script setup lang="ts">
import { Category, ShopwareSearchParams } from "@shopware-pwa/types";
import { useCategorySearch } from "@shopware-pwa/composables-next";
import { Ref } from "vue";

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
  }
);
const { category } = useCategory(categoryResponse as Ref<Category>);
</script>

<template>
  <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
</template>
