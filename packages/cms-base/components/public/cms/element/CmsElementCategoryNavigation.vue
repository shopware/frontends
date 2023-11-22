<script setup lang="ts">
import type { Ref } from "vue";
import type { ClientApiError } from "@shopware-pwa/types";
import SwCategoryNavigation from "../../../SwCategoryNavigation.vue";
import type { Category } from "@shopware-pwa/types";
import deepMerge from "../../../../helpers/deepMerge";
import getTranslations from "../../../../helpers/getTranslations";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

type Translations = {
  listing: {
    category: string;
    subCategory: string;
    subCategoryOf: string;
    loading: string;
    categories: string;
    subCategories: string;
  };
};

let translations: Translations = {
  listing: {
    category: "Category",
    subCategory: "Sub-category",
    subCategoryOf: "of",
    loading: "Loading ...",
    categories: "Categories",
    subCategories: "Sub-categories",
  },
};

const globalTranslations = getTranslations();
translations = deepMerge(translations, globalTranslations) as Translations;

const { category: activeCategory } = useCategory();
const loading: Ref<boolean> = ref(true);
const useSubCategories: Ref<boolean> = ref(true); // could be passed maybe as a prop in the future
const categoryNavigation: Ref<Category[] | null> = ref([]);

const currentCategoryId = activeCategory.value?.id ?? "main-navigation";
const type = useSubCategories.value ? currentCategoryId : "main-navigation";
const { loadNavigationElements: loadMainNavigationElements } = useNavigation({
  type: type,
});
const cmsCategoryNavigation = async (depth: number) => {
  return loadMainNavigationElements({ depth: depth });
};

const loadCategories = async (depth: number) => {
  try {
    categoryNavigation.value = (await cmsCategoryNavigation(depth)) ?? [];
  } catch (e) {
    const err = e as ClientApiError;
    console.error("[CmsElementCategoryNavigation]", err.messages);
  }
};

const removeChildrenIfNotActiveCategory = () => {
  const navigation: Category[] = JSON.parse(
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
  const depth = useSubCategories.value ? 0 : 1;
  await loadCategories(depth);
  if (!useSubCategories.value) {
    categoryNavigation.value = removeChildrenIfNotActiveCategory();
  }
  loading.value = false;
});
</script>
<template>
  <div
    v-if="categoryNavigation && categoryNavigation.length"
    class="cms-element-category-navigation max-w-screen-xl mx-auto"
  >
    <h2
      v-if="categoryNavigation.length > 0 && !useSubCategories"
      class="text-3xl font-bold tracking-tight text-gray-900 m-0 px-5"
    >
      {{
        categoryNavigation.length > 1
          ? translations.listing.categories
          : translations.listing.category
      }}
    </h2>
    <h2
      v-if="categoryNavigation.length > 0 && useSubCategories"
      class="text-3xl font-bold tracking-tight text-gray-900 m-0 px-5"
    >
      {{
        categoryNavigation.length > 1
          ? translations.listing.subCategories
          : translations.listing.subCategory
      }}
      {{ translations.listing.subCategoryOf }}
      {{ getTranslatedProperty(activeCategory, "name") }}
    </h2>
    <SwCategoryNavigation
      :level="0"
      :elements="categoryNavigation"
      :activeCategory="activeCategory"
    />
  </div>
  <div v-if="loading">
    <div class="px-5">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 m-0 px-5">
        {{ translations.listing.loading }}
      </h2>
      <div
        class="border border-gray-200 shadow rounded-md p-4 max-w-screen-xl mx-auto"
      >
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-6 py-1">
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                <div class="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div class="h-2 bg-gray-200 rounded"></div>
            </div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                <div class="h-2 bg-slate-200 rounded col-span-2"></div>
              </div>
              <div class="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-6 py-4">
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                <div class="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div class="h-2 bg-gray-200 rounded"></div>
            </div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                <div class="h-2 bg-slate-200 rounded col-span-2"></div>
              </div>
              <div class="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-6 pt-4">
            <div class="space-y-3">
              <div class="grid grid-cols-6 gap-4">
                <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                <div class="h-2 bg-slate-200 rounded col-span-5"></div>
              </div>
              <div class="h-2 bg-gray-200 rounded"></div>
            </div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                <div class="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div class="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
