<script setup lang="ts">
import SwStarIcon from "../SwStarIcon.vue";
const $emits = defineEmits("select-value");
const $props = defineProps(["filter", "selectedFilters"]);
const isFilterVisible = ref(false);
const isHoverActive = ref(false);
const hoveredIndex = ref(0);
const displayedScore = computed(() =>
  isHoverActive.value ? hoveredIndex.value : $props.selectedFilters?.rating || 0
);
const hoverRating = (key) => {
  hoveredIndex.value = key;
  isHoverActive.value = true;
};
const onChangeRating = () => {
  const newValue =
    $props.selectedFilters?.rating !== hoveredIndex.value
      ? hoveredIndex.value
      : undefined;
  $emits("select-value", { code: $props.filter?.code, value: newValue });
};
</script>

<template>
  <div class="filter-content">
    <h3 class="-mx-2 -my-3 flow-root">
      <!-- Expand/collapse section button -->
      <button
        type="button"
        class="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500"
        aria-controls="filter-section-mobile-0"
        aria-expanded="false"
        @click="isFilterVisible = !isFilterVisible"
      >
        <span class="font-medium text-gray-900">{{ filter.label }}</span>
        <span class="ml-6 flex items-center">
          <!--
          Expand icon, show/hide based on section open state.

          Heroicon name: solid/plus-sm
        -->
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <!--
          Collapse icon, show/hide based on section open state.

          Heroicon name: solid/minus-sm
        -->
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
    </h3>
    <!-- Filter section, show/hide based on section state. -->
    <div v-show="isFilterVisible" id="filter-section-mobile-0" class="pt-6">
      <div class="space-y-6">
        <div class="flex">
          <SwStarIcon
            v-for="i in filter.max || 5"
            :key="i"
            :is-empty="i > displayedScore"
            @mouseleave="isHoverActive = false"
            @click="onChangeRating()"
            @mouseover="hoverRating(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
