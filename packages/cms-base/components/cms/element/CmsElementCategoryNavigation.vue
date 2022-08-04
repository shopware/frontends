<script setup lang="ts">
import {
  CmsCategoryPageResponse,
  Category,
  ClientApiError,
} from "@shopware-pwa/types";

const { cmsContent } = useCms();
const { loadNavigationElements, navigationElements } = useNavigation();
const activeCategory = computed<Category>(
  () => (cmsContent.value as CmsCategoryPageResponse).category
);
const navigations = computed(() => {
  return navigationElements.value?.map((navigationElement) => {
    navigationElement.children = (activeCategory.value?.path ?? "").includes(
      navigationElement.id
    )
      ? navigationElement.children
      : [];
    return navigationElement;
  });
});

onMounted(async () => {
  try {
    await loadNavigationElements({ depth: 2 });
  } catch (e) {
    const err = e as ClientApiError;
    console.error("[SwBottomMenu]", err.messages);
  }
});
</script>
<template>
  <div
    v-if="navigations && navigations.length"
    class="cms-element-category-navigation"
  >
    <SwCategoryNavigation
      :level="0"
      :elements="navigations"
      :activeCategory="activeCategory"
    />
  </div>
</template>
