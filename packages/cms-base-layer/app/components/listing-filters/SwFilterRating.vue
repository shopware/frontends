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
  <div class="self-stretch flex flex-col justify-start items-start gap-3">
    <div data-icon="true" data-level="1" data-state="Default" class="self-stretch flex flex-col justify-center items-center">
      <div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1">
        <div class="flex-1 flex justify-start items-center gap-2.5">
          <div class="flex-1 justify-start text-surface-on-surface text-base font-bold font-['Inter'] leading-normal">
            {{ props.filter.label }}
          </div>
        </div>
        <div class="w-6 h-6 relative">
          <button @click="toggle" class="w-full h-full flex items-center justify-center focus:outline-none bg-transparent">
            <span v-if="!isFilterVisible" class="i-carbon-chevron-down w-5 h-5"></span>
            <span v-else class="i-carbon-chevron-up w-5 h-5"></span>
          </button>
        </div>
      </div>
    </div>
    <div v-show="isFilterVisible" class="self-stretch flex flex-col justify-start items-start gap-4">
      <div class="flex flex-row items-center gap-2 mt-2">
        <div
          v-for="i in 5"
          :key="i"
          class="h-6 w-6 cursor-pointer"
          :class="{
            'i-carbon-star-filled text-yellow-500': displayedScore >= i,
            'i-carbon-star text-gray-300': displayedScore < i,
          }"
          @mouseleave="isHoverActive = false"
          @click="hoverRating(i); onChangeRating()"
          @mouseover="hoverRating(i)"
        />
      </div>
    </div>
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
}
</style>
