<script setup lang="ts">
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import { useCategory, useNavigation } from "#imports";
import type { Schemas } from "#shopware";

const { category: activeCategory } = useCategory();
const loading: Ref<boolean> = ref(true);
const flagAllowSubcategories: boolean = true; // could be passed maybe as a prop in the future
const categoryNavigation: Ref<Schemas["Category"][]> = ref([]);

const currentCategoryId = activeCategory.value?.id ?? "main-navigation";
const type = flagAllowSubcategories ? currentCategoryId : "main-navigation";
const { loadNavigationElements } = useNavigation({
  type: type,
});
const removeChildrenIfNotActiveCategory = () => {
  const navigation: Schemas["Category"][] = JSON.parse(
    JSON.stringify(categoryNavigation.value),
  );
  return navigation?.map((navigationElement) => {
    navigationElement.children =
      activeCategory.value?.id === navigationElement.id
        ? navigationElement.children
        : [];
    return navigationElement;
  });
};

onMounted(async () => {
  // depth 0 means, we load only first level of categories, depth 1 means we load first and second level of categories ...
  const depth = flagAllowSubcategories ? 2 : 1;
  categoryNavigation.value = await loadNavigationElements({ depth });
  if (!flagAllowSubcategories) {
    categoryNavigation.value = removeChildrenIfNotActiveCategory();
  }
  loading.value = false;
});
</script>
<template>
  <ClientOnly>
    <div v-if="!loading && categoryNavigation && categoryNavigation.length" class="self-stretch inline-flex flex-col justify-start items-start gap-3">
      <SwCategoryNavigation
        :level="0"
        :elements="categoryNavigation"
        :active-category="activeCategory"
      />
    </div>
    <div v-else-if="loading" class="self-stretch flex flex-col justify-start items-start gap-4 animate-pulse">
      <div v-for="i in 3" :key="i" class="w-full h-12 bg-surface-surface-container rounded"></div>
    </div>
  </ClientOnly>
</template>
