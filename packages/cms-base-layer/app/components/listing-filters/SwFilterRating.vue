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
import ChevronDownIcon from "@cms-assets/chevron-down-xs.svg";
import ChevronUpIcon from "@cms-assets/chevron-up-xs.svg";
import StarEmptyIcon from "@cms-assets/star-empty.svg";
import StarFilledIcon from "@cms-assets/star-filled.svg";
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
    <div data-icon="true" data-level="1" data-state="Default" class="self-stretch flex flex-col justify-start items-start">
      <button
        @click="toggle"
        :aria-expanded="isFilterVisible"
        :aria-controls="`filter-${props.filter.code}`"
        class="self-stretch py-3 border-b border-outline-outline-variant flex justify-between items-center gap-1 bg-transparent w-full cursor-pointer focus:outline-none"
      >
        <div class="text-surface-on-surface text-base font-bold font-['Inter'] leading-normal text-left">
          {{ props.filter.label }}
        </div>
        <img v-if="!isFilterVisible" :src="ChevronDownIcon" alt="Expand filter" class="w-6 h-6" />
        <img v-else :src="ChevronUpIcon" alt="Collapse filter" class="w-6 h-6" />
      </button>
    </div>
    <Transition name="fade">
      <div
        v-if="isFilterVisible"
        :id="`filter-${props.filter.code}`"
        :aria-hidden="!isFilterVisible"
        class="self-stretch flex flex-col justify-start items-start gap-4"
      >
      <div class="flex flex-row items-center gap-2 mt-2">
        <img
          v-for="i in 5"
          :key="i"
          class="h-6 w-6 cursor-pointer"
          :src="displayedScore >= i ? StarFilledIcon : StarEmptyIcon"
          @mouseleave="isHoverActive = false"
          @click="hoverRating(i); onChangeRating()"
          @mouseover="hoverRating(i)"
          alt=""
        />
      </div>
      </div>
    </Transition>
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
</style>
