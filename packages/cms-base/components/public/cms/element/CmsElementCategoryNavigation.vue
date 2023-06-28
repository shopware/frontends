<script setup lang="ts">
import { ClientApiError } from "@shopware-pwa/types";
import SwCategoryNavigation from "../../../SwCategoryNavigation.vue";
import { Category } from "@shopware-pwa/types";
import deepMerge from "../../../../helpers/deepMerge";
import getTranslations from "../../../../helpers/getTranslations";

type Translations = {
  listing: {
    category: string;
    categories: string;
  };
};

let translations: Translations = {
  listing: {
    category: "Category",
    categories: "Categories",
  },
};

const globalTranslations = getTranslations();
translations = deepMerge(translations, globalTranslations) as Translations;

const { category: activeCategory } = useCategory();
const { loadNavigationElements, navigationElements } = useNavigation();
const navigations = computed(() => {
  const navigation: Category[] = JSON.parse(
    JSON.stringify(navigationElements.value)
  );
  return navigation?.map((navigationElement) => {
    navigationElement.children =
      activeCategory.value?.id === navigationElement.id
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
    class="cms-element-category-navigation max-w-screen-xl mx-auto"
  >
    <h2
      v-if="navigations.length > 0"
      class="text-3xl font-bold tracking-tight text-gray-900 m-0 px-5"
    >
      {{
        navigations.length > 1
          ? translations.listing.categories
          : translations.listing.category
      }}
    </h2>
    <SwCategoryNavigation
      :level="0"
      :elements="navigations"
      :activeCategory="activeCategory"
    />
  </div>
</template>
