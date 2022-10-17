<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();

const props = defineProps<{
  filter: ListingFilter;
}>();

const { getCurrentFilters } = useListing({
  listingType: "productSearchListing",
});

const isHoverActive = ref(false);
const hoveredIndex = ref(0);
const displayedScore = computed(() =>
  isHoverActive.value
    ? hoveredIndex.value
    : getCurrentFilters.value?.rating || 0
);

const hoverRating = (key: number) => {
  hoveredIndex.value = key;
  isHoverActive.value = true;
};

const onChangeRating = () => {
  const newValue =
    getCurrentFilters.value?.rating !== hoveredIndex.value
      ? hoveredIndex.value
      : undefined;
  emits("select-value", { code: props.filter?.code, value: newValue });
};

const isOpen = ref<boolean>(false);

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => (isOpen.value = false));
</script>

<template>
  <div ref="dropdownElement" class="relative">
    <button
      type="button"
      class="border-2 border-gray-300 px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500 rounded"
      @click="isOpen = !isOpen"
    >
      <span class="font-medium text-gray-900">{{ filter.label }}</span>
      <span class="ml-6 flex items-center">
        <svg
          v-show="!isOpen"
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
        <svg
          v-show="isOpen"
          class="h-5 w-5"
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
    <div
      :class="[
        `absolute bg-white mt-1 border-2 rounded border-gray-300 p-3 z-1000`,
        { hidden: !isOpen },
      ]"
    >
      <div class="flex">
        <IconsStart
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
</template>
