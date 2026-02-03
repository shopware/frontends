<script
  setup
  lang="ts"
  generic="
    ListingFilter extends {
      code: string;
      label: string;
    }
  "
>
import { computed, ref } from "vue";
import type { Schemas } from "#shopware";

const emits =
  defineEmits<
    (e: "select-value", value: { code: string; value: unknown }) => void
  >();

const {
  filter,
  selectedFilters,
  displayMode = "accordion",
} = defineProps<{
  filter: ListingFilter;
  selectedFilters: Schemas["ProductListingResult"]["currentFilters"];
  displayMode?: "accordion" | "dropdown";
}>();
const isHoverActive = ref(false);
const hoveredIndex = ref(0);
const displayedScore = computed(() =>
  isHoverActive.value ? hoveredIndex.value : selectedFilters?.rating || 0,
);

const hoverRating = (key: number) => {
  hoveredIndex.value = key;
  isHoverActive.value = true;
};
const onChangeRating = () => {
  const newValue =
    selectedFilters?.rating !== hoveredIndex.value
      ? hoveredIndex.value
      : undefined;
  emits("select-value", { code: filter?.code, value: newValue });
};

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};
</script>

<template>
  <div class="self-stretch flex flex-col justify-start items-start gap-4">
    <!-- Accordion header (only in accordion mode) -->
    <template v-if="displayMode === 'accordion'">
      <div class="self-stretch flex flex-col justify-center items-center">
        <div
          class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer"
          @click="toggle"
          role="button"
          tabindex="0"
          :aria-expanded="isFilterVisible"
          :aria-controls="`filter-rating`"
          @keydown.enter="toggle"
          @keydown.space.prevent="toggle"
        >
          <div class="flex-1 flex items-center gap-2.5">
            <div class="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">
              {{ filter.label }}
            </div>
          </div>
          <span
            class="flex items-center justify-center"
            aria-hidden="true"
          >
            <SwChevronIcon :direction="isFilterVisible ? 'up' : 'down'" :size="24" />
          </span>
        </div>
      </div>
    </template>

    <!-- Filter content -->
    <transition name="filter-collapse">
      <div v-if="isFilterVisible || displayMode === 'dropdown'" class="self-stretch flex flex-col justify-start items-start gap-4">
        <div class="flex flex-row items-center gap-2 mt-2">
          <div
            v-for="i in 5"
            :key="i"
            :class="['h-6 w-6 cursor-pointer', displayedScore >= i ? 'i-carbon-star-filled' : 'i-carbon-star']"
            @mouseleave="isHoverActive = false"
            @click="hoverRating(i); onChangeRating()"
            @mouseover="hoverRating(i)"
            :aria-label="`${i} star${i !== 1 ? 's' : ''}`"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
