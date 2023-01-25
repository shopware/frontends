<script setup lang="ts">
import {
  EntitiesAggregation,
  AggregationFilterEntity,
  PriceAggregation,
  MaxAggregation,
  ListingFilter,
} from "@shopware-pwa/types";
import { computed, ref } from "vue";

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
  <div ref="dropdownElement" class="filter-content">
    <h3 class="-mx-2 -my-3 flow-root">
      <button
        type="button"
        class="border-1 border-gray-500 px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500 rounded"
        @click="toggle"
      >
        <span class="font-medium text-gray-900">{{ filter.label }}</span>
        <span class="ml-6 flex items-center">
          <div
            class="h-5 w-5"
            :class="[
              !isFilterVisible
                ? 'i-carbon-chevron-down'
                : 'i-carbon-chevron-up',
            ]"
          />
        </span>
      </button>
    </h3>
    <div :class="[`absolute pt-6 z-1000`, { hidden: !isFilterVisible }]">
      <div class="space-y-6">
        <div class="flex">
          <div
            v-for="i in 5"
            :key="i"
            class="h-6 w-6 c-yellow-500"
            :class="{
              'i-carbon-star-filled': displayedScore >= i,
              'i-carbon-star': displayedScore < i,
            }"
            @mouseleave="isHoverActive = false"
            @click="onChangeRating()"
            @mouseover="hoverRating(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
