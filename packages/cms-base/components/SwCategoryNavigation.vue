<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  getCategoryRoute,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import getUrlPrefix from "../helpers/getUrlPrefix";
import buildUrlPrefix from "../helpers/buildUrlPrefix";
import type { Schemas } from "#shopware";

const props = withDefaults(
  defineProps<{
    activeCategory: Schemas["Category"];
    elements: Schemas["Category"][];
    level: number;
  }>(),
  {
    level: 0,
  },
);

function getHighlightCategory(navigationElement: Schemas["Category"]) {
  return (
    (props.activeCategory?.path || "").includes(navigationElement.id) ||
    navigationElement.id === props.activeCategory?.id
  );
}

const urlPrefix = getUrlPrefix();
</script>
<template>
  <ul v-if="props.elements?.length" class="list-none m-0 px-5">
    <li
      v-for="(navigationElement, index) in props.elements"
      :key="index"
      :class="{
        'border-b border-gray-200': props.level === 0,
      }"
    >
      <RouterLink
        :to="buildUrlPrefix(getCategoryRoute(navigationElement), urlPrefix)"
        class="flex items-center py-2 px-5 text-base rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 my-2"
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
