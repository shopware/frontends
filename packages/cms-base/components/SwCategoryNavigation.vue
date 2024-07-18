<script setup lang="ts">
import type { Schemas } from "#shopware";
import SwCategoryNavigationLink from "./SwCategoryNavigationLink.vue";

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
      <SwCategoryNavigationLink
        :navigation-element="navigationElement"
        :is-highlighted="getHighlightCategory(navigationElement)"
        :is-active="navigationElement.id === props.activeCategory?.id"
      />
      <SwCategoryNavigation
        v-if="navigationElement.children"
        :elements="navigationElement.children"
        :active-category="props.activeCategory"
        :level="props.level + 1"
      />
    </li>
  </ul>
</template>
