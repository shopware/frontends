<script setup lang="ts">
import { Category } from "@shopware-pwa/types";
import { useCategorySearch } from "@shopware-pwa/composables-next";
import { Ref } from "vue";
import { getCategoryBreadcrumbs } from "@shopware-pwa/helpers-next";
import { useCmsHead } from "@/composables/useCmsHead";
import {
  UseNavigationReturn,
  useBreadcrumbsMainNavigation,
} from "@shopware-pwa/composables-next";

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

const mainNavigation = inject(
  "swNavigation-main-navigation"
) as ComputedRef<UseNavigationReturn>;

const breadcrumbs = getCategoryBreadcrumbs(categoryResponse.value, {
  startIndex: 2,
});
useBreadcrumbsMainNavigation(mainNavigation, breadcrumbs);

const { category } = useCategory(categoryResponse as Ref<Category>);
useCmsHead(category, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
</template>
