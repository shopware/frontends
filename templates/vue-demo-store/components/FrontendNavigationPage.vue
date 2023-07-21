<script setup lang="ts">
import { Category } from "@shopware-pwa/types";
import { useCategorySearch } from "@shopware-pwa/composables-next";
import { Ref } from "vue";
// import { getCategoryBreadcrumbs } from "@shopware-pwa/helpers-next";
import { useCmsHead } from "@/composables/useCmsHead";

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

const getCategoryBreadcrumbs = (
  category: Category | null | undefined,
  options?: {
    /**
     * Start at specific index if your navigation
     * contains root names which should not be visible.
     */
    startIndex?: number;
  }
) => {
  const breadcrumbs =
    category?.translated?.breadcrumb || category?.breadcrumb || [];
  const startIndex = options?.startIndex || 0;
  if (breadcrumbs.length <= startIndex) return [];
  return breadcrumbs.slice(startIndex).map((element, index) => {
    if (category?.seoUrls?.[0]?.seoPathInfo) {
      return {
        name: element,
        path: '/' + category?.seoUrls?.[0]?.seoPathInfo.split('/').slice(0, index + 1).join('/') + '/'
      };
    }
    return {
      name: element,
    };
  });
}

const breadcrumbs = getCategoryBreadcrumbs(categoryResponse.value, {
  startIndex: 2,
});
useBreadcrumbs(breadcrumbs);

const { category } = useCategory(categoryResponse as Ref<Category>);
useCmsHead(category, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>

<template>
  <CmsPage v-if="category?.cmsPage" :content="category.cmsPage" />
</template>
