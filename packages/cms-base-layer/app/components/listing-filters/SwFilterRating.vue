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

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: Schemas["ProductListingResult"]["currentFilters"];
}>();
const isHoverActive = ref(false);
const hoveredIndex = ref(0);
const displayedScore = computed(() =>
  isHoverActive.value ? hoveredIndex.value : props.selectedFilters?.rating || 0,
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
</script>

<template>
  <div class="self-stretch flex flex-col justify-start items-start gap-4">
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
            {{ props.filter.label }}
          </div>
        </div>
        <SwIconButton 
          type="ghost" 
          :aria-label="isFilterVisible ? 'Collapse filter' : 'Expand filter'"
          tabindex="-1"
        >
          <SwChevronIcon :direction="isFilterVisible ? 'up' : 'down'" :size="24" />
        </SwIconButton>
      </div>
    </div>
    <transition name="filter-collapse">
      <div v-if="isFilterVisible" class="self-stretch flex flex-col justify-start items-start gap-4">
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
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Smooth collapse/expand for filter options */
.filter-collapse-enter-active,
.filter-collapse-leave-active {
  transition: max-height 240ms ease, opacity 200ms ease;
  overflow: hidden;
}
.filter-collapse-enter-from,
.filter-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.filter-collapse-enter-to,
.filter-collapse-leave-from {
  max-height: 800px; /* large enough to contain options */
  opacity: 1;
}
</style>
