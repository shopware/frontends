<script setup lang="ts">
import { ref } from "vue";
import type { Schemas } from "#shopware";

const {
  activeCategory,
  elements,
  level = 0,
} = defineProps<{
  activeCategory: Schemas["Category"];
  elements: Schemas["Category"][];
  level: number;
}>();

const expandedItems = ref<Set<string>>(new Set());

function isActive(navigationElement: Schemas["Category"]) {
  return navigationElement.id === activeCategory?.id;
}

function toggleExpanded(id: string) {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
}

function isExpanded(id: string) {
  return expandedItems.value.has(id);
}
</script>
<template>
  <div
    v-if="elements?.length"
    class="self-stretch flex flex-col justify-start items-start gap-4"
  >
    <div
      v-for="(navigationElement, index) in elements"
      :key="index"
      class="w-full"
    >
      <SwCategoryNavigationLink
        :navigation-element="navigationElement"
        :is-active="isActive(navigationElement)"
        :is-expanded="isExpanded(navigationElement.id)"
        :level="level"
        @toggle="toggleExpanded(navigationElement.id)"
      />
      <transition name="filter-collapse">
        <div
          v-if="navigationElement.children && isExpanded(navigationElement.id)"
          class="self-stretch flex flex-col justify-start items-start"
        >
          <SwCategoryNavigation
            :elements="navigationElement.children"
            :active-category="activeCategory"
            :level="level + 1"
          />
        </div>
      </transition>
    </div>
  </div>
</template>
<style scoped>
.filter-collapse-enter-active,
.filter-collapse-leave-active {
  transition:
    max-height 240ms ease,
    opacity 200ms ease;
  overflow: hidden;
}
.filter-collapse-enter-from,
.filter-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.filter-collapse-enter-to,
.filter-collapse-leave-from {
  max-height: 800px;
  opacity: 1;
}
</style>
