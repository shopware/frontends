<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  getCategoryUrl,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import { Category, StoreNavigationElement } from "@shopware-pwa/types";

const props = withDefaults(
  defineProps<{
    activeCategory: Category;
    elements: StoreNavigationElement[];
    level: number;
  }>(),
  {
    level: 0,
  }
);

function getHighlightCategory(navigationElement: Category) {
  return (
    (props.activeCategory?.path || "").includes(navigationElement.id) ||
    navigationElement.id === props.activeCategory?.id
  );
}
</script>
<template>
  <ul v-if="props.elements?.length" class="list-none m-0 px-5 space-y-2">
    <li
      v-for="(navigationElement, index) in props.elements"
      :key="index"
      :class="{
        'border-b border-gray-200': props.level === 0,
      }"
    >
      <RouterLink
        :to="getCategoryUrl(navigationElement)"
        class="flex items-center py-2 px-5 text-base rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="[
          getHighlightCategory(navigationElement) ? 'font-bold' : 'font-normal',
          navigationElement.id === props.activeCategory?.id
            ? 'text-indigo-600'
            : 'text-gray-900',
        ]"
      >
        <span>{{ getTranslatedProperty(navigationElement, "name") }}</span>
      </RouterLink>
      <SwCategoryNavigation
        v-if="navigationElement.children"
        :elements="navigationElement.children"
        :activeCategory="props.activeCategory"
        :level="props.level + 1"
      />
    </li>
  </ul>
</template>
