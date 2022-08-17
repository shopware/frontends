<script setup lang="ts">
import {
  EntitiesAggregation,
  AggregationFilterEntity,
  PriceAggregation,
  MaxAggregation,
  ListingFilter,
} from "@shopware-pwa/types";
import { computed, ref } from "vue";
import SwStarIcon from "../SwStarIcon.vue";
const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    [key: string]:
      | EntitiesAggregation<AggregationFilterEntity>
      | PriceAggregation
      | MaxAggregation
      | number;
  };
}>();
const isHoverActive = ref(false);
const hoveredIndex = ref(0);
const displayedScore = computed(() =>
  isHoverActive.value ? hoveredIndex.value : props.selectedFilters?.rating || 0
);

const hoverRating = (key: number) => {
  hoveredIndex.value = key;
  isHoverActive.value = true;
};
const onChangeRating = () => {
  const newValue =
    props.selectedFilters?.rating !== hoveredIndex.value
      ? hoveredIndex.value
      : undefined;
  emits("select-value", { code: props.filter?.code, value: newValue });
};

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => (isFilterVisible.value = false));
</script>

<template>
  <div class="filter-content" ref="dropdownElement">
    <h3 class="-mx-2 -my-3 flow-root">
      <button
        type="button"
        class="border-1 border-gray-500 px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500 rounded"
        @click="toggle"
      >
        <span class="font-medium text-gray-900">{{ filter.label }}</span>
        <span class="ml-6 flex items-center">
          <svg
            :class="['h-5 w-5', { hidden: isFilterVisible }]"
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
          <svg
            :class="['h-5 w-5', { hidden: !isFilterVisible }]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
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
    <div :class="[`absolute pt-6 z-1000`, { hidden: !isFilterVisible }]">
      <div class="space-y-6">
        <div class="flex">
          <SwStarIcon
            v-for="i in 5"
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
